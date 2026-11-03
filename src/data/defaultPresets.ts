/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FacilityProfile, CoolingPlantSpec, ServerRack, DuctSpec, MaintenanceCheckItem } from '../types/dcfm';
import { calculateAirflowCfm, calculateTileCfm } from '../utils/engineeringMath';

export interface DataCenterPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  facility: FacilityProfile;
  coolingPlant: CoolingPlantSpec;
}

export const FACILITY_PRESETS: DataCenterPreset[] = [
  {
    id: 'hyperscale_ai',
    name: 'Hyperscale AI & High-Density Cluster',
    category: 'High-Density / AI',
    description: 'High-density GPU/AI server environment (24 kW avg per rack) with cold aisle containment and high delta-T chilled water loop.',
    facility: {
      name: 'Delta-9 AI Hall A',
      totalItLoadKw: 3840,
      roomLengthFt: 140,
      roomWidthFt: 90,
      ceilingHeightFt: 18,
      raisedFloorHeightIn: 36,
      plenumStaticPressureInWg: 0.12,
      tilePerforationPercent: 56, // Tate GrateAire style
      tileDischargeCoeff: 0.72,
      tileCount: 160,
      rackCount: 160,
      containment: 'cold_aisle',
      supplyAirTempF: 68,
      returnAirTempF: 96,
      ambientOutdoorTempF: 88,
      ambientOutdoorRh: 65,
    },
    coolingPlant: {
      systemType: 'chilled_water_crah',
      chillerCapacityTons: 600,
      chillerEfficiencyKwPerTon: 0.52,
      chillerCountRunning: 2,
      redundancy: 'N+1',
      chwSupplyTempF: 50,
      chwReturnTempF: 64,
      crahUnitCapacityKw: 250,
      crahUnitCfm: 24000,
      crahFanMotorKw: 11.2,
      crahFanType: 'ec_fan',
      crahCount: 18,
      pumpEfficiencyPercent: 82,
      coolingTowerKwPerTon: 0.035,
      thermalStorageGallons: 45000,
    },
  },
  {
    id: 'enterprise_tier3',
    name: 'Enterprise Tier-III Enterprise Hall',
    category: 'Enterprise / Colocation',
    description: 'Classic enterprise data center with 6 kW - 8 kW server racks, raised floor plenum air delivery, and N+1 CRAH redundancy.',
    facility: {
      name: 'Enterprise DC Hall 2',
      totalItLoadKw: 1200,
      roomLengthFt: 100,
      roomWidthFt: 60,
      ceilingHeightFt: 14,
      raisedFloorHeightIn: 24,
      plenumStaticPressureInWg: 0.08,
      tilePerforationPercent: 40,
      tileDischargeCoeff: 0.68,
      tileCount: 180,
      rackCount: 150,
      containment: 'cold_aisle',
      supplyAirTempF: 70,
      returnAirTempF: 92,
      ambientOutdoorTempF: 84,
      ambientOutdoorRh: 60,
    },
    coolingPlant: {
      systemType: 'chilled_water_crah',
      chillerCapacityTons: 450,
      chillerEfficiencyKwPerTon: 0.58,
      chillerCountRunning: 1,
      redundancy: 'N+1',
      chwSupplyTempF: 48,
      chwReturnTempF: 58,
      crahUnitCapacityKw: 180,
      crahUnitCfm: 18000,
      crahFanMotorKw: 9.5,
      crahFanType: 'ec_fan',
      crahCount: 8,
      pumpEfficiencyPercent: 80,
      coolingTowerKwPerTon: 0.04,
      thermalStorageGallons: 20000,
    },
  },
  {
    id: 'edge_modular',
    name: 'Edge Modular Micro-DC',
    category: 'Edge & In-Row',
    description: 'Compact 320 kW modular containerized data center utilizing close-coupled in-row cooling with hot aisle containment.',
    facility: {
      name: 'Edge Point Alpha',
      totalItLoadKw: 320,
      roomLengthFt: 45,
      roomWidthFt: 25,
      ceilingHeightFt: 11,
      raisedFloorHeightIn: 18,
      plenumStaticPressureInWg: 0.06,
      tilePerforationPercent: 25,
      tileDischargeCoeff: 0.65,
      tileCount: 40,
      rackCount: 32,
      containment: 'hot_aisle',
      supplyAirTempF: 72,
      returnAirTempF: 98,
      ambientOutdoorTempF: 92,
      ambientOutdoorRh: 50,
    },
    coolingPlant: {
      systemType: 'inrow_chw',
      chillerCapacityTons: 120,
      chillerEfficiencyKwPerTon: 0.65,
      chillerCountRunning: 1,
      redundancy: 'N+1',
      chwSupplyTempF: 52,
      chwReturnTempF: 66,
      crahUnitCapacityKw: 60,
      crahUnitCfm: 6500,
      crahFanMotorKw: 3.2,
      crahFanType: 'ec_fan',
      crahCount: 6,
      pumpEfficiencyPercent: 78,
      coolingTowerKwPerTon: 0.045,
      thermalStorageGallons: 5000,
    },
  },
];

