/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Thermometer, 
  Wind, 
  Droplet, 
  Volume2, 
  Sun, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Calculator,
  RotateCcw,
  BookOpen,
  Info,
  ShieldAlert
} from 'lucide-react';

interface LocationReading {
  location: 'Lab' | 'Chiller Plant' | 'Outdoor';
  // Sling Psychrometer
  slingDbtC: number;
  slingWbtC: number;
  slingRhPct: number;
  // TSI VelociCalc
  tsiDbtC: number;
  tsiWbtC: number;
  tsiRhPct: number;
  tsiAirVelocityMs: number;
  // Sensors
  co2Ppm: number;
  soundDba: number;
  lightingLux: number;
}

const DEFAULT_READINGS: LocationReading[] = [
  {
    location: 'Lab',
    slingDbtC: 23.5,
    slingWbtC: 19.5,
    slingRhPct: 69.3,
    tsiDbtC: 24.5,
    tsiWbtC: 18.8,
    tsiRhPct: 58.9,
    tsiAirVelocityMs: 0.08,
    co2Ppm: 680,
    soundDba: 42,
    lightingLux: 520,
  },
  {
    location: 'Chiller Plant',
    slingDbtC: 26.0,
    slingWbtC: 23.0,
    slingRhPct: 77.5,
    tsiDbtC: 26.8,
    tsiWbtC: 22.5,
    tsiRhPct: 70.2,
    tsiAirVelocityMs: 0.22,
    co2Ppm: 540,
    soundDba: 78,
    lightingLux: 310,
  },
  {
    location: 'Outdoor',
    slingDbtC: 31.0,
    slingWbtC: 27.0,
    slingRhPct: 73.0,
    tsiDbtC: 31.5,
    tsiWbtC: 26.8,
    tsiRhPct: 71.0,
    tsiAirVelocityMs: 0.53,
    co2Ppm: 420,
    soundDba: 64,
    lightingLux: 12000,
  },
];

