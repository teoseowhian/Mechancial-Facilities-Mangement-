/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UnitSystem } from '../types/dcfm';
import { 
  sizeDuctByVelocity, 
  sizeDuctByFriction,
  cfmToM3h 
} from '../utils/engineeringMath';
import { 
  Gauge, 
  Wind, 
  Sliders, 
  Flame, 
  Layers, 
  ShieldAlert, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface DuctAerodynamicsProps {
  unitSystem: UnitSystem;
}

export const DuctAerodynamics: React.FC<DuctAerodynamicsProps> = ({ unitSystem }) => {
  const [sizingMethod, setSizingMethod] = useState<'velocity' | 'friction'>('velocity');
  const [airflowCfm, setAirflowCfm] = useState(12000);
  const [targetVelocityFpm, setTargetVelocityFpm] = useState(1400);
  const [targetFrictionInWg, setTargetFrictionInWg] = useState(0.08);
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [ductMaterial, setDuctMaterial] = useState<'galvanized' | 'aluminum' | 'stainless' | 'fabric'>('galvanized');

  // Calculation result
  const result = sizingMethod === 'velocity'
    ? sizeDuctByVelocity(airflowCfm, targetVelocityFpm, aspectRatio)
    : sizeDuctByFriction(airflowCfm, targetFrictionInWg, aspectRatio);

  // Duct sheet metal surface area per 10m (32.8 ft) length
  const perimeterIn = (result.rectWidthIn + result.rectHeightIn) * 2;
  const surfaceAreaSqFtPer100Ft = (perimeterIn / 12) * 100;

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Module 8 & CP 83 / SS 553</span>
              <span>·</span>
              <span>Duct Sizing & Air Distribution Aerodynamics</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Mechanical Ductwork Sizing & Aerodynamics
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Size supply, return, and exhaust ductwork via Equal Friction or Velocity Reduction methods, compute equivalent rectangular dimensions via the Huebscher formula, and verify fire damper specifications.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-cyan-300 font-bold">
              Huebscher Formula De
            </span>
          </div>
        </div>
      </div>

      {/* Main Sizer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Sizing Method & Parameters
            </h3>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setSizingMethod('velocity')}
                className={`px-2 py-0.5 rounded ${sizingMethod === 'velocity' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                Velocity
              </button>
              <button
                onClick={() => setSizingMethod('friction')}
                className={`px-2 py-0.5 rounded ${sizingMethod === 'friction' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                Friction
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Airflow Rate (CFM)</span>
                <span className="font-mono text-cyan-400 font-bold tabular-nums">
                  {airflowCfm.toLocaleString()} CFM ({cfmToM3h(airflowCfm).toLocaleString()} m³/h)
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="60000"
                step="500"
                value={airflowCfm}
                onChange={(e) => setAirflowCfm(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {sizingMethod === 'velocity' ? (
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Target Velocity (FPM)</span>
                  <span className="font-mono text-white font-bold">{targetVelocityFpm} FPM ({(targetVelocityFpm * 0.00508).toFixed(1)} m/s)</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2500"
                  step="50"
                  value={targetVelocityFpm}
                  onChange={(e) => setTargetVelocityFpm(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>800 (Branch)</span>
                  <span>1400 (Main)</span>
                  <span>2000 (Riser)</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Target Friction Rate</span>
                  <span className="font-mono text-white font-bold">{targetFrictionInWg}" wg / 100 ft</span>
                </div>
                <input
                  type="range"
                  min="0.04"
                  max="0.25"
                  step="0.01"
                  value={targetFrictionInWg}
                  onChange={(e) => setTargetFrictionInWg(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-mono block">
                  ASHRAE recommended equal friction is 0.08" to 0.10" wg per 100 ft.
                </span>
              </div>
            )}

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Preferred Aspect Ratio (W / H)</span>
                <span className="font-mono text-purple-400 font-bold">{aspectRatio.toFixed(1)} : 1</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                Aspect ratios ≤ 2.0 minimize pressure loss & sheet metal weight.
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">Duct Material</label>
              <select
                value={ductMaterial}
                onChange={(e) => setDuctMaterial(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="galvanized">Galvanized Steel Sheet Metal (Standard)</option>
                <option value="aluminum">Aluminum Sheet Metal (Humid/Cleanroom)</option>
                <option value="stainless">Stainless Steel (Kitchen & Battery Exhaust)</option>
                <option value="fabric">Fabric Air Duct (Gymnasiums & High Bay)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results & Geometry Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Calculated Duct Dimensions & Velocity Profile
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Actual V: {result.actualVelocityFpm} FPM
            </span>
          </div>

          {/* Cards for round and rectangular options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2">
              <span className="text-xs text-cyan-300 font-mono font-bold block">
                OPTION A: ROUND SPIRAL DUCT
              </span>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">
                Ø {result.roundDiameterIn}"{' '}
                <span className="text-sm font-normal text-slate-400">
                  ({Math.round(result.roundDiameterIn * 25.4)} mm)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Round duct offers the highest aerodynamic efficiency and lowest friction per unit perimeter.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 space-y-2">
              <span className="text-xs text-purple-300 font-mono font-bold block">
                OPTION B: EQUIVALENT RECTANGULAR DUCT
              </span>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">
                {result.rectWidthIn}" × {result.rectHeightIn}"
              </div>
              <p className="text-[11px] text-slate-400 font-sans font-mono text-[10px]">
                {Math.round(result.rectWidthIn * 25.4)} mm (W) × {Math.round(result.rectHeightIn * 25.4)} mm (H) · Aspect Ratio {result.aspectRatio}:1
              </p>
            </div>
          </div>

          {/* Detailed Aerodynamic Figures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Friction Loss</span>
              <span className="text-white font-bold text-sm block mt-0.5">
                {result.frictionRateInWgPer100Ft}" wg
              </span>
              <span className="text-[10px] text-slate-500">Per 100 ft length</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Velocity Pressure</span>
              <span className="text-white font-bold text-sm block mt-0.5">
                {result.velocityPressureInWg}" wg
              </span>
              <span className="text-[10px] text-slate-500">Pv = (V/4005)²</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Duct Perimeter</span>
              <span className="text-white font-bold text-sm block mt-0.5">
                {perimeterIn}" ({Math.round(perimeterIn * 25.4)} mm)
              </span>
              <span className="text-[10px] text-slate-500">Outer boundary</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Sheet Metal Area</span>
              <span className="text-white font-bold text-sm block mt-0.5">
                {Math.round(surfaceAreaSqFtPer100Ft)} sq ft
              </span>
              <span className="text-[10px] text-slate-500">Per 100 ft run</span>
            </div>
          </div>

          {/* Duct Accessories & Safety Reference (Slide 41-45) */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 text-xs">
            <span className="font-semibold text-cyan-300 font-mono block">
              Essential Ductwork Accessories & Singapore Code Rules:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 pt-1">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white block flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  Fire Dampers (FD):
                </strong>
                Fitted with fusible link rated at <strong>165°F (73.8°C)</strong>. Melts during fire to drop damper blades and seal compartment. *(Banned in kitchen exhaust ducts!)*
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white block flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  Flexible Connections:
                </strong>
                Heavy-duty neoprene/canvas sleeve installed between fan outlet and metal ductwork to minimize vibration transmission.
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <strong className="text-white block flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Duct Insulation:
                </strong>
                25 mm to 50 mm fiberglass or rockwool mat glued to duct surface + aluminum foil vapor barrier to prevent condensation and heat gain.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
