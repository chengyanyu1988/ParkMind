export type MainModule = 
  | 'dashboard'          // 数据看板
  | 'graphical-control'  // 图形化控制
  | 'automation'         // 设备自控
  | 'maintenance'        // 设备运维
  | 'alarms'             // 告警管理
  | 'system';            // 系统管理

export type SubsystemType = 
  | '视频监控'
  | '防盗告警'
  | '门禁系统'
  | '停车场系统'
  | '暖通空调'
  | '智慧照明'
  | '环境监测'
  | '冷热源'
  | '给排水'
  | '变配电'
  | '电梯系统'
  | '能耗计量'
  | '能耗'
  | '信息网络'
  | '智能照明'
  | '安防监控'
  | '消防安全'
  | '电梯监控';

export type AlarmLevel = '紧急' | '重要' | '次要' | '提示';
export type AlarmStatus = '未确认' | '处理中' | '已恢复' | '已转工单';

export interface AlarmItem {
  id: string;
  code: string;              // 告警编号 如 ALM-20261106-0042
  level: AlarmLevel;         // 告警级别
  subsystem: SubsystemType;  // 所属子系统
  deviceId: string;          // 设备ID
  deviceName: string;        // 设备名称
  deviceCode: string;        // 设备编码
  location: string;          // 告警位置
  content: string;           // 告警内容
  triggerTime: string;       // 产生时间
  status: AlarmStatus;       // 处理状态
  assignee?: string;         // 责任人
  workOrderId?: string;      // 关联工单号
  recoveryTime?: string;     // 恢复时间
  remark?: string;           // 处理备注
}

export type DeviceStatus = '运行' | '待机' | '停机' | '告警' | '离线';
export type ControlModeType = '自动' | '手动' | '远程锁定';

export interface DeviceTelemetry {
  temp?: number;             // 温度 ℃
  targetTemp?: number;       // 设定温度
  humidity?: number;         // 湿度 %
  pressure?: number;         // 压力 MPa
  frequency?: number;        // 频率 Hz
  valveOpening?: number;     // 阀门开度 %
  power?: number;            // 功率 kW
  voltage?: number;          // 电压 V
  current?: number;          // 电流 A
  liquidLevel?: number;      // 液位 m / %
  brightness?: number;       // 照度 Lux / 亮度 %
  currentFloor?: number;     // 电梯当前楼层
  direction?: 'up' | 'down' | 'idle'; // 电梯方向
  runHours?: number;         // 累计运行小时
  switchOn?: boolean;        // 开关状态
}

export interface DeviceItem {
  id: string;
  code: string;              // 设备编号 如 AHU-A1-0301
  name: string;              // 设备名称
  category: string;          // 设备类别
  subsystem: SubsystemType;  // 所属子系统
  building: string;          // 楼栋
  floor: string;             // 楼层
  location: string;          // 安装具体空间
  model: string;             // 规格型号
  manufacturer: string;      // 制造厂商
  installDate: string;       // 安装/启用日期
  status: DeviceStatus;      // 运行状态
  controlMode: ControlModeType; // 自控模式
  telemetry: DeviceTelemetry;// 遥测实时参数
  lastMaintenanceDate: string;// 上次维保
  nextMaintenanceDate: string;// 下次维保
  manager: string;           // 运维责任人
  position?: { x: number; y: number }; // 组态图坐标 (百分比 0-100)
}

export type WorkOrderType = '故障报修' | '告警派单' | '巡检异常' | '例行保养';
export type WorkOrderPriority = '特急' | '紧急' | '普通';
export type WorkOrderStatus = '待接单' | '处理中' | '待验收' | '已完成';

export interface WorkOrderItem {
  id: string;
  code: string;              // 工单编号 如 WO-20261106-003
  title: string;             // 工单标题
  type: WorkOrderType;       // 工单类型
  subsystem: SubsystemType;  // 所属系统
  deviceCode: string;        // 报修设备编号
  deviceName: string;        // 报修设备名称
  location: string;          // 发生位置
  priority: WorkOrderPriority;// 优先级
  reporter: string;          // 报修人员/系统
  reportTime: string;        // 派发时间
  assignee: string;          // 处理工程师
  status: WorkOrderStatus;   // 工单状态
  description: string;       // 故障描述
  resolution?: string;       // 处理反馈结果
  finishTime?: string;       // 完成时间
}

export interface InspectionTask {
  id: string;
  code: string;              // 任务编号
  name: string;              // 计划名称
  cycle: '每日巡检' | '每周例检' | '月度大检' | '专项安全巡检';
  routeName: string;         // 巡检路线
  totalPoints: number;       // 点位总数
  checkedPoints: number;     // 已巡点位
  abnormalPoints: number;    // 异常点位
  executor: string;          // 执行责任人
  status: '执行中' | '已完成' | '待执行' | '逾期';
  planDate: string;          // 计划日期
  completionRate: number;    // 完成率 %
}

export interface MaintenancePlan {
  id: string;
  code: string;              // 维保编号
  name: string;              // 保养计划名称
  deviceCategory: string;    // 设备类别
  subsystem: SubsystemType;  // 所属系统
  level: '一级保养' | '二级保养' | '专业大修';
  cycleDays: number;         // 周期天数
  lastDate: string;          // 上次保养日期
  nextDate: string;          // 下次保养日期
  executor: string;          // 维保单位/负责人
  status: '正常' | '待执行' | '临期提醒' | '逾期未保';
}

export interface OperationMode {
  id: string;
  code: string;
  name: string;              // 模式名称 如 夏季工作日制冷模式
  targetSubsystem: SubsystemType;
  description: string;
  activeTimeRange: string;   // 适用时间段 如 07:30 - 19:30
  scheduleType: string;      // 工作日/周末/全天
  isEnabled: boolean;        // 是否启用
  priority: number;
  activeDeviceCount: number; // 受控设备数
  updatedAt: string;
}

export interface ScheduleItem {
  id: string;
  name: string;              // 排程计划名称
  target: string;            // 受控目标
  subsystem: SubsystemType;
  daysOfWeek: string;        // 执行周期 如 周一至周五
  timeRange: string;         // 执行时间段
  action: string;            // 控制动作指令
  isEnabled: boolean;
  statusText: string;
  updatedAt: string;
}

export interface LinkageRule {
  id: string;
  name: string;              // 联动规则名称
  sourceSubsystem: SubsystemType;
  triggerCondition: string;  // 触发条件 IF
  targetSubsystem: SubsystemType;
  actionCommand: string;     // 联动执行 THEN
  targetDevices: string;     // 目标设备集
  isEnabled: boolean;
  priority: '高' | '中' | '低';
  triggerCount: number;      // 累计触发次数
  lastTriggeredTime: string; // 最近触发时间
}

export interface AuditLog {
  id: string;
  operator: string;          // 操作人员
  role: string;              // 角色
  actionType: string;        // 操作类型 (如: 远程启停, 模式切换, 参数修改, 告警确认, 工单指派)
  targetModule: string;      // 对应模块
  targetObject: string;      // 操作对象
  details: string;           // 详细记录
  ipAddress: string;         // 操作IP
  timestamp: string;         // 操作时间
  result: '成功' | '失败';
}

export interface UserAccount {
  id: string;
  username: string;
  realName: string;
  department: string;
  role: string;
  phone: string;
  status: '正常' | '禁用';
  lastLogin: string;
}

export interface SystemParam {
  id: string;
  category: string;
  paramKey: string;
  paramName: string;
  paramValue: string;
  defaultValue: string;
  description: string;
  updatedAt: string;
}
