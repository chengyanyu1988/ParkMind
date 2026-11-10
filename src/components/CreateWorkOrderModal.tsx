import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Send, 
  Layers, 
  Building2, 
  User, 
  AlertCircle 
} from 'lucide-react';
import { 
  WorkOrderItem, 
  WorkOrderType, 
  WorkOrderPriority, 
  SubsystemType 
} from '../types/ibms';

interface CreateWorkOrderModalProps {
  initialData?: Partial<WorkOrderItem> | null;
  onClose: () => void;
  onSubmit: (newOrder: WorkOrderItem) => void;
}

export const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({
  initialData,
  onClose,
  onSubmit
}) => {
  const defaultSubsystem: SubsystemType = (initialData?.subsystem as SubsystemType) || '暖通空调';
  const defaultType: WorkOrderType = (initialData?.type as WorkOrderType) || '故障报修';
  const defaultPriority: WorkOrderPriority = (initialData?.priority as WorkOrderPriority) || '普通';

  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [type, setType] = useState<WorkOrderType>(defaultType);
  const [subsystem, setSubsystem] = useState<SubsystemType>(defaultSubsystem);
  const [deviceCode, setDeviceCode] = useState<string>(initialData?.deviceCode || '');
  const [deviceName, setDeviceName] = useState<string>(initialData?.deviceName || '');
  const [location, setLocation] = useState<string>(initialData?.location || 'A座研发大楼 3层');
  const [priority, setPriority] = useState<WorkOrderPriority>(defaultPriority);
  const [assignee, setAssignee] = useState<string>(initialData?.assignee || '张海波 (暖通工程师)');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const subsystems: SubsystemType[] = [
    '暖通空调',
    '给排水',
    '变配电',
    '智能照明',
    '安防监控',
    '消防安全',
    '电梯监控'
  ];

  const engineers = [
    '张海波 (暖通工程师)',
    '李永强 (消防安全主管)',
    '王振华 (供配电工程师)',
    '刘建国 (给排水运维组)',
    '孙立新 (机电综合维修)',
    '陈敏 (安防技术值班)',
    '日立维保驻场组'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('请填写工单标题');
      return;
    }
    if (!deviceName.trim()) {
      setErrorMsg('请填写报修设备名称');
      return;
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const codeRand = Math.floor(100 + Math.random() * 900);
    const newCode = `WO-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${codeRand}`;

    const newOrder: WorkOrderItem = {
      id: `wo-${Date.now()}`,
      code: newCode,
      title: title.trim(),
      type: type,
      subsystem: subsystem,
      deviceCode: deviceCode.trim() || 'DEV-MANUAL-01',
      deviceName: deviceName.trim(),
      location: location.trim(),
      priority: priority,
      reporter: '陈工 (IBMS综合调度台)',
      reportTime: timeStr,
      assignee: assignee,
      status: '待接单',
      description: description.trim() || '设备巡检/用户报修异常，请现场工程师尽快核查处置。'
    };

    onSubmit(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-blue-400" />
            <span className="text-base font-bold text-white">派发运维维修工单</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              工单标题 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：A座3F冷水机组二通调节阀卡死故障检修"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                工单类型
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkOrderType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="故障报修">故障报修</option>
                <option value="告警派单">告警派单</option>
                <option value="巡检异常">巡检异常</option>
                <option value="例行保养">例行保养</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                所属系统
              </label>
              <select
                value={subsystem}
                onChange={(e) => setSubsystem(e.target.value as SubsystemType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {subsystems.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                报修设备编号
              </label>
              <input
                type="text"
                value={deviceCode}
                onChange={(e) => setDeviceCode(e.target.value)}
                placeholder="例如：AHU-A-0301"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                设备名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="例如：3F组合式空调处理机组"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              空间安装位置
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例如：A座研发大楼 3层 东南空调机房"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                工单优先级
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['特急', '紧急', '普通'] as WorkOrderPriority[]).map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      priority === p
                        ? p === '特急' ? 'bg-red-600 text-white border-red-500'
                          : p === '紧急' ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                指派责任工程师 / 班组
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {engineers.map(eng => (
                  <option key={eng} value={eng}>{eng}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              故障具体现象与处置要求
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请详细描述现场异常现象、已尝试的排查措施或需携带的备件..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer inside form */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-600/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>立即派发工单</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
