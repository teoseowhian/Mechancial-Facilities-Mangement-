/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Search, BookOpen, Layers } from 'lucide-react';

interface SymbolsReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SymbolItem {
  tag: string;
  name: string;
  category: 'Valves' | 'Dampers' | 'Equipment' | 'Diffusers' | 'Line Types' | 'Abbreviations';
  description: string;
  standard: string;
}

const SYMBOLS_DATA: SymbolItem[] = [
  // Valves
  { tag: 'GV', name: 'Gate Valve', category: 'Valves', description: 'Used for full flow isolation/stopping. Not used for regulation.', standard: 'CP 83 / SS 553' },
  { tag: 'GLV', name: 'Globe Valve', category: 'Valves', description: 'Used for precise throttling and flow regulation. High pressure drop.', standard: 'CP 83 / SS 553' },
  { tag: 'BV', name: 'Butterfly Valve', category: 'Valves', description: 'Compact quarter-turn disc valve for isolation and throttling in large pipes.', standard: 'CP 83 / SS 553' },
  { tag: 'CV', name: 'Check Valve (Non-Return)', category: 'Valves', description: 'Permits liquid flow in one direction only; prevents backflow into pumps.', standard: 'CP 83 / SS 553' },
  { tag: 'STR', name: 'Y-Type Strainer', category: 'Valves', description: 'Removes solid debris from water pipes before pumps and chillers.', standard: 'CP 83 / SS 553' },
  { tag: 'PRV', name: 'Pressure Reducing Valve', category: 'Valves', description: 'Limits downstream water head to ≤ 35m in high-rise buildings (SS 636).', standard: 'SS 636 Cl 6.7' },
  { tag: 'AARV', name: 'Automatic Air Release Valve', category: 'Valves', description: 'Installed at highest points of pipes and rising mains to exhaust air automatically.', standard: 'Fire Code 2023 / SS 636' },
  { tag: '2-WAY', name: '2-Way Modulating Control Valve', category: 'Valves', description: 'Modulates chilled water flow through cooling coils based on room thermostat.', standard: 'SS 553' },
  { tag: '3-WAY', name: '3-Way Modulating Valve', category: 'Valves', description: 'Diverts chilled water to bypass line during low load in constant-flow systems.', standard: 'Unit 8.2' },
  { tag: 'FS', name: 'Flow Switch', category: 'Valves', description: 'Micro-switch actuated by water flow flap to interlock chiller compressor start.', standard: 'Unit 9.2' },

  // Dampers
  { tag: 'FD', name: 'Fire Damper', category: 'Dampers', description: 'Fitted with 165°F (73.8°C) fusible link. BANNED in kitchen exhaust ducts!', standard: 'Fire Code 2023' },
  { tag: 'VCD', name: 'Volume Control Damper', category: 'Dampers', description: 'Manual or motorized opposed blade damper to balance airflow in branch ducts.', standard: 'SS 553' },
  { tag: 'MD(FR)', name: 'Motorised Fire-Rated Damper', category: 'Dampers', description: 'Motorized damper tied to Fire Alarm Panel with fire resistance rating.', standard: 'Fire Code 2023' },
  { tag: 'NRD', name: 'Non-Return Damper', category: 'Dampers', description: 'Gravity or spring flap allowing air movement in one direction only.', standard: 'SS 553' },
  { tag: 'SD', name: 'Splitter Damper', category: 'Dampers', description: 'Hinged blade at duct junction to divide airflow into branch take-offs.', standard: 'Unit 8' },

  // Equipment
  { tag: 'AHU', name: 'Air Handling Unit', category: 'Equipment', description: 'Central unit with mixing box, filters (MERV-8/13), cooling coil, and blower fan.', standard: 'Unit 8' },
  { tag: 'FCU', name: 'Fan Coil Unit', category: 'Equipment', description: 'Local zone terminal containing chilled water coil and multi-speed blower fan.', standard: 'Unit 7 / Unit 8' },
  { tag: 'VAV', name: 'Variable Air Volume Box', category: 'Equipment', description: 'Zone terminal with rotating blade damper modulating airflow to match cooling load.', standard: 'Unit 8' },
  { tag: 'CT', name: 'Cooling Tower', category: 'Equipment', description: 'Induced/forced draft heat rejection tower. SS 530 efficiency ≥ 21.5 RT/kW.', standard: 'SS 530 / SS 553' },
  { tag: 'CH', name: 'Water Chiller', category: 'Equipment', description: 'Centrifugal/screw refrigeration compressor, evaporator cooler, and condenser.', standard: 'SS 530' },

  // Diffusers
  { tag: 'SCD', name: 'Supply Ceiling Diffuser', category: 'Diffusers', description: 'Square or round ceiling diffuser achieving air entrainment along ceiling.', standard: 'CP 83' },
  { tag: 'EAG', name: 'Exhaust Air Grille', category: 'Diffusers', description: 'Perforated or egg-crate grille for extracting room air into exhaust duct.', standard: 'CP 83' },
  { tag: 'SLOT', name: 'Linear Slot Diffuser', category: 'Diffusers', description: 'Architectural slot diffuser for high throw along perimeter glass walls.', standard: 'CP 83' },

  // Line Types
  { tag: 'CHWS', name: 'Chilled Water Supply', category: 'Line Types', description: 'Supply line carrying 5°C to 7°C water to AHU/FCU coils. Requires insulation.', standard: 'CP 83 Line RP-1' },
  { tag: 'CHWR', name: 'Chilled Water Return', category: 'Line Types', description: 'Return line carrying 12°C water from cooling coils back to chiller evaporator.', standard: 'CP 83 Line RP-2' },
  { tag: 'CWS', name: 'Condenser Water Supply', category: 'Line Types', description: 'Cool water (~29°C) from cooling tower sump to chiller water-cooled condenser.', standard: 'CP 83 Line CW-1' },
  { tag: 'CWR', name: 'Condenser Water Return', category: 'Line Types', description: 'Warm water (~34°C) from condenser back to cooling tower distribution spray.', standard: 'CP 83 Line CW-2' },
  { tag: 'CDP', name: 'Condensate Drain Pipe', category: 'Line Types', description: 'PVC pipe draining condensed moisture from AHU/FCU drain pans to floor waste.', standard: 'CP 83 / SS 636' },

  // Abbreviations
  { tag: 'SAD', name: 'Supply Air Duct', category: 'Abbreviations', description: 'Main or branch duct carrying conditioned supply air from AHU.', standard: 'CP 83' },
  { tag: 'RAD', name: 'Return Air Duct', category: 'Abbreviations', description: 'Duct returning room air back to AHU mixing plenum.', standard: 'CP 83' },
  { tag: 'FAD', name: 'Fresh Air Duct', category: 'Abbreviations', description: 'Duct introducing outside air into building for ventilation and pressurisation.', standard: 'CP 83' },
  { tag: 'EAD', name: 'Exhaust Air Duct', category: 'Abbreviations', description: 'Duct discharging contaminated air (toilets, kitchen, car park) outdoors.', standard: 'CP 83' },
  { tag: 'T/A', name: 'To Above', category: 'Abbreviations', description: 'Pipe or ductwork turning upward to upper floor level.', standard: 'CP 83 Drafting' },
  { tag: 'T/B', name: 'To Below', category: 'Abbreviations', description: 'Pipe or ductwork turning downward to lower floor level.', standard: 'CP 83 Drafting' },
  { tag: 'F/A', name: 'From Above', category: 'Abbreviations', description: 'Pipe or ductwork coming from upper floor level.', standard: 'CP 83 Drafting' },
  { tag: 'F/B', name: 'From Below', category: 'Abbreviations', description: 'Pipe or ductwork coming from lower floor level.', standard: 'CP 83 Drafting' },
];

export const SymbolsReferenceModal: React.FC<SymbolsReferenceModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Valves', 'Dampers', 'Equipment', 'Diffusers', 'Line Types', 'Abbreviations'];

  const filteredSymbols = SYMBOLS_DATA.filter((sym) => {
    const matchesCat = selectedCategory === 'All' || sym.category === selectedCategory;
    const matchesSearch = 
      sym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                CP 83 & SS 553 Mechanical Drawings & Symbols Glossary
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Official CAD abbreviations, valve graphic symbols, duct line types, and piping change-of-direction codes (Unit 3).
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbol (e.g. FD, CHWS, PRV)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Table content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSymbols.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
                      {item.tag}
                    </span>
                    <span className="font-bold text-white font-sans text-xs">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{item.standard}</span>
                </div>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
