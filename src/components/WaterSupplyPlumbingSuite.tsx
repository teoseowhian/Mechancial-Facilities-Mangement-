/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WaterSupplyBuilding } from '../types/dcfmCourse';
import { evaluateWaterSupplySystem, SS636_STORAGE_RATES } from '../utils/courseMath';
import { 
  Droplet, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Sliders, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const WaterSupplyPlumbingSuite: React.FC = () => {
  // Building water supply state
  const [groundMslM, setGroundMslM] = useState(12);
  const [fittingHeightM, setFittingHeightM] = useState(32);
  const [occupancyType, setOccupancyType] = useState<WaterSupplyBuilding['occupancyType']>('office_canteen');
  const [occupantCount, setOccupantCount] = useState(400);
  const [monthlyConsumptionM3, setMonthlyConsumptionM3] = useState(6500);
  const [isGovernment, setIsGovernment] = useState(false);

  // Active Trap Loss Visualizer
  const [activeTrapFault, setActiveTrapFault] = useState<
    'normal' | 'evaporation' | 'induced_siphonage' | 'compression' | 'high_winds' | 'capillary'
  >('normal');

  // Active Stack System
  const [activeStackType, setActiveStackType] = useState<'single' | 'ventilated' | 'fully_ventilated'>('ventilated');

  const buildingSpec: WaterSupplyBuilding = {
    buildingName: 'Commercial Office Tower',
    groundElevationMslM: groundMslM,
    highestFittingHeightM: fittingHeightM,
    occupancyType,
    occupantCount,
    monthlyWaterConsumptionM3: monthlyConsumptionM3,
    isGovernment,
  };

  const evalResult = evaluateWaterSupplySystem(buildingSpec);

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Modules 2 & 2.1</span>
              <span>·</span>
              <span>SS 636 : 2018 Code of Practice for Water Services & PUB DTSS</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Building Water Supply & Sanitary Plumbing Systems
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Determine Mode 1, 2, or 3 supply based on Mean Sea Level (MSL), size potable cisterns (&gt; 4,500 L rules), PRVs (≤ 35m head), and master the 5 causes of trap seal loss.
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Governing Code</span>
            <span className="text-sm font-bold font-mono text-cyan-400">SS 636 : 2018</span>
          </div>
        </div>
      </div>

      {/* Part 1: Water Supply Mode & Potable Storage Evaluator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              SS 636 Water Supply Mode & Storage Sizer
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              PUB supplies directly up to 25m above MSL (125 RL). Above 37m MSL (137 RL), duplicate transfer pumps are mandatory.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold">
              Mode {evalResult.supplyMode}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Ground Elevation (MSL)</span>
              <span className="font-mono text-cyan-400 font-bold">{groundMslM} m MSL</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={groundMslM}
              onChange={(e) => setGroundMslM(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Singapore Datum (0m MSL = 100m RL)</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Highest Fitting Height</span>
              <span className="font-mono text-cyan-400 font-bold">+{fittingHeightM} m</span>
            </div>
            <input
              type="range"
              min="3"
              max="80"
              step="1"
              value={fittingHeightM}
              onChange={(e) => setFittingHeightM(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              Total: {evalResult.totalElevationMslM} m MSL ({evalResult.reducedLevelM} m RL)
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="block text-xs text-slate-300 font-medium">Building Occupancy</label>
            <select
              value={occupancyType}
              onChange={(e) => setOccupancyType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="office_canteen">Offices with canteens (45 L/occ)</option>
              <option value="office_no_canteen">Offices without canteens (35 L/occ)</option>
              <option value="dwelling">Dwellings & Flats (150 L/occ)</option>
              <option value="hotel">Hotels (135 L/occ)</option>
              <option value="hostel">Hostels (90 L/occ)</option>
              <option value="school">Schools (15 L/occ)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Total Occupants</label>
            <input
              type="number"
              value={occupantCount}
              onChange={(e) => setOccupantCount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Monthly Consumption (m³/month)
            </label>
            <input
              type="number"
              value={monthlyConsumptionM3}
              onChange={(e) => setMonthlyConsumptionM3(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isGovernment}
                onChange={(e) => setIsGovernment(e.target.checked)}
                className="rounded accent-cyan-400"
              />
              <span>Government Building (Threshold 3,000 m³/mth)</span>
            </label>
          </div>
        </div>

        {/* Step-by-Step Working & Regulatory Breakdown */}
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              STEP-BY-STEP WATER SUPPLY WORKING:
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                {evalResult.dailyStorageLitres.toLocaleString()} Litres Storage
              </span>
              <span className="text-purple-400 font-bold">
                {evalResult.privateMeterRequired ? 'Private Meter Mandated' : 'No Private Meter Mandated'}
              </span>
            </div>
          </div>
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {evalResult.working}
          </pre>
        </div>
      </div>

      {/* Part 2: Sanitary Plumbing — The 5 Trap Seal Loss Mechanisms Lab */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Sanitary Plumbing: 5 Causes of Trap Water Seal Loss
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every sanitary appliance requires a trap holding a <strong>25 mm water seal</strong> to prevent foul sewer gas (H₂S, methane) from entering the building. Explore how water seal is lost:
          </p>
        </div>

        {/* Interactive Trap Loss Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 'normal', label: '1. Normal 25mm Seal' },
            { id: 'evaporation', label: '2. Evaporation' },
            { id: 'induced_siphonage', label: '3. Induced Siphonage' },
            { id: 'compression', label: '4. Compression' },
            { id: 'high_winds', label: '5. High Winds' },
            { id: 'capillary', label: '6. Capillary Action' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTrapFault(item.id as any)}
              className={`p-2.5 rounded-xl text-xs font-semibold font-mono border transition-all text-center ${
                activeTrapFault === item.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Graphic and Diagnostic Box for the Trap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950 p-6 rounded-xl border border-slate-800">
          {/* SVG P-Trap Diagram with Animated Water Level */}
          <div className="flex flex-col items-center justify-center">
            <svg width="220" height="180" viewBox="0 0 220 180" className="overflow-visible">
              {/* Pipe Body */}
              <path
                d="M 40 20 L 40 80 Q 40 140 80 140 Q 120 140 120 80 L 120 60 L 190 60 L 190 85 L 145 85 L 145 80 Q 145 165 80 165 Q 15 165 15 80 L 15 20 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Water Seal in U-bend */}
              {activeTrapFault === 'normal' && (
                <path
                  d="M 15 75 Q 15 165 80 165 Q 145 165 145 75 L 120 75 Q 120 140 80 140 Q 40 140 40 75 Z"
                  fill="#06b6d4"
                  opacity="0.85"
                />
              )}

              {activeTrapFault === 'evaporation' && (
                <path
                  d="M 15 130 Q 15 165 80 165 Q 145 165 145 130 L 120 130 Q 120 155 80 155 Q 40 155 40 130 Z"
                  fill="#06b6d4"
                  opacity="0.4"
                />
              )}

              {activeTrapFault === 'induced_siphonage' && (
                <path
                  d="M 15 120 Q 15 165 80 165 Q 145 165 145 60 L 120 60 Q 120 140 80 140 Q 40 140 40 120 Z"
                  fill="#06b6d4"
                  opacity="0.6"
                />
              )}

              {activeTrapFault === 'compression' && (
                <path
                  d="M 15 40 Q 15 165 80 165 Q 145 165 145 140 L 120 140 Q 120 140 80 140 Q 40 140 40 40 Z"
                  fill="#06b6d4"
                  opacity="0.7"
                />
              )}

              {activeTrapFault === 'high_winds' && (
                <path
                  d="M 15 105 Q 15 165 80 165 Q 145 165 145 80 L 120 80 Q 120 140 80 140 Q 40 140 40 105 Z"
                  fill="#06b6d4"
                  opacity="0.6"
                />
              )}

              {activeTrapFault === 'capillary' && (
                <>
                  <path
                    d="M 15 95 Q 15 165 80 165 Q 145 165 145 95 L 120 95 Q 120 140 80 140 Q 40 140 40 95 Z"
                    fill="#06b6d4"
                    opacity="0.6"
                  />
                  {/* Debris strand wicking */}
                  <path
                    d="M 75 145 Q 100 80 150 85"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    fill="none"
                  />
                </>
              )}

              {/* Water Seal Depth Dimension */}
              <line x1="170" y1="60" x2="170" y2="85" stroke="#10b981" strokeWidth="2" />
              <text x="178" y="75" fill="#10b981" fontSize="10" fontFamily="monospace">
                25mm Seal
              </text>
            </svg>
            <span className="text-xs font-mono text-slate-400 mt-2">
              Standard P-Trap with 25 mm Water Seal
            </span>
          </div>

          {/* Fault Diagnosis Explanations */}
          <div className="md:col-span-2 space-y-3 text-xs">
            {activeTrapFault === 'normal' && (
              <div className="space-y-1.5">
                <span className="font-bold text-emerald-400 text-sm font-mono block">
                  ✓ Normal 25 mm Water Seal Operation
                </span>
                <p className="text-slate-300">
                  A full 25 mm column of water forms a hermetic liquid barrier in the dip tube. Sewer gas cannot cross into the room.
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-400 border border-slate-800">
                  <strong>P-Trap vs S-Trap:</strong> P-Trap is preferred in modern installations because it is far less likely to lose its water seal through self-siphonage!
                </div>
              </div>
            )}

            {activeTrapFault === 'evaporation' && (
              <div className="space-y-1.5">
                <span className="font-bold text-amber-400 text-sm font-mono block">
                  1. Evaporation Loss
                </span>
                <p className="text-slate-300">
                  Occurs in guest rooms, dry floor traps, or vacant apartments where fixtures are rarely used. Warm indoor air evaporates the 25 mm seal completely over 2–4 weeks.
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-400 border border-slate-800">
                  <strong>FM Fix:</strong> Pour water periodically into dry floor traps, or install a trap primer / mechanical water seal valve.
                </div>
              </div>
            )}

            {activeTrapFault === 'induced_siphonage' && (
              <div className="space-y-1.5">
                <span className="font-bold text-amber-400 text-sm font-mono block">
                  2. Induced Siphonage
                </span>
                <p className="text-slate-300">
                  When a fixture on an upper floor discharges a large slug of water down the vertical stack, it creates a severe <strong>negative pressure zone (suction)</strong> behind it. This suction sucks the water seal out of branch traps on lower floors!
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-400 border border-slate-800">
                  <strong>FM Fix:</strong> Provide a ventilating stack or anti-siphon branch vent pipe (50 mm diameter) connecting 150 mm above fixture spillover level.
                </div>
              </div>
            )}

            {activeTrapFault === 'compression' && (
              <div className="space-y-1.5">
                <span className="font-bold text-red-400 text-sm font-mono block">
                  3. Compression Seal Loss (1st Storey Risk!)
                </span>
                <p className="text-slate-300">
                  As falling wastewater decelerates near the base of the discharge stack, it acts like a piston, creating a <strong>positive pressure zone</strong> in front of it that blows trap water upward into ground-floor bathrooms!
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-400 border border-slate-800 text-amber-300">
                  <strong>MANDATORY STATUTORY RULE:</strong> Due to high risk of compression, sanitary appliances on the 1st storey of a building are <em>NEVER</em> connected to the vertical discharge stack! They must connect directly to the underground drainage system below ground.
                </div>
              </div>
            )}

            {activeTrapFault === 'high_winds' && (
              <div className="space-y-1.5">
                <span className="font-bold text-amber-400 text-sm font-mono block">
                  4. High Winds
                </span>
                <p className="text-slate-300">
                  Strong wind gusts blowing across the roof terminal cowl create sudden negative pressure fluctuations (Bernoulli effect) that oscillate and siphon water from topmost floor traps.
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-400 border border-slate-800">
                  <strong>FM Fix:</strong> Install wind-dampened cowl terminals or cross-venting between stack and atmosphere.
                </div>
              </div>
            )}

            {activeTrapFault === 'capillary' && (
              <div className="space-y-1.5">
                <span className="font-bold text-amber-400 text-sm font-mono block">
                  5. Capillary Action
                </span>
                <p className="text-slate-300">
                  Hair, threads, or rag debris accumulating in the trap dip over the weir. Surface tension wicks water droplets drop by drop over the weir and down the drain until the seal breaks!
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-400 border border-slate-800">
                  <strong>FM Fix:</strong> Regular physical cleaning and removal of debris via the bottle trap screw cup or inspection plug.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Part 3: Sanitary Stack Systems Comparison (Single vs Ventilated vs Fully Ventilated) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">
              Sanitary Stack Systems Architecture (Lecture Unit 2)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare the 3 primary building stack designs used in Singapore commercial and residential developments.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveStackType('single')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeStackType === 'single' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              Single Stack
            </button>
            <button
              onClick={() => setActiveStackType('ventilated')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeStackType === 'ventilated' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              Ventilated Stack
            </button>
            <button
              onClick={() => setActiveStackType('fully_ventilated')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeStackType === 'fully_ventilated' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              Fully Ventilated
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className={`p-4 rounded-xl border transition-all ${activeStackType === 'single' ? 'bg-slate-950 border-cyan-500/50' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
            <span className="font-bold text-white block text-sm mb-1">1. Single Stack System</span>
            <p className="mb-2">No separate ventilating stack. Discharge stack is enlarged to limit internal pressure fluctuations.</p>
            <ul className="space-y-1 font-mono text-[11px] text-slate-300">
              <li>• Up to 4 storeys: Ø 100 mm</li>
              <li>• Up to 6 storeys: Ø 150 mm</li>
              <li>• Max length of discharge pipe: 2.5 m</li>
              <li>• Max connections: 2</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${activeStackType === 'ventilated' ? 'bg-slate-950 border-cyan-500/50' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
            <span className="font-bold text-white block text-sm mb-1">2. Ventilated Stack System</span>
            <p className="mb-2">Main discharge stack (≤ 150 mm) plus secondary stack extended to serve as ventilating stack.</p>
            <ul className="space-y-1 font-mono text-[11px] text-slate-300">
              <li>• For all building heights</li>
              <li>• Cross venting at 1st storey (300mm above ground / 225mm below lowest branch)</li>
              <li>• Cross venting at 3rd, 6th and every 3 storeys</li>
              <li>• Max length of discharge pipe: 2.5 m</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${activeStackType === 'fully_ventilated' ? 'bg-slate-950 border-cyan-500/50' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
            <span className="font-bold text-white block text-sm mb-1">3. Fully Ventilated System</span>
            <p className="mb-2">Separate discharge and ventilating stacks. Individual traps connected with branch vent pipes.</p>
            <ul className="space-y-1 font-mono text-[11px] text-slate-300">
              <li>• Branch vent pipe: Ø 50 mm</li>
              <li>• Connected 150 mm above appliance spillover</li>
              <li>• Best for widely dispersed ranges of fixtures in hospitals, laboratories, and hotels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
