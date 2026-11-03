/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UnitSystem } from '../types/dcfm';
import { FACILITY_PRESETS } from '../data/defaultPresets';
import { 
  Wind, 
  Droplets, 
  Gauge, 
  Activity, 
  Layers, 
  ShieldCheck, 
  Printer, 
  SlidersHorizontal 
} from 'lucide-react';

export type ActiveTab = 'airflow' | 'plant' | 'psychrometrics' | 'ducts' | 'aisle' | 'ops';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unitSystem: UnitSystem;
  onToggleUnitSystem: () => void;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  unitSystem,
  onToggleUnitSystem,
  activePresetId,
  onSelectPreset,
  onOpenReport,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap block">
              Mech · DCFM
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:block">
              Mechanical & Facilities Engineering
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => onTabChange('airflow')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'airflow'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Airflow & CFM
          </button>

          <button
            onClick={() => onTabChange('plant')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'plant'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Chilled Water & PUE
          </button>

          <button
            onClick={() => onTabChange('psychrometrics')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'psychrometrics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            ASHRAE TC 9.9
          </button>

          <button
            onClick={() => onTabChange('ducts')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ducts'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            Duct Aerodynamics
          </button>

          <button
            onClick={() => onTabChange('aisle')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'aisle'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Aisle Simulator
          </button>

          <button
            onClick={() => onTabChange('ops')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ops'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Buffer & Maintenance
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Preset Selector */}
          <div className="relative hidden md:block">
            <select
              value={activePresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {FACILITY_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Toggle */}
          <button
            onClick={onToggleUnitSystem}
            title={`Switch to ${unitSystem === 'imperial' ? 'Metric (m³/h, °C, L/s, Pa)' : 'Imperial (CFM, °F, GPM, in. wg)'}`}
            className="px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-700 bg-slate-950 text-cyan-400 hover:border-cyan-500 transition-colors whitespace-nowrap"
          >
            {unitSystem === 'imperial' ? 'IMP (CFM/°F)' : 'SI (m³/h/°C)'}
          </button>

          {/* Report Submittal CTA */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors shadow-sm whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Submittal Report</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-800 bg-slate-950/80">
        <button
          onClick={() => onTabChange('airflow')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'airflow' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Airflow CFM
        </button>
        <button
          onClick={() => onTabChange('plant')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'plant' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Chilled Water & PUE
        </button>
        <button
          onClick={() => onTabChange('psychrometrics')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'psychrometrics' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          ASHRAE TC 9.9
        </button>
        <button
          onClick={() => onTabChange('ducts')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'ducts' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Duct Sizer
        </button>
        <button
          onClick={() => onTabChange('aisle')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'aisle' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Aisle Map
        </button>
        <button
          onClick={() => onTabChange('ops')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'ops' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Buffer & Ops
        </button>
      </div>
    </header>
  );
};
