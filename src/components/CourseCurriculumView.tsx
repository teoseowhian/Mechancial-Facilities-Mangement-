/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MainTab } from '../App';
import { 
  ExternalLink, 
  Play, 
  BookOpen, 
  Sparkles, 
  QrCode, 
  Droplets, 
  Wind, 
  Flame, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Gauge, 
  Wrench,
  CheckCircle2
} from 'lucide-react';

interface CourseCurriculumViewProps {
  onSelectTab: (tab: MainTab) => void;
  onOpenChat: () => void;
}

interface LectureCardData {
  unitCode: string;
  badgeLabel: string;
  lectureNumber: string;
  title: string;
  description: string;
  tags: string[];
  targetTab: MainTab;
  svgDiagramType: 'sine' | 'graph' | 'grid' | 'psychro' | 'tank' | 'duct' | 'chiller' | 'flame' | 'shield';
}

const LECTURE_MODULES: LectureCardData[] = [
  {
    unitCode: 'U5 / P1',
    badgeLabel: 'L5',
    lectureNumber: 'Lecture 5 & Practical 1',
    title: 'Indoor Environmental Quality (IEQ) & Thermal Comfort',
    description: 'Physical parameters under SS 554 : 2016 (24°C ± 1°C, RH ≤ 65%, air speed 0.2 ± 0.1 m/s), CO₂ 700 ppm above outdoor, sling psychrometer vs TSI VelociCalc measurements, and CBE ASHRAE-55 comfort index.',
    tags: ['SS 554 : 2016', 'Green Mark NRD 2015', 'TSI VelociCalc', 'Sling Psychrometer'],
    targetTab: 'ventilation',
    svgDiagramType: 'sine',
  },
  {
    unitCode: 'U9',
    badgeLabel: 'L9',
    lectureNumber: 'Lecture 9',
    title: 'Water Circuits, Chillers & Hydraulic Pumping',
    description: 'Chilled water 5°C–12°C, primary/secondary loops, Green Mark 2021 part-load pump polynomial (0.0205x + 0.4101x² + 0.5753x³), cooling tower fan power, pump affinity laws (20% speed drop = 48.8% power saved), and the 5-step starting sequence.',
    tags: ['SS 530', 'SS 553', 'Green Mark 2021', 'Affinity Laws', 'COP'],
    targetTab: 'chillers',
    svgDiagramType: 'chiller',
  },
  {
    unitCode: 'U5',
    badgeLabel: 'L5',
    lectureNumber: 'Lecture 5',
    title: 'Mechanical Ventilation & Fire Safety (SS 553 : 2016)',
    description: 'Minimum air changes per hour (ACH) for 9 spaces, car park 6 ACH with 50% exhaust at low level ≤ 650 mm, commercial kitchen ≥ 20 ACH with bifurcated fans and zero fire dampers, and staircase pressurisation (50–60 Pa, Ft ≤ 110 N).',
    tags: ['SS 553 : 2016', 'Fire Code 2023', 'Jet Fan', 'Door Force ≤ 110N'],
    targetTab: 'ventilation',
    svgDiagramType: 'grid',
  },
  {
    unitCode: 'U6',
    badgeLabel: 'L6',
    lectureNumber: 'Lecture 6',
    title: 'Air Conditioning Fundamentals & Psychrometrics',
    description: 'Properties of moist air (DBT, WBT, Dew Point, RH%, Enthalpy, Moisture Content), Sensible Cooling Load (SCL = ṁs × cp,a × (tr - ts)), 6 AC processes on the Mollier chart, and vapor compression refrigeration cycle.',
    tags: ['Psychrometric Chart', 'SCL Equation', 'R-134a P-h', 'Vapor Compression'],
    targetTab: 'psychrometrics',
    svgDiagramType: 'psychro',
  },
  {
    unitCode: 'U2',
    badgeLabel: 'L2',
    lectureNumber: 'Lecture 2',
    title: 'Building Water Supply & Sanitary Plumbing (SS 636)',
    description: 'Modes 1, 2, and 3 water supply relative to MSL/RL, appliance pressure head limited to ≤ 35m via PRVs, cistern partition rules (> 4500 L two compartments), 1st storey drainage compression rules, and the 5 causes of trap seal loss.',
    tags: ['SS 636 : 2018', 'PUB DTSS', 'Modes 1-3', '25mm Trap Seal', 'PRVs'],
    targetTab: 'water_plumbing',
    svgDiagramType: 'tank',
  },
  {
    unitCode: 'U1',
    badgeLabel: 'L1',
    lectureNumber: 'Lecture 1',
    title: 'Fire Protection Systems & SCDF Fire Code 2023',
    description: 'SCDF submission framework (Prescriptive vs Performance-based), dry/wet rising mains (> 60m height), CP 52 automatic sprinklers (wet, dry, pre-action, deluge), hose reel 36m coverage, and SS 578 portable fire extinguishers.',
    tags: ['Fire Code 2023', 'CP 52 Sprinklers', 'Wet Risers', 'SS 578 PASS'],
    targetTab: 'fire',
    svgDiagramType: 'shield',
  },
  {
    unitCode: 'U4',
    badgeLabel: 'L4',
    lectureNumber: 'Lecture 4',
    title: 'Town Gas Supply & Kitchen Safety Interlocks (SS 608)',
    description: 'Manufactured naphtha gas (SG 0.5–0.59, CV 18.63 MJ/m³, 4.5 m³ air per 1 m³ gas), mandatory kitchen gas solenoid electrical interlock with exhaust fan, 300 mm WG pressure testing procedure, and prohibited building areas.',
    tags: ['SS 608 : 2015', 'Gas Act Cap 116A', 'Solenoid Interlock', '300mm WG Test'],
    targetTab: 'gas',
    svgDiagramType: 'flame',
  },
  {
    unitCode: 'U8',
    badgeLabel: 'L8',
    lectureNumber: 'Lecture 8',
    title: 'Air Distribution Systems & Duct Aerodynamics',
    description: 'CAV vs VAV systems, equal friction vs velocity reduction methods, Huebscher equivalent rectangular dimensions, duct materials, 25–50 mm insulation with vapor barrier, and fire dampers with 165°F (73.8°C) fusible links.',
    tags: ['Equal Friction', 'Huebscher De', 'VAV Terminals', '165°F Fusible Link'],
    targetTab: 'ducts',
    svgDiagramType: 'duct',
  },
];

