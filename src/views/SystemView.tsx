/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  Map, 
  MapPin, 
  ShieldAlert, 
  BellRing, 
  Layers, 
  Users, 
  FolderTree, 
  ShieldCheck, 
  Key, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ChevronDown, 
  X, 
  RefreshCw, 
  Sliders, 
  Radio,
  Camera,
  Monitor,
  MonitorOff,
  Bell,
  ArrowUp,
  ChevronLeft,
  Video,
  Shield,
  DoorClosed,
  Car,
  Wind,
  Sun,
  Thermometer,
  Droplets,
  Zap,
  Image,
  Move,
  ZoomIn,
  ZoomOut,
  ChevronUp
} from 'lucide-react';
import { AuditLog, UserAccount, SystemParam } from '../types/ibms';

interface SystemViewProps {
  logs: AuditLog[];
  users: UserAccount[];
  params: SystemParam[];
  onToggleUserStatus: (userId: string) => void;
  onUpdateParam: (paramId: string, val: string) => void;
}

export const maskPhone = (phone?: string) => {
  if (!phone) return '—';
  if (phone.length === 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  if (phone.length > 7) {
    return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4);
  }
  return phone;
};

export const maskIdCard = (idCard?: string) => {
  if (!idCard) return '—';
  if (idCard.length === 18) {
    return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
  }
  if (idCard.length > 10) {
    return idCard.substring(0, 6) + '********' + idCard.substring(idCard.length - 4);
  }
  return idCard;
};

