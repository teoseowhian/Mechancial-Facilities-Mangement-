/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  RotateCcw, 
  Sliders, 
  Play,
  Info
} from 'lucide-react';

export const TownGasSuite: React.FC = () => {
  // Kitchen Interlock Simulation State
  const [exhaustFanRunning, setExhaustFanRunning] = useState(true);
  const [gasDetectorTriggered, setGasDetectorTriggered] = useState(false);
  const [fireAlarmTriggered, setFireAlarmTriggered] = useState(false);
  const [manualResetCompleted, setManualResetCompleted] = useState(true);

  // Pressure test simulation state
  const [testPhase, setTestPhase] = useState<'idle' | 'pumping' | 'stabilising' | 'testing' | 'passed' | 'failed'>('idle');
  const [manometerMmWg, setManometerMmWg] = useState(0);
  const [hasLeak, setHasLeak] = useState(false);

  // Gas solenoid valve state
  const isInterlockSafe = exhaustFanRunning && !gasDetectorTriggered && !fireAlarmTriggered;
  const isSolenoidEnergised = isInterlockSafe && manualResetCompleted;

  // Pressure testing animation
  const handleStartPressureTest = () => {
    setTestPhase('pumping');
    setManometerMmWg(300);
    setTimeout(() => {
      setTestPhase('stabilising');
      setTimeout(() => {
        setTestPhase('testing');
        setTimeout(() => {
          if (hasLeak) {
            setManometerMmWg(240);
            setTestPhase('failed');
          } else {
            setManometerMmWg(300);
            setTestPhase('passed');
          }
        }, 3000);
      }, 2000);
    }, 1500);
  };

  const handleResetPressureTest = () => {
    setTestPhase('idle');
    setManometerMmWg(0);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Module 4 & SS 608 : 2015</span>
              <span>·</span>
              <span>Gas Act (Cap 116A) & City Gas Handbook</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Town Gas Supply, Commercial Kitchen Interlocks & Safety
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Manufactured gas properties (SG 0.5–0.59, CV 18.63 MJ/m³), mandatory kitchen exhaust-gas solenoid interlocks, yellow pipe coding, and 300 mm WG pressure testing procedures.
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Regulator</span>
            <span className="text-sm font-bold font-mono text-yellow-400">EMA / PowerGas</span>
          </div>
        </div>
      </div>

      {/* Part 1: Interactive Commercial Kitchen Solenoid Interlock Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-yellow-400" />
              Commercial Kitchen Gas Solenoid Interlock System (Fail-Safe)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The kitchen gas solenoid valve is electrically energized to stay open. If the mechanical exhaust fan fails, gas detector trips, or fire alarm activates, the valve de-energizes and shuts instantly!
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                isSolenoidEnergised
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border-red-500/40'
              }`}
            >
              {isSolenoidEnergised ? '● SOLENOID ENERGISED (GAS OPEN)' : '■ DE-ENERGISED (GAS SHUT)'}
            </span>
          </div>
        </div>

        {/* Visual Interlock Flowchart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Fan Status */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold block">1. Mechanical Exhaust Fan</span>
            <div className="flex items-center justify-between pt-1">
              <span className={exhaustFanRunning ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {exhaustFanRunning ? 'RUNNING' : 'FAILED / OFF'}
              </span>
              <button
                onClick={() => {
                  setExhaustFanRunning(!exhaustFanRunning);
                  if (exhaustFanRunning) setManualResetCompleted(false);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
              >
                Toggle Fan
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              Interlocked: Gas shuts if fan current drops.
            </p>
          </div>

          {/* Gas Detection System */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold block">2. Gas Detection (GDS)</span>
            <div className="flex items-center justify-between pt-1">
              <span className={gasDetectorTriggered ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {gasDetectorTriggered ? 'GAS LEAK ALARM' : 'NORMAL (0 ppm)'}
              </span>
              <button
                onClick={() => {
                  setGasDetectorTriggered(!gasDetectorTriggered);
                  if (!gasDetectorTriggered) setManualResetCompleted(false);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
              >
                Simulate Leak
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              Detects town gas leak (flammability 3%-55%).
            </p>
          </div>

          {/* Fire Alarm System */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold block">3. Fire Alarm (FAS)</span>
            <div className="flex items-center justify-between pt-1">
              <span className={fireAlarmTriggered ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {fireAlarmTriggered ? 'FIRE TRIPPED' : 'NORMAL'}
              </span>
              <button
                onClick={() => {
                  setFireAlarmTriggered(!fireAlarmTriggered);
                  if (!fireAlarmTriggered) setManualResetCompleted(false);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
              >
                Trip Fire
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              Cuts off gas fuel so fire is not fed.
            </p>
          </div>

          {/* Manual Reset Panel */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold block">4. Manual Operator Reset</span>
            <div className="flex items-center justify-between pt-1">
              <span className={manualResetCompleted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {manualResetCompleted ? 'RESET READY' : 'REQUIRES RESET'}
              </span>
              <button
                disabled={!isInterlockSafe || manualResetCompleted}
                onClick={() => setManualResetCompleted(true)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  !isInterlockSafe || manualResetCompleted
                    ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                }`}
              >
                Manual Reset
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              Close all burner taps before resetting solenoid!
            </p>
          </div>
        </div>

        {/* Status Callout */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          {isSolenoidEnergised ? (
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>System Normal:</strong> Solenoid valve energized, burners receiving constant outlet pressure from gas governor. Exhaust ventilation actively purging products of combustion.
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong>SAFETY INTERLOCK ACTIVATED:</strong> Solenoid valve electromagnet de-energized. Internal spring has snapped the valve shut!
                <div className="mt-1 text-slate-400">
                  Required Recovery Procedure: 1. Rectify fault condition ➔ 2. Close ALL burner taps in kitchen ➔ 3. Press Manual Reset button on gas control panel.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Part 2: 300 mm WG Pressure Testing & Soundness Verification Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Gas Pipework Pressure Testing Simulator (300 mm Water Gauge)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Testing procedure from Lecture Unit 4: Cap off all outlets, pump air to 300 mm WG, allow 2 mins for temperature to stabilise, monitor for 10 mins (zero pressure drop).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHasLeak(!hasLeak)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                hasLeak ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {hasLeak ? 'SIMULATE DEFECTIVE LEAK' : 'SOUND SYSTEM (NO LEAK)'}
            </button>
            <button
              disabled={testPhase === 'pumping' || testPhase === 'stabilising' || testPhase === 'testing'}
              onClick={handleStartPressureTest}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Start 300mm Test
            </button>
            <button
              onClick={handleResetPressureTest}
              className="px-2.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Manometer Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950 p-6 rounded-xl border border-slate-800">
          <div className="flex flex-col items-center justify-center space-y-2">
            {/* U-Tube Manometer SVG */}
            <svg width="140" height="180" viewBox="0 0 140 180">
              <rect x="30" y="20" width="80" height="150" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              {/* U-Tube Glass */}
              <path
                d="M 50 30 L 50 140 Q 50 160 70 160 Q 90 160 90 140 L 90 30"
                fill="none"
                stroke="#64748b"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Colored Water Column */}
              <path
                d={`M 50 ${140 - manometerMmWg * 0.15} L 50 140 Q 50 160 70 160 Q 90 160 90 140 L 90 ${140 + manometerMmWg * 0.15}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Measurement Scale */}
              <line x1="68" y1="40" x2="72" y2="40" stroke="#94a3b8" />
              <line x1="65" y1="95" x2="75" y2="95" stroke="#94a3b8" strokeWidth="2" />
              <line x1="68" y1="150" x2="72" y2="150" stroke="#94a3b8" />
            </svg>
            <span className="text-xs font-mono text-cyan-400 font-bold tabular-nums">
              {manometerMmWg} mm Water Gauge
            </span>
          </div>

          <div className="md:col-span-2 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400 font-semibold">Test Phase:</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-900 border border-slate-700 text-white uppercase">
                {testPhase}
              </span>
            </div>

            <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
              <li className={testPhase === 'pumping' ? 'text-cyan-400 font-bold' : ''}>
                1. Pump air up to 300 mm water gauge pressure.
              </li>
              <li className={testPhase === 'stabilising' ? 'text-cyan-400 font-bold' : ''}>
                2. Shut test valve. Allow 2 mins for pressure to stabilise.
              </li>
              <li className={testPhase === 'testing' ? 'text-cyan-400 font-bold' : ''}>
                3. Monitor for 10 minutes. Pressure must remain constant.
              </li>
              <li className={testPhase === 'passed' ? 'text-emerald-400 font-bold' : testPhase === 'failed' ? 'text-red-400 font-bold' : ''}>
                4. Outcome: {testPhase === 'passed' ? 'Zero pressure drop -> Installation is sound!' : testPhase === 'failed' ? 'Pressure drop detected! Apply soap solution to locate leaks.' : 'Awaiting test completion.'}
              </li>
            </ul>

            <div className="p-3 bg-slate-900 rounded-lg text-slate-400 border border-slate-800 text-[11px]">
              <strong className="text-white">Statutory Soundness Test Interval:</strong>
              <br />
              • All new gas installations before turn-on.
              <br />
              • Existing non-residential buildings: once every 3 years.
              <br />
              • Common areas in residential buildings (BBQ pits, communal kitchens): once every 3 years.
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Physical Properties of Manufactured Town Gas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">
            Manufactured Town Gas Specifications (SS 608: 2015)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key physical and chemical properties of piped town gas manufactured from naphtha in Singapore.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Specific Gravity (SG)</span>
            <span className="text-lg font-bold text-cyan-300 mt-1 block">0.50 - 0.59</span>
            <span className="text-[10px] text-slate-500 font-sans">Lighter than air (leaks rise & dissipate quickly)</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Calorific Value (CV)</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">18.63 MJ/m³</span>
            <span className="text-[10px] text-slate-500 font-sans">Energy released per cubic metre</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Combustion Air Required</span>
            <span className="text-lg font-bold text-white mt-1 block">4.5 m³ air</span>
            <span className="text-[10px] text-slate-500 font-sans">Per 1 m³ gas for complete combustion</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Flammability Limits</span>
            <span className="text-lg font-bold text-amber-400 mt-1 block">3% to 55%</span>
            <span className="text-[10px] text-slate-500 font-sans">&lt;3% weak, &gt;55% rich (will not burn)</span>
          </div>
        </div>

        {/* Prohibited Areas Warning */}
        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-2">
          <span className="text-yellow-400 font-bold font-mono">
            Prohibited Areas for Gas Installations in Buildings:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 pt-1">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <strong>Electrical Rooms & Switchgear:</strong> Electric sparks can cause explosive ignition. Prohibited unless in metal sleeve or masonry fire-rated duct.
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <strong>Protected Escape Routes:</strong> Fire-fighting lobbies, smoke-free lobbies, and exit staircases must stay free of gas pipes to prevent trapping occupants.
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <strong>Bedrooms:</strong> Gas pipes shall not be chased in common partition walls with bedrooms unless wall is ≥ 150mm thick and chase depth ≤ 50mm.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
