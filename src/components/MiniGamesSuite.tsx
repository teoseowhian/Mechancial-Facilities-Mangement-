/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles,
  Zap,
  Wrench,
  Search,
  ShieldCheck,
  Flame,
  Droplet
} from 'lucide-react';

interface MiniGamesSuiteProps {
  userXp: number;
  userLevel: number;
  earnedBadges: string[];
  onEarnXp: (xp: number, badgeTitle?: string) => void;
}

interface QuizQuestion {
  id: string;
  category: 'HVAC' | 'Sanitary' | 'Ventilation' | 'Fire' | 'Gas';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  codeStandard: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'HVAC',
    question: 'A centrifugal chilled water pump operates at 1450 rpm. If its speed is reduced by 20% using a VSD, what is the approximate percentage reduction in pump power according to Affinity Laws?',
    options: ['20.0%', '36.0%', '48.8%', '51.2%'],
    correctIndex: 2,
    explanation: 'By affinity laws: P2 = P1 × (N2/N1)³ = P1 × (0.8)³ = 0.512 P1. The reduction is (1 - 0.512) × 100% = 48.8%!',
    hint: 'Power is proportional to the cube of impeller speed: (0.8)³ = 0.512.',
    codeStandard: 'Fan & Pump Affinity Laws / SS 553',
  },
  {
    id: 'q2',
    category: 'Sanitary',
    question: 'Why are sanitary appliances on the 1st storey of a multi-storey building connected directly to the underground drainage system instead of the vertical discharge stack?',
    options: [
      'To save piping material costs',
      'Due to high risk of compression blowing trap water seals upward',
      'To prevent noise in upper residential units',
      'Because uPVC pipes cannot withstand 1st storey temperatures',
    ],
    correctIndex: 1,
    explanation: 'Wastewater descending down the vertical stack creates a positive pressure compression zone near the base that can blow water seals out of ground floor fixtures. Hence, 1st storey fixtures must connect directly underground.',
    hint: 'Think about what falling water does as it hits the bottom of the stack like an air piston.',
    codeStandard: 'PUB DTSS / Sanitary Plumbing Code',
  },
  {
    id: 'q3',
    category: 'Ventilation',
    question: 'In commercial kitchen exhaust systems, which of the following is STRICTLY PROHIBITED in the exhaust ductwork under SS 553 and Fire Code 2023?',
    options: [
      'Bifurcated exhaust fans',
      'Fire dampers with fusible links',
      'Rockwool fire-rated wrapping',
      'Washable grease filters',
    ],
    correctIndex: 1,
    explanation: 'Fire dampers are strictly prohibited in kitchen exhaust ducts because cooking grease and oil vapor deposit on the blades and fusible links, causing accidental closures or failure to close during fires. Fire-rated duct boards and bifurcated fans must be used instead.',
    hint: 'Cooking grease will coat and jam mechanical moving blades.',
    codeStandard: 'SS 553 : 2016 / Fire Code 2023',
  },
  {
    id: 'q4',
    category: 'Gas',
    question: 'Piped town gas in Singapore is manufactured from naphtha. Which of the following is a true characteristic of this gas?',
    options: [
      'Heavier than air (SG = 1.5), accumulates in floor trenches',
      'Lighter than air (SG = 0.50 - 0.59), rises and dissipates quickly if leaked',
      'Composed of 95% pure propane with zero carbon monoxide',
      'Non-flammable in air at concentrations above 20%',
    ],
    correctIndex: 1,
    explanation: 'Town gas has an SG of 0.50 to 0.59 relative to air (lighter than air). When a leak occurs, it rises to the ceiling and dissipates quickly into ventilation ducts rather than pooling on floors.',
    hint: 'Specific gravity relative to air (air = 1.0) is between 0.5 and 0.59.',
    codeStandard: 'SS 608 : 2015 / Gas Act Cap 116A',
  },
  {
    id: 'q5',
    category: 'Fire',
    question: 'Under Fire Code 2023, what is the maximum permissible total door opening force (Ft) for a pressurized exit staircase door during operation?',
    options: ['50 N', '80 N', '110 N', '150 N'],
    correctIndex: 2,
    explanation: 'Under Fire Code 2023 Clause 1.3.12, the total force required to open a door against both the door closer and air pressure differential must not exceed 110 N so that elderly and vulnerable occupants can escape safely.',
    hint: 'The force limit ensures evacuating occupants can easily push the door open.',
    codeStandard: 'Fire Code 2023 Clause 1.3.12',
  },
  {
    id: 'q6',
    category: 'HVAC',
    question: 'What is the correct starting sequence for a central water-cooled chiller plant to ensure safety and prevent freezing?',
    options: [
      'Chiller ➔ CHWP ➔ CWP ➔ Cooling Towers ➔ AHU',
      'Cooling Towers ➔ CWP ➔ AHU ➔ CHWP ➔ Water Chiller',
      'CHWP ➔ Water Chiller ➔ CWP ➔ Cooling Towers ➔ AHU',
      'AHU ➔ Water Chiller ➔ CHWP ➔ CWP ➔ Cooling Towers',
    ],
    correctIndex: 1,
    explanation: 'Starting sequence: 1. Cooling Towers ➔ 2. Condenser Water Pump (CWP) ➔ 3. Air Handling Units (AHU) ➔ 4. Chilled Water Pump (CHWP) ➔ 5. Water Chiller. Shutting down is strictly the reverse!',
    hint: 'Heat rejection circuit starts first, then building distribution, then evaporator pump, and compressor last.',
    codeStandard: 'Unit 9.2 / Chiller Plant Operating SOP',
  },
];

