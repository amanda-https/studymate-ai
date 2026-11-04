'use client';

import React, { useState } from 'react';
import { StatusState, StudyNotesData } from '@/types';
import { fetchStudyChat } from '@/lib/api';
import { SAMPLE_PROMPTS, SUBJECT_OPTIONS, SamplePrompt } from '@/lib/sampleData';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { SampleChips } from '@/components/ui/SampleChips';
import { CopyButton } from '@/components/ui/CopyButton';
import { BookOpen, FileText, CheckCircle, Zap, RotateCcw } from 'lucide-react';

export const StudyNotesMode: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [simulateError, setSimulateError] = useState(false);
  const [status, setStatus] = useState<StatusState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [notes, setNotes] = useState<StudyNotesData | null>(null);

  const handleSubmit = async (overrideTopic?: string) => {
    const textToSubmit = overrideTopic || topic;
    if (!textToSubmit.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const data = await fetchStudyChat('notes', textToSubmit, {
        subject,
        simulateError,
      });
      setNotes(data);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate study notes.');
      setStatus('error');
    }
  };

  const handleSelectSample = (sample: SamplePrompt) => {
    setTopic(sample.query);
  };

  const handleReset = () => {
    setTopic('');
    setNotes(null);
    setStatus('idle');
    setErrorMsg('');
  };

  const formatNotesForClipboard = (data: StudyNotesData) => {
    return [
      `STUDY NOTES: ${data.topic.toUpperCase()}`,
      `Subject: ${data.subject}`,
      '',
      'EXECUTIVE SUMMARY:',
      data.executiveSummary,
      '',
      'KEY CONCEPTS & DEFINITIONS:',
      ...data.keyConcepts.map((c) => `• ${c.term}: ${c.definition}`),
      '',
      'CRITICAL POINTS:',
      ...data.bulletPoints.map((b) => `• ${b}`),
      '',
      'CHEAT SHEET / FORMULAS:',
      ...data.cheatSheet.map((cs) => `• ${cs}`),
    ].join('\n');
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Generate High-Yield Study Notes
            </h2>
            <p className="text-xs text-slate-500">
              Transform broad syllabus topics into condensed, exam-ready review sheets with definitions and cheat sheets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Subject:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={status === 'loading'}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={status === 'loading'}
              placeholder="e.g. Mendelian Genetics, Calculus Derivatives, Neural Networks, Macroeconomic policy..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>Enter a topic, chapter name, or core concept</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-700">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 text-xs"
                />
                <span>Simulate Error State</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <SampleChips
              prompts={SAMPLE_PROMPTS.notes}
              onSelect={handleSelectSample}
              disabled={status === 'loading'}
            />

            <button
              type="submit"
              disabled={!topic.trim() || status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>Create Notes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {status === 'loading' && <LoadingSkeleton modeName="Structured Study Notes" />}

      {/* Error State */}
      {status === 'error' && (
        <ErrorAlert message={errorMsg} onRetry={() => handleSubmit()} />
      )}

      {/* Results State */}
      {status === 'success' && notes && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {notes.subject}
                </span>
                <span className="text-xs text-slate-400">Revision Sheet</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{notes.topic}</h3>
            </div>

            <div className="flex items-center gap-2">
              <CopyButton
                textToCopy={formatNotesForClipboard(notes)}
                label="Copy Full Notes"
              />
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Start over"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm text-blue-950 leading-relaxed">
            <span className="font-bold block text-blue-900 mb-1">Executive Summary</span>
            {notes.executiveSummary}
          </div>

          {/* Key Concepts Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Key Concepts & Definitions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notes.keyConcepts.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1"
                >
                  <div className="text-xs font-bold text-slate-900">{item.term}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{item.definition}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Bullet Points */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              High-Yield Revision Points
            </h4>
            <ul className="space-y-2">
              {notes.bulletPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cheat Sheet & Formulas */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 sm:p-5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Quick Review Cheat Sheet
              </h4>
              <span className="text-[10px] text-slate-400">Exam-day formulas & rules</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
              {notes.cheatSheet.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-2.5 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
