/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Droplet, 
  Activity, 
  Search, 
  Layers, 
  Sliders,
  AlertTriangle,
  Info
} from 'lucide-react';

export const FireProtectionSuite: React.FC = () => {
  // Fire Extinguisher Sizer State
  const [extAreaM2, setExtAreaM2] = useState(450);
  const [extHazard, setExtHazard] = useState<'low' | 'medium' | 'high'>('medium');

  // Sprinkler Sizer State
  const [sprinklerHazard, setSprinklerHazard] = useState<'LH' | 'OH1' | 'OH2' | 'OH3' | 'HH'>('OH1');

  // Rising Main Sizer State
  const [buildingHeightM, setBuildingHeightM] = useState(42);
  const [floorAreaM2, setFloorAreaM2] = useState(3800);

  // Extinguisher math (SS 578 : 2019)
  // For each unit of 'A' rating, maximum floor area covered is 15 m2
  const minRatingA = extHazard === 'low' ? 13 : extHazard === 'medium' ? 21 : 34;
  const areaPerExtinguisher = minRatingA * 15;
  const countNeededA = Math.ceil(extAreaM2 / areaPerExtinguisher);

  // Rising mains math
  const isWetRiser = buildingHeightM > 60;
  const risersNeeded = Math.ceil(floorAreaM2 / 930);
  const riserDiameterMm = buildingHeightM > 45 ? 150 : 100;
  const breechingInletWay = buildingHeightM > 45 ? '4-way' : '2-way';

  // Sprinkler Specs Table
  const SPRINKLER_SPECS = {
    LH: {
      name: 'Light Hazard (Schools, Hospitals, Museums)',
      density: '2.25 mm/min',
      areaOp: '84 m²',
      spacingMax: '4.6 m',
      areaCoverageMax: '21 m²',
      waterStorage: '21,000 - 25,000 Litres',
      pressureKpa: '220 - 170 kPa',
    },
    OH1: {
      name: 'Ordinary Hazard Group 1 (Offices, Restaurants)',
      density: '5.0 mm/min',
      areaOp: '72 m²',
      spacingMax: '4.2 m',
      areaCoverageMax: '12 m²',
      waterStorage: '55,000 - 70,000 Litres',
      pressureKpa: '100 - 70 kPa',
    },
    OH2: {
      name: 'Ordinary Hazard Group 2 (Bakeries, Car Parks)',
      density: '5.0 mm/min',
      areaOp: '144 m²',
      spacingMax: '4.2 m',
      areaCoverageMax: '12 m²',
      waterStorage: '105,000 - 125,000 Litres',
      pressureKpa: '140 - 100 kPa',
    },
    OH3: {
      name: 'Ordinary Hazard Group 3 (Cinemas, Dept Stores)',
      density: '5.0 mm/min',
      areaOp: '216 m²',
      spacingMax: '4.2 m',
      areaCoverageMax: '12 m²',
      waterStorage: '135,000 - 160,000 Litres',
      pressureKpa: '170 - 140 kPa',
    },
    HH: {
      name: 'High Hazard (Aircraft Hangars, Foamed Plastics)',
      density: '7.5 to 30.0 mm/min',
      areaOp: '260 to 300 m²',
      spacingMax: '3.7 m',
      areaCoverageMax: '9 m²',
      waterStorage: 'Designed to suit densities',
      pressureKpa: 'Engineered High Pressure',
    },
  };

  const currentSprinkler = SPRINKLER_SPECS[sprinklerHazard];

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Module 1 & Fire Code 2023 (9th Edition)</span>
              <span>·</span>
              <span>SCDF Standards CP 52 & SS 578</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Fire Protection Systems, Sprinklers & Rising Mains
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Automatic fire sprinklers (wet/dry/pre-action/deluge), rising main criteria (dry vs wet &gt; 60m), hose reels (36m coverage), and portable fire extinguishers (SS 578).
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Governing Authority</span>
            <span className="text-sm font-bold font-mono text-red-400">SCDF Fire Code 2023</span>
          </div>
        </div>
      </div>

      {/* Part 1: Rising Mains & Hydrant Sizing Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplet className="w-4 h-4 text-red-400" />
              Rising Mains & Landing Valves Sizer (Fire Code Chapter 6)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dry riser required for 10m to 60m habitable height. Wet riser mandatory above 60m height.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${isWetRiser ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'}`}>
              {isWetRiser ? 'WET RISING MAIN (>60m)' : 'DRY RISING MAIN (10-60m)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Building Habitable Height</span>
              <span className="font-mono text-cyan-400 font-bold">{buildingHeightM} m</span>
            </div>
            <input
              type="range"
              min="8"
              max="150"
              step="2"
              value={buildingHeightM}
              onChange={(e) => setBuildingHeightM(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>&lt; 10m (Exempt)</span>
              <span>10m - 60m (Dry Riser)</span>
              <span className="text-red-400">&gt; 60m (Wet Riser)</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Floor Plate Area (m²)</span>
              <span className="font-mono text-white font-bold">{floorAreaM2.toLocaleString()} m²</span>
            </div>
            <input
              type="range"
              min="500"
              max="8000"
              step="100"
              value={floorAreaM2}
              onChange={(e) => setFloorAreaM2(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              Max 930 m² per rising main & 38m travel distance coverage
            </span>
          </div>
        </div>

        {/* Calculation Result Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">Risers Required</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">
              {risersNeeded} Risers
            </span>
            <span className="text-[10px] text-slate-500">
              {floorAreaM2} ÷ 930 m² = {(floorAreaM2 / 930).toFixed(2)}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">Main Pipe Diameter</span>
            <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">
              Ø {riserDiameterMm} mm
            </span>
            <span className="text-[10px] text-slate-500">
              {buildingHeightM > 45 ? '150mm (>45m height)' : '100mm (≤45m height)'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">Breeching Inlet</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {breechingInletWay}
            </span>
            <span className="text-[10px] text-slate-500">
              Located within 18m of accessway
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">Landing Valve Limits</span>
            <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
              &lt; 7.0 bar
            </span>
            <span className="text-[10px] text-slate-500">
              Pressure relief prevents hose burst
            </span>
          </div>
        </div>
      </div>

      {/* Part 2: Automatic Fire Sprinkler System (CP 52) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Automatic Fire Sprinkler System (CP 52 & Hazard Classification)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select an occupancy hazard class to inspect design densities, maximum coverage area per head, and statutory stored water supply reserves.
          </p>
        </div>

        {/* Hazard Class Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {(['LH', 'OH1', 'OH2', 'OH3', 'HH'] as const).map((hz) => (
            <button
              key={hz}
              onClick={() => setSprinklerHazard(hz)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                sprinklerHazard === hz
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {hz}
            </button>
          ))}
          <span className="text-xs text-slate-300 ml-2 font-medium">
            {currentSprinkler.name}
          </span>
        </div>

        {/* CP 52 Hazard Specifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono block">Design Density</span>
            <span className="text-lg font-bold font-mono text-cyan-400 mt-1 block">
              {currentSprinkler.density}
            </span>
            <span className="text-[10px] text-slate-500">Water spray application</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono block">Assumed Area of Op</span>
            <span className="text-lg font-bold font-mono text-white mt-1 block">
              {currentSprinkler.areaOp}
            </span>
            <span className="text-[10px] text-slate-500">Simultaneous heads firing</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono block">Max Head Spacing</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
              {currentSprinkler.spacingMax} (Max {currentSprinkler.areaCoverageMax})
            </span>
            <span className="text-[10px] text-slate-500">Min 2.0m spacing without baffle</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono block">Water Supply Reserve</span>
            <span className="text-lg font-bold font-mono text-purple-400 mt-1 block">
              {currentSprinkler.waterStorage}
            </span>
            <span className="text-[10px] text-slate-500">Dedicated suction storage</span>
          </div>
        </div>

        {/* 4 Types of Sprinklers Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <strong className="text-cyan-300 block mb-1">1. Wet Pipe System</strong>
            <p className="text-slate-400">
              Pipes permanently filled with water under pressure. Opening of individual heat-sensitive bulb discharges water immediately.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <strong className="text-cyan-300 block mb-1">2. Dry Pipe System</strong>
            <p className="text-slate-400">
              Pipes pressurized with air/nitrogen. Opening of head drops air pressure to trip dry pipe valve. Used where freezing risk exists (cold rooms).
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <strong className="text-cyan-300 block mb-1">3. Pre-Action System</strong>
            <p className="text-slate-400">
              Dual interlock: requires <strong>Smoke Detector AND Sprinkler Head</strong> to rupture! Zero risk of accidental discharge water damage (Data centers, archives).
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <strong className="text-cyan-300 block mb-1">4. Deluge System</strong>
            <p className="text-slate-400">
              All sprinkler heads are open at all times. Smoke/heat detection trips deluge valve to flood the entire protected area (Transformers, chemical storage).
            </p>
          </div>
        </div>

        {/* Temperature Rating of Glass Bulb Sprinklers */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="font-mono font-bold text-slate-300 block">
            Glass Bulb Operating Temperature Color Coding (SS EN3):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono font-semibold text-[11px]">
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/40 text-amber-400">
              57°C · Orange
            </div>
            <div className="p-2 rounded bg-red-500/20 border border-red-500/50 text-red-400">
              68°C · Red (Standard)
            </div>
            <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/40 text-yellow-400">
              79°C · Yellow
            </div>
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400">
              93°C · Green
            </div>
            <div className="p-2 rounded bg-blue-500/10 border border-blue-500/40 text-blue-400">
              141°C · Blue
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Portable Fire Extinguishers Sizer (SS 578 : 2019) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Portable Fire Extinguisher Selection & Sizing (SS 578 : 2019)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              15m travel distance rule for Class A; 1 unit of A rating covers 15 m² maximum floor area.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold">
              Min {countNeededA} Extinguishers ({minRatingA}A Rating)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Floor Space Area (m²)</span>
              <span className="font-mono text-cyan-400 font-bold">{extAreaM2} m²</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="25"
              value={extAreaM2}
              onChange={(e) => setExtAreaM2(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="block text-xs text-slate-300 font-medium">Occupancy Hazard Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', rating: '13A', label: 'Low (Offices)' },
                { id: 'medium', rating: '21A', label: 'Medium (Retail)' },
                { id: 'high', rating: '34A', label: 'High (Warehouses)' },
              ].map((hz) => (
                <button
                  key={hz.id}
                  onClick={() => setExtHazard(hz.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-colors border ${
                    extHazard === hz.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {hz.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Working step-by-step box */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
          <div className="text-cyan-400 font-bold">CALCULATION WORKING:</div>
          <div>• Hazard: {extHazard.toUpperCase()} -&gt; Minimum extinguisher rating is {minRatingA}A</div>
          <div>• Floor Area Covered per Unit: {minRatingA} × 15 m² = {areaPerExtinguisher} m²</div>
          <div>• Total Extinguishers Needed = {extAreaM2} m² ÷ {areaPerExtinguisher} m² = {(extAreaM2 / areaPerExtinguisher).toFixed(2)} -&gt; <strong>{countNeededA} Extinguishers</strong></div>
          <div>• Placement Rule: Sited on escape routes such that no occupant has to travel &gt; 15m!</div>
          <div>• Mounting Height: Gross weight &gt; 4.0 kg handle ≤ 1.0m; light &lt; 4.0 kg handle ≤ 1.2m above floor.</div>
        </div>
      </div>
    </div>
  );
};