export const IeqPracticalSuite: React.FC = () => {
  const [readings, setReadings] = useState<LocationReading[]>(DEFAULT_READINGS);
  const [selectedLocIdx, setSelectedLocIdx] = useState(0);

  // Student submission form fields
  const [studentName, setStudentName] = useState('Student Engineer');
  const [classGroup, setClassGroup] = useState('1D1');
  const [registerNo, setRegisterNo] = useState('01');
  const [practicalGroup, setPracticalGroup] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

  const currentReading = readings[selectedLocIdx];

  // Difference calculation: % diff = |A - B| / A * 100% where A is sling, B is TSI
  const dbtDiffPct = currentReading.slingDbtC > 0 
    ? (Math.abs(currentReading.slingDbtC - currentReading.tsiDbtC) / currentReading.slingDbtC) * 100
    : 0;

  const rhDiffPct = currentReading.slingRhPct > 0 
    ? (Math.abs(currentReading.slingRhPct - currentReading.tsiRhPct) / currentReading.slingRhPct) * 100
    : 0;

  // SS 554: 2016 Compliance Evaluation for indoor space
  const isTempCompliant = currentReading.tsiDbtC >= 23.0 && currentReading.tsiDbtC <= 25.0; // 24 ± 1 °C
  const isRhCompliant = currentReading.tsiRhPct <= 65.0; // ≤ 65% for new
  const isAirVelocityCompliant = currentReading.tsiAirVelocityMs >= 0.1 && currentReading.tsiAirVelocityMs <= 0.3; // 0.2 ± 0.1 m/s
  const outdoorCo2 = readings.find((r) => r.location === 'Outdoor')?.co2Ppm || 420;
  const isCo2Compliant = currentReading.co2Ppm <= outdoorCo2 + 700; // 700 ppm > outdoor
  const isLightingCompliant = currentReading.lightingLux >= 500; // SS 531 Normal office 500 lux
  const isSoundCompliant = currentReading.soundDba <= 45; // Green Mark Open Office 45 dBA

  const handleUpdateReading = (field: keyof LocationReading, val: number) => {
    const updated = [...readings];
    updated[selectedLocIdx] = {
      ...updated[selectedLocIdx],
      [field]: val,
    };
    setReadings(updated);
  };

  const handleDownloadWordSubmission = () => {
    const filename = `Pract 1_${classGroup}_${registerNo}_${studentName.replace(/\s+/g, '_')}.doc`;
    const docContent = `
School of Design & Environment - Mechanical Facilities
Practical 1: Indoor Environmental Quality (IEQ)
Student: ${studentName} | Class: ${classGroup} | Reg No: ${registerNo} | Group: ${practicalGroup}
Date: ${new Date().toLocaleDateString()} | Lecturer: David Teo (tsh52@np.edu.sg)

============================================================
1.0 EXPERIMENTAL MEASUREMENT DATA
============================================================
Location: Lab
- Sling Psychrometer: DBT = ${readings[0].slingDbtC}°C, WBT = ${readings[0].slingWbtC}°C, RH = ${readings[0].slingRhPct}%
- TSI VelociCalc: DBT = ${readings[0].tsiDbtC}°C, WBT = ${readings[0].tsiWbtC}°C, RH = ${readings[0].tsiRhPct}%, Velocity = ${readings[0].tsiAirVelocityMs} m/s
- Sensors: CO2 = ${readings[0].co2Ppm} ppm, Sound = ${readings[0].soundDba} dBA, Lighting = ${readings[0].lightingLux} Lux

Location: Chiller Plant Room
- Sling Psychrometer: DBT = ${readings[1].slingDbtC}°C, WBT = ${readings[1].slingWbtC}°C, RH = ${readings[1].slingRhPct}%
- TSI VelociCalc: DBT = ${readings[1].tsiDbtC}°C, WBT = ${readings[1].tsiWbtC}°C, RH = ${readings[1].tsiRhPct}%, Velocity = ${readings[1].tsiAirVelocityMs} m/s
- Sensors: CO2 = ${readings[1].co2Ppm} ppm, Sound = ${readings[1].soundDba} dBA, Lighting = ${readings[1].lightingLux} Lux

Location: Outdoor
- Sling Psychrometer: DBT = ${readings[2].slingDbtC}°C, WBT = ${readings[2].slingWbtC}°C, RH = ${readings[2].slingRhPct}%
- TSI VelociCalc: DBT = ${readings[2].tsiDbtC}°C, WBT = ${readings[2].tsiWbtC}°C, RH = ${readings[2].tsiRhPct}%, Velocity = ${readings[2].tsiAirVelocityMs} m/s
- Sensors: CO2 = ${readings[2].co2Ppm} ppm, Sound = ${readings[2].soundDba} dBA, Lighting = ${readings[2].lightingLux} Lux

============================================================
2.0 DISCUSSION QUESTIONS & WORKING
============================================================
Question 1: State whether the three locations meet the indoor environmental quality requirements of the Singapore Standard and ASHRAE-55 thermal standard.
- Lab:
  • Temperature (24.5°C): COMPLIANT with SS 554 : 2016 (24°C ± 1°C).
  • Relative Humidity (58.9%): COMPLIANT with SS 554 : 2016 (≤ 65% for new buildings).
  • Air Velocity (0.08 m/s): Slightly below 0.2 ± 0.1 m/s (0.10 m/s min). Risk of stagnant pockets.
  • CO2 (680 ppm): COMPLIANT (within 700 ppm above outdoor level of 420 ppm -> max limit 1120 ppm).
  • Sound (42 dBA): COMPLIANT with Green Mark NRD 2015 (≤ 45 dBA).
  • Lighting (520 Lux): COMPLIANT with SS 531 : 2013 (≥ 500 Lux for general office).
- Chiller Plant Room:
  • Non-conditioned plant space. High sound level (78 dBA) requires hearing protection.
- Outdoor:
  • Tropical ambient Singapore climate (31.5°C, 71% RH, 0.53 m/s wind). Exceeds indoor comfort boundary.

Question 2: Compare the dry bulb temperature readings of the lab from:
a. Sling Psychrometer: ${readings[0].slingDbtC}°C
b. TSI VelociCalc: ${readings[0].tsiDbtC}°C
Calculation of % Difference:
% difference = |A - B| / A × 100%
= |${readings[0].slingDbtC} - ${readings[0].tsiDbtC}| / ${readings[0].slingDbtC} × 100%
= ${Math.abs(readings[0].slingDbtC - readings[0].tsiDbtC).toFixed(1)} / ${readings[0].slingDbtC} × 100%
= ${((Math.abs(readings[0].slingDbtC - readings[0].tsiDbtC) / readings[0].slingDbtC) * 100).toFixed(2)}%

Question 3: Which instrument would you rely on? Explain your reasons.
Answer:
The electronic TSI VelociCalc is more reliable for routine professional building audits because:
1. It eliminates human errors inherent in whirling a manual sling psychrometer (such as insufficient wick wetting, hand heat transfer, variable rotation speed, and parallax reading error).
2. It features high precision at low air velocity (0.05 to 0.3 m/s), which is crucial for indoor comfort testing where draft or stagnant air must be accurately determined.
However, the sling psychrometer remains a valuable baseline calibration tool because it relies purely on fundamental thermodynamics (wet-bulb depression) and does not drift from sensor aging or battery depletion.
    `.trim();

    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-mono font-bold uppercase tracking-wider">
              <span>Lesson 5 & Practical 1 Lab</span>
              <span>·</span>
              <span>SS 554 : 2016, Green Mark NRD 2015 & SS 531</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Practical 1: Indoor Environmental Quality (IEQ) Monitoring & Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Study IEQ physical parameters (Operative Temp 24°C ± 1°C, RH ≤ 65%, Air Movement 0.2 ± 0.1 m/s, CO₂ &lt; 700 ppm above outdoor), compare Sling Psychrometer vs TSI VelociCalc readings, and generate your submission.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadWordSubmission}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download Word Submission (.doc)
            </button>
          </div>
        </div>
      </div>

      {/* Student Details & Submission Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-400" />
            Practical 1 Student & Group Details
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Venue: Blk 34 #03-02 · Campus Lab
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Student Full Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-rose-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Class Group</label>
            <input
              type="text"
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Register No.</label>
            <input
              type="text"
              value={registerNo}
              onChange={(e) => setRegisterNo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Practical Group</label>
            <div className="grid grid-cols-5 gap-1">
              {(['A', 'B', 'C', 'D', 'E'] as const).map((grp) => (
                <button
                  key={grp}
                  onClick={() => setPracticalGroup(grp)}
                  className={`py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                    practicalGroup === grp
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>Submission File Naming Format:</span>
          <span className="text-cyan-400 font-bold">
            Pract 1_{classGroup}_{registerNo}_{studentName.replace(/\s+/g, '_')}.doc
          </span>
        </div>
      </div>

      {/* Location Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {readings.map((r, idx) => (
          <button
            key={r.location}
            onClick={() => setSelectedLocIdx(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              selectedLocIdx === idx
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Location {idx + 1}:</span>
            <span>{r.location}</span>
          </button>
        ))}
      </div>

      {/* Measurement Matrix Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Experimental Readings: {currentReading.location}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare manual sling psychrometer against electronic TSI VelociCalc measurements and environmental sensors.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
            % Difference: {dbtDiffPct.toFixed(2)}% DBT · {rhDiffPct.toFixed(1)}% RH
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sling Psychrometer Card */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-cyan-300 font-mono block">
              1. SLING / WHIRLING PSYCHROMETER (MANUAL)
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Dry Bulb Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentReading.slingDbtC}
                  onChange={(e) => handleUpdateReading('slingDbtC', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Wet Bulb Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentReading.slingWbtC}
                  onChange={(e) => handleUpdateReading('slingWbtC', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                <span>Calculated Relative Humidity (%)</span>
                <span className="text-cyan-300 font-bold">{currentReading.slingRhPct}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="0.5"
                value={currentReading.slingRhPct}
                onChange={(e) => handleUpdateReading('slingRhPct', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                Obtained from psychrometric chart (daytonashrae.org online psychrometrics).
              </span>
            </div>
          </div>

          {/* TSI VelociCalc Card */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-emerald-300 font-mono block">
              2. TSI VELOCICALC (ELECTRONIC SENSOR)
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Dry Bulb Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentReading.tsiDbtC}
                  onChange={(e) => handleUpdateReading('tsiDbtC', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Relative Humidity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentReading.tsiRhPct}
                  onChange={(e) => handleUpdateReading('tsiRhPct', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Air Velocity (m/s)</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentReading.tsiAirVelocityMs}
                  onChange={(e) => handleUpdateReading('tsiAirVelocityMs', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Wet Bulb (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentReading.tsiWbtC}
                  onChange={(e) => handleUpdateReading('tsiWbtC', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Quality Sensors: CO2, Sound, Lighting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono block">Carbon Dioxide (CO₂)</span>
            <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
              {currentReading.co2Ppm} ppm
            </div>
            <span className="text-[10px] text-slate-500 font-sans">
              SS 554: ≤ {outdoorCo2 + 700} ppm (700 ppm &gt; outdoor)
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono block">Sound Level (dBA)</span>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {currentReading.soundDba} dBA
            </div>
            <span className="text-[10px] text-slate-500 font-sans">
              Green Mark NRD 2015: Open Office ≤ 45 dBA
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono block">Lighting Level (Lux)</span>
            <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
              {currentReading.lightingLux} Lux
            </div>
            <span className="text-[10px] text-slate-500 font-sans">
              SS 531 : 2013: Normal Office ≥ 500 Lux
            </span>
          </div>
        </div>
      </div>

      {/* Part 3: Singapore Standards & ASHRAE Compliance Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            IEQ Statutory Compliance Audit (SS 554 : 2016)
          </h3>
          <span className="text-xs font-mono text-slate-400">Location: {currentReading.location}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className={`p-4 rounded-xl border ${isTempCompliant ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-amber-500/10 border-amber-500/40 text-amber-300'}`}>
            <strong className="block text-sm mb-1 text-white">Operative Temperature</strong>
            <div>Measured: {currentReading.tsiDbtC}°C</div>
            <div>Code Limit: 24°C ± 1°C (23°C - 25°C)</div>
            <div className="mt-2 font-bold">{isTempCompliant ? '✓ COMPLIANT' : '⚠ OUT OF COMFORT RANGE'}</div>
          </div>

          <div className={`p-4 rounded-xl border ${isRhCompliant ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-300'}`}>
            <strong className="block text-sm mb-1 text-white">Relative Humidity</strong>
            <div>Measured: {currentReading.tsiRhPct}%</div>
            <div>Code Limit: ≤ 65% (new) / ≤ 70% (existing)</div>
            <div className="mt-2 font-bold">{isRhCompliant ? '✓ COMPLIANT' : '⚠ HIGH HUMIDITY (CLAMMY)'}</div>
          </div>

          <div className={`p-4 rounded-xl border ${isAirVelocityCompliant ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-amber-500/10 border-amber-500/40 text-amber-300'}`}>
            <strong className="block text-sm mb-1 text-white">Air Movement</strong>
            <div>Measured: {currentReading.tsiAirVelocityMs} m/s</div>
            <div>Code Limit: 0.2 ± 0.1 m/s (0.1 - 0.3 m/s)</div>
            <div className="mt-2 font-bold">{isAirVelocityCompliant ? '✓ COMPLIANT' : '⚠ DRAFT / STAGNANT'}</div>
          </div>
        </div>

        {/* Discussion Question 2 Working: Percentage Difference */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <span>QUESTION 2: PERCENTAGE DIFFERENCE WORKING (PAGE 4 OF LAB SHEET):</span>
            <span>Formula: % diff = |A - B| / A × 100%</span>
          </div>
          <div className="text-slate-300 leading-relaxed">
            Where A is temperature measured by Sling Psychrometer ({currentReading.slingDbtC}°C) and B is measured by TSI VelociCalc ({currentReading.tsiDbtC}°C):
            <br />
            <strong className="text-white">
              % difference = |{currentReading.slingDbtC} - {currentReading.tsiDbtC}| / {currentReading.slingDbtC} × 100% = {dbtDiffPct.toFixed(2)}%
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