interface TroubleshootingScenario {
  id: string;
  title: string;
  symptom: string;
  facilityContext: string;
  options: { label: string; isCorrect: boolean; feedback: string }[];
}

const FAULT_SCENARIOS: TroubleshootingScenario[] = [
  {
    id: 'fault-1',
    title: 'The Clammy Office Mystery',
    symptom: 'Building occupants on the 8th floor complain that the office feels "cold yet sticky and clammy". Thermostat reads 22°C, but Relative Humidity has surged to 78%!',
    facilityContext: 'Variable Air Volume (VAV) AHU serving general open-plan office. Supply air temperature is 14°C.',
    options: [
      {
        label: 'Lower the thermostat setpoint further to 19°C',
        isCorrect: false,
        feedback: 'Incorrect! Lowering the setpoint forces VAV boxes to throttle down air volume further, reducing air movement and making the space feel even colder and more clammy!',
      },
      {
        label: 'Perform CHWST reset and raise supply air temperature or check for oversized AHU throttling flow without moisture removal',
        isCorrect: true,
        feedback: 'Spot on! The system suffered from low sensible load causing the VAV terminals to pinch down to minimum airflow, failing to dehumidify the air. By modulating off-coil dew point or installing reheat/dedicated outdoor air unit, RH is kept ≤ 65% per SS 553!',
      },
      {
        label: 'Turn off the AHU blower completely',
        isCorrect: false,
        feedback: 'Incorrect! Turning off the blower ceases all mechanical ventilation and violates indoor air quality codes.',
      },
    ],
  },
  {
    id: 'fault-2',
    title: 'The Unexplained Sewer Odor',
    symptom: 'Tenants in a 3rd-storey commercial office report an intermittent rotten-egg sewer smell (hydrogen sulphide H₂S) around the executive washroom area on Monday mornings.',
    facilityContext: 'Sanitary plumbing with ventilated stack. Washroom has a floor trap near the rarely used shower cubicle.',
    options: [
      {
        label: 'Trap seal loss due to evaporation in the rarely-used shower floor trap',
        isCorrect: true,
        feedback: 'Correct! Over the warm weekend, the 25mm water seal in the unused floor trap evaporated completely, leaving an open path for sewer gases to migrate into the office. Pouring water restores the liquid seal!',
      },
      {
        label: 'The grease trap underground has collapsed',
        isCorrect: false,
        feedback: 'Incorrect! An underground grease trap failure would cause backing up of kitchen waste, not localized smell in an executive bathroom.',
      },
      {
        label: 'The uPVC discharge pipe has melted from hot water',
        isCorrect: false,
        feedback: 'Incorrect! Office bathrooms do not carry boiling wastewater.',
      },
    ],
  },
  {
    id: 'fault-3',
    title: 'Centrifugal Compressor Shudder & Surge Alert',
    symptom: 'During a quiet rainy evening when building load dropped to 180 RT (under 30% capacity of the 650 RT chiller), the compressor produces loud cyclic whooshing noises with heavy current swings.',
    facilityContext: 'Centrifugal water-cooled chiller with 29°C condenser water and 6.7°C chilled water.',
    options: [
      {
        label: 'Chiller Surge: Head exceeds impeller capability. Open Hot Gas Bypass and raise CHWST to reduce lift.',
        isCorrect: true,
        feedback: 'Brilliant diagnosis! Chiller surge occurs at low capacity and high lift. Hot gas bypass introduces artificial load, and raising CHWST reduces the pressure difference, stabilizing refrigerant flow!',
      },
      {
        label: 'Refrigerant has frozen inside the cooling tower',
        isCorrect: false,
        feedback: 'Incorrect! Cooling towers circulate water, not refrigerant.',
      },
      {
        label: 'The motor coupling guard has detached',
        isCorrect: false,
        feedback: 'Incorrect! Motor coupling mechanical noise does not cause wide electrical current fluctuations and cyclic flow reversal.',
      },
    ],
  },
];