export function generateSampleRacks(count: number = 24, avgKw: number = 12): ServerRack[] {
  const racks: ServerRack[] = [];
  const rows = ['A', 'B', 'C', 'D'];
  const racksPerRow = Math.ceil(count / rows.length);

  let currentIdx = 1;
  for (const row of rows) {
    for (let pos = 1; pos <= racksPerRow; pos++) {
      if (currentIdx > count) break;
      // introduce slight realistic variation
      const kwOffset = ((currentIdx * 7) % 9) - 4;
      const kw = Math.max(3, avgKw + kwOffset * 0.8);
      const deltaT = 24;
      const neededCfm = calculateAirflowCfm(kw, deltaT);
      const tileCfm = calculateTileCfm(0.10, 56);
      
      let status: 'optimal' | 'warning' | 'critical' = 'optimal';
      if (kw > 22 && tileCfm < neededCfm * 0.9) {
        status = 'critical';
      } else if (tileCfm < neededCfm) {
        status = 'warning';
      }

      racks.push({
        id: `rack-${row}-${pos}`,
        name: `Rack ${row}-${String(pos).padStart(2, '0')}`,
        row,
        position: pos,
        itLoadKw: Math.round(kw * 10) / 10,
        rackUnits: 42,
        deltaTF: deltaT,
        targetSatF: 68,
        actualCfmNeeded: neededCfm,
        tileCfmDelivered: tileCfm,
        status,
      });
      currentIdx++;
    }
  }

  return racks;
}

export const INITIAL_DUCT_SCHEDULE: DuctSpec[] = [
  {
    id: 'duct-1',
    tag: 'SM-01',
    service: 'supply_main',
    airflowCfm: 48000,
    targetVelocityFpm: 1800,
    frictionRateInWgPer100Ft: 0.08,
    roundDiameterIn: 68,
    rectWidthIn: 80,
    rectHeightIn: 48,
    lengthFt: 85,
    material: 'galvanized_steel',
  },
  {
    id: 'duct-2',
    tag: 'SB-01',
    service: 'supply_branch',
    airflowCfm: 12000,
    targetVelocityFpm: 1200,
    frictionRateInWgPer100Ft: 0.08,
    roundDiameterIn: 38,
    rectWidthIn: 46,
    rectHeightIn: 26,
    lengthFt: 40,
    material: 'galvanized_steel',
  },
  {
    id: 'duct-3',
    tag: 'RM-01',
    service: 'return_duct',
    airflowCfm: 48000,
    targetVelocityFpm: 1500,
    frictionRateInWgPer100Ft: 0.06,
    roundDiameterIn: 74,
    rectWidthIn: 90,
    rectHeightIn: 52,
    lengthFt: 90,
    material: 'galvanized_steel',
  },
  {
    id: 'duct-4',
    tag: 'EX-BATT',
    service: 'battery_exhaust',
    airflowCfm: 3200,
    targetVelocityFpm: 900,
    frictionRateInWgPer100Ft: 0.08,
    roundDiameterIn: 24,
    rectWidthIn: 28,
    rectHeightIn: 18,
    lengthFt: 65,
    material: 'stainless_steel',
  },
  {
    id: 'duct-5',
    tag: 'GEN-VENT',
    service: 'generator_ventilation',
    airflowCfm: 26000,
    targetVelocityFpm: 1600,
    frictionRateInWgPer100Ft: 0.10,
    roundDiameterIn: 54,
    rectWidthIn: 64,
    rectHeightIn: 38,
    lengthFt: 50,
    material: 'galvanized_steel',
  },
];

export const INITIAL_MAINTENANCE_SCHEDULE: MaintenanceCheckItem[] = [
  {
    id: 'maint-1',
    equipmentTag: 'CH-01',
    equipmentType: 'Chiller',
    task: 'Chilled water Delta-T and refrigerant subcooling/superheat log',
    frequency: 'Daily',
    lastDone: '2026-11-01',
    nextDue: '2026-11-02',
    status: 'nominal',
    metricValue: 'Delta-T: 14.1°F, KW/TR: 0.518',
  },
  {
    id: 'maint-2',
    equipmentTag: 'CRAH-01 to 06',
    equipmentType: 'CRAH',
    task: 'EC fan vibration baseline & coil differential pressure check',
    frequency: 'Monthly',
    lastDone: '2026-10-15',
    nextDue: '2026-11-15',
    status: 'nominal',
    metricValue: 'DP Coil: 0.38 in. wg (Clean)',
  },
  {
    id: 'maint-3',
    equipmentTag: 'CHWP-01',
    equipmentType: 'Pump',
    task: 'Mechanical seal leakage inspection & bearing thermography',
    frequency: 'Quarterly',
    lastDone: '2026-08-20',
    nextDue: '2026-11-20',
    status: 'due_soon',
    metricValue: 'Seal: Zero drip, Temp: 112°F',
  },
  {
    id: 'maint-4',
    equipmentTag: 'TES-TANK-01',
    equipmentType: 'Thermal Storage',
    task: 'Water stratification sensor calibration & valve fast-actuation stroke test',
    frequency: 'Quarterly',
    lastDone: '2026-08-01',
    nextDue: '2026-11-01',
    status: 'overdue',
    metricValue: 'Actuation time: 14.2s (Max 15s)',
  },
  {
    id: 'maint-5',
    equipmentTag: 'CT-01',
    equipmentType: 'Cooling Tower',
    task: 'Condenser water biocide & Legionella water chemistry check',
    frequency: 'Weekly',
    lastDone: '2026-10-28',
    nextDue: '2026-11-04',
    status: 'nominal',
    metricValue: 'TDS: 1120 ppm, pH: 8.2',
  },
  {
    id: 'maint-6',
    equipmentTag: 'FLT-HALL-A',
    equipmentType: 'Duct / Filter',
    task: 'MERV-13 filter bank differential pressure log',
    frequency: 'Monthly',
    lastDone: '2026-10-05',
    nextDue: '2026-11-05',
    status: 'due_soon',
    metricValue: 'DP: 0.62 in. wg (Dirty limit 1.0 in. wg)',
  },
];
