import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  ChevronDown, 
  Activity, 
  RefreshCw, 
  Maximize, 
  Minimize,
  ShieldCheck,
  Flame,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { MainModule, AlarmItem } from '../types/ibms';

interface HeaderProps {
  currentModule: MainModule;
  onSelectModule: (module: MainModule) => void;
  alarms: AlarmItem[];
  onRefreshData: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onOpenFireAlarmModal?: () => void;
  isFireAlarmActive?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onSelectModule,
  alarms,
  onRefreshData,
  isSimulating,
  onToggleSimulation,
  onOpenFireAlarmModal,
  isFireAlarmActive = true,
  onLogout
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Real-time clock for top right
  const [clockDate, setClockDate] = useState<string>('');
  const [clockTime, setClockTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const date = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const day = days[now.getDay()];

      setClockDate(`${year}-${month}-${date} ${day}`);
      setClockTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshData();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <div className="w-full bg-[#081026] border-b border-[#132c58] select-none z-50">
      {/* Top Main Navigation Bar with Guaranteed 3-Zone Spacing (Never Overlaps) */}
      <div className="h-16 px-3 xl:px-6 flex items-center justify-between gap-2 xl:gap-4 relative bg-gradient-to-r from-[#07132e] via-[#0b1c44] to-[#07132e]">
        
        {/* ================= ZONE 1: LEFT NAV BUTTONS + ALARM BELL ================= */}
        <div className="flex items-center gap-1.5 xl:gap-2.5 shrink-0 z-10">
          {/* Alarm Bell Button with badge 12 */}
          <button 
            onClick={onOpenFireAlarmModal}
            className={`w-9 h-9 rounded-full bg-[#0e234e] border flex items-center justify-center relative hover:border-cyan-400 transition-all ${
              isFireAlarmActive 
                ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse bg-red-950/40' 
                : 'border-[#204996]'
            }`}
            title="实时火警告警中心（点击查看5级消防联动）"
          >
            <Bell className={`w-4 h-4 ${isFireAlarmActive ? 'text-red-400' : 'text-cyan-300'}`} />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold leading-tight border border-red-400 shadow">
              12
            </span>
          </button>

          {/* Left 3 Nav Tabs */}
          <div className="flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => onSelectModule('dashboard')}
              className={`px-3 xl:px-4 py-1.5 rounded-md text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                currentModule === 'dashboard'
                  ? 'bg-gradient-to-r from-[#0f4bb8] to-[#1762e6] text-white shadow-[0_0_15px_rgba(30,105,230,0.6)] border border-[#3b82f6]'
                  : 'bg-[#0a1e48]/70 hover:bg-[#0e2c6c] text-[#86a6d8] hover:text-white border border-[#173874]'
              }`}
            >
              园区首页
            </button>

            <button
              onClick={() => onSelectModule('graphical-control')}
              className={`px-3 xl:px-4 py-1.5 rounded-md text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                currentModule === 'graphical-control'
                  ? 'bg-gradient-to-r from-[#0f4bb8] to-[#1762e6] text-white shadow-[0_0_15px_rgba(30,105,230,0.6)] border border-[#3b82f6]'
                  : 'bg-[#0a1e48]/70 hover:bg-[#0e2c6c] text-[#86a6d8] hover:text-white border border-[#173874]'
              }`}
            >
              图形化控制
            </button>

            <button
              onClick={() => onSelectModule('automation')}
              className={`px-3 xl:px-4 py-1.5 rounded-md text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                currentModule === 'automation'
                  ? 'bg-gradient-to-r from-[#0f4bb8] to-[#1762e6] text-white shadow-[0_0_15px_rgba(30,105,230,0.6)] border border-[#3b82f6]'
                  : 'bg-[#0a1e48]/70 hover:bg-[#0e2c6c] text-[#86a6d8] hover:text-white border border-[#173874]'
              }`}
            >
              设备自控
            </button>
          </div>
        </div>

        {/* ================= ZONE 2: CENTER TITLE (Guaranteed Space, Tech Wings) ================= */}
        <div className="flex flex-col items-center justify-center shrink-0 z-20 px-1 md:px-4">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Left sci-fi tech wing */}
            <div className="hidden md:flex items-center gap-1 opacity-75">
              <div className="w-1.5 h-1.5 rotate-45 border-l border-t border-cyan-400" />
              <div className="w-6 lg:w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-400" />
            </div>

