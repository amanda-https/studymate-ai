'use client';

import React, { useState } from 'react';
import { StatusState, SimpleExplanationData } from '@/types';
import { fetchStudyChat } from '@/lib/api';
import { SAMPLE_PROMPTS, SamplePrompt } from '@/lib/sampleData';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { SampleChips } from '@/components/ui/SampleChips';
import { CopyButton } from '@/components/ui/CopyButton';
import { Lightbulb, Smile, BookOpen, Layers, Sparkles, Send, RotateCcw } from 'lucide-react';

export const ExplainSimplyMode: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [audienceLevel, setAudienceLevel] = useState<'beginner' | 'everyday' | 'highschool'>('everyday');
  const [simulateError, setSimulateError] = useState(false);
  const [status, setStatus] = useState<StatusState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<SimpleExplanationData | null>(null);

  const handleSubmit = async (overrideTopic?: string) => {
    const textToSubmit = overrideTopic || topic;
    if (!textToSubmit.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const data = await fetchStudyChat('explain', textToSubmit, {
        audienceLevel,
        simulateError,
      });
      setResult(data);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate simplified explanation.');
      setStatus('error');
    }
  };

  const handleSelectSample = (sample: SamplePrompt) => {
    setTopic(sample.query);
  };

  const handleReset = () => {
    setTopic('');
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Explain Simply (EL5)
            </h2>
            <p className="text-xs text-slate-500">
              Break down complex, intimidating ideas into intuitive metaphors and everyday language.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Simplicity:</span>
            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200/60">
              {(
                [
                  { id: 'beginner', label: 'Child (EL5)' },
                  { id: 'everyday', label: 'Everyday' },
                  { id: 'highschool', label: 'High School' },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setAudienceLevel(lvl.id)}
                  disabled={status === 'loading'}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    audienceLevel === lvl.id
                      ? 'bg-white text-amber-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
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
              placeholder="e.g. Quantum Computing, Black Holes, Inflation, Blockchain..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>Enter any complex subject or concept</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-700">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 text-xs"
                />
                <span>Simulate Error State</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <SampleChips
              prompts={SAMPLE_PROMPTS.explain}
              onSelect={handleSelectSample}
              disabled={status === 'loading'}
            />

            <button
              type="submit"
              disabled={!topic.trim() || status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm shadow-sm shadow-amber-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Simplify This</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {status === 'loading' && <LoadingSkeleton modeName="Plain-Language Breakdown" />}

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
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {result.audienceLevel.toUpperCase()} LEVEL
                </span>
                <span className="text-xs text-slate-400">Jargon-Free Breakdown</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{result.topic}</h3>
            </div>

            <div className="flex items-center gap-2">
              <CopyButton
                textToCopy={`${result.topic} Explained Simply:\n\n${result.coreConcept}\n\nAnalogy: ${result.metaphor.title}\n${result.metaphor.description}\n\nSteps:\n${result.stepByStep.join('\n')}`}
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

          {/* Core Concept Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-800 leading-relaxed">
            {result.coreConcept}
          </div>

          {/* Metaphor / Analogy Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 md:p-6 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Smile className="w-4 h-4 text-amber-600" />
              <span>{result.metaphor.title}</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {result.metaphor.description}
            </p>
          </div>

          {/* Step by step */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              How It Works (Step by Step)
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {result.stepByStep.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs sm:text-sm text-slate-700"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Takeaways */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              Quick Takeaway
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {result.takeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
