/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { COURSE_CONFIG as CONFIG_OBJECT, WeekData } from './data/courseConfig';
import { CoursePosterLanding } from './components/CoursePosterLanding';
import { IeqPracticalSuite } from './components/IeqPracticalSuite';
import { ChillerPlantSuite } from './components/ChillerPlantSuite';
import { MechVentilationSuite } from './components/MechVentilationSuite';
import { PsychrometricEngine } from './components/PsychrometricEngine';
import { WaterSupplyPlumbingSuite } from './components/WaterSupplyPlumbingSuite';
import { FireProtectionSuite } from './components/FireProtectionSuite';
import { TownGasSuite } from './components/TownGasSuite';
import { DuctAerodynamics } from './components/DuctAerodynamics';
import { MiniGamesSuite } from './components/MiniGamesSuite';
import { AiTutorModal } from './components/AiTutorModal';
import { SymbolsReferenceModal } from './components/SymbolsReferenceModal';
import { TechnicalSubmittalModal } from './components/TechnicalSubmittalModal';
import { UnitSystem } from './types/dcfm';
import { 
  Bot, 
  Wind, 
  Droplets, 
  Flame, 
  ShieldAlert, 
  Gauge, 
  Sparkles, 
  BookOpen, 
  Layers, 
  GraduationCap, 
  ArrowLeft,
  Thermometer,
  FileText,
  Award
} from 'lucide-react';

/**
 * ============================================================================
 * MODULE CONFIGURATION OBJECT (Edit dates, names, links, and colours here)
 * ============================================================================
 */
export const COURSE_CONFIG = CONFIG_OBJECT;

export type AppViewMode = 'poster' | 'lab';

export type MainTab = 
  | 'poster'
  | 'ieq'
  | 'chillers'
  | 'ventilation'
  | 'psychrometrics'
  | 'water_plumbing'
  | 'fire'
  | 'gas'
  | 'ducts'
  | 'minigames';

export default function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('poster');
  const [activeLabTab, setActiveLabTab] = useState<MainTab>('ieq');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  
  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>();
  const [isSymbolsOpen, setIsSymbolsOpen] = useState(false);
  const [isSubmittalOpen, setIsSubmittalOpen] = useState(false);

  // Gamification state
  const [userXp, setUserXp] = useState(350);
  const [userLevel, setUserLevel] = useState(3);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([
    'Green Mark Plant Master',
    'Plant Room Troubleshooter',
    'Fire Code Scholar'
  ]);

  const handleEarnXp = (xpGain: number, badgeTitle?: string) => {
    setUserXp((prev) => {
      const nextXp = prev + xpGain;
      const nextLvl = Math.floor(nextXp / 150) + 1;
      setUserLevel(nextLvl);
      return nextXp;
    });

    if (badgeTitle && !earnedBadges.includes(badgeTitle)) {
      setEarnedBadges((prev) => [...prev, badgeTitle]);
    }
  };

  const handleOpenLab = (tab: MainTab) => {
    setActiveLabTab(tab);
    setViewMode('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiChat = (initialPrompt?: string) => {
    setChatInitialPrompt(initialPrompt);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C8102E]/10 selection:text-[#C8102E]">
      
      {/* If in Poster View, render the clean academic course poster */}
      {viewMode === 'poster' ? (
        <CoursePosterLanding 
          onOpenLab={handleOpenLab}
          onOpenAiChat={handleOpenAiChat}
        />
      ) : (
        /* If in Lab Simulator View, render the interactive engineering lab suite with return bar */
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600/30 selection:text-red-200">
          
          {/* Top navigation header for Lab view */}
          <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
              
              {/* Back to course poster button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('poster')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 font-semibold text-xs transition-colors border border-red-500/30"
                  title="Return to the course poster landing page"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Course Poster</span>
                </button>

                <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600/20 flex items-center justify-center text-red-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    Interactive Engineering Labs
                  </span>
                </div>
              </div>

              {/* Lab Tabs selector */}
              <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
                <button
                  onClick={() => setActiveLabTab('ieq')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'ieq'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>W5 IEQ Lab</span>
                </button>

                <button
                  onClick={() => setActiveLabTab('chillers')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'chillers'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>W14 Chillers</span>
                </button>

                <button
                  onClick={() => setActiveLabTab('ventilation')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'ventilation'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>W7 Vent</span>
                </button>

                <button
                  onClick={() => setActiveLabTab('psychrometrics')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'psychrometrics'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>W10 AC</span>
                </button>

                <button
                  onClick={() => setActiveLabTab('water_plumbing')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'water_plumbing'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>W3/4 Water</span>
                </button>

                <button
                  onClick={() => setActiveLabTab('fire')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'fire'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>W1 Fire</span>
                </button>

                <button
                  onClick={() => setActiveLabTab('gas')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'gas'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>W8 Gas</span>
                </button>

                <button
                  onClick={() => setActiveLabTab('minigames')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'minigames'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>W9/15 Quizzes</span>
                </button>
              </div>

              {/* Auxiliary tools */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSymbolsOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors hidden md:block"
                  title="CP 83 Symbols Glossary"
                >
                  <Layers className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsSubmittalOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors hidden md:block"
                  title="Generate Technical Submittal"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenAiChat()}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors shadow-sm"
                  title="Chat with MechApp AI Assistant"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Lab Content Area */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
            {activeLabTab === 'ieq' && (
              <IeqPracticalSuite />
            )}

            {activeLabTab === 'chillers' && (
              <ChillerPlantSuite onEarnXp={handleEarnXp} />
            )}

            {activeLabTab === 'ventilation' && (
              <MechVentilationSuite onEarnXp={handleEarnXp} />
            )}

            {activeLabTab === 'psychrometrics' && (
              <PsychrometricEngine />
            )}

            {activeLabTab === 'water_plumbing' && (
              <WaterSupplyPlumbingSuite />
            )}

            {activeLabTab === 'fire' && (
              <FireProtectionSuite />
            )}

            {activeLabTab === 'gas' && (
              <TownGasSuite />
            )}

            {activeLabTab === 'ducts' && (
              <DuctAerodynamics unitSystem={unitSystem} />
            )}

            {activeLabTab === 'minigames' && (
              <MiniGamesSuite 
                userXp={userXp}
                userLevel={userLevel}
                earnedBadges={earnedBadges}
                onEarnXp={handleEarnXp}
              />
            )}
          </main>
        </div>
      )}

      {/* AI Tutor Chat Modal (David Teo MechApp Studio AI Persona) */}
      <AiTutorModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onEarnXp={handleEarnXp}
        initialPrompt={chatInitialPrompt}
      />

      {/* CP 83 Symbols Glossary Reference Modal */}
      <SymbolsReferenceModal 
        isOpen={isSymbolsOpen} 
        onClose={() => setIsSymbolsOpen(false)} 
      />

      {/* Formal Technical Submittal Sheet Modal */}
      <TechnicalSubmittalModal 
        isOpen={isSubmittalOpen} 
        onClose={() => setIsSubmittalOpen(false)} 
        userLevel={userLevel}
        userXp={userXp}
      />
    </div>
  );
}
