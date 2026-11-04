'use client';

import React, { useState } from 'react';
import { StudyMode } from '@/types';
import { Header } from '@/components/Header';
import { ModeTabs } from '@/components/ModeTabs';
import { AskAIMode } from '@/components/modes/AskAIMode';
import { ExplainSimplyMode } from '@/components/modes/ExplainSimplyMode';
import { QuizMode } from '@/components/modes/QuizMode';
import { StudyNotesMode } from '@/components/modes/StudyNotesMode';

export default function Home() {
  const [activeMode, setActiveMode] = useState<StudyMode>('ask');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ModeTabs activeMode={activeMode} onSelectMode={setActiveMode} />

        <div className="transition-all duration-200">
          {activeMode === 'ask' && <AskAIMode />}
          {activeMode === 'explain' && <ExplainSimplyMode />}
          {activeMode === 'quiz' && <QuizMode />}
          {activeMode === 'notes' && <StudyNotesMode />}
        </div>
      </div>
    </div>
  );
}
