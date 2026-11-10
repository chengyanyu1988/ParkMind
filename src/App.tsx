/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MainModule, SubsystemType, AlarmItem, DeviceItem, WorkOrderItem, AlarmStatus, WorkOrderStatus, LinkageRule } from './types/ibms';
import { 
  INITIAL_ALARMS, 
  INITIAL_DEVICES, 
  INITIAL_WORK_ORDERS, 
  INITIAL_INSPECTIONS, 
  INITIAL_MAINTENANCE_PLANS, 
  INITIAL_MODES, 
  INITIAL_SCHEDULES, 
  INITIAL_RULES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_USERS, 
  INITIAL_SYSTEM_PARAMS 
} from './data/mockData';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { GraphicalControlView } from './views/GraphicalControlView';
import { AutomationView } from './views/AutomationView';
import { MaintenanceView } from './views/MaintenanceView';
import { AlarmsView } from './views/AlarmsView';
import { SystemView } from './views/SystemView';
import { LoginView } from './views/LoginView';
import { DeviceControlModal } from './components/DeviceControlModal';
import { AlarmHandleModal } from './components/AlarmHandleModal';
import { CreateWorkOrderModal } from './components/CreateWorkOrderModal';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentModule, setCurrentModule] = useState<MainModule>('dashboard');
  const [selectedSubsystemFilter, setSelectedSubsystemFilter] = useState<SubsystemType | '全部'>('全部');

  // Application Data States
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);
  const [workOrders, setWorkOrders] = useState<WorkOrderItem[]>(INITIAL_WORK_ORDERS);
  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);
  const [maintenancePlans, setMaintenancePlans] = useState(INITIAL_MAINTENANCE_PLANS);
  const [modes, setModes] = useState(INITIAL_MODES);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [systemParams, setSystemParams] = useState(INITIAL_SYSTEM_PARAMS);

  // Modals
  const [selectedDeviceForControl, setSelectedDeviceForControl] = useState<DeviceItem | null>(null);
  const [selectedAlarmForHandle, setSelectedAlarmForHandle] = useState<AlarmItem | null>(null);
  const [isCreateWorkOrderOpen, setIsCreateWorkOrderOpen] = useState<boolean>(false);
  const [workOrderInitialData, setWorkOrderInitialData] = useState<Partial<WorkOrderItem> | null>(null);

  // Live telemetry oscillation simulation
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Telemetry fluctuation loop when simulation is enabled
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setDevices(prev => prev.map(dev => {
        if (dev.status === '停机' || dev.status === '离线') return dev;
        
        const deltaTemp = (Math.random() - 0.5) * 0.4;
        const deltaPressure = (Math.random() - 0.5) * 0.02;
        const deltaPower = (Math.random() - 0.5) * 5;

        return {
          ...dev,
          telemetry: {
            ...dev.telemetry,
            temp: dev.telemetry.temp !== undefined ? parseFloat((dev.telemetry.temp + deltaTemp).toFixed(1)) : undefined,
            pressure: dev.telemetry.pressure !== undefined ? parseFloat(Math.max(0.1, dev.telemetry.pressure + deltaPressure).toFixed(2)) : undefined,
            power: dev.telemetry.power !== undefined ? parseFloat(Math.max(1, dev.telemetry.power + deltaPower).toFixed(1)) : undefined,
          }
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Add an audit log entry helper
  const addAuditLog = (actionType: string, targetModule: string, targetObject: string, details: string) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newLog = {
      id: `log-${Date.now()}`,
      operator: '陈工 (系统管理员)',
      role: '超级管理员',
      actionType,
      targetModule,
      targetObject,
      details,
      ipAddress: '192.168.10.2',
      timestamp,
      result: '成功' as const
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Device parameter update handler
  const handleUpdateDevice = (updated: DeviceItem, actionLogMsg: string) => {
    setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
    setSelectedDeviceForControl(updated);
    addAuditLog('远程调节参数', '图形化控制 / 设备反控', updated.name, actionLogMsg);
  };

  // Alarm status update handler
  const handleConfirmAlarmStatus = (alarmId: string, newStatus: AlarmStatus, remark: string) => {
    setAlarms(prev => prev.map(a => {
      if (a.id === alarmId) {
        return {
          ...a,
          status: newStatus,
          remark: remark || a.remark,
          recoveryTime: newStatus === '已恢复' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : a.recoveryTime
        };
      }
      return a;
    }));

    const alarm = alarms.find(a => a.id === alarmId);
    if (alarm) {
      addAuditLog('告警处置确认', '告警管理', alarm.code, `处置状态变更为 [${newStatus}], 结论: ${remark || '正常'}`);
    }
  };

  // Convert Alarm to Work Order
  const handleConvertAlarmToWorkOrder = (alarm: AlarmItem) => {
    setWorkOrderInitialData({
      title: `${alarm.deviceName} 告警应急检修工单`,
      type: '告警派单',
      subsystem: alarm.subsystem,
      deviceCode: alarm.deviceCode,
      deviceName: alarm.deviceName,
      location: alarm.location,
      priority: alarm.level === '紧急' ? '特急' : alarm.level === '重要' ? '紧急' : '普通',
      description: `针对告警 [${alarm.code}] 现场处置：${alarm.content}`,
      assignee: alarm.assignee || '张海波 (暖通工程师)'
    });
    setIsCreateWorkOrderOpen(true);
  };

  // Convert Device to Work Order
  const handleCreateWorkOrderFromDevice = (device: DeviceItem) => {
    setWorkOrderInitialData({
      title: `${device.name} 运行异常例行检修`,
      type: '故障报修',
      subsystem: device.subsystem,
      deviceCode: device.code,
      deviceName: device.name,
      location: device.location,
      priority: device.status === '告警' ? '紧急' : '普通',
      description: `设备处于 ${device.status} 状态，需现场排查机械与电气控制系统。`,
      assignee: device.manager
    });
    setSelectedDeviceForControl(null);
    setIsCreateWorkOrderOpen(true);
  };

  // Submit new work order
  const handleCreateWorkOrderSubmit = (newOrder: WorkOrderItem) => {
    setWorkOrders(prev => [newOrder, ...prev]);

    // Also update alarm status if this order matches an alarm
    setAlarms(prev => prev.map(a => {
      if (a.deviceCode === newOrder.deviceCode && a.status === '未确认') {
        return { ...a, status: '已转工单', workOrderId: newOrder.code };
      }
      return a;
    }));

    addAuditLog('派发运维工单', '设备运维 / 故障工单', newOrder.code, `已指派给 ${newOrder.assignee}, 优先级: ${newOrder.priority}`);
  };

  // Work order status step advance
  const handleUpdateWorkOrderStatus = (id: string, nextStatus: WorkOrderStatus) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: nextStatus,
          finishTime: nextStatus === '已完成' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : w.finishTime
        };
      }
      return w;
    }));

    const order = workOrders.find(w => w.id === id);
    if (order) {
      addAuditLog('工单状态流转', '设备运维 / 故障工单', order.code, `流转至状态: [${nextStatus}]`);
    }
  };

  // Toggle Mode
  const handleToggleMode = (id: string) => {
    setModes(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.isEnabled;
        addAuditLog('运行模式变更', '设备自控 / 模式配置', m.name, `模式已${nextState ? '启用' : '禁用'}`);
        return { ...m, isEnabled: nextState };
      }
      return m;
    }));
  };

  // Toggle Schedule
  const handleToggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.isEnabled;
        addAuditLog('排程策略切换', '设备自控 / 定时排程', s.name, `排程已${nextState ? '启用' : '停用'}`);
        return { ...s, isEnabled: nextState };
      }
      return s;
    }));
  };

  // Toggle Rule
  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.isEnabled;
        addAuditLog('联动规则开关', '设备自控 / 规则引擎', r.name, `联动规则已${nextState ? '启用' : '关闭'}`);
        return { ...r, isEnabled: nextState };
      }
      return r;
    }));
  };

  // Trigger Rule Simulation
  const handleTriggerRuleSimulation = (rule: LinkageRule) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    setRules(prev => prev.map(r => {
      if (r.id === rule.id) {
        return {
          ...r,
          triggerCount: r.triggerCount + 1,
          lastTriggeredTime: timeStr
        };
      }
      return r;
    }));

    addAuditLog('模拟联动触发', '设备自控 / 规则引擎', rule.name, `成功模拟满足条件并执行动作: ${rule.actionCommand}`);
  };

  // Batch confirm all active alarms
  const handleBatchConfirmAlarms = () => {
    setAlarms(prev => prev.map(a => {
      if (a.status === '未确认') {
        return { ...a, status: '处理中', remark: '值班工程师批量一键确认' };
      }
      return a;
    }));
    addAuditLog('批量消警', '告警管理', '全部未确认告警', '值班员批量确认为处理中');
  };

  // Toggle User Status
  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === '正常' ? '禁用' : '正常';
        addAuditLog('用户状态变更', '系统管理 / 用户管理', u.realName, `状态更改为 ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Refresh data action
  const handleRefreshData = () => {
    // Oscillate telemetry
    setDevices(prev => prev.map(d => ({
      ...d,
      telemetry: {
        ...d.telemetry,
        temp: d.telemetry.temp ? parseFloat((d.telemetry.temp + (Math.random() - 0.5) * 0.3).toFixed(1)) : undefined,
        power: d.telemetry.power ? parseFloat((d.telemetry.power + (Math.random() - 0.5) * 4).toFixed(1)) : undefined
      }
    })));
  };

  // Fire alarm popup state
  const [isFireAlarmActive, setIsFireAlarmActive] = useState<boolean>(true);

  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={() => {
          setIsLoggedIn(true);
          setCurrentModule('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global IBMS Top Header */}
      <Header
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        alarms={alarms}
        onRefreshData={handleRefreshData}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        onOpenFireAlarmModal={() => {
          setIsFireAlarmActive(true);
          setCurrentModule('dashboard');
        }}
        isFireAlarmActive={isFireAlarmActive}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Module Content */}
      <main className="flex-1 overflow-auto">
        {currentModule === 'dashboard' && (
          <DashboardView
            alarms={alarms}
            devices={devices}
            workOrders={workOrders}
            showFireAlarmModal={isFireAlarmActive}
            onCloseFireAlarmModal={() => setIsFireAlarmActive(false)}
            onSelectSubsystem={(sub) => {
              setSelectedSubsystemFilter(sub);
              setCurrentModule('graphical-control');
            }}
            onOpenDevice={(dev) => setSelectedDeviceForControl(dev)}
            onOpenAlarm={(alm) => setSelectedAlarmForHandle(alm)}
            onSwitchModule={(mod) => setCurrentModule(mod)}
            initialHudTab="设备数据"
          />
        )}

        {currentModule === 'graphical-control' && (
          <GraphicalControlView
            devices={devices}
            onOpenDevice={(dev) => setSelectedDeviceForControl(dev)}
            selectedSubsystem={selectedSubsystemFilter}
          />
        )}

        {currentModule === 'automation' && (
          <AutomationView
            modes={modes}
            schedules={schedules}
            rules={rules}
            onToggleMode={handleToggleMode}
            onToggleSchedule={handleToggleSchedule}
            onToggleRule={handleToggleRule}
            onTriggerRuleSimulation={handleTriggerRuleSimulation}
          />
        )}

        {currentModule === 'maintenance' && (
          <MaintenanceView
            devices={devices}
            workOrders={workOrders}
            inspections={inspections}
            maintenancePlans={maintenancePlans}
            onOpenDevice={(dev) => setSelectedDeviceForControl(dev)}
            onOpenCreateWorkOrder={() => {
              setWorkOrderInitialData(null);
              setIsCreateWorkOrderOpen(true);
            }}
            onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
          />
        )}

        {currentModule === 'alarms' && (
          <AlarmsView
            alarms={alarms}
            onOpenAlarm={(alm) => setSelectedAlarmForHandle(alm)}
            onConvertToWorkOrder={handleConvertAlarmToWorkOrder}
            onBatchConfirm={handleBatchConfirmAlarms}
          />
        )}

        {currentModule === 'system' && (
          <SystemView
            logs={auditLogs}
            users={users}
            params={systemParams}
            onToggleUserStatus={handleToggleUserStatus}
            onUpdateParam={(id, val) => {
              setSystemParams(prev => prev.map(p => p.id === id ? { ...p, paramValue: val } : p));
              addAuditLog('系统参数修改', '系统管理 / 参数配置', id, `参数值更新为 ${val}`);
            }}
          />
        )}
      </main>

      {/* Device Remote Control Modal */}
      {selectedDeviceForControl && (
        <DeviceControlModal
          device={selectedDeviceForControl}
          onClose={() => setSelectedDeviceForControl(null)}
          onUpdateDevice={handleUpdateDevice}
          onCreateWorkOrderFromDevice={handleCreateWorkOrderFromDevice}
        />
      )}

      {/* Alarm Handling Modal */}
      {selectedAlarmForHandle && (
        <AlarmHandleModal
          alarm={selectedAlarmForHandle}
          onClose={() => setSelectedAlarmForHandle(null)}
          onConfirmStatus={handleConfirmAlarmStatus}
          onConvertToWorkOrder={handleConvertAlarmToWorkOrder}
          onLocateDevice={(deviceId) => {
            const dev = devices.find(d => d.id === deviceId);
            if (dev) {
              setSelectedSubsystemFilter(dev.subsystem);
              setCurrentModule('graphical-control');
            }
          }}
        />
      )}

      {/* Create Work Order Modal */}
      {isCreateWorkOrderOpen && (
        <CreateWorkOrderModal
          initialData={workOrderInitialData}
          onClose={() => setIsCreateWorkOrderOpen(false)}
          onSubmit={handleCreateWorkOrderSubmit}
        />
      )}
    </div>
  );
}
