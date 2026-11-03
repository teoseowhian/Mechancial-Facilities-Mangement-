/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChillerHourlyRecord, MechVentRoom, WaterSupplyBuilding } from '../types/dcfmCourse';

/**
 * 1. Chiller Capacity Calculation
 * Formula: E = m_dot * Cp * DeltaT
 * Cp = 4.18 kJ/(kg * °C)
 * 1 RT = 3.517 kW
 */
export function calculateChillerCapacityKw(massFlowLps: number, deltaTC: number): {
  coolingKw: number;
  coolingRt: number;
  working: string;
} {
  const cp = 4.18; // kJ/kg·°C
  const coolingKw = massFlowLps * cp * deltaTC;
  const coolingRt = coolingKw / 3.517;

  const working = `Step 1: Apply formula E = ṁ × Cp × ΔT
  • ṁ (mass-flow rate) = ${massFlowLps} L/s (= kg/s for water)
  • Cp = 4.18 kJ/kg·°C
  • ΔT = ${deltaTC} °C
E = ${massFlowLps} × 4.18 × ${deltaTC} = ${coolingKw.toFixed(2)} kW
Step 2: Convert to Refrigeration Tons (1 RT = 3.517 kW)
Capacity = ${coolingKw.toFixed(2)} kW ÷ 3.517 kW/RT = ${coolingRt.toFixed(2)} RT`;

  return {
    coolingKw: Math.round(coolingKw * 100) / 100,
    coolingRt: Math.round(coolingRt * 100) / 100,
    working,
  };
}

/**
 * Chiller Efficiency (kW/RT and COP)
 */
export function calculateChillerEfficiency(inputElectricalKw: number, outputCoolingRt: number): {
  kwPerRt: number;
  cop: number;
  working: string;
} {
  if (outputCoolingRt <= 0) return { kwPerRt: 0, cop: 0, working: 'Invalid cooling output.' };

  const kwPerRt = inputElectricalKw / outputCoolingRt;
  const outputCoolingKw = outputCoolingRt * 3.517;
  const cop = inputElectricalKw > 0 ? outputCoolingKw / inputElectricalKw : 0;

  const working = `Step 1: Calculate Chiller Efficiency (kW/RT)
Formula: kW/RT = input electrical power (kW) ÷ output cooling (RT)
kW/RT = ${inputElectricalKw} kW ÷ ${outputCoolingRt} RT = ${kwPerRt.toFixed(3)} kW/RT

Step 2: Calculate Coefficient of Performance (COP)
Formula: COP = output cooling (kW) ÷ input electrical power (kW)
Output cooling = ${outputCoolingRt} RT × 3.517 = ${outputCoolingKw.toFixed(2)} kW
COP = ${outputCoolingKw.toFixed(2)} kW ÷ ${inputElectricalKw} kW = ${cop.toFixed(2)}
(Note: COP = 3.517 ÷ kW/RT = 3.517 ÷ ${kwPerRt.toFixed(3)} = ${cop.toFixed(2)})`;

  return {
    kwPerRt: Math.round(kwPerRt * 1000) / 1000,
    cop: Math.round(cop * 100) / 100,
    working,
  };
}

/**
 * 2. Green Mark (GM 2021) Part-Load Pump Power Polynomial
 * Formula: Ratio = 0.0205x + 0.4101x^2 + 0.5753x^3 where x = part load ratio
 */
export function calculateGm2021PartLoadPumpPower(fullLoadKw: number, partLoadFraction: number): {
  ratio: number;
  partLoadKw: number;
  percentReduction: number;
  working: string;
} {
  const x = Math.max(0.1, Math.min(1.0, partLoadFraction));
  const ratio = 0.0205 * x + 0.4101 * Math.pow(x, 2) + 0.5753 * Math.pow(x, 3);
  const partLoadKw = fullLoadKw * ratio;
  const percentReduction = (1 - ratio) * 100;

  const working = `Step 1: Apply Green Mark 2021 Guide Part-load Pump Power Ratio Formula:
Ratio = 0.0205x + 0.4101x² + 0.5753x³
where x = ${x.toFixed(2)}
Ratio = 0.0205(${x.toFixed(2)}) + 0.4101(${Math.pow(x, 2).toFixed(4)}) + 0.5753(${Math.pow(x, 3).toFixed(4)})
Ratio = ${(0.0205 * x).toFixed(5)} + ${(0.4101 * Math.pow(x, 2)).toFixed(5)} + ${(0.5753 * Math.pow(x, 3)).toFixed(5)}
Ratio = ${ratio.toFixed(4)}

Step 2: Compute Actual Part-Load Pump Power:
P_partload = ${ratio.toFixed(4)} × ${fullLoadKw} kW = ${partLoadKw.toFixed(2)} kW
Power Reduction = (1 - ${ratio.toFixed(4)}) × 100% = ${percentReduction.toFixed(1)}% reduction!`;

  return {
    ratio: Math.round(ratio * 10000) / 10000,
    partLoadKw: Math.round(partLoadKw * 10) / 10,
    percentReduction: Math.round(percentReduction * 10) / 10,
    working,
  };
}