export const SystemView: React.FC<SystemViewProps> = ({
  logs,
  users,
  params,
  onToggleUserStatus,
  onUpdateParam
}) => {
  // Left menu navigation states (Global system management sidebar)
  const [activeSecondary, setActiveSecondary] = useState<string>('设备管理');
  const [activeTertiary, setActiveTertiary] = useState<string>('设备列表');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '设备管理': true,
    '地图管理': true,
    '告警管理': true,
    '人员配置': true,
    '权限管理': true,
  });

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const [toastMessage, setToastMessage] = useState<string>('');
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Global System Management Left Menu Tree Structure
  const leftMenuTree = [
    {
      title: '设备管理',
      icon: Cpu,
      submenus: ['设备列表']
    },
    {
      title: '地图管理',
      icon: Map,
      submenus: ['地图编辑']
    },
    {
      title: '告警管理',
      icon: ShieldAlert,
      submenus: ['事件管理', '告警设置', '联动设置']
    },
    {
      title: '人员配置',
      icon: Users,
      submenus: ['部门管理', '人员列表']
    },
    {
      title: '权限管理',
      icon: ShieldCheck,
      submenus: ['角色管理']
    }
  ];

  // ==================== 1. 设备列表 - 页面内设备树 & 数据状态 ====================
  // 10个设备大类树形结构（置于设备列表页面左侧）
  const deviceSubsystemTree = [
    { subsystem: '视频监控', icon: Video, categories: ['摄像头'] },
    { subsystem: '防盗告警', icon: Shield, categories: ['红外探测器'] },
    { subsystem: '门禁系统', icon: DoorClosed, categories: ['门禁闸机'] },
    { subsystem: '停车场系统', icon: Car, categories: ['车牌抓拍机'] },
    { subsystem: '组合式空调', icon: Wind, categories: ['空调风机'] },
    { subsystem: '智慧照明', icon: Sun, categories: ['照明灯具'] },
    { subsystem: '环境监测', icon: Thermometer, categories: ['温湿度传感器'] },
    { subsystem: '冷热源', icon: Cpu, categories: ['冷水机组'] },
    { subsystem: '给排水', icon: Droplets, categories: ['水泵'] },
    { subsystem: '变配电', icon: Zap, categories: ['高压开关柜'] }
  ];

  const [expandedSubsystems, setExpandedSubsystems] = useState<Record<string, boolean>>({
    '视频监控': true,
    '防盗告警': true,
    '门禁系统': true,
    '停车场系统': true,
    '组合式空调': true,
    '智慧照明': true,
    '环境监测': true,
    '冷热源': true,
    '给排水': true,
    '变配电': true
  });

  const toggleSubsystem = (sub: string) => {
    setExpandedSubsystems(prev => ({ ...prev, [sub]: !prev[sub] }));
  };

  const [activeDeviceCategory, setActiveDeviceCategory] = useState<string>('摄像头');

  // 设备完整列表数据集 (每个分类10条数据)
  const initialDevices = [
    // 摄像头 (10条)
    { id: 'cam-1', category: '摄像头', seq: 1, code: 'fh12jfaj1312345', name: '大厅摄像头001', building: 'T1', floor: '1F', location: '东南角', brand: '华为NO01', ip: '116.1.0.123', status: '在线' },
    { id: 'cam-2', category: '摄像头', seq: 2, code: 'fh12jfaj1312346', name: '大厅摄像头002', building: 'T2', floor: '1F', location: '西北角', brand: '华为NO01', ip: '116.1.0.124', status: '在线' },
    { id: 'cam-3', category: '摄像头', seq: 3, code: 'fh12jfaj1312347', name: '电梯口枪机摄像头', building: 'T1', floor: '2F', location: '电梯厅正门', brand: '海康威视DS-2CD', ip: '116.1.0.125', status: '在线' },
    { id: 'cam-4', category: '摄像头', seq: 4, code: 'fh12jfaj1312348', name: '周界西侧红外枪机', building: 'T3', floor: '1F', location: '西侧围墙', brand: '大华DH-IPC', ip: '116.1.0.126', status: '离线' },
    { id: 'cam-5', category: '摄像头', seq: 5, code: 'fh12jfaj1312349', name: '地库主通道球机', building: 'B1', floor: 'B1', location: 'A区主干道', brand: '海康威视DS-2DE', ip: '116.1.0.127', status: '在线' },
    { id: 'cam-6', category: '摄像头', seq: 6, code: 'fh12jfaj1312350', name: '顶楼平台监控枪机', building: 'T1', floor: '3F', location: '顶楼天台', brand: '华为NO02', ip: '116.1.0.128', status: '在线' },
    { id: 'cam-7', category: '摄像头', seq: 7, code: 'fh12jfaj1312351', name: '中控室室内半球机', building: 'T2', floor: '2F', location: '中控大厅', brand: '海康威视DS-2CD', ip: '116.1.0.129', status: '在线' },
    { id: 'cam-8', category: '摄像头', seq: 8, code: 'fh12jfaj1312352', name: '南门岗卡口抓拍枪机', building: 'T1', floor: '1F', location: '南门出口', brand: '宇视科技HIC', ip: '116.1.0.130', status: '在线' },
    { id: 'cam-9', category: '摄像头', seq: 9, code: 'fh12jfaj1312353', name: '东侧巡逻路线全景球机', building: 'T3', floor: '1F', location: '东侧主道', brand: '大华DH-IPC', ip: '116.1.0.131', status: '故障' },
    { id: 'cam-10', category: '摄像头', seq: 10, code: 'fh12jfaj1312354', name: '数据中心核心区高清半球', building: 'T2', floor: '3F', location: '3F机房', brand: '华为NO01', ip: '116.1.0.132', status: '在线' },

    // 红外探测器 (10条)
    { id: 'ir-1', category: '红外探测器', seq: 1, code: 'IR-DET-001', name: '周界东侧红外对射01', building: 'T1', floor: '1F', location: '东墙10米处', brand: '博世ISC-BD', ip: '192.168.12.10', status: '在线' },
    { id: 'ir-2', category: '红外探测器', seq: 2, code: 'IR-DET-002', name: '周界东侧红外对射02', building: 'T1', floor: '1F', location: '东墙30米处', brand: '博世ISC-BD', ip: '192.168.12.11', status: '在线' },
    { id: 'ir-3', category: '红外探测器', seq: 3, code: 'IR-DET-003', name: '研发楼一楼红外幕帘', building: 'T2', floor: '1F', location: '一楼落地窗', brand: '霍尼韦尔IS30', ip: '192.168.12.12', status: '在线' },
    { id: 'ir-4', category: '红外探测器', seq: 4, code: 'IR-DET-004', name: '机房防盗双鉴探测器', building: 'T1', floor: '3F', location: '3F机房通道', brand: '博世ISC-BD', ip: '192.168.12.13', status: '故障' },
    { id: 'ir-5', category: '红外探测器', seq: 5, code: 'IR-DET-005', name: '财务室被动红外探测器', building: 'T2', floor: '2F', location: '财务保险库', brand: '霍尼韦尔IS30', ip: '192.168.12.14', status: '在线' },
    { id: 'ir-6', category: '红外探测器', seq: 6, code: 'IR-DET-006', name: '档案室吸顶双鉴探头', building: 'T3', floor: '2F', location: '档案室中央', brand: '艾礼富ALE', ip: '192.168.12.15', status: '在线' },
    { id: 'ir-7', category: '红外探测器', seq: 7, code: 'IR-DET-007', name: '变电所门口激光微波对射', building: 'B1', floor: 'B1', location: '变电所门', brand: '博世ISC-BD', ip: '192.168.12.16', status: '在线' },
    { id: 'ir-8', category: '红外探测器', seq: 8, code: 'IR-DET-008', name: '西侧围墙防入侵微波探头', building: 'T3', floor: '1F', location: '西侧栅栏', brand: '艾礼富ALE', ip: '192.168.12.17', status: '离线' },
    { id: 'ir-9', category: '红外探测器', seq: 9, code: 'IR-DET-009', name: '数据中心防盗门磁探头', building: 'T2', floor: '3F', location: '数据中心门', brand: '霍尼韦尔IS30', ip: '192.168.12.18', status: '在线' },
    { id: 'ir-10', category: '红外探测器', seq: 10, code: 'IR-DET-010', name: '行政楼防盗报警主机点', building: 'T1', floor: '2F', location: '行政控制箱', brand: '博世ISC-BD', ip: '192.168.12.19', status: '在线' },

    // 门禁闸机 (10条)
    { id: 'acc-1', category: '门禁闸机', seq: 1, code: 'ACC-GATE-001', name: 'T1主入口人脸识别速通门01', building: 'T1', floor: '1F', location: '大堂东道闸', brand: '捷顺JST-01', ip: '192.168.14.21', status: '在线' },
    { id: 'acc-2', category: '门禁闸机', seq: 2, code: 'ACC-GATE-002', name: 'T1主入口人脸识别速通门02', building: 'T1', floor: '1F', location: '大堂西道闸', brand: '捷顺JST-01', ip: '192.168.14.22', status: '在线' },
    { id: 'acc-3', category: '门禁闸机', seq: 3, code: 'ACC-GATE-003', name: 'T2研发大楼VIP考勤闸机', building: 'T2', floor: '1F', location: '研发楼大堂', brand: '海康威视DS-K', ip: '192.168.14.23', status: '在线' },
    { id: 'acc-4', category: '门禁闸机', seq: 4, code: 'ACC-GATE-004', name: 'B1地库员工通行单向转闸', building: 'B1', floor: 'B1', location: '电梯厅旁', brand: '捷顺JST-01', ip: '192.168.14.24', status: '在线' },
    { id: 'acc-5', category: '门禁闸机', seq: 5, code: 'ACC-GATE-005', name: '3F机房指纹掌静脉双门互锁', building: 'T1', floor: '3F', location: '机房前室', brand: '达实智能DS', ip: '192.168.14.25', status: '在线' },
    { id: 'acc-6', category: '门禁闸机', seq: 6, code: 'ACC-GATE-006', name: 'T3后勤楼员工考勤卡机', building: 'T3', floor: '1F', location: '后勤东门', brand: '捷顺JST-01', ip: '192.168.14.26', status: '在线' },
    { id: 'acc-7', category: '门禁闸机', seq: 7, code: 'ACC-GATE-007', name: '行政大楼VIP刷卡控制器', building: 'T2', floor: '2F', location: '行政通道', brand: '海康威视DS-K', ip: '192.168.14.27', status: '离线' },
    { id: 'acc-8', category: '门禁闸机', seq: 8, code: 'ACC-GATE-008', name: '数据中心安全防尾随闸机', building: 'T2', floor: '3F', location: '机房主门', brand: '达实智能DS', ip: '192.168.14.28', status: '在线' },
    { id: 'acc-9', category: '门禁闸机', seq: 9, code: 'ACC-GATE-009', name: 'T1-2F研发部智能门禁控制器', building: 'T1', floor: '2F', location: '2F正门', brand: '捷顺JST-01', ip: '192.168.14.29', status: '故障' },
    { id: 'acc-10', category: '门禁闸机', seq: 10, code: 'ACC-GATE-010', name: '消防安全通道紧急电磁门禁', building: 'T3', floor: '3F', location: '东安全梯', brand: '达实智能DS', ip: '192.168.14.30', status: '在线' },

    // 车牌抓拍机 (10条)
    { id: 'pr-1', category: '车牌抓拍机', seq: 1, code: 'PR-CAM-001', name: '东门出口高精抓拍一体机', building: 'T1', floor: '1F', location: '东门车道01', brand: '臻识科技ZCP', ip: '192.168.16.101', status: '在线' },
    { id: 'pr-2', category: '车牌抓拍机', seq: 2, code: 'PR-CAM-002', name: '东门入口高精抓拍一体机', building: 'T1', floor: '1F', location: '东门车道02', brand: '臻识科技ZCP', ip: '192.168.16.102', status: '在线' },
    { id: 'pr-3', category: '车牌抓拍机', seq: 3, code: 'PR-CAM-003', name: '西门车牌识别自动档杆机', building: 'T3', floor: '1F', location: '西门入口', brand: '捷顺JST-PR', ip: '192.168.16.103', status: '在线' },
    { id: 'pr-4', category: '车牌抓拍机', seq: 4, code: 'PR-CAM-004', name: '地库B1层车位引导摄像头01', building: 'B1', floor: 'B1', location: 'B1-A区通道', brand: '海康威视DS-TC', ip: '192.168.16.104', status: '在线' },
    { id: 'pr-5', category: '车牌抓拍机', seq: 5, code: 'PR-CAM-005', name: '地库B1层车位引导摄像头02', building: 'B1', floor: 'B1', location: 'B1-B区通道', brand: '海康威视DS-TC', ip: '192.168.16.106', status: '在线' },
    { id: 'pr-6', category: '车牌抓拍机', seq: 6, code: 'PR-CAM-006', name: '地下B2层新能源充电车位抓拍', building: 'B1', floor: 'B1', location: 'B2-E充电区', brand: '臻识科技ZCP', ip: '192.168.16.107', status: '离线' },
    { id: 'pr-7', category: '车牌抓拍机', seq: 7, code: 'PR-CAM-007', name: '货运通道雷达测速识别相机', building: 'T3', floor: '1F', location: '后勤卸货区', brand: '大华DH-ITC', ip: '192.168.16.108', status: '在线' },
    { id: 'pr-8', category: '车牌抓拍机', seq: 8, code: 'PR-CAM-008', name: 'VIP专享通道反向寻车相机', building: 'B1', floor: 'B1', location: 'B1-VIP区域', brand: '捷顺JST-PR', ip: '192.168.16.109', status: '在线' },
    { id: 'pr-9', category: '车牌抓拍机', seq: 9, code: 'PR-CAM-009', name: '南门岗卡口抓拍与计费控制器', building: 'T1', floor: '1F', location: '南门匝道', brand: '臻识科技ZCP', ip: '192.168.16.110', status: '在线' },
    { id: 'pr-10', category: '车牌抓拍机', seq: 10, code: 'PR-CAM-010', name: '地库坡道限高超速预警抓拍机', building: 'B1', floor: 'B1', location: '地库入口坡道', brand: '海康威视DS-TC', ip: '192.168.16.111', status: '故障' },

    // 空调风机 (10条)
    { id: 'ahu-1', category: '空调风机', seq: 1, code: 'AHU-FAN-001', name: '1#大堂变频送风机组', building: 'T1', floor: '1F', location: '1F空调机房', brand: '开利Carrier', ip: 'MODBUS-AHU01', status: '在线' },
    { id: 'ahu-2', category: '空调风机', seq: 2, code: 'AHU-FAN-002', name: '2#大堂排风循环风机', building: 'T1', floor: '1F', location: '1F空调机房', brand: '开利Carrier', ip: 'MODBUS-AHU02', status: '在线' },
    { id: 'ahu-3', category: '空调风机', seq: 3, code: 'AHU-FAN-003', name: '3F核心机房精密风机箱01', building: 'T1', floor: '3F', location: '3F数据中心', brand: '艾默生Emerson', ip: '192.168.22.31', status: '在线' },
    { id: 'ahu-4', category: '空调风机', seq: 4, code: 'AHU-FAN-004', name: '3F核心机房精密风机箱02', building: 'T1', floor: '3F', location: '3F数据中心', brand: '艾默生Emerson', ip: '192.168.22.32', status: '在线' },
    { id: 'ahu-5', category: '空调风机', seq: 5, code: 'AHU-FAN-005', name: 'T2-2F办公区新风换气机组', building: 'T2', floor: '2F', location: '2F空调夹层', brand: '约克York', ip: 'MODBUS-AHU05', status: '在线' },
    { id: 'ahu-6', category: '空调风机', seq: 6, code: 'AHU-FAN-006', name: 'B1层地下车库诱导风机箱', building: 'B1', floor: 'B1', location: 'B1机房', brand: '特灵Trane', ip: '192.168.22.35', status: '离线' },
    { id: 'ahu-7', category: '空调风机', seq: 7, code: 'AHU-FAN-007', name: 'T3-3F会议中心组合式风机', building: 'T3', floor: '3F', location: '3F空调间', brand: '特灵Trane', ip: '192.168.22.36', status: '在线' },
    { id: 'ahu-8', category: '空调风机', seq: 8, code: 'AHU-FAN-008', name: '食堂油烟加压排风风机', building: 'T3', floor: '1F', location: '厨房排风井', brand: '开利Carrier', ip: 'MODBUS-AHU08', status: '在线' },
    { id: 'ahu-9', category: '空调风机', seq: 9, code: 'AHU-FAN-009', name: '消防正压送风风机控制器', building: 'T2', floor: '3F', location: '屋顶风机房', brand: '约克York', ip: '192.168.22.38', status: '故障' },
    { id: 'ahu-10', category: '空调风机', seq: 10, code: 'AHU-FAN-010', name: 'T1大楼顶层排烟风机02', building: 'T1', floor: '3F', location: '顶层风机房', brand: '开利Carrier', ip: 'MODBUS-AHU10', status: '在线' },

    // 照明灯具 (10条)
    { id: 'lgt-1', category: '照明灯具', seq: 1, code: 'LGT-DEV-001', name: 'T1大堂LED艺术吊灯控制器', building: 'T1', floor: '1F', location: '大堂天花板', brand: '飞利浦Philips', ip: 'DALI-GW01', status: '在线' },
    { id: 'lgt-2', category: '照明灯具', seq: 2, code: 'LGT-DEV-002', name: 'T1-2F办公室智能调光模组', building: 'T1', floor: '2F', location: '2F配电箱', brand: '施耐德Schneider', ip: '192.168.30.12', status: '在线' },
    { id: 'lgt-3', category: '照明灯具', seq: 3, code: 'LGT-DEV-003', name: '园区景观庭院灯时控网关', building: 'T1', floor: '1F', location: '室外景观带', brand: '雷士照明NVC', ip: '192.168.30.13', status: '在线' },
    { id: 'lgt-4', category: '照明灯具', seq: 4, code: 'LGT-DEV-004', name: 'B1地库感应雷达LED灯管组', building: 'B1', floor: 'B1', location: 'B1全区车道', brand: '三雄极光', ip: 'DALI-GW04', status: '在线' },
    { id: 'lgt-5', category: '照明灯具', seq: 5, code: 'LGT-DEV-005', name: 'T2大楼外立面夜景亮化控制器', building: 'T2', floor: '3F', location: 'T2楼顶楼', brand: '飞利浦Philips', ip: '192.168.30.15', status: '在线' },
    { id: 'lgt-6', category: '照明灯具', seq: 6, code: 'LGT-DEV-006', name: '3F大会议室RGB场景控制面板', building: 'T3', floor: '3F', location: '大会议室', brand: '施耐德Schneider', ip: 'DALI-GW06', status: '故障' },
    { id: 'lgt-7', category: '照明灯具', seq: 7, code: 'LGT-DEV-007', name: 'T3后勤通道应急照明蓄电池组', building: 'T3', floor: '1F', location: '应急疏散道', brand: '雷士照明NVC', ip: '192.168.30.17', status: '在线' },
    { id: 'lgt-8', category: '照明灯具', seq: 8, code: 'LGT-DEV-008', name: '地下车库坡道防眩光指示灯箱', building: 'B1', floor: 'B1', location: '地库出口', brand: '三雄极光', ip: 'DALI-GW08', status: '在线' },
    { id: 'lgt-9', category: '照明灯具', seq: 9, code: 'LGT-DEV-009', name: '中控指挥大厅无主灯调光驱动', building: 'T2', floor: '2F', location: '中控室', brand: '飞利浦Philips', ip: '192.168.30.19', status: '离线' },
    { id: 'lgt-10', category: '照明灯具', seq: 10, code: 'LGT-DEV-010', name: '楼宇逃生安全指示灯回路箱', building: 'T1', floor: '2F', location: '2F楼梯间', brand: '施耐德Schneider', ip: 'DALI-GW10', status: '在线' },

    // 温湿度传感器 (10条)
    { id: 'env-1', category: '温湿度传感器', seq: 1, code: 'ENV-TH-001', name: '3F机房A区温湿度变送器01', building: 'T1', floor: '3F', location: '3F机房A1架', brand: '西门子Siemens', ip: '192.168.42.11', status: '在线' },
    { id: 'env-2', category: '温湿度传感器', seq: 2, code: 'ENV-TH-002', name: '3F机房B区温湿度变送器02', building: 'T1', floor: '3F', location: '3F机房B3架', brand: '西门子Siemens', ip: '192.168.42.12', status: '在线' },
    { id: 'env-3', category: '温湿度传感器', seq: 3, code: 'ENV-TH-003', name: 'T1大堂空气质量与湿敏传感器', building: 'T1', floor: '1F', location: '大堂休息区', brand: '霍尼韦尔Honeywell', ip: '192.168.42.13', status: '在线' },
    { id: 'env-4', category: '温湿度传感器', seq: 4, code: 'ENV-TH-004', name: '10kV变电所变压器温控仪', building: 'B1', floor: 'B1', location: '变电所1#柜', brand: '施耐德Schneider', ip: 'MODBUS-TH04', status: '在线' },
    { id: 'env-5', category: '温湿度传感器', seq: 5, code: 'ENV-TH-005', name: 'T2-2F研发部多功能环境监测仪', building: 'T2', floor: '2F', location: '研发开放区', brand: '霍尼韦尔Honeywell', ip: '192.168.42.15', status: '在线' },
    { id: 'env-6', category: '温湿度传感器', seq: 6, code: 'ENV-TH-006', name: '档案室高精度温湿度记录仪', building: 'T3', floor: '2F', location: '机密档案库', brand: '西门子Siemens', ip: '192.168.42.16', status: '离线' },
    { id: 'env-7', category: '温湿度传感器', seq: 7, code: 'ENV-TH-007', name: 'B2层水泵房浸水与湿度探头', building: 'B1', floor: 'B1', location: 'B2泵房', brand: '江森自控Johnson', ip: 'MODBUS-TH07', status: '在线' },
    { id: 'env-8', category: '温湿度传感器', seq: 8, code: 'ENV-TH-008', name: '冷站冷却塔室外环境气象站', building: 'T1', floor: '3F', location: '楼顶气象站', brand: '西门子Siemens', ip: '192.168.42.18', status: '在线' },
    { id: 'env-9', category: '温湿度传感器', seq: 9, code: 'ENV-TH-009', name: '药品试剂库红外温湿度探头', building: 'T3', floor: '1F', location: '后勤仓库', brand: '霍尼韦尔Honeywell', ip: '192.168.42.19', status: '故障' },
    { id: 'env-10', category: '温湿度传感器', seq: 10, code: 'ENV-TH-010', name: 'T2大楼中庭挑高环境感应器', building: 'T2', floor: '1F', location: '中庭上方', brand: '江森自控Johnson', ip: '192.168.42.20', status: '在线' },

    // 冷水机组 (10条)
    { id: 'ch-1', category: '冷水机组', seq: 1, code: 'HVAC-CH-001', name: '1#螺杆式高效离心冷水机组', building: 'B1', floor: 'B1', location: '冷站中心', brand: '约克York', ip: '192.168.50.10', status: '在线' },
    { id: 'ch-2', category: '冷水机组', seq: 2, code: 'HVAC-CH-002', name: '2#螺杆式变频冷水主机', building: 'B1', floor: 'B1', location: '冷站中心', brand: '开利Carrier', ip: '192.168.50.11', status: '在线' },
    { id: 'ch-3', category: '冷水机组', seq: 3, code: 'HVAC-CH-003', name: '3#磁悬浮无油冷水机组', building: 'B1', floor: 'B1', location: '冷站中心', brand: '特灵Trane', ip: '192.168.50.12', status: '在线' },
    { id: 'ch-4', category: '冷水机组', seq: 4, code: 'HVAC-CH-004', name: '数据中心专用风冷冷水机组', building: 'T1', floor: '3F', location: '3F露台区', brand: '麦克维尔McQuay', ip: '192.168.50.13', status: '在线' },
    { id: 'ch-5', category: '冷水机组', seq: 5, code: 'HVAC-CH-005', name: '1#冷却塔变频风机控制柜', building: 'T1', floor: '3F', location: '顶楼冷却塔', brand: '约克York', ip: 'MODBUS-CH05', status: '在线' },
    { id: 'ch-6', category: '冷水机组', seq: 6, code: 'HVAC-CH-006', name: '冷冻水循环水泵组PLC控制器', building: 'B1', floor: 'B1', location: '冷站控制室', brand: '西门子Siemens', ip: '192.168.50.15', status: '在线' },
    { id: 'ch-7', category: '冷水机组', seq: 7, code: 'HVAC-CH-007', name: '2#冷却水循环泵高压变频器', building: 'B1', floor: 'B1', location: '冷站配电房', brand: 'ABB-ACS880', ip: '192.168.50.16', status: '离线' },
    { id: 'ch-8', category: '冷水机组', seq: 8, code: 'HVAC-CH-008', name: '冷站板式换热机组电动调节阀', building: 'B1', floor: 'B1', location: '换热间', brand: '丹佛斯Danfoss', ip: 'MODBUS-CH08', status: '在线' },
    { id: 'ch-9', category: '冷水机组', seq: 9, code: 'HVAC-CH-009', name: '冷站自动补水脱气定压装置', building: 'B1', floor: 'B1', location: '补水泵房', brand: '开利Carrier', ip: '192.168.50.18', status: '故障' },
    { id: 'ch-10', category: '冷水机组', seq: 10, code: 'HVAC-CH-010', name: '4#备用螺杆冷水机组PLC控制器', building: 'B1', floor: 'B1', location: '冷站中心', brand: '特灵Trane', ip: '192.168.50.19', status: '在线' },

    // 水泵 (10条)
    { id: 'pmp-1', category: '水泵', seq: 1, code: 'PMP-SYS-001', name: '1#生活给水变频恒压水泵', building: 'B1', floor: 'B1', location: 'B1生活水泵房', brand: '格兰富Grundfos', ip: '192.168.60.21', status: '在线' },
    { id: 'pmp-2', category: '水泵', seq: 2, code: 'PMP-SYS-002', name: '2#生活给水加压水泵', building: 'B1', floor: 'B1', location: 'B1生活水泵房', brand: '格兰富Grundfos', ip: '192.168.60.22', status: '在线' },
    { id: 'pmp-3', category: '水泵', seq: 3, code: 'PMP-SYS-003', name: 'B2地库主消火栓加压泵', building: 'B1', floor: 'B1', location: 'B2消防泵房', brand: '连成水泵', ip: '192.168.60.23', status: '在线' },
    { id: 'pmp-4', category: '水泵', seq: 4, code: 'PMP-SYS-004', name: 'B2喷淋系统稳压加压泵箱', building: 'B1', floor: 'B1', location: 'B2消防泵房', brand: '南方泵业FCN', ip: '192.168.60.24', status: '在线' },
    { id: 'pmp-5', category: '水泵', seq: 5, code: 'PMP-SYS-005', name: 'B1层集水坑排污潜水泵01', building: 'B1', floor: 'B1', location: 'B1集水坑A', brand: '威乐Wilo', ip: 'MODBUS-PMP05', status: '在线' },
    { id: 'pmp-6', category: '水泵', seq: 6, code: 'PMP-SYS-006', name: 'B1层集水坑排污潜水泵02', building: 'B1', floor: 'B1', location: 'B1集水坑B', brand: '威乐Wilo', ip: 'MODBUS-PMP06', status: '在线' },
    { id: 'pmp-7', category: '水泵', seq: 7, code: 'PMP-SYS-007', name: '顶楼高位消防水箱补水泵', building: 'T1', floor: '3F', location: '顶楼水箱间', brand: '格兰富Grundfos', ip: '192.168.60.27', status: '故障' },
    { id: 'pmp-8', category: '水泵', seq: 8, code: 'PMP-SYS-008', name: '景观喷泉循环加压泵', building: 'T1', floor: '1F', location: '室外景观池', brand: '南方泵业FCN', ip: 'MODBUS-PMP08', status: '在线' },
    { id: 'pmp-9', category: '水泵', seq: 9, code: 'PMP-SYS-009', name: '雨水收集与回用过滤泵组', building: 'B1', floor: 'B1', location: '雨水处理站', brand: '威乐Wilo', ip: '192.168.60.29', status: '离线' },
    { id: 'pmp-10', category: '水泵', seq: 10, code: 'PMP-SYS-010', name: '3#生活水箱软化水处理循环泵', building: 'B1', floor: 'B1', location: '水处理间', brand: '格兰富Grundfos', ip: '192.168.60.30', status: '在线' },

    // 高压开关柜 (10条)
    { id: 'pwr-1', category: '高压开关柜', seq: 1, code: 'PWR-SW-001', name: '10kV AH01高压进线开关柜', building: 'B1', floor: 'B1', location: '10kV变电所', brand: 'ABB Unigeard', ip: 'MODBUS-PWR01', status: '在线' },
    { id: 'pwr-2', category: '高压开关柜', seq: 2, code: 'PWR-SW-002', name: '10kV AH02高压进线开关柜', building: 'B1', floor: 'B1', location: '10kV变电所', brand: 'ABB Unigeard', ip: 'MODBUS-PWR02', status: '在线' },
    { id: 'pwr-3', category: '高压开关柜', seq: 3, code: 'PWR-SW-003', name: 'AH03母线联络微机保护柜', building: 'B1', floor: 'B1', location: '10kV变电所', brand: '施耐德Schneider', ip: 'MODBUS-PWR03', status: '在线' },
    { id: 'pwr-4', category: '高压开关柜', seq: 4, code: 'PWR-SW-004', name: '1#干式变压器高压出线柜', building: 'B1', floor: 'B1', location: '10kV变电所', brand: '西门子Siemens', ip: 'MODBUS-PWR04', status: '在线' },
    { id: 'pwr-5', category: '高压开关柜', seq: 5, code: 'PWR-SW-005', name: '2#干式变压器高压出线柜', building: 'B1', floor: 'B1', location: '10kV变电所', brand: '西门子Siemens', ip: 'MODBUS-PWR05', status: '在线' },
    { id: 'pwr-6', category: '高压开关柜', seq: 6, code: 'PWR-SW-006', name: '0.4kV 低压进线总开关柜AA01', building: 'B1', floor: 'B1', location: '低压配电房', brand: '施耐德Schneider', ip: '192.168.70.16', status: '在线' },
    { id: 'pwr-7', category: '高压开关柜', seq: 7, code: 'PWR-SW-007', name: '0.4kV 低压进线总开关柜AA02', building: 'B1', floor: 'B1', location: '低压配电房', brand: '施耐德Schneider', ip: '192.168.70.17', status: '在线' },
    { id: 'pwr-8', category: '高压开关柜', seq: 8, code: 'PWR-SW-008', name: 'AP01无功功率自动补偿柜', building: 'B1', floor: 'B1', location: '低压配电房', brand: 'ABB Unigeard', ip: '192.168.70.18', status: '在线' },
    { id: 'pwr-9', category: '高压开关柜', seq: 9, code: 'PWR-SW-009', name: '核心数据中心UPS输出总配电柜', building: 'T1', floor: '3F', location: '3F配电间', brand: '施耐德Schneider', ip: '192.168.70.19', status: '故障' },
    { id: 'pwr-10', category: '高压开关柜', seq: 10, code: 'PWR-SW-010', name: '应急柴油发电机自动切换柜ATS', building: 'B1', floor: 'B1', location: '发电机房', brand: '康明斯Cummins', ip: '192.168.70.20', status: '在线' }
  ];

  const [deviceList, setDeviceList] = useState(initialDevices);

  // Filter & Query States for Devices
  const [selectedBuilding, setSelectedBuilding] = useState<string>('全部');
  const [selectedFloor, setSelectedFloor] = useState<string>('全部');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filtered devices based on active category, building, floor, keyword search
  const filteredCategoryDevices = deviceList.filter(d => {
    if (d.category !== activeDeviceCategory) return false;
    if (selectedBuilding !== '全部' && d.building !== selectedBuilding) return false;
    if (selectedFloor !== '全部' && d.floor !== selectedFloor) return false;
    if (searchKeyword.trim() !== '') {
      const kw = searchKeyword.toLowerCase();
      const matchName = d.name.toLowerCase().includes(kw);
      const matchCode = d.code.toLowerCase().includes(kw);
      const matchLoc = d.location.toLowerCase().includes(kw);
      const matchBrand = d.brand.toLowerCase().includes(kw);
      if (!matchName && !matchCode && !matchLoc && !matchBrand) return false;
    }
    return true;
  });

  // Calculate statistics for the active category
  const activeCategoryAllItems = deviceList.filter(d => d.category === activeDeviceCategory);
  const totalCount = activeCategoryAllItems.length;
  const onlineCount = activeCategoryAllItems.filter(d => d.status === '在线').length;
  const offlineCount = activeCategoryAllItems.filter(d => d.status === '离线').length;
  const faultCount = activeCategoryAllItems.filter(d => d.status === '故障').length;

  // Pagination for 10 records per page
  const totalPages = Math.ceil(filteredCategoryDevices.length / pageSize) || 1;
  const paginatedDevices = filteredCategoryDevices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedBuilding('全部');
    setSelectedFloor('全部');
    setSearchKeyword('');
    setCurrentPage(1);
    triggerToast('已重置所有查询条件');
  };

  // Modals for CRUD operations on Devices
  const [isAddDeviceModal, setIsAddDeviceModal] = useState(false);
  const [isEditDeviceModal, setIsEditDeviceModal] = useState(false);
  const [isDeleteDeviceModal, setIsDeleteDeviceModal] = useState(false);

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formBuilding, setFormBuilding] = useState('T1');
  const [formFloor, setFormFloor] = useState('1F');
  const [formLocation, setFormLocation] = useState('东南角');
  const [formBrand, setFormBrand] = useState('华为NO01');
  const [formIp, setFormIp] = useState('116.1.0.123');
  const [formStatus, setFormStatus] = useState('在线');
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
  const [activeDeletingId, setActiveDeletingId] = useState<string | null>(null);

  const openAddModal = () => {
    setFormCode(`fh12jfaj${Date.now().toString().slice(-7)}`);
    setFormName(`${activeDeviceCategory}0${filteredCategoryDevices.length + 1}`);
    setFormBuilding('T1');
    setFormFloor('1F');
    setFormLocation('东南角');
    setFormBrand('华为NO01');
    setFormIp(`116.1.0.${100 + Math.floor(Math.random() * 100)}`);
    setFormStatus('在线');
    setIsAddDeviceModal(true);
  };

  const handleCreateDevice = () => {
    if (!formName || !formCode) {
      triggerToast('请填写设备名称和编号！');
      return;
    }
    const newDev = {
      id: `dev-${Date.now()}`,
      category: activeDeviceCategory,
      seq: activeCategoryAllItems.length + 1,
      code: formCode,
      name: formName,
      building: formBuilding,
      floor: formFloor,
      location: formLocation,
      brand: formBrand,
      ip: formIp,
      status: formStatus
    };
    setDeviceList([newDev, ...deviceList]);
    setIsAddDeviceModal(false);
    triggerToast(`新增设备 [${newDev.name}] 成功！`);
  };

  const openEditModal = (dev: any) => {
    setActiveEditingId(dev.id);
    setFormCode(dev.code);
    setFormName(dev.name);
    setFormBuilding(dev.building);
    setFormFloor(dev.floor);
    setFormLocation(dev.location);
    setFormBrand(dev.brand);
    setFormIp(dev.ip);
    setFormStatus(dev.status);
    setIsEditDeviceModal(true);
  };

  const handleUpdateDevice = () => {
    if (!activeEditingId) return;
    setDeviceList(prev => prev.map(d => {
      if (d.id === activeEditingId) {
        return {
          ...d,
          code: formCode,
          name: formName,
          building: formBuilding,
          floor: formFloor,
          location: formLocation,
          brand: formBrand,
          ip: formIp,
          status: formStatus
        };
      }
      return d;
    }));
    setIsEditDeviceModal(false);
    triggerToast(`更新设备 [${formName}] 成功！`);
  };

  const openDeleteModal = (dev: any) => {
    setActiveDeletingId(dev.id);
    setFormName(dev.name);
    setIsDeleteDeviceModal(true);
  };

  const handleDeleteDevice = () => {
    if (!activeDeletingId) return;
    setDeviceList(prev => prev.filter(d => d.id !== activeDeletingId));
    setIsDeleteDeviceModal(false);
    triggerToast(`已成功删除设备 [${formName}]！`);
  };

  // ================= 2. 地图编辑状态 (Matching screenshot image_9e81fb95.png) =================
  const [selectedMapFloor, setSelectedMapFloor] = useState('2号楼-1F');
  const [mapEditBuilding, setMapEditBuilding] = useState('2号楼');
  const [mapEditFloor, setMapEditFloor] = useState('1F');
  const [expandedMapBuildings, setExpandedMapBuildings] = useState<Record<string, boolean>>({
    '1号楼': false,
    '2号楼': true,
  });

  const [activeLayoutDevice, setActiveLayoutDevice] = useState('摄像头1');
  const [mapSearchKeyword, setMapSearchKeyword] = useState('');
  const [expandedDeviceCategories, setExpandedDeviceCategories] = useState<Record<string, boolean>>({
    '摄像头': true,
    '人脸门禁': false,
    '室内机': false,
  });

  // Dynamic device pins & sidebar list per floor
  const [floorDeviceMap, setFloorDeviceMap] = useState<Record<string, {
    category: string;
    items: { id: string; name: string; status: 'normal' | 'unplaced' | 'alert'; x: number; y: number }[];
  }[]>>({
    '2号楼-1F': [
      {
        category: '摄像头',
        items: [
          { id: 'c1', name: '摄像头1', status: 'normal', x: 52, y: 28 },
          { id: 'c2', name: '摄像头02', status: 'normal', x: 23, y: 50 },
          { id: 'c3', name: '摄像头03', status: 'alert', x: 48, y: 32 },
          { id: 'c4', name: '摄像头04', status: 'alert', x: 51, y: 44 },
          { id: 'c5', name: '摄像头05', status: 'normal', x: 26, y: 44 },
          { id: 'c6', name: '摄像头06', status: 'normal', x: 22, y: 51 },
        ]
      },
      {
        category: '人脸门禁',
        items: [
          { id: 'm1', name: '人脸门禁01', status: 'normal', x: 38, y: 58 },
          { id: 'm2', name: '人脸门禁02', status: 'normal', x: 62, y: 42 },
        ]
      },
      {
        category: '室内机',
        items: [
          { id: 's1', name: '室内机01', status: 'normal', x: 42, y: 24 },
          { id: 's2', name: '室内机02', status: 'normal', x: 58, y: 24 },
        ]
      }
    ],
    '2号楼-2F': [
      {
        category: '摄像头',
        items: [
          { id: 'c21', name: '摄像头201', status: 'normal', x: 30, y: 35 },
          { id: 'c22', name: '摄像头202', status: 'normal', x: 60, y: 45 },
          { id: 'c23', name: '摄像头203', status: 'alert', x: 45, y: 55 },
        ]
      },
      {
        category: '人脸门禁',
        items: [
          { id: 'm21', name: '2F展示区门禁', status: 'normal', x: 40, y: 30 },
        ]
      },
      {
        category: '室内机',
        items: [
          { id: 's21', name: '温湿度控制终端01', status: 'normal', x: 55, y: 20 },
        ]
      }
    ],
    '2号楼-3F': [
      {
        category: '摄像头',
        items: [
          { id: 'c31', name: '摄像头301', status: 'normal', x: 35, y: 40 },
          { id: 'c32', name: '摄像头302', status: 'normal', x: 65, y: 50 },
        ]
      },
      {
        category: '人脸门禁',
        items: [
          { id: 'm31', name: '高管专区门禁', status: 'normal', x: 45, y: 35 },
        ]
      },
      {
        category: '室内机',
        items: [
          { id: 's31', name: '精细化温控终端', status: 'normal', x: 50, y: 25 },
        ]
      }
    ],
    '2号楼-B1': [
      {
        category: '摄像头',
        items: [
          { id: 'cb1', name: 'B1车库摄像机01', status: 'normal', x: 25, y: 60 },
          { id: 'cb2', name: 'B1车库摄像机02', status: 'normal', x: 75, y: 40 },
        ]
      },
      {
        category: '人脸门禁',
        items: [
          { id: 'mb1', name: 'B1地库门禁01', status: 'normal', x: 50, y: 80 },
        ]
      },
      {
        category: '室内机',
        items: [
          { id: 'sb1', name: 'CO浓度传感器01', status: 'normal', x: 60, y: 30 },
        ]
      }
    ],
    '2号楼-B2': [
      {
        category: '摄像头',
        items: [
          { id: 'cb21', name: 'B2车库相机01', status: 'normal', x: 30, y: 50 },
        ]
      },
      {
        category: '人脸门禁',
        items: [
          { id: 'mb21', name: 'B2梯口门禁01', status: 'normal', x: 45, y: 65 },
        ]
      },
      {
        category: '室内机',
        items: [
          { id: 'sb21', name: '地下泵房控制器', status: 'normal', x: 65, y: 35 },
        ]
      }
    ],
    '1号楼-1F': [
      {
        category: '摄像头',
        items: [
          { id: 'c11', name: '1号楼大堂摄像机01', status: 'normal', x: 40, y: 40 },
          { id: 'c12', name: '1号楼东门摄像头02', status: 'normal', x: 70, y: 30 },
          { id: 'c13', name: '1号楼走廊摄像机03', status: 'alert', x: 50, y: 60 },
        ]
      },
      {
        category: '人脸门禁',
        items: [
          { id: 'm11', name: '1号楼主入口道闸', status: 'normal', x: 50, y: 75 },
        ]
      },
      {
        category: '室内机',
        items: [
          { id: 's11', name: '大堂显示屏终端', status: 'normal', x: 35, y: 45 },
        ]
      }
    ],
    '1号楼-2F': [
      {
        category: '摄像头',
        items: [
          { id: 'c121', name: '1号楼2F摄像机01', status: 'normal', x: 45, y: 35 },
        ]
      },
      {
        category: '人脸门禁',
        items: [
          { id: 'm121', name: '2F展示中心门禁', status: 'normal', x: 55, y: 55 },
        ]
      },
      {
        category: '室内机',
        items: [
          { id: 's121', name: '温湿度控制终端02', status: 'normal', x: 40, y: 30 },
        ]
      }
    ],
    '1号楼-3F': [
      {
        category: '摄像头',
        items: [
          { id: 'c131', name: '3F核心机房相机01', status: 'normal', x: 50, y: 50 },
        ]
      },
      {
        category: '人脸门禁',
        items: [
          { id: 'm131', name: '3F防尾随门禁01', status: 'normal', x: 30, y: 60 },
        ]
      },
      {
        category: '室内机',
        items: [
          { id: 's131', name: '精密空调控制器', status: 'normal', x: 60, y: 40 },
        ]
      }
    ],
  });

  const [mapLayers, setMapLayers] = useState({
    security: true,
    hvac: true,
    fire: true,
    power: true
  });
  const [isAddingMapPoint, setIsAddingMapPoint] = useState(false);

  // ================= 3. 告警管理 -> 事件管理 =================
  const [eventSearchKeyword, setEventSearchKeyword] = useState('');
  const [eventCurrentPage, setEventCurrentPage] = useState(1);
  const eventPageSize = 10;

  const [eventList, setEventList] = useState([
    { id: 'evt-1', name: '电耗超标', subsystem: '远程抄表', deviceType: '电表', monitorDev: '电表1、电表2', valName: '当月电耗', duration: '0min', condition: '大于', threshold: '100', unit: 'kWh', status: '启用' },
    { id: 'evt-2', name: '温度超标', subsystem: '环境监测', deviceType: '温湿度传感器', monitorDev: '感应器1、感应器2', valName: '温度值', duration: '5min', condition: '大于', threshold: '45', unit: '°C', status: '启用' },
    { id: 'evt-3', name: '烟感异常', subsystem: '消防系统', deviceType: '烟感探测器', monitorDev: '烟感1、烟感2', valName: '烟雾浓度', duration: '1min', condition: '大于', threshold: '50', unit: 'ppm', status: '启用' },
    { id: 'evt-4', name: '水压欠压', subsystem: '给排水', deviceType: '水压表', monitorDev: '水压表1、水压表2', valName: '管道水压', duration: '10min', condition: '小于', threshold: '0.3', unit: 'MPa', status: '启用' },
    { id: 'evt-5', name: '门禁超时', subsystem: '门禁系统', deviceType: '门禁读卡器', monitorDev: '读卡器1、读卡器2', valName: '通行时长', duration: '2min', condition: '大于', threshold: '60', unit: 's', status: '启用' },
    { id: 'evt-6', name: '摄像头离线', subsystem: '视频监控', deviceType: '高清摄像机', monitorDev: '摄像头1、摄像头2', valName: '丢包率', duration: '15min', condition: '大于', threshold: '5', unit: '%', status: '启用' },
    { id: 'evt-7', name: '变压器过载', subsystem: '变配电', deviceType: '高压柜', monitorDev: '高压柜1、高压柜2', valName: '负载率', duration: '30min', condition: '大于', threshold: '90', unit: '%', status: '启用' },
    { id: 'evt-8', name: '湿度超标', subsystem: '环境监测', deviceType: '温湿度传感器', monitorDev: '传感器1、传感器2', valName: '湿度值', duration: '3min', condition: '大于', threshold: '80', unit: '%', status: '停用' },
    { id: 'evt-9', name: '光照不足', subsystem: '智慧照明', deviceType: '光感探头', monitorDev: '探头1、探头2', valName: '光照度', duration: '0min', condition: '小于', threshold: '20', unit: 'Lux', status: '停用' },
    { id: 'evt-10', name: '风机过热', subsystem: '暖通空调', deviceType: '风机箱', monitorDev: '风机1、风机2', valName: '转速值', duration: '8min', condition: '大于', threshold: '1500', unit: 'RPM', status: '启用' }
  ]);

  const [isAddEventModal, setIsAddEventModal] = useState(false);
  const [isEditEventModal, setIsEditEventModal] = useState(false);
  const [activeEditingEventId, setActiveEditingEventId] = useState<string | null>(null);
  const [formEventName, setFormEventName] = useState('');
  const [formEventDesc, setFormEventDesc] = useState('');
  const [formEventSub, setFormEventSub] = useState('视频监控');
  const [formEventDevType, setFormEventDevType] = useState('摄像头');
  const [formEventValName, setFormEventValName] = useState('上月能耗');
  const [formEventCondition, setFormEventCondition] = useState('大于');
  const [formEventThreshold, setFormEventThreshold] = useState('');
  const [formEventMonitorDev, setFormEventMonitorDev] = useState('监测设备1');
  const [formEventDuration, setFormEventDuration] = useState('0min');
  const [formEventUnit, setFormEventUnit] = useState('kWh');
  const [formEventStatus, setFormEventStatus] = useState('启用');
  const [formEventDevices, setFormEventDevices] = useState([
    { id: 'md-1', subsystem: '远程抄表', deviceType: '电表', brandModel: '大华', devNo: '123124', location: '1栋1楼', selected: false },
    { id: 'md-2', subsystem: '远程抄表', deviceType: '电表', brandModel: '大华', devNo: '321414', location: '1栋1楼', selected: false },
    { id: 'md-3', subsystem: '远程抄表', deviceType: '电表', brandModel: '大华', devNo: '12312414', location: '1栋1楼', selected: false },
  ]);
  const [selectAllDevices, setSelectAllDevices] = useState(false);
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetType, setDeleteTargetType] = useState<'device' | 'event'>('event');

  // ================= 4. 告警管理 -> 告警设置 =================
  const [activeAlarmSetting, setActiveAlarmSetting] = useState<string>('人员黑名单告警');
  const [alarmTreeExpanded, setAlarmTreeExpanded] = useState<Record<string, boolean>>({
    '安防告警': true,
    '设备告警': true,
    '环境告警': true,
    '能耗告警': true,
    '业务告警': true
  });
  const [alarmStartTime, setAlarmStartTime] = useState('9:00');
  const [alarmEndTime, setAlarmEndTime] = useState('23:00');
  const [alarmNotifyMode, setAlarmNotifyMode] = useState('消息提示');
  const [alarmDesc, setAlarmDesc] = useState('请结合视频监控与门禁系统联动实时核查人员出入合规性');
  const [alarmEvents, setAlarmEvents] = useState([
    { id: 'ae-1', name: '视频监控人员黑名单', subsystem: '视频监控', deviceType: '安防摄像头', monitorVal: '告警值', desc: '抓拍到黑名单库中人员出没', selected: false },
    { id: 'ae-2', name: '门禁人员黑名单', subsystem: '门禁系统', deviceType: '门禁控制器', monitorVal: '告警值', desc: '黑名单人员刷卡尝试通行', selected: false },
    { id: 'ae-3', name: '周界红外对射报警', subsystem: '防盗告警', deviceType: '红外对射器', monitorVal: '阻断值', desc: '周界红外对射光束被遮挡', selected: false },
    { id: 'ae-4', name: '人脸抓拍比对告警', subsystem: '视频监控', deviceType: 'AI抓拍摄像机', monitorVal: '相似度', desc: '人脸比对相似度超过阈值', selected: false },
    { id: 'ae-5', name: '访客越权通行告警', subsystem: '门禁系统', deviceType: '门禁闸机', monitorVal: '通行状态', desc: '访客尝试进入非授权核心区域', selected: false },
    { id: 'ae-6', name: '出入口道闸强行抬杆', subsystem: '停车场系统', deviceType: '车牌抓拍机', monitorVal: '状态值', desc: '道闸未授权开杆触发报警', selected: false },
    { id: 'ae-7', name: '消防通道违停报警', subsystem: '停车场系统', deviceType: '违停抓相机', monitorVal: '停车时长', desc: '消防通道内车辆停留超过5分钟', selected: false },
    { id: 'ae-8', name: '夜间未授权滞留报警', subsystem: '视频监控', deviceType: '全景球机', monitorVal: '移动侦测', desc: '闭馆后办公区域检测到人员活动', selected: false },
    { id: 'ae-9', name: '高空抛物AI监测告警', subsystem: '视频监控', deviceType: '高空抛物相机', monitorVal: '轨迹异常', desc: '大楼外立面检测到抛物轨迹', selected: false },
    { id: 'ae-10', name: '重点区域防尾随告警', subsystem: '门禁系统', deviceType: '防尾随闸机', monitorVal: '人数统计', desc: '单次刷卡通过多人触发告警', selected: false },
  ]);
  const [alarmSelectAllEvents, setAlarmSelectAllEvents] = useState(false);
  const [alarmSettingPage, setAlarmSettingPage] = useState(1);
  const alarmSettingPageSize = 10;

  // ================= 5. 告警管理 -> 联动设置 =================
  const [linkageSearchKeyword, setLinkageSearchKeyword] = useState('');
  const [linkageCurrentPage, setLinkageCurrentPage] = useState(1);
  const linkagePageSize = 10;
  const [isAddLinkageModalOpen, setIsAddLinkageModalOpen] = useState(false);
  const [formLinkName, setFormLinkName] = useState('');
  const [formLinkSubsystem, setFormLinkSubsystem] = useState('环境监测');
  const [formLinkDevType, setFormLinkDevType] = useState('感应器');
  const [formLinkMonitorDev, setFormLinkMonitorDev] = useState('感应器1');
  const [formLinkEventName, setFormLinkEventName] = useState('高温事件');
  const [formLinkAlarmType, setFormLinkAlarmType] = useState('温度告警');
  const [formLinkValName, setFormLinkValName] = useState('温度');
  const [formLinkDuration, setFormLinkDuration] = useState('5min');
  const [formLinkCondition, setFormLinkCondition] = useState('大于');
  const [formLinkThreshold, setFormLinkThreshold] = useState('36°C');

  // Delete Confirmation Dialog state
  const [deleteConfirmConfig, setDeleteConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Linkage Setting Modal (Matching screenshot image.png)
  const [isLinkageDeviceModalOpen, setIsLinkageDeviceModalOpen] = useState(false);
  const [activeLinkageStrategy, setActiveLinkageStrategy] = useState<any>(null);
  const [linkageStrategyEnabled, setLinkageStrategyEnabled] = useState(true);
  const [linkageDevicesSubTable, setLinkageDevicesSubTable] = useState([
    { id: 'ldev-1', subsystem: '空调系统', deviceType: 'VAV', brandModel: '海尔', devNo: 'HJ001', location: '1栋1楼', actionText: '设置', selected: false },
    { id: 'ldev-2', subsystem: '空调系统', deviceType: 'VAV', brandModel: '海尔', devNo: 'HJ001', location: '1栋1楼', actionText: '【开】【25℃】', selected: false },
  ]);
  const [linkageModalSelectAll, setLinkageModalSelectAll] = useState(false);
  const [linkageModalPage, setLinkageModalPage] = useState(1);

  // Sub-modal for adding linkage device inside strategy
  const [isAddLinkageDevSubModal, setIsAddLinkageDevSubModal] = useState(false);
  const [formSubLinkSys, setFormSubLinkSys] = useState('空调系统');
  const [formSubLinkDevType, setFormSubLinkDevType] = useState('VAV');
  const [formSubLinkBrand, setFormSubLinkBrand] = useState('海尔');
  const [formSubLinkDevNo, setFormSubLinkDevNo] = useState('HJ003');
  const [formSubLinkLoc, setFormSubLinkLoc] = useState('1栋2楼');
  const [formSubLinkAction, setFormSubLinkAction] = useState('【开】【25℃】');

  // Sub-modal for configuring row linkage action
  const [isActionSettingModalOpen, setIsActionSettingModalOpen] = useState(false);
  const [activeActionDevId, setActiveActionDevId] = useState<string | null>(null);
  const [actionPowerState, setActionPowerState] = useState<'开' | '关'>('开');
  const [actionTemp, setActionTemp] = useState('25℃');

  const [linkageConfigs, setLinkageConfigs] = useState([
    { id: 'lnk-1', name: '空调联动01', subsystem: '环境监测', deviceType: '感应器', monitorDev: '感应器1', alarmType: '温度告警', eventName: '高温事件', valName: '温度', duration: '5min', condition: '大于', threshold: '36', unit: '°C', status: '启用', isEnabled: true },
    { id: 'lnk-2', name: '空调联动02', subsystem: '环境监测', deviceType: '感应器', monitorDev: '感应器2', alarmType: '温度告警', eventName: '低温事件', valName: '温度', duration: '5min', condition: '小于', threshold: '6', unit: '°C', status: '启用', isEnabled: true },
    { id: 'lnk-3', name: '消防烟感联动报警闭环', subsystem: '消防系统', deviceType: '烟感探测器', monitorDev: '烟感1', alarmType: '消防告警', eventName: '烟雾超标', valName: '浓度', duration: '1min', condition: '大于', threshold: '50', unit: 'ppm', status: '启用', isEnabled: true },
    { id: 'lnk-4', name: '黑名单人脸抓拍告警联动', subsystem: '视频监控', deviceType: '安防摄像头', monitorDev: '摄像头1', alarmType: '安防告警', eventName: '黑名单抓拍', valName: '相似度', duration: '0min', condition: '大于', threshold: '90', unit: '%', status: '启用', isEnabled: true },
    { id: 'lnk-5', name: '机房过温紧急调冷联动', subsystem: '暖通空调', deviceType: '温湿度传感器', monitorDev: '传感器1', alarmType: '环境告警', eventName: '机房高温', valName: '温度', duration: '3min', condition: '大于', threshold: '32', unit: '°C', status: '启用', isEnabled: true },
    { id: 'lnk-6', name: '水泵超压泄压联动', subsystem: '给排水', deviceType: '压力表', monitorDev: '水压表1', alarmType: '压力告警', eventName: '管道超压', valName: '水压', duration: '2min', condition: '大于', threshold: '1.2', unit: 'MPa', status: '启用', isEnabled: true },
    { id: 'lnk-7', name: '夜间公区照明节能关断', subsystem: '智慧照明', deviceType: '智能电表', monitorDev: '电表1', alarmType: '能耗告警', eventName: '能耗超标', valName: '电耗', duration: '10min', condition: '大于', threshold: '100', unit: 'kWh', status: '启用', isEnabled: true },
    { id: 'lnk-8', name: '周界红外对射防区联动', subsystem: '防盗告警', deviceType: '红外对射器', monitorDev: '对射1', alarmType: '周界告警', eventName: '红外遮挡', valName: '阻断值', duration: '0min', condition: '等于', threshold: '1', unit: '次', status: '启用', isEnabled: true },
    { id: 'lnk-9', name: '车库CO超标排风联动', subsystem: '环境监测', deviceType: '空气质量检测仪', monitorDev: '检测仪1', alarmType: '空气质量', eventName: 'CO超标', valName: '浓度', duration: '5min', condition: '大于', threshold: '30', unit: 'ppm', status: '启用', isEnabled: true },
    { id: 'lnk-10', name: '高位水箱溢水预警联动', subsystem: '给排水', deviceType: '超声波液位计', monitorDev: '液位计1', alarmType: '液位告警', eventName: '高位溢水', valName: '水位', duration: '3min', condition: '大于', threshold: '3.8', unit: 'm', status: '启用', isEnabled: true },
  ]);

  // ================= 6. 人员配置 -> 部门管理 (Matching screenshot image_ea2ff334.png) =================
  const [departmentList, setDepartmentList] = useState([
    { id: 'd-1', name: '工程部', manager: '刘卫军', func: '负责园区工程维修', phone: '13242772221', count: 12, location: '1栋1层103' },
    { id: 'd-2', name: '工程一队', manager: '刘卫军', func: '负责BA设备运维', phone: '13898912334', count: 7, location: '1栋1层103' },
    { id: 'd-3', name: '安保部', manager: '张小明', func: '负责园区安全管理', phone: '13568844566', count: 8, location: '1栋1层104' },
    { id: 'd-4', name: '安保二队', manager: '李大军', func: '负责园区消防安全', phone: '132567894467', count: 4, location: '1栋1层104' },
    { id: 'd-5', name: '调度指挥中心', manager: '张工', func: '负责全局IBMS应急指挥与派单', phone: '13911223344', count: 15, location: '2栋3层301' },
    { id: 'd-6', name: '暖通维保工程队', manager: '陈工', func: '负责冷热源主机与空调保养', phone: '13822334455', count: 10, location: '1栋1层105' },
    { id: 'd-7', name: '变配电工程组', manager: '赵工', func: '负责高低压配电与电力变压器', phone: '13733445566', count: 8, location: '地下1层B102' },
    { id: 'd-8', name: '给排水维保组', manager: '王工', func: '负责给排水管道与水箱检测', phone: '13644556677', count: 6, location: '地下1层B105' },
    { id: 'd-9', name: '综合能耗优化组', manager: '周工', func: '负责能耗分项计量与碳排统计', phone: '13555667788', count: 5, location: '2栋2层208' },
    { id: 'd-10', name: '环境与保洁组', manager: '孙主管', func: '负责公共区域卫生与垃圾分类', phone: '13466778899', count: 20, location: '1栋1层101' },
    { id: 'd-11', name: '弱电智能化运维队', manager: '钱工', func: '负责传感器门禁与网络设备', phone: '13377889900', count: 9, location: '2栋3层302' },
    { id: 'd-12', name: '行政综合后勤部', manager: '吴经理', func: '负责园区后勤保障与会务支持', phone: '13288990011', count: 11, location: '2栋1层102' },
  ]);

  const [deptCurrentPage, setDeptCurrentPage] = useState(1);
  const deptPageSize = 10;

  // Department Modal State
  const [isAddDeptModal, setIsAddDeptModal] = useState(false);
  const [isEditDeptModal, setIsEditDeptModal] = useState(false);
  const [activeEditingDeptId, setActiveEditingDeptId] = useState<string | null>(null);

  const [formDeptName, setFormDeptName] = useState('');
  const [formDeptManager, setFormDeptManager] = useState('');
  const [formDeptFunc, setFormDeptFunc] = useState('');
  const [formDeptPhone, setFormDeptPhone] = useState('');
  const [formDeptCount, setFormDeptCount] = useState<number | string>(10);
  const [formDeptLocation, setFormDeptLocation] = useState('');

  // ================= 7. 人员配置 -> 人员列表 (Matching image_25d217e6.png & image_86668fec.png) =================
  interface StaffRecord {
    id: string;
    name: string;
    avatar: string;
    dept: string;
    gender: '男' | '女';
    idCard: string;
    phone: string;
    status: '在职' | '离职';
    enablePhoneLogin: '启用' | '禁止';
    password?: string;
  }

  const [staffDataList, setStaffDataList] = useState<StaffRecord[]>([
    { id: 'stf-1', name: '刘卫军', avatar: '/assets/images/chinese_man1.jpg', dept: '工程部', gender: '男', idCard: '430423198503038231', phone: '13242772221', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-2', name: '刘卫军', avatar: '/assets/images/chinese_man2.jpg', dept: '工程部', gender: '男', idCard: '430423198803128232', phone: '13823167888', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-3', name: '张小明', avatar: '/assets/images/chinese_man3.jpg', dept: '安保部', gender: '男', idCard: '431423198707058231', phone: '12567567988', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-4', name: '李大军', avatar: '/assets/images/chinese_man4.jpg', dept: '安保部', gender: '男', idCard: '431423199701057233', phone: '13111567985', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-5', name: '张工', avatar: '/assets/images/chinese_man1.jpg', dept: '调度指挥中心', gender: '男', idCard: '430423198605151234', phone: '13911223344', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-6', name: '王燕', avatar: '/assets/images/chinese_woman1.jpg', dept: '行政综合后勤部', gender: '女', idCard: '430423199208203344', phone: '13822334455', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-7', name: '陈志强', avatar: '/assets/images/chinese_man2.jpg', dept: '工程部', gender: '男', idCard: '430423198911124455', phone: '13733445566', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-8', name: '赵金花', avatar: '/assets/images/chinese_woman2.jpg', dept: '工程部', gender: '女', idCard: '430423199403065566', phone: '13644556677', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-9', name: '周明', avatar: '/assets/images/chinese_man3.jpg', dept: '工程部', gender: '男', idCard: '430423198307186677', phone: '13555667788', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-10', name: '孙立新', avatar: '/assets/images/chinese_man4.jpg', dept: '工程部', gender: '男', idCard: '430423199009097788', phone: '13466778899', status: '离职', enablePhoneLogin: '禁止', password: '******' },
    { id: 'stf-11', name: '钱文波', avatar: '/assets/images/chinese_man1.jpg', dept: '安保部', gender: '男', idCard: '430423198712258899', phone: '13377889900', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-12', name: '吴丽', avatar: '/assets/images/chinese_woman3.jpg', dept: '安保部', gender: '女', idCard: '430423199504149900', phone: '13288990011', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-13', name: '郑海清', avatar: '/assets/images/chinese_man2.jpg', dept: '工程一队', gender: '男', idCard: '430423198805201122', phone: '13811223344', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-14', name: '冯秀兰', avatar: '/assets/images/chinese_woman1.jpg', dept: '行政综合后勤部', gender: '女', idCard: '430423199307152233', phone: '13722334455', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-15', name: '陈建国', avatar: '/assets/images/chinese_man3.jpg', dept: '暖通维保工程队', gender: '男', idCard: '430423198402103344', phone: '13633445566', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-16', name: '褚梅美', avatar: '/assets/images/chinese_woman2.jpg', dept: '调度指挥中心', gender: '女', idCard: '430423199609184455', phone: '13544556677', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-17', name: '卫宏伟', avatar: '/assets/images/chinese_man4.jpg', dept: '变配电工程组', gender: '男', idCard: '430423198211255566', phone: '13455667788', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-18', name: '蒋丽华', avatar: '/assets/images/chinese_woman3.jpg', dept: '安保二队', gender: '女', idCard: '430423199104086677', phone: '13366778899', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-19', name: '沈长青', avatar: '/assets/images/chinese_man1.jpg', dept: '工程一队', gender: '男', idCard: '430423198908307788', phone: '13277889900', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-20', name: '韩雪', avatar: '/assets/images/chinese_woman1.jpg', dept: '行政综合后勤部', gender: '女', idCard: '430423199412128899', phone: '13188990011', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-21', name: '杨光耀', avatar: '/assets/images/chinese_man2.jpg', dept: '安保二队', gender: '男', idCard: '430423198606069900', phone: '13099001122', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-22', name: '朱胜强', avatar: '/assets/images/chinese_man3.jpg', dept: '暖通维保工程队', gender: '男', idCard: '430423199010201011', phone: '13900112233', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-23', name: '秦红霞', avatar: '/assets/images/chinese_woman2.jpg', dept: '变配电工程组', gender: '女', idCard: '430423199301152122', phone: '13811223355', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-24', name: '尤勇', avatar: '/assets/images/chinese_man4.jpg', dept: '调度指挥中心', gender: '男', idCard: '430423198703223233', phone: '13722334466', status: '在职', enablePhoneLogin: '启用', password: '******' },
    { id: 'stf-25', name: '许天明', avatar: '/assets/images/chinese_man1.jpg', dept: '工程部', gender: '男', idCard: '430423198509104344', phone: '13633445577', status: '在职', enablePhoneLogin: '启用', password: '******' },
  ]);

  // Query state for Staff
  const [staffSearchDept, setStaffSearchDept] = useState('全部');
  const [staffSearchGender, setStaffSearchGender] = useState('全部');
  const [staffSearchName, setStaffSearchName] = useState('');
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const staffPageSize = 10;

  // Modal State for Staff
  const [isAddStaffModal, setIsAddStaffModal] = useState(false);
  const [isEditStaffModal, setIsEditStaffModal] = useState(false);
  const [activeEditingStaffId, setActiveEditingStaffId] = useState<string | null>(null);

  // Form State for Staff (Matching image_86668fec.png)
  const [formStaffName, setFormStaffName] = useState('');
  const [formStaffGender, setFormStaffGender] = useState<'男' | '女'>('男');
  const [formStaffStatus, setFormStaffStatus] = useState<'在职' | '离职'>('在职');
  const [formStaffAvatar, setFormStaffAvatar] = useState('/assets/images/chinese_man1.jpg');
  const [formStaffDept, setFormStaffDept] = useState('工程部');
  const [formStaffIdCard, setFormStaffIdCard] = useState('');
  const [formStaffPhone, setFormStaffPhone] = useState('');
  const [formStaffEnableLogin, setFormStaffEnableLogin] = useState<'启用' | '禁止'>('启用');
  const [formStaffPassword, setFormStaffPassword] = useState('');

  // ================= 8. 权限管理 -> 角色管理 (Matching screenshots image_446d4234.png, image_4571b28e.png, image_42aed876.png) =================
  interface RoleUserItem {
    id: string;
    name: string;
    account: string;
    dept: string;
  }

  interface RoleRecord {
    id: string;
    name: string;
    desc: string;
    createTime: string;
    status: '启用' | '停用';
    permissions: string[];
    boundUsers: RoleUserItem[];
  }

  const [rolesDataList, setRolesDataList] = useState<RoleRecord[]>([
    {
      id: 'rol-1',
      name: '超级系统管理员',
      desc: '管理系统基面设置',
      createTime: '2026-11-05 16:00:09',
      status: '启用',
      permissions: ['园区首页', '设备管理', '人流数据', '车流数据', '能耗数据', '环境数据', '安全数据', '空间数据', '3D楼宇地图', '设备布点编辑', '图层开关', '空调自控', '照明策略', '变配电监测', '设备台账', '工单派发', '巡检计划', '实时告警', '告警配置', '联动规则'],
      boundUsers: [
        { id: 'usr-1', name: '李小光', account: '13242772221', dept: '工程部' },
        { id: 'usr-2', name: '赵大牛', account: '1378965478', dept: '工程部' },
        { id: 'usr-3', name: '陈伟中', account: '1316863556', dept: '工程部' },
      ]
    },
    {
      id: 'rol-2',
      name: '园区管理员',
      desc: '园区业务管理，权限管理',
      createTime: '2026-11-06 16:10:09',
      status: '启用',
      permissions: ['园区首页', '设备管理', '人流数据', '车流数据', '能耗数据', '环境数据', '安全数据', '空间数据', '3D楼宇地图', '设备台账', '巡检计划', '实时告警'],
      boundUsers: [
        { id: 'usr-4', name: '张小明', account: '13568844566', dept: '安保部' },
        { id: 'usr-5', name: '刘卫军', account: '13898912334', dept: '工程部' },
      ]
    },
    {
      id: 'rol-3',
      name: '工程管理员',
      desc: '工程业务管理',
      createTime: '2026-11-06 13:00:09',
      status: '启用',
      permissions: ['园区首页', '设备管理', '能耗数据', '空调自控', '照明策略', '变配电监测', '设备台账', '工单派发', '巡检计划'],
      boundUsers: [
        { id: 'usr-6', name: '陈工', account: '13822334455', dept: '暖通维保工程队' },
        { id: 'usr-7', name: '赵工', account: '13733445566', dept: '变配电工程组' },
      ]
    },
    {
      id: 'rol-4',
      name: '安保管理员',
      desc: '安保业务管理',
      createTime: '2026-11-07 12:10:01',
      status: '启用',
      permissions: ['园区首页', '人流数据', '车流数据', '安全数据', '实时告警', '告警配置', '联动规则'],
      boundUsers: [
        { id: 'usr-8', name: '李大军', account: '132567894467', dept: '安保二队' },
      ]
    },
    {
      id: 'rol-5',
      name: '普通用户',
      desc: '查看权限',
      createTime: '2026-11-07 11:10:01',
      status: '启用',
      permissions: ['园区首页', '设备管理', '人流数据', '环境数据'],
      boundUsers: [
        { id: 'usr-9', name: '吴经理', account: '13288990011', dept: '行政综合后勤部' },
      ]
    },
    {
      id: 'rol-6',
      name: '消防急救调度员',
      desc: '消防告警响应与派单指挥',
      createTime: '2026-11-07 10:15:30',
      status: '启用',
      permissions: ['园区首页', '安全数据', '实时告警', '工单派发'],
      boundUsers: []
    },
    {
      id: 'rol-7',
      name: '暖通机电专员',
      desc: 'BA风机冷机远程反控与预警',
      createTime: '2026-11-07 09:40:12',
      status: '启用',
      permissions: ['设备管理', '能耗数据', '空调自控', '设备台账'],
      boundUsers: []
    },
    {
      id: 'rol-8',
      name: '综合能效分析师',
      desc: '园区分项能耗计费与碳足迹',
      createTime: '2026-11-07 08:30:00',
      status: '启用',
      permissions: ['园区首页', '能耗数据'],
      boundUsers: []
    },
    {
      id: 'rol-9',
      name: '停车场外包主管',
      desc: '车牌识别闸机放行与收费管理',
      createTime: '2026-11-06 18:20:45',
      status: '启用',
      permissions: ['车流数据', '安全数据'],
      boundUsers: []
    },
    {
      id: 'rol-10',
      name: '环境监测巡检员',
      desc: '空气质量温湿度传感器查看',
      createTime: '2026-11-06 17:10:10',
      status: '启用',
      permissions: ['环境数据', '巡检计划'],
      boundUsers: []
    },
    {
      id: 'rol-11',
      name: '访客门禁管理员',
      desc: '临时访客刷脸授权与通道门禁',
      createTime: '2026-11-06 15:05:22',
      status: '启用',
      permissions: ['人流数据', '安全数据'],
      boundUsers: []
    },
    {
      id: 'rol-12',
      name: '系统只读审计员',
      desc: '操作日志与告警记录只读导出',
      createTime: '2026-11-05 14:00:00',
      status: '停用',
      permissions: ['园区首页'],
      boundUsers: []
    },
  ]);

  // Query & Pagination state for Roles
  const [roleSearchName, setRoleSearchName] = useState('');
  const [roleCurrentPage, setRoleCurrentPage] = useState(1);
  const rolePageSize = 10;

  // Add / Edit Role Modal State
  const [isAddRoleModal, setIsAddRoleModal] = useState(false);
  const [isEditRoleModal, setIsEditRoleModal] = useState(false);
  const [activeEditingRoleId, setActiveEditingRoleId] = useState<string | null>(null);
  const [formRoleName, setFormRoleName] = useState('');
  const [formRoleDesc, setFormRoleDesc] = useState('');
  const [formRoleStatus, setFormRoleStatus] = useState<'启用' | '停用'>('启用');

  // Permission Setting Modal State (Matching image_4571b28e.png)
  const [isPermSettingModalOpen, setIsPermSettingModalOpen] = useState(false);
  const [permActiveRole, setPermActiveRole] = useState<RoleRecord | null>(null);
  const [permPlatform, setPermPlatform] = useState('IBMS管理端');
  const [permSelectedKeys, setPermSelectedKeys] = useState<string[]>([]);
  const [permExpandedParents, setPermExpandedParents] = useState<Record<string, boolean>>({
    '园区首页': true,
    '图形化控制': false,
    '设备自控': false,
    '设备运维': false,
    '告警管理': false,
  });

  // Bind Users Modal State (Matching image_42aed876.png)
  const [isBindUsersModalOpen, setIsBindUsersModalOpen] = useState(false);
  const [bindUsersActiveRole, setBindUsersActiveRole] = useState<RoleRecord | null>(null);
  const [bindUserSearchName, setBindUserSearchName] = useState('');
  const [bindUsersPage, setBindUsersPage] = useState(1);
  const [isAddUserToRoleSubModal, setIsAddUserToRoleSubModal] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#030a1c] text-slate-100 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl bg-cyan-900/90 border border-cyan-500 text-cyan-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* LEFT NAVIGATION SIDEBAR MENU (系统管理 - 一级/二级菜单) */}
      <aside className="w-56 bg-[#06122d] border-r border-[#133063] p-3 space-y-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2 py-1 text-cyan-400 border-b border-[#133063] pb-2">
            <Settings className="w-4 h-4 text-cyan-300 animate-spin-slow" />
            <span className="font-bold text-xs text-cyan-200 tracking-wide">系统管理 (SYSTEM)</span>
          </div>

          <div className="space-y-1">
            {leftMenuTree.map((sec) => {
              const IconComp = sec.icon;
              const isExpanded = expandedSections[sec.title];
              const isParentActive = activeSecondary === sec.title;

              return (
                <div key={sec.title} className="space-y-0.5">
                  <button
                    onClick={() => {
                      toggleSection(sec.title);
                      setActiveSecondary(sec.title);
                      if (sec.submenus.length > 0 && !sec.submenus.includes(activeTertiary)) {
                        setActiveTertiary(sec.submenus[0]);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isParentActive
                        ? 'bg-[#0b2454] text-cyan-300 border border-cyan-500/40 shadow-inner'
                        : 'text-slate-300 hover:bg-[#081a3d] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className={`w-3.5 h-3.5 ${isParentActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{sec.title}</span>
                    </div>
                    {sec.submenus.length > 0 && (
                      isExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />
                    )}
                  </button>

                  {/* Submenu Items */}
                  {isExpanded && sec.submenus.length > 0 && (
                    <div className="pl-3 space-y-1 border-l-2 border-[#133063] ml-3 py-0.5">
                      {sec.submenus.map((sub) => {
                        const isActive = activeSecondary === sec.title && activeTertiary === sub;
                        return (
                          <button
                            key={sub}
                            onClick={() => {
                              setActiveSecondary(sec.title);
                              setActiveTertiary(sub);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-[#081a3d]/50'
                            }`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* System Info Footer */}
        <div className="p-2.5 bg-[#030a1c] border border-[#133063] rounded-xl text-[10px] font-mono text-slate-400 space-y-0.5">
          <div className="flex justify-between"><span>对应一级:</span><span className="text-cyan-300">系统管理</span></div>
          <div className="flex justify-between"><span>当前二级:</span><span className="text-cyan-300">{activeSecondary}</span></div>
          <div className="flex justify-between"><span>当前三级:</span><span className="text-white font-bold">{activeTertiary}</span></div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 p-5 overflow-y-auto space-y-4">
        
        {/* Top Breadcrumb Header */}
        <div className="flex justify-between items-center bg-[#06122d] border border-cyan-500/40 rounded-xl px-4 py-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span>系统管理</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-cyan-300">{activeSecondary}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white font-bold">{activeTertiary}</span>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>核心设备数据服务状态正常 | 近期无异常通信阻断</span>
          </div>
        </div>

        {/* ==================== 1. 设备管理 -> 设备列表 (匹配截图image_56d51a7a.png) ==================== */}
        {activeTertiary === '设备列表' && (
          <div className="flex gap-4 min-h-[680px]">
            
            {/* 页面左侧设备大类树 (Inner Left Device Category Tree Panel) */}
            <div className="w-48 bg-[#06122d] border border-cyan-500/40 rounded-xl p-3 shrink-0 space-y-2 text-xs">
              {deviceSubsystemTree.map((sys) => {
                const IconComponent = sys.icon;
                const isExpanded = expandedSubsystems[sys.subsystem];

                return (
                  <div key={sys.subsystem} className="space-y-1">
                    <button
                      onClick={() => toggleSubsystem(sys.subsystem)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-200 hover:bg-[#091e48] transition-all cursor-pointer font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{sys.subsystem}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                    </button>

                    {/* Children device categories */}
                    {isExpanded && (
                      <div className="pl-4 space-y-1">
                        {sys.categories.map((cat) => {
                          const isCatActive = activeDeviceCategory === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setActiveDeviceCategory(cat);
                                setCurrentPage(1);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                                isCatActive
                                  ? 'bg-cyan-600/30 text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#081b40]'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 页面右侧面板 (Header Tab, Stat Cards, Filter Toolbar & Device Table) */}
            <div className="flex-1 space-y-4">
              
              {/* Header category active tab label */}
              <div className="border-b border-cyan-500/30 pb-2 flex items-center justify-between">
                <div className="relative inline-block">
                  <h2 className="text-sm font-bold text-cyan-300 px-3 py-1 bg-cyan-950/40 rounded-t-lg border-b-2 border-cyan-400">
                    {activeDeviceCategory}
                  </h2>
                </div>
              </div>

              {/* 4 Circular Stat Cards matching screenshot image_56d51a7a.png */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1: Total Count */}
                <div className="p-3.5 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/40 to-blue-700/50 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center shrink-0">
                    <Camera className="w-6 h-6 text-cyan-200" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300 font-semibold">{activeDeviceCategory}总数</div>
                    <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1.5">
                      <span>{totalCount}</span>
                      <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                </div>

                {/* Stat 2: Online */}
                <div className="p-3.5 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/40 to-blue-700/50 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center shrink-0">
                    <Monitor className="w-6 h-6 text-cyan-200" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300 font-semibold">在线</div>
                    <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1.5">
                      <span>{onlineCount}</span>
                      <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                </div>

                {/* Stat 3: Offline */}
                <div className="p-3.5 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/40 to-blue-700/50 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center shrink-0">
                    <MonitorOff className="w-6 h-6 text-cyan-200" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300 font-semibold">离线</div>
                    <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1.5">
                      <span>{offlineCount}</span>
                      <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                </div>

                {/* Stat 4: Fault */}
                <div className="p-3.5 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/40 to-blue-700/50 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center shrink-0">
                    <Bell className="w-6 h-6 text-cyan-200" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300 font-semibold">故障</div>
                    <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1.5">
                      <span>{faultCount}</span>
                      <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Query & Filter Toolbar matching screenshot */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#06122d] border border-cyan-500/40 rounded-xl p-3 shadow-lg text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-cyan-300 font-bold mr-1">查询:</span>
                  
                  {/* Building Select */}
                  <select
                    value={selectedBuilding}
                    onChange={(e) => {
                      setSelectedBuilding(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-sans focus:outline-none focus:border-cyan-400 cursor-pointer min-w-[75px]"
                  >
                    <option value="全部">全部楼栋</option>
                    <option value="T1">T1</option>
                    <option value="T2">T2</option>
                    <option value="T3">T3</option>
                    <option value="B1">B1</option>
                  </select>

                  {/* Floor Select */}
                  <select
                    value={selectedFloor}
                    onChange={(e) => {
                      setSelectedFloor(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-sans focus:outline-none focus:border-cyan-400 cursor-pointer min-w-[75px]"
                  >
                    <option value="全部">全部楼层</option>
                    <option value="1F">1F</option>
                    <option value="2F">2F</option>
                    <option value="3F">3F</option>
                    <option value="B1">B1</option>
                  </select>

                  {/* Input Search Keyword */}
                  <div className="relative w-48">
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => {
                        setSearchKeyword(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="设备编号/设备名称"
                      className="w-full bg-[#030a1c] border border-[#1b448a] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-1.5 rounded-lg bg-[#071d47] border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-900/40 transition-all cursor-pointer"
                  >
                    重置
                  </button>
                </div>

                {/* Add Device Button */}
                <button
                  onClick={openAddModal}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between min-h-[420px]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                      <tr>
                        <th className="px-4 py-3 font-sans text-center w-12">序号</th>
                        <th className="px-4 py-3 font-sans">设备编号</th>
                        <th className="px-4 py-3 font-sans">设备名称</th>
                        <th className="px-3 py-3 font-sans">所在楼栋</th>
                        <th className="px-3 py-3 font-sans">所在楼层</th>
                        <th className="px-4 py-3 font-sans">设备位置</th>
                        <th className="px-4 py-3 font-sans">设备品牌</th>
                        <th className="px-4 py-3 font-sans">IP地址</th>
                        <th className="px-3 py-3 font-sans">设备状态</th>
                        <th className="px-4 py-3 text-center font-sans">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#133063]">
                      {paginatedDevices.length > 0 ? (
                        paginatedDevices.map((dev, idx) => (
                          <tr key={dev.id} className="hover:bg-[#081b42]/80 transition-colors">
                            <td className="px-4 py-3 text-center font-bold text-slate-300">
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>
                            <td className="px-4 py-3 text-slate-200">{dev.code}</td>
                            <td className="px-4 py-3 font-sans text-cyan-200 font-bold">{dev.name}</td>
                            <td className="px-3 py-3 font-sans text-slate-300">{dev.building}</td>
                            <td className="px-3 py-3 font-sans text-slate-300">{dev.floor}</td>
                            <td className="px-4 py-3 font-sans text-slate-300">{dev.location}</td>
                            <td className="px-4 py-3 font-sans text-slate-300">{dev.brand}</td>
                            <td className="px-4 py-3 text-slate-300">{dev.ip}</td>
                            <td className="px-3 py-3 font-sans">
                              <span className={`font-bold ${
                                dev.status === '在线' ? 'text-emerald-400' :
                                dev.status === '离线' ? 'text-slate-400' : 'text-amber-400'
                              }`}>
                                {dev.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-sans space-x-2">
                              <button
                                onClick={() => openEditModal(dev)}
                                className="px-3 py-1 rounded bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/50 font-bold transition-all cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => openDeleteModal(dev)}
                                className="px-3 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/50 font-bold transition-all cursor-pointer"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="px-4 py-12 text-center text-slate-500 font-sans">
                            暂无满足条件的设备点位记录
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer - 每页显示10条 */}
                <div className="p-3 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>共 <strong className="text-cyan-300">{filteredCategoryDevices.length}</strong> 条记录</span>
                    <span className="text-slate-600">|</span>
                    <span className="px-2 py-0.5 bg-[#081a3d] border border-[#1b448a] rounded text-slate-300 font-mono">
                      每页显示 10 条
                    </span>
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center gap-1 font-mono">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-2.5 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          currentPage === p
                            ? 'bg-cyan-600 text-white shadow'
                            : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-2.5 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== 2. 地图管理 -> 地图编辑 (Matching screenshot image_9e81fb95.png) ==================== */}
        {activeTertiary === '地图编辑' && (
          <div className="flex gap-4 min-h-[680px]">
            
            {/* INNER LEFT SIDEBAR: Floor Navigation Tree (1号楼 / 2号楼) */}
            <div className="w-48 bg-[#06122d] border border-cyan-500/40 rounded-xl p-3 shrink-0 space-y-2 text-xs">
              <div className="text-slate-300 font-bold text-xs pb-2 border-b border-[#133063] flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>建筑楼层结构</span>
              </div>

              <div className="space-y-1.5 pt-1">
                {[
                  { building: '1号楼', floors: ['1F', '2F', '3F'] },
                  { building: '2号楼', floors: ['1F', '2F', '3F', 'B1', 'B2'] },
                ].map((bld) => {
                  const isExpanded = expandedMapBuildings[bld.building];
                  return (
                    <div key={bld.building} className="space-y-1">
                      <button
                        onClick={() => setExpandedMapBuildings(prev => ({ ...prev, [bld.building]: !prev[bld.building] }))}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-200 hover:bg-[#091e48] transition-all cursor-pointer font-bold"
                      >
                        <span className="text-xs">{bld.building}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {/* Sub-floors */}
                      {isExpanded && (
                        <div className="pl-4 space-y-1 border-l border-[#133063] ml-2">
                          {bld.floors.map((flr) => {
                            const isActive = mapEditBuilding === bld.building && mapEditFloor === flr;
                            return (
                              <button
                                key={flr}
                                onClick={() => {
                                  setMapEditBuilding(bld.building);
                                  setMapEditFloor(flr);
                                  setSelectedMapFloor(`${bld.building}-${flr}`);
                                  triggerToast(`已切换至地图视角: ${bld.building} - ${flr}`);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-[#0b2454] text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#081a3d]/60'
                                }`}
                              >
                                {flr}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CENTER CANVAS AREA: 3D CAD Floor Plan View */}
            <div className="flex-1 bg-[#020713] border border-cyan-500/40 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl min-h-[620px]">
              
              {/* TOP-LEFT PREVIEW BOX & HELPER TIP (Matching screenshot image_9e81fb95.png) */}
              <div className="absolute top-4 left-4 z-20 space-y-1.5 max-w-sm">
                <div className="border border-dashed border-cyan-400/80 bg-[#06183a]/90 backdrop-blur-md rounded-lg p-2.5 inline-flex items-center gap-2 shadow-lg">
                  <div className="w-8 h-8 rounded bg-[#0e3a6c] border border-cyan-400/60 flex items-center justify-center text-cyan-300">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-cyan-200 font-bold font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
                    {activeLayoutDevice}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 bg-[#02091c]/80 backdrop-blur-xs px-2 py-1 rounded border border-[#133063]">
                  右侧选中设备后，拖动上方生成的设备图标至地图设备实际位置。
                </div>
              </div>

              {/* TOP-RIGHT FLOATING TOOLBAR STACK (Matching screenshot image_9e81fb95.png) */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button onClick={() => triggerToast('矢量图层模式已切换')} title="图层模式" className="w-9 h-9 rounded-lg bg-[#061838] border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 flex items-center justify-center shadow-lg cursor-pointer">
                  <Image className="w-4 h-4" />
                </button>
                <button onClick={() => triggerToast('进入平移抓取模式')} title="平移模式" className="w-9 h-9 rounded-lg bg-[#061838] border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 flex items-center justify-center shadow-lg cursor-pointer">
                  <Move className="w-4 h-4" />
                </button>
                <button onClick={() => triggerToast('放大地图画布')} title="放大" className="w-9 h-9 rounded-lg bg-[#061838] border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 flex items-center justify-center shadow-lg cursor-pointer">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={() => triggerToast('缩小地图画布')} title="缩小" className="w-9 h-9 rounded-lg bg-[#061838] border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 flex items-center justify-center shadow-lg cursor-pointer">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const currentKey = `${mapEditBuilding}-${mapEditFloor}`;
                    setFloorDeviceMap(prev => ({
                      ...prev,
                      [currentKey]: prev[currentKey]?.map(cat => ({ ...cat, items: [] })) || []
                    }));
                    triggerToast(`已重置【${mapEditBuilding} - ${mapEditFloor}】设备布点位置`);
                  }} 
                  title="清空布点" 
                  className="w-9 h-9 rounded-lg bg-[#061838] border border-red-500/50 hover:bg-red-900/60 text-red-400 flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* CENTER 3D ISOMETRIC FLOOR PLAN MODEL & DRAGGABLE PINS */}
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                  const currentKey = `${mapEditBuilding}-${mapEditFloor}`;
                  
                  // Add or update position of activeLayoutDevice
                  setFloorDeviceMap(prev => {
                    const floorData = prev[currentKey] || [];
                    const updated = floorData.map(cat => {
                      const hasDev = cat.items.some(d => d.name === activeLayoutDevice);
                      if (hasDev) {
                        return {
                          ...cat,
                          items: cat.items.map(d => d.name === activeLayoutDevice ? { ...d, x, y, status: 'normal' as const } : d)
                        };
                      }
                      return cat;
                    });
                    return { ...prev, [currentKey]: updated };
                  });

                  triggerToast(`已成功打点将 [${activeLayoutDevice}] 部署至地图坐标: (${x}%, ${y}%)`);
                }}
                className="relative flex-1 w-full flex items-center justify-center my-4 cursor-crosshair group overflow-hidden"
              >
                {/* Background grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#133063_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-30" />

                {/* 3D Isometric CAD Floor Plan SVG Artwork matching screenshot image_9e81fb95.png */}
                <div className="relative w-full max-w-2xl aspect-[16/10] flex items-center justify-center">
                  
                  <svg className="w-full h-full drop-shadow-[0_0_35px_rgba(0,216,255,0.25)]" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Isometric Floor Slab */}
                    <path d="M 150 250 L 500 80 L 880 250 L 500 520 Z" fill="#0d1b3a" stroke="#00d8ff" strokeWidth="4" />
                    
                    {/* Interior Wall Partitions */}
                    <path d="M 280 220 L 500 120 L 720 220 L 500 320 Z" fill="#132752" stroke="#00a8e8" strokeWidth="2" />
                    <path d="M 220 280 L 350 220 L 480 280 L 350 340 Z" fill="#0f2044" stroke="#008bc5" strokeWidth="2" />
                    <path d="M 520 280 L 680 200 L 800 260 L 640 340 Z" fill="#0f2044" stroke="#008bc5" strokeWidth="2" />

                    {/* Parking Lanes & Bays */}
                    <path d="M 260 380 L 740 380" stroke="#facc15" strokeWidth="3" strokeDasharray="8 8" />
                    <path d="M 320 410 L 400 370 M 420 410 L 500 370 M 520 410 L 600 370 M 620 410 L 700 370" stroke="#00e5ff" strokeWidth="2" />

                    {/* Outer 3D Extrusion Depth Base */}
                    <path d="M 150 250 L 150 280 L 500 550 L 880 280 L 880 250 L 500 520 Z" fill="#06122c" stroke="#00a8e8" strokeWidth="2" opacity="0.8" />
                  </svg>

                  {/* Floor Label Watermark */}
                  <div className="absolute bottom-2 left-4 text-xs font-mono font-bold text-cyan-300/80 bg-[#06122d]/80 px-3 py-1 rounded border border-cyan-500/30">
                    【{mapEditBuilding} - {mapEditFloor}】 3D CAD 空间平面模型
                  </div>

                  {/* OVERLAY PINS FOR CURRENT FLOOR (Matching screenshot image_9e81fb95.png) */}
                  {(() => {
                    const currentKey = `${mapEditBuilding}-${mapEditFloor}`;
                    const categories = floorDeviceMap[currentKey] || [];
                    const allPins = categories.flatMap(c => c.items);

                    return allPins.map((pin) => (
                      <div
                        key={pin.id}
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveLayoutDevice(pin.name);
                          triggerToast(`当前高亮选中布点设备: ${pin.name}`);
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all cursor-pointer group flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-sans font-bold shadow-xl border ${
                          activeLayoutDevice === pin.name
                            ? 'bg-cyan-500 text-slate-950 border-white ring-4 ring-cyan-400/50 scale-110'
                            : pin.status === 'alert'
                            ? 'bg-red-900/90 text-red-200 border-red-400'
                            : 'bg-[#0092d8] text-white border-cyan-300 hover:scale-105'
                        }`}
                      >
                        <Camera className="w-3 h-3 text-cyan-100 shrink-0" />
                        <span className="whitespace-nowrap">{pin.name}</span>
                      </div>
                    ));
                  })()}

                </div>
              </div>

              {/* BOTTOM-RIGHT CANVAS SAVE BUTTON */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => triggerToast(`已成功保存【${mapEditBuilding} - ${mapEditFloor}】空间设备布点与位置坐标！`)}
                  className="px-6 py-2 rounded-lg bg-[#0d8a9e] hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  保存布点
                </button>
              </div>

            </div>

            {/* RIGHT SIDEBAR: "设备布点" (Matching screenshot image_9e81fb95.png) */}
            <div className="w-56 bg-[#06122d] border border-cyan-500/40 rounded-xl p-3 shrink-0 flex flex-col justify-between space-y-3 text-xs">
              
              <div className="space-y-3">
                {/* Header */}
                <div className="font-bold text-slate-100 text-xs pb-2 border-b border-[#133063] flex items-center justify-between">
                  <span>设备布点</span>
                  <span className="text-[10px] font-mono text-cyan-400">[{mapEditFloor}]</span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={mapSearchKeyword}
                    onChange={(e) => setMapSearchKeyword(e.target.value)}
                    placeholder="设备名称"
                    className="w-full bg-[#030a1c] border border-[#1b448a] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 pr-7"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                {/* Category List */}
                <div className="space-y-2 pt-1">
                  {(() => {
                    const currentKey = `${mapEditBuilding}-${mapEditFloor}`;
                    const categories = floorDeviceMap[currentKey] || [
                      {
                        category: '摄像头',
                        items: [
                          { id: 'c1', name: '摄像头1', status: 'normal', x: 50, y: 30 },
                          { id: 'c2', name: '摄像头02', status: 'normal', x: 23, y: 50 },
                          { id: 'c3', name: '摄像头03', status: 'alert', x: 48, y: 32 },
                          { id: 'c4', name: '摄像头04', status: 'alert', x: 51, y: 44 },
                        ]
                      },
                      { category: '人脸门禁', items: [{ id: 'm1', name: '人脸门禁01', status: 'normal', x: 40, y: 40 }] },
                      { category: '室内机', items: [{ id: 's1', name: '室内机01', status: 'normal', x: 60, y: 30 }] }
                    ];

                    return categories.map((cat) => {
                      const isExpanded = expandedDeviceCategories[cat.category] ?? true;
                      const filteredItems = cat.items.filter(i => !mapSearchKeyword || i.name.toLowerCase().includes(mapSearchKeyword.toLowerCase()));

                      return (
                        <div key={cat.category} className="space-y-1">
                          <button
                            onClick={() => setExpandedDeviceCategories(prev => ({ ...prev, [cat.category]: !prev[cat.category] }))}
                            className="w-full flex items-center justify-between px-2 py-1 rounded text-slate-300 hover:text-white transition-colors cursor-pointer font-bold"
                          >
                            <span className="text-xs">{cat.category}</span>
                            <span className="text-[10px] text-slate-400">
                              {isExpanded ? '▲' : '▼'}
                            </span>
                          </button>

                          {/* Category Items */}
                          {isExpanded && (
                            <div className="pl-2 space-y-1">
                              {filteredItems.map((item) => {
                                const isSelected = activeLayoutDevice === item.name;
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      setActiveLayoutDevice(item.name);
                                      triggerToast(`已选择布点设备: ${item.name}`);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all cursor-pointer block ${
                                      isSelected
                                        ? 'bg-[#0e3b6a] text-white font-bold border-l-2 border-cyan-400 shadow'
                                        : item.status === 'alert'
                                        ? 'text-red-400 font-semibold hover:bg-[#081a3d]/50'
                                        : 'text-slate-200 hover:bg-[#081a3d]/50'
                                    }`}
                                  >
                                    {item.name}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>

              </div>

              {/* Footer info */}
              <div className="pt-2 border-t border-[#133063] text-[10px] text-slate-400 space-y-0.5">
                <div className="flex justify-between"><span>当前建筑:</span><span className="text-cyan-300 font-bold">{mapEditBuilding}</span></div>
                <div className="flex justify-between"><span>当前楼层:</span><span className="text-cyan-300 font-bold">{mapEditFloor}</span></div>
                <div className="flex justify-between"><span>选中设备:</span><span className="text-white font-bold">{activeLayoutDevice}</span></div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 3. 告警管理 -> 事件管理 ==================== */}
        {activeTertiary === '事件管理' && (
          <div className="space-y-4">
            
            {/* Header category active tab label */}
            <div className="border-b border-cyan-500/30 pb-2 flex items-center justify-between">
              <div className="relative inline-block">
                <h2 className="text-sm font-bold text-cyan-300 px-3 py-1 bg-cyan-950/40 rounded-t-lg border-b-2 border-cyan-400">
                  事件管理
                </h2>
              </div>
            </div>

            {/* 3 Circular Stat Cards matching screenshot image_88df77f1.png */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Stat 1: Total Events */}
              <div className="p-3.5 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/40 to-blue-700/50 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center shrink-0">
                  <BellRing className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-300 font-semibold">事件总数</div>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1.5">
                    <span>{eventList.length}</span>
                    <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Stat 2: Enabled */}
              <div className="p-3.5 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/40 to-blue-700/50 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center shrink-0">
                  <Monitor className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-300 font-semibold">启用</div>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1.5">
                    <span>{eventList.filter(e => e.status === '启用').length}</span>
                    <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Stat 3: Disabled */}
              <div className="p-3.5 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/40 to-blue-700/50 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center shrink-0">
                  <MonitorOff className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-300 font-semibold">停用</div>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1.5">
                    <span>{eventList.filter(e => e.status === '停用').length}</span>
                    <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
              </div>

            </div>

            {/* Query & Filter Toolbar matching screenshot */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#06122d] border border-cyan-500/40 rounded-xl p-3 shadow-lg text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-cyan-300 font-bold mr-1">查询:</span>
                
                {/* Event Name Input */}
                <div className="relative w-56">
                  <input
                    type="text"
                    value={eventSearchKeyword}
                    onChange={(e) => {
                      setEventSearchKeyword(e.target.value);
                      setEventCurrentPage(1);
                    }}
                    placeholder="事件名称"
                    className="w-full bg-[#030a1c] border border-[#1b448a] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setEventSearchKeyword('');
                    setEventCurrentPage(1);
                    triggerToast('已重置查询条件');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#071d47] border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-900/40 transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              {/* Add Event Button */}
              <button
                onClick={() => {
                  setFormEventName('');
                  setFormEventDesc('');
                  setFormEventSub('视频监控');
                  setFormEventDevType('摄像头');
                  setFormEventValName('上月能耗');
                  setFormEventCondition('大于');
                  setFormEventThreshold('');
                  setFormEventStatus('启用');
                  setFormEventDevices([
                    { id: 'md-1', subsystem: '远程抄表', deviceType: '电表', brandModel: '大华', devNo: '123124', location: '1栋1楼', selected: false },
                    { id: 'md-2', subsystem: '远程抄表', deviceType: '电表', brandModel: '大华', devNo: '321414', location: '1栋1楼', selected: false },
                    { id: 'md-3', subsystem: '远程抄表', deviceType: '电表', brandModel: '大华', devNo: '12312414', location: '1栋1楼', selected: false },
                  ]);
                  setSelectAllDevices(false);
                  setIsAddEventModal(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            </div>

            {/* Data Table */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between min-h-[420px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-4 py-3 font-sans text-center w-12">序号</th>
                      <th className="px-4 py-3 font-sans">事件名称</th>
                      <th className="px-3 py-3 font-sans">子系统</th>
                      <th className="px-4 py-3 font-sans">设备类型</th>
                      <th className="px-4 py-3 font-sans">监测设备</th>
                      <th className="px-3 py-3 font-sans">值名称</th>
                      <th className="px-3 py-3 font-sans">持续时间</th>
                      <th className="px-3 py-3 font-sans">条件</th>
                      <th className="px-3 py-3 font-sans">阈值</th>
                      <th className="px-3 py-3 font-sans">单位</th>
                      <th className="px-3 py-3 font-sans">状态</th>
                      <th className="px-4 py-3 text-center font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {(() => {
                      const filtered = eventList.filter(e => {
                        if (eventSearchKeyword.trim() !== '' && !e.name.toLowerCase().includes(eventSearchKeyword.toLowerCase())) {
                          return false;
                        }
                        return true;
                      });
                      const paginated = filtered.slice((eventCurrentPage - 1) * eventPageSize, eventCurrentPage * eventPageSize);

                      if (paginated.length > 0) {
                        return paginated.map((evt, idx) => (
                          <tr key={evt.id} className="hover:bg-[#081b42]/80 transition-colors">
                            <td className="px-4 py-3 text-center font-bold text-slate-300">
                              {(eventCurrentPage - 1) * eventPageSize + idx + 1}
                            </td>
                            <td className="px-4 py-3 font-sans text-cyan-200 font-bold">{evt.name}</td>
                            <td className="px-3 py-3 font-sans text-slate-300">{evt.subsystem}</td>
                            <td className="px-4 py-3 font-sans text-slate-300">{evt.deviceType}</td>
                            <td className="px-4 py-3 font-sans text-slate-300">{evt.monitorDev}</td>
                            <td className="px-3 py-3 font-sans text-slate-300">{evt.valName}</td>
                            <td className="px-3 py-3 text-slate-300">{evt.duration}</td>
                            <td className="px-3 py-3 font-sans text-amber-300">{evt.condition}</td>
                            <td className="px-3 py-3 text-cyan-300 font-bold">{evt.threshold}</td>
                            <td className="px-3 py-3 text-slate-300">{evt.unit}</td>
                            <td className="px-3 py-3 font-sans">
                              <span className={`font-bold ${evt.status === '启用' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {evt.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-sans space-x-2">
                              <button
                                onClick={() => {
                                  setActiveEditingEventId(evt.id);
                                  setFormEventName(evt.name);
                                  setFormEventSub(evt.subsystem);
                                  setFormEventDevType(evt.deviceType);
                                  setFormEventMonitorDev(evt.monitorDev);
                                  setFormEventValName(evt.valName);
                                  setFormEventDuration(evt.duration);
                                  setFormEventCondition(evt.condition);
                                  setFormEventThreshold(evt.threshold);
                                  setFormEventUnit(evt.unit);
                                  setFormEventStatus(evt.status);
                                  setIsEditEventModal(true);
                                }}
                                className="px-3 py-1 rounded bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/50 font-bold transition-all cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirmConfig({
                                    isOpen: true,
                                    title: '确认删除事件规则',
                                    message: `确定要删除事件规则 [${evt.name}] 吗？删除后系统将不再监测该指标与触发报警。`,
                                    onConfirm: () => {
                                      setEventList(prev => prev.filter(item => item.id !== evt.id));
                                      triggerToast(`已成功删除事件规则: ${evt.name}`);
                                      setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                    }
                                  });
                                }}
                                className="px-3 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/50 font-bold transition-all cursor-pointer"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ));
                      } else {
                        return (
                          <tr>
                            <td colSpan={12} className="px-4 py-12 text-center text-slate-500 font-sans">
                              暂无满足条件的事件规则记录
                            </td>
                          </tr>
                        );
                      }
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer - 每页显示10条 */}
              <div className="p-3 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-slate-400">
                <div className="flex items-center gap-2">
                  <span>共 <strong className="text-cyan-300">{eventList.length}</strong> 条记录</span>
                  <span className="text-slate-600">|</span>
                  <span className="px-2 py-0.5 bg-[#081a3d] border border-[#1b448a] rounded text-slate-300 font-mono">
                    每页显示 10 条
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono">
                  <button
                    disabled={eventCurrentPage === 1}
                    onClick={() => setEventCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-2.5 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  
                  {Array.from({ length: Math.ceil(eventList.length / eventPageSize) || 1 }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setEventCurrentPage(p)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        eventCurrentPage === p
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={eventCurrentPage >= (Math.ceil(eventList.length / eventPageSize) || 1)}
                    onClick={() => setEventCurrentPage(prev => Math.min(prev + 1, Math.ceil(eventList.length / eventPageSize) || 1))}
                    className="px-2.5 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 4. 告警管理 -> 告警设置 ==================== */}
        {activeTertiary === '告警设置' && (
          <div className="flex gap-4 min-h-[680px]">
            
            {/* 页面左侧告警大类树 (In-page Left Alarm Category Tree Panel) */}
            <div className="w-52 bg-[#06122d] border border-cyan-500/40 rounded-xl p-3 shrink-0 space-y-2 text-xs">
              {[
                { group: '安防告警', alarms: ['人员黑名单告警', '车辆黑名单告警', '入侵告警', '周界告警', '消防告警', '液位告警'] },
                { group: '设备告警', alarms: ['故障告警', '离线告警', '异常告警'] },
                { group: '环境告警', alarms: ['温度告警', '湿度告警', '水浸告警', '水污染告警', '大气污染告警', '空气质量告警'] },
                { group: '能耗告警', alarms: ['能耗超标告警'] },
                { group: '业务告警', alarms: ['摊位越界告警', '资产越界告警', '车位占用告警', '停车压力告警'] }
              ].map((grp) => {
                const isGroupExpanded = alarmTreeExpanded[grp.group];
                return (
                  <div key={grp.group} className="space-y-1">
                    <button
                      onClick={() => setAlarmTreeExpanded(prev => ({ ...prev, [grp.group]: !prev[grp.group] }))}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-200 hover:bg-[#091e48] transition-all cursor-pointer font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{grp.group}</span>
                      </div>
                      {isGroupExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                    </button>

                    {isGroupExpanded && (
                      <div className="pl-4 space-y-1">
                        {grp.alarms.map((alm) => {
                          const isAlmActive = activeAlarmSetting === alm;
                          return (
                            <button
                              key={alm}
                              onClick={() => {
                                setActiveAlarmSetting(alm);
                                setAlarmSettingPage(1);
                                const configs: Record<string, any> = {
                                  '人员黑名单告警': { start: '9:00', end: '23:00', mode: '消息提示', desc: '请结合视频监控与门禁系统联动实时核查人员出入合规性', events: [
                                    { id: 'ae-1', name: '视频监控人员黑名单', subsystem: '视频监控', deviceType: '安防摄像头', monitorVal: '告警值', desc: '抓拍到黑名单库中人员出没', selected: false },
                                    { id: 'ae-2', name: '门禁人员黑名单', subsystem: '门禁系统', deviceType: '门禁控制器', monitorVal: '告警值', desc: '黑名单人员刷卡尝试通行', selected: false },
                                  ]},
                                  '车辆黑名单告警': { start: '0:00', end: '24:00', mode: '消息提示', desc: '车牌自动抓拍比对黑名单车辆并触发道闸拦截', events: [
                                    { id: 've-1', name: '东门车辆黑名单抓拍', subsystem: '停车场系统', deviceType: '车牌抓拍机', monitorVal: '车牌号比对', desc: '黑名单车辆尝试驶入园区', selected: false },
                                    { id: 've-2', name: '地库入口黑名单告警', subsystem: '停车场系统', deviceType: '抓拍一体机', monitorVal: '匹配度', desc: '地库入口识别到涉案车辆', selected: false },
                                  ]},
                                  '故障告警': { start: '0:00', end: '24:00', mode: '消息提示', desc: '监控机电设备运行状态，故障代码触发自动抢修派单', events: [
                                    { id: 'fe-1', name: '冷水机组压缩机故障', subsystem: '冷热源', deviceType: '冷水主机', monitorVal: '故障代码', desc: '压缩机排气温度过高过载跳闸', selected: false },
                                    { id: 'fe-2', name: '消防泵变频器过流', subsystem: '给排水', deviceType: '变频柜', monitorVal: '过流保护', desc: '消防水泵驱动器短路报警', selected: false },
                                    { id: 'fe-3', name: '高压开关柜SF6气压低', subsystem: '变配电', deviceType: '高压柜', monitorVal: '气压监测', desc: '10kV开关柜SF6微漏告警', selected: false },
                                  ]},
                                  '离线告警': { start: '0:00', end: '24:00', mode: '消息提示', desc: '实时监测物联网通信心跳，设备失联触发离线告警', events: [
                                    { id: 'ofe-1', name: '弱电间交换机离线', subsystem: '视频监控', deviceType: '核心交换机', monitorVal: '心跳丢包', desc: '设备连续丢包超过5分钟无响应', selected: false },
                                    { id: 'ofe-2', name: '物联网网关箱掉线', subsystem: '环境监测', deviceType: '网关通信箱', monitorVal: '离线状态', desc: '网关模块电源中断或光纤断开', selected: false },
                                  ]},
                                  '异常告警': { start: '0:00', end: '24:00', mode: '消息提示', desc: '基于预测性维护诊断设备运行偏离与健康度', events: [
                                    { id: 'abe-1', name: '循环泵轴承振动超标', subsystem: '冷热源', deviceType: '水泵', monitorVal: '振动速度', desc: '电机轴承磨损异响建议保养', selected: false },
                                    { id: 'abe-2', name: '变压器绕组温升偏高', subsystem: '变配电', deviceType: '干式变压器', monitorVal: '绕组温度', desc: '负荷偏高需注意散热', selected: false },
                                  ]},
                                  '温度告警': { start: '8:00', end: '20:00', mode: '消息提示', desc: '监控机房及办公区温湿度传感器超限预警', events: [
                                    { id: 'tme-1', name: '3F机房温度过高告警', subsystem: '环境监测', deviceType: '温湿度传感器', monitorVal: '环境温度', desc: '机房局部温度超过32°C上限', selected: false },
                                  ]},
                                  '能耗超标告警': { start: '0:00', end: '24:00', mode: '消息提示', desc: '对园区楼栋与分项计量电表进行能耗限额监测', events: [
                                    { id: 'ene-1', name: '地下车库照明能耗超标', subsystem: '智慧照明', deviceType: '智能电表', monitorVal: '实时功率', desc: 'B1照明回路用电量超出额定限额54%', selected: false },
                                  ]}
                                };
                                const cfg = configs[alm] || {
                                  start: '9:00',
                                  end: '22:00',
                                  mode: '消息提示',
                                  desc: `请对 [${alm}] 设定监控规则与联动响应参数`,
                                  events: [
                                    { id: `gen-${Date.now()}-1`, name: `${alm}监测点01`, subsystem: '综合管理', deviceType: '智能终端', monitorVal: '告警阈值', desc: `${alm}触发条件检查`, selected: false }
                                  ]
                                };
                                setAlarmStartTime(cfg.start);
                                setAlarmEndTime(cfg.end);
                                setAlarmNotifyMode(cfg.mode);
                                setAlarmDesc(cfg.desc);
                                setAlarmEvents(cfg.events);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                                isAlmActive
                                  ? 'bg-cyan-600/30 text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#081b40]'
                              }`}
                            >
                              {alm}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 页面右侧告警设置面板 (Right Configuration Panel matching screenshot) */}
            <div className="flex-1 bg-[#06122d] border border-cyan-500/40 rounded-xl p-5 shadow-2xl space-y-5 flex flex-col justify-between">
              
              <div className="space-y-5">
                {/* Header Title with Alarm Name */}
                <div className="flex items-center gap-3 border-b border-[#133063] pb-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-cyan-200">{activeAlarmSetting}</h3>
                </div>

                {/* Form Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  {/* Start & End Time */}
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-slate-300 font-semibold text-right">启用时间</label>
                    <div className="flex items-center gap-2 flex-1">
                      <input 
                        type="text" 
                        value={alarmStartTime}
                        onChange={(e) => setAlarmStartTime(e.target.value)}
                        className="w-24 px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white text-center font-mono focus:outline-none focus:border-cyan-400" 
                      />
                      <span className="text-slate-400">-</span>
                      <input 
                        type="text" 
                        value={alarmEndTime}
                        onChange={(e) => setAlarmEndTime(e.target.value)}
                        className="w-24 px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white text-center font-mono focus:outline-none focus:border-cyan-400" 
                      />
                    </div>
                  </div>

                  {/* Alarm Notification Mode */}
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-slate-300 font-semibold text-right">告警通知</label>
                    <div className="flex items-center gap-6 flex-1 px-2">
                      <label className="flex items-center gap-2 text-white cursor-pointer">
                        <input 
                          type="radio" 
                          name="alarmNotify" 
                          checked={alarmNotifyMode === '消息提示'} 
                          onChange={() => setAlarmNotifyMode('消息提示')}
                          className="text-cyan-500" 
                        />
                        <span>消息提示</span>
                      </label>
                      <label className="flex items-center gap-2 text-white cursor-pointer">
                        <input 
                          type="radio" 
                          name="alarmNotify" 
                          checked={alarmNotifyMode === '不提醒'} 
                          onChange={() => setAlarmNotifyMode('不提醒')}
                          className="text-cyan-500" 
                        />
                        <span>不提醒</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Alarm Description */}
                <div className="flex items-start gap-3 text-xs">
                  <label className="w-24 text-slate-300 font-semibold text-right pt-2">告警说明</label>
                  <textarea 
                    rows={2}
                    maxLength={100}
                    value={alarmDesc}
                    onChange={(e) => setAlarmDesc(e.target.value)}
                    placeholder="100字以内"
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none" 
                  />
                </div>

                {/* Monitor Events Action Bar */}
                <div className="flex items-center gap-3 text-xs">
                  <label className="w-24 text-slate-300 font-semibold text-right">监测事件</label>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const newEvt = {
                          id: `ae-${Date.now()}`,
                          name: `${activeAlarmSetting}监测项0${alarmEvents.length + 1}`,
                          subsystem: '视频监控',
                          deviceType: '高清摄像机',
                          monitorVal: '指标值',
                          desc: '自动生成的监测事件规则',
                          selected: false
                        };
                        setAlarmEvents([...alarmEvents, newEvt]);
                        triggerToast('成功添加监测事件规则');
                      }}
                      className="px-5 py-1.5 rounded-lg bg-[#071d47] hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 font-bold cursor-pointer"
                    >
                      添加
                    </button>
                    <button 
                      onClick={() => {
                        const hasSelected = alarmEvents.some(e => e.selected);
                        if (!hasSelected) {
                          triggerToast('请先勾选需要删除的监测事件！');
                          return;
                        }
                        setDeleteTargetType('device');
                        setDeleteTargetId(null);
                        setIsDeleteConfirmModal(true);
                      }}
                      className="px-5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-400 font-bold cursor-pointer"
                    >
                      删除
                    </button>
                  </div>
                </div>

                {/* Sub-table */}
                <div className="border border-[#133063] rounded-xl overflow-hidden bg-[#030a1c]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                      <tr>
                        <th className="px-4 py-3 font-sans text-center w-12">
                          <input 
                            type="checkbox" 
                            checked={alarmSelectAllEvents}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setAlarmSelectAllEvents(val);
                              setAlarmEvents(prev => prev.map(item => ({ ...item, selected: val })));
                            }}
                            className="text-cyan-500 cursor-pointer" 
                          />
                        </th>
                        <th className="px-4 py-3 font-sans">事件名称</th>
                        <th className="px-4 py-3 font-sans">子系统</th>
                        <th className="px-4 py-3 font-sans">设备类型</th>
                        <th className="px-4 py-3 font-sans">监测值</th>
                        <th className="px-4 py-3 font-sans">事件描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#133063]">
                      {alarmEvents.slice((alarmSettingPage - 1) * alarmSettingPageSize, alarmSettingPage * alarmSettingPageSize).map((item) => (
                        <tr key={item.id} className="hover:bg-[#081b42]/85 transition-colors">
                          <td className="px-4 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={item.selected}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setAlarmEvents(prev => prev.map(el => el.id === item.id ? { ...el, selected: val } : el));
                              }}
                              className="text-cyan-500 cursor-pointer" 
                            />
                          </td>
                          <td className="px-4 py-3 font-sans text-cyan-200 font-bold">{item.name}</td>
                          <td className="px-4 py-3 font-sans text-slate-300">{item.subsystem}</td>
                          <td className="px-4 py-3 font-sans text-slate-300">{item.deviceType}</td>
                          <td className="px-4 py-3 text-amber-300">{item.monitorVal}</td>
                          <td className="px-4 py-3 font-sans text-slate-300">{item.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer matching screenshot image_d01f6636.png */}
                <div className="flex items-center justify-end gap-1 pt-2 text-xs font-mono">
                  <button 
                    disabled={alarmSettingPage === 1}
                    onClick={() => setAlarmSettingPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1 bg-[#081b40] border border-[#133063] rounded text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer font-sans"
                  >
                    上一页
                  </button>
                  {[1, 2, 3, 4].map(p => (
                    <button
                      key={p}
                      onClick={() => setAlarmSettingPage(p)}
                      className={`px-3 py-1 rounded font-bold cursor-pointer ${
                        alarmSettingPage === p ? 'bg-cyan-600 text-white shadow' : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <span className="px-2 text-slate-500">...</span>
                  <button
                    onClick={() => setAlarmSettingPage(8)}
                    className={`px-3 py-1 rounded font-bold cursor-pointer ${
                      alarmSettingPage === 8 ? 'bg-cyan-600 text-white shadow' : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                    }`}
                  >
                    8
                  </button>
                  <button 
                    disabled={alarmSettingPage === 8}
                    onClick={() => setAlarmSettingPage(prev => Math.min(prev + 1, 8))}
                    className="px-3 py-1 bg-[#081b40] border border-[#133063] rounded text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer font-sans"
                  >
                    下一页
                  </button>
                </div>

              </div>

              {/* Bottom Actions: 取消 & 保存 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#133063]">
                <button 
                  onClick={() => triggerToast(`已取消对 [${activeAlarmSetting}] 的修改`)}
                  className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  取消
                </button>
                <button 
                  onClick={() => triggerToast(`成功保存 [${activeAlarmSetting}] 告警参数设置`)}
                  className="px-8 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  保存
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 5. 告警管理 -> 联动设置 ==================== */}
        {activeTertiary === '联动设置' && (
          <div className="space-y-4">
            
            {/* Top 3 Stat Cards matching screenshot image_87e4f464.png */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">联动策略总数</div>
                  <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">{linkageConfigs.length}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  <BellRing className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">启用</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{linkageConfigs.filter(l => l.isEnabled).length}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <Monitor className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#06122d] border border-cyan-500/40 shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-bold">停用</div>
                  <div className="text-2xl font-bold font-mono text-slate-400 mt-1">{linkageConfigs.filter(l => !l.isEnabled).length}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <MonitorOff className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Query & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#06122d] border border-cyan-500/40 rounded-xl p-3 shadow-lg text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-cyan-300 font-bold mr-1">查询:</span>
                <input
                  type="text"
                  value={linkageSearchKeyword}
                  onChange={(e) => {
                    setLinkageSearchKeyword(e.target.value);
                    setLinkageCurrentPage(1);
                  }}
                  placeholder="联动策略名称"
                  className="w-56 bg-[#030a1c] border border-[#1b448a] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => {
                    setLinkageSearchKeyword('');
                    setLinkageCurrentPage(1);
                    triggerToast('已重置联动策略查询条件');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#071d47] border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-900/40 transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <button
                onClick={() => {
                  setFormLinkName('');
                  setFormLinkSubsystem('环境监测');
                  setFormLinkDevType('感应器');
                  setFormLinkMonitorDev('感应器1');
                  setFormLinkEventName('高温事件');
                  setFormLinkAlarmType('温度告警');
                  setFormLinkValName('温度');
                  setFormLinkDuration('5min');
                  setFormLinkCondition('大于');
                  setFormLinkThreshold('36°C');
                  setIsAddLinkageModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            </div>

            {/* Table Area */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between min-h-[420px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-4 py-3 font-sans text-center w-12">序号</th>
                      <th className="px-4 py-3 font-sans">联动策略名称</th>
                      <th className="px-3 py-3 font-sans">子系统</th>
                      <th className="px-3 py-3 font-sans">设备类型</th>
                      <th className="px-3 py-3 font-sans">监测设备</th>
                      <th className="px-3 py-3 font-sans">告警类型</th>
                      <th className="px-3 py-3 font-sans">事件名称</th>
                      <th className="px-3 py-3 font-sans">值名称</th>
                      <th className="px-3 py-3 font-sans">持续时间</th>
                      <th className="px-3 py-3 font-sans">条件</th>
                      <th className="px-3 py-3 font-sans">阈值</th>
                      <th className="px-3 py-3 font-sans">单位</th>
                      <th className="px-3 py-3 font-sans">策略状态</th>
                      <th className="px-4 py-3 text-center font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {(() => {
                      const filtered = linkageConfigs.filter(l => {
                        if (linkageSearchKeyword.trim() !== '' && !l.name.toLowerCase().includes(linkageSearchKeyword.toLowerCase())) {
                          return false;
                        }
                        return true;
                      });
                      const paginated = filtered.slice((linkageCurrentPage - 1) * linkagePageSize, linkageCurrentPage * linkagePageSize);

                      if (paginated.length > 0) {
                        return paginated.map((lnk, idx) => (
                          <tr key={lnk.id} className="hover:bg-[#081b42]/85 transition-colors">
                            <td className="px-4 py-3 text-center font-bold text-slate-300">
                              {(linkageCurrentPage - 1) * linkagePageSize + idx + 1}
                            </td>
                            <td className="px-4 py-3 font-sans text-cyan-200 font-bold">{lnk.name}</td>
                            <td className="px-3 py-3 font-sans text-slate-300">{lnk.subsystem}</td>
                            <td className="px-3 py-3 font-sans text-slate-300">{lnk.deviceType}</td>
                            <td className="px-3 py-3 font-sans text-slate-300">{lnk.monitorDev}</td>
                            <td className="px-3 py-3 font-sans text-amber-300">{lnk.alarmType}</td>
                            <td className="px-3 py-3 font-sans text-white">{lnk.eventName}</td>
                            <td className="px-3 py-3 text-slate-300">{lnk.valName}</td>
                            <td className="px-3 py-3 text-slate-300">{lnk.duration}</td>
                            <td className="px-3 py-3 font-sans text-cyan-300">{lnk.condition}</td>
                            <td className="px-3 py-3 text-amber-400 font-bold">{lnk.threshold}</td>
                            <td className="px-3 py-3 text-slate-300">{lnk.unit}</td>
                            <td className="px-3 py-3 font-sans">
                              <span className={`font-bold ${lnk.isEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {lnk.isEnabled ? '启用' : '停用'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-sans space-x-2">
                              <button
                                onClick={() => {
                                  setActiveLinkageStrategy(lnk);
                                  setLinkageStrategyEnabled(lnk.isEnabled);
                                  setIsLinkageDeviceModalOpen(true);
                                }}
                                className="px-3 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/50 font-bold transition-all cursor-pointer"
                              >
                                联动设置
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirmConfig({
                                    isOpen: true,
                                    title: '确认删除联动策略',
                                    message: `确定要删除联动策略 [${lnk.name}] 吗？删除后系统将停止自动执行该设备联动机制。`,
                                    onConfirm: () => {
                                      setLinkageConfigs(prev => prev.filter(item => item.id !== lnk.id));
                                      triggerToast(`已成功删除联动策略: ${lnk.name}`);
                                      setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                    }
                                  });
                                }}
                                className="px-3 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/50 font-bold transition-all cursor-pointer"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ));
                      } else {
                        return (
                          <tr>
                            <td colSpan={14} className="px-4 py-12 text-center text-slate-500 font-sans">
                              暂无满足条件的联动策略记录
                            </td>
                          </tr>
                        );
                      }
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="p-3 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共 <strong className="text-cyan-300">{linkageConfigs.length}</strong> 条</span>
                  <span className="text-slate-600">|</span>
                  <span className="px-2 py-0.5 bg-[#081a3d] border border-[#1b448a] rounded text-slate-300 font-mono">
                    每页显示 10 条
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono">
                  <button
                    disabled={linkageCurrentPage === 1}
                    onClick={() => setLinkageCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-2.5 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer"
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: Math.ceil(linkageConfigs.length / linkagePageSize) || 1 }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setLinkageCurrentPage(p)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        linkageCurrentPage === p
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={linkageCurrentPage >= (Math.ceil(linkageConfigs.length / linkagePageSize) || 1)}
                    onClick={() => setLinkageCurrentPage(prev => Math.min(prev + 1, Math.ceil(linkageConfigs.length / linkagePageSize) || 1))}
                    className="px-2.5 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer"
                  >
                    下一页
                  </button>

                  <button 
                    onClick={() => triggerToast('已成功导出联动设置数据')}
                    className="ml-3 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow transition-all cursor-pointer font-sans"
                  >
                    导出数据
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 6. 人员配置 -> 部门管理 (Matching screenshot image_ea2ff334.png) ==================== */}
        {activeTertiary === '部门管理' && (
          <div className="space-y-4 font-sans">
            
            {/* Header category active tab label */}
            <div className="border-b border-cyan-500/30 pb-2 flex items-center justify-between">
              <div className="relative inline-block">
                <h2 className="text-sm font-bold text-cyan-300 px-3 py-1 bg-cyan-950/40 rounded-t-lg border-b-2 border-cyan-400">
                  部门管理
                </h2>
              </div>
            </div>

            {/* Top Action Bar matching screenshot */}
            <div className="flex items-center justify-between bg-[#06122d] border border-cyan-500/40 rounded-xl p-3 shadow-lg text-xs">
              <button
                onClick={() => {
                  setFormDeptName('');
                  setFormDeptManager('');
                  setFormDeptFunc('');
                  setFormDeptPhone('');
                  setFormDeptCount(10);
                  setFormDeptLocation('1栋1层103');
                  setIsAddDeptModal(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            </div>

            {/* Main Table Area matching screenshot image_ea2ff334.png */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between min-h-[440px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-slate-200 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-4 py-3 font-sans text-center w-12">序号</th>
                      <th className="px-4 py-3 font-sans">部门名称</th>
                      <th className="px-4 py-3 font-sans">负责人</th>
                      <th className="px-4 py-3 font-sans">部门功能</th>
                      <th className="px-4 py-3 font-sans">联系电话</th>
                      <th className="px-4 py-3 font-sans text-center">部门人数</th>
                      <th className="px-4 py-3 font-sans">办公地点</th>
                      <th className="px-4 py-3 font-sans text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {(() => {
                      const paginated = departmentList.slice((deptCurrentPage - 1) * deptPageSize, deptCurrentPage * deptPageSize);
                      if (paginated.length > 0) {
                        return paginated.map((dept, idx) => (
                          <tr key={dept.id} className="hover:bg-[#081b42]/85 transition-colors">
                            <td className="px-4 py-3 text-center font-bold text-slate-300">
                              {(deptCurrentPage - 1) * deptPageSize + idx + 1}
                            </td>
                            <td className="px-4 py-3 font-sans text-cyan-200 font-bold">{dept.name}</td>
                            <td className="px-4 py-3 font-sans text-slate-200">{dept.manager}</td>
                            <td className="px-4 py-3 font-sans text-slate-300">{dept.func}</td>
                            <td className="px-4 py-3 text-slate-300 font-mono">{maskPhone(dept.phone)}</td>
                            <td className="px-4 py-3 text-center text-cyan-300 font-bold">{dept.count}</td>
                            <td className="px-4 py-3 font-sans text-amber-300">{dept.location}</td>
                            <td className="px-4 py-3 text-center font-sans space-x-2">
                              <button
                                onClick={() => {
                                  setActiveEditingDeptId(dept.id);
                                  setFormDeptName(dept.name);
                                  setFormDeptManager(dept.manager);
                                  setFormDeptFunc(dept.func);
                                  setFormDeptPhone(dept.phone);
                                  setFormDeptCount(dept.count);
                                  setFormDeptLocation(dept.location);
                                  setIsEditDeptModal(true);
                                }}
                                className="px-3 py-1 rounded bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/50 font-bold transition-all cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirmConfig({
                                    isOpen: true,
                                    title: '确认删除部门',
                                    message: `确定要删除部门 [${dept.name}] 吗？删除后该部门成员档案需要重新归属。`,
                                    onConfirm: () => {
                                      setDepartmentList(prev => prev.filter(item => item.id !== dept.id));
                                      triggerToast(`已成功删除部门: ${dept.name}`);
                                      setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                    }
                                  });
                                }}
                                className="px-3 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/50 font-bold transition-all cursor-pointer"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ));
                      } else {
                        return (
                          <tr>
                            <td colSpan={8} className="px-4 py-12 text-center text-slate-500 font-sans">
                              暂无满足条件的部门记录，请点击上方“新增”创建
                            </td>
                          </tr>
                        );
                      }
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Table Footer matching screenshot image_ea2ff334.png */}
              <div className="p-3 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共 <strong className="text-cyan-300">{departmentList.length}</strong> 条</span>
                  <span className="text-slate-600">|</span>
                  <span className="px-2 py-0.5 bg-[#081a3d] border border-[#1b448a] rounded text-slate-300 font-mono">
                    每页显示 10 条
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono">
                  <button
                    disabled={deptCurrentPage === 1}
                    onClick={() => setDeptCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-2.5 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer font-sans"
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: Math.ceil(departmentList.length / deptPageSize) || 1 }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setDeptCurrentPage(p)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        deptCurrentPage === p
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={deptCurrentPage >= (Math.ceil(departmentList.length / deptPageSize) || 1)}
                    onClick={() => setDeptCurrentPage(prev => Math.min(prev + 1, Math.ceil(departmentList.length / deptPageSize) || 1))}
                    className="px-2.5 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer font-sans"
                  >
                    下一页
                  </button>

                  <button 
                    onClick={() => triggerToast('已成功导出部门管理数据')}
                    className="ml-3 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow transition-all cursor-pointer font-sans"
                  >
                    导出数据
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 7. 人员配置 -> 人员列表 (Matching screenshots image_25d217e6.png & image_86668fec.png) ==================== */}
        {activeTertiary === '人员列表' && (() => {
          const filteredStaffList = staffDataList.filter(s => {
            if (staffSearchDept !== '全部' && s.dept !== staffSearchDept) return false;
            if (staffSearchGender !== '全部' && s.gender !== staffSearchGender) return false;
            if (staffSearchName.trim() && !s.name.includes(staffSearchName.trim())) return false;
            return true;
          });

          const staffTotalPages = Math.ceil(filteredStaffList.length / staffPageSize) || 1;
          const paginatedStaff = filteredStaffList.slice((staffCurrentPage - 1) * staffPageSize, staffCurrentPage * staffPageSize);

          return (
            <div className="space-y-4">
              {/* Top Sub-tab Title */}
              <div className="border-b border-[#133063] pb-2">
                <span className="text-sm font-bold text-cyan-400 border-b-2 border-cyan-400 pb-2 px-1">人员管理</span>
              </div>

              {/* Query Bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                <span className="text-cyan-400 font-bold">查询:</span>
                
                <select
                  value={staffSearchDept}
                  onChange={(e) => { setStaffSearchDept(e.target.value); setStaffCurrentPage(1); }}
                  className="bg-[#081b40] border border-[#133063] text-cyan-200 px-3 py-1.5 rounded focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="全部">全部部门</option>
                  <option value="工程部">工程部</option>
                  <option value="工程一队">工程一队</option>
                  <option value="安保部">安保部</option>
                  <option value="安保二队">安保二队</option>
                  <option value="调度指挥中心">调度指挥中心</option>
                  <option value="暖通维保工程队">暖通维保工程队</option>
                  <option value="变配电工程组">变配电工程组</option>
                  <option value="行政综合后勤部">行政综合后勤部</option>
                </select>

                <select
                  value={staffSearchGender}
                  onChange={(e) => { setStaffSearchGender(e.target.value); setStaffCurrentPage(1); }}
                  className="bg-[#081b40] border border-[#133063] text-cyan-200 px-3 py-1.5 rounded focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="全部">全部性别</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>

                <input
                  type="text"
                  placeholder="人员姓名"
                  value={staffSearchName}
                  onChange={(e) => { setStaffSearchName(e.target.value); setStaffCurrentPage(1); }}
                  className="bg-[#081b40] border border-[#133063] text-cyan-100 placeholder-slate-500 px-3 py-1.5 rounded w-44 focus:outline-none focus:border-cyan-400"
                />

                <button
                  onClick={() => {
                    setStaffSearchDept('全部');
                    setStaffSearchGender('全部');
                    setStaffSearchName('');
                    setStaffCurrentPage(1);
                  }}
                  className="px-4 py-1.5 rounded border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>

                <button
                  onClick={() => {
                    setFormStaffName('');
                    setFormStaffGender('男');
                    setFormStaffStatus('在职');
                    setFormStaffAvatar('');
                    setFormStaffDept(staffSearchDept !== '全部' ? staffSearchDept : '工程部');
                    setFormStaffIdCard('');
                    setFormStaffPhone('');
                    setFormStaffEnableLogin('启用');
                    setFormStaffPassword('');
                    setIsAddStaffModal(true);
                  }}
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer ml-auto"
                >
                  新增
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-[#06122d] border border-[#133063] rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#081c42] text-slate-200 font-bold border-b border-[#133063]">
                      <tr>
                        <th className="px-5 py-3.5 text-center w-16">序号</th>
                        <th className="px-5 py-3.5">人员姓名</th>
                        <th className="px-5 py-3.5">人脸图像</th>
                        <th className="px-5 py-3.5">所属部门</th>
                        <th className="px-3 py-3.5 text-center">性别</th>
                        <th className="px-5 py-3.5">身份证号</th>
                        <th className="px-5 py-3.5">手机号码</th>
                        <th className="px-4 py-3.5 text-center">状态</th>
                        <th className="px-5 py-3.5 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#133063]/70">
                      {paginatedStaff.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-slate-400">
                            暂无符合条件的人员记录
                          </td>
                        </tr>
                      ) : (
                        paginatedStaff.map((stf, index) => {
                          const seqNum = (staffCurrentPage - 1) * staffPageSize + index + 1;
                          return (
                            <tr key={stf.id} className="hover:bg-[#081b42]/80 transition-colors">
                              <td className="px-5 py-3 text-center font-bold text-slate-200 font-mono">{seqNum}</td>
                              <td className="px-5 py-3 font-bold text-slate-100">{stf.name}</td>
                              <td className="px-5 py-2">
                                <div className="w-10 h-12 rounded overflow-hidden border border-cyan-500/40 bg-slate-900 shadow-sm">
                                  <img src={stf.avatar} alt={stf.name} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="px-5 py-3 text-slate-300">{stf.dept}</td>
                              <td className="px-3 py-3 text-center text-slate-300">{stf.gender}</td>
                              <td className="px-5 py-3 font-mono text-slate-300">{maskIdCard(stf.idCard)}</td>
                              <td className="px-5 py-3 font-mono text-slate-300">{maskPhone(stf.phone)}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[11px] ${stf.status === '在职' ? 'text-slate-200' : 'text-slate-400'}`}>
                                  {stf.status}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-center space-x-2">
                                <button
                                  onClick={() => {
                                    setActiveEditingStaffId(stf.id);
                                    setFormStaffName(stf.name);
                                    setFormStaffGender(stf.gender);
                                    setFormStaffStatus(stf.status);
                                    setFormStaffAvatar(stf.avatar);
                                    setFormStaffDept(stf.dept);
                                    setFormStaffIdCard(stf.idCard);
                                    setFormStaffPhone(stf.phone);
                                    setFormStaffEnableLogin(stf.enablePhoneLogin);
                                    setFormStaffPassword(stf.password || '123456');
                                    setIsEditStaffModal(true);
                                  }}
                                  className="px-3 py-1 rounded border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-all cursor-pointer"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmConfig({
                                      isOpen: true,
                                      title: '确认删除人员档案',
                                      message: `确定要删除人员档案【${stf.name} (${stf.dept})】吗？删除后不可恢复。`,
                                      onConfirm: () => {
                                        setStaffDataList(prev => prev.filter(s => s.id !== stf.id));
                                        setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                        triggerToast(`已成功删除人员档案【${stf.name}】`);
                                      }
                                    });
                                  }}
                                  className="px-3 py-1 rounded border border-rose-500/60 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all cursor-pointer"
                                >
                                  删除
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Footer matching screenshot image_25d217e6.png */}
              <div className="flex items-center justify-between pt-3 text-xs font-sans text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-400 font-bold font-mono">{filteredStaffList.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={staffCurrentPage === 1}
                    onClick={() => setStaffCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 hover:bg-[#0d2a63] cursor-pointer transition-colors"
                  >
                    上一页
                  </button>

                  {[...Array(staffTotalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setStaffCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded text-xs font-bold transition-all cursor-pointer ${
                          staffCurrentPage === pageNum
                            ? 'bg-cyan-600 text-white shadow-md'
                            : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={staffCurrentPage === staffTotalPages}
                    onClick={() => setStaffCurrentPage(prev => Math.min(prev + 1, staffTotalPages))}
                    className="px-3 py-1.5 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 hover:bg-[#0d2a63] cursor-pointer transition-colors"
                  >
                    下一页
                  </button>

                  <button
                    onClick={() => triggerToast('正在导出人员档案数据为 Excel 文件...')}
                    className="ml-3 px-3 py-1.5 rounded border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 font-bold transition-all cursor-pointer"
                  >
                    导出数据
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================== 8. 权限管理 -> 角色管理 (Matching screenshot image_446d4234.png) ==================== */}
        {activeTertiary === '角色管理' && (() => {
          const filteredRoles = [...rolesDataList]
            .filter(r => {
              if (roleSearchName.trim() && !r.name.includes(roleSearchName.trim())) return false;
              return true;
            })
            .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

          const roleTotalPages = Math.ceil(filteredRoles.length / rolePageSize) || 1;
          const paginatedRoles = filteredRoles.slice((roleCurrentPage - 1) * rolePageSize, roleCurrentPage * rolePageSize);

          return (
            <div className="space-y-4">
              {/* Top Sub-tab Title */}
              <div className="border-b border-[#133063] pb-2">
                <span className="text-sm font-bold text-cyan-400 border-b-2 border-cyan-400 pb-2 px-1">角色管理</span>
              </div>

              {/* Query Bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                <span className="text-cyan-400 font-bold">查询:</span>
                
                <input
                  type="text"
                  placeholder="角色名称"
                  value={roleSearchName}
                  onChange={(e) => { setRoleSearchName(e.target.value); setRoleCurrentPage(1); }}
                  className="bg-[#081b40] border border-[#133063] text-cyan-100 placeholder-slate-500 px-3 py-1.5 rounded w-48 focus:outline-none focus:border-cyan-400"
                />

                <button
                  onClick={() => {
                    setRoleSearchName('');
                    setRoleCurrentPage(1);
                  }}
                  className="px-4 py-1.5 rounded border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>

                <button
                  onClick={() => {
                    setFormRoleName('');
                    setFormRoleDesc('');
                    setFormRoleStatus('启用');
                    setIsAddRoleModal(true);
                  }}
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer ml-auto"
                >
                  新增
                </button>
              </div>

              {/* Role Data Table matching image_446d4234.png */}
              <div className="bg-[#06122d] border border-[#133063] rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#081c42] text-slate-200 font-bold border-b border-[#133063]">
                      <tr>
                        <th className="px-5 py-3.5 text-center w-16">序号</th>
                        <th className="px-5 py-3.5">角色名称</th>
                        <th className="px-5 py-3.5">角色说明</th>
                        <th className="px-5 py-3.5">创建时间</th>
                        <th className="px-4 py-3.5 text-center">状态</th>
                        <th className="px-5 py-3.5 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#133063]/70">
                      {paginatedRoles.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            暂无符合条件的角色记录
                          </td>
                        </tr>
                      ) : (
                        paginatedRoles.map((role, index) => {
                          const seqNum = (roleCurrentPage - 1) * rolePageSize + index + 1;
                          return (
                            <tr key={role.id} className="hover:bg-[#081b42]/80 transition-colors">
                              <td className="px-5 py-3.5 text-center font-bold text-slate-200 font-mono">{seqNum}</td>
                              <td className="px-5 py-3.5 font-bold text-slate-100">{role.name}</td>
                              <td className="px-5 py-3.5 text-slate-300">{role.desc}</td>
                              <td className="px-5 py-3.5 font-mono text-slate-300">{role.createTime}</td>
                              <td className="px-4 py-3.5 text-center">
                                <span className={`px-2 py-0.5 rounded text-[11px] ${role.status === '启用' ? 'text-slate-200' : 'text-slate-400'}`}>
                                  {role.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center space-x-2">
                                <button
                                  onClick={() => {
                                    setPermActiveRole(role);
                                    setPermSelectedKeys(role.permissions || []);
                                    setIsPermSettingModalOpen(true);
                                  }}
                                  className="px-3 py-1 rounded border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-all cursor-pointer"
                                >
                                  权限设置
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveEditingRoleId(role.id);
                                    setFormRoleName(role.name);
                                    setFormRoleDesc(role.desc);
                                    setFormRoleStatus(role.status);
                                    setIsEditRoleModal(true);
                                  }}
                                  className="px-3 py-1 rounded border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-all cursor-pointer"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmConfig({
                                      isOpen: true,
                                      title: '确认删除角色',
                                      message: `确定要删除角色【${role.name}】吗？删除后该角色关联的权限及规则将作废。`,
                                      onConfirm: () => {
                                        setRolesDataList(prev => prev.filter(r => r.id !== role.id));
                                        setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                        triggerToast(`已成功删除角色【${role.name}】`);
                                      }
                                    });
                                  }}
                                  className="px-3 py-1 rounded border border-rose-500/60 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all cursor-pointer"
                                >
                                  删除
                                </button>
                                <button
                                  onClick={() => {
                                    setBindUsersActiveRole(role);
                                    setBindUserSearchName('');
                                    setBindUsersPage(1);
                                    setIsBindUsersModalOpen(true);
                                  }}
                                  className="px-3 py-1 rounded border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-all cursor-pointer"
                                >
                                  绑定用户
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Footer matching screenshot image_446d4234.png */}
              <div className="flex items-center justify-between pt-3 text-xs font-sans text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-400 font-bold font-mono">{filteredRoles.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={roleCurrentPage === 1}
                    onClick={() => setRoleCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 hover:bg-[#0d2a63] cursor-pointer transition-colors"
                  >
                    上一页
                  </button>

                  {[...Array(roleTotalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setRoleCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded text-xs font-bold transition-all cursor-pointer ${
                          roleCurrentPage === pageNum
                            ? 'bg-cyan-600 text-white shadow-md'
                            : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={roleCurrentPage === roleTotalPages}
                    onClick={() => setRoleCurrentPage(prev => Math.min(prev + 1, roleTotalPages))}
                    className="px-3 py-1.5 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 hover:bg-[#0d2a63] cursor-pointer transition-colors"
                  >
                    下一页
                  </button>

                  <button
                    onClick={() => triggerToast('正在导出系统角色数据为 Excel 文件...')}
                    className="ml-3 px-3 py-1.5 rounded border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 font-bold transition-all cursor-pointer"
                  >
                    导出数据
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      </main>

      {/* ==================== MODAL: ADD DEVICE (新增设备点位) ==================== */}
      {isAddDeviceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>新增设备点位 ({activeDeviceCategory})</span>
              </h3>
              <button onClick={() => setIsAddDeviceModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">* 设备编号</label>
                <input 
                  type="text" 
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">* 设备名称</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">所在楼栋</label>
                  <select
                    value={formBuilding}
                    onChange={(e) => setFormBuilding(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>T1</option>
                    <option>T2</option>
                    <option>T3</option>
                    <option>B1</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">所在楼层</label>
                  <select
                    value={formFloor}
                    onChange={(e) => setFormFloor(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>1F</option>
                    <option>2F</option>
                    <option>3F</option>
                    <option>B1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">设备位置</label>
                  <input 
                    type="text" 
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">设备品牌</label>
                  <input 
                    type="text" 
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">IP地址 / 通信端口</label>
                  <input 
                    type="text" 
                    value={formIp}
                    onChange={(e) => setFormIp(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">初始运行状态</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>在线</option>
                    <option>离线</option>
                    <option>故障</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsAddDeviceModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={handleCreateDevice}
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                保存点位
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT DEVICE (编辑设备) ==================== */}
      {isEditDeviceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Edit className="w-4 h-4 text-cyan-400" />
                <span>编辑设备属性参数</span>
              </h3>
              <button onClick={() => setIsEditDeviceModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">* 设备编号</label>
                <input 
                  type="text" 
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">* 设备名称</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">所在楼栋</label>
                  <select
                    value={formBuilding}
                    onChange={(e) => setFormBuilding(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>T1</option>
                    <option>T2</option>
                    <option>T3</option>
                    <option>B1</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">所在楼层</label>
                  <select
                    value={formFloor}
                    onChange={(e) => setFormFloor(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>1F</option>
                    <option>2F</option>
                    <option>3F</option>
                    <option>B1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">设备位置</label>
                  <input 
                    type="text" 
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">设备品牌</label>
                  <input 
                    type="text" 
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">IP地址 / 通信端口</label>
                  <input 
                    type="text" 
                    value={formIp}
                    onChange={(e) => setFormIp(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">运行状态</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>在线</option>
                    <option>离线</option>
                    <option>故障</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsEditDeviceModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={handleUpdateDevice}
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: DELETE DEVICE (删除设备) ==================== */}
      {isDeleteDeviceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-red-500/50 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>确认删除设备</span>
              </h3>
              <button onClick={() => setIsDeleteDeviceModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              确定要移除设备点位 <strong className="text-cyan-300">[{formName}]</strong> 吗？删除后系统将停止对其监控与数据采集。
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsDeleteDeviceModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={handleDeleteDevice}
                className="px-5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD ROLE MODAL (新增角色) ==================== */}
      {isAddRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <div className="border-b-2 border-cyan-400 pb-1">
                <h3 className="text-sm font-bold text-cyan-300">新增角色</h3>
              </div>
              <button 
                onClick={() => setIsAddRoleModal(false)}
                className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">*</span>
                <span className="w-16 text-slate-300">角色名称</span>
                <input
                  type="text"
                  placeholder="请填写角色名称"
                  value={formRoleName}
                  onChange={e => setFormRoleName(e.target.value)}
                  className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-16 text-slate-300 pl-3">角色说明</span>
                <input
                  type="text"
                  placeholder="请填写角色功能说明"
                  value={formRoleDesc}
                  onChange={e => setFormRoleDesc(e.target.value)}
                  className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">*</span>
                <span className="w-16 text-slate-300">状 态</span>
                <div className="flex items-center gap-6 text-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="addRoleStatus" value="启用" checked={formRoleStatus === '启用'} onChange={() => setFormRoleStatus('启用')} className="accent-cyan-500" />
                    <span>启用</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="addRoleStatus" value="停用" checked={formRoleStatus === '停用'} onChange={() => setFormRoleStatus('停用')} className="accent-cyan-500" />
                    <span>停用</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={() => {
                  if (!formRoleName.trim()) {
                    triggerToast('请填写角色名称！');
                    return;
                  }
                  const now = new Date();
                  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                  const newRole: RoleRecord = {
                    id: `rol-${Date.now()}`,
                    name: formRoleName.trim(),
                    desc: formRoleDesc.trim() || '基础业务操作与数据查看权限',
                    createTime: dateStr,
                    status: formRoleStatus,
                    permissions: ['园区首页', '设备管理', '人流数据'],
                    boundUsers: [],
                  };
                  setRolesDataList(prev => [newRole, ...prev]);
                  setIsAddRoleModal(false);
                  triggerToast(`成功新增角色【${newRole.name}】`);
                }}
                className="px-8 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT ROLE MODAL (编辑角色) ==================== */}
      {isEditRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <div className="border-b-2 border-cyan-400 pb-1">
                <h3 className="text-sm font-bold text-cyan-300">编辑角色</h3>
              </div>
              <button 
                onClick={() => setIsEditRoleModal(false)}
                className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">*</span>
                <span className="w-16 text-slate-300">角色名称</span>
                <input
                  type="text"
                  placeholder="请填写角色名称"
                  value={formRoleName}
                  onChange={e => setFormRoleName(e.target.value)}
                  className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-16 text-slate-300 pl-3">角色说明</span>
                <input
                  type="text"
                  placeholder="请填写角色功能说明"
                  value={formRoleDesc}
                  onChange={e => setFormRoleDesc(e.target.value)}
                  className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">*</span>
                <span className="w-16 text-slate-300">状 态</span>
                <div className="flex items-center gap-6 text-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="editRoleStatus" value="启用" checked={formRoleStatus === '启用'} onChange={() => setFormRoleStatus('启用')} className="accent-cyan-500" />
                    <span>启用</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="editRoleStatus" value="停用" checked={formRoleStatus === '停用'} onChange={() => setFormRoleStatus('停用')} className="accent-cyan-500" />
                    <span>停用</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={() => {
                  if (!activeEditingRoleId) return;
                  if (!formRoleName.trim()) {
                    triggerToast('请填写角色名称！');
                    return;
                  }
                  setRolesDataList(prev => prev.map(r => r.id === activeEditingRoleId ? {
                    ...r,
                    name: formRoleName.trim(),
                    desc: formRoleDesc.trim(),
                    status: formRoleStatus,
                  } : r));
                  setIsEditRoleModal(false);
                  triggerToast(`成功保存角色修改【${formRoleName}】`);
                }}
                className="px-8 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PERMISSION SETTING MODAL (权限设置 - Matching screenshot image_4571b28e.png) ==================== */}
      {isPermSettingModalOpen && permActiveRole && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <div className="border-b-2 border-cyan-400 pb-1">
                <h3 className="text-sm font-bold text-cyan-300">权限设置 - {permActiveRole.name}</h3>
              </div>
              <button 
                onClick={() => setIsPermSettingModalOpen(false)}
                className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Platform Selector */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-300 font-medium">授权平台</span>
              <select
                value={permPlatform}
                onChange={e => setPermPlatform(e.target.value)}
                className="bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-cyan-200 focus:outline-none focus:border-cyan-400 cursor-pointer w-48 font-bold"
              >
                <option value="IBMS管理端">IBMS管理端</option>
                <option value="App移动端">App移动端</option>
                <option value="Web控制台">Web控制台</option>
              </select>
            </div>

            {/* Permission Tree Box matching image_4571b28e.png */}
            <div className="bg-[#030a1c] border border-slate-700/80 p-4 rounded-lg max-h-80 overflow-y-auto space-y-3">
              {[
                {
                  title: '园区首页',
                  children: ['设备管理', '人流数据', '车流数据', '能耗数据', '环境数据', '安全数据', '空间数据']
                },
                {
                  title: '图形化控制',
                  children: ['3D楼宇地图', '设备布点编辑', '图层开关']
                },
                {
                  title: '设备自控',
                  children: ['空调自控', '照明策略', '变配电监测']
                },
                {
                  title: '设备运维',
                  children: ['设备台账', '工单派发', '巡检计划']
                },
                {
                  title: '告警管理',
                  children: ['实时告警', '告警配置', '联动规则']
                }
              ].map((node) => {
                const isExpanded = permExpandedParents[node.title];
                const allChildrenChecked = node.children.every(c => permSelectedKeys.includes(c));
                const parentChecked = permSelectedKeys.includes(node.title) || allChildrenChecked;

                return (
                  <div key={node.title} className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPermExpandedParents(prev => ({ ...prev, [node.title]: !prev[node.title] }))}
                        className="text-slate-400 hover:text-cyan-300 cursor-pointer p-0.5"
                      >
                        {isExpanded ? (
                          <span className="text-[10px] text-slate-300 font-mono">▲</span>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-mono">▼</span>
                        )}
                      </button>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-100 hover:text-cyan-200">
                        <input
                          type="checkbox"
                          checked={parentChecked}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setPermSelectedKeys(prev => {
                              let next = new Set(prev);
                              if (isChecked) {
                                next.add(node.title);
                                node.children.forEach(c => next.add(c));
                              } else {
                                next.delete(node.title);
                                node.children.forEach(c => next.delete(c));
                              }
                              return Array.from(next);
                            });
                          }}
                          className="accent-cyan-500 rounded cursor-pointer"
                        />
                        <span>{node.title}</span>
                      </label>
                    </div>

                    {isExpanded && (
                      <div className="pl-8 space-y-1.5 border-l border-slate-800 ml-2">
                        {node.children.map(child => {
                          const isChecked = permSelectedKeys.includes(child);
                          return (
                            <label key={child} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setPermSelectedKeys(prev => {
                                    let next = new Set(prev);
                                    if (checked) {
                                      next.add(child);
                                    } else {
                                      next.delete(child);
                                    }
                                    return Array.from(next);
                                  });
                                }}
                                className="accent-cyan-500 rounded cursor-pointer"
                              />
                              <span>{child}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button
                onClick={() => setIsPermSettingModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setRolesDataList(prev => prev.map(r => r.id === permActiveRole.id ? {
                    ...r,
                    permissions: permSelectedKeys
                  } : r));
                  setIsPermSettingModalOpen(false);
                  triggerToast(`已成功保存【${permActiveRole.name}】在 [${permPlatform}] 的权限设置`);
                }}
                className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer transition-all"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BIND USERS MODAL (绑定用户 - Matching screenshot image_42aed876.png) ==================== */}
      {isBindUsersModalOpen && bindUsersActiveRole && (() => {
        const filteredUsers = bindUsersActiveRole.boundUsers.filter(u => {
          if (bindUserSearchName.trim() && !u.name.includes(bindUserSearchName.trim())) return false;
          return true;
        });

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-[#06122d] border border-cyan-500/50 rounded-xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                <div className="border-b-2 border-cyan-400 pb-1">
                  <h3 className="text-sm font-bold text-cyan-300">绑定用户 - {bindUsersActiveRole.name}</h3>
                </div>
                <button 
                  onClick={() => setIsBindUsersModalOpen(false)}
                  className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Inner Query Bar */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-300 font-medium">查询</span>
                <input
                  type="text"
                  placeholder="用户姓名"
                  value={bindUserSearchName}
                  onChange={e => setBindUserSearchName(e.target.value)}
                  className="bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 w-52"
                />
                <button
                  onClick={() => setBindUserSearchName('')}
                  className="px-4 py-1.5 rounded border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-bold cursor-pointer transition-all"
                >
                  重置
                </button>
                <button
                  onClick={() => setIsAddUserToRoleSubModal(true)}
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer transition-all ml-auto"
                >
                  新增
                </button>
              </div>

              {/* Bound Users Table matching image_42aed876.png */}
              <div className="bg-[#030a1c] border border-[#133063] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#081c42] text-slate-200 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3 text-center w-16">序号</th>
                      <th className="px-5 py-3">用户姓名</th>
                      <th className="px-5 py-3">帐号</th>
                      <th className="px-5 py-3">所属部门</th>
                      <th className="px-5 py-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]/70">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          暂无绑定的关联用户
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((usr, idx) => (
                        <tr key={usr.id} className="hover:bg-[#081b42]/80 transition-colors">
                          <td className="px-5 py-3 text-center font-bold text-slate-300 font-mono">{idx + 1}</td>
                          <td className="px-5 py-3 font-bold text-slate-100">{usr.name}</td>
                          <td className="px-5 py-3 font-mono text-slate-300">{usr.account}</td>
                          <td className="px-5 py-3 text-slate-300">{usr.dept}</td>
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => {
                                setDeleteConfirmConfig({
                                  isOpen: true,
                                  title: '确认解除用户绑定',
                                  message: `确定要解除用户【${usr.name}】与角色【${bindUsersActiveRole.name}】的绑定关系吗？`,
                                  onConfirm: () => {
                                    setRolesDataList(prev => prev.map(r => r.id === bindUsersActiveRole.id ? {
                                      ...r,
                                      boundUsers: r.boundUsers.filter(u => u.id !== usr.id)
                                    } : r));
                                    setBindUsersActiveRole(prev => prev ? {
                                      ...prev,
                                      boundUsers: prev.boundUsers.filter(u => u.id !== usr.id)
                                    } : null);
                                    setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                    triggerToast(`已解绑用户【${usr.name}】`);
                                  }
                                });
                              }}
                              className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Inner Pagination */}
              <div className="flex justify-center items-center gap-1.5 text-xs pt-2">
                <button
                  disabled={bindUsersPage === 1}
                  onClick={() => setBindUsersPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 disabled:opacity-40 hover:bg-[#0d2a63] cursor-pointer"
                >
                  上一页
                </button>
                {[1, 2, 3, 4].map(p => (
                  <button
                    key={p}
                    onClick={() => setBindUsersPage(p)}
                    className={`w-7 h-7 rounded text-xs font-bold ${
                      bindUsersPage === p ? 'bg-cyan-600 text-white' : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="text-slate-500">...</span>
                <button onClick={() => setBindUsersPage(8)} className="w-7 h-7 rounded bg-[#081b40] border border-[#133063] text-slate-300">8</button>
                <button
                  onClick={() => setBindUsersPage(p => Math.min(p + 1, 8))}
                  className="px-3 py-1 rounded bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63] cursor-pointer"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SUB-MODAL: ADD USER TO ROLE (添加绑定用户) */}
      {isAddUserToRoleSubModal && bindUsersActiveRole && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/60 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-[#133063]">
              <h3 className="text-xs font-bold text-cyan-300">选择待绑定用户 - {bindUsersActiveRole.name}</h3>
              <button onClick={() => setIsAddUserToRoleSubModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <p className="text-xs text-slate-400">选择系统中的人员账号直接绑定至当前角色：</p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {staffDataList
                .filter(stf => !bindUsersActiveRole.boundUsers.some(bu => bu.account === stf.phone))
                .map(stf => (
                  <div key={stf.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#030a1c] border border-slate-800 text-xs">
                    <div>
                      <span className="font-bold text-slate-200">{stf.name}</span>
                      <span className="text-slate-400 text-[11px] ml-2 font-mono">({stf.phone})</span>
                      <span className="text-cyan-400/80 text-[11px] ml-2">[{stf.dept}]</span>
                    </div>
                    <button
                      onClick={() => {
                        const newBoundUser = {
                          id: `usr-${Date.now()}`,
                          name: stf.name,
                          account: stf.phone,
                          dept: stf.dept,
                        };
                        setRolesDataList(prev => prev.map(r => r.id === bindUsersActiveRole.id ? {
                          ...r,
                          boundUsers: [...r.boundUsers, newBoundUser]
                        } : r));
                        setBindUsersActiveRole(prev => prev ? {
                          ...prev,
                          boundUsers: [...prev.boundUsers, newBoundUser]
                        } : null);
                        setIsAddUserToRoleSubModal(false);
                        triggerToast(`已成功为角色【${bindUsersActiveRole.name}】绑定用户【${stf.name}】`);
                      }}
                      className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      绑定
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#133063]">
              <button onClick={() => setIsAddUserToRoleSubModal(false)} className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD EVENT RULE (新增事件规则) ==================== */}
      {isAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>新增事件规则</span>
              </h3>
              <button onClick={() => setIsAddEventModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              
              {/* Event Name */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-slate-300 font-semibold text-right">* 事件名称</label>
                <input 
                  type="text" 
                  value={formEventName}
                  onChange={(e) => setFormEventName(e.target.value)}
                  placeholder="请填写事件名称"
                  className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />
              </div>

              {/* Event Description */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-slate-300 font-semibold text-right pt-2">* 事件描述</label>
                <textarea 
                  rows={2}
                  maxLength={100}
                  value={formEventDesc}
                  onChange={(e) => setFormEventDesc(e.target.value)}
                  placeholder="100字以内"
                  className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none" 
                />
              </div>

              {/* Subsystem & Device Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 子系统</label>
                  <select
                    value={formEventSub}
                    onChange={(e) => setFormEventSub(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>视频监控</option>
                    <option>远程抄表</option>
                    <option>环境监测</option>
                    <option>消防系统</option>
                    <option>给排水</option>
                    <option>门禁系统</option>
                    <option>变配电</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 设备类型</label>
                  <select
                    value={formEventDevType}
                    onChange={(e) => setFormEventDevType(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>摄像头</option>
                    <option>电表</option>
                    <option>温湿度传感器</option>
                    <option>烟感探测器</option>
                  </select>
                </div>
              </div>

              {/* Value Name & Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 值名称</label>
                  <select
                    value={formEventValName}
                    onChange={(e) => setFormEventValName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>上月能耗</option>
                    <option>当月能耗</option>
                    <option>温度值</option>
                    <option>湿度值</option>
                    <option>烟雾浓度</option>
                    <option>管道水压</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 条件</label>
                  <select
                    value={formEventCondition}
                    onChange={(e) => setFormEventCondition(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>大于</option>
                    <option>小于</option>
                    <option>等于</option>
                  </select>
                </div>
              </div>

              {/* Threshold & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 阈值</label>
                  <input 
                    type="text" 
                    value={formEventThreshold}
                    onChange={(e) => setFormEventThreshold(e.target.value)}
                    placeholder="请填写阈值"
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 启用状态</label>
                  <div className="flex items-center gap-6 flex-1 px-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input 
                        type="radio" 
                        name="addEventStatus" 
                        checked={formEventStatus === '启用'} 
                        onChange={() => setFormEventStatus('启用')}
                        className="text-cyan-500" 
                      />
                      <span>启用</span>
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input 
                        type="radio" 
                        name="addEventStatus" 
                        checked={formEventStatus === '不启用'} 
                        onChange={() => setFormEventStatus('不启用')}
                        className="text-cyan-500" 
                      />
                      <span>不启用</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Monitoring Devices Action Bar */}
              <div className="flex items-center gap-3 pt-2">
                <label className="w-24 text-slate-300 font-semibold text-right">监控设备</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const newDevItem = {
                        id: `md-${Date.now()}`,
                        subsystem: formEventSub,
                        deviceType: formEventDevType,
                        brandModel: '华为NO01',
                        devNo: `${Math.floor(100000 + Math.random() * 900000)}`,
                        location: 'T1-1F机房',
                        selected: false
                      };
                      setFormEventDevices([...formEventDevices, newDevItem]);
                      triggerToast('已成功添加监控设备点位');
                    }}
                    className="px-5 py-1.5 rounded-lg bg-[#071d47] hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 font-bold cursor-pointer"
                  >
                    添加
                  </button>
                  <button 
                    onClick={() => {
                      const hasSelected = formEventDevices.some(d => d.selected);
                      if (!hasSelected) {
                        triggerToast('请先勾选需要删除的监控设备！');
                        return;
                      }
                      setDeleteTargetType('device');
                      setDeleteTargetId(null);
                      setIsDeleteConfirmModal(true);
                    }}
                    className="px-5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-400 font-bold cursor-pointer"
                  >
                    删除
                  </button>
                </div>
              </div>

              {/* Monitoring Devices Sub-table */}
              <div className="border border-[#133063] rounded-xl overflow-hidden bg-[#030a1c] max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-4 py-2.5 font-sans text-center w-12">
                        <input 
                          type="checkbox" 
                          checked={selectAllDevices}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setSelectAllDevices(val);
                            setFormEventDevices(prev => prev.map(d => ({ ...d, selected: val })));
                          }}
                          className="text-cyan-500 cursor-pointer" 
                        />
                      </th>
                      <th className="px-3 py-2.5 font-sans">子系统</th>
                      <th className="px-3 py-2.5 font-sans">设备类型</th>
                      <th className="px-3 py-2.5 font-sans">品牌型号</th>
                      <th className="px-3 py-2.5 font-sans">设备编号</th>
                      <th className="px-3 py-2.5 font-sans">设备位置</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {formEventDevices.length > 0 ? (
                      formEventDevices.map((dev) => (
                        <tr key={dev.id} className="hover:bg-[#081b42]/60 transition-colors">
                          <td className="px-4 py-2 text-center">
                            <input 
                              type="checkbox" 
                              checked={dev.selected}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setFormEventDevices(prev => prev.map(item => item.id === dev.id ? { ...item, selected: val } : item));
                              }}
                              className="text-cyan-500 cursor-pointer" 
                            />
                          </td>
                          <td className="px-3 py-2 text-slate-300">{dev.subsystem}</td>
                          <td className="px-3 py-2 text-slate-300">{dev.deviceType}</td>
                          <td className="px-3 py-2 text-slate-300">{dev.brandModel}</td>
                          <td className="px-3 py-2 text-slate-200">{dev.devNo}</td>
                          <td className="px-3 py-2 text-amber-300">{dev.location}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-sans">
                          暂无关联的监控设备，请点击上方“添加”按钮
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsAddEventModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={() => {
                  if (!formEventName) {
                    triggerToast('请填写事件名称！');
                    return;
                  }
                  const newEvt = {
                    id: `evt-${Date.now()}`,
                    name: formEventName,
                    subsystem: formEventSub,
                    deviceType: formEventDevType,
                    monitorDev: formEventDevices.filter(d => d.selected).map(d => d.devNo).join('、') || '全部设备',
                    valName: formEventValName,
                    duration: '0min',
                    condition: formEventCondition,
                    threshold: formEventThreshold || '0',
                    unit: 'kWh',
                    status: formEventStatus === '启用' ? '启用' : '停用'
                  };
                  setEventList([newEvt, ...eventList]);
                  setIsAddEventModal(false);
                  triggerToast(`成功新增事件规则: ${newEvt.name}`);
                }}
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                保存规则
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT EVENT RULE (编辑事件规则) ==================== */}
      {isEditEventModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Edit className="w-4 h-4 text-cyan-400" />
                <span>编辑事件规则</span>
              </h3>
              <button onClick={() => setIsEditEventModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              
              {/* Event Name */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-slate-300 font-semibold text-right">* 事件名称</label>
                <input 
                  type="text" 
                  value={formEventName}
                  onChange={(e) => setFormEventName(e.target.value)}
                  placeholder="请填写事件名称"
                  className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />
              </div>

              {/* Event Description */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-slate-300 font-semibold text-right pt-2">* 事件描述</label>
                <textarea 
                  rows={2}
                  maxLength={100}
                  value={formEventDesc}
                  onChange={(e) => setFormEventDesc(e.target.value)}
                  placeholder="100字以内"
                  className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none" 
                />
              </div>

              {/* Subsystem & Device Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 子系统</label>
                  <select
                    value={formEventSub}
                    onChange={(e) => setFormEventSub(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>视频监控</option>
                    <option>远程抄表</option>
                    <option>环境监测</option>
                    <option>消防系统</option>
                    <option>给排水</option>
                    <option>门禁系统</option>
                    <option>变配电</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 设备类型</label>
                  <select
                    value={formEventDevType}
                    onChange={(e) => setFormEventDevType(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>摄像头</option>
                    <option>电表</option>
                    <option>温湿度传感器</option>
                    <option>烟感探测器</option>
                  </select>
                </div>
              </div>

              {/* Value Name & Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 值名称</label>
                  <select
                    value={formEventValName}
                    onChange={(e) => setFormEventValName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>上月能耗</option>
                    <option>当月能耗</option>
                    <option>温度值</option>
                    <option>湿度值</option>
                    <option>烟雾浓度</option>
                    <option>管道水压</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 条件</label>
                  <select
                    value={formEventCondition}
                    onChange={(e) => setFormEventCondition(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>大于</option>
                    <option>小于</option>
                    <option>等于</option>
                  </select>
                </div>
              </div>

              {/* Threshold & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 阈值</label>
                  <input 
                    type="text" 
                    value={formEventThreshold}
                    onChange={(e) => setFormEventThreshold(e.target.value)}
                    placeholder="请填写阈值"
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 启用状态</label>
                  <div className="flex items-center gap-6 flex-1 px-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input 
                        type="radio" 
                        name="editEventStatus" 
                        checked={formEventStatus === '启用'} 
                        onChange={() => setFormEventStatus('启用')}
                        className="text-cyan-500" 
                      />
                      <span>启用</span>
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input 
                        type="radio" 
                        name="editEventStatus" 
                        checked={formEventStatus === '不启用' || formEventStatus === '停用'} 
                        onChange={() => setFormEventStatus('不启用')}
                        className="text-cyan-500" 
                      />
                      <span>不启用</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Monitoring Devices Action Bar */}
              <div className="flex items-center gap-3 pt-2">
                <label className="w-24 text-slate-300 font-semibold text-right">监控设备</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const newDevItem = {
                        id: `md-${Date.now()}`,
                        subsystem: formEventSub,
                        deviceType: formEventDevType,
                        brandModel: '华为NO01',
                        devNo: `${Math.floor(100000 + Math.random() * 900000)}`,
                        location: 'T1-1F机房',
                        selected: false
                      };
                      setFormEventDevices([...formEventDevices, newDevItem]);
                      triggerToast('已成功添加监控设备点位');
                    }}
                    className="px-5 py-1.5 rounded-lg bg-[#071d47] hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 font-bold cursor-pointer"
                  >
                    添加
                  </button>
                  <button 
                    onClick={() => {
                      const hasSelected = formEventDevices.some(d => d.selected);
                      if (!hasSelected) {
                        triggerToast('请先勾选需要删除的监控设备！');
                        return;
                      }
                      setDeleteTargetType('device');
                      setDeleteTargetId(null);
                      setIsDeleteConfirmModal(true);
                    }}
                    className="px-5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-400 font-bold cursor-pointer"
                  >
                    删除
                  </button>
                </div>
              </div>

              {/* Monitoring Devices Sub-table */}
              <div className="border border-[#133063] rounded-xl overflow-hidden bg-[#030a1c] max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-4 py-2.5 font-sans text-center w-12">
                        <input 
                          type="checkbox" 
                          checked={selectAllDevices}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setSelectAllDevices(val);
                            setFormEventDevices(prev => prev.map(d => ({ ...d, selected: val })));
                          }}
                          className="text-cyan-500 cursor-pointer" 
                        />
                      </th>
                      <th className="px-3 py-2.5 font-sans">子系统</th>
                      <th className="px-3 py-2.5 font-sans">设备类型</th>
                      <th className="px-3 py-2.5 font-sans">品牌型号</th>
                      <th className="px-3 py-2.5 font-sans">设备编号</th>
                      <th className="px-3 py-2.5 font-sans">设备位置</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {formEventDevices.length > 0 ? (
                      formEventDevices.map((dev) => (
                        <tr key={dev.id} className="hover:bg-[#081b42]/60 transition-colors">
                          <td className="px-4 py-2 text-center">
                            <input 
                              type="checkbox" 
                              checked={dev.selected}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setFormEventDevices(prev => prev.map(item => item.id === dev.id ? { ...item, selected: val } : item));
                              }}
                              className="text-cyan-500 cursor-pointer" 
                            />
                          </td>
                          <td className="px-3 py-2 text-slate-300">{dev.subsystem}</td>
                          <td className="px-3 py-2 text-slate-300">{dev.deviceType}</td>
                          <td className="px-3 py-2 text-slate-300">{dev.brandModel}</td>
                          <td className="px-3 py-2 text-slate-200">{dev.devNo}</td>
                          <td className="px-3 py-2 text-amber-300">{dev.location}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-sans">
                          暂无关联的监控设备，请点击上方“添加”按钮
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsEditEventModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={() => {
                  if (!activeEditingEventId) return;
                  if (!formEventName) {
                    triggerToast('请填写事件名称！');
                    return;
                  }
                  setEventList(prev => prev.map(evt => {
                    if (evt.id === activeEditingEventId) {
                      return {
                        ...evt,
                        name: formEventName,
                        subsystem: formEventSub,
                        deviceType: formEventDevType,
                        monitorDev: formEventDevices.filter(d => d.selected).map(d => d.devNo).join('、') || evt.monitorDev,
                        valName: formEventValName,
                        condition: formEventCondition,
                        threshold: formEventThreshold || '0',
                        status: formEventStatus === '启用' ? '启用' : '停用'
                      };
                    }
                    return evt;
                  }));
                  setIsEditEventModal(false);
                  triggerToast(`成功更新事件规则: ${formEventName}`);
                }}
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: DELETE CONFIRMATION ==================== */}
      {isDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-red-500/50 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>确认删除</span>
              </h3>
              <button onClick={() => setIsDeleteConfirmModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              确定要删除所选的监控设备点位吗？删除后将不再参与此事件规则监测。
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsDeleteConfirmModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={() => {
                  setFormEventDevices(prev => prev.filter(d => !d.selected));
                  setIsDeleteConfirmModal(false);
                  triggerToast('已成功从规则中移除所选监控设备');
                }}
                className="px-5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD LINKAGE STRATEGY (新增策略) ==================== */}
      {isAddLinkageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>新增策略</span>
              </h3>
              <button onClick={() => setIsAddLinkageModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-4 text-xs font-sans">
              
              {/* Linkage Strategy Name */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-slate-300 font-semibold text-right">* 联动策略名称</label>
                <input 
                  type="text" 
                  value={formLinkName}
                  onChange={(e) => setFormLinkName(e.target.value)}
                  placeholder="请填写联动策略名称"
                  className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />
              </div>

              {/* Subsystem & Device Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 子系统</label>
                  <select
                    value={formLinkSubsystem}
                    onChange={(e) => setFormLinkSubsystem(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>环境监测</option>
                    <option>视频监控</option>
                    <option>消防系统</option>
                    <option>给排水</option>
                    <option>门禁系统</option>
                    <option>变配电</option>
                    <option>智慧照明</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-slate-300 font-semibold text-right">* 设备类型</label>
                  <select
                    value={formLinkDevType}
                    onChange={(e) => setFormLinkDevType(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>感应器</option>
                    <option>摄像头</option>
                    <option>烟感探测器</option>
                    <option>水压表</option>
                    <option>智能电表</option>
                  </select>
                </div>
              </div>

              {/* Monitoring Device Selection */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-slate-300 font-semibold text-right">* 监测设备</label>
                <div className="flex items-center gap-2 flex-1">
                  <input 
                    type="text" 
                    value={formLinkMonitorDev}
                    onChange={(e) => setFormLinkMonitorDev(e.target.value)}
                    placeholder="请选择设备"
                    className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                  />
                  <button 
                    onClick={() => triggerToast(`已选择监测设备: ${formLinkMonitorDev}`)}
                    className="px-4 py-2 rounded-lg bg-[#071d47] hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 font-bold cursor-pointer"
                  >
                    添加设备
                  </button>
                </div>
              </div>

              {/* Event Name */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-slate-300 font-semibold text-right">* 事件名称</label>
                <select
                  value={formLinkEventName}
                  onChange={(e) => {
                    const evtName = e.target.value;
                    setFormLinkEventName(evtName);
                    if (evtName === '高温事件') {
                      setFormLinkAlarmType('温度告警');
                      setFormLinkValName('温度');
                      setFormLinkDuration('5min');
                      setFormLinkCondition('大于');
                      setFormLinkThreshold('36°C');
                    } else if (evtName === '低温事件') {
                      setFormLinkAlarmType('温度告警');
                      setFormLinkValName('温度');
                      setFormLinkDuration('5min');
                      setFormLinkCondition('小于');
                      setFormLinkThreshold('6°C');
                    } else {
                      setFormLinkAlarmType('通用告警');
                      setFormLinkValName('测量值');
                      setFormLinkDuration('1min');
                      setFormLinkCondition('大于');
                      setFormLinkThreshold('50');
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option>高温事件</option>
                  <option>低温事件</option>
                  <option>烟雾超标事件</option>
                  <option>黑名单抓拍事件</option>
                  <option>水压超标事件</option>
                </select>
              </div>

              {/* Summary Details Grid matching screenshot image_930d2646.png */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#030a1c] border border-[#133063] font-mono text-xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 w-16 text-right font-sans">告警类型</span>
                    <span className="text-cyan-300 font-bold">{formLinkAlarmType}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 w-16 text-right font-sans">持续时间</span>
                    <span className="text-white">{formLinkDuration}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 w-16 text-right font-sans">阀 值</span>
                    <span className="text-amber-400 font-bold">{formLinkThreshold}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 w-16 text-right font-sans">值名称</span>
                    <span className="text-white">{formLinkValName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 w-16 text-right font-sans">条 件</span>
                    <span className="text-cyan-300 font-bold">{formLinkCondition}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#133063]">
              <button onClick={() => setIsAddLinkageModalOpen(false)} className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={() => {
                  if (!formLinkName) {
                    triggerToast('请填写联动策略名称！');
                    return;
                  }
                  const newLink = {
                    id: `lnk-${Date.now()}`,
                    name: formLinkName,
                    subsystem: formLinkSubsystem,
                    deviceType: formLinkDevType,
                    monitorDev: formLinkMonitorDev,
                    alarmType: formLinkAlarmType,
                    eventName: formLinkEventName,
                    valName: formLinkValName,
                    duration: formLinkDuration,
                    condition: formLinkCondition,
                    threshold: formLinkThreshold.replace('°C', ''),
                    unit: formLinkThreshold.includes('°C') ? '°C' : '',
                    status: '启用',
                    isEnabled: true
                  };
                  setLinkageConfigs([newLink, ...linkageConfigs]);
                  setIsAddLinkageModalOpen(false);
                  triggerToast(`成功新增联动策略: ${newLink.name}`);
                }}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: LINKAGE DEVICE SETTING (添加设备 - 匹配截图) ==================== */}
      {isLinkageDeviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/40 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-3 border-b border-[#133063] bg-[#040d24]">
              <div className="relative border-b-2 border-cyan-400 pb-1 -mb-3">
                <h3 className="text-sm font-bold text-cyan-300">添加设备</h3>
              </div>
              <button onClick={() => setIsLinkageDeviceModalOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-200">
              
              {/* Trigger Device Header Panel (Matching screenshot image.png) */}
              <div className="bg-[#030a1c] border border-[#133063] rounded-lg p-4 space-y-3">
                <div className="text-slate-300 font-sans">
                  触发设备 （{activeLinkageStrategy?.subsystem || '环境监测'}-{activeLinkageStrategy?.deviceType || '感应器'}-{activeLinkageStrategy?.eventName || '高温事件'}-{activeLinkageStrategy?.duration || '5min'}-{activeLinkageStrategy?.condition || '大于'}-{activeLinkageStrategy?.threshold || '35'}{activeLinkageStrategy?.unit || '℃'}）
                </div>
                <div className="flex flex-wrap gap-3">
                  {['感应器1', '感应器2', '感应器3'].map((tag) => (
                    <button key={tag} className="px-5 py-1.5 rounded bg-[#061738] border border-[#1b448a] text-slate-200 hover:border-cyan-400 hover:text-cyan-300 font-sans transition-all cursor-pointer">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strategy Switch & Action Bar */}
              <div className="space-y-3 font-sans pt-1">
                <div className="flex items-center gap-6">
                  <span className="w-20 text-slate-300 font-semibold text-right">策略启停</span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input 
                        type="radio" 
                        name="strategyOnOff" 
                        checked={linkageStrategyEnabled} 
                        onChange={() => setLinkageStrategyEnabled(true)}
                        className="text-cyan-500 cursor-pointer" 
                      />
                      <span>开启</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input 
                        type="radio" 
                        name="strategyOnOff" 
                        checked={!linkageStrategyEnabled} 
                        onChange={() => setLinkageStrategyEnabled(false)}
                        className="text-cyan-500 cursor-pointer" 
                      />
                      <span>关闭</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="w-20 text-slate-300 font-semibold text-right">联动设备</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsAddLinkageDevSubModal(true)}
                      className="px-6 py-1.5 rounded bg-gradient-to-r from-cyan-900 to-cyan-800 hover:from-cyan-800 hover:to-cyan-700 text-cyan-200 border border-cyan-500/50 font-bold shadow transition-all cursor-pointer"
                    >
                      添加
                    </button>
                    <button 
                      onClick={() => {
                        const hasSelected = linkageDevicesSubTable.some(d => d.selected);
                        if (!hasSelected) {
                          triggerToast('请先勾选需要删除的联动设备！');
                          return;
                        }
                        const count = linkageDevicesSubTable.filter(d => d.selected).length;
                        setDeleteConfirmConfig({
                          isOpen: true,
                          title: '确认删除联动设备',
                          message: `确定要从该联动策略中移除已勾选的 ${count} 个联动设备点位吗？`,
                          onConfirm: () => {
                            setLinkageDevicesSubTable(prev => prev.filter(d => !d.selected));
                            setLinkageModalSelectAll(false);
                            setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }));
                            triggerToast(`已成功移除 ${count} 个联动设备`);
                          }
                        });
                      }}
                      className="px-6 py-1.5 rounded bg-gradient-to-r from-slate-800 to-slate-900 hover:from-red-950 hover:to-slate-900 text-slate-200 border border-slate-700 hover:border-red-500/50 hover:text-red-300 font-bold shadow transition-all cursor-pointer"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtable Matching Screenshot image.png */}
              <div className="border border-[#133063] rounded-lg overflow-hidden bg-[#030a1c]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-slate-200 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-4 py-3 font-sans text-center w-12">
                        <input 
                          type="checkbox" 
                          checked={linkageModalSelectAll}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setLinkageModalSelectAll(val);
                            setLinkageDevicesSubTable(prev => prev.map(d => ({ ...d, selected: val })));
                          }}
                          className="text-cyan-500 cursor-pointer" 
                        />
                      </th>
                      <th className="px-4 py-3 font-sans">子系统</th>
                      <th className="px-4 py-3 font-sans">设备类型</th>
                      <th className="px-4 py-3 font-sans">品牌型号</th>
                      <th className="px-4 py-3 font-sans">设备编号</th>
                      <th className="px-4 py-3 font-sans">设备位置</th>
                      <th className="px-4 py-3 font-sans text-center">联动动作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {linkageDevicesSubTable.length > 0 ? (
                      linkageDevicesSubTable.map((item) => (
                        <tr key={item.id} className="hover:bg-[#081b42]/70 transition-colors">
                          <td className="px-4 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={item.selected}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setLinkageDevicesSubTable(prev => prev.map(el => el.id === item.id ? { ...el, selected: val } : el));
                              }}
                              className="text-cyan-500 cursor-pointer" 
                            />
                          </td>
                          <td className="px-4 py-3 font-sans text-slate-300">{item.subsystem}</td>
                          <td className="px-4 py-3 font-sans text-slate-300">{item.deviceType}</td>
                          <td className="px-4 py-3 font-sans text-slate-300">{item.brandModel}</td>
                          <td className="px-4 py-3 font-sans text-slate-200">{item.devNo}</td>
                          <td className="px-4 py-3 font-sans text-slate-300">{item.location}</td>
                          <td className="px-4 py-3 text-center font-sans">
                            {item.actionText === '设置' ? (
                              <button 
                                onClick={() => {
                                  setActiveActionDevId(item.id);
                                  setIsActionSettingModalOpen(true);
                                }}
                                className="text-cyan-400 hover:text-cyan-300 underline font-bold cursor-pointer"
                              >
                                设置
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  setActiveActionDevId(item.id);
                                  setIsActionSettingModalOpen(true);
                                }}
                                className="text-cyan-300 hover:text-cyan-200 font-bold cursor-pointer"
                              >
                                {item.actionText}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-sans">
                          暂无关联联动设备，请点击“添加”按钮部署联动动作点位
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modal Pagination Footer & Save Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 font-sans">
                <div className="flex items-center gap-1 text-xs font-mono">
                  <button 
                    disabled={linkageModalPage === 1}
                    onClick={() => setLinkageModalPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1 bg-[#081b40] border border-[#133063] rounded text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer font-sans"
                  >
                    上一页
                  </button>
                  {[1, 2, 3, 4].map(p => (
                    <button
                      key={p}
                      onClick={() => setLinkageModalPage(p)}
                      className={`px-3 py-1 rounded font-bold cursor-pointer ${
                        linkageModalPage === p ? 'bg-cyan-600 text-white shadow' : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <span className="px-2 text-slate-500">...</span>
                  <button
                    onClick={() => setLinkageModalPage(8)}
                    className={`px-3 py-1 rounded font-bold cursor-pointer ${
                      linkageModalPage === 8 ? 'bg-cyan-600 text-white shadow' : 'bg-[#081b40] border border-[#133063] text-slate-300 hover:bg-[#0d2a63]'
                    }`}
                  >
                    8
                  </button>
                  <button 
                    disabled={linkageModalPage === 8}
                    onClick={() => setLinkageModalPage(prev => Math.min(prev + 1, 8))}
                    className="px-3 py-1 bg-[#081b40] border border-[#133063] rounded text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/40 cursor-pointer font-sans"
                  >
                    下一页
                  </button>
                </div>

                <button 
                  onClick={() => {
                    if (activeLinkageStrategy) {
                      setLinkageConfigs(prev => prev.map(l => l.id === activeLinkageStrategy.id ? { ...l, isEnabled: linkageStrategyEnabled, status: linkageStrategyEnabled ? '启用' : '停用' } : l));
                    }
                    setIsLinkageDeviceModalOpen(false);
                    triggerToast('已保存联动设备及联动动作策略');
                  }}
                  className="px-8 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg transition-all cursor-pointer text-xs"
                >
                  保存
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-MODAL: ADD LINKAGE DEVICE (添加联动设备点位) ==================== */}
      {isAddLinkageDevSubModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>新增联动设备</span>
              </h3>
              <button onClick={() => setIsAddLinkageDevSubModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">* 子系统</label>
                <select 
                  value={formSubLinkSys}
                  onChange={(e) => setFormSubLinkSys(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option>空调系统</option>
                  <option>智慧照明</option>
                  <option>排风系统</option>
                  <option>门禁系统</option>
                  <option>视频监控</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">* 设备类型</label>
                  <input 
                    type="text" 
                    value={formSubLinkDevType}
                    onChange={(e) => setFormSubLinkDevType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">品牌型号</label>
                  <input 
                    type="text" 
                    value={formSubLinkBrand}
                    onChange={(e) => setFormSubLinkBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">* 设备编号</label>
                  <input 
                    type="text" 
                    value={formSubLinkDevNo}
                    onChange={(e) => setFormSubLinkDevNo(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">设备位置</label>
                  <input 
                    type="text" 
                    value={formSubLinkLoc}
                    onChange={(e) => setFormSubLinkLoc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">联动动作模式</label>
                <input 
                  type="text" 
                  value={formSubLinkAction}
                  onChange={(e) => setFormSubLinkAction(e.target.value)}
                  placeholder="如: 【开】【25℃】"
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsAddLinkageDevSubModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={() => {
                  const newDev = {
                    id: `ldev-${Date.now()}`,
                    subsystem: formSubLinkSys,
                    deviceType: formSubLinkDevType,
                    brandModel: formSubLinkBrand,
                    devNo: formSubLinkDevNo,
                    location: formSubLinkLoc,
                    actionText: formSubLinkAction || '设置',
                    selected: false
                  };
                  setLinkageDevicesSubTable([...linkageDevicesSubTable, newDev]);
                  setIsAddLinkageDevSubModal(false);
                  triggerToast(`已新增联动设备: ${newDev.devNo}`);
                }}
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                加入策略
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-MODAL: ACTION SETTING (设置联动动作) ==================== */}
      {isActionSettingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-xs p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#133063]">
              <h3 className="font-bold text-cyan-300">配置联动动作参数</h3>
              <button onClick={() => setIsActionSettingModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">开关控制</label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-white cursor-pointer">
                    <input type="radio" name="actPwr" checked={actionPowerState === '开'} onChange={() => setActionPowerState('开')} className="text-cyan-500" />
                    <span>【开】</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-white cursor-pointer">
                    <input type="radio" name="actPwr" checked={actionPowerState === '关'} onChange={() => setActionPowerState('关')} className="text-cyan-500" />
                    <span>【关】</span>
                  </label>
                </div>
              </div>

              {actionPowerState === '开' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">设定温度 / 目标值</label>
                  <select 
                    value={actionTemp} 
                    onChange={(e) => setActionTemp(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>22℃</option>
                    <option>24℃</option>
                    <option>25℃</option>
                    <option>26℃</option>
                    <option>28℃</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsActionSettingModalOpen(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 font-bold cursor-pointer">取消</button>
              <button 
                onClick={() => {
                  if (activeActionDevId) {
                    const formatted = actionPowerState === '关' ? '【关】' : `【${actionPowerState}】【${actionTemp}】`;
                    setLinkageDevicesSubTable(prev => prev.map(d => d.id === activeActionDevId ? { ...d, actionText: formatted } : d));
                  }
                  setIsActionSettingModalOpen(false);
                  triggerToast('已修改关联动作');
                }}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD DEPARTMENT (新增部门) ==================== */}
      {isAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>新增部门</span>
              </h3>
              <button onClick={() => setIsAddDeptModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">* 部门名称</label>
                <input 
                  type="text" 
                  value={formDeptName}
                  onChange={(e) => setFormDeptName(e.target.value)}
                  placeholder="请填写部门名称 (如: 工程部)"
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">* 负责人</label>
                  <input 
                    type="text" 
                    value={formDeptManager}
                    onChange={(e) => setFormDeptManager(e.target.value)}
                    placeholder="请输入负责人姓名"
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">联系电话</label>
                  <input 
                    type="text" 
                    value={formDeptPhone}
                    onChange={(e) => setFormDeptPhone(e.target.value)}
                    placeholder="如: 13800138000"
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">部门功能说明</label>
                <textarea 
                  rows={2}
                  value={formDeptFunc}
                  onChange={(e) => setFormDeptFunc(e.target.value)}
                  placeholder="请详细描述该部门主要运维管理职责"
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">部门编制人数</label>
                  <input 
                    type="number" 
                    value={formDeptCount}
                    onChange={(e) => setFormDeptCount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">办公地点</label>
                  <input 
                    type="text" 
                    value={formDeptLocation}
                    onChange={(e) => setFormDeptLocation(e.target.value)}
                    placeholder="如: 1栋1层103"
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsAddDeptModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={() => {
                  if (!formDeptName) {
                    triggerToast('请填写部门名称！');
                    return;
                  }
                  const newDept = {
                    id: `d-${Date.now()}`,
                    name: formDeptName,
                    manager: formDeptManager || '待指定',
                    func: formDeptFunc || '负责相关运维管辖',
                    phone: formDeptPhone || '13800000000',
                    count: Number(formDeptCount) || 1,
                    location: formDeptLocation || '1栋1层'
                  };
                  setDepartmentList([newDept, ...departmentList]);
                  setIsAddDeptModal(false);
                  triggerToast(`成功新增部门: ${newDept.name}`);
                }}
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                保存部门
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT DEPARTMENT (编辑部门) ==================== */}
      {isEditDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Edit className="w-4 h-4 text-cyan-400" />
                <span>编辑部门信息</span>
              </h3>
              <button onClick={() => setIsEditDeptModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">* 部门名称</label>
                <input 
                  type="text" 
                  value={formDeptName}
                  onChange={(e) => setFormDeptName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">* 负责人</label>
                  <input 
                    type="text" 
                    value={formDeptManager}
                    onChange={(e) => setFormDeptManager(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">联系电话</label>
                  <input 
                    type="text" 
                    value={formDeptPhone}
                    onChange={(e) => setFormDeptPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">部门功能说明</label>
                <textarea 
                  rows={2}
                  value={formDeptFunc}
                  onChange={(e) => setFormDeptFunc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">部门编制人数</label>
                  <input 
                    type="number" 
                    value={formDeptCount}
                    onChange={(e) => setFormDeptCount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">办公地点</label>
                  <input 
                    type="text" 
                    value={formDeptLocation}
                    onChange={(e) => setFormDeptLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button onClick={() => setIsEditDeptModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
              <button 
                onClick={() => {
                  if (!activeEditingDeptId) return;
                  if (!formDeptName) {
                    triggerToast('请填写部门名称！');
                    return;
                  }
                  setDepartmentList(prev => prev.map(d => d.id === activeEditingDeptId ? {
                    ...d,
                    name: formDeptName,
                    manager: formDeptManager,
                    func: formDeptFunc,
                    phone: formDeptPhone,
                    count: Number(formDeptCount) || d.count,
                    location: formDeptLocation
                  } : d));
                  setIsEditDeptModal(false);
                  triggerToast(`成功修改部门信息: ${formDeptName}`);
                }}
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD STAFF MODAL (新增人员) ==================== */}
      {isAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-xl w-full max-w-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <div className="border-b-2 border-cyan-400 pb-1">
                <h3 className="text-sm font-bold text-cyan-300">新增人员</h3>
              </div>
              <button 
                onClick={() => setIsAddStaffModal(false)}
                className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2-Column Form Layout matching image_86668fec.png */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-16 text-slate-300">人员姓名</span>
                  <input
                    type="text"
                    placeholder="请填写人员姓名"
                    value={formStaffName}
                    onChange={e => setFormStaffName(e.target.value)}
                    className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-16 text-slate-300">性 别</span>
                  <div className="flex items-center gap-6 text-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="addStaffGender" value="男" checked={formStaffGender === '男'} onChange={() => setFormStaffGender('男')} className="accent-cyan-500" />
                      <span>男</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="addStaffGender" value="女" checked={formStaffGender === '女'} onChange={() => setFormStaffGender('女')} className="accent-cyan-500" />
                      <span>女</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-16 text-slate-300">状 态</span>
                  <div className="flex items-center gap-6 text-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="addStaffStatus" value="在职" checked={formStaffStatus === '在职'} onChange={() => setFormStaffStatus('在职')} className="accent-cyan-500" />
                      <span>在职</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="addStaffStatus" value="离职" checked={formStaffStatus === '离职'} onChange={() => setFormStaffStatus('离职')} className="accent-cyan-500" />
                      <span>离职</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-4">
                    <span className="w-16 text-slate-300 pl-3">人脸图像</span>
                    <button
                      type="button"
                      onClick={() => {
                        const chineseMaleAvatars = [
                          '/assets/images/chinese_man1.jpg',
                          '/assets/images/chinese_man2.jpg',
                          '/assets/images/chinese_man3.jpg',
                          '/assets/images/chinese_man4.jpg'
                        ];
                        const chineseFemaleAvatars = [
                          '/assets/images/chinese_woman1.jpg',
                          '/assets/images/chinese_woman2.jpg',
                          '/assets/images/chinese_woman3.jpg'
                        ];
                        const list = formStaffGender === '女' ? chineseFemaleAvatars : chineseMaleAvatars;
                        const next = list[(list.indexOf(formStaffAvatar) + 1) % list.length] || list[0];
                        setFormStaffAvatar(next);
                        triggerToast('已成功选择人脸像库中的中国员工头像');
                      }}
                      className="px-4 py-1.5 rounded border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 font-bold cursor-pointer transition-all"
                    >
                      上传
                    </button>
                    <span className="text-slate-400">PNG/JPG &lt;2M</span>
                  </div>
                  <div className="pl-20">
                    <div className="w-24 h-32 rounded border-2 border-cyan-400 overflow-hidden bg-slate-950 shadow-md flex items-center justify-center">
                      {formStaffAvatar ? (
                        <img src={formStaffAvatar} alt="人脸预览" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-cyan-400/70 p-2 text-center gap-1.5">
                          <Users className="w-6 h-6 opacity-60" />
                          <span className="text-[10px] text-slate-400">暂无人脸图像</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-20 text-slate-300">所属部门</span>
                  <select
                    value={formStaffDept}
                    onChange={e => setFormStaffDept(e.target.value)}
                    className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-cyan-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="工程部">工程部</option>
                    <option value="工程一队">工程一队</option>
                    <option value="安保部">安保部</option>
                    <option value="安保二队">安保二队</option>
                    <option value="调度指挥中心">调度指挥中心</option>
                    <option value="暖通维保工程队">暖通维保工程队</option>
                    <option value="变配电工程组">变配电工程组</option>
                    <option value="行政综合后勤部">行政综合后勤部</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-20 text-slate-300">身 份 证</span>
                  <input
                    type="text"
                    placeholder="请填写身份证号码"
                    value={formStaffIdCard}
                    onChange={e => setFormStaffIdCard(e.target.value)}
                    className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-20 text-slate-300">手机号码</span>
                  <input
                    type="text"
                    placeholder="请填写11位手机号码"
                    value={formStaffPhone}
                    onChange={e => setFormStaffPhone(e.target.value)}
                    className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-20 text-slate-300 pl-3">启用手机为登录账号</span>
                  <div className="flex items-center gap-6 text-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="addStaffLogin" value="启用" checked={formStaffEnableLogin === '启用'} onChange={() => setFormStaffEnableLogin('启用')} className="accent-cyan-500" />
                      <span>启用</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="addStaffLogin" value="禁止" checked={formStaffEnableLogin === '禁止'} onChange={() => setFormStaffEnableLogin('禁止')} className="accent-cyan-500" />
                      <span>禁止</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-slate-300 pl-3">输入密码</span>
                    <input
                      type="password"
                      placeholder="请输入6位密码"
                      value={formStaffPassword}
                      onChange={e => setFormStaffPassword(e.target.value)}
                      className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <p className="pl-24 text-[11px] text-slate-400">默认密码为123456</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => {
                  if (!formStaffName.trim()) {
                    triggerToast('请填写人员姓名！');
                    return;
                  }
                  if (!formStaffIdCard.trim()) {
                    triggerToast('请填写身份证号码！');
                    return;
                  }
                  if (!formStaffPhone.trim()) {
                    triggerToast('请填写手机号码！');
                    return;
                  }
                  const newStaff = {
                    id: `stf-${Date.now()}`,
                    name: formStaffName.trim(),
                    avatar: formStaffAvatar,
                    dept: formStaffDept,
                    gender: formStaffGender,
                    idCard: formStaffIdCard.trim(),
                    phone: formStaffPhone.trim(),
                    status: formStaffStatus,
                    enablePhoneLogin: formStaffEnableLogin,
                    password: formStaffPassword || '123456',
                  };
                  setStaffDataList(prev => [newStaff, ...prev]);
                  setIsAddStaffModal(false);
                  triggerToast(`成功新增人员档案【${newStaff.name}】`);
                }}
                className="px-8 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT STAFF MODAL (人员编辑 - Matching image_86668fec.png) ==================== */}
      {isEditStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-xl w-full max-w-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <div className="border-b-2 border-cyan-400 pb-1">
                <h3 className="text-sm font-bold text-cyan-300">人员编辑</h3>
              </div>
              <button 
                onClick={() => setIsEditStaffModal(false)}
                className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2-Column Form Layout matching image_86668fec.png */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-16 text-slate-300">人员姓名</span>
                  <input
                    type="text"
                    placeholder="请填写人员姓名"
                    value={formStaffName}
                    onChange={e => setFormStaffName(e.target.value)}
                    className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-16 text-slate-300">性 别</span>
                  <div className="flex items-center gap-6 text-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="editStaffGender" value="男" checked={formStaffGender === '男'} onChange={() => setFormStaffGender('男')} className="accent-cyan-500" />
                      <span>男</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="editStaffGender" value="女" checked={formStaffGender === '女'} onChange={() => setFormStaffGender('女')} className="accent-cyan-500" />
                      <span>女</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-16 text-slate-300">状 态</span>
                  <div className="flex items-center gap-6 text-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="editStaffStatus" value="在职" checked={formStaffStatus === '在职'} onChange={() => setFormStaffStatus('在职')} className="accent-cyan-500" />
                      <span>在职</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="editStaffStatus" value="离职" checked={formStaffStatus === '离职'} onChange={() => setFormStaffStatus('离职')} className="accent-cyan-500" />
                      <span>离职</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-4">
                    <span className="w-16 text-slate-300 pl-3">人脸图像</span>
                    <button
                      type="button"
                      onClick={() => {
                        const chineseMaleAvatars = [
                          '/assets/images/chinese_man1.jpg',
                          '/assets/images/chinese_man2.jpg',
                          '/assets/images/chinese_man3.jpg',
                          '/assets/images/chinese_man4.jpg'
                        ];
                        const chineseFemaleAvatars = [
                          '/assets/images/chinese_woman1.jpg',
                          '/assets/images/chinese_woman2.jpg',
                          '/assets/images/chinese_woman3.jpg'
                        ];
                        const list = formStaffGender === '女' ? chineseFemaleAvatars : chineseMaleAvatars;
                        const next = list[(list.indexOf(formStaffAvatar) + 1) % list.length] || list[0];
                        setFormStaffAvatar(next);
                        triggerToast('已切换为中方员工人脸像库照片');
                      }}
                      className="px-4 py-1.5 rounded border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20 font-bold cursor-pointer transition-all"
                    >
                      上传
                    </button>
                    <span className="text-slate-400">PNG/JPG &lt;2M</span>
                  </div>
                  <div className="pl-20">
                    <div className="w-24 h-32 rounded border-2 border-cyan-400 overflow-hidden bg-slate-950 shadow-md">
                      <img src={formStaffAvatar || '/assets/images/chinese_man1.jpg'} alt="人脸预览" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-20 text-slate-300">所属部门</span>
                  <select
                    value={formStaffDept}
                    onChange={e => setFormStaffDept(e.target.value)}
                    className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-cyan-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="工程部">工程部</option>
                    <option value="工程一队">工程一队</option>
                    <option value="安保部">安保部</option>
                    <option value="安保二队">安保二队</option>
                    <option value="调度指挥中心">调度指挥中心</option>
                    <option value="暖通维保工程队">暖通维保工程队</option>
                    <option value="变配电工程组">变配电工程组</option>
                    <option value="行政综合后勤部">行政综合后勤部</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-20 text-slate-300">身 份 证</span>
                  <input
                    type="text"
                    placeholder="请填写身份证号码"
                    value={formStaffIdCard}
                    onChange={e => setFormStaffIdCard(e.target.value)}
                    className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">*</span>
                  <span className="w-20 text-slate-300">手机号码</span>
                  <input
                    type="text"
                    placeholder="请填写11位手机号码"
                    value={formStaffPhone}
                    onChange={e => setFormStaffPhone(e.target.value)}
                    className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-20 text-slate-300 pl-3">启用手机为登录账号</span>
                  <div className="flex items-center gap-6 text-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="editStaffLogin" value="启用" checked={formStaffEnableLogin === '启用'} onChange={() => setFormStaffEnableLogin('启用')} className="accent-cyan-500" />
                      <span>启用</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="editStaffLogin" value="禁止" checked={formStaffEnableLogin === '禁止'} onChange={() => setFormStaffEnableLogin('禁止')} className="accent-cyan-500" />
                      <span>禁止</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-slate-300 pl-3">输入密码</span>
                    <input
                      type="password"
                      placeholder="请输入6位密码"
                      value={formStaffPassword}
                      onChange={e => setFormStaffPassword(e.target.value)}
                      className="flex-1 bg-[#030a1c] border border-slate-700 rounded px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <p className="pl-24 text-[11px] text-slate-400">默认密码为123456</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => {
                  if (!activeEditingStaffId) return;
                  if (!formStaffName.trim()) {
                    triggerToast('请填写人员姓名！');
                    return;
                  }
                  setStaffDataList(prev => prev.map(s => s.id === activeEditingStaffId ? {
                    ...s,
                    name: formStaffName.trim(),
                    avatar: formStaffAvatar,
                    dept: formStaffDept,
                    gender: formStaffGender,
                    idCard: formStaffIdCard.trim(),
                    phone: formStaffPhone.trim(),
                    status: formStaffStatus,
                    enablePhoneLogin: formStaffEnableLogin,
                    password: formStaffPassword || '123456',
                  } : s));
                  setIsEditStaffModal(false);
                  triggerToast(`成功保存人员修改【${formStaffName}】`);
                }}
                className="px-8 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GLOBAL DELETE CONFIRMATION MODAL (通用删除确认弹窗) ==================== */}
      {deleteConfirmConfig.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#06122d] border border-red-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>{deleteConfirmConfig.title || '确认删除'}</span>
              </h3>
              <button 
                onClick={() => setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }))} 
                className="text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-200 leading-relaxed py-2">
              {deleteConfirmConfig.message}
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
              <button 
                onClick={() => setDeleteConfirmConfig(prev => ({ ...prev, isOpen: false }))} 
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-all"
              >
                取消
              </button>
              <button 
                onClick={deleteConfirmConfig.onConfirm}
                className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg cursor-pointer transition-all"
              >
                确认删除
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