export const MiniGamesSuite: React.FC<MiniGamesSuiteProps> = ({
  userXp,
  userLevel,
  earnedBadges,
  onEarnXp,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'troubleshooting' | 'badges'>('quiz');

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Fault state
  const [currentFaultIdx, setCurrentFaultIdx] = useState(0);
  const [selectedFaultOption, setSelectedFaultOption] = useState<number | null>(null);
  const [faultFeedback, setFaultFeedback] = useState<string | null>(null);

  const currentQ = QUIZ_QUESTIONS[currentQuizIdx];
  const currentF = FAULT_SCENARIOS[currentFaultIdx];

  const handleSelectQuizOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
      onEarnXp(50, 'Quiz Ace');
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setCurrentQuizIdx(0);
    }
  };

  const handleDiagnoseFault = (idx: number) => {
    setSelectedFaultOption(idx);
    const chosen = currentF.options[idx];
    setFaultFeedback(chosen.feedback);
    if (chosen.isCorrect) {
      onEarnXp(75, 'Plant Room Troubleshooter');
    }
  };

  const handleNextFault = () => {
    setSelectedFaultOption(null);
    setFaultFeedback(null);
    if (currentFaultIdx < FAULT_SCENARIOS.length - 1) {
      setCurrentFaultIdx((prev) => prev + 1);
    } else {
      setCurrentFaultIdx(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Gamification Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive FM Academy & Gamification</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Building Services Interactive Challenges & Quiz
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test your engineering knowledge, diagnose realistic plant room faults, and level up from Apprentice to Principal Consultant!
            </p>
          </div>

          {/* User Scorecard */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Rank Level {userLevel}</span>
              <span className="text-sm font-bold font-mono text-cyan-400">
                {userLevel === 1 ? 'Apprentice FM' : userLevel === 2 ? 'Plant Technician' : userLevel === 3 ? 'Building Services Engineer' : 'Principal Consultant'}
              </span>
            </div>

            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Experience</span>
              <span className="text-sm font-bold font-mono text-amber-400">{userXp} XP</span>
            </div>
          </div>
        </div>

        {/* Tab switch bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'quiz'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Module Exam Quizzes
          </button>

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'troubleshooting'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Plant Room Fault Detective
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'badges'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Engineer Badges ({earnedBadges.length})
          </button>
        </div>
      </div>

      {/* View 1: Quiz Module */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {currentQ.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Question {currentQuizIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Governing Code: <strong className="text-white">{currentQ.codeStandard}</strong>
            </span>
          </div>

          <div className="text-sm font-semibold text-white leading-relaxed">
            {currentQ.question}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
              if (selectedOption === idx) {
                optStyle = 'bg-cyan-500/10 border-cyan-500 text-white font-medium';
              }
              if (isAnswerSubmitted) {
                if (idx === currentQ.correctIndex) {
                  optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (selectedOption === idx) {
                  optStyle = 'bg-red-500/20 border-red-500 text-red-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 ${optStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Hint & Explanations */}
          {showHint && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
              <strong>Tutor Hint:</strong> {currentQ.hint}
            </div>
          )}

          {isAnswerSubmitted && (
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${selectedOption === currentQ.correctIndex ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' : 'bg-red-500/10 border-red-500/40 text-red-200'}`}>
              <div className="font-bold flex items-center gap-1.5 text-sm">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Correct! +50 XP
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Review Required:
                  </>
                )}
              </div>
              <p className="text-slate-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-slate-400 hover:text-amber-300 transition-colors"
            >
              {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>

            <div className="flex items-center gap-3">
              {!isAnswerSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitQuiz}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Plant Room Fault Detective */}
      {activeTab === 'troubleshooting' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                SCENARIO {currentFaultIdx + 1}
              </span>
              <h3 className="text-sm font-bold text-white">{currentF.title}</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Case {currentFaultIdx + 1} of {FAULT_SCENARIOS.length}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-mono block text-[11px] uppercase">Reported Symptom:</span>
              <p className="text-amber-300 font-medium mt-1">{currentF.symptom}</p>
            </div>

            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-xs text-slate-400">
              <span className="font-mono text-slate-500 block text-[11px] uppercase">Plant Context:</span>
              <p className="mt-1">{currentF.facilityContext}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 block">
              What is the engineering root cause and correct remediation action?
            </span>
            {currentF.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleDiagnoseFault(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                  selectedFaultOption === idx
                    ? opt.isCorrect
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {faultFeedback && (
            <div className={`p-4 rounded-xl border text-xs ${selectedFaultOption !== null && currentF.options[selectedFaultOption].isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' : 'bg-red-500/10 border-red-500/40 text-red-200'}`}>
              <span className="font-bold block mb-1 font-mono">
                {selectedFaultOption !== null && currentF.options[selectedFaultOption].isCorrect ? '✓ CORRECT DIAGNOSIS (+75 XP)' : '⚠ SYSTEM TRIP RISK:'}
              </span>
              <p className="text-slate-300">{faultFeedback}</p>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={handleNextFault}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              <span>Next Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* View 3: Engineer Badges Showcase */}
      {activeTab === 'badges' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              Engineer Competency Badges & Certifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Badges earned through interactive quizzes, simulator challenges, and fault investigations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Green Mark Plant Master',
                desc: 'Achieved ≤ 0.85 kW/RT plant efficiency in Chiller Simulator Challenge.',
                icon: Zap,
              },
              {
                title: 'Chiller Starting Interlock Master',
                desc: 'Successfully executed the 5-step starting sequence without freezing trips.',
                icon: ShieldCheck,
              },
              {
                title: 'Plant Room Troubleshooter',
                desc: 'Accurately resolved clammy air, trap seal loss, and chiller surge scenarios.',
                icon: Wrench,
              },
              {
                title: 'Trap Master',
                desc: 'Diagnosed all 5 mechanisms of sanitary trap water seal loss.',
                icon: Droplet,
              },
              {
                title: 'Fire Code Scholar',
                desc: 'Validated staircase pressurisation force limits (≤ 110 N) and 50–60 Pa differentials.',
                icon: Flame,
              },
              {
                title: 'Quiz Ace',
                desc: 'Scored 100% on building mechanical systems multiple choice examinations.',
                icon: Award,
              },
            ].map((badge, idx) => {
              const isEarned = earnedBadges.includes(badge.title);
              const IconComp = badge.icon;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isEarned
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-500 opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isEarned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600'}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">{badge.title}</span>
                    <p className="text-[11px] mt-1 text-slate-400">{badge.desc}</p>
                    <span className="mt-2 text-[10px] font-mono block font-semibold">
                      {isEarned ? '✓ UNLOCKED' : 'LOCKED (Complete Challenge)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
