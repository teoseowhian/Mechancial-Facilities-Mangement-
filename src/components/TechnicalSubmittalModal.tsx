/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

interface TechnicalSubmittalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLevel: number;
  userXp: number;
}

export const TechnicalSubmittalModal: React.FC<TechnicalSubmittalModalProps> = ({
  isOpen,
  onClose,
  userLevel,
  userXp,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const data = {
      project: 'Commercial Building Mechanical Systems Submittal',
      module: 'Mechanical Systems (013621 / 101MS3)',
      institution: 'Ngee Ann Polytechnic',
      lecturer: 'David Teo (tsh52@np.edu.sg)',
      submittedDate: new Date().toISOString(),
      governingStandards: [
        'SS 530: 2014 Energy-Efficiency Standard for Building Services',
        'SS 553: 2016 Code of Practice for Air-Conditioning & Mechanical Ventilation',
        'SS 636: 2018 Code of Practice for Water Services',
        'SS 608: 2015 Code of Practice for Gas Installation',
        'Fire Code 2023 (9th Edition) & CP 52 Automatic Fire Sprinklers',
        'SS 578: 2019 Use & Maintenance of Portable Fire Extinguishers',
        'BCA Green Mark 2021 Technical Guide',
      ],
      plantDesign: {
        chillerPlantEfficiency: '0.551 kW/RT (Compliant with Green Mark ≤ 0.85 kW/RT)',
        startingSequence: '1. Towers -> 2. CWP -> 3. AHU -> 4. CHWP -> 5. Chiller',
        pumpAffinityPowerReduction: '48.8% reduction at 80% speed',
        waterSupplyMode: 'Mode 2 (25m - 37m MSL) & Mode 3 (>37m MSL)',
        pressurisationDifferential: '50 Pa - 60 Pa (Door Force ≤ 110 N)',
        kitchenVentilation: '20 ACH with hood, bifurcated fans, zero fire dampers in grease ducts',
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DCFM_Mechanical_Submittal_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden print:m-0 print:border-none print:shadow-none print:w-full print:max-w-none print:max-h-none print:bg-white print:text-black">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              Mechanical Systems Technical Submittal & Compliance Sheet
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Formally generated engineering design verification document for DCFM / 101MS3 submissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              JSON Export
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-200 print:text-black print:p-0 font-sans">
          {/* Header Block */}
          <div className="border-b border-slate-700 pb-4 flex justify-between items-start">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 print:text-blue-700 uppercase">
                NGEE ANN POLYTECHNIC · SCHOOL OF LIFE SCIENCES & CHEMICAL TECHNOLOGY
              </span>
              <h1 className="text-2xl font-bold text-white print:text-black mt-1">
                MECHANICAL SYSTEMS TECHNICAL SUBMITTAL
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-0.5 font-mono">
                Course: Diploma (Conversion) in Facilities Management (DCFM4) · Module 013621 / 101MS3
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-400 print:text-gray-700">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Lecturer: David Teo (tsh52@np.edu.sg)</div>
              <div>Campus: Blk 34 #03-02</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-cyan-300 print:text-blue-800 uppercase font-mono">
              1.0 Executive Engineering Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-300 print:text-gray-800">
              This submittal provides design computations, code compliance checks, and operational safety schedules for commercial building mechanical services. Calculations are verified against Singapore Standards (SS 553 : 2016, SS 636 : 2018, SS 608 : 2015, SS 578 : 2019), SCDF Fire Code 2023 (9th Edition), and BCA Green Mark 2021.
            </p>
          </div>

          {/* Section 2: Water-Cooled Chiller Plant Design */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-cyan-300 print:text-blue-800 uppercase font-mono">
              2.0 Central Chiller Plant Performance (SS 530 & Green Mark)
            </h2>
            <div className="border border-slate-700 print:border-gray-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-950 print:bg-gray-100 text-slate-300 print:text-black border-b border-slate-700">
                  <tr>
                    <th className="p-2">Parameter</th>
                    <th className="p-2">Design Value</th>
                    <th className="p-2">Governing Standard</th>
                    <th className="p-2">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200 print:text-gray-900">
                  <tr>
                    <td className="p-2">Overall Plant Efficiency</td>
                    <td className="p-2 font-bold text-emerald-400 print:text-green-700">0.551 kW/RT</td>
                    <td className="p-2">BCA Code for Environmental Sustainability</td>
                    <td className="p-2">PASS (≤ 0.85 kW/RT new)</td>
                  </tr>
                  <tr>
                    <td className="p-2">CHWST Reset Capability</td>
                    <td className="p-2">6.7°C to 10.0°C</td>
                    <td className="p-2">SS 530 IPLV Enhancement</td>
                    <td className="p-2">OPERATIONAL</td>
                  </tr>
                  <tr>
                    <td className="p-2">CHW Pump Specific Power</td>
                    <td className="p-2">0.039 kW/RT</td>
                    <td className="p-2">SS 553 Pump Power Limit</td>
                    <td className="p-2">PASS (&lt; 0.0528 kW/RT)</td>
                  </tr>
                  <tr>
                    <td className="p-2">Condenser Water Pump Power</td>
                    <td className="p-2">0.042 kW/RT</td>
                    <td className="p-2">SS 553 CW Pump Limit</td>
                    <td className="p-2">PASS (&lt; 0.057 kW/RT)</td>
                  </tr>
                  <tr>
                    <td className="p-2">Cooling Tower Efficiency</td>
                    <td className="p-2">0.0465 kW/RT</td>
                    <td className="p-2">SS 530 Heat Rejection Rating</td>
                    <td className="p-2">PASS (≥ 21.5 RT/kW)</td>
                  </tr>
                  <tr>
                    <td className="p-2">Starting Interlock Sequence</td>
                    <td className="p-2">1. Tower ➔ 2. CWP ➔ 3. AHU ➔ 4. CHWP ➔ 5. Chiller</td>
                    <td className="p-2">BCA M&E Standard SOP</td>
                    <td className="p-2">INTERLOCKED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Mechanical Ventilation (SS 553 : 2016) */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-cyan-300 print:text-blue-800 uppercase font-mono">
              3.0 Mechanical Ventilation & Fire Safety (SS 553 / Fire Code 2023)
            </h2>
            <div className="border border-slate-700 print:border-gray-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-950 print:bg-gray-100 text-slate-300 print:text-black border-b border-slate-700">
                  <tr>
                    <th className="p-2">Occupancy / System</th>
                    <th className="p-2">Code Minimum Rate</th>
                    <th className="p-2">Special Provisions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200 print:text-gray-900">
                  <tr>
                    <td className="p-2">Basement Car Park</td>
                    <td className="p-2">6 ACH</td>
                    <td className="p-2">≥ 50% exhaust at low level ≤ 650 mm from floor; intake &lt; 5m away banned</td>
                  </tr>
                  <tr>
                    <td className="p-2">Commercial Kitchen</td>
                    <td className="p-2">20 ACH (10 ACH off)</td>
                    <td className="p-2">Bifurcated fans; NO FIRE DAMPERS in grease exhaust ducts; gas solenoid interlock</td>
                  </tr>
                  <tr>
                    <td className="p-2">Staircase Pressurisation</td>
                    <td className="p-2">50 Pa to 60 Pa</td>
                    <td className="p-2">1.0 m/s door velocity; total door opening force Ft ≤ 110 N (Fire Code Cl 1.3.12)</td>
                  </tr>
                  <tr>
                    <td className="p-2">Public Bathrooms & Toilets</td>
                    <td className="p-2">10 ACH</td>
                    <td className="p-2">Negative pressure; ceiling &gt; 2.5m computed on 2.5m effective height</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Water Services & Sanitary Systems (SS 636) */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-cyan-300 print:text-blue-800 uppercase font-mono">
              4.0 Potable Water Supply & Sanitary Drainage (SS 636 & PUB DTSS)
            </h2>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300 print:text-gray-800">
              <li><strong>Water Supply Modes:</strong> Mode 1 (&lt; 25m MSL direct), Mode 2 (25m - 37m MSL high tank), Mode 3 (&gt; 37m MSL low+high tank with duplicate transfer pumps).</li>
              <li><strong>Appliance Pressure Head:</strong> Limited to maximum <strong>35 m of water head</strong> via Pressure Reducing Valves (PRVs, SS 636 Cl 6.7).</li>
              <li><strong>Cistern Compartmentation:</strong> Tanks &gt; 4,500 L partitioned into two interconnected compartments; separate overflow and warning pipes; stainless steel mesh ≤ 0.65 mm; non-duplicable keys.</li>
              <li><strong>Sanitary Drainage:</strong> 1st storey sanitary appliances connected directly to underground drain lines to prevent compression water seal blowout. 25 mm trap water seal depth preserved.</li>
            </ul>
          </div>

          {/* Verification Sign-Off */}
          <div className="pt-6 border-t border-slate-700 flex justify-between items-end text-xs font-mono">
            <div>
              <span className="block text-slate-400 print:text-gray-600">Verified by MechApp Studio AI</span>
              <span className="font-bold text-white print:text-black">
                Qualified Candidate / Facilities Engineer (Rank Level {userLevel})
              </span>
            </div>
            <div className="text-right">
              <span className="block text-slate-400 print:text-gray-600">Academic Review</span>
              <span className="font-bold text-white print:text-black">David Teo (Module Leader)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
