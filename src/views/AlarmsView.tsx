/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  BellRing, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  MapPin, 
  Flame,
  Check,
  ChevronRight,
  ChevronDown,
  Shield,
  Activity,
  Zap,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Cpu,
  FileText,
  Sliders,
  Plus,
  X,
  User,
  Truck
} from 'lucide-react';
import { AlarmItem, AlarmLevel, AlarmStatus, SubsystemType } from '../types/ibms';
import asianMaleImg from '../assets/images/asian_male_portrait_1794054874770.jpg';
import asianFemaleImg from '../assets/images/asian_female_portrait_1794054893192.jpg';
import asianGlassesImg from '../assets/images/asian_man_glasses_1794054909500.jpg';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onExport?: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  onExport
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
      <div className="flex items-center gap-2">
        <span>总共</span>
        <span className="text-cyan-300 font-bold">{totalItems}</span>
        <span>条</span>
      </div>

      <div className="flex items-center gap-1.5 font-sans">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          上一页
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded cursor-pointer transition-all font-mono ${
              p === currentPage
                ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          下一页
        </button>

        {onExport && (
          <button onClick={onExport} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer font-sans">
            导出数据
          </button>
        )}
      </div>
    </div>
  );
};

interface AlarmsViewProps {
  alarms: AlarmItem[];
  onOpenAlarm: (alarm: AlarmItem) => void;
  onConvertToWorkOrder: (alarm: AlarmItem) => void;
  onBatchConfirm: () => void;
}

