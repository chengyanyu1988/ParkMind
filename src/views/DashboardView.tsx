import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  MonitorOff, 
  AlertOctagon, 
  ShieldAlert, 
  Flame, 
  CheckCircle, 
  Video, 
  Radio, 
  Clock, 
  Building, 
  Activity, 
  Zap, 
  Eye, 
  Layers, 
  Users, 
  Car, 
  PieChart as PieChartIcon, 
  BarChart2, 
  Sliders, 
  ChevronRight,
  Maximize2,
  X,
  MapPin,
  Sparkles,
  Thermometer,
  Gauge,
  Droplets,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { AlarmItem, DeviceItem, WorkOrderItem, SubsystemType } from '../types/ibms';

interface DashboardViewProps {
  alarms: AlarmItem[];
  devices: DeviceItem[];
  workOrders: WorkOrderItem[];
  onSelectSubsystem: (subsystem: SubsystemType) => void;
  onOpenDevice: (device: DeviceItem) => void;
  onOpenAlarm: (alarm: AlarmItem) => void;
  onSwitchModule: (module: any) => void;
  showFireAlarmModal?: boolean;
  onCloseFireAlarmModal?: () => void;
  initialHudTab?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  alarms,
  devices,
  workOrders,
  onSelectSubsystem,
  onOpenDevice,
  onOpenAlarm,
  onSwitchModule,
  showFireAlarmModal = true,
  onCloseFireAlarmModal,
  initialHudTab = '设备数据'
}) => {
  // Modal visibility state
  const [isFireModalOpen, setIsFireModalOpen] = useState<boolean>(showFireAlarmModal);
  const [countdown, setCountdown] = useState<number>(60);
  const [activeHudTab, setActiveHudTab] = useState<string>(initialHudTab);
  const [energyElecYear, setEnergyElecYear] = useState<string>('2026');
  const [energyElecMonth, setEnergyElecMonth] = useState<string>('12月');
  const [energyWaterYear, setEnergyWaterYear] = useState<string>('2026');
  const [envTempYear, setEnvTempYear] = useState<string>('2026');
  const [activityFilter, setActivityFilter] = useState<'low' | 'mid' | 'high'>('mid');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('18:42:15');
  const [selectedBuildingHotspot, setSelectedBuildingHotspot] = useState<string | null>(null);

  // Sync prop changes
  useEffect(() => {
    setIsFireModalOpen(showFireAlarmModal);
  }, [showFireAlarmModal]);


  // Timer for countdown and recent time
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    setCurrentTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmAlarm = () => {
    setIsFireModalOpen(false);
    if (onCloseFireAlarmModal) {
      onCloseFireAlarmModal();
    }
  };

  // Device Category dataset (from prototype)
  const categoryData = [
    { name: '摄像头', count: 1545, pct: '45.0%', color: '#06b6d4' },
    { name: '门禁', count: 456, pct: '13.4%', color: '#3b82f6' },
    { name: '空气质量感应器', count: 546, pct: '12.5%', color: '#8b5cf6' },
    { name: '温湿度感应器', count: 320, pct: '10.0%', color: '#ec4899' },
    { name: '车行闸机', count: 210, pct: '6.5%', color: '#eab308' },
    { name: '人行闸机', count: 130, pct: '4.5%', color: '#22c55e' },
    { name: '周界入侵主机', count: 170, pct: '8.0%', color: '#f97316' },
    { name: '其它', count: 150, pct: '8.5%', color: '#64748b' },
  ];

  // Lifecycle dataset (from prototype)
  const lifecycleData = [
    { name: '人行闸机', duration: '8年0月', segments: 24, totalSegments: 24, color: '#06b6d4' },
    { name: '车行闸机', duration: '4年0月', segments: 14, totalSegments: 24, color: '#06b6d4' },
    { name: '周界入侵...', duration: '3年2月', segments: 10, totalSegments: 24, color: '#06b6d4' },
    { name: '摄像头', duration: '3年2月', segments: 10, totalSegments: 24, color: '#06b6d4' },
    { name: '门禁', duration: '3年2月', segments: 10, totalSegments: 24, color: '#06b6d4' },
    { name: '其它', duration: '3年2月', segments: 10, totalSegments: 24, color: '#06b6d4' },
  ];

  // Alarm Types (Radar Axes)
  const alarmTypesData = [
    { label: '设备故障', value: 100, max: 100 },
    { label: '人员黑名单', value: 50, max: 100 },
    { label: '其它', value: 75, max: 100 },
    { label: '环境异常', value: 50, max: 100 },
    { label: '消防告警', value: 35, max: 100 },
    { label: '周界入侵', value: 75, max: 100 },
  ];

  // Spatial Alarm Ranking dataset
  const spatialRankings = [
    { rank: 1, location: 'T1-2F', count: 28 },
    { rank: 2, location: 'T1-3F', count: 26 },
    { rank: 3, location: 'T1-4F', count: 21 },
    { rank: 4, location: 'T1-5F', count: 16 },
    { rank: 5, location: 'T1-6F', count: 12 },
    { rank: 6, location: 'T3-2F', count: 8 },
    { rank: 7, location: 'T2-2F', count: 6 },
    { rank: 8, location: 'T2-5F', count: 5 },
    { rank: 9, location: 'T3-7F', count: 5 },
    { rank: 10, location: 'T3-1F', count: 4 },
  ];

  // Digital Twin Campus Hotspots
  const buildingHotspots = [
    {
      id: 'A-TOWER',
      name: 'A座 研发大厦 (18F)',
      x: '24%',
      y: '38%',
      status: 'normal',
      load: '540 kW',
      temp: '24.2 ℃',
      devices: 512,
      subsystem: '暖通·照明·门禁'
    },
    {
      id: 'B-TOWER',
      name: 'B座 行政总部 (12F)',
      x: '76%',
      y: '34%',
      status: 'normal',
      load: '380 kW',
      temp: '23.5 ℃',
      devices: 380,
      subsystem: '变配电·环境感知'
    },
    {
      id: 'POWER-CENTER',
      name: '动力中心 (冷热站/配电)',
      x: '50%',
      y: '22%',
      status: 'warning',
      load: '1,740 kW',
      temp: '冷水 7.2℃',
      devices: 240,
      subsystem: '冷热源·10kV变配电'
    },
    {
      id: 'GARAGE',
      name: '智能地下车库 (B1-B2)',
      x: '38%',
      y: '68%',
      status: 'normal',
      load: '剩余车位: 142/500',
      temp: 'CO浓度: 12 ppm',
      devices: 160,
      subsystem: '排风排烟·集水泵'
    },
    {
      id: 'PLAZA',
      name: '中央生态绿化广场景观',
      x: '58%',
      y: '56%',
      status: 'normal',
      load: '环境指数: 优',
      temp: '微气象: 22℃ AQI 32',
      devices: 95,
      subsystem: '景观照明·喷泉自控'
    }
  ];

  return (
    <div 
      className="w-full h-[calc(100vh-6.5rem)] relative overflow-hidden select-none font-sans bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/campus_digital_twin.jpg')` }}
    >
      {/* Cinematic Sci-fi Digital Twin Ambient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#040c1e]/90 via-[#040c1e]/40 to-[#040c1e]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#061127]/80 via-transparent to-[#050e22]/90 pointer-events-none" />

      {/* Subtle Holographic Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="twin-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#twin-grid)" />
      </svg>

      {/* Interactive 3D Hotspot Beacons floating on Campus Buildings */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {buildingHotspots.map((hotspot) => {
          const isSelected = selectedBuildingHotspot === hotspot.id;
          return (
            <div
              key={hotspot.id}
              style={{ left: hotspot.x, top: hotspot.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onClick={() => setSelectedBuildingHotspot(isSelected ? null : hotspot.id)}
            >
              {/* Pulsing Beacon Rings */}
              <div className="relative flex items-center justify-center">
                <span className={`absolute w-8 h-8 rounded-full opacity-75 animate-ping ${
                  hotspot.status === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
                }`} />
                <span className={`relative w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                  hotspot.status === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'
                }`} />
              </div>

              {/* Hotspot Floating Label Card */}
              <div className={`mt-2 -ml-16 w-44 p-2 rounded-xl bg-[#07173b]/95 border shadow-2xl backdrop-blur-md transition-all duration-300 ${
                isSelected 
                  ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105' 
                  : 'border-[#1b4388]/80 group-hover:border-cyan-400/80 group-hover:scale-105'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-bold text-white">
                  <span className="truncate">{hotspot.name}</span>
                  <span className={`w-2 h-2 rounded-full ${hotspot.status === 'warning' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                </div>
                <div className="mt-1 pt-1 border-t border-[#1a448c]/60 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                  <span>{hotspot.load}</span>
                  <span className="text-slate-300">{hotspot.temp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Emergency Reopen Pill (Placed safely in bottom-right corner, NEVER blocking top title or header) */}
      {!isFireModalOpen && (
        <div className="absolute bottom-4 right-4 z-30 pointer-events-auto">
          <button
            onClick={() => setIsFireModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(239,68,68,0.7)] border border-red-400 transition-all hover:scale-105"
            title="点击重新打开5级消防告警联动处置窗口"
          >
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>消防告警（5级）联动中 · 点击查看</span>
          </button>
        </div>
      )}

      {/* Main Glassmorphic Layout: Left HUD + Center Canvas + Right HUD */}
      <div className="relative w-full h-full flex p-3 gap-3 z-20 pointer-events-none">
        
        {/* ===================== LEFT COLUMN (WIDTH ~ 340px) ===================== */}
        <div className="w-84 xl:w-96 flex flex-col gap-3 shrink-0 pointer-events-auto">
          {activeHudTab === '空间数据' ? (
            <>
              {/* CARD 1: 全域楼宇空间业态类型结构分析 (原空间类型占比分析 - 保留 30%出租/3000, 25%驻户/2500, 15%公共/1500, 30%其它/3000, 总10000m², 升级4阶极坐标光环) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">全域楼宇空间业态类型结构分析</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <Building className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      4大空间业态
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：m²</span>
                </div>

                {/* 4-Layer Concentric Holographic Ring Meter (Replaced basic donut!) */}
                <div className="flex items-center gap-2 flex-1 min-h-[110px] py-1">
                  {/* Left SVG Rings */}
                  <div className="w-32 h-32 relative shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-90">
                      <defs>
                        <filter id="spatialTypeGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Concentric Arc 1: 出租空间 30% (3000m², Orange R=56) */}
                      <circle cx="70" cy="70" r="56" fill="none" stroke="#451a03" strokeWidth="6" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="56"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="6"
                        strokeDasharray="105.5 351.8"
                        strokeLinecap="round"
                        filter="url(#spatialTypeGlow)"
                      />

                      {/* Concentric Arc 2: 驻户空间 25% (2500m², Purple R=45) */}
                      <circle cx="70" cy="70" r="45" fill="none" stroke="#3b0764" strokeWidth="6" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="45"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="6"
                        strokeDasharray="70.7 282.7"
                        strokeLinecap="round"
                        filter="url(#spatialTypeGlow)"
                      />

                      {/* Concentric Arc 3: 公共空间 15% (1500m², Cyan R=34) */}
                      <circle cx="70" cy="70" r="34" fill="none" stroke="#083344" strokeWidth="6" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="34"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="6"
                        strokeDasharray="32.0 213.6"
                        strokeLinecap="round"
                        filter="url(#spatialTypeGlow)"
                      />

                      {/* Concentric Arc 4: 其它 30% (3000m², Emerald R=23) */}
                      <circle cx="70" cy="70" r="23" fill="none" stroke="#064e3b" strokeWidth="5" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="23"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="5"
                        strokeDasharray="43.3 144.5"
                        strokeLinecap="round"
                        filter="url(#spatialTypeGlow)"
                      />
                    </svg>

                    {/* Center Total Area Counter (总面积: 10000 m²) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-lg font-black font-mono text-white leading-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        10000
                      </span>
                      <span className="text-[8.5px] text-cyan-300 font-sans font-bold">
                        总面积 m²
                      </span>
                    </div>
                  </div>

                  {/* Right Legend Cards (Original 4 category values) */}
                  <div className="flex-1 flex flex-col justify-around text-xs space-y-1 min-w-0">
                    {[
                      { name: '出租空间', pct: '30%', area: 3000, color: '#f97316' },
                      { name: '驻户空间', pct: '25%', area: 2500, color: '#8b5cf6' },
                      { name: '公共空间', pct: '15%', area: 1500, color: '#06b6d4' },
                      { name: '其它空间', pct: '30%', area: 3000, color: '#22c55e' },
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between px-2 py-0.5 rounded-lg bg-[#05112e]/70 border border-[#14366e]/60 hover:border-cyan-400/40 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                          <span className="text-slate-200 font-sans text-[11px] truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs shrink-0">
                          <span className="text-cyan-400 font-semibold text-[10.5px]">{item.pct}</span>
                          <span className="text-white font-bold">{item.area}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 2: 本月空间单元通行热度与人气排名 (原右中 [本月空间人气值排名] 调序至左中，替换为热力能级瀑布流图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">本月空间单元通行热度与人气排名</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <Users className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      门禁通行感测
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：通行次数</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-4 bg-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[11px] font-bold border border-[#1d4c94]">
                  <div>排行</div>
                  <div>空间室号</div>
                  <div>所属楼栋</div>
                  <div>通行次数</div>
                </div>

                {/* 6 Ranked Rows matching screenshot [1001/T1/125, 1002/T1/121, 1003/T1/89, 1004/T1/88, 1005/T1/87, 1006/T1/56] */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs font-mono">
                  {[
                    { rank: 1, room: '1001室', building: 'T1', count: 125, isTop: true },
                    { rank: 2, room: '1002室', building: 'T1', count: 121, isTop: true },
                    { rank: 3, room: '1003室', building: 'T1', count: 89, isTop: true },
                    { rank: 4, room: '1004室', building: 'T1', count: 88, isTop: false },
                    { rank: 5, room: '1005室', building: 'T1', count: 87, isTop: false },
                    { rank: 6, room: '1006室', building: 'T1', count: 56, isTop: false },
                  ].map((row) => (
                    <div 
                      key={row.rank} 
                      className="grid grid-cols-4 items-center text-center py-1 px-1 hover:bg-[#0c2452] transition-colors"
                    >
                      <div className="flex justify-center">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                          row.rank === 1 ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.8)]' :
                          row.rank === 2 ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.8)]' :
                          row.rank === 3 ? 'bg-blue-600 text-white shadow-[0_0_6px_rgba(59,130,246,0.6)]' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {row.rank}
                        </span>
                      </div>
                      <div className="font-sans text-cyan-300 text-xs font-semibold">{row.room}</div>
                      <div className="text-slate-300 text-xs font-mono">{row.building}</div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-extrabold text-cyan-400 text-xs">{row.count}</span>
                        <span className="text-[9.5px] text-slate-400 font-sans">次</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: 核心出租空间去化与招商出租率 (原左中 [出租空间出租率] 调序至左下，图表更改为240°速度仪表盘与双容积卡片) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">核心出租空间去化与招商出租率</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      去化监测
                    </span>
                  </div>
                  <span className="text-[11px] text-cyan-300 font-mono font-bold">出租空间总面积: 3000 m²</span>
                </div>

                {/* 240° Semi-circular Speedometer Gauge + Dual Metric Cards (80% / 2400 m² 已出租 / 600 m² 未出租) */}
                <div className="flex items-center justify-around flex-1 min-h-[110px] py-1">
                  {/* Left Holographic Dial Gauge */}
                  <div className="relative w-28 h-24 flex items-center justify-center">
                    <svg viewBox="0 0 100 85" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="spatialLeaseGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0284c7" />
                          <stop offset="60%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>

                      {/* Outer calibrated orbit */}
                      <path
                        d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                        fill="none"
                        stroke="#0e2a56"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                        fill="none"
                        stroke="#1e3a6a"
                        strokeWidth="2"
                        strokeDasharray="2 6"
                      />

                      {/* Active Progress Arc (80% of 240°) */}
                      <path
                        d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                        fill="none"
                        stroke="url(#spatialLeaseGrad)"
                        strokeWidth="7"
                        strokeDasharray="120.6 226.2"
                        strokeLinecap="round"
                        className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                      />
                      {/* Active Tip Pip at 80% */}
                      <circle cx="75" cy="28" r="3.5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
                    </svg>

                    {/* Center Percentage */}
                    <div className="absolute top-5 flex flex-col items-center">
                      <span className="text-2xl font-black font-mono text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                        80<span className="text-xs font-normal">%</span>
                      </span>
                      <span className="text-[9px] text-slate-400">出租率</span>
                    </div>
                  </div>

                  {/* Right Dual Metric Volume Cards */}
                  <div className="flex-1 space-y-2 pl-2 font-mono">
                    {/* 已出租: 2400 m² */}
                    <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-950/80 to-[#0c285a]/80 border border-cyan-500/40 flex items-center justify-between shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      <span className="text-xs text-cyan-200 font-sans font-medium">已出租空间</span>
                      <span className="font-black text-cyan-300 text-sm">2400 <span className="text-[10px] text-slate-400 font-sans">m²</span></span>
                    </div>

                    {/* 未出租: 600 m² */}
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-950/80 to-[#0a1e45]/80 border border-blue-500/30 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-sans font-medium">未出租空间</span>
                      <span className="font-extrabold text-blue-300 text-sm">600 <span className="text-[10px] text-slate-400 font-sans">m²</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeHudTab === '安全数据' ? (
            <>
              {/* CARD 1: 全域安防告警态势总览 (原告警总览 - 保持核心数据5/2/2/0/0/108/1088, 升级高阶UI) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">全域安防告警态势总览</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <ShieldAlert className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      实时侦测
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：告警次数</span>
                </div>

                {/* Top Main Today's Alarms Counter (今日告警: 5) */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-950/70 via-[#0b2b5d]/80 to-blue-950/70 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
                    <span className="text-xs text-cyan-200 font-bold tracking-wider">今日告警</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-cyan-400 tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                      5
                    </span>
                    <span className="text-xs text-slate-400 font-mono">次</span>
                  </div>
                </div>

                {/* 2x2 Sub-Category Breakdown Cards (入侵: 2, 周界: 2, 人员黑名单: 0, 车辆黑名单: 0) */}
                <div className="grid grid-cols-2 gap-2 my-1">
                  {/* 入侵: 2 */}
                  <div className="p-2 rounded-xl bg-[#05112e]/80 border border-[#14366e] flex items-center justify-between hover:border-cyan-400/60 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs text-slate-300 font-sans">入侵告警</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-black text-sm">2</span>
                  </div>

                  {/* 周界: 2 */}
                  <div className="p-2 rounded-xl bg-[#05112e]/80 border border-[#14366e] flex items-center justify-between hover:border-cyan-400/60 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-slate-300 font-sans">周界告警</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-black text-sm">2</span>
                  </div>

                  {/* 人员黑名单: 0 */}
                  <div className="p-2 rounded-xl bg-[#05112e]/80 border border-[#14366e] flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-300 font-sans">人员黑名单</span>
                    </div>
                    <span className="font-mono text-slate-400 font-bold text-sm">0</span>
                  </div>

                  {/* 车辆黑名单: 0 */}
                  <div className="p-2 rounded-xl bg-[#05112e]/80 border border-[#14366e] flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-300 font-sans">车辆黑名单</span>
                    </div>
                    <span className="font-mono text-slate-400 font-bold text-sm">0</span>
                  </div>
                </div>

                {/* Bottom Aggregate Summary Capsule Pills (本月告警: 108次, 年度告警: 1088次) */}
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#051433]/90 border border-cyan-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-300 font-sans">本月告警</span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-cyan-300 font-extrabold text-xs">108</span>
                      <span className="text-[9.5px] text-slate-400">次</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-1.5 rounded-xl bg-[#051433]/90 border border-blue-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-300 font-sans">年度告警</span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-blue-300 font-extrabold text-xs">1088</span>
                      <span className="text-[9.5px] text-slate-400">次</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: 安防告警分类结构分布 (原右上角 [本月安防告警类型分布] 调序至左中, 更改为5阶发光极坐标光环图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">安防告警分类结构分布</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-purple-950/80 text-purple-300 border border-purple-500/40 rounded">
                      5大事件源
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：告警次数</span>
                </div>

                {/* 5-Segment Cyber Radial Concentric Arc Meter (Original doughnut changed to futuristic concentric rings!) */}
                <div className="flex items-center gap-2 flex-1 min-h-[110px] py-1">
                  {/* Left SVG Concentric Rings */}
                  <div className="w-32 h-32 relative shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-90">
                      <defs>
                        <filter id="safeCategoryGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Concentric Arc 1: 刷卡异常 20 (Outer ring, R=56) */}
                      <circle cx="70" cy="70" r="56" fill="none" stroke="#083344" strokeWidth="6" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="56"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="6"
                        strokeDasharray="104.2 351.8"
                        strokeLinecap="round"
                        filter="url(#safeCategoryGlow)"
                      />

                      {/* Concentric Arc 2: 入侵告警 20 (R=45) */}
                      <circle cx="70" cy="70" r="45" fill="none" stroke="#1e1b4b" strokeWidth="6" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="6"
                        strokeDasharray="83.8 282.7"
                        strokeLinecap="round"
                        filter="url(#safeCategoryGlow)"
                      />

                      {/* Concentric Arc 3: 车辆黑名单 15 (R=34) */}
                      <circle cx="70" cy="70" r="34" fill="none" stroke="#451a03" strokeWidth="6" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="34"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="6"
                        strokeDasharray="47.1 213.6"
                        strokeLinecap="round"
                        filter="url(#safeCategoryGlow)"
                      />

                      {/* Concentric Arc 4: 人员黑名单 10 (R=23) */}
                      <circle cx="70" cy="70" r="23" fill="none" stroke="#3b0764" strokeWidth="5" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="23"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="5"
                        strokeDasharray="21.2 144.5"
                        strokeLinecap="round"
                        filter="url(#safeCategoryGlow)"
                      />

                      {/* Concentric Arc 5: 周界告警 3 (R=14) */}
                      <circle cx="70" cy="70" r="14" fill="none" stroke="#4c0519" strokeWidth="4" opacity="0.4" />
                      <circle
                        cx="70" cy="70" r="14"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="4"
                        strokeDasharray="3.8 87.9"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Center Total Counter Display (告警总数: 68) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-black font-mono text-white leading-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        68
                      </span>
                      <span className="text-[9px] text-cyan-300 font-sans font-bold">
                        告警总数
                      </span>
                    </div>
                  </div>

                  {/* Right Custom Cyber Breakdown List (Original 5 categories) */}
                  <div className="flex-1 flex flex-col justify-around text-xs space-y-1 min-w-0">
                    {[
                      { name: '刷卡异常', count: 20, color: '#06b6d4', badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50' },
                      { name: '入侵告警', count: 20, color: '#3b82f6', badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-500/50' },
                      { name: '车辆黑名单', count: 15, color: '#f59e0b', badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/50' },
                      { name: '人员黑名单', count: 10, color: '#a855f7', badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-500/50' },
                      { name: '周界告警', count: 3, color: '#f43f5e', badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-500/50' },
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between px-2 py-0.5 rounded-lg bg-[#05112e]/70 border border-[#14366e]/60 hover:border-cyan-400/40 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                          <span className="text-slate-200 font-sans text-[11px] truncate">{item.name}</span>
                        </div>
                        <span className="font-mono text-cyan-300 font-bold text-xs shrink-0">
                          {item.count} <span className="text-[9.5px] text-slate-400 font-sans">次</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 3: 近七日安防事件频次统计 (原左中 [近七天安防告警统计] 调序至左下，日期更新为2026近期 11-01 ~ 11-07，图表更改为数码点阵与发光包络线) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">近七日安防事件频次统计</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      近7日监测
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：告警次数</span>
                </div>

                {/* Upgraded Cyberpunk LED Array Histogram + Glow Spline Wave (Original 08-01 ~ 08-07 changed to 11-01 ~ 11-07!) */}
                <div className="relative flex-1 min-h-[110px] flex flex-col justify-end pt-2 pb-1">
                  <div className="relative w-full h-[115px]">
                    <svg viewBox="0 0 320 115" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="safeBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                          <stop offset="60%" stopColor="#0284c7" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="safePeakBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#0e7490" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="safeWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines (0, 2, 4, 6, 8) */}
                      {[15, 35, 55, 75, 95].map((y, idx) => (
                        <line 
                          key={y} 
                          x1="28" y1={y} 
                          x2="295" y2={y} 
                          stroke="#14366e" 
                          strokeWidth="0.6" 
                          strokeDasharray="2 2" 
                          opacity="0.4" 
                        />
                      ))}

                      {/* Y-axis labels */}
                      <text x="24" y="18" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">8</text>
                      <text x="24" y="38" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">6</text>
                      <text x="24" y="58" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">4</text>
                      <text x="24" y="78" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">2</text>
                      <text x="24" y="98" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="end" fontFamily="monospace">0</text>

                      {/* Wave Area Fill under curve */}
                      <path
                        d="M 38 25 Q 58 65, 78 65 T 118 55 T 158 45 T 198 55 T 238 65 T 278 65 L 278 95 L 38 95 Z"
                        fill="url(#safeWaveGrad)"
                      />

                      {/* 7 Columns matching screenshot data [7, 3, 4, 5, 4, 3, 3] with RECENT 2026 DATES 11-01 ~ 11-07 */}
                      {[
                        { date: '11-01', val: 7, isPeak: true, y: 25 },
                        { date: '11-02', val: 3, y: 65 },
                        { date: '11-03', val: 4, y: 55 },
                        { date: '11-04', val: 5, y: 45 },
                        { date: '11-05', val: 4, y: 55 },
                        { date: '11-06', val: 3, y: 65 },
                        { date: '11-07', val: 3, y: 65 },
                      ].map((item, idx) => {
                        const x = 38 + idx * 40;
                        const barHeight = (item.val / 8) * 80;
                        const barY = 95 - barHeight;
                        return (
                          <g key={item.date}>
                            {/* Outer Glow Column */}
                            <rect
                              x={x - 8}
                              y={barY}
                              width="16"
                              height={barHeight}
                              rx="3"
                              fill={item.isPeak ? 'url(#safePeakBarGrad)' : 'url(#safeBarGrad)'}
                              className={item.isPeak ? 'filter drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]' : ''}
                            />
                            {/* Glowing Top Pip */}
                            <circle
                              cx={x}
                              cy={barY}
                              r={item.isPeak ? 3.5 : 2.5}
                              fill={item.isPeak ? '#ffffff' : '#38bdf8'}
                              stroke="#0284c7"
                              strokeWidth="1"
                              className={item.isPeak ? 'animate-pulse' : ''}
                            />
                            {/* Value Label above */}
                            <text
                              x={x}
                              y={barY - 5}
                              fill={item.isPeak ? '#38bdf8' : '#67e8f9'}
                              fontSize="9"
                              fontWeight="bold"
                              textAnchor="middle"
                              fontFamily="monospace"
                            >
                              {item.val}
                            </text>
                          </g>
                        );
                      })}

                      {/* Smooth Spline Overlay Curve */}
                      <path
                        d="M 38 25 Q 58 65, 78 65 T 118 55 T 158 45 T 198 55 T 238 65 T 278 65"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]"
                      />

                      {/* X-axis Recent Dates */}
                      {[
                        '11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07'
                      ].map((d, idx) => (
                        <text
                          key={d}
                          x={38 + idx * 40}
                          y="108"
                          fill={idx === 0 ? '#38bdf8' : '#94a3b8'}
                          fontWeight={idx === 0 ? 'bold' : 'normal'}
                          fontSize="8.5"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {d}
                        </text>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : activeHudTab === '环境数据' ? (
            <>
              {/* CARD 1: 全域温湿度场微气候监测 (原园区空间温湿度监测统计 - 升级同心全息环形仪表盘图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">全域温湿度场微气候监测</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <Thermometer className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      100个监测点
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：监测点</span>
                </div>

                {/* Dual Concentric Holographic Ring Gauges (Exact prototype data 65% / 25%) */}
                <div className="flex items-center justify-around flex-1 min-h-[110px] py-1">
                  {/* Gauge 1: 温度正常 65% (65/100) */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <defs>
                          <linearGradient id="tempGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#0284c7" />
                          </linearGradient>
                          <filter id="gaugeGlow1" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Outer calibrated tick orbit */}
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#0e3a75" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                        
                        {/* Background track circle */}
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#082352" strokeWidth="6" />

                        {/* Progress arc: 65% of 2*PI*38 = 238.76 -> dashoffset = (1-0.65)*238.76 = 83.56 */}
                        <circle
                          cx="50" cy="50" r="38"
                          fill="none"
                          stroke="url(#tempGaugeGrad)"
                          strokeWidth="6"
                          strokeDasharray="238.76"
                          strokeDashoffset="83.56"
                          strokeLinecap="round"
                          filter="url(#gaugeGlow1)"
                          className="transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black font-mono text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                          65<span className="text-xs font-normal">%</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 text-center">
                      <div className="text-xs text-slate-200 font-medium">温度正常</div>
                      <div className="text-[11px] font-mono text-cyan-400 font-bold">
                        65<span className="text-slate-400 font-normal">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Gauge 2: 湿度正常 25% (25/100) */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <defs>
                          <linearGradient id="humGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#2563eb" />
                          </linearGradient>
                        </defs>

                        {/* Outer calibrated tick orbit */}
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#0e3a75" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                        {/* Background track circle */}
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#082352" strokeWidth="6" />

                        {/* Progress arc: 25% of 2*PI*38 = 238.76 -> dashoffset = (1-0.25)*238.76 = 179.07 */}
                        <circle
                          cx="50" cy="50" r="38"
                          fill="none"
                          stroke="url(#humGaugeGrad)"
                          strokeWidth="6"
                          strokeDasharray="238.76"
                          strokeDashoffset="179.07"
                          strokeLinecap="round"
                          filter="url(#gaugeGlow1)"
                          className="transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black font-mono text-blue-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                          25<span className="text-xs font-normal">%</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 text-center">
                      <div className="text-xs text-slate-200 font-medium">湿度正常</div>
                      <div className="text-[11px] font-mono text-blue-400 font-bold">
                        25<span className="text-slate-400 font-normal">/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Threshold Reference Capsule Strip (Exact prototype text) */}
                <div className="mt-1 flex items-center justify-center gap-3 px-3 py-1.5 rounded-xl bg-[#05112e]/80 border border-[#14366e]/80 text-[11px] font-mono">
                  <span className="text-slate-300">
                    正常温度: <span className="text-cyan-400 font-bold">18-20℃</span>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300">
                    正常湿度: <span className="text-blue-400 font-bold">45-65%</span>
                  </span>
                </div>
              </div>

              {/* CARD 2: 室外气象温度气温周年变化态势 (原室外温度变化 - 调序至中间位置，升级热力流动渐变包络曲线图) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">室外气象温度气温周年变化态势</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      气象站联动
                    </span>
                  </div>
                  {/* Selector with 2026年 (近期) & Unit */}
                  <div className="flex items-center gap-2">
                    <select 
                      value={envTempYear} 
                      onChange={(e) => setEnvTempYear(e.target.value)}
                      className="bg-[#05112e] text-cyan-300 border border-[#1d4c94] rounded px-1.5 py-0.5 text-[11px] font-mono outline-none cursor-pointer hover:border-cyan-400 transition-colors"
                    >
                      <option value="2026">2026年 (近期)</option>
                      <option value="2025">2025年</option>
                    </select>
                    <span className="text-[10px] text-slate-400 font-mono">单位：℃ (日均℃)</span>
                  </div>
                </div>

                {/* Upgraded Dual-Tone Spline Contour Gradient Curve */}
                <div className="relative flex-1 min-h-[110px] flex flex-col justify-end pt-3 pb-1">
                  <div className="relative w-full h-[115px]">
                    <svg viewBox="0 0 320 115" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="tempAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.65" />
                          <stop offset="60%" stopColor="#0284c7" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#082f49" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines (-10, 0, 10, 20, 30, 40 ℃) */}
                      {/* Height scale: 40 = y:10, 30 = y:27, 20 = y:44, 10 = y:61, 0 = y:78 (Baseline), -10 = y:95 */}
                      {[10, 27, 44, 61, 78, 95].map((y, idx) => (
                        <line 
                          key={y} 
                          x1="28" y1={y} 
                          x2="295" y2={y} 
                          stroke={idx === 4 ? '#06b6d4' : '#14366e'} 
                          strokeWidth={idx === 4 ? '1' : '0.6'} 
                          strokeDasharray={idx === 4 ? 'none' : '2 2'} 
                          opacity={idx === 4 ? 0.8 : 0.4} 
                        />
                      ))}

                      {/* Y-axis labels */}
                      <text x="24" y="13" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">40</text>
                      <text x="24" y="30" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">30</text>
                      <text x="24" y="47" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">20</text>
                      <text x="24" y="64" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">10</text>
                      <text x="24" y="81" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="end" fontFamily="monospace">0</text>
                      <text x="24" y="98" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">-10</text>

                      {/* Temperature values across 12 months: [2, 5, 12, 18, 22, 26, 27, 26, 21, 15, 8, 3]
                          y = 78 - (val / 50) * 85
                          1: 2 -> 74.6
                          2: 5 -> 69.5
                          3: 12 -> 57.6
                          4: 18 -> 47.4
                          5: 22 -> 40.6
                          6: 26 -> 33.8
                          7: 27 -> 32.1 (Peak)
                          8: 26 -> 33.8
                          9: 21 -> 42.3
                          10: 15 -> 52.5
                          11: 8 -> 64.4
                          12: 3 -> 72.9
                      */}

                      {/* Area Gradient Fill */}
                      <path
                        d="M 38 74.6 Q 48 71, 59 69.5 T 80 57.6 T 101 47.4 T 122 40.6 T 143 33.8 T 164 32.1 T 185 33.8 T 206 42.3 T 227 52.5 T 248 64.4 T 269 72.9 L 269 95 L 38 95 Z"
                        fill="url(#tempAreaGrad)"
                      />

                      {/* Thermal Contour Spline Line */}
                      <path
                        d="M 38 74.6 Q 48 71, 59 69.5 T 80 57.6 T 101 47.4 T 122 40.6 T 143 33.8 T 164 32.1 T 185 33.8 T 206 42.3 T 227 52.5 T 248 64.4 T 269 72.9"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />

                      {/* Peak Callout Badge above Month 7 (27℃) */}
                      <g transform="translate(141, 14)">
                        <rect x="0" y="0" width="46" height="12" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="0.8" className="shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                        <text x="23" y="9" fill="#38bdf8" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">7月 27℃ 峰值</text>
                        <polygon points="23,12 20,15 26,15" fill="#38bdf8" />
                      </g>

                      {/* Dots & Labels */}
                      {[
                        { m: 1, val: 2, y: 74.6 },
                        { m: 2, val: 5, y: 69.5 },
                        { m: 3, val: 12, y: 57.6 },
                        { m: 4, val: 18, y: 47.4 },
                        { m: 5, val: 22, y: 40.6 },
                        { m: 6, val: 26, y: 33.8 },
                        { m: 7, val: 27, y: 32.1, isPeak: true },
                        { m: 8, val: 26, y: 33.8 },
                        { m: 9, val: 21, y: 42.3 },
                        { m: 10, val: 15, y: 52.5 },
                        { m: 11, val: 8, y: 64.4 },
                        { m: 12, val: 3, y: 72.9 },
                      ].map((pt, idx) => {
                        const x = 38 + idx * 21;
                        return (
                          <g key={pt.m}>
                            <circle
                              cx={x}
                              cy={pt.y}
                              r={pt.isPeak ? 4 : 2.5}
                              fill={pt.isPeak ? '#ffffff' : '#38bdf8'}
                              stroke="#0284c7"
                              strokeWidth={pt.isPeak ? 2 : 1}
                              className={pt.isPeak ? 'animate-pulse' : ''}
                            />
                          </g>
                        );
                      })}

                      {/* X-axis Month Numbers */}
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, idx) => (
                        <text
                          key={m}
                          x={38 + idx * 21}
                          y="108"
                          fill={m === 7 ? '#38bdf8' : '#94a3b8'}
                          fontWeight={m === 7 ? 'bold' : 'normal'}
                          fontSize="8.5"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {m}
                        </text>
                      ))}
                      <text x="295" y="108" fill="#64748b" fontSize="8" textAnchor="start" fontFamily="sans-serif">(月)</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* CARD 3: 空气环境质量四维浓度感知 (原空气质量检测 - 调序至底部位置，升级四维矩阵芯片图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">空气环境质量四维浓度感知</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded">
                      4大环境因子
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：监测点</span>
                </div>

                {/* 4 Sensor Factor Cyber Matrix Cards (Exact prototype data) */}
                <div className="grid grid-cols-2 gap-2 flex-1 min-h-0 py-1">
                  {[
                    { symbol: 'NH3', name: '氨气', normal: 50, abnormal: 0, tagBg: 'bg-cyan-950 text-cyan-300 border-cyan-500/50' },
                    { symbol: 'CO', name: '一氧化碳', normal: 50, abnormal: 0, tagBg: 'bg-blue-950 text-blue-300 border-blue-500/50' },
                    { symbol: 'CO2', name: '二氧化碳', normal: 30, abnormal: 0, tagBg: 'bg-indigo-950 text-indigo-300 border-indigo-500/50' },
                    { symbol: 'PM2.5', name: '细颗粒物', normal: 30, abnormal: 0, tagBg: 'bg-purple-950 text-purple-300 border-purple-500/50' },
                  ].map((item) => (
                    <div 
                      key={item.symbol} 
                      className="p-2 rounded-xl bg-[#05112e]/80 border border-[#14366e] flex flex-col justify-between hover:border-cyan-400/60 transition-colors shadow-inner"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-xs border ${item.tagBg}`}>
                          {item.symbol}
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          优良
                        </span>
                      </div>

                      <div className="mt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-xs font-sans">
                          <span className="text-slate-300">浓度正常</span>
                          <span className="font-mono font-extrabold text-cyan-300 text-sm">
                            {item.normal}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-sans">
                          <span className="text-slate-400">浓度异常</span>
                          <span className="font-mono font-bold text-slate-400 text-xs">
                            {item.abnormal}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeHudTab === '能耗数据' ? (
            <>
              {/* CARD 1: 全域综合电能消耗态势 (原电能消耗统计 - 升级3D全息反应堆图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">全域综合电能消耗态势</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      绿色负荷
                    </span>
                  </div>
                  {/* Bracket Style Top Highlight: 昨日电耗 16 kWh */}
                  <div className="flex items-center text-[11px] font-mono">
                    <span className="text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border-l-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                      昨日电耗: <span className="text-white font-extrabold text-xs">16</span> <span className="text-cyan-300 text-[10px]">kWh</span>
                    </span>
                  </div>
                </div>

                {/* 3D Holographic Power Flux Reactor (全息能量矩阵反应堆) */}
                <div className="relative flex-1 min-h-[105px] flex items-center justify-center py-1">
                  <div className="w-full h-full max-h-[120px] relative flex items-center justify-center">
                    <svg viewBox="0 0 280 120" className="w-full h-full">
                      <defs>
                        <radialGradient id="reactorCoreGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                          <stop offset="40%" stopColor="#0284c7" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="ringGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <linearGradient id="ringGradB" x1="100%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="50%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                        <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Containment outer grid boundary */}
                      <ellipse cx="140" cy="60" rx="120" ry="34" fill="none" stroke="#0e3a75" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                      
                      {/* Energy Flux Wave Ring 1 (Top inclined ellipse) */}
                      <ellipse cx="140" cy="42" rx="72" ry="18" fill="none" stroke="url(#ringGradA)" strokeWidth="2.2" strokeDasharray="35 12 18 10" filter="url(#neonBlur)" opacity="0.9" />
                      
                      {/* Energy Flux Wave Ring 2 (Center wide orbit) */}
                      <ellipse cx="140" cy="60" rx="98" ry="26" fill="none" stroke="url(#ringGradB)" strokeWidth="2.5" strokeDasharray="50 15 30 10" filter="url(#neonBlur)" />

                      {/* Energy Flux Wave Ring 3 (Bottom inclined orbit) */}
                      <ellipse cx="140" cy="78" rx="72" ry="18" fill="none" stroke="url(#ringGradA)" strokeWidth="2.2" strokeDasharray="25 10 30 12" opacity="0.85" />

                      {/* Central vertical particle flux conduits */}
                      <line x1="140" y1="18" x2="140" y2="102" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                      <line x1="100" y1="36" x2="100" y2="84" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />
                      <line x1="180" y1="36" x2="180" y2="84" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />

                      {/* Core Glowing Orb */}
                      <circle cx="140" cy="60" r="16" fill="url(#reactorCoreGlow)" filter="url(#neonBlur)" />
                      <circle cx="140" cy="60" r="7" fill="#ffffff" opacity="0.95" />

                      {/* Surrounding Energy Sparks */}
                      <circle cx="122" cy="50" r="2" fill="#38bdf8" />
                      <circle cx="158" cy="70" r="1.8" fill="#38bdf8" />
                      <circle cx="170" cy="52" r="1.5" fill="#67e8f9" />
                      <circle cx="110" cy="68" r="1.5" fill="#67e8f9" />
                      <circle cx="140" cy="28" r="2.2" fill="#a5f3fc" />
                      <circle cx="140" cy="92" r="2.2" fill="#a5f3fc" />
                    </svg>

                    {/* HUD Floating Readouts */}
                    <div className="absolute left-1 top-2 bg-[#040e28]/80 border border-cyan-500/30 rounded px-1.5 py-0.5 text-[9px] font-mono text-cyan-300">
                      <div>实时负荷: <span className="text-white font-bold">840 kW</span></div>
                      <div className="text-[8px] text-slate-400">功率因数: 0.96</div>
                    </div>
                    <div className="absolute right-1 bottom-2 bg-[#040e28]/80 border border-blue-500/30 rounded px-1.5 py-0.5 text-[9px] font-mono text-blue-300 text-right">
                      <div>峰谷均衡: <span className="text-white font-bold">99.8%</span></div>
                      <div className="text-[8px] text-slate-400">微电网自洽运行</div>
                    </div>
                  </div>
                </div>

                {/* Bottom 3 KPI Metric Cards (from prototype) */}
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {/* 本月电耗 */}
                  <div className="rounded-xl p-2 bg-gradient-to-br from-cyan-950/80 to-[#0c2758]/80 border border-cyan-500/40 text-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                    <div className="text-[10px] text-slate-300 mb-0.5 font-sans">本月电耗</div>
                    <div className="font-mono text-xl font-black text-cyan-300 tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                      500
                    </div>
                    <div className="text-[9px] text-cyan-400/80 font-mono">kwh</div>
                  </div>

                  {/* 上月电耗 */}
                  <div className="rounded-xl p-2 bg-gradient-to-br from-blue-950/80 to-[#0a1e45]/80 border border-blue-500/30 text-center">
                    <div className="text-[10px] text-slate-300 mb-0.5 font-sans">上月电耗</div>
                    <div className="font-mono text-xl font-black text-blue-300 tracking-tight">
                      860
                    </div>
                    <div className="text-[9px] text-blue-400/80 font-mono">kwh</div>
                  </div>

                  {/* 本月环比 */}
                  <div className="rounded-xl p-2 bg-gradient-to-br from-emerald-950/80 to-[#062c3e]/80 border border-emerald-500/40 text-center shadow-[0_0_12px_rgba(16,185,129,0.2)] flex flex-col justify-between">
                    <div className="text-[10px] text-slate-300 mb-0.5 font-sans">本月环比</div>
                    <div className="font-mono text-lg font-black text-emerald-400 flex items-center justify-center gap-0.5 tracking-tight">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      -41%
                    </div>
                    <div className="text-[9px] text-emerald-300/80 font-sans">节电下行</div>
                  </div>
                </div>
              </div>

              {/* CARD 2: 楼宇空间网格电耗梯级排行 (原空间能耗排名 - 调序至中间位置，升级高精度阶梯排版) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">楼宇空间网格电耗梯级排行</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-amber-950/80 text-amber-300 border border-amber-500/40 rounded">
                      空间梯队
                    </span>
                  </div>
                  {/* Modern Selector defaulting to 12月 */}
                  <div className="flex items-center gap-1.5">
                    <select 
                      value={energyElecMonth} 
                      onChange={(e) => setEnergyElecMonth(e.target.value)}
                      className="bg-[#05112e] text-cyan-300 border border-[#1d4c94] rounded px-1.5 py-0.5 text-[11px] font-mono outline-none cursor-pointer hover:border-cyan-400 transition-colors"
                    >
                      <option value="12月">12月 (近期)</option>
                      <option value="11月">11月</option>
                      <option value="10月">10月</option>
                    </select>
                  </div>
                </div>

                {/* 5-Tier Space Electricity Progress Ladder (Exact prototype data) */}
                <div className="flex-1 flex flex-col justify-around py-1 space-y-1.5">
                  {[
                    { rank: 1, name: '1栋1层', value: 120, max: 120, pct: 100, badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black', barGrad: 'from-amber-500 via-yellow-400 to-amber-300', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
                    { rank: 2, name: '1栋2层', value: 110, max: 120, pct: 91.7, badgeBg: 'bg-gradient-to-r from-cyan-400 to-teal-300 text-black', barGrad: 'from-cyan-500 via-teal-300 to-cyan-200', glow: 'shadow-[0_0_10px_rgba(6,182,212,0.5)]' },
                    { rank: 3, name: '1栋3层', value: 109, max: 120, pct: 90.8, badgeBg: 'bg-gradient-to-r from-blue-600 to-sky-400 text-white', barGrad: 'from-blue-600 via-sky-400 to-cyan-300', glow: 'shadow-[0_0_8px_rgba(59,130,246,0.4)]' },
                    { rank: 4, name: '1栋4层', value: 108, max: 120, pct: 90.0, badgeBg: 'bg-slate-700 text-slate-200 border border-slate-500', barGrad: 'from-slate-600 via-blue-500 to-cyan-500', glow: '' },
                    { rank: 5, name: '1栋5层', value: 106, max: 120, pct: 88.3, badgeBg: 'bg-slate-800 text-slate-300 border border-slate-600', barGrad: 'from-slate-700 via-slate-500 to-cyan-600', glow: '' },
                  ].map((item) => (
                    <div key={item.rank} className="flex items-center gap-2 text-xs">
                      {/* Rank Badge */}
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono shrink-0 ${item.badgeBg} ${item.glow}`}>
                        {item.rank}
                      </span>

                      {/* Floor Name */}
                      <span className="w-13 text-slate-200 font-sans text-xs shrink-0 tracking-tight">
                        {item.name}
                      </span>

                      {/* High-Precision Ladder Progress Track */}
                      <div className="flex-1 h-3 bg-[#05112e] rounded-full overflow-hidden border border-[#14366e]/70 p-[1.5px] relative">
                        <div 
                          style={{ width: `${item.pct}%` }} 
                          className={`h-full rounded-full bg-gradient-to-r ${item.barGrad} transition-all duration-700 relative`}
                        >
                          {/* Spark at end */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                        </div>
                      </div>

                      {/* Value Metric */}
                      <span className="w-18 text-right font-mono text-cyan-300 font-bold text-xs shrink-0">
                        {item.value} <span className="text-[10px] text-slate-400 font-sans">kwh</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: 年度月度用电周期与峰谷态势 (原电耗趋势 - 调序至底部，升级折柱复合双模态势图) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">年度月度用电周期与峰谷态势</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-blue-950/80 text-blue-300 border border-blue-500/40 rounded">
                      峰谷平衡
                    </span>
                  </div>
                  {/* Selector with 2026年 (近期) & Unit */}
                  <div className="flex items-center gap-2">
                    <select 
                      value={energyElecYear} 
                      onChange={(e) => setEnergyElecYear(e.target.value)}
                      className="bg-[#05112e] text-cyan-300 border border-[#1d4c94] rounded px-1.5 py-0.5 text-[11px] font-mono outline-none cursor-pointer hover:border-cyan-400 transition-colors"
                    >
                      <option value="2026">2026年 (近期)</option>
                      <option value="2025">2025年</option>
                    </select>
                    <span className="text-[10px] text-slate-400 font-mono">单位: kwh</span>
                  </div>
                </div>

                {/* Upgraded Dual-Tone Cyber Histogram + Glowing Spline Envelope Curve */}
                <div className="relative flex-1 min-h-[110px] flex flex-col justify-end pt-3 pb-1">
                  {/* SVG Chart Area */}
                  <div className="relative w-full h-[115px]">
                    <svg viewBox="0 0 320 115" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="elecBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
                          <stop offset="70%" stopColor="#0284c7" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="elecPeakBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="splineAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines: 600, 500, 400, 300, 200, 100, 0 */}
                      {[0, 20, 40, 60, 80, 100].map((yPct) => (
                        <line 
                          key={yPct} 
                          x1="28" y1={10 + yPct * 0.85} 
                          x2="295" y2={10 + yPct * 0.85} 
                          stroke="#14366e" 
                          strokeWidth="0.6" 
                          strokeDasharray="2 2" 
                          opacity="0.4" 
                        />
                      ))}

                      {/* Y-axis labels */}
                      <text x="24" y="14" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">600</text>
                      <text x="24" y="31" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">500</text>
                      <text x="24" y="48" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">400</text>
                      <text x="24" y="65" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">300</text>
                      <text x="24" y="82" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">200</text>
                      <text x="24" y="99" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">100</text>

                      {/* Benchmark Horizontal Dashed Line at 220 kWh (height = 95 - (220/600)*85 = 95 - 31.17 = 63.8) */}
                      <line x1="28" y1="63.8" x2="295" y2="63.8" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.9" />

                      {/* 12-Month Bars (Prototype: [430, 130, 160, 180, 160, 220, 380, 160, 320, 480, 540, 220]) */}
                      {[
                        { m: 1, val: 430 },
                        { m: 2, val: 130 },
                        { m: 3, val: 160 },
                        { m: 4, val: 180 },
                        { m: 5, val: 160 },
                        { m: 6, val: 220 },
                        { m: 7, val: 380 },
                        { m: 8, val: 160 },
                        { m: 9, val: 320 },
                        { m: 10, val: 480 },
                        { m: 11, val: 540, isPeak: true },
                        { m: 12, val: 220 },
                      ].map((bar, idx) => {
                        const x = 38 + idx * 21;
                        const barHeight = (bar.val / 600) * 85;
                        const y = 95 - barHeight;
                        return (
                          <g key={bar.m}>
                            {/* Bar Column */}
                            <rect
                              x={x - 4}
                              y={y}
                              width="8"
                              height={barHeight}
                              rx="2"
                              fill={bar.isPeak ? 'url(#elecPeakBarGrad)' : 'url(#elecBarGrad)'}
                              className="transition-all duration-500 hover:opacity-100 opacity-90"
                            />
                            {/* Glowing tip */}
                            <rect
                              x={x - 4}
                              y={y}
                              width="8"
                              height="2"
                              rx="1"
                              fill="#67e8f9"
                              className={bar.isPeak ? 'animate-pulse' : ''}
                            />
                          </g>
                        );
                      })}

                      {/* Smooth Glowing Spline Overlay */}
                      <path
                        d="M 38 34 Q 48 65, 59 76.5 T 80 72.3 T 101 69.5 T 122 72.3 T 143 63.8 T 164 41.1 T 185 72.3 T 206 49.6 T 227 27 T 248 18.5 T 269 63.8"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.8"
                        opacity="0.85"
                      />

                      {/* Benchmark tag on right matching screenshot 220 badge */}
                      <g transform="translate(292, 57)">
                        <rect x="0" y="0" width="26" height="13" rx="2" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
                        <text x="13" y="9.5" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">220</text>
                      </g>

                      {/* Peak Callout Badge above 11月 540 kWh */}
                      <g transform="translate(225, 4)">
                        <rect x="0" y="0" width="46" height="12" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="0.8" className="shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                        <text x="23" y="9" fill="#38bdf8" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">11月 540 峰值</text>
                        {/* Little downward triangle pointer */}
                        <polygon points="23,12 20,15 26,15" fill="#38bdf8" />
                      </g>

                      {/* X-axis Month Numbers */}
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, idx) => (
                        <text
                          key={m}
                          x={38 + idx * 21}
                          y="108"
                          fill={m === 11 ? '#38bdf8' : '#94a3b8'}
                          fontWeight={m === 11 ? 'bold' : 'normal'}
                          fontSize="8.5"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {m}
                        </text>
                      ))}
                      <text x="295" y="108" fill="#64748b" fontSize="8" textAnchor="start" fontFamily="sans-serif">(月)</text>
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : activeHudTab === '车流数据' ? (
            <>
              {/* CARD 1: 车位情况 (车流数据) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="font-bold tracking-wide text-white">车位情况</span>
                  <span className="text-[11px] text-slate-400 font-mono">单位：位</span>
                </div>

                <div className="flex items-center justify-between my-1 px-2 py-1 rounded-lg bg-[#05112e]/70 border border-[#14366e]/60">
                  <span className="text-xs text-slate-400">总车位</span>
                  <div className="flex items-center gap-2">
                    <div className="border border-cyan-500/80 rounded px-3 py-0.5 bg-cyan-950/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      <span className="text-2xl font-black font-mono text-cyan-400 tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                        600
                      </span>
                    </div>
                    <span className="text-xs text-slate-300">个</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-t border-[#163a76]/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 text-[11px]">已使用:</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">488</span>
                    <span className="text-[10px] text-slate-400">个</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 text-[11px]">空闲:</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">122</span>
                    <span className="text-[10px] text-slate-400">个</span>
                  </div>
                </div>

                {/* Car Sensor & Ground Parking Spot Visualizer */}
                <div className="relative h-24 w-full bg-gradient-to-b from-[#06122d] to-[#040c20] rounded-xl border border-[#16386d]/60 overflow-hidden flex items-center justify-between px-3 mt-1">
                  {/* Left: Car with Blue Light Beam */}
                  <div className="relative flex flex-col items-center">
                    <svg viewBox="0 0 100 80" className="w-24 h-20 overflow-visible">
                      <defs>
                        <linearGradient id="blueBeam" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      {/* Downward light cone */}
                      <polygon points="20,10 80,10 95,75 5,75" fill="url(#blueBeam)" />
                      {/* Stylized Car Front */}
                      <g transform="translate(20, 28) scale(0.65)">
                        {/* Windshield */}
                        <path d="M 18 10 L 74 10 L 84 28 L 8 28 Z" fill="#0c234a" stroke="#0284c7" strokeWidth="1.5" />
                        {/* Hood & Grille */}
                        <rect x="6" y="28" width="80" height="26" rx="6" fill="#071838" stroke="#38bdf8" strokeWidth="1.5" />
                        <rect x="26" y="38" width="40" height="10" rx="3" fill="#030c1e" stroke="#0284c7" strokeWidth="1" />
                        {/* Headlights */}
                        <ellipse cx="18" cy="36" rx="7" ry="4" fill="#38bdf8" className="filter drop-shadow-[0_0_8px_#38bdf8]" />
                        <ellipse cx="74" cy="36" rx="7" ry="4" fill="#38bdf8" className="filter drop-shadow-[0_0_8px_#38bdf8]" />
                        {/* Front Wheels */}
                        <rect x="2" y="42" width="6" height="14" rx="2" fill="#020815" />
                        <rect x="84" y="42" width="6" height="14" rx="2" fill="#020815" />
                      </g>
                    </svg>
                  </div>

                  {/* Right: Glowing Parking Space Spot Disc */}
                  <div className="flex flex-col items-center pr-2">
                    <div className="relative w-28 h-14 flex items-center justify-center">
                      {/* Elliptical parking pad */}
                      <svg viewBox="0 0 120 60" className="w-full h-full">
                        <ellipse cx="60" cy="30" rx="55" ry="22" fill="#0c2758" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="1" />
                        <ellipse cx="60" cy="30" rx="45" ry="16" fill="#1e40af" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                        <ellipse cx="60" cy="30" rx="30" ry="10" fill="#0284c7" fillOpacity="0.6" className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono tracking-wider mt-0.5">
                      车位占有率 81.3%
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 2: 车位类型统计 (车流数据 - 升级为240°高精度赛博仪表盘样式) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white tracking-wide">车位类型统计</span>
                  <span className="text-[11px] text-slate-400 font-mono">单位：位</span>
                </div>

                <div className="grid grid-cols-2 gap-3 flex-1 items-center justify-center min-h-0">
                  {/* Gauge 1: 固定车位 (25%) - 赛博半弧仪表盘 */}
                  <div className="flex flex-col items-center bg-[#05112e]/60 rounded-xl p-2 border border-[#14366e]/40">
                    <div className="relative w-24 h-20 flex items-center justify-center">
                      <svg viewBox="0 0 100 85" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="gaugeFixedGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#fbbf24" />
                          </linearGradient>
                        </defs>
                        {/* Background Scale Arc (240 degrees) */}
                        <path
                          d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                          fill="none"
                          stroke="#0e2a56"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        {/* Scale Ticks */}
                        <path
                          d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                          fill="none"
                          stroke="#1e3a6a"
                          strokeWidth="2"
                          strokeDasharray="2 6"
                        />
                        {/* Active Progress Arc (25% of 240° = 60° -> len = 37.7) */}
                        <path
                          d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                          fill="none"
                          stroke="url(#gaugeFixedGrad)"
                          strokeWidth="7"
                          strokeDasharray="37.7 226.2"
                          strokeLinecap="round"
                          className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]"
                        />
                        {/* Needle/Tip Pip at 25% (angle 210° -> x=18.82, y=30) */}
                        <circle cx="18.82" cy="30" r="3" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
                      </svg>
                      {/* Center Reading */}
                      <div className="absolute top-5 flex flex-col items-center">
                        <span className="text-lg font-black font-mono text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]">25%</span>
                        <span className="text-[9px] text-slate-400">占比</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between w-full px-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]" />
                        <span className="text-slate-300 font-sans text-[11px]">固定车位</span>
                      </div>
                      <span className="font-bold font-mono text-amber-300 text-sm">150<span className="text-[10px] text-slate-400 font-normal ml-0.5">位</span></span>
                    </div>
                  </div>

                  {/* Gauge 2: 临时车位 (75%) - 赛博半弧仪表盘 */}
                  <div className="flex flex-col items-center bg-[#05112e]/60 rounded-xl p-2 border border-[#14366e]/40">
                    <div className="relative w-24 h-20 flex items-center justify-center">
                      <svg viewBox="0 0 100 85" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="gaugeTempGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#0284c7" />
                            <stop offset="100%" stopColor="#22d3ee" />
                          </linearGradient>
                        </defs>
                        {/* Background Scale Arc (240 degrees) */}
                        <path
                          d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                          fill="none"
                          stroke="#0e2a56"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        {/* Scale Ticks */}
                        <path
                          d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                          fill="none"
                          stroke="#1e3a6a"
                          strokeWidth="2"
                          strokeDasharray="2 6"
                        />
                        {/* Active Progress Arc (75% of 240° = 180° -> len = 113.1) */}
                        <path
                          d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                          fill="none"
                          stroke="url(#gaugeTempGrad)"
                          strokeWidth="7"
                          strokeDasharray="113.1 226.2"
                          strokeLinecap="round"
                          className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                        />
                        {/* Needle/Tip Pip at 75% (angle 330° -> x=81.18, y=30) */}
                        <circle cx="81.18" cy="30" r="3" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
                      </svg>
                      {/* Center Reading */}
                      <div className="absolute top-5 flex flex-col items-center">
                        <span className="text-lg font-black font-mono text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">75%</span>
                        <span className="text-[9px] text-slate-400">占比</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between w-full px-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_6px_#06b6d4]" />
                        <span className="text-slate-300 font-sans text-[11px]">临时车位</span>
                      </div>
                      <span className="font-bold font-mono text-cyan-300 text-sm">150<span className="text-[10px] text-slate-400 font-normal ml-0.5">位</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: 车辆通行记录 (车流数据 - 表格) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">车辆通行记录</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      实时道闸
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono">最新5辆</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-4 bg-gradient-to-r from-[#0d2a63] via-[#123880] to-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[11px] font-bold border border-[#1d4c94]">
                  <div>类型</div>
                  <div>车牌</div>
                  <div>车辆抓拍</div>
                  <div>通行时间</div>
                </div>

                {/* Table Rows (5 entries exact from screenshot, updated to recent time) */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs">
                  {[
                    { type: '员工', plate: '粤A.87682', time: '18:12:12', photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=80&h=60&fit=crop' },
                    { type: '员工', plate: '粤A.87683', time: '18:12:11', photo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=80&h=60&fit=crop' },
                    { type: '员工', plate: '粤A.87685', time: '18:12:10', photo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=80&h=60&fit=crop' },
                    { type: '员工', plate: '粤A.17683', time: '18:12:09', photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=80&h=60&fit=crop' },
                    { type: '员工', plate: '粤A.82672', time: '18:12:08', photo: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=80&h=60&fit=crop' },
                  ].map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 items-center text-center py-1.5 hover:bg-[#0c224f]/60 transition-colors">
                      <span className="text-slate-300 font-sans text-[11px]">{item.type}</span>
                      <div className="flex justify-center">
                        <span className="px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/50 text-cyan-300 font-mono font-bold text-[10.5px]">
                          {item.plate}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-8 h-5 rounded bg-[#091b3e] border border-cyan-400/80 p-[1px] relative shadow-[0_0_6px_rgba(6,182,212,0.4)] overflow-hidden">
                          <img 
                            src={item.photo} 
                            alt={item.plate} 
                            className="w-full h-full rounded object-cover"
                          />
                        </div>
                      </div>
                      <span className="font-mono text-slate-300 text-[11px]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeHudTab === '人流数据' ? (
            <>
              {/* CARD 1: 全域人流时序通行态势 (原今日通行 - 优化排版与标题) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold tracking-wide text-white">全域人流时序通行态势</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      时序通量
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：人</span>
                </div>

                <div className="flex items-baseline justify-between my-1.5 px-1 py-1 rounded-xl bg-[#05112e]/70 border border-[#14366e]/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">今日累计通行</span>
                    <span className="text-3xl font-extrabold font-mono text-cyan-400 tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                      940
                    </span>
                    <span className="text-xs text-slate-400 font-sans">人次</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/70">
                      峰值: 200人
                    </span>
                    <span className="text-slate-400">均值: 156/h</span>
                  </div>
                </div>

                {/* Smooth Neon Spline Wave Area Chart */}
                <div className="pt-1 border-t border-[#163a76]/60">
                  <div className="w-full h-28 relative">
                    <svg viewBox="0 0 320 100" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="waveAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                          <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="waveStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                        <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Horizontal Reference Lines */}
                      <line x1="20" y1="22" x2="300" y2="22" stroke="#163868" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.6" />
                      <line x1="20" y1="46" x2="300" y2="46" stroke="#163868" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.6" />
                      <line x1="20" y1="70" x2="300" y2="70" stroke="#163868" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.6" />

                      {/* Area Fill */}
                      <path
                        d="M 25 26 
                           C 50 26, 60 40, 80 40 
                           C 105 40, 115 34, 135 34 
                           C 160 34, 170 51, 190 51 
                           C 215 51, 225 45, 245 45 
                           C 270 45, 280 31, 300 31 
                           L 300 78 
                           L 25 78 Z"
                        fill="url(#waveAreaGrad)"
                      />

                      {/* Smooth Spline Line */}
                      <path
                        d="M 25 26 
                           C 50 26, 60 40, 80 40 
                           C 105 40, 115 34, 135 34 
                           C 160 34, 170 51, 190 51 
                           C 215 51, 225 45, 245 45 
                           C 270 45, 280 31, 300 31"
                        fill="none"
                        stroke="url(#waveStrokeGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        filter="url(#nodeGlow)"
                      />

                      {/* Nodes */}
                      {[
                        { x: 25, y: 26, val: 200, time: '6-8h', isPeak: true },
                        { x: 80, y: 40, val: 150, time: '8-10h' },
                        { x: 135, y: 34, val: 170, time: '10-12h' },
                        { x: 190, y: 51, val: 110, time: '12-14h' },
                        { x: 245, y: 45, val: 130, time: '14-16h' },
                        { x: 300, y: 31, val: 180, time: '16-18h' },
                      ].map((pt, i) => (
                        <g key={i} className="cursor-pointer group">
                          <line x1={pt.x} y1={pt.y} x2={pt.x} y2="78" stroke="#0e7490" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.5" />
                          {pt.isPeak && (
                            <circle cx={pt.x} cy={pt.y} r="7" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.6" className="animate-ping" />
                          )}
                          <circle cx={pt.x} cy={pt.y} r="4" fill="#041226" stroke="#22d3ee" strokeWidth="2" />
                          <circle cx={pt.x} cy={pt.y} r="1.8" fill="#ffffff" />
                          <text
                            x={pt.x}
                            y={pt.y - 7}
                            textAnchor="middle"
                            fill={pt.isPeak ? '#38bdf8' : '#67e8f9'}
                            fontSize="9.5"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {pt.val}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* X-Axis Time Labels */}
                  <div className="flex justify-between items-center px-0.5 -mt-1 text-[8.5px] font-mono text-slate-400">
                    <span>6:00-8:00</span>
                    <span>8:00-10:00</span>
                    <span>10:00-12:00</span>
                    <span>12:00-14:00</span>
                    <span>14:00-16:00</span>
                    <span>16:00-18:00</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: 核心通道闸机流量排行 (人流数据 - 调序至左侧第二位与全域通量结合) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">核心通道闸机流量排行</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      5维雷达
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：人</span>
                </div>

                {/* 5-Axis Radar Flux Chart + Ranked Matrix */}
                <div className="flex items-center gap-2 flex-1 min-h-0 py-0.5">
                  {/* Left: 5-Axis Radar Visualizer */}
                  <div className="w-36 h-36 relative shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 150 140" className="w-full h-full overflow-visible">
                      <defs>
                        <radialGradient id="radarGlowGradLeft" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                          <stop offset="70%" stopColor="#0284c7" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                        </radialGradient>
                      </defs>

                      {/* Concentric Pentagonal Web Rings */}
                      {[0.33, 0.66, 1.0].map((scale, sIdx) => {
                        const r = 52 * scale;
                        const pts = [
                          `${75},${70 - r}`,
                          `${75 + r * 0.951},${70 - r * 0.309}`,
                          `${75 + r * 0.588},${70 + r * 0.809}`,
                          `${75 - r * 0.588},${70 + r * 0.809}`,
                          `${75 - r * 0.951},${70 - r * 0.309}`,
                        ].join(' ');
                        return (
                          <polygon
                            key={sIdx}
                            points={pts}
                            fill={sIdx === 2 ? 'url(#radarGlowGradLeft)' : 'none'}
                            stroke="#19457d"
                            strokeWidth="0.9"
                            strokeDasharray={sIdx < 2 ? '2 2' : 'none'}
                            opacity={sIdx === 2 ? 0.7 : 0.5}
                          />
                        );
                      })}

                      {/* 5 Axis Radial Spoke Lines */}
                      {[
                        [75, 70, 75, 18],
                        [75, 70, 75 + 52 * 0.951, 70 - 52 * 0.309],
                        [75, 70, 75 + 52 * 0.588, 70 + 52 * 0.809],
                        [75, 70, 75 - 52 * 0.588, 70 + 52 * 0.809],
                        [75, 70, 75 - 52 * 0.951, 70 - 52 * 0.309],
                      ].map((coords, lIdx) => (
                        <line
                          key={lIdx}
                          x1={coords[0]}
                          y1={coords[1]}
                          x2={coords[2]}
                          y2={coords[3]}
                          stroke="#1a4c8f"
                          strokeWidth="0.8"
                          opacity="0.6"
                        />
                      ))}

                      {/* Radar Polygon Shape based on real values: 600, 500, 450, 300, 150 */}
                      <polygon
                        points="75,18 116,57 98,102 59,92 62,66"
                        fill="#06b6d4"
                        fillOpacity="0.38"
                        stroke="#22d3ee"
                        strokeWidth="2"
                        className="filter drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                      />

                      {/* Nodes on Polygon */}
                      {[
                        { x: 75, y: 18, name: '1栋' },
                        { x: 116, y: 57, name: '2栋' },
                        { x: 98, y: 102, name: '3栋' },
                        { x: 59, y: 92, name: '4栋' },
                        { x: 62, y: 66, name: '5栋' },
                      ].map((node, nIdx) => (
                        <g key={nIdx}>
                          <circle cx={node.x} cy={node.y} r="3" fill="#041126" stroke="#38bdf8" strokeWidth="1.8" />
                          <circle cx={node.x} cy={node.y} r="1.2" fill="#ffffff" />
                        </g>
                      ))}

                      {/* Outer Labels */}
                      <text x="75" y="11" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">1栋</text>
                      <text x="130" y="55" textAnchor="start" fill="#67e8f9" fontSize="8" fontWeight="bold">2栋</text>
                      <text x="108" y="118" textAnchor="start" fill="#67e8f9" fontSize="8" fontWeight="bold">3栋</text>
                      <text x="40" y="108" textAnchor="end" fill="#94a3b8" fontSize="8">4栋</text>
                      <text x="35" y="66" textAnchor="end" fill="#94a3b8" fontSize="8">5栋</text>
                    </svg>
                  </div>

                  {/* Right: Ranked Badges & Value Matrix */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 space-y-1.5 min-w-0">
                    {[
                      { rank: 1, name: '1栋大堂通道闸', count: 600, badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/50' },
                      { rank: 2, name: '2栋大堂通道闸', count: 500, badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' },
                      { rank: 3, name: '3栋大堂通道闸', count: 450, badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
                      { rank: 4, name: '4栋大堂通道闸', count: 300, badgeBg: 'bg-slate-700/40 text-slate-300 border-slate-600/40' },
                      { rank: 5, name: '5栋大堂通道闸', count: 150, badgeBg: 'bg-slate-800/40 text-slate-400 border-slate-700/40' },
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between gap-1.5 px-2 py-1 rounded-lg bg-[#071d48]/70 border border-[#163b78]/60 hover:border-cyan-500/40 transition-all text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`w-4 h-4 rounded flex items-center justify-center font-mono font-bold text-[9px] border ${item.badgeBg}`}>
                            {item.rank}
                          </span>
                          <span className="text-slate-200 font-sans font-medium text-[10.5px] truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="font-mono text-cyan-300 font-bold text-xs">
                            {item.count}
                          </span>
                          <span className="text-[9.5px] text-slate-400 font-sans">人</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 3: 出入口人脸鉴权实时流水 (原实时通行记录 - 优化排版与标题) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">出入口人脸鉴权实时流水</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      实时鉴权
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono">最新5条</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-4 bg-gradient-to-r from-[#0d2a63] via-[#123880] to-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[11px] font-bold border border-[#1d4c94]">
                  <div>身份类型</div>
                  <div>姓名</div>
                  <div>AI抓拍</div>
                  <div>鉴权时间</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs">
                  {[
                    { type: '员工', name: '刘小明', time: '08:12:12', avatar: '/assets/images/chinese_man1.jpg' },
                    { type: '员工', name: '张继海', time: '08:12:11', avatar: '/assets/images/chinese_man2.jpg' },
                    { type: '员工', name: '张发科', time: '08:12:10', avatar: '/assets/images/chinese_man3.jpg' },
                    { type: '员工', name: '赵小强', time: '08:12:09', avatar: '/assets/images/chinese_man4.jpg' },
                    { type: '员工', name: '王燕', time: '08:12:08', avatar: '/assets/images/chinese_woman1.jpg' },
                  ].map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 items-center text-center py-1.5 hover:bg-[#0c224f]/60 transition-colors">
                      <span className="text-slate-300 font-sans text-[11px] px-1">{item.type}</span>
                      <span className="text-cyan-400 font-sans font-medium text-[11px]">{item.name}</span>
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded bg-[#091b3e] border border-cyan-400/80 p-[1px] relative shadow-[0_0_6px_rgba(6,182,212,0.4)]">
                          <img 
                            src={item.avatar} 
                            alt={item.name} 
                            className="w-full h-full rounded object-cover"
                          />
                        </div>
                      </div>
                      <span className="font-mono text-slate-300 text-[11px]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* CARD 1: 物联设备运行态势 (原设备数量统计 - 优化排版与标题) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold tracking-wide text-white">物联设备运行态势</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      在线率 90.0%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：台</span>
                </div>

                {/* Total Counter + Segmented Proportion Bar */}
                <div className="my-2 p-2 rounded-xl bg-[#05112e]/70 border border-[#14366e]/60">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs text-slate-400">接入终端总规模</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold font-mono text-cyan-400 tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                        2889
                      </span>
                      <span className="text-xs text-slate-400 font-sans">台</span>
                    </div>
                  </div>
                  {/* Segmented Cyber Visual Bar */}
                  <div className="w-full h-2 bg-[#020b1f] rounded-full overflow-hidden flex p-[1px] gap-0.5">
                    <div style={{ width: '90%' }} className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300 rounded-l-full shadow-[0_0_6px_rgba(6,182,212,0.6)]" title="在线 90%" />
                    <div style={{ width: '8%' }} className="h-full bg-slate-400" title="离线 8%" />
                    <div style={{ width: '2%' }} className="h-full bg-rose-500 rounded-r-full shadow-[0_0_6px_rgba(244,63,94,0.6)]" title="故障 2%" />
                  </div>
                </div>

                {/* 3 Status Cards */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {/* 在线 */}
                  <div className="p-2 rounded-xl bg-[#05112e]/90 border border-cyan-500/30 flex flex-col items-center hover:border-cyan-400/60 transition-all">
                    <div className="w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-1 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                      <Monitor className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] text-slate-300">在线正常</span>
                    <span className="text-sm font-mono font-bold text-cyan-300 mt-0.5">2600</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.2 rounded mt-0.5">90%</span>
                  </div>

                  {/* 离线 */}
                  <div className="p-2 rounded-xl bg-[#05112e]/90 border border-slate-700/60 flex flex-col items-center hover:border-slate-500/60 transition-all">
                    <div className="w-6 h-6 rounded-md bg-slate-900/80 border border-slate-600 flex items-center justify-center text-slate-300 mb-1">
                      <MonitorOff className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] text-slate-300">离线失联</span>
                    <span className="text-sm font-mono font-bold text-slate-200 mt-0.5">232</span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold bg-slate-800/60 px-1.5 py-0.2 rounded mt-0.5">8%</span>
                  </div>

                  {/* 故障 */}
                  <div className="p-2 rounded-xl bg-[#05112e]/90 border border-rose-500/30 flex flex-col items-center hover:border-rose-400/60 transition-all">
                    <div className="w-6 h-6 rounded-md bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-1 shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                      <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <span className="text-[11px] text-slate-300">告警故障</span>
                    <span className="text-sm font-mono font-bold text-rose-300 mt-0.5">57</span>
                    <span className="text-[10px] font-mono text-rose-400 font-semibold bg-rose-950/60 px-1.5 py-0.2 rounded mt-0.5">2%</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: 本月多维告警频次分析 (设备数据 - 调序至左侧第二位紧随运行态势) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">本月多维告警频次分析</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      告警总量: 385件
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：件</span>
                </div>

                {/* 极坐标同心半环发光光弧 (Radial Polar Arcs with Center Badge) */}
                <div className="flex-1 flex flex-col justify-between py-1 min-h-0">
                  <div className="h-28 w-full relative flex items-center justify-center">
                    <svg viewBox="0 0 200 125" className="w-full h-full">
                      {[
                        { label: '设备故障', val: 100, r: 85, color: '#06b6d4' },
                        { label: '周界入侵', val: 75, r: 72, color: '#3b82f6' },
                        { label: '其它', val: 75, r: 59, color: '#8b5cf6' },
                        { label: '环境异常', val: 50, r: 46, color: '#ec4899' },
                        { label: '人员黑名单', val: 50, r: 33, color: '#f59e0b' },
                        { label: '消防告警', val: 35, r: 20, color: '#ef4444' },
                      ].map((arc, aIdx) => {
                        const totalArcLen = Math.PI * arc.r;
                        const fillLen = (arc.val / 100) * totalArcLen;
                        const pathData = `M ${100 - arc.r} 110 A ${arc.r} ${arc.r} 0 0 1 ${100 + arc.r} 110`;
                        return (
                          <g key={aIdx}>
                            <path
                              d={pathData}
                              fill="none"
                              stroke="#0c2354"
                              strokeWidth="5"
                              strokeLinecap="round"
                            />
                            <path
                              d={pathData}
                              fill="none"
                              stroke={arc.color}
                              strokeWidth="5"
                              strokeDasharray={`${fillLen} ${totalArcLen}`}
                              strokeLinecap="round"
                              className="hover:stroke-width-[7] transition-all cursor-pointer"
                            />
                          </g>
                        );
                      })}
                      {/* Center Core Node & Label */}
                      <circle cx="100" cy="110" r="14" fill="#06122d" stroke="#06b6d4" strokeWidth="1.5" />
                      <circle cx="100" cy="110" r="5" fill="#06b6d4" />
                      <text x="100" y="104" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="sans-serif">总告警</text>
                      <text x="100" y="122" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">385</text>
                    </svg>
                  </div>

                  {/* 2-Row x 3-Col Micro Stat Grid */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-[#163a76]/60 text-[10px] font-mono">
                    {[
                      { label: '设备故障', val: 100, color: '#06b6d4' },
                      { label: '周界入侵', val: 75, color: '#3b82f6' },
                      { label: '其它事件', val: 75, color: '#8b5cf6' },
                      { label: '环境异常', val: 50, color: '#ec4899' },
                      { label: '人员预警', val: 50, color: '#f59e0b' },
                      { label: '消防告警', val: 35, color: '#ef4444' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1 rounded-md bg-[#05112e] border border-[#14366e]/70 hover:border-cyan-500/50 transition-colors">
                        <span className="flex items-center gap-1 truncate text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="truncate text-[10px]">{item.label}</span>
                        </span>
                        <span className="font-bold text-white ml-1 text-xs">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 3: 空间网格告警多发区排行 (设备数据 - 调序至左侧第三位与告警分析承接) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">空间网格告警多发区排行</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-amber-950/80 text-amber-300 border border-amber-500/40 rounded">
                      高发: T1楼宇
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：次</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 pt-0.5 font-mono max-h-48">
                  {spatialRankings.map((item, idx) => {
                    const maxVal = 28;
                    const pct = Math.min(100, Math.round((item.count / maxVal) * 100));
                    const isTop3 = idx < 3;
                    return (
                      <div key={item.rank} className="flex items-center gap-2 text-xs group py-0.5">
                        <div className="flex items-center gap-1.5 w-16 shrink-0">
                          <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold font-mono ${
                            idx === 0 ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
                            idx === 1 ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_8px_rgba(6,182,212,0.6)]' :
                            idx === 2 ? 'bg-blue-400 text-slate-950 font-black shadow-[0_0_8px_rgba(96,165,250,0.6)]' :
                            'bg-[#0b245c] text-cyan-300 border border-[#184284]'
                          }`}>
                            {item.rank}
                          </span>
                          <span className="text-slate-200 font-sans font-medium text-[11px] truncate" title={item.location}>
                            {item.location}
                          </span>
                        </div>

                        <div className="flex-1 h-2.5 bg-[#05112e] rounded-full overflow-hidden border border-[#14366e]/70 p-[1px]">
                          <div 
                            style={{ width: `${pct}%` }} 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isTop3 
                                ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.6)]' 
                                : 'bg-gradient-to-r from-blue-700 to-cyan-500'
                            }`} 
                          />
                        </div>

                        <span className="w-12 text-right font-mono text-cyan-300 font-bold text-[11px] shrink-0">
                          {item.count} 次
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===================== CENTER AREA (IMMERSIVE DIGITAL TWIN SPACE) ===================== */}
        <div className="flex-1 flex flex-col justify-between relative px-2 py-1">
          {/* Top spacer */}
          <div className="h-6" />

          {/* Center Bottom Floating HUD Buttons (Trapezoids) */}
          <div className="flex items-center justify-center gap-2.5 z-20 pointer-events-auto pb-2">
            {[
              { id: '设备数据', label: '设备数据' },
              { id: '人流数据', label: '人流数据' },
              { id: '车流数据', label: '车流数据' },
              { id: '能耗数据', label: '能耗数据' },
              { id: '环境数据', label: '环境数据' },
              { id: '安全数据', label: '安全数据' },
              { id: '空间数据', label: '空间数据' },
            ].map((hud) => {
              const isActive = activeHudTab === hud.id;
              return (
                <button
                  key={hud.id}
                  onClick={() => setActiveHudTab(hud.id)}
                  className={`px-4 py-1.5 text-xs font-bold tracking-wider rounded-lg transition-all shadow-xl backdrop-blur-md ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)] border border-cyan-300 scale-105'
                      : 'bg-[#06173a]/85 hover:bg-[#0c265e] text-cyan-300 border border-[#1c458a]'
                  }`}
                >
                  {hud.label}
                </button>
              );
            })}
          </div>

          {/* Active HUD Detail Card Overlay */}
          <div className="absolute bottom-16 left-6 z-20 p-3 rounded-xl bg-[#061638]/90 backdrop-blur-md border border-[#1b4388] text-xs space-y-1 shadow-2xl pointer-events-auto">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>园区数字孪生实时感知：{activeHudTab}</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              {activeHudTab === '设备数据' && '在线率: 90% | 运行负荷: 正常 | 2889 台智能传感器实时通信'}
              {activeHudTab === '人流数据' && '园区实时在场人员: 4,210 人 | 热力集中: A座研发大厦与中庭'}
              {activeHudTab === '车流数据' && '园区总车位: 600位 | 空闲车位: 122位 | 占有率: 81.3% | 高峰: 8:00-10:00 (60车次/h)'}
              {activeHudTab === '能耗数据' && '全域实时负荷: 840 kW | 本月电耗 500 kWh (环比 -41%) | 本月水耗 220 m³ (环比 -30%) 绿色微电网'}
              {activeHudTab === '环境数据' && '全域感知节点: 100点 | 温湿度正常率: 65%/25% | 排水节点: 8/10无积水 (2点抽排中) | PM2.5 18 μg/m³ 优良'}
              {activeHudTab === '安全数据' && '安防巡更完成率: 100% | 电子围栏周界防范布防完毕'}
              {activeHudTab === '空间数据' && '空间利用率: 88.5% | 共享会议室占用: 18/24 间'}
            </div>
          </div>
        </div>

        {/* ===================== RIGHT COLUMN (WIDTH ~ 340px) ===================== */}
        <div className="w-84 xl:w-96 flex flex-col gap-3 shrink-0 pointer-events-auto">
          {activeHudTab === '空间数据' ? (
            <>
              {/* CARD 4: 楼栋楼层物联感知终端分布榜 (原右上 [楼栋楼层设备总数排名] - 保持T1-1F 199/风机, T1-2F 99/风机, T1-3F 89/风机, T1-4F 76/摄像头, T1-5F 56/摄像头, T1-6F 43/门禁) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">楼栋楼层物联感知终端分布榜</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <Layers className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      物联终端分布
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：个</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-4 bg-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[11px] font-bold border border-[#1d4c94]">
                  <div>排行</div>
                  <div>楼栋楼层</div>
                  <div>设备总数</div>
                  <div>最多设备类型</div>
                </div>

                {/* 6 Rows from screenshot */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs font-mono">
                  {[
                    { rank: 1, floor: 'T1-1F', count: 199, mainType: '风机' },
                    { rank: 2, floor: 'T1-2F', count: 99, mainType: '风机' },
                    { rank: 3, floor: 'T1-3F', count: 89, mainType: '风机' },
                    { rank: 4, floor: 'T1-4F', count: 76, mainType: '摄像头' },
                    { rank: 5, floor: 'T1-5F', count: 56, mainType: '摄像头' },
                    { rank: 6, floor: 'T1-6F', count: 43, mainType: '门禁' },
                  ].map((row) => (
                    <div 
                      key={row.rank} 
                      className="grid grid-cols-4 items-center text-center py-1 px-1 hover:bg-[#0c2452] transition-colors"
                    >
                      <div className="flex justify-center">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                          row.rank === 1 ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.8)]' :
                          row.rank === 2 ? 'bg-cyan-500 text-black' :
                          row.rank === 3 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {row.rank}
                        </span>
                      </div>
                      <div className="text-slate-200 font-sans font-semibold text-xs">{row.floor}</div>
                      <div className="font-extrabold text-cyan-400 text-xs">{row.count}</div>
                      <div className="flex justify-center">
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-sans font-bold text-[10px]">
                          {row.mainType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 5: 重点空间单元建筑面积分布排行 (原左下 [空间面积排行] 调序至右中 - 保留 2022/455, 3032/435, 2042/412, 1055/400, 3011/455) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">重点空间单元建筑面积分布排行</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-blue-950/80 text-blue-300 border border-blue-500/40 rounded">
                      面积体量
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：m²</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-5 bg-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[10.5px] font-bold border border-[#1d4c94]">
                  <div>排名</div>
                  <div>空间室号</div>
                  <div>所在楼栋</div>
                  <div>总面积</div>
                  <div>空间类型</div>
                </div>

                {/* 5 Rows matching screenshot */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs font-mono">
                  {[
                    { rank: 1, room: '2022室', building: 'T2', area: '455m²', type: '出租空间' },
                    { rank: 2, room: '3032室', building: 'T3', area: '435m²', type: '出租空间' },
                    { rank: 3, room: '2042室', building: 'T2', area: '412m²', type: '出租空间' },
                    { rank: 4, room: '1055室', building: 'T1', area: '400m²', type: '出租空间' },
                    { rank: 5, room: '3011室', building: 'T3', area: '455m²', type: '出租空间' },
                  ].map((row) => (
                    <div 
                      key={row.rank} 
                      className="grid grid-cols-5 items-center text-center py-1.5 px-1 hover:bg-[#0c2452] transition-colors"
                    >
                      <div className="flex justify-center">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                          row.rank === 1 ? 'bg-amber-500 text-black' :
                          row.rank === 2 ? 'bg-cyan-500 text-black' :
                          row.rank === 3 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {row.rank}
                        </span>
                      </div>
                      <div className="font-sans text-cyan-300 text-[11px] font-medium">{row.room}</div>
                      <div className="text-slate-300 text-[11px] font-mono">{row.building}</div>
                      <div className="font-extrabold text-cyan-400 text-[11px]">{row.area}</div>
                      <div className="font-sans text-slate-300 text-[10px]">{row.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 6: 本月空间单元异常告警频次榜 (原右下 [本月空间告警总数排名] - 保留 2022/56/故障, 3032/55/故障, 2042/34/故障, 1055/23/故障, 3011/18/故障) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">本月空间单元异常告警频次榜</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-rose-950/80 text-rose-300 border border-rose-500/40 rounded flex items-center gap-1">
                      <AlertOctagon className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
                      异常风险流
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：告警次数</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-5 bg-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[10.5px] font-bold border border-[#1d4c94]">
                  <div>排名</div>
                  <div>空间室号</div>
                  <div>所在楼栋</div>
                  <div>告警次数</div>
                  <div>最多告警类型</div>
                </div>

                {/* 5 Rows matching screenshot */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs font-mono">
                  {[
                    { rank: 1, room: '2022室', building: 'T2', count: 56, type: '设备故障' },
                    { rank: 2, room: '3032室', building: 'T3', count: 55, type: '设备故障' },
                    { rank: 3, room: '2042室', building: 'T2', count: 34, type: '设备故障' },
                    { rank: 4, room: '1055室', building: 'T1', count: 23, type: '设备故障' },
                    { rank: 5, room: '3011室', building: 'T3', count: 18, type: '设备故障' },
                  ].map((row) => (
                    <div 
                      key={row.rank} 
                      className="grid grid-cols-5 items-center text-center py-1.5 px-1 hover:bg-[#0c2452] transition-colors"
                    >
                      <div className="flex justify-center">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                          row.rank === 1 ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(244,63,94,0.8)]' :
                          row.rank === 2 ? 'bg-amber-500 text-black' :
                          row.rank === 3 ? 'bg-cyan-500 text-black' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {row.rank}
                        </span>
                      </div>
                      <div className="font-sans text-cyan-300 text-[11px] font-medium">{row.room}</div>
                      <div className="text-slate-300 text-[11px] font-mono">{row.building}</div>
                      <div className="font-extrabold text-rose-400 text-[11px]">{row.count}</div>
                      <div className="flex justify-center">
                        <span className="px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-sans font-bold text-[9.5px]">
                          {row.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeHudTab === '安全数据' ? (
            <>
              {/* CARD 4: 安防告警闭环处置效率 (原右中 [本月告警处理率] 调序至右上，图表更改为240°赛博半环仪表盘与双KPI对比) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">安防告警闭环处置效率</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                      处置完成率 80%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：告警次数</span>
                </div>

                {/* 240° Semi-circular Holographic Dial Gauge + Center Percent Pill (80% / 500 / 400 / 100) */}
                <div className="flex items-center justify-around flex-1 min-h-[110px] py-1">
                  {/* Left Dial Gauge */}
                  <div className="relative w-28 h-24 flex items-center justify-center">
                    <svg viewBox="0 0 100 85" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="rateDialGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0284c7" />
                          <stop offset="60%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>

                      {/* Outer calibrated tick orbit */}
                      <path
                        d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                        fill="none"
                        stroke="#0e2a56"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                        fill="none"
                        stroke="#1e3a6a"
                        strokeWidth="2"
                        strokeDasharray="2 6"
                      />

                      {/* Active Progress Arc (80% of 240° = 192° -> dashoffset) */}
                      <path
                        d="M 18.82 66 A 36 36 0 1 1 81.18 66"
                        fill="none"
                        stroke="url(#rateDialGrad)"
                        strokeWidth="7"
                        strokeDasharray="120.6 226.2"
                        strokeLinecap="round"
                        className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                      />
                      {/* Active Tip Pip at 80% */}
                      <circle cx="75" cy="28" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
                    </svg>

                    {/* Center Percentage Display */}
                    <div className="absolute top-5 flex flex-col items-center">
                      <span className="text-2xl font-black font-mono text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                        80<span className="text-xs font-normal">%</span>
                      </span>
                      <span className="text-[9px] text-slate-400">完成率</span>
                    </div>
                  </div>

                  {/* Right Status KPI Breakdown List (告警总数: 500, 处理总数: 400, 未处理总数: 100) */}
                  <div className="flex-1 space-y-1.5 pl-2 font-mono">
                    <div className="p-1.5 rounded-lg bg-[#05112e]/80 border border-[#14366e] flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-sans">告警总数</span>
                      <span className="font-extrabold text-cyan-300 text-sm">500 <span className="text-[9px] text-slate-400 font-sans">次</span></span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-300 font-sans font-medium">处理总数</span>
                      <span className="font-extrabold text-emerald-400 text-sm">400 <span className="text-[9px] text-emerald-300/80 font-sans">次</span></span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                      <span className="text-[11px] text-amber-300 font-sans font-medium">未处理总数</span>
                      <span className="font-extrabold text-amber-400 text-sm">100 <span className="text-[9px] text-amber-300/80 font-sans">次</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 5: 近30日告警风险等级分层 (原右下 [近30天告警等级分析] 调序至右中，图表更改为立体级联矩阵与发光条) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">近30日告警风险等级分层</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-red-950/80 text-red-300 border border-red-500/40 rounded">
                      风险评估
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：告警次数</span>
                </div>

                {/* 3-Tier Layered Level Gauge Cards (紧急 30% 20, 重要 30% 20, 告警 40% 28 - Total 68) */}
                <div className="flex-1 flex flex-col justify-around py-1 space-y-2">
                  {[
                    { level: '紧急告警', pct: 30, count: 20, badgeBg: 'bg-red-950 text-red-300 border-red-500/60', barGrad: 'from-red-600 via-rose-500 to-amber-400', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
                    { level: '重要告警', pct: 30, count: 20, badgeBg: 'bg-amber-950 text-amber-300 border-amber-500/60', barGrad: 'from-amber-500 via-yellow-400 to-cyan-400', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.4)]' },
                    { level: '一般告警', pct: 40, count: 28, badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-500/60', barGrad: 'from-cyan-600 via-teal-400 to-emerald-300', glow: 'shadow-[0_0_8px_rgba(6,182,212,0.4)]' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-[#05112e]/80 border border-[#14366e] flex flex-col gap-1 hover:border-cyan-400/50 transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold font-sans border ${item.badgeBg}`}>
                          {item.level}
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-300 font-bold">{item.count} 次</span>
                          <span className="text-cyan-300 font-extrabold text-sm">{item.pct}%</span>
                        </div>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="h-2.5 w-full bg-[#020b1f] rounded-full overflow-hidden p-[1px] relative border border-[#163a76]/60">
                        <div 
                          style={{ width: `${item.pct}%` }} 
                          className={`h-full rounded-full bg-gradient-to-r ${item.barGrad} ${item.glow} transition-all duration-700 relative`}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 6: 全天候告警时段分布与月均趋势 (原左下 [告警时间段分析] 调序至右下, 图表更改为微气象双曲线与高峰发光标注) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">全天候告警时段分布与月均趋势</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      时段调峰
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10.5px] font-mono">
                    <span className="text-cyan-400 font-bold">平均每月: 15次</span>
                    <span className="text-slate-400">单位: (次)</span>
                  </div>
                </div>

                {/* Dual-Tone Spline Envelope Curve (Peak ~27 at 10h, monthly avg baseline at 15) */}
                <div className="relative flex-1 min-h-[110px] flex flex-col justify-end pt-2 pb-1">
                  <div className="relative w-full h-[115px]">
                    <svg viewBox="0 0 320 115" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="safeTimeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines (0, 5, 10, 15, 20, 25, 30) */}
                      {[12, 26, 40, 54, 68, 82, 96].map((y, idx) => (
                        <line 
                          key={y} 
                          x1="28" y1={y} 
                          x2="295" y2={y} 
                          stroke="#14366e" 
                          strokeWidth="0.6" 
                          strokeDasharray="2 2" 
                          opacity="0.4" 
                        />
                      ))}

                      {/* Monthly Benchmark Dashed Line at 15 times (y = 54) */}
                      <line x1="28" y1="54" x2="295" y2="54" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.9" />

                      {/* Y-axis labels */}
                      <text x="24" y="15" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">30</text>
                      <text x="24" y="29" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">25</text>
                      <text x="24" y="43" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">20</text>
                      <text x="24" y="57" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="end" fontFamily="monospace">15</text>
                      <text x="24" y="71" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">10</text>
                      <text x="24" y="85" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">5</text>
                      <text x="24" y="99" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">0</text>

                      {/* Area Fill */}
                      <path
                        d="M 38 82 Q 58 68, 78 82 T 118 70 T 158 24 T 198 56 T 238 56 T 278 28 L 278 96 L 38 96 Z"
                        fill="url(#safeTimeGrad)"
                      />

                      {/* Spline Curve Line */}
                      <path
                        d="M 38 82 Q 58 68, 78 82 T 118 70 T 158 24 T 198 56 T 238 56 T 278 28"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]"
                      />

                      {/* Peak Badge Callout at 10h (x=158, y=24) */}
                      <g transform="translate(135, 6)">
                        <rect x="0" y="0" width="48" height="12" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="0.8" className="shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                        <text x="24" y="9" fill="#38bdf8" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">10时 27次 峰值</text>
                        <polygon points="24,12 21,15 27,15" fill="#38bdf8" />
                      </g>

                      {/* X-axis Hours */}
                      {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map((h, idx) => (
                        <text
                          key={h}
                          x={38 + idx * 22}
                          y="108"
                          fill={h === 10 ? '#38bdf8' : '#94a3b8'}
                          fontWeight={h === 10 ? 'bold' : 'normal'}
                          fontSize="8"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {h}
                        </text>
                      ))}
                      <text x="296" y="108" fill="#64748b" fontSize="8" textAnchor="start" fontFamily="sans-serif">(月/时)</text>
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : activeHudTab === '环境数据' ? (
            <>
              {/* CARD 1: 地面雨水液位与排水积水预警 (原地面面积水监测 - 调序至顶部位置，升级双曲流体水球图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">地面雨水液位与排水积水预警</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <Droplets className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      10个排水感知点
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：监测点</span>
                </div>

                {/* Dual Hydro Crystal Spheres (Exact prototype data 8 正常无积水 / 2 异常有积水) */}
                <div className="flex items-center justify-around flex-1 min-h-[110px] py-1">
                  {/* Sphere 1: 8 正常无积水 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                          <clipPath id="envNormClip">
                            <circle cx="50" cy="50" r="38" />
                          </clipPath>
                          <linearGradient id="envNormGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#0e3a75" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                        <circle cx="50" cy="50" r="38" fill="#05173b" stroke="#06b6d4" strokeWidth="2" filter="drop-shadow(0 0 8px rgba(6,182,212,0.4))" />
                        
                        <g clipPath="url(#envNormClip)">
                          <path d="M 10 60 Q 30 52, 50 58 T 90 56 L 90 100 L 10 100 Z" fill="url(#envNormGrad)" />
                          <path d="M 10 60 Q 30 52, 50 58 T 90 56" fill="none" stroke="#a5f3fc" strokeWidth="1.5" opacity="0.9" />
                        </g>

                        <text x="50" y="52" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
                          8
                        </text>
                      </svg>
                    </div>
                    <div className="mt-1 text-center">
                      <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        正常无积水
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">8个节点安全</div>
                    </div>
                  </div>

                  {/* Sphere 2: 2 异常有积水 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                          <clipPath id="envAbnormClip">
                            <circle cx="50" cy="50" r="38" />
                          </clipPath>
                          <linearGradient id="envAbnormGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#78350f" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
                        <circle cx="50" cy="50" r="38" fill="#1c0d02" stroke="#f59e0b" strokeWidth="2" filter="drop-shadow(0 0 10px rgba(245,158,11,0.5))" />

                        <g clipPath="url(#envAbnormClip)">
                          <path d="M 10 52 Q 30 42, 50 48 T 90 44 L 90 100 L 10 100 Z" fill="url(#envAbnormGrad)" />
                          <path d="M 10 52 Q 30 42, 50 48 T 90 44" fill="none" stroke="#fef08a" strokeWidth="1.5" opacity="0.9" />
                        </g>

                        <text x="50" y="52" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
                          2
                        </text>
                      </svg>
                    </div>
                    <div className="mt-1 text-center">
                      <div className="text-xs text-amber-400 font-bold flex items-center gap-1 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        异常有积水
                      </div>
                      <div className="text-[10px] text-amber-300/80 font-mono">2个排水泵联动中</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Capsule Strip (Exact prototype text) */}
                <div className="mt-1 flex items-center justify-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/60 via-[#1a0f02]/80 to-amber-950/60 border border-amber-500/40 text-[11px] font-mono shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <span className="text-amber-300 font-medium">
                    本月积水异常: <span className="text-white font-extrabold text-xs">2/10</span> 点
                  </span>
                </div>
              </div>

              {/* CARD 2: 空间网格节点温度场高阶排行 (原空间温度排行 - 调序至中间位置，升级热场高阶排行表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">空间网格节点温度场高阶排行</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-red-950/80 text-red-300 border border-red-500/40 rounded flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-red-400 animate-pulse" />
                      超温预警
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">按温度排序</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-4 bg-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[11px] font-bold border border-[#1d4c94]">
                  <div>排行</div>
                  <div>监测位置</div>
                  <div>温度值</div>
                  <div>状态</div>
                </div>

                {/* 6 Ranked Thermal Location Rows (Exact prototype data) */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs font-mono">
                  {[
                    { rank: 1, location: '3栋锅炉房', temp: '32℃', status: '过高', isWarn: true },
                    { rank: 2, location: '1栋B1东侧', temp: '25℃', status: '正常', isWarn: false },
                    { rank: 3, location: '2栋1F东侧', temp: '24℃', status: '正常', isWarn: false },
                    { rank: 4, location: '2栋2F东侧', temp: '23℃', status: '正常', isWarn: false },
                    { rank: 5, location: '1栋1F西侧', temp: '23℃', status: '正常', isWarn: false },
                    { rank: 6, location: '3栋1F东侧', temp: '22℃', status: '正常', isWarn: false },
                  ].map((row) => (
                    <div 
                      key={row.rank} 
                      className={`grid grid-cols-4 items-center text-center py-1.5 px-1 transition-colors ${
                        row.isWarn ? 'bg-red-950/40 border-l-2 border-red-500' : 'hover:bg-[#0c2452]'
                      }`}
                    >
                      <div className="flex justify-center">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          row.rank === 1 ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' :
                          row.rank === 2 ? 'bg-cyan-600 text-white' :
                          row.rank === 3 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {row.rank}
                        </span>
                      </div>
                      <div className="font-sans text-slate-200 text-xs font-medium truncate px-1">
                        {row.location}
                      </div>
                      <div className={`font-bold ${row.isWarn ? 'text-red-400 font-extrabold text-sm' : 'text-cyan-300'}`}>
                        {row.temp}
                      </div>
                      <div className="flex justify-center">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-sans font-bold ${
                          row.isWarn 
                            ? 'bg-red-900/80 text-red-200 border border-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]' 
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: 环境微气候异常阻断与诊断流水 (原最新环境异常情况 - 升级流水表单图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">环境微气候异常阻断与诊断流水</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-rose-950/80 text-rose-300 border border-rose-500/40 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      实时推流
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">更新中</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-4 bg-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[11px] font-bold border border-[#1d4c94]">
                  <div>告警类型</div>
                  <div>所在位置</div>
                  <div>值名称</div>
                  <div>异常值</div>
                </div>

                {/* 5 Real-time Alarm Rows (Exact prototype data) */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs font-mono">
                  {[
                    { type: '温度异常', location: 'T2-1F-1102', name: '温度', value: '38℃', valColor: 'text-red-400' },
                    { type: '湿度异常', location: 'T2-1F-1103', name: '湿度', value: '80%', valColor: 'text-rose-400' },
                    { type: '温度异常', location: 'T2-1F-1103', name: '温度', value: '38℃', valColor: 'text-red-400' },
                    { type: '空气质量异常', location: 'T2-1F-1104', name: 'MP2.5', value: '1200ppm', valColor: 'text-purple-400' },
                    { type: '液位异常', location: 'T2-1F-1102', name: '液位', value: '90%', valColor: 'text-amber-400' },
                  ].map((row, idx) => (
                    <div 
                      key={idx} 
                      className="grid grid-cols-4 items-center text-center py-1.5 px-1 hover:bg-[#0c2452] transition-colors"
                    >
                      <div className="font-sans text-xs">
                        <span className="px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold text-[10px]">
                          {row.type}
                        </span>
                      </div>
                      <div className="text-slate-300 text-xs font-mono">{row.location}</div>
                      <div className="font-sans text-slate-200">{row.name}</div>
                      <div className={`font-bold text-xs ${row.valColor}`}>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeHudTab === '能耗数据' ? (
            <>
              {/* CARD 1: 全域水资源集约利用监测 (原水能消耗统计 - 升级双曲流体水球图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">全域水资源集约利用监测</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                      <Droplets className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      智能水网
                    </span>
                  </div>
                  {/* Bracket Style Top Highlight: 昨日水耗 12 m³ */}
                  <div className="flex items-center text-[11px] font-mono">
                    <span className="text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border-l-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                      昨日水耗: <span className="text-white font-extrabold text-xs">12</span> <span className="text-cyan-300 text-[10px]">m³</span>
                    </span>
                  </div>
                </div>

                {/* Fluid Crystal Hydro-Sphere Gauge (双曲动态水能流体球与智能水力感知核心) */}
                <div className="relative flex-1 min-h-[105px] flex items-center justify-center py-1">
                  <div className="w-full h-full max-h-[120px] relative flex items-center justify-center">
                    <svg viewBox="0 0 240 120" className="w-full h-full">
                      <defs>
                        <clipPath id="sphereClip">
                          <circle cx="120" cy="60" r="46" />
                        </clipPath>
                        <linearGradient id="hydroWaterGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                          <stop offset="60%" stopColor="#0284c7" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="hydroWaterGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
                        </linearGradient>
                        <radialGradient id="sphereHousingGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="70%" stopColor="#071d47" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                        </radialGradient>
                      </defs>

                      {/* Calibrated Outer Ring with Degree Marks */}
                      <circle cx="120" cy="60" r="54" fill="none" stroke="#0e3a75" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                      <circle cx="120" cy="60" r="49" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.8" />
                      
                      {/* Degree ticks at 0, 90, 180, 270 */}
                      <line x1="120" y1="5" x2="120" y2="10" stroke="#38bdf8" strokeWidth="1.5" />
                      <line x1="120" y1="110" x2="120" y2="115" stroke="#38bdf8" strokeWidth="1.5" />
                      <line x1="65" y1="60" x2="70" y2="60" stroke="#38bdf8" strokeWidth="1.5" />
                      <line x1="170" y1="60" x2="175" y2="60" stroke="#38bdf8" strokeWidth="1.5" />

                      {/* Sphere Container */}
                      <circle cx="120" cy="60" r="46" fill="url(#sphereHousingGlow)" stroke="#38bdf8" strokeWidth="2" filter="drop-shadow(0px 0px 8px rgba(6,182,212,0.4))" />

                      {/* Masked Liquid Waves inside Sphere */}
                      <g clipPath="url(#sphereClip)">
                        {/* Background subtle fluid wave */}
                        <path
                          d="M 60 70 Q 80 62, 100 68 T 140 68 T 180 64 L 180 120 L 60 120 Z"
                          fill="url(#hydroWaterGrad2)"
                          className="opacity-70"
                        />
                        {/* Foreground primary undulating fluid wave */}
                        <path
                          d="M 60 66 Q 85 58, 110 65 T 150 63 T 180 67 L 180 120 L 60 120 Z"
                          fill="url(#hydroWaterGrad1)"
                        />
                        {/* Wave crest highlight foam line */}
                        <path
                          d="M 60 66 Q 85 58, 110 65 T 150 63 T 180 67"
                          fill="none"
                          stroke="#a5f3fc"
                          strokeWidth="1.5"
                          opacity="0.9"
                        />
                        {/* Specular glass reflection on top dome */}
                        <ellipse cx="120" cy="28" rx="28" ry="12" fill="#ffffff" opacity="0.08" />
                      </g>

                      {/* Center Digital Metrics Overlay */}
                      <text x="120" y="54" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
                        220
                      </text>
                      <text x="120" y="67" fill="#67e8f9" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        m³ 实时水储
                      </text>
                    </svg>

                    {/* HUD Side Readouts */}
                    <div className="absolute left-3 top-2 bg-[#040e28]/80 border border-cyan-500/30 rounded px-1.5 py-0.5 text-[9px] font-mono text-cyan-300">
                      <div>瞬时流速: <span className="text-white font-bold">4.2 m³/h</span></div>
                      <div className="text-[8px] text-slate-400">管网水压: 0.38 MPa</div>
                    </div>
                    <div className="absolute right-3 bottom-2 bg-[#040e28]/80 border border-blue-500/30 rounded px-1.5 py-0.5 text-[9px] font-mono text-blue-300 text-right">
                      <div>管网平衡: <span className="text-white font-bold">99.4%</span></div>
                      <div className="text-[8px] text-slate-400">无渗漏异常</div>
                    </div>
                  </div>
                </div>

                {/* Bottom 3 KPI Metric Cards (from prototype) */}
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {/* 本月水耗 */}
                  <div className="rounded-xl p-2 bg-gradient-to-br from-cyan-950/80 to-[#0c2758]/80 border border-cyan-500/40 text-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                    <div className="text-[10px] text-slate-300 mb-0.5 font-sans">本月水耗</div>
                    <div className="font-mono text-xl font-black text-cyan-300 tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                      220
                    </div>
                    <div className="text-[9px] text-cyan-400/80 font-mono">m³</div>
                  </div>

                  {/* 上月水耗 */}
                  <div className="rounded-xl p-2 bg-gradient-to-br from-blue-950/80 to-[#0a1e45]/80 border border-blue-500/30 text-center">
                    <div className="text-[10px] text-slate-300 mb-0.5 font-sans">上月水耗</div>
                    <div className="font-mono text-xl font-black text-blue-300 tracking-tight">
                      300
                    </div>
                    <div className="text-[9px] text-blue-400/80 font-mono">m³</div>
                  </div>

                  {/* 本月环比 */}
                  <div className="rounded-xl p-2 bg-gradient-to-br from-emerald-950/80 to-[#062c3e]/80 border border-emerald-500/40 text-center shadow-[0_0_12px_rgba(16,185,129,0.2)] flex flex-col justify-between">
                    <div className="text-[10px] text-slate-300 mb-0.5 font-sans">本月环比</div>
                    <div className="font-mono text-lg font-black text-emerald-400 flex items-center justify-center gap-0.5 tracking-tight">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      -30%
                    </div>
                    <div className="text-[9px] text-emerald-300/80 font-sans">节水达标</div>
                  </div>
                </div>
              </div>

              {/* CARD 2: 智能水表末端节点用量排行 (原抄表节点水耗排名 - 调序至中间位置，升级动态声纹波纹与流道管网图表) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">智能水表末端节点用量排行</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      超声远传
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位: m³</span>
                </div>

                {/* 5-Tier Hydro-Pulse Acoustic Wave Ripple Flow Lines (Exact prototype data) */}
                <div className="flex-1 flex flex-col justify-around py-1 space-y-1.5">
                  {[
                    { rank: 1, name: '1栋2号水表', value: 88, max: 88, badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black', waveColor: '#f59e0b', waveGrad: 'from-amber-500/40 via-cyan-500/60 to-cyan-400', path: 'M 0 10 Q 15 2, 30 10 T 60 10 T 90 10 T 120 10 T 150 10' },
                    { rank: 2, name: '1栋3号水表', value: 67, max: 88, badgeBg: 'bg-gradient-to-r from-cyan-400 to-teal-300 text-black', waveColor: '#22d3ee', waveGrad: 'from-cyan-500/40 via-blue-500/60 to-blue-400', path: 'M 0 10 Q 15 4, 30 10 T 60 10 T 90 10 T 120 10 T 150 10' },
                    { rank: 3, name: '1栋4号水表', value: 56, max: 88, badgeBg: 'bg-gradient-to-r from-blue-600 to-sky-400 text-white', waveColor: '#38bdf8', waveGrad: 'from-blue-600/40 via-sky-500/50 to-cyan-400', path: 'M 0 10 Q 15 5, 30 10 T 60 10 T 90 10 T 120 10 T 150 10' },
                    { rank: 4, name: '1栋5号水表', value: 44, max: 88, badgeBg: 'bg-slate-700 text-slate-200 border border-slate-500', waveColor: '#60a5fa', waveGrad: 'from-slate-600/40 via-blue-600/50 to-cyan-600', path: 'M 0 10 Q 15 6, 30 10 T 60 10 T 90 10 T 120 10 T 150 10' },
                    { rank: 5, name: '1栋6号水表', value: 22, max: 88, badgeBg: 'bg-slate-800 text-slate-300 border border-slate-600', waveColor: '#94a3b8', waveGrad: 'from-slate-700/30 via-slate-600/40 to-cyan-800', path: 'M 0 10 Q 15 7, 30 10 T 60 10 T 90 10 T 120 10 T 150 10' },
                  ].map((item) => (
                    <div key={item.rank} className="flex items-center gap-2 text-xs">
                      {/* Rank Badge */}
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono shrink-0 ${item.badgeBg}`}>
                        {item.rank}
                      </span>

                      {/* Meter Name */}
                      <span className="w-18 text-slate-200 font-sans text-xs shrink-0 tracking-tight">
                        {item.name}
                      </span>

                      {/* Hydro-Pulse Acoustic Wave Ripple SVG Chart (Replaced plain static icon) */}
                      <div className="flex-1 h-5 relative flex items-center justify-center overflow-hidden bg-[#05112e]/70 border border-[#14366e]/60 rounded-lg px-1">
                        <svg viewBox="0 0 150 20" className="w-full h-full">
                          {/* Background baseline */}
                          <line x1="0" y1="10" x2="150" y2="10" stroke="#102a5c" strokeWidth="1" strokeDasharray="2 2" />
                          {/* Hydro-Pulse Wave Path */}
                          <path
                            d={item.path}
                            fill="none"
                            stroke={item.waveColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                          {/* Pulse Dot at end */}
                          <circle cx="145" cy="10" r="2.5" fill={item.waveColor} className="animate-ping opacity-75" />
                          <circle cx="145" cy="10" r="2" fill="#ffffff" />
                        </svg>
                      </div>

                      {/* Value Metric */}
                      <span className="w-12 text-right font-mono text-cyan-300 font-bold text-xs shrink-0">
                        {item.value} <span className="text-[10px] text-slate-400 font-sans">m³</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: 年度水资源阶梯消耗趋势分析 (原水耗趋势 - 调序至底部，升级水动力渐变面积流动波谱) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">年度水资源阶梯消耗趋势分析</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      阶梯配额
                    </span>
                  </div>
                  {/* Selector with 2026年 (近期) & Unit */}
                  <div className="flex items-center gap-2">
                    <select 
                      value={energyWaterYear} 
                      onChange={(e) => setEnergyWaterYear(e.target.value)}
                      className="bg-[#05112e] text-cyan-300 border border-[#1d4c94] rounded px-1.5 py-0.5 text-[11px] font-mono outline-none cursor-pointer hover:border-cyan-400 transition-colors"
                    >
                      <option value="2026">2026年 (近期)</option>
                      <option value="2025">2025年</option>
                    </select>
                    <span className="text-[10px] text-slate-400 font-mono">单位: m³</span>
                  </div>
                </div>

                {/* Upgraded Aquatic Stepped Area Trend & Ripple Surge Chart */}
                <div className="relative flex-1 min-h-[110px] flex flex-col justify-end pt-3 pb-1">
                  {/* SVG Chart Area */}
                  <div className="relative w-full h-[115px]">
                    <svg viewBox="0 0 320 115" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="waterAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.75" />
                          <stop offset="60%" stopColor="#0284c7" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#082f49" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines: 600, 500, 400, 300, 200, 100, 0 */}
                      {[0, 20, 40, 60, 80, 100].map((yPct) => (
                        <line 
                          key={yPct} 
                          x1="28" y1={10 + yPct * 0.85} 
                          x2="295" y2={10 + yPct * 0.85} 
                          stroke="#14366e" 
                          strokeWidth="0.6" 
                          strokeDasharray="2 2" 
                          opacity="0.4" 
                        />
                      ))}

                      {/* Y-axis labels */}
                      <text x="24" y="14" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">600</text>
                      <text x="24" y="31" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">500</text>
                      <text x="24" y="48" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">400</text>
                      <text x="24" y="65" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">300</text>
                      <text x="24" y="82" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">200</text>
                      <text x="24" y="99" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">100</text>

                      {/* Benchmark Horizontal Dashed Line at 210 m³ (height = 95 - (210/600)*85 = 95 - 29.75 = 65.25) */}
                      <line x1="28" y1="65.25" x2="295" y2="65.25" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.9" />

                      {/* Area Fill Curve (Prototype: [180, 220, 150, 190, 240, 390, 520, 580, 310, 410, 560, 210]) */}
                      {/* y points: 95 - (val/600)*85:
                          1: 180 -> 69.5
                          2: 220 -> 63.8
                          3: 150 -> 73.75
                          4: 190 -> 68.1
                          5: 240 -> 61
                          6: 390 -> 39.75
                          7: 520 -> 21.3
                          8: 580 -> 12.8 (Peak)
                          9: 310 -> 51.1
                          10: 410 -> 36.9
                          11: 560 -> 15.7
                          12: 210 -> 65.25
                      */}
                      <path
                        d="M 38 69.5 Q 48 64, 59 63.8 T 80 73.75 T 101 68.1 T 122 61 T 143 39.75 T 164 21.3 T 185 12.8 T 206 51.1 T 227 36.9 T 248 15.7 T 269 65.25 L 269 95 L 38 95 Z"
                        fill="url(#waterAreaGrad)"
                      />

                      {/* Flowing Water Crest Spline Stroke */}
                      <path
                        d="M 38 69.5 Q 48 64, 59 63.8 T 80 73.75 T 101 68.1 T 122 61 T 143 39.75 T 164 21.3 T 185 12.8 T 206 51.1 T 227 36.9 T 248 15.7 T 269 65.25"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />

                      {/* Data Point Dots */}
                      {[
                        { m: 1, val: 180, y: 69.5 },
                        { m: 2, val: 220, y: 63.8 },
                        { m: 3, val: 150, y: 73.75 },
                        { m: 4, val: 190, y: 68.1 },
                        { m: 5, val: 240, y: 61 },
                        { m: 6, val: 390, y: 39.75 },
                        { m: 7, val: 520, y: 21.3 },
                        { m: 8, val: 580, y: 12.8, isPeak: true },
                        { m: 9, val: 310, y: 51.1 },
                        { m: 10, val: 410, y: 36.9 },
                        { m: 11, val: 560, y: 15.7 },
                        { m: 12, val: 210, y: 65.25 },
                      ].map((pt, idx) => {
                        const x = 38 + idx * 21;
                        return (
                          <g key={pt.m}>
                            <circle
                              cx={x}
                              cy={pt.y}
                              r={pt.isPeak ? 4 : 2.5}
                              fill={pt.isPeak ? '#ffffff' : '#38bdf8'}
                              stroke="#0284c7"
                              strokeWidth={pt.isPeak ? 2 : 1}
                              className={pt.isPeak ? 'animate-pulse' : ''}
                            />
                          </g>
                        );
                      })}

                      {/* Benchmark tag on right matching screenshot 210 badge */}
                      <g transform="translate(292, 59)">
                        <rect x="0" y="0" width="26" height="13" rx="2" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
                        <text x="13" y="9.5" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">210</text>
                      </g>

                      {/* Peak Callout Badge above 8月 580 m³ */}
                      <g transform="translate(162, 0)">
                        <rect x="0" y="0" width="46" height="12" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="0.8" className="shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                        <text x="23" y="9" fill="#38bdf8" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">8月 580 峰值</text>
                        {/* Little downward triangle pointer */}
                        <polygon points="23,12 20,15 26,15" fill="#38bdf8" />
                      </g>

                      {/* X-axis Month Numbers */}
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, idx) => (
                        <text
                          key={m}
                          x={38 + idx * 21}
                          y="108"
                          fill={m === 8 ? '#38bdf8' : '#94a3b8'}
                          fontWeight={m === 8 ? 'bold' : 'normal'}
                          fontSize="8.5"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {m}
                        </text>
                      ))}
                      <text x="295" y="108" fill="#64748b" fontSize="8" textAnchor="start" fontFamily="sans-serif">(月)</text>
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : activeHudTab === '车流数据' ? (
            <>
              {/* CARD 1: 车流时间段分析 (车流数据 - 升级为折柱复合态势图样式) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[11px] text-slate-400 font-mono">单位：车次</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white tracking-wide">车流时间段分析</span>
                    <span className="px-1.5 py-0.2 text-[8.5px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">折柱态势</span>
                  </div>
                </div>

                {/* Peak & Low Statistics */}
                <div className="text-[10.5px] font-mono space-y-0.5 my-1 bg-[#05112e]/70 px-2 py-1 rounded-lg border border-[#14366e]/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">高峰时段: <span className="text-cyan-300">8:00-10:00</span></span>
                    <span>峰值: <span className="font-bold text-cyan-400">60车次/h</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">低峰时段: <span className="text-cyan-300">24:00-2:00</span></span>
                    <span>峰值: <span className="font-bold text-cyan-400">10车次/h</span></span>
                  </div>
                </div>

                {/* Cyber Pulse Histogram + Spline Envelope Composite Chart */}
                <div className="flex-1 flex flex-col justify-end pt-1 min-h-0">
                  <div className="w-full h-28 relative">
                    <svg viewBox="0 0 310 100" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="barPulseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
                          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="peakBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                          <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="envelopeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Y-Axis Label */}
                      <text x="2" y="8" fill="#94a3b8" fontSize="7.5" fontFamily="sans-serif">(车次)</text>

                      {/* Horizontal Gridlines */}
                      {[80, 60, 40, 20].map((val) => {
                        const y = 88 - (val / 80) * 76;
                        return (
                          <g key={val}>
                            <text x="18" y={y + 2.5} textAnchor="end" fill="#64748b" fontSize="6.5" fontFamily="monospace">
                              {val}
                            </text>
                            <line x1="22" y1={y} x2="305" y2={y} stroke="#143666" strokeDasharray="2 2" strokeWidth="0.6" opacity="0.6" />
                          </g>
                        );
                      })}
                      {/* Zero baseline */}
                      <line x1="22" y1="88" x2="305" y2="88" stroke="#1d4d8c" strokeWidth="0.8" />
                      <text x="18" y="90" textAnchor="end" fill="#64748b" fontSize="6.5" fontFamily="monospace">0</text>

                      {/* Envelope Area Under Curve */}
                      <path
                        d="M 24 76.6 L 47 69 L 71 73.8 L 94 40.5 L 117 50 L 141 31 L 164 54.8 L 188 51.9 L 211 64.3 L 234 51.9 L 258 35.8 L 281 59.5 L 304 78.5 L 304 88 L 24 88 Z"
                        fill="url(#envelopeGrad)"
                      />

                      {/* 13 Vertical Pulse Beam Bars */}
                      {[
                        { x: 24, y: 76.6, val: 12 },
                        { x: 47, y: 69, val: 20 },
                        { x: 71, y: 73.8, val: 15 },
                        { x: 94, y: 40.5, val: 50 },
                        { x: 117, y: 50, val: 40 },
                        { x: 141, y: 31, val: 60, isPeak: true },
                        { x: 164, y: 54.8, val: 35 },
                        { x: 188, y: 51.9, val: 38 },
                        { x: 211, y: 64.3, val: 25 },
                        { x: 234, y: 51.9, val: 38 },
                        { x: 258, y: 35.8, val: 55 },
                        { x: 281, y: 59.5, val: 30 },
                        { x: 304, y: 78.5, val: 10, isLow: true },
                      ].map((bar, i) => (
                        <g key={i}>
                          {/* Vertical Column */}
                          <rect
                            x={bar.x - 3.5}
                            y={bar.y}
                            width="7"
                            height={88 - bar.y}
                            rx="1.5"
                            fill={bar.isPeak ? 'url(#peakBarGrad)' : 'url(#barPulseGrad)'}
                            className={bar.isPeak ? 'filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : ''}
                          />
                          {/* Top Cap Light */}
                          <line
                            x1={bar.x - 3.5}
                            y1={bar.y}
                            x2={bar.x + 3.5}
                            y2={bar.y}
                            stroke={bar.isPeak ? '#ffffff' : '#38bdf8'}
                            strokeWidth="1.2"
                          />
                          {/* Node Dot */}
                          <circle
                            cx={bar.x}
                            cy={bar.y}
                            r={bar.isPeak ? 3 : 1.8}
                            fill={bar.isPeak ? '#38bdf8' : '#06b6d4'}
                            stroke="#ffffff"
                            strokeWidth={bar.isPeak ? 1.2 : 0.8}
                          />
                        </g>
                      ))}

                      {/* Continuous Trend Line */}
                      <path
                        d="M 24 76.6 L 47 69 L 71 73.8 L 94 40.5 L 117 50 L 141 31 L 164 54.8 L 188 51.9 L 211 64.3 L 234 51.9 L 258 35.8 L 281 59.5 L 304 78.5"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                        className="filter drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                      />

                      {/* Peak Callout Badge at 10h (x=141, y=31) */}
                      <g transform="translate(141, 14)">
                        <rect x="-20" y="0" width="40" height="12" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
                        <text x="0" y="8.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace">
                          60 峰值
                        </text>
                        {/* Downward pointer */}
                        <polygon points="-2,12 2,12 0,16" fill="#0284c7" />
                      </g>
                    </svg>
                  </div>

                  {/* X-Axis Hours Labels */}
                  <div className="flex justify-between items-center pl-5 pr-1 text-[7.5px] font-mono text-slate-400">
                    <span>0</span>
                    <span>2</span>
                    <span>4</span>
                    <span>6</span>
                    <span>8</span>
                    <span>10</span>
                    <span>12</span>
                    <span>14</span>
                    <span>16</span>
                    <span>18</span>
                    <span>20</span>
                    <span>22</span>
                    <span>24 (时)</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: 近七天车位使用率 (车流数据 - 升级为数码光栅阵列柱样式) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[10px] text-slate-400 font-sans">日平均每小时统计一次</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white tracking-wide">近七天车位使用率</span>
                    <span className="px-1.5 py-0.2 text-[8.5px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">光栅阵列</span>
                  </div>
                </div>

                {/* 7-Day Matrix LED Segmented Frequency Columns */}
                <div className="flex-1 flex flex-col justify-end pt-1 min-h-0">
                  <div className="w-full h-32 relative flex items-end">
                    {/* Y-Axis scale (%) */}
                    <div className="flex flex-col justify-between h-24 text-[7px] font-mono text-slate-400 pr-1 pb-4">
                      <span>(%)</span>
                      <span>100</span>
                      <span>80</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>0</span>
                    </div>

                    {/* 7 Columns */}
                    <div className="flex-1 flex items-end justify-between gap-1.5 h-full px-1 border-b border-[#1b3f7a]/60 pb-1">
                      {[
                        { date: '11月1日', pct: 32 },
                        { date: '11月2日', pct: 16 },
                        { date: '11月3日', pct: 52 },
                        { date: '11月4日', pct: 65 },
                        { date: '11月5日', pct: 82, isPeak: true },
                        { date: '11月6日', pct: 46 },
                        { date: '11月7日', pct: 22 },
                      ].map((item, idx) => {
                        // Total 10 segments, each segment = 10%
                        const litCount = Math.round(item.pct / 10);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                            {/* Floating Rate Tag */}
                            <span className={`text-[8px] font-mono font-bold mb-1 transition-all ${
                              item.isPeak ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]' : 'text-cyan-300'
                            }`}>
                              {item.pct}%
                            </span>

                            {/* Matrix Stack of 10 LED Blocks */}
                            <div className="w-full max-w-[18px] bg-[#05112e]/90 rounded-md p-1 border border-[#163b78]/70 flex flex-col-reverse gap-[2px]">
                              {Array.from({ length: 10 }).map((_, segIdx) => {
                                const isLit = segIdx < litCount;
                                // Color ramp based on height
                                let bgClass = 'bg-[#0a1a36]/60 border border-[#143260]/40';
                                if (isLit) {
                                  if (segIdx >= 8) {
                                    bgClass = 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.9)]';
                                  } else if (segIdx >= 5) {
                                    bgClass = 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]';
                                  } else {
                                    bgClass = 'bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.7)]';
                                  }
                                }
                                return (
                                  <div
                                    key={segIdx}
                                    className={`w-full h-[5px] rounded-[1px] transition-all duration-300 ${bgClass}`}
                                  />
                                );
                              })}
                            </div>

                            {/* Date Label with rotation */}
                            <span className="text-[7.5px] text-slate-400 mt-1 font-mono whitespace-nowrap transform -rotate-30 origin-top-left">
                              {item.date}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: 停车时间段分析 (车流数据 - 升级为南丁格尔玫瑰极坐标图) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="px-1.5 py-0.2 text-[8.5px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                    玫瑰极坐标
                  </span>
                  <span className="font-bold text-white tracking-wide">停车时间段分析</span>
                </div>

                <div className="flex items-center gap-2 flex-1 min-h-0 py-1">
                  {/* Nightingale Polar Rose Chart SVG */}
                  <div className="w-36 h-36 relative shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
                      <defs>
                        <radialGradient id="roseCoreGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#040d21" stopOpacity="0.9" />
                        </radialGradient>
                      </defs>

                      {/* Concentric Polar Radar Ring Gridlines */}
                      <circle cx="70" cy="70" r="20" fill="none" stroke="#163868" strokeDasharray="2 2" strokeWidth="0.8" />
                      <circle cx="70" cy="70" r="36" fill="none" stroke="#163868" strokeDasharray="2 2" strokeWidth="0.8" />
                      <circle cx="70" cy="70" r="50" fill="none" stroke="#163868" strokeDasharray="2 2" strokeWidth="0.8" />
                      <circle cx="70" cy="70" r="58" fill="none" stroke="#1d4885" strokeWidth="0.6" opacity="0.6" />

                      {/* 5 Polar Axes Rays */}
                      {[ -90, -18, 54, 126, 198 ].map((deg, i) => {
                        const rad = (deg * Math.PI) / 180;
                        const x2 = 70 + 62 * Math.cos(rad);
                        const y2 = 70 + 62 * Math.sin(rad);
                        return (
                          <line
                            key={i}
                            x1="70"
                            y1="70"
                            x2={x2}
                            y2={y2}
                            stroke="#143666"
                            strokeWidth="0.7"
                            strokeDasharray="2 2"
                          />
                        );
                      })}

                      {/* Rose Petal 1: 0-3小时 (25%, count: 25, R=50, Color: #06b6d4) */}
                      <path
                        d="M 70 56 L 70 20 A 50 50 0 0 1 117.55 54.55 L 83.31 65.67 A 14 14 0 0 0 70 56 Z"
                        fill="#06b6d4"
                        fillOpacity="0.75"
                        stroke="#22d3ee"
                        strokeWidth="1.2"
                        className="hover:fill-opacity-95 transition-all filter drop-shadow-[0_0_6px_rgba(6,182,212,0.6)] cursor-pointer"
                      />

                      {/* Rose Petal 2: 3-12小时 (30%, count: 30, R=58, Color: #3b82f6 - Max) */}
                      <path
                        d="M 83.31 65.67 L 125.16 52.08 A 58 58 0 0 1 104.09 116.92 L 78.23 81.33 A 14 14 0 0 0 83.31 65.67 Z"
                        fill="#3b82f6"
                        fillOpacity="0.8"
                        stroke="#60a5fa"
                        strokeWidth="1.2"
                        className="hover:fill-opacity-95 transition-all filter drop-shadow-[0_0_8px_rgba(59,130,246,0.7)] cursor-pointer"
                      />

                      {/* Rose Petal 3: 12-24小时 (20%, count: 20, R=42, Color: #eab308) */}
                      <path
                        d="M 78.23 81.33 L 94.69 103.98 A 42 42 0 0 1 45.31 103.98 L 61.77 81.33 A 14 14 0 0 0 78.23 81.33 Z"
                        fill="#eab308"
                        fillOpacity="0.75"
                        stroke="#facc15"
                        strokeWidth="1.2"
                        className="hover:fill-opacity-95 transition-all filter drop-shadow-[0_0_6px_rgba(234,179,8,0.6)] cursor-pointer"
                      />

                      {/* Rose Petal 4: 24-72小时 (10%, count: 10, R=30, Color: #f97316) */}
                      <path
                        d="M 61.77 81.33 L 52.37 94.27 A 30 30 0 0 1 41.47 60.73 L 56.68 65.67 A 14 14 0 0 0 61.77 81.33 Z"
                        fill="#f97316"
                        fillOpacity="0.75"
                        stroke="#fb923c"
                        strokeWidth="1.2"
                        className="hover:fill-opacity-95 transition-all filter drop-shadow-[0_0_5px_rgba(249,115,22,0.6)] cursor-pointer"
                      />

                      {/* Rose Petal 5: >72小时 (15%, count: 15, R=36, Color: #22c55e) */}
                      <path
                        d="M 56.68 65.67 L 35.76 58.88 A 36 36 0 0 1 70 34 L 70 56 A 14 14 0 0 0 56.68 65.67 Z"
                        fill="#22c55e"
                        fillOpacity="0.75"
                        stroke="#4ade80"
                        strokeWidth="1.2"
                        className="hover:fill-opacity-95 transition-all filter drop-shadow-[0_0_5px_rgba(34,197,94,0.6)] cursor-pointer"
                      />

                      {/* Center Holographic Hub */}
                      <circle cx="70" cy="70" r="14" fill="url(#roseCoreGlow)" stroke="#38bdf8" strokeWidth="1" />
                      <circle cx="70" cy="70" r="5" fill="#38bdf8" className="animate-pulse" />
                      <circle cx="70" cy="70" r="2" fill="#ffffff" />

                      {/* Callout Percentages */}
                      <text x="102" y="32" fill="#22d3ee" fontSize="7.5" fontWeight="bold">25%</text>
                      <text x="122" y="90" fill="#60a5fa" fontSize="7.5" fontWeight="bold">30%</text>
                      <text x="63" y="118" fill="#facc15" fontSize="7.5" fontWeight="bold">20%</text>
                      <text x="25" y="85" fill="#fb923c" fontSize="7.5" fontWeight="bold">10%</text>
                      <text x="36" y="44" fill="#4ade80" fontSize="7.5" fontWeight="bold">15%</text>
                    </svg>
                  </div>

                  {/* Legend List on Right matching prototype */}
                  <div className="flex-1 space-y-1.5 text-xs font-mono pl-1">
                    {[
                      { name: '0-3小时', count: 25, color: '#06b6d4' },
                      { name: '3-12小时', count: 30, color: '#3b82f6' },
                      { name: '12-24小时', count: 20, color: '#eab308' },
                      { name: '24-72小时', count: 10, color: '#f97316' },
                      { name: '>72小时', count: 15, color: '#22c55e' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm shadow-[0_0_4px]" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                          <span className="text-[10.5px] font-sans">{item.name}</span>
                        </div>
                        <span className="font-bold text-white font-mono text-[11px]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : activeHudTab === '人流数据' ? (
            <>
              {/* CARD 1: 通行人员身份多维结构 (人流数据 - 调序至右侧第一位构建身份画像) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">通行人员身份多维结构</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-purple-950/80 text-purple-300 border border-purple-500/40 rounded">
                      身份画像
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：人</span>
                </div>

                <div className="flex items-center gap-2 flex-1 min-h-0 py-1">
                  {/* Concentric Triple Orbital Arc Gauges */}
                  <div className="w-36 h-36 relative shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
                      <defs>
                        <filter id="arcGlowRight" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* --- Orbit 1 (Outer): 员工 58.5% --- */}
                      <circle cx="80" cy="80" r="58" fill="none" stroke="#2e1065" strokeWidth="8" opacity="0.4" />
                      <circle
                        cx="80" cy="80" r="58"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="8"
                        strokeDasharray="213.2 364.4"
                        strokeLinecap="round"
                        filter="url(#arcGlowRight)"
                        className="transition-all duration-700"
                      />

                      {/* --- Orbit 2 (Middle): 访客 21.2% --- */}
                      <circle cx="80" cy="80" r="44" fill="none" stroke="#083344" strokeWidth="8" opacity="0.4" />
                      <circle
                        cx="80" cy="80" r="44"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="8"
                        strokeDasharray="58.6 276.5"
                        strokeLinecap="round"
                        filter="url(#arcGlowRight)"
                        className="transition-all duration-700"
                      />

                      {/* --- Orbit 3 (Inner): 黑名单 20.3% --- */}
                      <circle cx="80" cy="80" r="30" fill="none" stroke="#4c0519" strokeWidth="8" opacity="0.4" />
                      <circle
                        cx="80" cy="80" r="30"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="8"
                        strokeDasharray="38.3 188.5"
                        strokeLinecap="round"
                        filter="url(#arcGlowRight)"
                        className="transition-all duration-700"
                      />
                    </svg>

                    {/* Center Cyber Hub */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[15px] font-black font-mono text-white leading-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                        940
                      </span>
                      <span className="text-[9px] text-cyan-300 font-sans tracking-wider">
                        通行总计
                      </span>
                    </div>
                  </div>

                  {/* Legend Cards with Progress & Exact Figures */}
                  <div className="flex-1 flex flex-col justify-center gap-2 pl-1">
                    {/* 员工 */}
                    <div className="bg-[#0a1b42]/70 border border-purple-500/30 rounded-lg p-1.5 flex flex-col gap-0.5 hover:border-purple-400/60 transition-all">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
                          <span className="text-slate-200 font-medium text-[11px]">园区员工</span>
                        </div>
                        <span className="font-mono text-purple-300 font-bold text-xs">58.5%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>通行规模</span>
                        <span className="text-white font-semibold">550 人</span>
                      </div>
                    </div>

                    {/* 访客 */}
                    <div className="bg-[#0a1b42]/70 border border-cyan-500/30 rounded-lg p-1.5 flex flex-col gap-0.5 hover:border-cyan-400/60 transition-all">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                          <span className="text-slate-200 font-medium text-[11px]">预约访客</span>
                        </div>
                        <span className="font-mono text-cyan-300 font-bold text-xs">21.2%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>通行规模</span>
                        <span className="text-white font-semibold">200 人</span>
                      </div>
                    </div>

                    {/* 黑名单 */}
                    <div className="bg-[#0a1b42]/70 border border-rose-500/30 rounded-lg p-1.5 flex flex-col gap-0.5 hover:border-rose-400/60 transition-all">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_#fb7185]" />
                          <span className="text-slate-200 font-medium text-[11px]">重点关注</span>
                        </div>
                        <span className="font-mono text-rose-300 font-bold text-xs">20.3%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>通行规模</span>
                        <span className="text-white font-semibold">190 人</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: 人员通行频次与活跃度分析 (原我员通行活跃度分析 - 修正命名与优化排版) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">人员通行频次与活跃度分析</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      频次区间
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">样本基数: 1000人</span>
                </div>

                <div className="flex items-center justify-between text-xs my-1">
                  <span className="text-slate-400 text-[11px]">今日通行频次过滤</span>
                  {/* Interactive Filter Pills */}
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <button 
                      onClick={() => setActivityFilter('low')}
                      className={`px-2 py-0.5 rounded transition-all font-bold ${
                        activityFilter === 'low' 
                          ? 'bg-amber-500 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                          : 'bg-amber-600/30 text-amber-300 hover:bg-amber-600/50'
                      }`}
                    >
                      低频 ≤4
                    </button>
                    <button 
                      onClick={() => setActivityFilter('mid')}
                      className={`px-2 py-0.5 rounded transition-all font-bold ${
                        activityFilter === 'mid' 
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.6)]' 
                          : 'bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50'
                      }`}
                    >
                      常态 4&lt;x≤8
                    </button>
                    <button 
                      onClick={() => setActivityFilter('high')}
                      className={`px-2 py-0.5 rounded transition-all font-bold ${
                        activityFilter === 'high' 
                          ? 'bg-sky-500 text-slate-950 shadow-[0_0_8px_rgba(14,165,233,0.6)]' 
                          : 'bg-sky-600/30 text-sky-300 hover:bg-sky-600/50'
                      }`}
                    >
                      高频 &gt;8
                    </button>
                  </div>
                </div>

                {/* 10 People Icons Row & Slider */}
                <div className="my-auto py-2">
                  <div className="flex items-center justify-between px-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isRed = num <= (activityFilter === 'low' ? 3 : activityFilter === 'mid' ? 6 : 8);
                      return (
                        <div key={num} className="flex flex-col items-center">
                          <svg 
                            viewBox="0 0 24 30" 
                            className={`w-5 h-7 transition-colors ${
                              isRed 
                                ? 'text-red-500 filter drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]' 
                                : 'text-cyan-400 filter drop-shadow-[0_0_4px_rgba(6,182,212,0.6)]'
                            }`}
                            fill="currentColor"
                          >
                            <circle cx="12" cy="5" r="4" />
                            <path d="M 6 12 C 6 10, 18 10, 18 12 L 17 22 L 15 22 L 14 29 L 10 29 L 9 22 L 7 22 Z" />
                          </svg>
                        </div>
                      );
                    })}
                  </div>

                  {/* Horizontal Slider Line with Knob */}
                  <div className="relative mt-2 mx-3 h-1.5 bg-[#0b245c] rounded-full">
                    <div 
                      style={{ width: activityFilter === 'low' ? '30%' : activityFilter === 'mid' ? '60%' : '80%' }} 
                      className="h-full bg-gradient-to-r from-red-500 to-cyan-400 rounded-full" 
                    />
                    <div 
                      style={{ left: activityFilter === 'low' ? '30%' : activityFilter === 'mid' ? '60%' : '80%' }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-white shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    />
                  </div>
                </div>

                {/* Bottom Stat Metrics */}
                <div className="flex items-baseline justify-between pt-2 border-t border-[#163a76]/60">
                  <div className="text-sm font-bold font-mono text-slate-200">
                    <span className="text-cyan-400 font-extrabold">{activityFilter === 'low' ? '300' : activityFilter === 'mid' ? '600' : '800'}</span>/1000 <span className="text-xs text-slate-400 font-sans">人</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-xs text-slate-400 font-sans">活跃达标率</span>
                    <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]">
                      {activityFilter === 'low' ? '30%' : activityFilter === 'mid' ? '60%' : '80%'}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 3: 通道拦截与异常预警流水 (原通行异常实时记录 - 优化排版与标题) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">通道拦截与异常预警流水</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-rose-950/80 text-rose-300 border border-rose-500/40 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      阻断流水
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">实时更新</span>
                </div>

                {/* Table Header Strip */}
                <div className="grid grid-cols-4 bg-gradient-to-r from-[#0d2a63] via-[#123880] to-[#0d2a63] text-cyan-300 text-center py-1.5 rounded-t-lg text-[11px] font-bold border border-[#1d4c94]">
                  <div>预警设备</div>
                  <div>空间位置</div>
                  <div>异常原因</div>
                  <div>告警时间</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-[#163872]/60 border-x border-b border-[#1d4c94]/70 rounded-b-lg flex-1 overflow-y-auto bg-[#05112c]/80 text-xs">
                  {[
                    { device: '3栋大堂通道闸', location: 'T3-1F', reason: '无效卡', time: '08:12:12' },
                    { device: '3栋大堂通道闸', location: 'T3-1F', reason: '无效卡', time: '08:12:11' },
                    { device: '3栋大堂通道闸', location: 'T3-1F', reason: '无效卡', time: '08:12:10' },
                    { device: '3栋大堂通道闸', location: 'T3-1F', reason: '无效卡', time: '08:12:09' },
                    { device: '3栋大堂通道闸', location: 'T3-1F', reason: '无效卡', time: '08:12:08' },
                  ].map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 items-center text-center py-2 hover:bg-[#0c224f]/60 transition-colors">
                      <span className="text-slate-300 font-sans text-[11px] truncate px-1">{item.device}</span>
                      <span className="font-mono text-cyan-300 text-[11px]">{item.location}</span>
                      <div className="flex justify-center">
                        <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 font-sans font-bold text-[10px] shadow-[0_0_6px_rgba(244,63,94,0.4)]">
                          {item.reason}
                        </span>
                      </div>
                      <span className="font-mono text-slate-300 text-[11px]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* CARD 1: 核心感知设备分类分布 (设备数据 - 调序至右侧第一位构建资产台账) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">核心感知设备分类分布</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      8大类终端
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：台</span>
                </div>

                {/* 极坐标南丁格尔玫瑰图 + 结构化图例矩阵 */}
                <div className="flex items-center gap-2 flex-1 min-h-0">
                  <div className="w-36 h-36 relative shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 140 140" className="w-full h-full">
                      {/* Concentric Polar Grid Rings */}
                      <circle cx="70" cy="70" r="18" fill="none" stroke="#163e7c" strokeWidth="0.8" strokeDasharray="2,2" />
                      <circle cx="70" cy="70" r="34" fill="none" stroke="#163e7c" strokeWidth="0.8" strokeDasharray="2,2" />
                      <circle cx="70" cy="70" r="50" fill="none" stroke="#163e7c" strokeWidth="0.8" />
                      
                      {/* Polar Cross Axis lines */}
                      <line x1="10" y1="70" x2="130" y2="70" stroke="#163e7c" strokeWidth="0.5" />
                      <line x1="70" y1="10" x2="70" y2="130" stroke="#163e7c" strokeWidth="0.5" />

                      {/* Rose Petals (8 sectors with variable radius) */}
                      {[
                        { r: 58, angle: -90, color: '#06b6d4', name: '摄像头' },
                        { r: 38, angle: -45, color: '#3b82f6', name: '门禁' },
                        { r: 36, angle: 0, color: '#8b5cf6', name: '空气质量' },
                        { r: 32, angle: 45, color: '#ec4899', name: '温湿度' },
                        { r: 27, angle: 90, color: '#eab308', name: '车行闸机' },
                        { r: 24, angle: 135, color: '#22c55e', name: '人行闸机' },
                        { r: 30, angle: 180, color: '#f97316', name: '周界主机' },
                        { r: 31, angle: 225, color: '#64748b', name: '其它' },
                      ].map((petal, pIdx) => {
                        const radStart = (petal.angle - 20) * (Math.PI / 180);
                        const radEnd = (petal.angle + 20) * (Math.PI / 180);
                        const x1 = 70 + petal.r * Math.cos(radStart);
                        const y1 = 70 + petal.r * Math.sin(radStart);
                        const x2 = 70 + petal.r * Math.cos(radEnd);
                        const y2 = 70 + petal.r * Math.sin(radEnd);
                        const pathData = `M 70 70 L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${petal.r} ${petal.r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
                        return (
                          <path
                            key={pIdx}
                            d={pathData}
                            fill={petal.color}
                            fillOpacity="0.75"
                            stroke={petal.color}
                            strokeWidth="1.2"
                            className="hover:fill-opacity-100 transition-all cursor-pointer"
                          />
                        );
                      })}

                      {/* Center Core Glowing Node */}
                      <circle cx="70" cy="70" r="10" fill="#07132f" stroke="#06b6d4" strokeWidth="1.5" />
                      <circle cx="70" cy="70" r="4" fill="#06b6d4" />
                    </svg>
                  </div>

                  {/* Upgraded Structured Legend Matrix */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] pr-1 max-h-36">
                    {categoryData.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between px-2 py-1 rounded-md bg-[#05112e]/70 border border-[#15386f]/50 hover:border-cyan-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                          <span className="truncate text-slate-200 text-[10.5px] font-sans">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono shrink-0">
                          <span className="text-white font-bold text-xs">{item.count}</span>
                          <span className="text-cyan-400 text-[10px] w-10 text-right font-semibold">{item.pct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 2: 设备运行役龄与健康评估 (设备数据 - 调序至右侧第二位与分类分布衔接) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">设备运行役龄与健康评估</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-blue-950/80 text-blue-300 border border-blue-500/40 rounded">
                      基准寿命 8年
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono">役龄评估: 良好</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1 py-1 rounded-lg bg-[#05112e]/60 border border-[#14366e]/40">
                  <span className="text-[11px]">全网设备平均役龄</span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-cyan-400 font-extrabold text-sm drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                      4 年 0 月
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">(50% 设计寿命)</span>
                  </div>
                </div>

                {/* 纵向发光立体柱阵 */}
                <div className="flex-1 flex flex-col justify-end pt-1 min-h-0">
                  <div className="flex items-end justify-between gap-1.5 h-28 px-1 border-b border-[#1b3f7a]/60 pb-1">
                    {lifecycleData.map((item, idx) => {
                      const heightPercent = Math.min(100, Math.round((item.segments / item.totalSegments) * 100));
                      const isHigh = item.segments >= 14;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                          <span className={`text-[9.5px] font-mono font-bold mb-1 whitespace-nowrap ${isHigh ? 'text-amber-300' : 'text-cyan-300'}`}>
                            {item.duration.replace('年', 'Y').replace('月', 'M')}
                          </span>

                          <div className="w-full max-w-[24px] h-20 bg-[#05112e] rounded-t-md relative flex items-end overflow-hidden border border-[#163b78]/50">
                            <div 
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full bg-gradient-to-t ${isHigh ? 'from-amber-600 via-amber-400 to-amber-200' : 'from-blue-600 via-cyan-500 to-cyan-300'} rounded-t-md transition-all duration-500 relative shadow-[0_0_8px_rgba(6,182,212,0.4)] group-hover:brightness-125`}
                            >
                              <div className="absolute top-0 inset-x-0 h-1 bg-white/80 rounded-t-sm" />
                            </div>
                          </div>

                          <span className="text-[9.5px] text-slate-300 mt-1 truncate max-w-[44px] text-center font-sans font-medium" title={item.name}>
                            {item.name.slice(0, 3)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Subtitle notes */}
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1 px-1 font-mono">
                    <span>0年起点</span>
                    <span className="text-cyan-400">4年均值线</span>
                    <span className="text-amber-400">8年额定上限</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: 运维工单闭环与响应效率 (原本月工单处理率 - 优化排版与标题) */}
              <div className="bg-[#07173b]/85 backdrop-blur-md border border-[#1b448a]/80 rounded-2xl p-3.5 shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">运维工单闭环与响应效率</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded">
                      综合闭环率 32.5%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">共200单</span>
                </div>

                <div className="grid grid-cols-2 gap-3 flex-1 items-center justify-center min-h-0 py-1">
                  {/* 维修工单 (25%) */}
                  <div className="flex flex-col items-center p-2 rounded-xl bg-[#05112e]/70 border border-cyan-500/20">
                    <span className="text-xs text-slate-200 mb-1 font-sans font-medium">设备维修工单</span>
                    <div className="relative w-18 h-18 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#0f2656"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="3.5"
                          strokeDasharray="25, 100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xs font-bold font-mono text-cyan-300">25%</span>
                        <span className="text-[7.5px] text-slate-400">已闭环</span>
                      </div>
                    </div>
                    <div className="mt-1.5 text-[9.5px] text-slate-300 font-mono space-y-0.5 text-center w-full">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-slate-400">工单总数</span>
                        <span className="font-bold text-white">100单</span>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-cyan-400">已处理数</span>
                        <span className="font-bold text-cyan-300">25单</span>
                      </div>
                    </div>
                  </div>

                  {/* 告警工单 (40%) */}
                  <div className="flex flex-col items-center p-2 rounded-xl bg-[#05112e]/70 border border-amber-500/20">
                    <span className="text-xs text-slate-200 mb-1 font-sans font-medium">设备告警工单</span>
                    <div className="relative w-18 h-18 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#0f2656"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          strokeDasharray="40, 100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xs font-bold font-mono text-amber-300">40%</span>
                        <span className="text-[7.5px] text-slate-400">已闭环</span>
                      </div>
                    </div>
                    <div className="mt-1.5 text-[9.5px] text-slate-300 font-mono space-y-0.5 text-center w-full">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-slate-400">工单总数</span>
                        <span className="font-bold text-white">100单</span>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-amber-400">已处理数</span>
                        <span className="font-bold text-amber-300">40单</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===================== CENTER EMERGENCY FIRE ALARM MODAL DIALOG ===================== */}
      {isFireModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#07132f] border-2 border-red-600 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.7)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header: 消防告警 (5级) */}
            <div className="h-11 bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white font-extrabold text-sm flex items-center justify-between px-5 tracking-widest uppercase shadow">
              <span className="mx-auto pl-6">消防告警（5级）</span>
              <button 
                onClick={handleConfirmAlarm}
                className="text-red-200 hover:text-white p-1 rounded-lg hover:bg-red-700/50 transition-colors"
                title="关闭弹窗"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Header Fields (Exact from Prototype) */}
            <div className="grid grid-cols-6 border-b border-[#1f3f78] bg-[#0c224f] text-center text-xs font-semibold text-slate-200 py-2 font-sans">
              <div>告警设备</div>
              <div>告警时间</div>
              <div>告警位置</div>
              <div>阈值</div>
              <div>监测值</div>
              <div>事件名称</div>
            </div>

            {/* Table Row Content */}
            <div className="grid grid-cols-6 border-b border-[#1f3f78] bg-[#08183c] text-center text-xs text-white py-2.5 font-mono items-center">
              <div className="font-sans text-cyan-300 font-medium">烟感探测器</div>
              <div className="text-slate-300 text-[11px] font-bold">{currentTimeStr}</div>
              <div className="font-sans text-slate-200 font-medium">1栋1楼2012室</div>
              <div className="text-cyan-400 font-bold">1</div>
              <div className="text-red-400 font-bold">1</div>
              <div className="text-red-400 font-sans font-bold">火灾告警</div>
            </div>

            {/* Video Surveillance + Linkage Status Log */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#06112d]">
              {/* Left Video Stream Window */}
              <div className="relative rounded-xl overflow-hidden border border-red-500/70 shadow-lg bg-black h-48 flex items-center justify-center">
                <img
                  src="/public/assets/aistudio/image_9da23a58.png"
                  alt="监控实时画面"
                  className="w-full h-full object-cover object-center filter contrast-125 brightness-110"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-red-400 font-mono text-[10px] flex items-center gap-1.5 border border-red-500/50">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>REC 🔴 摄像头001 [2012室]</span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-cyan-300 font-mono text-[10px]">
                  2026-11-06 {currentTimeStr}
                </div>
              </div>

              {/* Right Automated Linkage Log Text (exact from prototype) */}
              <div className="p-3 rounded-xl bg-[#07173b] border border-[#163a76] text-[11px] font-mono space-y-1.5 overflow-y-auto max-h-48 leading-relaxed">
                <div className="text-cyan-400">视频联动01 启动:正在调取 <span className="text-white font-bold">摄像头001</span> 实时画面...</div>
                <div className="text-cyan-400">门禁联动01 启动:正在打开 <span className="text-white font-bold">消防门01、消防门02...</span></div>
                <div className="text-cyan-400">广播联动01 启动:正在播报 <span className="text-yellow-300 font-bold">人员紧急疏散通知...</span></div>
                <div className="text-cyan-400">信息发布联动01 启动:正在切换 信息屏01、信息屏02 为 <span className="text-emerald-400 font-bold">逃生路线图!</span></div>
                
                <div className="pt-2 border-t border-[#1a448c] space-y-1 text-slate-300">
                  <div className="text-emerald-400">{currentTimeStr} 画面调取成功!</div>
                  <div className="text-cyan-300">门禁联动01 联动指令下发完毕!</div>
                  <div className="text-cyan-300">广播联动01 联动指令下发完毕!</div>
                  <div className="text-cyan-300">信息发布联动01 联动指令下发完毕!</div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Countdown & Confirm Button */}
            <div className="px-6 py-3.5 bg-[#08183c] border-t border-[#1a448c] flex items-center justify-between text-xs">
              <div className="text-slate-300 flex items-center gap-1.5 font-mono">
                <span className="text-red-400 font-bold text-sm">{countdown}</span>
                <span>秒内未确认，则默认为处理</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleConfirmAlarm}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors text-xs"
                >
                  暂缓忽略
                </button>
                <button
                  onClick={handleConfirmAlarm}
                  className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.6)] border border-cyan-400 text-xs flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>确认处理</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
