/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  calculatePsychrometrics, 
  fToC, 
  cToF 
} from '../utils/engineeringMath';
import { 
  Activity, 
  Thermometer, 
  Droplet, 
  Wind, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export const PsychrometricEngine: React.FC = () => {
  // Primary State Points
  const [roomDbtC, setRoomDbtC] = useState(23.0);
  const [roomRh, setRoomRh] = useState(60.0);

  const [outdoorDbtC, setOutdoorDbtC] = useState(32.0);
  const [outdoorRh, setOutdoorRh] = useState(70.0);

  const [supplyDbtC, setSupplyDbtC] = useState(14.0);
  const [supplyRh, setSupplyRh] = useState(92.0);

  const [outdoorAirFractionPct, setOutdoorAirFractionPct] = useState(15); // 15% fresh air

  // Convert to Fahrenheit for mathematical engine
  const roomPsychro = calculatePsychrometrics(cToF(roomDbtC), roomRh, 'Indoor Room Air (tr)');
  const outdoorPsychro = calculatePsychrometrics(cToF(outdoorDbtC), outdoorRh, 'Outdoor Ambient Air (to)');
  const supplyPsychro = calculatePsychrometrics(cToF(supplyDbtC), supplyRh, 'Supply Air Off-Coil (ts)');

  // Mixed Air Calculation (M = (1-x)*tr + x*to)
  const x = outdoorAirFractionPct / 100;
  const mixedDbtC = (1 - x) * roomDbtC + x * outdoorDbtC;
  const mixedHumidityRatio = (1 - x) * roomPsychro.humidityRatioLbPerLb + x * outdoorPsychro.humidityRatioLbPerLb;
  // Estimate mixed RH
  const mixedPsychro = calculatePsychrometrics(cToF(mixedDbtC), (1 - x) * roomRh + x * outdoorRh, 'Mixed Air (tm)');

  // Quick preset loader from slide 20
  const handleLoadSlideExample1 = () => {
    setRoomDbtC(23.0);
    setRoomRh(84.0); // 21°C WBT corresponds to 84% RH at 23°C DBT
  };

  const handleLoadSlideExample2 = () => {
    setOutdoorDbtC(32.0);
    setOutdoorRh(70.0); // Gives 27.5°C WBT, 87.5 kJ/kg
  };

  // SVG Psychrometric Chart dimensions:
  // X axis: Dry bulb 10°C to 40°C (width 500)
  // Y axis: Humidity ratio 0 to 0.030 kg/kg (height 300)
  const mapDbtToX = (dbtC: number) => {
    const minDbt = 10;
    const maxDbt = 40;
    const clamped = Math.max(minDbt, Math.min(maxDbt, dbtC));
    return 40 + ((clamped - minDbt) / (maxDbt - minDbt)) * 440;
  };

  const mapWToY = (wKgKg: number) => {
    const minW = 0.0;
    const maxW = 0.030;
    const clamped = Math.max(minW, Math.min(maxW, wKgKg));
    return 270 - (clamped / maxW) * 240;
  };

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Module 6 & SS 553 Clause 7.1.3</span>
              <span>·</span>
              <span>Psychrometrics & Air-Conditioning Processes</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              ASHRAE & SS 553 Psychrometric State Point Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Inspect thermodynamic properties of moist air (DBT, WBT, Dew Point, RH%, Enthalpy, Moisture Content), evaluate the 6 AC processes, and verify compliance with Singapore thermal comfort guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSlideExample1}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-300 rounded-lg transition-colors"
            >
              Slide Ex 1 (23°C/21°C WB)
            </button>
            <button
              onClick={handleLoadSlideExample2}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-300 rounded-lg transition-colors"
            >
              Slide Ex 2 (32°C/70% RH)
            </button>
          </div>
        </div>
      </div>

      {/* Interactive State Sliders & Live Values Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State 1: Indoor Room Air */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Indoor Room Air (tr)</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              SS 553 Comfort
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Dry Bulb Temperature (DBT)</span>
                <span className="font-mono font-bold text-white">{roomDbtC.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="18.0"
                max="29.0"
                step="0.5"
                value={roomDbtC}
                onChange={(e) => setRoomDbtC(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block font-mono">
                SS 553: 2016 Cl 7.1.3 stipulates 23°C to 25°C
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Relative Humidity (RH)</span>
                <span className="font-mono font-bold text-white">{roomRh.toFixed(0)} %</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="1"
                value={roomRh}
                onChange={(e) => setRoomRh(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block font-mono">
                SS 553: ≤ 65% (new), ≤ 70% (existing)
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Wet Bulb Temp (WBT):</span>
                <span className="text-white font-bold">{fToC(roomPsychro.wetBulbF)} °C</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Dew Point Temp:</span>
                <span className="text-emerald-400 font-bold">{fToC(roomPsychro.dewPointF)} °C</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Enthalpy (h):</span>
                <span className="text-purple-300 font-bold">
                  {(roomPsychro.enthalpyBtuPerLb * 2.326).toFixed(1)} kJ/kg
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Moisture Content:</span>
                <span className="text-cyan-300 font-bold">
                  {(roomPsychro.humidityRatioLbPerLb * 1000).toFixed(1)} g/kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* State 2: Outdoor Ambient Air */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <h3 className="text-sm font-semibold text-white">Outdoor Ambient (to)</h3>
            </div>
            <span className="text-xs font-mono text-red-400 font-bold">Tropical Ambient</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Dry Bulb Temperature (DBT)</span>
                <span className="font-mono font-bold text-white">{outdoorDbtC.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="26.0"
                max="38.0"
                step="0.5"
                value={outdoorDbtC}
                onChange={(e) => setOutdoorDbtC(Number(e.target.value))}
                className="w-full accent-red-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Relative Humidity (RH)</span>
                <span className="font-mono font-bold text-white">{outdoorRh.toFixed(0)} %</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="1"
                value={outdoorRh}
                onChange={(e) => setOutdoorRh(Number(e.target.value))}
                className="w-full accent-red-400 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Wet Bulb Temp (WBT):</span>
                <span className="text-white font-bold">{fToC(outdoorPsychro.wetBulbF)} °C</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Dew Point Temp:</span>
                <span className="text-emerald-400 font-bold">{fToC(outdoorPsychro.dewPointF)} °C</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Enthalpy (h):</span>
                <span className="text-purple-300 font-bold">
                  {(outdoorPsychro.enthalpyBtuPerLb * 2.326).toFixed(1)} kJ/kg
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Moisture Content:</span>
                <span className="text-cyan-300 font-bold">
                  {(outdoorPsychro.humidityRatioLbPerLb * 1000).toFixed(1)} g/kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* State 3: Off-Coil Supply Air & Mixed Air */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Supply Air Off-Coil (ts)</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">Cooling & Dehum</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Supply Off-Coil DBT</span>
                <span className="font-mono font-bold text-white">{supplyDbtC.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="18.0"
                step="0.5"
                value={supplyDbtC}
                onChange={(e) => setSupplyDbtC(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Fresh Outdoor Air Fraction (%)</span>
                <span className="font-mono font-bold text-white">{outdoorAirFractionPct} %</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={outdoorAirFractionPct}
                onChange={(e) => setOutdoorAirFractionPct(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block font-mono">
                Mixed Air DBT: {mixedDbtC.toFixed(1)}°C
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Sensible Temp Delta:</span>
                <span className="text-emerald-400 font-bold">
                  tr - ts = {(roomDbtC - supplyDbtC).toFixed(1)} K
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cooling Coil Heat Removal:</span>
                <span className="text-purple-300 font-bold">
                  Δh = {((outdoorPsychro.enthalpyBtuPerLb - supplyPsychro.enthalpyBtuPerLb) * 2.326).toFixed(1)} kJ/kg
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Moisture Condensed Out:</span>
                <span className="text-cyan-300 font-bold">
                  {Math.max(0, (mixedPsychro.humidityRatioLbPerLb - supplyPsychro.humidityRatioLbPerLb) * 1000).toFixed(1)} g/kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Psychrometric SVG Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Interactive Psychrometric Diagram (Barometric Pressure 101.325 kPa)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Displays constant dry bulb lines (vertical), moisture content lines (horizontal), 100% saturation curve, and plotted state points.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Room Air (R)
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Outdoor Air (O)
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Mixed Air (M)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Supply Off-Coil (S)
            </span>
          </div>
        </div>

        {/* SVG Viewport */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center overflow-x-auto">
          <svg width="520" height="320" viewBox="0 0 520 320" className="overflow-visible">
            {/* Grid background lines */}
            {[10, 15, 20, 25, 30, 35, 40].map((t) => (
              <line
                key={t}
                x1={mapDbtToX(t)}
                y1={270}
                x2={mapDbtToX(t)}
                y2={30}
                stroke="#1e293b"
                strokeDasharray="2 2"
              />
            ))}
            {[0.005, 0.010, 0.015, 0.020, 0.025, 0.030].map((w) => (
              <line
                key={w}
                x1={40}
                y1={mapWToY(w)}
                x2={480}
                y2={mapWToY(w)}
                stroke="#1e293b"
                strokeDasharray="2 2"
              />
            ))}

            {/* Axes */}
            <line x1={40} y1={270} x2={480} y2={270} stroke="#64748b" strokeWidth="2" />
            <line x1={480} y1={270} x2={480} y2={30} stroke="#64748b" strokeWidth="2" />

            {/* 100% Saturation Curve Approximate Path */}
            <path
              d="M 40 250 Q 80 230 140 180 T 260 90 T 380 40 L 480 30"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
            />
            <text x="70" y="215" fill="#0ea5e9" fontSize="10" fontFamily="monospace" transform="rotate(-35 70 215)">
              100% Saturation Line
            </text>

            {/* SS 553 Recommended Comfort Zone Box (23-25°C, RH ≤ 65%, DP 5.5-15°C) */}
            <rect
              x={mapDbtToX(23)}
              y={mapWToY(0.012)}
              width={mapDbtToX(25) - mapDbtToX(23)}
              height={mapWToY(0.006) - mapWToY(0.012)}
              fill="#10b981"
              fillOpacity="0.15"
              stroke="#10b981"
              strokeDasharray="4 2"
            />
            <text x={mapDbtToX(23) + 2} y={mapWToY(0.012) - 4} fill="#10b981" fontSize="9" fontFamily="monospace">
              SS 553 Comfort
            </text>

            {/* Process Vectors: Mixing Line (O to R) and Cooling & Dehumidification (M to S) */}
            {/* O to R Mixing Line */}
            <line
              x1={mapDbtToX(outdoorDbtC)}
              y1={mapWToY(outdoorPsychro.humidityRatioLbPerLb)}
              x2={mapDbtToX(roomDbtC)}
              y2={mapWToY(roomPsychro.humidityRatioLbPerLb)}
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* M to S Cooling & Dehumidification Line */}
            <line
              x1={mapDbtToX(mixedDbtC)}
              y1={mapWToY(mixedPsychro.humidityRatioLbPerLb)}
              x2={mapDbtToX(supplyDbtC)}
              y2={mapWToY(supplyPsychro.humidityRatioLbPerLb)}
              stroke="#10b981"
              strokeWidth="2"
            />

            {/* S to R Room Sensible & Latent Heat Gain Line */}
            <line
              x1={mapDbtToX(supplyDbtC)}
              y1={mapWToY(supplyPsychro.humidityRatioLbPerLb)}
              x2={mapDbtToX(roomDbtC)}
              y2={mapWToY(roomPsychro.humidityRatioLbPerLb)}
              stroke="#06b6d4"
              strokeWidth="2"
            />

            {/* State Points */}
            {/* Room (R) */}
            <circle
              cx={mapDbtToX(roomDbtC)}
              cy={mapWToY(roomPsychro.humidityRatioLbPerLb)}
              r="6"
              fill="#06b6d4"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={mapDbtToX(roomDbtC) + 8}
              y={mapWToY(roomPsychro.humidityRatioLbPerLb) - 4}
              fill="#06b6d4"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              R ({roomDbtC}°C)
            </text>

            {/* Outdoor (O) */}
            <circle
              cx={mapDbtToX(outdoorDbtC)}
              cy={mapWToY(outdoorPsychro.humidityRatioLbPerLb)}
              r="6"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={mapDbtToX(outdoorDbtC) - 45}
              y={mapWToY(outdoorPsychro.humidityRatioLbPerLb) - 6}
              fill="#ef4444"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              O ({outdoorDbtC}°C)
            </text>

            {/* Mixed (M) */}
            <circle
              cx={mapDbtToX(mixedDbtC)}
              cy={mapWToY(mixedPsychro.humidityRatioLbPerLb)}
              r="5"
              fill="#a855f7"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <text
              x={mapDbtToX(mixedDbtC) + 8}
              y={mapWToY(mixedPsychro.humidityRatioLbPerLb) + 12}
              fill="#a855f7"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              M ({mixedDbtC.toFixed(1)}°C)
            </text>

            {/* Supply (S) */}
            <circle
              cx={mapDbtToX(supplyDbtC)}
              cy={mapWToY(supplyPsychro.humidityRatioLbPerLb)}
              r="6"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={mapDbtToX(supplyDbtC) - 30}
              y={mapWToY(supplyPsychro.humidityRatioLbPerLb) + 15}
              fill="#10b981"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              S ({supplyDbtC}°C)
            </text>

            {/* Axis labels */}
            {[10, 15, 20, 25, 30, 35, 40].map((t) => (
              <text key={t} x={mapDbtToX(t)} y={288} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {t}°C
              </text>
            ))}
            <text x={260} y={308} fill="#cbd5e1" fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">
              Dry Bulb Temperature (°C)
            </text>

            {[0.005, 0.010, 0.015, 0.020, 0.025].map((w) => (
              <text key={w} x={485} y={mapWToY(w) + 3} fill="#94a3b8" fontSize="9" fontFamily="monospace">
                {(w * 1000).toFixed(0)}g
              </text>
            ))}
            <text x={515} y={150} fill="#cbd5e1" fontSize="10" transform="rotate(90 515 150)" textAnchor="middle" fontFamily="sans-serif">
              Moisture Content (g/kg dry air)
            </text>
          </svg>
        </div>
      </div>

      {/* Practical 1: Sling Psychrometer vs TSI VelociCalc Instrumentation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            Instrumentation: Sling Psychrometer vs TSI VelociCalc (Practical 1 Lab)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key practical concepts for Week 5 campus session at Blk 34 #03-02 (TSI VelociCalc vs Whirling Sling Psychrometer).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <strong className="text-cyan-300 block text-sm">1. Whirling / Sling Psychrometer (Manual)</strong>
            <p className="text-slate-300">
              Consists of two mercury-in-glass thermometers (Dry Bulb and Wet Bulb with cotton wick soaked in distilled water). Whirled manually at ~2 to 3 revolutions per second to achieve air velocity across the wick.
            </p>
            <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
              <li>• Human error sources: insufficient wick wetting, hand heat conduction, reading parallax error.</li>
              <li>• Always read wet bulb immediately before dry bulb to avoid evaporative warming.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <strong className="text-emerald-300 block text-sm">2. Electronic Meter (TSI VelociCalc)</strong>
            <p className="text-slate-300">
              Digital thermal anemometer probe with semiconductor RTD temperature sensor and thin-film capacitive RH sensor.
            </p>
            <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
              <li>• Instant digital readout of air velocity (m/s), dry bulb (°C), and % RH.</li>
              <li>• Superior accuracy at low indoor air velocities (0.1–0.3 m/s) but sensitive to turbulent drafts.</li>
              <li>• Use CBE ASHRAE-55 Thermal Comfort tool to verify occupant PMV/PPD compliance!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
