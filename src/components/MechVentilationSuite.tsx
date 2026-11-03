/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MechVentRoom } from '../types/dcfmCourse';
import { 
  SS553_MIN_ACH, 
  calculateSs553Ventilation, 
  calculateStaircaseDoorForce 
} from '../utils/courseMath';
import { 
  Wind, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  Flame, 
  Car, 
  Utensils, 
  Building2,
  DoorOpen,
  Info
} from 'lucide-react';

interface MechVentilationSuiteProps {
  onEarnXp?: (xp: number, badgeTitle?: string) => void;
}

export const MechVentilationSuite: React.FC<MechVentilationSuiteProps> = ({ onEarnXp }) => {
  // Sizer room state
  const [selectedRoomType, setSelectedRoomType] = useState<MechVentRoom['roomType']>('restaurant');
  const [roomLengthM, setRoomLengthM] = useState(20);
  const [roomWidthM, setRoomWidthM] = useState(35);
  const [roomHeightM, setRoomHeightM] = useState(3.0);
  const [kitchenHoodRunning, setKitchenHoodRunning] = useState(true);

  // Staircase Pressurisation State
  const [pressurisationDeltaPa, setPressurisationDeltaPa] = useState(50);
  const [doorCloserForceN, setDoorCloserForceN] = useState(40);
  const [doorWidthM, setDoorWidthM] = useState(0.9);
  const [doorHeightM, setDoorHeightM] = useState(2.1);
  const [handleOffsetM, setHandleOffsetM] = useState(0.08);

  // Car park mode
  const [carParkLowLevelExhaustPct, setCarParkLowLevelExhaustPct] = useState(50);

  // Calculation results
  const currentRoom: MechVentRoom = {
    id: 'room-1',
    name: 'Sample Room',
    roomType: selectedRoomType,
    lengthM: roomLengthM,
    widthM: roomWidthM,
    heightM: roomHeightM,
    hoodOperating: kitchenHoodRunning,
  };

  const ventResult = calculateSs553Ventilation(currentRoom);
  const doorForceResult = calculateStaircaseDoorForce(
    doorWidthM,
    doorHeightM,
    doorCloserForceN,
    pressurisationDeltaPa,
    handleOffsetM
  );

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Module 5 & SS 553 : 2016</span>
              <span>·</span>
              <span>Fire Code 2023 Chapter 7</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Mechanical Ventilation & Smoke Control Systems
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Design compliant ventilation for car parks, commercial kitchens, offices, and solve staircase pressurisation door forces (Ft ≤ 110 N) and 50–60 Pa pressure differentials.
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Governing Code</span>
            <span className="text-sm font-bold font-mono text-cyan-400">SS 553 : 2016</span>
          </div>
        </div>
      </div>

      {/* Interactive SS 553 Air Change Rate (ACH) Sizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              SS 553 : 2016 Ventilation Sizer & Worked Problem Solver
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Includes statutory ceiling height cap (Note i: ceiling &gt; 2.5m calculated based on 2.5m height) and lobby exemptions.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
            {ventResult.requiredAch} ACH Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Building Space / Occupancy
            </label>
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="restaurant">Restaurants & Canteens (10 ACH)</option>
              <option value="kitchen">Commercial Kitchen (20 ACH / 10 off)</option>
              <option value="car_park">Basement Car Park (6 ACH)</option>
              <option value="office">Offices (6 ACH)</option>
              <option value="toilet">Bathrooms & Toilets (10 ACH)</option>
              <option value="workshop">Workshops & Factories (6 ACH)</option>
              <option value="classroom">Classrooms (8 ACH)</option>
              <option value="shop">Shops & Retail (6 ACH)</option>
              <option value="lobby">Lobbies & Exits (4 ACH)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Length (m)</label>
            <input
              type="number"
              value={roomLengthM}
              onChange={(e) => setRoomLengthM(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Width (m)</label>
            <input
              type="number"
              value={roomWidthM}
              onChange={(e) => setRoomWidthM(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Actual Ceiling Height (m)
            </label>
            <input
              type="number"
              step="0.1"
              value={roomHeightM}
              onChange={(e) => setRoomHeightM(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {selectedRoomType === 'kitchen' && (
          <div className="flex items-center gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
            <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300">Kitchen Hood Status:</span>
            <button
              onClick={() => setKitchenHoodRunning(!kitchenHoodRunning)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                kitchenHoodRunning
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {kitchenHoodRunning ? 'HOOD OPERATING (20 ACH)' : 'HOOD OFF (10 ACH)'}
            </button>
          </div>
        )}

        {/* Live Calculation Output with Step-by-Step Working */}
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              STEP-BY-STEP CALCULATION WORKING:
            </span>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-white">
                Effective Vol: <strong className="text-cyan-400">{ventResult.roomVolumeM3} m³</strong>
              </span>
              <span className="text-white">
                Flow Rate: <strong className="text-emerald-400">{ventResult.requiredFlowM3h.toLocaleString()} m³/h</strong> ({ventResult.requiredFlowLps} L/s)
              </span>
            </div>
          </div>

          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {ventResult.working}
          </pre>

          {selectedRoomType === 'restaurant' && (
            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
              <span className="text-cyan-400 font-semibold font-mono">
                Restaurant Specific Criteria (SS 553 worked example):
              </span>
              <p>
                Floor Area = {roomLengthM * roomWidthM} m². At 3.4 L/s per m² = {((roomLengthM * roomWidthM) * 3.4).toFixed(0)} L/s (= {(((roomLengthM * roomWidthM) * 3.4) / 1000).toFixed(2)} m³/s). Or 5.1 L/s per seated occupant!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Staircase Pressurisation System & Door Force Solver */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                FIRE CODE 2023 CL 1.3.12
              </span>
              <h3 className="text-base font-bold text-white">
                Exit Staircase Pressurisation & Door Opening Force
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              During operation, pressurisation must maintain 50 Pa to 60 Pa pressure difference. Total door opening force must not exceed 110 N.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                doorForceResult.isCompliant
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border-red-500/40'
              }`}
            >
              {doorForceResult.isCompliant ? '✓ COMPLIANT (≤ 110 N)' : '⚠ NON-COMPLIANT (> 110 N)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Pressure Differential (ΔP)</span>
              <span className="font-mono text-cyan-400 font-bold">{pressurisationDeltaPa} Pa</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={pressurisationDeltaPa}
              onChange={(e) => setPressurisationDeltaPa(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>&lt; 50 Pa (Smoke leak)</span>
              <span className="text-cyan-400">50 - 60 Pa (Code)</span>
              <span>&gt; 60 Pa (Stuck door)</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Door Closer Force (Fc)</span>
              <span className="font-mono text-white font-bold">{doorCloserForceN} N</span>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              step="5"
              value={doorCloserForceN}
              onChange={(e) => setDoorCloserForceN(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Mechanical spring tension</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Door Width (W)</span>
              <span className="font-mono text-white font-bold">{doorWidthM} m</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.20"
              step="0.05"
              value={doorWidthM}
              onChange={(e) => setDoorWidthM(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Exit leaf dimension</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Handle Distance (d)</span>
              <span className="font-mono text-white font-bold">{handleOffsetM * 1000} mm</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.15"
              step="0.01"
              value={handleOffsetM}
              onChange={(e) => setHandleOffsetM(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">From door lock edge</span>
          </div>
        </div>

        {/* Step-by-Step Door Force Result */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-300 font-mono">DOOR FORCE FORMULA WORKING:</span>
            <div className="font-mono font-bold text-sm">
              Total Opening Force: <span className={doorForceResult.isCompliant ? 'text-emerald-400' : 'text-red-400'}>
                {doorForceResult.totalForceN} N
              </span>
            </div>
          </div>
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {doorForceResult.working}
          </pre>
        </div>

        {/* 3 Tests Required for Staircase Pressurisation (Tutorial 1 Q9) */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="font-semibold text-cyan-300 font-mono">
            3 Mandatory Tests for Staircase Pressurisation (Fire Code 2023):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-slate-300">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <strong className="text-white block">1. Pressure Differential Test:</strong>
              Verify 50 Pa to 60 Pa across door barrier when all doors on other storeys are closed. Flap valve opens if &gt; 50 Pa.
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <strong className="text-white block">2. Door Velocity Test:</strong>
              Verify minimum air velocity of 1.0 m/s across door opening when two successive storey doors + main discharge door are opened!
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <strong className="text-white block">3. Door Opening Force Test:</strong>
              Verify total force Ft ≤ 110 N measured at door handle using spring balance so occupants can safely push open the door.
            </div>
          </div>
        </div>
      </div>

      {/* Carpark & Commercial Kitchen Dedicated Provisions Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Car Park Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-2">
            <Car className="w-4 h-4 text-cyan-400" />
            Basement Car Park Ventilation Rules
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>6 Air Changes per Hour (ACH)</strong> minimum ventilation rate.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>50% Low-Level Exhaust:</strong> At least 50% of exhaust air extracted at low level ≤ 650 mm above finished floor (measured from top of grille).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Negative Pressure:</strong> Maintained under negative pressure to prevent CO exhaust leaking into adjacent retail/lobbies.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Intake Distance:</strong> Outdoor intake must be ≥ 5m away from any exhaust discharge openings.</span>
            </li>
          </ul>
        </div>

        {/* Commercial Kitchen Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-2">
            <Utensils className="w-4 h-4 text-amber-400" />
            Commercial Kitchen Ventilation & Fire Safety
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span><strong>≥ 20 ACH:</strong> With hood in operation; may reduce to 10 ACH when hood is off.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span><strong>NO Fire Dampers:</strong> Fire dampers strictly prohibited in kitchen exhaust ducts! Use 1.2mm steel + fire-rated rockwool boards instead.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span><strong>Bifurcated Fan:</strong> Motor housed in an isolated middle tunnel cooled by outside air, preventing hot grease vapors from contacting electrical parts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span><strong>Solenoid Interlock:</strong> Town gas solenoid valve is electrically interlocked with exhaust fan to cut off gas if ventilation fails.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
