/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AshraeClass, PsychrometricState } from '../types/dcfm';

/**
 * Airflow CFM needed to dissipate sensible IT heat load
 * Formula: CFM = (3412.14 * kW) / (1.08 * DeltaT_F)
 */
export function calculateAirflowCfm(kw: number, deltaTF: number): number {
  if (deltaTF <= 0) return 0;
  return Math.round((3160 * kw) / deltaTF);
}

/**
 * Metric airflow m3/h needed to dissipate sensible heat load
 * Formula: m3/h = (kW * 3600) / (1.204 * 1.006 * DeltaT_C)
 */
export function calculateAirflowM3h(kw: number, deltaTC: number): number {
  if (deltaTC <= 0) return 0;
  return Math.round((2972 * kw) / deltaTC);
}

/**
 * Perforated tile airflow based on plenum static pressure
 * Tile size: 24" x 24" (4 sq ft gross)
 * CFM = GrossArea * (OpenPercent/100) * Cd * 4005 * sqrt(StaticPressure_inWg)
 */
export function calculateTileCfm(
  staticPressureInWg: number,
  openPercent: number,
  dischargeCoeff: number = 0.70
): number {
  if (staticPressureInWg <= 0) return 0;
  const grossAreaSqFt = 4.0;
  const effectiveAreaFraction = (openPercent / 100);
  const velocityFpm = 4005 * Math.sqrt(staticPressureInWg);
  return Math.round(grossAreaSqFt * effectiveAreaFraction * dischargeCoeff * velocityFpm);
}

/**
 * Chilled Water Flow Rate (GPM)
 * GPM = (24 * Tons) / DeltaT_CHW_F
 */
export function calculateChilledWaterGpm(coolingTons: number, deltaTF: number): number {
  if (deltaTF <= 0) return 0;
  return Math.round((24 * coolingTons) / deltaTF);
}

/**
 * Metric Chilled Water Flow (L/s)
 * L/s = kW_thermal / (4.184 * DeltaT_C)
 */
export function calculateChilledWaterLps(coolingKw: number, deltaTC: number): number {
  if (deltaTC <= 0) return 0;
  return Math.round((coolingKw / (4.184 * deltaTC)) * 10) / 10;
}

/**
 * Optimal pipe internal diameter in inches for water velocity ~6.0 ft/s
 */
export function recommendPipeDiameterInches(gpm: number, targetVelocityFps: number = 6.0): number {
  if (gpm <= 0) return 0;
  // D = sqrt((0.408 * GPM) / V)
  const d = Math.sqrt((0.408 * gpm) / targetVelocityFps);
  // Standard nominal pipe diameters: 2, 2.5, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20
  const nominals = [2, 2.5, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24];
  for (const nom of nominals) {
    if (nom >= d) return nom;
  }
  return Math.ceil(d);
}

/**
 * Duct Sizing calculations
 */
export interface DuctCalculationResult {
  roundDiameterIn: number;
  actualVelocityFpm: number;
  frictionRateInWgPer100Ft: number;
  velocityPressureInWg: number;
  rectWidthIn: number;
  rectHeightIn: number;
  aspectRatio: number;
}

