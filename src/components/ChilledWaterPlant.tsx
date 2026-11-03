/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CoolingPlantSpec, FacilityProfile, UnitSystem } from '../types/dcfm';
import { 
  calculateChilledWaterGpm, 
  calculateChilledWaterLps, 
  recommendPipeDiameterInches, 
  kwToTons, 
  tonsToKw, 
  fToC, 
  cToF, 
  gpmToLps 
} from '../utils/engineeringMath';
import { 
  Droplets, 
  Zap, 
  Activity, 
  Layers, 
  Sliders, 
  DollarSign, 
  Leaf, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface ChilledWaterPlantProps {
  facility: FacilityProfile;
  coolingPlant: CoolingPlantSpec;
  onUpdateCoolingPlant: (plant: CoolingPlantSpec) => void;
  unitSystem: UnitSystem;
}

export const ChilledWaterPlant: React.FC<ChilledWaterPlantProps> = ({
  facility,
  coolingPlant,
  onUpdateCoolingPlant,
  unitSystem,
}) => {
  const [electricityTariffPerKwh, setElectricityTariffPerKwh] = useState(0.18);
  const [carbonFactorKgPerKwh, setCarbonFactorKgPerKwh] = useState(0.408); // Singapore / Global grid average

  // Cooling load in tons & kW
  const totalCoolingTons = kwToTons(facility.totalItLoadKw);
  const totalCoolingKw = facility.totalItLoadKw;

  // Chilled Water Delta-T
  const chwDeltaTF = Math.max(4, coolingPlant.chwReturnTempF - coolingPlant.chwSupplyTempF);
  const chwDeltaTC = Math.max(2, fToC(coolingPlant.chwReturnTempF) - fToC(coolingPlant.chwSupplyTempF));

  // GPM & Pipe sizing
  const chwGpm = calculateChilledWaterGpm(totalCoolingTons, chwDeltaTF);
  const chwLps = calculateChilledWaterLps(totalCoolingKw, chwDeltaTC);
  const recommendedPipeIn = recommendPipeDiameterInches(chwGpm, 6.0);

  // Power Consumption Breakdown
  // 1. Chiller power (kW)
  const chillerKw = totalCoolingTons * coolingPlant.chillerEfficiencyKwPerTon;
  
  // 2. CRAH fan power (kW)
  const crahTotalFanKw = coolingPlant.crahCount * coolingPlant.crahFanMotorKw;

  // 3. Pumps power (kW): Chilled water + Condenser water pumps
  const pumpKw = totalCoolingTons * 0.055;

  // 4. Cooling tower fans & spray (kW)
  const towerKw = totalCoolingTons * coolingPlant.coolingTowerKwPerTon;

  // Total Cooling Power (kW)
  const totalCoolingPowerKw = chillerKw + crahTotalFanKw + pumpKw + towerKw;

  // Electrical distribution loss (UPS, transformer, STS ~ 6%)
  const electricalLossKw = facility.totalItLoadKw * 0.06;

  // Lighting & auxiliary facility power ~ 2%
  const auxPowerKw = facility.totalItLoadKw * 0.02;

  // Total Facility Power
  const totalFacilityPowerKw = facility.totalItLoadKw + totalCoolingPowerKw + electricalLossKw + auxPowerKw;

  // PUE Calculation
  const pue = facility.totalItLoadKw > 0 ? totalFacilityPowerKw / facility.totalItLoadKw : 1.0;
  const coolingPueComponent = facility.totalItLoadKw > 0 ? totalCoolingPowerKw / facility.totalItLoadKw : 0;

  // Annual Financial & Carbon footprint (8,760 hours/year)
  const annualTotalKwh = totalFacilityPowerKw * 8760;
  const annualCoolingKwh = totalCoolingPowerKw * 8760;
  const annualTotalCost = annualTotalKwh * electricityTariffPerKwh;
  const annualCoolingCost = annualCoolingKwh * electricityTariffPerKwh;
  const annualCo2Tonnes = (annualTotalKwh * carbonFactorKgPerKwh) / 1000;

  // Chiller COP from kW/Ton
  const chillerCop = coolingPlant.chillerEfficiencyKwPerTon > 0 
    ? Math.round((3.51685 / coolingPlant.chillerEfficiencyKwPerTon) * 100) / 100 
    : 0;

  // Redundancy count calculation
  let installedChillerCount = coolingPlant.chillerCountRunning;
  if (coolingPlant.redundancy === 'N+1') installedChillerCount += 1;
  else if (coolingPlant.redundancy === 'N+2') installedChillerCount += 2;
  else if (coolingPlant.redundancy === '2N') installedChillerCount *= 2;
  else if (coolingPlant.redundancy === '2(N+1)') installedChillerCount = (installedChillerCount + 1) * 2;

  const totalInstalledChillerTons = installedChillerCount * coolingPlant.chillerCapacityTons;

  return (
    <div className="space-y-6">
      {/* Top Plant KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Facility PUE</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {pue.toFixed(3)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Cooling Overhead: +{coolingPueComponent.toFixed(3)}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Chilled Water Flow</span>
            <Droplets className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {unitSystem === 'imperial'
              ? `${chwGpm.toLocaleString()} GPM`
              : `${chwLps.toLocaleString()} L/s`}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Header Pipe: Ø {recommendedPipeIn}" Nominal
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Chiller Plant COP</span>
            <span className="text-xs font-mono text-emerald-400">
              {coolingPlant.chillerEfficiencyKwPerTon} kW/TR
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {chillerCop} COP
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {coolingPlant.chwSupplyTempF}°F supply / {coolingPlant.chwReturnTempF}°F return
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Total Plant Load</span>
            <span className="text-xs font-mono text-slate-400">Installed</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {Math.round(totalFacilityPowerKw).toLocaleString()}{' '}
            <span className="text-sm font-normal text-slate-400">kW</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {installedChillerCount} Chillers ({coolingPlant.redundancy})
          </div>
        </div>
      </div>

      {/* Chiller Plant & CRAH Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Chiller Loop Configuration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Central Chilled Water Plant
            </h3>
            <span className="text-xs font-mono text-slate-400">Hydronic Loop</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Chiller Size (Tons)
                </label>
                <input
                  type="number"
                  min="50"
                  max="3000"
                  step="50"
                  value={coolingPlant.chillerCapacityTons}
                  onChange={(e) =>
                    onUpdateCoolingPlant({
                      ...coolingPlant,
                      chillerCapacityTons: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Active Running Chillers
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={coolingPlant.chillerCountRunning}
                  onChange={(e) =>
                    onUpdateCoolingPlant({
                      ...coolingPlant,
                      chillerCountRunning: Math.max(1, Number(e.target.value)),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Redundancy Architecture
                </label>
                <select
                  value={coolingPlant.redundancy}
                  onChange={(e) =>
                    onUpdateCoolingPlant({
                      ...coolingPlant,
                      redundancy: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="N">N (No Standby)</option>
                  <option value="N+1">N+1 (Standard Tier-III)</option>
                  <option value="N+2">N+2 (Dual Standby)</option>
                  <option value="2N">2N (Full Concurrently Maintainable)</option>
                  <option value="2(N+1)">2(N+1) (Hyperscale Ultra Tier-IV)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Chiller Efficiency (kW/Ton)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.30"
                  max="1.20"
                  value={coolingPlant.chillerEfficiencyKwPerTon}
                  onChange={(e) =>
                    onUpdateCoolingPlant({
                      ...coolingPlant,
                      chillerEfficiencyKwPerTon: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Chilled water temperatures */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  CHW Supply Temp (CHWS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={unitSystem === 'imperial' ? coolingPlant.chwSupplyTempF : fToC(coolingPlant.chwSupplyTempF)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateCoolingPlant({
                        ...coolingPlant,
                        chwSupplyTempF: unitSystem === 'imperial' ? val : cToF(val),
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-mono">
                    {unitSystem === 'imperial' ? '°F' : '°C'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  CHW Return Temp (CHWR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={unitSystem === 'imperial' ? coolingPlant.chwReturnTempF : fToC(coolingPlant.chwReturnTempF)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateCoolingPlant({
                        ...coolingPlant,
                        chwReturnTempF: unitSystem === 'imperial' ? val : cToF(val),
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-mono">
                    {unitSystem === 'imperial' ? '°F' : '°C'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hydronic Loop Summary */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Installed Capacity:</span>
                <span className="font-mono text-white font-semibold">
                  {totalInstalledChillerTons} TR ({tonsToKw(totalInstalledChillerTons).toLocaleString()} kW)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hydronic Loop ΔT:</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {unitSystem === 'imperial' ? `${chwDeltaTF}°F` : `${chwDeltaTC}°C`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Required Header Diameter:</span>
                <span className="font-mono text-cyan-300 font-semibold">
                  Ø {recommendedPipeIn}" (Velocity ~6.0 ft/s)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: CRAH & Air-Handling Unit Configuration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              CRAH / In-Row Units & Fans
            </h3>
            <span className="text-xs font-mono text-slate-400">Air-Side Mechanical</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  CRAH Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={coolingPlant.crahCount}
                  onChange={(e) =>
                    onUpdateCoolingPlant({
                      ...coolingPlant,
                      crahCount: Math.max(1, Number(e.target.value)),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Airflow per Unit (CFM)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="80000"
                  step="1000"
                  value={coolingPlant.crahUnitCfm}
                  onChange={(e) =>
                    onUpdateCoolingPlant({
                      ...coolingPlant,
                      crahUnitCfm: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Fan Motor Type
                </label>
                <select
                  value={coolingPlant.crahFanType}
                  onChange={(e) =>
                    onUpdateCoolingPlant({
                      ...coolingPlant,
                      crahFanType: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ec_fan">Electronically Commutated (EC) Fans</option>
                  <option value="vfd_centrifugal">VFD Centrifugal Direct-Drive</option>
                  <option value="belt_driven">Belt-Driven Forward Curved (Legacy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Fan Power per Unit (kW)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="30"
                  value={coolingPlant.crahFanMotorKw}
                  onChange={(e) =>
                    onUpdateCoolingPlant({
                      ...coolingPlant,
                      crahFanMotorKw: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* CRAH Total Air Delivery vs Required */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total CRAH Air Delivery:</span>
                <span className="font-mono text-cyan-300 font-semibold">
                  {(coolingPlant.crahCount * coolingPlant.crahUnitCfm).toLocaleString()} CFM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total CRAH Fan Power:</span>
                <span className="font-mono text-white font-semibold">
                  {Math.round(crahTotalFanKw * 10) / 10} kW
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cooling Tower Rejection:</span>
                <span className="font-mono text-slate-300 font-semibold">
                  {Math.round(towerKw * 10) / 10} kW ({coolingPlant.coolingTowerKwPerTon} kW/TR)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Sankey Breakdown & Financial Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Power Breakdown Bar */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Power & Energy Distribution Breakdown
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Total: {Math.round(totalFacilityPowerKw).toLocaleString()} kW
            </span>
          </div>

          {/* Segmented Energy Bar */}
          <div className="space-y-2">
            <div className="w-full h-6 rounded-lg overflow-hidden flex bg-slate-950 border border-slate-800">
              <div
                style={{ width: `${(facility.totalItLoadKw / totalFacilityPowerKw) * 100}%` }}
                className="bg-cyan-500 h-full transition-all"
                title={`IT Load: ${Math.round(facility.totalItLoadKw)} kW`}
              />
              <div
                style={{ width: `${(chillerKw / totalFacilityPowerKw) * 100}%` }}
                className="bg-blue-600 h-full transition-all"
                title={`Chillers: ${Math.round(chillerKw)} kW`}
              />
              <div
                style={{ width: `${(crahTotalFanKw / totalFacilityPowerKw) * 100}%` }}
                className="bg-teal-500 h-full transition-all"
                title={`CRAH Fans: ${Math.round(crahTotalFanKw)} kW`}
              />
              <div
                style={{ width: `${(pumpKw / totalFacilityPowerKw) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Pumps: ${Math.round(pumpKw)} kW`}
              />
              <div
                style={{ width: `${(towerKw / totalFacilityPowerKw) * 100}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Cooling Towers: ${Math.round(towerKw)} kW`}
              />
              <div
                style={{ width: `${((electricalLossKw + auxPowerKw) / totalFacilityPowerKw) * 100}%` }}
                className="bg-slate-600 h-full transition-all"
                title={`Electrical & Aux: ${Math.round(electricalLossKw + auxPowerKw)} kW`}
              />
            </div>

            {/* Legend with tabular data */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 shrink-0" />
                <span className="text-slate-400">IT Equipment:</span>
                <span className="font-mono font-semibold text-white ml-auto tabular-nums">
                  {Math.round(facility.totalItLoadKw)} kW ({( (facility.totalItLoadKw / totalFacilityPowerKw) * 100 ).toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 shrink-0" />
                <span className="text-slate-400">Chillers:</span>
                <span className="font-mono font-semibold text-white ml-auto tabular-nums">
                  {Math.round(chillerKw)} kW ({( (chillerKw / totalFacilityPowerKw) * 100 ).toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-500 shrink-0" />
                <span className="text-slate-400">CRAH Fans:</span>
                <span className="font-mono font-semibold text-white ml-auto tabular-nums">
                  {Math.round(crahTotalFanKw)} kW ({( (crahTotalFanKw / totalFacilityPowerKw) * 100 ).toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                <span className="text-slate-400">Pumps:</span>
                <span className="font-mono font-semibold text-white ml-auto tabular-nums">
                  {Math.round(pumpKw)} kW ({( (pumpKw / totalFacilityPowerKw) * 100 ).toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0" />
                <span className="text-slate-400">Cooling Towers:</span>
                <span className="font-mono font-semibold text-white ml-auto tabular-nums">
                  {Math.round(towerKw)} kW ({( (towerKw / totalFacilityPowerKw) * 100 ).toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 shrink-0" />
                <span className="text-slate-400">UPS & Aux Losses:</span>
                <span className="font-mono font-semibold text-white ml-auto tabular-nums">
                  {Math.round(electricalLossKw + auxPowerKw)} kW ({( ((electricalLossKw + auxPowerKw) / totalFacilityPowerKw) * 100 ).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Cost & Carbon Model */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Annual OPEX & Carbon
            </h3>
            <span className="text-xs font-mono text-emerald-400">8,760 hrs/yr</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Power Tariff ($/kWh)</span>
                <span className="font-mono font-semibold text-white">
                  ${electricityTariffPerKwh.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                min="0.08"
                max="0.45"
                step="0.01"
                value={electricityTariffPerKwh}
                onChange={(e) => setElectricityTariffPerKwh(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Annual Facility Power:</span>
                <span className="font-mono text-white font-semibold">
                  {(annualTotalKwh / 1000000).toFixed(2)} GWh/yr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Electricity Bill:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ${(annualTotalCost / 1000000).toFixed(2)}M / yr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cooling Only OPEX:</span>
                <span className="font-mono text-cyan-300 font-semibold">
                  ${(annualCoolingCost / 1000000).toFixed(2)}M / yr
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  Carbon Emissions:
                </span>
                <span className="font-mono text-slate-200 font-bold">
                  {Math.round(annualCo2Tonnes).toLocaleString()} tCO₂e
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