export const CourseCurriculumView: React.FC<CourseCurriculumViewProps> = ({
  onSelectTab,
  onOpenChat,
}) => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4">
      {/* Editorial Course Hero Header (Styled after IMG_0144_b3f4146a.PNG) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-600">
            FREE LECTURE MODULES & INTERACTIVE SIMULATORS · ACADEMIC YEAR 2026 / 2027
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Mechanical Systems Foundations
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          Comprehensive curriculum & interactive simulation suite from <strong>013621 / 101MS3 Mechanical Systems</strong> (Diploma in Facilities Management) by <strong>David Teo</strong> for FM practitioners, adult learners, and student engineers.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult MechApp AI Tutor</span>
          </button>

          <a
            href="https://drive.google.com/drive/folders/1K8-_9fqSSfC-c2svSE-6ydwdwWcC7nQE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            <span>Open Google Drive Lecture Materials</span>
          </a>
        </div>
      </div>

      {/* Course Modules Grid / List (Exact visual structure as in IMG_0144) */}
      <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
        {LECTURE_MODULES.map((mod, idx) => (
          <div
            key={idx}
            className="py-6 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:bg-slate-900/40 p-4 rounded-2xl transition-all"
          >
            {/* Left Preview Thumbnail Card (Styled like the white lecture cards in IMG_0144) */}
            <div className="w-full md:w-64 h-36 bg-white text-slate-950 rounded-xl border border-slate-300 shadow-md p-3 relative flex flex-col justify-between shrink-0 overflow-hidden group-hover:shadow-lg transition-shadow">
              {/* Top Red Accent Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />

              {/* Card Header: Institution & Red Pill Badge */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[9px] font-bold tracking-tight text-red-700 block uppercase font-mono">
                    NGEE ANN POLYTECHNIC
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono block">
                    MECH SYSTEMS · 101MS3
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold font-mono">
                  {mod.badgeLabel}
                </span>
              </div>

              {/* Card Mini Diagram & Title */}
              <div className="flex items-center justify-between gap-2 my-auto">
                <div className="max-w-[120px]">
                  <span className="text-[11px] font-extrabold text-slate-900 leading-tight block line-clamp-2">
                    {mod.title}
                  </span>
                </div>

                {/* SVG Mini Graphic */}
                <div className="w-20 h-14 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-1">
                  {mod.svgDiagramType === 'sine' && (
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                      <path d="M 5 20 Q 20 0 30 20 T 55 20" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                      <line x1="5" y1="20" x2="55" y2="20" stroke="#94a3b8" strokeDasharray="2 2" />
                    </svg>
                  )}
                  {mod.svgDiagramType === 'chiller' && (
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                      <rect x="8" y="10" width="44" height="20" rx="3" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2" />
                      <circle cx="30" cy="20" r="6" fill="#dc2626" />
                    </svg>
                  )}
                  {mod.svgDiagramType === 'grid' && (
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                      <line x1="10" y1="10" x2="50" y2="10" stroke="#dc2626" strokeWidth="2" />
                      <line x1="10" y1="20" x2="50" y2="20" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="10" y1="30" x2="50" y2="30" stroke="#dc2626" strokeWidth="2" />
                      <line x1="20" y1="5" x2="20" y2="35" stroke="#94a3b8" />
                      <line x1="40" y1="5" x2="40" y2="35" stroke="#94a3b8" />
                    </svg>
                  )}
                  {mod.svgDiagramType === 'psychro' && (
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                      <path d="M 10 32 Q 25 28 40 18 T 52 8" fill="none" stroke="#0284c7" strokeWidth="2" />
                      <line x1="10" y1="32" x2="52" y2="32" stroke="#64748b" />
                      <circle cx="35" cy="20" r="3" fill="#dc2626" />
                    </svg>
                  )}
                  {mod.svgDiagramType === 'tank' && (
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                      <rect x="15" y="8" width="30" height="24" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                      <line x1="20" y1="20" x2="40" y2="20" stroke="#0ea5e9" strokeDasharray="2 1" />
                    </svg>
                  )}
                  {mod.svgDiagramType === 'shield' && (
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                      <path d="M 30 5 L 45 12 L 45 25 Q 30 35 30 35 Q 15 25 15 25 L 15 12 Z" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
                    </svg>
                  )}
                  {mod.svgDiagramType === 'flame' && (
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                      <circle cx="30" cy="22" r="12" fill="#fef08a" />
                      <path d="M 30 6 Q 38 18 30 32 Q 22 18 30 6 Z" fill="#eab308" />
                    </svg>
                  )}
                  {mod.svgDiagramType === 'duct' && (
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                      <rect x="10" y="12" width="40" height="16" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                      <line x1="10" y1="12" x2="50" y2="28" stroke="#dc2626" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="text-[8px] font-mono text-slate-400 border-t border-slate-200 pt-1 flex justify-between">
                <span>DCFM4 Module</span>
                <span>Singapore Standards</span>
              </div>
            </div>

            {/* Right Content Section (Styled like IMG_0144) */}
            <div className="flex-1 space-y-2">
              <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-wide block">
                {mod.lectureNumber}
              </span>

              <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                {mod.title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">
                {mod.description}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-slate-400">
                {mod.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onSelectTab(mod.targetTab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-red-600 text-white font-semibold rounded-lg text-xs font-mono border border-slate-700 hover:border-red-600 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
                  <span>Launch Interactive Simulator</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Callout: QR Code, Google Drive, and GitHub Links (Styled after IMG_0144) */}
      <div className="bg-white text-slate-950 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Red Bordered QR Code Container */}
          <div className="p-3 border-2 border-red-600 rounded-2xl flex flex-col items-center bg-slate-50 shrink-0">
            <QrCode className="w-20 h-20 text-slate-900" />
            <span className="mt-1 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold font-mono">
              NP DCFM Lab
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-950">
              Access Course Page & Google Drive Materials
            </h3>
            <p className="text-xs text-slate-600 font-mono">
              Google Drive: <a href="https://drive.google.com/drive/folders/1K8-_9fqSSfC-c2svSE-6ydwdwWcC7nQE" target="_blank" rel="noopener noreferrer" className="text-red-600 font-bold hover:underline">drive.google.com/drive/folders/1K8-_9fq...</a>
            </p>
            <p className="text-xs text-slate-600 font-mono">
              GitHub Repository: <span className="font-bold text-slate-900">github.com/np-dcfm/mech-fm-ai</span>
            </p>
            <div className="text-xs text-slate-500 font-sans pt-1">
              Course Owner: <strong>David Teo</strong> (tsh52@np.edu.sg) · Ngee Ann Polytechnic · School of Design & Environment
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask MechApp Studio AI</span>
          </button>
          <span className="block text-[11px] text-slate-500 mt-1 font-mono">
            Campus: Blk 34 #03-02
          </span>
        </div>
      </div>
    </div>
  );
};