export function sizeDuctByVelocity(
  cfm: number,
  targetVelocityFpm: number,
  preferredAspectRatio: number = 1.5
): DuctCalculationResult {
  if (cfm <= 0 || targetVelocityFpm <= 0) {
    return {
      roundDiameterIn: 0,
      actualVelocityFpm: 0,
      frictionRateInWgPer100Ft: 0,
      velocityPressureInWg: 0,
      rectWidthIn: 0,
      rectHeightIn: 0,
      aspectRatio: preferredAspectRatio,
    };
  }

  // Round diameter: Area = CFM / V -> pi * (D/24)^2 = CFM / V
  const areaSqFt = cfm / targetVelocityFpm;
  const dExactIn = Math.sqrt((4 * 144 * areaSqFt) / Math.PI);
  const roundDiameterIn = Math.round(dExactIn);

  // ASHRAE friction formula: deltaH = 0.109136 * (CFM^1.9) / (D^5.02)
  const frictionRate = 0.109136 * (Math.pow(cfm, 1.9) / Math.pow(Math.max(roundDiameterIn, 1), 5.02));
  const velocityPressure = Math.pow(targetVelocityFpm / 4005, 2);

  // Equivalent rectangular duct via Huebscher formula:
  // De = 1.30 * (a * b)^0.625 / (a + b)^0.25
  // If a = R * b, De = 1.30 * (R * b^2)^0.625 / ((R+1)*b)^0.25 = 1.30 * R^0.625 * b^1.25 / ((R+1)^0.25 * b^0.25)
  // De = 1.30 * (R^0.625 / (R+1)^0.25) * b
  const r = Math.max(1, preferredAspectRatio);
  const factor = 1.30 * (Math.pow(r, 0.625) / Math.pow(r + 1, 0.25));
  const heightIn = Math.round(roundDiameterIn / factor);
  const widthIn = Math.round(heightIn * r);

  return {
    roundDiameterIn,
    actualVelocityFpm: Math.round(cfm / (Math.PI * Math.pow(roundDiameterIn / 24, 2))),
    frictionRateInWgPer100Ft: Math.round(frictionRate * 1000) / 1000,
    velocityPressureInWg: Math.round(velocityPressure * 1000) / 1000,
    rectWidthIn: widthIn,
    rectHeightIn: heightIn,
    aspectRatio: Math.round((widthIn / Math.max(heightIn, 1)) * 10) / 10,
  };
}

export function sizeDuctByFriction(
  cfm: number,
  targetFrictionInWgPer100Ft: number,
  preferredAspectRatio: number = 1.5
): DuctCalculationResult {
  if (cfm <= 0 || targetFrictionInWgPer100Ft <= 0) {
    return sizeDuctByVelocity(cfm, 1200, preferredAspectRatio);
  }

  // D = (0.109136 * CFM^1.9 / friction)^(1 / 5.02)
  const dExactIn = Math.pow(
    (0.109136 * Math.pow(cfm, 1.9)) / targetFrictionInWgPer100Ft,
    1 / 5.02
  );
  const roundDiameterIn = Math.round(dExactIn);
  const areaSqFt = Math.PI * Math.pow(roundDiameterIn / 24, 2);
  const actualVelocityFpm = Math.round(cfm / areaSqFt);
  const velocityPressure = Math.pow(actualVelocityFpm / 4005, 2);

  const r = Math.max(1, preferredAspectRatio);
  const factor = 1.30 * (Math.pow(r, 0.625) / Math.pow(r + 1, 0.25));
  const heightIn = Math.round(roundDiameterIn / factor);
  const widthIn = Math.round(heightIn * r);

  return {
    roundDiameterIn,
    actualVelocityFpm,
    frictionRateInWgPer100Ft: targetFrictionInWgPer100Ft,
    velocityPressureInWg: Math.round(velocityPressure * 1000) / 1000,
    rectWidthIn: widthIn,
    rectHeightIn: heightIn,
    aspectRatio: Math.round((widthIn / Math.max(heightIn, 1)) * 10) / 10,
  };
}

/**
 * Psychrometric calculations using standard Magnus-Tetens & ASHRAE formulations
 */
