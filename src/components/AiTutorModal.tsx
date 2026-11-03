/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  HelpCircle, 
  RotateCcw,
  BookOpen,
  Award
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnXp?: (xp: number, badgeTitle?: string) => void;
  initialPrompt?: string;
}

const PRESET_PROMPTS = [
  'How do pump affinity laws save 48.8% power when speed drops 20%?',
  'Why are fire dampers strictly prohibited in kitchen exhaust ducts?',
  'Explain Mode 1, Mode 2, and Mode 3 water supply under SS 636.',
  'What are the 5 causes of sanitary trap water seal loss?',
  'Explain chiller surge and how hot gas bypass and CHWST reset prevent it.',
  'What is the 5-step starting sequence for a water-cooled chiller plant?',
  'Calculate SS 553 ventilation for a 10m × 5m × 3m public toilet.',
];

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose, onEarnXp, initialPrompt }) => {
  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt, isOpen]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `### Welcome to MechApp Studio AI! 👋
I am your **Mech for FM AI** Tutor & Building Services Consultant, grounded on the **Diploma in Facilities Management (DCFM / 101MS3)** curriculum (David Teo, Ngee Ann Polytechnic).

I explain commercial building mechanical services—including chillers, cooling towers, mechanical ventilation (SS 553), sanitary plumbing, water supply (SS 636), fire protection (Fire Code 2023), and town gas—using clear step-by-step logic and the **COSTAR** framework.

How can I help you understand your plant room or exam problems today? Pick a quick topic below or type your question!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [singlishMode, setSinglishMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          singlishMode,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (onEarnXp) {
          onEarnXp(20);
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        text: `The AI Tutor isn't available on this version of the site. It needs the AI Studio server to reach Gemini. Everything else in the app works here, and you can use the AI Tutor in the AI Studio version of the app.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed z-50 transition-all ${
        isMinimized
          ? 'bottom-4 right-4 w-72'
          : 'bottom-4 right-4 w-[92vw] sm:w-[480px] md:w-[540px] h-[640px] max-h-[88vh]'
      } flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden`}
    >
      {/* Header Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">
                MechApp Studio AI
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                COSTAR
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              Module: 013621 / 101MS3 (DCFM)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Singlish / Local Mode Toggle */}
          <button
            onClick={() => setSinglishMode(!singlishMode)}
            title="Toggle Singapore practical/local analogies mode"
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
              singlishMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {singlishMode ? '🇸🇬 Local FM' : 'Formal FM'}
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white font-medium rounded-tr-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                  <div
                    className={`text-[9px] mt-1.5 font-mono ${
                      msg.role === 'user' ? 'text-cyan-200 text-right' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-400 font-mono">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>MechApp Studio AI is consulting DCFM knowledge base...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Carousel */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 overflow-x-auto flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-mono shrink-0">Topics:</span>
            {PRESET_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md whitespace-nowrap border border-slate-800 shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask any mechanical systems or code question..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
            <button
              disabled={!inputText.trim() || isLoading}
              onClick={() => handleSendMessage()}
              className="p-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