/**
 * 3. Green Mark (GM 2021) Part-Load Cooling Tower Fan Power Polynomial
 * Formula: Ratio = 0.331629 - 0.885676x + 0.605565x^2 + 0.948482x^3
 */
export function calculateGm2021CoolingTowerFanPower(fullLoadKw: number, partLoadFraction: number): {
  ratio: number;
  partLoadKw: number;
  percentReduction: number;
  working: string;
} {
  const x = Math.max(0.1, Math.min(1.0, partLoadFraction));
  const ratio = 0.331629 - 0.885676 * x + 0.605565 * Math.pow(x, 2) + 0.948482 * Math.pow(x, 3);
  const partLoadKw = fullLoadKw * ratio;
  const percentReduction = (1 - ratio) * 100;

  const working = `Step 1: Apply Green Mark 2021 Cooling Tower Fan Power Ratio Formula:
Ratio = 0.331629 - 0.885676x + 0.605565x² + 0.948482x³
where x = ${x.toFixed(2)}
Ratio = 0.331629 - 0.885676(${x.toFixed(2)}) + 0.605565(${Math.pow(x, 2).toFixed(4)}) + 0.948482(${Math.pow(x, 3).toFixed(4)})
Ratio = ${ratio.toFixed(4)}

Step 2: Compute Actual Part-Load Fan Power:
P_CT = ${ratio.toFixed(4)} × ${fullLoadKw} kW = ${partLoadKw.toFixed(2)} kW
Power Reduction = (1 - ${ratio.toFixed(4)}) × 100% = ${percentReduction.toFixed(1)}% reduction!`;

  return {
    ratio: Math.round(ratio * 10000) / 10000,
    partLoadKw: Math.round(partLoadKw * 10) / 10,
    percentReduction: Math.round(percentReduction * 10) / 10,
    working,
  };
}

/**
 * 4. Fan/Pump Affinity Laws
 * P2 = P1 * (N2 / N1)^3
 */
export function calculateAffinityPowerReduction(initialPowerKw: number, speedRatio: number): {
  newPowerKw: number;
  percentReduction: number;
  working: string;
} {
  const newPowerKw = initialPowerKw * Math.pow(speedRatio, 3);
  const percentReduction = (1 - Math.pow(speedRatio, 3)) * 100;

  const working = `Step 1: State Affinity Law for Power
P₂ = P₁ × (N₂ / N₁)³
where Speed Ratio (N₂ / N₁) = ${speedRatio.toFixed(2)}

Step 2: Substitute Values
P₂ = ${initialPowerKw} kW × (${speedRatio.toFixed(2)})³ = ${initialPowerKw} × ${Math.pow(speedRatio, 3).toFixed(4)} = ${newPowerKw.toFixed(2)} kW
Power Saved = ${percentReduction.toFixed(1)}% (e.g. 20% speed drop gives 48.8% power reduction!)`;

  return {
    newPowerKw: Math.round(newPowerKw * 10) / 10,
    percentReduction: Math.round(percentReduction * 10) / 10,
    working,
  };
}

/**
 * 5. SS 553 : 2016 Mechanical Ventilation Air Change Rates
 */
export const SS553_MIN_ACH: Record<string, { ach: number; description: string }> = {
  office: { ach: 6, description: 'Offices (SS 553 Table 1)' },
  restaurant: { ach: 10, description: 'Restaurants & Canteens (SS 553 Table 1)' },
  shop: { ach: 6, description: 'Shops & Department Stores' },
  workshop: { ach: 6, description: 'Workshops & Factories' },
  classroom: { ach: 8, description: 'Classrooms' },
  car_park: { ach: 6, description: 'Basement Car Parks (at least 50% at low level ≤ 650mm)' },
  toilet: { ach: 10, description: 'Bathrooms, Toilets & Locker Rooms' },
  lobby: { ach: 4, description: 'Lobbies, Concourses, Corridors, Staircases & Exits (Exempt if < 10 m²)' },
  kitchen: { ach: 20, description: 'Commercial Kitchens (May reduce to 10 ACH when hood off)' },
};