export function calculatePsychrometrics(dryBulbF: number, relativeHumidity: number, label: string = 'Air State'): PsychrometricState {
  const rhClamped = Math.max(1, Math.min(100, relativeHumidity));
  const tempC = ((dryBulbF - 32) * 5) / 9;

  // Saturation vapor pressure in kPa
  const pSatKpa = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  // Actual vapor pressure in kPa
  const pVaporKpa = pSatKpa * (rhClamped / 100);

  // Dew point in °C
  const alpha = Math.log(pVaporKpa / 0.61078);
  const dewPointC = (237.3 * alpha) / (17.27 - alpha);
  const dewPointF = Math.round(((dewPointC * 9) / 5 + 32) * 10) / 10;

  // Wet bulb estimation via Stull formula
  const twC =
    tempC * Math.atan(0.151977 * Math.pow(rhClamped + 8.313659, 0.5)) +
    Math.atan(tempC + rhClamped) -
    Math.atan(rhClamped - 1.676331) +
    0.00391838 * Math.pow(rhClamped, 1.5) * Math.atan(0.023101 * rhClamped) -
    4.686035;
  const wetBulbF = Math.round(((twC * 9) / 5 + 32) * 10) / 10;

  // Humidity ratio W (lb water / lb dry air)
  // P_atm = 101.325 kPa
  const wKgKg = (0.62198 * pVaporKpa) / (101.325 - pVaporKpa);
  const humidityRatioLbPerLb = Math.round(wKgKg * 10000) / 10000;

  // Enthalpy (BTU / lb dry air)
  const enthalpyBtuPerLb = Math.round((0.24 * dryBulbF + humidityRatioLbPerLb * (1061 + 0.444 * dryBulbF)) * 10) / 10;

  // ASHRAE TC 9.9 Thermal Guidelines evaluation
  // Class A1 Recommended: Dry bulb 18°C - 27°C (64.4°F - 80.6°F), Dew point 5.5°C to 15.0°C (41.9°F to 59.0°F), max RH 60%
  let ashraeCategory: AshraeClass = 'Out_of_Spec';
  if (
    tempC >= 18.0 &&
    tempC <= 27.0 &&
    dewPointC >= 5.5 &&
    dewPointC <= 15.0 &&
    rhClamped <= 60
  ) {
    ashraeCategory = 'A1_Recommended';
  } else if (
    tempC >= 15.0 &&
    tempC <= 32.0 &&
    rhClamped >= 20 &&
    rhClamped <= 80 &&
    dewPointC <= 17.0
  ) {
    ashraeCategory = 'A1_Allowable';
  } else if (tempC >= 10.0 && tempC <= 35.0 && rhClamped >= 20 && rhClamped <= 80) {
    ashraeCategory = 'A2';
  } else if (tempC >= 5.0 && tempC <= 40.0 && rhClamped >= 8 && rhClamped <= 85) {
    ashraeCategory = 'A3';
  } else if (tempC >= 5.0 && tempC <= 45.0 && rhClamped >= 8 && rhClamped <= 90) {
    ashraeCategory = 'A4';
  }

  return {
    label,
    dryBulbF,
    relativeHumidity: rhClamped,
    dewPointF,
    wetBulbF,
    enthalpyBtuPerLb,
    humidityRatioLbPerLb,
    ashraeCategory,
  };
}

/**
 * Thermal hold-up / ride-through time calculation
 * Tank Volume in Gallons, Chiller Load in Tons, Allowed Delta-T in °F
 */
export function calculateRideThroughMinutes(
  storageGallons: number,
  pipingGallons: number,
  totalCoolingTons: number,
  allowedDeltaTF: number
): number {
  if (totalCoolingTons <= 0 || allowedDeltaTF <= 0) return 0;
  const totalGallons = storageGallons + pipingGallons;
  const totalBtuCapacity = totalGallons * 8.33 * 1.0 * allowedDeltaTF;
  const heatLoadBtuPerMin = totalCoolingTons * 200; // 1 ton = 12,000 BTU/h = 200 BTU/min
  return Math.round((totalBtuCapacity / heatLoadBtuPerMin) * 10) / 10;
}

/**
 * Conversions helper
 */
export function fToC(f: number): number {
  return Math.round((((f - 32) * 5) / 9) * 10) / 10;
}

export function cToF(c: number): number {
  return Math.round(((c * 9) / 5 + 32) * 10) / 10;
}

export function cfmToM3h(cfm: number): number {
  return Math.round(cfm * 1.69901);
}

export function m3hToCfm(m3h: number): number {
  return Math.round(m3h / 1.69901);
}

export function tonsToKw(tons: number): number {
  return Math.round(tons * 3.51685);
}

export function kwToTons(kw: number): number {
  return Math.round((kw / 3.51685) * 10) / 10;
}

export function gpmToLps(gpm: number): number {
  return Math.round(gpm * 0.0630902 * 10) / 10;
}

export function inWgToPa(inWg: number): number {
  return Math.round(inWg * 249.0889);
}
