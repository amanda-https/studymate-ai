import React from 'react';
import { Sparkles, GraduationCap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">StudyMate AI</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                Beta
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive 4-in-1 study studio: Q&A, Simplification, Quizzes & Structured Notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gemini 3.5 Flash-Lite</span>
          </div>
        </div>
      </div>
    </header>
  );
};
