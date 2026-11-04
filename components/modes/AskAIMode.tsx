'use client';

import React, { useState } from 'react';
import { StatusState, AskAIResultData } from '@/types';
import { fetchStudyChat } from '@/lib/api';
import { SAMPLE_PROMPTS, SUBJECT_OPTIONS, SamplePrompt } from '@/lib/sampleData';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { SampleChips } from '@/components/ui/SampleChips';
import { CopyButton } from '@/components/ui/CopyButton';
import { Send, Sparkles, BookOpen, ArrowRight, CornerDownRight, RotateCcw } from 'lucide-react';

export const AskAIMode: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [simulateError, setSimulateError] = useState(false);
  const [status, setStatus] = useState<StatusState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<AskAIResultData | null>(null);

  const handleSubmit = async (overridePrompt?: string, overrideSubject?: string) => {
    const textToSubmit = overridePrompt || prompt;
    const subToSubmit = overrideSubject || subject;

    if (!textToSubmit.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const data = await fetchStudyChat('ask', textToSubmit, {
        subject: subToSubmit,
        simulateError,
      });
      setResult(data);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };

  const handleSelectSample = (sample: SamplePrompt) => {
    setPrompt(sample.query);
    if (sample.subject) {
      setSubject(sample.subject);
    }
  };

  const handleFollowUpClick = (followUp: string) => {
    setPrompt(followUp);
    handleSubmit(followUp, subject);
  };

  const handleReset = () => {
    setPrompt('');
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              Ask Academic AI
            </h2>
            <p className="text-xs text-slate-500">
              Get detailed, context-rich answers, foundational theory, and suggested follow-ups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Subject:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={status === 'loading'}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={status === 'loading'}
              rows={3}
              placeholder="e.g. Can you explain Newton's three laws of motion and provide a real-life example for each?"
              className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>{prompt.length} characters</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-700">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 text-xs"
                />
                <span>Simulate Error State</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <SampleChips
              prompts={SAMPLE_PROMPTS.ask}
              onSelect={handleSelectSample}
              disabled={status === 'loading'}
            />

            <button
              type="submit"
              disabled={!prompt.trim() || status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {status === 'loading' && <LoadingSkeleton modeName="Academic Analysis" />}

      {/* Error State */}
      {status === 'error' && (
        <ErrorAlert message={errorMsg} onRetry={() => handleSubmit()} />
      )}

      {/* Results State */}
      {status === 'success' && result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {result.subject}
                </span>
                <span className="text-xs text-slate-400">Verified Concept</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{result.topic}</h3>
            </div>

            <div className="flex items-center gap-2">
              <CopyButton
                textToCopy={`${result.topic}\n\n${result.directAnswer}\n\nKey Takeaways:\n${result.keyTakeaways.join('\n')}`}
              />
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Clear and ask new question"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formatted Answer */}
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-line">
            {result.directAnswer}
          </div>

          {/* Key Takeaways */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-900 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Key Takeaways
            </h4>
            <ul className="space-y-1.5">
              {result.keyTakeaways.map((point, index) => (
                <li key={index} className="text-xs text-indigo-950 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Follow-ups */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3 flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
              Suggested Deep-Dive Follow-ups
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {result.suggestedFollowUps.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFollowUpClick(question)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 text-left transition-all text-xs font-medium text-slate-700 group"
                >
                  <span>{question}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