export function calculateSs553Ventilation(room: MechVentRoom): {
  effectiveHeightM: number;
  roomVolumeM3: number;
  requiredAch: number;
  requiredFlowM3h: number;
  requiredFlowLps: number;
  working: string;
} {
  // SS 553 rule: Where ceiling exceeds 2.5 m, the air change rate will be calculated based on 2.5 ceiling height!
  const effectiveHeightM = Math.min(2.5, room.heightM);
  const roomVolumeM3 = room.lengthM * room.widthM * effectiveHeightM;

  let targetAch = SS553_MIN_ACH[room.roomType]?.ach || 6;
  if (room.roomType === 'kitchen' && room.hoodOperating === false) {
    targetAch = 10;
  }

  const requiredFlowM3h = roomVolumeM3 * targetAch;
  const requiredFlowLps = (requiredFlowM3h * 1000) / 3600;

  const working = `Step 1: Check Ceiling Height Constraint (SS 553 : 2016 Note (i))
Actual ceiling height = ${room.heightM} m
${room.heightM > 2.5 ? 'Ceiling exceeds 2.5 m -> compute on 2.5 m height.' : 'Ceiling ≤ 2.5 m -> use actual height.'}
Effective Height = ${effectiveHeightM} m

Step 2: Calculate Effective Volume
Volume = Length × Width × Effective Height
Volume = ${room.lengthM} × ${room.widthM} × ${effectiveHeightM} = ${roomVolumeM3.toFixed(1)} m³

Step 3: Determine Governing ACH (SS 553 : 2016 Table 1)
Space: ${room.roomType.toUpperCase()} -> ${targetAch} ACH
${room.roomType === 'kitchen' ? '(Commercial Kitchen: 20 ACH when hood runs, 10 ACH when off)' : ''}

Step 4: Compute Required Volume Flow Rate
Flow = Volume × ACH = ${roomVolumeM3.toFixed(1)} m³ × ${targetAch} = ${requiredFlowM3h.toFixed(1)} m³/h
Flow in L/s = ${requiredFlowM3h.toFixed(1)} ÷ 3.6 = ${requiredFlowLps.toFixed(2)} L/s (= ${(requiredFlowLps / 1000).toFixed(3)} m³/s)`;

  return {
    effectiveHeightM,
    roomVolumeM3: Math.round(roomVolumeM3 * 10) / 10,
    requiredAch: targetAch,
    requiredFlowM3h: Math.round(requiredFlowM3h * 10) / 10,
    requiredFlowLps: Math.round(requiredFlowLps * 10) / 10,
    working,
  };
}

/**
 * 6. Staircase Pressurisation Door Force Calculator
 * Ft = Fc + Fp
 * Fp = (A * DeltaP * (W - d)) / (2 * (W - d)) approx -> Fp = (W * H * DeltaP * (W - d)) / (2 * (W - d))
 * Fire Code 2023 limit: Ft <= 110 N
 */
export function calculateStaircaseDoorForce(
  doorWidthM: number = 0.9,
  doorHeightM: number = 2.1,
  doorCloserForceN: number = 40,
  pressureDiffPa: number = 50,
  distanceToHandleM: number = 0.08
): {
  pressureForceN: number;
  totalForceN: number;
  isCompliant: boolean;
  working: string;
} {
  const areaSqM = doorWidthM * doorHeightM;
  const effectiveWidthM = doorWidthM - distanceToHandleM;
  // Torque balance: Fp * effectiveWidth = Area * DeltaP * (doorWidth / 2)
  const pressureForceN = (areaSqM * pressureDiffPa * (doorWidthM / 2)) / effectiveWidthM;
  const totalForceN = doorCloserForceN + pressureForceN;
  const isCompliant = totalForceN <= 110;

  const working = `Step 1: Calculate Force to Overcome Pressure Difference (Fp)
Door Dimensions: ${doorWidthM}m (W) × ${doorHeightM}m (H), Area = ${areaSqM.toFixed(2)} m²
Pressure difference (ΔP) = ${pressureDiffPa} Pa (Must be 50 Pa to 60 Pa per Fire Code)
Fp = (Area × ΔP × (W / 2)) ÷ (W - d)
Fp = (${areaSqM.toFixed(2)} × ${pressureDiffPa} × ${doorWidthM / 2}) ÷ ${effectiveWidthM.toFixed(2)} = ${pressureForceN.toFixed(1)} N

Step 2: Total Door Opening Force (Ft = Fc + Fp)
Ft = ${doorCloserForceN} N (door closer) + ${pressureForceN.toFixed(1)} N (air pressure) = ${totalForceN.toFixed(1)} N

Step 3: Verification against Fire Code 2023 Clause 1.3.12
Governing Limit: Ft ≤ 110 N (so elderly & children can open the exit door during evacuation)
Status: ${isCompliant ? 'COMPLIANT (≤ 110 N)' : 'NON-COMPLIANT (> 110 N - reduce ΔP or adjust closer)'}`;

  return {
    pressureForceN: Math.round(pressureForceN * 10) / 10,
    totalForceN: Math.round(totalForceN * 10) / 10,
    isCompliant,
    working,
  };
}

