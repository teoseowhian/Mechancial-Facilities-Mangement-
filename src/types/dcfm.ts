/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UnitSystem = 'imperial' | 'metric';

export type ContainmentType = 'cold_aisle' | 'hot_aisle' | 'open_aisle';

export type CoolingSystemType = 
  | 'chilled_water_crah'
  | 'direct_expansion_crac'
  | 'inrow_chw'
  | 'direct_liquid_hybrid';

export type RedundancyScheme = 'N' | 'N+1' | 'N+2' | '2N' | '2(N+1)';

export type AshraeClass = 'A1_Recommended' | 'A1_Allowable' | 'A2' | 'A3' | 'A4' | 'Out_of_Spec';

export interface ServerRack {
  id: string;
  name: string;
  row: string;
  position: number;
  itLoadKw: number;
  rackUnits: number;
  deltaTF: number; // Air delta T in °F
  targetSatF: number; // Supply air temp target °F
  actualCfmNeeded: number;
  tileCfmDelivered: number;
  status: 'optimal' | 'warning' | 'critical';
}

export interface FacilityProfile {
  name: string;
  totalItLoadKw: number;
  roomLengthFt: number;
  roomWidthFt: number;
  ceilingHeightFt: number;
  raisedFloorHeightIn: number;
  plenumStaticPressureInWg: number;
  tilePerforationPercent: number; // e.g. 25, 40, 56
  tileDischargeCoeff: number; // typical 0.65 - 0.75
  tileCount: number;
  rackCount: number;
  containment: ContainmentType;
  supplyAirTempF: number;
  returnAirTempF: number;
  ambientOutdoorTempF: number;
  ambientOutdoorRh: number;
}

export interface CoolingPlantSpec {
  systemType: CoolingSystemType;
  chillerCapacityTons: number;
  chillerEfficiencyKwPerTon: number; // e.g. 0.55 kW/Ton
  chillerCountRunning: number;
  redundancy: RedundancyScheme;
  chwSupplyTempF: number;
  chwReturnTempF: number;
  crahUnitCapacityKw: number;
  crahUnitCfm: number;
  crahFanMotorKw: number;
  crahFanType: 'ec_fan' | 'vfd_centrifugal' | 'belt_driven';
  crahCount: number;
  pumpEfficiencyPercent: number;
  coolingTowerKwPerTon: number;
  thermalStorageGallons: number;
}

export interface DuctSpec {
  id: string;
  tag: string;
  service: 'supply_main' | 'supply_branch' | 'return_duct' | 'battery_exhaust' | 'generator_ventilation';
  airflowCfm: number;
  targetVelocityFpm: number;
  frictionRateInWgPer100Ft: number;
  roundDiameterIn: number;
  rectWidthIn: number;
  rectHeightIn: number;
  lengthFt: number;
  material: 'galvanized_steel' | 'aluminum' | 'stainless_steel';
}

export interface PsychrometricState {
  label: string;
  dryBulbF: number;
  relativeHumidity: number;
  dewPointF: number;
  wetBulbF: number;
  enthalpyBtuPerLb: number;
  humidityRatioLbPerLb: number;
  ashraeCategory: AshraeClass;
}

export interface MaintenanceCheckItem {
  id: string;
  equipmentTag: string;
  equipmentType: 'Chiller' | 'CRAH' | 'Pump' | 'Cooling Tower' | 'Duct / Filter' | 'Thermal Storage';
  task: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  lastDone: string;
  nextDue: string;
  status: 'nominal' | 'due_soon' | 'overdue';
  metricValue?: string;
}
