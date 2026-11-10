/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cpu, 
  Clock, 
  GitBranch, 
  Plus, 
  Power, 
  CheckCircle2, 
  Sliders, 
  Play, 
  Calendar, 
  Zap, 
  Layers, 
  Wind, 
  Sun, 
  Droplets, 
  Gauge, 
  Thermometer, 
  ShieldCheck, 
  Activity, 
  ChevronRight, 
  ChevronDown,
  Lightbulb,
  Fan,
  Edit3,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { OperationMode, ScheduleItem, LinkageRule, DeviceItem } from '../types/ibms';

interface AutomationViewProps {
  modes: OperationMode[];
  schedules: ScheduleItem[];
  rules: LinkageRule[];
  devices?: DeviceItem[];
  onToggleMode: (id: string) => void;
  onToggleSchedule: (id: string) => void;
  onToggleRule: (id: string) => void;
  onTriggerRuleSimulation: (rule: LinkageRule) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  modes,
  schedules,
  rules,
  devices = [],
  onToggleMode,
  onToggleSchedule,
  onToggleRule,
  onTriggerRuleSimulation
}) => {
  // Left menu states: 
  const [activeSubsystem, setActiveSubsystem] = useState<string>('暖通空调');
  const [activeTertiaryItem, setActiveTertiaryItem] = useState<string>('组合式空调');
  const [isHvacExpanded, setIsHvacExpanded] = useState<boolean>(true);
  const [isLightingExpanded, setIsLightingExpanded] = useState<boolean>(true);

  // Mode Management States (Matching image_ae041ec0.png)
  const [activeModeCard, setActiveModeCard] = useState<string>('mode-1');
  const [modeList, setModeList] = useState([
    { id: 'mode-1', name: '节假日模式', isDefault: true, desc: '节假日期间低负荷变频节能运行' },
    { id: 'mode-2', name: '模式二', isDefault: false, desc: '春秋过渡季舒适性温湿度调节' },
    { id: 'mode-3', name: '模式三', isDefault: false, desc: '夏季大客流高峰强冷自控模式' },
  ]);

  // 10 rich cycle plans
  const [cyclePlans, setCyclePlans] = useState([
    { id: 'plan-01', name: '周期计划01 - 晨间预冷启动', startTime: '2026-11-06 06:30:00', endTime: '2026-11-06 08:30:12', checked: false },
    { id: 'plan-02', name: '周期计划02 - 上午标准办公工况', startTime: '2026-11-06 08:30:00', endTime: '2026-11-06 12:00:15', checked: false },
    { id: 'plan-03', name: '周期计划03 - 午间节能恒温运行', startTime: '2026-11-06 12:00:00', endTime: '2026-11-06 13:30:00', checked: false },
    { id: 'plan-04', name: '周期计划04 - 下午高效新风调节', startTime: '2026-11-06 13:30:00', endTime: '2026-11-06 18:00:20', checked: false },
    { id: 'plan-05', name: '周期计划05 - 傍晚过渡换气排风', startTime: '2026-11-06 18:00:00', endTime: '2026-11-06 20:00:10', checked: false },
    { id: 'plan-06', name: '周期计划06 - 夜间深度节能降耗', startTime: '2026-11-06 20:00:00', endTime: '2026-11-07 06:00:00', checked: false },
    { id: 'plan-07', name: '周期计划07 - 地下车库CO2联动换气', startTime: '2026-11-06 07:00:00', endTime: '2026-11-06 22:00:00', checked: false },
    { id: 'plan-08', name: '周期计划08 - 会议中心专场空调预约', startTime: '2026-11-06 14:00:00', endTime: '2026-11-06 16:30:00', checked: false },
    { id: 'plan-09', name: '周期计划09 - 数据机房恒温精密保障', startTime: '2026-11-06 00:00:00', endTime: '2026-11-06 23:59:59', checked: false },
    { id: 'plan-10', name: '周期计划10 - 周末自适应轮换新风', startTime: '2026-11-08 09:00:00', endTime: '2026-11-08 18:00:00', checked: false },
  ]);

  // Modal States
  const [isAddModeModalOpen, setIsAddModeModalOpen] = useState<boolean>(false);
  const [isEditModeModalOpen, setIsEditModeModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isGroupControlModalOpen, setIsGroupControlModalOpen] = useState<boolean>(false);
  const [selectedPlanForGroup, setSelectedPlanForGroup] = useState<any>(null);

  // Form Inputs for Add/Edit Mode
  const [modalModeName, setModalModeName] = useState<string>('');
  const [modalModeDesc, setModalModeDesc] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSetDefaultMode = (id: string) => {
    setModeList(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    const target = modeList.find(m => m.id === id);
    triggerToast(`已成功将 [${target?.name || '模式'}] 设为默认模式`);
  };

  const handleAddModeSubmit = () => {
    if (!modalModeName.trim()) return;
    const newId = `mode-${Date.now()}`;
    setModeList(prev => [...prev, { id: newId, name: modalModeName, isDefault: false, desc: modalModeDesc || '自定义组合式空调运行模式' }]);
    setIsAddModeModalOpen(false);
    setModalModeName('');
    setModalModeDesc('');
    triggerToast(`成功新增组合式空调运行模式: ${modalModeName}`);
  };

  const handleEditModeSubmit = () => {
    if (!modalModeName.trim()) return;
    setModeList(prev => prev.map(m => m.id === activeModeCard ? { ...m, name: modalModeName, desc: modalModeDesc } : m));
    setIsEditModeModalOpen(false);
    triggerToast(`模式修改成功`);
  };

  const handleDeleteMode = () => {
    if (modeList.length <= 1) {
      triggerToast('至少需要保留一个运行模式');
      setIsDeleteModalOpen(false);
      return;
    }
    setModeList(prev => prev.filter(m => m.id !== activeModeCard));
    setActiveModeCard(modeList.find(m => m.id !== activeModeCard)?.id || '');
    setIsDeleteModalOpen(false);
    triggerToast('已成功删除选中模式');
  };

  // 10 Rich Fresh Air Units
  const [fauUnits, setFauUnits] = useState([
    { id: 'fau-1', code: 'B01_F01_003_Canner_00001', name: '1号楼1层新风机组01', power: true, temp: 24.2, co2: 568, freq: 45.0, status: '运行' },
    { id: 'fau-2', code: 'B01_F02_003_Canner_00002', name: '1号楼2层新风机组02', power: true, temp: 24.5, co2: 610, freq: 48.2, status: '运行' },
    { id: 'fau-3', code: 'B01_F03_003_Canner_00003', name: '1号楼3层新风机组03', power: true, temp: 23.9, co2: 590, freq: 46.0, status: '运行' },
    { id: 'fau-4', code: 'B02_F01_003_Canner_00004', name: '2号楼1层新风机组04', power: false, temp: 26.0, co2: 520, freq: 0.0, status: '停机' },
    { id: 'fau-5', code: 'B02_F02_003_Canner_00005', name: '2号楼2层新风机组05', power: true, temp: 23.8, co2: 585, freq: 46.5, status: '运行' },
    { id: 'fau-6', code: 'B02_F03_003_Canner_00006', name: '2号楼3层新风机组06', power: true, temp: 24.1, co2: 605, freq: 47.0, status: '运行' },
    { id: 'fau-7', code: 'B03_F01_003_Canner_00007', name: '3号楼1层新风机组07', power: true, temp: 24.4, co2: 550, freq: 44.5, status: '运行' },
    { id: 'fau-8', code: 'B03_F02_003_Canner_00008', name: '3号楼2层新风机组08', power: true, temp: 24.0, co2: 575, freq: 45.5, status: '运行' },
    { id: 'fau-9', code: 'B03_F03_003_Canner_00009', name: '3号楼3层新风机组09', power: false, temp: 25.8, co2: 510, freq: 0.0, status: '停机' },
    { id: 'fau-10', code: 'B03_F04_003_Canner_00010', name: '3号楼4层新风机组10', power: true, temp: 23.5, co2: 595, freq: 49.0, status: '运行' },
  ]);

  // 8 Supply Fans
  const [supplyFans, setSupplyFans] = useState([
    { id: 'sf-1', name: 'A区地下车库送风机01', freq: 50.0, pressure: 280, power: true },
    { id: 'sf-2', name: 'B区地下车库送风机02', freq: 48.5, pressure: 265, power: true },
    { id: 'sf-3', name: 'C区地下车库送风机03', freq: 51.0, pressure: 290, power: true },
    { id: 'sf-4', name: '1号楼核心筒送风机04', freq: 52.0, pressure: 310, power: true },
    { id: 'sf-5', name: '2号楼核心筒送风机05', freq: 49.5, pressure: 275, power: true },
    { id: 'sf-6', name: '3号楼核心筒送风机06', freq: 50.5, pressure: 285, power: true },
    { id: 'sf-7', name: '会展中心大堂送风机07', freq: 53.0, pressure: 330, power: true },
    { id: 'sf-8', name: '研发大厦裙楼送风机08', freq: 48.0, pressure: 260, power: true },
  ]);

  // Exhaust Fan Filter States
  const [efSearchText, setEfSearchText] = useState<string>('');
  const [efZoneFilter, setEfZoneFilter] = useState<string>('全部');
  const [efStatusFilter, setEfStatusFilter] = useState<string>('全部');

  // 24 Exhaust Fans (排风机与消防排烟机组全覆盖)
  const [exhaustFans, setExhaustFans] = useState([
    { id: 'ef-01', code: 'B00_F01_EF_0001', name: 'A区地下车库平时排风机01', zone: '地下车库', location: 'B1层A区停车场', freq: 48.0, airVolume: '12,500 m³/h', temp: 24.2, status: '运行', mode: 'BAS全自动', power: true },
    { id: 'ef-02', code: 'B00_F01_EF_0002', name: 'B区地下车库平时排风机02', zone: '地下车库', location: 'B1层B区停车场', freq: 48.5, airVolume: '12,800 m³/h', temp: 24.5, status: '运行', mode: 'BAS全自动', power: true },
    { id: 'ef-03', code: 'B00_F02_EF_0003', name: 'C区地下车库平时排风机03', zone: '地下车库', location: 'B2层C区停车场', freq: 50.0, airVolume: '13,200 m³/h', temp: 25.1, status: '运行', mode: 'BAS全自动', power: true },
    { id: 'ef-04', code: 'B00_F02_EF_0004', name: 'D区地下车库防爆排风机04', zone: '地下车库', location: 'B2层D区充电桩专区', freq: 46.5, airVolume: '11,800 m³/h', temp: 26.0, status: '运行', mode: 'CO浓度联动', power: true },
    { id: 'ef-05', code: 'B01_RF_EF_0005', name: '1号楼屋顶主排风机05', zone: '1号楼', location: '1号楼屋顶机房房顶', freq: 55.0, airVolume: '18,500 m³/h', temp: 22.8, status: '运行', mode: '负压恒定', power: true },
    { id: 'ef-06', code: 'B01_F02_EF_0006', name: '1号楼2层办公区排风机06', zone: '1号楼', location: '1号楼2层东侧管井', freq: 45.0, airVolume: '8,600 m³/h', temp: 23.5, status: '运行', mode: '定时控制', power: true },
    { id: 'ef-07', code: 'B01_F05_EF_0007', name: '1号楼5层高管区专用排风机07', zone: '1号楼', location: '1号楼5层西侧管井', freq: 42.0, airVolume: '6,800 m³/h', temp: 22.1, status: '运行', mode: '温感联动', power: true },
    { id: 'ef-08', code: 'B02_RF_EF_0008', name: '2号楼屋顶主排风机08', zone: '2号楼', location: '2号楼屋顶风机房', freq: 52.5, airVolume: '17,200 m³/h', temp: 23.0, status: '运行', mode: 'BAS全自动', power: true },
    { id: 'ef-09', code: 'B02_F03_EF_0009', name: '2号楼3层会议中心排风机09', zone: '2号楼', location: '2号楼3层机房间', freq: 49.0, airVolume: '9,800 m³/h', temp: 24.0, status: '运行', mode: '人流感应', power: true },
    { id: 'ef-10', code: 'B02_F08_EF_0010', name: '2号楼8层机房独立排风机10', zone: '2号楼', location: '2号楼8层数据中心', freq: 50.0, airVolume: '11,000 m³/h', temp: 21.5, status: '运行', mode: '恒温联动', power: true },
    { id: 'ef-11', code: 'B03_RF_EF_0011', name: '3号楼屋顶主排风机11', zone: '3号楼', location: '3号楼屋顶风机房', freq: 54.0, airVolume: '18,000 m³/h', temp: 23.2, status: '运行', mode: 'BAS全自动', power: true },
    { id: 'ef-12', code: 'B03_F04_EF_0012', name: '3号楼4层实验中心排风机12', zone: '3号楼', location: '3号楼4层实验室', freq: 47.5, airVolume: '9,200 m³/h', temp: 22.4, status: '运行', mode: '微负压控制', power: true },
    { id: 'ef-13', code: 'B00_F01_EF_0013', name: '地下B1层主水泵房排风机13', zone: '地下车库', location: '地下B1层水泵房', freq: 48.0, airVolume: '10,500 m³/h', temp: 25.8, status: '运行', mode: '湿度联动', power: true },
    { id: 'ef-14', code: 'B00_F02_EF_0014', name: '地下B2层变配电室排风机14', zone: '地下车库', location: '地下B2层高压配电室', freq: 50.0, airVolume: '14,000 m³/h', temp: 28.6, status: '运行', mode: '温升联动', power: true },
    { id: 'ef-15', code: 'B00_F01_EF_0015', name: '地下B1消防排烟兼排风机15', zone: '地下车库', location: '地下B1层消防防烟分区', freq: 0.0, airVolume: '0 m³/h', temp: 20.0, status: '待机', mode: '消防联动', power: false },
    { id: 'ef-16', code: 'B00_F02_EF_0016', name: '地下B2消防排烟排风机16', zone: '地下车库', location: '地下B2层消防防烟分区', freq: 0.0, airVolume: '0 m³/h', temp: 20.5, status: '待机', mode: '消防联动', power: false },
    { id: 'ef-17', code: 'B04_F01_EF_0017', name: '园区中央餐厅油烟排风机17', zone: '公共与服务区', location: '餐饮中心厨房管井', freq: 46.0, airVolume: '15,500 m³/h', temp: 31.2, status: '运行', mode: '油烟净化联动', power: true },
    { id: 'ef-18', code: 'B04_F01_EF_0018', name: '园区员工食堂次排风机18', zone: '公共与服务区', location: '餐饮中心2楼厨房', freq: 44.5, airVolume: '12,000 m³/h', temp: 29.5, status: '运行', mode: '定时排风', power: true },
    { id: 'ef-19', code: 'B05_F01_EF_0019', name: '会展中心1层高位排风机19', zone: '公共与服务区', location: '会展大厅顶部网架', freq: 51.5, airVolume: '16,800 m³/h', temp: 24.8, status: '运行', mode: '环境CO2联动', power: true },
    { id: 'ef-20', code: 'B05_F02_EF_0020', name: '会展中心2层多功能厅排风机20', zone: '公共与服务区', location: '会展中心2层侧墙', freq: 48.0, airVolume: '13,500 m³/h', temp: 23.9, status: '运行', mode: '活动模式', power: true },
    { id: 'ef-21', code: 'B01_RF_EF_0021', name: '1号楼卫生间集中排风机21', zone: '1号楼', location: '1号楼屋顶副楼井', freq: 45.0, airVolume: '7,800 m³/h', temp: 22.0, status: '运行', mode: '全天候微排', power: true },
    { id: 'ef-22', code: 'B02_RF_EF_0022', name: '2号楼卫生间集中排风机22', zone: '2号楼', location: '2号楼屋顶副楼井', freq: 45.0, airVolume: '7,600 m³/h', temp: 22.3, status: '运行', mode: '全天候微排', power: true },
    { id: 'ef-23', code: 'B00_F02_EF_0023', name: '备用应急防爆排风机23', zone: '公共与服务区', location: '危废暂存间外侧', freq: 0.0, airVolume: '0 m³/h', temp: 19.8, status: '维护', mode: '手动备用', power: false },
    { id: 'ef-24', code: 'B06_F01_EF_0024', name: '园区垃圾中转站除臭排风机24', zone: '公共与服务区', location: '环保处理站', freq: 50.0, airVolume: '14,500 m³/h', temp: 27.4, status: '运行', mode: '除臭离心联动', power: true },
  ]);

  // 10 Indoor Lighting circuits
  const [indoorLights, setIndoorLights] = useState([
    { id: 'l-1', name: '1号楼 1层大堂智能照明回路', brightness: 85, power: true, mode: '自动' },
    { id: 'l-2', name: '1号楼 2层办公区走廊照明', brightness: 70, power: true, mode: '定时' },
    { id: 'l-3', name: '2号楼 1层接待大厅艺术吊灯', brightness: 90, power: true, mode: '手动' },
    { id: 'l-4', name: '2号楼 2层会议室恒照度回路', brightness: 60, power: true, mode: '自动' },
    { id: 'l-5', name: '3号楼 地下车库行车道应急照明', brightness: 100, power: true, mode: '常亮' },
    { id: 'l-6', name: '1号楼 3层高管会议室调光回路', brightness: 75, power: true, mode: '自动' },
    { id: 'l-7', name: '2号楼 3层员工餐厅照明回路', brightness: 80, power: true, mode: '定时' },
    { id: 'l-8', name: '3号楼 1层展厅艺术射灯回路', brightness: 95, power: true, mode: '手动' },
    { id: 'l-9', name: '园区中央连廊景观照明回路', brightness: 85, power: true, mode: '光控' },
    { id: 'l-10', name: '地下车库停车位区域照明回路', brightness: 50, power: true, mode: '雷达感应' },
  ]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#040b1a] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* ===================== LEFT SIDEBAR: 设备自控子菜单 ===================== */}
      <aside className="w-60 bg-[#06122d] border-r border-[#133063] flex flex-col shrink-0">
        <div className="p-3.5 border-b border-[#133063] bg-[#040e24] flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>设备自控系统 (BAS)</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">5个子菜单</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          
          {/* Category 1: 暖通空调 (HVAC) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveSubsystem('暖通空调');
                setIsHvacExpanded(!isHvacExpanded);
              }}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between border ${
                activeSubsystem === '暖通空调'
                  ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                  : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-300" />
                <span>暖通空调</span>
              </div>
              {isHvacExpanded ? <ChevronDown className="w-3.5 h-3.5 text-cyan-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {/* Tertiary Subitems for 暖通空调 */}
            {isHvacExpanded && (
              <div className="pl-6 space-y-1 border-l-2 border-[#163a76] ml-4 my-1">
                {['组合式空调', '新风机', '送风机', '排风机'].map((tert) => {
                  const isActive = activeSubsystem === '暖通空调' && activeTertiaryItem === tert;
                  return (
                    <button
                      key={tert}
                      onClick={() => {
                        setActiveSubsystem('暖通空调');
                        setActiveTertiaryItem(tert);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black shadow-[0_0_10px_rgba(6,182,212,0.6)] border-l-4 border-cyan-300'
                          : 'text-slate-400 hover:text-white hover:bg-[#0c285e]'
                      }`}
                    >
                      <span>{tert}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category 2: 智慧照明 (Smart Lighting) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveSubsystem('智慧照明');
                setIsLightingExpanded(!isLightingExpanded);
                setActiveTertiaryItem('室内照明');
              }}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between border ${
                activeSubsystem === '智慧照明'
                  ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                  : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-300" />
                <span>智慧照明</span>
              </div>
              {isLightingExpanded ? <ChevronDown className="w-3.5 h-3.5 text-cyan-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {isLightingExpanded && (
              <div className="pl-6 space-y-1 border-l-2 border-[#163a76] ml-4 my-1">
                {['室内照明'].map((tert) => {
                  const isActive = activeSubsystem === '智慧照明' && activeTertiaryItem === tert;
                  return (
                    <button
                      key={tert}
                      onClick={() => {
                        setActiveSubsystem('智慧照明');
                        setActiveTertiaryItem(tert);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black shadow-[0_0_10px_rgba(6,182,212,0.6)] border-l-4 border-cyan-300'
                          : 'text-slate-400 hover:text-white hover:bg-[#0c285e]'
                      }`}
                    >
                      <span>{tert}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ===================== RIGHT MAIN CONTENT AREA (Optimized spacing for full screen) ===================== */}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 lg:p-5 bg-[#040b1a] space-y-4">
        
        {toastMessage && (
          <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-1 z-50">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. 组合式空调 (Mode Management with 10 rich cycle plans) */}
        {activeSubsystem === '暖通空调' && activeTertiaryItem === '组合式空调' ? (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="text-cyan-400 font-bold text-sm tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_8px_#22d3ee]" />
                <span className="text-white text-base">模式管理 (组合式空调 - 园区级)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const current = modeList.find(m => m.id === activeModeCard);
                    setModalModeName(current?.name || '');
                    setModalModeDesc(current?.desc || '');
                    setIsEditModeModalOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#082252] hover:bg-[#0c3075] text-cyan-300 border border-cyan-500/50 text-xs font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>模式修改</span>
                </button>

                <button
                  onClick={() => {
                    setModalModeName('');
                    setModalModeDesc('');
                    setIsAddModeModalOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] border border-cyan-400 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>模式新增</span>
                </button>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/50 text-xs font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>模式删除</span>
                </button>
              </div>
            </div>

            {/* Mode Cards Grid */}
            <div className="grid grid-cols-3 gap-4">
              {modeList.map((mode) => {
                const isActive = activeModeCard === mode.id;
                return (
                  <div
                    key={mode.id}
                    onClick={() => setActiveModeCard(mode.id)}
                    className={`relative overflow-hidden rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                      isActive
                        ? 'bg-gradient-to-br from-[#062454] via-[#093273] to-[#041638] border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                        : 'bg-[#05112c]/80 border-[#133063] hover:border-cyan-500/50'
                    }`}
                  >
                    {mode.isDefault && (
                      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                        <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] py-0.5 right-[-35px] top-[12px] w-[100px] text-center shadow">
                          默认
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-base tracking-wide">{mode.name}</h3>
                      <p className="text-slate-400 text-[11px] truncate">{mode.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20">
                      <span className="text-[10px] font-mono text-cyan-300">
                        {mode.isDefault ? '系统默认运行策略' : '可选自定义模式'}
                      </span>
                      {!mode.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefaultMode(mode.id);
                          }}
                          className="px-2.5 py-1 rounded bg-[#030a1c] border border-cyan-500/50 text-cyan-300 text-[10px] font-bold hover:bg-cyan-600 hover:text-white transition-all cursor-pointer"
                        >
                          设为默认
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cycle Plans Table with 10 rich items */}
            <div className="bg-[#05112c]/90 border border-[#133063] rounded-2xl overflow-hidden shadow-xl">
              <div className="max-h-[calc(100vh-22rem)] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d4a]/95 text-cyan-300 font-bold border-b border-[#133063] sticky top-0 z-10">
                    <tr>
                      <th className="px-5 py-3 w-12 text-center">
                        <input 
                          type="checkbox" 
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setCyclePlans(prev => prev.map(p => ({ ...p, checked })));
                          }}
                          className="accent-cyan-400 cursor-pointer" 
                        />
                      </th>
                      <th className="px-4 py-3">序号</th>
                      <th className="px-4 py-3">计划名称</th>
                      <th className="px-4 py-3">开始时间</th>
                      <th className="px-4 py-3">结束时间</th>
                      <th className="px-5 py-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063] font-mono">
                    {cyclePlans.map((plan, idx) => (
                      <tr key={plan.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={plan.checked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setCyclePlans(prev => prev.map(p => p.id === plan.id ? { ...p, checked } : p));
                            }}
                            className="accent-cyan-400 cursor-pointer" 
                          />
                        </td>
                        <td className="px-4 py-3 text-cyan-300 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3 font-sans font-bold text-white">{plan.name}</td>
                        <td className="px-4 py-3 text-cyan-300">{plan.startTime}</td>
                        <td className="px-4 py-3 text-cyan-300">{plan.endTime}</td>
                        <td className="px-5 py-3 text-right font-sans">
                          <button
                            onClick={() => {
                              setSelectedPlanForGroup(plan);
                              setIsGroupControlModalOpen(true);
                            }}
                            className="px-3.5 py-1 rounded-lg bg-[#062454] hover:bg-[#0a3374] text-cyan-300 border border-cyan-500/60 text-xs font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
                          >
                            组控数据
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : activeSubsystem === '暖通空调' && activeTertiaryItem === '新风机' ? (
          /* 2. 新风机 (10 Rich Park-level FAU Units) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_8px_#22d3ee]" />
                <span>园区新风机组集群智能自控监控 (10台全园区覆盖)</span>
              </h3>
              <button onClick={() => triggerToast('全部10台新风机组群控下发成功')} className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow">
                一键下发群控
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2">
              {fauUnits.map((fau, idx) => (
                <div key={fau.id} className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-[#133063] pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{fau.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400">{fau.code}</span>
                    </div>
                    <button
                      onClick={() => {
                        setFauUnits(prev => prev.map(u => u.id === fau.id ? { ...u, power: !u.power, status: !u.power ? '运行' : '停机' } : u));
                        triggerToast(`${fau.name} 开关状态已切换`);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        fau.power ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{fau.power ? '运行中 (ON)' : '已停机 (OFF)'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#030a1c] p-2.5 rounded-xl border border-[#133063]">
                      <span className="text-slate-400 block text-[10px] font-sans">送风温度</span>
                      <span className="text-cyan-300 font-bold text-sm">{fau.temp} ℃</span>
                    </div>
                    <div className="bg-[#030a1c] p-2.5 rounded-xl border border-[#133063]">
                      <span className="text-slate-400 block text-[10px] font-sans">CO2浓度</span>
                      <span className="text-cyan-300 font-bold text-sm">{fau.co2} ppm</span>
                    </div>
                    <div className="bg-[#030a1c] p-2.5 rounded-xl border border-[#133063]">
                      <span className="text-slate-400 block text-[10px] font-sans">变频频率</span>
                      <span className="text-cyan-300 font-bold text-sm">{fau.freq} Hz</span>
                    </div>
                    <div className="bg-[#030a1c] p-2.5 rounded-xl border border-[#133063]">
                      <span className="text-slate-400 block text-[10px] font-sans">运行状态</span>
                      <span className={`${fau.status === '运行' ? 'text-emerald-400' : 'text-slate-400'} font-bold text-sm font-sans`}>{fau.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeSubsystem === '暖通空调' && activeTertiaryItem === '送风机' ? (
          /* 3. 送风机 (8 Supply Fans) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_8px_#22d3ee]" />
                <span>地下车库与各楼栋送风机变频控制 (8台全园区覆盖)</span>
              </h3>
              <button onClick={() => triggerToast('全部送风机群控下发成功')} className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow">
                下发送风群控
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2">
              {supplyFans.map((sf, idx) => (
                <div key={sf.id} className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-[#133063] pb-2">
                    <h4 className="text-sm font-bold text-white truncate max-w-[140px]" title={sf.name}>{sf.name}</h4>
                    <span className="text-[10px] font-mono text-emerald-400">运行中</span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">变频频率:</span>
                      <span className="text-cyan-300 font-bold">{sf.freq} Hz</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">静压反馈:</span>
                      <span className="text-cyan-300 font-bold">{sf.pressure} Pa</span>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast(`${sf.name}：送风变频调节指令已下发`)}
                    className="w-full py-1.5 bg-[#062454] hover:bg-[#0a3374] text-cyan-300 border border-cyan-500/60 rounded-xl text-xs font-bold transition-all"
                  >
                    调节频率
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : activeSubsystem === '暖通空调' && activeTertiaryItem === '排风机' ? (
          /* 4. 排风机 (24 Exhaust Fans - Comprehensive Campus Coverage) */
          <div className="space-y-4">
            {/* Top Stat Cards Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#06122d] border border-cyan-500/40 flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-xs text-slate-400 font-bold">全园区排风设备总数</div>
                  <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">{exhaustFans.length} <span className="text-xs font-sans text-slate-400 font-normal">台</span></div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Fan className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06122d] border border-emerald-500/40 flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-xs text-slate-400 font-bold">正常运行中</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {exhaustFans.filter(f => f.status === '运行').length} <span className="text-xs font-sans text-slate-400 font-normal">台</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06122d] border border-amber-500/40 flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-xs text-slate-400 font-bold">待机 / 消防备用</div>
                  <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                    {exhaustFans.filter(f => f.status === '待机').length} <span className="text-xs font-sans text-slate-400 font-normal">台</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06122d] border border-slate-700 flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-xs text-slate-400 font-bold">检修 / 维护中</div>
                  <div className="text-2xl font-bold font-mono text-slate-300 mt-1">
                    {exhaustFans.filter(f => f.status === '维护').length} <span className="text-xs font-sans text-slate-400 font-normal">台</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400">
                  <Sliders className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter Toolbar & Search Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={efSearchText}
                      onChange={(e) => setEfSearchText(e.target.value)}
                      placeholder="搜索风机名称/编号/位置..."
                      className="w-56 px-3 py-1.5 pl-8 rounded-xl bg-[#030a1c] border border-[#1b448a] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                    />
                    <Fan className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  {/* Zone Filter dropdown */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="font-bold text-slate-400">区域:</span>
                    <select
                      value={efZoneFilter}
                      onChange={(e) => setEfZoneFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-[#030a1c] border border-[#1b448a] text-cyan-300 font-bold text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="全部">全部区域 (24台)</option>
                      <option value="1号楼">1号楼</option>
                      <option value="2号楼">2号楼</option>
                      <option value="3号楼">3号楼</option>
                      <option value="地下车库">地下车库</option>
                      <option value="公共与服务区">公共与服务区</option>
                    </select>
                  </div>

                  {/* Status Filter dropdown */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="font-bold text-slate-400">状态:</span>
                    <select
                      value={efStatusFilter}
                      onChange={(e) => setEfStatusFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-[#030a1c] border border-[#1b448a] text-cyan-300 font-bold text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="全部">全部状态</option>
                      <option value="运行">仅看运行中</option>
                      <option value="待机">仅看待机</option>
                      <option value="维护">仅看维护</option>
                    </select>
                  </div>
                </div>

                {/* Batch Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setExhaustFans(prev => prev.map(f => f.status !== '维护' ? { ...f, power: true, status: '运行', freq: f.freq === 0 ? 50.0 : f.freq } : f));
                      triggerToast('已批量开启全区排风风机');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>一键开启</span>
                  </button>
                  <button
                    onClick={() => {
                      setExhaustFans(prev => prev.map(f => ({ ...f, power: false, status: '待机', freq: 0.0 })));
                      triggerToast('已一键安全停用全区排风');
                    }}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>一键全停</span>
                  </button>
                  <button
                    onClick={() => {
                      setExhaustFans(prev => prev.map(f => f.status !== '维护' ? { ...f, power: true, status: '运行', freq: 50.0 } : f));
                      triggerToast('已一键下发 50Hz 强排风组指令');
                    }}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all"
                  >
                    一键强排 (50Hz)
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Container for 24 Exhaust Fans */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[calc(100vh-17.5rem)] overflow-y-auto pr-2">
              {exhaustFans
                .filter(ef => {
                  const matchSearch = !efSearchText || ef.name.includes(efSearchText) || ef.code.includes(efSearchText) || ef.location.includes(efSearchText);
                  const matchZone = efZoneFilter === '全部' || ef.zone === efZoneFilter;
                  const matchStatus = efStatusFilter === '全部' || ef.status === efStatusFilter;
                  return matchSearch && matchZone && matchStatus;
                })
                .map((ef) => (
                  <div key={ef.id} className={`bg-[#06122d] border rounded-2xl p-4 shadow-xl space-y-3 transition-all ${ef.power ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-[#133063] opacity-85'}`}>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-[#133063] pb-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-snug truncate max-w-[150px]" title={ef.name}>{ef.name}</h4>
                        <div className="text-[10px] font-mono text-cyan-400/80 mt-0.5">{ef.code}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                        ef.status === '运行' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        ef.status === '待机' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        'bg-slate-700/50 text-slate-300 border-slate-600'
                      }`}>
                        {ef.status === '运行' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                        {ef.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span className="font-sans">位置:</span>
                        <span className="text-slate-200 font-sans truncate max-w-[130px]" title={ef.location}>{ef.location}</span>
                      </div>

                      {/* Frequency Adjustment Slider */}
                      <div className="space-y-1 bg-[#030a1c] p-2 rounded-xl border border-[#133063]">
                        <div className="flex justify-between text-slate-300">
                          <span className="font-sans text-[11px]">变频频率:</span>
                          <span className="text-cyan-300 font-bold text-[11px]">{ef.freq.toFixed(1)} Hz</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="60"
                          step="0.5"
                          value={ef.freq}
                          disabled={!ef.power}
                          onChange={(e) => {
                            const newFreq = parseFloat(e.target.value);
                            setExhaustFans(prev => prev.map(item => item.id === ef.id ? { ...item, freq: newFreq } : item));
                          }}
                          className="w-full accent-cyan-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="flex justify-between text-slate-300">
                        <span className="font-sans">风量 / 温度:</span>
                        <span className="text-slate-200">{ef.airVolume} · <span className="text-cyan-300">{ef.temp}℃</span></span>
                      </div>

                      <div className="flex justify-between text-slate-300">
                        <span className="font-sans">控制模式:</span>
                        <span className="text-cyan-300 font-bold">{ef.mode}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const nextPower = !ef.power;
                          setExhaustFans(prev => prev.map(item => {
                            if (item.id === ef.id) {
                              return {
                                ...item,
                                power: nextPower,
                                status: nextPower ? '运行' : '待机',
                                freq: nextPower ? (item.freq === 0 ? 50.0 : item.freq) : 0.0
                              };
                            }
                            return item;
                          }));
                          triggerToast(`${ef.name} 已${nextPower ? '开启运行' : '关机待机'}`);
                        }}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                          ef.power
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{ef.power ? '运行中' : '点击开启'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setExhaustFans(prev => prev.map(item => item.id === ef.id ? { ...item, power: true, status: '运行', freq: 50.0 } : item));
                          triggerToast(`${ef.name} 已设定为 50Hz 强排`);
                        }}
                        className="px-3 py-1.5 bg-[#062454] hover:bg-[#0a3374] text-cyan-300 border border-cyan-500/60 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        强排
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : activeSubsystem === '智慧照明' && activeTertiaryItem === '室内照明' ? (
          /* 5. 室内照明 (10 DALI Circuits) */
          <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#133063] pb-3">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                <span>全园区室内智能照明回路群控 (10大区域全覆盖)</span>
              </h3>
              <button 
                onClick={() => triggerToast('全部10个室内照明回路已执行一键全开')}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                一键全开照明
              </button>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              {indoorLights.map((light, idx) => (
                <div key={light.id} className="p-3.5 rounded-xl bg-[#030a1c] border border-[#133063] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{light.name}</div>
                      <span className="text-[10px] font-mono text-slate-400">回路编码: DALI-CIR-0{idx+1} · 控制模式: {light.mode}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">亮度调光:</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={light.brightness}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setIndoorLights(prev => prev.map(l => l.id === light.id ? { ...l, brightness: val } : l));
                        }}
                        className="w-28 accent-amber-400 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-amber-300 font-bold w-9 text-right">{light.brightness}%</span>
                    </div>

                    <button
                      onClick={() => {
                        setIndoorLights(prev => prev.map(l => l.id === light.id ? { ...l, power: !l.power } : l));
                        triggerToast(`${light.name} 开关状态已切换`);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        light.power ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {light.power ? '已开启 ON' : '已关闭 OFF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeSubsystem === '运行模式' ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-300">运行模式配置中心</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modes.map((mode) => (
                <div key={mode.id} className="p-5 rounded-2xl bg-[#06122d] border border-cyan-500/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{mode.name}</span>
                    <button
                      onClick={() => {
                        onToggleMode(mode.id);
                        triggerToast(`模式 [${mode.name}] 状态已更新`);
                      }}
                      className={`px-3 py-1 rounded text-xs font-bold ${mode.isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                    >
                      {mode.isEnabled ? '生效中' : '启用'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300">{mode.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : activeSubsystem === '定时排程' ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-300">定时排程策略管理</h3>
            <div className="bg-[#06122d] border border-cyan-500/30 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#081d4a] text-cyan-300">
                  <tr>
                    <th className="px-4 py-3">排程名称</th>
                    <th className="px-4 py-3">系统分类</th>
                    <th className="px-4 py-3">时段</th>
                    <th className="px-4 py-3">动作</th>
                    <th className="px-4 py-3 text-right">开关</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#133063] font-mono">
                  {schedules.map((sch) => (
                    <tr key={sch.id} className="hover:bg-[#081b42]">
                      <td className="px-4 py-3 font-sans font-bold text-white">{sch.name}</td>
                      <td className="px-4 py-3 font-sans text-slate-300">{sch.subsystem}</td>
                      <td className="px-4 py-3 text-cyan-300">{sch.timeRange}</td>
                      <td className="px-4 py-3 font-sans text-emerald-400">{sch.action}</td>
                      <td className="px-4 py-3 text-right font-sans">
                        <button onClick={() => onToggleSchedule(sch.id)} className={`px-2.5 py-1 rounded text-xs ${sch.isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {sch.isEnabled ? '启用中' : '已停用'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-300">{activeSubsystem} / {activeTertiaryItem}</h3>
            <p className="text-xs text-slate-400">自控联动策略执行中。</p>
          </div>
        )}

      </main>

      {/* ===================== MODALS ===================== */}
      {isAddModeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#061638] border border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-5 py-4 bg-[#081d4a] border-b border-[#133063] flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>新增组合式空调运行模式</span>
              </h3>
              <button onClick={() => setIsAddModeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">模式名称</label>
                <input
                  type="text"
                  value={modalModeName}
                  onChange={(e) => setModalModeName(e.target.value)}
                  placeholder="例如：冬季深度供暖模式"
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">模式说明与描述</label>
                <textarea
                  value={modalModeDesc}
                  onChange={(e) => setModalModeDesc(e.target.value)}
                  placeholder="请输入该运行模式下的送风、回风控制策略..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-sans resize-none"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 bg-[#040e24] border-t border-[#133063] flex justify-end gap-3">
              <button onClick={() => setIsAddModeModalOpen(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-bold">取消</button>
              <button onClick={handleAddModeSubmit} className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow">确认新增</button>
            </div>
          </div>
        </div>
      )}

      {isEditModeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#061638] border border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-5 py-4 bg-[#081d4a] border-b border-[#133063] flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>修改组合式空调运行模式</span>
              </h3>
              <button onClick={() => setIsEditModeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">模式名称</label>
                <input
                  type="text"
                  value={modalModeName}
                  onChange={(e) => setModalModeName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">模式说明与描述</label>
                <textarea
                  value={modalModeDesc}
                  onChange={(e) => setModalModeDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-sans resize-none"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 bg-[#040e24] border-t border-[#133063] flex justify-end gap-3">
              <button onClick={() => setIsEditModeModalOpen(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-bold">取消</button>
              <button onClick={handleEditModeSubmit} className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow">保存修改</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#061638] border border-red-500/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-5 py-4 bg-red-950/80 border-b border-red-500/40 flex items-center justify-between">
              <h3 className="text-sm font-bold text-red-300 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>确认删除模式</span>
              </h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs text-slate-300 space-y-2">
              <p>您确定要删除当前选中的运行模式吗？删除后将无法恢复，关联的周期计划将自动解绑。</p>
            </div>
            <div className="px-5 py-3.5 bg-[#040e24] border-t border-[#133063] flex justify-end gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-bold">取消</button>
              <button onClick={handleDeleteMode} className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {isGroupControlModalOpen && selectedPlanForGroup && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#061638] border border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-5 py-4 bg-[#081d4a] border-b border-[#133063] flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>组控数据配置 - {selectedPlanForGroup.name}</span>
              </h3>
              <button onClick={() => setIsGroupControlModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="bg-[#030a1c] p-3 rounded-xl border border-[#133063] space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="font-sans">计划时段:</span>
                  <span className="text-cyan-300">{selectedPlanForGroup.startTime} ~ {selectedPlanForGroup.endTime}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-sans">关联组合式空调总数:</span>
                  <span className="text-cyan-400 font-bold">6 台</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-slate-300">组控送风温度设定 (℃)</span>
                  <input type="number" defaultValue={22.5} className="w-24 px-2 py-1 bg-[#030a1c] border border-cyan-500/40 rounded text-cyan-300 text-right font-bold" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-slate-300">冷冻水电动调节阀开度 (%)</span>
                  <input type="number" defaultValue={65.0} className="w-24 px-2 py-1 bg-[#030a1c] border border-cyan-500/40 rounded text-cyan-300 text-right font-bold" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-slate-300">变频风机运行频率 (Hz)</span>
                  <input type="number" defaultValue={48.5} className="w-24 px-2 py-1 bg-[#030a1c] border border-cyan-500/40 rounded text-cyan-300 text-right font-bold" />
                </div>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-[#040e24] border-t border-[#133063] flex justify-end gap-3">
              <button onClick={() => setIsGroupControlModalOpen(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-bold">关闭</button>
              <button 
                onClick={() => {
                  setIsGroupControlModalOpen(false);
                  triggerToast(`${selectedPlanForGroup.name} 组控数据已成功下发至底层DDC控制器`);
                }} 
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow"
              >
                下发组控指令
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