            {/* Title Text */}
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,0.7)] font-sans whitespace-nowrap">
              园区智能管控系统
            </h1>

            {/* Right sci-fi tech wing */}
            <div className="hidden md:flex items-center gap-1 opacity-75">
              <div className="w-6 lg:w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-400" />
              <div className="w-1.5 h-1.5 rotate-45 border-r border-t border-cyan-400" />
            </div>
          </div>

          {/* Glowing Center Line */}
          <div className="w-32 sm:w-44 lg:w-56 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-1" />
        </div>

        {/* ================= ZONE 3: RIGHT NAV BUTTONS + CLOCK + USER ================= */}
        <div className="flex items-center justify-end gap-1.5 xl:gap-2.5 shrink-0 z-10">
          {/* Right 3 Nav Tabs */}
          <div className="flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => onSelectModule('maintenance')}
              className={`px-3 xl:px-3.5 py-1.5 rounded-md text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                currentModule === 'maintenance'
                  ? 'bg-gradient-to-r from-[#0f4bb8] to-[#1762e6] text-white shadow-[0_0_15px_rgba(30,105,230,0.6)] border border-[#3b82f6]'
                  : 'bg-[#0a1e48]/70 hover:bg-[#0e2c6c] text-[#86a6d8] hover:text-white border border-[#173874]'
              }`}
            >
              设备运维
            </button>

            <button
              onClick={() => onSelectModule('alarms')}
              className={`px-3 xl:px-3.5 py-1.5 rounded-md text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                currentModule === 'alarms'
                  ? 'bg-gradient-to-r from-[#0f4bb8] to-[#1762e6] text-white shadow-[0_0_15px_rgba(30,105,230,0.6)] border border-[#3b82f6]'
                  : 'bg-[#0a1e48]/70 hover:bg-[#0e2c6c] text-[#86a6d8] hover:text-white border border-[#173874]'
              }`}
            >
              告警管理
            </button>

            <button
              onClick={() => onSelectModule('system')}
              className={`px-3 xl:px-3.5 py-1.5 rounded-md text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                currentModule === 'system'
                  ? 'bg-gradient-to-r from-[#0f4bb8] to-[#1762e6] text-white shadow-[0_0_15px_rgba(30,105,230,0.6)] border border-[#3b82f6]'
                  : 'bg-[#0a1e48]/70 hover:bg-[#0e2c6c] text-[#86a6d8] hover:text-white border border-[#173874]'
              }`}
            >
              系统管理
            </button>
          </div>

          {/* Real-time Clock in Top Right */}
          <div className="hidden lg:flex flex-col text-right px-2.5 py-1 rounded-md bg-[#07173b]/90 border border-[#163a76] font-mono leading-tight shrink-0">
            <span className="text-cyan-400 font-bold text-xs tracking-wider">{clockTime}</span>
            <span className="text-[10px] text-slate-400">{clockDate}</span>
          </div>

          {/* User Account Button with Clean Name (No Phone Number) */}
          <div className="relative shrink-0">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 rounded-md bg-[#0a1e48]/90 border border-[#173874] text-cyan-300 hover:text-white hover:border-cyan-400 transition-colors text-xs whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-600/30 flex items-center justify-center text-cyan-300 border border-cyan-500/50">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold tracking-wide">管理员 (陈工)</span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-[#0b1c44] border border-[#1a448c] rounded-xl shadow-2xl p-2 z-50 text-xs"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#173874]">
                  <div className="text-white font-bold">管理员 (陈工)</div>
                  <div className="text-slate-400 text-[11px] font-mono">系统超级管理员 · EMP-2026</div>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => {
                      onToggleSimulation();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#132e6b] text-slate-300 hover:text-white rounded transition-colors flex items-center justify-between"
                  >
                    <span>动态遥测波动</span>
                    <span className={`text-[10px] font-bold ${isSimulating ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isSimulating ? '已开启' : '已暂停'}
                    </span>
                  </button>
                  <button 
                    onClick={() => {
                      handleRefresh();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#132e6b] text-slate-300 hover:text-white rounded transition-colors flex items-center justify-between"
                  >
                    <span>刷新最新数据</span>
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => {
                      toggleFullscreen();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#132e6b] text-slate-300 hover:text-white rounded transition-colors flex items-center justify-between"
                  >
                    <span>{isFullscreen ? '退出全屏' : '全屏展示'}</span>
                    {isFullscreen ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
                  </button>
                  {onLogout && (
                    <button 
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-red-950/60 text-red-300 hover:text-red-200 rounded transition-colors flex items-center justify-between border-t border-[#173874]/60 mt-1 pt-1.5"
                    >
                      <span>退出登录</span>
                      <LogOut className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-header Bar: Center Health Index (健康指数 90% 优) & Safety Index (安全指数 80% 良) */}
      <div className="h-9 px-4 bg-[#050e21]/95 flex items-center justify-center border-t border-[#0e244e]">
        <div className="flex items-center gap-4 sm:gap-8 md:gap-14 px-5 py-1 rounded-full bg-[#081738]/85 border border-[#163872]/70 shadow-inner text-xs">
          {/* Health Index */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-slate-300 font-medium whitespace-nowrap">健康指数</span>
            <div className="w-24 sm:w-32 md:w-40 h-2 bg-[#0a1b3d] rounded-full overflow-hidden p-[1px] border border-[#1c4488]">
              <div 
                style={{ width: '90%' }} 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-cyan-400 font-bold font-mono text-xs sm:text-sm">90%</span>
              <span className="text-cyan-300 font-bold px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-700/60 text-[10px]">
                优
              </span>
            </div>
          </div>

          <div className="w-[1px] h-3.5 bg-[#173d78]" />

          {/* Safety Index */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-slate-300 font-medium whitespace-nowrap">安全指数</span>
            <div className="w-24 sm:w-32 md:w-40 h-2 bg-[#0a1b3d] rounded-full overflow-hidden p-[1px] border border-[#1c4488]">
              <div 
                style={{ width: '80%' }} 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-cyan-400 font-bold font-mono text-xs sm:text-sm">80%</span>
              <span className="text-cyan-300 font-bold px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-700/60 text-[10px]">
                良
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