/**
 * 7. SS 636 : 2018 Water Storage Sizing & Mode of Supply
 */
export const SS636_STORAGE_RATES = {
  dwelling: { rateLitrePerOccupant: 150, name: 'Dwelling houses and flats' },
  hostel: { rateLitrePerOccupant: 90, name: 'Hostels' },
  hotel: { rateLitrePerOccupant: 135, name: 'Hotels' },
  office_no_canteen: { rateLitrePerOccupant: 35, name: 'Offices without canteens' },
  office_canteen: { rateLitrePerOccupant: 45, name: 'Offices with canteens' },
  school: { rateLitrePerOccupant: 15, name: 'Schools' },
};

export function evaluateWaterSupplySystem(bldg: WaterSupplyBuilding): {
  supplyMode: 1 | 2 | 3;
  modeDescription: string;
  totalElevationMslM: number;
  reducedLevelM: number;
  dailyStorageLitres: number;
  cisternCompartmentRequirement: string;
  privateMeterRequired: boolean;
  working: string;
} {
  const totalElevationMslM = bldg.groundElevationMslM + bldg.highestFittingHeightM;
  const reducedLevelM = 100 + totalElevationMslM; // RL = 100 + MSL

  let supplyMode: 1 | 2 | 3 = 1;
  let modeDescription = '';
  if (totalElevationMslM < 25) {
    supplyMode = 1;
    modeDescription = 'Mode 1: Direct supply from PUB water mains to all appliances (Highest fitting < 25 m above MSL / < 125 RL).';
  } else if (totalElevationMslM <= 37) {
    supplyMode = 2;
    modeDescription = 'Mode 2: Indirect supply via high level storage tank (Highest fitting between 25 m and 37 m above MSL / 125 - 137 RL). Off-peak mains pressure fills the tank.';
  } else {
    supplyMode = 3;
    modeDescription = 'Mode 3: Indirect supply through low level and high level storage tanks with duplicate transfer pumping equipment (Highest fitting > 37 m above MSL / > 137 RL).';
  }

  const rate = SS636_STORAGE_RATES[bldg.occupancyType]?.rateLitrePerOccupant || 35;
  const dailyStorageLitres = bldg.occupantCount * rate;

  const cisternCompartmentRequirement = dailyStorageLitres > 4500
    ? 'Storage > 4,500 L: MUST be partitioned into TWO interconnected isolatable compartments, with separate overflow and warning pipes (warning below overflow, screened with stainless steel mesh ≤ 0.65 mm).'
    : 'Storage ≤ 4,500 L: Single compartment permitted, overflow pipe may double as warning pipe with mesh ≤ 0.65 mm.';

  const threshold = bldg.isGovernment ? 3000 : 5000;
  const privateMeterRequired = bldg.monthlyWaterConsumptionM3 >= threshold;

  const working = `Step 1: Check Appliance Elevation Relative to Mean Sea Level (MSL) & Reduced Level (RL)
• Ground Elevation = ${bldg.groundElevationMslM} m MSL
• Highest Fitting = +${bldg.highestFittingHeightM} m above ground
• Total Elevation = ${totalElevationMslM.toFixed(1)} m above MSL (Equivalent RL = ${reducedLevelM.toFixed(1)} m)
Classification: ${modeDescription}

Step 2: Potable Storage Capacity Sizing (SS 636 : 2018 Table)
• Occupancy: ${SS636_STORAGE_RATES[bldg.occupancyType].name}
• Specific allowance = ${rate} Litres/occupant
• Total Occupants = ${bldg.occupantCount}
Required 24-hr Storage = ${bldg.occupantCount} × ${rate} L = ${dailyStorageLitres.toLocaleString()} Litres (${(dailyStorageLitres / 1000).toFixed(1)} m³)

Step 3: Cistern Construction & Statutory Compartmentation Rules
${cisternCompartmentRequirement}

Step 4: Statutory Private Water Meter Check (Public Utilities Regulations)
• Monthly Consumption = ${bldg.monthlyWaterConsumptionM3.toLocaleString()} m³/month
• Mandatory Threshold = ${threshold.toLocaleString()} m³/month (${bldg.isGovernment ? 'Government development' : 'Non-domestic development'})
Status: ${privateMeterRequired ? 'MANDATORY PRIVATE METERS REQUIRED for cooling towers, public toilets, and major zones.' : 'Private meter not legally mandated, recommended for sub-billing.'}`;

  return {
    supplyMode,
    modeDescription,
    totalElevationMslM,
    reducedLevelM,
    dailyStorageLitres,
    cisternCompartmentRequirement,
    privateMeterRequired,
    working,
  };
}

