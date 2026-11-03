/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { COURSE_CONFIG, getCurrentWeekStatus, WeekData } from '../data/courseConfig';
import { PosterThumbnailIllustration } from './PosterThumbnailIllustration';
import { 
  ExternalLink, 
  Printer, 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  HelpCircle, 
  KeyRound, 
  Video, 
  Sparkles, 
  Wrench,
  Bot,
  GraduationCap,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MainTab } from '../App';

interface CoursePosterLandingProps {
  onOpenLab: (tab: MainTab) => void;
  onOpenAiChat: (initialPrompt?: string) => void;
}

export const CoursePosterLanding: React.FC<CoursePosterLandingProps> = ({
  onOpenLab,
  onOpenAiChat
}) => {
  // Current week detection
  const weekStatus = getCurrentWeekStatus(new Date());
  
  // State for expanded cards (default to active week expanded)
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    [weekStatus.weekNumber || 3]: true
  });

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased selection:bg-[#C8102E]/10 selection:text-[#C8102E]">
      {/* 1. Thin accent bar (6px) across the very top */}
      <div 
        className="h-[6px] w-full"
        style={{ backgroundColor: COURSE_CONFIG.accent }}
      />

      {/* Main Poster Container (Centered with academic paper max-width) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-16">
        
        {/* 2. Header */}
        <header className="mb-6">
          {/* Eyebrow line in accent colour, uppercase, letter-spaced */}
          <div 
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-2"
            style={{ color: COURSE_CONFIG.accent }}
          >
            DCFM · MECHANICAL SYSTEMS · OCT 2026
          </div>

          {/* Big bold title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1A1A1A] leading-none mb-3">
            {COURSE_CONFIG.moduleName}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-3xl mb-5">
            Fifteen weeks on the mechanical services inside buildings: fire protection, water, sanitary plumbing, ventilation, town gas and air-conditioning. Module 101MS3, Diploma (Conversion) in Facilities Management.
          </p>

          {/* Small info row & actions */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4 py-3 border-y border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A]">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-1.5 text-[#1A1A1A]">
                <Clock className="w-4 h-4 text-[#6B6B6B]" />
                <span className="font-medium">{COURSE_CONFIG.classTime}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#1A1A1A]">
                <User className="w-4 h-4 text-[#6B6B6B]" />
                <span>Lecturer: <strong className="font-semibold">{COURSE_CONFIG.lecturer}</strong></span>
              </span>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <a
                href={COURSE_CONFIG.lmsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1A1A1A] text-white font-medium text-xs hover:bg-black transition-colors"
              >
                <span>Go to LMS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E5E5E5] text-[#1A1A1A] font-medium text-xs hover:bg-[#F9F9F9] transition-colors"
                title="Print or save as A4 poster"
              >
                <Printer className="w-3.5 h-3.5 text-[#6B6B6B]" />
                <span>Print / Save as poster</span>
              </button>

              <button
                onClick={() => onOpenAiChat("Hi David, can you give me an overview of the Mechanical Systems module?")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-white font-medium text-xs transition-colors"
                style={{ backgroundColor: COURSE_CONFIG.accent }}
                title="Ask David Teo AI Assistant"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>

          {/* "This week" banner */}
          <div className="mt-4 print:hidden">
            <div 
              className="p-3.5 rounded-lg flex items-center justify-between border"
              style={{
                backgroundColor: '#FAF5F5',
                borderColor: '#F3D1D7'
              }}
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: COURSE_CONFIG.accent }}
                />
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: COURSE_CONFIG.accent }}>
                  Current Status:
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                  {weekStatus.displayText}
                </span>
              </div>

              {weekStatus.weekNumber && (
                <button
                  onClick={() => {
                    const targetWk = COURSE_CONFIG.weeks.find(w => w.weekNumber === weekStatus.weekNumber);
                    if (targetWk?.interactiveTab) {
                      onOpenLab(targetWk.interactiveTab);
                    }
                  }}
                  className="text-xs font-semibold underline hover:no-underline flex items-center gap-1 shrink-0 ml-2"
                  style={{ color: COURSE_CONFIG.accent }}
                >
                  <span>Launch This Week's Lab</span>
                  <span>&rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* Dark horizontal rule below */}
          <hr className="border-[#1A1A1A] border-t-2 mt-6 mb-8" />
        </header>

        {/* 3. Week Cards (15 rows separated by thin grey rules) */}
        <section className="space-y-0" aria-label="Course Weekly Schedule">
          {COURSE_CONFIG.weeks.map((week, idx) => {
            const isCurrent = weekStatus.weekNumber === week.weekNumber;
            const isPast = weekStatus.weekNumber ? week.weekNumber < weekStatus.weekNumber : false;
            const isExpanded = !!expandedWeeks[week.weekNumber];
            const isBeforeVacation = week.weekNumber === 9;

            return (
              <React.Fragment key={week.weekNumber}>
                <div
                  id={`week-${week.weekNumber}`}
                  className={`py-6 border-b border-[#E5E5E5] transition-all ${
                    isCurrent 
                      ? 'bg-red-50/30 -mx-3 px-3 sm:-mx-4 sm:px-4 rounded-xl ring-1 ring-[#C8102E]/30' 
                      : isPast 
                      ? 'opacity-85 hover:opacity-100' 
                      : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
                    
                    {/* LEFT: "Slide thumbnail" card */}
                    <div 
                      onClick={() => toggleWeek(week.weekNumber)}
                      className="w-full md:w-64 shrink-0 bg-white border border-[#E5E5E5] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow relative select-none group"
                    >
                      {/* Red top border (4px accent) */}
                      <div className="h-1.5 w-full" style={{ backgroundColor: COURSE_CONFIG.accent }} />

                      {/* Red badge top-right */}
                      <div 
                        className="absolute top-3.5 right-3 px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-xs"
                        style={{ backgroundColor: COURSE_CONFIG.accent }}
                      >
                        W{week.weekNumber}
                      </div>

                      {/* Header block inside thumbnail */}
                      <div className="p-3.5 pb-1">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-[#6B6B6B]">
                          NGEE ANN POLYTECHNIC
                        </div>
                        <div 
                          className="text-[10px] uppercase font-extrabold tracking-wider mt-0.5"
                          style={{ color: COURSE_CONFIG.accent }}
                        >
                          MECHANICAL SYSTEMS
                        </div>
                        <div className="text-sm font-bold text-[#1A1A1A] mt-1 leading-snug line-clamp-2">
                          {week.cardTitle}
                        </div>
                      </div>

                      {/* Inline SVG line illustration with accent highlights */}
                      <div className="px-3 py-1 flex items-center justify-center h-28 bg-[#FCFCFC]">
                        <PosterThumbnailIllustration 
                          type={week.illustrationType} 
                          accent={COURSE_CONFIG.accent}
                        />
                      </div>

                      {/* Tiny footer inside thumbnail */}
                      <div className="px-3.5 py-2 border-t border-[#F0F0F0] flex items-center justify-between text-[10px] text-[#6B6B6B] bg-[#FAFAFA]">
                        <span className="font-mono">101MS3 · Week {week.weekNumber}</span>
                        {week.diagramSubLabel && (
                          <span className="font-mono font-semibold text-[9px]" style={{ color: COURSE_CONFIG.accent }}>
                            {week.diagramSubLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Text and details */}
                    <div className="flex-1 min-w-0">
                      {/* Week N · Date and Venue pill */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="text-xs sm:text-sm font-bold tracking-wide" style={{ color: COURSE_CONFIG.accent }}>
                          Week {week.weekNumber} · {week.dateStr}
                        </div>

                        {/* Venue pill: "On campus" vs "Online" */}
                        <div>
                          {week.isOnCampus ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                              <MapPin className="w-3 h-3 text-red-700" />
                              <span>On campus · Blk 34 #03-02</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Online · MS Teams</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Two-line bold headline */}
                      <h2 
                        onClick={() => toggleWeek(week.weekNumber)}
                        className="text-lg sm:text-xl font-bold text-[#1A1A1A] leading-tight mb-2 cursor-pointer hover:text-[#C8102E] transition-colors flex items-center justify-between group"
                      >
                        <span>{week.headline}: {week.topic}</span>
                        <span className="text-[#6B6B6B] text-xs font-normal print:hidden ml-2 group-hover:text-[#1A1A1A]">
                          {isExpanded ? (
                            <span className="flex items-center gap-1"><ChevronUp className="w-4 h-4" /></span>
                          ) : (
                            <span className="flex items-center gap-1"><ChevronDown className="w-4 h-4" /></span>
                          )}
                        </span>
                      </h2>

                      {/* Muted list of what is covered */}
                      <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed mb-3">
                        {week.coveredSummary}
                      </p>

                      {/* Quick action bar */}
                      <div className="flex flex-wrap items-center gap-2 print:hidden">
                        <button
                          onClick={() => toggleWeek(week.weekNumber)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#1A1A1A] hover:text-[#C8102E] transition-colors"
                        >
                          <span>{isExpanded ? 'Hide details & questions' : 'View tutorial questions & resources'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {week.interactiveTab && (
                          <button
                            onClick={() => onOpenLab(week.interactiveTab!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-red-50 hover:text-[#C8102E] text-slate-800 transition-colors ml-auto border border-slate-200"
                          >
                            <Wrench className="w-3.5 h-3.5 text-[#C8102E]" />
                            <span>Open Lab Simulator</span>
                          </button>
                        )}
                      </div>

                      {/* EXPANDABLE SECTION: Tutorial Questions & Resources */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-dashed border-[#E5E5E5] space-y-4 animate-in fade-in duration-200">
                          {/* Covered topics in bullet form */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                              Key Technical Concepts
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#4A4A4A]">
                              {week.coveredBullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-1.5">
                                  <span className="text-[#C8102E] font-bold">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tutorial Questions (if not practical or test) */}
                          {!week.isTestOrPractical && week.tutorialQuestions.length > 0 && (
                            <div className="bg-[#FAF9F8] p-3.5 rounded-lg border border-[#EBEAE8]">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5 text-[#C8102E]" />
                                  <span>Tutorial Questions</span>
                                </h4>
                                <button
                                  onClick={() => onOpenAiChat(`I need help answering the Week ${week.weekNumber} tutorial questions on ${week.topic}. Can you guide me step-by-step?`)}
                                  className="text-[11px] font-semibold text-[#C8102E] hover:underline flex items-center gap-1"
                                >
                                  <Bot className="w-3 h-3" />
                                  <span>Ask AI Tutor for hints</span>
                                </button>
                              </div>
                              <ol className="space-y-1.5 text-xs text-[#333333]">
                                {week.tutorialQuestions.map((q, qIdx) => (
                                  <li key={qIdx} className="flex items-start gap-2">
                                    <span className="font-mono text-[#6B6B6B] font-semibold shrink-0">
                                      {qIdx + 1}.
                                    </span>
                                    <span>{q.replace(/^\d+\s*/, '')}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Resource Buttons: Lecture notes, Tutorial, Answer key, Recording */}
                          {!week.isTestOrPractical ? (
                            <div>
                              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                                Module Resources
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Lecture notes */}
                                {week.links.lectureNotes ? (
                                  <a
                                    href={week.links.lectureNotes}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E5E5E5] bg-white text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#C8102E]" />
                                    <span>Lecture notes</span>
                                  </a>
                                ) : (
                                  <button
                                    disabled
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E5E5E5] bg-[#F7F7F7] text-[#9E9E9E] cursor-not-allowed"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Lecture notes (Coming soon)</span>
                                  </button>
                                )}

                                {/* Tutorial */}
                                {week.links.tutorial ? (
                                  <a
                                    href={week.links.tutorial}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E5E5E5] bg-white text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors"
                                  >
                                    <HelpCircle className="w-3.5 h-3.5 text-[#C8102E]" />
                                    <span>Tutorial sheet</span>
                                  </a>
                                ) : (
                                  <button
                                    disabled
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E5E5E5] bg-[#F7F7F7] text-[#9E9E9E] cursor-not-allowed"
                                  >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span>Tutorial (Coming soon)</span>
                                  </button>
                                )}

                                {/* Answer key */}
                                {week.links.answerKey ? (
                                  <a
                                    href={week.links.answerKey}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E5E5E5] bg-white text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors"
                                  >
                                    <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Answer key</span>
                                  </a>
                                ) : (
                                  <button
                                    disabled
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E5E5E5] bg-[#F7F7F7] text-[#9E9E9E] cursor-not-allowed"
                                  >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>Answer key (Coming soon)</span>
                                  </button>
                                )}

                                {/* Recording */}
                                {week.links.recording || COURSE_CONFIG.recordingsUrl ? (
                                  <a
                                    href={week.links.recording || COURSE_CONFIG.recordingsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E5E5E5] bg-white text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors"
                                  >
                                    <Video className="w-3.5 h-3.5 text-[#C8102E]" />
                                    <span>Recording</span>
                                  </a>
                                ) : (
                                  <button
                                    disabled
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E5E5E5] bg-[#F7F7F7] text-[#9E9E9E] cursor-not-allowed"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Recording (Coming soon)</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Test or practical notice */
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                              <span className="font-medium">
                                Hands-on practical / assessment session at Blk 34 #03-02. Please ensure safety footwear and lab attendance.
                              </span>
                              {week.interactiveTab && (
                                <button
                                  onClick={() => onOpenLab(week.interactiveTab!)}
                                  className="px-3 py-1 bg-amber-600 text-white rounded font-semibold text-xs hover:bg-amber-700 transition-colors shrink-0 ml-3"
                                >
                                  Open Lab Guide
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* VACATION BREAK DIVIDER between Week 9 and Week 10 */}
                {isBeforeVacation && (
                  <div className="my-8 py-4 px-6 bg-[#F4F4F4] border-y border-[#E5E5E5] rounded-md text-center">
                    <div className="text-xs uppercase tracking-widest font-extrabold text-[#6B6B6B]">
                      SEMESTER RECESS
                    </div>
                    <div className="text-base sm:text-lg font-bold text-[#1A1A1A] mt-0.5">
                      Vacation break · 21 Dec 2026 – 3 Jan 2027
                    </div>
                    <div className="text-xs text-[#6B6B6B] mt-1">
                      No classes scheduled. Classes resume Monday 4 January 2027 with Air-conditioning 1.
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </section>

        {/* 4. Assessment weightage */}
        <section className="mt-12 pt-8 border-t-2 border-[#1A1A1A]" aria-label="Assessment Weightage">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
              Assessment Weightage (100% Individual)
            </h3>
            <span className="text-xs text-[#6B6B6B]">
              Total: 100% · All individual assessments
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COURSE_CONFIG.assessments.map((item, aIdx) => (
              <div 
                key={aIdx} 
                className="bg-white border border-[#E5E5E5] rounded-lg p-3.5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#6B6B6B] mb-1">
                    <span>{item.title}</span>
                    <span className="font-mono text-base font-bold text-[#1A1A1A]">
                      {item.weight}%
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8A8A8A] mb-3">
                    {item.venue}
                  </div>
                </div>

                {/* Accent progress bar */}
                <div className="w-full bg-[#EFEFEF] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${item.weight * 2.5}%`,
                      backgroundColor: COURSE_CONFIG.accent 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Muted note */}
          <div className="mt-3 text-xs text-[#6B6B6B] italic">
            Schedule may change. Always check the LMS for updates.
          </div>
        </section>

        {/* 5. Footer (Dark rule above it) */}
        <footer className="mt-12 pt-8 border-t-2 border-[#1A1A1A]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Left: Square QR code block in accent colour */}
            <div 
              className="p-3 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: COURSE_CONFIG.accent }}
            >
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG
                  value={COURSE_CONFIG.lmsUrl}
                  size={105}
                  level="M"
                  marginSize={0}
                  fgColor="#1A1A1A"
                />
              </div>
              <span className="text-white font-mono font-bold text-xs tracking-wider mt-1.5">
                101MS3
              </span>
            </div>

            {/* Right: Module links and attribution */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <h4 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                Scan for the module page and all recordings
              </h4>
              
              <div>
                <a
                  href={COURSE_CONFIG.lmsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline inline-flex items-center gap-1 text-sm"
                  style={{ color: COURSE_CONFIG.accent }}
                >
                  <span>Mechanical Systems on LMS (D2L Brightspace)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="text-xs text-[#6B6B6B]">
                {COURSE_CONFIG.recordingsUrl ? (
                  <a href={COURSE_CONFIG.recordingsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    View Lecture Recordings
                  </a>
                ) : (
                  <span>Recordings: coming soon</span>
                )}
                <span className="mx-2">·</span>
                <a 
                  href={COURSE_CONFIG.driveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Reference Materials Drive
                </a>
              </div>

              <div className="pt-2 text-[11px] text-[#8A8A8A]">
                David Teo · <a href={`mailto:${COURSE_CONFIG.email}`} className="hover:underline">{COURSE_CONFIG.email}</a> · Ngee Ann Polytechnic · DCFM
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Action Button for Engineering Tools & AI Tutor (visible on all screens) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 print:hidden">
        <button
          onClick={() => onOpenLab('ieq')}
          className="px-3.5 py-2 rounded-full bg-white text-[#1A1A1A] font-medium text-xs shadow-lg border border-[#E5E5E5] hover:border-[#C8102E] flex items-center gap-2 hover:shadow-xl transition-all"
        >
          <GraduationCap className="w-4 h-4 text-[#C8102E]" />
          <span>Launch Lab Simulators</span>
        </button>

        <button
          onClick={() => onOpenAiChat()}
          className="px-4 py-2.5 rounded-full text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: COURSE_CONFIG.accent }}
        >
          <Bot className="w-4 h-4" />
          <span>Ask MechApp Studio AI</span>
        </button>
      </div>
    </div>
  );
};
