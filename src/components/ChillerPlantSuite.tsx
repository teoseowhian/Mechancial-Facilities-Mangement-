/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  calculateChillerCapacityKw, 
  calculateChillerEfficiency, 
  calculateAffinityPowerReduction,
  calculateGm2021PartLoadPumpPower,
  calculateGm2021CoolingTowerFanPower,
  DEFAULT_HOURLY_CHILLER_DATA
} from '../utils/courseMath';
import { 
  Droplets, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  RotateCcw, 
  Award, 
  TrendingUp, 
  Power,
  ShieldAlert,
  Info
} from 'lucide-react';

interface ChillerPlantSuiteProps {
  onEarnXp?: (xp: number, badgeTitle?: string) => void;
}

export const ChillerPlantSuite: React.FC<ChillerPlantSuiteProps> = ({ onEarnXp }) => {
  // Chiller Efficiency Challenge State
  const [chwSupplyTempC, setChwSupplyTempC] = useState(7.0);
  const [condenserWaterTempC, setCondenserWaterTempC] = useState(29.0);
  const [coolingLoadRt, setCoolingLoadRt] = useState(600); // Out of 650 RT chiller
  const [pumpSpeedPercent, setPumpSpeedPercent] = useState(100);
  const [towerFanSpeedPercent, setTowerFanSpeedPercent] = useState(100);
  const [hotGasBypassActive, setHotGasBypassActive] = useState(false);
  const [hasWonBadge, setHasWonBadge] = useState(false);

  // Interlocked starting sequence simulation
  const [startStep1Tower, setStartStep1Tower] = useState(false);
  const [startStep2Cwp, setStartStep2Cwp] = useState(false);
  const [startStep3Ahu, setStartStep3Ahu] = useState(false);
  const [startStep4Chwp, setStartStep4Chwp] = useState(false);
  const [startStep5Chiller, setStartStep5Chiller] = useState(false);
  const [sequenceError, setSequenceError] = useState<string | null>(null);

  // Calculator inputs
  const [calcFlowLps, setCalcFlowLps] = useState(45);
  const [calcDeltaTC, setCalcDeltaTC] = useState(5.5);
  const [calcInputKw, setCalcInputKw] = useState(180);

  // Calculations for Chiller Challenge
  const fullLoadRatingRt = 650;
  const partLoadFraction = coolingLoadRt / fullLoadRatingRt;

  // Temperature lift impact: standard is 29°C - 7°C = 22°C lift
  const liftC = condenserWaterTempC - chwSupplyTempC;
  // Baseline full load chiller power is 350 kW at 7°C CHW and 29°C CW (~0.538 kW/RT)
  // Raising CHWST from 6.7°C to 10°C improves efficiency by ~2-3% per °C!
  const chwstBenefitRatio = 1 - (chwSupplyTempC - 6.7) * 0.025;
  const cwstPenaltyRatio = 1 + (condenserWaterTempC - 29.0) * 0.02;

  // Chiller compressor power
  let compressorKw = (350 * partLoadFraction) * chwstBenefitRatio * cwstPenaltyRatio;
  if (hotGasBypassActive) {
    compressorKw += 30; // Bypass consumes extra energy to maintain compressor stability
  }

  // Pump power via Green Mark 2021 Guide polynomial
  const pumpFullLoadKw = 70;
  const pumpPartLoad = calculateGm2021PartLoadPumpPower(pumpFullLoadKw, pumpSpeedPercent / 100);
  const chwpKw = pumpPartLoad.partLoadKw;

  // Cooling tower fan power via Green Mark 2021 Guide polynomial
  const towerFullLoadKw = 60;
  const towerPartLoad = calculateGm2021CoolingTowerFanPower(towerFullLoadKw, towerFanSpeedPercent / 100);
  const towerFanKw = towerPartLoad.partLoadKw;

  // Total plant power & kW/RT
  const totalPlantKw = compressorKw + chwpKw + towerFanKw;
  const plantKwPerRt = coolingLoadRt > 0 ? totalPlantKw / coolingLoadRt : 0;
  const chillerKwPerRt = coolingLoadRt > 0 ? compressorKw / coolingLoadRt : 0;
  const chillerCop = compressorKw > 0 ? (coolingLoadRt * 3.517) / compressorKw : 0;

  // Surge risk evaluation: occurs at low capacity + high lift (high condensing pressure vs low evaporating pressure)
  const isSurgeCondition = partLoadFraction < 0.35 && liftC > 24 && !hotGasBypassActive;
  const isTargetAchieved = plantKwPerRt <= 0.85 && !isSurgeCondition;

  const handleResetChallenge = () => {
    setChwSupplyTempC(7.0);
    setCondenserWaterTempC(29.0);
    setCoolingLoadRt(600);
    setPumpSpeedPercent(100);
    setTowerFanSpeedPercent(100);
    setHotGasBypassActive(false);
  };

  const handleClaimBadge = () => {
    if (isTargetAchieved && !hasWonBadge) {
      setHasWonBadge(true);
      if (onEarnXp) {
        onEarnXp(100, 'Green Mark Plant Master');
      }
    }
  };

  // Starting sequence handlers
  const handleToggleTower = () => {
    if (startStep2Cwp || startStep5Chiller) {
      setSequenceError('Cannot turn off cooling tower while pumps or chiller are operating!');
      return;
    }
    setStartStep1Tower(!startStep1Tower);
    setSequenceError(null);
  };

  const handleToggleCwp = () => {
    if (!startStep1Tower && !startStep2Cwp) {
      setSequenceError('Interlock Error: Cooling tower must be started BEFORE Condenser Water Pump (CWP)!');
      return;
    }
    if (startStep5Chiller) {
      setSequenceError('Cannot stop CWP while Chiller is operating (risk of high condensing pressure trip)!');
      return;
    }
    setStartStep2Cwp(!startStep2Cwp);
    setSequenceError(null);
  };

  const handleToggleAhu = () => {
    setStartStep3Ahu(!startStep3Ahu);
    setSequenceError(null);
  };

  const handleToggleChwp = () => {
    if (!startStep3Ahu && !startStep4Chwp) {
      setSequenceError('Warning: AHUs should be started before CHWP to establish building heat load.');
    }
    if (startStep5Chiller) {
      setSequenceError('Severe Interlock Trip: Cannot stop CHWP while Chiller is operating! Water in evaporator tubes will freeze!');
      return;
    }
    setStartStep4Chwp(!startStep4Chwp);
    setSequenceError(null);
  };

  const handleToggleChiller = () => {
    if (!startStep2Cwp || !startStep4Chwp) {
      setSequenceError('Interlock Trip: Chiller CANNOT start without both CWP and CHWP water flow switches closed!');
      return;
    }
    setStartStep5Chiller(!startStep5Chiller);
    setSequenceError(null);
    if (!startStep5Chiller && onEarnXp) {
      onEarnXp(50, 'Chiller Starting Interlock Master');
    }
  };

  // Calculator working
  const capacityResult = calculateChillerCapacityKw(calcFlowLps, calcDeltaTC);
  const efficiencyResult = calculateChillerEfficiency(calcInputKw, capacityResult.coolingRt);

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Module 9.1 & 8.2</span>
              <span>·</span>
              <span>Singapore Standards SS 530 & SS 553</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Water-Cooled Chiller Plant & Hydraulic Pumping
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Understand chiller part-load polynomials, fan/pump affinity laws, CHWST reset, starting sequences, and prevent catastrophic chiller surge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block font-mono">BCA Green Mark Limit</span>
              <span className="text-sm font-bold font-mono text-emerald-400">≤ 0.85 kW/RT (New)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Mini-Game 1: Chiller Plant Efficiency & Surge Challenge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SIMULATOR CHALLENGE
              </span>
              <h3 className="text-base font-bold text-white">
                Chiller Plant Operator: Peak Efficiency & Anti-Surge
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Act as the Chief Facility Plant Operator! Optimize overall plant efficiency to satisfy the BCA Green Mark standard (≤ 0.85 kW/RT) while avoiding compressor surge trips.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChallenge}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            {isTargetAchieved && !hasWonBadge && (
              <button
                onClick={handleClaimBadge}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                Claim Badge (+100 XP)
              </button>
            )}
          </div>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Overall Plant Efficiency</span>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums flex items-baseline gap-1">
              <span className={plantKwPerRt <= 0.85 ? 'text-emerald-400' : 'text-amber-400'}>
                {plantKwPerRt.toFixed(3)}
              </span>
              <span className="text-xs text-slate-400 font-normal">kW/RT</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              {plantKwPerRt <= 0.85 ? '✓ Compliant with Green Mark' : '⚠ Exceeds 0.85 kW/RT code'}
            </span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Chiller COP</span>
            <div className="mt-2 text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {chillerCop.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Chiller: {chillerKwPerRt.toFixed(3)} kW/RT
            </span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Temperature Lift</span>
            <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
              {liftC.toFixed(1)} °C
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              CWST ({condenserWaterTempC}°C) - CHWST ({chwSupplyTempC}°C)
            </span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Surge Hazard Risk</span>
            <div className="mt-2 text-xl font-bold font-mono">
              {isSurgeCondition ? (
                <span className="text-red-400 flex items-center gap-1">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                  SURGING!
                </span>
              ) : partLoadFraction < 0.45 && liftC > 22 ? (
                <span className="text-amber-400">ELEVATED</span>
              ) : (
                <span className="text-emerald-400">STABLE</span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              {isSurgeCondition ? 'Engage Hot Gas Bypass!' : 'Impeller velocity sufficient'}
            </span>
          </div>
        </div>

        {/* Warning Banner if Surging */}
        {isSurgeCondition && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-red-200">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">
                CRITICAL WARNING: Centrifugal Chiller Surge Detected!
              </p>
              <p className="mt-1 text-slate-300">
                At reduced capacity ({coolingLoadRt} RT = {(partLoadFraction * 100).toFixed(0)}% load) with high lift ({liftC.toFixed(1)}°C), the head necessary to handle reduced vapor volume exceeds the head the compressor impeller can produce. High-pressure vapor flows backward from the condenser into the compressor!
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => setHotGasBypassActive(true)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold transition-colors"
                >
                  Activate Hot Gas Bypass
                </button>
                <button
                  onClick={() => setChwSupplyTempC(10.0)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                >
                  Raise CHWST to 10°C (Reduce Lift)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Operator Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {/* CHWST Control */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-medium">Chilled Water Supply Temp (CHWST)</span>
              <span className="font-mono text-cyan-400 font-bold">{chwSupplyTempC.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="12.0"
              step="0.5"
              value={chwSupplyTempC}
              onChange={(e) => setChwSupplyTempC(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Lecture worked example: Raising CHWST from 6.7°C → 10°C reduces compressor lift and increases evaporating pressure, raising COP!
            </p>
          </div>

          {/* CWST Control */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-medium">Condenser Water Temp (CWST)</span>
              <span className="font-mono text-cyan-400 font-bold">{condenserWaterTempC.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min="27.0"
              max="35.0"
              step="0.5"
              value={condenserWaterTempC}
              onChange={(e) => setCondenserWaterTempC(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Lower condenser water temperature reduces condensing pressure $P_2$, lowering required compressor work!
            </p>
          </div>

          {/* Cooling Load */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-medium">Building Cooling Load (RT)</span>
              <span className="font-mono text-white font-bold">{coolingLoadRt} RT ({(partLoadFraction * 100).toFixed(0)}%)</span>
            </div>
            <input
              type="range"
              min="150"
              max="650"
              step="25"
              value={coolingLoadRt}
              onChange={(e) => setCoolingLoadRt(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Notice: At low loads (&lt; 250 RT) and high condenser water temp, chiller surge risk surges!
            </p>
          </div>

          {/* CHWP Speed VSD */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-medium">Chilled Water Pump VSD Speed</span>
              <span className="font-mono text-emerald-400 font-bold">{pumpSpeedPercent}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={pumpSpeedPercent}
              onChange={(e) => setPumpSpeedPercent(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Power: {chwpKw.toFixed(1)} kW</span>
              <span>GM 2021 Ratio: {pumpPartLoad.ratio.toFixed(3)}</span>
            </div>
          </div>

          {/* Tower Fan Speed VSD */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-medium">Cooling Tower Fan VSD Speed</span>
              <span className="font-mono text-emerald-400 font-bold">{towerFanSpeedPercent}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={towerFanSpeedPercent}
              onChange={(e) => setTowerFanSpeedPercent(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Power: {towerFanKw.toFixed(1)} kW</span>
              <span>GM 2021 Ratio: {towerPartLoad.ratio.toFixed(3)}</span>
            </div>
          </div>

          {/* Hot Gas Bypass Toggle */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-slate-300 block">Hot Gas Bypass Valve</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Bypasses hot refrigerant from compressor discharge back to evaporator to prevent surge at low loads.
              </p>
            </div>
            <button
              onClick={() => setHotGasBypassActive(!hotGasBypassActive)}
              className={`mt-3 py-1.5 px-3 rounded-lg text-xs font-semibold font-mono transition-colors ${
                hotGasBypassActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {hotGasBypassActive ? 'ENABLED (+30 kW stability)' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* Starting & Shutting Down Interlock Sequencer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Power className="w-4 h-4 text-cyan-400" />
              Chiller Plant Starting & Shutdown Interlock Sequencer
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Practice the strict 5-step interlocking protocol taught in Unit 9 (preventing evaporator tube freezing and high head pressure trips).
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            Standard: Code of Practice M&E Plants
          </span>
        </div>

        {sequenceError && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{sequenceError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <button
            onClick={handleToggleTower}
            className={`p-3 rounded-xl border text-left transition-all ${
              startStep1Tower
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[11px] font-mono text-slate-500 uppercase">Step 1</div>
            <div className="text-xs font-bold text-white mt-1">Cooling Tower(s)</div>
            <div className="text-[11px] mt-2 font-mono">
              {startStep1Tower ? '● RUNNING' : '○ STOPPED'}
            </div>
          </button>

          <button
            onClick={handleToggleCwp}
            className={`p-3 rounded-xl border text-left transition-all ${
              startStep2Cwp
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[11px] font-mono text-slate-500 uppercase">Step 2</div>
            <div className="text-xs font-bold text-white mt-1">Condenser Water Pump (CWP)</div>
            <div className="text-[11px] mt-2 font-mono">
              {startStep2Cwp ? '● FLOW OK' : '○ NO FLOW'}
            </div>
          </button>

          <button
            onClick={handleToggleAhu}
            className={`p-3 rounded-xl border text-left transition-all ${
              startStep3Ahu
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[11px] font-mono text-slate-500 uppercase">Step 3</div>
            <div className="text-xs font-bold text-white mt-1">Air Handling Unit(s) (AHU)</div>
            <div className="text-[11px] mt-2 font-mono">
              {startStep3Ahu ? '● AIRFLOW ON' : '○ STANDBY'}
            </div>
          </button>

          <button
            onClick={handleToggleChwp}
            className={`p-3 rounded-xl border text-left transition-all ${
              startStep4Chwp
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[11px] font-mono text-slate-500 uppercase">Step 4</div>
            <div className="text-xs font-bold text-white mt-1">Chilled Water Pump (CHWP)</div>
            <div className="text-[11px] mt-2 font-mono">
              {startStep4Chwp ? '● FLOW OK' : '○ NO FLOW'}
            </div>
          </button>

          <button
            onClick={handleToggleChiller}
            className={`p-3 rounded-xl border text-left transition-all ${
              startStep5Chiller
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[11px] font-mono text-slate-500 uppercase">Step 5 (Final)</div>
            <div className="text-xs font-bold text-white mt-1">Water Chiller Compressor</div>
            <div className="text-[11px] mt-2 font-mono">
              {startStep5Chiller ? '● COMPRESSOR ON' : '○ LOCKED OUT'}
            </div>
          </button>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
          <span className="text-cyan-400 font-semibold">David Teo's FM Rule: </span>
          The shutting-down sequence is strictly the reverse: Stop Chiller ➔ Stop CHWP ➔ Stop AHU ➔ Stop CWP ➔ Stop Cooling Tower!
        </div>
      </div>

      {/* Step-by-Step Chiller Capacity & Efficiency Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Step-by-Step Chiller Capacity & Efficiency Solver
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Solves E = ṁ × Cp × ΔT (Cp = 4.18 kJ/kg·°C), converts to RT, and computes exact kW/RT and COP with complete step-by-step formula working.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Mass Flow Rate (ṁ in L/s or kg/s)
            </label>
            <input
              type="number"
              step="1"
              value={calcFlowLps}
              onChange={(e) => setCalcFlowLps(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Water Temperature Difference (ΔT in °C)
            </label>
            <input
              type="number"
              step="0.1"
              value={calcDeltaTC}
              onChange={(e) => setCalcDeltaTC(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Chiller Input Electrical Power (kW)
            </label>
            <input
              type="number"
              step="5"
              value={calcInputKw}
              onChange={(e) => setCalcInputKw(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Step-by-Step Math Working Card */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-300 font-mono">SOLUTION STEPS & WORKING:</span>
            <div className="flex gap-4 font-mono">
              <span className="text-cyan-400 font-bold">{capacityResult.coolingRt} RT</span>
              <span className="text-emerald-400 font-bold">{efficiencyResult.kwPerRt} kW/RT</span>
              <span className="text-purple-400 font-bold">COP {efficiencyResult.cop}</span>
            </div>
          </div>
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {capacityResult.working}
            {'\n\n'}
            {efficiencyResult.working}
          </pre>
        </div>
      </div>

      {/* Hourly Chiller Plant Efficiency Table (From Lecture Slides) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">
              Hourly Water-Cooled Chiller Plant Profile (9 AM - 6 PM)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact worked case study from lecture slide 23: 3 × 650 RT chillers showing hourly total plant power (P_CH + P_CHWP + P_CWP + P_CT) divided by Cooling Load (RT).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
            Average: 0.551 kW/RT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Hour</th>
                <th className="py-2.5 px-3 text-right">Cooling Load (RT)</th>
                <th className="py-2.5 px-3 text-right">P_CH (kW)</th>
                <th className="py-2.5 px-3 text-right">P_CHWP (kW)</th>
                <th className="py-2.5 px-3 text-right">P_CWP (kW)</th>
                <th className="py-2.5 px-3 text-right">P_CT (kW)</th>
                <th className="py-2.5 px-3 text-right">Plant Total (kW)</th>
                <th className="py-2.5 px-3 text-right">Plant (kW/RT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 tabular-nums">
              {DEFAULT_HOURLY_CHILLER_DATA.map((row) => (
                <tr key={row.hour} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-semibold text-white">{row.hour}</td>
                  <td className="py-2 px-3 text-right text-slate-200">{row.coolingLoadRt.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-slate-300">{row.pChKw}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{row.pChwpKw}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{row.pCwpKw}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{row.pCtKw}</td>
                  <td className="py-2 px-3 text-right font-semibold text-cyan-300">{row.chillerPlantTotalKw}</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-400">{row.plantKwPerRt.toFixed(3)}</td>
                </tr>
              ))}
              <tr className="bg-slate-950/80 font-bold text-slate-100 border-t border-slate-700">
                <td className="py-2.5 px-3">Total / Avg</td>
                <td className="py-2.5 px-3 text-right text-cyan-300">16,215 RTh</td>
                <td className="py-2.5 px-3 text-right">7,502 kWh</td>
                <td className="py-2.5 px-3 text-right">450 kWh</td>
                <td className="py-2.5 px-3 text-right">627 kWh</td>
                <td className="py-2.5 px-3 text-right">356 kWh</td>
                <td className="py-2.5 px-3 text-right text-cyan-400">8,931 kWh</td>
                <td className="py-2.5 px-3 text-right text-emerald-400">0.551 kW/RTh</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