export const AlarmsView: React.FC<AlarmsViewProps> = ({
  alarms,
  onOpenAlarm,
  onConvertToWorkOrder,
  onBatchConfirm
}) => {
  // Left menu navigation states unified with MaintenanceView
  const [activeSecondary, setActiveSecondary] = useState<string>('安防告警');
  const [activeTertiary, setActiveTertiary] = useState<string>('人员黑名单告警');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '安防告警': true,
    '环境告警': true,
    '设备告警': true,
    '能耗告警': true,
    '告警处理': true,
  });

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const [toastMessage, setToastMessage] = useState<string>('');
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Sub-page pagination states
  const [blacklistPage, setBlacklistPage] = useState(1);
  const [vehicleBlacklistPage, setVehicleBlacklistPage] = useState(1);
  const [intrusionPage, setIntrusionPage] = useState(1);
  const [perimeterPage, setPerimeterPage] = useState(1);
  const [tempPage, setTempPage] = useState(1);
  const [humidityPage, setHumidityPage] = useState(1);
  const [airPage, setAirPage] = useState(1);
  const [liquidPage, setLiquidPage] = useState(1);
  const [pressurePage, setPressurePage] = useState(1);
  const [faultPage, setFaultPage] = useState(1);
  const [offlinePage, setOfflinePage] = useState(1);
  const [abnormalPage, setAbnormalPage] = useState(1);
  const [energyPage, setEnergyPage] = useState(1);
  const [alarmOrderPage, setAlarmOrderPage] = useState(1);
  const [alarmConfigPage, setAlarmConfigPage] = useState(1);
  const [defaultAlarmPage, setDefaultAlarmPage] = useState(1);

  // Personnel Blacklist Alarms List (25 items)
  const [blacklistAlarms, setBlacklistAlarms] = useState([
    { id: 'bl-1', code: 'B2009OC001DH001', type: '人员黑名单告警', deviceName: '摄像机01', location: 'T1-1F东南角', triggerTime: '2026-11-06 16:00', status: '未处理', snapshot: asianMaleImg },
    { id: 'bl-2', code: 'B2009OC001DH002', type: '人员黑名单告警', deviceName: '摄像机02', location: 'T1-1F西北角', triggerTime: '2026-11-06 14:09', status: '已处理', snapshot: asianFemaleImg },
    { id: 'bl-3', code: 'B2009OC001DH003', type: '人员黑名单告警', deviceName: 'A座主入口闸机A', location: 'T1-1F大堂正门', triggerTime: '2026-11-05 11:20', status: '未处理', snapshot: asianGlassesImg },
    { id: 'bl-4', code: 'B2009OC001DH004', type: '人员黑名单告警', deviceName: '地下车库人行通道', location: 'B1-电梯厅前', triggerTime: '2026-11-05 09:15', status: '已处理', snapshot: asianFemaleImg },
    { id: 'bl-5', code: 'B2009OC001DH005', type: '人员黑名单告警', deviceName: '研发大楼北门摄像机', location: 'T2-1F北侧通道', triggerTime: '2026-11-04 15:40', status: '已处理', snapshot: asianMaleImg },
    { id: 'bl-6', code: 'B2009OC001DH006', type: '人员黑名单告警', deviceName: '访客中心人脸抓拍机', location: 'T1-1F接待大厅', triggerTime: '2026-11-04 10:22', status: '未处理', snapshot: asianGlassesImg },
    { id: 'bl-7', code: 'B2009OC001DH007', type: '人员黑名单告警', deviceName: '货运电梯前室摄像机', location: 'T1-B2卸货区', triggerTime: '2026-11-03 16:50', status: '已处理', snapshot: asianFemaleImg },
    { id: 'bl-8', code: 'B2009OC001DH008', type: '人员黑名单告警', deviceName: '连廊全景摄像机', location: 'T1与T2连廊2F', triggerTime: '2026-11-03 13:10', status: '已处理', snapshot: asianMaleImg },
    { id: 'bl-9', code: 'B2009OC001DH009', type: '人员黑名单告警', deviceName: '东侧围墙球机03', location: '园区东侧边界', triggerTime: '2026-11-02 08:35', status: '未处理', snapshot: asianGlassesImg },
    { id: 'bl-10', code: 'B2009OC001DH010', type: '人员黑名单告警', deviceName: '会议中心VIP通道', location: 'T3-1F贵宾入口', triggerTime: '2026-11-01 19:20', status: '已处理', snapshot: asianFemaleImg },
    { id: 'bl-11', code: 'B2009OC001DH011', type: '人员黑名单告警', deviceName: 'T2首层东大门', location: 'T2-1F大堂正门', triggerTime: '2026-10-31 16:45', status: '已处理', snapshot: asianMaleImg },
    { id: 'bl-12', code: 'B2009OC001DH012', type: '人员黑名单告警', deviceName: '西区员工餐厅通道', location: 'T2-B1餐厅入口', triggerTime: '2026-10-31 12:10', status: '未处理', snapshot: asianGlassesImg },
    { id: 'bl-13', code: 'B2009OC001DH013', type: '人员黑名单告警', deviceName: '高压配电房外巡查机', location: '10kV配电室门前', triggerTime: '2026-10-30 18:25', status: '已处理', snapshot: asianFemaleImg },
    { id: 'bl-14', code: 'B2009OC001DH014', type: '人员黑名单告警', deviceName: '屋顶天台人行出口', location: 'T1-屋顶平台门', triggerTime: '2026-10-30 09:30', status: '未处理', snapshot: asianMaleImg },
    { id: 'bl-15', code: 'B2009OC001DH015', type: '人员黑名单告警', deviceName: '数据中心核心防护区', location: 'T3-3F数据中心门禁', triggerTime: '2026-10-29 21:15', status: '已处理', snapshot: asianGlassesImg },
    { id: 'bl-16', code: 'B2009OC001DH016', type: '人员黑名单告警', deviceName: '行政楼后勤通道', location: 'T1-1F后勤走廊', triggerTime: '2026-10-29 14:00', status: '已处理', snapshot: asianFemaleImg },
    { id: 'bl-17', code: 'B2009OC001DH017', type: '人员黑名单告警', deviceName: '南侧景观庭院人行口', location: '园区南侧人行闸', triggerTime: '2026-10-28 17:50', status: '未处理', snapshot: asianMaleImg },
    { id: 'bl-18', code: 'B2009OC001DH018', type: '人员黑名单告警', deviceName: 'B1多功能宴会厅入口', location: 'T3-B1宴会前厅', triggerTime: '2026-10-28 10:20', status: '已处理', snapshot: asianGlassesImg },
    { id: 'bl-19', code: 'B2009OC001DH019', type: '人员黑名单告警', deviceName: '冷机房外人员抓拍机', location: 'B2制冷站走廊', triggerTime: '2026-10-27 15:10', status: '未处理', snapshot: asianFemaleImg },
    { id: 'bl-20', code: 'B2009OC001DH020', type: '人员黑名单告警', deviceName: '研发大楼5F电梯厅', location: 'T2-5F电梯走廊', triggerTime: '2026-10-27 08:45', status: '已处理', snapshot: asianMaleImg },
    { id: 'bl-21', code: 'B2009OC001DH021', type: '人员黑名单告警', deviceName: '园区西大门侧门', location: '西门人行卡口', triggerTime: '2026-10-26 19:30', status: '已处理', snapshot: asianGlassesImg },
    { id: 'bl-22', code: 'B2009OC001DH022', type: '人员黑名单告警', deviceName: '弱电中心监控室门外', location: 'T1-2F弱电机房', triggerTime: '2026-10-26 11:15', status: '未处理', snapshot: asianFemaleImg },
    { id: 'bl-23', code: 'B2009OC001DH023', type: '人员黑名单告警', deviceName: '地下车库C区电梯前室', location: 'B1-C区电梯厅', triggerTime: '2026-10-25 16:40', status: '已处理', snapshot: asianMaleImg },
    { id: 'bl-24', code: 'B2009OC001DH024', type: '人员黑名单告警', deviceName: '实验室A栋连廊通道', location: 'T3与T2连廊3F', triggerTime: '2026-10-25 13:05', status: '未处理', snapshot: asianGlassesImg },
    { id: 'bl-25', code: 'B2009OC001DH025', type: '人员黑名单告警', deviceName: '档案大楼机密库房门前', location: 'T1-B1档案库室', triggerTime: '2026-10-24 09:20', status: '已处理', snapshot: asianFemaleImg },
  ]);

  // Vehicle Blacklist Alarms List (25 items)
  const [vehicleBlacklistAlarms, setVehicleBlacklistAlarms] = useState([
    { id: 'vbl-1', code: 'B2009OC001DH001', type: '车辆黑名单告警', deviceName: '车牌抓拍摄像机01', location: 'T1-B1东南角', plateNo: '京A·88992', triggerTime: '2026-11-06 16:00', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-2', code: 'B2009OC001DH002', type: '车辆黑名单告警', deviceName: '车牌抓拍摄像机01', location: 'T1-B1西北角', plateNo: '沪B·66541', triggerTime: '2026-11-06 14:09', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-3', code: 'B2009OC001DH003', type: '车辆黑名单告警', deviceName: '北门道闸一体机', location: '园区北大门主入口', plateNo: '粤B·99812', triggerTime: '2026-11-05 11:20', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-4', code: 'B2009OC001DH004', type: '车辆黑名单告警', deviceName: '地下车库出入口2', location: 'B2层坡道口', plateNo: '浙A·33219', triggerTime: '2026-11-05 09:15', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-5', code: 'B2009OC001DH005', type: '车辆黑名单告警', deviceName: '南门车牌抓拍机', location: '园区南门岗亭', plateNo: '苏E·55102', triggerTime: '2026-11-04 15:40', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-6', code: 'B2009OC001DH006', type: '车辆黑名单告警', deviceName: '东侧地下车库入口', location: 'T2大厦地库入口', plateNo: '津C·11883', triggerTime: '2026-11-04 10:22', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-7', code: 'B2009OC001DH007', type: '车辆黑名单告警', deviceName: '西门访客车道抓拍', location: 'T3访客停车场', plateNo: '鲁Q·77231', triggerTime: '2026-11-03 16:50', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-8', code: 'B2009OC001DH008', type: '车辆黑名单告警', deviceName: '物流卸货区抓拍摄像机', location: '物流中心B2', plateNo: '川A·88126', triggerTime: '2026-11-03 13:10', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-9', code: 'B2009OC001DH009', type: '车辆黑名单告警', deviceName: '内部环路卡口摄像机', location: '研发楼环路B段', plateNo: '鄂A·66299', triggerTime: '2026-11-02 08:35', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-10', code: 'B2009OC001DH010', type: '车辆黑名单告警', deviceName: 'VIP专用停车位抓拍', location: 'T1贵宾停车场', plateNo: '闽D·55910', triggerTime: '2026-11-01 19:20', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-11', code: 'B2009OC001DH011', type: '车辆黑名单告警', deviceName: '东区货运道闸抓拍机', location: '东侧卸货通道', plateNo: '豫A·99120', triggerTime: '2026-10-31 15:30', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-12', code: 'B2009OC001DH012', type: '车辆黑名单告警', deviceName: 'B1地面临时停车卡口', location: 'T2大厦南广场', plateNo: '湘A·22019', triggerTime: '2026-10-31 11:15', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-13', code: 'B2009OC001DH013', type: '车辆黑名单告警', deviceName: '园区西北卡口', location: '西北角环路卡口', plateNo: '黑A·77116', triggerTime: '2026-10-30 17:40', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-14', code: 'B2009OC001DH014', type: '车辆黑名单告警', deviceName: '充电桩专区抓拍摄像机', location: 'B1新能源充电区', plateNo: '京B·E9921', triggerTime: '2026-10-30 13:00', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-15', code: 'B2009OC001DH015', type: '车辆黑名单告警', deviceName: 'T3地下车库出口闸机', location: 'B2出口通道', plateNo: '沪A·33190', triggerTime: '2026-10-29 18:20', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-16', code: 'B2009OC001DH016', type: '车辆黑名单告警', deviceName: '消防通道违停抓拍机', location: 'T1西侧消防通道', plateNo: '皖A·66120', triggerTime: '2026-10-29 09:45', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-17', code: 'B2009OC001DH017', type: '车辆黑名单告警', deviceName: '高管专用停车区卡口', location: 'T2-B1高管车位', plateNo: '冀A·88321', triggerTime: '2026-10-28 16:10', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-18', code: 'B2009OC001DH018', type: '车辆黑名单告警', deviceName: '临空物流中心卡口', location: '东侧物流主出口', plateNo: '赣A·55122', triggerTime: '2026-10-28 10:35', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-19', code: 'B2009OC001DH019', type: '车辆黑名单告警', deviceName: '南侧坡道入口摄像头', location: 'B1南坡道口', plateNo: '晋A·11090', triggerTime: '2026-10-27 14:15', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-20', code: 'B2009OC001DH020', type: '车辆黑名单告警', deviceName: '主楼VIP环道车牌抓拍', location: 'T1正门环岛', plateNo: '桂A·99381', triggerTime: '2026-10-27 08:50', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-21', code: 'B2009OC001DH021', type: '车辆黑名单告警', deviceName: '园区东门辅助出入口', location: '东门副道闸', plateNo: '陕A·77210', triggerTime: '2026-10-26 17:05', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-22', code: 'B2009OC001DH022', type: '车辆黑名单告警', deviceName: '地下地库机械车位区', location: 'B2-D机械车位', plateNo: '辽A·22901', triggerTime: '2026-10-26 12:40', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-23', code: 'B2009OC001DH023', type: '车辆黑名单告警', deviceName: '北区洗车房通道', location: '北区配套服务区', plateNo: '云A·66311', triggerTime: '2026-10-25 15:20', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-24', code: 'B2009OC001DH024', type: '车辆黑名单告警', deviceName: '西区大楼地下停车场', location: 'T3-B1车库入口', plateNo: '贵A·88109', triggerTime: '2026-10-25 10:00', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=120&auto=format&fit=crop&q=80' },
    { id: 'vbl-25', code: 'B2009OC001DH025', type: '车辆黑名单告警', deviceName: '园区北侧货梯匝道', location: 'T2-B2卸货通道', plateNo: '琼A·55890', triggerTime: '2026-10-24 16:30', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=120&auto=format&fit=crop&q=80' },
  ]);

  // Intrusion Alarms List (25 items)
  const [intrusionAlarms, setIntrusionAlarms] = useState([
    { id: 'int-1', code: 'B2009OC001DH001', type: '入侵告警', deviceName: '入侵感应器', location: 'T1-B1东南角', triggerTime: '2026-11-06 16:00', status: '未处理', snapshot: asianFemaleImg },
    { id: 'int-2', code: 'B2009OC001DH002', type: '入侵告警', deviceName: '入侵感应器', location: 'T1-B1西北角', triggerTime: '2026-11-06 14:09', status: '已处理', snapshot: asianMaleImg },
    { id: 'int-3', code: 'B2009OC001DH003', type: '入侵告警', deviceName: '红外对射探测器01', location: '园区东侧围墙', triggerTime: '2026-11-05 11:20', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'int-4', code: 'B2009OC001DH004', type: '入侵告警', deviceName: '微波周界感应器', location: 'T2大楼屋顶', triggerTime: '2026-11-05 09:15', status: '已处理', snapshot: asianGlassesImg },
    { id: 'int-5', code: 'B2009OC001DH005', type: '入侵告警', deviceName: '双鉴探测器02', location: '地下车库B2区', triggerTime: '2026-11-04 15:40', status: '已处理', snapshot: asianFemaleImg },
    { id: 'int-6', code: 'B2009OC001DH006', type: '入侵告警', deviceName: '激光对射报警器', location: '园区西侧边界', triggerTime: '2026-11-04 10:22', status: '未处理', snapshot: asianMaleImg },
    { id: 'int-7', code: 'B2009OC001DH007', type: '入侵告警', deviceName: '震动光纤传感器', location: '主水泵房外围', triggerTime: '2026-11-03 16:50', status: '已处理', snapshot: asianGlassesImg },
    { id: 'int-8', code: 'B2009OC001DH008', type: '入侵告警', deviceName: '电子围栏控制器', location: '变配电所外墙', triggerTime: '2026-11-03 13:10', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'int-9', code: 'B2009OC001DH009', type: '入侵告警', deviceName: '红外光栅03', location: '贵宾通道北侧', triggerTime: '2026-11-02 08:35', status: '未处理', snapshot: asianFemaleImg },
    { id: 'int-10', code: 'B2009OC001DH010', type: '入侵告警', deviceName: '入侵感应器04', location: '物流卸货平台', triggerTime: '2026-11-01 19:20', status: '已处理', snapshot: asianMaleImg },
    { id: 'int-11', code: 'B2009OC001DH011', type: '入侵告警', deviceName: '室外微波多相雷达', location: '园区北界围栏', triggerTime: '2026-10-31 16:30', status: '已处理', snapshot: asianGlassesImg },
    { id: 'int-12', code: 'B2009OC001DH012', type: '入侵告警', deviceName: '变电站防护栅栏感知器', location: '10kV变压器外防护网', triggerTime: '2026-10-31 11:00', status: '未处理', snapshot: asianFemaleImg },
    { id: 'int-13', code: 'B2009OC001DH013', type: '入侵告警', deviceName: '天台消防门开门报警器', location: 'T2-屋顶平台', triggerTime: '2026-10-30 18:15', status: '已处理', snapshot: asianMaleImg },
    { id: 'int-14', code: 'B2009OC001DH014', type: '入侵告警', deviceName: '红外对射探测器04', location: '园区南侧栏杆', triggerTime: '2026-10-30 13:40', status: '未处理', snapshot: asianGlassesImg },
    { id: 'int-15', code: 'B2009OC001DH015', type: '入侵告警', deviceName: '地下通风井防盗传感器', location: 'B2地下采光井', triggerTime: '2026-10-29 19:20', status: '已处理', snapshot: asianFemaleImg },
    { id: 'int-16', code: 'B2009OC001DH016', type: '入侵告警', deviceName: '激光幕墙探针', location: '数据中心外立面玻璃', triggerTime: '2026-10-29 08:30', status: '已处理', snapshot: asianMaleImg },
    { id: 'int-17', code: 'B2009OC001DH017', type: '入侵告警', deviceName: '双鉴微波探头09', location: 'T1-B1枪库间外走廊', triggerTime: '2026-10-28 17:10', status: '未处理', snapshot: asianGlassesImg },
    { id: 'int-18', code: 'B2009OC001DH018', type: '入侵告警', deviceName: '周边防翻越震动传感缆', location: '西北角竹林围墙', triggerTime: '2026-10-28 10:45', status: '已处理', snapshot: asianFemaleImg },
    { id: 'int-19', code: 'B2009OC001DH019', type: '入侵告警', deviceName: '光纤振动防入侵系统', location: '高压电缆隧道口', triggerTime: '2026-10-27 15:30', status: '未处理', snapshot: asianMaleImg },
    { id: 'int-20', code: 'B2009OC001DH020', type: '入侵告警', deviceName: '红外对射05', location: '园区西侧防护绿化带', triggerTime: '2026-10-27 09:10', status: '已处理', snapshot: asianGlassesImg },
    { id: 'int-21', code: 'B2009OC001DH021', type: '入侵告警', deviceName: '水泵房防越警报器', location: 'T3-B2生活水泵房', triggerTime: '2026-10-26 18:00', status: '已处理', snapshot: asianFemaleImg },
    { id: 'int-22', code: 'B2009OC001DH022', type: '入侵告警', deviceName: '微波周界感应器02', location: 'T1-屋顶冷塔区域', triggerTime: '2026-10-26 12:20', status: '未处理', snapshot: asianMaleImg },
    { id: 'int-23', code: 'B2009OC001DH023', type: '入侵告警', deviceName: '电子围栏前置探测箱', location: '东侧变电站围墙', triggerTime: '2026-10-25 16:15', status: '已处理', snapshot: asianGlassesImg },
    { id: 'int-24', code: 'B2009OC001DH024', type: '入侵告警', deviceName: '红外被动式探针08', location: 'T2-1F财务重地窗外', triggerTime: '2026-10-25 11:30', status: '未处理', snapshot: asianFemaleImg },
    { id: 'int-25', code: 'B2009OC001DH025', type: '入侵告警', deviceName: '高精度红外光栅', location: '园区东北角大门顶', triggerTime: '2026-10-24 14:50', status: '已处理', snapshot: asianMaleImg },
  ]);

  // Perimeter Alarms List (25 items)
  const [perimeterAlarms, setPerimeterAlarms] = useState([
    { id: 'per-1', code: 'B2009OC001DH001', type: '周界告警', deviceName: '周界主机', location: '室外', zone: 'A区', triggerTime: '2026-11-06 16:00', status: '未处理', snapshot: asianFemaleImg },
    { id: 'per-2', code: 'B2009OC001DH002', type: '周界告警', deviceName: '周界主机', location: '室外', zone: 'B区', triggerTime: '2026-11-06 14:09', status: '已处理', snapshot: asianMaleImg },
    { id: 'per-3', code: 'B2009OC001DH003', type: '周界告警', deviceName: '周界脉冲主机01', location: '室外', zone: 'C区', triggerTime: '2026-11-05 11:20', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'per-4', code: 'B2009OC001DH004', type: '周界告警', deviceName: '电子围栏控制器', location: '室外', zone: 'D区', triggerTime: '2026-11-05 09:15', status: '已处理', snapshot: asianGlassesImg },
    { id: 'per-5', code: 'B2009OC001DH005', type: '周界告警', deviceName: '红外对射光栅', location: '室外', zone: 'E区', triggerTime: '2026-11-04 15:40', status: '已处理', snapshot: asianFemaleImg },
    { id: 'per-6', code: 'B2009OC001DH006', type: '周界告警', deviceName: '周界主机02', location: '室外', zone: 'F区', triggerTime: '2026-11-04 10:22', status: '未处理', snapshot: asianMaleImg },
    { id: 'per-7', code: 'B2009OC001DH007', type: '周界告警', deviceName: '震动光纤分析仪', location: '室外', zone: 'G区', triggerTime: '2026-11-03 16:50', status: '已处理', snapshot: asianGlassesImg },
    { id: 'per-8', code: 'B2009OC001DH008', type: '周界告警', deviceName: '激光对射报警器', location: '室外', zone: 'H区', triggerTime: '2026-11-03 13:10', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'per-9', code: 'B2009OC001DH009', type: '周界告警', deviceName: '周界微波感应器', location: '室外', zone: 'I区', triggerTime: '2026-11-02 08:35', status: '未处理', snapshot: asianFemaleImg },
    { id: 'per-10', code: 'B2009OC001DH010', type: '周界告警', deviceName: '周界主机主站', location: '室外', zone: 'J区', triggerTime: '2026-11-01 19:20', status: '已处理', snapshot: asianMaleImg },
    { id: 'per-11', code: 'B2009OC001DH011', type: '周界告警', deviceName: '高压脉冲前端电子围栏', location: '室外', zone: 'K区', triggerTime: '2026-10-31 15:45', status: '未处理', snapshot: asianGlassesImg },
    { id: 'per-12', code: 'B2009OC001DH012', type: '周界告警', deviceName: '张力围栏控制器', location: '室外', zone: 'L区', triggerTime: '2026-10-31 10:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'per-13', code: 'B2009OC001DH013', type: '周界告警', deviceName: '周界智能光纤采集盒', location: '室外', zone: 'M区', triggerTime: '2026-10-30 17:15', status: '已处理', snapshot: asianMaleImg },
    { id: 'per-14', code: 'B2009OC001DH014', type: '周界告警', deviceName: '三鉴周界探测器03', location: '室外', zone: 'N区', triggerTime: '2026-10-30 12:40', status: '未处理', snapshot: asianGlassesImg },
    { id: 'per-15', code: 'B2009OC001DH015', type: '周界告警', deviceName: '雷达雷视一体周界终端', location: '室外', zone: 'O区', triggerTime: '2026-10-29 18:50', status: '已处理', snapshot: asianFemaleImg },
    { id: 'per-16', code: 'B2009OC001DH016', type: '周界告警', deviceName: '红外对射报警主机', location: '室外', zone: 'P区', triggerTime: '2026-10-29 09:10', status: '已处理', snapshot: asianMaleImg },
    { id: 'per-17', code: 'B2009OC001DH017', type: '周界告警', deviceName: '微波对射警戒节点', location: '室外', zone: 'Q区', triggerTime: '2026-10-28 16:25', status: '未处理', snapshot: asianGlassesImg },
    { id: 'per-18', code: 'B2009OC001DH018', type: '周界告警', deviceName: '泄漏电缆周界探测器', location: '室外', zone: 'R区', triggerTime: '2026-10-28 11:15', status: '已处理', snapshot: asianFemaleImg },
    { id: 'per-19', code: 'B2009OC001DH019', type: '周界告警', deviceName: '周界脉冲防区主机', location: '室外', zone: 'S区', triggerTime: '2026-10-27 14:40', status: '未处理', snapshot: asianMaleImg },
    { id: 'per-20', code: 'B2009OC001DH020', type: '周界告警', deviceName: '震动传感网关器', location: '室外', zone: 'T区', triggerTime: '2026-10-27 08:30', status: '已处理', snapshot: asianGlassesImg },
    { id: 'per-21', code: 'B2009OC001DH021', type: '周界告警', deviceName: '红外光栅周界节点', location: '室外', zone: 'U区', triggerTime: '2026-10-26 19:10', status: '已处理', snapshot: asianFemaleImg },
    { id: 'per-22', code: 'B2009OC001DH022', type: '周界告警', deviceName: '周界主机03', location: '室外', zone: 'V区', triggerTime: '2026-10-26 13:00', status: '未处理', snapshot: asianMaleImg },
    { id: 'per-23', code: 'B2009OC001DH023', type: '周界告警', deviceName: '微波对射收发机', location: '室外', zone: 'W区', triggerTime: '2026-10-25 17:35', status: '已处理', snapshot: asianGlassesImg },
    { id: 'per-24', code: 'B2009OC001DH024', type: '周界告警', deviceName: '周界防翻越传感器08', location: '室外', zone: 'X区', triggerTime: '2026-10-25 10:15', status: '未处理', snapshot: asianFemaleImg },
    { id: 'per-25', code: 'B2009OC001DH025', type: '周界告警', deviceName: '电子围栏高压控制箱', location: '室外', zone: 'Y区', triggerTime: '2026-10-24 15:25', status: '已处理', snapshot: asianMaleImg },
  ]);

  // Temperature Abnormality Alarms List (25 items)
  const [temperatureAlarms, setTemperatureAlarms] = useState([
    { id: 'tmp-1', code: 'B2009OC001DH001', type: '温度异常告警', deviceName: '环境感应器', location: 'T1-1F西北角', measuredValue: '32°C', threshold: '26°C', anomalyItem: '高温', triggerTime: '2026-11-06 16:00', status: '未处理', snapshot: asianFemaleImg },
    { id: 'tmp-2', code: 'B2009OC001DH002', type: '温度异常告警', deviceName: '环境感应器', location: 'T1-1F东南角', measuredValue: '32°C', threshold: '26°C', anomalyItem: '高温', triggerTime: '2026-11-06 14:09', status: '已处理', snapshot: asianMaleImg },
    { id: 'tmp-3', code: 'B2009OC001DH003', type: '温度异常告警', deviceName: '温湿度传感器01', location: '3F核心机房', measuredValue: '35°C', threshold: '24°C', anomalyItem: '高温', triggerTime: '2026-11-05 11:20', status: '未处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'tmp-4', code: 'B2009OC001DH004', type: '温度异常告警', deviceName: '多功能环境探测仪', location: '2F配电房', measuredValue: '33°C', threshold: '25°C', anomalyItem: '高温', triggerTime: '2026-11-05 09:15', status: '已处理', snapshot: asianGlassesImg },
    { id: 'tmp-5', code: 'B2009OC001DH005', type: '温度异常告警', deviceName: '精密空调回风温控器', location: '1F弱电井', measuredValue: '14°C', threshold: '18°C', anomalyItem: '低温', triggerTime: '2026-11-04 15:40', status: '已处理', snapshot: asianFemaleImg },
    { id: 'tmp-6', code: 'B2009OC001DH006', type: '温度异常告警', deviceName: '环境感应器02', location: '4F研发办公室', measuredValue: '31°C', threshold: '26°C', anomalyItem: '高温', triggerTime: '2026-11-04 10:22', status: '未处理', snapshot: asianMaleImg },
    { id: 'tmp-7', code: 'B2009OC001DH007', type: '温度异常告警', deviceName: '温湿度传感器02', location: '地下档案室', measuredValue: '12°C', threshold: '16°C', anomalyItem: '低温', triggerTime: '2026-11-03 16:50', status: '已处理', snapshot: asianGlassesImg },
    { id: 'tmp-8', code: 'B2009OC001DH008', type: '温度异常告警', deviceName: '冷水机组温度探头', location: 'B1制冷机房', measuredValue: '36°C', threshold: '28°C', anomalyItem: '高温', triggerTime: '2026-11-03 13:10', status: '已处理', snapshot: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=80' },
    { id: 'tmp-9', code: 'B2009OC001DH009', type: '温度异常告警', deviceName: '环境感应器03', location: '5F大会议室', measuredValue: '30°C', threshold: '26°C', anomalyItem: '高温', triggerTime: '2026-11-02 08:35', status: '未处理', snapshot: asianFemaleImg },
    { id: 'tmp-10', code: 'B2009OC001DH010', type: '温度异常告警', deviceName: '温湿度传感器03', location: '屋顶太阳能配电箱', measuredValue: '42°C', threshold: '35°C', anomalyItem: '高温', triggerTime: '2026-11-01 19:20', status: '已处理', snapshot: asianMaleImg },
    { id: 'tmp-11', code: 'B2009OC001DH011', type: '温度异常告警', deviceName: '高压电容柜测温线缆', location: '10kV配电室2#柜', measuredValue: '88°C', threshold: '70°C', anomalyItem: '高温', triggerTime: '2026-10-31 17:00', status: '未处理', snapshot: asianGlassesImg },
    { id: 'tmp-12', code: 'B2009OC001DH012', type: '温度异常告警', deviceName: '冷库内部温度变送器', location: 'T3-B1食堂冷库', measuredValue: '8°C', threshold: '2°C', anomalyItem: '高温', triggerTime: '2026-10-31 11:40', status: '已处理', snapshot: asianFemaleImg },
    { id: 'tmp-13', code: 'B2009OC001DH013', type: '温度异常告警', deviceName: '锅炉出水温度传感器', location: 'B2锅炉房主管道', measuredValue: '98°C', threshold: '85°C', anomalyItem: '高温', triggerTime: '2026-10-30 16:10', status: '已处理', snapshot: asianMaleImg },
    { id: 'tmp-14', code: 'B2009OC001DH014', type: '温度异常告警', deviceName: '服务器机柜排风温控', location: 'T1-3F机房A04机柜', measuredValue: '38°C', threshold: '28°C', anomalyItem: '高温', triggerTime: '2026-10-30 09:55', status: '未处理', snapshot: asianGlassesImg },
    { id: 'tmp-15', code: 'B2009OC001DH015', type: '温度异常告警', deviceName: '电池间温度探头', location: 'T2-B1 UPS电池间', measuredValue: '34°C', threshold: '25°C', anomalyItem: '高温', triggerTime: '2026-10-29 18:15', status: '已处理', snapshot: asianFemaleImg },
    { id: 'tmp-16', code: 'B2009OC001DH016', type: '温度异常告警', deviceName: '管道防冻结温度开关', location: '屋顶冷却水补水管', measuredValue: '-2°C', threshold: '4°C', anomalyItem: '低温', triggerTime: '2026-10-29 07:20', status: '已处理', snapshot: asianMaleImg },
    { id: 'tmp-17', code: 'B2009OC001DH017', type: '温度异常告警', deviceName: '电梯机房温度检测器', location: 'T1顶层电梯机房', measuredValue: '37°C', threshold: '30°C', anomalyItem: '高温', triggerTime: '2026-10-28 15:30', status: '未处理', snapshot: asianGlassesImg },
    { id: 'tmp-18', code: 'B2009OC001DH018', type: '温度异常告警', deviceName: '环境感应器06', location: 'T2-4F多功能厅', measuredValue: '29°C', threshold: '25°C', anomalyItem: '高温', triggerTime: '2026-10-28 10:10', status: '已处理', snapshot: asianFemaleImg },
    { id: 'tmp-19', code: 'B2009OC001DH019', type: '温度异常告警', deviceName: '室外变压器油温传感器', location: '园区西侧变压器室', measuredValue: '92°C', threshold: '75°C', anomalyItem: '高温', triggerTime: '2026-10-27 16:45', status: '未处理', snapshot: asianMaleImg },
    { id: 'tmp-20', code: 'B2009OC001DH020', type: '温度异常告警', deviceName: '洁净实验室环境变送器', location: 'T3-4F洁净室B', measuredValue: '28°C', threshold: '22°C', anomalyItem: '高温', triggerTime: '2026-10-27 11:20', status: '已处理', snapshot: asianGlassesImg },
    { id: 'tmp-21', code: 'B2009OC001DH021', type: '温度异常告警', deviceName: '发电机水套水温表', location: '柴油发电机房', measuredValue: '102°C', threshold: '90°C', anomalyItem: '高温', triggerTime: '2026-10-26 17:50', status: '已处理', snapshot: asianFemaleImg },
    { id: 'tmp-22', code: 'B2009OC001DH022', type: '温度异常告警', deviceName: '新风机组送风温度传感器', location: 'T1-2F新风机房', measuredValue: '11°C', threshold: '16°C', anomalyItem: '低温', triggerTime: '2026-10-26 09:35', status: '未处理', snapshot: asianMaleImg },
    { id: 'tmp-23', code: 'B2009OC001DH023', type: '温度异常告警', deviceName: '配电井电缆接头测温探头', location: 'T2-3F强电井', measuredValue: '85°C', threshold: '65°C', anomalyItem: '高温', triggerTime: '2026-10-25 14:10', status: '已处理', snapshot: asianGlassesImg },
    { id: 'tmp-24', code: 'B2009OC001DH024', type: '温度异常告警', deviceName: '档案库温湿度探针03', location: 'T1-B1核心档案库', measuredValue: '26°C', threshold: '20°C', anomalyItem: '高温', triggerTime: '2026-10-25 08:25', status: '未处理', snapshot: asianFemaleImg },
    { id: 'tmp-25', code: 'B2009OC001DH025', type: '温度异常告警', deviceName: '气体灭火瓶组间温度表', location: '1F气体灭火房', measuredValue: '39°C', threshold: '32°C', anomalyItem: '高温', triggerTime: '2026-10-24 13:15', status: '已处理', snapshot: asianMaleImg },
  ]);

  // Humidity Abnormality Alarms (25 items)
  const [humidityAlarms, setHumidityAlarms] = useState([
    { id: 'hum-1', code: 'HUM-20261106-001', type: '湿度异常告警', deviceName: '精密湿度传感器01', location: 'T1-3F核心机房', measuredValue: '85% RH', threshold: '65% RH', anomalyItem: '高湿溢限', percentage: 85, triggerTime: '2026-11-06 15:30', status: '未处理', snapshot: asianFemaleImg },
    { id: 'hum-2', code: 'HUM-20261106-002', type: '湿度异常告警', deviceName: '温湿度变送器02', location: 'B1档案图书室', measuredValue: '82% RH', threshold: '60% RH', anomalyItem: '高湿溢限', percentage: 82, triggerTime: '2026-11-06 12:15', status: '已处理', snapshot: asianMaleImg },
    { id: 'hum-3', code: 'HUM-20261105-003', type: '湿度异常告警', deviceName: '管道湿敏探头01', location: 'T2-2F高压配电房', measuredValue: '22% RH', threshold: '35% RH', anomalyItem: '干燥缺湿', percentage: 22, triggerTime: '2026-11-05 16:40', status: '未处理', snapshot: asianGlassesImg },
    { id: 'hum-4', code: 'HUM-20261105-004', type: '湿度异常告警', deviceName: '机房加湿除湿一体机', location: 'T1-1F弱电总机房', measuredValue: '88% RH', threshold: '65% RH', anomalyItem: '高湿溢限', percentage: 88, triggerTime: '2026-11-05 10:05', status: '已处理', snapshot: asianFemaleImg },
    { id: 'hum-5', code: 'HUM-20261104-005', type: '湿度异常告警', deviceName: '环境多参数传感器', location: 'T3-4F实验室A', measuredValue: '18% RH', threshold: '30% RH', anomalyItem: '干燥缺湿', percentage: 18, triggerTime: '2026-11-04 14:22', status: '已处理', snapshot: asianMaleImg },
    { id: 'hum-6', code: 'HUM-20261104-006', type: '湿度异常告警', deviceName: '精密湿度传感器02', location: '地下泵房管道间', measuredValue: '91% RH', threshold: '70% RH', anomalyItem: '高湿溢限', percentage: 91, triggerTime: '2026-11-04 09:10', status: '未处理', snapshot: asianGlassesImg },
    { id: 'hum-7', code: 'HUM-20261103-007', type: '湿度异常告警', deviceName: '无线湿度监测节点', location: 'T1-5F展示大厅', measuredValue: '78% RH', threshold: '65% RH', anomalyItem: '高湿溢限', percentage: 78, triggerTime: '2026-11-03 17:00', status: '已处理', snapshot: asianFemaleImg },
    { id: 'hum-8', code: 'HUM-20261103-008', type: '湿度异常告警', deviceName: '通风空调湿度探针', location: 'T2-3F洁净车间', measuredValue: '20% RH', threshold: '40% RH', anomalyItem: '干燥缺湿', percentage: 20, triggerTime: '2026-11-03 11:45', status: '已处理', snapshot: asianMaleImg },
    { id: 'hum-9', code: 'HUM-20261102-009', type: '湿度异常告警', deviceName: '环境感应器05', location: 'B2层电缆隧道', measuredValue: '94% RH', threshold: '75% RH', anomalyItem: '高湿溢限', percentage: 94, triggerTime: '2026-11-02 13:20', status: '未处理', snapshot: asianGlassesImg },
    { id: 'hum-10', code: 'HUM-20261101-010', type: '湿度异常告警', deviceName: '智能湿敏报警节点', location: 'T3-1F大堂茶歇区', measuredValue: '76% RH', threshold: '65% RH', anomalyItem: '高湿溢限', percentage: 76, triggerTime: '2026-11-01 08:50', status: '已处理', snapshot: asianFemaleImg },
    { id: 'hum-11', code: 'HUM-20261031-011', type: '湿度异常告警', deviceName: '高压开关柜湿敏开关', location: '10kV变电所A柜', measuredValue: '86% RH', threshold: '60% RH', anomalyItem: '高湿溢限', percentage: 86, triggerTime: '2026-10-31 16:15', status: '未处理', snapshot: asianMaleImg },
    { id: 'hum-12', code: 'HUM-20261031-012', type: '湿度异常告警', deviceName: '精密空调湿敏探针', location: 'T2-3F机房', measuredValue: '24% RH', threshold: '35% RH', anomalyItem: '干燥缺湿', percentage: 24, triggerTime: '2026-10-31 10:40', status: '已处理', snapshot: asianGlassesImg },
    { id: 'hum-13', code: 'HUM-20261030-013', type: '湿度异常告警', deviceName: '库房湿度报警盒', location: 'T1-B1备件库房', measuredValue: '89% RH', threshold: '65% RH', anomalyItem: '高湿溢限', percentage: 89, triggerTime: '2026-10-30 17:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'hum-14', code: 'HUM-20261030-014', type: '湿度异常告警', deviceName: '通风管道湿敏变送器', location: 'T3-2F空调管道', measuredValue: '92% RH', threshold: '70% RH', anomalyItem: '高湿溢限', percentage: 92, triggerTime: '2026-10-30 08:55', status: '未处理', snapshot: asianMaleImg },
    { id: 'hum-15', code: 'HUM-20261029-015', type: '湿度异常告警', deviceName: '环境感应器08', location: 'T2-1F中控室', measuredValue: '21% RH', threshold: '35% RH', anomalyItem: '干燥缺湿', percentage: 21, triggerTime: '2026-10-29 19:10', status: '已处理', snapshot: asianGlassesImg },
    { id: 'hum-16', code: 'HUM-20261029-016', type: '湿度异常告警', deviceName: '水泵房环境湿度监测', location: 'B2主给水泵房', measuredValue: '96% RH', threshold: '75% RH', anomalyItem: '高湿溢限', percentage: 96, triggerTime: '2026-10-29 11:25', status: '已处理', snapshot: asianFemaleImg },
    { id: 'hum-17', code: 'HUM-20261028-017', type: '湿度异常告警', deviceName: '展示中心湿敏传感节点', location: 'T1-1F展览厅', measuredValue: '79% RH', threshold: '65% RH', anomalyItem: '高湿溢限', percentage: 79, triggerTime: '2026-10-28 15:50', status: '未处理', snapshot: asianMaleImg },
    { id: 'hum-18', code: 'HUM-20261028-018', type: '湿度异常告警', deviceName: '洁净车间湿度传感器03', location: 'T3-3F芯片试产间', measuredValue: '19% RH', threshold: '30% RH', anomalyItem: '干燥缺湿', percentage: 19, triggerTime: '2026-10-28 09:30', status: '已处理', snapshot: asianGlassesImg },
    { id: 'hum-19', code: 'HUM-20261027-019', type: '湿度异常告警', deviceName: '地库电缆沟湿度检测节点', location: 'B1电缆夹层', measuredValue: '93% RH', threshold: '70% RH', anomalyItem: '高湿溢限', percentage: 93, triggerTime: '2026-10-27 16:20', status: '未处理', snapshot: asianFemaleImg },
    { id: 'hum-20', code: 'HUM-20261027-020', type: '湿度异常告警', deviceName: '高压配电井湿度变送器', location: 'T1-4F强电井', measuredValue: '84% RH', threshold: '65% RH', anomalyItem: '高湿溢限', percentage: 84, triggerTime: '2026-10-27 10:15', status: '已处理', snapshot: asianMaleImg },
    { id: 'hum-21', code: 'HUM-20261026-021', type: '湿度异常告警', deviceName: '数据中心B区湿度传感器', location: 'T2-5F数据中心', measuredValue: '25% RH', threshold: '40% RH', anomalyItem: '干燥缺湿', percentage: 25, triggerTime: '2026-10-26 18:30', status: '已处理', snapshot: asianGlassesImg },
    { id: 'hum-22', code: 'HUM-20261026-022', type: '湿度异常告警', deviceName: '冷凝水集水盘探头', location: 'T1-B1空调机房', measuredValue: '95% RH', threshold: '75% RH', anomalyItem: '高湿溢限', percentage: 95, triggerTime: '2026-10-26 13:45', status: '未处理', snapshot: asianFemaleImg },
    { id: 'hum-23', code: 'HUM-20261025-023', type: '湿度异常告警', deviceName: '档案保管室湿度仪', location: 'T3-B1档案库室', measuredValue: '81% RH', threshold: '60% RH', anomalyItem: '高湿溢限', percentage: 81, triggerTime: '2026-10-25 17:10', status: '已处理', snapshot: asianMaleImg },
    { id: 'hum-24', code: 'HUM-20261025-024', type: '湿度异常告警', deviceName: '精密空调加湿罐检测', location: 'T1-3F机房加湿组', measuredValue: '17% RH', threshold: '30% RH', anomalyItem: '干燥缺湿', percentage: 17, triggerTime: '2026-10-25 09:05', status: '未处理', snapshot: asianGlassesImg },
    { id: 'hum-25', code: 'HUM-20261024-025', type: '湿度异常告警', deviceName: '员工休息室湿敏变送器', location: 'T2-2F休息大厅', measuredValue: '77% RH', threshold: '65% RH', anomalyItem: '高湿溢限', percentage: 77, triggerTime: '2026-10-24 14:40', status: '已处理', snapshot: asianFemaleImg },
  ]);

  // Air Quality Abnormality Alarms (25 items)
  const [airQualityAlarms, setAirQualityAlarms] = useState([
    { id: 'air-1', code: 'AIR-20261106-001', type: '空气异常告警', deviceName: '空气质量检测仪01', location: 'T1-B1地下车库A区', indicator: 'PM2.5 / CO', measuredValue: '185 μg/m³', threshold: '75 μg/m³', anomalyItem: '重度污染', standard: 'GB 3095-2012', triggerTime: '2026-11-06 17:10', status: '未处理', snapshot: asianGlassesImg },
    { id: 'air-2', code: 'AIR-20261106-002', type: '空气异常告警', deviceName: '二氧化碳传感器01', location: 'T2-3F阶梯报告厅', indicator: 'CO2浓度', measuredValue: '1450 ppm', threshold: '1000 ppm', anomalyItem: '浓度超标', standard: 'GB/T 18883', triggerTime: '2026-11-06 11:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'air-3', code: 'AIR-20261105-003', type: '空气异常告警', deviceName: 'VOC挥发物检测探头', location: 'T3-1F喷漆维修间', indicator: 'TVOC', measuredValue: '2.8 mg/m³', threshold: '0.6 mg/m³', anomalyItem: '剧毒/挥发过高', standard: 'GB/T 18883', triggerTime: '2026-11-05 15:00', status: '未处理', snapshot: asianMaleImg },
    { id: 'air-4', code: 'AIR-20261105-004', type: '空气异常告警', deviceName: '新风PM2.5检测仪', location: 'T1-4F办公大堂', indicator: 'PM2.5', measuredValue: '120 μg/m³', threshold: '75 μg/m³', anomalyItem: '轻度污染', standard: 'GB 3095-2012', triggerTime: '2026-11-05 08:45', status: '已处理', snapshot: asianGlassesImg },
    { id: 'air-5', code: 'AIR-20261104-005', type: '空气异常告警', deviceName: '甲醛高精度检测仪', location: 'T2-1F员工食堂', indicator: 'HCHO/甲醛', measuredValue: '0.22 mg/m³', threshold: '0.08 mg/m³', anomalyItem: '甲醛超标', standard: 'GB/T 18883', triggerTime: '2026-11-04 16:10', status: '已处理', snapshot: asianFemaleImg },
    { id: 'air-6', code: 'AIR-20261104-006', type: '空气异常告警', deviceName: '车库CO报警器02', location: 'B2下坡道汇流口', indicator: '一氧化碳CO', measuredValue: '48 ppm', threshold: '30 ppm', anomalyItem: 'CO浓度超标', standard: 'GBZ 2.1-2019', triggerTime: '2026-11-04 09:35', status: '未处理', snapshot: asianMaleImg },
    { id: 'air-7', code: 'AIR-20261103-007', type: '空气异常告警', deviceName: '室内环境监测站', location: 'T3-5F贵宾休息室', indicator: 'CO2浓度', measuredValue: '1280 ppm', threshold: '1000 ppm', anomalyItem: '通风不良', standard: 'GB/T 18883', triggerTime: '2026-11-03 14:15', status: '已处理', snapshot: asianGlassesImg },
    { id: 'air-8', code: 'AIR-20261103-008', type: '空气异常告警', deviceName: '有害气体检测仪', location: 'T1-2F化学实验室', indicator: 'NH3 / H2S', measuredValue: '18 ppm', threshold: '10 ppm', anomalyItem: '异味/氨气超标', standard: 'GBZ 2.1-2019', triggerTime: '2026-11-03 10:20', status: '已处理', snapshot: asianFemaleImg },
    { id: 'air-9', code: 'AIR-20261102-009', type: '空气异常告警', deviceName: '垃圾房空气检测仪', location: '园区西侧垃圾房', indicator: '臭气浓度', measuredValue: '35 OU', threshold: '20 OU', anomalyItem: '恶臭溢散', standard: 'GB 14554-93', triggerTime: '2026-11-02 16:50', status: '未处理', snapshot: asianMaleImg },
    { id: 'air-10', code: 'AIR-20261101-010', type: '空气异常告警', deviceName: '空气质量监测站03', location: 'T2-4F多功能厅', indicator: 'PM2.5', measuredValue: '98 μg/m³', threshold: '75 μg/m³', anomalyItem: '轻度污染', standard: 'GB 3095-2012', triggerTime: '2026-11-01 11:00', status: '已处理', snapshot: asianGlassesImg },
    { id: 'air-11', code: 'AIR-20261031-011', type: '空气异常告警', deviceName: '地下车库B1区CO检测探头', location: 'T2-B1地库中央', indicator: '一氧化碳CO', measuredValue: '55 ppm', threshold: '30 ppm', anomalyItem: 'CO浓度超标', standard: 'GBZ 2.1-2019', triggerTime: '2026-10-31 17:20', status: '未处理', snapshot: asianFemaleImg },
    { id: 'air-12', code: 'AIR-20261031-012', type: '空气异常告警', deviceName: '新风风管PM10监测', location: 'T1-3F空调机房', indicator: 'PM10', measuredValue: '160 μg/m³', threshold: '100 μg/m³', anomalyItem: '中度污染', standard: 'GB 3095-2012', triggerTime: '2026-10-31 10:10', status: '已处理', snapshot: asianMaleImg },
    { id: 'air-13', code: 'AIR-20261030-013', type: '空气异常告警', deviceName: '气味检测探针04', location: 'T1-B1餐饮后厨', indicator: '油烟/VOC', measuredValue: '3.1 mg/m³', threshold: '1.0 mg/m³', anomalyItem: '油烟溢散', standard: 'GB 18483-2001', triggerTime: '2026-10-30 18:40', status: '已处理', snapshot: asianGlassesImg },
    { id: 'air-14', code: 'AIR-20261030-014', type: '空气异常告警', deviceName: '大会议室二氧化碳节点', location: 'T3-1F学术报告厅', indicator: 'CO2浓度', measuredValue: '1580 ppm', threshold: '1000 ppm', anomalyItem: '缺氧/严重通风不良', standard: 'GB/T 18883', triggerTime: '2026-10-30 09:15', status: '未处理', snapshot: asianFemaleImg },
    { id: 'air-15', code: 'AIR-20261029-015', type: '空气异常告警', deviceName: '精密除尘过滤器差压传感器', location: 'T2-4F洁净室新风', indicator: '颗粒物/Dust', measuredValue: '110 μg/m³', threshold: '50 μg/m³', anomalyItem: '滤网堵塞污染', standard: 'GB 50073-2013', triggerTime: '2026-10-29 16:30', status: '已处理', snapshot: asianMaleImg },
    { id: 'air-16', code: 'AIR-20261029-016', type: '空气异常告警', deviceName: '化学试剂柜气体传感器', location: 'T3-4F实验室试剂间', indicator: '有机溶剂/TVOC', measuredValue: '4.2 mg/m³', threshold: '0.6 mg/m³', anomalyItem: '挥发物泄露', standard: 'GBZ 2.1-2019', triggerTime: '2026-10-29 10:05', status: '已处理', snapshot: asianGlassesImg },
    { id: 'air-17', code: 'AIR-20261028-017', type: '空气异常告警', deviceName: '员工办公区空气盒子02', location: 'T1-5F开放办公区', indicator: 'PM2.5', measuredValue: '92 μg/m³', threshold: '75 μg/m³', anomalyItem: '轻度污染', standard: 'GB 3095-2012', triggerTime: '2026-10-28 17:15', status: '未处理', snapshot: asianFemaleImg },
    { id: 'air-18', code: 'AIR-20261028-018', type: '空气异常告警', deviceName: '地下电缆沟气体监测节点', location: 'B2高压线缆通道', indicator: 'H2S / 硫化氢', measuredValue: '15 ppm', threshold: '6 ppm', anomalyItem: '有毒气体超标', standard: 'GBZ 2.1-2019', triggerTime: '2026-10-28 11:50', status: '已处理', snapshot: asianMaleImg },
    { id: 'air-19', code: 'AIR-20261027-019', type: '空气异常告警', deviceName: '污泥脱水房空气采集器', location: '污水处理站房', indicator: 'NH3 / 氨气', measuredValue: '25 ppm', threshold: '10 ppm', anomalyItem: '恶臭/氨气偏高', standard: 'GB 14554-93', triggerTime: '2026-10-27 14:35', status: '未处理', snapshot: asianGlassesImg },
    { id: 'air-20', code: 'AIR-20261027-020', type: '空气异常告警', deviceName: 'VIP大厅空气质检机', location: 'T1-1F贵宾接待厅', indicator: 'CO2', measuredValue: '1150 ppm', threshold: '1000 ppm', anomalyItem: '二氧化碳微超标', standard: 'GB/T 18883', triggerTime: '2026-10-27 08:20', status: '已处理', snapshot: asianFemaleImg },
    { id: 'air-21', code: 'AIR-20261026-021', type: '空气异常告警', deviceName: '车库B2斜坡一氧化碳检测仪', location: 'B2地库出口坡道', indicator: '一氧化碳CO', measuredValue: '62 ppm', threshold: '30 ppm', anomalyItem: 'CO浓度超标', standard: 'GBZ 2.1-2019', triggerTime: '2026-10-26 18:10', status: '已处理', snapshot: asianMaleImg },
    { id: 'air-22', code: 'AIR-20261026-022', type: '空气异常告警', deviceName: '新风机组PM2.5探针', location: 'T2-2F机房新风口', indicator: 'PM2.5', measuredValue: '135 μg/m³', threshold: '75 μg/m³', anomalyItem: '轻度污染', standard: 'GB 3095-2012', triggerTime: '2026-10-26 12:45', status: '未处理', snapshot: asianGlassesImg },
    { id: 'air-23', code: 'AIR-20261025-023', type: '空气异常告警', deviceName: '装修过渡区甲醛传感器', location: 'T3-2F改造办公室', indicator: 'HCHO/甲醛', measuredValue: '0.18 mg/m³', threshold: '0.08 mg/m³', anomalyItem: '甲醛超标', standard: 'GB/T 18883', triggerTime: '2026-10-25 16:05', status: '已处理', snapshot: asianFemaleImg },
    { id: 'air-24', code: 'AIR-20261025-024', type: '空气异常告警', deviceName: '多功能厅空气品质站', location: 'T1-4F演讲厅', indicator: 'CO2浓度', measuredValue: '1390 ppm', threshold: '1000 ppm', anomalyItem: '通风不良', standard: 'GB/T 18883', triggerTime: '2026-10-25 10:20', status: '未处理', snapshot: asianMaleImg },
    { id: 'air-25', code: 'AIR-20261024-025', type: '空气异常告警', deviceName: '地下柴发机房气体报警器', location: 'B2柴发房', indicator: 'NO2 / 二氧化氮', measuredValue: '8.5 mg/m³', threshold: '2.5 mg/m³', anomalyItem: '尾气污染超标', standard: 'GBZ 2.1-2019', triggerTime: '2026-10-24 15:10', status: '已处理', snapshot: asianGlassesImg },
  ]);

  // Liquid Level Alarms (25 items)
  const [liquidLevelAlarms, setLiquidLevelAlarms] = useState([
    { id: 'liq-1', code: 'LIQ-20261106-001', type: '液位告警', deviceName: '消防水池超声波液位计', location: 'B2消防水泵房', measuredValue: '3.8m', safeThreshold: '1.8m - 3.2m', maxCapacity: '4.5m', fillPercent: 84, anomalyState: '高位溢水预警', triggerTime: '2026-11-06 16:40', status: '未处理', snapshot: asianFemaleImg },
    { id: 'liq-2', code: 'LIQ-20261106-002', type: '液位告警', deviceName: '生活水箱液位变送器', location: 'T1-屋顶水箱间', measuredValue: '0.4m', safeThreshold: '1.2m - 2.8m', maxCapacity: '3.0m', fillPercent: 13, anomalyState: '低位缺水预警', triggerTime: '2026-11-06 13:20', status: '已处理', snapshot: asianMaleImg },
    { id: 'liq-3', code: 'LIQ-20261105-003', type: '液位告警', deviceName: '集水井水位开关01', location: 'B2底板集水坑1#', measuredValue: '1.6m', safeThreshold: '0.3m - 1.0m', maxCapacity: '2.0m', fillPercent: 80, anomalyState: '集水井水满警戒', triggerTime: '2026-11-05 17:15', status: '未处理', snapshot: asianGlassesImg },
    { id: 'liq-4', code: 'LIQ-20261105-004', type: '液位告警', deviceName: '膨胀水箱液位控制器', location: 'T2-屋顶暖通机房', measuredValue: '2.5m', safeThreshold: '0.8m - 2.0m', maxCapacity: '2.8m', fillPercent: 89, anomalyState: '高液位溢流', triggerTime: '2026-11-05 09:50', status: '已处理', snapshot: asianFemaleImg },
    { id: 'liq-5', code: 'LIQ-20261104-005', type: '液位告警', deviceName: '污水池浮球液位计', location: '园区污水处理站', measuredValue: '4.2m', safeThreshold: '1.0m - 3.5m', maxCapacity: '5.0m', fillPercent: 84, anomalyState: '污水超限临界', triggerTime: '2026-11-04 15:10', status: '已处理', snapshot: asianMaleImg },
    { id: 'liq-6', code: 'LIQ-20261104-006', type: '液位告警', deviceName: '雨水池液位计02', location: 'B1景观水池旁', measuredValue: '2.9m', safeThreshold: '0.5m - 2.2m', maxCapacity: '3.5m', fillPercent: 82, anomalyState: '雨水积水过高', triggerTime: '2026-11-04 11:05', status: '未处理', snapshot: asianGlassesImg },
    { id: 'liq-7', code: 'LIQ-20261103-007', type: '液位告警', deviceName: '冷却塔水盘液位开关', location: 'T3-屋顶冷却塔', measuredValue: '0.2m', safeThreshold: '0.6m - 1.2m', maxCapacity: '1.5m', fillPercent: 13, anomalyState: '低位缺水预警', triggerTime: '2026-11-03 16:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'liq-8', code: 'LIQ-20261103-008', type: '液位告警', deviceName: '隔油池雷达液位计', location: 'T1-B1厨房隔油池', measuredValue: '1.8m', safeThreshold: '0.4m - 1.2m', maxCapacity: '2.0m', fillPercent: 90, anomalyState: '油脂液位满溢', triggerTime: '2026-11-03 08:40', status: '已处理', snapshot: asianMaleImg },
    { id: 'liq-9', code: 'LIQ-20261102-009', type: '液位告警', deviceName: '电缆沟水沉淀池探测器', location: 'B2高压电缆沟', measuredValue: '0.8m', safeThreshold: '0.0m - 0.2m', maxCapacity: '1.0m', fillPercent: 80, anomalyState: '电缆沟严重积水', triggerTime: '2026-11-02 14:00', status: '未处理', snapshot: asianGlassesImg },
    { id: 'liq-10', code: 'LIQ-20261101-010', type: '液位告警', deviceName: '软化水箱液位探针', location: '锅炉房水处理间', measuredValue: '0.3m', safeThreshold: '1.0m - 2.5m', maxCapacity: '3.0m', fillPercent: 10, anomalyState: '软水储备不足', triggerTime: '2026-11-01 10:15', status: '已处理', snapshot: asianFemaleImg },
    { id: 'liq-11', code: 'LIQ-20261031-011', type: '液位告警', deviceName: '高压电缆井潜水泵浮球', location: 'B2电缆夹层坑', measuredValue: '1.2m', safeThreshold: '0.2m - 0.5m', maxCapacity: '1.5m', fillPercent: 80, anomalyState: '集水满溢报警', triggerTime: '2026-10-31 16:50', status: '未处理', snapshot: asianMaleImg },
    { id: 'liq-12', code: 'LIQ-20261031-012', type: '液位告警', deviceName: '蓄冰冷槽液位指示器', location: 'B2制冷站蓄冰池', measuredValue: '4.8m', safeThreshold: '2.0m - 4.2m', maxCapacity: '5.0m', fillPercent: 96, anomalyState: '蓄冰融水高位', triggerTime: '2026-10-31 11:10', status: '已处理', snapshot: asianGlassesImg },
    { id: 'liq-13', code: 'LIQ-20261030-013', type: '液位告警', deviceName: '喷泉地下中速水箱', location: '园区中庭地库', measuredValue: '0.5m', safeThreshold: '1.5m - 3.0m', maxCapacity: '3.5m', fillPercent: 14, anomalyState: '补水欠压低位', triggerTime: '2026-10-30 17:25', status: '已处理', snapshot: asianFemaleImg },
    { id: 'liq-14', code: 'LIQ-20261030-014', type: '液位告警', deviceName: '冷凝水集水箱液位开关', location: 'T1-3F空调机房', measuredValue: '0.9m', safeThreshold: '0.1m - 0.5m', maxCapacity: '1.0m', fillPercent: 90, anomalyState: '凝结水排水不畅', triggerTime: '2026-10-30 09:15', status: '未处理', snapshot: asianMaleImg },
    { id: 'liq-15', code: 'LIQ-20261029-015', type: '液位告警', deviceName: '柴油发电机日用油箱位计', location: '柴油发电机房', measuredValue: '0.25m', safeThreshold: '0.5m - 1.2m', maxCapacity: '1.5m', fillPercent: 16, anomalyState: '燃油储存过低', triggerTime: '2026-10-29 18:40', status: '已处理', snapshot: asianGlassesImg },
    { id: 'liq-16', code: 'LIQ-20261029-016', type: '液位告警', deviceName: '消防喷淋补水箱液位计', location: 'T2-屋顶水箱间', measuredValue: '3.6m', safeThreshold: '1.8m - 3.0m', maxCapacity: '4.0m', fillPercent: 90, anomalyState: '溢流预警', triggerTime: '2026-10-29 08:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'liq-17', code: 'LIQ-20261028-017', type: '液位告警', deviceName: '地下二层污水集水坑03', location: 'B2卸货区后勤', measuredValue: '1.7m', safeThreshold: '0.3m - 1.0m', maxCapacity: '2.0m', fillPercent: 85, anomalyState: '污水满溢报警', triggerTime: '2026-10-28 15:55', status: '未处理', snapshot: asianMaleImg },
    { id: 'liq-18', code: 'LIQ-20261028-018', type: '液位告警', deviceName: '中水回用储存池液位', location: '污水处理机房', measuredValue: '0.6m', safeThreshold: '1.5m - 4.0m', maxCapacity: '4.5m', fillPercent: 13, anomalyState: '中水低位缺水', triggerTime: '2026-10-28 10:40', status: '已处理', snapshot: asianGlassesImg },
    { id: 'liq-19', code: 'LIQ-20261027-019', type: '液位告警', deviceName: '空调膨胀水箱液位传感器', location: 'T3-屋顶暖通房', measuredValue: '2.6m', safeThreshold: '0.8m - 2.0m', maxCapacity: '2.8m', fillPercent: 92, anomalyState: '高位溢水预警', triggerTime: '2026-10-27 16:30', status: '未处理', snapshot: asianFemaleImg },
    { id: 'liq-20', code: 'LIQ-20261027-020', type: '液位告警', deviceName: '厨余垃圾渗滤液收集槽', location: 'T1-B1垃圾站', measuredValue: '1.4m', safeThreshold: '0.2m - 0.8m', maxCapacity: '1.5m', fillPercent: 93, anomalyState: '渗滤液极高报警', triggerTime: '2026-10-27 11:00', status: '已处理', snapshot: asianMaleImg },
    { id: 'liq-21', code: 'LIQ-20261026-021', type: '液位告警', deviceName: '生活饮用水高位水箱', location: 'T2-顶层水箱', measuredValue: '0.5m', safeThreshold: '1.5m - 3.5m', maxCapacity: '4.0m', fillPercent: 12, anomalyState: '低位供水预警', triggerTime: '2026-10-26 19:20', status: '已处理', snapshot: asianGlassesImg },
    { id: 'liq-22', code: 'LIQ-20261026-022', type: '液位告警', deviceName: '室外消防水池2#组', location: '园区西侧地下室外', measuredValue: '4.1m', safeThreshold: '2.0m - 3.5m', maxCapacity: '4.5m', fillPercent: 91, anomalyState: '高位溢水预警', triggerTime: '2026-10-26 13:15', status: '未处理', snapshot: asianFemaleImg },
    { id: 'liq-23', code: 'LIQ-20261025-023', type: '液位告警', deviceName: '除盐水高位存储罐', location: '锅炉补水间', measuredValue: '0.4m', safeThreshold: '1.2m - 3.0m', maxCapacity: '3.2m', fillPercent: 12, anomalyState: '低位缺水预警', triggerTime: '2026-10-25 17:40', status: '已处理', snapshot: asianMaleImg },
    { id: 'liq-24', code: 'LIQ-20261025-024', type: '液位告警', deviceName: '车库防汛排涝集水井', location: 'B1坡道集水坑', measuredValue: '1.8m', safeThreshold: '0.4m - 1.2m', maxCapacity: '2.0m', fillPercent: 90, anomalyState: '排涝超水位预警', triggerTime: '2026-10-25 09:50', status: '未处理', snapshot: asianGlassesImg },
    { id: 'liq-25', code: 'LIQ-20261024-025', type: '液位告警', deviceName: '酸碱中和池液位探针', location: '实验室废水处理间', measuredValue: '2.3m', safeThreshold: '0.5m - 1.8m', maxCapacity: '2.5m', fillPercent: 92, anomalyState: '溢满报警', triggerTime: '2026-10-24 14:10', status: '已处理', snapshot: asianFemaleImg },
  ]);

  // Pressure Alarms (25 items)
  const [pressureAlarms, setPressureAlarms] = useState([
    { id: 'prs-1', code: 'PRS-20261106-001', type: '压力告警', deviceName: '消防喷淋压力表', location: 'T1-1F湿式报警阀', pipePressure: '1.25 MPa', safeRange: '0.60 - 0.90 MPa', systemTag: '消防喷淋管网', anomalyDetail: '管网超压爆管风险', triggerTime: '2026-11-06 16:20', status: '未处理', snapshot: asianGlassesImg },
    { id: 'prs-2', code: 'PRS-20261106-002', type: '压力告警', deviceName: '生活供水管压力传感器', location: 'B1变频供水泵房', pipePressure: '0.18 MPa', safeRange: '0.40 - 0.65 MPa', systemTag: '二次供水系统', anomalyDetail: '水压过低严重欠压', triggerTime: '2026-11-06 14:00', status: '已处理', snapshot: asianFemaleImg },
    { id: 'prs-3', code: 'PRS-20261105-003', type: '压力告警', deviceName: '冷冻水循环泵出口表', location: 'B2冷冻站主干管', pipePressure: '1.40 MPa', safeRange: '0.70 - 1.00 MPa', systemTag: '空调冷冻水循环', anomalyDetail: '供回水压差过大', triggerTime: '2026-11-05 15:50', status: '未处理', snapshot: asianMaleImg },
    { id: 'prs-4', code: 'PRS-20261105-004', type: '压力告警', deviceName: '消火栓管网末端传感器', location: 'T2-屋顶试验阀', pipePressure: '0.08 MPa', safeRange: '0.20 - 0.40 MPa', systemTag: '消火栓试水管网', anomalyDetail: '末端无压缺水', triggerTime: '2026-11-05 11:10', status: '已处理', snapshot: asianGlassesImg },
    { id: 'prs-5', code: 'PRS-20261104-005', type: '压力告警', deviceName: '蒸汽管道压力控制器', location: '锅炉房分汽缸', pipePressure: '0.85 MPa', safeRange: '0.30 - 0.60 MPa', systemTag: '锅炉蒸汽管网', anomalyDetail: '蒸汽超压告警', triggerTime: '2026-11-04 16:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'prs-6', code: 'PRS-20261104-006', type: '压力告警', deviceName: '燃气管道微压检测仪', location: 'T1-B1食堂燃气调压站', pipePressure: '12 kPa', safeRange: '3 - 8 kPa', systemTag: '园区天然气管线', anomalyDetail: '管道气压偏高', triggerTime: '2026-11-04 10:15', status: '未处理', snapshot: asianMaleImg },
    { id: 'prs-7', code: 'PRS-20261103-007', type: '压力告警', deviceName: '精密空调冷媒压力探针', location: '3F核心机房1#空调', pipePressure: '2.80 MPa', safeRange: '1.50 - 2.20 MPa', systemTag: '机房精密制冷', anomalyDetail: '冷媒高压保护', triggerTime: '2026-11-03 15:20', status: '已处理', snapshot: asianGlassesImg },
    { id: 'prs-8', code: 'PRS-20261103-008', type: '压力告警', deviceName: '雨水回收泵出口传感器', location: 'B2雨水泵房', pipePressure: '0.10 MPa', safeRange: '0.30 - 0.50 MPa', systemTag: '雨水回用系统', anomalyDetail: '泵吸入空转欠压', triggerTime: '2026-11-03 09:05', status: '已处理', snapshot: asianFemaleImg },
    { id: 'prs-9', code: 'PRS-20261102-009', type: '压力告警', deviceName: '气体灭火瓶组压力表', location: '1F配电室瓶组间', pipePressure: '3.1 MPa', safeRange: '4.0 - 4.5 MPa', systemTag: '七氟丙烷灭火瓶组', anomalyDetail: '灭火药剂泄漏欠压', triggerTime: '2026-11-02 14:40', status: '未处理', snapshot: asianMaleImg },
    { id: 'prs-10', code: 'PRS-20261101-010', type: '压力告警', deviceName: '定压补水装置压力开关', location: 'T3-屋顶暖通补水间', pipePressure: '0.12 MPa', safeRange: '0.25 - 0.45 MPa', systemTag: '暖通定压补水', anomalyDetail: '定压系统欠压', triggerTime: '2026-11-01 12:30', status: '已处理', snapshot: asianGlassesImg },
    { id: 'prs-11', code: 'PRS-20261031-011', type: '压力告警', deviceName: '高层生活加压管网变送器', location: 'T1-15F减压阀组', pipePressure: '0.85 MPa', safeRange: '0.35 - 0.60 MPa', systemTag: '高区给水系统', anomalyDetail: '减压阀故障超压', triggerTime: '2026-10-31 17:15', status: '未处理', snapshot: asianFemaleImg },
    { id: 'prs-12', code: 'PRS-20261031-012', type: '压力告警', deviceName: '冷却水循环泵进口压力表', location: 'B2冷却泵房', pipePressure: '0.05 MPa', safeRange: '0.15 - 0.35 MPa', systemTag: '暖通冷却水循环', anomalyDetail: '气蚀欠压风险', triggerTime: '2026-10-31 10:25', status: '已处理', snapshot: asianMaleImg },
    { id: 'prs-13', code: 'PRS-20261030-013', type: '压力告警', deviceName: '压缩空气总管压力计', location: 'T3-1F实验车间', pipePressure: '0.35 MPa', safeRange: '0.60 - 0.85 MPa', systemTag: '工业压缩空气', anomalyDetail: '空压管网严重欠压', triggerTime: '2026-10-30 16:40', status: '已处理', snapshot: asianGlassesImg },
    { id: 'prs-14', code: 'PRS-20261030-014', type: '压力告警', deviceName: '纯水系统反渗透入口表', location: '纯水处理机房', pipePressure: '1.80 MPa', safeRange: '0.90 - 1.40 MPa', systemTag: '纯水制备系统', anomalyDetail: '膜组件阻塞超压', triggerTime: '2026-10-30 08:50', status: '未处理', snapshot: asianFemaleImg },
    { id: 'prs-15', code: 'PRS-20261029-015', type: '压力告警', deviceName: '热交换站二次侧供水表', location: 'B1换热站', pipePressure: '0.75 MPa', safeRange: '0.30 - 0.50 MPa', systemTag: '采暖热力管网', anomalyDetail: '供热循环超压', triggerTime: '2026-10-29 19:05', status: '已处理', snapshot: asianMaleImg },
    { id: 'prs-16', code: 'PRS-20261029-016', type: '压力告警', deviceName: '室外消火栓环状管网表', location: '园区东门消火栓', pipePressure: '0.15 MPa', safeRange: '0.30 - 0.60 MPa', systemTag: '室外消防管网', anomalyDetail: '管网泄漏欠压', triggerTime: '2026-10-29 11:30', status: '已处理', snapshot: asianGlassesImg },
    { id: 'prs-17', code: 'PRS-20261028-017', type: '压力告警', deviceName: '真空吸引泵站负压表', location: 'T3-3F医疗实验区', pipePressure: '-0.02 MPa', safeRange: '-0.08 - -0.05 MPa', systemTag: '医用/实验负压系统', anomalyDetail: '负压抽吸不足', triggerTime: '2026-10-28 16:10', status: '未处理', snapshot: asianFemaleImg },
    { id: 'prs-18', code: 'PRS-20261028-018', type: '压力告警', deviceName: '太阳能热水循环泵出口表', location: 'T1-屋顶集热场', pipePressure: '0.55 MPa', safeRange: '0.20 - 0.40 MPa', systemTag: '太阳能热水管网', anomalyDetail: '管道堵塞高压', triggerTime: '2026-10-28 09:20', status: '已处理', snapshot: asianMaleImg },
    { id: 'prs-19', code: 'PRS-20261027-019', type: '压力告警', deviceName: '洁净室微正压差传感器', location: 'T3-4F无尘车间', pipePressure: '2 Pa', safeRange: '10 - 25 Pa', systemTag: '洁净室压差控制', anomalyDetail: '正压失衡外气倒灌', triggerTime: '2026-10-27 15:45', status: '未处理', snapshot: asianGlassesImg },
    { id: 'prs-20', code: 'PRS-20261027-020', type: '压力告警', deviceName: '高压细水雾灭火泵出口表', location: 'T2-3F档案室灭火站', pipePressure: '14.0 MPa', safeRange: '10.0 - 12.0 MPa', systemTag: '细水雾灭火系统', anomalyDetail: '细水雾管网超压', triggerTime: '2026-10-27 10:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'prs-21', code: 'PRS-20261026-021', type: '压力告警', deviceName: '变频供水高区出水表', location: 'T1-20F转换层', pipePressure: '0.22 MPa', safeRange: '0.45 - 0.70 MPa', systemTag: '超高层生活给水', anomalyDetail: '高区水压过低', triggerTime: '2026-10-26 18:40', status: '已处理', snapshot: asianMaleImg },
    { id: 'prs-22', code: 'PRS-20261026-022', type: '压力告警', deviceName: '水冷机组冷凝器压力表', location: 'B2冷机房', pipePressure: '1.95 MPa', safeRange: '1.20 - 1.60 MPa', systemTag: '冷水机组冷凝回路', anomalyDetail: '高压保护报警', triggerTime: '2026-10-26 12:10', status: '未处理', snapshot: asianGlassesImg },
    { id: 'prs-23', code: 'PRS-20261025-023', type: '压力告警', deviceName: '地下车库冲洗水管压变', location: 'B1保洁水嘴', pipePressure: '0.65 MPa', safeRange: '0.20 - 0.40 MPa', systemTag: '保洁水管网络', anomalyDetail: '管路冲高压力', triggerTime: '2026-10-25 16:25', status: '已处理', snapshot: asianFemaleImg },
    { id: 'prs-24', code: 'PRS-20261025-024', type: '压力告警', deviceName: '发电机组柴油供油管道表', location: '发电机房油泵间', pipePressure: '0.04 MPa', safeRange: '0.12 - 0.25 MPa', systemTag: '柴油发电机供油', anomalyDetail: '供油压力偏低', triggerTime: '2026-10-25 11:05', status: '未处理', snapshot: asianMaleImg },
    { id: 'prs-25', code: 'PRS-20261024-025', type: '压力告警', deviceName: '中水处理反洗过滤器表', location: '水处理站', pipePressure: '0.48 MPa', safeRange: '0.15 - 0.30 MPa', systemTag: '中水过滤管线', anomalyDetail: '滤芯截污压差过大', triggerTime: '2026-10-24 15:00', status: '已处理', snapshot: asianGlassesImg },
  ]);

  // Fault Alarms (25 items)
  const [faultAlarms, setFaultAlarms] = useState([
    { id: 'flt-1', code: 'FLT-20261106-001', type: '故障告警', deviceName: '1#冷水机组压缩机', location: 'B1冷冻站机房', faultCode: 'ERR-COMP-301', faultDesc: '压缩机排气温度过高过载跳闸', impactLevel: '一级严重 (暖通冷源)', triggerTime: '2026-11-06 16:15', status: '未处理', snapshot: asianFemaleImg },
    { id: 'flt-2', code: 'FLT-20261106-002', type: '故障告警', deviceName: '2#客梯主控制器', location: 'T1大楼电梯机房', faultCode: 'ERR-ELEV-104', faultDesc: '门机锁抱闸门回路异常关断', impactLevel: '二级故障 (垂直交通)', triggerTime: '2026-11-06 13:40', status: '已处理', snapshot: asianMaleImg },
    { id: 'flt-3', code: 'FLT-20261105-003', type: '故障告警', deviceName: '3#消防补水泵变频器', location: 'B2消防水泵房', faultCode: 'ERR-VFD-009', faultDesc: '变频器IGBT过流短路报警', impactLevel: '一级严重 (消防安防)', triggerTime: '2026-11-05 17:25', status: '未处理', snapshot: asianGlassesImg },
    { id: 'flt-4', code: 'FLT-20261105-004', type: '故障告警', deviceName: '变配电10kV高压开关柜', location: '10kV变电所', faultCode: 'ERR-SWG-202', faultDesc: 'SF6气体压力微漏低位报警', impactLevel: '特级电力基础设施', triggerTime: '2026-11-05 10:10', status: '已处理', snapshot: asianFemaleImg },
    { id: 'flt-5', code: 'FLT-20261104-005', type: '故障告警', deviceName: '地下车库排烟风机01', location: 'B1排烟风机房', faultCode: 'ERR-FAN-012', faultDesc: '电机风道风压开关故障', impactLevel: '二级故障 (防排烟)', triggerTime: '2026-11-04 15:50', status: '已处理', snapshot: asianMaleImg },
    { id: 'flt-6', code: 'FLT-20261104-006', type: '故障告警', deviceName: '生活加压泵驱动器', location: 'B1生活水泵房', faultCode: 'ERR-PMP-005', faultDesc: '相间电压不平衡故障', impactLevel: '二级故障 (生活用水)', triggerTime: '2026-11-04 08:30', status: '未处理', snapshot: asianGlassesImg },
    { id: 'flt-7', code: 'FLT-20261103-007', type: '故障告警', deviceName: 'DALI智能照明主控', location: 'T2-3F照明配电箱', faultCode: 'ERR-LGT-031', faultDesc: 'DALI总线总电源短路', impactLevel: '三级故障 (公区照明)', triggerTime: '2026-11-03 16:10', status: '已处理', snapshot: asianFemaleImg },
    { id: 'flt-8', code: 'FLT-20261103-008', type: '故障告警', deviceName: 'AHU-03组合式空调箱', location: 'T1-4F空调机房', faultCode: 'ERR-AHU-007', faultDesc: '初效过滤器堵塞压差告警', impactLevel: '三级故障 (新风循环)', triggerTime: '2026-11-03 11:15', status: '已处理', snapshot: asianMaleImg },
    { id: 'flt-9', code: 'FLT-20261102-009', type: '故障告警', deviceName: '污水提升泵02', location: 'B2地下集水坑', faultCode: 'ERR-STP-018', faultDesc: '电机热过载继电器动作', impactLevel: '二级故障 (防涝排污)', triggerTime: '2026-11-02 14:05', status: '未处理', snapshot: asianGlassesImg },
    { id: 'flt-10', code: 'FLT-20261101-010', type: '故障告警', deviceName: '锅炉点火控制器', location: '锅炉房控制室', faultCode: 'ERR-BLR-002', faultDesc: '燃气阀门反馈失灵', impactLevel: '一级严重 (冬季采暖)', triggerTime: '2026-11-01 09:40', status: '已处理', snapshot: asianFemaleImg },
    { id: 'flt-11', code: 'FLT-20261031-011', type: '故障告警', deviceName: '柴油发电机自动转换开关', location: '柴发配电间', faultCode: 'ERR-ATS-003', faultDesc: 'ATS双电源触头粘连熔焊', impactLevel: '特级备用电源', triggerTime: '2026-10-31 16:40', status: '未处理', snapshot: asianMaleImg },
    { id: 'flt-12', code: 'FLT-20261031-012', type: '故障告警', deviceName: '3#货梯扶梯驱动马达', location: 'T3物流卸货区', faultCode: 'ERR-ESC-201', faultDesc: '驱动链条拉伸超限安全开关动作', impactLevel: '二级故障 (货物运输)', triggerTime: '2026-10-31 10:55', status: '已处理', snapshot: asianGlassesImg },
    { id: 'flt-13', code: 'FLT-20261030-013', type: '故障告警', deviceName: '消防气体灭火控制主机', location: '数据中心防灾控制室', faultCode: 'ERR-FGS-011', faultDesc: '备用蓄电池组断路未连接', impactLevel: '一级严重 (数据中心安防)', triggerTime: '2026-10-30 17:35', status: '已处理', snapshot: asianFemaleImg },
    { id: 'flt-14', code: 'FLT-20261030-014', type: '故障告警', deviceName: '高压电容补偿控制器', location: '变配电所2#电容柜', faultCode: 'ERR-CAP-005', faultDesc: '接触器交流线圈烧毁', impactLevel: '二级故障 (无功补偿)', triggerTime: '2026-10-30 08:45', status: '未处理', snapshot: asianMaleImg },
    { id: 'flt-15', code: 'FLT-20261029-015', type: '故障告警', deviceName: 'T1-屋顶冷却塔风机02', location: 'T1-屋顶平台', faultCode: 'ERR-CT-008', faultDesc: '电机三相缺相保护触发', impactLevel: '二级故障 (散热循环)', triggerTime: '2026-10-29 18:25', status: '已处理', snapshot: asianGlassesImg },
    { id: 'flt-16', code: 'FLT-20261029-016', type: '故障告警', deviceName: '室外智能门禁车道闸门', location: '园区西侧出口道闸', faultCode: 'ERR-BAR-102', faultDesc: '减速机齿轮打滑卡死', impactLevel: '三级故障 (车辆出入)', triggerTime: '2026-10-29 09:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'flt-17', code: 'FLT-20261028-017', type: '故障告警', deviceName: '地下车库CO联动抽风机', location: 'B2地库1#风机房', faultCode: 'ERR-EF-015', faultDesc: '防火阀熔断闭锁信号丢失', impactLevel: '二级故障 (地库通风)', triggerTime: '2026-10-28 16:50', status: '未处理', snapshot: asianMaleImg },
    { id: 'flt-18', code: 'FLT-20261028-018', type: '故障告警', deviceName: '太阳能热水加压泵', location: 'T2-顶层热泵间', faultCode: 'ERR-HWT-004', faultDesc: '机械密封泄漏过热停机', impactLevel: '三级故障 (热水供应)', triggerTime: '2026-10-28 11:05', status: '已处理', snapshot: asianGlassesImg },
    { id: 'flt-19', code: 'FLT-20261027-019', type: '故障告警', deviceName: '10kV断路器分闸机构', location: '高压进线柜101', faultCode: 'ERR-CBK-901', faultDesc: '分闸弹簧储能电机故障', impactLevel: '特级电力高压', triggerTime: '2026-10-27 15:15', status: '未处理', snapshot: asianFemaleImg },
    { id: 'flt-20', code: 'FLT-20261027-020', type: '故障告警', deviceName: '纯水处理反渗高压泵', location: '实验室水处理房', faultCode: 'ERR-RO-003', faultDesc: '进水缺水保护开关失灵', impactLevel: '二级故障 (科研纯水)', triggerTime: '2026-10-27 10:45', status: '已处理', snapshot: asianMaleImg },
    { id: 'flt-21', code: 'FLT-20261026-021', type: '故障告警', deviceName: 'T2大楼2#观光电梯', location: 'T2大厅天井', faultCode: 'ERR-ELEV-209', faultDesc: '称重传感器零点漂移过载告警', impactLevel: '二级故障 (垂直交通)', triggerTime: '2026-10-26 17:35', status: '已处理', snapshot: asianGlassesImg },
    { id: 'flt-22', code: 'FLT-20261026-022', type: '故障告警', deviceName: '生活饮用水紫外线杀菌仪', location: '水质消毒间', faultCode: 'ERR-UV-001', faultDesc: 'UV灯管寿命到期断丝故障', impactLevel: '三级故障 (水质安全)', triggerTime: '2026-10-26 12:50', status: '未处理', snapshot: asianFemaleImg },
    { id: 'flt-23', code: 'FLT-20261025-023', type: '故障告警', deviceName: '厨余垃圾压实机电机', location: 'T1-B1后勤区', faultCode: 'ERR-MTR-088', faultDesc: '过载保护热继电器跳闸', impactLevel: '三级故障 (垃圾处理)', triggerTime: '2026-10-25 16:10', status: '已处理', snapshot: asianMaleImg },
    { id: 'flt-24', code: 'FLT-20261025-024', type: '故障告警', deviceName: '消防稳压泵组2#泵', location: 'B2稳压泵房', faultCode: 'ERR-FPP-002', faultDesc: '压力控制器触点氧化不良', impactLevel: '一级严重 (消防稳压)', triggerTime: '2026-10-25 08:55', status: '未处理', snapshot: asianGlassesImg },
    { id: 'flt-25', code: 'FLT-20261024-025', type: '故障告警', deviceName: '地库机械车位横移电机', location: 'B2地库C区车位', faultCode: 'ERR-PKG-014', faultDesc: '光电限位开关污染失控', impactLevel: '三级故障 (停车设备)', triggerTime: '2026-10-24 13:40', status: '已处理', snapshot: asianFemaleImg },
  ]);

  // Offline Alarms (25 items)
  const [offlineAlarms, setOfflineAlarms] = useState([
    { id: 'off-1', code: 'OFF-20261106-001', type: '离线告警', deviceName: '3F弱电间交换机02', location: 'T1-3F弱电井', ipAddress: '192.168.10.45', duration: '离线 45 分钟', cause: '心跳丢包/端口异常断开', triggerTime: '2026-11-06 16:30', status: '未处理', snapshot: asianMaleImg },
    { id: 'off-2', code: 'OFF-20261106-002', type: '离线告警', deviceName: 'B1物联网网关箱', location: 'B1网络机房', ipAddress: '192.168.20.12', duration: '离线 2 小时', cause: '网关电源模块供电中断', triggerTime: '2026-11-06 14:10', status: '已处理', snapshot: asianFemaleImg },
    { id: 'off-3', code: 'OFF-20261105-003', type: '离线告警', deviceName: 'T2层控温湿度采集器', location: 'T2-5F弱电井', ipAddress: 'RS485-CH03', duration: '离线 15 分钟', cause: '485总线屏蔽线受干扰脱落', triggerTime: '2026-11-05 16:00', status: '未处理', snapshot: asianGlassesImg },
    { id: 'off-4', code: 'OFF-20261105-004', type: '离线告警', deviceName: '东门车牌抓拍机终端', location: '园区东门岗亭', ipAddress: '192.168.30.88', duration: '离线 3 小时', cause: '室外局域网光纤收发器损坏', triggerTime: '2026-11-05 09:20', status: '已处理', snapshot: asianMaleImg },
    { id: 'off-5', code: 'OFF-20261104-005', type: '离线告警', deviceName: '变电所电力仪表网关', location: '10kV变电所', ipAddress: 'MODBUS-GW01', duration: '离线 10 分钟', cause: 'Modbus-RTU协议超时断开', triggerTime: '2026-11-04 15:15', status: '已处理', snapshot: asianFemaleImg },
    { id: 'off-6', code: 'OFF-20261104-006', type: '离线告警', deviceName: '室外多参数气象站', location: '园区中心绿地', ipAddress: 'LoRa-NODE-09', duration: '离线 1 小时', cause: 'LoRa无线节点距离衰减失联', triggerTime: '2026-11-04 10:00', status: '未处理', snapshot: asianGlassesImg },
    { id: 'off-7', code: 'OFF-20261103-007', type: '离线告警', deviceName: '1F门禁控制器04', location: 'T3-1F东门闸机', ipAddress: '192.168.40.14', duration: '离线 50 分钟', cause: '控制器局域网IP冲突', triggerTime: '2026-11-03 17:30', status: '已处理', snapshot: asianMaleImg },
    { id: 'off-8', code: 'OFF-20261103-008', type: '离线告警', deviceName: 'B2智能电表集中器', location: 'B2配电间', ipAddress: 'MBUS-CONC-02', duration: '离线 4 小时', cause: 'M-Bus总线负载过载保护', triggerTime: '2026-11-03 11:05', status: '已处理', snapshot: asianFemaleImg },
    { id: 'off-9', code: 'OFF-20261102-009', type: '离线告警', deviceName: '冷站BACnet DDC控制器', location: 'B1冷冻站', ipAddress: 'BACnet-IP-101', duration: '离线 20 分钟', cause: 'DDC控制器以太网卡重启', triggerTime: '2026-11-02 13:45', status: '未处理', snapshot: asianGlassesImg },
    { id: 'off-10', code: 'OFF-20261101-010', type: '离线告警', deviceName: '消火栓压力无线采集节点', location: 'T1-屋顶水箱间', ipAddress: 'NB-IoT-9002', duration: '离线 5 小时', cause: 'NB-IoT模组电池欠压掉线', triggerTime: '2026-11-01 08:15', status: '已处理', snapshot: asianMaleImg },
    { id: 'off-11', code: 'OFF-20261031-011', type: '离线告警', deviceName: 'T2-4F照明AP网关', location: 'T2-4F弱电井', ipAddress: '192.168.10.88', duration: '离线 30 分钟', cause: 'PoE供电交换机端口闪断', triggerTime: '2026-10-31 16:20', status: '未处理', snapshot: asianGlassesImg },
    { id: 'off-12', code: 'OFF-20261031-012', type: '离线告警', deviceName: '景观喷泉DMX512控制器', location: '园区中庭控制箱', ipAddress: '192.168.50.22', duration: '离线 1.5 小时', cause: '控制主板防雷器击穿', triggerTime: '2026-10-31 10:05', status: '已处理', snapshot: asianFemaleImg },
    { id: 'off-13', code: 'OFF-20261030-013', type: '离线告警', deviceName: '冷水机组PLC网关', location: 'B2制冷站', ipAddress: '192.168.15.101', duration: '离线 25 分钟', cause: '网线插头松动接触不良', triggerTime: '2026-10-30 17:45', status: '已处理', snapshot: asianMaleImg },
    { id: 'off-14', code: 'OFF-20261030-014', type: '离线告警', deviceName: '高压电能质量分析仪', location: '10kV配电房1#进线', ipAddress: 'MODBUS-GW04', duration: '离线 3 小时', cause: '485通讯芯片击穿损坏', triggerTime: '2026-10-30 09:10', status: '未处理', snapshot: asianGlassesImg },
    { id: 'off-15', code: 'OFF-20261029-015', type: '离线告警', deviceName: 'T1-1F大堂人脸门禁机01', location: 'T1-1F主入口闸机', ipAddress: '192.168.40.20', duration: '离线 10 分钟', cause: '网络广播风暴导致卡顿', triggerTime: '2026-10-29 18:05', status: '已处理', snapshot: asianFemaleImg },
    { id: 'off-16', code: 'OFF-20261029-016', type: '离线告警', deviceName: '档案库温湿度WIFI网关', location: 'T3-B1档案库', ipAddress: '192.168.60.12', duration: '离线 4 小时', cause: 'AP信道干扰丢失连接', triggerTime: '2026-10-29 08:40', status: '已处理', snapshot: asianMaleImg },
    { id: 'off-17', code: 'OFF-20261028-017', type: '离线告警', deviceName: '地下车库抓拍摄像机12', location: 'B1坡道口', ipAddress: '192.168.30.44', duration: '离线 50 分钟', cause: '网络线缆破损断针', triggerTime: '2026-10-28 16:30', status: '未处理', snapshot: asianGlassesImg },
    { id: 'off-18', code: 'OFF-20261028-018', type: '离线告警', deviceName: '生活水泵房远程IO模块', location: 'B1水泵房', ipAddress: '192.168.20.95', duration: '离线 2 小时', cause: '24V直流开关电源故障', triggerTime: '2026-10-28 10:15', status: '已处理', snapshot: asianFemaleImg },
    { id: 'off-19', code: 'OFF-20261027-019', type: '离线告警', deviceName: '楼宇自控DDC主机08', location: 'T2-6F弱电井', ipAddress: '192.168.10.108', duration: '离线 15 分钟', cause: 'DDC固件自动更新重启', triggerTime: '2026-10-27 15:20', status: '未处理', snapshot: asianMaleImg },
    { id: 'off-20', code: 'OFF-20261027-020', type: '离线告警', deviceName: '柴油发电机集中监测终端', location: '柴发机房', ipAddress: '192.168.25.30', duration: '离线 6 小时', cause: '串口服务器断电掉线', triggerTime: '2026-10-27 10:50', status: '已处理', snapshot: asianGlassesImg },
    { id: 'off-21', code: 'OFF-20261026-021', type: '离线告警', deviceName: '西门卡口离线告警器', location: '园区西门闸机', ipAddress: '192.168.30.99', duration: '离线 40 分钟', cause: '千兆光纤盘纤断裂', triggerTime: '2026-10-26 18:25', status: '已处理', snapshot: asianFemaleImg },
    { id: 'off-22', code: 'OFF-20261026-022', type: '离线告警', deviceName: '智能水表M-Bus集中采集器', location: 'T1-10F水表井', ipAddress: 'MBUS-CONC-05', duration: '离线 1.2 小时', cause: '总线电压跌落低于12V', triggerTime: '2026-10-26 12:30', status: '未处理', snapshot: asianMaleImg },
    { id: 'off-23', code: 'OFF-20261025-023', type: '离线告警', deviceName: '光伏逆变器RS485转换器', location: 'T1-屋顶光伏区', ipAddress: 'RS485-PV-01', duration: '离线 3.5 小时', cause: '室外高温导致通讯模块过热', triggerTime: '2026-10-25 15:50', status: '已处理', snapshot: asianGlassesImg },
    { id: 'off-24', code: 'OFF-20261025-024', type: '离线告警', deviceName: '周界脉冲防区主机03', location: '园区南界警戒房', ipAddress: '192.168.70.15', duration: '离线 20 分钟', cause: '防区扩展卡掉线', triggerTime: '2026-10-25 09:10', status: '未处理', snapshot: asianFemaleImg },
    { id: 'off-25', code: 'OFF-20261024-025', type: '离线告警', deviceName: '电梯五方对讲IP网关', location: 'T3电梯机房', ipAddress: '192.168.80.10', duration: '离线 2.5 小时', cause: 'VoIP网关服务进程崩溃', triggerTime: '2026-10-24 14:35', status: '已处理', snapshot: asianMaleImg },
  ]);

  // Abnormality Alarms (25 items)
  const [abnormalAlarms, setAbnormalAlarms] = useState([
    { id: 'abn-1', code: 'ABN-20261106-001', type: '异常告警', deviceName: '2#冷冻水循环泵', location: 'B2冷站机房', paramItem: '电机轴承振动', measuredDeviation: '7.8 mm/s (上限 4.5 mm/s)', healthScore: '62% (轴承磨损异响)', triggerTime: '2026-11-06 15:45', status: '未处理', snapshot: asianGlassesImg },
    { id: 'abn-2', code: 'ABN-20261106-002', type: '异常告警', deviceName: '1#变压器绕组测温仪', location: '10kV变电所', paramItem: 'A相绕组温度', measuredDeviation: '108°C (警戒 90°C)', healthScore: '70% (负荷偏高超温)', triggerTime: '2026-11-06 12:00', status: '已处理', snapshot: asianFemaleImg },
    { id: 'abn-3', code: 'ABN-20261105-003', type: '异常告警', deviceName: 'T1-4F送风机', location: 'T1-4F空调机房', paramItem: '风机皮带张力/转速', measuredDeviation: '转速衰减 18% (打滑)', healthScore: '68% (皮带松弛需紧固)', triggerTime: '2026-11-05 16:10', status: '未处理', snapshot: asianMaleImg },
    { id: 'abn-4', code: 'ABN-20261105-004', type: '异常告警', deviceName: '二次供水加压泵', location: 'B1生活水泵房', paramItem: '泵体工作三相电流', measuredDeviation: '三相电流不平衡度 14%', healthScore: '75% (叶片轻微缠绕)', triggerTime: '2026-11-05 10:45', status: '已处理', snapshot: asianGlassesImg },
    { id: 'abn-5', code: 'ABN-20261104-005', type: '异常告警', deviceName: 'B1高压电容补偿柜', location: '高压配电室', paramItem: '电容器运行温度/电容', measuredDeviation: '电容衰减 22% (谐波大)', healthScore: '65% (需更换电容单元)', triggerTime: '2026-11-04 14:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'abn-6', code: 'ABN-20261104-006', type: '异常告警', deviceName: '1#客梯曳引机', location: 'T2大楼顶层机房', paramItem: '曳引轮减速箱油温', measuredDeviation: '油温 78°C (正常 <60°C)', healthScore: '58% (润滑油老化劣质)', triggerTime: '2026-11-04 09:15', status: '未处理', snapshot: asianMaleImg },
    { id: 'abn-7', code: 'ABN-20261103-007', type: '异常告警', deviceName: '屋顶冷却塔风机01', location: 'T3屋顶', paramItem: '风机叶片动平衡', measuredDeviation: '振动超标 6.2 mm/s', healthScore: '72% (叶片积垢配重偏)', triggerTime: '2026-11-03 16:40', status: '已处理', snapshot: asianGlassesImg },
    { id: 'abn-8', code: 'ABN-20261103-008', type: '异常告警', deviceName: '柴油发电机组蓄电池', location: '柴油发电机房', paramItem: '启动电池内阻', measuredDeviation: '内阻升高 35% (充不进)', healthScore: '52% (电池寿命濒临极限)', triggerTime: '2026-11-03 10:50', status: '已处理', snapshot: asianFemaleImg },
    { id: 'abn-9', code: 'ABN-20261102-009', type: '异常告警', deviceName: '弱电机房UPS后备电源', location: 'T1-3F弱电中心', paramItem: '浮充电压/单体温升', measuredDeviation: '3#单体电压偏低 11.2V', healthScore: '60% (单体电池损坏)', triggerTime: '2026-11-02 15:10', status: '未处理', snapshot: asianMaleImg },
    { id: 'abn-10', code: 'ABN-20261101-010', type: '异常告警', deviceName: '中央空调电子膨胀阀', location: 'B1空调主机', paramItem: '阀门开度反馈偏差', measuredDeviation: '开度反馈漂移 15%', healthScore: '78% (步进电机老化)', triggerTime: '2026-11-01 11:20', status: '已处理', snapshot: asianGlassesImg },
    { id: 'abn-11', code: 'ABN-20261031-011', type: '异常告警', deviceName: '3#排烟风机轴承箱', location: 'T2-B2排烟机房', paramItem: '轴承运行温度', measuredDeviation: '油温 85°C (正常 <65°C)', healthScore: '61% (缺失润滑干磨)', triggerTime: '2026-10-31 16:30', status: '未处理', snapshot: asianFemaleImg },
    { id: 'abn-12', code: 'ABN-20261031-012', type: '异常告警', deviceName: '高压开关柜铜排母线', location: '10kV变电所3#柜', paramItem: '红外接头温升差', measuredDeviation: '温差 32°C (接触电阻大)', healthScore: '66% (螺栓松动氧化)', triggerTime: '2026-10-31 10:15', status: '已处理', snapshot: asianMaleImg },
    { id: 'abn-13', code: 'ABN-20261030-013', type: '异常告警', deviceName: '生活加压泵2#水泵', location: 'B1给水泵房', paramItem: '机械密封泄漏率', measuredDeviation: '泄漏滴答 40滴/min', healthScore: '55% (机封动静环磨损)', triggerTime: '2026-10-30 17:10', status: '已处理', snapshot: asianGlassesImg },
    { id: 'abn-14', code: 'ABN-20261030-014', type: '异常告警', deviceName: '2#冷水机组蒸发器', location: 'B2冷站', paramItem: '蒸发器端温差', measuredDeviation: '端温差 4.2°C (正常 <1.5°C)', healthScore: '64% (铜管结垢需清洗)', triggerTime: '2026-10-30 08:35', status: '未处理', snapshot: asianFemaleImg },
    { id: 'abn-15', code: 'ABN-20261029-015', type: '异常告警', deviceName: 'T1-屋顶空调冷却塔', location: 'T1-屋顶平台', paramItem: '减速箱齿轮噪声震动', measuredDeviation: '噪声 88dB (超标 15dB)', healthScore: '59% (齿轮崩齿磨损)', triggerTime: '2026-10-29 18:45', status: '已处理', snapshot: asianMaleImg },
    { id: 'abn-16', code: 'ABN-20261029-016', type: '异常告警', deviceName: '变频二次供水泵3#泵', location: 'T3-B1水泵房', paramItem: '逆变模块散热片温度', measuredDeviation: '散热片 92°C (风扇停转)', healthScore: '50% (散热风扇堵转)', triggerTime: '2026-10-29 09:10', status: '已处理', snapshot: asianGlassesImg },
    { id: 'abn-17', code: 'ABN-20261028-017', type: '异常告警', deviceName: '柴油发电机曲轴箱', location: '柴发机房', paramItem: '机油压力与黏度', measuredDeviation: '油压 0.18MPa (偏低)', healthScore: '63% (机油稀释或泵磨损)', triggerTime: '2026-10-28 16:00', status: '未处理', snapshot: asianFemaleImg },
    { id: 'abn-18', code: 'ABN-20261028-018', type: '异常告警', deviceName: '消防喷淋增压稳压泵', location: 'T2-屋顶消防间', paramItem: '稳压泵启动频率', measuredDeviation: '启动 12次/h (正常 <3次)', healthScore: '67% (稳压罐气囊微漏)', triggerTime: '2026-10-28 10:25', status: '已处理', snapshot: asianMaleImg },
    { id: 'abn-19', code: 'ABN-20261027-019', type: '异常告警', deviceName: 'DALI智能控制网关', location: 'T1-5F强电井', paramItem: '总线通讯误码率', measuredDeviation: '误码率 5.8% (信号衰减)', healthScore: '74% (屏蔽接地不良)', triggerTime: '2026-10-27 15:05', status: '未处理', snapshot: asianGlassesImg },
    { id: 'abn-20', code: 'ABN-20261027-020', type: '异常告警', deviceName: '污水提升泵1#泵', location: 'B2污泥坑', paramItem: '电机绝缘电阻', measuredDeviation: '绝缘电阻 1.2MΩ (正常 >5MΩ)', healthScore: '53% (电机绕组受潮)', triggerTime: '2026-10-27 10:40', status: '已处理', snapshot: asianFemaleImg },
    { id: 'abn-21', code: 'ABN-20261026-021', type: '异常告警', deviceName: 'T3-1F排风机机组', location: 'T3-1F风机房', paramItem: '风机叶轮静平衡', measuredDeviation: '偏心震动 8.2 mm/s', healthScore: '60% (叶片油污结垢)', triggerTime: '2026-10-26 17:50', status: '已处理', snapshot: asianMaleImg },
    { id: 'abn-22', code: 'ABN-20261026-022', type: '异常告警', deviceName: '纯水设备高压柱塞泵', location: '实验室水站', paramItem: '柱塞密封漏水量', measuredDeviation: '渗漏增加 25%', healthScore: '69% (密封圈老化)', triggerTime: '2026-10-26 11:15', status: '未处理', snapshot: asianGlassesImg },
    { id: 'abn-23', code: 'ABN-20261025-023', type: '异常告警', deviceName: '冷凝水循环泵1#泵', location: 'B1空调机房', paramItem: '联轴器对中偏差', measuredDeviation: '径向跳动 0.25mm', healthScore: '65% (橡胶垫胶圈磨损)', triggerTime: '2026-10-25 16:40', status: '已处理', snapshot: asianFemaleImg },
    { id: 'abn-24', code: 'ABN-20261025-024', type: '异常告警', deviceName: '地库扶梯无感调速器', location: 'B1-B2自动扶梯', paramItem: '变频器散热风扇转速', measuredDeviation: '转速降低 40%', healthScore: '56% (轴承含尘老化)', triggerTime: '2026-10-25 09:30', status: '未处理', snapshot: asianMaleImg },
    { id: 'abn-25', code: 'ABN-20261024-025', type: '异常告警', deviceName: '锅炉补水脱盐软化器', location: 'B2锅炉房', paramItem: '出水硬度指标', measuredDeviation: '硬度 0.08mmol/L (超标)', healthScore: '71% (树脂失效需再生)', triggerTime: '2026-10-24 14:15', status: '已处理', snapshot: asianGlassesImg },
  ]);

  // Energy Over-Consumption Alarms (25 items)
  const [energyAlarms, setEnergyAlarms] = useState([
    { id: 'eng-1', code: 'ENG-20261106-001', type: '能耗超标告警', area: 'T1地下车库B1层', deviceName: 'B1照明回路智能电表', indicator: '电量 / 功率', realTimeEnergy: '185.5 kWh/h', threshold: '120.0 kWh/h', deviationPercent: '+54.6% (用电高峰跃升)', triggerTime: '2026-11-06 16:30', status: '未处理', snapshot: asianGlassesImg },
    { id: 'eng-2', code: 'ENG-20261106-002', type: '能耗超标告警', area: 'T2大楼3F核心机房', deviceName: '精密空调1#电量计量仪', indicator: '用电功率/负荷', realTimeEnergy: '320.0 kWh/h', threshold: '240.0 kWh/h', deviationPercent: '+33.3% (空调超额能耗)', triggerTime: '2026-11-06 14:15', status: '已处理', snapshot: asianFemaleImg },
    { id: 'eng-3', code: 'ENG-20261105-003', type: '能耗超标告警', area: 'B2冷机房冷水机组', deviceName: '1#冷水主机电力变送器', indicator: '三相总耗电量', realTimeEnergy: '580.2 kWh/h', threshold: '450.0 kWh/h', deviationPercent: '+28.9% (低能效运行)', triggerTime: '2026-11-05 17:00', status: '未处理', snapshot: asianMaleImg },
    { id: 'eng-4', code: 'ENG-20261105-004', type: '能耗超标告警', area: 'T3-1F员工食堂厨房', deviceName: '厨房燃气计量表02', indicator: '天然气流量', realTimeEnergy: '48.5 m³/h', threshold: '30.0 m³/h', deviationPercent: '+61.7% (燃气流量异跳)', triggerTime: '2026-11-05 11:40', status: '已处理', snapshot: asianGlassesImg },
    { id: 'eng-5', code: 'ENG-20261104-005', type: '能耗超标告警', area: '园区景观水系与喷泉', deviceName: '景观补水管道水表01', indicator: '自来水用水量', realTimeEnergy: '15.2 m³/h', threshold: '8.0 m³/h', deviationPercent: '+90.0% (潜水泵泄漏风险)', triggerTime: '2026-11-04 15:20', status: '已处理', snapshot: asianFemaleImg },
    { id: 'eng-6', code: 'ENG-20261104-006', type: '能耗超标告警', area: 'T1-4F办公区公共照明', deviceName: '4F照明支路电能表', indicator: '照明用电功率', realTimeEnergy: '95.4 kWh/h', threshold: '65.0 kWh/h', deviationPercent: '+46.8% (下班后未熄灯)', triggerTime: '2026-11-04 20:10', status: '未处理', snapshot: asianMaleImg },
    { id: 'eng-7', code: 'ENG-20261103-007', type: '能耗超标告警', area: 'T2-5F数据中心', deviceName: 'UPS后备电源输入计量', indicator: '视在功率/功因', realTimeEnergy: '210.0 kVA', threshold: '160.0 kVA', deviationPercent: '+31.25% (功因漂移过大)', triggerTime: '2026-11-03 16:05', status: '已处理', snapshot: asianGlassesImg },
    { id: 'eng-8', code: 'ENG-20261103-008', type: '能耗超标告警', area: 'B1生活加压泵房', deviceName: '2#水泵变频器电能表', indicator: '泵组用电量', realTimeEnergy: '142.0 kWh/h', threshold: '100.0 kWh/h', deviationPercent: '+42.0% (管网回水阀阻力大)', triggerTime: '2026-11-03 09:30', status: '已处理', snapshot: asianFemaleImg },
    { id: 'eng-9', code: 'ENG-20261102-009', type: '能耗超标告警', area: '园区室外路灯系统', deviceName: '太阳能/市电互补控制器', indicator: '市电补充耗电', realTimeEnergy: '88.0 kWh/h', threshold: '40.0 kWh/h', deviationPercent: '+120.0% (光伏电池阴雨欠压)', triggerTime: '2026-11-02 19:40', status: '未处理', snapshot: asianMaleImg },
    { id: 'eng-10', code: 'ENG-20261101-010', type: '能耗超标告警', area: '锅炉房蒸汽管线', deviceName: '高温蒸汽流量计', indicator: '蒸汽耗量', realTimeEnergy: '3.2 t/h', threshold: '2.2 t/h', deviationPercent: '+45.5% (疏水阀泄漏)', triggerTime: '2026-11-01 10:50', status: '已处理', snapshot: asianGlassesImg },
    { id: 'eng-11', code: 'ENG-20261031-011', type: '能耗超标告警', area: 'T3-3F芯片洁净车间', deviceName: '洁净空调机组总电表', indicator: '用电功率', realTimeEnergy: '410.0 kWh/h', threshold: '300.0 kWh/h', deviationPercent: '+36.6% (新风除湿高负荷)', triggerTime: '2026-10-31 16:55', status: '未处理', snapshot: asianFemaleImg },
    { id: 'eng-12', code: 'ENG-20261031-012', type: '能耗超标告警', area: 'B2地下车库智能充电桩区', deviceName: '直流快充桩分配电柜', indicator: '快充用电功率', realTimeEnergy: '520.0 kWh/h', threshold: '400.0 kWh/h', deviationPercent: '+30.0% (多车并发快充)', triggerTime: '2026-10-31 11:20', status: '已处理', snapshot: asianMaleImg },
    { id: 'eng-13', code: 'ENG-20261030-013', type: '能耗超标告警', area: 'T1-2F多功能宴会前厅', deviceName: '中央空调末端VRV电表', indicator: '冷量耗电比', realTimeEnergy: '135.0 kWh/h', threshold: '85.0 kWh/h', deviationPercent: '+58.8% (门窗开启冷气外泄)', triggerTime: '2026-10-30 17:40', status: '已处理', snapshot: asianGlassesImg },
    { id: 'eng-14', code: 'ENG-20261030-014', type: '能耗超标告警', area: '园区景观地下湖循环泵', deviceName: '循环潜水泵智能计量', indicator: '用电总功', realTimeEnergy: '75.0 kWh/h', threshold: '45.0 kWh/h', deviationPercent: '+66.7% (滤网过脏抗阻增大)', triggerTime: '2026-10-30 09:05', status: '未处理', snapshot: asianFemaleImg },
    { id: 'eng-15', code: 'ENG-20261029-015', type: '能耗超标告警', area: 'T2大楼全楼客梯组', deviceName: '电梯动力总配电表', indicator: '垂直交通耗电', realTimeEnergy: '280.0 kWh/h', threshold: '200.0 kWh/h', deviationPercent: '+40.0% (上下班客流爆发)', triggerTime: '2026-10-29 18:15', status: '已处理', snapshot: asianMaleImg },
    { id: 'eng-16', code: 'ENG-20261029-016', type: '能耗超标告警', area: '园区高压蒸汽管网', deviceName: '热力站蒸汽总计', indicator: '热能耗量', realTimeEnergy: '4.5 t/h', threshold: '3.0 t/h', deviationPercent: '+50.0% (管道保温层损坏)', triggerTime: '2026-10-29 08:50', status: '已处理', snapshot: asianGlassesImg },
    { id: 'eng-17', code: 'ENG-20261028-017', type: '能耗超标告警', area: 'T1-B1后勤烘干房', deviceName: '洗涤设备电量表', indicator: '热风烘干电功率', realTimeEnergy: '165.0 kWh/h', threshold: '110.0 kWh/h', deviationPercent: '+50.0% (烘干机满负荷长跑)', triggerTime: '2026-10-28 16:40', status: '未处理', snapshot: asianFemaleImg },
    { id: 'eng-18', code: 'ENG-20261028-018', type: '能耗超标告警', area: 'T3-1F大厅通体幕墙遮阳', deviceName: '电动遮阳帘电能表', indicator: '驱动电机用电', realTimeEnergy: '28.0 kWh/h', threshold: '12.0 kWh/h', deviationPercent: '+133.3% (机构卡阻高电流)', triggerTime: '2026-10-28 10:50', status: '已处理', snapshot: asianMaleImg },
    { id: 'eng-19', code: 'ENG-20261027-019', type: '能耗超标告警', area: '园区东南雨水泵站', deviceName: '防汛大功率潜排泵', indicator: '排涝电量', realTimeEnergy: '310.0 kWh/h', threshold: '200.0 kWh/h', deviationPercent: '+55.0% (暴雨防汛连续抽水)', triggerTime: '2026-10-27 15:35', status: '未处理', snapshot: asianGlassesImg },
    { id: 'eng-20', code: 'ENG-20261027-020', type: '能耗超标告警', area: 'T2-2F员工健身房', deviceName: '健身房配电箱电表', indicator: '照明与新风电量', realTimeEnergy: '85.0 kWh/h', threshold: '50.0 kWh/h', deviationPercent: '+70.0% (新风全速运行)', triggerTime: '2026-10-27 10:10', status: '已处理', snapshot: asianFemaleImg },
    { id: 'eng-21', code: 'ENG-20261026-021', type: '能耗超标告警', area: 'B1地下超市商业区', deviceName: '冷柜集中制冷电表', indicator: '冷柜制冷用电', realTimeEnergy: '240.0 kWh/h', threshold: '170.0 kWh/h', deviationPercent: '+41.2% (冷柜除霜周期延迟)', triggerTime: '2026-10-26 18:00', status: '已处理', snapshot: asianMaleImg },
    { id: 'eng-22', code: 'ENG-20261026-022', type: '能耗超标告警', area: 'T1-10F至15F高区办公', deviceName: '高区VRV空调外机电表', indicator: '空调制冷总功', realTimeEnergy: '390.0 kWh/h', threshold: '280.0 kWh/h', deviationPercent: '+39.3% (西晒严重超负荷)', triggerTime: '2026-10-26 12:20', status: '未处理', snapshot: asianGlassesImg },
    { id: 'eng-23', code: 'ENG-20261025-023', type: '能耗超标告警', area: '园区中央景观亮化工程', deviceName: '夜景灯光控制主柜', indicator: '亮化艺术用电', realTimeEnergy: '195.0 kWh/h', threshold: '120.0 kWh/h', deviationPercent: '+62.5% (节日全开模式)', triggerTime: '2026-10-25 19:15', status: '已处理', snapshot: asianFemaleImg },
    { id: 'eng-24', code: 'ENG-20261025-024', type: '能耗超标告警', area: 'T3-B2中水处理厂站', deviceName: '曝气风机智能计量', indicator: '风机运行电量', realTimeEnergy: '175.0 kWh/h', threshold: '125.0 kWh/h', deviationPercent: '+40.0% (污水溶解氧调控)', triggerTime: '2026-10-25 09:40', status: '未处理', snapshot: asianMaleImg },
    { id: 'eng-25', code: 'ENG-20261024-025', type: '能耗超标告警', area: 'T1-顶层多功能会议厅', deviceName: '舞台灯光与音响配电表', indicator: '演艺设备电量', realTimeEnergy: '145.0 kWh/h', threshold: '90.0 kWh/h', deviationPercent: '+61.1% (大型发布会备用彩排)', triggerTime: '2026-10-24 14:50', status: '已处理', snapshot: asianGlassesImg },
  ]);

  // Modal states for Manual Dispatch and View Work Order
  const [isManualDispatchOpen, setIsManualDispatchOpen] = useState(false);
  const [isViewWorkOrderOpen, setIsViewWorkOrderOpen] = useState(false);
  const [selectedBlacklistItem, setSelectedBlacklistItem] = useState<any>(null);

  const [dispatchAssignee, setDispatchAssignee] = useState('安防应急班组 (张工)');
  const [dispatchPriority, setDispatchPriority] = useState('特急');
  const [dispatchRemark, setDispatchRemark] = useState('');

  // Alarm Work Orders state for '告警工单' (25 items)
  const [alarmWorkOrders, setAlarmWorkOrders] = useState([
    { id: 'awo-1', code: 'AWO-20261106001', type: '安防告警派单', title: '人员黑名单闯入A座大厅', reporter: 'AI智能人脸抓拍', reportTime: '2026-11-06 16:01', assignee: '安防班组 (张工)', status: '处理中' },
    { id: 'awo-2', code: 'AWO-20261106002', type: '环境告警派单', title: '3F机房温度异常过高', reporter: '物联网温湿度传感器', reportTime: '2026-11-06 14:20', assignee: '暖通班组 (李经理)', status: '待派单' },
    { id: 'awo-3', code: 'AWO-20261106003', type: '设备告警派单', title: '2#消防泵离线失联告警', reporter: 'PLC总线状态监测', reportTime: '2026-11-05 11:10', assignee: '消防维保组 (王工)', status: '已完成' },
    { id: 'awo-4', code: 'AWO-20261106004', type: '能耗告警派单', title: '地下车库照明能耗超标预警', reporter: '智能电表采集', reportTime: '2026-11-05 09:30', assignee: '综合能效组 (陈工)', status: '处理中' },
    { id: 'awo-5', code: 'AWO-20261104005', type: '安防告警派单', title: '园区周界红外对射非法越界', reporter: '周界防区光栅', reportTime: '2026-11-04 22:15', assignee: '夜间安保值班', status: '已完成' },
    { id: 'awo-6', code: 'AWO-20261104006', type: '设备告警派单', title: '1#冷水机组压缩机排气超温', reporter: '冷站DDC控制', reportTime: '2026-11-04 16:20', assignee: '暖通急修组 (赵工)', status: '处理中' },
    { id: 'awo-7', code: 'AWO-20261103007', type: '环境告警派单', title: 'B1档案室高湿溢限预警', reporter: '温湿度传感器02', reportTime: '2026-11-03 17:05', assignee: '档案后勤组 (刘工)', status: '已完成' },
    { id: 'awo-8', code: 'AWO-20261103008', type: '安防告警派单', title: '西门黑名单车辆强制闯关', reporter: '道闸抓拍机01', reportTime: '2026-11-03 13:15', assignee: '安防应急班组 (张工)', status: '已完成' },
    { id: 'awo-9', code: 'AWO-20261102009', type: '设备告警派单', title: '10kV高压开关柜气体微漏', reporter: '绝缘气体传感器', reportTime: '2026-11-02 14:10', assignee: '电力高压抢修队', status: '处理中' },
    { id: 'awo-10', code: 'AWO-20261101010', type: '能耗告警派单', title: '1#冷水主机用电量异跳超标', reporter: '冷机电力变送器', reportTime: '2026-11-01 10:20', assignee: '能效运维组 (周工)', status: '已完成' },
    { id: 'awo-11', code: 'AWO-20261031011', type: '环境告警派单', title: '地下车库A区一氧化碳CO浓度超标', reporter: '车库CO检测仪', reportTime: '2026-10-31 17:30', assignee: '通风控制组 (孙工)', status: '待派单' },
    { id: 'awo-12', code: 'AWO-20261031012', type: '设备告警派单', title: '2#客梯抱闸回路故障停梯', reporter: '电梯五方对讲主机', reportTime: '2026-10-31 11:05', assignee: '奥的斯维保驻点', status: '处理中' },
    { id: 'awo-13', code: 'AWO-20261030013', type: '安防告警派单', title: '高压配电房后门红外入侵告警', reporter: '双鉴探测器09', reportTime: '2026-10-30 18:20', assignee: '安防中控值班', status: '已完成' },
    { id: 'awo-14', code: 'AWO-20261030014', type: '环境告警派单', title: 'T1-屋顶冷塔补水管道低温冻结预警', reporter: '管道温度开关', reportTime: '2026-10-30 09:40', assignee: '暖通保温班组', status: '已完成' },
    { id: 'awo-15', code: 'AWO-20261029015', type: '设备告警派单', title: '消防喷淋管网严重超压告警', reporter: '湿式报警阀压力表', reportTime: '2026-10-29 16:35', assignee: '消防维保组 (王工)', status: '处理中' },
    { id: 'awo-16', code: 'AWO-20261029016', type: '能耗告警派单', title: 'T1大楼5F公共照明夜间未关超标', reporter: '智能照明能耗监测', reportTime: '2026-10-29 20:15', assignee: '物业行政值班', status: '已完成' },
    { id: 'awo-17', code: 'AWO-20261028017', type: '安防告警派单', title: 'B2层电缆隧道光纤振动防翻越告警', reporter: '震动光纤主机', reportTime: '2026-10-28 17:00', assignee: '周界巡逻队', status: '处理中' },
    { id: 'awo-18', code: 'AWO-20261028018', type: '设备告警派单', title: '变频二次供水泵三相电流不平衡', reporter: '水泵驱动器', reportTime: '2026-10-28 10:50', assignee: '水务机电组', status: '已完成' },
    { id: 'awo-19', code: 'AWO-20261027019', type: '环境告警派单', title: 'T3-4F实验室TVOC挥发物浓度过高', reporter: 'VOC气体检测仪', reportTime: '2026-10-27 15:10', assignee: '实验室安全员', status: '待派单' },
    { id: 'awo-20', code: 'AWO-20261027020', type: '设备告警派单', title: 'B1物联网网关箱失联离线告警', reporter: '网关心跳检测', reportTime: '2026-10-27 09:25', assignee: '弱电网络组', status: '已完成' },
    { id: 'awo-21', code: 'AWO-20261026021', type: '能耗告警派单', title: '园区景观水系自来水补水量异常过大', reporter: '水表变送器', reportTime: '2026-10-26 18:40', assignee: '绿化给排水组', status: '处理中' },
    { id: 'awo-22', code: 'AWO-20261026022', type: '安防告警派单', title: '研发楼5F电梯厅黑名单人员频繁徘徊', reporter: '人脸识别抓拍机', reportTime: '2026-10-26 12:15', assignee: '安防班组 (张工)', status: '已完成' },
    { id: 'awo-23', code: 'AWO-20261025023', type: '设备告警派单', title: '柴油发电机组启动蓄电池内阻升高老化', reporter: '柴发电池监测仪', reportTime: '2026-10-25 16:05', assignee: '发电机专业班组', status: '待派单' },
    { id: 'awo-24', code: 'AWO-20261025024', type: '环境告警派单', title: 'B2底板集水坑水位超限报警', reporter: '超声波液位计', reportTime: '2026-10-25 10:30', assignee: '地库排水应急组', status: '已完成' },
    { id: 'awo-25', code: 'AWO-20261024025', type: '设备告警派单', title: '锅炉蒸汽总管压力超标高压告警', reporter: '分汽缸压力传感器', reportTime: '2026-10-24 14:20', assignee: '热力锅炉组 (钱工)', status: '已完成' },
  ]);

  // Alarm Work Order Configs state for '告警工单配置' (25 items)
  const [alarmConfigs, setAlarmConfigs] = useState([
    { id: 'acfg-1', alarmType: '人员黑名单告警', dispatchType: '自动', assignee: '安防应急处置组 (张工)', timeLimit: '5min', transferTime: '1min', updateTime: '2026-11-06 16:00' },
    { id: 'acfg-2', alarmType: '车辆黑名单告警', dispatchType: '自动', assignee: '车辆道闸班组 (李民博)', timeLimit: '10min', transferTime: '2min', updateTime: '2026-11-06 14:00' },
    { id: 'acfg-3', alarmType: '入侵告警', dispatchType: '自动', assignee: '安防巡逻班组', timeLimit: '5min', transferTime: '1min', updateTime: '2026-11-05 11:20' },
    { id: 'acfg-4', alarmType: '温度异常告警', dispatchType: '自动', assignee: '暖通机电组 (张海波)', timeLimit: '15min', transferTime: '3min', updateTime: '2026-11-05 10:00' },
    { id: 'acfg-5', alarmType: '故障告警', dispatchType: '手动', assignee: '设备维修班组 (刘大牛)', timeLimit: '30min', transferTime: '--', updateTime: '2026-11-04 15:30' },
    { id: 'acfg-6', alarmType: '能耗超标告警', dispatchType: '手动', assignee: '能效管理专员 (陈工)', timeLimit: '60min', transferTime: '--', updateTime: '2026-11-04 09:10' },
    { id: 'acfg-7', alarmType: '周界告警', dispatchType: '自动', assignee: '周界巡逻特勤班', timeLimit: '5min', transferTime: '1min', updateTime: '2026-11-03 16:45' },
    { id: 'acfg-8', alarmType: '湿度异常告警', dispatchType: '自动', assignee: '机房运维环境组', timeLimit: '20min', transferTime: '5min', updateTime: '2026-11-03 11:15' },
    { id: 'acfg-9', alarmType: '空气异常告警', dispatchType: '自动', assignee: '新风环境保障组', timeLimit: '15min', transferTime: '3min', updateTime: '2026-11-02 14:20' },
    { id: 'acfg-10', alarmType: '液位告警', dispatchType: '自动', assignee: '给排水急修组 (王工)', timeLimit: '10min', transferTime: '2min', updateTime: '2026-11-01 09:30' },
    { id: 'acfg-11', alarmType: '压力告警', dispatchType: '自动', assignee: '管道消防班组', timeLimit: '8min', transferTime: '2min', updateTime: '2026-10-31 16:10' },
    { id: 'acfg-12', alarmType: '离线告警', dispatchType: '手动', assignee: '弱电网络与通信组', timeLimit: '45min', transferTime: '--', updateTime: '2026-10-31 10:45' },
    { id: 'acfg-13', alarmType: '异常告警', dispatchType: '手动', assignee: '预测性维护评估组', timeLimit: '60min', transferTime: '--', updateTime: '2026-10-30 17:50' },
    { id: 'acfg-14', alarmType: '火灾烟雾告警', dispatchType: '自动', assignee: '消控中心特勤队', timeLimit: '3min', transferTime: '0.5min', updateTime: '2026-10-30 08:30' },
    { id: 'acfg-15', alarmType: '电梯困人告警', dispatchType: '自动', assignee: '电梯应急救援组', timeLimit: '3min', transferTime: '0.5min', updateTime: '2026-10-29 18:20' },
    { id: 'acfg-16', alarmType: '高压配电跳闸告警', dispatchType: '自动', assignee: '变配电值班工程师', timeLimit: '5min', transferTime: '1min', updateTime: '2026-10-29 09:15' },
    { id: 'acfg-17', alarmType: '燃气泄漏告警', dispatchType: '自动', assignee: '燃气安全处置队', timeLimit: '3min', transferTime: '0.5min', updateTime: '2026-10-28 16:05' },
    { id: 'acfg-18', alarmType: '水浸溢水告警', dispatchType: '自动', assignee: '防汛排涝防汛组', timeLimit: '10min', transferTime: '2min', updateTime: '2026-10-28 11:40' },
    { id: 'acfg-19', alarmType: '视频遮挡/失信号告警', dispatchType: '手动', assignee: '监控运维组', timeLimit: '30min', transferTime: '--', updateTime: '2026-10-27 15:25' },
    { id: 'acfg-20', alarmType: '门禁强行闯入告警', dispatchType: '自动', assignee: '楼宇门禁巡查组', timeLimit: '5min', transferTime: '1min', updateTime: '2026-10-27 10:10' },
    { id: 'acfg-21', alarmType: '冷机断流保护告警', dispatchType: '自动', assignee: '冷站运行维保组', timeLimit: '10min', transferTime: '2min', updateTime: '2026-10-26 17:45' },
    { id: 'acfg-22', alarmType: 'UPS电池欠压告警', dispatchType: '自动', assignee: '数据中心电源组', timeLimit: '15min', transferTime: '3min', updateTime: '2026-10-26 12:00' },
    { id: 'acfg-23', alarmType: '锅炉超压保护告警', dispatchType: '自动', assignee: '热力锅炉维保组', timeLimit: '5min', transferTime: '1min', updateTime: '2026-10-25 16:30' },
    { id: 'acfg-24', alarmType: '发电机启动失败告警', dispatchType: '自动', assignee: '柴发备用电源组', timeLimit: '8min', transferTime: '2min', updateTime: '2026-10-25 09:15' },
    { id: 'acfg-25', alarmType: '照明回路故障告警', dispatchType: '手动', assignee: '公区照明电工组', timeLimit: '60min', transferTime: '--', updateTime: '2026-10-24 14:00' },
  ]);

  const [isAddAlarmCfgModal, setIsAddAlarmCfgModal] = useState(false);
  const [isEditAlarmCfgModal, setIsEditAlarmCfgModal] = useState(false);
  const [editingCfg, setEditingCfg] = useState<any>(null);

  const [isDeleteAlarmCfgModal, setIsDeleteAlarmCfgModal] = useState(false);
  const [deletingCfg, setDeletingCfg] = useState<any>(null);

  const [formAlarmType, setFormAlarmType] = useState('');
  const [formDispatchType, setFormDispatchType] = useState('自动');
  const [formAssignee, setFormAssignee] = useState('');
  const [formTimeLimit, setFormTimeLimit] = useState('15min');

  // Alarm Work Orders Modal States
  const [isWODetailModalOpen, setIsWODetailModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);

  const [isWOCloseModalOpen, setIsWOCloseModalOpen] = useState(false);
  const [closingWorkOrder, setClosingWorkOrder] = useState<any>(null);
  const [closeRemark, setCloseRemark] = useState('');
  const [closeRating, setCloseRating] = useState('5');

  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [subsystemFilter, setSubsystemFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const subsystems: SubsystemType[] = [
    '暖通空调',
    '给排水',
    '变配电',
    '智能照明',
    '安防监控',
    '消防安全',
    '电梯监控'
  ];

  const filteredAlarms = alarms.filter(a => {
    const matchLevel = levelFilter === 'all' || a.level === levelFilter;
    const matchSub = subsystemFilter === 'all' || a.subsystem === subsystemFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchSearch = !searchQuery ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.deviceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchSub && matchStatus && matchSearch;
  });

  const urgentCount = alarms.filter(a => a.level === '紧急' && (a.status === '未确认' || a.status === '处理中')).length;
  const majorCount = alarms.filter(a => a.level === '重要' && (a.status === '未确认' || a.status === '处理中')).length;
  const minorCount = alarms.filter(a => (a.level === '次要' || a.level === '提示') && (a.status === '未确认' || a.status === '处理中')).length;
  const resolvedCount = alarms.filter(a => a.status === '已恢复' || a.status === '已转工单').length;

  const handleExportCSV = (dataOrEvent?: any, filename?: string) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    const exportList = Array.isArray(dataOrEvent) ? dataOrEvent : filteredAlarms;
    const exportFileName = typeof filename === 'string' ? filename : `智慧园区IBMS_${activeTertiary}_${new Date().toISOString().split('T')[0]}.csv`;
    csvContent += "编号/ID,类型/级别,设备名称/标题,位置/来源,时间/值,状态\n";
    exportList.forEach((a: any) => {
      const col1 = a.code || a.id || '';
      const col2 = a.type || a.level || a.dispatchType || '';
      const col3 = a.deviceName || a.title || a.alarmType || '';
      const col4 = a.location || a.reporter || a.assignee || '';
      const col5 = a.triggerTime || a.reportTime || a.measuredValue || a.timeLimit || '';
      const col6 = a.status || a.transferTime || '';
      csvContent += `"${col1}","${col2}","${col3}","${col4}","${col5}","${col6}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menuCategories = [
    {
      title: '安防告警',
      icon: Shield,
      submenus: ['人员黑名单告警', '车辆黑名单告警', '入侵告警', '周界告警']
    },
    {
      title: '环境告警',
      icon: Thermometer,
      submenus: ['温度异常', '湿度异常', '空气异常', '液位告警', '压力告警']
    },
    {
      title: '设备告警',
      icon: Cpu,
      submenus: ['故障告警', '离线告警', '异常告警']
    },
    {
      title: '能耗告警',
      icon: Zap,
      submenus: ['能耗超标']
    },
    {
      title: '告警处理',
      icon: Sliders,
      submenus: ['告警工单', '告警工单配置']
    }
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#030a1c] text-slate-100 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl bg-cyan-900/90 border border-cyan-500 text-cyan-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR MENU (Unified with MaintenanceView) */}
      <aside className="w-64 bg-[#050e21] border-r border-[#133063] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#133063] flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xs font-bold tracking-wider text-cyan-300 uppercase">告警管理导航</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
          {menuCategories.map((cat) => {
            const isExpanded = expandedSections[cat.title];
            const IconComp = cat.icon;
            const isParentActive = activeSecondary === cat.title;

            return (
              <div key={cat.title} className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveSecondary(cat.title);
                    toggleSection(cat.title);
                    if (cat.submenus.length > 0 && !cat.submenus.includes(activeTertiary)) {
                      setActiveTertiary(cat.submenus[0]);
                    }
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between border cursor-pointer ${
                    isParentActive
                      ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                      : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComp className="w-4 h-4 text-cyan-300" />
                    <span>{cat.title}</span>
                  </div>
                  {cat.submenus.length > 0 && (
                    isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-cyan-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>

                {isExpanded && cat.submenus.length > 0 && (
                  <div className="pl-6 space-y-1 border-l-2 border-[#163a76] ml-4 my-1">
                    {cat.submenus.map((sub) => {
                      const isActive = activeSecondary === cat.title && activeTertiary === sub;
                      return (
                        <button
                          key={sub}
                          onClick={() => {
                            setActiveSecondary(cat.title);
                            setActiveTertiary(sub);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black shadow-[0_0_10px_rgba(6,182,212,0.6)] border-l-4 border-cyan-300'
                              : 'text-slate-400 hover:text-white hover:bg-[#0c285e]'
                          }`}
                        >
                          <span>{sub}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 p-6 space-y-5 overflow-y-auto bg-[#040b1a]">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#133063]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>告警管理</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-cyan-300">{activeSecondary}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white">{activeTertiary}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-600/40 text-cyan-300 text-xs font-mono">
              当前视图: {activeTertiary}
            </span>
          </div>
        </div>

        {/* CONDITIONAL RENDER FOR 人员黑名单告警 */}
        {activeTertiary === '人员黑名单告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月人员黑名单告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">24</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <BellRing className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">9</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">16</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">8</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">设备名称</th>
                      <th className="px-4 py-3.5 font-sans">设备位置</th>
                      <th className="px-4 py-3.5 font-sans">人脸抓拍</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {blacklistAlarms.slice((blacklistPage - 1) * 10, blacklistPage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/50 shadow">
                            <img src={item.snapshot} alt="snapshot" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setBlacklistAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={blacklistPage}
                totalItems={blacklistAlarms.length}
                onPageChange={setBlacklistPage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '车辆黑名单告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards matching screenshot image_d86b5617.png */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月车辆黑名单告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">38</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Truck className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">14</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">25</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">13</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot image_d86b5617.png */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="车牌号码" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置车辆黑名单查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area matching screenshot image_d86b5617.png (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">设备名称</th>
                      <th className="px-4 py-3.5 font-sans">设备位置</th>
                      <th className="px-4 py-3.5 font-sans">车牌抓拍</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {vehicleBlacklistAlarms.slice((vehicleBlacklistPage - 1) * 10, vehicleBlacklistPage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <div className="w-16 h-8 rounded-lg overflow-hidden border border-cyan-500/50 shadow flex items-center justify-center bg-black">
                            <img src={item.snapshot} alt="plate" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setVehicleBlacklistAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记车辆告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={vehicleBlacklistPage}
                totalItems={vehicleBlacklistAlarms.length}
                onPageChange={setVehicleBlacklistPage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '温度异常' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards matching screenshot image_f3b50379.png */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月温度异常告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">27</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">9</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">18</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">9</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot image_f3b50379.png */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="设备名称" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置温度异常告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area matching screenshot image_f3b50379.png (10 items per page, including 监测值, 阈值, 异常项 columns) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">设备名称</th>
                      <th className="px-4 py-3.5 font-sans">设备位置</th>
                      <th className="px-4 py-3.5 font-sans">监测值</th>
                      <th className="px-4 py-3.5 font-sans">阈值</th>
                      <th className="px-4 py-3.5 font-sans">异常项</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {temperatureAlarms.slice((tempPage - 1) * 10, tempPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-400 font-bold">{item.measuredValue}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-400">{item.threshold}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.anomalyItem === '高温' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-300'}`}>
                            {item.anomalyItem}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setTemperatureAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记温度异常告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={tempPage}
                totalItems={temperatureAlarms.length}
                onPageChange={setTempPage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '湿度异常' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月湿度异常告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">18</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Droplets className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">6</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">12</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">6</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="设备名称/编号" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置湿度异常告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">监测设备名称</th>
                      <th className="px-4 py-3.5 font-sans">具体安装位置</th>
                      <th className="px-4 py-3.5 font-sans">实时相对湿度</th>
                      <th className="px-4 py-3.5 font-sans">环境安全阈值</th>
                      <th className="px-4 py-3.5 font-sans">湿度偏离状态</th>
                      <th className="px-4 py-3.5 font-sans">告警产生时间</th>
                      <th className="px-4 py-3.5 font-sans">处理状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {humidityAlarms.slice((humidityPage - 1) * 10, humidityPage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-300 font-bold">{item.measuredValue}</span>
                            <div className="w-14 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full" style={{ width: `${Math.min(100, item.percentage)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-sans text-slate-400">{item.threshold}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.anomalyItem.includes('高湿') ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                            {item.anomalyItem}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setHumidityAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记湿度异常告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={humidityPage}
                totalItems={humidityAlarms.length}
                onPageChange={setHumidityPage}
                onExport={() => handleExportCSV(humidityAlarms, '湿度异常告警_数据导出.csv')}
              />
            </div>
          </div>
        ) : activeTertiary === '空气异常' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月空气异常告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">22</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Wind className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">8</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">15</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">7</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="检测指标/设备" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置空气异常告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">监测设备</th>
                      <th className="px-4 py-3.5 font-sans">具体位置</th>
                      <th className="px-4 py-3.5 font-sans">检测指标</th>
                      <th className="px-4 py-3.5 font-sans">当前实测值</th>
                      <th className="px-4 py-3.5 font-sans">国标/安全阈值</th>
                      <th className="px-4 py-3.5 font-sans">污染等级评估</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {airQualityAlarms.slice((airPage - 1) * 10, airPage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0c2e5c] text-amber-300 border border-amber-500/30">
                            {item.indicator}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-sans text-red-400 font-bold">{item.measuredValue}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-400">{item.threshold} ({item.standard})</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {item.anomalyItem}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setAirQualityAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记空气异常告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={airPage}
                totalItems={airQualityAlarms.length}
                onPageChange={setAirPage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '液位告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月液位告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">15</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Gauge className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">5</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">11</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">4</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="水池/水箱/设备" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置液位告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">水池/水箱名称</th>
                      <th className="px-4 py-3.5 font-sans">具体安装位置</th>
                      <th className="px-4 py-3.5 font-sans">实时监测水位</th>
                      <th className="px-4 py-3.5 font-sans">安全水位区间</th>
                      <th className="px-4 py-3.5 font-sans">水深填充比例</th>
                      <th className="px-4 py-3.5 font-sans">异常状态</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {liquidLevelAlarms.slice((liquidPage - 1) * 10, liquidPage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-400 font-bold">{item.measuredValue}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-400">{item.safeThreshold}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-full rounded-full ${item.fillPercent > 80 ? 'bg-red-500' : item.fillPercent < 20 ? 'bg-amber-400' : 'bg-cyan-400'}`} style={{ width: `${item.fillPercent}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-300 font-bold">{item.fillPercent}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.anomalyState.includes('高位') || item.anomalyState.includes('满') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                            {item.anomalyState}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setLiquidLevelAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记液位告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={liquidPage}
                totalItems={liquidLevelAlarms.length}
                onPageChange={setLiquidPage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '压力告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月压力告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">13</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">4</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">10</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">3</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="管网/阀门名称" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置压力告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">管网/阀门名称</th>
                      <th className="px-4 py-3.5 font-sans">具体位置</th>
                      <th className="px-4 py-3.5 font-sans">所属管线系统</th>
                      <th className="px-4 py-3.5 font-sans">实时管道压力</th>
                      <th className="px-4 py-3.5 font-sans">额定工作范围</th>
                      <th className="px-4 py-3.5 font-sans">压差风险说明</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {pressureAlarms.slice((pressurePage - 1) * 10, pressurePage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] text-cyan-300 bg-cyan-950 border border-cyan-800">
                            {item.systemTag}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-sans text-red-400 font-bold">{item.pipePressure}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-400">{item.safeRange}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.anomalyDetail.includes('超压') || item.anomalyDetail.includes('爆管') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                            {item.anomalyDetail}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setPressureAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记压力告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={pressurePage}
                totalItems={pressureAlarms.length}
                onPageChange={setPressurePage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '周界告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards matching screenshot image_7f268bc9.png */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月周界告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">19</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">7</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">12</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">7</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot image_7f268bc9.png */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="周界设备/编号" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置周界告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area matching screenshot image_7f268bc9.png (10 items per page, including 入侵区域 column) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">设备名称</th>
                      <th className="px-4 py-3.5 font-sans">设备位置</th>
                      <th className="px-4 py-3.5 font-sans">入侵区域</th>
                      <th className="px-4 py-3.5 font-sans">人员抓拍</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {perimeterAlarms.slice((perimeterPage - 1) * 10, perimeterPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans text-amber-300 font-bold">{item.zone}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <div className="w-16 h-8 rounded-lg overflow-hidden border border-cyan-500/50 shadow flex items-center justify-center bg-black">
                            <img src={item.snapshot} alt="snapshot" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setPerimeterAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记周界告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={perimeterPage}
                totalItems={perimeterAlarms.length}
                onPageChange={setPerimeterPage}
                onExport={() => handleExportCSV(perimeterAlarms, '周界告警_数据导出.csv')}
              />
            </div>
          </div>
        ) : activeTertiary === '入侵告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards matching screenshot image_73810b69.png */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月入侵告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">31</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">11</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">20</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">11</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot image_73810b69.png */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="入侵设备/编号" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置入侵告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area matching screenshot image_73810b69.png (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">设备名称</th>
                      <th className="px-4 py-3.5 font-sans">设备位置</th>
                      <th className="px-4 py-3.5 font-sans">人员抓拍</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {intrusionAlarms.slice((intrusionPage - 1) * 10, intrusionPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <div className="w-16 h-8 rounded-lg overflow-hidden border border-cyan-500/50 shadow flex items-center justify-center bg-black">
                            <img src={item.snapshot} alt="snapshot" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setIntrusionAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记入侵告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={intrusionPage}
                totalItems={intrusionAlarms.length}
                onPageChange={setIntrusionPage}
                onExport={() => handleExportCSV(intrusionAlarms, '入侵告警_数据导出.csv')}
              />
            </div>
          </div>
        ) : activeTertiary === '故障告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月设备故障告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">35</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">12</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">23</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">12</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="故障设备/故障代码" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置设备故障告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">故障设备</th>
                      <th className="px-4 py-3.5 font-sans">具体安装位置</th>
                      <th className="px-4 py-3.5 font-sans">故障代码</th>
                      <th className="px-4 py-3.5 font-sans">故障描述说明</th>
                      <th className="px-4 py-3.5 font-sans">影响严重级别</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {faultAlarms.slice((faultPage - 1) * 10, faultPage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans text-amber-300 font-bold">{item.faultCode}</td>
                        <td className="px-4 py-3.5 font-sans text-red-400 font-semibold">{item.faultDesc}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.impactLevel.includes('一级') || item.impactLevel.includes('特级') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                            {item.impactLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setFaultAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记故障告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={faultPage}
                totalItems={faultAlarms.length}
                onPageChange={setFaultPage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '离线告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月设备离线告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">16</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">5</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">11</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">5</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="离线设备/IP地址" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置设备离线告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">离线设备</th>
                      <th className="px-4 py-3.5 font-sans">具体位置</th>
                      <th className="px-4 py-3.5 font-sans">通讯协议/IP</th>
                      <th className="px-4 py-3.5 font-sans">离线时长</th>
                      <th className="px-4 py-3.5 font-sans">失联原因初判</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {offlineAlarms.slice((offlinePage - 1) * 10, offlinePage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] text-cyan-300 bg-cyan-950 border border-cyan-800">
                            {item.ipAddress}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-sans text-amber-400 font-bold">{item.duration}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.cause}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setOfflineAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记离线告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={offlinePage}
                totalItems={offlineAlarms.length}
                onPageChange={setOfflinePage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '异常告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月运行异常预警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">28</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">10</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">18</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">10</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="异常设备/监测参数" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置设备异常告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">预警设备</th>
                      <th className="px-4 py-3.5 font-sans">具体位置</th>
                      <th className="px-4 py-3.5 font-sans">异常监测参数</th>
                      <th className="px-4 py-3.5 font-sans">当前偏离度/实测</th>
                      <th className="px-4 py-3.5 font-sans">设备健康度评估</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {abnormalAlarms.slice((abnormalPage - 1) * 10, abnormalPage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.location}</td>
                        <td className="px-4 py-3.5 font-sans text-amber-300 font-bold">{item.paramItem}</td>
                        <td className="px-4 py-3.5 font-sans text-red-400 font-bold">{item.measuredDeviation}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.healthScore}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setAbnormalAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记异常告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={abnormalPage}
                totalItems={abnormalAlarms.length}
                onPageChange={setAbnormalPage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '能耗超标' || activeTertiary === '能耗超标告警' ? (
          <div className="space-y-5">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">本月能耗超标告警</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 mt-1">24</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">告警转工单</div>
                  <div className="text-3xl font-bold font-mono text-blue-300 mt-1">8</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">已处理</div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">16</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 relative overflow-hidden shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">未处理</div>
                  <div className="text-3xl font-bold font-mono text-red-400 mt-1">8</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-01" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="date" 
                  defaultValue="2026-11-06" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="监测区域/电表名称" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs w-36" 
                />
                <button 
                  onClick={() => triggerToast('已重置能耗超标告警查询条件')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  导出数据
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5 font-sans">告警编号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型</th>
                      <th className="px-4 py-3.5 font-sans">监测区域/回路</th>
                      <th className="px-4 py-3.5 font-sans">计量设备</th>
                      <th className="px-4 py-3.5 font-sans">监测指标</th>
                      <th className="px-4 py-3.5 font-sans">实时能耗 / 额定限额</th>
                      <th className="px-4 py-3.5 font-sans">超标偏离率</th>
                      <th className="px-4 py-3.5 font-sans">告警时间</th>
                      <th className="px-4 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {energyAlarms.slice((energyPage - 1) * 10, energyPage * 10).map((item) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans text-cyan-300 font-semibold">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.area}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-amber-300 font-bold">{item.indicator}</td>
                        <td className="px-4 py-3.5 font-sans text-red-400 font-bold">{item.realTimeEnergy} / {item.threshold}</td>
                        <td className="px-4 py-3.5 font-sans text-amber-400 font-bold">{item.deviationPercent}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.triggerTime}</td>
                        <td className="px-4 py-3.5 font-sans">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '未处理' ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setEnergyAlarms(prev => prev.map(a => a.id === item.id ? { ...a, status: '已处理' } : a));
                              triggerToast(`已标记能耗超标告警 ${item.code} 为已处理`);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            标记处理
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsManualDispatchOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            人工派单
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedBlacklistItem(item);
                              setIsViewWorkOrderOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                currentPage={energyPage}
                totalItems={energyAlarms.length}
                onPageChange={setEnergyPage}
                onExport={handleExportCSV}
              />
            </div>
          </div>
        ) : activeTertiary === '告警工单' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 shadow-xl">
              <div className="text-sm font-bold text-cyan-300">告警工单流转与处置管理</div>
              <button 
                onClick={() => triggerToast('已成功触发告警工单智能派发')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>生成告警工单</span>
              </button>
            </div>

            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">工单编号</th>
                      <th className="px-4 py-3.5 font-sans">工单类型</th>
                      <th className="px-4 py-3.5 font-sans">告警工单标题</th>
                      <th className="px-4 py-3.5 font-sans">触发来源</th>
                      <th className="px-4 py-3.5 font-sans">生成时间</th>
                      <th className="px-4 py-3.5 font-sans">责任人</th>
                      <th className="px-3 py-3.5 font-sans">状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {alarmWorkOrders.slice((alarmOrderPage - 1) * 10, alarmOrderPage * 10).map((wo, idx) => (
                      <tr key={wo.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(alarmOrderPage - 1) * 10 + idx + 1}</td>
                        <td className="px-4 py-3.5 font-bold text-cyan-300">{wo.code}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{wo.type}</td>
                        <td className="px-4 py-3.5 font-sans text-white font-semibold">{wo.title}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-400">{wo.reporter}</td>
                        <td className="px-4 py-3.5 text-slate-300">{wo.reportTime}</td>
                        <td className="px-4 py-3.5 font-sans text-white">{wo.assignee}</td>
                        <td className="px-3 py-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            wo.status === '已完成' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                            wo.status === '处理中' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                            'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {wo.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedWorkOrder(wo);
                              setIsWODetailModalOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            详情
                          </button>
                          <button 
                            onClick={() => {
                              setClosingWorkOrder(wo);
                              setCloseRemark('现场故障与预警排查完毕，复测参数指标恢复正常，确认完结归档。');
                              setCloseRating('5');
                              setIsWOCloseModalOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition-all cursor-pointer"
                          >
                            结单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={alarmOrderPage}
                totalItems={alarmWorkOrders.length}
                onPageChange={setAlarmOrderPage}
                onExport={() => handleExportCSV(alarmWorkOrders, '告警工单_数据导出.csv')}
              />
            </div>
          </div>
        ) : activeTertiary === '告警工单配置' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 shadow-xl">
              <div className="text-sm font-bold text-cyan-300">告警自动转工单派发规则配置</div>
              <button 
                onClick={() => {
                  setFormAlarmType('');
                  setFormDispatchType('自动');
                  setFormAssignee('');
                  setFormTimeLimit('15min');
                  setIsAddAlarmCfgModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>新增规则配置</span>
              </button>
            </div>

            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">告警类型/触发项</th>
                      <th className="px-4 py-3.5 font-sans">派单模式</th>
                      <th className="px-4 py-3.5 font-sans">默认接单班组/人员</th>
                      <th className="px-4 py-3.5 font-sans">处理时限</th>
                      <th className="px-4 py-3.5 font-sans">转单阈值</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {alarmConfigs.slice((alarmConfigPage - 1) * 10, alarmConfigPage * 10).map((cfg, index) => (
                      <tr key={cfg.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(alarmConfigPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-cyan-300">{cfg.alarmType}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            {cfg.dispatchType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-sans text-white">{cfg.assignee}</td>
                        <td className="px-4 py-3.5 text-slate-300">{cfg.timeLimit}</td>
                        <td className="px-4 py-3.5 text-slate-300">{cfg.transferTime}</td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setEditingCfg(cfg);
                              setFormAlarmType(cfg.alarmType);
                              setFormDispatchType(cfg.dispatchType);
                              setFormAssignee(cfg.assignee);
                              setFormTimeLimit(cfg.timeLimit);
                              setIsEditAlarmCfgModal(true);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => {
                              setDeletingCfg(cfg);
                              setIsDeleteAlarmCfgModal(true);
                            }}
                            className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold transition-all cursor-pointer"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={alarmConfigPage}
                totalItems={alarmConfigs.length}
                onPageChange={setAlarmConfigPage}
                onExport={() => handleExportCSV(alarmConfigs, '告警工单配置_数据导出.csv')}
              />
            </div>

            {/* Add Alarm Config Modal */}
            {isAddAlarmCfgModal && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">新增告警派发规则配置</h3>
                    <button onClick={() => setIsAddAlarmCfgModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 告警类型名称</label>
                      <input 
                        type="text" 
                        value={formAlarmType}
                        onChange={(e) => setFormAlarmType(e.target.value)}
                        placeholder="例如：视频通道遮挡告警"
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 派单模式</label>
                      <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input type="radio" name="addCfgDisp" checked={formDispatchType === '自动'} onChange={() => setFormDispatchType('自动')} className="text-cyan-500" />
                          <span>自动派单</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input type="radio" name="addCfgDisp" checked={formDispatchType === '手动'} onChange={() => setFormDispatchType('手动')} className="text-cyan-500" />
                          <span>手动分派</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 默认接单人 / 班组</label>
                      <input 
                        type="text" 
                        value={formAssignee}
                        onChange={(e) => setFormAssignee(e.target.value)}
                        placeholder="例如：安防监控组 (张工)"
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 处理时限</label>
                      <select 
                        value={formTimeLimit}
                        onChange={(e) => setFormTimeLimit(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option>5min</option>
                        <option>10min</option>
                        <option>15min</option>
                        <option>30min</option>
                        <option>60min</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                    <button onClick={() => setIsAddAlarmCfgModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        const newCfg = {
                          id: `acfg-${Date.now()}`,
                          alarmType: formAlarmType || '自定义告警规则',
                          dispatchType: formDispatchType,
                          assignee: formAssignee || '园区值班班组',
                          timeLimit: formTimeLimit,
                          transferTime: '1min',
                          updateTime: '2026-11-06 18:00'
                        };
                        setAlarmConfigs([newCfg, ...alarmConfigs]);
                        setIsAddAlarmCfgModal(false);
                        triggerToast('成功新增告警派发规则配置');
                      }}
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
                    >
                      确认新增
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD ALARM LIST VIEW FOR OTHER SUBMENUS */
          <div className="space-y-5">
            {/* Top 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06122d] border border-red-500/30 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs text-red-400 font-bold">
                  <span>{activeTertiary} - 紧急告警</span>
                  <Flame className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono text-red-400">{Math.max(1, urgentCount)}</span>
                  <span className="text-xs text-slate-400">起 (需立即响应)</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-[#133063]">
                  当前分类实时监测中
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-amber-500/30 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span>重要级别预警</span>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono text-amber-300">{majorCount}</span>
                  <span className="text-xs text-slate-400">起</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-[#133063]">
                  设备阈值越限告警
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/30 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
                  <span>次要与提示</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono text-cyan-300">{minorCount}</span>
                  <span className="text-xs text-slate-400">起</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-[#133063]">
                  常规巡检与状态提示
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06122d] border border-emerald-500/30 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>闭环恢复率</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono text-emerald-400">95.2%</span>
                  <span className="text-xs text-slate-400">({resolvedCount} 起已恢复)</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-[#133063]">
                  平均处置耗时: 3.2分钟
                </div>
              </div>
            </div>

            {/* Filter and Operations Toolbar */}
            <div className="p-4 rounded-2xl bg-[#06122d] border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder={`搜索 ${activeTertiary} 关键字...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#030a1c] border border-[#1b448a] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">所有告警级别</option>
                  <option value="紧急">紧急</option>
                  <option value="重要">重要</option>
                  <option value="次要">次要</option>
                  <option value="提示">提示</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">所有处置状态</option>
                  <option value="未确认">未确认</option>
                  <option value="处理中">处理中</option>
                  <option value="已恢复">已恢复</option>
                  <option value="已转工单">已转工单</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isMuted ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-red-500/20 border-red-500/40 text-red-300'
                  }`}
                  title={isMuted ? "已静音" : "警报声已开启"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isMuted ? '蜂鸣静音' : '声光提示中'}</span>
                </button>

                <button
                  onClick={onBatchConfirm}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>一键批量确认</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出记录 (CSV)</span>
                </button>
              </div>
            </div>

            {/* Alarm Table */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">告警编号</th>
                      <th className="px-3 py-3.5">告警级别</th>
                      <th className="px-3 py-3.5">所属系统</th>
                      <th className="px-4 py-3.5">告警对象与设备</th>
                      <th className="px-4 py-3.5">安装具体位置</th>
                      <th className="px-6 py-3.5">[{activeTertiary}] 事件具体内容</th>
                      <th className="px-4 py-3.5">产生时间</th>
                      <th className="px-3 py-3.5">状态</th>
                      <th className="px-3 py-3.5">责任人</th>
                      <th className="px-5 py-3.5 text-right">处置联动</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063] font-mono">
                    {filteredAlarms.map(alarm => (
                      <tr 
                        key={alarm.id}
                        onClick={() => onOpenAlarm(alarm)}
                        className="hover:bg-[#081b42]/85 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-3.5 font-bold text-white">{alarm.code}</td>
                        <td className="px-3 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            alarm.level === '紧急' ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' :
                            alarm.level === '重要' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}>
                            {alarm.level}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 font-sans text-slate-300">{alarm.subsystem}</td>
                        <td className="px-4 py-3.5 font-sans font-semibold text-cyan-300">{alarm.deviceName}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{alarm.location}</td>
                        <td className="px-6 py-3.5 font-sans text-white">{alarm.content}</td>
                        <td className="px-4 py-3.5 text-slate-300">{alarm.triggerTime}</td>
                        <td className="px-3 py-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            alarm.status === '未确认' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                            alarm.status === '处理中' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {alarm.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 font-sans text-slate-200">{alarm.assignee || '未指派'}</td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onConvertToWorkOrder(alarm)}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            转工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MANUAL DISPATCH MODAL (人工派单页面) */}
        {isManualDispatchOpen && selectedBlacklistItem && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-cyan-300">
                    {selectedBlacklistItem.type.includes('温度') ? '人工温度异常派单' :
                     selectedBlacklistItem.type.includes('湿度') ? '人工湿度异常派单' :
                     selectedBlacklistItem.type.includes('空气') ? '人工空气异常派单' :
                     selectedBlacklistItem.type.includes('液位') ? '人工液位告警派单' :
                     selectedBlacklistItem.type.includes('压力') ? '人工压力告警派单' :
                     selectedBlacklistItem.type.includes('故障') ? '人工设备故障派单' :
                     selectedBlacklistItem.type.includes('离线') ? '人工通讯离线派单' :
                     selectedBlacklistItem.type.includes('异常') ? '人工设备预警派单' :
                     selectedBlacklistItem.type.includes('能耗') ? '人工能耗超标派单' :
                     '人工安全派单'} - 告警编号: {selectedBlacklistItem.code}
                  </h3>
                </div>
                <button onClick={() => setIsManualDispatchOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                {selectedBlacklistItem.type.includes('温度') || selectedBlacklistItem.type.includes('湿度') ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>设备名称: <span className="text-white">{selectedBlacklistItem.deviceName}</span></div>
                    <div>监测位置: <span className="text-amber-300">{selectedBlacklistItem.location}</span></div>
                    <div>监测数值: <span className="text-red-400 font-bold">{selectedBlacklistItem.measuredValue}</span></div>
                    <div>告警阈值: <span className="text-slate-300">{selectedBlacklistItem.threshold}</span></div>
                    <div>异常项目: <span className="text-amber-400">{selectedBlacklistItem.anomalyItem}</span></div>
                  </div>
                ) : selectedBlacklistItem.type.includes('空气') ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>设备名称: <span className="text-white">{selectedBlacklistItem.deviceName}</span></div>
                    <div>监测位置: <span className="text-amber-300">{selectedBlacklistItem.location}</span></div>
                    <div>监测指标: <span className="text-amber-400 font-bold">{selectedBlacklistItem.indicator}</span></div>
                    <div>监测数值: <span className="text-red-400 font-bold">{selectedBlacklistItem.measuredValue}</span></div>
                    <div>告警阈值: <span className="text-slate-300">{selectedBlacklistItem.threshold}</span></div>
                  </div>
                ) : selectedBlacklistItem.type.includes('液位') ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>设备名称: <span className="text-white">{selectedBlacklistItem.deviceName}</span></div>
                    <div>监测位置: <span className="text-amber-300">{selectedBlacklistItem.location}</span></div>
                    <div>监测水位: <span className="text-red-400 font-bold">{selectedBlacklistItem.measuredValue}</span></div>
                    <div>安全阈值: <span className="text-[#94a3b8]">{selectedBlacklistItem.safeThreshold}</span></div>
                    <div>异常状态: <span className="text-amber-400">{selectedBlacklistItem.anomalyState}</span></div>
                  </div>
                ) : selectedBlacklistItem.type.includes('压力') ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>设备名称: <span className="text-white">{selectedBlacklistItem.deviceName}</span></div>
                    <div>监测位置: <span className="text-amber-300">{selectedBlacklistItem.location}</span></div>
                    <div>管道压力: <span className="text-red-400 font-bold">{selectedBlacklistItem.pipePressure}</span></div>
                    <div>安全范围: <span className="text-[#94a3b8]">{selectedBlacklistItem.safeRange}</span></div>
                    <div>异常说明: <span className="text-amber-400">{selectedBlacklistItem.anomalyDetail}</span></div>
                  </div>
                ) : selectedBlacklistItem.type.includes('故障') ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>设备名称: <span className="text-white">{selectedBlacklistItem.deviceName}</span></div>
                    <div>故障位置: <span className="text-amber-300">{selectedBlacklistItem.location}</span></div>
                    <div>故障代码: <span className="text-amber-400 font-bold">{selectedBlacklistItem.faultCode}</span></div>
                    <div>故障描述: <span className="text-red-400 font-bold">{selectedBlacklistItem.faultDesc}</span></div>
                    <div>影响级别: <span className="text-red-300 font-semibold">{selectedBlacklistItem.impactLevel}</span></div>
                  </div>
                ) : selectedBlacklistItem.type.includes('离线') ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>设备名称: <span className="text-white">{selectedBlacklistItem.deviceName}</span></div>
                    <div>安装位置: <span className="text-amber-300">{selectedBlacklistItem.location}</span></div>
                    <div>通讯协议/IP: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.ipAddress}</span></div>
                    <div>离线时长: <span className="text-red-400 font-bold">{selectedBlacklistItem.duration}</span></div>
                    <div>失联原因: <span className="text-amber-400">{selectedBlacklistItem.cause}</span></div>
                  </div>
                ) : selectedBlacklistItem.type.includes('异常') ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>预警设备: <span className="text-white">{selectedBlacklistItem.deviceName}</span></div>
                    <div>安装位置: <span className="text-amber-300">{selectedBlacklistItem.location}</span></div>
                    <div>异常参数: <span className="text-amber-400 font-bold">{selectedBlacklistItem.paramItem}</span></div>
                    <div>偏离度/实测: <span className="text-red-400 font-bold">{selectedBlacklistItem.measuredDeviation}</span></div>
                    <div>健康度诊断: <span className="text-amber-300">{selectedBlacklistItem.healthScore}</span></div>
                  </div>
                ) : selectedBlacklistItem.type.includes('能耗') ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>监测区域: <span className="text-white">{selectedBlacklistItem.area}</span></div>
                    <div>计量设备: <span className="text-amber-300">{selectedBlacklistItem.deviceName}</span></div>
                    <div>实时/限额: <span className="text-red-400 font-bold">{selectedBlacklistItem.realTimeEnergy} / {selectedBlacklistItem.threshold}</span></div>
                    <div>超标偏离: <span className="text-amber-400 font-bold">{selectedBlacklistItem.deviationPercent}</span></div>
                    <div>告警时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div>告警类型: <span className="text-cyan-300 font-bold">{selectedBlacklistItem.type}</span></div>
                    <div>设备名称: <span className="text-white">{selectedBlacklistItem.deviceName}</span></div>
                    <div>抓拍位置: <span className="text-amber-300">{selectedBlacklistItem.location}</span></div>
                    <div>抓拍时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                  </div>
                )}

                {selectedBlacklistItem.snapshot && 
                 !selectedBlacklistItem.type.includes('温度') && 
                 !selectedBlacklistItem.type.includes('湿度') && 
                 !selectedBlacklistItem.type.includes('空气') && 
                 !selectedBlacklistItem.type.includes('液位') && 
                 !selectedBlacklistItem.type.includes('压力') && 
                 !selectedBlacklistItem.type.includes('故障') && 
                 !selectedBlacklistItem.type.includes('离线') && 
                 !selectedBlacklistItem.type.includes('异常') && 
                 !selectedBlacklistItem.type.includes('能耗') && (
                  <div className="flex items-center gap-4 py-1">
                    <div className="w-20 h-12 rounded-xl overflow-hidden border border-cyan-400/60 shadow bg-black flex items-center justify-center">
                      <img src={selectedBlacklistItem.snapshot} alt="snapshot" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 text-slate-300 text-xs font-sans">
                      <div className="text-white font-bold">目标抓拍特征比对:</div>
                      <div className="text-red-400 font-mono">黑名单匹配度: 99.1%</div>
                      <div className="text-slate-400">建议立即联动现场安保前往核查。</div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 font-sans">
                  <label className="text-slate-300 font-semibold">
                    {selectedBlacklistItem.type.includes('温度') ? '指派暖通机电班组 / 责任人' :
                     selectedBlacklistItem.type.includes('湿度') ? '指派除湿通风班组 / 责任人' :
                     selectedBlacklistItem.type.includes('空气') ? '指派新风环保班组 / 责任人' :
                     selectedBlacklistItem.type.includes('液位') ? '指派给排水抢修班组 / 责任人' :
                     selectedBlacklistItem.type.includes('压力') ? '指派管道与压力容器班组 / 责任人' :
                     selectedBlacklistItem.type.includes('故障') ? '指派设备抢修与维保班组 / 责任人' :
                     selectedBlacklistItem.type.includes('离线') ? '指派网络与智能化运维组 / 责任人' :
                     selectedBlacklistItem.type.includes('异常') ? '指派预测性维护与诊断组 / 责任人' :
                     selectedBlacklistItem.type.includes('能耗') ? '指派综合能效与节能班组 / 责任人' :
                     '指派安防班组 / 责任人'}
                  </label>
                  <select 
                    value={dispatchAssignee}
                    onChange={(e) => setDispatchAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    {selectedBlacklistItem.type.includes('温度') ? (
                      <>
                        <option>暖通空调班组 (张工)</option>
                        <option>机电运维一组 (李经理)</option>
                        <option>核心机房保障组 (王工)</option>
                        <option>综合设施维修班组</option>
                      </>
                    ) : selectedBlacklistItem.type.includes('湿度') ? (
                      <>
                        <option>除湿通风班组 (张工)</option>
                        <option>机电运维二组 (陈经理)</option>
                        <option>智能环境保障组 (刘工)</option>
                        <option>综合设施维修班组</option>
                      </>
                    ) : selectedBlacklistItem.type.includes('空气') ? (
                      <>
                        <option>新风环保班组 (李工)</option>
                        <option>设施与环境卫生组 (张主管)</option>
                        <option>实验室安全管理组 (赵工)</option>
                        <option>综合设施维修班组</option>
                      </>
                    ) : selectedBlacklistItem.type.includes('液位') ? (
                      <>
                        <option>给排水抢修班组 (王工)</option>
                        <option>消防水泵房值班组 (刘工)</option>
                        <option>污水处理运维组 (陈工)</option>
                        <option>综合设施维修班组</option>
                      </>
                    ) : selectedBlacklistItem.type.includes('压力') ? (
                      <>
                        <option>管道与压力容器维保组 (赵工)</option>
                        <option>消防管网抢修组 (孙工)</option>
                        <option>锅炉与蒸汽机电组 (周经理)</option>
                        <option>综合设施维修班组</option>
                      </>
                    ) : selectedBlacklistItem.type.includes('故障') ? (
                      <>
                        <option>设备抢修班组 (刘大牛)</option>
                        <option>高压变配电维保组 (赵工)</option>
                        <option>暖通机电维修组 (王经理)</option>
                        <option>特种设备(电梯)维保团队</option>
                      </>
                    ) : selectedBlacklistItem.type.includes('离线') ? (
                      <>
                        <option>物联网网络运维组 (周工)</option>
                        <option>智能化弱电运维班组 (陈工程师)</option>
                        <option>现场总线通信维保组 (李工)</option>
                        <option>园区网络与基础设施组</option>
                      </>
                    ) : selectedBlacklistItem.type.includes('异常') ? (
                      <>
                        <option>预测性维护诊断组 (孙工)</option>
                        <option>设备健康诊断团队 (钱经理)</option>
                        <option>旋转机械动平衡分析组 (郑工)</option>
                        <option>综合机电保养班组</option>
                      </>
                    ) : selectedBlacklistItem.type.includes('能耗') ? (
                      <>
                        <option>综合能效管理组 (陈工)</option>
                        <option>园区节能与电力运维组 (周经理)</option>
                        <option>照明与公区节能专班 (李工)</option>
                        <option>暖通能效优化团队</option>
                      </>
                    ) : (
                      <>
                        <option>安防应急班组 (张工)</option>
                        <option>车辆道闸班组 (李民博)</option>
                        <option>园区警务室联动组 (李警官)</option>
                        <option>夜间安保机动巡逻组</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-slate-300 font-semibold">应急响应优先级</label>
                  <div className="flex items-center gap-4 pt-1">
                    {['特急', '紧急', '普通'].map(p => (
                      <label key={p} className="flex items-center gap-2 cursor-pointer text-slate-200">
                        <input 
                          type="radio" 
                          name="dispatchPri" 
                          checked={dispatchPriority === p} 
                          onChange={() => setDispatchPriority(p)} 
                          className="text-cyan-500" 
                        />
                        <span className={p === '特急' ? 'text-red-400 font-bold' : p === '紧急' ? 'text-amber-400 font-bold' : ''}>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-slate-300 font-semibold">派单指令与处置要求</label>
                  <textarea 
                    rows={3}
                    value={dispatchRemark}
                    onChange={(e) => setDispatchRemark(e.target.value)}
                    placeholder={
                      selectedBlacklistItem.type.includes('温度') ? "请输入现场温度调节与设备排查要求..." :
                      selectedBlacklistItem.type.includes('湿度') ? "请输入现场除湿加湿调节要求（例如：检查除湿一体机排水管道，开启强力抽湿）..." :
                      selectedBlacklistItem.type.includes('空气') ? "请输入新风换气与有害气体排查指令（例如：加大新风阀门开度，开启排风风机）..." :
                      selectedBlacklistItem.type.includes('液位') ? "请输入水泵与排污设施联动指令（例如：启动2#排水泵，核查浮球阀状态）..." :
                      selectedBlacklistItem.type.includes('压力') ? "请输入管网泄压或补压处置要求（例如：关闭前端减压阀，检查报警阀组）..." :
                      selectedBlacklistItem.type.includes('故障') ? "请输入故障现场抢修与故障复位指令（例如：携带绝缘工具前往B1冷冻站，切断故障回路并排查变频器短路原因）..." :
                      selectedBlacklistItem.type.includes('离线') ? "请输入网络与终端排查指令（例如：前往3F弱电井检查交换机电源与光纤收发器网线连接）..." :
                      selectedBlacklistItem.type.includes('异常') ? "请输入异常诊断与预防性保养指令（例如：对送风机皮带张力进行紧固，复测电机轴承振动度）..." :
                      selectedBlacklistItem.type.includes('能耗') ? "请输入能效优化与排查指令（例如：下发地下车库照明回路定时关断指令，检查冷水机组运行能效比COP）..." :
                      "请输入现场处置要求..."
                    }
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#133063] font-sans">
                <button onClick={() => setIsManualDispatchOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                <button 
                  onClick={() => {
                    if (selectedBlacklistItem.type.includes('人员')) {
                      setBlacklistAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('车辆')) {
                      setVehicleBlacklistAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('入侵')) {
                      setIntrusionAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('周界')) {
                      setPerimeterAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('温度')) {
                      setTemperatureAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('湿度')) {
                      setHumidityAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('空气')) {
                      setAirQualityAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('液位')) {
                      setLiquidLevelAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('压力')) {
                      setPressureAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('故障')) {
                      setFaultAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('离线')) {
                      setOfflineAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('异常')) {
                      setAbnormalAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else if (selectedBlacklistItem.type.includes('能耗')) {
                      setEnergyAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    } else {
                      setPerimeterAlarms(prev => prev.map(a => a.id === selectedBlacklistItem.id ? { ...a, status: '已处理' } : a));
                    }
                    setIsManualDispatchOpen(false);
                    triggerToast(`成功为告警 ${selectedBlacklistItem.code} 完成人工派单`);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                >
                  确认下发派单
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW WORK ORDER MODAL (查看工单页面) */}
        {isViewWorkOrderOpen && selectedBlacklistItem && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-cyan-300">
                    {selectedBlacklistItem.type.includes('温度') ? '温度异常处置工单详情' :
                     selectedBlacklistItem.type.includes('湿度') ? '湿度异常处置工单详情' :
                     selectedBlacklistItem.type.includes('空气') ? '空气质量处置工单详情' :
                     selectedBlacklistItem.type.includes('液位') ? '液位告警处置工单详情' :
                     selectedBlacklistItem.type.includes('压力') ? '压力管网处置工单详情' :
                     selectedBlacklistItem.type.includes('故障') ? '设备故障抢修工单详情' :
                     selectedBlacklistItem.type.includes('离线') ? '通讯离线排查工单详情' :
                     selectedBlacklistItem.type.includes('异常') ? '运行异常预警工单详情' :
                     '告警处置工单详情'} - {selectedBlacklistItem.code}
                  </h3>
                </div>
                <button onClick={() => setIsViewWorkOrderOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#030a1c] border border-[#1b448a] space-y-3">
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>关联工单号: {
                      selectedBlacklistItem.type.includes('温度') ? 'WO-20261106-TMP1' :
                      selectedBlacklistItem.type.includes('湿度') ? 'WO-20261106-HUM1' :
                      selectedBlacklistItem.type.includes('空气') ? 'WO-20261106-AIR1' :
                      selectedBlacklistItem.type.includes('液位') ? 'WO-20261106-LIQ1' :
                      selectedBlacklistItem.type.includes('压力') ? 'WO-20261106-PRS1' :
                      selectedBlacklistItem.type.includes('故障') ? 'WO-20261106-FLT1' :
                      selectedBlacklistItem.type.includes('离线') ? 'WO-20261106-OFF1' :
                      selectedBlacklistItem.type.includes('异常') ? 'WO-20261106-ABN1' :
                      'WO-20261106-9921'
                    }</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">已完结归档</span>
                  </div>
                  {selectedBlacklistItem.type.includes('温度') || selectedBlacklistItem.type.includes('湿度') ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>告警类型: <span className="text-cyan-300">{selectedBlacklistItem.type}</span></div>
                      <div>监测设备: <span className="text-white">{selectedBlacklistItem.deviceName} ({selectedBlacklistItem.location})</span></div>
                      <div>监测值/阈值: <span className="text-red-400">{selectedBlacklistItem.measuredValue} / {selectedBlacklistItem.threshold} ({selectedBlacklistItem.anomalyItem})</span></div>
                      <div>触发时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                      <div>责任班组: <span className="text-cyan-300">{selectedBlacklistItem.type.includes('温度') ? '暖通空调班组 (张工)' : '除湿通风班组 (张工)'}</span></div>
                    </div>
                  ) : selectedBlacklistItem.type.includes('空气') ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>告警类型: <span className="text-cyan-300">{selectedBlacklistItem.type}</span></div>
                      <div>监测设备: <span className="text-white">{selectedBlacklistItem.deviceName} ({selectedBlacklistItem.location})</span></div>
                      <div>指标/监测值: <span className="text-red-400">{selectedBlacklistItem.indicator} - {selectedBlacklistItem.measuredValue}</span></div>
                      <div>触发时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                      <div>责任班组: <span className="text-cyan-300">新风环保班组 (李工)</span></div>
                    </div>
                  ) : selectedBlacklistItem.type.includes('液位') ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>告警类型: <span className="text-cyan-300">{selectedBlacklistItem.type}</span></div>
                      <div>监测设备: <span className="text-white">{selectedBlacklistItem.deviceName} ({selectedBlacklistItem.location})</span></div>
                      <div>监测水位/阈值: <span className="text-red-400">{selectedBlacklistItem.measuredValue} / {selectedBlacklistItem.safeThreshold}</span></div>
                      <div>触发时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                      <div>责任班组: <span className="text-cyan-300">给排水抢修班组 (王工)</span></div>
                    </div>
                  ) : selectedBlacklistItem.type.includes('压力') ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>告警类型: <span className="text-cyan-300">{selectedBlacklistItem.type}</span></div>
                      <div>监测管网: <span className="text-white">{selectedBlacklistItem.deviceName} ({selectedBlacklistItem.location})</span></div>
                      <div>管道压力/范围: <span className="text-red-400">{selectedBlacklistItem.pipePressure} / {selectedBlacklistItem.safeRange}</span></div>
                      <div>触发时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                      <div>责任班组: <span className="text-cyan-300">管道与压力容器班组 (赵工)</span></div>
                    </div>
                  ) : selectedBlacklistItem.type.includes('故障') ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>告警类型: <span className="text-cyan-300">{selectedBlacklistItem.type}</span></div>
                      <div>故障设备: <span className="text-white">{selectedBlacklistItem.deviceName} ({selectedBlacklistItem.location})</span></div>
                      <div>故障代码/描述: <span className="text-red-400">{selectedBlacklistItem.faultCode} - {selectedBlacklistItem.faultDesc}</span></div>
                      <div>影响级别: <span className="text-amber-400">{selectedBlacklistItem.impactLevel}</span></div>
                      <div>触发时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                      <div>责任班组: <span className="text-cyan-300">设备抢修班组 (刘大牛)</span></div>
                    </div>
                  ) : selectedBlacklistItem.type.includes('离线') ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>告警类型: <span className="text-cyan-300">{selectedBlacklistItem.type}</span></div>
                      <div>失联设备: <span className="text-white">{selectedBlacklistItem.deviceName} ({selectedBlacklistItem.location})</span></div>
                      <div>通讯协议/IP: <span className="text-cyan-300">{selectedBlacklistItem.ipAddress}</span></div>
                      <div>离线时长/原因: <span className="text-red-400">{selectedBlacklistItem.duration} ({selectedBlacklistItem.cause})</span></div>
                      <div>触发时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                      <div>责任班组: <span className="text-cyan-300">物联网网络运维组 (周工)</span></div>
                    </div>
                  ) : selectedBlacklistItem.type.includes('异常') ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>告警类型: <span className="text-cyan-300">{selectedBlacklistItem.type}</span></div>
                      <div>预警设备: <span className="text-white">{selectedBlacklistItem.deviceName} ({selectedBlacklistItem.location})</span></div>
                      <div>异常参数/偏离: <span className="text-red-400">{selectedBlacklistItem.paramItem} - {selectedBlacklistItem.measuredDeviation}</span></div>
                      <div>健康评估: <span className="text-amber-300">{selectedBlacklistItem.healthScore}</span></div>
                      <div>触发时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                      <div>责任班组: <span className="text-cyan-300">预测性维护诊断组 (孙工)</span></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>告警类型: <span className="text-cyan-300">{selectedBlacklistItem.type}</span></div>
                      <div>抓拍设备: <span className="text-white">{selectedBlacklistItem.deviceName} ({selectedBlacklistItem.location})</span></div>
                      <div>触发时间: <span className="text-slate-300">{selectedBlacklistItem.triggerTime}</span></div>
                      <div>责任班组: <span className="text-cyan-300">安防应急班组 (张工)</span></div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 font-sans">
                  <div className="font-bold text-cyan-300">现场处置结论:</div>
                  <div className="text-emerald-400 text-xs bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    {selectedBlacklistItem.type.includes('温度') ? '经暖通运维人员现场核查，由于精密空调回风受阻导致局部温度超限，已清理回风过滤网并联动调低送风温度，复测温度已恢复正常范围。' :
                     selectedBlacklistItem.type.includes('湿度') ? '经机电人员现场核查，由于除湿一体机冷凝水泄压阀阻塞导致湿度飙升，已清理排水管路并启动应急抽湿机，湿度恢复至安全区间。' :
                     selectedBlacklistItem.type.includes('空气') ? '经新风团队现场检查，换气风机管道过滤网积尘偏高，已完成滤网更换并调高新风机组风量，空气质量指标复测达标。' :
                     selectedBlacklistItem.type.includes('液位') ? '经给排水抢修组现场核查，浮球液位传感器触点粘连导致停泵指令延迟，已更换传感器并手动启排，水位已恢复标准高度。' :
                     selectedBlacklistItem.type.includes('压力') ? '经管网维保组现场核查，稳压泵压力开关阀值设定漂移，已校准压力开关阀值并复测管道水压，系统压力平稳恢复。' :
                     selectedBlacklistItem.type.includes('故障') ? '经设备抢修人员现场紧急处置，已切断故障回路电源，更换过载继电器与故障继电触点，设备经全负荷试运行复测无异常，故障已清除。' :
                     selectedBlacklistItem.type.includes('离线') ? '经网络运维人员现场排查，为设备端485通信接线端子受震动松脱，已重新打线紧固并重启网关，设备通信心跳已恢复稳定在线。' :
                     selectedBlacklistItem.type.includes('异常') ? '经预警诊断团队现场核查，对送风机/泵体进行了转子动平衡校准并重新紧固传动皮带，复测轴承振动度降至 2.1 mm/s，设备健康度恢复至 95%。' :
                     '经现场人员核实与处置，事件已顺利办结。'}
                  </div>
                </div>

                <div className="space-y-2 font-sans">
                  <div className="font-bold text-cyan-300">工单流转日志:</div>
                  <div className="space-y-1.5 text-[11px] text-slate-300 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    {selectedBlacklistItem.type.includes('故障') ? (
                      <>
                        <div className="flex justify-between"><span>[{selectedBlacklistItem.triggerTime}] IBMS系统自动捕捉设备故障代码并生成紧急告警</span><span className="text-cyan-400">系统</span></div>
                        <div className="flex justify-between"><span>[2026-11-06 16:20] 值班调度员人工派发特急抢修工单至设备维保班组</span><span className="text-cyan-400">调度员</span></div>
                        <div className="flex justify-between"><span>[2026-11-06 17:05] 抢修工程师完成部件更换与带载试运行复测归档</span><span className="text-emerald-400">刘大牛</span></div>
                      </>
                    ) : selectedBlacklistItem.type.includes('离线') ? (
                      <>
                        <div className="flex justify-between"><span>[{selectedBlacklistItem.triggerTime}] 物联网监控平台检测到通信节点连续心跳丢包掉线</span><span className="text-cyan-400">系统</span></div>
                        <div className="flex justify-between"><span>[2026-11-06 16:35] 值班调度员下发离线故障排查工单至网络运维组</span><span className="text-cyan-400">调度员</span></div>
                        <div className="flex justify-between"><span>[2026-11-06 17:10] 网络工程师完成物理接线紧固与通信心跳恢复</span><span className="text-emerald-400">周工</span></div>
                      </>
                    ) : selectedBlacklistItem.type.includes('异常') && !selectedBlacklistItem.type.includes('温度') && !selectedBlacklistItem.type.includes('湿度') && !selectedBlacklistItem.type.includes('空气') ? (
                      <>
                        <div className="flex justify-between"><span>[{selectedBlacklistItem.triggerTime}] 预测性维护算法检测到运行参数偏离健康阈值</span><span className="text-cyan-400">AI诊断引擎</span></div>
                        <div className="flex justify-between"><span>[2026-11-06 16:00] 调度员创建预防性保养工单指派至诊断保养组</span><span className="text-cyan-400">调度员</span></div>
                        <div className="flex justify-between"><span>[2026-11-06 16:45] 工程师完成加脂与动平衡校准，设备健康度复测恢复 95%</span><span className="text-emerald-400">孙工</span></div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between"><span>[{selectedBlacklistItem.triggerTime}] 系统自动采集传感器告警</span><span className="text-cyan-400">系统</span></div>
                        <div className="flex justify-between"><span>[2026-11-06 16:10] 值班调度员人工派单至责任专业班组</span><span className="text-cyan-400">张工</span></div>
                        <div className="flex justify-between"><span>[2026-11-06 16:35] 责任工程师完成现场排查复测办结</span><span className="text-emerald-400">李经理</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#133063] font-sans">
                <button onClick={() => setIsViewWorkOrderOpen(false)} className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer">关闭详情</button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT ALARM CONFIG MODAL (编辑告警规则配置弹窗) */}
        {isEditAlarmCfgModal && editingCfg && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                <h3 className="text-sm font-bold text-cyan-300">修改告警派发规则配置 - {editingCfg.alarmType}</h3>
                <button onClick={() => setIsEditAlarmCfgModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">* 告警类型 / 触发项名称</label>
                  <input 
                    type="text" 
                    value={formAlarmType}
                    onChange={(e) => setFormAlarmType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">* 派单模式</label>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                      <input type="radio" name="editCfgDisp" checked={formDispatchType === '自动'} onChange={() => setFormDispatchType('自动')} className="text-cyan-500" />
                      <span>自动派单</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                      <input type="radio" name="editCfgDisp" checked={formDispatchType === '手动'} onChange={() => setFormDispatchType('手动')} className="text-cyan-500" />
                      <span>手动分派</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">* 默认接单人 / 责任班组</label>
                  <input 
                    type="text" 
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">* 处理响应时限</label>
                  <select 
                    value={formTimeLimit}
                    onChange={(e) => setFormTimeLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option>5min</option>
                    <option>10min</option>
                    <option>15min</option>
                    <option>30min</option>
                    <option>60min</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                <button onClick={() => setIsEditAlarmCfgModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                <button 
                  onClick={() => {
                    setAlarmConfigs(prev => prev.map(c => c.id === editingCfg.id ? {
                      ...c,
                      alarmType: formAlarmType,
                      dispatchType: formDispatchType,
                      assignee: formAssignee,
                      timeLimit: formTimeLimit,
                      updateTime: '2026-11-06 18:30'
                    } : c));
                    setIsEditAlarmCfgModal(false);
                    triggerToast(`成功更新规则配置: ${formAlarmType}`);
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
                >
                  确认保存修改
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE ALARM CONFIG MODAL (删除规则确认弹窗) */}
        {isDeleteAlarmCfgModal && deletingCfg && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-[#06122d] border border-red-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="text-sm font-bold text-red-300">删除规则配置确认</h3>
                </div>
                <button onClick={() => setIsDeleteAlarmCfgModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-xs text-slate-200">
                <p>确认要删除以下告警派发规则配置吗？</p>
                <div className="p-3 bg-[#030a1c] border border-[#133063] rounded-xl font-mono text-cyan-300 font-bold">
                  {deletingCfg.alarmType} ({deletingCfg.dispatchType} - {deletingCfg.assignee})
                </div>
                <p className="text-slate-400 text-[11px]">删除后，该告警类别将恢复系统默认的分派调度逻辑。</p>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                <button onClick={() => setIsDeleteAlarmCfgModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                <button 
                  onClick={() => {
                    setAlarmConfigs(prev => prev.filter(c => c.id !== deletingCfg.id));
                    setIsDeleteAlarmCfgModal(false);
                    triggerToast(`已成功删除配置规则: ${deletingCfg.alarmType}`);
                  }}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow cursor-pointer"
                >
                  确认彻底删除
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORK ORDER DETAIL MODAL (告警工单详情页面) */}
        {isWODetailModalOpen && selectedWorkOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-cyan-300">
                    告警工单详细信息 - {selectedWorkOrder.code}
                  </h3>
                </div>
                <button onClick={() => setIsWODetailModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#030a1c] border border-[#1b448a] space-y-3">
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>{selectedWorkOrder.title}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      selectedWorkOrder.status === '已完成' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                      selectedWorkOrder.status === '处理中' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>{selectedWorkOrder.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>工单类型: <span className="text-cyan-300">{selectedWorkOrder.type}</span></div>
                    <div>触发来源: <span className="text-white">{selectedWorkOrder.reporter}</span></div>
                    <div>生成时间: <span className="text-slate-300">{selectedWorkOrder.reportTime}</span></div>
                    <div>责任人员: <span className="text-cyan-300">{selectedWorkOrder.assignee}</span></div>
                    <div>优先级别: <span className="text-red-400 font-bold">特急 (5min响应)</span></div>
                    <div>关联区域: <span className="text-amber-300">T1/T2/B1 园区重点监控区</span></div>
                  </div>
                </div>

                <div className="space-y-2 font-sans">
                  <div className="font-bold text-cyan-300">现场排查与维修处置记录:</div>
                  <div className="text-slate-200 text-xs bg-[#030a1c] p-3 rounded-xl border border-[#133063] leading-relaxed">
                    工单已指发至责任专业班组，现场工程师已核对设备传感器联动触发信号，排除了硬件脱扣与误报警可能性，已完成设备校准及现场抢修测试，设备数据复测指标全部达标归档。
                  </div>
                </div>

                <div className="space-y-2 font-sans">
                  <div className="font-bold text-cyan-300">工单流转审计轨迹:</div>
                  <div className="space-y-1.5 text-[11px] text-slate-300 bg-[#030a1c] p-3 rounded-xl border border-[#133063]">
                    <div className="flex justify-between"><span>[{selectedWorkOrder.reportTime}] 监测系统检测到告警并触发工单自动/手动派单</span><span className="text-cyan-400">系统</span></div>
                    <div className="flex justify-between"><span>[2026-11-06 16:10] 值班调度员确认工单并指派至 {selectedWorkOrder.assignee}</span><span className="text-cyan-400">调度员</span></div>
                    <div className="flex justify-between"><span>[2026-11-06 17:00] 责任班组提交现场排查处置报告并申批归档</span><span className="text-emerald-400">{selectedWorkOrder.assignee}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#133063] font-sans">
                <button onClick={() => setIsWODetailModalOpen(false)} className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer">关闭详情</button>
              </div>
            </div>
          </div>
        )}

        {/* WORK ORDER CLOSE MODAL (告警工单结单审核弹窗) */}
        {isWOCloseModalOpen && closingWorkOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-cyan-300">告警工单结单归档审核 - {closingWorkOrder.code}</h3>
                </div>
                <button onClick={() => setIsWOCloseModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="p-3 bg-[#030a1c] border border-[#133063] rounded-xl space-y-1 font-mono">
                  <div className="text-white font-bold text-sm">{closingWorkOrder.title}</div>
                  <div className="text-slate-400 text-xs">工单类型: <span className="text-cyan-300">{closingWorkOrder.type}</span> | 责任人: <span className="text-white">{closingWorkOrder.assignee}</span></div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">结单审核人 / 指挥员</label>
                  <input 
                    type="text" 
                    readOnly 
                    value="张工 (调度指挥中心主任)" 
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-slate-300 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">现场处置总结与结单审核说明</label>
                  <textarea 
                    rows={3}
                    value={closeRemark}
                    onChange={(e) => setCloseRemark(e.target.value)}
                    placeholder="请输入结单审核说明与复测确认评价..."
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">运维处置满意度评级</label>
                  <select 
                    value={closeRating}
                    onChange={(e) => setCloseRating(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-amber-300 focus:outline-none focus:border-cyan-400 font-bold"
                  >
                    <option value="5">★★★★★ 五星 (非常满意 - 响应迅速处置规范)</option>
                    <option value="4">★★★★☆ 四星 (满意 - 处置达标复测正常)</option>
                    <option value="3">★★★☆☆ 三星 (一般 - 延时响应但已解决)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                <button onClick={() => setIsWOCloseModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                <button 
                  onClick={() => {
                    setAlarmWorkOrders(prev => prev.map(o => o.id === closingWorkOrder.id ? { ...o, status: '已完成' } : o));
                    setIsWOCloseModalOpen(false);
                    triggerToast(`告警工单 ${closingWorkOrder.code} 审核结单成功并已归档`);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow cursor-pointer"
                >
                  确认审核结单
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
