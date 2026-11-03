/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FacilityProfile, ServerRack, UnitSystem } from '../types/dcfm';
import { 
  calculateAirflowCfm, 
  calculateAirflowM3h, 
  calculateTileCfm, 
  kwToTons, 
  fToC, 
  cToF,
  cfmToM3h,
  inWgToPa
} from '../utils/engineeringMath';
import { 
  Wind, 
  Gauge, 
  Sliders, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Download,
  Info
} from 'lucide-react';

interface AirflowThermalCalculatorProps {
  facility: FacilityProfile;
  onUpdateFacility: (facility: FacilityProfile) => void;
  racks: ServerRack[];
  onUpdateRacks: (racks: ServerRack[]) => void;
  unitSystem: UnitSystem;
}

export const AirflowThermalCalculator: React.FC<AirflowThermalCalculatorProps> = ({
  facility,
  onUpdateFacility,
  racks,
  onUpdateRacks,
  unitSystem,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'optimal' | 'warning' | 'critical'>('all');
  const [newRackRow, setNewRackRow] = useState('E');
  const [newRackKw, setNewRackKw] = useState(12);

  // Core Math
  const deltaTF = Math.max(5, facility.returnAirTempF - facility.supplyAirTempF);
  const deltaTC = Math.max(3, fToC(facility.returnAirTempF) - fToC(facility.supplyAirTempF));

  const totalCfmNeeded = calculateAirflowCfm(facility.totalItLoadKw, deltaTF);
  const totalM3hNeeded = calculateAirflowM3h(facility.totalItLoadKw, deltaTC);

  const tileCfm = calculateTileCfm(
    facility.plenumStaticPressureInWg,
    facility.tilePerforationPercent,
    facility.tileDischargeCoeff
  );

  const totalTilesNeeded = tileCfm > 0 ? Math.ceil(totalCfmNeeded / tileCfm) : 0;
  const coolingTons = kwToTons(facility.totalItLoadKw);

  // Underfloor Plenum cross-sectional area and approach velocity
  const plenumDepthFt = facility.raisedFloorHeightIn / 12;
  const plenumAreaSqFt = facility.roomWidthFt * plenumDepthFt;
  const plenumVelocityFpm = plenumAreaSqFt > 0 ? Math.round(totalCfmNeeded / plenumAreaSqFt) : 0;

  // Delivery vs Demand balance
  const totalDeliveredCfm = facility.tileCount * tileCfm;
  const airflowBalanceRatio = totalCfmNeeded > 0 ? (totalDeliveredCfm / totalCfmNeeded) : 1;
  const bypassFraction = Math.max(0, (totalDeliveredCfm - totalCfmNeeded) / Math.max(1, totalDeliveredCfm));

  // Handle individual rack changes
  const handleUpdateRackKw = (id: string, kw: number) => {
    const updated = racks.map((r) => {
      if (r.id === id) {
        const needed = calculateAirflowCfm(kw, r.deltaTF);
        let status: 'optimal' | 'warning' | 'critical' = 'optimal';
        if (tileCfm < needed * 0.85) status = 'critical';
        else if (tileCfm < needed) status = 'warning';
        return {
          ...r,
          itLoadKw: kw,
          actualCfmNeeded: needed,
          tileCfmDelivered: tileCfm,
          status,
        };
      }
      return r;
    });
    onUpdateRacks(updated);
    
    // update facility total kW sum
    const totalKw = updated.reduce((sum, r) => sum + r.itLoadKw, 0);
    onUpdateFacility({
      ...facility,
      totalItLoadKw: Math.round(totalKw * 10) / 10,
      rackCount: updated.length,
    });
  };

  const handleAddRack = () => {
    const nextPos = racks.filter((r) => r.row === newRackRow).length + 1;
    const needed = calculateAirflowCfm(newRackKw, 24);
    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    if (tileCfm < needed * 0.85) status = 'critical';
    else if (tileCfm < needed) status = 'warning';

    const newRack: ServerRack = {
      id: `rack-${newRackRow}-${nextPos}-${Date.now()}`,
      name: `Rack ${newRackRow}-${String(nextPos).padStart(2, '0')}`,
      row: newRackRow,
      position: nextPos,
      itLoadKw: newRackKw,
      rackUnits: 42,
      deltaTF: 24,
      targetSatF: facility.supplyAirTempF,
      actualCfmNeeded: needed,
      tileCfmDelivered: tileCfm,
      status,
    };

    const nextRacks = [...racks, newRack];
    onUpdateRacks(nextRacks);
    onUpdateFacility({
      ...facility,
      totalItLoadKw: Math.round((facility.totalItLoadKw + newRackKw) * 10) / 10,
      rackCount: nextRacks.length,
    });
  };

  const handleDeleteRack = (id: string) => {
    const nextRacks = racks.filter((r) => r.id !== id);
    const totalKw = nextRacks.reduce((sum, r) => sum + r.itLoadKw, 0);
    onUpdateRacks(nextRacks);
    onUpdateFacility({
      ...facility,
      totalItLoadKw: Math.round(totalKw * 10) / 10,
      rackCount: nextRacks.length,
    });
  };

  const handleExportCsv = () => {
    const headers = ['Rack ID', 'Name', 'Row', 'Position', 'IT Load (kW)', 'Delta-T (°F)', 'CFM Needed', 'Tile CFM Delivered', 'Status'];
    const rows = racks.map((r) => [
      r.id,
      r.name,
      r.row,
      r.position,
      r.itLoadKw,
      r.deltaTF,
      r.actualCfmNeeded,
      r.tileCfmDelivered,
      r.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DCFM_Rack_Airflow_Schedule_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRacks = racks.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Total Design Airflow</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {unitSystem === 'imperial'
              ? `${totalCfmNeeded.toLocaleString()} CFM`
              : `${totalM3hNeeded.toLocaleString()} m³/h`}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            For {facility.totalItLoadKw.toLocaleString()} kW Sensible IT
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Airflow per Tile</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {unitSystem === 'imperial'
              ? `${tileCfm.toLocaleString()} CFM`
              : `${cfmToM3h(tileCfm).toLocaleString()} m³/h`}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            At {unitSystem === 'imperial' ? `${facility.plenumStaticPressureInWg}" wg` : `${inWgToPa(facility.plenumStaticPressureInWg)} Pa`} ({facility.tilePerforationPercent}% open)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Perforated Tiles Needed</span>
            <span className="text-xs font-mono text-cyan-400">
              {facility.tileCount} active
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {totalTilesNeeded}{' '}
            <span className="text-sm font-normal text-slate-400">tiles</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
            {facility.tileCount >= totalTilesNeeded ? (
              <span className="text-emerald-400 font-medium">✓ Adequate Tile Supply</span>
            ) : (
              <span className="text-amber-400 font-medium">⚠ Short by {totalTilesNeeded - facility.tileCount} tiles</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Cooling Sensible Load</span>
            <span className="text-xs font-mono text-slate-400">1 TR = 3.52 kW</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {coolingTons}{' '}
            <span className="text-sm font-normal text-slate-400">Tons</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Air ΔT: {unitSystem === 'imperial' ? `${deltaTF}°F` : `${deltaTC}°C`}
          </div>
        </div>
      </div>

      {/* Main Engineering Parameter Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Airflow & Temperature Sizing */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Thermal Airflow Parameters
            </h3>
            <span className="text-xs font-mono text-slate-400">Sensible Heat Q</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Total IT Load (kW)</span>
                <span className="font-mono font-semibold text-cyan-300 tabular-nums">
                  {facility.totalItLoadKw} kW
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="8000"
                step="50"
                value={facility.totalItLoadKw}
                onChange={(e) =>
                  onUpdateFacility({ ...facility, totalItLoadKw: Number(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Supply Temp (SAT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={unitSystem === 'imperial' ? facility.supplyAirTempF : fToC(facility.supplyAirTempF)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateFacility({
                        ...facility,
                        supplyAirTempF: unitSystem === 'imperial' ? val : cToF(val),
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
                  Return Temp (RAT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={unitSystem === 'imperial' ? facility.returnAirTempF : fToC(facility.returnAirTempF)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateFacility({
                        ...facility,
                        returnAirTempF: unitSystem === 'imperial' ? val : cToF(val),
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

            {/* Air ΔT Indicator */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Server Thermal Delta-T (ΔT)</span>
              <span className="font-mono font-semibold text-emerald-400">
                {unitSystem === 'imperial' ? `${deltaTF}°F` : `${deltaTC}°C`}
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Airflow Containment Method
              </label>
              <select
                value={facility.containment}
                onChange={(e) =>
                  onUpdateFacility({ ...facility, containment: e.target.value as any })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="cold_aisle">Cold Aisle Containment (CAC) - High Efficiency</option>
                <option value="hot_aisle">Hot Aisle Containment (HAC) - Optimal Plena</option>
                <option value="open_aisle">Open / Uncontained Aisle (High Mixing Loss)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Panel 2: Underfloor Plenum & Perforated Tile Sizing */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Plenum & Perforated Tiles
            </h3>
            <span className="text-xs font-mono text-slate-400">Bernoulli Aerodynamics</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Plenum Static Pressure</span>
                <span className="font-mono font-semibold text-emerald-300 tabular-nums">
                  {unitSystem === 'imperial'
                    ? `${facility.plenumStaticPressureInWg}" wg`
                    : `${inWgToPa(facility.plenumStaticPressureInWg)} Pa`}
                </span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.25"
                step="0.01"
                value={facility.plenumStaticPressureInWg}
                onChange={(e) =>
                  onUpdateFacility({
                    ...facility,
                    plenumStaticPressureInWg: Number(e.target.value),
                  })
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>0.02" wg (Low)</span>
                <span>0.08" - 0.12" (Standard)</span>
                <span>0.20" (High velocity)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Tile Perforation Free Open Area
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[25, 40, 56].map((pct) => (
                  <button
                    key={pct}
                    onClick={() =>
                      onUpdateFacility({ ...facility, tilePerforationPercent: pct })
                    }
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                      facility.tilePerforationPercent === pct
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {pct}% Open
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Active Tile Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={facility.tileCount}
                  onChange={(e) =>
                    onUpdateFacility({ ...facility, tileCount: Math.max(1, Number(e.target.value)) })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Raised Floor Depth
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="12"
                    max="60"
                    value={facility.raisedFloorHeightIn}
                    onChange={(e) =>
                      onUpdateFacility({
                        ...facility,
                        raisedFloorHeightIn: Math.max(12, Number(e.target.value)),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-mono">
                    in.
                  </span>
                </div>
              </div>
            </div>

            {/* Underfloor velocity warning/check */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Plenum Approach Velocity:</span>
                <span className={`font-mono font-semibold ${plenumVelocityFpm > 1000 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {plenumVelocityFpm} FPM
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {plenumVelocityFpm > 1000
                  ? 'High velocity (>1000 FPM) causes Bernoulli effect suction near CRAH units.'
                  : 'Velocity is within ASHRAE recommended range (<1000 FPM) for uniform tile delivery.'}
              </p>
            </div>
          </div>
        </div>

        {/* Panel 3: Room Geometry & Airflow Diagnostics */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              DCFM Airflow Diagnostics
            </h3>
            <span className="text-xs font-mono text-slate-400">Flow Balance</span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Tile Delivery Capacity:</span>
                <span className="font-mono font-semibold text-white">
                  {totalDeliveredCfm.toLocaleString()} CFM
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Required IT Airflow:</span>
                <span className="font-mono font-semibold text-cyan-300">
                  {totalCfmNeeded.toLocaleString()} CFM
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Supply / Demand Ratio:</span>
                <span
                  className={`font-mono font-bold ${
                    airflowBalanceRatio >= 1.05 && airflowBalanceRatio <= 1.25
                      ? 'text-emerald-400'
                      : airflowBalanceRatio < 1.0
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {(airflowBalanceRatio * 100).toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    airflowBalanceRatio < 1.0
                      ? 'bg-red-500'
                      : airflowBalanceRatio <= 1.25
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, airflowBalanceRatio * 80)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                {airflowBalanceRatio < 1.0 ? (
                  <span className="text-red-400">
                    Deficit: Server fans will entrain hot return air, causing thermal hot spots.
                  </span>
                ) : airflowBalanceRatio > 1.3 ? (
                  <span className="text-amber-400">
                    Bypass warning: {(bypassFraction * 100).toFixed(0)}% cold air bypasses server racks unutilized, wasting fan energy.
                  </span>
                ) : (
                  <span className="text-emerald-400">
                    Balanced: Optimal positive pressure in cold aisle prevents recirculation.
                  </span>
                )}
              </p>
            </div>

            {/* Quick Action: Auto-balance tiles */}
            <button
              onClick={() => {
                onUpdateFacility({
                  ...facility,
                  tileCount: Math.ceil(totalTilesNeeded * 1.1),
                });
              }}
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Auto-Balance Tile Count (+10% Safety Buffer)
            </button>
          </div>
        </div>
      </div>

      {/* Rack Airflow CFM Allocation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Server Rack Airflow Schedule
              <span className="text-xs font-mono text-slate-400 font-normal">
                ({racks.length} Racks Monitored)
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific sensible heat load (kW) and required DCFM airflow per individual rack
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['all', 'optimal', 'warning', 'critical'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors ${
                    filterStatus === st
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Add Rack Quick Bar */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium">Quick Add Rack:</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Row:</span>
            <input
              type="text"
              maxLength={2}
              value={newRackRow}
              onChange={(e) => setNewRackRow(e.target.value.toUpperCase())}
              className="w-12 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-center font-mono"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Load:</span>
            <input
              type="number"
              min="1"
              max="60"
              value={newRackKw}
              onChange={(e) => setNewRackKw(Number(e.target.value))}
              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
            />
            <span className="text-slate-400">kW</span>
          </div>

          <button
            onClick={handleAddRack}
            className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 rounded transition-colors font-medium ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Rack
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Rack Tag</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 text-right">IT Load (kW)</th>
                <th className="py-2.5 px-3 text-right">Required CFM</th>
                <th className="py-2.5 px-3 text-right">Tile CFM</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filteredRacks.map((rack) => (
                <tr key={rack.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-semibold text-white">
                    {rack.name}
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    Row {rack.row} · Pos {rack.position}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="60"
                      value={rack.itLoadKw}
                      onChange={(e) => handleUpdateRackKw(rack.id, Number(e.target.value))}
                      className="w-18 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 tabular-nums"
                    />
                  </td>
                  <td className="py-2 px-3 text-right text-slate-200 tabular-nums">
                    {unitSystem === 'imperial'
                      ? `${rack.actualCfmNeeded.toLocaleString()} CFM`
                      : `${cfmToM3h(rack.actualCfmNeeded).toLocaleString()} m³/h`}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-400 tabular-nums">
                    {unitSystem === 'imperial'
                      ? `${tileCfm.toLocaleString()} CFM`
                      : `${cfmToM3h(tileCfm).toLocaleString()} m³/h`}
                  </td>
                  <td className="py-2 px-3">
                    {rack.status === 'optimal' && (
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Flow
                      </span>
                    )}
                    {rack.status === 'warning' && (
                      <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> High Utilization
                      </span>
                    )}
                    {rack.status === 'critical' && (
                      <span className="text-red-400 flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> CFM Deficit
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleDeleteRack(rack.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Remove rack"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRacks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No racks matching filter "{filterStatus}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
