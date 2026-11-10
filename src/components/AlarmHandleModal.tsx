import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  FileCheck, 
  MapPin, 
  Clock, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { AlarmItem, AlarmStatus } from '../types/ibms';

interface AlarmHandleModalProps {
  alarm: AlarmItem | null;
  onClose: () => void;
  onConfirmStatus: (alarmId: string, newStatus: AlarmStatus, remark: string) => void;
  onConvertToWorkOrder: (alarm: AlarmItem) => void;
  onLocateDevice: (deviceId: string) => void;
}

export const AlarmHandleModal: React.FC<AlarmHandleModalProps> = ({
  alarm,
  onClose,
  onConfirmStatus,
  onConvertToWorkOrder,
  onLocateDevice
}) => {
  if (!alarm) return null;

  const [selectedStatus, setSelectedStatus] = useState<AlarmStatus>(alarm.status);
  const [remark, setRemark] = useState<string>(alarm.remark || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmStatus(alarm.id, selectedStatus, remark);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className={`w-5 h-5 ${
              alarm.level === '紧急' ? 'text-red-400' :
              alarm.level === '重要' ? 'text-amber-400' :
              'text-blue-400'
            }`} />
            <div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>告警事件处置确认</span>
                <span className="text-xs font-mono text-slate-400">{alarm.code}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Card info */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                alarm.level === '紧急' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                alarm.level === '重要' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {alarm.level}告警 · {alarm.subsystem}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{alarm.triggerTime}</span>
              </span>
            </div>

            <div className="text-sm font-semibold text-white">
              {alarm.deviceName} ({alarm.deviceCode})
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {alarm.content}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{alarm.location}</span>
              </div>
              <button
                onClick={() => {
                  onLocateDevice(alarm.deviceId);
                  onClose();
                }}
                className="text-blue-400 hover:text-blue-300 underline font-medium"
              >
                在图形组态中定位 &gt;
              </button>
            </div>
          </div>

          {/* Quick convert to Work Order */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-700/40 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-300">联动故障运维工单</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                自动提取设备编号、位置及故障现象派发给对应机电维修班组
              </div>
            </div>
            <button
              onClick={() => {
                onConvertToWorkOrder(alarm);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-1 transition-colors shrink-0 ml-3"
            >
              <span>一键转工单</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              更新处理状态
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['未确认', '处理中', '已恢复'] as AlarmStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    selectedStatus === status
                      ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Remark Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              处置备注与排查结论
            </label>
            <textarea
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="请输入现场工程师排查结果、消警原因或后续跟踪计划..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/30 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSubmitting ? '保存中...' : '提交处置结论'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
