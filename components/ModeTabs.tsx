import React from 'react';
import { StudyMode } from '@/types';
import { MessageSquareText, Lightbulb, CheckSquare, BookOpen } from 'lucide-react';

interface ModeTabsProps {
  activeMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
}

export const ModeTabs: React.FC<ModeTabsProps> = ({ activeMode, onSelectMode }) => {
  const tabs: { id: StudyMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'ask',
      label: 'Ask AI',
      desc: 'Academic Q&A',
      icon: <MessageSquareText className="w-4 h-4" />,
    },
    {
      id: 'explain',
      label: 'Explain Simply',
      desc: 'EL5 & Analogies',
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: 'quiz',
      label: 'Generate Quiz',
      desc: 'Interactive Test',
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      id: 'notes',
      label: 'Study Notes',
      desc: 'Structured Summary',
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-xs mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectMode(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50'
                  : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.icon}
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {tab.label}
                </div>
                <div className={`text-[11px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {tab.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