/**
 * 8. Sensible Cooling Load Formula
 * SCL = ms * cp,a * (tr - ts)
 */
export function calculateSensibleCoolingLoad(
  massFlowKgS: number,
  roomTempC: number,
  supplyTempC: number
): {
  sclKw: number;
  working: string;
} {
  const cpa = 1.006; // kJ/kg·K
  const deltaT = roomTempC - supplyTempC;
  const sclKw = massFlowKgS * cpa * deltaT;

  const working = `Step 1: State Sensible Cooling Load Equation
SCL = ṁs × cp,a × (tr - ts)
where:
• ṁs (supply air mass flow rate) = ${massFlowKgS} kg/s
• cp,a (specific heat of air) = 1.006 kJ/kg·K
• tr (room temperature) = ${roomTempC} °C
• ts (supply air temperature) = ${supplyTempC} °C
• (tr - ts) = ${deltaT.toFixed(1)} K

Step 2: Compute Sensible Cooling Load
SCL = ${massFlowKgS} × 1.006 × ${deltaT.toFixed(1)} = ${sclKw.toFixed(2)} kW`;

  return {
    sclKw: Math.round(sclKw * 100) / 100,
    working,
  };
}

/**
 * 9. Hourly Chiller Plant Efficiency Model (Standard David Teo Slide Table)
 */
export const DEFAULT_HOURLY_CHILLER_DATA: ChillerHourlyRecord[] = [
  { hour: '9 AM', coolingLoadRt: 1444, pChKw: 660, pChwpKw: 33, pCwpKw: 60, pCtKw: 24, chillerPlantTotalKw: 776, plantKwPerRt: 0.538, configuration: '650 RT x 3 nos' },
  { hour: '10 AM', coolingLoadRt: 1395, pChKw: 634, pChwpKw: 30, pCwpKw: 60, pCtKw: 21, chillerPlantTotalKw: 745, plantKwPerRt: 0.534, configuration: '650 RT x 3 nos' },
  { hour: '11 AM', coolingLoadRt: 1801, pChKw: 841, pChwpKw: 57, pCwpKw: 67, pCtKw: 47, chillerPlantTotalKw: 1011, plantKwPerRt: 0.561, configuration: '650 RT x 3 nos' },
  { hour: '12 PM', coolingLoadRt: 1790, pChKw: 835, pChwpKw: 56, pCwpKw: 66, pCtKw: 46, chillerPlantTotalKw: 1002, plantKwPerRt: 0.560, configuration: '650 RT x 3 nos' },
  { hour: '1 PM', coolingLoadRt: 1749, pChKw: 807, pChwpKw: 53, pCwpKw: 62, pCtKw: 43, chillerPlantTotalKw: 964, plantKwPerRt: 0.551, configuration: '650 RT x 3 nos' },
  { hour: '2 PM', coolingLoadRt: 1836, pChKw: 859, pChwpKw: 60, pCwpKw: 70, pCtKw: 50, chillerPlantTotalKw: 1038, plantKwPerRt: 0.565, configuration: '650 RT x 3 nos' },
  { hour: '3 PM', coolingLoadRt: 1816, pChKw: 849, pChwpKw: 58, pCwpKw: 68, pCtKw: 48, chillerPlantTotalKw: 1023, plantKwPerRt: 0.563, configuration: '650 RT x 3 nos' },
  { hour: '4 PM', coolingLoadRt: 1654, pChKw: 757, pChwpKw: 46, pCwpKw: 54, pCtKw: 36, chillerPlantTotalKw: 892, plantKwPerRt: 0.539, configuration: '650 RT x 3 nos' },
  { hour: '5 PM', coolingLoadRt: 1493, pChKw: 686, pChwpKw: 35, pCwpKw: 60, pCtKw: 26, chillerPlantTotalKw: 808, plantKwPerRt: 0.541, configuration: '650 RT x 3 nos' },
  { hour: '6 PM', coolingLoadRt: 1237, pChKw: 574, pChwpKw: 22, pCwpKw: 60, pCtKw: 15, chillerPlantTotalKw: 672, plantKwPerRt: 0.543, configuration: '650 RT x 3 nos' },
];
