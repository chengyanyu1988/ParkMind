import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Wind, 
  Droplet, 
  Droplets,
  Zap, 
  Sun, 
  ShieldCheck, 
  ShieldAlert,
  Flame, 
  ArrowUpDown, 
  Sliders, 
  Power, 
  Thermometer, 
  Gauge, 
  RotateCw, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown,
  Maximize2,
  Info,
  Video,
  Lock,
  Car,
  Activity,
  BarChart2,
  Network,
  CheckCircle,
  Wifi,
  Radio,
  Camera,
  Play,
  Pause,
  Maximize,
  AlertCircle,
  DoorOpen,
  Fan,
  Volume2,
  VolumeX,
  Tv
} from 'lucide-react';
import { DeviceItem, SubsystemType } from '../types/ibms';

interface GraphicalControlViewProps {
  devices: DeviceItem[];
  onOpenDevice: (device: DeviceItem) => void;
  selectedSubsystem?: SubsystemType | '全部';
}

export const GraphicalControlView: React.FC<GraphicalControlViewProps> = ({
  devices,
  onOpenDevice,
  selectedSubsystem: initialSubsystem = '暖通空调'
}) => {
  // Navigation & Menu States
  const [activeSubsystem, setActiveSubsystem] = useState<SubsystemType | '全部'>(initialSubsystem);
  const [activeTertiaryMenu, setActiveTertiaryMenu] = useState<string>('新风机');
  const [expandedSubsystems, setExpandedSubsystems] = useState<Record<string, boolean>>({
    '视频监控': false,
    '防盗告警': false,
    '门禁系统': false,
    '停车场系统': false,
    '暖通空调': true,
    '智慧照明': false,
    '环境监测': false,
    '冷热源': false,
    '给排水': false,
    '变配电': false,
    '电梯系统': false,
    '能耗计量': false,
    '信息网络': false
  });

  // Building & Floor Tree States
  const [activeBuilding, setActiveBuilding] = useState<string>('2号楼');
  const [activeFloor, setActiveFloor] = useState<string>('2层');
  const [expandedBuildings, setExpandedBuildings] = useState<Record<string, boolean>>({
    '1号楼': false,
    '2号楼': true,
    '3号楼': false,
    '地下车库': false
  });

  // Perimeter Alarm State & Nodes (Matching screenshot image_94a285ed.png)
  const [selectedPerimeterId, setSelectedPerimeterId] = useState<string>('prm-02');
  const [isArmed, setIsArmed] = useState<boolean>(true);
  const [armToast, setArmToast] = useState<string>('');

  const perimeterNodes = [
    { id: 'prm-01', code: 'B01_F02_003_Canner_0035', name: '周界告警01', typeId: 'DTY_Aprow', x: 54.2, y: 5.2 },
    { id: 'prm-02', code: 'B01_F02_003_Canner_0036', name: '周界告警02', typeId: 'DTY_Aprow', x: 65.1, y: 12.1 },
    { id: 'prm-03', code: 'B01_F02_003_Canner_0037', name: '周界告警03', typeId: 'DTY_Aprow', x: 77.2, y: 20.8 },
    { id: 'prm-04', code: 'B01_F02_003_Canner_0038', name: '周界告警04', typeId: 'DTY_Aprow', x: 95.2, y: 31.2 },
    { id: 'prm-05', code: 'B01_F02_003_Canner_0039', name: '周界告警05', typeId: 'DTY_Aprow', x: 78.4, y: 47.5 },
    { id: 'prm-06', code: 'B01_F02_003_Canner_0040', name: '周界告警06', typeId: 'DTY_Aprow', x: 58.5, y: 68.2 },
    { id: 'prm-07', code: 'B01_F02_003_Canner_0041', name: '周界告警07', typeId: 'DTY_Aprow', x: 34.3, y: 89.5 },
    { id: 'prm-08', code: 'B01_F02_003_Canner_0042', name: '周界告警08', typeId: 'DTY_Aprow', x: 22.8, y: 66.2 },
    { id: 'prm-09', code: 'B01_F02_003_Canner_0043', name: '周界告警09', typeId: 'DTY_Aprow', x: 12.8, y: 44.0 },
    { id: 'prm-10', code: 'B01_F02_003_Canner_0044', name: '周界告警10', typeId: 'DTY_Aprow', x: 5.5, y: 29.1 },
    { id: 'prm-11', code: 'B01_F02_003_Canner_0045', name: '周界告警11', typeId: 'DTY_Aprow', x: 25.1, y: 19.2 },
    { id: 'prm-12', code: 'B01_F02_003_Canner_0046', name: '周界告警12', typeId: 'DTY_Aprow', x: 41.8, y: 12.0 },
  ];

  const activePerimeter = perimeterNodes.find(p => p.id === selectedPerimeterId) || perimeterNodes[1];

  // Intrusion Alarm State & Nodes (Matching screenshot image_a3509e1b.png)
  const [selectedIntrusionId, setSelectedIntrusionId] = useState<string>('int-01');
  const [zoneArmState, setZoneArmState] = useState<Record<string, boolean>>({
    'int-01': true,
    'int-02': true,
    'int-03': true,
    'int-04': true,
    'int-05': true,
    'int-06': true,
    'int-07': true,
  });

  // Intrusion Alarm Nodes dynamically generated per building & floor
  const getIntrusionNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    // Base coordinates for 7 defense zones
    const baseCoords = [
      { id: 'int-01', nameSuffix: '防区告警01', codeSuffix: '0037', basePx: 66.5, basePy: 15.2 },
      { id: 'int-02', nameSuffix: '防区告警02', codeSuffix: '0038', basePx: 60.2, basePy: 26.5 },
      { id: 'int-03', nameSuffix: '防区告警03', codeSuffix: '0039', basePx: 28.5, basePy: 21.3 },
      { id: 'int-04', nameSuffix: '防区告警04', codeSuffix: '0040', basePx: 20.4, basePy: 50.1 },
      { id: 'int-05', nameSuffix: '防区告警05', codeSuffix: '0041', basePx: 33.1, basePy: 30.2 },
      { id: 'int-06', nameSuffix: '防区告警06', codeSuffix: '0042', basePx: 38.2, basePy: 36.5 },
      { id: 'int-07', nameSuffix: '防区告警07', codeSuffix: '0043', basePx: 33.0, basePy: 78.5 },
    ];

    // Completely distinct coordinate layouts per floor (1层 through 9层)
    const floorOffsets = [
      // 1层 - Ground Floor (Lobby & Entrance Defense)
      [ { dx: 0, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 0 } ],
      // 2层 - Office North & East wings
      [ { dx: -14, dy: 7 }, { dx: 8, dy: 6 }, { dx: 14, dy: 10 }, { dx: 12, dy: -12 }, { dx: -6, dy: 12 }, { dx: 10, dy: 8 }, { dx: 26, dy: -34 } ],
      // 3层 - Server & Network Core wings
      [ { dx: -22, dy: 4 }, { dx: -10, dy: 16 }, { dx: 24, dy: 6 }, { dx: 16, dy: -8 }, { dx: 12, dy: -6 }, { dx: -14, dy: 12 }, { dx: 38, dy: -42 } ],
      // 4层 - Open Plan Engineering
      [ { dx: 6, dy: 18 }, { dx: -16, dy: 8 }, { dx: 8, dy: 18 }, { dx: 22, dy: -14 }, { dx: -10, dy: 14 }, { dx: 16, dy: -4 }, { dx: 18, dy: -36 } ],
      // 5层 - Conference & Management
      [ { dx: -14, dy: 6 }, { dx: 12, dy: -6 }, { dx: 18, dy: 14 }, { dx: 8, dy: -10 }, { dx: -12, dy: 8 }, { dx: 6, dy: 14 }, { dx: 30, dy: -40 } ],
      // 6层 - Research & Innovation Lab
      [ { dx: 8, dy: 12 }, { dx: -12, dy: 16 }, { dx: -6, dy: 12 }, { dx: 18, dy: -12 }, { dx: 16, dy: -8 }, { dx: -8, dy: 10 }, { dx: 14, dy: -34 } ],
      // 7层 - Financial & HR Archive
      [ { dx: -10, dy: 16 }, { dx: 14, dy: -4 }, { dx: 12, dy: 16 }, { dx: 6, dy: -14 }, { dx: -8, dy: 14 }, { dx: 12, dy: -6 }, { dx: 26, dy: -38 } ],
      // 8层 - Executive & Boardroom
      [ { dx: 12, dy: 8 }, { dx: -18, dy: 8 }, { dx: 16, dy: 8 }, { dx: 24, dy: -14 }, { dx: -14, dy: 10 }, { dx: 8, dy: 16 }, { dx: 34, dy: -44 } ],
      // 9层 - Penthouse Command Center
      [ { dx: -16, dy: 12 }, { dx: 10, dy: -4 }, { dx: 22, dy: 12 }, { dx: 14, dy: -18 }, { dx: 8, dy: 12 }, { dx: -12, dy: 8 }, { dx: 20, dy: -36 } ],
    ];

    const offsetPattern = floorOffsets[Math.abs(floorNum - 1) % floorOffsets.length];
    const bldgShiftX = (bldgNum - 1) * 3;
    const bldgShiftY = (bldgNum - 1) * 2;

    return baseCoords.map((item, idx) => {
      const codeFloor = String(floorNum).padStart(2, '0');
      const codeBldg = String(bldgNum).padStart(2, '0');
      const { dx, dy } = offsetPattern[idx];

      let posX = item.basePx + dx + bldgShiftX;
      let posY = item.basePy + dy + bldgShiftY;

      // Keep within valid indoor floor bounds; floors > 1 have no parking area below y=60
      posX = Math.max(16, Math.min(84, posX));
      posY = Math.max(14, Math.min(floorNum > 1 ? 56 : 82, posY));

      return {
        id: item.id,
        code: `B${codeBldg}_F${codeFloor}_003_Canner_${item.codeSuffix}`,
        name: `${building}${floor}${item.nameSuffix}`,
        typeId: 'DTY_SPGASY',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
      };
    });
  };

  const intrusionNodes = getIntrusionNodes(activeBuilding, activeFloor);
  const activeIntrusion = intrusionNodes.find(i => i.id === selectedIntrusionId) || intrusionNodes[0];

  // 1. Pedestrian Speed Gate / Turnstile Nodes (人行道闸 matching image_479dc58d.png)
  const getTurnstileNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || 1;
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    // 3 speed gate / turnstile locations matching screenshot image_479dc58d.png
    const baseCoords = [
      { id: 'ts-01', nameSuffix: '人行道闸01', codeSuffix: '0035', basePx: 20.2, basePy: 73.1 },
      { id: 'ts-02', nameSuffix: '人行道闸02', codeSuffix: '0036', basePx: 45.2, basePy: 41.5 },
      { id: 'ts-03', nameSuffix: '人行道闸03', codeSuffix: '0037', basePx: 62.5, basePy: 70.2 },
    ];

    // Coordinate shift per floor & building so every floor layout changes visibly!
    const offsetX = ((floorNum * 5 + bldgNum * 3) % 9) - 4;
    const offsetY = ((floorNum * 3 + bldgNum * 4) % 7) - 3;

    return baseCoords.map((item, idx) => {
      const codeFloor = String(floorNum).padStart(2, '0');
      const codeBldg = String(bldgNum).padStart(2, '0');

      const posX = Math.max(12, Math.min(88, item.basePx + (idx % 2 === 0 ? offsetX : -offsetX)));
      const posY = Math.max(18, Math.min(82, item.basePy + (idx % 3 === 0 ? offsetY : -offsetY)));

      return {
        id: item.id,
        code: `B${codeBldg}_F${codeFloor}_003_Canner_${item.codeSuffix}`,
        name: `${building}${floor}${item.nameSuffix}`,
        typeId: 'DTY_SPACAI',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
        intrusion: 0,
        onlineStatus: '在线',
        scannerStatus: 1
      };
    });
  };

  const currentTurnstileNodes = getTurnstileNodes(activeBuilding, activeFloor);
  const [selectedTurnstileId, setSelectedTurnstileId] = useState<string>('ts-01');
  const [turnstileModes, setTurnstileModes] = useState<Record<string, '关' | '开' | '常开'>>({
    'ts-01': '常开',
    'ts-02': '开',
    'ts-03': '关',
  });
  const activeTurnstile = currentTurnstileNodes.find(t => t.id === selectedTurnstileId) || currentTurnstileNodes[0];

  // 2. Face Door Access Nodes (人脸门禁 matching image_379d9b86.png)
  const getFaceAccessNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || 2;
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    // 6 door pin locations matching screenshot image_379d9b86.png
    const baseCoords = [
      { id: 'door-01', nameSuffix: '门禁01', codeSuffix: '0035', basePx: 25.2, basePy: 60.1 },
      { id: 'door-02', nameSuffix: '门禁02', codeSuffix: '0036', basePx: 50.5, basePy: 53.2 },
      { id: 'door-03', nameSuffix: '门禁03', codeSuffix: '0037', basePx: 53.1, basePy: 41.0 },
      { id: 'door-04', nameSuffix: '门禁04', codeSuffix: '0038', basePx: 34.2, basePy: 42.5 },
      { id: 'door-05', nameSuffix: '门禁05', codeSuffix: '0039', basePx: 29.5, basePy: 41.8 },
      { id: 'door-06', nameSuffix: '门禁06', codeSuffix: '0040', basePx: 52.8, basePy: 28.2 },
    ];

    const offsetX = ((floorNum * 4 + bldgNum * 7) % 11) - 5;
    const offsetY = ((floorNum * 5 + bldgNum * 3) % 9) - 4;

    return baseCoords.map((item, idx) => {
      const codeFloor = String(floorNum).padStart(2, '0');
      const codeBldg = String(bldgNum).padStart(2, '0');

      const posX = Math.max(15, Math.min(85, item.basePx + (idx % 2 === 0 ? offsetX : -offsetX)));
      const posY = Math.max(18, Math.min(82, item.basePy + (idx % 3 === 0 ? offsetY : -offsetY)));

      return {
        id: item.id,
        code: `B${codeBldg}_F${codeFloor}_003_Canner_${item.codeSuffix}`,
        name: `${building}${floor}${item.nameSuffix}`,
        typeId: 'DTY_SPACAI',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
        intrusion: item.id === 'door-02' ? 1 : 0,
        onlineStatus: '在线',
        scannerStatus: 1
      };
    });
  };

  const currentFaceAccessNodes = getFaceAccessNodes(activeBuilding, activeFloor);
  const [selectedFaceDoorId, setSelectedFaceDoorId] = useState<string>('door-02');
  const [doorSwitchStates, setDoorSwitchStates] = useState<Record<string, boolean>>({
    'door-01': false,
    'door-02': true,
    'door-03': false,
    'door-04': false,
    'door-05': false,
    'door-06': false,
  });
  const activeFaceDoor = currentFaceAccessNodes.find(d => d.id === selectedFaceDoorId) || currentFaceAccessNodes[1];

  // 3. Parking Lot Space State & Gate Nodes (停车场系统 / 车位 matching image_8fa8ed3e.png)
  const getParkingSpaceData = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    // Vary parking stats per floor so clicking B1, B2, B3 or 1号楼/2号楼 produces dynamic numbers!
    const baseA = { total: 12, free: Math.max(2, 5 + (floorNum % 3)), occupied: Math.max(3, 5 - (floorNum % 2)), locked: 2 };
    const baseB = { total: 8 + (floorNum % 2) * 2, free: 3 + (bldgNum % 2), occupied: 3, locked: 2 };
    const baseC = { total: 12, free: Math.max(3, 6 - (floorNum % 3)), occupied: 6 + (floorNum % 3), locked: 0 };

    const totalSpaces = baseA.total + baseB.total + baseC.total;
    const freeSpaces = baseA.free + baseB.free + baseC.free;
    const occupiedSpaces = baseA.occupied + baseB.occupied + baseC.occupied;
    const lockedSpaces = baseA.locked + baseB.locked + baseC.locked;

    // Shift gate barrier positions slightly per floor
    const shiftX = ((floorNum * 4 + bldgNum * 6) % 7) - 3;

    const gateNodes = [
      {
        id: 'pk-gate-01',
        name: `${building}${floor}闸机01`,
        code: `B${String(bldgNum).padStart(2,'0')}_${floor}_003_Canner_0038`,
        typeId: 'DTY_SPGASU',
        x: Number((23.5 + shiftX).toFixed(1)),
        y: 42.5,
        alarmState: 0,
        faultAlarm: 0,
      },
      {
        id: 'pk-gate-02',
        name: `${building}${floor}闸机02`,
        code: `B${String(bldgNum).padStart(2,'0')}_${floor}_003_Canner_0039`,
        typeId: 'DTY_SPGASU',
        x: Number((64.5 - shiftX).toFixed(1)),
        y: 53.5,
        alarmState: 0,
        faultAlarm: 0,
      }
    ];

    return {
      totalSpaces,
      freeSpaces,
      occupiedSpaces,
      lockedSpaces,
      zones: {
        A: baseA,
        B: baseB,
        C: baseC
      },
      gateNodes
    };
  };

  const parkingData = getParkingSpaceData(activeBuilding, activeFloor);
  const [selectedParkingGateId, setSelectedParkingGateId] = useState<string>('pk-gate-01');
  const [parkingGateArmStates, setParkingGateArmStates] = useState<Record<string, '抬杆' | '落杆'>>({
    'pk-gate-01': '抬杆',
    'pk-gate-02': '落杆',
  });
  const activeParkingGate = parkingData.gateNodes.find(g => g.id === selectedParkingGateId) || parkingData.gateNodes[0];

  // 4. Combined Air Conditioner / AHU State & Nodes (暖通空调 / 组合式空调 matching image_d8d5d2a5.png & image_62633fed.png)
  const [acTabMode, setAcTabMode] = useState<'map' | 'group'>('map');

  const getAcNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || 1;
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    const baseCoords = [
      { id: 'ac-01', nameSuffix: '空调01', codeSuffix: '00001', basePx: 29.5, basePy: 37.8 },
      { id: 'ac-02', nameSuffix: '空调02', codeSuffix: '00002', basePx: 51.2, basePy: 46.5 },
    ];

    const offsetX = ((floorNum * 4 + bldgNum * 3) % 9) - 4;
    const offsetY = ((floorNum * 3 + bldgNum * 5) % 7) - 3;

    return baseCoords.map((item, idx) => {
      const codeFloor = String(floorNum).padStart(2, '0');
      const codeBldg = String(bldgNum).padStart(2, '0');
      const posX = Math.max(15, Math.min(85, item.basePx + (idx % 2 === 0 ? offsetX : -offsetX)));
      const posY = Math.max(18, Math.min(82, item.basePy + (idx % 3 === 0 ? offsetY : -offsetY)));

      const co2 = (880 + ((floorNum * 12 + idx * 25) % 80)).toFixed(1);
      const coldWater = (60 + ((floorNum * 3 + idx * 7) % 15)).toFixed(1);
      const freshTemp = (31 + ((floorNum * 0.4) % 3)).toFixed(1);
      const hotWater = (75 + ((floorNum * 2 + idx * 5) % 15)).toFixed(1);
      const returnTemp = (70 + ((floorNum * 0.8) % 4)).toFixed(1);
      const returnHumidity = (78 + ((floorNum * 1.5) % 10)).toFixed(1);
      const supplyTemp = (69 + ((floorNum * 0.5) % 4)).toFixed(1);
      const supplyHumidity = (24 + ((floorNum * 0.3) % 5)).toFixed(1);

      return {
        id: item.id,
        code: `B${codeBldg}_F${codeFloor}_003_Canner_${item.codeSuffix}`,
        name: `${building}${floor}${item.nameSuffix}`,
        typeId: 'DTY_ACATHU',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
        co2,
        coldWater,
        freshTemp,
        freshValveFeedback: idx === 0 ? '关闭' : '开启',
        hotWater,
        hotWaterMinOpen: 10,
        returnTemp,
        returnHumidity,
        returnValveFeedback: '开启',
        supplyTemp,
        supplyHumidity,
        supplyFanAuto: '自动',
        supplyFanStatus: '停止',
        antiFreeze: '正常',
        primaryFilter: '正常',
        mediumFilter: '正常',
        fanFaultAlarm: '正常',
      };
    });
  };

  const currentAcNodes = getAcNodes(activeBuilding, activeFloor);
  const [selectedAcId, setSelectedAcId] = useState<string>('ac-01');
  const [freshAirValves, setFreshAirValves] = useState<Record<string, boolean>>({
    'ac-01': false,
    'ac-02': true,
  });
  const [returnAirValves, setReturnAirValves] = useState<Record<string, boolean>>({
    'ac-01': false,
    'ac-02': true,
  });

  const activeAcNode = currentAcNodes.find(a => a.id === selectedAcId) || currentAcNodes[0];

  // 5. Fresh Air Unit State & Generator (新风机 matching user uploaded screenshot image.png)
  const getFreshAirNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    // 7 candidate base positions matching screenshot image.png for 1号楼1层 / 2号楼2层
    const baseCandidates = [
      { idSuffix: '01', defaultCode: '00002', nameSuffix: '新风机组01', basePx: 28.4, basePy: 53.2 },
      { idSuffix: '02', defaultCode: '00001', nameSuffix: '新风机组02', basePx: 38.1, basePy: 42.6 },
      { idSuffix: '03', defaultCode: '00003', nameSuffix: '新风机组03', basePx: 44.5, basePy: 28.5 },
      { idSuffix: '04', defaultCode: '00004', nameSuffix: '新风机组04', basePx: 54.2, basePy: 30.8 },
      { idSuffix: '05', defaultCode: '00005', nameSuffix: '新风机组05', basePx: 50.5, basePy: 47.2 },
      { idSuffix: '06', defaultCode: '00006', nameSuffix: '新风机组06', basePx: 60.8, basePy: 54.5 },
      { idSuffix: '07', defaultCode: '00007', nameSuffix: '新风机组07', basePx: 78.5, basePy: 54.0 },
      { idSuffix: '08', defaultCode: '00008', nameSuffix: '新风机组08', basePx: 68.2, basePy: 32.5 },
    ];

    // Determine count per floor: floor 1 -> 6, floor 2 -> 7 (matches screenshot), floor 3 -> 5, floor 4 -> 8, etc.
    const count = (bldgNum === 2 && floor === '2层') ? 7 : (5 + ((floorNum * 3 + bldgNum * 2) % 4));

    // Shift coordinates visibly per floor & building so clicking any floor alters icon arrangement!
    const isExactScreenshot = (bldgNum === 1 || bldgNum === 2) && (floor === '1层' || floor === '2层');
    const shiftX = isExactScreenshot ? 0 : (((floorNum * 6 + bldgNum * 4) % 11) - 5);
    const shiftY = isExactScreenshot ? 0 : (((floorNum * 5 + bldgNum * 3) % 9) - 4);

    const bldgCodeStr = String(bldgNum).padStart(2, '0');
    const floorCodeStr = String(floorNum).padStart(2, '0');

    return baseCandidates.slice(0, count).map((item, idx) => {
      const posX = Math.max(14, Math.min(86, item.basePx + (idx % 2 === 0 ? shiftX : -shiftX)));
      const posY = Math.max(18, Math.min(82, item.basePy + (idx % 3 === 0 ? shiftY : -shiftY)));

      const code = `B${bldgCodeStr}_F${floorCodeStr}_003_Canner_${item.defaultCode}`;
      const name = `${building}${floor}${item.nameSuffix}`;

      // Dynamic telemetry values matching screenshot image.png exact readouts
      const co2 = String(568 + ((floorNum * 23 + idx * 37) % 90));
      const hotWaterFeedback1 = String((18.8 + ((floorNum * 1.2 + idx * 2.3) % 8)).toFixed(1));
      const freshHumidity = String((77.8 - ((floorNum * 1.5 + idx * 2.1) % 12)).toFixed(1));
      const freshTemp = String((32.7 - ((floorNum * 0.8 + idx * 1.4) % 6)).toFixed(1));
      const freqFeedback = String((5.8 + ((floorNum * 4.2 + idx * 7.5) % 35)).toFixed(1));
      const freshValveFeedback = String((71.2 + ((floorNum * 2.4 + idx * 3.8) % 20)).toFixed(1));
      const hotWaterFeedback2 = String((24.7 - ((floorNum * 1.1 + idx * 2.2) % 9)).toFixed(1));

      return {
        id: `fau-${bldgCodeStr}-${floorCodeStr}-${item.idSuffix}`,
        code,
        name,
        typeId: 'DTY_ACATHU',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
        faultAlarm: '正常',
        manualAuto: '自动',
        antiFreeze: '正常',
        co2,
        hotWaterFeedback1,
        freshHumidity,
        freshTemp,
        freqFeedback,
        filterStatus: '正常',
        freshValveFeedback,
        hotWaterFeedback2,
        coilLowTempAlarm: '自动',
        returnWaterTemp: idx === 0 ? '停止' : `${(22.0 + idx * 0.4).toFixed(1)} ℃`,
        returnWaterHumidity: '正常',
        supplyAirTemp: '正常',
        runStatus: '正常',
        supplyWaterTemp: '正常',
        waterValveSwitchFeedback: idx === 0 ? '-' : '70.0%',
      };
    });
  };

  const currentFreshAirNodes = getFreshAirNodes(activeBuilding, activeFloor);
  const [selectedFauId, setSelectedFauId] = useState<string>('fau-02-02-01');

  // Control states for Fresh Air Units (设备控制)
  const [fauPowerStates, setFauPowerStates] = useState<Record<string, boolean>>({});
  const [fauChilledWaterVal, setFauChilledWaterVal] = useState<Record<string, number>>({});
  const [fauFreqVal, setFauFreqVal] = useState<Record<string, number>>({});
  const [fauHotWaterVal, setFauHotWaterVal] = useState<Record<string, number>>({});
  const [fauSupplyTempSetVal, setFauSupplyTempSetVal] = useState<Record<string, number>>({});

  const activeFauNode = currentFreshAirNodes.find(f => f.id === selectedFauId) || currentFreshAirNodes[0];

  // 6. Supply Air Fan State & Generator (送风机 matching screenshot image_ef204713.png)
  const getSupplyFanNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    const baseCandidates = [
      { idSuffix: '01', defaultCode: '00002', nameSuffix: '送风机01', basePx: 28.4, basePy: 53.2 },
      { idSuffix: '02', defaultCode: '00001', nameSuffix: '送风机02', basePx: 38.1, basePy: 42.6 },
      { idSuffix: '03', defaultCode: '00003', nameSuffix: '送风机03', basePx: 44.5, basePy: 28.5 },
      { idSuffix: '04', defaultCode: '00004', nameSuffix: '送风机04', basePx: 54.2, basePy: 30.8 },
      { idSuffix: '05', defaultCode: '00005', nameSuffix: '送风机05', basePx: 50.5, basePy: 47.2 },
      { idSuffix: '06', defaultCode: '00006', nameSuffix: '送风机06', basePx: 60.8, basePy: 54.5 },
      { idSuffix: '07', defaultCode: '00007', nameSuffix: '送风机07', basePx: 78.5, basePy: 54.0 },
    ];

    const count = (bldgNum === 2 && floor === '2层') ? 7 : (5 + ((floorNum * 3 + bldgNum * 2) % 3));

    const isExactScreenshot = (bldgNum === 1 || bldgNum === 2) && (floor === '1层' || floor === '2层');
    const shiftX = isExactScreenshot ? 0 : (((floorNum * 6 + bldgNum * 4) % 11) - 5);
    const shiftY = isExactScreenshot ? 0 : (((floorNum * 5 + bldgNum * 3) % 9) - 4);

    const bldgCodeStr = String(bldgNum).padStart(2, '0');
    const floorCodeStr = String(floorNum).padStart(2, '0');

    return baseCandidates.slice(0, count).map((item, idx) => {
      const posX = Math.max(14, Math.min(86, item.basePx + (idx % 2 === 0 ? shiftX : -shiftX)));
      const posY = Math.max(18, Math.min(82, item.basePy + (idx % 3 === 0 ? shiftY : -shiftY)));

      const code = `B${bldgCodeStr}_F${floorCodeStr}_003_Canner_${item.defaultCode}`;
      const name = `${building}${floor}${item.nameSuffix}`;

      const co2 = (470.1 + ((floorNum * 12 + idx * 18) % 50)).toFixed(1);

      return {
        id: `saf-${bldgCodeStr}-${floorCodeStr}-${item.idSuffix}`,
        code,
        name,
        typeId: 'DTY_ACATHU',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
        faultAlarm: '正常',
        manualAuto: '自动',
        co2,
        runStatus: '运行',
        onlineStatus: '在线',
      };
    });
  };

  const currentSupplyFanNodes = getSupplyFanNodes(activeBuilding, activeFloor);
  const [selectedSafId, setSelectedSafId] = useState<string>('saf-02-02-01');
  const [safPowerStates, setSafPowerStates] = useState<Record<string, boolean>>({});
  const [safCo2SetVal, setSafCo2SetVal] = useState<Record<string, number>>({});

  const activeSafNode = currentSupplyFanNodes.find(s => s.id === selectedSafId) || currentSupplyFanNodes[0];

  // 7. Exhaust Fan State & Generator (排风机 matching screenshot image_ccf4b208.png)
  const getExhaustFanNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    const baseCandidates = [
      { idSuffix: '01', defaultCode: '00002', nameSuffix: '排风机01', basePx: 28.4, basePy: 53.2 },
      { idSuffix: '02', defaultCode: '00001', nameSuffix: '排风机02', basePx: 38.1, basePy: 42.6 },
      { idSuffix: '03', defaultCode: '00003', nameSuffix: '排风机03', basePx: 44.5, basePy: 28.5 },
      { idSuffix: '04', defaultCode: '00004', nameSuffix: '排风机04', basePx: 54.2, basePy: 30.8 },
      { idSuffix: '05', defaultCode: '00005', nameSuffix: '排风机05', basePx: 50.5, basePy: 47.2 },
      { idSuffix: '06', defaultCode: '00006', nameSuffix: '排风机06', basePx: 60.8, basePy: 54.5 },
      { idSuffix: '07', defaultCode: '00007', nameSuffix: '排风机07', basePx: 78.5, basePy: 54.0 },
    ];

    const count = (bldgNum === 2 && floor === '2层') ? 7 : (5 + ((floorNum * 3 + bldgNum * 2) % 3));

    const isExactScreenshot = (bldgNum === 1 || bldgNum === 2) && (floor === '1层' || floor === '2层');
    const shiftX = isExactScreenshot ? 0 : (((floorNum * 6 + bldgNum * 4) % 11) - 5);
    const shiftY = isExactScreenshot ? 0 : (((floorNum * 5 + bldgNum * 3) % 9) - 4);

    const bldgCodeStr = String(bldgNum).padStart(2, '0');
    const floorCodeStr = String(floorNum).padStart(2, '0');

    return baseCandidates.slice(0, count).map((item, idx) => {
      const posX = Math.max(14, Math.min(86, item.basePx + (idx % 2 === 0 ? shiftX : -shiftX)));
      const posY = Math.max(18, Math.min(82, item.basePy + (idx % 3 === 0 ? shiftY : -shiftY)));

      const code = `B${bldgCodeStr}_F${floorCodeStr}_003_Canner_${item.defaultCode}`;
      const name = `${building}${floor}${item.nameSuffix}`;

      return {
        id: `ean-${bldgCodeStr}-${floorCodeStr}-${item.idSuffix}`,
        code,
        name,
        typeId: 'DTY_ACATHU',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
        faultAlarm: '正常',
        manualAuto: '自动',
        runStatus: '运行',
        onlineStatus: '在线',
      };
    });
  };

  const currentExhaustFanNodes = getExhaustFanNodes(activeBuilding, activeFloor);
  const [selectedEanId, setSelectedEanId] = useState<string>('ean-02-02-01');
  const [eanPowerStates, setEanPowerStates] = useState<Record<string, boolean>>({});

  const activeEanNode = currentExhaustFanNodes.find(e => e.id === selectedEanId) || currentExhaustFanNodes[0];

  // 8. Smart Lighting State & Generator (智慧照明 matching screenshot image_afcdb9b0.png)
  const getLightingNodes = (building: string, floor: string, tertiaryMenu: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    const baseCandidates = [
      { idSuffix: '01', defaultCode: '00003', nameSuffix: '智能照明01', basePx: 29.5, basePy: 41.2 },
      { idSuffix: '02', defaultCode: '00001', nameSuffix: '智能照明02', basePx: 39.5, basePy: 36.8 },
      { idSuffix: '03', defaultCode: '00002', nameSuffix: '智能照明03', basePx: 38.5, basePy: 54.2 },
      { idSuffix: '04', defaultCode: '00004', nameSuffix: '智能照明04', basePx: 54.8, basePy: 44.5 },
    ];

    const shiftX = (((floorNum * 5 + bldgNum * 3) % 9) - 4);
    const shiftY = (((floorNum * 4 + bldgNum * 5) % 7) - 3);

    const bldgCodeStr = String(bldgNum).padStart(2, '0');
    const floorCodeStr = String(floorNum).padStart(2, '0');

    const menuPrefix = tertiaryMenu === '景观照明' ? '景观照明' : tertiaryMenu === '泛光照明' ? '泛光照明' : '智能照明';
    const typeId = tertiaryMenu === '景观照明' ? 'DTY_LANDSCP' : tertiaryMenu === '泛光照明' ? 'DTY_FLOODLT' : 'DTY_ACALDL';

    return baseCandidates.map((item, idx) => {
      const posX = Math.max(16, Math.min(84, item.basePx + (idx % 2 === 0 ? shiftX : -shiftX)));
      const posY = Math.max(20, Math.min(80, item.basePy + (idx % 3 === 0 ? shiftY : -shiftY)));

      const code = `B${bldgCodeStr}_F${floorCodeStr}_003_Canner_${item.defaultCode}`;
      const name = `${building}${floor}${menuPrefix}0${idx + 1}`;

      return {
        id: `lt-${bldgCodeStr}-${floorCodeStr}-${item.idSuffix}`,
        code,
        name,
        typeId,
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
        faultAlarm: '正常',
        manualAuto: idx % 2 === 0 ? '手动' : '自动',
        switchStatus: idx % 2 === 0 ? '开' : '关',
        onlineStatus: '在线',
      };
    });
  };

  const currentLightingNodes = getLightingNodes(activeBuilding, activeFloor, activeTertiaryMenu);
  const [selectedLightingId, setSelectedLightingId] = useState<string>('lt-02-02-01');
  const [lightingPowerStates, setLightingPowerStates] = useState<Record<string, boolean>>({});

  const activeLightingNode = currentLightingNodes.find(l => l.id === selectedLightingId) || currentLightingNodes[0];

  // 9. Outdoor Landscape Lighting State & Nodes (景观照明 matching screenshot image_aa730709.png)
  const landscapeLightingNodes = [
    { id: 'll-01', name: '室外景观照明01', code: 'B01_F02_003_Canner_00036', typeId: 'DTY_Aprow', x: 56.8, y: 19.4, faultAlarm: 0, manualAuto: 0, defaultState: '开' as const },
    { id: 'll-02', name: '室外景观照明02', code: 'B01_F02_003_Canner_00037', typeId: 'DTY_Aprow', x: 46.8, y: 23.4, faultAlarm: 0, manualAuto: 0, defaultState: '开' as const },
    { id: 'll-03', name: '室外景观照明03', code: 'B01_F02_003_Canner_00038', typeId: 'DTY_Aprow', x: 31.8, y: 29.5, faultAlarm: 0, manualAuto: 0, defaultState: '开' as const },
    { id: 'll-04', name: '室外景观照明04', code: 'B01_F02_003_Canner_00039', typeId: 'DTY_Aprow', x: 20.3, y: 34.3, faultAlarm: 0, manualAuto: 0, defaultState: '开' as const },
    { id: 'll-05', name: '室外景观照明05', code: 'B01_F02_003_Canner_00040', typeId: 'DTY_Aprow', x: 26.0, y: 44.5, faultAlarm: 0, manualAuto: 0, defaultState: '开' as const },
    { id: 'll-06', name: '室外景观照明06', code: 'B01_F02_003_Canner_00041', typeId: 'DTY_Aprow', x: 31.8, y: 54.2, faultAlarm: 0, manualAuto: 0, defaultState: '开' as const },
    { id: 'll-07', name: '室外景观照明07', code: 'B01_F02_003_Canner_00042', typeId: 'DTY_Aprow', x: 36.8, y: 63.8, faultAlarm: 0, manualAuto: 0, defaultState: '开' as const },
    { id: 'll-08', name: '室外景观照明08', code: 'B01_F02_003_Canner_00043', typeId: 'DTY_Aprow', x: 42.8, y: 73.0, faultAlarm: 0, manualAuto: 0, defaultState: '开' as const },
    { id: 'll-09', name: '室外景观照明09', code: 'B01_F02_003_Canner_00044', typeId: 'DTY_Aprow', x: 56.4, y: 61.8, faultAlarm: 0, manualAuto: 0, defaultState: '关' as const },
    { id: 'll-10', name: '室外景观照明10', code: 'B01_F02_003_Canner_00045', typeId: 'DTY_Aprow', x: 76.5, y: 45.8, faultAlarm: 0, manualAuto: 0, defaultState: '关' as const },
    { id: 'll-11', name: '室外景观照明11', code: 'B01_F02_003_Canner_00046', typeId: 'DTY_Aprow', x: 87.8, y: 36.5, faultAlarm: 0, manualAuto: 0, defaultState: '关' as const },
    { id: 'll-12', name: '室外景观照明12', code: 'B01_F02_003_Canner_00047', typeId: 'DTY_Aprow', x: 76.8, y: 30.2, faultAlarm: 0, manualAuto: 0, defaultState: '关' as const },
    { id: 'll-13', name: '室外景观照明13', code: 'B01_F02_003_Canner_00048', typeId: 'DTY_Aprow', x: 69.2, y: 25.8, faultAlarm: 0, manualAuto: 0, defaultState: '关' as const },
    { id: 'll-14', name: '室外景观照明14', code: 'B01_F02_003_Canner_00049', typeId: 'DTY_Aprow', x: 63.5, y: 22.8, faultAlarm: 0, manualAuto: 0, defaultState: '关' as const },
  ];

  const [selectedLandscapeId, setSelectedLandscapeId] = useState<string>('ll-01');
  const [landscapeSwitchStates, setLandscapeSwitchStates] = useState<Record<string, '开' | '关'>>({
    'll-01': '开',
    'll-02': '开',
    'll-03': '开',
    'll-04': '开',
    'll-05': '开',
    'll-06': '开',
    'll-07': '开',
    'll-08': '开',
    'll-09': '关',
    'll-10': '关',
    'll-11': '关',
    'll-12': '关',
    'll-13': '关',
    'll-14': '关',
  });

  const activeLandscapeNode = landscapeLightingNodes.find(l => l.id === selectedLandscapeId) || landscapeLightingNodes[0];
  const activeLandscapeSwitch = landscapeSwitchStates[activeLandscapeNode.id] || activeLandscapeNode.defaultState;

  // 10. Outdoor Flood Lighting State & Nodes (泛光照明 matching screenshot image_86cadfa9.png)
  const floodLightingNodes = [
    { id: 'fl-01', name: '室外泛光照明01', code: 'B01_F02_003_Canner_00036', typeId: 'DTY_Aprow', x: 47.5, y: 61.2, defaultBmsMode: 0, defaultNightStatus: 0, desc: '南区1号主厂房立面泛光' },
    { id: 'fl-02', name: '室外泛光照明02', code: 'B01_F02_003_Canner_00037', typeId: 'DTY_Aprow', x: 53.6, y: 27.2, defaultBmsMode: 0, defaultNightStatus: 0, desc: '北区综合车间泛光' },
    { id: 'fl-03', name: '室外泛光照明03', code: 'B01_F02_003_Canner_00038', typeId: 'DTY_Aprow', x: 59.4, y: 31.8, defaultBmsMode: 0, defaultNightStatus: 0, desc: '东北仓储厂房泛光' },
    { id: 'fl-04', name: '室外泛光照明04', code: 'B01_F02_003_Canner_00039', typeId: 'DTY_Aprow', x: 70.8, y: 38.6, defaultBmsMode: 0, defaultNightStatus: 0, desc: '智能物流中心立面泛光' },
    { id: 'fl-05', name: '室外泛光照明05', code: 'B01_F02_003_Canner_00040', typeId: 'DTY_Aprow', x: 58.8, y: 47.8, defaultBmsMode: 0, defaultNightStatus: 0, desc: '中心环岛景观泛光' },
    { id: 'fl-06', name: '室外泛光照明06', code: 'B01_F02_003_Canner_00041', typeId: 'DTY_Aprow', x: 38.0, y: 53.0, defaultBmsMode: 0, defaultNightStatus: 0, desc: '西侧测试车间泛光' },
    { id: 'fl-07', name: '室外泛光照明07', code: 'B01_F02_003_Canner_00042', typeId: 'DTY_Aprow', x: 31.5, y: 44.0, defaultBmsMode: 0, defaultNightStatus: 0, desc: '西北装配中心泛光' },
  ];

  const [selectedFloodId, setSelectedFloodId] = useState<string>('fl-01');
  const [floodBmsModes, setFloodBmsModes] = useState<Record<string, number>>({});
  const [floodNightStates, setFloodNightStates] = useState<Record<string, number>>({});

  const activeFloodNode = floodLightingNodes.find(f => f.id === selectedFloodId) || floodLightingNodes[0];
  const activeFloodBmsMode = floodBmsModes[activeFloodNode.id] !== undefined ? floodBmsModes[activeFloodNode.id] : activeFloodNode.defaultBmsMode;
  const activeFloodNightStatus = floodNightStates[activeFloodNode.id] !== undefined ? floodNightStates[activeFloodNode.id] : activeFloodNode.defaultNightStatus;

  // 11. Environmental Sensor State & Generator (环境监测 / 环境传感器 matching screenshot image_9673d34c.png)
  const getEnvSensorNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    // 7 positions matching screenshot image_9673d34c.png
    const baseCandidates = [
      { idSuffix: '01', defaultCode: '00002', nameSuffix: '环境传感器', basePx: 28.4, basePy: 53.2 },
      { idSuffix: '02', defaultCode: '00001', nameSuffix: '环境传感器02', basePx: 38.1, basePy: 42.6 },
      { idSuffix: '03', defaultCode: '00003', nameSuffix: '环境传感器03', basePx: 44.5, basePy: 28.5 },
      { idSuffix: '04', defaultCode: '00004', nameSuffix: '环境传感器04', basePx: 54.2, basePy: 30.8 },
      { idSuffix: '05', defaultCode: '00005', nameSuffix: '环境传感器05', basePx: 50.5, basePy: 47.2 },
      { idSuffix: '06', defaultCode: '00006', nameSuffix: '环境传感器06', basePx: 60.8, basePy: 54.5 },
      { idSuffix: '07', defaultCode: '00007', nameSuffix: '环境传感器07', basePx: 78.5, basePy: 54.0 },
    ];

    const isExactScreenshot = (bldgNum === 1 || bldgNum === 2) && (floor === '1层' || floor === '2层');
    const shiftX = isExactScreenshot ? 0 : (((floorNum * 6 + bldgNum * 4) % 11) - 5);
    const shiftY = isExactScreenshot ? 0 : (((floorNum * 5 + bldgNum * 3) % 9) - 4);

    const bldgCodeStr = String(bldgNum).padStart(2, '0');
    const floorCodeStr = String(floorNum).padStart(2, '0');

    return baseCandidates.map((item, idx) => {
      const posX = Math.max(14, Math.min(86, item.basePx + (idx % 2 === 0 ? shiftX : -shiftX)));
      const posY = Math.max(18, Math.min(82, item.basePy + (idx % 3 === 0 ? shiftY : -shiftY)));

      const code = `B${bldgCodeStr}_F${floorCodeStr}_003_Canner_${item.defaultCode}`;
      const name = idx === 0 ? `${building}${floor}${item.nameSuffix}` : `${building}${floor}${item.nameSuffix}`;

      // Readouts matching image_9673d34c.png
      // 二氧化碳浓度: 914.7, 甲醛: 931.7, PM2.5: 753, 相对湿度测量值: 65.4%, VOC: 686.4, 温度测量值: 546.5, 在线状态: 0
      const co2 = (914.7 + ((floorNum * 8 + idx * 15) % 30) - 15).toFixed(1);
      const formaldehyde = (931.7 + ((floorNum * 6 + idx * 12) % 25) - 12).toFixed(1);
      const pm25 = String(753 + ((floorNum * 9 + idx * 16) % 30) - 14);
      const humidity = `${(65.4 + ((floorNum * 1.2 + idx * 1.8) % 5) - 2.5).toFixed(1)}%`;
      const voc = (686.4 + ((floorNum * 5 + idx * 11) % 20) - 10).toFixed(1);
      const temp = (546.5 + ((floorNum * 4 + idx * 9) % 18) - 9).toFixed(1);

      return {
        id: `env-${bldgCodeStr}-${floorCodeStr}-${item.idSuffix}`,
        code,
        name,
        typeId: 'DTY_ACATHU',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
        co2,
        formaldehyde,
        pm25,
        humidity,
        voc,
        temp,
        onlineStatus: 0,
      };
    });
  };

  const currentEnvSensorNodes = getEnvSensorNodes(activeBuilding, activeFloor);
  const [selectedEnvSensorId, setSelectedEnvSensorId] = useState<string>('env-02-02-01');
  const [envPowerStates, setEnvPowerStates] = useState<Record<string, boolean>>({});

  const activeEnvNode = currentEnvSensorNodes.find(e => e.id === selectedEnvSensorId) || currentEnvSensorNodes[0];

  // Central Cooling & Heating Source Nodes (冷热源: 冷源 / 热源 matching screenshot image_4f38e8f3.png)
  const coolingHeatingNodes = [
    {
      id: 'cs-chiller-01',
      category: '冷源',
      code: 'B01_F02_003_Canner_00002',
      name: '1号楼1层新风机组01',
      label: '1#冷机',
      typeId: 'DTY_ACATHU',
      x: 34.5,
      y: 47.5,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '568',
      hotWaterFeedback: '18.8',
      freshHumidity: '77.8',
      freshTemp: '32.7',
      freqFeedback: '5.8',
      filterStatus: '正常',
      freshValveOpenFeedback: '71.2',
      hotWaterValveRegFeedback: '24.7',
      coilLowTempAlarm: '自动',
      returnWaterTemp: '停止',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '正常',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
    {
      id: 'cs-tower-01',
      category: '冷源',
      code: 'B01_F02_003_Canner_00010',
      name: '1#冷却塔机组',
      label: '1#冷却塔',
      typeId: 'DTY_COOLING_TOWER',
      x: 15.5,
      y: 39.5,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '512',
      hotWaterFeedback: '0.0',
      freshHumidity: '81.2',
      freshTemp: '29.4',
      freqFeedback: '45.0',
      filterStatus: '正常',
      freshValveOpenFeedback: '100.0',
      hotWaterValveRegFeedback: '0.0',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '32.5℃',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '27.8℃',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
    {
      id: 'cs-pump-01',
      category: '冷源',
      code: 'B01_F02_003_Canner_00011',
      name: '1#冷却水循环泵',
      label: '1#冷却泵',
      typeId: 'DTY_COOL_PUMP',
      x: 21.0,
      y: 50.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '495',
      hotWaterFeedback: '0.0',
      freshHumidity: '75.0',
      freshTemp: '28.1',
      freqFeedback: '50.0',
      filterStatus: '正常',
      freshValveOpenFeedback: '100.0',
      hotWaterValveRegFeedback: '0.0',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '正常',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '正常',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
    {
      id: 'cs-pump-02',
      category: '冷源',
      code: 'B01_F02_003_Canner_00012',
      name: '2#冷却水循环泵',
      label: '2#冷却泵',
      typeId: 'DTY_COOL_PUMP',
      x: 52.0,
      y: 54.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '502',
      hotWaterFeedback: '0.0',
      freshHumidity: '76.2',
      freshTemp: '28.3',
      freqFeedback: '50.0',
      filterStatus: '正常',
      freshValveOpenFeedback: '100.0',
      hotWaterValveRegFeedback: '0.0',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '正常',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '正常',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
    {
      id: 'cs-pump-03',
      category: '冷源',
      code: 'B01_F02_003_Canner_00013',
      name: '3#冷却水循环泵',
      label: '3#冷却泵',
      typeId: 'DTY_COOL_PUMP',
      x: 46.5,
      y: 30.5,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '490',
      hotWaterFeedback: '0.0',
      freshHumidity: '74.5',
      freshTemp: '27.9',
      freqFeedback: '48.5',
      filterStatus: '正常',
      freshValveOpenFeedback: '100.0',
      hotWaterValveRegFeedback: '0.0',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '正常',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '正常',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
    {
      id: 'cs-tank-01',
      category: '冷源',
      code: 'B01_F02_003_Canner_00014',
      name: '冷源生活水箱01',
      label: '生活水箱',
      typeId: 'DTY_WATER_TANK',
      x: 36.5,
      y: 22.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '480',
      hotWaterFeedback: '15.2',
      freshHumidity: '78.5',
      freshTemp: '25.6',
      freqFeedback: '12.0',
      filterStatus: '正常',
      freshValveOpenFeedback: '85.0',
      hotWaterValveRegFeedback: '20.0',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '停止',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '正常',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
    {
      id: 'cs-manifold-01',
      category: '冷源',
      code: 'B01_F02_003_Canner_00015',
      name: '冷源1#分水器集水器',
      label: '1#分水器',
      typeId: 'DTY_MANIFOLD',
      x: 29.5,
      y: 58.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '530',
      hotWaterFeedback: '12.0',
      freshHumidity: '79.0',
      freshTemp: '30.1',
      freqFeedback: '0.0',
      filterStatus: '正常',
      freshValveOpenFeedback: '90.0',
      hotWaterValveRegFeedback: '15.0',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '12.4℃',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '7.2℃',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
    {
      id: 'cs-pool-01',
      category: '冷源',
      code: 'B01_F02_003_Canner_00016',
      name: '水蓄冷蓄水池系统',
      label: '蓄水池',
      typeId: 'DTY_STORAGE_POOL',
      x: 73.0,
      y: 51.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '450',
      hotWaterFeedback: '0.0',
      freshHumidity: '85.0',
      freshTemp: '24.2',
      freqFeedback: '35.0',
      filterStatus: '正常',
      freshValveOpenFeedback: '100.0',
      hotWaterValveRegFeedback: '0.0',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '8.5℃',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '4.2℃',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '正常',
    },
    {
      id: 'hs-boiler-01',
      category: '热源',
      code: 'B01_F02_003_Canner_00020',
      name: '燃气热水锅炉机组01',
      label: '锅炉',
      typeId: 'DTY_GAS_BOILER',
      x: 52.5,
      y: 40.5,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '610',
      hotWaterFeedback: '85.5',
      freshHumidity: '62.0',
      freshTemp: '45.0',
      freqFeedback: '42.0',
      filterStatus: '正常',
      freshValveOpenFeedback: '80.0',
      hotWaterValveRegFeedback: '68.5',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '55.0℃',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '75.0℃',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
    {
      id: 'hs-solar-01',
      category: '热源',
      code: 'B01_F02_003_Canner_00021',
      name: '屋顶太阳能集热阵列',
      label: '太阳能板',
      typeId: 'DTY_SOLAR_PANEL',
      x: 61.5,
      y: 24.5,
      faultAlarm: '正常',
      manualAuto: '自动',
      freezeSwitch: '正常',
      co2: '420',
      hotWaterFeedback: '65.0',
      freshHumidity: '58.0',
      freshTemp: '52.0',
      freqFeedback: '30.0',
      filterStatus: '正常',
      freshValveOpenFeedback: '70.0',
      hotWaterValveRegFeedback: '55.0',
      coilLowTempAlarm: '正常',
      returnWaterTemp: '48.0℃',
      returnWaterHumidity: '正常',
      supplyWaterTemp: '68.0℃',
      runningStatus: '正常',
      supplyTemp: '正常',
      waterValveSwitchFeedback: '开',
    },
  ];

  const [selectedCoolingSourceId, setSelectedCoolingSourceId] = useState<string>('cs-chiller-01');
  const [coolingPowerStates, setCoolingPowerStates] = useState<Record<string, boolean>>({});
  const [coolingValveVal, setCoolingValveVal] = useState<Record<string, number>>({});
  const [coolingFreqVal, setCoolingFreqVal] = useState<Record<string, number>>({});

  const activeCoolingNode = coolingHeatingNodes.find(n => n.id === selectedCoolingSourceId) || coolingHeatingNodes[0];

  // Heat Source Nodes (热源 matching screenshot image_083a1294.png)
  const heatingSourceNodes = [
    {
      id: 'hs-boiler-01',
      code: 'B01_F02_003_Canner_00002',
      name: '1号锅炉',
      label: '1#锅炉',
      typeId: 'DTY_ACATHU',
      x: 36.0,
      y: 39.0,
      boilerFault: '正常',
      runHours: '8.6',
      runHoursInit: '675',
      burnAlarmInput: '0',
      burnerFault: '故障',
      furnaceWaterTemp: '103.2',
      waterTempSensorOpen: '断路',
      waterTempHighAlarm: '1',
      waterTempSensorShort: '0',
      waterTempSensorFault: '1',
      totalFuelTime: '205.9',
      flueGasTemp: '703.7',
      flueGasHighAlarm: '0',
      flueGasSensorOpen: '1',
      waterFlowInput: '0',
      gasLeakage: '0',
      heatingTemp: '463.1',
      heatingTempSensorOpen: '0',
    },
    {
      id: 'hs-boiler-02',
      code: 'B01_F02_003_Canner_00003',
      name: '2号锅炉',
      label: '2#锅炉',
      typeId: 'DTY_ACATHU',
      x: 39.5,
      y: 46.5,
      boilerFault: '正常',
      runHours: '12.4',
      runHoursInit: '680',
      burnAlarmInput: '0',
      burnerFault: '正常',
      furnaceWaterTemp: '98.5',
      waterTempSensorOpen: '正常',
      waterTempHighAlarm: '0',
      waterTempSensorShort: '0',
      waterTempSensorFault: '0',
      totalFuelTime: '188.2',
      flueGasTemp: '685.0',
      flueGasHighAlarm: '0',
      flueGasSensorOpen: '0',
      waterFlowInput: '1',
      gasLeakage: '0',
      heatingTemp: '455.0',
      heatingTempSensorOpen: '0',
    },
    {
      id: 'hs-manifold-dist',
      code: 'B01_F02_003_Canner_00004',
      name: '热水分水器01',
      label: '分水器',
      typeId: 'DTY_MANIFOLD',
      x: 32.0,
      y: 35.0,
      boilerFault: '正常',
      runHours: '24.0',
      runHoursInit: '700',
      burnAlarmInput: '0',
      burnerFault: '正常',
      furnaceWaterTemp: '85.0',
      waterTempSensorOpen: '正常',
      waterTempHighAlarm: '0',
      waterTempSensorShort: '0',
      waterTempSensorFault: '0',
      totalFuelTime: '0.0',
      flueGasTemp: '0.0',
      flueGasHighAlarm: '0',
      flueGasSensorOpen: '0',
      waterFlowInput: '1',
      gasLeakage: '0',
      heatingTemp: '463.1',
      heatingTempSensorOpen: '0',
    },
    {
      id: 'hs-manifold-coll',
      code: 'B01_F02_003_Canner_00005',
      name: '热水集水器01',
      label: '集水器',
      typeId: 'DTY_MANIFOLD',
      x: 22.0,
      y: 38.0,
      boilerFault: '正常',
      runHours: '24.0',
      runHoursInit: '700',
      burnAlarmInput: '0',
      burnerFault: '正常',
      furnaceWaterTemp: '65.2',
      waterTempSensorOpen: '正常',
      waterTempHighAlarm: '0',
      waterTempSensorShort: '0',
      waterTempSensorFault: '0',
      totalFuelTime: '0.0',
      flueGasTemp: '0.0',
      flueGasHighAlarm: '0',
      flueGasSensorOpen: '0',
      waterFlowInput: '1',
      gasLeakage: '0',
      heatingTemp: '430.5',
      heatingTempSensorOpen: '0',
    },
    {
      id: 'hs-valve-01',
      code: 'B01_F02_003_Canner_00006',
      name: '2#电动蝶阀01',
      label: '2#蝶阀',
      typeId: 'DTY_VALVE',
      x: 28.0,
      y: 43.5,
      boilerFault: '正常',
      runHours: '8.6',
      runHoursInit: '675',
      burnAlarmInput: '0',
      burnerFault: '正常',
      furnaceWaterTemp: '85.0',
      waterTempSensorOpen: '正常',
      waterTempHighAlarm: '0',
      waterTempSensorShort: '0',
      waterTempSensorFault: '0',
      totalFuelTime: '0.0',
      flueGasTemp: '0.0',
      flueGasHighAlarm: '0',
      flueGasSensorOpen: '0',
      waterFlowInput: '1',
      gasLeakage: '0',
      heatingTemp: '463.1',
      heatingTempSensorOpen: '0',
    },
    {
      id: 'hs-pumps-01',
      code: 'B01_F02_003_Canner_00007',
      name: '热水循环泵组',
      label: '热水泵组',
      typeId: 'DTY_PUMP_GROUP',
      x: 23.5,
      y: 59.5,
      boilerFault: '正常',
      runHours: '48.2',
      runHoursInit: '800',
      burnAlarmInput: '0',
      burnerFault: '正常',
      furnaceWaterTemp: '70.0',
      waterTempSensorOpen: '正常',
      waterTempHighAlarm: '0',
      waterTempSensorShort: '0',
      waterTempSensorFault: '0',
      totalFuelTime: '0.0',
      flueGasTemp: '0.0',
      flueGasHighAlarm: '0',
      flueGasSensorOpen: '0',
      waterFlowInput: '1',
      gasLeakage: '0',
      heatingTemp: '463.1',
      heatingTempSensorOpen: '0',
    },
  ];

  const [selectedHeatSourceId, setSelectedHeatSourceId] = useState<string>('hs-boiler-01');
  const [heatBurnCondStates, setHeatBurnCondStates] = useState<Record<string, boolean>>({});
  const [heatPump1States, setHeatPump1States] = useState<Record<string, boolean>>({});
  const [heatPump2States, setHeatPump2States] = useState<Record<string, boolean>>({});

  const activeHeatNode = heatingSourceNodes.find(n => n.id === selectedHeatSourceId) || heatingSourceNodes[0];

  // Water Supply & Drainage Nodes (给排水: 恒压供水 / 排水 matching screenshot image_d9c0c70b.png)
  const waterSupplyNodes = [
    {
      id: 'ws-pump-03', // 3#给水泵 matching image_d9c0c70b.png
      category: '恒压供水',
      code: 'B01_F02_003_Canner_00037',
      name: '1号楼地下1层生活水泵03',
      label: '3#给水泵',
      typeId: 'DTY_SPGASY',
      x: 45.5,
      y: 45.0,
      faultAlarm: '故障',
      manualAuto: '自动',
      runStatus: '运行',
      freqFeedback: '426.4',
    },
    {
      id: 'ws-pump-01',
      category: '恒压供水',
      code: 'B01_F02_003_Canner_00035',
      name: '1号楼地下1层生活水泵01',
      label: '1#给水泵',
      typeId: 'DTY_SPGASY',
      x: 45.5,
      y: 13.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      runStatus: '运行',
      freqFeedback: '426.4',
    },
    {
      id: 'ws-pump-02',
      category: '恒压供水',
      code: 'B01_F02_003_Canner_00036',
      name: '1号楼地下1层生活水泵02',
      label: '2#给水泵',
      typeId: 'DTY_SPGASY',
      x: 45.5,
      y: 29.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      runStatus: '停止',
      freqFeedback: '199.0',
    },
    {
      id: 'ws-pump-04',
      category: '恒压供水',
      code: 'B01_F02_003_Canner_00038',
      name: '1号楼地下1层生活水泵04',
      label: '4#给水泵',
      typeId: 'DTY_SPGASY',
      x: 45.5,
      y: 61.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      runStatus: '运行',
      freqFeedback: '264.8',
    },
    {
      id: 'ws-tank-01',
      category: '恒压供水',
      code: 'B01_F02_003_Canner_00039',
      name: '生活水箱01',
      label: '生活水箱',
      typeId: 'DTY_WATER_TANK',
      x: 25.0,
      y: 58.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      runStatus: '正常',
      freqFeedback: '50.0%',
    },
    {
      id: 'ws-press-pri',
      category: '恒压供水',
      code: 'B01_F02_003_Canner_00040',
      name: '一次侧供水压力传感器',
      label: '一次侧压力',
      typeId: 'DTY_PRESSURE_SENSOR',
      x: 8.5,
      y: 62.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      runStatus: '正常',
      freqFeedback: '796.5 kPa',
    },
    {
      id: 'ws-press-sec',
      category: '恒压供水',
      code: 'B01_F02_003_Canner_00041',
      name: '二次侧供水压力传感器',
      label: '二次侧压力',
      typeId: 'DTY_PRESSURE_SENSOR',
      x: 79.5,
      y: 62.0,
      faultAlarm: '正常',
      manualAuto: '自动',
      runStatus: '恒压运行',
      freqFeedback: '274.5 kPa',
    },
  ];

  // Drainage Nodes (给排水 -> 排水 matching screenshot image_690af10a.png)
  const drainageNodes = [
    {
      id: 'dr-pump-01',
      category: '排污泵',
      type: 'pump',
      code: 'B01_F02_003_Canner_00036',
      name: '1号楼地下1层排污泵01',
      label: '排污泵01',
      typeId: 'DTY_SPGASY',
      manualAuto: '自动',
      faultAlarm: '正常',
      runStatus: '1',
      x: 30.8,
      y: 32.5,
    },
    {
      id: 'dr-pump-02', // Default selected in screenshot image_690af10a.png
      category: '排污泵',
      type: 'pump',
      code: 'B01_F02_003_Canner_00037',
      name: '1号楼地下1层排污泵02',
      label: '排污泵02',
      typeId: 'DTY_SPGASY',
      manualAuto: '自动',
      faultAlarm: '正常',
      runStatus: '1',
      x: 29.3,
      y: 53.0,
    },
    {
      id: 'dr-pit-01',
      category: '集水坑',
      type: 'pit',
      code: 'B01_F02_003_Canner_00038',
      name: '1号楼地下1层集水坑01',
      label: '集水坑01',
      typeId: 'DTY_SPGASY',
      manualAuto: '自动',
      faultAlarm: '正常',
      runStatus: '1',
      x: 41.8,
      y: 49.5,
    },
    {
      id: 'dr-pit-02',
      category: '集水坑',
      type: 'pit',
      code: 'B01_F02_003_Canner_00039',
      name: '1号楼地下1层集水坑02',
      label: '集水坑02',
      typeId: 'DTY_SPGASY',
      manualAuto: '自动',
      faultAlarm: '正常',
      runStatus: '1',
      x: 38.0,
      y: 36.8,
    },
    {
      id: 'dr-pit-03',
      category: '集水坑',
      type: 'pit',
      code: 'B01_F02_003_Canner_00040',
      name: '1号楼地下1层集水坑03',
      label: '集水坑03',
      typeId: 'DTY_SPGASY',
      manualAuto: '自动',
      faultAlarm: '正常',
      runStatus: '1',
      x: 53.8,
      y: 36.8,
    },
    {
      id: 'dr-pump-03',
      category: '排污泵',
      type: 'pump',
      code: 'B01_F02_003_Canner_00041',
      name: '1号楼地下1层排污泵03',
      label: '排污泵03',
      typeId: 'DTY_SPGASY',
      manualAuto: '自动',
      faultAlarm: '正常',
      runStatus: '1',
      x: 54.2,
      y: 50.2,
    },
  ];

  const [selectedWaterSupplyId, setSelectedWaterSupplyId] = useState<string>('ws-pump-03');
  const [waterPumpPowerStates, setWaterPumpPowerStates] = useState<Record<string, boolean>>({});
  const [waterFreqVal, setWaterFreqVal] = useState<Record<string, number>>({});
  const activeWaterNode = waterSupplyNodes.find(n => n.id === selectedWaterSupplyId) || waterSupplyNodes[0];

  const [selectedDrainageNodeId, setSelectedDrainageNodeId] = useState<string>('dr-pump-02');
  const [drainagePowerStates, setDrainagePowerStates] = useState<Record<string, boolean>>({
    'dr-pump-02': false,
  });
  const activeDrainageNode = drainageNodes.find(n => n.id === selectedDrainageNodeId) || drainageNodes[1];

  // Power Distribution Nodes (变配电 matching screenshot image_22b861ef.png)
  const powerDistributionNodes = [
    {
      id: 'pwr-feeder-01', // Default active in screenshot image_22b861ef.png
      branch: '公共照明',
      label: '公共照明',
      name: '1号楼1层智能照明01',
      code: 'B01_F02_003_Canner_00003',
      typeId: 'DTY_ACALDL',
      faultAlarm: '正常',
      manualAuto: '手动',
      switchStatus: '开',
      x: 92.5,
      y: 5.3,
    },
    {
      id: 'pwr-feeder-02',
      branch: '电梯-01',
      label: '电梯-01',
      name: '1号楼客梯01动力回路',
      code: 'B01_F02_003_Canner_00004',
      typeId: 'DTY_ACALDL',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '开',
      x: 92.5,
      y: 16.0,
    },
    {
      id: 'pwr-feeder-03',
      branch: '排水泵',
      label: '排水泵',
      name: '地下室排水泵动力回路',
      code: 'B01_F02_003_Canner_00005',
      typeId: 'DTY_ACALDL',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '关',
      x: 92.5,
      y: 28.0,
    },
    {
      id: 'pwr-feeder-04',
      branch: '风机房',
      label: '风机房',
      name: '排烟风机房供电回路',
      code: 'B01_F02_003_Canner_00006',
      typeId: 'DTY_ACALDL',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '开',
      x: 92.5,
      y: 40.0,
    },
    {
      id: 'pwr-feeder-05',
      branch: '地下照明',
      label: '地下照明',
      name: '地下车库照明配电回路',
      code: 'B01_F02_003_Canner_00007',
      typeId: 'DTY_ACALDL',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '开',
      x: 92.5,
      y: 53.3,
    },
    {
      id: 'pwr-feeder-06',
      branch: '空调机房',
      label: '空调机房',
      name: '冷冻机房动力配电回路',
      code: 'B01_F02_003_Canner_00008',
      typeId: 'DTY_ACALDL',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '开',
      x: 92.5,
      y: 65.6,
    },
    {
      id: 'pwr-feeder-07',
      branch: '卫生间',
      label: '卫生间',
      name: '公共卫生间供电回路',
      code: 'B01_F02_003_Canner_00009',
      typeId: 'DTY_ACALDL',
      faultAlarm: '正常',
      manualAuto: '手动',
      switchStatus: '开',
      x: 92.5,
      y: 78.0,
    },
    {
      id: 'pwr-trans-01',
      branch: '变压器柜',
      label: '变压器柜进线',
      name: '10kV高压进线变压器柜',
      code: 'B01_F02_003_Canner_00001',
      typeId: 'DTY_TRANSFORMER',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '合闸',
      x: 18.0,
      y: 37.3,
    },
    {
      id: 'pwr-incomer-01',
      branch: '进线柜',
      label: '低压总进线柜',
      name: '0.4kV低压总进线柜',
      code: 'B01_F02_003_Canner_00002',
      typeId: 'DTY_INCOMER',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '合闸',
      x: 33.0,
      y: 76.5,
    },
    {
      id: 'pwr-cap-01',
      branch: '电容柜1',
      label: '1#电容补偿柜',
      name: '低压无功自动补偿柜01',
      code: 'B01_F02_003_Canner_00010',
      typeId: 'DTY_CAPACITOR',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '投入',
      x: 48.0,
      y: 57.0,
    },
    {
      id: 'pwr-cap-02',
      branch: '电容柜2',
      label: '2#电容补偿柜',
      name: '低压无功自动补偿柜02',
      code: 'B01_F02_003_Canner_00011',
      typeId: 'DTY_CAPACITOR',
      faultAlarm: '正常',
      manualAuto: '自动',
      switchStatus: '投入',
      x: 64.5,
      y: 57.0,
    },
  ];

  const [selectedPowerNodeId, setSelectedPowerNodeId] = useState<string>('pwr-feeder-01');
  const [powerSwitchStates, setPowerSwitchStates] = useState<Record<string, boolean>>({
    'pwr-feeder-01': false,
  });
  const activePowerNode = powerDistributionNodes.find(n => n.id === selectedPowerNodeId) || powerDistributionNodes[0];

  // Generator function for Vertical Elevators (直梯) based on selected building and floor
  const getVerticalElevatorNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;
    const bldgStr = String(bldgNum).padStart(2, '0');
    const floorStr = floor.startsWith('B') ? floor : `F${String(floorNum).padStart(2, '0')}`;
    const flDisplay = floor.replace('层', 'F');

    return [
      {
        id: `elev-${bldgStr}-${floorStr}-01`,
        code: `B${bldgStr}_${floorStr}_001_PASSENGER`,
        typeId: 'DTY_ELEV_VERT',
        name: `${building}${floor} 1#客梯(高区)`,
        shaft: `${building} 1#井道`,
        currentFloor: flDisplay,
        targetFloor: `${(floorNum + 3) > 9 ? 1 : floorNum + 3}F`,
        direction: (floorNum % 2 === 1 ? 'UP' : 'DOWN') as 'UP' | 'DOWN' | 'IDLE',
        doorStatus: '关门',
        runStatus: '运行中',
        speed: '1.75 m/s',
        loadKg: `${((floorNum * 65 + bldgNum * 80) % 650) + 200} kg`,
        loadPercent: Math.round(((((floorNum * 65 + bldgNum * 80) % 650) + 200) / 1000) * 100),
        ratedLoad: '1000 kg',
        ratedSpeed: '2.00 m/s',
        manualAuto: '自动',
        faultAlarm: '正常',
        fireMode: '正常',
        inspectionMode: '自动运行',
        brakeStatus: '抱闸打开',
        motorTemp: `${(41.5 + (floorNum * 0.4) % 4).toFixed(1)} ℃`,
        x: 30,
        y: 45,
      },
      {
        id: `elev-${bldgStr}-${floorStr}-02`,
        code: `B${bldgStr}_${floorStr}_002_PASSENGER`,
        typeId: 'DTY_ELEV_VERT',
        name: `${building}${floor} 2#客梯(低区)`,
        shaft: `${building} 2#井道`,
        currentFloor: flDisplay,
        targetFloor: `${(floorNum - 1) <= 0 ? 1 : floorNum - 1}F`,
        direction: (floorNum % 2 === 0 ? 'UP' : 'DOWN') as 'UP' | 'DOWN' | 'IDLE',
        doorStatus: '关门',
        runStatus: '运行中',
        speed: '1.50 m/s',
        loadKg: `${((floorNum * 85 + bldgNum * 40) % 700) + 150} kg`,
        loadPercent: Math.round(((((floorNum * 85 + bldgNum * 40) % 700) + 150) / 1000) * 100),
        ratedLoad: '1000 kg',
        ratedSpeed: '2.00 m/s',
        manualAuto: '自动',
        faultAlarm: '正常',
        fireMode: '正常',
        inspectionMode: '自动运行',
        brakeStatus: '抱闸打开',
        motorTemp: `${(42.8 + (floorNum * 0.3) % 4).toFixed(1)} ℃`,
        x: 44,
        y: 45,
      },
      {
        id: `elev-${bldgStr}-${floorStr}-03`,
        code: `B${bldgStr}_${floorStr}_003_FREIGHT`,
        typeId: 'DTY_ELEV_VERT',
        name: `${building}${floor} 3#消防兼货梯`,
        shaft: `${building} 3#井道`,
        currentFloor: flDisplay,
        targetFloor: flDisplay,
        direction: 'IDLE' as const,
        doorStatus: '开门',
        runStatus: '待机',
        speed: '0.00 m/s',
        loadKg: `${((floorNum * 45 + bldgNum * 90) % 900)} kg`,
        loadPercent: Math.round(((((floorNum * 45 + bldgNum * 90) % 900)) / 1600) * 100),
        ratedLoad: '1600 kg',
        ratedSpeed: '1.75 m/s',
        manualAuto: '自动',
        faultAlarm: '正常',
        fireMode: '正常',
        inspectionMode: '自动运行',
        brakeStatus: '抱闸闭合',
        motorTemp: `${(36.2 + (floorNum * 0.2) % 3).toFixed(1)} ℃`,
        x: 58,
        y: 45,
      },
      {
        id: `elev-${bldgStr}-${floorStr}-04`,
        code: `B${bldgStr}_${floorStr}_004_SIGHTSEEING`,
        typeId: 'DTY_ELEV_VERT',
        name: `${building}${floor} 4#景观观光梯`,
        shaft: `${building} 4#井道`,
        currentFloor: flDisplay,
        targetFloor: `${(floorNum + 1) > 9 ? 1 : floorNum + 1}F`,
        direction: 'UP' as const,
        doorStatus: '关门',
        runStatus: '运行中',
        speed: '1.75 m/s',
        loadKg: `${((floorNum * 55 + bldgNum * 110) % 550) + 100} kg`,
        loadPercent: Math.round(((((floorNum * 55 + bldgNum * 110) % 550) + 100) / 1000) * 100),
        ratedLoad: '1000 kg',
        ratedSpeed: '2.00 m/s',
        manualAuto: '自动',
        faultAlarm: '正常',
        fireMode: '正常',
        inspectionMode: '自动运行',
        brakeStatus: '抱闸打开',
        motorTemp: `${(40.1 + (floorNum * 0.5) % 4).toFixed(1)} ℃`,
        x: 72,
        y: 45,
      },
    ];
  };

  // Generator function for Escalators (斜梯) based on selected building and floor
  const getEscalatorNodes = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;
    const bldgStr = String(bldgNum).padStart(2, '0');
    const floorStr = floor.startsWith('B') ? floor : `F${String(floorNum).padStart(2, '0')}`;

    return [
      {
        id: `escl-${bldgStr}-${floorStr}-01`,
        code: `B${bldgStr}_${floorStr}_001_ESC`,
        typeId: 'DTY_ESCALATOR',
        name: `${building}${floor} 1#上行自动扶梯`,
        location: `${building}${floor} 中庭西侧`,
        direction: '上行' as const,
        runStatus: '运行',
        speed: '0.65 m/s',
        manualAuto: '自动',
        faultAlarm: '正常',
        combPlateSensor: '正常',
        handrailSync: '同步正常',
        stepSagSensor: '正常',
        eStopButton: '未触发',
        passengerCount: `${((floorNum * 140 + bldgNum * 200) % 1500) + 600} 人/时`,
        motorTemp: `${(41.5 + (floorNum * 0.5) % 5).toFixed(1)} ℃`,
        x: 35,
        y: 50,
      },
      {
        id: `escl-${bldgStr}-${floorStr}-02`,
        code: `B${bldgStr}_${floorStr}_002_ESC`,
        typeId: 'DTY_ESCALATOR',
        name: `${building}${floor} 2#下行自动扶梯`,
        location: `${building}${floor} 中庭东侧`,
        direction: '下行' as const,
        runStatus: '运行',
        speed: '0.65 m/s',
        manualAuto: '自动',
        faultAlarm: '正常',
        combPlateSensor: '正常',
        handrailSync: '同步正常',
        stepSagSensor: '正常',
        eStopButton: '未触发',
        passengerCount: `${((floorNum * 120 + bldgNum * 180) % 1400) + 500} 人/时`,
        motorTemp: `${(40.8 + (floorNum * 0.6) % 5).toFixed(1)} ℃`,
        x: 52,
        y: 50,
      },
      {
        id: `escl-${bldgStr}-${floorStr}-03`,
        code: `B${bldgStr}_${floorStr}_003_ESC`,
        typeId: 'DTY_ESCALATOR',
        name: `${building}${floor} 3#跨层观光斜梯`,
        location: `${building}${floor} 连廊跨层通道`,
        direction: '上行' as const,
        runStatus: '运行',
        speed: '0.65 m/s',
        manualAuto: '自动',
        faultAlarm: '正常',
        combPlateSensor: '正常',
        handrailSync: '同步正常',
        stepSagSensor: '正常',
        eStopButton: '未触发',
        passengerCount: `${((floorNum * 95 + bldgNum * 150) % 1200) + 400} 人/时`,
        motorTemp: `${(39.2 + (floorNum * 0.4) % 5).toFixed(1)} ℃`,
        x: 68,
        y: 50,
      },
    ];
  };

  const verticalElevatorNodes = getVerticalElevatorNodes(activeBuilding, activeFloor);
  const escalatorNodes = getEscalatorNodes(activeBuilding, activeFloor);

  const [selectedElevatorId, setSelectedElevatorId] = useState<string>('elev-02-F02-01');
  const [selectedEscalatorId, setSelectedEscalatorId] = useState<string>('escl-02-F02-01');
  const [elevatorDoorStates, setElevatorDoorStates] = useState<Record<string, boolean>>({});
  const [elevatorRunStates, setElevatorRunStates] = useState<Record<string, boolean>>({});
  const [escalatorRunStates, setEscalatorRunStates] = useState<Record<string, boolean>>({});
  const [escalatorDirStates, setEscalatorDirStates] = useState<Record<string, '上行' | '下行'>>({});

  const activeElevator = verticalElevatorNodes.find(e => e.id === selectedElevatorId) || verticalElevatorNodes[0];
  const activeEscalator = escalatorNodes.find(e => e.id === selectedEscalatorId) || escalatorNodes[0];

  // ==================== 能耗计量 (电表 / 水表) ====================
  const electricMeterNodes = [
    {
      id: 'meter-elec-01',
      code: 'B01_EM_001_MAIN',
      typeId: 'DTY_ELEC_METER',
      name: '1号楼低压进线总电表',
      location: 'B1 变配电总室',
      voltageA: '223.5 V',
      voltageB: '224.1 V',
      voltageC: '222.8 V',
      currentA: '342.6 A',
      currentB: '338.4 A',
      currentC: '340.2 A',
      activePower: '228.4 kW',
      reactivePower: '41.2 kvar',
      powerFactor: '0.98',
      frequency: '50.02 Hz',
      dailyKwh: '1,842.5 kWh',
      monthlyKwh: '52,680 kWh',
      breakerStatus: '合闸',
      onlineStatus: '在线',
      faultAlarm: '正常',
      x: 30,
      y: 42,
    },
    {
      id: 'meter-elec-02',
      code: 'B01_EM_002_HVAC',
      typeId: 'DTY_ELEC_METER',
      name: '中央暖通空调用电分表',
      location: '屋顶机房配电箱',
      voltageA: '224.0 V',
      voltageB: '223.7 V',
      voltageC: '224.2 V',
      currentA: '156.2 A',
      currentB: '154.8 A',
      currentC: '155.5 A',
      activePower: '104.5 kW',
      reactivePower: '18.6 kvar',
      powerFactor: '0.98',
      frequency: '50.01 Hz',
      dailyKwh: '862.0 kWh',
      monthlyKwh: '24,580 kWh',
      breakerStatus: '合闸',
      onlineStatus: '在线',
      faultAlarm: '正常',
      x: 45,
      y: 54,
    },
    {
      id: 'meter-elec-03',
      code: 'B01_EM_003_POWER',
      typeId: 'DTY_ELEC_METER',
      name: '给排水与电梯动力分表',
      location: 'B1 动力配电箱',
      voltageA: '223.8 V',
      voltageB: '224.0 V',
      voltageC: '223.5 V',
      currentA: '86.4 A',
      currentB: '85.2 A',
      currentC: '87.0 A',
      activePower: '58.2 kW',
      reactivePower: '11.4 kvar',
      powerFactor: '0.98',
      frequency: '50.00 Hz',
      dailyKwh: '476.3 kWh',
      monthlyKwh: '13,420 kWh',
      breakerStatus: '合闸',
      onlineStatus: '在线',
      faultAlarm: '正常',
      x: 58,
      y: 42,
    },
    {
      id: 'meter-elec-04',
      code: 'B01_EM_004_LIGHT',
      typeId: 'DTY_ELEC_METER',
      name: '楼层公共照明插座分表',
      location: '楼层强电井照明箱',
      voltageA: '224.2 V',
      voltageB: '223.9 V',
      voltageC: '224.1 V',
      currentA: '52.8 A',
      currentB: '51.9 A',
      currentC: '53.2 A',
      activePower: '35.6 kW',
      reactivePower: '4.8 kvar',
      powerFactor: '0.99',
      frequency: '50.01 Hz',
      dailyKwh: '298.5 kWh',
      monthlyKwh: '8,240 kWh',
      breakerStatus: '合闸',
      onlineStatus: '在线',
      faultAlarm: '正常',
      x: 72,
      y: 54,
    },
  ];

  const waterMeterNodes = [
    {
      id: 'meter-water-01',
      code: 'B01_WM_001_MAIN',
      typeId: 'DTY_WATER_METER',
      name: '市政自来水进水总表',
      location: '园区室外水表井01',
      instantFlow: '24.8 m³/h',
      totalFlow: '14,820.6 m³',
      waterPressure: '0.42 MPa',
      dailyWater: '168.4 m³',
      batteryVolt: '3.6 V',
      valveStatus: '常开',
      leakageAlert: '无泄漏',
      onlineStatus: '在线',
      faultAlarm: '正常',
      x: 30,
      y: 45,
    },
    {
      id: 'meter-water-02',
      code: 'B01_WM_002_DOMESTIC',
      typeId: 'DTY_WATER_METER',
      name: '生活给水泵房加压分表',
      location: 'B2 生活给水泵房',
      instantFlow: '16.2 m³/h',
      totalFlow: '9,640.2 m³',
      waterPressure: '0.58 MPa',
      dailyWater: '112.5 m³',
      batteryVolt: '3.6 V',
      valveStatus: '常开',
      leakageAlert: '无泄漏',
      onlineStatus: '在线',
      faultAlarm: '正常',
      x: 46,
      y: 45,
    },
    {
      id: 'meter-water-03',
      code: 'B01_WM_003_IRRIG',
      typeId: 'DTY_WATER_METER',
      name: '室外绿化喷灌专用分表',
      location: '景观绿化给水井',
      instantFlow: '4.5 m³/h',
      totalFlow: '2,380.0 m³',
      waterPressure: '0.35 MPa',
      dailyWater: '28.6 m³',
      batteryVolt: '3.6 V',
      valveStatus: '常开',
      leakageAlert: '无泄漏',
      onlineStatus: '在线',
      faultAlarm: '正常',
      x: 60,
      y: 58,
    },
    {
      id: 'meter-water-04',
      code: 'B01_WM_004_HVAC',
      typeId: 'DTY_WATER_METER',
      name: '冷却塔定压补水专用表',
      location: '屋顶冷却机房',
      instantFlow: '1.8 m³/h',
      totalFlow: '1,420.8 m³',
      waterPressure: '0.38 MPa',
      dailyWater: '12.4 m³',
      batteryVolt: '3.6 V',
      valveStatus: '常开',
      leakageAlert: '无泄漏',
      onlineStatus: '在线',
      faultAlarm: '正常',
      x: 74,
      y: 38,
    },
  ];

  const [selectedElectricMeterId, setSelectedElectricMeterId] = useState<string>('meter-elec-01');
  const [selectedWaterMeterId, setSelectedWaterMeterId] = useState<string>('meter-water-01');
  const [electricBreakerStates, setElectricBreakerStates] = useState<Record<string, boolean>>({
    'meter-elec-01': true,
    'meter-elec-02': true,
    'meter-elec-03': true,
    'meter-elec-04': true,
  });
  const [waterValveStates, setWaterValveStates] = useState<Record<string, boolean>>({
    'meter-water-01': true,
    'meter-water-02': true,
    'meter-water-03': true,
    'meter-water-04': true,
  });

  const activeElectricMeter = electricMeterNodes.find(m => m.id === selectedElectricMeterId) || electricMeterNodes[0];
  const activeWaterMeter = waterMeterNodes.find(m => m.id === selectedWaterMeterId) || waterMeterNodes[0];

  // ==================== 能耗计量 - 楼层电表 & 楼层水表 Hotspots Dynamic Generators ====================
  const getFloorElectricMeterHotspots = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    const baseHotspots = [
      { id: 'fem-01', name: '01#计量电表', basePx: 30.8, basePy: 31.8, valOffset: 0, spaceSuffix: '1' },
      { id: 'fem-02', name: '02#计量电表', basePx: 28.5, basePy: 36.5, valOffset: -746, spaceSuffix: '2' },
      { id: 'fem-03', name: '03#计量电表', basePx: 25.6, basePy: 48.0, valOffset: 1674, spaceSuffix: '3' },
      { id: 'fem-04', name: '04#计量电表', basePx: 29.2, basePy: 45.5, valOffset: 834, spaceSuffix: '4' },
      { id: 'fem-05', name: '05#计量电表', basePx: 36.2, basePy: 45.0, valOffset: 4384, spaceSuffix: '5' },
      { id: 'fem-06', name: '06#计量电表', basePx: 39.8, basePy: 32.8, valOffset: -1836, spaceSuffix: '6' },
      { id: 'fem-07', name: '07#计量电表', basePx: 47.5, basePy: 29.8, valOffset: 6734, spaceSuffix: '7' },
      { id: 'fem-08', name: '08#计量电表', basePx: 52.8, basePy: 35.0, valOffset: 414, spaceSuffix: '8' },
      { id: 'fem-09', name: '09#计量电表', basePx: 51.2, basePy: 46.2, valOffset: 3084, spaceSuffix: '9' },
      { id: 'fem-10', name: '10#计量电表', basePx: 59.6, basePy: 53.5, valOffset: -1006, spaceSuffix: '0' },
    ];

    const isExactFirstFloor = (bldgNum === 1 && floor === '1层');

    return baseHotspots.map((item, idx) => {
      const shiftX = isExactFirstFloor ? 0 : (((floorNum * 7 + bldgNum * 4 + idx * 3) % 13) - 6);
      const shiftY = isExactFirstFloor ? 0 : (((floorNum * 5 + bldgNum * 3 + idx * 4) % 11) - 5);

      const x = Math.max(16, Math.min(84, item.basePx + shiftX));
      const y = Math.max(20, Math.min(80, item.basePy + shiftY));

      return {
        ...item,
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
      };
    });
  };

  const getFloorWaterMeterHotspots = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;

    const baseHotspots = [
      { id: 'fwm-01', name: '01#计量水表', basePx: 30.8, basePy: 31.8, valOffset: 0, spaceSuffix: '1' },
      { id: 'fwm-02', name: '02#计量水表', basePx: 26.8, basePy: 40.5, valOffset: -520, spaceSuffix: '2' },
      { id: 'fwm-03', name: '03#计量水表', basePx: 26.5, basePy: 47.0, valOffset: 740, spaceSuffix: '3' },
      { id: 'fwm-04', name: '04#计量水表', basePx: 30.0, basePy: 46.2, valOffset: -380, spaceSuffix: '4' },
      { id: 'fwm-05', name: '05#计量水表', basePx: 35.8, basePy: 45.8, valOffset: 1260, spaceSuffix: '5' },
      { id: 'fwm-06', name: '06#计量水表', basePx: 39.5, basePy: 32.0, valOffset: -890, spaceSuffix: '6' },
      { id: 'fwm-07', name: '07#计量水表', basePx: 50.0, basePy: 46.5, valOffset: 450, spaceSuffix: '7' },
      { id: 'fwm-08', name: '08#计量水表', basePx: 54.5, basePy: 28.0, valOffset: -180, spaceSuffix: '8' },
      { id: 'fwm-09', name: '09#计量水表', basePx: 56.8, basePy: 34.8, valOffset: 920, spaceSuffix: '9' },
    ];

    const isExactFirstFloor = (bldgNum === 1 && floor === '1层');

    return baseHotspots.map((item, idx) => {
      const shiftX = isExactFirstFloor ? 0 : (((floorNum * 6 + bldgNum * 5 + idx * 2) % 11) - 5);
      const shiftY = isExactFirstFloor ? 0 : (((floorNum * 4 + bldgNum * 6 + idx * 3) % 9) - 4);

      const x = Math.max(16, Math.min(84, item.basePx + shiftX));
      const y = Math.max(20, Math.min(80, item.basePy + shiftY));

      return {
        ...item,
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
      };
    });
  };

  const floorElectricMeterHotspots = getFloorElectricMeterHotspots(activeBuilding, activeFloor);
  const floorWaterMeterHotspots = getFloorWaterMeterHotspots(activeBuilding, activeFloor);

  const [selectedFloorMeterId, setSelectedFloorMeterId] = useState<string>('fem-01');

  // Baseline data per floor matching screenshot image_10698de3.png
  const floorMeterBaselines: Record<string, { baseVal: number; basePrev: number; baseSpace: string }> = {
    '1层': { baseVal: 14566, basePrev: 145, baseSpace: '2021' },
    '2层': { baseVal: 18920, basePrev: 182, baseSpace: '2022' },
    '3层': { baseVal: 12430, basePrev: 136, baseSpace: '3011' },
    '4层': { baseVal: 21850, basePrev: 215, baseSpace: '4012' },
    '5层': { baseVal: 16780, basePrev: 164, baseSpace: '5015' },
    '6层': { baseVal: 15320, basePrev: 151, baseSpace: '6018' },
    '7层': { baseVal: 19450, basePrev: 190, baseSpace: '7021' },
    '8层': { baseVal: 17210, basePrev: 168, baseSpace: '8025' },
    '9层': { baseVal: 23640, basePrev: 228, baseSpace: '9030' },
    'B1': { baseVal: 28910, basePrev: 275, baseSpace: '0010' },
    'B2': { baseVal: 31200, basePrev: 298, baseSpace: '0020' },
    'B3': { baseVal: 29500, basePrev: 280, baseSpace: '0030' },
  };

  const activeFloorBaseline = floorMeterBaselines[activeFloor] || { baseVal: 14566, basePrev: 145, baseSpace: '2021' };
  const activeSelectedHotspot = floorElectricMeterHotspots.find(h => h.id === selectedFloorMeterId) || floorElectricMeterHotspots[0];

  const floorNumMeter = parseInt(activeFloor.replace(/\D/g, '')) || (activeFloor === 'B1' ? 1 : activeFloor === 'B2' ? 2 : activeFloor === 'B3' ? 3 : 1);
  const bldgNumMeter = parseInt(activeBuilding.replace(/\D/g, '')) || 1;
  const bldgStrMeter = String(bldgNumMeter).padStart(2, '0');
  const floorStrMeter = activeFloor.startsWith('B') ? activeFloor : `F${String(floorNumMeter).padStart(2, '0')}`;

  const currentFloorMeterReading = `${activeFloorBaseline.baseVal + activeSelectedHotspot.valOffset + (bldgNumMeter - 1) * 1250}kWh`;
  const currentFloorMeterPrevReading = `${Math.max(10, activeFloorBaseline.basePrev + Math.round(activeSelectedHotspot.valOffset / 100) + (bldgNumMeter - 1) * 15)}kWh`;
  const currentFloorMeterSpace = (activeBuilding === '1号楼' && activeFloor === '1层' && selectedFloorMeterId === 'fem-01') ? '2021' : `${activeFloorBaseline.baseSpace.slice(0, 3)}${activeSelectedHotspot.spaceSuffix}`;
  const currentFloorMeterCode = (activeBuilding === '1号楼' && activeFloor === '1层' && selectedFloorMeterId === 'fem-01') ? 'B01_F02_003_Canner_00037' : `B${bldgStrMeter}_${floorStrMeter}_003_EM_000${37 + floorElectricMeterHotspots.indexOf(activeSelectedHotspot)}`;
  const currentFloorMeterName = `${activeBuilding}${activeFloor}${activeSelectedHotspot.name}`;

  const [selectedFloorWaterMeterId, setSelectedFloorWaterMeterId] = useState<string>('fwm-01');

  // Baseline data per floor for water meter matching screenshot image_a512739a.png (1F: 8868m³, 123m³, 2021)
  const floorWaterMeterBaselines: Record<string, { baseVal: number; basePrev: number; baseSpace: string }> = {
    '1层': { baseVal: 8868, basePrev: 123, baseSpace: '2021' },
    '2层': { baseVal: 10240, basePrev: 145, baseSpace: '2022' },
    '3层': { baseVal: 7620, basePrev: 98, baseSpace: '3011' },
    '4层': { baseVal: 12580, basePrev: 168, baseSpace: '4012' },
    '5层': { baseVal: 9450, basePrev: 130, baseSpace: '5015' },
    '6层': { baseVal: 8930, basePrev: 115, baseSpace: '6018' },
    '7层': { baseVal: 11200, basePrev: 152, baseSpace: '7021' },
    '8层': { baseVal: 9870, basePrev: 134, baseSpace: '8025' },
    '9层': { baseVal: 13400, basePrev: 180, baseSpace: '9030' },
    'B1': { baseVal: 18500, basePrev: 240, baseSpace: '0010' },
    'B2': { baseVal: 21000, basePrev: 285, baseSpace: '0020' },
    'B3': { baseVal: 19800, basePrev: 260, baseSpace: '0030' },
  };

  const activeWaterFloorBaseline = floorWaterMeterBaselines[activeFloor] || { baseVal: 8868, basePrev: 123, baseSpace: '2021' };
  const activeSelectedWaterHotspot = floorWaterMeterHotspots.find(h => h.id === selectedFloorWaterMeterId) || floorWaterMeterHotspots[0];

  const currentFloorWaterReading = `${activeWaterFloorBaseline.baseVal + activeSelectedWaterHotspot.valOffset + (bldgNumMeter - 1) * 620}m³`;
  const currentFloorWaterPrevReading = `${Math.max(10, activeWaterFloorBaseline.basePrev + Math.round(activeSelectedWaterHotspot.valOffset / 50) + (bldgNumMeter - 1) * 8)}m³`;
  const currentFloorWaterSpace = (activeBuilding === '1号楼' && activeFloor === '1层' && selectedFloorWaterMeterId === 'fwm-01') ? '2021' : `${activeWaterFloorBaseline.baseSpace.slice(0, 3)}${activeSelectedWaterHotspot.spaceSuffix}`;
  const currentFloorWaterCode = (activeBuilding === '1号楼' && activeFloor === '1层' && selectedFloorWaterMeterId === 'fwm-01') ? 'B01_F02_003_Canner_00037' : `B${bldgStrMeter}_${floorStrMeter}_003_WM_000${37 + floorWaterMeterHotspots.indexOf(activeSelectedWaterHotspot)}`;
  const currentFloorWaterName = `${activeBuilding}${activeFloor}${activeSelectedWaterHotspot.name}`;

  // ==================== 电梯系统 (直梯 / 斜梯) 楼层联动变量 ====================
  const floorNum = parseInt(activeFloor.replace(/[^0-9]/g, '')) || 1;
  const currentElevatorFloorName = `${activeBuilding}${activeFloor}直梯01`;
  const currentElevatorCode = `B01_${activeFloor === 'B1' ? 'B1' : `F0${floorNum}`}_001_ELV_000${20 + floorNum}`;
  const currentElevatorShaft = `${activeBuilding}主核心筒1#井道`;
  const currentElevatorDisplayFloor = activeFloor.replace('层', 'F');
  const currentElevatorLoadKg = `${((floorNum * 85 + 230) % 800) + 120} kg`;
  const currentElevatorLoadPercent = Math.round(((((floorNum * 85 + 230) % 800) + 120) / 1000) * 100);

  const currentEscalatorFloorName = `${activeBuilding}${activeFloor}自动扶梯`;
  const currentEscalatorCode = `B01_${activeFloor === 'B1' ? 'B1' : `F0${floorNum}`}_001_ESC_000${15 + floorNum}`;
  const currentEscalatorLocation = `${activeBuilding}${activeFloor}中庭连廊`;
  const currentEscalatorPassengers = `${floorNum * 120 + 850} 人/时`;
  const currentEscalatorTemp = `${(38.6 + floorNum * 0.4).toFixed(1)} ℃`;

  // ==================== 信息网络 (信息发布 / 音乐广播) ====================
  const getFloorSignageHotspots = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;
    const bldgStr = String(bldgNum).padStart(2, '0');
    const floorStr = floor.startsWith('B') ? floor : `F${String(floorNum).padStart(2, '0')}`;

    const baseHotspots = [
      { idSuffix: '01', nameSuffix: '信息发布终端01', basePx: 38.5, basePy: 28.2, defaultProg: '主国歌' },
      { idSuffix: '02', nameSuffix: '信息发布终端02', basePx: 43.2, basePy: 41.5, defaultProg: '园区宣传视听_V2' },
      { idSuffix: '03', nameSuffix: '信息发布终端03', basePx: 50.2, basePy: 52.0, defaultProg: '迎宾欢迎致辞_V1' },
    ];

    const isExactFirstFloor = (bldgNum === 1 && floor === '1层');

    return baseHotspots.map((item, idx) => {
      const shiftX = isExactFirstFloor ? 0 : (((floorNum * 6 + bldgNum * 4 + idx * 5) % 11) - 5);
      const shiftY = isExactFirstFloor ? 0 : (((floorNum * 4 + bldgNum * 5 + idx * 3) % 9) - 4);

      const posX = Math.max(18, Math.min(82, item.basePx + shiftX));
      const posY = Math.max(22, Math.min(78, item.basePy + shiftY));

      const code = (bldgNum === 1 && floor === '1层' && idx === 0)
        ? 'B01_F02_003_Canner_00037'
        : `B${bldgStr}_${floorStr}_003_Canner_000${37 + idx}`;
      const name = `${building}${floor}${item.nameSuffix}`;

      return {
        id: `scr-${bldgStr}-${floorStr}-${item.idSuffix}`,
        code,
        typeId: 'DTY_SPGASY',
        name,
        broadcastContent: '—',
        runStatus: '0',
        onlineStatus: '在线',
        programList: item.defaultProg,
        resolution: '1920×1080 (FHD)',
        brightness: 80 - idx * 5,
        volume: 35 - idx * 10,
        powerStatus: '开机',
        networkStatus: '千兆局域网在线',
        ipAddr: `192.168.20.${100 + floorNum * 3 + idx}`,
        storageUsage: `${(24.5 + idx * 8.2).toFixed(1)} GB / 64 GB`,
        faultAlarm: '正常',
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
      };
    });
  };

  const getFloorBroadcastHotspots = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || 1;
    const bldgStr = String(bldgNum).padStart(2, '0');
    const floorStr = floor.startsWith('B') ? floor : `F${String(floorNum).padStart(2, '0')}`;

    // 5 broadcast terminal speaker locations matching screenshot image_c10ff38d.png
    const baseHotspots = [
      { idSuffix: '01', nameSuffix: '广播终端01', basePx: 31.2, basePy: 32.5, defaultProg: '主国歌' },
      { idSuffix: '02', nameSuffix: '广播终端02', basePx: 53.0, basePy: 32.5, defaultProg: '主国歌' },
      { idSuffix: '03', nameSuffix: '广播终端03', basePx: 41.2, basePy: 42.8, defaultProg: '主国歌' },
      { idSuffix: '04', nameSuffix: '广播终端04', basePx: 30.8, basePy: 55.5, defaultProg: '主国歌' },
      { idSuffix: '05', nameSuffix: '广播终端05', basePx: 54.8, basePy: 55.5, defaultProg: '主国歌' },
    ];

    const isExactFirstFloor = (bldgNum === 1 && floor === '1层');

    return baseHotspots.map((item, idx) => {
      const shiftX = isExactFirstFloor ? 0 : (((floorNum * 5 + bldgNum * 3 + idx * 4) % 11) - 5);
      const shiftY = isExactFirstFloor ? 0 : (((floorNum * 3 + bldgNum * 4 + idx * 2) % 9) - 4);

      const posX = Math.max(16, Math.min(84, item.basePx + shiftX));
      const posY = Math.max(20, Math.min(80, item.basePy + shiftY));

      const code = (bldgNum === 1 && floor === '1层' && idx === 0)
        ? 'B01_F02_003_Canner_00037'
        : `B${bldgStr}_${floorStr}_003_Canner_000${37 + idx}`;
      const name = `${building}${floor}${item.nameSuffix}`;

      return {
        id: `spk-${bldgStr}-${floorStr}-${item.idSuffix}`,
        code,
        typeId: 'DTY_SPGASY',
        name,
        broadcastContent: '—',
        runStatus: '0',
        onlineStatus: '在线',
        programList: item.defaultProg,
        volume: 80,
        x: Number(posX.toFixed(1)),
        y: Number(posY.toFixed(1)),
      };
    });
  };

  const floorSignageHotspots = getFloorSignageHotspots(activeBuilding, activeFloor);
  const [selectedSignageId, setSelectedSignageId] = useState<string>('scr-01-F01-01');
  const [signageProgramState, setSignageProgramState] = useState<Record<string, string>>({});

  const floorBroadcastHotspots = getFloorBroadcastHotspots(activeBuilding, activeFloor);
  const [selectedBroadcastId, setSelectedBroadcastId] = useState<string>('spk-01-F01-01');
  const [broadcastProgramState, setBroadcastProgramState] = useState<Record<string, string>>({});
  const [broadcastVolumeState, setBroadcastVolumeState] = useState<Record<string, number>>({});
  const activeBroadcastNode = floorBroadcastHotspots.find(b => b.id === selectedBroadcastId) || floorBroadcastHotspots[0];

  const ipSpeakerNodes = [
    {
      id: 'spk-01',
      code: 'B01_BGM_001_LOBBY',
      typeId: 'DTY_IP_SPEAKER',
      name: '1F公共大堂网络广播区',
      location: '1F公共大堂天花吸顶',
      mode: '背景音乐',
      currentTrack: '班得瑞 - 寂静山林.mp3',
      volume: 45,
      playStatus: '正在播放',
      priority: '常规背景音乐 (优先级 3)',
      fireOverride: '待命正常',
      amplifierPower: '120 W',
      snrRatio: '92 dB',
      ipAddr: '192.168.30.51',
      faultAlarm: '正常',
      x: 35,
      y: 44,
    },
    {
      id: 'spk-02',
      code: 'B01_BGM_002_CORRIDOR',
      typeId: 'DTY_IP_SPEAKER',
      name: '客梯前室与走廊广播区',
      location: '各楼层电梯厅及过道',
      mode: '背景音乐',
      currentTrack: '班得瑞 - 寂静山林.mp3',
      volume: 30,
      playStatus: '正在播放',
      priority: '常规背景音乐 (优先级 3)',
      fireOverride: '待命正常',
      amplifierPower: '80 W',
      snrRatio: '90 dB',
      ipAddr: '192.168.30.52',
      faultAlarm: '正常',
      x: 48,
      y: 40,
    },
    {
      id: 'spk-03',
      code: 'B01_BGM_003_PARKING',
      typeId: 'DTY_IP_SPEAKER',
      name: 'B1地下车库广播分区',
      location: '地下车库主行车道',
      mode: '业务广播',
      currentTrack: '园区行车安全提示_定时播报.mp3',
      volume: 60,
      playStatus: '定时待播',
      priority: '业务广播 (优先级 2)',
      fireOverride: '待命正常',
      amplifierPower: '240 W',
      snrRatio: '88 dB',
      ipAddr: '192.168.30.53',
      faultAlarm: '正常',
      x: 62,
      y: 55,
    },
    {
      id: 'spk-04',
      code: 'B01_BGM_004_GARDEN',
      typeId: 'DTY_IP_SPEAKER',
      name: '室外园林仿真草坪音箱区',
      location: '中央景观花园草坪',
      mode: '背景音乐',
      currentTrack: '鸟语花香轻音乐_园区环绕.mp3',
      volume: 50,
      playStatus: '正在播放',
      priority: '常规背景音乐 (优先级 3)',
      fireOverride: '待命正常',
      amplifierPower: '150 W',
      snrRatio: '91 dB',
      ipAddr: '192.168.30.54',
      faultAlarm: '正常',
      x: 75,
      y: 46,
    },
  ];

  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('spk-01');
  const [signagePowerStates, setSignagePowerStates] = useState<Record<string, boolean>>({});
  const [signageBrightness, setSignageBrightness] = useState<Record<string, number>>({});
  const [speakerPlayStates, setSpeakerPlayStates] = useState<Record<string, boolean>>({
    'spk-01': true,
    'spk-02': true,
    'spk-03': false,
    'spk-04': true,
  });
  const [speakerVolumes, setSpeakerVolumes] = useState<Record<string, number>>({
    'spk-01': 45,
    'spk-02': 30,
    'spk-03': 60,
    'spk-04': 50,
  });

  const activeSignageNode = floorSignageHotspots.find(s => s.id === selectedSignageId) || floorSignageHotspots[0];
  const activeSpeaker = ipSpeakerNodes.find(s => s.id === selectedSpeakerId) || ipSpeakerNodes[0];

  // Group Control States (image_62633fed.png)
  const [groupControlCards, setGroupControlCards] = useState([
    { id: 'all', title: '全部组合式空调', power: '关闭', co2: '0.00', returnTemp: '0.00', supplyTemp: '0.00' },
    { id: 'bldg1', title: '一栋组合式空调', power: '关闭', co2: '0.00', returnTemp: '0.00', supplyTemp: '0.00' },
    { id: 'bldg2', title: '二栋组合式空调', power: '关闭', co2: '0.00', returnTemp: '0.00', supplyTemp: '0.00' },
  ]);

  // Camera & Device Selection State
  const [selectedCameraId, setSelectedCameraId] = useState<string>('cam-2f-01');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('2026-11-06 21:44:53');

  // Real-time clock for timestamps
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
      setCurrentTimeStr(`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 13 Secondary Subsystems with Tertiary Sub-items (matching screenshot)
  const secondaryMenuItems: { 
    id: SubsystemType; 
    label: string; 
    icon: React.ReactNode; 
    tertiaryItems: string[];
  }[] = [
    { 
      id: '视频监控', 
      label: '视频监控', 
      icon: <Video className="w-3.5 h-3.5 text-cyan-400" />,
      tertiaryItems: ['摄像机']
    },
    { 
      id: '防盗告警', 
      label: '防盗告警', 
      icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />,
      tertiaryItems: ['周界告警', '入侵告警']
    },
    { 
      id: '门禁系统', 
      label: '门禁系统', 
      icon: <Lock className="w-3.5 h-3.5 text-blue-400" />,
      tertiaryItems: ['人行道闸', '人脸门禁']
    },
    { 
      id: '停车场系统', 
      label: '停车场系统', 
      icon: <Car className="w-3.5 h-3.5 text-amber-400" />,
      tertiaryItems: ['车位']
    },
    { 
      id: '暖通空调', 
      label: '暖通空调', 
      icon: <Wind className="w-3.5 h-3.5 text-teal-400" />,
      tertiaryItems: ['组合式空调', '新风机', '送风机', '排风机']
    },
    { 
      id: '智慧照明', 
      label: '智慧照明', 
      icon: <Sun className="w-3.5 h-3.5 text-yellow-400" />,
      tertiaryItems: ['室内照明', '景观照明', '泛光照明']
    },
    { 
      id: '环境监测', 
      label: '环境监测', 
      icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />,
      tertiaryItems: ['环境传感器']
    },
    { 
      id: '冷热源', 
      label: '冷热源', 
      icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
      tertiaryItems: ['冷源', '热源']
    },
    { 
      id: '给排水', 
      label: '给排水', 
      icon: <Droplets className="w-3.5 h-3.5 text-sky-400" />,
      tertiaryItems: ['恒压供水', '排水']
    },
    { 
      id: '变配电', 
      label: '变配电', 
      icon: <Zap className="w-3.5 h-3.5 text-purple-400" />,
      tertiaryItems: ['变配电']
    },
    { 
      id: '电梯系统', 
      label: '电梯系统', 
      icon: <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />,
      tertiaryItems: ['直梯', '斜梯']
    },
    { 
      id: '能耗计量', 
      label: '能耗计量', 
      icon: <BarChart2 className="w-3.5 h-3.5 text-emerald-300" />,
      tertiaryItems: ['电表', '水表']
    },
    { 
      id: '信息网络', 
      label: '信息网络', 
      icon: <Network className="w-3.5 h-3.5 text-blue-300" />,
      tertiaryItems: ['信息发布', '音乐广播']
    },
  ];

  // Building & Floor hierarchy definition (matching screenshot)
  const buildingsTree = [
    { 
      name: '1号楼', 
      floors: activeSubsystem === '停车场系统' ? ['B1', 'B2', 'B3'] : ['1层', '2层', '3层', '4层', '5层', '6层', '7层', '8层', '9层'] 
    },
    { 
      name: '2号楼', 
      floors: activeSubsystem === '停车场系统' ? ['B1', 'B2', 'B3'] : ['1层', '2层', '3层', '4层', '5层', '6层', '7层', '8层', '9层'] 
    },
    { 
      name: '3号楼', 
      floors: activeSubsystem === '停车场系统' ? ['B1', 'B2', 'B3'] : ['1层', '2层', '3层', '4层', '5层', '6层', '7层', '8层', '9层'] 
    },
    { 
      name: '地下车库', 
      floors: ['B1', 'B2', 'B3'] 
    }
  ];

  // Camera dataset generator per building/floor - dynamic layout with distinct coordinates for every floor!
  const getCamerasForFloor = (building: string, floor: string) => {
    const floorNum = parseInt(floor.replace(/\D/g, '')) || (floor === 'B1' ? 1 : floor === 'B2' ? 2 : floor === 'B3' ? 3 : 1);
    const bldgNum = parseInt(building.replace(/\D/g, '')) || (building === '地下车库' ? 4 : 1);
    const isBasement = floor.startsWith('B') || building === '地下车库';
    const isGround = floor === '1层' && !isBasement;

    const bldgCode = String(bldgNum).padStart(2, '0');
    const floorCode = String(floorNum).padStart(2, '0');

    // High quality office video feed presets
    const videoFeeds = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    ];

    if (isBasement) {
      // Underground garage camera layout
      return [
        {
          id: `cam-${building}-${floor}-01`,
          code: `B${bldgCode}_F${floorCode}_001_Camera_0091`,
          name: `${building}${floor}主车道进出入监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 21.5,
          y: 68.4,
          locationLabel: `${floor} 主车道闸口`,
          videoUrl: videoFeeds[0]
        },
        {
          id: `cam-${building}-${floor}-02`,
          code: `B${bldgCode}_F${floorCode}_002_Camera_0092`,
          name: `${building}${floor}中央车行通道监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 46.2,
          y: 54.0,
          locationLabel: `${floor} 中央环道`,
          videoUrl: videoFeeds[1]
        },
        {
          id: `cam-${building}-${floor}-03`,
          code: `B${bldgCode}_F${floorCode}_003_Camera_0093`,
          name: `${building}${floor}直梯厅出入口监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 52.8,
          y: 28.5,
          locationLabel: `${floor} 1号直梯厅`,
          videoUrl: videoFeeds[2]
        },
        {
          id: `cam-${building}-${floor}-04`,
          code: `B${bldgCode}_F${floorCode}_004_Camera_0094`,
          name: `${building}${floor}配电泵房通道监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 31.5,
          y: 33.2,
          locationLabel: `${floor} 设备机房走道`,
          videoUrl: videoFeeds[3]
        },
        {
          id: `cam-${building}-${floor}-05`,
          code: `B${bldgCode}_F${floorCode}_005_Camera_0095`,
          name: `${building}${floor}充电桩车位专区监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 63.8,
          y: 41.6,
          locationLabel: `${floor} 智能充电专区`,
          videoUrl: videoFeeds[4]
        },
        {
          id: `cam-${building}-${floor}-06`,
          code: `B${bldgCode}_F${floorCode}_006_Camera_0096`,
          name: `${building}${floor}东侧非机动车坡道监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 69.2,
          y: 70.0,
          locationLabel: `${floor} 坡道出入口`,
          videoUrl: videoFeeds[5]
        },
      ];
    }

    if (isGround) {
      // 1层 Ground Floor (Entrance Lobby, gates, delivery, courtyard)
      return [
        {
          id: `cam-${building}-${floor}-01`,
          code: `B${bldgCode}_F01_001_Camera_0010`,
          name: `${building}1层大堂正门主监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 25.4,
          y: 36.5,
          locationLabel: '1F 大堂正门门厅',
          videoUrl: videoFeeds[0]
        },
        {
          id: `cam-${building}-${floor}-02`,
          code: `B${bldgCode}_F01_002_Camera_0011`,
          name: `${building}1层西侧走廊过道监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 65.5,
          y: 38.8,
          locationLabel: '1F 西侧过道',
          videoUrl: videoFeeds[1]
        },
        {
          id: `cam-${building}-${floor}-03`,
          code: `B${bldgCode}_F01_003_Camera_0012`,
          name: `${building}1层中央电梯大厅监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 48.0,
          y: 44.2,
          locationLabel: '1F 核心电梯厅',
          videoUrl: videoFeeds[2]
        },
        {
          id: `cam-${building}-${floor}-04`,
          code: `B${bldgCode}_F01_004_Camera_0013`,
          name: `${building}1层西南安防值班室监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 28.5,
          y: 21.8,
          locationLabel: '1F 安防总控值班室',
          videoUrl: videoFeeds[3]
        },
        {
          id: `cam-${building}-${floor}-05`,
          code: `B${bldgCode}_F01_005_Camera_0014`,
          name: `${building}1层东侧消防通道监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 34.0,
          y: 72.5,
          locationLabel: '1F 东侧消防通道',
          videoUrl: videoFeeds[4]
        },
        {
          id: `cam-${building}-${floor}-06`,
          code: `B${bldgCode}_F01_006_Camera_0015`,
          name: `${building}1层南侧货运装卸口监控`,
          typeId: 'DTY_Aprow',
          status: '在线' as const,
          alarmText: '无告警',
          x: 62.0,
          y: 70.8,
          locationLabel: '1F 南侧货运平台',
          videoUrl: videoFeeds[5]
        },
      ];
    }

    // Upper Floors (2层 ~ 9层): Each floor has a completely distinct coordinate layout!
    // All cameras stay within indoor office & corridor bounds (y between 16% and 53%)
    const upperFloorConfigs: Record<number, {
      x: number;
      y: number;
      locationSuffix: string;
      nameSuffix: string;
      codeSuffix: string;
    }[]> = {
      2: [
        { x: 18.5, y: 48.2, locationSuffix: '2F 南区主入口', nameSuffix: '南区主入口摄像头', codeSuffix: '0035' },
        { x: 28.2, y: 38.5, locationSuffix: '2F 西侧走廊通道', nameSuffix: '西侧走廊通道摄像头', codeSuffix: '0036' },
        { x: 35.6, y: 21.0, locationSuffix: '2F 西北高管办', nameSuffix: '西北办公区摄像头', codeSuffix: '0037' },
        { x: 58.4, y: 26.2, locationSuffix: '2F 核心电梯大厅', nameSuffix: '核心电梯大厅摄像头', codeSuffix: '0038' },
        { x: 64.8, y: 16.5, locationSuffix: '2F 核心数据机房', nameSuffix: '东北数据机房摄像头', codeSuffix: '0039' },
        { x: 68.0, y: 42.5, locationSuffix: '2F 东侧通道', nameSuffix: '东侧通道摄像头', codeSuffix: '0040' },
      ],
      3: [
        { x: 60.5, y: 32.4, locationSuffix: '3F 开放式办公区', nameSuffix: '开放式办公区东摄像头', codeSuffix: '0041' },
        { x: 44.2, y: 46.8, locationSuffix: '3F 大会议室走廊', nameSuffix: '会议室门口摄像头', codeSuffix: '0042' },
        { x: 26.8, y: 41.5, locationSuffix: '3F 核心交换机房', nameSuffix: '机房配线间摄像头', codeSuffix: '0043' },
        { x: 52.0, y: 22.6, locationSuffix: '3F 电梯厅走道', nameSuffix: '电梯厅通道摄像头', codeSuffix: '0044' },
        { x: 38.5, y: 18.2, locationSuffix: '3F 北侧茶水休闲区', nameSuffix: '公共休闲区摄像头', codeSuffix: '0045' },
        { x: 22.0, y: 52.0, locationSuffix: '3F 西南财务室', nameSuffix: '财务审计区摄像头', codeSuffix: '0046' },
      ],
      4: [
        { x: 24.5, y: 36.2, locationSuffix: '4F 软件研发中心', nameSuffix: '软件研发区摄像头', codeSuffix: '0047' },
        { x: 42.0, y: 25.8, locationSuffix: '4F 架构测试实验室', nameSuffix: '系统测试区摄像头', codeSuffix: '0048' },
        { x: 50.5, y: 42.0, locationSuffix: '4F 中央协作岛', nameSuffix: '中央研讨区摄像头', codeSuffix: '0049' },
        { x: 63.2, y: 21.5, locationSuffix: '4F 电梯前室', nameSuffix: '电梯大厅前室摄像头', codeSuffix: '0050' },
        { x: 72.0, y: 36.0, locationSuffix: '4F 东侧洽谈室', nameSuffix: '客户洽谈区摄像头', codeSuffix: '0051' },
        { x: 33.5, y: 50.4, locationSuffix: '4F 弱电配线间', nameSuffix: '弱电井通道摄像头', codeSuffix: '0052' },
      ],
      5: [
        { x: 30.8, y: 44.5, locationSuffix: '5F 综合运营部', nameSuffix: '综合部走廊摄像头', codeSuffix: '0053' },
        { x: 48.0, y: 20.2, locationSuffix: '5F 总裁办前厅', nameSuffix: '总裁办门厅摄像头', codeSuffix: '0054' },
        { x: 66.5, y: 28.6, locationSuffix: '5F 贵宾接待室', nameSuffix: 'VIP接待厅摄像头', codeSuffix: '0055' },
        { x: 55.2, y: 38.4, locationSuffix: '5F 核心电梯厅', nameSuffix: '主电梯通道摄像头', codeSuffix: '0056' },
        { x: 21.5, y: 26.8, locationSuffix: '5F 档案保密室', nameSuffix: '机密档案区摄像头', codeSuffix: '0057' },
        { x: 71.5, y: 48.2, locationSuffix: '5F 东侧安全通道', nameSuffix: '东逃生通道摄像头', codeSuffix: '0058' },
      ],
      6: [
        { x: 26.2, y: 48.6, locationSuffix: '6F 创新孵化基地', nameSuffix: '孵化器工位区摄像头', codeSuffix: '0059' },
        { x: 39.5, y: 32.0, locationSuffix: '6F 算法实验中心', nameSuffix: '算法组核心机位摄像头', codeSuffix: '0060' },
        { x: 61.8, y: 18.5, locationSuffix: '6F 云计算调度室', nameSuffix: '算力节点监控摄像头', codeSuffix: '0061' },
        { x: 53.4, y: 44.2, locationSuffix: '6F 电梯大厅', nameSuffix: '电梯大厅摄像头', codeSuffix: '0062' },
        { x: 69.2, y: 38.0, locationSuffix: '6F 创客路演厅', nameSuffix: '路演大厅摄像头', codeSuffix: '0063' },
        { x: 34.0, y: 19.5, locationSuffix: '6F 消防楼梯口', nameSuffix: '西侧安全梯监控', codeSuffix: '0064' },
      ],
      7: [
        { x: 32.4, y: 24.2, locationSuffix: '7F 国际业务部', nameSuffix: '海外事业部走廊摄像头', codeSuffix: '0065' },
        { x: 22.8, y: 42.0, locationSuffix: '7F 法律风控中心', nameSuffix: '合规风控区摄像头', codeSuffix: '0066' },
        { x: 46.2, y: 48.5, locationSuffix: '7F 多功能报告厅', nameSuffix: '多功能厅前室摄像头', codeSuffix: '0067' },
        { x: 58.6, y: 24.8, locationSuffix: '7F 核心主电梯厅', nameSuffix: '电梯轿厢外廊摄像头', codeSuffix: '0068' },
        { x: 67.4, y: 21.0, locationSuffix: '7F 网络安全防卫室', nameSuffix: '网安实验室摄像头', codeSuffix: '0069' },
        { x: 73.0, y: 44.0, locationSuffix: '7F 东区培训教室', nameSuffix: '内训阶梯教室摄像头', codeSuffix: '0070' },
      ],
      8: [
        { x: 45.0, y: 19.8, locationSuffix: '8F 董事会会议中心', nameSuffix: '第一董事会议厅摄像头', codeSuffix: '0071' },
        { x: 62.4, y: 24.5, locationSuffix: '8F 高级商务洽谈室', nameSuffix: '高管会客室摄像头', codeSuffix: '0072' },
        { x: 36.8, y: 42.0, locationSuffix: '8F 行政核心走廊', nameSuffix: '行政连廊监控', codeSuffix: '0073' },
        { x: 56.0, y: 39.5, locationSuffix: '8F 观景电梯大厅', nameSuffix: '高区专梯厅摄像头', codeSuffix: '0074' },
        { x: 25.0, y: 28.4, locationSuffix: '8F 私密机房', nameSuffix: '核心数据备份间监控', codeSuffix: '0075' },
        { x: 28.5, y: 52.8, locationSuffix: '8F 西南空中连廊', nameSuffix: '空中连廊出入口监控', codeSuffix: '0076' },
      ],
      9: [
        { x: 51.2, y: 23.0, locationSuffix: '9F 顶层全景指挥中心', nameSuffix: '全域指挥大厅主监控', codeSuffix: '0077' },
        { x: 38.0, y: 36.5, locationSuffix: '9F 应急调度总台', nameSuffix: '应急响应控制台摄像头', codeSuffix: '0078' },
        { x: 64.5, y: 19.2, locationSuffix: '9F 卫星通讯机房', nameSuffix: '卫星链路机房监控', codeSuffix: '0079' },
        { x: 57.8, y: 43.0, locationSuffix: '9F 顶层贵宾电梯厅', nameSuffix: '专梯到达厅摄像头', codeSuffix: '0080' },
        { x: 24.2, y: 38.0, locationSuffix: '9F 核心决策室', nameSuffix: '决策会议室门厅监控', codeSuffix: '0081' },
        { x: 71.0, y: 32.5, locationSuffix: '9F 楼顶停机坪通道', nameSuffix: '停机坪登机梯道监控', codeSuffix: '0082' },
      ],
    };

    const floorConfig = upperFloorConfigs[floorNum] || upperFloorConfigs[2];
    const bldgShiftX = (bldgNum - 1) * 2.2;
    const bldgShiftY = (bldgNum - 1) * 1.5;

    return floorConfig.map((item, idx) => {
      const posX = Number(Math.max(16, Math.min(84, item.x + bldgShiftX)).toFixed(1));
      const posY = Number(Math.max(15, Math.min(54, item.y + bldgShiftY)).toFixed(1));

      return {
        id: `cam-${building}-${floor}-0${idx + 1}`,
        code: `B${bldgCode}_F${floorCode}_00${idx + 1}_Camera_${item.codeSuffix}`,
        name: `${building}${floor}${item.nameSuffix}`,
        typeId: 'DTY_Aprow',
        status: '在线' as const,
        alarmText: '无告警',
        x: posX,
        y: posY,
        locationLabel: item.locationSuffix,
        videoUrl: videoFeeds[idx % videoFeeds.length]
      };
    });
  };

  // Get current active list of cameras based on selected building and floor
  const currentCameras = getCamerasForFloor(activeBuilding, activeFloor);

  // Active camera detail object for the Right Panel
  const activeCamera = currentCameras.find(c => c.id === selectedCameraId) || currentCameras[0];

  const toggleSubsystemExpand = (subId: string) => {
    setExpandedSubsystems(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const toggleBuildingExpand = (bName: string) => {
    setExpandedBuildings(prev => ({ ...prev, [bName]: !prev[bName] }));
  };

  // 3D Architectural Floorplan images (using clean cropped 3D floor model without surrounding UI)
  const floor3dImages: Record<string, string> = {
    '1层': '/public/assets/aistudio/image_a2507f11.png',
    '2层': '/assets/images/upper_floor_plan.jpg',
    '3层': '/assets/images/upper_floor_plan.jpg',
    '4层': '/assets/images/upper_floor_plan.jpg',
    '5层': '/assets/images/upper_floor_plan.jpg',
    '6层': '/assets/images/upper_floor_plan.jpg',
    '7层': '/assets/images/upper_floor_plan.jpg',
    '8层': '/assets/images/upper_floor_plan.jpg',
    '9层': '/assets/images/upper_floor_plan.jpg',
    'B1': '/public/assets/aistudio/image_a2507f11.png',
    'B1停车区': '/public/assets/aistudio/image_a2507f11.png',
    'B2泵房': '/public/assets/aistudio/image_a2507f11.png',
  };

  const isUpperFloor = activeFloor !== '1层' && !activeFloor.startsWith('B');
  const currentFloor3dImage = isUpperFloor
    ? '/assets/images/upper_floor_plan.jpg'
    : (floor3dImages[activeFloor] || '/public/assets/aistudio/image_a2507f11.png');

  const isCameraView = activeSubsystem === '视频监控' && activeTertiaryMenu === '摄像机';

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#040b1a] text-slate-100 overflow-hidden select-none font-sans relative">
      
      {/* ===================== COLUMN 1: LEFT SECONDARY & TERTIARY MENU (二三级菜单栏) ===================== */}
      <aside className="w-52 bg-[#06122d] border-r border-[#133063] flex flex-col shrink-0 select-none">
        <div className="p-3 border-b border-[#133063] flex items-center justify-between bg-[#040e24]">
          <span className="text-xs font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>专业控制子系统</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">13个菜单</span>
        </div>

        {/* 13 Secondary Submenu Accordion Items */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {secondaryMenuItems.map((item) => {
            const isSubExpanded = expandedSubsystems[item.id];
            const isSubActive = activeSubsystem === item.id;

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Secondary Menu Header Button (二级菜单) */}
                <button
                  onClick={() => {
                    setActiveSubsystem(item.id);
                    if (item.tertiaryItems.length > 0 && !item.tertiaryItems.includes(activeTertiaryMenu)) {
                      setActiveTertiaryMenu(item.tertiaryItems[0]);
                      if (item.id === '冷热源') {
                        const match = coolingHeatingNodes.find(n => n.category === item.tertiaryItems[0]);
                        if (match) setSelectedCoolingSourceId(match.id);
                      }
                      if (item.id === '给排水') {
                        if (item.tertiaryItems[0] === '排水') {
                          setActiveFloor('B1');
                          setSelectedDrainageNodeId('dr-pump-02');
                        } else {
                          setSelectedWaterSupplyId('ws-pump-03');
                        }
                      }
                      if (item.id === '变配电') {
                        setSelectedPowerNodeId('pwr-feeder-01');
                      }
                      if (item.id === '电梯系统') {
                        if (item.tertiaryItems[0] === '斜梯') {
                          setSelectedEscalatorId('escl-01');
                        } else {
                          setSelectedElevatorId('elev-01');
                        }
                      }
                      if (item.id === '能耗' || item.id === '能耗计量') {
                        if (item.tertiaryItems[0] === '水表') {
                          setSelectedWaterMeterId('meter-water-01');
                        } else {
                          setSelectedElectricMeterId('meter-elec-01');
                        }
                      }
                      if (item.id === '信息网络') {
                        if (item.tertiaryItems[0] === '音乐广播') {
                          setSelectedSpeakerId('spk-01');
                        } else {
                          setSelectedSignageId('scr-01');
                        }
                      }
                    }
                    toggleSubsystemExpand(item.id);
                  }}
                  className={`w-full px-2.5 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-between border ${
                    isSubActive
                      ? 'bg-gradient-to-r from-[#0050b3] via-[#006d77] to-[#003a8c] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.5)]'
                      : 'bg-[#081b42]/70 hover:bg-[#0c265e] text-slate-300 hover:text-white border-[#15386f]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate tracking-wide">{item.label}</span>
                  </div>
                  {isSubExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </button>

                {/* Tertiary Menu Sub-Items (三级菜单: e.g. 摄像机 under 视频监控) */}
                {isSubExpanded && (
                  <div className="pl-6 space-y-0.5 border-l-2 border-[#163a76] ml-4 my-1">
                    {item.tertiaryItems.map((tert) => {
                      const isTertActive = isSubActive && activeTertiaryMenu === tert;
                      return (
                        <button
                          key={tert}
                          onClick={() => {
                            setActiveSubsystem(item.id);
                            setActiveTertiaryMenu(tert);
                            if (item.id === '冷热源') {
                              const match = coolingHeatingNodes.find(n => n.category === tert);
                              if (match) setSelectedCoolingSourceId(match.id);
                            }
                            if (item.id === '给排水') {
                              if (tert === '排水') {
                                setActiveFloor('B1');
                                setSelectedDrainageNodeId('dr-pump-02');
                              } else {
                                setSelectedWaterSupplyId('ws-pump-03');
                              }
                            }
                            if (item.id === '变配电') {
                              setSelectedPowerNodeId('pwr-feeder-01');
                            }
                            if (item.id === '电梯系统') {
                              if (tert === '斜梯') {
                                setSelectedEscalatorId('escl-01');
                              } else {
                                setSelectedElevatorId('elev-01');
                              }
                            }
                            if (item.id === '能耗' || item.id === '能耗计量') {
                              if (tert === '水表') {
                                setSelectedWaterMeterId('meter-water-01');
                              } else {
                                setSelectedElectricMeterId('meter-elec-01');
                              }
                            }
                            if (item.id === '信息网络') {
                              if (tert === '音乐广播') {
                                setSelectedSpeakerId('spk-01');
                              } else {
                                setSelectedSignageId('scr-01');
                              }
                            }
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold transition-all flex items-center justify-between ${
                            isTertActive
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black shadow-[0_0_10px_rgba(6,182,212,0.6)] border-l-4 border-cyan-300'
                              : 'text-slate-400 hover:text-white hover:bg-[#0c285e]'
                          }`}
                        >
                          <span className="truncate">{tert}</span>
                          {isTertActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />}
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

      {!(
        (activeSubsystem === '智慧照明' && (activeTertiaryMenu === '景观照明' || activeTertiaryMenu === '泛光照明')) ||
        activeSubsystem === '冷热源' ||
        (activeSubsystem === '给排水' && activeTertiaryMenu === '恒压供水') ||
        activeSubsystem === '变配电' ||
        activeTertiaryMenu === '周界告警'
      ) && (
        <aside className="w-28 bg-[#05112c] border-r border-[#133063] flex flex-col shrink-0 select-none">
          {activeSubsystem === '给排水' && activeTertiaryMenu === '排水' ? (
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <button
                onClick={() => setActiveFloor('B1')}
                className={`w-full px-3 py-2 rounded text-xs font-bold text-center transition-all ${
                  activeFloor === 'B1'
                    ? 'bg-[#0a275c] text-cyan-300 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#071d44]'
                }`}
              >
                B1
              </button>
            </div>
          ) : (
            <>
              {/* Accordion List for Buildings (1号楼, 2号楼, 3号楼, 地下车库) */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {buildingsTree.map((b) => {
                  const isBExpanded = expandedBuildings[b.name];
                  const isBActive = activeBuilding === b.name;

                  return (
                    <div key={b.name} className="space-y-0.5">
                      {/* Building Header */}
                      <button
                        onClick={() => {
                          setActiveBuilding(b.name);
                          toggleBuildingExpand(b.name);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded text-xs font-bold transition-all flex items-center justify-between ${
                          isBActive
                            ? 'bg-[#0a275c] text-cyan-300 border border-cyan-600/60'
                            : 'text-slate-300 hover:bg-[#091e4a]'
                        }`}
                      >
                        <span className="truncate">{b.name}</span>
                        {isBExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>

                      {/* Floors List (1层 ~ 9层) */}
                      {isBExpanded && (
                        <div className="pl-3 space-y-0.5 border-l border-[#1b4388] ml-2">
                          {b.floors.map((fl) => {
                            const isFlActive = isBActive && activeFloor === fl;
                            return (
                              <button
                                key={fl}
                                onClick={() => {
                                  setActiveBuilding(b.name);
                                  setActiveFloor(fl);
                                  const freshNodes = getFreshAirNodes(b.name, fl);
                                  if (freshNodes.length > 0) {
                                    setSelectedFauId(freshNodes[0].id);
                                  }
                                  const safNodes = getSupplyFanNodes(b.name, fl);
                                  if (safNodes.length > 0) {
                                    setSelectedSafId(safNodes[0].id);
                                  }
                                  const eanNodes = getExhaustFanNodes(b.name, fl);
                                  if (eanNodes.length > 0) {
                                    setSelectedEanId(eanNodes[0].id);
                                  }
                                  const acNodes = getAcNodes(b.name, fl);
                                  if (acNodes.length > 0) {
                                    setSelectedAcId(acNodes[0].id);
                                  }
                                  const lightNodes = getLightingNodes(b.name, fl, activeTertiaryMenu);
                                  if (lightNodes.length > 0) {
                                    setSelectedLightingId(lightNodes[0].id);
                                  }
                                  const envNodes = getEnvSensorNodes(b.name, fl);
                                  if (envNodes.length > 0) {
                                    setSelectedEnvSensorId(envNodes[0].id);
                                  }
                                  const vElevNodes = getVerticalElevatorNodes(b.name, fl);
                                  if (vElevNodes.length > 0) {
                                    setSelectedElevatorId(vElevNodes[0].id);
                                  }
                                  const esclNodes = getEscalatorNodes(b.name, fl);
                                  if (esclNodes.length > 0) {
                                    setSelectedEscalatorId(esclNodes[0].id);
                                  }
                                  const signageNodes = getFloorSignageHotspots(b.name, fl);
                                  if (signageNodes.length > 0) {
                                    setSelectedSignageId(signageNodes[0].id);
                                  }
                                  const bcastNodes = getFloorBroadcastHotspots(b.name, fl);
                                  if (bcastNodes.length > 0) {
                                    setSelectedBroadcastId(bcastNodes[0].id);
                                  }
                                }}
                                className={`w-full text-left px-2.5 py-1 rounded text-xs transition-all ${
                                  isFlActive
                                    ? 'bg-[#0e3678] text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-[#081c44]'
                                }`}
                              >
                                {fl}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </aside>
      )}

      {/* ===================== COLUMN 3: CENTER 3D FLOORPLAN / PERIMETER CANVAS ===================== */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#040b1a]">
        {/* Check if activeSubsystem is 防盗告警 */}
        {activeSubsystem === '防盗告警' ? (
          activeTertiaryMenu === '入侵告警' ? (
            /* ==================== 1. 入侵告警 VIEW (Matching image_a3509e1b.png) ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden">
              <div className="absolute top-4 left-6 z-30 flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsArmed(true);
                    setArmToast('全楼层防区：一键布防已就绪');
                    setTimeout(() => setArmToast(''), 3000);
                  }}
                  className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border cursor-pointer ${
                    isArmed
                      ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.6)]'
                      : 'bg-[#082252] hover:bg-[#0d3175] text-cyan-300 border-[#1c4d96]'
                  }`}
                >
                  <span>一键布防</span>
                </button>

                <button
                  onClick={() => {
                    setIsArmed(false);
                    setArmToast('全楼层防区：已撤防');
                    setTimeout(() => setArmToast(''), 3000);
                  }}
                  className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border cursor-pointer ${
                    !isArmed
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                      : 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                  }`}
                >
                  <span>一键撤防</span>
                </button>

                {armToast && (
                  <div className="px-3 py-1 rounded-lg bg-[#041a3a]/90 border border-cyan-400 text-cyan-200 text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
                    {armToast}
                  </div>
                )}
              </div>

              <div className="w-[840px] h-[540px] relative flex items-center justify-center">
                <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                  <img
                    src={currentFloor3dImage}
                    alt="三维楼层防区结构图"
                    className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                  />

                  {intrusionNodes.map((node) => {
                    const isSelected = activeIntrusion.id === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedIntrusionId(node.id)}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        title={`点击切换右侧防区信息: ${node.name}`}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          {isSelected ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                  <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
                                </div>
                              </div>
                              <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                {node.name}
                              </div>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                              <div className="w-3.5 h-3.5 border-2 border-white rounded-xs flex flex-col justify-between p-0.5">
                                <div className="w-full h-0.5 bg-white rounded-xs" />
                                <div className="w-full h-0.5 bg-white rounded-xs" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
          <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden">
            {/* Top Left Action Buttons: 一键布防 & 一键撤防 matching image_94a285ed.png */}
            <div className="absolute top-4 left-6 z-30 flex items-center gap-3">
              <button
                onClick={() => {
                  setIsArmed(true);
                  setArmToast('全园区周界安防：一键布防已就绪');
                  setTimeout(() => setArmToast(''), 3000);
                }}
                className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border cursor-pointer ${
                  isArmed
                    ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.6)]'
                    : 'bg-[#082252] hover:bg-[#0d3175] text-cyan-300 border-[#1c4d96]'
                }`}
              >
                <span>一键布防</span>
              </button>

              <button
                onClick={() => {
                  setIsArmed(false);
                  setArmToast('全园区周界安防：已撤防');
                  setTimeout(() => setArmToast(''), 3000);
                }}
                className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border cursor-pointer ${
                  !isArmed
                    ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                    : 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.4)]'
                }`}
              >
                <span>一键撤防</span>
              </button>

              {armToast && (
                <div className="px-3 py-1 rounded-lg bg-[#041a3a]/90 border border-cyan-400 text-cyan-200 text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
                  {armToast}
                </div>
              )}
            </div>

            {/* Main 3D Perimeter Scene Box */}
            <div className="w-[840px] h-[540px] relative flex items-center justify-center">
              <div className="relative w-[800px] h-[500px] flex items-center justify-center">
                {/* 3D Aerial Campus Perimeter Image matching user screenshot image_9a701660.png */}
                <img
                  src="/public/assets/aistudio/image_9a701660.png"
                  alt="周界告警 3D 园区全景图"
                  className="w-full h-full object-contain filter brightness-105 contrast-115 drop-shadow-[0_0_30px_rgba(6,182,212,0.25)]"
                />

                {/* Interactive Perimeter Alarm Pin Nodes matching image_94a285ed.png */}
                {perimeterNodes.map((prm) => {
                  const isSelected = activePerimeter.id === prm.id;
                  return (
                    <div
                      key={prm.id}
                      onClick={() => setSelectedPerimeterId(prm.id)}
                      style={{ left: `${prm.x}%`, top: `${prm.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      title={`点击选择: ${prm.name}`}
                    >
                      {isSelected ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                          <div className="relative flex items-center justify-center">
                            <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
                            </div>
                          </div>
                          <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                            {prm.name}
                          </div>
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                          <div className="w-3.5 h-3.5 border-2 border-white rounded-xs flex flex-col justify-between p-0.5">
                            <div className="w-full h-0.5 bg-white rounded-xs" />
                            <div className="w-full h-0.5 bg-white rounded-xs" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )) : activeSubsystem === '门禁系统' ? (
          /* ==================== 门禁系统 (人行道闸 image_479dc58d.png / 人脸门禁 image_379d9b86.png) ==================== */
          <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden">
            <div className="w-[840px] h-[540px] relative flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-scada-grid-access" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-scada-grid-access)" />
              </svg>

              <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                <img
                  src={currentFloor3dImage}
                  alt="三维门禁楼层结构图"
                  className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {/* Render nodes according to active tertiary sub-menu */}
                {activeTertiaryMenu === '人行道闸' ? (
                  currentTurnstileNodes.map((ts) => {
                    const isSelected = activeTurnstile.id === ts.id;
                    return (
                      <div
                        key={ts.id}
                        onClick={() => setSelectedTurnstileId(ts.id)}
                        style={{ left: `${ts.x}%`, top: `${ts.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        title={`点击切换右侧设备信息: ${ts.name}`}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          {isSelected ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                  <svg className="w-5 h-5 text-slate-950 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 5v14" />
                                    <path d="M20 5v14" />
                                    <path d="M8 8l4 4-4 4" />
                                    <path d="M16 8l-4 4 4 4" />
                                  </svg>
                                </div>
                              </div>
                              <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                {ts.name}
                              </div>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 5v14" />
                                <path d="M20 5v14" />
                                <path d="M8 8l4 4-4 4" />
                                <path d="M16 8l-4 4 4 4" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  currentFaceAccessNodes.map((door) => {
                    const isSelected = activeFaceDoor.id === door.id;
                    return (
                      <div
                        key={door.id}
                        onClick={() => setSelectedFaceDoorId(door.id)}
                        style={{ left: `${door.x}%`, top: `${door.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        title={`点击切换右侧设备信息: ${door.name}`}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          {isSelected ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                  <DoorOpen className="w-5 h-5 stroke-[2.5]" />
                                </div>
                              </div>
                              <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                {door.name}
                              </div>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                              <DoorOpen className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : activeSubsystem === '停车场系统' ? (
          /* ==================== 停车场系统 / 车位 VIEW (Matching screenshot image_8fa8ed3e.png) ==================== */
          <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden">
            {/* Top-Left HUD Overall Parking Statistics Overlay matching screenshot image_8fa8ed3e.png */}
            <div className="absolute top-6 left-8 z-30 space-y-2 font-mono text-xs text-slate-300 pointer-events-none drop-shadow-md">
              <div className="flex items-center gap-3">
                <span className="font-sans text-slate-300">全部车位数:</span>
                <span className="text-cyan-400 font-bold text-sm">{parkingData.totalSpaces}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-slate-300">空闲车位数:</span>
                <span className="text-cyan-400 font-bold text-sm">{parkingData.freeSpaces}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-slate-300">占用车位数:</span>
                <span className="text-cyan-400 font-bold text-sm">{parkingData.occupiedSpaces}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-slate-300">锁定车位数:</span>
                <span className="text-cyan-400 font-bold text-sm">{parkingData.lockedSpaces}</span>
              </div>
            </div>

            <div className="w-[840px] h-[540px] relative flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-scada-grid-parking" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-scada-grid-parking)" />
              </svg>

              <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                {/* 3D Parking / Floor Plan Image */}
                <img
                  src={currentFloor3dImage}
                  alt="三维车位平面结构图"
                  className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {/* Floating Parking Zone Card Badges (A区, B区, C区 matching screenshot image_8fa8ed3e.png) */}
                {/* A区 Badge */}
                <div className="absolute top-[18%] left-[27%] z-20 bg-[#041638]/90 border border-cyan-500/60 rounded-lg p-2.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-[11px] font-mono w-44 backdrop-blur-md">
                  <div className="font-bold text-cyan-200 border-b border-cyan-500/40 pb-1 mb-1.5 flex justify-between">
                    <span>A区</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">A区全部车位:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.A.total}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">空闲车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.A.free}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">占用车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.A.occupied}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">锁定车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.A.locked}</span>
                    </div>
                  </div>
                </div>

                {/* B区 Badge */}
                <div className="absolute bottom-[18%] left-[16%] z-20 bg-[#041638]/90 border border-cyan-500/60 rounded-lg p-2.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-[11px] font-mono w-44 backdrop-blur-md">
                  <div className="font-bold text-cyan-200 border-b border-cyan-500/40 pb-1 mb-1.5 flex justify-between">
                    <span>B区</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">B区全部车位:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.B.total}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">空闲车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.B.free}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">占用车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.B.occupied}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">锁定车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.B.locked}</span>
                    </div>
                  </div>
                </div>

                {/* C区 Badge */}
                <div className="absolute top-[28%] right-[22%] z-20 bg-[#041638]/90 border border-cyan-500/60 rounded-lg p-2.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-[11px] font-mono w-44 backdrop-blur-md">
                  <div className="font-bold text-cyan-200 border-b border-cyan-500/40 pb-1 mb-1.5 flex justify-between">
                    <span>C区</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">C区全部车位:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.C.total}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">空闲车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.C.free}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">占用车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.C.occupied}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">锁定车位总数:</span>
                      <span className="text-cyan-400 font-bold">{parkingData.zones.C.locked}</span>
                    </div>
                  </div>
                </div>

                {/* Gate Barrier Pin Nodes (Matching image_8fa8ed3e.png) */}
                {parkingData.gateNodes.map((gate) => {
                  const isSelected = activeParkingGate.id === gate.id;
                  return (
                    <div
                      key={gate.id}
                      onClick={() => setSelectedParkingGateId(gate.id)}
                      style={{ left: `${gate.x}%`, top: `${gate.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
                      title={`点击切换右侧设备信息: ${gate.name}`}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        {isSelected ? (
                          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                <svg className="w-5 h-5 text-slate-950 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor" opacity="0.3" />
                                  <path d="M6 12V6" />
                                  <path d="M6 8l14-4" />
                                  <circle cx="6" cy="14" r="1" fill="currentColor" />
                                </svg>
                              </div>
                            </div>
                            <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                              {gate.name}
                            </div>
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor" opacity="0.3" />
                              <path d="M6 12V6" />
                              <path d="M6 8l14-4" />
                              <circle cx="6" cy="14" r="1" fill="currentColor" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeSubsystem === '暖通空调' ? (
          /* ==================== 暖通空调 / 组合式空调 VIEW (Matching image_d8d5d2a5.png & image_62633fed.png) ==================== */
          <div className="flex-1 relative flex flex-col items-center justify-between p-2 overflow-hidden bg-[#040b1a]">
            
            {/* Center Area: Map View or Group Control View */}
            {acTabMode === 'map' ? (
              /* 设备地图 VIEW matching screenshot image_d8d5d2a5.png */
              <div className="flex-1 w-full relative flex items-center justify-center">
                <div className="w-[840px] h-[520px] relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="twin-scada-grid-hvac" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#twin-scada-grid-hvac)" />
                  </svg>

                  <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                    <img
                      src={currentFloor3dImage}
                      alt="组合式空调 3D 楼层结构图"
                      className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                    />

                    {activeTertiaryMenu === '排风机' ? (
                      currentExhaustFanNodes.map((ean) => {
                        const isSelected = activeEanNode.id === ean.id;
                        return (
                          <div
                            key={ean.id}
                            onClick={() => setSelectedEanId(ean.id)}
                            style={{ left: `${ean.x}%`, top: `${ean.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                            title={`点击切换右侧排风机信息: ${ean.name}`}
                          >
                            <div className="relative flex flex-col items-center justify-center">
                              {isSelected ? (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                                  <div className="relative flex items-center justify-center">
                                    <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                      <RotateCw className="w-5 h-5 stroke-[2.5] animate-spin" style={{ animationDuration: '6s' }} />
                                    </div>
                                  </div>
                                  <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                    {ean.name}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                                  <RotateCw className="w-3.5 h-3.5 stroke-[2.5]" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : activeTertiaryMenu === '送风机' ? (
                      currentSupplyFanNodes.map((saf) => {
                        const isSelected = activeSafNode.id === saf.id;
                        return (
                          <div
                            key={saf.id}
                            onClick={() => setSelectedSafId(saf.id)}
                            style={{ left: `${saf.x}%`, top: `${saf.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                            title={`点击切换右侧送风机信息: ${saf.name}`}
                          >
                            <div className="relative flex flex-col items-center justify-center">
                              {isSelected ? (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                                  <div className="relative flex items-center justify-center">
                                    <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                      <Wind className="w-5 h-5 stroke-[2.5]" />
                                    </div>
                                  </div>
                                  <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                    {saf.name}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                                  <Wind className="w-3.5 h-3.5 stroke-[2.5]" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : activeTertiaryMenu === '新风机' ? (
                      currentFreshAirNodes.map((fau) => {
                        const isSelected = activeFauNode.id === fau.id;
                        return (
                          <div
                            key={fau.id}
                            onClick={() => setSelectedFauId(fau.id)}
                            style={{ left: `${fau.x}%`, top: `${fau.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                            title={`点击切换右侧新风机信息: ${fau.name}`}
                          >
                            <div className="relative flex flex-col items-center justify-center">
                              {isSelected ? (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                                  <div className="relative flex items-center justify-center">
                                    <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                      <RotateCw className="w-5 h-5 stroke-[2.5] animate-spin" style={{ animationDuration: '6s' }} />
                                    </div>
                                  </div>
                                  <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                    {fau.name}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                                  <RotateCw className="w-3.5 h-3.5 stroke-[2.5]" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      currentAcNodes.map((ac) => {
                        const isSelected = activeAcNode.id === ac.id;
                        return (
                          <div
                            key={ac.id}
                            onClick={() => setSelectedAcId(ac.id)}
                            style={{ left: `${ac.x}%`, top: `${ac.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                            title={`点击切换右侧空调信息: ${ac.name}`}
                          >
                            <div className="relative flex flex-col items-center justify-center">
                              {isSelected ? (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                                  <div className="relative flex items-center justify-center">
                                    <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                      <Wind className="w-5 h-5 stroke-[2.5]" />
                                    </div>
                                  </div>
                                  <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                    {ac.name}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                                  <Wind className="w-3.5 h-3.5 stroke-[2.5]" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* 设备群控 VIEW matching screenshot image_62633fed.png */
              <div className="flex-1 w-full max-w-6xl p-4 flex items-center justify-center overflow-y-auto">
                <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
                  {groupControlCards.map((card, idx) => (
                    <div
                      key={card.id}
                      className="bg-[#031536]/80 border border-cyan-500/50 rounded-xl p-5 shadow-[0_0_25px_rgba(6,182,212,0.2)] flex flex-col justify-between backdrop-blur-md"
                    >
                      <div className="space-y-4">
                        <h3 className="text-center text-cyan-300 font-bold text-sm tracking-wider pb-2 border-b border-cyan-500/40">
                          {card.title}
                        </h3>

                        {/* 启停控制 */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-sans font-semibold">启停控制</span>
                          <div className="flex items-center gap-1.5 p-0.5 bg-[#020b1e] rounded border border-[#133972]">
                            <button
                              onClick={() => {
                                setGroupControlCards(prev => prev.map((c, i) => i === idx ? { ...c, power: '开启' } : c));
                                setArmToast(`${card.title}：全局开启已指令下发`);
                                setTimeout(() => setArmToast(''), 3000);
                              }}
                              className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                card.power === '开启'
                                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              开启
                            </button>
                            <button
                              onClick={() => {
                                setGroupControlCards(prev => prev.map((c, i) => i === idx ? { ...c, power: '关闭' } : c));
                                setArmToast(`${card.title}：全局关闭已指令下发`);
                                setTimeout(() => setArmToast(''), 3000);
                              }}
                              className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                card.power === '关闭'
                                  ? 'bg-cyan-600 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              关闭
                            </button>
                          </div>
                        </div>

                        {/* CO2浓度设定 */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between text-slate-300 font-semibold">
                            <span>CO2浓度设定</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                              <button
                                onClick={() => {
                                  const cur = parseFloat(card.co2) || 0;
                                  const next = Math.max(0, cur - 10).toFixed(2);
                                  setGroupControlCards(prev => prev.map((c, i) => i === idx ? { ...c, co2: next } : c));
                                }}
                                className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-[#072458]"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-bold text-xs">{card.co2}</span>
                              <button
                                onClick={() => {
                                  const cur = parseFloat(card.co2) || 0;
                                  const next = (cur + 10).toFixed(2);
                                  setGroupControlCards(prev => prev.map((c, i) => i === idx ? { ...c, co2: next } : c));
                                }}
                                className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-[#072458]"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                setArmToast(`${card.title} CO2浓度已设定为 ${card.co2}`);
                                setTimeout(() => setArmToast(''), 3000);
                              }}
                              className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                            >
                              设定
                            </button>
                          </div>
                        </div>

                        {/* 回风温度设定 */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between text-slate-300 font-semibold">
                            <span>回风温度设定</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                              <button
                                onClick={() => {
                                  const cur = parseFloat(card.returnTemp) || 0;
                                  const next = Math.max(0, cur - 0.5).toFixed(2);
                                  setGroupControlCards(prev => prev.map((c, i) => i === idx ? { ...c, returnTemp: next } : c));
                                }}
                                className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-[#072458]"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-bold text-xs">{card.returnTemp}</span>
                              <button
                                onClick={() => {
                                  const cur = parseFloat(card.returnTemp) || 0;
                                  const next = (cur + 0.5).toFixed(2);
                                  setGroupControlCards(prev => prev.map((c, i) => i === idx ? { ...c, returnTemp: next } : c));
                                }}
                                className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-[#072458]"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                setArmToast(`${card.title} 回风温度已设定为 ${card.returnTemp}`);
                                setTimeout(() => setArmToast(''), 3000);
                              }}
                              className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                            >
                              设定
                            </button>
                          </div>
                        </div>

                        {/* 送风温度设定 */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between text-slate-300 font-semibold">
                            <span>送风温度设定</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                              <button
                                onClick={() => {
                                  const cur = parseFloat(card.supplyTemp) || 0;
                                  const next = Math.max(0, cur - 0.5).toFixed(2);
                                  setGroupControlCards(prev => prev.map((c, i) => i === idx ? { ...c, supplyTemp: next } : c));
                                }}
                                className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-[#072458]"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-bold text-xs">{card.supplyTemp}</span>
                              <button
                                onClick={() => {
                                  const cur = parseFloat(card.supplyTemp) || 0;
                                  const next = (cur + 0.5).toFixed(2);
                                  setGroupControlCards(prev => prev.map((c, i) => i === idx ? { ...c, supplyTemp: next } : c));
                                }}
                                className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-[#072458]"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                setArmToast(`${card.title} 送风温度已设定为 ${card.supplyTemp}`);
                                setTimeout(() => setArmToast(''), 3000);
                              }}
                              className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                            >
                              设定
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Button: 一键群控 */}
                      <div className="pt-6">
                        <button
                          onClick={() => {
                            setArmToast(`${card.title}：一键群控参数已同步生效`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className="w-full py-2 bg-[#062454] hover:bg-[#0a3374] text-cyan-300 hover:text-white border border-cyan-500/70 rounded text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
                        >
                          一键群控
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Center Nav Pill Buttons: 设备地图 & 设备群控 matching image_d8d5d2a5.png & image_62633fed.png */}
            <div className="py-3 flex items-center justify-center gap-4 z-30">
              <button
                onClick={() => setAcTabMode('map')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  acTabMode === 'map'
                    ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.6)]'
                    : 'bg-[#061e47] hover:bg-[#0a2b66] text-cyan-300 border-[#143d7c]'
                }`}
              >
                设备地图
              </button>
              <button
                onClick={() => setAcTabMode('group')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  acTabMode === 'group'
                    ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.6)]'
                    : 'bg-[#061e47] hover:bg-[#0a2b66] text-cyan-300 border-[#143d7c]'
                }`}
              >
                设备群控
              </button>
            </div>
          </div>
        ) : activeSubsystem === '智慧照明' ? (
          /* ==================== 智慧照明 / 室内照明 / 景观照明 / 泛光照明 VIEW ==================== */
          activeTertiaryMenu === '景观照明' ? (
            /* 景观照明 CAMPUS 3D MAP matching image_aa730709.png */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <div className="w-[880px] h-[540px] relative flex items-center justify-center">
                <img
                  src="/assets/images/landscape_lighting_campus.png"
                  alt="室外景观照明 3D 园区全景图"
                  className="w-full h-full object-contain filter brightness-105 contrast-115 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {/* Interactive landscape lighting pin nodes directly over the map */}
                {landscapeLightingNodes.map((node) => {
                  const isSelected = activeLandscapeNode.id === node.id;
                  const curState = landscapeSwitchStates[node.id] || node.defaultState;
                  const isOn = curState === '开';

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedLandscapeId(node.id)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      title={`点击选择: ${node.name} (当前回路状态: ${curState})`}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        {isSelected ? (
                          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-10 h-10 rounded-full bg-cyan-400/50 animate-ping" />
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                <Sun className="w-4.5 h-4.5 stroke-[2.5]" />
                              </div>
                            </div>
                            <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                              {node.name}
                            </div>
                          </div>
                        ) : (
                          <div className={`transition-all group-hover:scale-125 ${
                            isOn 
                              ? 'w-5 h-5 rounded-full bg-amber-400 border border-white shadow-[0_0_12px_#f59e0b] flex items-center justify-center'
                              : 'w-4 h-4 rounded-full bg-[#0a0f1d] border border-slate-500/80 shadow-sm flex items-center justify-center'
                          }`}>
                            <Sun className={`w-2.5 h-2.5 ${isOn ? 'text-slate-950 stroke-[3]' : 'text-slate-400'}`} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTertiaryMenu === '泛光照明' ? (
            /* 泛光照明 CAMPUS 3D MAP matching image_86cadfa9.png */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <div className="w-[880px] h-[540px] relative flex items-center justify-center">
                <img
                  src="/assets/images/flood_lighting_campus.png"
                  alt="室外泛光照明 3D 园区全景图"
                  className="w-full h-full object-contain filter brightness-105 contrast-115 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {/* Interactive flood lighting pin nodes directly over the map */}
                {floodLightingNodes.map((node) => {
                  const isSelected = activeFloodNode.id === node.id;
                  const curStatus = floodNightStates[node.id] !== undefined ? floodNightStates[node.id] : node.defaultNightStatus;
                  const isOn = curStatus === 1;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedFloodId(node.id)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      title={`点击选择: ${node.name} (${node.desc})`}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        {isSelected ? (
                          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-10 h-10 rounded-full bg-yellow-400/50 animate-ping" />
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#eab308] flex items-center justify-center">
                                <Sun className="w-4.5 h-4.5 stroke-[2.5]" />
                              </div>
                            </div>
                            <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#ffd166] text-amber-200 font-bold text-[11px] shadow-[0_0_12px_rgba(255,209,102,0.7)] whitespace-nowrap">
                              {node.name}
                            </div>
                          </div>
                        ) : (
                          <div className={`transition-all group-hover:scale-125 ${
                            isOn 
                              ? 'w-5 h-5 rounded-full bg-amber-400 border border-white shadow-[0_0_12px_#f59e0b] flex items-center justify-center'
                              : 'w-4 h-4 rounded-full bg-[#0a0f1d] border border-slate-500/80 shadow-sm flex items-center justify-center'
                          }`}>
                            <Sun className={`w-2.5 h-2.5 ${isOn ? 'text-slate-950 stroke-[3]' : 'text-slate-400'}`} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 室内照明 VIEW (Matching image_afcdb9b0.png) */
            <div className="flex-1 relative flex flex-col items-center justify-between p-2 overflow-hidden bg-[#040b1a]">
              <div className="flex-1 w-full relative flex items-center justify-center">
                <div className="w-[840px] h-[520px] relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="twin-scada-grid-lighting" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#twin-scada-grid-lighting)" />
                  </svg>

                  <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                    <img
                      src={currentFloor3dImage}
                      alt="智慧照明 3D 楼层平面图"
                      className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                    />

                    {currentLightingNodes.map((lt) => {
                      const isSelected = activeLightingNode.id === lt.id;
                      return (
                        <div
                          key={lt.id}
                          onClick={() => setSelectedLightingId(lt.id)}
                          style={{ left: `${lt.x}%`, top: `${lt.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                          title={`点击切换右侧照明设备信息: ${lt.name}`}
                        >
                          <div className="relative flex flex-col items-center justify-center">
                            {isSelected ? (
                              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                                <div className="relative flex items-center justify-center">
                                  <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                    <Sun className="w-5 h-5 stroke-[2.5]" />
                                  </div>
                                </div>
                                <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                  {lt.name}
                                </div>
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                                <Sun className="w-3.5 h-3.5 stroke-[2.5]" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Center Nav Pill Buttons: 设备地图 & 设备群控 matching image_afcdb9b0.png */}
              <div className="py-3 flex items-center justify-center gap-4 z-30">
                <button
                  onClick={() => setAcTabMode('map')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    acTabMode === 'map'
                      ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.6)]'
                      : 'bg-[#061e47] hover:bg-[#0a2b66] text-cyan-300 border-[#143d7c]'
                  }`}
                >
                  设备地图
                </button>
                <button
                  onClick={() => setAcTabMode('group')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    acTabMode === 'group'
                      ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.6)]'
                      : 'bg-[#061e47] hover:bg-[#0a2b66] text-cyan-300 border-[#143d7c]'
                  }`}
                >
                  设备群控
                </button>
              </div>
            </div>
          )
        ) : activeSubsystem === '环境监测' ? (
          /* ==================== 环境监测 / 环境传感器 VIEW matching image_9673d34c.png ==================== */
          <div className="flex-1 relative flex flex-col items-center justify-between p-2 overflow-hidden bg-[#040b1a]">
            {acTabMode === 'map' ? (
              <div className="flex-1 w-[840px] h-[520px] relative flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="twin-scada-grid-env" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#twin-scada-grid-env)" />
                </svg>

                <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                  <img
                    src={currentFloor3dImage}
                    alt={`${activeBuilding}${activeFloor}环境传感器三维模型图`}
                    className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                  />

                  {currentEnvSensorNodes.map((node) => {
                    const isSelected = activeEnvNode.id === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedEnvSensorId(node.id)}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        title={`点击切换右侧环境传感器信息: ${node.name}`}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          {isSelected ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
                                  <Fan className="w-5 h-5 stroke-[2.5]" />
                                </div>
                              </div>
                              <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                {node.name}
                              </div>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_12px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                              <Fan className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* 环境监测 设备群控 VIEW */
              <div className="flex-1 w-full max-w-5xl flex flex-col justify-center items-center p-6 overflow-y-auto">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                  {groupControlCards.map((card, idx) => (
                    <div
                      key={card.id}
                      className="rounded-xl border border-cyan-500/40 bg-gradient-to-b from-[#061e47]/90 to-[#020d26]/95 p-5 shadow-[0_0_25px_rgba(6,182,212,0.15)] space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-[#133063] pb-3">
                        <span className="text-sm font-bold text-cyan-200 tracking-wide">{card.title.replace('组合式空调', '环境传感器')}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono">
                          监测中
                        </span>
                      </div>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>目标CO2上限:</span>
                          <span className="font-mono text-cyan-300 font-bold">1000 ppm</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>PM2.5阈值控制:</span>
                          <span className="font-mono text-cyan-300 font-bold">75 μg/m³</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>温湿度联动:</span>
                          <span className="font-mono text-emerald-400 font-bold">自动</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setArmToast(`${card.title.replace('组合式空调', '环境传感器')}：群控预设已下发`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="w-full py-2 bg-[#062454] hover:bg-[#0a3374] text-cyan-300 hover:text-white border border-cyan-500/70 rounded text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer mt-4"
                      >
                        一键设定
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Center Nav Pill Buttons: 设备地图 & 设备群控 matching image_9673d34c.png */}
            <div className="py-3 flex items-center justify-center gap-4 z-30">
              <button
                onClick={() => setAcTabMode('map')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  acTabMode === 'map'
                    ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.6)]'
                    : 'bg-[#061e47] hover:bg-[#0a2b66] text-cyan-300 border-[#143d7c]'
                }`}
              >
                设备地图
              </button>
              <button
                onClick={() => setAcTabMode('group')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  acTabMode === 'group'
                    ? 'bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white border-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.6)]'
                    : 'bg-[#061e47] hover:bg-[#0a2b66] text-cyan-300 border-[#143d7c]'
                }`}
              >
                设备群控
              </button>
            </div>
          </div>
        ) : activeSubsystem === '冷热源' ? (
          activeTertiaryMenu === '热源' ? (
            /* ==================== 热源 3D CENTRAL BOILER PLANT VIEW matching image_083a1294.png ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <div className="w-[960px] h-[640px] relative flex items-center justify-center">
                <img
                  src="/assets/images/heating_plant_3d.png"
                  alt="热源锅炉房三维结构图"
                  className="w-full h-full object-contain filter brightness-105 contrast-115 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {/* Interactive equipment hotspots on Heat Source 3D diagram */}
                {heatingSourceNodes.map((node) => {
                  const isSelected = activeHeatNode.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedHeatSourceId(node.id)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      title={`点击切换热源设备: ${node.label} (${node.name})`}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        {isSelected ? (
                          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#f59e0b] flex items-center justify-center font-bold text-xs">
                                <Flame className="w-4 h-4 stroke-[2.5] text-slate-950" />
                              </div>
                            </div>
                            <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                              {node.label}
                            </div>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 rounded-md bg-[#041638]/90 border border-cyan-400 text-cyan-200 text-[10px] font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)] flex items-center gap-1 transition-all group-hover:scale-125">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span>{node.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ==================== 冷源 3D CENTRAL CHILLER PLANT VIEW matching image_4f38e8f3.png ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <div className="w-[960px] h-[640px] relative flex items-center justify-center">
                <img
                  src="/assets/images/cooling_plant_3d.png"
                  alt="冷源冷水机房三维结构图"
                  className="w-full h-full object-contain filter brightness-105 contrast-115 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {/* Interactive equipment hotspots on Cooling Source 3D diagram */}
                {coolingHeatingNodes.map((node) => {
                  const isSelected = activeCoolingNode.id === node.id;
                  const isMatchingCategory = activeTertiaryMenu === node.category;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedCoolingSourceId(node.id)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      title={`点击切换冷源设备: ${node.label} (${node.name})`}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        {isSelected ? (
                          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center font-bold text-xs">
                                <Flame className="w-4 h-4 stroke-[2.5]" />
                              </div>
                            </div>
                            <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                              {node.label}
                            </div>
                          </div>
                        ) : (
                          <div className={`transition-all group-hover:scale-125 ${
                            isMatchingCategory
                              ? 'px-2 py-0.5 rounded-md bg-[#041638]/90 border border-cyan-400 text-cyan-200 text-[10px] font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)] flex items-center gap-1'
                              : 'px-1.5 py-0.5 rounded bg-[#08152e]/80 border border-slate-600 text-slate-400 text-[9.5px]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isMatchingCategory ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                            <span>{node.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : activeSubsystem === '给排水' ? (
          activeTertiaryMenu === '恒压供水' ? (
            /* ==================== 恒压供水 SCADA SCHEMATIC VIEW matching image_d9c0c70b.png ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <div className="w-[960px] h-[640px] relative flex items-center justify-center">
                <img
                  src="/assets/images/water_supply_constant_pressure.png"
                  alt="恒压供水系统运行流程图"
                  className="w-full h-full object-contain filter brightness-105 contrast-115 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {/* Interactive equipment hotspots on water supply diagram */}
                {waterSupplyNodes.map((node) => {
                  const isSelected = activeWaterNode.id === node.id;
                  const isMatchingCategory = activeTertiaryMenu === node.category;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedWaterSupplyId(node.id)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      title={`点击切换给排水设备: ${node.label} (${node.name})`}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        {isSelected ? (
                          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_20px_#22d3ee] flex items-center justify-center font-bold text-xs">
                                <Droplets className="w-4 h-4 stroke-[2.5]" />
                              </div>
                            </div>
                            <div className="mt-1 px-2.5 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[11px] shadow-[0_0_12px_rgba(0,210,255,0.7)] whitespace-nowrap">
                              {node.label}
                            </div>
                          </div>
                        ) : (
                          <div className={`transition-all group-hover:scale-125 ${
                            isMatchingCategory
                              ? 'px-2 py-0.5 rounded-md bg-[#041638]/90 border border-cyan-400 text-cyan-200 text-[10px] font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)] flex items-center gap-1'
                              : 'px-1.5 py-0.5 rounded bg-[#08152e]/80 border border-slate-600 text-slate-400 text-[9.5px]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isMatchingCategory ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                            <span>{node.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ==================== 排水 3D FLOOR VIEW matching image_690af10a.png ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              {/* Subtle SCADA grid background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-drainage-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-drainage-grid)" />
              </svg>

              <div className="w-[840px] h-[540px] relative flex items-center justify-center">
                <img
                  src="/public/assets/aistudio/image_a2507f11.png"
                  alt="地下1层三维排水结构图"
                  className="w-full h-full object-contain filter brightness-105 contrast-125 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {/* Interactive Drainage Hotspots (matching image_690af10a.png exact icons and locations) */}
                {drainageNodes.map((node) => {
                  const isSelected = activeDrainageNode.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedDrainageNodeId(node.id)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      title={`点击切换排水设备: ${node.name}`}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        {node.type === 'pump' ? (
                          /* Circular Blue Pump Icon with White 'T' Glyphs matching image_690af10a.png */
                          <div className={`relative flex items-center justify-center transition-all ${isSelected ? 'scale-125' : 'group-hover:scale-115'}`}>
                            {isSelected && (
                              <span className="absolute -inset-2 rounded-full border-2 border-cyan-300 animate-ping opacity-80" />
                            )}
                            <div className={`w-7 h-7 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] border-2 ${
                              isSelected ? 'border-white shadow-[0_0_18px_#22d3ee]' : 'border-cyan-200/90 shadow-[0_0_10px_rgba(56,189,248,0.7)]'
                            } flex items-center justify-center text-white`}>
                              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                                <path d="M5 6a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 0 3H13.5v11.5a1.5 1.5 0 0 1-3 0V7.5H6.5A1.5 1.5 0 0 1 5 6z" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          /* Rounded Square Blue Sump Pit Icon with Basin Glyphs matching image_690af10a.png */
                          <div className={`relative flex items-center justify-center transition-all ${isSelected ? 'scale-125' : 'group-hover:scale-115'}`}>
                            {isSelected && (
                              <span className="absolute -inset-2 rounded-lg border-2 border-cyan-300 animate-ping opacity-80" />
                            )}
                            <div className={`w-7 h-6 rounded-md bg-gradient-to-tr from-[#0284c7] via-[#0284c7] to-[#0ea5e9] border-2 ${
                              isSelected ? 'border-white shadow-[0_0_18px_#22d3ee]' : 'border-cyan-200/90 shadow-[0_0_10px_rgba(14,165,233,0.7)]'
                            } flex items-center justify-center text-white`}>
                              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
                                <path d="M4 9v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                                <path d="M7 14h10" />
                                <path d="M3 8h18" strokeWidth="2.5" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : activeSubsystem === '变配电' ? (
          /* ==================== 变配电 ELECTRICAL DISTRIBUTION SCHEMATIC VIEW matching image_22b861ef.png ==================== */
          <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
            {/* Subtle SCADA grid background */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="twin-power-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#twin-power-grid)" />
            </svg>

            <div className="w-[966px] h-[726px] max-w-full max-h-full relative flex items-center justify-center">
              <img
                src="/assets/images/power_distribution_scada.png"
                alt="变配电一次系统接线图"
                className="w-full h-full object-contain filter brightness-105 contrast-115 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
              />

              {/* Interactive circuit nodes and hotspots */}
              {powerDistributionNodes.map((node) => {
                const isSelected = activePowerNode.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedPowerNodeId(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                    title={`点击切换回路信息: ${node.label} (${node.name})`}
                  >
                    <div className="relative flex items-center justify-center">
                      {isSelected && (
                        <span className="absolute w-10 h-10 rounded-full border-2 border-emerald-400 animate-ping opacity-80" />
                      )}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'ring-2 ring-emerald-300 ring-offset-2 ring-offset-[#040b1a] scale-120 shadow-[0_0_18px_rgba(16,185,129,0.8)] bg-emerald-500/30'
                          : 'opacity-0 group-hover:opacity-75 bg-emerald-500/20 border border-emerald-400/60'
                      }`}>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeSubsystem === '电梯系统' ? (
          activeTertiaryMenu === '斜梯' ? (
            /* ==================== 斜梯 (扶梯) SCADA MONITORING CANVAS ==================== */
            <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-[#040b1a]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-escl-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-escl-grid)" />
              </svg>

              <div className="w-[960px] max-w-full relative flex flex-col items-center gap-6 z-10">
                {/* Top System Summary Bar */}
                <div className="w-full flex items-center justify-between px-5 py-2.5 rounded-xl bg-[#06173a]/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-sm font-bold text-cyan-200 tracking-wider">自动扶梯/斜梯群控实时监测系统</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">3台全部运行中</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                    <span>总客流量: <strong className="text-cyan-300 font-bold">3,320 人/时</strong></span>
                    <span>额定运行速度: <strong className="text-cyan-300 font-bold">0.65 m/s</strong></span>
                    <span>倾斜角: <strong className="text-cyan-300 font-bold">30°</strong></span>
                  </div>
                </div>

                {/* 3 Escalator Station Bays */}
                <div className="w-full grid grid-cols-3 gap-5">
                  {escalatorNodes.map((escl) => {
                    const isSelected = activeEscalator.id === escl.id;
                    const isRunning = escalatorRunStates[escl.id] ?? true;
                    const currentDir = escalatorDirStates[escl.id] ?? escl.direction;

                    return (
                      <div
                        key={escl.id}
                        onClick={() => setSelectedEscalatorId(escl.id)}
                        className={`relative rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between border ${
                          isSelected
                            ? 'bg-[#092352]/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.45)] ring-2 ring-cyan-400/50'
                            : 'bg-[#071738]/70 border-[#153b75] hover:border-cyan-500/60 hover:bg-[#0a2048]'
                        }`}
                      >
                        {/* Bay Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#14396e]">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_#22d3ee]' : 'bg-[#0d2d66] text-cyan-300'
                            }`}>
                              {escl.id.replace('escl-0', '')}#
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">{escl.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{escl.location}</div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            isRunning
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}>
                            {isRunning ? currentDir : '已停止'}
                          </span>
                        </div>

                        {/* Visual SVG Escalator Tracing Schematic */}
                        <div className="py-5 flex items-center justify-center relative">
                          <svg viewBox="0 0 240 130" className="w-full h-32">
                            <path
                              d="M 20 100 L 70 100 L 170 30 L 220 30"
                              fill="none"
                              stroke={isSelected ? "#00f0ff" : "#1a4682"}
                              strokeWidth="8"
                              strokeLinecap="round"
                              className="transition-colors duration-300"
                            />
                            <path
                              d="M 25 96 L 72 96 L 168 26 L 215 26"
                              fill="none"
                              stroke={isRunning ? (currentDir === '上行' ? "#10b981" : "#06b6d4") : "#475569"}
                              strokeWidth="3"
                              strokeDasharray="6,4"
                              strokeLinecap="round"
                            />
                            <path
                              d="M 20 85 L 68 85 L 168 15 L 220 15"
                              fill="none"
                              stroke={isSelected ? "#38bdf8" : "#29589a"}
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            <circle cx="20" cy="100" r="4" fill="#10b981" />
                            <circle cx="220" cy="30" r="4" fill="#10b981" />
                            <g className="fill-cyan-300 font-mono text-[9px] font-bold">
                              <text x="110" y="65" transform="rotate(-35, 110, 65)">
                                {isRunning ? (currentDir === '上行' ? '▲ ▲ ▲' : '▼ ▼ ▼') : '■ ■ ■'}
                              </text>
                            </g>
                          </svg>

                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                            {isRunning ? escl.speed : '0.00 m/s'}
                          </div>
                        </div>

                        {/* Bay Telemetry Grid */}
                        <div className="pt-2 border-t border-[#14396e] grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="bg-[#051433]/70 p-2 rounded border border-[#14396e]/60">
                            <div className="text-slate-400 text-[10px]">小时客流</div>
                            <div className="text-white font-bold">{escl.passengerCount}</div>
                          </div>
                          <div className="bg-[#051433]/70 p-2 rounded border border-[#14396e]/60">
                            <div className="text-slate-400 text-[10px]">电机温度</div>
                            <div className="text-emerald-400 font-bold">{escl.motorTemp}</div>
                          </div>
                          <div className="bg-[#051433]/70 p-2 rounded border border-[#14396e]/60">
                            <div className="text-slate-400 text-[10px]">梳齿板保护</div>
                            <div className="text-cyan-300 font-bold">{escl.combPlateSensor}</div>
                          </div>
                          <div className="bg-[#051433]/70 p-2 rounded border border-[#14396e]/60">
                            <div className="text-slate-400 text-[10px]">急停回路</div>
                            <div className="text-emerald-300 font-bold">{escl.eStopButton}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ==================== 直梯 (垂直客/货梯) 4-SHAFT ELEVATION MATRIX ==================== */
            <div className="flex-1 relative flex items-center justify-center p-3 overflow-hidden bg-[#040b1a]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-elev-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-elev-grid)" />
              </svg>

              <div className="w-[960px] max-w-full h-[580px] relative flex flex-col justify-between z-10">
                {/* Header Strip */}
                <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#06173a]/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <div className="flex items-center gap-2.5">
                    <ArrowUpDown className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-200 tracking-wider">直梯井道与轿厢工况群控监测矩阵 (B1 ~ 9F)</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">4梯联动就绪</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                    <span>平均等梯时间: <strong className="text-cyan-300 font-bold">14.2 秒</strong></span>
                    <span>满载率: <strong className="text-cyan-300 font-bold">42.5%</strong></span>
                  </div>
                </div>

                {/* Vertical Shaft Cross-section Matrix */}
                <div className="flex-1 my-3 flex items-stretch gap-4 bg-[#05112c]/80 rounded-xl border border-[#133568] p-4 relative overflow-hidden">
                  {/* Left Floor Ruler Axis (9F down to 1F, B1) */}
                  <div className="w-12 flex flex-col justify-between border-r border-[#193d74] pr-2 select-none">
                    {['9F', '8F', '7F', '6F', '5F', '4F', '3F', '2F', '1F', 'B1'].map(floor => (
                      <div key={floor} className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
                        <span>{floor}</span>
                        <div className="w-2 h-0.5 bg-[#193d74]" />
                      </div>
                    ))}
                  </div>

                  {/* 4 Elevator Shaft Columns */}
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    {verticalElevatorNodes.map((elev) => {
                      const isSelected = activeElevator.id === elev.id;
                      const floorIndexMap: Record<string, number> = {
                        '9F': 88, '8F': 78, '7F': 68, '6F': 58, '5F': 48,
                        '4F': 38, '3F': 28, '2F': 18, '1F': 8, 'B1': 2
                      };
                      const carBottomPercent = floorIndexMap[elev.currentFloor] ?? 40;
                      const isDoorOpen = elevatorDoorStates[elev.id] ?? (elev.doorStatus === '开门');

                      return (
                        <div
                          key={elev.id}
                          onClick={() => setSelectedElevatorId(elev.id)}
                          className={`relative rounded-xl border transition-all cursor-pointer flex flex-col justify-between p-2.5 ${
                            isSelected
                              ? 'bg-[#082250]/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400/50'
                              : 'bg-[#05173b]/50 border-[#153a70] hover:border-cyan-500/50 hover:bg-[#071c47]'
                          }`}
                        >
                          {/* Shaft Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-[#14386e]">
                            <div className="truncate">
                              <div className="text-xs font-bold text-white group-hover:text-cyan-200 truncate">{elev.name}</div>
                              <div className="text-[10px] text-cyan-400 font-mono">{elev.shaft}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-mono font-black text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40">
                                {elev.currentFloor}
                              </div>
                            </div>
                          </div>

                          {/* Shaft Hoistway Track & Moving Car */}
                          <div className="flex-1 relative my-2 border-x border-dashed border-[#183c72] bg-[#030d22] rounded flex justify-center overflow-hidden">
                            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(pct => (
                              <div key={pct} style={{ bottom: `${pct}%` }} className="absolute w-full h-px bg-[#112952] pointer-events-none" />
                            ))}

                            {/* Cable */}
                            <div
                              style={{ bottom: `${carBottomPercent + 14}%`, top: 0 }}
                              className="absolute w-1 bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 shadow-[0_0_4px_rgba(255,255,255,0.4)]"
                            />

                            {/* Moving Elevator Cabin Car */}
                            <div
                              style={{ bottom: `${carBottomPercent}%` }}
                              className={`absolute w-[86%] h-14 rounded-lg border-2 transition-all duration-500 flex flex-col justify-between p-1.5 shadow-xl ${
                                isSelected
                                  ? 'bg-gradient-to-b from-[#0a3375] to-[#041a40] border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6)]'
                                  : 'bg-gradient-to-b from-[#092859] to-[#03132e] border-cyan-500/60 shadow-[0_0_10px_rgba(0,0,0,0.8)]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-white flex items-center gap-1">
                                  {elev.direction === 'UP' && <span className="text-emerald-400 animate-bounce">▲</span>}
                                  {elev.direction === 'DOWN' && <span className="text-amber-400 animate-bounce">▼</span>}
                                  {elev.direction === 'IDLE' && <span className="text-slate-400">■</span>}
                                  <span>{elev.currentFloor}</span>
                                </span>
                                <span className={`text-[9px] font-bold px-1 rounded ${
                                  isDoorOpen ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-cyan-900 text-cyan-200'
                                }`}>
                                  {isDoorOpen ? '开门' : '关门'}
                                </span>
                              </div>

                              {/* Load bar */}
                              <div className="w-full bg-[#051739] h-1.5 rounded-full overflow-hidden border border-[#163c72]">
                                <div
                                  style={{ width: `${elev.loadPercent}%` }}
                                  className={`h-full rounded-full ${
                                    elev.loadPercent > 80 ? 'bg-red-500' : elev.loadPercent > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                                  }`}
                                />
                              </div>

                              <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
                                <span>{elev.loadKg}</span>
                                <span className="text-cyan-300">{elev.speed}</span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Car Status Chips */}
                          <div className="pt-2 border-t border-[#14386e] flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-400">额定: {elev.ratedLoad}</span>
                            <span className="text-emerald-400 font-bold">{elev.runStatus}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (activeSubsystem === '能耗' || activeSubsystem === '能耗计量') ? (
          activeTertiaryMenu === '水表' ? (
            /* ==================== 能耗计量 - 楼层水表 3D FLOOR SCENE matching image_a512739a.png ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-water-meter-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0096ff" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-water-meter-grid)" />
              </svg>

              <div className="w-[840px] h-[520px] relative flex items-center justify-center">
                <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                  {/* 3D Architectural Floor Model matching screenshot (image_a2507f11.png for 1F / upper_floor_plan.jpg for >1F without parking) */}
                  <img
                    src={currentFloor3dImage}
                    alt={`${activeBuilding}${activeFloor}水表三维空间分布图`}
                    className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(0,150,255,0.35)]"
                  />

                  {/* 9 Circular Water Meter Hotspots matching image_a512739a.png */}
                  {floorWaterMeterHotspots.map((spot) => {
                    const isSelected = selectedFloorWaterMeterId === spot.id;
                    return (
                      <div
                        key={spot.id}
                        onClick={() => setSelectedFloorWaterMeterId(spot.id)}
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        title={`点击查看${spot.name}信息 (${activeBuilding}${activeFloor})`}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          {isSelected ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-10 h-10 rounded-full bg-[#0096ff]/60 animate-ping" />
                                <div className="w-8 h-8 rounded-full bg-[#0096ff] text-white border-2 border-white shadow-[0_0_16px_#00d2ff] flex items-center justify-center">
                                  {/* Water Meter Gauge Symbol */}
                                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center relative p-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white flex items-center justify-center" />
                                    <div className="absolute top-0.5 right-1 w-1.5 h-0.5 bg-white origin-left rotate-[-45deg]" />
                                    <div className="absolute -top-0.5 w-1.5 h-0.5 bg-white rounded-2xs" />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-1 px-2 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[10px] shadow-[0_0_10px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                {spot.name}
                              </div>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#0096ff] text-white border border-cyan-300/80 shadow-[0_0_12px_rgba(0,150,255,0.7)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                              {/* Water Meter Gauge Symbol */}
                              <div className="w-3.5 h-3.5 rounded-full border border-white/90 flex items-center justify-center relative p-0.5">
                                <div className="w-1 h-1 rounded-full bg-white/90 flex items-center justify-center" />
                                <div className="absolute top-0.5 right-0.5 w-1 h-0.5 bg-white origin-left rotate-[-45deg]" />
                                <div className="absolute -top-0.5 w-1 h-0.5 bg-white/80 rounded-2xs" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ==================== 能耗计量 - 楼层电表 3D FLOOR SCENE matching image_10698de3.png ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-meter-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0096ff" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-meter-grid)" />
              </svg>

              <div className="w-[840px] h-[520px] relative flex items-center justify-center">
                <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                  {/* 3D Architectural Floor Model matching screenshot (image_a2507f11.png for 1F / upper_floor_plan.jpg for >1F without parking) */}
                  <img
                    src={currentFloor3dImage}
                    alt={`${activeBuilding}${activeFloor}电表三维空间分布图`}
                    className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(0,150,255,0.35)]"
                  />

                  {/* 10 Circular Electric Meter Hotspots matching image_10698de3.png */}
                  {floorElectricMeterHotspots.map((spot) => {
                    const isSelected = selectedFloorMeterId === spot.id;
                    return (
                      <div
                        key={spot.id}
                        onClick={() => setSelectedFloorMeterId(spot.id)}
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        title={`点击查看${spot.name}信息 (${activeBuilding}${activeFloor})`}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          {isSelected ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-10 h-10 rounded-full bg-[#0096ff]/60 animate-ping" />
                                <div className="w-8 h-8 rounded-full bg-[#0096ff] text-white border-2 border-white shadow-[0_0_16px_#00d2ff] flex items-center justify-center">
                                  {/* Electric Meter Symbol */}
                                  <div className="w-4 h-4 border border-white rounded-xs flex flex-col justify-between p-0.5">
                                    <div className="w-full h-1 bg-white rounded-2xs" />
                                    <div className="flex justify-between items-center px-0.5">
                                      <span className="w-0.5 h-0.5 bg-white rounded-full" />
                                      <span className="w-0.5 h-0.5 bg-white rounded-full" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-1 px-2 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[10px] shadow-[0_0_10px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                {spot.name}
                              </div>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#0096ff] text-white border border-cyan-300/80 shadow-[0_0_12px_rgba(0,150,255,0.7)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                              {/* Electric Meter Symbol */}
                              <div className="w-3.5 h-3.5 border border-white/90 rounded-xs flex flex-col justify-between p-0.5">
                                <div className="w-full h-1 bg-white/90 rounded-2xs" />
                                <div className="flex justify-between items-center px-0.5">
                                  <span className="w-0.5 h-0.5 bg-white rounded-full" />
                                  <span className="w-0.5 h-0.5 bg-white rounded-full" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        ) : activeSubsystem === '信息网络' ? (
          activeTertiaryMenu === '音乐广播' ? (
            /* ==================== 音乐广播 3D FLOOR SCENE matching screenshot image_c10ff38d.png ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-spk-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-spk-grid)" />
              </svg>

              <div className="w-[840px] h-[520px] relative flex items-center justify-center">
                <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                  {/* 3D Architectural Floor Model (image_a2507f11.png for 1F / upper_floor_plan.jpg for >1F without parking) */}
                  <img
                    src={currentFloor3dImage}
                    alt={`${activeBuilding}${activeFloor}音乐广播终端三维空间分布图`}
                    className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(0,180,255,0.35)]"
                  />

                  {/* 5 Broadcast Speaker Hotspots matching screenshot image_c10ff38d.png */}
                  {floorBroadcastHotspots.map((spot) => {
                    const isSelected = activeBroadcastNode.id === spot.id;
                    return (
                      <div
                        key={spot.id}
                        onClick={() => setSelectedBroadcastId(spot.id)}
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        title={`点击查看${spot.name}信息 (${activeBuilding}${activeFloor})`}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          {isSelected ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-8 h-8 rounded-full bg-[#00d2ff]/60 animate-ping" />
                                <div className="w-7 h-7 rounded-full bg-[#0096ff] text-white border-2 border-cyan-200 shadow-[0_0_16px_#00d2ff] flex items-center justify-center">
                                  <Volume2 className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div className="mt-1 px-2 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[10px] shadow-[0_0_10px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                {spot.name}
                              </div>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#0096ff] text-white border border-cyan-300/80 shadow-[0_0_12px_rgba(0,150,255,0.7)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                              <Volume2 className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ==================== 信息发布 3D FLOOR SCENE matching screenshot image_7bb44dd5.png ==================== */
            <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#040b1a]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-scr-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-scr-grid)" />
              </svg>

              <div className="w-[840px] h-[520px] relative flex items-center justify-center">
                <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                  {/* 3D Architectural Floor Model matching screenshot (image_a2507f11.png for 1F / upper_floor_plan.jpg for >1F without parking) */}
                  <img
                    src={currentFloor3dImage}
                    alt={`${activeBuilding}${activeFloor}信息发布终端三维空间分布图`}
                    className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(0,180,255,0.35)]"
                  />

                  {/* 3 Digital Signage Screen Hotspots matching image_7bb44dd5.png */}
                  {floorSignageHotspots.map((spot) => {
                    const isSelected = activeSignageNode.id === spot.id;
                    return (
                      <div
                        key={spot.id}
                        onClick={() => setSelectedSignageId(spot.id)}
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        title={`点击查看${spot.name}信息 (${activeBuilding}${activeFloor})`}
                      >
                        <div className="relative flex flex-col items-center justify-center">
                          {isSelected ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-9 h-7 rounded bg-[#00d2ff]/60 animate-ping" />
                                <div className="w-8 h-6 rounded bg-[#0096ff] text-white border-2 border-cyan-200 shadow-[0_0_16px_#00d2ff] flex items-center justify-center">
                                  <Tv className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div className="mt-1 px-2 py-0.5 rounded bg-[#002860]/95 border border-[#00d2ff] text-cyan-100 font-bold text-[10px] shadow-[0_0_10px_rgba(0,210,255,0.7)] whitespace-nowrap">
                                {spot.name}
                              </div>
                            </div>
                          ) : (
                            <div className="w-7 h-5 rounded bg-[#0096ff] text-white border border-cyan-300/80 shadow-[0_0_12px_rgba(0,150,255,0.7)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_18px_#22d3ee]">
                              <Tv className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        ) : (
          /* Default 3D Architectural Floorplan Scene (e.g. 视频监控 / 摄像机) */
          <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden">
            <div className="w-[840px] h-[540px] relative flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="twin-scada-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#twin-scada-grid)" />
              </svg>

              <div className="relative w-[780px] h-[460px] flex items-center justify-center">
                <img
                  src={currentFloor3dImage}
                  alt="三维楼层结构图"
                  className="w-full h-full object-contain filter brightness-110 contrast-125 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
                />

                {currentCameras.map((cam) => {
                  const isSelected = activeCamera.id === cam.id;
                  return (
                    <div
                      key={cam.id}
                      onClick={() => setSelectedCameraId(cam.id)}
                      style={{ left: `${cam.x}%`, top: `${cam.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      title={`点击切换右侧设备信息: ${cam.name}`}
                    >
                      <div className="relative flex flex-col items-center justify-center">
                        {isSelected ? (
                          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-14 h-14 rounded-full bg-cyan-400/40 animate-ping" />
                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 text-slate-950 border-2 border-white shadow-[0_0_22px_#22d3ee] flex items-center justify-center">
                                <Camera className="w-6 h-6 stroke-[2.5]" />
                              </div>
                            </div>
                            <div className="mt-1.5 px-3 py-1 rounded-lg bg-[#002860]/95 border-2 border-[#00d2ff] text-cyan-100 font-bold text-xs shadow-[0_0_20px_rgba(0,210,255,0.7)] tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                              <div className="w-4 h-4 rounded-full bg-[#00d2ff] text-slate-950 flex items-center justify-center shrink-0">
                                <Camera className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                              <span>{cam.name}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#0077b6] text-white border-2 border-cyan-300 shadow-[0_0_14px_#00b4d8] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_#22d3ee]">
                              <Camera className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================== COLUMN 4: RIGHT PANEL - 设备信息 ===================== */}
      <aside className="w-72 bg-[#06122d] border-l border-[#133063] flex flex-col shrink-0 select-none">
        {/* Header Strip matching screenshot: ■ 设备信息 */}
        <div className="h-10 bg-[#081d4a] border-b border-[#133063] px-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
            <span>设备信息</span>
          </div>
          {!(
            ((activeSubsystem === '能耗' || activeSubsystem === '能耗计量') && activeTertiaryMenu === '电表') ||
            (activeSubsystem === '智慧照明' && (activeTertiaryMenu === '景观照明' || activeTertiaryMenu === '泛光照明'))
          ) && (
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
              {activeSubsystem === '防盗告警' ? '0' : activeSubsystem === '门禁系统' ? (activeTertiaryMenu === '人行道闸' ? activeTurnstile.onlineStatus : activeFaceDoor.onlineStatus) : activeSubsystem === '停车场系统' ? '在线' : activeSubsystem === '环境监测' ? '0' : activeSubsystem === '冷热源' ? '在线' : activeSubsystem === '给排水' ? '运行' : activeSubsystem === '变配电' ? '运行' : activeSubsystem === '电梯系统' ? '运行' : (activeSubsystem === '能耗' || activeSubsystem === '能耗计量') ? '在线' : activeSubsystem === '信息网络' ? '在线' : activeCamera.status}
            </span>
          )}
        </div>

        {/* Readout Fields (Matching exact screenshot image_a3509e1b.png & image_94a285ed.png labels and layout) */}
        {activeSubsystem === '防盗告警' ? (
          activeTertiaryMenu === '入侵告警' ? (
            /* Intrusion Alarm Right Panel Readouts matching image_a3509e1b.png */
            <div className="flex-1 flex flex-col justify-between">
              <div className="p-3.5 space-y-3 text-xs font-mono bg-[#05112c]/80">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备类型ID:</span>
                  <span className="text-cyan-300 font-bold">DTY_SPGASY</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备ID:</span>
                  <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[150px]" title={activeIntrusion.code}>
                    {activeIntrusion.code}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]" title={activeIntrusion.name}>
                    {activeIntrusion.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">告警状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">故障告警:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">防区状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">运行状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">1</span>
                </div>
              </div>

              {/* Bottom Action Buttons: 布防 & 撤防 matching screenshot image_a3509e1b.png */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063] flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setZoneArmState(prev => ({ ...prev, [selectedIntrusionId]: true }));
                    setArmToast(`${activeIntrusion.name}：已开启布防`);
                    setTimeout(() => setArmToast(''), 3000);
                  }}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] border border-cyan-400 flex items-center justify-center cursor-pointer"
                >
                  <span>布防</span>
                </button>
                <button
                  onClick={() => {
                    setZoneArmState(prev => ({ ...prev, [selectedIntrusionId]: false }));
                    setArmToast(`${activeIntrusion.name}：已撤防`);
                    setTimeout(() => setArmToast(''), 3000);
                  }}
                  className="flex-1 py-2 rounded-lg bg-[#0a275c] hover:bg-[#0e367c] text-cyan-300 font-bold text-xs transition-all border border-[#1b4899] flex items-center justify-center cursor-pointer"
                >
                  <span>撤防</span>
                </button>
              </div>
            </div>
          ) : (
            /* Perimeter Alarm Right Panel Readouts matching image_94a285ed.png */
            <div className="flex-1 flex flex-col justify-between">
              <div className="p-3.5 space-y-3 text-xs font-mono border-b border-[#133063] bg-[#05112c]/80">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备类型ID:</span>
                  <span className="text-cyan-300 font-bold">{activePerimeter.typeId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备ID:</span>
                  <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[150px]" title={activePerimeter.code}>
                    {activePerimeter.code}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]" title={activePerimeter.name}>
                    {activePerimeter.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">告警状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">故障告警:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">在线状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">运行状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between bg-[#040e24]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-sans flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                      周界测控日志
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                      {isArmed ? '全区布防中' : '撤防中'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#030a1c] border border-[#14356e] font-mono text-xs space-y-2 text-slate-300">
                    <div className="flex justify-between text-cyan-300 font-bold border-b border-[#14356e] pb-1.5 text-[11px]">
                      <span>最新记录时间</span>
                      <span>{currentTimeStr.split(' ')[1]}</span>
                    </div>
                    <div className="text-emerald-400 text-[11px] flex items-center gap-1.5 pt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span>[{currentTimeStr}] 周界自检状态正常</span>
                    </div>
                    <div className="text-slate-400 text-[10px] tracking-tight">
                      当前选中防区点位: {activePerimeter.name}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#020817] border border-cyan-500/30 text-[11px] space-y-1.5">
                  <div className="text-cyan-300 font-bold flex items-center justify-between">
                    <span>周界防护控制</span>
                    <span className="text-[9.5px] font-mono text-slate-400">{currentTimeStr.split(' ')[0]}</span>
                  </div>
                  <p className="text-[#94a3b8] text-[10.5px]">
                    传感器连线稳定，周界脉冲对射屏障系统运行中。
                  </p>
                </div>
              </div>
            </div>
          )
        ) : activeSubsystem === '门禁系统' ? (
          activeTertiaryMenu === '人行道闸' ? (
            /* ==================== 人行道闸 RIGHT PANEL (Matching screenshot image_479dc58d.png) ==================== */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="p-3.5 space-y-3 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-cyan-300 font-bold">{activeTurnstile.typeId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备ID:</span>
                    <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[150px]" title={activeTurnstile.code}>
                      {activeTurnstile.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]" title={activeTurnstile.name}>
                      {activeTurnstile.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">闯入告警:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeTurnstile.intrusion}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">在线状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeTurnstile.onlineStatus}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">开关状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">
                      {turnstileModes[activeTurnstile.id] || '常开'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">出入口识别装置状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeTurnstile.scannerStatus}</span>
                  </div>
                </div>

                {/* Header Strip matching screenshot: ■ 设备控制 */}
                <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备控制</span>
                  </div>
                </div>

                <div className="p-4 space-y-6 bg-[#040e24]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]">
                      {activeTurnstile.name}
                    </span>
                  </div>

                  {/* 道闸控制 Segmented Control Buttons: 关 / 开 / 常开 (Matching image_479dc58d.png) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400 font-sans">道闸控制:</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-1 rounded bg-[#030d24] border border-[#143770]">
                      {(['关', '开', '常开'] as const).map((mode) => {
                        const isCurrent = (turnstileModes[activeTurnstile.id] || '常开') === mode;
                        return (
                          <button
                            key={mode}
                            onClick={() => {
                              setTurnstileModes(prev => ({ ...prev, [activeTurnstile.id]: mode }));
                              setArmToast(`${activeTurnstile.name}：道闸控制已设为 ${mode}`);
                              setTimeout(() => setArmToast(''), 3000);
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold transition-all text-center cursor-pointer border ${
                              isCurrent
                                ? 'bg-[#0a295c] text-cyan-300 border-b-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                                : 'bg-transparent text-slate-400 hover:text-white border-transparent'
                            }`}
                          >
                            {mode}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button: 全部设定 */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063]">
                <button
                  onClick={() => {
                    setArmToast(`${activeBuilding}${activeFloor} 人行道闸：全园区控制参数设定已成功保存`);
                    setTimeout(() => setArmToast(''), 3000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#061e47] hover:bg-[#0a2b66] text-cyan-300 hover:text-white font-bold text-xs transition-all border border-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.25)] flex items-center justify-center cursor-pointer tracking-wider"
                >
                  <span>全部设定</span>
                </button>
              </div>
            </div>
          ) : (
            /* ==================== 人脸门禁 RIGHT PANEL (Matching screenshot image_379d9b86.png) ==================== */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="p-3.5 space-y-3 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-cyan-300 font-bold">{activeFaceDoor.typeId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备ID:</span>
                    <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[150px]" title={activeFaceDoor.code}>
                      {activeFaceDoor.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]" title={activeFaceDoor.name}>
                      {activeFaceDoor.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">闯入告警:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeFaceDoor.intrusion}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">在线状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeFaceDoor.onlineStatus}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">开关状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">
                      {doorSwitchStates[activeFaceDoor.id] ? '开' : '关'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">出入口识别装置状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeFaceDoor.scannerStatus}</span>
                  </div>
                </div>

                {/* Header Strip matching screenshot: ■ 设备控制 */}
                <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备控制</span>
                  </div>
                </div>

                <div className="p-4 space-y-5 bg-[#040e24]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]">
                      {activeFaceDoor.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">门开关控制:</span>
                    <button
                      onClick={() => {
                        const nextState = !doorSwitchStates[activeFaceDoor.id];
                        setDoorSwitchStates(prev => ({ ...prev, [activeFaceDoor.id]: nextState }));
                        setArmToast(`${activeFaceDoor.name}：开关状态已切换为 ${nextState ? '开' : '关'}`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className={`w-14 h-7 rounded-full p-1 transition-all relative flex items-center cursor-pointer shadow-inner ${
                        doorSwitchStates[activeFaceDoor.id]
                          ? 'bg-cyan-500 justify-end'
                          : 'bg-[#082252] border border-[#1d4c94] justify-start'
                      }`}
                    >
                      <span className={`text-[10px] font-mono font-bold px-1 ${
                        doorSwitchStates[activeFaceDoor.id] ? 'text-slate-950 mr-3.5' : 'text-cyan-300 ml-3.5'
                      }`}>
                        {doorSwitchStates[activeFaceDoor.id] ? 'ON' : 'OFF'}
                      </span>
                      <span className={`absolute w-5 h-5 rounded-full shadow-md transition-all ${
                        doorSwitchStates[activeFaceDoor.id] ? 'bg-[#ffffff] right-1' : 'bg-cyan-400 left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Full-width Action Button: 全部设定 */}
              <div className="p-4 bg-[#040e24] border-t border-[#133063]">
                <button
                  onClick={() => {
                    setArmToast(`${activeBuilding}${activeFloor} 人脸门禁：全部门禁设定更新就绪`);
                    setTimeout(() => setArmToast(''), 3000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#061e47] hover:bg-[#0a2b66] text-cyan-300 hover:text-white font-bold text-xs transition-all border border-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.25)] flex items-center justify-center cursor-pointer tracking-wider"
                >
                  <span>全部设定</span>
                </button>
              </div>
            </div>
          )
        ) : activeSubsystem === '停车场系统' ? (
          /* ==================== 停车场系统 / 车位 RIGHT PANEL (Matching screenshot image_8fa8ed3e.png) ==================== */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="p-3.5 space-y-3 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备类型ID:</span>
                  <span className="text-cyan-300 font-bold">{activeParkingGate.typeId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备ID:</span>
                  <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[150px]" title={activeParkingGate.code}>
                    {activeParkingGate.code}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]" title={activeParkingGate.name}>
                    {activeParkingGate.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">告警状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">故障告警:</span>
                  <span className="text-cyan-300 font-bold font-mono">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">运行状态:</span>
                  <span className="text-cyan-300 font-bold font-sans">
                    {parkingGateArmStates[activeParkingGate.id] || '抬杆'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons: 抬杆 & 落杆 matching screenshot image_8fa8ed3e.png */}
            <div className="p-4 bg-[#040e24] border-t border-[#133063] flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setParkingGateArmStates(prev => ({ ...prev, [activeParkingGate.id]: '抬杆' }));
                  setArmToast(`${activeParkingGate.name}：已执行抬杆控制`);
                  setTimeout(() => setArmToast(''), 3000);
                }}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] border border-cyan-400 flex items-center justify-center cursor-pointer"
              >
                <span>抬杆</span>
              </button>
              <button
                onClick={() => {
                  setParkingGateArmStates(prev => ({ ...prev, [activeParkingGate.id]: '落杆' }));
                  setArmToast(`${activeParkingGate.name}：已执行落杆控制`);
                  setTimeout(() => setArmToast(''), 3000);
                }}
                className="flex-1 py-2 rounded-lg bg-[#0a275c] hover:bg-[#0e367c] text-cyan-300 font-bold text-xs transition-all border border-[#1b4899] flex items-center justify-center cursor-pointer"
              >
                <span>落杆</span>
              </button>
            </div>
          </div>
        ) : activeSubsystem === '暖通空调' ? (
          /* ==================== 暖通空调 / 排风机 & 送风机 & 新风机 RIGHT PANEL (Matching screenshot image_ccf4b208.png, image_ef204713.png & image_9e4b741d.png) ==================== */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            {activeTertiaryMenu === '排风机' ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Header 1: ■ 设备信息 */}
                  <div className="h-10 bg-[#081d4a] border-b border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备信息</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-cyan-300 font-bold">{activeEanNode.typeId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeEanNode.code}>
                        {activeEanNode.code}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeEanNode.name}>
                        {activeEanNode.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">故障告警:</span>
                      <span className="text-cyan-300 font-bold">{activeEanNode.faultAlarm}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">手自动:</span>
                      <span className="text-cyan-300 font-bold">{activeEanNode.manualAuto}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">运行状态:</span>
                      <span className="text-cyan-300 font-bold">{activeEanNode.runStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">在线状态:</span>
                      <span className="text-cyan-300 font-bold">{activeEanNode.onlineStatus}</span>
                    </div>
                  </div>

                  {/* Header 2: ■ 设备控制 */}
                  <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备控制</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-4 bg-[#040e24]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans font-bold text-[11px] truncate max-w-[170px]" title={activeEanNode.name}>
                        {activeEanNode.name}
                      </span>
                    </div>

                    {/* 启动控制 Toggle */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">启动控制:</span>
                      <button
                        onClick={() => {
                          const next = !eanPowerStates[activeEanNode.id];
                          setEanPowerStates(prev => ({ ...prev, [activeEanNode.id]: next }));
                          setArmToast(`${activeEanNode.name} 启动控制已切换为 ${next ? 'ON' : 'OFF'}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                          eanPowerStates[activeEanNode.id]
                            ? 'bg-cyan-500 justify-end'
                            : 'bg-[#082252] border border-[#1d4c94] justify-start'
                        }`}
                      >
                        <span className={`text-[9px] font-mono font-bold px-1 ${
                          eanPowerStates[activeEanNode.id] ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                        }`}>
                          {eanPowerStates[activeEanNode.id] ? 'ON' : 'OFF'}
                        </span>
                        <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                          eanPowerStates[activeEanNode.id] ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                        }`} />
                      </button>
                    </div>

                    {/* 全部设定 Full-width Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setArmToast(`${activeEanNode.name}：已完成全项参数配置同步`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="w-full py-2 rounded bg-[#071d47] hover:bg-[#0b2b68] text-cyan-300 font-bold text-xs border border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
                      >
                        全部设定
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTertiaryMenu === '送风机' ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Header 1: ■ 设备信息 */}
                  <div className="h-10 bg-[#081d4a] border-b border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备信息</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-cyan-300 font-bold">{activeSafNode.typeId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeSafNode.code}>
                        {activeSafNode.code}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeSafNode.name}>
                        {activeSafNode.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">故障告警:</span>
                      <span className="text-cyan-300 font-bold">{activeSafNode.faultAlarm}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">手自动:</span>
                      <span className="text-cyan-300 font-bold">{activeSafNode.manualAuto}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">CO浓度:</span>
                      <span className="text-cyan-300 font-bold">{activeSafNode.co2}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">运行状态:</span>
                      <span className="text-cyan-300 font-bold">{activeSafNode.runStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">在线状态:</span>
                      <span className="text-cyan-300 font-bold">{activeSafNode.onlineStatus}</span>
                    </div>
                  </div>

                  {/* Header 2: ■ 设备控制 */}
                  <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备控制</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-4 bg-[#040e24]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans font-bold text-[11px] truncate max-w-[170px]" title={activeSafNode.name}>
                        {activeSafNode.name}
                      </span>
                    </div>

                    {/* 启动控制 Toggle */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">启动控制:</span>
                      <button
                        onClick={() => {
                          const next = !safPowerStates[activeSafNode.id];
                          setSafPowerStates(prev => ({ ...prev, [activeSafNode.id]: next }));
                          setArmToast(`${activeSafNode.name} 启动控制已切换为 ${next ? 'ON' : 'OFF'}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                          safPowerStates[activeSafNode.id]
                            ? 'bg-cyan-500 justify-end'
                            : 'bg-[#082252] border border-[#1d4c94] justify-start'
                        }`}
                      >
                        <span className={`text-[9px] font-mono font-bold px-1 ${
                          safPowerStates[activeSafNode.id] ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                        }`}>
                          {safPowerStates[activeSafNode.id] ? 'ON' : 'OFF'}
                        </span>
                        <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                          safPowerStates[activeSafNode.id] ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                        }`} />
                      </button>
                    </div>

                    {/* CO浓度设定值 */}
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400 font-sans">CO浓度设定值:</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                          <button
                            onClick={() => {
                              const cur = safCo2SetVal[activeSafNode.id] || 0;
                              const next = Math.max(0, cur - 1).toFixed(2);
                              setSafCo2SetVal(prev => ({ ...prev, [activeSafNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-xs">
                            {(safCo2SetVal[activeSafNode.id] || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              const cur = safCo2SetVal[activeSafNode.id] || 0;
                              const next = (cur + 1).toFixed(2);
                              setSafCo2SetVal(prev => ({ ...prev, [activeSafNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setArmToast(`${activeSafNode.name} CO浓度设定值已设定为 ${(safCo2SetVal[activeSafNode.id] || 0).toFixed(2)}`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                        >
                          设定
                        </button>
                      </div>
                    </div>

                    {/* 全部设定 Full-width Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setArmToast(`${activeSafNode.name}：已完成全项参数配置同步`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="w-full py-2 rounded bg-[#071d47] hover:bg-[#0b2b68] text-cyan-300 font-bold text-xs border border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
                      >
                        全部设定
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTertiaryMenu === '新风机' ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Header 1: ■ 设备信息 */}
                  <div className="h-10 bg-[#081d4a] border-b border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备信息</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.typeId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeFauNode.code}>
                        {activeFauNode.code}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeFauNode.name}>
                        {activeFauNode.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">故障告警:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.faultAlarm}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">手自动:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.manualAuto}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">防冻开关:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.antiFreeze}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">二氧化碳:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.co2}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">热水阀调节反馈:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.hotWaterFeedback1}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">新风湿度:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.freshHumidity}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">新风温度:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.freshTemp}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">变频反馈:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.freqFeedback}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">过滤网状态:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.filterStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">新风阀开反馈:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.freshValveFeedback}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">热水阀调节反馈:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.hotWaterFeedback2}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">盘管低温报警:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.coilLowTempAlarm}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">回水温度:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.returnWaterTemp}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">回水湿度:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.returnWaterHumidity}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">送风温度:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.supplyAirTemp}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">运行状态:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.runStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">供水温度:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.supplyWaterTemp}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">水阀开关反馈:</span>
                      <span className="text-cyan-300 font-bold">{activeFauNode.waterValveSwitchFeedback}</span>
                    </div>
                  </div>

                  {/* Header 2: ■ 设备控制 */}
                  <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备控制</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-3 bg-[#040e24]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans font-bold text-[11px] truncate max-w-[170px]" title={activeFauNode.name}>
                        {activeFauNode.name}
                      </span>
                    </div>

                    {/* 启动控制 Toggle */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">启动控制:</span>
                      <button
                        onClick={() => {
                          const next = !fauPowerStates[activeFauNode.id];
                          setFauPowerStates(prev => ({ ...prev, [activeFauNode.id]: next }));
                          setArmToast(`${activeFauNode.name} 启动控制已切换为 ${next ? 'ON' : 'OFF'}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                          fauPowerStates[activeFauNode.id]
                            ? 'bg-cyan-500 justify-end'
                            : 'bg-[#082252] border border-[#1d4c94] justify-start'
                        }`}
                      >
                        <span className={`text-[9px] font-mono font-bold px-1 ${
                          fauPowerStates[activeFauNode.id] ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                        }`}>
                          {fauPowerStates[activeFauNode.id] ? 'ON' : 'OFF'}
                        </span>
                        <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                          fauPowerStates[activeFauNode.id] ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                        }`} />
                      </button>
                    </div>

                    {/* 冷水阀调节控制 */}
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400 font-sans">冷水阀调节控制:</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                          <button
                            onClick={() => {
                              const cur = fauChilledWaterVal[activeFauNode.id] || 0;
                              const next = Math.max(0, cur - 1).toFixed(2);
                              setFauChilledWaterVal(prev => ({ ...prev, [activeFauNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-xs">
                            {(fauChilledWaterVal[activeFauNode.id] || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              const cur = fauChilledWaterVal[activeFauNode.id] || 0;
                              const next = (cur + 1).toFixed(2);
                              setFauChilledWaterVal(prev => ({ ...prev, [activeFauNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setArmToast(`${activeFauNode.name} 冷水阀已设定为 ${(fauChilledWaterVal[activeFauNode.id] || 0).toFixed(2)}`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                        >
                          设定
                        </button>
                      </div>
                    </div>

                    {/* 变频调节 */}
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400 font-sans">变频调节:</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                          <button
                            onClick={() => {
                              const cur = fauFreqVal[activeFauNode.id] || 0;
                              const next = Math.max(0, cur - 1).toFixed(2);
                              setFauFreqVal(prev => ({ ...prev, [activeFauNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-xs">
                            {(fauFreqVal[activeFauNode.id] || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              const cur = fauFreqVal[activeFauNode.id] || 0;
                              const next = (cur + 1).toFixed(2);
                              setFauFreqVal(prev => ({ ...prev, [activeFauNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setArmToast(`${activeFauNode.name} 变频频率已设定为 ${(fauFreqVal[activeFauNode.id] || 0).toFixed(2)}`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                        >
                          设定
                        </button>
                      </div>
                    </div>

                    {/* 热水阀调节控制 */}
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400 font-sans">热水阀调节控制:</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                          <button
                            onClick={() => {
                              const cur = fauHotWaterVal[activeFauNode.id] || 0;
                              const next = Math.max(0, cur - 1).toFixed(2);
                              setFauHotWaterVal(prev => ({ ...prev, [activeFauNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-xs">
                            {(fauHotWaterVal[activeFauNode.id] || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              const cur = fauHotWaterVal[activeFauNode.id] || 0;
                              const next = (cur + 1).toFixed(2);
                              setFauHotWaterVal(prev => ({ ...prev, [activeFauNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setArmToast(`${activeFauNode.name} 热水阀已设定为 ${(fauHotWaterVal[activeFauNode.id] || 0).toFixed(2)}`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                        >
                          设定
                        </button>
                      </div>
                    </div>

                    {/* 送风温度设定 */}
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400 font-sans">送风温度设定:</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                          <button
                            onClick={() => {
                              const cur = fauSupplyTempSetVal[activeFauNode.id] || 0;
                              const next = Math.max(0, cur - 0.5).toFixed(2);
                              setFauSupplyTempSetVal(prev => ({ ...prev, [activeFauNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-xs">
                            {(fauSupplyTempSetVal[activeFauNode.id] || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              const cur = fauSupplyTempSetVal[activeFauNode.id] || 0;
                              const next = (cur + 0.5).toFixed(2);
                              setFauSupplyTempSetVal(prev => ({ ...prev, [activeFauNode.id]: parseFloat(next) }));
                            }}
                            className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setArmToast(`${activeFauNode.name} 送风温度设定为 ${(fauSupplyTempSetVal[activeFauNode.id] || 0).toFixed(2)} ℃`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                        >
                          设定
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Header 1: ■ 设备信息 */}
                  <div className="p-3.5 space-y-2.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-cyan-300 font-bold">{activeAcNode.typeId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[150px]" title={activeAcNode.code}>
                        {activeAcNode.code}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]" title={activeAcNode.name}>
                        {activeAcNode.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">CO2浓度传感器:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.co2}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">冷水阀反馈:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.coldWater}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">新风温度:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.freshTemp}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">新风阀开关反馈:</span>
                      <span className="text-cyan-300 font-bold font-mono">
                        {freshAirValves[activeAcNode.id] ? '开启' : activeAcNode.freshValveFeedback}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">热水阀反馈:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.hotWater}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">热水阀最小开度:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.hotWaterMinOpen}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">回风温度:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.returnTemp}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">回风湿度:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.returnHumidity}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">回风阀开关反馈:</span>
                      <span className="text-cyan-300 font-bold font-mono">
                        {returnAirValves[activeAcNode.id] ? '开启' : activeAcNode.returnValveFeedback}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">送风温度:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.supplyTemp}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">送风湿度:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.supplyHumidity}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">送风机手自动:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.supplyFanAuto}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">送风机运行状态:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.supplyFanStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">防冻开关:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.antiFreeze}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">初效过滤网开关:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.primaryFilter}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">中效过滤网开关:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.mediumFilter}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">送风机故障告警:</span>
                      <span className="text-cyan-300 font-bold font-mono">{activeAcNode.fanFaultAlarm}</span>
                    </div>
                  </div>

                  {/* Header 2: ■ 设备控制 */}
                  <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备控制</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4 bg-[#040e24]">
                    {/* 新风阀开关 Toggle */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">新风阀开关:</span>
                      <button
                        onClick={() => {
                          const next = !freshAirValves[activeAcNode.id];
                          setFreshAirValves(prev => ({ ...prev, [activeAcNode.id]: next }));
                          setArmToast(`${activeAcNode.name} 新风阀已切换为 ${next ? 'ON' : 'OFF'}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`w-14 h-7 rounded-full p-1 transition-all relative flex items-center cursor-pointer shadow-inner ${
                          freshAirValves[activeAcNode.id]
                            ? 'bg-cyan-500 justify-end'
                            : 'bg-[#082252] border border-[#1d4c94] justify-start'
                        }`}
                      >
                        <span className={`text-[10px] font-mono font-bold px-1 ${
                          freshAirValves[activeAcNode.id] ? 'text-slate-950 mr-3.5' : 'text-cyan-300 ml-3.5'
                        }`}>
                          {freshAirValves[activeAcNode.id] ? 'ON' : 'OFF'}
                        </span>
                        <span className={`absolute w-5 h-5 rounded-full shadow-md transition-all ${
                          freshAirValves[activeAcNode.id] ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                        }`} />
                      </button>
                    </div>

                    {/* 回风阀开关 Toggle */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">回风阀开关:</span>
                      <button
                        onClick={() => {
                          const next = !returnAirValves[activeAcNode.id];
                          setReturnAirValves(prev => ({ ...prev, [activeAcNode.id]: next }));
                          setArmToast(`${activeAcNode.name} 回风阀已切换为 ${next ? 'ON' : 'OFF'}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`w-14 h-7 rounded-full p-1 transition-all relative flex items-center cursor-pointer shadow-inner ${
                          returnAirValves[activeAcNode.id]
                            ? 'bg-cyan-500 justify-end'
                            : 'bg-[#082252] border border-[#1d4c94] justify-start'
                        }`}
                      >
                        <span className={`text-[10px] font-mono font-bold px-1 ${
                          returnAirValves[activeAcNode.id] ? 'text-slate-950 mr-3.5' : 'text-cyan-300 ml-3.5'
                        }`}>
                          {returnAirValves[activeAcNode.id] ? 'ON' : 'OFF'}
                        </span>
                        <span className={`absolute w-5 h-5 rounded-full shadow-md transition-all ${
                          returnAirValves[activeAcNode.id] ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeSubsystem === '智慧照明' ? (
          /* ==================== 智慧照明 RIGHT PANEL ==================== */
          activeTertiaryMenu === '景观照明' ? (
            /* 景观照明 RIGHT PANEL (Matching image_aa730709.png) */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header 1: ■ 设备信息 */}
                <div className="h-10 bg-[#081d4a] border-b border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备信息</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-3.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-cyan-300 font-bold">{activeLandscapeNode.typeId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备ID:</span>
                    <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeLandscapeNode.code}>
                      {activeLandscapeNode.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeLandscapeNode.name}>
                      {activeLandscapeNode.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">回路故障告警:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeLandscapeNode.faultAlarm}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">回路手自动状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeLandscapeNode.manualAuto}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">回路运行状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">
                      {activeLandscapeSwitch === '开' ? 1 : 0}
                    </span>
                  </div>
                </div>

                {/* Header 2: ■ 设备控制 */}
                <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备控制</span>
                  </div>
                </div>

                <div className="p-4 space-y-6 bg-[#040e24]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-cyan-300 font-bold font-sans text-right truncate max-w-[170px]" title={activeLandscapeNode.name}>
                      {activeLandscapeNode.name}
                    </span>
                  </div>

                  {/* 回路启停控制: 关 | 开 matching screenshot image_aa730709.png */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">回路启停控制:</span>
                    <div className="flex items-center gap-8 pr-4">
                      <button
                        onClick={() => {
                          setLandscapeSwitchStates(prev => ({ ...prev, [activeLandscapeNode.id]: '关' }));
                          setArmToast(`${activeLandscapeNode.name} 回路已关闭`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`pb-0.5 font-bold text-xs transition-all cursor-pointer relative ${
                          activeLandscapeSwitch === '关'
                            ? 'text-cyan-400 border-b-2 border-cyan-400 shadow-[0_2px_8px_rgba(6,182,212,0.6)]'
                            : 'text-slate-400 hover:text-white border-b border-slate-600'
                        }`}
                      >
                        <span className="px-2">关</span>
                      </button>

                      <button
                        onClick={() => {
                          setLandscapeSwitchStates(prev => ({ ...prev, [activeLandscapeNode.id]: '开' }));
                          setArmToast(`${activeLandscapeNode.name} 回路已开启`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`pb-0.5 font-bold text-xs transition-all cursor-pointer relative ${
                          activeLandscapeSwitch === '开'
                            ? 'text-cyan-400 border-b-2 border-cyan-400 shadow-[0_2px_8px_rgba(6,182,212,0.6)]'
                            : 'text-slate-400 hover:text-white border-b border-slate-600'
                        }`}
                      >
                        <span className="px-2">开</span>
                      </button>
                    </div>
                  </div>

                  {/* 全部设定 Full-width Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setArmToast(`${activeLandscapeNode.name} 全部设定指令已同步完成`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                    >
                      全部设定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTertiaryMenu === '泛光照明' ? (
            /* ==================== 泛光照明 RIGHT PANEL (Matching image_86cadfa9.png) ==================== */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header 1: ■ 设备信息 */}
                <div className="h-10 bg-[#081d4a] border-b border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备信息</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-3.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-cyan-300 font-bold">{activeFloodNode.typeId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备ID:</span>
                    <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeFloodNode.code}>
                      {activeFloodNode.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeFloodNode.name}>
                      {activeFloodNode.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">BA/BMS模式:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeFloodBmsMode}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">夜景照明系统状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeFloodNightStatus}</span>
                  </div>
                </div>

                {/* Header 2: ■ 设备控制 */}
                <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备控制</span>
                  </div>
                </div>

                <div className="p-4 space-y-5 bg-[#040e24]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-cyan-300 font-bold font-sans text-right truncate max-w-[170px]" title={activeFloodNode.name}>
                      {activeFloodNode.name}
                    </span>
                  </div>

                  {/* BA/BMS 模式控制 */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">BA/BMS模式:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setFloodBmsModes(prev => ({ ...prev, [activeFloodNode.id]: 0 }));
                          setArmToast(`${activeFloodNode.name} 模式已切换为 BA模式(0)`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                          activeFloodBmsMode === 0
                            ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)] border border-cyan-400'
                            : 'bg-[#061e47] text-slate-400 hover:text-white border border-[#153e77]'
                        }`}
                      >
                        0 (BA)
                      </button>
                      <button
                        onClick={() => {
                          setFloodBmsModes(prev => ({ ...prev, [activeFloodNode.id]: 1 }));
                          setArmToast(`${activeFloodNode.name} 模式已切换为 BMS模式(1)`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                          activeFloodBmsMode === 1
                            ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)] border border-cyan-400'
                            : 'bg-[#061e47] text-slate-400 hover:text-white border border-[#153e77]'
                        }`}
                      >
                        1 (BMS)
                      </button>
                    </div>
                  </div>

                  {/* 夜景照明系统启停控制: 关 | 开 */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">夜景照明启停:</span>
                    <div className="flex items-center gap-8 pr-4">
                      <button
                        onClick={() => {
                          setFloodNightStates(prev => ({ ...prev, [activeFloodNode.id]: 0 }));
                          setArmToast(`${activeFloodNode.name} 夜景照明系统已关闭`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`pb-0.5 font-bold text-xs transition-all cursor-pointer relative ${
                          activeFloodNightStatus === 0
                            ? 'text-cyan-400 border-b-2 border-cyan-400 shadow-[0_2px_8px_rgba(6,182,212,0.6)]'
                            : 'text-slate-400 hover:text-white border-b border-slate-600'
                        }`}
                      >
                        <span className="px-2">关</span>
                      </button>

                      <button
                        onClick={() => {
                          setFloodNightStates(prev => ({ ...prev, [activeFloodNode.id]: 1 }));
                          setArmToast(`${activeFloodNode.name} 夜景照明系统已开启`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`pb-0.5 font-bold text-xs transition-all cursor-pointer relative ${
                          activeFloodNightStatus === 1
                            ? 'text-cyan-400 border-b-2 border-cyan-400 shadow-[0_2px_8px_rgba(6,182,212,0.6)]'
                            : 'text-slate-400 hover:text-white border-b border-slate-600'
                        }`}
                      >
                        <span className="px-2">开</span>
                      </button>
                    </div>
                  </div>

                  {/* 全部设定 Full-width Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setArmToast(`${activeFloodNode.name} 泛光照明全部参数已下发执行`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                    >
                      全部设定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 室内照明 RIGHT PANEL (Matching image_afcdb9b0.png) */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header 1: ■ 设备信息 */}
                <div className="p-3.5 space-y-3 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-cyan-300 font-bold">{activeLightingNode.typeId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备ID:</span>
                    <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[150px]" title={activeLightingNode.code}>
                      {activeLightingNode.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[150px]" title={activeLightingNode.name}>
                      {activeLightingNode.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">故障告警:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeLightingNode.faultAlarm}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">手自动:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeLightingNode.manualAuto}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">开关状态:</span>
                    <span className="text-cyan-300 font-bold font-mono">
                      {lightingPowerStates[activeLightingNode.id] !== undefined
                        ? (lightingPowerStates[activeLightingNode.id] ? '开' : '关')
                        : activeLightingNode.switchStatus}
                    </span>
                  </div>
                </div>

                {/* Header 2: ■ 设备控制 */}
                <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备控制</span>
                  </div>
                </div>

                <div className="p-4 space-y-4 bg-[#040e24]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-cyan-300 font-bold font-sans text-right truncate max-w-[150px]" title={activeLightingNode.name}>
                      {activeLightingNode.name}
                    </span>
                  </div>

                  {/* 启动控制 Toggle */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">启动控制:</span>
                    <button
                      onClick={() => {
                        const curState = lightingPowerStates[activeLightingNode.id] !== undefined
                          ? lightingPowerStates[activeLightingNode.id]
                          : activeLightingNode.switchStatus === '开';
                        const nextState = !curState;
                        setLightingPowerStates(prev => ({ ...prev, [activeLightingNode.id]: nextState }));
                        setArmToast(`${activeLightingNode.name} 启动控制已切换为 ${nextState ? 'ON' : 'OFF'}`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className={`w-14 h-7 rounded-full p-1 transition-all relative flex items-center cursor-pointer shadow-inner ${
                        (lightingPowerStates[activeLightingNode.id] !== undefined
                          ? lightingPowerStates[activeLightingNode.id]
                          : activeLightingNode.switchStatus === '开')
                          ? 'bg-cyan-500 justify-end'
                          : 'bg-[#082252] border border-[#1d4c94] justify-start'
                      }`}
                    >
                      <span className={`text-[10px] font-mono font-bold px-1 ${
                        (lightingPowerStates[activeLightingNode.id] !== undefined
                          ? lightingPowerStates[activeLightingNode.id]
                          : activeLightingNode.switchStatus === '开') ? 'text-slate-950 mr-3.5' : 'text-cyan-300 ml-3.5'
                      }`}>
                        {(lightingPowerStates[activeLightingNode.id] !== undefined
                          ? lightingPowerStates[activeLightingNode.id]
                          : activeLightingNode.switchStatus === '开') ? 'ON' : 'OFF'}
                      </span>
                      <span className={`absolute w-5 h-5 rounded-full shadow-md transition-all ${
                        (lightingPowerStates[activeLightingNode.id] !== undefined
                          ? lightingPowerStates[activeLightingNode.id]
                          : activeLightingNode.switchStatus === '开') ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                      }`} />
                    </button>
                  </div>

                  {/* 全部设定 Full-width Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setArmToast(`${activeBuilding}${activeFloor}${activeTertiaryMenu}已执行全部设定指令`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                    >
                      全部设定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : activeSubsystem === '环境监测' ? (
          /* ==================== 环境监测 / 环境传感器 RIGHT PANEL (Matching image_9673d34c.png) ==================== */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header 1: ■ 设备信息 */}
              <div className="p-3.5 space-y-2.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备类型ID:</span>
                  <span className="text-cyan-300 font-bold">{activeEnvNode.typeId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备ID:</span>
                  <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeEnvNode.code}>
                    {activeEnvNode.code}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeEnvNode.name}>
                    {activeEnvNode.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">二氧化碳浓度:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeEnvNode.co2}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">甲醛:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeEnvNode.formaldehyde}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">PM2.5:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeEnvNode.pm25}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">相对湿度测量值:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeEnvNode.humidity}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">VOC:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeEnvNode.voc}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">温度测量值:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeEnvNode.temp}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">在线状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeEnvNode.onlineStatus}</span>
                </div>
              </div>

              {/* Header 2: ■ 设备控制 */}
              <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                  <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                  <span>设备控制</span>
                </div>
              </div>

              <div className="p-4 space-y-4 bg-[#040e24]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-cyan-300 font-bold font-sans text-right truncate max-w-[170px]" title={activeEnvNode.name}>
                    {activeEnvNode.name}
                  </span>
                </div>

                {/* 启动控制 Toggle */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">启动控制:</span>
                  <button
                    onClick={() => {
                      const cur = envPowerStates[activeEnvNode.id] ?? false;
                      const next = !cur;
                      setEnvPowerStates(prev => ({ ...prev, [activeEnvNode.id]: next }));
                      setArmToast(`${activeEnvNode.name} 启动控制已切换为 ${next ? 'ON' : 'OFF'}`);
                      setTimeout(() => setArmToast(''), 3000);
                    }}
                    className={`w-14 h-7 rounded-full p-1 transition-all relative flex items-center cursor-pointer shadow-inner ${
                      (envPowerStates[activeEnvNode.id] ?? false)
                        ? 'bg-cyan-500 justify-end'
                        : 'bg-[#082252] border border-[#1d4c94] justify-start'
                    }`}
                  >
                    <span className={`text-[10px] font-mono font-bold px-1 ${
                      (envPowerStates[activeEnvNode.id] ?? false) ? 'text-slate-950 mr-3.5' : 'text-cyan-300 ml-3.5'
                    }`}>
                      {(envPowerStates[activeEnvNode.id] ?? false) ? 'ON' : 'OFF'}
                    </span>
                    <span className={`absolute w-5 h-5 rounded-full shadow-md transition-all ${
                      (envPowerStates[activeEnvNode.id] ?? false) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                    }`} />
                  </button>
                </div>

                {/* 全部设定 Full-width Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setArmToast(`${activeBuilding}${activeFloor}${activeTertiaryMenu}已执行全部设定指令`);
                      setTimeout(() => setArmToast(''), 3000);
                    }}
                    className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                  >
                    全部设定
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeSubsystem === '冷热源' ? (
          activeTertiaryMenu === '热源' ? (
            /* ==================== 热源 RIGHT PANEL (Matching exact image_083a1294.png) ==================== */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header 1: ■ 设备信息 */}
                <div className="p-3.5 space-y-2 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-cyan-300 font-bold">{activeHeatNode.typeId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备ID:</span>
                    <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeHeatNode.code}>
                      {activeHeatNode.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeHeatNode.name}>
                      {activeHeatNode.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">锅炉故障:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.boilerFault}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">累计运行时间:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.runHours}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">累计运行时间初始值:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.runHoursInit}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">燃烧板报警输入信号:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.burnAlarmInput}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">燃烧器故障:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.burnerFault}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">炉水温度:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.furnaceWaterTemp}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">炉水温度传感器断路:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.waterTempSensorOpen}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">炉水温度高报警:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.waterTempHighAlarm}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">炉水温度传感器短路:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.waterTempSensorShort}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">炉水温度传感器故障:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.waterTempSensorFault}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">累计燃油时间:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.totalFuelTime}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">排烟温度:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.flueGasTemp}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">排烟温度高报警:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.flueGasHighAlarm}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">排烟温度传感器断路:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.flueGasSensorOpen}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">水流输入信号:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.waterFlowInput}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">燃气泄漏:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.gasLeakage}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">采暖温度:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.heatingTemp}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">采暖温度传感器断路:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeHeatNode.heatingTempSensorOpen}</span>
                  </div>
                </div>

                {/* Header 2: ■ 设备控制 */}
                <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备控制</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-4 bg-[#040e24]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-cyan-300 font-bold font-sans text-right truncate max-w-[170px]" title={activeHeatNode.name}>
                      {activeHeatNode.name}
                    </span>
                  </div>

                  {/* 燃烧自然条件输出 Toggle */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">燃烧自然条件输出:</span>
                    <button
                      onClick={() => {
                        const cur = heatBurnCondStates[activeHeatNode.id] ?? false;
                        const next = !cur;
                        setHeatBurnCondStates(prev => ({ ...prev, [activeHeatNode.id]: next }));
                        setArmToast(`${activeHeatNode.name} 燃烧自然条件输出已切换为 ${next ? 'ON' : 'OFF'}`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                        (heatBurnCondStates[activeHeatNode.id] ?? false)
                          ? 'bg-cyan-500 justify-end'
                          : 'bg-[#082252] border border-[#1d4c94] justify-start'
                      }`}
                    >
                      <span className={`text-[9px] font-mono font-bold px-1 ${
                        (heatBurnCondStates[activeHeatNode.id] ?? false) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                      }`}>
                        {(heatBurnCondStates[activeHeatNode.id] ?? false) ? 'ON' : 'OFF'}
                      </span>
                      <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                        (heatBurnCondStates[activeHeatNode.id] ?? false) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                      }`} />
                    </button>
                  </div>

                  {/* 热水1循环泵控制输出 Toggle */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">热水1循环泵控制输出:</span>
                    <button
                      onClick={() => {
                        const cur = heatPump1States[activeHeatNode.id] ?? false;
                        const next = !cur;
                        setHeatPump1States(prev => ({ ...prev, [activeHeatNode.id]: next }));
                        setArmToast(`${activeHeatNode.name} 热水1循环泵控制已切换为 ${next ? 'ON' : 'OFF'}`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                        (heatPump1States[activeHeatNode.id] ?? false)
                          ? 'bg-cyan-500 justify-end'
                          : 'bg-[#082252] border border-[#1d4c94] justify-start'
                      }`}
                    >
                      <span className={`text-[9px] font-mono font-bold px-1 ${
                        (heatPump1States[activeHeatNode.id] ?? false) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                      }`}>
                        {(heatPump1States[activeHeatNode.id] ?? false) ? 'ON' : 'OFF'}
                      </span>
                      <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                        (heatPump1States[activeHeatNode.id] ?? false) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                      }`} />
                    </button>
                  </div>

                  {/* 热水2循环泵控制输出 Toggle */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">热水2循环泵控制输出:</span>
                    <button
                      onClick={() => {
                        const cur = heatPump2States[activeHeatNode.id] ?? false;
                        const next = !cur;
                        setHeatPump2States(prev => ({ ...prev, [activeHeatNode.id]: next }));
                        setArmToast(`${activeHeatNode.name} 热水2循环泵控制已切换为 ${next ? 'ON' : 'OFF'}`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                        (heatPump2States[activeHeatNode.id] ?? false)
                          ? 'bg-cyan-500 justify-end'
                          : 'bg-[#082252] border border-[#1d4c94] justify-start'
                      }`}
                    >
                      <span className={`text-[9px] font-mono font-bold px-1 ${
                        (heatPump2States[activeHeatNode.id] ?? false) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                      }`}>
                        {(heatPump2States[activeHeatNode.id] ?? false) ? 'ON' : 'OFF'}
                      </span>
                      <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                        (heatPump2States[activeHeatNode.id] ?? false) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                      }`} />
                    </button>
                  </div>

                  {/* 全部设定 Full-width Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setArmToast(`${activeHeatNode.name} 全项热源控制指令已下发`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                    >
                      全部设定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ==================== 冷源 RIGHT PANEL (Matching image_4f38e8f3.png) ==================== */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header 1: ■ 设备信息 */}
                <div className="p-3.5 space-y-2 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-cyan-300 font-bold">{activeCoolingNode.typeId}</span>
                  </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备ID:</span>
                  <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeCoolingNode.code}>
                    {activeCoolingNode.code}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeCoolingNode.name}>
                    {activeCoolingNode.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">故障告警:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.faultAlarm}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">手自动:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.manualAuto}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">防冻开关:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.freezeSwitch}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">二氧化碳:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.co2}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">热水阀调节反馈:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.hotWaterFeedback}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">新风湿度:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.freshHumidity}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">新风温度:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.freshTemp}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">变频反馈:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.freqFeedback}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">过滤网状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.filterStatus}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">新风阀开反馈:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.freshValveOpenFeedback}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">热水阀调节反馈:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.hotWaterValveRegFeedback}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">盘管低温报警:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.coilLowTempAlarm}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">回水温度:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.returnWaterTemp}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">回水湿度:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.returnWaterHumidity}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">送风温度:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.supplyWaterTemp}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">运行状态:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.runningStatus}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">供水温度:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.supplyTemp}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">水阀开关反馈:</span>
                  <span className="text-cyan-300 font-bold font-mono">{activeCoolingNode.waterValveSwitchFeedback}</span>
                </div>
              </div>

              {/* Header 2: ■ 设备控制 */}
              <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                  <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                  <span>设备控制</span>
                </div>
              </div>

              <div className="p-3.5 space-y-3.5 bg-[#040e24]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-cyan-300 font-bold font-sans text-right truncate max-w-[170px]" title={activeCoolingNode.name}>
                    {activeCoolingNode.name}
                  </span>
                </div>

                {/* 启动控制 Toggle */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">启动控制:</span>
                  <button
                    onClick={() => {
                      const cur = coolingPowerStates[activeCoolingNode.id] ?? false;
                      const next = !cur;
                      setCoolingPowerStates(prev => ({ ...prev, [activeCoolingNode.id]: next }));
                      setArmToast(`${activeCoolingNode.name} 启动控制已切换为 ${next ? 'ON' : 'OFF'}`);
                      setTimeout(() => setArmToast(''), 3000);
                    }}
                    className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                      (coolingPowerStates[activeCoolingNode.id] ?? false)
                        ? 'bg-cyan-500 justify-end'
                        : 'bg-[#082252] border border-[#1d4c94] justify-start'
                    }`}
                  >
                    <span className={`text-[9px] font-mono font-bold px-1 ${
                      (coolingPowerStates[activeCoolingNode.id] ?? false) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                    }`}>
                      {(coolingPowerStates[activeCoolingNode.id] ?? false) ? 'ON' : 'OFF'}
                    </span>
                    <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                      (coolingPowerStates[activeCoolingNode.id] ?? false) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                    }`} />
                  </button>
                </div>

                {/* 冷水阀调节控制 Stepper */}
                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 font-sans">冷水阀调节控制:</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                      <button
                        onClick={() => {
                          const cur = coolingValveVal[activeCoolingNode.id] || 0;
                          const next = Math.max(0, cur - 1).toFixed(2);
                          setCoolingValveVal(prev => ({ ...prev, [activeCoolingNode.id]: parseFloat(next) }));
                        }}
                        className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-xs">
                        {(coolingValveVal[activeCoolingNode.id] || 0).toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          const cur = coolingValveVal[activeCoolingNode.id] || 0;
                          const next = (cur + 1).toFixed(2);
                          setCoolingValveVal(prev => ({ ...prev, [activeCoolingNode.id]: parseFloat(next) }));
                        }}
                        className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setArmToast(`${activeCoolingNode.name} 冷水阀开度已设定为 ${(coolingValveVal[activeCoolingNode.id] || 0).toFixed(2)}%`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                    >
                      设定
                    </button>
                  </div>
                </div>

                {/* 变频调节 Stepper */}
                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 font-sans">变频调节:</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                      <button
                        onClick={() => {
                          const cur = coolingFreqVal[activeCoolingNode.id] || 0;
                          const next = Math.max(0, cur - 1).toFixed(2);
                          setCoolingFreqVal(prev => ({ ...prev, [activeCoolingNode.id]: parseFloat(next) }));
                        }}
                        className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-xs">
                        {(coolingFreqVal[activeCoolingNode.id] || 0).toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          const cur = coolingFreqVal[activeCoolingNode.id] || 0;
                          const next = (cur + 1).toFixed(2);
                          setCoolingFreqVal(prev => ({ ...prev, [activeCoolingNode.id]: parseFloat(next) }));
                        }}
                        className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setArmToast(`${activeCoolingNode.name} 变频频率已设定为 ${(coolingFreqVal[activeCoolingNode.id] || 0).toFixed(2)}Hz`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                    >
                      设定
                    </button>
                  </div>
                </div>

                {/* 全部设定 Full-width Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setArmToast(`${activeCoolingNode.name} 全项冷热源控制指令已下发`);
                      setTimeout(() => setArmToast(''), 3000);
                    }}
                    className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                  >
                    全部设定
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : activeSubsystem === '给排水' ? (
          activeTertiaryMenu === '恒压供水' ? (
            /* ==================== 恒压供水 RIGHT PANEL (Matching exact image_d9c0c70b.png) ==================== */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header 1: ■ 设备信息 */}
                <div className="p-3.5 space-y-3 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-cyan-300 font-bold">{activeWaterNode.typeId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备ID:</span>
                    <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[170px]" title={activeWaterNode.code}>
                      {activeWaterNode.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans font-bold text-[11px] text-right truncate max-w-[170px]" title={activeWaterNode.name}>
                      {activeWaterNode.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">故障告警:</span>
                    <span className={`font-bold font-mono ${activeWaterNode.faultAlarm === '故障' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {activeWaterNode.faultAlarm}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">手自动:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeWaterNode.manualAuto}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">运行状态:</span>
                    <span className={`font-bold font-mono ${activeWaterNode.runStatus === '运行' || activeWaterNode.runStatus === '恒压运行' ? 'text-teal-400' : 'text-slate-400'}`}>
                      {activeWaterNode.runStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">变频反馈:</span>
                    <span className="text-cyan-300 font-bold font-mono">{activeWaterNode.freqFeedback}</span>
                  </div>
                </div>

                {/* Header 2: ■ 设备控制 */}
                <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备控制</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-4 bg-[#040e24]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-cyan-300 font-bold font-sans text-right truncate max-w-[170px]" title={activeWaterNode.name}>
                      {activeWaterNode.name}
                    </span>
                  </div>

                  {/* 启停控制 Toggle Switch matching image_d9c0c70b.png */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">启停控制:</span>
                    <button
                      onClick={() => {
                        const cur = waterPumpPowerStates[activeWaterNode.id] ?? false;
                        const next = !cur;
                        setWaterPumpPowerStates(prev => ({ ...prev, [activeWaterNode.id]: next }));
                        setArmToast(`${activeWaterNode.name} 启停控制已切换为 ${next ? 'ON' : 'OFF'}`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                        (waterPumpPowerStates[activeWaterNode.id] ?? false)
                          ? 'bg-cyan-500 justify-end'
                          : 'bg-[#082252] border border-[#1d4c94] justify-start'
                      }`}
                    >
                      <span className={`text-[9px] font-mono font-bold px-1 ${
                        (waterPumpPowerStates[activeWaterNode.id] ?? false) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                      }`}>
                        {(waterPumpPowerStates[activeWaterNode.id] ?? false) ? 'ON' : 'OFF'}
                      </span>
                      <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                        (waterPumpPowerStates[activeWaterNode.id] ?? false) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                      }`} />
                    </button>
                  </div>

                  {/* 变频调节 Stepper matching image_d9c0c70b.png */}
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400 font-sans">变频调节:</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center bg-[#020d26] rounded border border-[#143d7c] font-mono text-cyan-300 overflow-hidden">
                        <button
                          onClick={() => {
                            const cur = waterFreqVal[activeWaterNode.id] || 0;
                            const next = Math.max(0, cur - 1).toFixed(2);
                            setWaterFreqVal(prev => ({ ...prev, [activeWaterNode.id]: parseFloat(next) }));
                          }}
                          className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-xs">
                          {(waterFreqVal[activeWaterNode.id] || 0).toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            const cur = waterFreqVal[activeWaterNode.id] || 0;
                            const next = (cur + 1).toFixed(2);
                            setWaterFreqVal(prev => ({ ...prev, [activeWaterNode.id]: parseFloat(next) }));
                          }}
                          className="px-2 py-0.5 text-slate-400 hover:text-white hover:bg-[#072458]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setArmToast(`${activeWaterNode.name} 变频频率已设定为 ${(waterFreqVal[activeWaterNode.id] || 0).toFixed(2)}Hz`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="px-3 py-1 bg-[#092d68] hover:bg-[#0e3a84] text-cyan-300 border border-cyan-500/60 rounded text-xs font-bold transition-all cursor-pointer"
                      >
                        设定
                      </button>
                    </div>
                  </div>

                  {/* 全部设定 Full-width Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setArmToast(`${activeWaterNode.name} 全项给排水控制指令已下发`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                    >
                      全部设定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ==================== 排水 RIGHT PANEL (Matching exact image_690af10a.png) ==================== */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header 1: ■ 设备信息 */}
                <div className="p-3.5 space-y-2.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备类型ID:</span>
                    <span className="text-slate-200 font-mono">{activeDrainageNode.typeId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备ID:</span>
                    <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={activeDrainageNode.code}>
                      {activeDrainageNode.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={activeDrainageNode.name}>
                      {activeDrainageNode.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">手自动:</span>
                    <span className="text-slate-200 font-sans">{activeDrainageNode.manualAuto}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">故障告警:</span>
                    <span className={`font-sans ${activeDrainageNode.faultAlarm === '故障' ? 'text-red-400 font-bold' : 'text-slate-200'}`}>
                      {activeDrainageNode.faultAlarm}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">运行状态:</span>
                    <span className="text-slate-200 font-mono">
                      {activeDrainageNode.runStatus}
                    </span>
                  </div>
                </div>

                {/* Header 2: ■ 设备控制 */}
                <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                    <span>设备控制</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-4 bg-[#040e24]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">设备名称:</span>
                    <span className="text-slate-200 font-sans text-right truncate max-w-[170px]" title={activeDrainageNode.name}>
                      {activeDrainageNode.name}
                    </span>
                  </div>

                  {/* 启停控制 Toggle Switch matching image_690af10a.png */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">启停控制:</span>
                    <button
                      onClick={() => {
                        const cur = drainagePowerStates[activeDrainageNode.id] ?? false;
                        const next = !cur;
                        setDrainagePowerStates(prev => ({ ...prev, [activeDrainageNode.id]: next }));
                        setArmToast(`${activeDrainageNode.name} 启停控制已切换为 ${next ? 'ON' : 'OFF'}`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                        (drainagePowerStates[activeDrainageNode.id] ?? false)
                          ? 'bg-cyan-500 justify-end'
                          : 'bg-[#082252] border border-[#1d4c94] justify-start'
                      }`}
                    >
                      <span className={`text-[9px] font-mono font-bold px-1 ${
                        (drainagePowerStates[activeDrainageNode.id] ?? false) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                      }`}>
                        {(drainagePowerStates[activeDrainageNode.id] ?? false) ? 'ON' : 'OFF'}
                      </span>
                      <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                        (drainagePowerStates[activeDrainageNode.id] ?? false) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                      }`} />
                    </button>
                  </div>

                  {/* 全部设定 Full-width Button matching image_690af10a.png */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setArmToast(`${activeDrainageNode.name} 全部控制参数设定成功`);
                        setTimeout(() => setArmToast(''), 3000);
                      }}
                      className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                    >
                      全部设定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : activeSubsystem === '变配电' ? (
          /* ==================== 变配电 RIGHT PANEL (Matching exact image_22b861ef.png) ==================== */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header 1: ■ 设备信息 */}
              <div className="p-3.5 space-y-2.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备类型ID:</span>
                  <span className="text-slate-200 font-mono">{activePowerNode.typeId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备ID:</span>
                  <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={activePowerNode.code}>
                    {activePowerNode.code}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={activePowerNode.name}>
                    {activePowerNode.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">故障告警:</span>
                  <span className={`font-sans ${activePowerNode.faultAlarm === '故障' ? 'text-red-400 font-bold' : 'text-slate-200'}`}>
                    {activePowerNode.faultAlarm}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">手自动:</span>
                  <span className="text-slate-200 font-sans">{activePowerNode.manualAuto}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">开关状态:</span>
                  <span className="text-slate-200 font-sans">
                    {activePowerNode.switchStatus}
                  </span>
                </div>
              </div>

              {/* Header 2: ■ 设备控制 */}
              <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                  <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                  <span>设备控制</span>
                </div>
              </div>

              <div className="p-3.5 space-y-4 bg-[#040e24]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-slate-200 font-sans text-right truncate max-w-[170px]" title={activePowerNode.name}>
                    {activePowerNode.name}
                  </span>
                </div>

                {/* 启停控制 Toggle Switch matching image_22b861ef.png */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">启停控制:</span>
                  <button
                    onClick={() => {
                      const cur = powerSwitchStates[activePowerNode.id] ?? false;
                      const next = !cur;
                      setPowerSwitchStates(prev => ({ ...prev, [activePowerNode.id]: next }));
                      setArmToast(`${activePowerNode.name} 启停控制已切换为 ${next ? 'ON' : 'OFF'}`);
                      setTimeout(() => setArmToast(''), 3000);
                    }}
                    className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                      (powerSwitchStates[activePowerNode.id] ?? false)
                        ? 'bg-cyan-500 justify-end'
                        : 'bg-[#082252] border border-[#1d4c94] justify-start'
                    }`}
                  >
                    <span className={`text-[9px] font-mono font-bold px-1 ${
                      (powerSwitchStates[activePowerNode.id] ?? false) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                    }`}>
                      {(powerSwitchStates[activePowerNode.id] ?? false) ? 'ON' : 'OFF'}
                    </span>
                    <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                      (powerSwitchStates[activePowerNode.id] ?? false) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                    }`} />
                  </button>
                </div>

                {/* 全部设定 Full-width Button matching image_22b861ef.png */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setArmToast(`${activePowerNode.name} 全部变配电控制参数设定成功`);
                      setTimeout(() => setArmToast(''), 3000);
                    }}
                    className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                  >
                    全部设定
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeSubsystem === '电梯系统' ? (
          /* ==================== 电梯系统 RIGHT PANEL (直梯 / 斜梯) ==================== */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              {activeTertiaryMenu === '斜梯' ? (
                <>
                  {/* Header 1: ■ 设备信息 (斜梯) */}
                  <div className="p-3.5 space-y-2.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-slate-200 font-mono">{activeEscalator.typeId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={activeEscalator.code}>
                        {activeEscalator.code}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={activeEscalator.name}>
                        {activeEscalator.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">安装位置:</span>
                      <span className="text-slate-200 font-sans text-right truncate max-w-[170px]">{activeEscalator.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">运行方向:</span>
                      <span className="text-cyan-300 font-sans font-bold">
                        {escalatorDirStates[activeEscalator.id] || activeEscalator.direction}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">梯级速度:</span>
                      <span className="text-slate-200 font-mono">{activeEscalator.speed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">故障告警:</span>
                      <span className="text-slate-200 font-sans">{activeEscalator.faultAlarm}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">梳齿板保护:</span>
                      <span className="text-emerald-400 font-sans font-bold">{activeEscalator.combPlateSensor}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">扶手带同步:</span>
                      <span className="text-emerald-400 font-sans font-bold">{activeEscalator.handrailSync}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">梯级下陷保护:</span>
                      <span className="text-emerald-400 font-sans font-bold">{activeEscalator.stepSagSensor}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">客流量:</span>
                      <span className="text-cyan-300 font-mono font-bold">{activeEscalator.passengerCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">电机温度:</span>
                      <span className="text-slate-200 font-mono">{activeEscalator.motorTemp}</span>
                    </div>
                  </div>

                  {/* Header 2: ■ 设备控制 */}
                  <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备控制</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-4 bg-[#040e24]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-slate-200 font-sans text-right truncate max-w-[170px]" title={activeEscalator.name}>
                        {activeEscalator.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">启停控制:</span>
                      <button
                        onClick={() => {
                          const cur = escalatorRunStates[activeEscalator.id] ?? true;
                          const next = !cur;
                          setEscalatorRunStates(prev => ({ ...prev, [activeEscalator.id]: next }));
                          setArmToast(`${activeEscalator.name} 扶梯已切换为 ${next ? '启动运行' : '停止待机'}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                          (escalatorRunStates[activeEscalator.id] ?? true)
                            ? 'bg-cyan-500 justify-end'
                            : 'bg-[#082252] border border-[#1d4c94] justify-start'
                        }`}
                      >
                        <span className={`text-[9px] font-mono font-bold px-1 ${
                          (escalatorRunStates[activeEscalator.id] ?? true) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                        }`}>
                          {(escalatorRunStates[activeEscalator.id] ?? true) ? 'ON' : 'OFF'}
                        </span>
                        <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                          (escalatorRunStates[activeEscalator.id] ?? true) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">换向控制:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEscalatorDirStates(prev => ({ ...prev, [activeEscalator.id]: '上行' }));
                            setArmToast(`${activeEscalator.name} 运行方向已设定为上行`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                            (escalatorDirStates[activeEscalator.id] || activeEscalator.direction) === '上行'
                              ? 'bg-cyan-600 text-white shadow-[0_0_8px_#06b6d4]'
                              : 'bg-[#0c2452] text-slate-400 hover:text-white'
                          }`}
                        >
                          上行
                        </button>
                        <button
                          onClick={() => {
                            setEscalatorDirStates(prev => ({ ...prev, [activeEscalator.id]: '下行' }));
                            setArmToast(`${activeEscalator.name} 运行方向已设定为下行`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                            (escalatorDirStates[activeEscalator.id] || activeEscalator.direction) === '下行'
                              ? 'bg-cyan-600 text-white shadow-[0_0_8px_#06b6d4]'
                              : 'bg-[#0c2452] text-slate-400 hover:text-white'
                          }`}
                        >
                          下行
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setArmToast(`${activeEscalator.name} 扶梯群控参数设定已同步`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                      >
                        全部设定
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Header 1: ■ 设备信息 (直梯) */}
                  <div className="p-3.5 space-y-2.5 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-slate-200 font-mono">{activeElevator.typeId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={activeElevator.code}>
                        {activeElevator.code}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={activeElevator.name}>
                        {activeElevator.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">所在井道:</span>
                      <span className="text-slate-200 font-sans">{activeElevator.shaft}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">当前楼层:</span>
                      <span className="text-amber-400 font-mono font-black text-sm">{activeElevator.currentFloor}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">运行方向:</span>
                      <span className="text-cyan-300 font-sans font-bold">
                        {activeElevator.direction === 'UP' ? '上行 (▲)' : activeElevator.direction === 'DOWN' ? '下行 (▼)' : '平层待机 (■)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">开关门状态:</span>
                      <span className={`font-sans font-bold ${
                        (elevatorDoorStates[activeElevator.id] ?? (activeElevator.doorStatus === '开门')) ? 'text-amber-400' : 'text-slate-200'
                      }`}>
                        {(elevatorDoorStates[activeElevator.id] ?? (activeElevator.doorStatus === '开门')) ? '开门中' : '已关门'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">轿厢载重:</span>
                      <span className="text-cyan-300 font-mono font-bold">{activeElevator.loadKg} ({activeElevator.loadPercent}%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">额定载重:</span>
                      <span className="text-slate-200 font-mono">{activeElevator.ratedLoad}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">轿厢速度:</span>
                      <span className="text-slate-200 font-mono">{activeElevator.speed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">运行状态:</span>
                      <span className="text-emerald-400 font-sans font-bold">{activeElevator.runStatus}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">消防/检修:</span>
                      <span className="text-slate-200 font-sans">{activeElevator.fireMode} / {activeElevator.inspectionMode}</span>
                    </div>
                  </div>

                  {/* Header 2: ■ 设备控制 */}
                  <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备控制</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-4 bg-[#040e24]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-slate-200 font-sans text-right truncate max-w-[170px]" title={activeElevator.name}>
                        {activeElevator.name}
                      </span>
                    </div>

                    {/* 开关门控制 */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">开关门控制:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setElevatorDoorStates(prev => ({ ...prev, [activeElevator.id]: true }));
                            setArmToast(`${activeElevator.name} 已发送开门指令`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                            (elevatorDoorStates[activeElevator.id] ?? false)
                              ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_8px_#f59e0b]'
                              : 'bg-[#0c2452] text-slate-300 hover:text-white'
                          }`}
                        >
                          开门
                        </button>
                        <button
                          onClick={() => {
                            setElevatorDoorStates(prev => ({ ...prev, [activeElevator.id]: false }));
                            setArmToast(`${activeElevator.name} 已发送关门指令`);
                            setTimeout(() => setArmToast(''), 3000);
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                            !(elevatorDoorStates[activeElevator.id] ?? false)
                              ? 'bg-cyan-600 text-white shadow-[0_0_8px_#06b6d4]'
                              : 'bg-[#0c2452] text-slate-300 hover:text-white'
                          }`}
                        >
                          关门
                        </button>
                      </div>
                    </div>

                    {/* 启停控制 */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">启停锁梯:</span>
                      <button
                        onClick={() => {
                          const cur = elevatorRunStates[activeElevator.id] ?? true;
                          const next = !cur;
                          setElevatorRunStates(prev => ({ ...prev, [activeElevator.id]: next }));
                          setArmToast(`${activeElevator.name} 已切换为 ${next ? '投入运行' : '锁梯驻停'}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className={`w-14 h-6 rounded-full p-0.5 transition-all relative flex items-center cursor-pointer shadow-inner ${
                          (elevatorRunStates[activeElevator.id] ?? true)
                            ? 'bg-cyan-500 justify-end'
                            : 'bg-[#082252] border border-[#1d4c94] justify-start'
                        }`}
                      >
                        <span className={`text-[9px] font-mono font-bold px-1 ${
                          (elevatorRunStates[activeElevator.id] ?? true) ? 'text-slate-950 mr-3' : 'text-cyan-300 ml-3'
                        }`}>
                          {(elevatorRunStates[activeElevator.id] ?? true) ? 'ON' : 'OFF'}
                        </span>
                        <span className={`absolute w-4 h-4 rounded-full shadow-md transition-all ${
                          (elevatorRunStates[activeElevator.id] ?? true) ? 'bg-white right-1' : 'bg-cyan-400 left-1'
                        }`} />
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setArmToast(`${activeElevator.name} 直梯联动控制参数设定成功`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                      >
                        全部设定
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (activeSubsystem === '能耗' || activeSubsystem === '能耗计量') ? (
          /* ==================== 能耗 RIGHT PANEL (电表 / 水表) ==================== */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              {activeTertiaryMenu === '水表' ? (
                <>
                  {/* Header 1: ■ 设备信息 (能耗计量 - 楼层水表 matching image_a512739a.png) */}
                  <div className="p-3.5 space-y-3.5 text-xs font-mono bg-[#05112c]/80">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-slate-200 font-mono">DTY_SPGASY</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={currentFloorWaterCode}>
                        {currentFloorWaterCode}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={currentFloorWaterName}>
                        {currentFloorWaterName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">告警状态:</span>
                      <span className="text-slate-200 font-mono">0</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">故障告警:</span>
                      <span className="text-slate-200 font-mono">0</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">当前表值:</span>
                      <span className="text-slate-200 font-mono font-bold">{currentFloorWaterReading}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">上月能耗:</span>
                      <span className="text-slate-200 font-mono font-bold">{currentFloorWaterPrevReading}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">绑定空间:</span>
                      <span className="text-slate-200 font-mono font-bold">{currentFloorWaterSpace}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Header 1: ■ 设备信息 (能耗计量 - 楼层电表 matching image_10698de3.png) */}
                  <div className="p-3.5 space-y-3.5 text-xs font-mono bg-[#05112c]/80">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-slate-200 font-mono">DTY_SPGASY</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={currentFloorMeterCode}>
                        {currentFloorMeterCode}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={currentFloorMeterName}>
                        {currentFloorMeterName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">告警状态:</span>
                      <span className="text-slate-200 font-mono">0</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">故障告警:</span>
                      <span className="text-slate-200 font-mono">0</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">当前表值:</span>
                      <span className="text-slate-200 font-mono font-bold">{currentFloorMeterReading}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">上月能耗:</span>
                      <span className="text-slate-200 font-mono font-bold">{currentFloorMeterPrevReading}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">绑定空间:</span>
                      <span className="text-slate-200 font-mono font-bold">{currentFloorMeterSpace}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : activeSubsystem === '信息网络' ? (
          /* ==================== 信息网络 RIGHT PANEL (信息发布 / 音乐广播) ==================== */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              {activeTertiaryMenu === '音乐广播' ? (
                <>
                  {/* Header 1: ■ 设备信息 (音乐广播 matching screenshot image_c10ff38d.png) */}
                  <div className="p-3.5 space-y-3.5 text-xs font-mono bg-[#05112c]/80">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-slate-200 font-mono">DTY_SPGASY</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={activeBroadcastNode.code}>
                        {activeBroadcastNode.code}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={activeBroadcastNode.name}>
                        {activeBroadcastNode.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">播报内容:</span>
                      <span className="text-slate-200 font-sans">{activeBroadcastNode.broadcastContent}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">运行状态:</span>
                      <span className="text-slate-200 font-mono">{activeBroadcastNode.runStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">在线状态:</span>
                      <span className="text-emerald-400 font-sans font-bold">{activeBroadcastNode.onlineStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">节目列表:</span>
                      <span className="text-slate-200 font-sans text-right truncate max-w-[160px] font-bold">
                        {broadcastProgramState[activeBroadcastNode.id] || activeBroadcastNode.programList}
                      </span>
                    </div>
                  </div>

                  {/* Header 2: ■ 设备控制 */}
                  <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备控制</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-4 bg-[#040e24]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-slate-200 font-sans text-right truncate max-w-[170px]" title={activeBroadcastNode.name}>
                        {activeBroadcastNode.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">节目列表:</span>
                      <select
                        value={broadcastProgramState[activeBroadcastNode.id] || activeBroadcastNode.programList}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBroadcastProgramState(prev => ({ ...prev, [activeBroadcastNode.id]: val }));
                          setArmToast(`${activeBroadcastNode.name} 节目设定为: ${val}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="w-32 bg-[#06183d] border border-[#133d7a] text-cyan-300 text-xs rounded px-2 py-1 outline-none focus:border-cyan-400"
                      >
                        <option value="主国歌">主国歌</option>
                        <option value="园区背景音乐_轻音乐">园区背景音乐_轻音乐</option>
                        <option value="早间播报">早间播报</option>
                        <option value="午间音乐">午间音乐</option>
                        <option value="下播通知">下播通知</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">音量调节:</span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[#00f0ff] font-mono font-bold text-xs">
                          {(broadcastVolumeState[activeBroadcastNode.id] ?? activeBroadcastNode.volume)}%
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={broadcastVolumeState[activeBroadcastNode.id] ?? activeBroadcastNode.volume}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBroadcastVolumeState(prev => ({ ...prev, [activeBroadcastNode.id]: val }));
                          }}
                          className="w-24 accent-[#00f0ff] cursor-pointer h-1 bg-[#0a2354] rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setArmToast(`${activeBroadcastNode.name} 全部设定成功`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="w-full py-1.5 rounded-full border border-cyan-400/80 text-cyan-300 text-xs font-medium hover:bg-cyan-400/10 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                      >
                        全部设定
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Header 1: ■ 设备信息 (信息发布 matching screenshot image_7bb44dd5.png) */}
                  <div className="p-3.5 space-y-3.5 text-xs font-mono bg-[#05112c]/80">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备类型ID:</span>
                      <span className="text-slate-200 font-mono">DTY_SPGASY</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备ID:</span>
                      <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={activeSignageNode.code}>
                        {activeSignageNode.code}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={activeSignageNode.name}>
                        {activeSignageNode.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">播报内容:</span>
                      <span className="text-slate-200 font-sans">{activeSignageNode.broadcastContent}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">运行状态:</span>
                      <span className="text-slate-200 font-mono">{activeSignageNode.runStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">在线状态:</span>
                      <span className="text-emerald-400 font-sans font-bold">{activeSignageNode.onlineStatus}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">节目列表:</span>
                      <span className="text-slate-200 font-sans text-right truncate max-w-[160px] font-bold">
                        {signageProgramState[activeSignageNode.id] || activeSignageNode.programList}
                      </span>
                    </div>
                  </div>

                  {/* Header 2: ■ 设备控制 */}
                  <div className="h-10 bg-[#081d4a] border-y border-[#133063] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                      <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                      <span>设备控制</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-4 bg-[#040e24]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">设备名称:</span>
                      <span className="text-slate-200 font-sans text-right truncate max-w-[170px]" title={activeSignageNode.name}>
                        {activeSignageNode.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">节目列表:</span>
                      <select
                        value={signageProgramState[activeSignageNode.id] || activeSignageNode.programList}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSignageProgramState(prev => ({ ...prev, [activeSignageNode.id]: val }));
                          setArmToast(`${activeSignageNode.name} 节目已更新为 ${val}`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="bg-[#071b42] border border-[#164484] text-cyan-200 text-xs rounded px-2.5 py-1 outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        <option value="主国歌">主国歌</option>
                        <option value="园区宣传视听_V2">园区宣传视听_V2</option>
                        <option value="迎宾欢迎致辞_V1">迎宾欢迎致辞_V1</option>
                        <option value="安全消防提示_V3">安全消防提示_V3</option>
                        <option value="日常通知简讯">日常通知简讯</option>
                        <option value="紧急避险广播">紧急避险广播</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setArmToast(`${activeSignageNode.name} 信息发布节目单参数设置已同步`);
                          setTimeout(() => setArmToast(''), 3000);
                        }}
                        className="w-full py-2 bg-[#051f49] hover:bg-[#0a2e6b] text-cyan-300 hover:text-white border border-cyan-500/80 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
                      >
                        全部设定
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* ==================== 视频监控 / 摄像机 (WITH RESTORED 设备信息 PANEL) ==================== */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header 1: ■ 设备信息 (Restored as requested!) */}
              <div className="p-3.5 space-y-2 text-xs font-mono bg-[#05112c]/80 border-b border-[#133063]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备类型ID:</span>
                  <span className="text-slate-200 font-mono">DTY_CAMERA_IPC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备ID:</span>
                  <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={activeCamera.code}>
                    {activeCamera.code}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">设备名称:</span>
                  <span className="text-white font-sans text-[11px] text-right truncate max-w-[170px]" title={activeCamera.name}>
                    {activeCamera.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">故障告警:</span>
                  <span className="text-slate-200 font-mono">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">手自动:</span>
                  <span className="text-slate-200 font-sans">自动</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">在线状态:</span>
                  <span className="text-emerald-400 font-bold font-mono">在线</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">安装位置:</span>
                  <span className="text-cyan-300 font-sans text-right truncate max-w-[170px]">{activeCamera.locationLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">IP地址:</span>
                  <span className="text-slate-200 font-mono">192.168.10.{activeCamera.id.replace(/\D/g, '') || '88'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">分辨率:</span>
                  <span className="text-slate-200 font-mono">1920×1080 (1080P)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">编码/帧率:</span>
                  <span className="text-slate-200 font-mono">H.265 / 25 FPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">录像状态:</span>
                  <span className="text-cyan-300 font-mono">持续录像中</span>
                </div>
              </div>

              {/* Header 2: ■ 实时监视 */}
              <div className="h-10 bg-[#081d4a] border-b border-[#133063] px-3.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 tracking-wider">
                  <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                  <span>实时监视</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  {activeCamera.locationLabel}
                </span>
              </div>

              <div className="p-3.5 space-y-3 bg-[#040e24]">
                <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.35)] bg-black h-44 flex items-center justify-center group">
                  <img
                    src={activeCamera.videoUrl}
                    alt={activeCamera.name}
                    className="w-full h-full object-cover filter contrast-110 brightness-105 transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.3))] bg-[length:100%_4px] pointer-events-none opacity-40" />

                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                  <div className="absolute top-1/3 left-1/3 w-20 h-20 border border-emerald-400/80 rounded bg-emerald-500/10 pointer-events-none flex flex-col justify-between p-1">
                    <span className="text-[8px] font-mono text-emerald-300 font-bold bg-black/70 px-1 rounded">Target #882</span>
                    <span className="text-[8px] font-mono text-emerald-400 self-end">99.4%</span>
                  </div>

                  <div className="absolute top-2 left-3 px-2 py-0.5 rounded bg-black/80 text-red-400 font-mono text-[9.5px] flex items-center gap-1 border border-red-500/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>REC 🔴 {activeCamera.code.slice(-7)}</span>
                  </div>

                  <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/85 text-cyan-300 font-mono text-[10px] border border-cyan-500/40 shadow">
                    {currentTimeStr}
                  </div>

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/80 flex items-center justify-center text-white shadow-xl">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setArmToast(`${activeCamera.name} 云台遥控功能已就绪`);
                      setTimeout(() => setArmToast(''), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)] border border-cyan-400 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>云台遥控</span>
                  </button>
                  <button
                    onClick={() => onOpenDevice(devices[0])}
                    className="px-3 py-1.5 rounded-lg bg-[#0a2354] hover:bg-[#0f3277] text-cyan-300 font-bold text-xs transition-all border border-[#1d4c94] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    <span>全屏监视</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

    </div>
  );
};


