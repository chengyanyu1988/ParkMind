/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wrench, 
  BookOpen, 
  FileText, 
  ClipboardCheck, 
  CalendarCheck, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown,
  User, 
  MapPin, 
  Building2,
  Sliders,
  ShieldCheck,
  Truck,
  Settings,
  ClipboardList,
  QrCode,
  X
} from 'lucide-react';
import { 
  DeviceItem, 
  WorkOrderItem, 
  InspectionTask, 
  MaintenancePlan, 
  SubsystemType,
  WorkOrderStatus 
} from '../types/ibms';

interface MaintenanceViewProps {
  devices: DeviceItem[];
  workOrders: WorkOrderItem[];
  inspections: InspectionTask[];
  maintenancePlans: MaintenancePlan[];
  onOpenDevice: (device: DeviceItem) => void;
  onOpenCreateWorkOrder: () => void;
  onUpdateWorkOrderStatus: (id: string, status: WorkOrderStatus) => void;
}

export const maskPhone = (phone?: string) => {
  if (!phone) return '-';
  const str = phone.trim();
  if (str.length === 11) {
    return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  if (str.length >= 7) {
    const headLen = Math.min(3, Math.floor(str.length / 3));
    const tailLen = Math.min(3, Math.floor(str.length / 3));
    return str.substring(0, headLen) + '****' + str.substring(str.length - tailLen);
  }
  return str;
};

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  devices,
  workOrders,
  inspections,
  maintenancePlans,
  onOpenDevice,
  onOpenCreateWorkOrder,
  onUpdateWorkOrderStatus
}) => {
  // Left menu navigation states
  const [activeSecondary, setActiveSecondary] = useState<string>('设备维修');
  const [activeTertiary, setActiveTertiary] = useState<string>('报修申请');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '设备维修': true,
    '设备巡检': true,
    '设备维保': true,
    '工单管理': true,
    '供应商管理': true,
  });

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // 10 Recent Maintenance Dynamic Info Items matching screenshot image_46d2f83f.png with recent timestamps
  const [maintenanceFeedItems, setMaintenanceFeedItems] = useState([
    { id: 'm-1', title: '1栋2层公区走廊_照明设备', code: 'GDBX202611060010', reporter: 'admin', reportTime: '2026-11-06 16:01', assignee: '李姚明', assignTime: '2026-11-06 18:20', status: '处理中' },
    { id: 'm-2', title: '1栋3层公区走廊_照明设备', code: 'GDBX202611060009', reporter: 'vkja123', reportTime: '2026-11-06 13:00', assignee: '李姚明', assignTime: '2026-11-06 18:11', status: '处理中' },
    { id: 'm-3', title: '1栋2层公区走廊_空调设备', code: 'GDBX202611060008', reporter: 'admin', reportTime: '2026-11-05 16:00', assignee: '李姚明', assignTime: '2026-11-05 18:12', status: '处理中' },
    { id: 'm-4', title: '1栋1层公区走廊_监控设备', code: 'GDBX202611050007', reporter: 'admin1', reportTime: '2026-11-05 13:00', assignee: '李姚明', assignTime: '2026-11-05 14:12', status: '处理中' },
    { id: 'm-5', title: '1栋2层公区走廊_照明设备', code: 'GDBX202611050006', reporter: 'zhaole', reportTime: '2026-11-04 13:20', assignee: '李姚明', assignTime: '2026-11-04 18:12', status: '处理超时' },
    { id: 'm-6', title: '1栋2层公区走廊_照明设备', code: 'GDBX202611040005', reporter: 'chenV', reportTime: '2026-11-04 19:12', assignee: '李姚明', assignTime: '2026-11-04 18:00', status: '已完成' },
    { id: 'm-7', title: '2号楼1层大堂_门禁道闸设备', code: 'GDBX202611040004', reporter: 'wangwei', reportTime: '2026-11-04 10:15', assignee: '张海波', assignTime: '2026-11-04 11:00', status: '已完成' },
    { id: 'm-8', title: '2号楼3层会议室_新风机组', code: 'GDBX202611030003', reporter: 'liqiang', reportTime: '2026-11-03 14:20', assignee: '陈工', assignTime: '2026-11-03 15:00', status: '处理中' },
    { id: 'm-9', title: '3号楼地下车库_给排水泵', code: 'GDBX202611030002', reporter: 'zheng', reportTime: '2026-11-03 08:30', assignee: '张海波', assignTime: '2026-11-03 09:10', status: '已完成' },
    { id: 'm-10', title: '研发大厦顶楼_冷却塔电机', code: 'GDBX202611020001', reporter: 'admin', reportTime: '2026-11-02 11:00', assignee: '李姚明', assignTime: '2026-11-02 12:00', status: '已完成' },
  ]);

  // Dedicated pagination page states for all 9 O&M lists
  const [inspPlanPage, setInspPlanPage] = useState(1);
  const [inspRecordPage, setInspRecordPage] = useState(1);
  const [maintPlanPage, setMaintPlanPage] = useState(1);
  const [maintRecordPage, setMaintRecordPage] = useState(1);
  const [repairOrderPage, setRepairOrderPage] = useState(1);
  const [inspOrderPage, setInspOrderPage] = useState(1);
  const [maintOrderPage, setMaintOrderPage] = useState(1);
  const [configPage, setConfigPage] = useState(1);
  const [supplierPage, setSupplierPage] = useState(1);

  // Inspection Plan states matching screenshot image_6756fb48.png (25 items for multi-page interaction)
  const [inspectionPlanList, setInspectionPlanList] = useState([
    { id: 'ip-1', name: '照明月计划', type: '周期计划', deviceType: '照明设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin1' },
    { id: 'ip-2', name: '空调月计划', type: '周期计划', deviceType: '空调设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin2' },
    { id: 'ip-3', name: '给排水巡检月计划', type: '周期计划', deviceType: '给排水设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin1' },
    { id: 'ip-4', name: '消防系统季度巡检', type: '周期计划', deviceType: '消防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin3' },
    { id: 'ip-5', name: '变配电日常巡检计划', type: '周期计划', deviceType: '电气设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '日检', status: '启用', creator: 'admin2' },
    { id: 'ip-6', name: '视频监控周巡检计划', type: '周期计划', deviceType: '安防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '周检', status: '启用', creator: 'admin4' },
    { id: 'ip-7', name: '电梯安全月度巡检计划', type: '周期计划', deviceType: '特种设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin1' },
    { id: 'ip-8', name: '新风机组季度维护计划', type: '周期计划', deviceType: '暖通设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin3' },
    { id: 'ip-9', name: '智能门禁半年巡检计划', type: '周期计划', deviceType: '弱电系统', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '半年检', status: '启用', creator: 'admin2' },
    { id: 'ip-10', name: '园区夜间综合亮化巡检', type: '周期计划', deviceType: '照明设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '日检', status: '启用', creator: 'admin4' },
    { id: 'ip-11', name: '高低压配电室日巡检', type: '周期计划', deviceType: '电气设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '日检', status: '启用', creator: 'admin1' },
    { id: 'ip-12', name: '水泵房防汛排涝专项巡检', type: '周期计划', deviceType: '给排水设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin2' },
    { id: 'ip-13', name: '冷却塔水质与电机巡检', type: '周期计划', deviceType: '暖通设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '周检', status: '启用', creator: 'admin3' },
    { id: 'ip-14', name: '周界红外对射防区巡检', type: '周期计划', deviceType: '安防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin4' },
    { id: 'ip-15', name: '应急疏散指示灯专项巡检', type: '周期计划', deviceType: '消防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin1' },
    { id: 'ip-16', name: '弱电机房UPS电源巡检', type: '周期计划', deviceType: '弱电系统', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '周检', status: '启用', creator: 'admin2' },
    { id: 'ip-17', name: '自动人行道闸安全巡检', type: '周期计划', deviceType: '安防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin3' },
    { id: 'ip-18', name: '楼宇自控DDC控制器巡检', type: '周期计划', deviceType: '暖通设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin4' },
    { id: 'ip-19', name: '光伏发电设备月度巡检', type: '周期计划', deviceType: '电气设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin1' },
    { id: 'ip-20', name: '气体灭火系统定期巡检', type: '周期计划', deviceType: '消防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '半年检', status: '启用', creator: 'admin2' },
    { id: 'ip-21', name: '无负压供水设备巡检', type: '周期计划', deviceType: '给排水设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '周检', status: '启用', creator: 'admin3' },
    { id: 'ip-22', name: '人脸识别门禁终端巡检', type: '周期计划', deviceType: '弱电系统', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin4' },
    { id: 'ip-23', name: '客梯扶梯急停按钮测试', type: '周期计划', deviceType: '特种设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '周检', status: '启用', creator: 'admin1' },
    { id: 'ip-24', name: '车库CO传感器校准巡检', type: '周期计划', deviceType: '弱电系统', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin2' },
    { id: 'ip-25', name: '景观喷泉水泵控制柜巡检', type: '周期计划', deviceType: '给排水设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin3' },
  ]);

  const [inspectionQueryName, setInspectionQueryName] = useState('');
  const [inspectionQueryType, setInspectionQueryType] = useState('周期计划');
  const [inspectionStartDate, setInspectionStartDate] = useState('2026-11-01');
  const [inspectionEndDate, setInspectionEndDate] = useState('2026-11-30');

  const [isAddInspModalOpen, setIsAddInspModalOpen] = useState(false);
  const [isEditInspModalOpen, setIsEditInspModalOpen] = useState(false);
  const [isDetailInspModalOpen, setIsDetailInspModalOpen] = useState(false);
  const [selectedInspItem, setSelectedInspItem] = useState<any>(null);

  const [inspFormName, setInspFormName] = useState('');
  const [inspFormType, setInspFormType] = useState('周期计划');
  const [inspFormDeviceType, setInspFormDeviceType] = useState('照明设备');
  const [inspFormFrequency, setInspFormFrequency] = useState('年检');
  const [inspFormIsEnabled, setInspFormIsEnabled] = useState('是');

  // Inspection Record states matching screenshot image_d89ce9f3.png (25 items)
  const [inspectionRecordList, setInspectionRecordList] = useState([
    { id: 'rec-1', name: '照明月计划', deviceType: '照明设备', type: '月检', planTime: '2026-11-06 16:40', executor: '刘大牛', inspectTime: '2026-11-06 16:40', status: '进行中' },
    { id: 'rec-2', name: '空调月计划', deviceType: '空调设备', type: '月检', planTime: '2026-11-06 16:40', executor: '李小花', inspectTime: '2026-11-06 16:40', status: '进行中' },
    { id: 'rec-3', name: '给排水巡检月计划', deviceType: '给排水设备', type: '月检', planTime: '2026-11-05 10:30', executor: '张海波', inspectTime: '2026-11-05 10:35', status: '已完成' },
    { id: 'rec-4', name: '消防系统季度巡检', deviceType: '消防设备', type: '季检', planTime: '2026-11-04 14:00', executor: '王工', inspectTime: '2026-11-04 14:20', status: '已完成' },
    { id: 'rec-5', name: '变配电日常巡检计划', deviceType: '电气设备', type: '日检', planTime: '2026-11-04 09:00', executor: '李姚明', inspectTime: '2026-11-04 09:10', status: '已完成' },
    { id: 'rec-6', name: '视频监控周巡检计划', deviceType: '安防设备', type: '周检', planTime: '2026-11-03 15:30', executor: '陈工', inspectTime: '2026-11-03 15:45', status: '已完成' },
    { id: 'rec-7', name: '电梯安全月度巡检计划', deviceType: '特种设备', type: '月检', planTime: '2026-11-03 11:00', executor: '赵主管', inspectTime: '2026-11-03 11:15', status: '已完成' },
    { id: 'rec-8', name: '新风机组季度维护计划', deviceType: '暖通设备', type: '季检', planTime: '2026-11-02 13:20', executor: '刘大牛', inspectTime: '2026-11-02 13:40', status: '已完成' },
    { id: 'rec-9', name: '智能门禁半年巡检计划', deviceType: '弱电系统', type: '半年检', planTime: '2026-11-01 09:30', executor: '李小花', inspectTime: '2026-11-01', status: '进行中' },
    { id: 'rec-10', name: '园区夜间综合亮化巡检', deviceType: '照明设备', type: '日检', planTime: '2026-11-01 20:00', executor: '张海波', inspectTime: '2026-11-01', status: '进行中' },
    { id: 'rec-11', name: '高低压配电室日巡检', deviceType: '电气设备', type: '日检', planTime: '2026-11-01 08:30', executor: '李姚明', inspectTime: '2026-11-01 08:45', status: '已完成' },
    { id: 'rec-12', name: '水泵房防汛排涝专项巡检', deviceType: '给排水设备', type: '月检', planTime: '2026-10-31 10:00', executor: '王工', inspectTime: '2026-10-31 10:20', status: '已完成' },
    { id: 'rec-13', name: '冷却塔水质与电机巡检', deviceType: '暖通设备', type: '周检', planTime: '2026-10-30 14:15', executor: '陈工', inspectTime: '2026-10-30 14:30', status: '已完成' },
    { id: 'rec-14', name: '周界红外对射防区巡检', deviceType: '安防设备', type: '月检', planTime: '2026-10-29 09:00', executor: '赵主管', inspectTime: '2026-10-29 09:15', status: '已完成' },
    { id: 'rec-15', name: '应急疏散指示灯专项巡检', deviceType: '消防设备', type: '季检', planTime: '2026-10-28 16:00', executor: '刘大牛', inspectTime: '2026-10-28 16:30', status: '已完成' },
    { id: 'rec-16', name: '弱电机房UPS电源巡检', deviceType: '弱电系统', type: '周检', planTime: '2026-10-27 11:30', executor: '李小花', inspectTime: '2026-10-27 11:45', status: '已完成' },
    { id: 'rec-17', name: '自动人行道闸安全巡检', deviceType: '安防设备', type: '月检', planTime: '2026-10-26 15:00', executor: '张海波', inspectTime: '2026-10-26 15:15', status: '已完成' },
    { id: 'rec-18', name: '楼宇自控DDC控制器巡检', deviceType: '暖通设备', type: '月检', planTime: '2026-10-25 09:20', executor: '陈工', inspectTime: '2026-10-25 09:40', status: '已完成' },
    { id: 'rec-19', name: '光伏发电设备月度巡检', deviceType: '电气设备', type: '月检', planTime: '2026-10-24 14:00', executor: '李姚明', inspectTime: '2026-10-24 14:20', status: '已完成' },
    { id: 'rec-20', name: '气体灭火系统定期巡检', deviceType: '消防设备', type: '半年检', planTime: '2026-10-23 10:30', executor: '王工', inspectTime: '2026-10-23 11:00', status: '已完成' },
    { id: 'rec-21', name: '无负压供水设备巡检', deviceType: '给排水设备', type: '周检', planTime: '2026-10-22 16:10', executor: '刘大牛', inspectTime: '2026-10-22 16:25', status: '已完成' },
    { id: 'rec-22', name: '人脸识别门禁终端巡检', deviceType: '弱电系统', type: '月检', planTime: '2026-10-21 13:40', executor: '李小花', inspectTime: '2026-10-21 13:55', status: '已完成' },
    { id: 'rec-23', name: '客梯扶梯急停按钮测试', deviceType: '特种设备', type: '周检', planTime: '2026-10-20 09:10', executor: '赵主管', inspectTime: '2026-10-20 09:25', status: '已完成' },
    { id: 'rec-24', name: '车库CO传感器校准巡检', deviceType: '弱电系统', type: '季检', planTime: '2026-10-19 15:30', executor: '张海波', inspectTime: '2026-10-19 15:50', status: '已完成' },
    { id: 'rec-25', name: '景观喷泉水泵控制柜巡检', deviceType: '给排水设备', type: '月检', planTime: '2026-10-18 11:00', executor: '陈工', inspectTime: '2026-10-18 11:20', status: '已完成' },
  ]);
  const [recordQueryExecutor, setRecordQueryExecutor] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedRecordItem, setSelectedRecordItem] = useState<any>(null);

  // Maintenance Plan states matching screenshot image_bcc035e1.png (25 items)
  const [maintenancePlanList, setMaintenancePlanList] = useState([
    { id: 'mp-1', name: '中央空调末端维保计划', type: '周期计划', deviceType: '暖通设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin1' },
    { id: 'mp-2', name: '变配电系统季度维保', type: '周期计划', deviceType: '电气设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin2' },
    { id: 'mp-3', name: '消防泵房及喷淋维保', type: '周期计划', deviceType: '消防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin1' },
    { id: 'mp-4', name: '智能照明回路维保计划', type: '周期计划', deviceType: '照明设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '半年检', status: '启用', creator: 'admin3' },
    { id: 'mp-5', name: '电梯运行安全定期维保', type: '周期计划', deviceType: '特种设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin2' },
    { id: 'mp-6', name: '给排水管网及泵站维保', type: '周期计划', deviceType: '给排水设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin4' },
    { id: 'mp-7', name: '视频监控与门禁系统维保', type: '周期计划', deviceType: '安防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin1' },
    { id: 'mp-8', name: '新风机组滤网更换维保', type: '周期计划', deviceType: '暖通设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin3' },
    { id: 'mp-9', name: '弱电机房精密空调维保', type: '周期计划', deviceType: '弱电系统', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin2' },
    { id: 'mp-10', name: '园区夜景照明专业维保', type: '周期计划', deviceType: '照明设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin4' },
    { id: 'mp-11', name: '冷水机组深度除垢保养', type: '周期计划', deviceType: '暖通设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '半年检', status: '启用', creator: 'admin1' },
    { id: 'mp-12', name: '高压柜断路器润滑检修', type: '周期计划', deviceType: '电气设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '半年检', status: '启用', creator: 'admin2' },
    { id: 'mp-13', name: '消火栓泵及压力阀测试', type: '周期计划', deviceType: '消防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin3' },
    { id: 'mp-14', name: '景观水系循环泵维护', type: '周期计划', deviceType: '给排水设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin4' },
    { id: 'mp-15', name: '人行闸机电机与齿轮保养', type: '周期计划', deviceType: '安防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin1' },
    { id: 'mp-16', name: '核心交换机散热除尘', type: '周期计划', deviceType: '弱电系统', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '半年检', status: '启用', creator: 'admin2' },
    { id: 'mp-17', name: '消防水箱液位计校准', type: '周期计划', deviceType: '消防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin3' },
    { id: 'mp-18', name: '地下车库风机控制箱维保', type: '周期计划', deviceType: '暖通设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin4' },
    { id: 'mp-19', name: '光伏逆变器滤波清扫', type: '周期计划', deviceType: '电气设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '半年检', status: '启用', creator: 'admin1' },
    { id: 'mp-20', name: '客梯钢丝绳张力与平衡调整', type: '周期计划', deviceType: '特种设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin2' },
    { id: 'mp-21', name: '弱电综合布线柜整理', type: '周期计划', deviceType: '弱电系统', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '年检', status: '启用', creator: 'admin3' },
    { id: 'mp-22', name: '稳压给排水泵加压测试', type: '周期计划', deviceType: '给排水设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin4' },
    { id: 'mp-23', name: '楼宇亮化LED控制器校时', type: '周期计划', deviceType: '照明设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '月检', status: '启用', creator: 'admin1' },
    { id: 'mp-24', name: '机房蓄电池组放电维保', type: '周期计划', deviceType: '电气设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '半年检', status: '启用', creator: 'admin2' },
    { id: 'mp-25', name: '防盗告警探测器灵敏度测试', type: '周期计划', deviceType: '安防设备', startDate: '2026-11-01', endDate: '2027-11-01', frequency: '季检', status: '启用', creator: 'admin3' },
  ]);

  const [maintQueryName, setMaintQueryName] = useState('');
  const [maintQueryType, setMaintQueryType] = useState('周期计划');
  const [isAddMaintModalOpen, setIsAddMaintModalOpen] = useState(false);
  const [isEditMaintModalOpen, setIsEditMaintModalOpen] = useState(false);
  const [isDetailMaintModalOpen, setIsDetailMaintModalOpen] = useState(false);
  const [selectedMaintItem, setSelectedMaintItem] = useState<any>(null);
  const [maintFormName, setMaintFormName] = useState('');
  const [maintFormType, setMaintFormType] = useState('周期计划');
  const [maintFormDeviceType, setMaintFormDeviceType] = useState('门禁设备');
  const [maintFormFrequency, setMaintFormFrequency] = useState('年保');
  const [maintFormIsEnabled, setMaintFormIsEnabled] = useState('是');

  // Maintenance Record states matching screenshot image_f74efad8.png (25 items)
  const [maintenanceRecordList, setMaintenanceRecordList] = useState([
    { id: 'mrec-1', name: '中央空调末端维保计划', deviceType: '暖通设备', type: '月保', planTime: '2026-11-06 16:40', executor: '刘大牛', inspectTime: '2026-11-06 16:40', status: '进行中' },
    { id: 'mrec-2', name: '变配电系统季度维保', deviceType: '电气设备', type: '季保', planTime: '2026-11-06 16:40', executor: '李小花', inspectTime: '2026-11-06 16:40', status: '进行中' },
    { id: 'mrec-3', name: '消防泵房及喷淋维保', deviceType: '消防设备', type: '月保', planTime: '2026-11-05 10:30', executor: '张海波', inspectTime: '2026-11-05 10:35', status: '已完成' },
    { id: 'mrec-4', name: '智能照明回路维保计划', deviceType: '照明设备', type: '半年保', planTime: '2026-11-04 14:00', executor: '王工', inspectTime: '2026-11-04 14:20', status: '已完成' },
    { id: 'mrec-5', name: '电梯运行安全定期维保', deviceType: '特种设备', type: '月保', planTime: '2026-11-04 09:00', executor: '李姚明', inspectTime: '2026-11-04 09:10', status: '已完成' },
    { id: 'mrec-6', name: '给排水管网及泵站维保', deviceType: '给排水设备', type: '月保', planTime: '2026-11-03 15:30', executor: '陈工', inspectTime: '2026-11-03 15:45', status: '已完成' },
    { id: 'mrec-7', name: '视频监控与门禁系统维保', deviceType: '安防设备', type: '季保', planTime: '2026-11-03 11:00', executor: '赵主管', inspectTime: '2026-11-03 11:15', status: '已完成' },
    { id: 'mrec-8', name: '新风机组滤网更换维保', deviceType: '暖通设备', type: '月保', planTime: '2026-11-02 13:20', executor: '刘大牛', inspectTime: '2026-11-02 13:40', status: '已完成' },
    { id: 'mrec-9', name: '弱电机房精密空调维保', deviceType: '弱电系统', type: '月保', planTime: '2026-11-01 09:30', executor: '李小花', inspectTime: '2026-11-01', status: '进行中' },
    { id: 'mrec-10', name: '园区夜景照明专业维保', deviceType: '照明设备', type: '季保', planTime: '2026-11-01 20:00', executor: '张海波', inspectTime: '2026-11-01', status: '进行中' },
    { id: 'mrec-11', name: '冷水机组深度除垢保养', deviceType: '暖通设备', type: '半年保', planTime: '2026-10-31 10:00', executor: '李姚明', inspectTime: '2026-10-31 10:30', status: '已完成' },
    { id: 'mrec-12', name: '高压柜断路器润滑检修', deviceType: '电气设备', type: '半年保', planTime: '2026-10-30 14:00', executor: '王工', inspectTime: '2026-10-30 14:25', status: '已完成' },
    { id: 'mrec-13', name: '消火栓泵及压力阀测试', deviceType: '消防设备', type: '季保', planTime: '2026-10-29 09:30', executor: '陈工', inspectTime: '2026-10-29 09:50', status: '已完成' },
    { id: 'mrec-14', name: '景观水系循环泵维护', deviceType: '给排水设备', type: '月保', planTime: '2026-10-28 15:10', executor: '赵主管', inspectTime: '2026-10-28 15:30', status: '已完成' },
    { id: 'mrec-15', name: '人行闸机电机与齿轮保养', deviceType: '安防设备', type: '季保', planTime: '2026-10-27 11:00', executor: '刘大牛', inspectTime: '2026-10-27 11:20', status: '已完成' },
    { id: 'mrec-16', name: '核心交换机散热除尘', deviceType: '弱电系统', type: '半年保', planTime: '2026-10-26 16:20', executor: '李小花', inspectTime: '2026-10-26 16:40', status: '已完成' },
    { id: 'mrec-17', name: '消防水箱液位计校准', deviceType: '消防设备', type: '季保', planTime: '2026-10-25 10:00', executor: '张海波', inspectTime: '2026-10-25 10:20', status: '已完成' },
    { id: 'mrec-18', name: '地下车库风机控制箱维保', deviceType: '暖通设备', type: '季保', planTime: '2026-10-24 14:30', executor: '李姚明', inspectTime: '2026-10-24 14:50', status: '已完成' },
    { id: 'mrec-19', name: '光伏逆变器滤波清扫', deviceType: '电气设备', type: '半年保', planTime: '2026-10-23 09:15', executor: '王工', inspectTime: '2026-10-23 09:35', status: '已完成' },
    { id: 'mrec-20', name: '客梯钢丝绳张力与平衡调整', deviceType: '特种设备', type: '季保', planTime: '2026-10-22 13:00', executor: '陈工', inspectTime: '2026-10-22 13:30', status: '已完成' },
    { id: 'mrec-21', name: '弱电综合布线柜整理', deviceType: '弱电系统', type: '年保', planTime: '2026-10-21 15:40', executor: '赵主管', inspectTime: '2026-10-21 16:10', status: '已完成' },
    { id: 'mrec-22', name: '稳压给排水泵加压测试', deviceType: '给排水设备', type: '季保', planTime: '2026-10-20 10:20', executor: '刘大牛', inspectTime: '2026-10-20 10:45', status: '已完成' },
    { id: 'mrec-23', name: '楼宇亮化LED控制器校时', deviceType: '照明设备', type: '月保', planTime: '2026-10-19 19:30', executor: '李小花', inspectTime: '2026-10-19 19:45', status: '已完成' },
    { id: 'mrec-24', name: '机房蓄电池组放电维保', deviceType: '电气设备', type: '半年保', planTime: '2026-10-18 14:00', executor: '张海波', inspectTime: '2026-10-18 14:30', status: '已完成' },
    { id: 'mrec-25', name: '防盗告警探测器灵敏度测试', deviceType: '安防设备', type: '季保', planTime: '2026-10-17 09:00', executor: '陈工', inspectTime: '2026-10-17 09:20', status: '已完成' },
  ]);
  const [maintRecordQueryExecutor, setMaintRecordQueryExecutor] = useState('');
  const [isMaintRecordModalOpen, setIsMaintRecordModalOpen] = useState(false);
  const [selectedMaintRecordItem, setSelectedMaintRecordItem] = useState<any>(null);

  // Inspection Work Order states (25 items)
  const [inspectionWorkOrderList, setInspectionWorkOrderList] = useState([
    { id: 'iwo-1', code: 'GDWX202611060001', type: '巡检工单_照明设备', reporter: '赵小乐', company: '长明集团', reportTime: '2026-11-06 16:00:00', assignee: '--', status: '待派单' },
    { id: 'iwo-2', code: 'GDWX202611060002', type: '巡检工单_照明设备', reporter: '赵小乐', company: '长明集团', reportTime: '2026-11-06 16:00:12', assignee: '--', status: '处理中' },
    { id: 'iwo-3', code: 'GDWX202611050003', type: '巡检工单_空调设备', reporter: '李大牛', company: '长明集团', reportTime: '2026-11-05 10:20:00', assignee: '张海波', status: '处理中' },
    { id: 'iwo-4', code: 'GDWX202611050004', type: '巡检工单_给排水设备', reporter: '王工', company: '长明集团', reportTime: '2026-11-05 14:10:00', assignee: '刘大牛', status: '已完成' },
    { id: 'iwo-5', code: 'GDWX202611040005', type: '巡检工单_消防设备', reporter: '赵主管', company: '长明集团', reportTime: '2026-11-04 09:30:00', assignee: '李小花', status: '已完成' },
    { id: 'iwo-6', code: 'GDWX202611040006', type: '巡检工单_电气设备', reporter: 'admin1', company: '长明集团', reportTime: '2026-11-04 15:00:00', assignee: '陈工', status: '已完成' },
    { id: 'iwo-7', code: 'GDWX202611030007', type: '巡检工单_安防设备', reporter: 'admin2', company: '长明集团', reportTime: '2026-11-03 11:20:00', assignee: '张海波', status: '已完成' },
    { id: 'iwo-8', code: 'GDWX202611030008', type: '巡检工单_特种设备', reporter: '赵小乐', company: '长明集团', reportTime: '2026-11-03 16:40:00', assignee: '--', status: '待派单' },
    { id: 'iwo-9', code: 'GDWX202611020009', type: '巡检工单_暖通设备', reporter: '李大牛', company: '长明集团', reportTime: '2026-11-02 13:15:00', assignee: '陈工', status: '处理中' },
    { id: 'iwo-10', code: 'GDWX202611010010', type: '巡检工单_弱电系统', reporter: '王工', company: '长明集团', reportTime: '2026-11-01 08:50:00', assignee: '刘大牛', status: '已完成' },
    { id: 'iwo-11', code: 'GDWX202610310011', type: '巡检工单_变配电柜', reporter: '李姚明', company: '长明集团', reportTime: '2026-10-31 09:10:00', assignee: '王工', status: '已完成' },
    { id: 'iwo-12', code: 'GDWX202610300012', type: '巡检工单_水泵房', reporter: '陈工', company: '长明集团', reportTime: '2026-10-30 14:00:00', assignee: '张海波', status: '已完成' },
    { id: 'iwo-13', code: 'GDWX202610290013', type: '巡检工单_冷却塔', reporter: '赵主管', company: '长明集团', reportTime: '2026-10-29 11:30:00', assignee: '李小花', status: '已完成' },
    { id: 'iwo-14', code: 'GDWX202610280014', type: '巡检工单_红外防区', reporter: '刘大牛', company: '长明集团', reportTime: '2026-10-28 16:20:00', assignee: '陈工', status: '已完成' },
    { id: 'iwo-15', code: 'GDWX202610270015', type: '巡检工单_应急照明', reporter: '王工', company: '长明集团', reportTime: '2026-10-27 10:10:00', assignee: '李姚明', status: '已完成' },
    { id: 'iwo-16', code: 'GDWX202610260016', type: '巡检工单_UPS电源', reporter: '张海波', company: '长明集团', reportTime: '2026-10-26 15:40:00', assignee: '赵主管', status: '已完成' },
    { id: 'iwo-17', code: 'GDWX202610250017', type: '巡检工单_道闸门禁', reporter: '李小花', company: '长明集团', reportTime: '2026-10-25 09:00:00', assignee: '刘大牛', status: '已完成' },
    { id: 'iwo-18', code: 'GDWX202610240018', type: '巡检工单_楼宇自控', reporter: '陈工', company: '长明集团', reportTime: '2026-10-24 13:30:00', assignee: '王工', status: '已完成' },
    { id: 'iwo-19', code: 'GDWX202610230019', type: '巡检工单_光伏逆变器', reporter: '赵主管', company: '长明集团', reportTime: '2026-10-23 11:15:00', assignee: '李姚明', status: '已完成' },
    { id: 'iwo-20', code: 'GDWX202610220020', type: '巡检工单_气体灭火', reporter: '刘大牛', company: '长明集团', reportTime: '2026-10-22 14:50:00', assignee: '张海波', status: '已完成' },
    { id: 'iwo-21', code: 'GDWX202610210021', type: '巡检工单_无负压水泵', reporter: '王工', company: '长明集团', reportTime: '2026-10-21 08:30:00', assignee: '李小花', status: '已完成' },
    { id: 'iwo-22', code: 'GDWX202610200022', type: '巡检工单_人脸识别闸机', reporter: '张海波', company: '长明集团', reportTime: '2026-10-20 16:00:00', assignee: '陈工', status: '已完成' },
    { id: 'iwo-23', code: 'GDWX202610190023', type: '巡检工单_客梯急停按钮', reporter: '李姚明', company: '长明集团', reportTime: '2026-10-19 10:20:00', assignee: '赵主管', status: '已完成' },
    { id: 'iwo-24', code: 'GDWX202610180024', type: '巡检工单_CO传感器', reporter: '陈工', company: '长明集团', reportTime: '2026-10-18 15:10:00', assignee: '刘大牛', status: '已完成' },
    { id: 'iwo-25', name: '巡检工单_景观喷泉控制柜', code: 'GDWX202610170025', type: '巡检工单_给排水', reporter: '赵主管', company: '长明集团', reportTime: '2026-10-17 09:40:00', assignee: '王工', status: '已完成' },
  ]);

  // Maintenance Work Order states (25 items)
  const [maintenanceWorkOrderList, setMaintenanceWorkOrderList] = useState([
    { id: 'mwo-1', code: 'GDWX202611060011', type: '维保工单_暖通设备', reporter: '张工', company: '长明集团', reportTime: '2026-11-06 14:00:00', assignee: '--', status: '待派单' },
    { id: 'mwo-2', code: 'GDWX202611060012', type: '维保工单_电气设备', reporter: '李经理', company: '长明集团', reportTime: '2026-11-06 15:30:00', assignee: '张海波', status: '处理中' },
    { id: 'mwo-3', code: 'GDWX202611050013', type: '维保工单_消防设备', reporter: '王工', company: '长明集团', reportTime: '2026-11-05 09:10:00', assignee: '赵主管', status: '已完成' },
    { id: 'mwo-4', code: 'GDWX202611050014', type: '维保工单_照明设备', reporter: '赵小乐', company: '长明集团', reportTime: '2026-11-05 11:25:00', assignee: '李姚明', status: '已完成' },
    { id: 'mwo-5', code: 'GDWX202611040015', type: '维保工单_特种设备', reporter: 'admin1', company: '长明集团', reportTime: '2026-11-04 10:00:00', assignee: '陈工', status: '已完成' },
    { id: 'mwo-6', code: 'GDWX202611040016', type: '维保工单_给排水设备', reporter: 'admin2', company: '长明集团', reportTime: '2026-11-04 14:30:00', assignee: '刘大牛', status: '已完成' },
    { id: 'mwo-7', code: 'GDWX202611030017', type: '维保工单_安防设备', reporter: '张工', company: '长明集团', reportTime: '2026-11-03 13:10:00', assignee: '--', status: '待派单' },
    { id: 'mwo-8', code: 'GDWX202611030018', type: '维保工单_暖通设备', reporter: '李经理', company: '长明集团', reportTime: '2026-11-03 16:20:00', assignee: '张海波', status: '处理中' },
    { id: 'mwo-9', code: 'GDWX202611020019', type: '维保工单_弱电系统', reporter: '王工', company: '长明集团', reportTime: '2026-11-02 11:00:00', assignee: '陈工', status: '已完成' },
    { id: 'mwo-10', code: 'GDWX202611010020', type: '维保工单_照明设备', reporter: '赵小乐', company: '长明集团', reportTime: '2026-11-01 15:40:00', assignee: '刘大牛', status: '已完成' },
    { id: 'mwo-11', code: 'GDWX202610310021', type: '维保工单_冷水机组', reporter: '张工', company: '长明集团', reportTime: '2026-10-31 10:00:00', assignee: '李姚明', status: '已完成' },
    { id: 'mwo-12', code: 'GDWX202610300022', type: '维保工单_高压断路器', reporter: '李经理', company: '长明集团', reportTime: '2026-10-30 14:20:00', assignee: '王工', status: '已完成' },
    { id: 'mwo-13', code: 'GDWX202610290023', type: '维保工单_消火栓泵', reporter: '王工', company: '长明集团', reportTime: '2026-10-29 09:30:00', assignee: '陈工', status: '已完成' },
    { id: 'mwo-14', code: 'GDWX202610280024', type: '维保工单_景观水泵', reporter: '赵小乐', company: '长明集团', reportTime: '2026-10-28 15:10:00', assignee: '赵主管', status: '已完成' },
    { id: 'mwo-15', code: 'GDWX202610270025', type: '维保工单_人行闸机', reporter: 'admin1', company: '长明集团', reportTime: '2026-10-27 11:00:00', assignee: '刘大牛', status: '已完成' },
    { id: 'mwo-16', code: 'GDWX202610260026', type: '维保工单_核心交换机', reporter: 'admin2', company: '长明集团', reportTime: '2026-10-26 16:20:00', assignee: '李小花', status: '已完成' },
    { id: 'mwo-17', code: 'GDWX202610250027', type: '维保工单_水箱液位计', reporter: '张工', company: '长明集团', reportTime: '2026-10-25 10:00:00', assignee: '张海波', status: '已完成' },
    { id: 'mwo-18', code: 'GDWX202610240028', type: '维保工单_风机控制箱', reporter: '李经理', company: '长明集团', reportTime: '2026-10-24 14:30:00', assignee: '李姚明', status: '已完成' },
    { id: 'mwo-19', code: 'GDWX202610230029', type: '维保工单_光伏逆变器', reporter: '王工', company: '长明集团', reportTime: '2026-10-23 09:15:00', assignee: '王工', status: '已完成' },
    { id: 'mwo-20', code: 'GDWX202610220030', type: '维保工单_客梯钢丝绳', reporter: '赵小乐', company: '长明集团', reportTime: '2026-10-22 13:00:00', assignee: '陈工', status: '已完成' },
    { id: 'mwo-21', code: 'GDWX202610210031', type: '维保工单_弱电机柜', reporter: 'admin1', company: '长明集团', reportTime: '2026-10-21 15:40:00', assignee: '赵主管', status: '已完成' },
    { id: 'mwo-22', code: 'GDWX202610200032', type: '维保工单_稳压加压泵', reporter: 'admin2', company: '长明集团', reportTime: '2026-10-20 10:20:00', assignee: '刘大牛', status: '已完成' },
    { id: 'mwo-23', code: 'GDWX202610190033', type: '维保工单_LED控制器', reporter: '张工', company: '长明集团', reportTime: '2026-10-19 19:30:00', assignee: '李小花', status: '已完成' },
    { id: 'mwo-24', code: 'GDWX202610180034', type: '维保工单_蓄电池组', reporter: '李经理', company: '长明集团', reportTime: '2026-10-18 14:00:00', assignee: '张海波', status: '已完成' },
    { id: 'mwo-25', code: 'GDWX202610170035', type: '维保工单_防盗探测器', reporter: '王工', company: '长明集团', reportTime: '2026-10-17 09:00:00', assignee: '陈工', status: '已完成' },
  ]);

  // Repair Work Order states matching screenshot image_3a38b121.png (25 items)
  const [repairOrderList, setRepairOrderList] = useState([
    { id: 'ro-1', code: 'GDWX202611060001', type: '维修工单_门禁设备', reporter: 'admin1', company: '长明集团', reportTime: '2026-11-06 16:00:00', assignee: '--', status: '待派单' },
    { id: 'ro-2', code: 'GDWX202611060002', type: '维修工单_门禁设备', reporter: 'admin1', company: '长明集团', reportTime: '2026-11-06 16:00:12', assignee: '--', status: '处理中' },
    { id: 'ro-3', code: 'GDWX202611050003', type: '维修工单_照明设备', reporter: 'admin', company: '长明集团', reportTime: '2026-11-05 14:20:00', assignee: '李姚明', status: '处理中' },
    { id: 'ro-4', code: 'GDWX202611050004', type: '维修工单_空调设备', reporter: 'vkja123', company: '长明物业', reportTime: '2026-11-05 11:10:00', assignee: '张海波', status: '已完成' },
    { id: 'ro-5', code: 'GDWX202611040005', type: '维修工单_监控设备', reporter: 'admin1', company: '长明集团', reportTime: '2026-11-04 10:00:00', assignee: '陈工', status: '已完成' },
    { id: 'ro-6', code: 'GDWX202611040006', type: '维修工单_给排水泵', reporter: 'zhaole', company: '绿城服务', reportTime: '2026-11-04 09:30:00', assignee: '--', status: '待派单' },
    { id: 'ro-7', code: 'GDWX202611030007', type: '维修工单_电梯设备', reporter: 'chenV', company: '奥的斯电梯', reportTime: '2026-11-03 16:45:00', assignee: '赵主管', status: '处理中' },
    { id: 'ro-8', code: 'GDWX202611030008', type: '维修工单_消防报警', reporter: 'wangwei', company: '长明集团', reportTime: '2026-11-03 13:20:00', assignee: '李姚明', status: '已完成' },
    { id: 'ro-9', code: 'GDWX202611020009', type: '维修工单_新风机组', reporter: 'liqiang', company: '江森自控', reportTime: '2026-11-02 11:00:00', assignee: '陈工', status: '挂单' },
    { id: 'ro-10', code: 'GDWX202611020010', type: '维修工单_弱电网络', reporter: 'admin', company: '长明集团', reportTime: '2026-11-02 08:30:00', assignee: '张海波', status: '已完成' },
    { id: 'ro-11', code: 'GDWX202610310011', type: '维修工单_发电机组', reporter: 'admin1', company: '长明集团', reportTime: '2026-10-31 15:00:00', assignee: '王工', status: '已完成' },
    { id: 'ro-12', code: 'GDWX202610300012', type: '维修工单_冷水塔阀', reporter: 'vkja123', company: '长明物业', reportTime: '2026-10-30 09:40:00', assignee: '李姚明', status: '已完成' },
    { id: 'ro-13', code: 'GDWX202610290013', type: '维修工单_智能电表', reporter: 'admin', company: '长明集团', reportTime: '2026-10-29 14:15:00', assignee: '陈工', status: '已完成' },
    { id: 'ro-14', code: 'GDWX202610280014', type: '维修工单_高位水箱', reporter: 'zhaole', company: '绿城服务', reportTime: '2026-10-28 11:00:00', assignee: '赵主管', status: '已完成' },
    { id: 'ro-15', code: 'GDWX202610270015', type: '维修工单_车库闸机', reporter: 'chenV', company: '长明集团', reportTime: '2026-10-27 16:30:00', assignee: '刘大牛', status: '已完成' },
    { id: 'ro-16', code: 'GDWX202610260016', type: '维修工单_烟感传感器', reporter: 'wangwei', company: '长明集团', reportTime: '2026-10-26 10:20:00', assignee: '李小花', status: '已完成' },
    { id: 'ro-17', code: 'GDWX202610250017', type: '维修工单_控制柜按键', reporter: 'liqiang', company: '长明集团', reportTime: '2026-10-25 13:50:00', assignee: '张海波', status: '已完成' },
    { id: 'ro-18', code: 'GDWX202610240018', type: '维修工单_变频驱动器', reporter: 'admin', company: '长明集团', reportTime: '2026-10-24 08:40:00', assignee: '李姚明', status: '已完成' },
    { id: 'ro-19', code: 'GDWX202610230019', type: '维修工单_排烟风机', reporter: 'admin1', company: '长明集团', reportTime: '2026-10-23 15:10:00', assignee: '王工', status: '已完成' },
    { id: 'ro-20', code: 'GDWX202610220020', type: '维修工单_楼宇防盗对射', reporter: 'vkja123', company: '长明物业', reportTime: '2026-10-22 11:30:00', assignee: '陈工', status: '已完成' },
    { id: 'ro-21', code: 'GDWX202610210021', type: '维修工单_景观喷泉水泵', reporter: 'zhaole', company: '绿城服务', reportTime: '2026-10-21 09:15:00', assignee: '赵主管', status: '已完成' },
    { id: 'ro-22', code: 'GDWX202610200022', type: '维修工单_弱电机房温湿度', reporter: 'chenV', company: '长明集团', reportTime: '2026-10-20 14:00:00', assignee: '刘大牛', status: '已完成' },
    { id: 'ro-23', code: 'GDWX202610190023', type: '维修工单_扶梯梯级板', reporter: 'wangwei', company: '奥的斯电梯', reportTime: '2026-10-19 16:40:00', assignee: '李小花', status: '已完成' },
    { id: 'ro-24', code: 'GDWX202610180024', type: '维修工单_光伏组串接线', reporter: 'liqiang', company: '长明集团', reportTime: '2026-10-18 10:10:00', assignee: '张海波', status: '已完成' },
    { id: 'ro-25', code: 'GDWX202610170025', type: '维修工单_无负压压力表', reporter: 'admin', company: '长明集团', reportTime: '2026-10-17 13:25:00', assignee: '李姚明', status: '已完成' },
  ]);
  const [repairQueryText, setRepairQueryText] = useState('');
  const [repairQueryStatus, setRepairQueryStatus] = useState('待派单');
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [isRepairDetailView, setIsRepairDetailView] = useState(false);
  const [selectedRepairItem, setSelectedRepairItem] = useState<any>(null);
  const [repairModalAction, setRepairModalAction] = useState('详情');
  const [isInspectionDetailView, setIsInspectionDetailView] = useState(false);
  const [selectedInspectionItem, setSelectedInspectionItem] = useState<any>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [inspectionModalAction, setInspectionModalAction] = useState('派单');
  const [isMaintenanceDetailView, setIsMaintenanceDetailView] = useState(false);
  const [selectedMaintenanceItem, setSelectedMaintenanceItem] = useState<any>(null);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceModalAction, setMaintenanceModalAction] = useState('派单');

  // Work Order Configuration states (matching screenshot image_3969a9cf.png) (25 items each)
  const [configTab, setConfigTab] = useState<'维修工单' | '巡检工单' | '告警工单'>('维修工单');
  const [repairConfigs, setRepairConfigs] = useState([
    { id: 'cfg-1', repairType: '门禁设备', dispatchType: '自动', assignee: '刘小亚、李民博', timeLimit: '30min', transferTime: '1min', updateTime: '2026-11-06 15:20' },
    { id: 'cfg-2', repairType: '监控设备', dispatchType: '自动', assignee: '张小军', timeLimit: '60min', transferTime: '1min', updateTime: '2026-11-06 14:10' },
    { id: 'cfg-3', repairType: '空调设备', dispatchType: '手动', assignee: '赵大伟', timeLimit: '30min', transferTime: '--', updateTime: '2026-11-05 11:00' },
    { id: 'cfg-4', repairType: '照明设备', dispatchType: '手动', assignee: '陈宜春', timeLimit: '30min', transferTime: '--', updateTime: '2026-11-05 09:30' },
    { id: 'cfg-5', repairType: '消防报警', dispatchType: '自动', assignee: '王工', timeLimit: '15min', transferTime: '1min', updateTime: '2026-11-04 16:20' },
    { id: 'cfg-6', repairType: '给排水泵', dispatchType: '手动', assignee: '刘大牛', timeLimit: '45min', transferTime: '--', updateTime: '2026-11-04 10:15' },
    { id: 'cfg-7', repairType: '电梯系统', dispatchType: '自动', assignee: '罗工', timeLimit: '20min', transferTime: '2min', updateTime: '2026-11-03 13:40' },
    { id: 'cfg-8', repairType: '安防监控', dispatchType: '手动', assignee: '李姚明', timeLimit: '60min', transferTime: '--', updateTime: '2026-11-03 08:50' },
    { id: 'cfg-9', repairType: '弱电网络', dispatchType: '自动', assignee: '张海波', timeLimit: '30min', transferTime: '1min', updateTime: '2026-11-02 11:25' },
    { id: 'cfg-10', repairType: '智能照明', dispatchType: '手动', assignee: '赵小乐', timeLimit: '30min', transferTime: '--', updateTime: '2026-11-01 16:00' },
    { id: 'cfg-11', repairType: '高压柜', dispatchType: '自动', assignee: '李姚明', timeLimit: '20min', transferTime: '1min', updateTime: '2026-10-31 10:00' },
    { id: 'cfg-12', repairType: '发电机组', dispatchType: '手动', assignee: '王工', timeLimit: '30min', transferTime: '--', updateTime: '2026-10-30 14:15' },
    { id: 'cfg-13', repairType: '冷水机组', dispatchType: '自动', assignee: '陈工', timeLimit: '25min', transferTime: '2min', updateTime: '2026-10-29 09:30' },
    { id: 'cfg-14', repairType: '新风机组', dispatchType: '手动', assignee: '赵主管', timeLimit: '40min', transferTime: '--', updateTime: '2026-10-28 15:10' },
    { id: 'cfg-15', repairType: '水泵控制柜', dispatchType: '自动', assignee: '刘大牛', timeLimit: '30min', transferTime: '1min', updateTime: '2026-10-27 11:00' },
    { id: 'cfg-16', repairType: '气体灭火', dispatchType: '自动', assignee: '李小花', timeLimit: '10min', transferTime: '1min', updateTime: '2026-10-26 16:20' },
    { id: 'cfg-17', repairType: '道闸闸机', dispatchType: '手动', assignee: '张海波', timeLimit: '30min', transferTime: '--', updateTime: '2026-10-25 10:00' },
    { id: 'cfg-18', repairType: '光伏逆变器', dispatchType: '自动', assignee: '李姚明', timeLimit: '30min', transferTime: '1min', updateTime: '2026-10-24 14:30' },
    { id: 'cfg-19', repairType: '扶梯控制盒', dispatchType: '自动', assignee: '王工', timeLimit: '15min', transferTime: '1min', updateTime: '2026-10-23 09:15' },
    { id: 'cfg-20', repairType: '温湿度传感器', dispatchType: '手动', assignee: '陈工', timeLimit: '45min', transferTime: '--', updateTime: '2026-10-22 13:00' },
    { id: 'cfg-21', repairType: '烟感警报器', dispatchType: '自动', assignee: '赵主管', timeLimit: '10min', transferTime: '1min', updateTime: '2026-10-21 15:40' },
    { id: 'cfg-22', repairType: '无负压加压泵', dispatchType: '手动', assignee: '刘大牛', timeLimit: '30min', transferTime: '--', updateTime: '2026-10-20 10:20' },
    { id: 'cfg-23', repairType: 'LED景观大屏', dispatchType: '手动', assignee: '李小花', timeLimit: '60min', transferTime: '--', updateTime: '2026-10-19 19:30' },
    { id: 'cfg-24', repairType: '核心交换机', dispatchType: '自动', assignee: '张海波', timeLimit: '20min', transferTime: '1min', updateTime: '2026-10-18 14:00' },
    { id: 'cfg-25', repairType: '周界红外', dispatchType: '自动', assignee: '陈工', timeLimit: '15min', transferTime: '1min', updateTime: '2026-10-17 09:00' },
  ]);
  const [inspectionConfigs, setInspectionConfigs] = useState([
    { id: 'icfg-1', repairType: '水箱巡检点位', dispatchType: '自动', assignee: '巡检一组 (赵小乐)', timeLimit: '60min', transferTime: '5min', updateTime: '2026-11-06 10:00' },
    { id: 'icfg-2', repairType: '空调机房日常巡检', dispatchType: '自动', assignee: '暖通班组 (张海波)', timeLimit: '45min', transferTime: '2min', updateTime: '2026-11-06 09:15' },
    { id: 'icfg-3', repairType: '变配电高低压柜巡检', dispatchType: '手动', assignee: '强电班组 (李姚明)', timeLimit: '30min', transferTime: '--', updateTime: '2026-11-05 14:00' },
    { id: 'icfg-4', repairType: '消防喷淋系统巡检', dispatchType: '自动', assignee: '消防班组 (王工)', timeLimit: '30min', transferTime: '2min', updateTime: '2026-11-05 11:30' },
    { id: 'icfg-5', repairType: '电梯运行安全巡检', dispatchType: '手动', assignee: '特种设备组 (赵主管)', timeLimit: '20min', transferTime: '--', updateTime: '2026-11-04 16:00' },
    { id: 'icfg-6', repairType: '公共区域照明巡检', dispatchType: '自动', assignee: '照明运维组 (陈工)', timeLimit: '60min', transferTime: '5min', updateTime: '2026-11-04 08:30' },
    { id: 'icfg-7', repairType: '弱电机房温湿度巡检', dispatchType: '自动', assignee: '弱电班组 (刘大牛)', timeLimit: '30min', transferTime: '1min', updateTime: '2026-11-03 15:20' },
    { id: 'icfg-8', repairType: '给排水管网巡检', dispatchType: '手动', assignee: '给排水班组 (李小花)', timeLimit: '60min', transferTime: '--', updateTime: '2026-11-03 10:00' },
    { id: 'icfg-9', repairType: '安防监控摄像头巡检', dispatchType: '自动', assignee: '安防班组 (张工)', timeLimit: '45min', transferTime: '3min', updateTime: '2026-11-02 13:10' },
    { id: 'icfg-10', repairType: '夜间综合亮化巡检', dispatchType: '手动', assignee: '夜班巡检组', timeLimit: '90min', transferTime: '--', updateTime: '2026-11-01 20:00' },
    { id: 'icfg-11', repairType: '配电室地沟防鼠网巡检', dispatchType: '自动', assignee: '强电班组 (李姚明)', timeLimit: '30min', transferTime: '2min', updateTime: '2026-10-31 09:30' },
    { id: 'icfg-12', repairType: '冷却塔风机振动巡检', dispatchType: '自动', assignee: '暖通班组 (张海波)', timeLimit: '40min', transferTime: '2min', updateTime: '2026-10-30 11:15' },
    { id: 'icfg-13', repairType: '应急疏散指示标志巡检', dispatchType: '手动', assignee: '消防班组 (王工)', timeLimit: '60min', transferTime: '--', updateTime: '2026-10-29 14:00' },
    { id: 'icfg-14', repairType: '生活水泵止回阀测试巡检', dispatchType: '手动', assignee: '给排水班组 (李小花)', timeLimit: '45min', transferTime: '--', updateTime: '2026-10-28 10:20' },
    { id: 'icfg-15', repairType: '周界脉冲电子围栏巡检', dispatchType: '自动', assignee: '安防班组 (张工)', timeLimit: '30min', transferTime: '1min', updateTime: '2026-10-27 15:40' },
    { id: 'icfg-16', repairType: '数据中心核心机柜巡检', dispatchType: '自动', assignee: '弱电班组 (刘大牛)', timeLimit: '30min', transferTime: '1min', updateTime: '2026-10-26 08:50' },
    { id: 'icfg-17', repairType: '扶梯裙板安全开关巡检', dispatchType: '手动', assignee: '特种设备组 (赵主管)', timeLimit: '20min', transferTime: '--', updateTime: '2026-10-25 13:10' },
    { id: 'icfg-18', repairType: '车库防爆排风机巡检', dispatchType: '自动', assignee: '暖通班组 (陈工)', timeLimit: '45min', transferTime: '3min', updateTime: '2026-10-24 16:00' },
    { id: 'icfg-19', name: '光伏防雷接地巡检', repairType: '电气设备', dispatchType: '手动', assignee: '强电班组 (李姚明)', timeLimit: '60min', transferTime: '--', updateTime: '2026-10-23 10:30' },
    { id: 'icfg-20', repairType: '防火卷帘下落联动巡检', dispatchType: '自动', assignee: '消防班组 (王工)', timeLimit: '30min', transferTime: '2min', updateTime: '2026-10-22 14:20' },
    { id: 'icfg-21', repairType: '排水井浮球液位计巡检', dispatchType: '手动', assignee: '给排水班组 (刘大牛)', timeLimit: '30min', transferTime: '--', updateTime: '2026-10-21 09:10' },
    { id: 'icfg-22', repairType: '门禁读卡器红外对射巡检', dispatchType: '自动', assignee: '弱电班组 (李小花)', timeLimit: '30min', transferTime: '1min', updateTime: '2026-10-20 11:45' },
    { id: 'icfg-23', repairType: '观光电梯玻璃井道巡检', dispatchType: '手动', assignee: '特种设备组 (赵主管)', timeLimit: '30min', transferTime: '--', updateTime: '2026-10-19 15:00' },
    { id: 'icfg-24', repairType: '智能照明控制器巡检', dispatchType: '自动', assignee: '照明运维组 (陈工)', timeLimit: '45min', transferTime: '2min', updateTime: '2026-10-18 10:10' },
    { id: 'icfg-25', repairType: '蓄电池房氢气检测计巡检', dispatchType: '自动', assignee: '强电班组 (张海波)', timeLimit: '20min', transferTime: '1min', updateTime: '2026-10-17 14:30' },
  ]);
  const [alarmConfigs, setAlarmConfigs] = useState([
    { id: 'acfg-1', repairType: '火灾烟感告警派单', dispatchType: '自动', assignee: '消防应急值班组 (王工)', timeLimit: '5min', transferTime: '1min', updateTime: '2026-11-06 18:00' },
    { id: 'acfg-2', repairType: '冷水机组超温告警', dispatchType: '自动', assignee: '暖通机电组 (张海波)', timeLimit: '15min', transferTime: '2min', updateTime: '2026-11-06 16:30' },
    { id: 'acfg-3', repairType: '给排水管网水压异常告警', dispatchType: '自动', assignee: '给排水班组 (刘大牛)', timeLimit: '20min', transferTime: '2min', updateTime: '2026-11-05 11:45' },
    { id: 'acfg-4', repairType: '变压器超载告警', dispatchType: '自动', assignee: '强电值班班组 (李姚明)', timeLimit: '10min', transferTime: '1min', updateTime: '2026-11-05 09:20' },
    { id: 'acfg-5', repairType: '门禁强行闯入告警', dispatchType: '手动', assignee: '安防监控组 (赵主管)', timeLimit: '10min', transferTime: '--', updateTime: '2026-11-04 22:10' },
    { id: 'acfg-6', repairType: '电梯困人紧急告警', dispatchType: '自动', assignee: '电梯应急救援组 (罗工)', timeLimit: '5min', transferTime: '1min', updateTime: '2026-11-04 15:30' },
    { id: 'acfg-7', repairType: '地下车库排风机故障告警', dispatchType: '手动', assignee: '机电设备组 (陈工)', timeLimit: '30min', transferTime: '--', updateTime: '2026-11-03 14:15' },
    { id: 'acfg-8', repairType: '弱电机房UPS断电告警', dispatchType: '自动', assignee: '弱电运维组 (张海波)', timeLimit: '10min', transferTime: '1min', updateTime: '2026-11-03 08:00' },
    { id: 'acfg-9', repairType: '照明回路过载告警', dispatchType: '手动', assignee: '照明班组 (赵小乐)', timeLimit: '45min', transferTime: '--', updateTime: '2026-11-02 17:50' },
    { id: 'acfg-10', repairType: ' perimeter 防区越界告警', dispatchType: '自动', assignee: '安防应急班组', timeLimit: '15min', transferTime: '2min', updateTime: '2026-11-01 23:30' },
    { id: 'acfg-11', repairType: '消防喷淋水压过低告警', dispatchType: '自动', assignee: '消防应急值班组 (王工)', timeLimit: '10min', transferTime: '1min', updateTime: '2026-10-31 08:20' },
    { id: 'acfg-12', repairType: '高压柜弧光保护告警', dispatchType: '自动', assignee: '强电值班班组 (李姚明)', timeLimit: '5min', transferTime: '1min', updateTime: '2026-10-30 16:40' },
    { id: 'acfg-13', repairType: '集水井超高水位告警', dispatchType: '自动', assignee: '给排水班组 (刘大牛)', timeLimit: '15min', transferTime: '1min', updateTime: '2026-10-29 11:10' },
    { id: 'acfg-14', repairType: '冷冻水流量低下告警', dispatchType: '自动', assignee: '暖通机电组 (张海波)', timeLimit: '20min', transferTime: '2min', updateTime: '2026-10-28 14:50' },
    { id: 'acfg-15', repairType: '视频监控信号丢失告警', dispatchType: '手动', assignee: '安防监控组 (赵主管)', timeLimit: '30min', transferTime: '--', updateTime: '2026-10-27 09:30' },
    { id: 'acfg-16', repairType: '弱电核心路由宕机告警', dispatchType: '自动', assignee: '弱电运维组 (李小花)', timeLimit: '10min', transferTime: '1min', updateTime: '2026-10-26 13:15' },
    { id: 'acfg-17', repairType: '电梯安全回路断开告警', dispatchType: '自动', assignee: '电梯救援组 (罗工)', timeLimit: '5min', transferTime: '1min', updateTime: '2026-10-25 17:00' },
    { id: 'acfg-18', repairType: '夜景亮化断路器跳闸告警', dispatchType: '手动', assignee: '照明班组 (陈工)', timeLimit: '40min', transferTime: '--', updateTime: '2026-10-24 21:00' },
    { id: 'acfg-19', repairType: '配电房气体灭火喷放告警', dispatchType: '自动', assignee: '消防应急班组 (王工)', timeLimit: '5min', transferTime: '1min', updateTime: '2026-10-23 10:40' },
    { id: 'acfg-20', repairType: '生活水泵变频器故障告警', dispatchType: '自动', assignee: '给排水班组 (刘大牛)', timeLimit: '20min', transferTime: '2min', updateTime: '2026-10-22 15:20' },
    { id: 'acfg-21', repairType: '人脸闸机尾随强闯告警', dispatchType: '手动', assignee: '安防监控组 (赵主管)', timeLimit: '15min', transferTime: '--', updateTime: '2026-10-21 11:00' },
    { id: 'acfg-22', repairType: '精密空调高湿告警', dispatchType: '自动', assignee: '弱电运维组 (张海波)', timeLimit: '20min', transferTime: '1min', updateTime: '2026-10-20 16:30' },
    { id: 'acfg-23', repairType: '发电机燃油低油位告警', dispatchType: '手动', assignee: '强电班组 (李姚明)', timeLimit: '30min', transferTime: '--', updateTime: '2026-10-19 08:50' },
    { id: 'acfg-24', repairType: '新风压差开关过堵告警', dispatchType: '自动', assignee: '暖通班组 (陈工)', timeLimit: '30min', transferTime: '2min', updateTime: '2026-10-18 14:10' },
    { id: 'acfg-25', repairType: '车库CO气体超标告警', dispatchType: '自动', assignee: '机电应急组 (刘大牛)', timeLimit: '15min', transferTime: '1min', updateTime: '2026-10-17 12:00' },
  ]);
  const [configQueryType, setConfigQueryType] = useState('');
  const [isAddCfgModalOpen, setIsAddCfgModalOpen] = useState(false);
  const [isEditCfgModalOpen, setIsEditCfgModalOpen] = useState(false);
  const [isDispatchScopeModalOpen, setIsDispatchScopeModalOpen] = useState(false);
  const [selectedCfgItem, setSelectedCfgItem] = useState<any>(null);
  const configList = configTab === '维修工单' ? repairConfigs : configTab === '巡检工单' ? inspectionConfigs : alarmConfigs;
  const setConfigList = configTab === '维修工单' ? setRepairConfigs : configTab === '巡检工单' ? setInspectionConfigs : setAlarmConfigs;

  const [formRepairType, setFormRepairType] = useState('门禁设备');
  const [formDispatchType, setFormDispatchType] = useState('自动');
  const [formAssignee, setFormAssignee] = useState('刘小亚、李民博');
  const [formTimeLimit, setFormTimeLimit] = useState('30min');
  const [formTransferTime, setFormTransferTime] = useState('1min');

  // Supplier List states matching screenshot image_d703e38a.png (25 items)
  const [supplierList, setSupplierList] = useState([
    { id: 'sup-1', deviceType: '照明设备', name: '天明有限公司', servicePhone: '010220031', repairPerson: '李佳奇', repairPhone: '13242772221', engineer: '刘小丽', engineerPhone: '13242772234', salesManager: '刘大华', salesPhone: '13342872234', updateTime: '2026-11-06 16:00' },
    { id: 'sup-2', deviceType: '照明设备', name: '奇利宝设备有限公司', servicePhone: '010220032', repairPerson: '赵小明', repairPhone: '13923124456', engineer: '刘佳明', engineerPhone: '13923124566', salesManager: '陈小东', salesPhone: '13823184588', updateTime: '2026-11-06 15:10' },
    { id: 'sup-3', deviceType: '暖通设备', name: '江森自控暖通工程有限公司', servicePhone: '010220033', repairPerson: '张工', repairPhone: '13810293842', engineer: '陈工', engineerPhone: '13810293843', salesManager: '李经理', salesPhone: '13920384910', updateTime: '2026-11-05 11:20' },
    { id: 'sup-4', deviceType: '变配电设备', name: '施耐德电气智能集成商', servicePhone: '010220034', repairPerson: '王师傅', repairPhone: '13739201823', engineer: '赵主管', engineerPhone: '13739201824', salesManager: '孙总监', salesPhone: '13649201834', updateTime: '2026-11-05 10:00' },
    { id: 'sup-5', deviceType: '消防设备', name: '海康威视消防安防科技', servicePhone: '010220035', repairPerson: '李工', repairPhone: '13520193847', engineer: '王工', engineerPhone: '13520193848', salesManager: '周经理', salesPhone: '13520193849', updateTime: '2026-11-04 14:15' },
    { id: 'sup-6', deviceType: '给排水设备', name: '南方泵业集团服务部', servicePhone: '010220036', repairPerson: '刘师傅', repairPhone: '13419283746', engineer: '陈师傅', engineerPhone: '13419283747', salesManager: '吴经理', salesPhone: '13419283748', updateTime: '2026-11-04 09:30' },
    { id: 'sup-7', deviceType: '特种设备', name: '奥的斯电梯工程有限公司', servicePhone: '010220037', repairPerson: '赵工', repairPhone: '13382910293', engineer: '钱工', engineerPhone: '13382910294', salesManager: '郑总', salesPhone: '13382910295', updateTime: '2026-11-03 16:20' },
    { id: 'sup-8', deviceType: '安防设备', name: '大华安防科技股份有限公司', servicePhone: '010220038', repairPerson: '孙师傅', repairPhone: '13210928374', engineer: '李师傅', engineerPhone: '13210928375', salesManager: '马经理', salesPhone: '13210928376', updateTime: '2026-11-03 10:10' },
    { id: 'sup-9', deviceType: '弱电系统', name: '华为数字能源网络集成商', servicePhone: '010220039', repairPerson: '周工', repairPhone: '13192837465', engineer: '吴工', engineerPhone: '13192837466', salesManager: '林经理', salesPhone: '13192837467', updateTime: '2026-11-02 11:00' },
    { id: 'sup-10', deviceType: '门禁设备', name: '中控智慧科技股份有限公司', servicePhone: '010220040', repairPerson: '郑师傅', repairPhone: '13019283746', engineer: '王师傅', engineerPhone: '13019283747', salesManager: '何经理', salesPhone: '13019283748', updateTime: '2026-11-01 14:00' },
    { id: 'sup-11', deviceType: '照明设备', name: '欧普照明工程服务部', servicePhone: '010220041', repairPerson: '彭师傅', repairPhone: '13911224455', engineer: '廖工', engineerPhone: '13911224456', salesManager: '宋经理', salesPhone: '13911224457', updateTime: '2026-10-31 09:20' },
    { id: 'sup-12', deviceType: '暖通设备', name: '开利空调销售服务中心', servicePhone: '010220042', repairPerson: '黄师傅', repairPhone: '13822335566', engineer: '徐工', engineerPhone: '13822335567', salesManager: '曹经理', salesPhone: '13822335568', updateTime: '2026-10-30 15:40' },
    { id: 'sup-13', deviceType: '变配电设备', name: 'ABB高低压电气集成', servicePhone: '010220043', repairPerson: '袁师傅', repairPhone: '13733446677', engineer: '卢工', engineerPhone: '13733446678', salesManager: '邓总', salesPhone: '13733446679', updateTime: '2026-10-29 11:10' },
    { id: 'sup-14', deviceType: '消防设备', name: '泰科消防设备系统', servicePhone: '010220044', repairPerson: '蒋师傅', repairPhone: '13644557788', engineer: '蔡工', engineerPhone: '13644557789', salesManager: '许经理', salesPhone: '13644557790', updateTime: '2026-10-28 14:30' },
    { id: 'sup-15', deviceType: '给排水设备', name: '威乐水泵技术服务部', servicePhone: '010220045', repairPerson: '石师傅', repairPhone: '13555668899', engineer: '崔工', engineerPhone: '13555668800', salesManager: '戴经理', salesPhone: '13555668811', updateTime: '2026-10-27 10:15' },
    { id: 'sup-16', deviceType: '安防设备', name: '宇视科技安防工程', servicePhone: '010220046', repairPerson: '薛师傅', repairPhone: '13466779900', engineer: '陆工', engineerPhone: '13466779911', salesManager: '秦总', salesPhone: '13466779922', updateTime: '2026-10-26 16:00' },
    { id: 'sup-17', deviceType: '特种设备', name: '迅达电梯维修保养部', servicePhone: '010220047', repairPerson: '顾师傅', repairPhone: '13377880011', engineer: '侯工', engineerPhone: '13377880022', salesManager: '段经理', salesPhone: '13377880033', updateTime: '2026-10-25 13:20' },
    { id: 'sup-18', deviceType: '弱电系统', name: '紫光数码弱电集成商', servicePhone: '010220048', repairPerson: '夏师傅', repairPhone: '13288991122', engineer: '毛工', engineerPhone: '13288991133', salesManager: '姜经理', salesPhone: '13288991144', updateTime: '2026-10-24 09:40' },
    { id: 'sup-19', deviceType: '门禁设备', name: '捷顺科技智能停车门禁', servicePhone: '010220049', repairPerson: '龙师傅', repairPhone: '13199002233', engineer: '万工', engineerPhone: '13199002244', salesManager: '阎经理', salesPhone: '13199002255', updateTime: '2026-10-23 15:10' },
    { id: 'sup-20', deviceType: '照明设备', name: '飞利浦专业照明服务', servicePhone: '010220050', repairPerson: '武师傅', repairPhone: '13000113344', engineer: '钱工', engineerPhone: '13000113355', salesManager: '严经理', salesPhone: '13000113366', updateTime: '2026-10-22 11:30' },
    { id: 'sup-21', deviceType: '暖通设备', name: '约克空调维保技术中心', servicePhone: '010220051', repairPerson: '赖师傅', repairPhone: '13911335577', engineer: '黎工', engineerPhone: '13911335588', salesManager: '易经理', salesPhone: '13911335599', updateTime: '2026-10-21 14:00' },
    { id: 'sup-22', deviceType: '变配电设备', name: '正泰电气高低压配电部', servicePhone: '010220052', repairPerson: '常师傅', repairPhone: '13822446688', engineer: '武工', engineerPhone: '13822446699', salesManager: '乔总', salesPhone: '13822446600', updateTime: '2026-10-20 10:20' },
    { id: 'sup-23', deviceType: '消防设备', name: '首安工业消防工程', servicePhone: '010220053', repairPerson: '贺师傅', repairPhone: '13733557799', engineer: '赖工', engineerPhone: '13733557700', salesManager: '龚经理', salesPhone: '13733557711', updateTime: '2026-10-19 16:50' },
    { id: 'sup-24', deviceType: '给排水设备', name: '格兰富水泵综合服务商', servicePhone: '010220054', repairPerson: '文师傅', repairPhone: '13644668800', engineer: '庞工', engineerPhone: '13644668811', salesManager: '樊经理', salesPhone: '13644668822', updateTime: '2026-10-18 09:10' },
    { id: 'sup-25', deviceType: '弱电系统', name: '海信网络能源科技', servicePhone: '010220055', repairPerson: '兰师傅', repairPhone: '13555779911', engineer: '尹工', engineerPhone: '13555779922', salesManager: '廖总', salesPhone: '13555779933', updateTime: '2026-10-17 13:40' },
  ]);
  const [supplierQueryDevice, setSupplierQueryDevice] = useState('全部');
  const [supplierQueryName, setSupplierQueryName] = useState('');
  const [isAddSupModalOpen, setIsAddSupModalOpen] = useState(false);
  const [isEditSupModalOpen, setIsEditSupModalOpen] = useState(false);
  const [isViewSupModalOpen, setIsViewSupModalOpen] = useState(false);
  const [selectedSupItem, setSelectedSupItem] = useState<any>(null);

  const [supFormDeviceType, setSupFormDeviceType] = useState('照明设备');
  const [supFormName, setSupFormName] = useState('新供应商有限公司');
  const [supFormServicePhone, setSupFormServicePhone] = useState('01088889999');
  const [supFormRepairPerson, setSupFormRepairPerson] = useState('张师傅');
  const [supFormRepairPhone, setSupFormRepairPhone] = useState('13800138000');
  const [supFormEngineer, setSupFormEngineer] = useState('李工');
  const [supFormEngineerPhone, setSupFormEngineerPhone] = useState('13900139000');
  const [supFormSalesManager, setSupFormSalesManager] = useState('王经理');
  const [supFormSalesPhone, setSupFormSalesPhone] = useState('13700137000');

  // Form states
  const [formCategory, setFormCategory] = useState('公区报修');
  const [formType, setFormType] = useState('照明设备');
  const [formBuilding, setFormBuilding] = useState('T1');
  const [formFloor, setFormFloor] = useState('1F');
  const [formLocation, setFormLocation] = useState('');
  const [formQty, setFormQty] = useState('1');
  const [formName, setFormName] = useState('陈工');
  const [formUnit, setFormUnit] = useState('工程运营部');
  const [formPhone, setFormPhone] = useState('13800138000');
  const [formDesc, setFormDesc] = useState('');

  const handleSubmitRepair = () => {
    const newFeedItem = {
      id: `m-${Date.now()}`,
      title: `${formBuilding}${formFloor}公区_${formType}`,
      code: `GDBX${Date.now().toString().slice(-10)}`,
      reporter: formName,
      reportTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      assignee: '待指派',
      assignTime: '-',
      status: '待接单'
    };
    setMaintenanceFeedItems([newFeedItem, ...maintenanceFeedItems]);
    onOpenCreateWorkOrder();
    triggerToast('报修申请提交成功！已同步至右侧维修动态信息');
  };

  const [suppliers, setSuppliers] = useState([
    { id: 'sup-01', code: 'SUP-2026-001', name: '江森自控暖通设备工程有限公司', category: '暖通空调维保', contact: '张工', phone: '13810293842', rating: '4.9/5.0', status: '长期合作' },
    { id: 'sup-02', code: 'SUP-2026-002', name: '施耐德配电系统智能集成商', category: '变配电设备', contact: '李经理', phone: '13920384910', rating: '4.8/5.0', status: '合作中' },
    { id: 'sup-03', code: 'SUP-2026-003', name: '海康威视安防监控技术服务商', category: '视频监控与门禁', contact: '王工', phone: '13739201823', rating: '4.9/5.0', status: '战略合作' },
    { id: 'sup-04', code: 'SUP-2026-004', name: '奥的斯电梯维保工程服务部', category: '电梯系统', contact: '赵主管', phone: '13649201834', rating: '4.7/5.0', status: '合作中' },
  ]);

  const [orderConfigs, setOrderConfigs] = useState([
    { id: 'cfg-1', name: '自动派单超时阈值', value: '30分钟', desc: '工单派发后未接单自动升级至高级主管' },
    { id: 'cfg-2', name: '高优先级工单短信通知', value: '已开启', desc: '特急、紧急工单实时触发短信与系统弹窗告警' },
    { id: 'cfg-3', name: '维保到期提前提醒天数', value: '15天', desc: '设备定期保养到期前15天自动生成维保提醒' },
  ]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#040b1a] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* ===================== LEFT SIDEBAR: 设备运维二级三级子菜单 ===================== */}
      <aside className="w-60 bg-[#06122d] border-r border-[#133063] flex flex-col shrink-0">
        <div className="p-3.5 border-b border-[#133063] bg-[#040e24] flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span>设施设备运维中心</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">5大模块</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          
          {/* 1. 设备维修 */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveSecondary('设备维修');
                setActiveTertiary('报修申请');
                toggleSection('设备维修');
              }}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between border ${
                activeSecondary === '设备维修'
                  ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                  : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-300" />
                <span>设备维修</span>
              </div>
              {expandedSections['设备维修'] ? <ChevronDown className="w-3.5 h-3.5 text-cyan-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {expandedSections['设备维修'] && (
              <div className="pl-6 space-y-1 border-l-2 border-[#163a76] ml-4 my-1">
                {['报修申请'].map((tert) => {
                  const isActive = activeSecondary === '设备维修' && activeTertiary === tert;
                  return (
                    <button
                      key={tert}
                      onClick={() => {
                        setActiveSecondary('设备维修');
                        setActiveTertiary(tert);
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

          {/* 2. 设备巡检 */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveSecondary('设备巡检');
                setActiveTertiary('巡检计划');
                toggleSection('设备巡检');
              }}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between border ${
                activeSecondary === '设备巡检'
                  ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                  : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-teal-300" />
                <span>设备巡检</span>
              </div>
              {expandedSections['设备巡检'] ? <ChevronDown className="w-3.5 h-3.5 text-cyan-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {expandedSections['设备巡检'] && (
              <div className="pl-6 space-y-1 border-l-2 border-[#163a76] ml-4 my-1">
                {['巡检计划', '巡检记录'].map((tert) => {
                  const isActive = activeSecondary === '设备巡检' && activeTertiary === tert;
                  return (
                    <button
                      key={tert}
                      onClick={() => {
                        setActiveSecondary('设备巡检');
                        setActiveTertiary(tert);
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

          {/* 3. 设备维保 */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveSecondary('设备维保');
                setActiveTertiary('维保计划');
                toggleSection('设备维保');
              }}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between border ${
                activeSecondary === '设备维保'
                  ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                  : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-purple-300" />
                <span>设备维保</span>
              </div>
              {expandedSections['设备维保'] ? <ChevronDown className="w-3.5 h-3.5 text-cyan-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {expandedSections['设备维保'] && (
              <div className="pl-6 space-y-1 border-l-2 border-[#163a76] ml-4 my-1">
                {['维保计划', '维保记录'].map((tert) => {
                  const isActive = activeSecondary === '设备维保' && activeTertiary === tert;
                  return (
                    <button
                      key={tert}
                      onClick={() => {
                        setActiveSecondary('设备维保');
                        setActiveTertiary(tert);
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

          {/* 4. 工单管理 */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveSecondary('工单管理');
                setActiveTertiary('维修工单');
                toggleSection('工单管理');
              }}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between border ${
                activeSecondary === '工单管理'
                  ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                  : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-300" />
                <span>工单管理</span>
              </div>
              {expandedSections['工单管理'] ? <ChevronDown className="w-3.5 h-3.5 text-cyan-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {expandedSections['工单管理'] && (
              <div className="pl-6 space-y-1 border-l-2 border-[#163a76] ml-4 my-1">
                {['维修工单', '巡检工单', '维保工单', '工单配置'].map((tert) => {
                  const isActive = activeSecondary === '工单管理' && activeTertiary === tert;
                  return (
                    <button
                      key={tert}
                      onClick={() => {
                        setActiveSecondary('工单管理');
                        setActiveTertiary(tert);
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

          {/* 5. 供应商管理 */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveSecondary('供应商管理');
                setActiveTertiary('供应商列表');
                toggleSection('供应商管理');
              }}
              className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between border ${
                activeSecondary === '供应商管理'
                  ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                  : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-300" />
                <span>供应商管理</span>
              </div>
              {expandedSections['供应商管理'] ? <ChevronDown className="w-3.5 h-3.5 text-cyan-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {expandedSections['供应商管理'] && (
              <div className="pl-6 space-y-1 border-l-2 border-[#163a76] ml-4 my-1">
                {['供应商列表'].map((tert) => {
                  const isActive = activeSecondary === '供应商管理' && activeTertiary === tert;
                  return (
                    <button
                      key={tert}
                      onClick={() => {
                        setActiveSecondary('供应商管理');
                        setActiveTertiary(tert);
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

      {/* ===================== RIGHT MAIN CONTENT AREA ===================== */}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 lg:p-5 bg-[#040b1a] space-y-4">
        
        {toastMessage && (
          <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-1 z-50">
            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* If 设备维修 -> 报修申请: Exact match to image_46d2f83f.png */}
        {(() => {
          let content = null;
          if (activeSecondary === '设备维修' && activeTertiary === '报修申请') {
            content = (
          <div className="space-y-4">
            
            {/* Top Title */}
            <div className="flex items-center justify-between pb-2 border-b border-[#133063]">
              <div className="text-cyan-400 font-bold text-sm tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_8px_#22d3ee]" />
                <span className="text-white text-base">报修申请</span>
              </div>
            </div>

            {/* Two-Column Layout matching screenshot image_46d2f83f.png */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Left Column: Form & QR Code (col-span-7) */}
              <div className="xl:col-span-7 bg-[#06122d] border border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-red-400 font-semibold flex items-center gap-1">
                      <span>*</span> <span>报修类别</span>
                    </label>
                    <select 
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option>公区报修</option>
                      <option>户内报修</option>
                      <option>设备大修</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-red-400 font-semibold flex items-center gap-1">
                      <span>*</span> <span>报修类型</span>
                    </label>
                    <select 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option>照明设备</option>
                      <option>暖通设备</option>
                      <option>监控设备</option>
                      <option>给排水设备</option>
                      <option>门禁道闸</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-red-400 font-semibold flex items-center gap-1">
                      <span>*</span> <span>所在楼栋</span>
                    </label>
                    <select 
                      value={formBuilding}
                      onChange={(e) => setFormBuilding(e.target.value)}
                      className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option>T1</option>
                      <option>T2</option>
                      <option>T3</option>
                      <option>地下车库</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-red-400 font-semibold flex items-center gap-1">
                      <span>*</span> <span>所在楼层</span>
                    </label>
                    <select 
                      value={formFloor}
                      onChange={(e) => setFormFloor(e.target.value)}
                      className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option>1F</option>
                      <option>2F</option>
                      <option>3F</option>
                      <option>4F</option>
                      <option>5F</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-red-400 font-semibold flex items-center gap-1">
                    <span>*</span> <span>详细位置</span>
                  </label>
                  <input 
                    type="text" 
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="请填写故障并比m设备/设离详细位置" 
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-red-400 font-semibold flex items-center gap-1">
                      <span>*</span> <span>报修数量</span>
                    </label>
                    <input 
                      type="number" 
                      value={formQty}
                      onChange={(e) => setFormQty(e.target.value)}
                      placeholder="请填写故障设备数量" 
                      className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-red-400 font-semibold flex items-center gap-1">
                      <span>*</span> <span>报修人姓名</span>
                    </label>
                    <input 
                      type="text" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="请填写报修人真实姓名" 
                      className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">报修人单位</label>
                    <input 
                      type="text" 
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      placeholder="请填写报修人所在单位" 
                      className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-red-400 font-semibold flex items-center gap-1">
                      <span>*</span> <span>报修人手机</span>
                    </label>
                    <input 
                      type="text" 
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="请填写报修人11位手机号码" 
                      className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-red-400 font-semibold flex items-center gap-1">
                    <span>*</span> <span>报修描述</span>
                  </label>
                  <textarea 
                    rows={4} 
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="200字以内" 
                    maxLength={200}
                    className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none" 
                  />
                </div>

                {/* Bottom Buttons & QR Code Widget matching screenshot */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setFormLocation('');
                        setFormDesc('');
                        triggerToast('已清空报修表单');
                      }}
                      className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSubmitRepair}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
                    >
                      提交报修
                    </button>
                  </div>

                  {/* QR Code Widget matching screenshot */}
                  <div className="flex flex-col items-center p-2 bg-[#030a1c] border border-cyan-500/40 rounded-xl shadow">
                    <div className="w-16 h-16 bg-white rounded flex items-center justify-center p-1">
                      <QrCode className="w-full h-full text-slate-950" />
                    </div>
                    <span className="text-[9.5px] font-mono text-cyan-300 mt-1">移动端扫码报修</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 维修动态信息 (col-span-5) showing 10 items per page */}
              <div className="xl:col-span-5 bg-[#06122d] border border-cyan-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-center text-cyan-300 font-bold text-sm tracking-wider pb-3 border-b border-[#133063] mb-4">
                    维修动态信息 (每页显示10条)
                  </h3>

                  <div className="space-y-3 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
                    {maintenanceFeedItems.map((item, idx) => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-[#030a1c] border border-[#133063] flex flex-col space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between items-center border-b border-[#133063]/60 pb-1.5">
                          <span className="font-sans font-bold text-white text-[12px]">{item.title}</span>
                          <span className="text-[10px] text-cyan-400">工单号: {item.code}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                          <div>报 修 人: <span className="text-cyan-300">{item.reporter}</span></div>
                          <div>报修时间: <span className="text-cyan-300">{item.reportTime}</span></div>
                          <div>接 单 人: <span className="text-cyan-300">{item.assignee}</span></div>
                          <div>接单时间: <span className="text-cyan-300">{item.assignTime}</span></div>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[11px] text-slate-400 font-sans">工单状态:</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.status === '处理中' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                            item.status === '处理超时' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                            item.status === '已完成' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination info matching user request "每页显示10条" */}
                <div className="pt-3 border-t border-[#133063] flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>总计: 10 条动态</span>
                  <span className="text-cyan-300">当前第 1/1 页 (每页显示10条)</span>
                </div>
              </div>

            </div>

          </div>
            );
          } else if (activeSecondary === '设备巡检' && activeTertiary === '巡检计划') {
            content = (
          <div className="space-y-4">
            
            {/* Top Stat Cards matching screenshot image_6756fb48.png */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">计划总数</div>
                  <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">10</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">任务总数</div>
                  <div className="text-2xl font-bold text-blue-300 font-mono mt-1">888</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">任务完成总数</div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">420</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <div className="flex items-center gap-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-1.5 font-mono">
                  <input 
                    type="date" 
                    value={inspectionStartDate} 
                    onChange={(e) => setInspectionStartDate(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                  <span className="text-slate-500">-</span>
                  <input 
                    type="date" 
                    value={inspectionEndDate} 
                    onChange={(e) => setInspectionEndDate(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                </div>

                <select 
                  value={inspectionQueryType}
                  onChange={(e) => setInspectionQueryType(e.target.value)}
                  className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>周期计划</option>
                  <option>临时计划</option>
                  <option>专项计划</option>
                </select>

                <input 
                  type="text" 
                  value={inspectionQueryName}
                  onChange={(e) => setInspectionQueryName(e.target.value)}
                  placeholder="计划名称" 
                  className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />

                <button 
                  onClick={() => {
                    setInspectionQueryName('');
                    setInspectionQueryType('周期计划');
                    triggerToast('已重置查询条件');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <button 
                onClick={() => {
                  setInspFormName('');
                  setInspFormType('周期计划');
                  setInspFormDeviceType('照明设备');
                  setInspFormFrequency('年检');
                  setInspFormIsEnabled('是');
                  setIsAddInspModalOpen(true);
                }}
                className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>新增</span>
              </button>
            </div>

            {/* Table Area matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">计划名称</th>
                      <th className="px-4 py-3.5">计划类型</th>
                      <th className="px-4 py-3.5 font-sans">设备类型</th>
                      <th className="px-4 py-3.5">计划开始执行日期</th>
                      <th className="px-4 py-3.5">计划结束执行日期</th>
                      <th className="px-3 py-3.5">执行频率</th>
                      <th className="px-3 py-3.5">状态</th>
                      <th className="px-3 py-3.5">创建人</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {inspectionPlanList.slice((inspPlanPage - 1) * 10, inspPlanPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(inspPlanPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-white">{item.name}</td>
                        <td className="px-4 py-3.5 text-cyan-300">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.deviceType}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.startDate}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.endDate}</td>
                        <td className="px-3 py-3.5 text-teal-300">{item.frequency}</td>
                        <td className="px-3 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-slate-300">{item.creator}</td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedInspItem(item);
                              setIsDetailInspModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            详情
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedInspItem(item);
                              setInspFormName(item.name);
                              setIsEditInspModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => {
                              setInspectionPlanList(prev => prev.filter(p => p.id !== item.id));
                              triggerToast(`已成功删除巡检计划: ${item.name}`);
                            }}
                            className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold transition-all cursor-pointer"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching user requirement */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-300 font-bold">{inspectionPlanList.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={inspPlanPage <= 1}
                    onClick={() => setInspPlanPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.ceil(inspectionPlanList.length / 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setInspPlanPage(p)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        inspPlanPage === p
                          ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={inspPlanPage >= Math.ceil(inspectionPlanList.length / 10)}
                    onClick={() => setInspPlanPage(p => Math.min(Math.ceil(inspectionPlanList.length / 10), p + 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    下一页
                  </button>
                  <button onClick={() => triggerToast('巡检计划数据已成功导出为 Excel 文件')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer font-sans">导出数据</button>
                </div>
              </div>
            </div>

            {/* Add Inspection Modal */}
            {isAddInspModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">新增巡检计划任务</h3>
                    <button onClick={() => setIsAddInspModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="space-y-4 text-xs font-sans">
                    {/* Row 1: 计划名称 & 计划类型 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>计划名称</span>
                        </label>
                        <input 
                          type="text" 
                          value={inspFormName} 
                          onChange={(e) => setInspFormName(e.target.value)}
                          placeholder="请填写计划名称" 
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>计划类型</span>
                        </label>
                        <div className="flex items-center gap-6 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                            <input 
                              type="radio" 
                              name="inspType" 
                              checked={inspFormType === '周期计划'} 
                              onChange={() => setInspFormType('周期计划')}
                              className="text-cyan-500 focus:ring-0" 
                            />
                            <span>周期计划</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                            <input 
                              type="radio" 
                              name="inspType" 
                              checked={inspFormType === '临时计划'} 
                              onChange={() => setInspFormType('临时计划')}
                              className="text-cyan-500 focus:ring-0" 
                            />
                            <span>临时计划</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: 设备类型 & 选择设备(多选) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>设备类型</span>
                        </label>
                        <select 
                          value={inspFormDeviceType}
                          onChange={(e) => setInspFormDeviceType(e.target.value)}
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option>门禁设备</option>
                          <option>照明设备</option>
                          <option>空调设备</option>
                          <option>给排水设备</option>
                          <option>消防设备</option>
                          <option>安防设备</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>选择设备(多选)</span>
                        </label>
                        <select 
                          value={inspFormDeviceType}
                          onChange={(e) => setInspFormDeviceType(e.target.value)}
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option>1楼道闸</option>
                          <option>2楼门禁控制器</option>
                          <option>地下车库出入口道闸</option>
                          <option>全楼门禁系统综合</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: 计划开始执行日期 & 计划结束执行日期 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>计划开始执行日期</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="date" 
                            defaultValue="2026-11-01"
                            className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>计划结束执行日期</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="date" 
                            defaultValue="2027-11-01"
                            className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 4: 执行频率 */}
                    <div className="space-y-2">
                      <label className="text-red-400 font-semibold flex items-center gap-1">
                        <span>*</span> <span>执行频率</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-6 pt-1">
                        {['年检', '季检', '月检', '周检', '日检'].map(freq => (
                          <label key={freq} className="flex items-center gap-2 cursor-pointer text-slate-200">
                            <input 
                              type="radio" 
                              name="inspFreq" 
                              checked={inspFormFrequency === freq} 
                              onChange={() => setInspFormFrequency(freq)}
                              className="text-cyan-500 focus:ring-0" 
                            />
                            <span>{freq}</span>
                          </label>
                        ))}
                      </div>

                      {/* Frequency Time row matching screenshot */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                        <span className="text-slate-300 font-sans">第1次</span>
                        <select className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white">
                          <option>1月</option>
                          <option>2月</option>
                          <option>3月</option>
                          <option>4月</option>
                        </select>
                        <select className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white">
                          <option>1日</option>
                          <option>2日</option>
                          <option>5日</option>
                          <option>10日</option>
                        </select>
                        <input 
                          type="time" 
                          defaultValue="08:00"
                          className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white" 
                        />
                        <button onClick={() => triggerToast('已添加新的执行时间段')} className="w-7 h-7 rounded-full bg-cyan-600 hover:bg-cyan-500 flex items-center justify-center text-white font-bold cursor-pointer transition-all shadow">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Row 5: 是否启用计划 */}
                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold flex items-center gap-1">
                        <span>*</span> <span>是否启用计划</span>
                      </label>
                      <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input 
                            type="radio" 
                            name="inspEnable" 
                            checked={inspFormIsEnabled === '是'} 
                            onChange={() => setInspFormIsEnabled('是')}
                            className="text-cyan-500 focus:ring-0" 
                          />
                          <span>是</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input 
                            type="radio" 
                            name="inspEnable" 
                            checked={inspFormIsEnabled === '否'} 
                            onChange={() => setInspFormIsEnabled('否')}
                            className="text-cyan-500 focus:ring-0" 
                          />
                          <span>否</span>
                        </label>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                    <button onClick={() => setIsAddInspModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        if (!inspFormName.trim()) {
                          triggerToast('请填写计划名称');
                          return;
                        }
                        const newItem = {
                          id: `ip-${Date.now()}`,
                          name: inspFormName,
                          type: inspFormType,
                          deviceType: inspFormDeviceType,
                          startDate: '2026-11-01',
                          endDate: '2027-11-01',
                          frequency: inspFormFrequency,
                          status: inspFormIsEnabled === '是' ? '启用' : '停用',
                          creator: 'admin'
                        };
                        setInspectionPlanList([newItem, ...inspectionPlanList]);
                        setIsAddInspModalOpen(false);
                        setInspFormName('');
                        triggerToast('成功新增巡检计划');
                      }} 
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Inspection Modal */}
            {isEditInspModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">修改巡检计划任务</h3>
                    <button onClick={() => setIsEditInspModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold">计划名称</label>
                      <input 
                        type="text" 
                        value={inspFormName} 
                        onChange={(e) => setInspFormName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-sans" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsEditInspModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">取消</button>
                    <button 
                      onClick={() => {
                        if (!selectedInspItem) return;
                        setInspectionPlanList(prev => prev.map(p => p.id === selectedInspItem.id ? { ...p, name: inspFormName } : p));
                        setIsEditInspModalOpen(false);
                        triggerToast('巡检计划修改成功');
                      }} 
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow"
                    >
                      确认修改
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detail Inspection Modal */}
            {isDetailInspModalOpen && selectedInspItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300 font-sans">巡检计划详细档案</h3>
                    <button onClick={() => setIsDetailInspModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>计划编号: <span className="text-cyan-300">{selectedInspItem.id}</span></div>
                    <div>计划名称: <span className="text-white font-sans font-bold">{selectedInspItem.name}</span></div>
                    <div>计划类型: <span className="text-cyan-300">{selectedInspItem.type}</span></div>
                    <div>设备类型: <span className="text-cyan-300">{selectedInspItem.deviceType}</span></div>
                    <div>执行周期: <span className="text-cyan-300">{selectedInspItem.frequency}</span></div>
                    <div>开始日期: <span className="text-cyan-300">{selectedInspItem.startDate}</span></div>
                    <div>结束日期: <span className="text-cyan-300">{selectedInspItem.endDate}</span></div>
                    <div>状态: <span className="text-emerald-400 font-bold">{selectedInspItem.status}</span></div>
                    <div>创建人: <span className="text-cyan-300">{selectedInspItem.creator}</span></div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => setIsDetailInspModalOpen(false)} className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs">关闭</button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          } else if (activeSecondary === '设备巡检' && activeTertiary === '巡检记录') {
            content = (
          <div className="space-y-4">
            
            {/* Top Stat Cards matching screenshot image_d89ce9f3.png */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">本月任务总数</div>
                  <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">10</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">已完成</div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">6</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">进行中</div>
                  <div className="text-2xl font-bold text-amber-300 font-mono mt-1">4</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <div className="flex items-center gap-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-1.5 font-mono">
                  <input 
                    type="date" 
                    defaultValue="2026-11-01" 
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                  <span className="text-slate-500">-</span>
                  <input 
                    type="date" 
                    defaultValue="2026-11-30" 
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                </div>

                <input 
                  type="text" 
                  value={recordQueryExecutor}
                  onChange={(e) => setRecordQueryExecutor(e.target.value)}
                  placeholder="执行人" 
                  className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />

                <button 
                  onClick={() => {
                    setRecordQueryExecutor('');
                    triggerToast('已重置查询条件');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>
            </div>

            {/* Table Area matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">计划名称</th>
                      <th className="px-4 py-3.5 font-sans">设备类型</th>
                      <th className="px-3 py-3.5">巡检类型</th>
                      <th className="px-4 py-3.5">计划巡检时间</th>
                      <th className="px-3 py-3.5 font-sans">执行人</th>
                      <th className="px-4 py-3.5">巡检时间</th>
                      <th className="px-3 py-3.5">巡检状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {inspectionRecordList.slice((inspRecordPage - 1) * 10, inspRecordPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(inspRecordPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-white">{item.name}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.deviceType}</td>
                        <td className="px-3 py-3.5 text-cyan-300">{item.type}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.planTime}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.executor}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.inspectTime}</td>
                        <td className="px-3 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '进行中' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans">
                          <button 
                            onClick={() => {
                              setSelectedRecordItem(item);
                              setIsRecordModalOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching screenshot image_d89ce9f3.png */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-300 font-bold">{inspectionRecordList.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={inspRecordPage <= 1}
                    onClick={() => setInspRecordPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.ceil(inspectionRecordList.length / 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setInspRecordPage(p)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        inspRecordPage === p
                          ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={inspRecordPage >= Math.ceil(inspectionRecordList.length / 10)}
                    onClick={() => setInspRecordPage(p => Math.min(Math.ceil(inspectionRecordList.length / 10), p + 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    下一页
                  </button>
                  <button onClick={() => triggerToast('巡检记录数据已成功导出为 Excel 文件')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer font-sans">导出数据</button>
                </div>
              </div>
            </div>

            {/* View Work Order Modal */}
            {isRecordModalOpen && selectedRecordItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300 font-sans">巡检工单详细档案</h3>
                    <button onClick={() => setIsRecordModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>任务编号: <span className="text-cyan-300">XJ-GD-2026-0081</span></div>
                    <div>计划名称: <span className="text-white font-sans font-bold">{selectedRecordItem.name}</span></div>
                    <div>设备类型: <span className="text-cyan-300">{selectedRecordItem.deviceType}</span></div>
                    <div>巡检类型: <span className="text-cyan-300">{selectedRecordItem.type}</span></div>
                    <div>计划巡检时间: <span className="text-cyan-300">{selectedRecordItem.planTime}</span></div>
                    <div>执行巡检人: <span className="text-cyan-300">{selectedRecordItem.executor}</span></div>
                    <div>实际巡检时间: <span className="text-cyan-300">{selectedRecordItem.inspectTime}</span></div>
                    <div>巡检状态: <span className="text-amber-400 font-bold">{selectedRecordItem.status}</span></div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => setIsRecordModalOpen(false)} className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs">关闭</button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          } else if (activeSecondary === '设备维保' && activeTertiary === '维保计划') {
            content = (
          <div className="space-y-4">
            
            {/* Top Stat Cards matching screenshot image_bcc035e1.png */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">计划总数</div>
                  <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">10</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">任务总数</div>
                  <div className="text-2xl font-bold text-blue-300 font-mono mt-1">888</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">任务完成总数</div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">420</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <div className="flex items-center gap-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-1.5 font-mono">
                  <input 
                    type="date" 
                    defaultValue="2026-11-01" 
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                  <span className="text-slate-500">-</span>
                  <input 
                    type="date" 
                    defaultValue="2026-11-30" 
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                </div>

                <select 
                  value={maintQueryType}
                  onChange={(e) => setMaintQueryType(e.target.value)}
                  className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>周期计划</option>
                  <option>临时计划</option>
                  <option>专项计划</option>
                </select>

                <input 
                  type="text" 
                  value={maintQueryName}
                  onChange={(e) => setMaintQueryName(e.target.value)}
                  placeholder="计划名称" 
                  className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />

                <button 
                  onClick={() => {
                    setMaintQueryName('');
                    setMaintQueryType('周期计划');
                    triggerToast('已重置查询条件');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>

              <button 
                onClick={() => {
                  setMaintFormName('');
                  setMaintFormType('周期计划');
                  setMaintFormDeviceType('门禁设备');
                  setMaintFormFrequency('年保');
                  setMaintFormIsEnabled('是');
                  setIsAddMaintModalOpen(true);
                }}
                className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>新增</span>
              </button>
            </div>

            {/* Table Area matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">计划名称</th>
                      <th className="px-4 py-3.5">计划类型</th>
                      <th className="px-4 py-3.5 font-sans">设备类型</th>
                      <th className="px-4 py-3.5">计划开始执行日期</th>
                      <th className="px-4 py-3.5">计划结束执行日期</th>
                      <th className="px-3 py-3.5">执行频率</th>
                      <th className="px-3 py-3.5">状态</th>
                      <th className="px-3 py-3.5">创建人</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {maintenancePlanList.slice((maintPlanPage - 1) * 10, maintPlanPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(maintPlanPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-white">{item.name}</td>
                        <td className="px-4 py-3.5 text-cyan-300">{item.type}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.deviceType}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.startDate}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.endDate}</td>
                        <td className="px-3 py-3.5 text-teal-300">{item.frequency}</td>
                        <td className="px-3 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-slate-300">{item.creator}</td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedMaintItem(item);
                              setIsDetailMaintModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            详情
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedMaintItem(item);
                              setMaintFormName(item.name);
                              setIsEditMaintModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => {
                              setMaintenancePlanList(prev => prev.filter(p => p.id !== item.id));
                              triggerToast(`已成功删除维保计划: ${item.name}`);
                            }}
                            className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold transition-all cursor-pointer"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching user requirement */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-300 font-bold">{maintenancePlanList.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={maintPlanPage <= 1}
                    onClick={() => setMaintPlanPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.ceil(maintenancePlanList.length / 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setMaintPlanPage(p)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        maintPlanPage === p
                          ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={maintPlanPage >= Math.ceil(maintenancePlanList.length / 10)}
                    onClick={() => setMaintPlanPage(p => Math.min(Math.ceil(maintenancePlanList.length / 10), p + 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    下一页
                  </button>
                  <button onClick={() => triggerToast('维保计划数据已成功导出为 Excel 文件')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer font-sans">导出数据</button>
                </div>
              </div>
            </div>

            {/* Add Maintenance Plan Modal */}
            {isAddMaintModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">新增定期维保计划</h3>
                    <button onClick={() => setIsAddMaintModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="space-y-4 text-xs font-sans">
                    {/* Row 1: 计划名称 & 计划类型 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>计划名称</span>
                        </label>
                        <input 
                          type="text" 
                          value={maintFormName} 
                          onChange={(e) => setMaintFormName(e.target.value)}
                          placeholder="请填写计划名称" 
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>计划类型</span>
                        </label>
                        <div className="flex items-center gap-6 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                            <input 
                              type="radio" 
                              name="maintType" 
                              checked={maintFormType === '周期计划'} 
                              onChange={() => setMaintFormType('周期计划')}
                              className="text-cyan-500 focus:ring-0" 
                            />
                            <span>周期计划</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                            <input 
                              type="radio" 
                              name="maintType" 
                              checked={maintFormType === '临时计划'} 
                              onChange={() => setMaintFormType('临时计划')}
                              className="text-cyan-500 focus:ring-0" 
                            />
                            <span>临时计划</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: 设备类型 & 选择设备(多选) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>设备类型</span>
                        </label>
                        <select 
                          value={maintFormDeviceType}
                          onChange={(e) => setMaintFormDeviceType(e.target.value)}
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option>门禁设备</option>
                          <option>照明设备</option>
                          <option>空调设备</option>
                          <option>给排水设备</option>
                          <option>消防设备</option>
                          <option>安防设备</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>选择设备(多选)</span>
                        </label>
                        <select 
                          value={maintFormDeviceType}
                          onChange={(e) => setMaintFormDeviceType(e.target.value)}
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option>1楼道闸</option>
                          <option>2楼门禁控制器</option>
                          <option>地下车库出入口道闸</option>
                          <option>全楼门禁系统综合</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: 计划开始执行日期 & 计划结束执行日期 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>计划开始执行日期</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="date" 
                            defaultValue="2026-11-01"
                            className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold flex items-center gap-1">
                          <span>*</span> <span>计划结束执行日期</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="date" 
                            defaultValue="2027-11-01"
                            className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 4: 执行频率 */}
                    <div className="space-y-2">
                      <label className="text-red-400 font-semibold flex items-center gap-1">
                        <span>*</span> <span>执行频率</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-6 pt-1">
                        {['年保', '季保', '月保', '周保', '日保'].map(freq => (
                          <label key={freq} className="flex items-center gap-2 cursor-pointer text-slate-200">
                            <input 
                              type="radio" 
                              name="maintFreq" 
                              checked={maintFormFrequency === freq} 
                              onChange={() => setMaintFormFrequency(freq)}
                              className="text-cyan-500 focus:ring-0" 
                            />
                            <span>{freq}</span>
                          </label>
                        ))}
                      </div>

                      {/* Frequency Time row matching screenshot image_38e178b1.png */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                        <span className="text-slate-300 font-sans">第1次</span>
                        <select className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white">
                          <option>1月</option>
                          <option>2月</option>
                          <option>3月</option>
                          <option>4月</option>
                        </select>
                        <select className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white">
                          <option>1日</option>
                          <option>2日</option>
                          <option>5日</option>
                          <option>10日</option>
                        </select>
                        <input 
                          type="time" 
                          defaultValue="08:00"
                          className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white" 
                        />
                        <button onClick={() => triggerToast('已添加新的维保执行时间段')} className="w-7 h-7 rounded-full bg-cyan-600 hover:bg-cyan-500 flex items-center justify-center text-white font-bold cursor-pointer transition-all shadow">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Row 5: 是否启用计划 */}
                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold flex items-center gap-1">
                        <span>*</span> <span>是否启用计划</span>
                      </label>
                      <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input 
                            type="radio" 
                            name="maintEnable" 
                            checked={maintFormIsEnabled === '是'} 
                            onChange={() => setMaintFormIsEnabled('是')}
                            className="text-cyan-500 focus:ring-0" 
                          />
                          <span>是</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input 
                            type="radio" 
                            name="maintEnable" 
                            checked={maintFormIsEnabled === '否'} 
                            onChange={() => setMaintFormIsEnabled('否')}
                            className="text-cyan-500 focus:ring-0" 
                          />
                          <span>否</span>
                        </label>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                    <button onClick={() => setIsAddMaintModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        if (!maintFormName.trim()) {
                          triggerToast('请填写计划名称');
                          return;
                        }
                        const newItem = {
                          id: `mp-${Date.now()}`,
                          name: maintFormName,
                          type: maintFormType,
                          deviceType: maintFormDeviceType,
                          startDate: '2026-11-01',
                          endDate: '2027-11-01',
                          frequency: maintFormFrequency,
                          status: maintFormIsEnabled === '是' ? '启用' : '停用',
                          creator: 'admin'
                        };
                        setMaintenancePlanList([newItem, ...maintenancePlanList]);
                        setIsAddMaintModalOpen(false);
                        setMaintFormName('');
                        triggerToast('成功新增维保计划');
                      }} 
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Maintenance Plan Modal */}
            {isEditMaintModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">修改维保计划</h3>
                    <button onClick={() => setIsEditMaintModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold">计划名称</label>
                      <input 
                        type="text" 
                        value={maintFormName} 
                        onChange={(e) => setMaintFormName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-sans" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsEditMaintModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">取消</button>
                    <button 
                      onClick={() => {
                        if (!selectedMaintItem) return;
                        setMaintenancePlanList(prev => prev.map(p => p.id === selectedMaintItem.id ? { ...p, name: maintFormName } : p));
                        setIsEditMaintModalOpen(false);
                        triggerToast('维保计划修改成功');
                      }} 
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow"
                    >
                      确认修改
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detail Maintenance Plan Modal */}
            {isDetailMaintModalOpen && selectedMaintItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300 font-sans">维保计划详细档案</h3>
                    <button onClick={() => setIsDetailMaintModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>计划编号: <span className="text-cyan-300">{selectedMaintItem.id}</span></div>
                    <div>计划名称: <span className="text-white font-sans font-bold">{selectedMaintItem.name}</span></div>
                    <div>计划类型: <span className="text-cyan-300">{selectedMaintItem.type}</span></div>
                    <div>设备类型: <span className="text-cyan-300">{selectedMaintItem.deviceType}</span></div>
                    <div>执行频率: <span className="text-cyan-300">{selectedMaintItem.frequency}</span></div>
                    <div>开始日期: <span className="text-cyan-300">{selectedMaintItem.startDate}</span></div>
                    <div>结束日期: <span className="text-cyan-300">{selectedMaintItem.endDate}</span></div>
                    <div>状态: <span className="text-emerald-400 font-bold">{selectedMaintItem.status}</span></div>
                    <div>创建人: <span className="text-cyan-300">{selectedMaintItem.creator}</span></div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => setIsDetailMaintModalOpen(false)} className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs">关闭</button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          } else if (activeSecondary === '设备维保' && activeTertiary === '维保记录') {
            content = (
          <div className="space-y-4">
            
            {/* Top Stat Cards matching screenshot image_f74efad8.png */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">本月任务总数</div>
                  <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">10</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">已完成</div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">6</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">进行中</div>
                  <div className="text-2xl font-bold text-amber-300 font-mono mt-1">4</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <div className="flex items-center gap-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-1.5 font-mono">
                  <input 
                    type="date" 
                    defaultValue="2026-11-01" 
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                  <span className="text-slate-500">-</span>
                  <input 
                    type="date" 
                    defaultValue="2026-11-30" 
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                </div>

                <input 
                  type="text" 
                  value={maintRecordQueryExecutor}
                  onChange={(e) => setMaintRecordQueryExecutor(e.target.value)}
                  placeholder="执行人" 
                  className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />

                <button 
                  onClick={() => {
                    setMaintRecordQueryExecutor('');
                    triggerToast('已重置查询条件');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>
            </div>

            {/* Table Area matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">计划名称</th>
                      <th className="px-4 py-3.5 font-sans">设备类型</th>
                      <th className="px-3 py-3.5">维保类型</th>
                      <th className="px-4 py-3.5">计划维保时间</th>
                      <th className="px-3 py-3.5 font-sans">执行人</th>
                      <th className="px-4 py-3.5">维保时间</th>
                      <th className="px-3 py-3.5">维保状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {maintenanceRecordList.slice((maintRecordPage - 1) * 10, maintRecordPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(maintRecordPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-white">{item.name}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.deviceType}</td>
                        <td className="px-3 py-3.5 text-cyan-300">{item.type}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.planTime}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">{item.executor}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.inspectTime}</td>
                        <td className="px-3 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '进行中' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans">
                          <button 
                            onClick={() => {
                              setSelectedMaintRecordItem(item);
                              setIsMaintRecordModalOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            查看工单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching user requirement */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-300 font-bold">{maintenanceRecordList.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={maintRecordPage <= 1}
                    onClick={() => setMaintRecordPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.ceil(maintenanceRecordList.length / 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setMaintRecordPage(p)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        maintRecordPage === p
                          ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={maintRecordPage >= Math.ceil(maintenanceRecordList.length / 10)}
                    onClick={() => setMaintRecordPage(p => Math.min(Math.ceil(maintenanceRecordList.length / 10), p + 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    下一页
                  </button>
                  <button onClick={() => triggerToast('维保记录数据已成功导出为 Excel 文件')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer font-sans">导出数据</button>
                </div>
              </div>
            </div>

            {/* View Work Order Modal */}
            {isMaintRecordModalOpen && selectedMaintRecordItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300 font-sans">维保工单详细档案</h3>
                    <button onClick={() => setIsMaintRecordModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>任务编号: <span className="text-cyan-300">WB-GD-2026-0092</span></div>
                    <div>计划名称: <span className="text-white font-sans font-bold">{selectedMaintRecordItem.name}</span></div>
                    <div>设备类型: <span className="text-cyan-300">{selectedMaintRecordItem.deviceType}</span></div>
                    <div>维保类型: <span className="text-cyan-300">{selectedMaintRecordItem.type}</span></div>
                    <div>计划维保时间: <span className="text-cyan-300">{selectedMaintRecordItem.planTime}</span></div>
                    <div>执行维保人: <span className="text-cyan-300">{selectedMaintRecordItem.executor}</span></div>
                    <div>实际维保时间: <span className="text-cyan-300">{selectedMaintRecordItem.inspectTime}</span></div>
                    <div>维保状态: <span className="text-amber-400 font-bold">{selectedMaintRecordItem.status}</span></div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => setIsMaintRecordModalOpen(false)} className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs">关闭</button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          } else if (activeSecondary === '工单管理' && activeTertiary === '维修工单') {
            content = isRepairDetailView && selectedRepairItem ? (
            <div className="space-y-5 bg-[#06122d] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl font-sans text-slate-100 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#133063]">
                <button 
                  onClick={() => setIsRepairDetailView(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>&lt; 返回工单列表</span>
                </button>
                <span className="text-sm font-bold text-cyan-300 font-mono">工单详情档案: {selectedRepairItem.code}</span>
              </div>

              {/* Section 1: 工单信息 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">工单信息</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>工 单 号: <span className="text-white font-mono font-bold">{selectedRepairItem.code}</span></div>
                  <div>工单类型: <span className="text-cyan-300">维修工单</span></div>
                  <div>报修类别: <span className="text-slate-300">公区报修</span></div>
                  <div>报修类型: <span className="text-slate-300">门禁设备</span></div>
                  <div>所在楼栋: <span className="text-slate-300">T1</span></div>
                  <div>所在楼层: <span className="text-slate-300">1F</span></div>
                  <div>详细位置: <span className="text-slate-300">2012号房间</span></div>
                  <div>报修数量: <span className="text-slate-300 font-mono">1</span></div>
                </div>
                <div className="bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs space-y-2">
                  <div className="text-slate-400">报修描述</div>
                  <div className="text-white font-bold">灯带脱落！</div>
                  <div className="text-slate-400 pt-1">现场图片</div>
                  <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                    现场灯带照片
                  </div>
                </div>
              </div>

              {/* Section 2: 提单信息 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">提单信息</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>提 单 人: <span className="text-cyan-300">{selectedRepairItem.reporter}</span></div>
                  <div>所属公司: <span className="text-slate-300">{selectedRepairItem.company}</span></div>
                  <div>联系电话: <span className="text-slate-300 font-mono">13242772222</span></div>
                  <div>提单时间: <span className="text-slate-300 font-mono">{selectedRepairItem.reportTime}</span></div>
                  <div>处理时限: <span className="text-amber-300 font-mono">24小时</span></div>
                </div>
              </div>

              {/* Section 3: 接单信息 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">接单信息</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>工单状态: <span className="text-emerald-400 font-bold">{selectedRepairItem.status}</span></div>
                  <div>派 单 人: <span className="text-cyan-300">李春花</span></div>
                  <div>接 单 人: <span className="text-cyan-300">{selectedRepairItem.assignee === '--' ? '刘小牛、陈小春' : selectedRepairItem.assignee}</span></div>
                  <div>所属部门: <span className="text-slate-300">工程部</span></div>
                </div>
                <div className="bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs space-y-2">
                  <div className="text-slate-400">维修拍照</div>
                  <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                    维修后照片
                  </div>
                  <div className="text-slate-400 pt-1">维修描述</div>
                  <div className="text-white font-bold">修复完成！</div>
                </div>
              </div>

              {/* Section 4: 工单操作记录 (10 items per page) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">工单操作记录 (每页显示10条)</h4>
                <div className="bg-[#030a1c] border border-[#133063] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                      <tr>
                        <th className="px-5 py-3">序号</th>
                        <th className="px-4 py-3">时间</th>
                        <th className="px-4 py-3 font-sans">人员</th>
                        <th className="px-6 py-3 font-sans">操作处理</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#133063] text-slate-300">
                      {[
                        { id: 1, time: '2026-11-06 16:00:00', person: selectedRepairItem.reporter, action: `【提交工单】 ${selectedRepairItem.reporter} 提交 【公区报修】 申请！` },
                        { id: 2, time: '2026-11-06 16:15:00', person: '李春花', action: '【人工派单】 李春花 将工单派给 刘小牛！' },
                        { id: 3, time: '2026-11-06 16:15:12', person: '刘小牛', action: '【确认接单】 刘小牛 确认接单！' },
                        { id: 4, time: '2026-11-06 16:30:00', person: '刘小牛', action: '【现场勘查】 已到达现场核查故障灯带线路。' },
                        { id: 5, time: '2026-11-06 17:00:00', person: '陈小春', action: '【材料领用】 领用 LED 灯带及接线端子 1 套。' },
                        { id: 6, time: '2026-11-06 17:45:00', person: '刘小牛', action: '【维修处理】 重新焊接并固定脱落灯带。' },
                        { id: 7, time: '2026-11-06 18:00:00', person: '陈小春', action: '【质量复核】 通电测试正常，亮度达标。' },
                        { id: 8, time: '2026-11-06 18:10:00', person: '李春花', action: '【结单审核】 审核通过，符合交付标准。' },
                        { id: 9, time: '2026-11-06 18:12:00', person: selectedRepairItem.reporter, action: '【用户评价】 维修及时，服务态度很好！' },
                        { id: 10, time: '2026-11-06 18:15:00', person: '系统自动', action: '【工单归档】 维修流程已全部闭环归档。' },
                      ].map((log, idx) => (
                        <tr key={log.id} className="hover:bg-[#081b42]/60">
                          <td className="px-5 py-2.5 font-bold text-white">{idx + 1}</td>
                          <td className="px-4 py-2.5 text-cyan-300">{log.time}</td>
                          <td className="px-4 py-2.5 font-sans font-bold text-white">{log.person}</td>
                          <td className="px-6 py-2.5 font-sans text-slate-200">{log.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
            
            {/* Top Stat Cards matching screenshot image_3a38b121.png */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">报修总数</div>
                  <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">356</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">待处理派单</div>
                  <div className="text-2xl font-bold text-blue-300 font-mono mt-1">18</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">已闭环完成</div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">338</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <div className="flex items-center gap-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-1.5 font-mono">
                  <input 
                    type="date" 
                    defaultValue="2026-11-01" 
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                  <span className="text-slate-500">-</span>
                  <input 
                    type="date" 
                    defaultValue="2026-11-30" 
                    className="bg-transparent text-white focus:outline-none text-xs" 
                  />
                </div>

                <select 
                  value={repairQueryStatus}
                  onChange={(e) => setRepairQueryStatus(e.target.value)}
                  className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>待派单</option>
                  <option>处理中</option>
                  <option>已完成</option>
                  <option>挂单</option>
                </select>

                <input 
                  type="text" 
                  value={repairQueryText}
                  onChange={(e) => setRepairQueryText(e.target.value)}
                  placeholder="提单人/工单号" 
                  className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" 
                />

                <button 
                  onClick={() => {
                    setRepairQueryText('');
                    setRepairQueryStatus('待派单');
                    triggerToast('已重置查询条件');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
              </div>
            </div>

            {/* Table Area matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">工单号</th>
                      <th className="px-4 py-3.5 font-sans">工单类型</th>
                      <th className="px-3 py-3.5 font-sans">提单人</th>
                      <th className="px-4 py-3.5 font-sans">所属公司</th>
                      <th className="px-3 py-3.5">提单时间</th>
                      <th className="px-3 py-3.5 font-sans">接单人</th>
                      <th className="px-3 py-3.5">工单状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {repairOrderList.slice((repairOrderPage - 1) * 10, repairOrderPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(repairOrderPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3.5 font-bold text-cyan-300">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-white">{item.type}</td>
                        <td className="px-3 py-3.5 font-sans text-slate-300">{item.reporter}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.company}</td>
                        <td className="px-3 py-3.5 text-slate-300">{item.reportTime}</td>
                        <td className="px-3 py-3.5 font-sans text-slate-200">{item.assignee}</td>
                        <td className="px-3 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '待派单' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                            item.status === '处理中' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                            item.status === '挂单' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-1.5">
                          <button 
                            onClick={() => {
                              setSelectedRepairItem(item);
                              setRepairModalAction('派单');
                              setIsRepairModalOpen(true);
                            }}
                            className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
                          >
                            派单
                          </button>
                          {item.status === '处理中' && (
                            <>
                              <button 
                                onClick={() => {
                                  setSelectedRepairItem(item);
                                  setRepairModalAction('转单');
                                  setIsRepairModalOpen(true);
                                }}
                                className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                              >
                                转单
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedRepairItem(item);
                                  setRepairModalAction('挂单');
                                  setIsRepairModalOpen(true);
                                }}
                                className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all cursor-pointer"
                              >
                                挂单
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => {
                              setSelectedRepairItem(item);
                              setIsRepairDetailView(true);
                            }}
                            className="px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            详情
                          </button>
                          <button 
                            onClick={() => {
                              setRepairOrderList(prev => prev.map(o => o.id === item.id ? { ...o, status: '已完成', assignee: '李姚明' } : o));
                              triggerToast(`工单 ${item.code} 已成功结单归档`);
                            }}
                            className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition-all cursor-pointer"
                          >
                            结单
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching user requirement */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-300 font-bold">{repairOrderList.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={repairOrderPage <= 1}
                    onClick={() => setRepairOrderPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.ceil(repairOrderList.length / 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setRepairOrderPage(p)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        repairOrderPage === p
                          ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={repairOrderPage >= Math.ceil(repairOrderList.length / 10)}
                    onClick={() => setRepairOrderPage(p => Math.min(Math.ceil(repairOrderList.length / 10), p + 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    下一页
                  </button>
                  <button onClick={() => triggerToast('维修工单数据已成功导出为 Excel 文件')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer font-sans">导出数据</button>
                </div>
              </div>
            </div>

            {/* Repair Order Action Modal */}
            {isRepairModalOpen && selectedRepairItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300 font-sans">维修工单 [{repairModalAction}] 处理</h3>
                    <button onClick={() => setIsRepairModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>工单编号: <span className="text-cyan-300">{selectedRepairItem.code}</span></div>
                    <div>工单类型: <span className="text-white font-sans font-bold">{selectedRepairItem.type}</span></div>
                    <div>提 单 人: <span className="text-cyan-300">{selectedRepairItem.reporter}</span></div>
                    <div>所属公司: <span className="text-cyan-300">{selectedRepairItem.company}</span></div>
                    <div>提单时间: <span className="text-cyan-300">{selectedRepairItem.reportTime}</span></div>
                    <div>当前状态: <span className="text-amber-400 font-bold">{selectedRepairItem.status}</span></div>

                    {repairModalAction === '派单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">指派接单工程师:</label>
                        <select className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white font-sans">
                          <option>李姚明 (工程一部)</option>
                          <option>张海波 (强电班组)</option>
                          <option>陈工 (暖通机电)</option>
                          <option>赵主管 (特种设备)</option>
                        </select>
                      </div>
                    )}

                    {repairModalAction === '转单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">转派至班组/人员:</label>
                        <select className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white font-sans">
                          <option>张海波 (强电班组)</option>
                          <option>陈工 (暖通机电)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsRepairModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">取消</button>
                    <button 
                      onClick={() => {
                        if (repairModalAction === '派单') {
                          setRepairOrderList(prev => prev.map(o => o.id === selectedRepairItem.id ? { ...o, status: '处理中', assignee: '李姚明' } : o));
                          triggerToast(`工单 ${selectedRepairItem.code} 派单成功`);
                        } else if (repairModalAction === '转单') {
                          setRepairOrderList(prev => prev.map(o => o.id === selectedRepairItem.id ? { ...o, assignee: '张海波' } : o));
                          triggerToast(`工单 ${selectedRepairItem.code} 转单成功`);
                        } else if (repairModalAction === '挂单') {
                          setRepairOrderList(prev => prev.map(o => o.id === selectedRepairItem.id ? { ...o, status: '挂单' } : o));
                          triggerToast(`工单 ${selectedRepairItem.code} 已挂单`);
                        }
                        setIsRepairModalOpen(false);
                      }} 
                      className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold"
                    >
                      确认提交
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          } else if (activeSecondary === '工单管理' && activeTertiary === '巡检工单') {
            content = isInspectionDetailView && selectedInspectionItem ? (
            <div className="space-y-5 bg-[#06122d] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl font-sans text-slate-100 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#133063]">
                <button 
                  onClick={() => setIsInspectionDetailView(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>&lt; 返回巡检工单列表</span>
                </button>
                <div className="space-x-2">
                  <button onClick={() => { setInspectionModalAction('派单'); setIsInspectionModalOpen(true); }} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer">派单</button>
                  <button onClick={() => { setInspectionModalAction('转单'); setIsInspectionModalOpen(true); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer">转单</button>
                  <button onClick={() => { setInspectionModalAction('挂单'); setIsInspectionModalOpen(true); }} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer">挂单</button>
                  <button onClick={() => { setInspectionModalAction('结单'); setIsInspectionModalOpen(true); }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer">结单</button>
                </div>
              </div>

              {/* Section 1: 工单信息 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">工单信息</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>工 单 号: <span className="text-white font-mono font-bold">{selectedInspectionItem.code}</span></div>
                  <div>工单类型: <span className="text-cyan-300">巡检工单</span></div>
                  <div>设备类型: <span className="text-slate-300">给排水</span></div>
                  <div>计划类型: <span className="text-slate-300">周期计划</span></div>
                </div>
              </div>

              {/* Section 2: 提单信息 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-cyan-400 tracking-wider">提单信息</h4>
                  <button onClick={() => { setInspectionModalAction('转单'); setIsInspectionModalOpen(true); }} className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold cursor-pointer">转单</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>提 单 人: <span className="text-cyan-300">系统管理员1</span></div>
                  <div>所属公司: <span className="text-slate-300">东升集团</span></div>
                  <div>联系电话: <span className="text-slate-300 font-mono">13242772222</span></div>
                  <div>提单时间: <span className="text-slate-300 font-mono">2026-11-06 18:00:00</span></div>
                  <div>处理时限: <span className="text-amber-300 font-mono">30分钟</span></div>
                </div>
              </div>

              {/* Section 3: 巡检清单 matching screenshot image_fc97503a.png */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">巡检清单</h4>
                <div className="flex items-center gap-6 text-[11px] text-slate-300 py-1">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-500 inline-block rounded" /> 未巡检设备</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 inline-block rounded" /> 设备正常</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 inline-block rounded" /> 设备异常</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: '2号楼商业水箱', status: '正常', color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' },
                    { name: '3号楼商业水箱', status: '正常', color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' },
                    { name: '4号楼商业水箱', status: '未巡检', color: 'bg-slate-700/60 border-slate-600 text-slate-300' },
                    { name: '5号楼商业水箱', status: '未巡检', color: 'bg-slate-700/60 border-slate-600 text-slate-300' },
                  ].map((box, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${box.color} flex flex-col items-center justify-center gap-2 shadow`}>
                      <span className="font-bold text-xs">{box.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/30">{box.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: 接单信息 matching screenshot image_6ee196c9.png */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-cyan-400 tracking-wider">接单信息</h4>
                  <button onClick={() => { setInspectionModalAction('转单'); setIsInspectionModalOpen(true); }} className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold cursor-pointer">转单</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>工单状态: <span className="text-purple-300 font-bold">{selectedInspectionItem.status}</span></div>
                  <div>派 单 人: <span className="text-slate-400">--</span></div>
                  <div>接 单 人: <span className="text-slate-400">--</span></div>
                  <div>所属部门: <span className="text-slate-400">--</span></div>
                </div>
              </div>

              {/* Section 5: 巡检描述 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">巡检描述</h4>
                <div className="bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs text-slate-400">
                  --
                </div>
              </div>

              {/* Section 6: 工单操作记录 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">工单操作记录 (每页显示10条)</h4>
                <div className="bg-[#030a1c] border border-[#133063] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                      <tr>
                        <th className="px-5 py-3">序号</th>
                        <th className="px-4 py-3">时间</th>
                        <th className="px-4 py-3 font-sans">人员</th>
                        <th className="px-6 py-3 font-sans">操作处理</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#133063] text-slate-300">
                      {[
                        { id: 1, time: '2026-11-06 18:00:00', person: '系统管理员1', action: '【提交工单】 系统管理员1 提交 【设备巡检】 申请！' },
                        { id: 2, time: '2026-11-06 18:10:00', person: '系统', action: '【自动派发】 巡检工单已自动同步至运维中心。' },
                      ].map((log, idx) => (
                        <tr key={log.id} className="hover:bg-[#081b42]/60">
                          <td className="px-5 py-2.5 font-bold text-white">{idx + 1}</td>
                          <td className="px-4 py-2.5 text-cyan-300">{log.time}</td>
                          <td className="px-4 py-2.5 font-sans font-bold text-white">{log.person}</td>
                          <td className="px-6 py-2.5 font-sans text-slate-200">{log.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              {/* Top Stat Cards matching screenshot image_23fcec1b.png */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                  <div>
                    <div className="text-slate-400 text-xs">计划总数</div>
                    <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">2</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                  <div>
                    <div className="text-slate-400 text-xs">任务总数</div>
                    <div className="text-2xl font-bold text-blue-300 font-mono mt-1">888</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                  <div>
                    <div className="text-slate-400 text-xs">任务完成总数</div>
                    <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">420</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Query Bar */}
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-slate-300 font-bold">查询:</span>
                  <div className="flex items-center gap-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-1.5 font-mono">
                    <input type="date" defaultValue="2026-11-01" className="bg-transparent text-white focus:outline-none text-xs" />
                    <span className="text-slate-500">-</span>
                    <input type="date" defaultValue="2026-11-30" className="bg-transparent text-white focus:outline-none text-xs" />
                  </div>
                  <select className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400">
                    <option>待派单</option>
                    <option>处理中</option>
                    <option>已完成</option>
                  </select>
                  <input type="text" placeholder="提单人/工单号" className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
                  <button onClick={() => triggerToast('已重置查询条件')} className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer">重置</button>
                </div>
              </div>

              {/* Table Area (10 items per page) */}
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                      <tr>
                        <th className="px-5 py-3.5">序号</th>
                        <th className="px-4 py-3.5 font-sans">工单号</th>
                        <th className="px-4 py-3.5 font-sans">工单类型</th>
                        <th className="px-3 py-3.5 font-sans">提单人</th>
                        <th className="px-4 py-3.5 font-sans">所属公司</th>
                        <th className="px-3 py-3.5">提单时间</th>
                        <th className="px-3 py-3.5 font-sans">接单人</th>
                        <th className="px-3 py-3.5">工单状态</th>
                        <th className="px-5 py-3.5 text-right font-sans">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#133063]">
                      {inspectionWorkOrderList.slice((inspOrderPage - 1) * 10, inspOrderPage * 10).map((item, index) => (
                        <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-white">{(inspOrderPage - 1) * 10 + index + 1}</td>
                          <td className="px-4 py-3.5 font-bold text-cyan-300">{item.code}</td>
                          <td className="px-4 py-3.5 font-sans font-bold text-white">{item.type}</td>
                          <td className="px-3 py-3.5 font-sans text-slate-300">{item.reporter}</td>
                          <td className="px-4 py-3.5 font-sans text-slate-300">{item.company}</td>
                          <td className="px-3 py-3.5 text-slate-300">{item.reportTime}</td>
                          <td className="px-3 py-3.5 font-sans text-slate-200">{item.assignee}</td>
                          <td className="px-3 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              item.status === '待派单' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                              item.status === '处理中' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                              'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-sans space-x-1.5">
                            <button onClick={() => { setSelectedInspectionItem(item); setInspectionModalAction('派单'); setIsInspectionModalOpen(true); }} className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer">派单</button>
                            <button onClick={() => { setSelectedInspectionItem(item); setInspectionModalAction('转单'); setIsInspectionModalOpen(true); }} className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold cursor-pointer">转单</button>
                            <button onClick={() => { setSelectedInspectionItem(item); setInspectionModalAction('挂单'); setIsInspectionModalOpen(true); }} className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold cursor-pointer">挂单</button>
                            <button onClick={() => { setSelectedInspectionItem(item); setIsInspectionDetailView(true); }} className="px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold cursor-pointer">详情</button>
                            <button onClick={() => {
                              setSelectedInspectionItem(item);
                              setInspectionModalAction('结单');
                              setIsInspectionModalOpen(true);
                            }} className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold cursor-pointer">结单</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>总共</span>
                    <span className="text-cyan-300 font-bold">{inspectionWorkOrderList.length}</span>
                    <span>条</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      disabled={inspOrderPage <= 1}
                      onClick={() => setInspOrderPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      上一页
                    </button>
                    {Array.from({ length: Math.ceil(inspectionWorkOrderList.length / 10) }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setInspOrderPage(p)}
                        className={`px-3 py-1 rounded transition-all cursor-pointer ${
                          inspOrderPage === p
                            ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                            : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button 
                      disabled={inspOrderPage >= Math.ceil(inspectionWorkOrderList.length / 10)}
                      onClick={() => setInspOrderPage(p => Math.min(Math.ceil(inspectionWorkOrderList.length / 10), p + 1))}
                      className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      下一页
                    </button>
                    <button onClick={() => triggerToast('巡检工单数据已成功导出')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-sans cursor-pointer">导出数据</button>
                  </div>
                </div>
              </div>
              {/* Inspection Order Action Modal */}
            {isInspectionModalOpen && selectedInspectionItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300 font-sans">巡检工单 [{inspectionModalAction}] 处理</h3>
                    <button onClick={() => setIsInspectionModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>工单编号: <span className="text-cyan-300">{selectedInspectionItem.code}</span></div>
                    <div>工单类型: <span className="text-white font-sans font-bold">{selectedInspectionItem.type}</span></div>
                    <div>提 单 人: <span className="text-cyan-300">{selectedInspectionItem.reporter}</span></div>
                    <div>所属公司: <span className="text-cyan-300">{selectedInspectionItem.company}</span></div>
                    <div>提单时间: <span className="text-cyan-300">{selectedInspectionItem.reportTime}</span></div>
                    <div>当前状态: <span className="text-amber-400 font-bold">{selectedInspectionItem.status}</span></div>

                    {inspectionModalAction === '派单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">指派巡检工程师:</label>
                        <select className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white font-sans">
                          <option>赵小乐 (巡检一部)</option>
                          <option>李大牛 (机电班组)</option>
                          <option>王工 (安防运维)</option>
                        </select>
                      </div>
                    )}

                    {inspectionModalAction === '转单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">转派至班组/人员:</label>
                        <select className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white font-sans">
                          <option>李大牛 (机电班组)</option>
                          <option>王工 (安防运维)</option>
                        </select>
                      </div>
                    )}

                    {inspectionModalAction === '挂单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">挂单原因说明:</label>
                        <textarea rows={3} placeholder="请输入挂单原因..." className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white font-sans" />
                      </div>
                    )}

                    {inspectionModalAction === '结单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">结单审核与意见:</label>
                        <textarea rows={3} defaultValue="巡检设备状态正常，水箱巡检已完成，符合交付标准。" className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white font-sans" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsInspectionModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        if (inspectionModalAction === '派单') {
                          setInspectionWorkOrderList(prev => prev.map(o => o.id === selectedInspectionItem.id ? { ...o, status: '处理中', assignee: '赵小乐' } : o));
                          triggerToast(`巡检工单 ${selectedInspectionItem.code} 派单成功`);
                        } else if (inspectionModalAction === '转单') {
                          setInspectionWorkOrderList(prev => prev.map(o => o.id === selectedInspectionItem.id ? { ...o, assignee: '李大牛' } : o));
                          triggerToast(`巡检工单 ${selectedInspectionItem.code} 转单成功`);
                        } else if (inspectionModalAction === '挂单') {
                          setInspectionWorkOrderList(prev => prev.map(o => o.id === selectedInspectionItem.id ? { ...o, status: '挂单' } : o));
                          triggerToast(`巡检工单 ${selectedInspectionItem.code} 已挂单`);
                        } else if (inspectionModalAction === '结单') {
                          setInspectionWorkOrderList(prev => prev.map(o => o.id === selectedInspectionItem.id ? { ...o, status: '已完成' } : o));
                          triggerToast(`巡检工单 ${selectedInspectionItem.code} 已成功结单`);
                        }
                        setIsInspectionModalOpen(false);
                      }} 
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
                    >
                      确认提交
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          } else if (activeSecondary === '工单管理' && activeTertiary === '维保工单') {
            content = isMaintenanceDetailView && selectedMaintenanceItem ? (
            <div className="space-y-5 bg-[#06122d] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl font-sans text-slate-100 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#133063]">
                <button 
                  onClick={() => setIsMaintenanceDetailView(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>&lt; 返回维保工单列表</span>
                </button>
                <div className="space-x-2">
                  <button onClick={() => { setMaintenanceModalAction('派单'); setIsMaintenanceModalOpen(true); }} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer">派单</button>
                  <button onClick={() => { setMaintenanceModalAction('转单'); setIsMaintenanceModalOpen(true); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer">转单</button>
                  <button onClick={() => { setMaintenanceModalAction('挂单'); setIsMaintenanceModalOpen(true); }} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer">挂单</button>
                  <button onClick={() => { setMaintenanceModalAction('结单'); setIsMaintenanceModalOpen(true); }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer">结单</button>
                </div>
              </div>

              {/* Section 1: 工单信息 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">工单信息</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>工 单 号: <span className="text-white font-mono font-bold">{selectedMaintenanceItem.code}</span></div>
                  <div>工单类型: <span className="text-cyan-300">维保工单</span></div>
                  <div>设备类别: <span className="text-slate-300">暖通空调/电气系统</span></div>
                  <div>保养级别: <span className="text-slate-300">定期维保计划</span></div>
                </div>
              </div>

              {/* Section 2: 提单信息 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-cyan-400 tracking-wider">提单信息</h4>
                  <button onClick={() => { setMaintenanceModalAction('转单'); setIsMaintenanceModalOpen(true); }} className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold cursor-pointer">转单</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>提 单 人: <span className="text-cyan-300">{selectedMaintenanceItem.reporter}</span></div>
                  <div>所属公司: <span className="text-slate-300">{selectedMaintenanceItem.company}</span></div>
                  <div>联系电话: <span className="text-slate-300 font-mono">13800138000</span></div>
                  <div>提单时间: <span className="text-slate-300 font-mono">{selectedMaintenanceItem.reportTime}</span></div>
                  <div>处理时限: <span className="text-amber-300 font-mono">24小时</span></div>
                </div>
              </div>

              {/* Section 3: 维保设备清单 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">维保设备清单</h4>
                <div className="flex items-center gap-6 text-[11px] text-slate-300 py-1">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-500 inline-block rounded" /> 待保养</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 inline-block rounded" /> 保养合格</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 inline-block rounded" /> 需更换耗材</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: '1号冷水机组主机', status: '保养合格', color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' },
                    { name: '2号冷却塔电机', status: '保养合格', color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' },
                    { name: '新风机组空气过滤器', status: '需更换耗材', color: 'bg-amber-500/20 border-amber-500/50 text-amber-300' },
                    { name: '变配电低压进线柜', status: '保养合格', color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' },
                  ].map((box, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${box.color} flex flex-col items-center justify-center gap-2 shadow`}>
                      <span className="font-bold text-xs">{box.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/30">{box.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: 接单信息 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-cyan-400 tracking-wider">接单信息</h4>
                  <button onClick={() => { setMaintenanceModalAction('转单'); setIsMaintenanceModalOpen(true); }} className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold cursor-pointer">转单</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs">
                  <div>工单状态: <span className="text-purple-300 font-bold">{selectedMaintenanceItem.status}</span></div>
                  <div>派 单 人: <span className="text-slate-300">陈工 (调度中心)</span></div>
                  <div>接 单 人: <span className="text-cyan-300">{selectedMaintenanceItem.assignee}</span></div>
                  <div>所属部门: <span className="text-slate-300">工程运营部</span></div>
                </div>
              </div>

              {/* Section 5: 维保执行描述 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">维保执行描述</h4>
                <div className="bg-[#030a1c] p-4 rounded-xl border border-[#133063] text-xs text-slate-200">
                  已按计划对暖通空调系统及变配电柜进行季度专业维保，清洗冷凝器铜管，紧固电气接线端子，更换新风机组初效滤网。
                </div>
              </div>

              {/* Section 6: 工单操作记录 (10 items per page) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider">工单操作记录 (每页显示10条)</h4>
                <div className="bg-[#030a1c] border border-[#133063] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                      <tr>
                        <th className="px-5 py-3">序号</th>
                        <th className="px-4 py-3">时间</th>
                        <th className="px-4 py-3 font-sans">人员</th>
                        <th className="px-6 py-3 font-sans">操作处理</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#133063] text-slate-300">
                      {[
                        { id: 1, time: selectedMaintenanceItem.reportTime, person: selectedMaintenanceItem.reporter, action: `【提交工单】 ${selectedMaintenanceItem.reporter} 提交 【定期维保】 申请！` },
                        { id: 2, time: '2026-11-06 14:15:00', person: '陈工', action: '【系统派单】 自动匹配维保班组并下发任务。' },
                        { id: 3, time: '2026-11-06 14:30:00', person: '张工', action: '【确认接单】 张工 确认接单并准备工具。' },
                        { id: 4, time: '2026-11-06 15:00:00', person: '张工', action: '【现场保养】 到达中央空调机房开始各项保养作业。' },
                        { id: 5, time: '2026-11-06 16:20:00', person: '李经理', action: '【质量检查】 抽检电气绝缘电阻及冷却塔振动指标正常。' },
                        { id: 6, time: '2026-11-06 17:00:00', person: '张工', action: '【耗材领用】 登记领用新风滤网4套。' },
                        { id: 7, time: '2026-11-06 17:40:00', person: '张工', action: '【完成作业】 清理维保现场杂物，恢复设备联锁。' },
                        { id: 8, time: '2026-11-06 18:00:00', person: '陈工', action: '【结单审核】 审核通过，符合维保交付标准。' },
                        { id: 9, time: '2026-11-06 18:05:00', person: selectedMaintenanceItem.reporter, action: '【用户评价】 维保认真规范，设备运行平稳！' },
                        { id: 10, time: '2026-11-06 18:10:00', person: '系统自动', action: '【工单归档】 维保全流程顺利闭环归档。' },
                      ].map((log, idx) => (
                        <tr key={log.id} className="hover:bg-[#081b42]/60">
                          <td className="px-5 py-2.5 font-bold text-white">{idx + 1}</td>
                          <td className="px-4 py-2.5 text-cyan-300">{log.time}</td>
                          <td className="px-4 py-2.5 font-sans font-bold text-white">{log.person}</td>
                          <td className="px-6 py-2.5 font-sans text-slate-200">{log.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
          <div className="space-y-4">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">计划总数</div>
                  <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">10</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300"><Clock className="w-6 h-6" /></div>
              </div>
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">任务总数</div>
                  <div className="text-2xl font-bold text-blue-300 font-mono mt-1">888</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300"><FileText className="w-6 h-6" /></div>
              </div>
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">任务完成总数</div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">420</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300"><CheckCircle className="w-6 h-6" /></div>
              </div>
            </div>

            {/* Query Bar */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <div className="flex items-center gap-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl px-3 py-1.5 font-mono">
                  <input type="date" defaultValue="2026-11-01" className="bg-transparent text-white focus:outline-none text-xs" />
                  <span className="text-slate-500">-</span>
                  <input type="date" defaultValue="2026-11-30" className="bg-transparent text-white focus:outline-none text-xs" />
                </div>
                <select className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white">
                  <option>待派单</option>
                  <option>处理中</option>
                  <option>已完成</option>
                </select>
                <input type="text" placeholder="提单人/工单号" className="px-3 py-1.5 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500" />
                <button onClick={() => triggerToast('已重置查询条件')} className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">重置</button>
              </div>
            </div>

            {/* Table Area (10 items per page) */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">工单号</th>
                      <th className="px-4 py-3.5 font-sans">工单类型</th>
                      <th className="px-3 py-3.5 font-sans">提单人</th>
                      <th className="px-4 py-3.5 font-sans">所属公司</th>
                      <th className="px-3 py-3.5">提单时间</th>
                      <th className="px-3 py-3.5 font-sans">接单人</th>
                      <th className="px-3 py-3.5">工单状态</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {maintenanceWorkOrderList.slice((maintOrderPage - 1) * 10, maintOrderPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(maintOrderPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3.5 font-bold text-cyan-300">{item.code}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-white">{item.type}</td>
                        <td className="px-3 py-3.5 font-sans text-slate-300">{item.reporter}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-300">{item.company}</td>
                        <td className="px-3 py-3.5 text-slate-300">{item.reportTime}</td>
                        <td className="px-3 py-3.5 font-sans text-slate-200">{item.assignee}</td>
                        <td className="px-3 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === '待派单' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                            item.status === '处理中' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-1.5">
                          <button onClick={() => { setSelectedMaintenanceItem(item); setMaintenanceModalAction('派单'); setIsMaintenanceModalOpen(true); }} className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold cursor-pointer">派单</button>
                          <button onClick={() => { setSelectedMaintenanceItem(item); setMaintenanceModalAction('转单'); setIsMaintenanceModalOpen(true); }} className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold cursor-pointer">转单</button>
                          <button onClick={() => { setSelectedMaintenanceItem(item); setMaintenanceModalAction('挂单'); setIsMaintenanceModalOpen(true); }} className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold cursor-pointer">挂单</button>
                          <button onClick={() => { setSelectedMaintenanceItem(item); setIsMaintenanceDetailView(true); }} className="px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold cursor-pointer">详情</button>
                          <button onClick={() => {
                            setSelectedMaintenanceItem(item);
                            setMaintenanceModalAction('结单');
                            setIsMaintenanceModalOpen(true);
                          }} className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold cursor-pointer">结单</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2"><span>总共</span><span className="text-cyan-300 font-bold">{maintenanceWorkOrderList.length}</span><span>条</span></div>
                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={maintOrderPage <= 1}
                    onClick={() => setMaintOrderPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.ceil(maintenanceWorkOrderList.length / 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setMaintOrderPage(p)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        maintOrderPage === p
                          ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={maintOrderPage >= Math.ceil(maintenanceWorkOrderList.length / 10)}
                    onClick={() => setMaintOrderPage(p => Math.min(Math.ceil(maintenanceWorkOrderList.length / 10), p + 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    下一页
                  </button>
                  <button onClick={() => triggerToast('维保工单数据已成功导出为 Excel 文件')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-sans cursor-pointer">导出数据</button>
                </div>
              </div>
            </div>

            {/* Maintenance Order Action Modal */}
            {isMaintenanceModalOpen && selectedMaintenanceItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300 font-sans">维保工单 [{maintenanceModalAction}] 处理</h3>
                    <button onClick={() => setIsMaintenanceModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>工单编号: <span className="text-cyan-300">{selectedMaintenanceItem.code}</span></div>
                    <div>工单类型: <span className="text-white font-sans font-bold">{selectedMaintenanceItem.type}</span></div>
                    <div>提 单 人: <span className="text-cyan-300">{selectedMaintenanceItem.reporter}</span></div>
                    <div>所属公司: <span className="text-cyan-300">{selectedMaintenanceItem.company}</span></div>
                    <div>提单时间: <span className="text-cyan-300">{selectedMaintenanceItem.reportTime}</span></div>
                    <div>当前状态: <span className="text-amber-400 font-bold">{selectedMaintenanceItem.status}</span></div>

                    {maintenanceModalAction === '派单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">指派维保工程师:</label>
                        <select className="w-full px-3 py-2 bg-[#030a1c] border border-[#133063] rounded-xl text-white font-sans">
                          <option>张工 (暖通机电组)</option>
                          <option>李经理 (电气班组)</option>
                          <option>王工 (消防维保组)</option>
                        </select>
                      </div>
                    )}

                    {maintenanceModalAction === '转单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">转派至班组/人员:</label>
                        <select className="w-full px-3 py-2 bg-[#030a1c] border border-[#133063] rounded-xl text-white font-sans">
                          <option>李经理 (电气班组)</option>
                          <option>王工 (消防维保组)</option>
                        </select>
                      </div>
                    )}

                    {maintenanceModalAction === '挂单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">挂单原因说明:</label>
                        <textarea rows={3} placeholder="请输入挂单原因（如等待备品配件）..." className="w-full px-3 py-2 bg-[#030a1c] border border-[#133063] rounded-xl text-white font-sans" />
                      </div>
                    )}

                    {maintenanceModalAction === '结单' && (
                      <div className="pt-2 space-y-1">
                        <label className="text-slate-300 font-sans">结单审核与意见:</label>
                        <textarea rows={3} defaultValue="维保项目已按期完成，设备运行参数平稳，符合交付验收标准。" className="w-full px-3 py-2 bg-[#030a1c] border border-[#133063] rounded-xl text-white font-sans" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsMaintenanceModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        if (maintenanceModalAction === '派单') {
                          setMaintenanceWorkOrderList(prev => prev.map(o => o.id === selectedMaintenanceItem.id ? { ...o, status: '处理中', assignee: '张工' } : o));
                          triggerToast(`维保工单 ${selectedMaintenanceItem.code} 派单成功`);
                        } else if (maintenanceModalAction === '转单') {
                          setMaintenanceWorkOrderList(prev => prev.map(o => o.id === selectedMaintenanceItem.id ? { ...o, assignee: '李经理' } : o));
                          triggerToast(`维保工单 ${selectedMaintenanceItem.code} 转单成功`);
                        } else if (maintenanceModalAction === '挂单') {
                          setMaintenanceWorkOrderList(prev => prev.map(o => o.id === selectedMaintenanceItem.id ? { ...o, status: '挂单' } : o));
                          triggerToast(`维保工单 ${selectedMaintenanceItem.code} 已挂单`);
                        } else if (maintenanceModalAction === '结单') {
                          setMaintenanceWorkOrderList(prev => prev.map(o => o.id === selectedMaintenanceItem.id ? { ...o, status: '已完成' } : o));
                          triggerToast(`维保工单 ${selectedMaintenanceItem.code} 已成功结单`);
                        }
                        setIsMaintenanceModalOpen(false);
                      }} 
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
                    >
                      确认提交
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          } else if (activeSecondary === '工单管理' && activeTertiary === '工单配置') {
            content = (
          <div className="space-y-4 font-sans">
            
            {/* Top Header / Breadcrumb matching screenshot */}
            <div className="flex items-center justify-between pb-3 border-b border-[#133063]">
              <div className="flex items-center gap-6">
                <h3 className="text-sm font-bold text-cyan-300 tracking-wider">工单配置</h3>
                <div className="flex items-center gap-2 bg-[#06122d] border border-[#133063] rounded-xl p-1 text-xs font-sans">
                  {['维修工单', '巡检工单', '告警工单'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setConfigTab(tab as any)}
                      className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        configTab === tab
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsDispatchScopeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <span>派单范围</span>
              </button>
            </div>

            {/* Query Bar matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <input 
                  type="text" 
                  value={configQueryType}
                  onChange={(e) => setConfigQueryType(e.target.value)}
                  placeholder="报修类型" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 text-xs" 
                />
                <button 
                  onClick={() => {
                    setConfigQueryType('');
                    triggerToast('已重置查询条件');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>
                <button 
                  onClick={() => {
                    setFormRepairType('');
                    setFormDispatchType('自动');
                    setFormAssignee('');
                    setFormTimeLimit('30min');
                    setFormTransferTime('--');
                    setIsAddCfgModalOpen(true);
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>新增</span>
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-5 py-3.5">序号</th>
                      <th className="px-4 py-3.5 font-sans">报修类型</th>
                      <th className="px-4 py-3.5 font-sans">派单类型</th>
                      <th className="px-4 py-3.5 font-sans">接单人</th>
                      <th className="px-4 py-3.5 font-sans">处理时限</th>
                      <th className="px-4 py-3.5 font-sans">转单时间</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {configList.slice((configPage - 1) * 10, configPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white">{(configPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-cyan-300">{item.repairType}</td>
                        <td className="px-4 py-3.5 font-sans text-slate-200">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.dispatchType === '自动' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {item.dispatchType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-sans text-white">{item.assignee}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.timeLimit}</td>
                        <td className="px-4 py-3.5 text-slate-300">{item.transferTime}</td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedCfgItem(item);
                              setFormRepairType(item.repairType);
                              setFormDispatchType(item.dispatchType);
                              setFormAssignee(item.assignee);
                              setFormTimeLimit(item.timeLimit);
                              setFormTransferTime(item.transferTime);
                              setIsEditCfgModalOpen(true);
                            }}
                            className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => {
                              setConfigList((prev: any[]) => prev.filter((c: any) => c.id !== item.id));
                              triggerToast(`已成功删除工单配置: ${item.repairType}`);
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

              {/* Pagination matching user requirement */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-300 font-bold">{configList.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={configPage <= 1}
                    onClick={() => setConfigPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.ceil(configList.length / 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setConfigPage(p)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        configPage === p
                          ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={configPage >= Math.ceil(configList.length / 10)}
                    onClick={() => setConfigPage(p => Math.min(Math.ceil(configList.length / 10), p + 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    下一页
                  </button>
                  <button onClick={() => triggerToast('工单配置数据已成功导出为 Excel 文件')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer font-sans">导出数据</button>
                </div>
              </div>
            </div>

            {/* Add Configuration Modal */}
            {isAddCfgModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">新增工单派发规则配置</h3>
                    <button onClick={() => setIsAddCfgModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 报修类型 / 设备大类</label>
                      <input 
                        type="text" 
                        value={formRepairType}
                        onChange={(e) => setFormRepairType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 派单类型</label>
                      <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input type="radio" name="addDisp" checked={formDispatchType === '自动'} onChange={() => setFormDispatchType('自动')} className="text-cyan-500" />
                          <span>自动派单</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input type="radio" name="addDisp" checked={formDispatchType === '手动'} onChange={() => setFormDispatchType('手动')} className="text-cyan-500" />
                          <span>手动分派</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 接单人 / 班组</label>
                      <input 
                        type="text" 
                        value={formAssignee}
                        onChange={(e) => setFormAssignee(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-red-400 font-semibold">* 处理时限</label>
                        <select 
                          value={formTimeLimit}
                          onChange={(e) => setFormTimeLimit(e.target.value)}
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                        >
                          <option>15min</option>
                          <option>30min</option>
                          <option>60min</option>
                          <option>120min</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold">转单时间阈值</label>
                        <select 
                          value={formTransferTime}
                          onChange={(e) => setFormTransferTime(e.target.value)}
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                        >
                          <option>--</option>
                          <option>1min</option>
                          <option>2min</option>
                          <option>5min</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                    <button onClick={() => setIsAddCfgModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        const newCfg = {
                          id: `cfg-${Date.now()}`,
                          repairType: formRepairType,
                          dispatchType: formDispatchType,
                          assignee: formAssignee,
                          timeLimit: formTimeLimit,
                          transferTime: formTransferTime,
                          updateTime: '2026-11-06 18:00'
                        };
                        setConfigList([newCfg, ...configList]);
                        setIsAddCfgModalOpen(false);
                        triggerToast('成功新增工单派发配置规则');
                      }} 
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                    >
                      确认新增
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Configuration Modal */}
            {isEditCfgModalOpen && selectedCfgItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">编辑工单派发规则: {selectedCfgItem.repairType}</h3>
                    <button onClick={() => setIsEditCfgModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">报修类型</label>
                      <input 
                        type="text" 
                        value={formRepairType}
                        onChange={(e) => setFormRepairType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">派单类型</label>
                      <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input type="radio" name="editDisp" checked={formDispatchType === '自动'} onChange={() => setFormDispatchType('自动')} className="text-cyan-500" />
                          <span>自动派单</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input type="radio" name="editDisp" checked={formDispatchType === '手动'} onChange={() => setFormDispatchType('手动')} className="text-cyan-500" />
                          <span>手动分派</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">接单人 / 班组</label>
                      <input 
                        type="text" 
                        value={formAssignee}
                        onChange={(e) => setFormAssignee(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold">处理时限</label>
                        <select 
                          value={formTimeLimit}
                          onChange={(e) => setFormTimeLimit(e.target.value)}
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                        >
                          <option>15min</option>
                          <option>30min</option>
                          <option>60min</option>
                          <option>120min</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold">转单时间阈值</label>
                        <select 
                          value={formTransferTime}
                          onChange={(e) => setFormTransferTime(e.target.value)}
                          className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                        >
                          <option>--</option>
                          <option>1min</option>
                          <option>2min</option>
                          <option>5min</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                    <button onClick={() => setIsEditCfgModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        setConfigList((prev: any[]) => prev.map((c: any) => c.id === selectedCfgItem.id ? {
                          ...c,
                          repairType: formRepairType,
                          dispatchType: formDispatchType,
                          assignee: formAssignee,
                          timeLimit: formTimeLimit,
                          transferTime: formTransferTime,
                          updateTime: '2026-11-06 18:30'
                        } : c));
                        setIsEditCfgModalOpen(false);
                        triggerToast(`成功更新工单配置: ${formRepairType}`);
                      }} 
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
                    >
                      保存修改
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dispatch Scope Modal (派单范围) */}
            {isDispatchScopeModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">园区智能工单派发范围与地理/楼栋权限设置</h3>
                    <button onClick={() => setIsDispatchScopeModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#030a1c] border border-[#1b448a] space-y-3">
                      <div className="font-bold text-white">1. 区域楼栋管辖范围配置</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-300">
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-cyan-500" /> <span>T1 研发大厦</span></label>
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-cyan-500" /> <span>T2 创新中心</span></label>
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-cyan-500" /> <span>T3 商务会展</span></label>
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-cyan-500" /> <span>地下车库与泵房</span></label>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#030a1c] border border-[#1b448a] space-y-3">
                      <div className="font-bold text-white">2. 子系统派单限额与权限</div>
                      <div className="space-y-2 text-slate-300">
                        <div className="flex justify-between items-center">
                          <span>暖通空调与冷热源系统自动派单上限</span>
                          <span className="text-cyan-300 font-mono font-bold">50单/天</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>变配电及消防特急告警直派主任</span>
                          <span className="text-emerald-300 font-mono font-bold">已启用</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#030a1c] border border-[#1b448a] space-y-3">
                      <div className="font-bold text-white">3. 越权转单超时升级设置</div>
                      <div className="text-slate-400 text-[11px]">
                        当工程师接单后超过30分钟未到达现场，系统将自动触发升级警报并广播至运维调度总监。
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                    <button onClick={() => setIsDispatchScopeModalOpen(false)} className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer">确定保存范围配置</button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          } else if (activeSecondary === '供应商管理' && activeTertiary === '供应商列表') {
            content = (
          <div className="space-y-4 font-sans">
            
            {/* Top Stat Cards matching screenshot image_d703e38a.png */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">设备类型总数</div>
                  <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">12</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-slate-400 text-xs">供应商总数</div>
                  <div className="text-2xl font-bold text-blue-300 font-mono mt-1">23</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                  <User className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Query Bar matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">查询:</span>
                <select 
                  value={supplierQueryDevice}
                  onChange={(e) => setSupplierQueryDevice(e.target.value)}
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>全部</option>
                  <option>照明设备</option>
                  <option>暖通设备</option>
                  <option>变配电设备</option>
                  <option>消防设备</option>
                  <option>给排水设备</option>
                  <option>特种设备</option>
                  <option>安防设备</option>
                </select>

                <input 
                  type="text" 
                  value={supplierQueryName}
                  onChange={(e) => setSupplierQueryName(e.target.value)}
                  placeholder="供应商名称" 
                  className="px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 text-xs" 
                />

                <button 
                  onClick={() => {
                    setSupplierQueryDevice('全部');
                    setSupplierQueryName('');
                    triggerToast('已重置查询条件');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  重置
                </button>

                <button 
                  onClick={() => {
                    setSupFormDeviceType('照明设备');
                    setSupFormName('');
                    setSupFormServicePhone('');
                    setSupFormRepairPerson('');
                    setSupFormRepairPhone('');
                    setSupFormEngineer('');
                    setSupFormEngineerPhone('');
                    setSupFormSalesManager('');
                    setSupFormSalesPhone('');
                    setIsAddSupModalOpen(true);
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>新增供应商</span>
                </button>
              </div>
            </div>

            {/* Table Area (10 items per page) matching screenshot */}
            <div className="bg-[#06122d] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#081d4a] text-cyan-300 font-bold border-b border-[#133063]">
                    <tr>
                      <th className="px-4 py-3.5">序号</th>
                      <th className="px-3 py-3.5 font-sans">设备类型</th>
                      <th className="px-4 py-3.5 font-sans">供应商名称</th>
                      <th className="px-3 py-3.5">售后服务电话</th>
                      <th className="px-3 py-3.5 font-sans">维修人员</th>
                      <th className="px-3 py-3.5">维修人员电话</th>
                      <th className="px-3 py-3.5 font-sans">工程师</th>
                      <th className="px-3 py-3.5">工程师电话</th>
                      <th className="px-3 py-3.5 font-sans">售销经理</th>
                      <th className="px-3 py-3.5">销售经理电话</th>
                      <th className="px-5 py-3.5 text-right font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133063]">
                    {supplierList.slice((supplierPage - 1) * 10, supplierPage * 10).map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#081b42]/80 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-white">{(supplierPage - 1) * 10 + index + 1}</td>
                        <td className="px-3 py-3.5 font-sans text-cyan-300">{item.deviceType}</td>
                        <td className="px-4 py-3.5 font-sans font-bold text-white">{item.name}</td>
                        <td className="px-3 py-3.5 text-slate-300">{maskPhone(item.servicePhone)}</td>
                        <td className="px-3 py-3.5 font-sans text-slate-200">{item.repairPerson}</td>
                        <td className="px-3 py-3.5 text-slate-300">{maskPhone(item.repairPhone)}</td>
                        <td className="px-3 py-3.5 font-sans text-slate-200">{item.engineer}</td>
                        <td className="px-3 py-3.5 text-slate-300">{maskPhone(item.engineerPhone)}</td>
                        <td className="px-3 py-3.5 font-sans text-slate-200">{item.salesManager}</td>
                        <td className="px-3 py-3.5 text-slate-300">{maskPhone(item.salesPhone)}</td>
                        <td className="px-5 py-3.5 text-right font-sans space-x-1.5">
                          <button 
                            onClick={() => {
                              setSelectedSupItem(item);
                              setIsViewSupModalOpen(true);
                            }}
                            className="px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold transition-all cursor-pointer"
                          >
                            查看
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedSupItem(item);
                              setSupFormDeviceType(item.deviceType);
                              setSupFormName(item.name);
                              setSupFormServicePhone(item.servicePhone);
                              setSupFormRepairPerson(item.repairPerson);
                              setSupFormRepairPhone(item.repairPhone);
                              setSupFormEngineer(item.engineer);
                              setSupFormEngineerPhone(item.engineerPhone);
                              setSupFormSalesManager(item.salesManager);
                              setSupFormSalesPhone(item.salesPhone);
                              setIsEditSupModalOpen(true);
                            }}
                            className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold transition-all cursor-pointer"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => {
                              setSupplierList(prev => prev.filter(s => s.id !== item.id));
                              triggerToast(`已成功删除供应商: ${item.name}`);
                            }}
                            className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold transition-all cursor-pointer"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching user requirement */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span>总共</span>
                  <span className="text-cyan-300 font-bold">{supplierList.length}</span>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={supplierPage <= 1}
                    onClick={() => setSupplierPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.ceil(supplierList.length / 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setSupplierPage(p)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        supplierPage === p
                          ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={supplierPage >= Math.ceil(supplierList.length / 10)}
                    onClick={() => setSupplierPage(p => Math.min(Math.ceil(supplierList.length / 10), p + 1))}
                    className="px-3 py-1 rounded bg-[#081b42] border border-[#133063] text-slate-300 hover:bg-[#0c285e] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    下一页
                  </button>
                  <button onClick={() => triggerToast('供应商列表数据已成功导出为 Excel 文件')} className="ml-4 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow transition-all cursor-pointer font-sans">导出数据</button>
                </div>
              </div>
            </div>

            {/* Add Supplier Modal */}
            {isAddSupModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">新增外部集成供应商档案</h3>
                    <button onClick={() => setIsAddSupModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 设备类型</label>
                      <select 
                        value={supFormDeviceType}
                        onChange={(e) => setSupFormDeviceType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>照明设备</option>
                        <option>暖通设备</option>
                        <option>变配电设备</option>
                        <option>消防设备</option>
                        <option>给排水设备</option>
                        <option>特种设备</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-red-400 font-semibold">* 供应商名称</label>
                      <input 
                        type="text" 
                        value={supFormName}
                        onChange={(e) => setSupFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">售后服务电话</label>
                      <input 
                        type="text" 
                        value={supFormServicePhone}
                        onChange={(e) => setSupFormServicePhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">维修人员</label>
                      <input 
                        type="text" 
                        value={supFormRepairPerson}
                        onChange={(e) => setSupFormRepairPerson(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">维修人员电话</label>
                      <input 
                        type="text" 
                        value={supFormRepairPhone}
                        onChange={(e) => setSupFormRepairPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">工程师</label>
                      <input 
                        type="text" 
                        value={supFormEngineer}
                        onChange={(e) => setSupFormEngineer(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">工程师电话</label>
                      <input 
                        type="text" 
                        value={supFormEngineerPhone}
                        onChange={(e) => setSupFormEngineerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">销售经理</label>
                      <input 
                        type="text" 
                        value={supFormSalesManager}
                        onChange={(e) => setSupFormSalesManager(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5 col-span-2">
                      <label className="text-slate-300 font-semibold">销售经理电话</label>
                      <input 
                        type="text" 
                        value={supFormSalesPhone}
                        onChange={(e) => setSupFormSalesPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                    <button onClick={() => setIsAddSupModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        const newSup = {
                          id: `sup-${Date.now()}`,
                          deviceType: supFormDeviceType,
                          name: supFormName,
                          servicePhone: supFormServicePhone,
                          repairPerson: supFormRepairPerson,
                          repairPhone: supFormRepairPhone,
                          engineer: supFormEngineer,
                          engineerPhone: supFormEngineerPhone,
                          salesManager: supFormSalesManager,
                          salesPhone: supFormSalesPhone,
                          updateTime: '2026-11-06 18:00'
                        };
                        setSupplierList([newSup, ...supplierList]);
                        setIsAddSupModalOpen(false);
                        triggerToast('成功新增供应商档案');
                      }} 
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
                    >
                      确认新增
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Supplier Modal */}
            {isEditSupModalOpen && selectedSupItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300">编辑供应商档案: {selectedSupItem.name}</h3>
                    <button onClick={() => setIsEditSupModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">设备类型</label>
                      <select 
                        value={supFormDeviceType}
                        onChange={(e) => setSupFormDeviceType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>照明设备</option>
                        <option>暖通设备</option>
                        <option>变配电设备</option>
                        <option>消防设备</option>
                        <option>给排水设备</option>
                        <option>特种设备</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">供应商名称</label>
                      <input 
                        type="text" 
                        value={supFormName}
                        onChange={(e) => setSupFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">售后服务电话</label>
                      <input 
                        type="text" 
                        value={supFormServicePhone}
                        onChange={(e) => setSupFormServicePhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">维修人员</label>
                      <input 
                        type="text" 
                        value={supFormRepairPerson}
                        onChange={(e) => setSupFormRepairPerson(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">维修人员电话</label>
                      <input 
                        type="text" 
                        value={supFormRepairPhone}
                        onChange={(e) => setSupFormRepairPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">工程师</label>
                      <input 
                        type="text" 
                        value={supFormEngineer}
                        onChange={(e) => setSupFormEngineer(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">工程师电话</label>
                      <input 
                        type="text" 
                        value={supFormEngineerPhone}
                        onChange={(e) => setSupFormEngineerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">销售经理</label>
                      <input 
                        type="text" 
                        value={supFormSalesManager}
                        onChange={(e) => setSupFormSalesManager(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400" 
                      />
                    </div>

                    <div className="space-y-1.5 col-span-2">
                      <label className="text-slate-300 font-semibold">销售经理电话</label>
                      <input 
                        type="text" 
                        value={supFormSalesPhone}
                        onChange={(e) => setSupFormSalesPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#030a1c] border border-[#1b448a] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#133063]">
                    <button onClick={() => setIsEditSupModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer">取消</button>
                    <button 
                      onClick={() => {
                        setSupplierList(prev => prev.map(s => s.id === selectedSupItem.id ? {
                          ...s,
                          deviceType: supFormDeviceType,
                          name: supFormName,
                          servicePhone: supFormServicePhone,
                          repairPerson: supFormRepairPerson,
                          repairPhone: supFormRepairPhone,
                          engineer: supFormEngineer,
                          engineerPhone: supFormEngineerPhone,
                          salesManager: supFormSalesManager,
                          salesPhone: supFormSalesPhone,
                          updateTime: '2026-11-06 18:30'
                        } : s));
                        setIsEditSupModalOpen(false);
                        triggerToast(`成功更新供应商档案: ${supFormName}`);
                      }} 
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer"
                    >
                      保存修改
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View Supplier Detail Modal (查看) */}
            {isViewSupModalOpen && selectedSupItem && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#133063]">
                    <h3 className="text-sm font-bold text-cyan-300 font-sans">供应商档案详细档案</h3>
                    <button onClick={() => setIsViewSupModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>供应商名称: <span className="text-white font-sans font-bold text-sm">{selectedSupItem.name}</span></div>
                    <div>设备类型: <span className="text-cyan-300">{selectedSupItem.deviceType}</span></div>
                    <div>售后服务电话: <span className="text-cyan-300">{maskPhone(selectedSupItem.servicePhone)}</span></div>
                    <div>维修人员: <span className="text-white font-sans">{selectedSupItem.repairPerson} ({maskPhone(selectedSupItem.repairPhone)})</span></div>
                    <div>工程师: <span className="text-white font-sans">{selectedSupItem.engineer} ({maskPhone(selectedSupItem.engineerPhone)})</span></div>
                    <div>销售经理: <span className="text-white font-sans">{selectedSupItem.salesManager} ({maskPhone(selectedSupItem.salesPhone)})</span></div>
                    <div>最近更新时间: <span className="text-slate-400">{selectedSupItem.updateTime}</span></div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => setIsViewSupModalOpen(false)} className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs cursor-pointer">关闭档案</button>
                  </div>
                </div>
              </div>
            )}

          </div>
            );
          }
          return content;
        })()}

      </main>

    </div>
  );
};
