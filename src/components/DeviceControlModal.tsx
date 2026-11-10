import React, { useState } from 'react';
import { 
  X, 
  Power, 
  Sliders, 
  CheckCircle, 
  AlertTriangle, 
  Thermometer, 
  Gauge, 
  Zap, 
  Clock, 
  FileText, 
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { DeviceItem, ControlModeType } from '../types/ibms';

interface DeviceControlModalProps {
  device: DeviceItem | null;
  onClose: () => void;
  onUpdateDevice: (updated: DeviceItem, actionLogMsg: string) => void;
  onCreateWorkOrderFromDevice: (device: DeviceItem) => void;
}

export const DeviceControlModal: React.FC<DeviceControlModalProps> = ({
  device,
  onClose,
  onUpdateDevice,
  onCreateWorkOrderFromDevice
}) => {
  if (!device) return null;

  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(device.telemetry.switchOn ?? (device.status === '运行'));
  const [targetTemp, setTargetTemp] = useState<number>(device.telemetry.targetTemp ?? 24.0);
  const [valveOpening, setValveOpening] = useState<number>(device.telemetry.valveOpening ?? 50);
  const [brightness, setBrightness] = useState<number>(device.telemetry.brightness ?? 80);
  const [controlMode, setControlMode] = useState<ControlModeType>(device.controlMode);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleApplyChanges = () => {
    setIsApplying(true);
    setSuccessMsg('');

    setTimeout(() => {
      const newStatus = isSwitchOn ? (device.status === '告警' ? '告警' : '运行') : '停机';
      const updated: DeviceItem = {
        ...device,
        status: newStatus,
        controlMode: controlMode,
        telemetry: {
          ...device.telemetry,
          switchOn: isSwitchOn,
          targetTemp: targetTemp,
          valveOpening: valveOpening,
          brightness: brightness,
        }
      };

      const logMsg = `远程下发控制指令: 启停状态[${isSwitchOn ? '开启' : '关闭'}], 控制模式[${controlMode}], 设定值生效`;
      onUpdateDevice(updated, logMsg);
      setIsApplying(false);
      setSuccessMsg('指令已成功下发至现场PLC网关，点位状态已同步！');
      setTimeout(() => {
        setSuccessMsg('');
      }, 2500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              device.status === '运行' ? 'bg-emerald-400 ring-4 ring-emerald-400/20' :
              device.status === '告警' ? 'bg-red-400 ring-4 ring-red-400/20 animate-pulse' :
              'bg-slate-400'
            }`} />
            <div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{device.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {device.code}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {device.building} · {device.location} · {device.subsystem}
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

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Status banner */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {device.status === '告警' && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 animate-pulse" />
                <span>该设备当前存在活动告警事件，请谨慎执行强制启停操作！</span>
              </div>
              <button
                onClick={() => onCreateWorkOrderFromDevice(device)}
                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-medium transition-colors shrink-0 ml-2"
              >
                生成报修工单
              </button>
            </div>
          )}

          {/* Telemetry Cards Grid */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              实时点位遥测参数 (TELEMETRY)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {device.telemetry.temp !== undefined && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Thermometer className="w-3.5 h-3.5 text-blue-400" />
                    <span>实测温度</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {device.telemetry.temp.toFixed(1)} <span className="text-xs font-normal text-slate-400">℃</span>
                  </div>
                </div>
              )}

              {device.telemetry.pressure !== undefined && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>管网压力</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {device.telemetry.pressure.toFixed(2)} <span className="text-xs font-normal text-slate-400">MPa</span>
                  </div>
                </div>
              )}

              {device.telemetry.frequency !== undefined && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>运行频率</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {device.telemetry.frequency.toFixed(1)} <span className="text-xs font-normal text-slate-400">Hz</span>
                  </div>
                </div>
              )}

              {device.telemetry.power !== undefined && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span>瞬时功率</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {device.telemetry.power.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
                  </div>
                </div>
              )}

              {device.telemetry.currentFloor !== undefined && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                    <span>当前轿厢层</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {device.telemetry.currentFloor} <span className="text-xs font-normal text-slate-400">F</span>
                  </div>
                </div>
              )}

              {device.telemetry.runHours !== undefined && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>累计运行</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {device.telemetry.runHours} <span className="text-xs font-normal text-slate-400">h</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Remote Control Panel */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-4">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>远程自控操作指令 (REMOTE CONTROL)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                权限: 工程师及以上已授权
              </span>
            </div>

            {/* Switch ON/OFF toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Power className={`w-5 h-5 ${isSwitchOn ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-sm font-medium text-white">设备主电源 / 运转启停</div>
                  <div className="text-xs text-slate-400">
                    当前指令状态: {isSwitchOn ? '正常通电开启' : '停止断开'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSwitchOn(!isSwitchOn)}
                className={`px-4 py-2 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 ${
                  isSwitchOn 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isSwitchOn ? '已开启 (运行中)' : '已停机 (点击启动)'}</span>
              </button>
            </div>

            {/* Mode selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                自控模式切换
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['自动', '手动', '远程锁定'] as ControlModeType[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setControlMode(mode)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      controlMode === mode
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* If has target temperature */}
            {device.telemetry.targetTemp !== undefined && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span>送风设定目标温度</span>
                  <span className="font-mono text-blue-400 font-bold">{targetTemp.toFixed(1)} ℃</span>
                </div>
                <input
                  type="range"
                  min="18.0"
                  max="28.0"
                  step="0.5"
                  value={targetTemp}
                  onChange={(e) => setTargetTemp(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>18.0℃</span>
                  <span>24.0℃ (推荐舒适区间)</span>
                  <span>28.0℃</span>
                </div>
              </div>
            )}

            {/* If has valveOpening */}
            {device.telemetry.valveOpening !== undefined && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span>冷冻水二通调节阀开度</span>
                  <span className="font-mono text-cyan-400 font-bold">{valveOpening}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={valveOpening}
                  onChange={(e) => setValveOpening(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* If has brightness */}
            {device.telemetry.brightness !== undefined && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span>DALI调光回路输出亮度</span>
                  <span className="font-mono text-amber-400 font-bold">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Metadata & Ledger details */}
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-500">设备型号：</span> {device.model}
            </div>
            <div>
              <span className="text-slate-500">生产厂家：</span> {device.manufacturer}
            </div>
            <div>
              <span className="text-slate-500">投运日期：</span> {device.installDate}
            </div>
            <div>
              <span className="text-slate-500">运维主管：</span> {device.manager}
            </div>
            <div>
              <span className="text-slate-500">上次保养：</span> {device.lastMaintenanceDate}
            </div>
            <div>
              <span className="text-slate-500">下次保养：</span> {device.nextMaintenanceDate}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <button
            onClick={() => onCreateWorkOrderFromDevice(device)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>发起报修</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              关闭
            </button>
            <button
              onClick={handleApplyChanges}
              disabled={isApplying}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {isApplying ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{isApplying ? '下发中...' : '下发控制指令'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
