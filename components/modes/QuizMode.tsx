'use client';

import React, { useState } from 'react';
import { StatusState, QuizResultData } from '@/types';
import { fetchStudyChat } from '@/lib/api';
import { SAMPLE_PROMPTS, SamplePrompt } from '@/lib/sampleData';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { SampleChips } from '@/components/ui/SampleChips';
import { CheckSquare, CheckCircle2, XCircle, RotateCcw, Award, Sparkles, PlusCircle } from 'lucide-react';

export const QuizMode: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [simulateError, setSimulateError] = useState(false);
  const [status, setStatus] = useState<StatusState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [quizData, setQuizData] = useState<QuizResultData | null>(null);

  // Map of questionId -> selectedOptionIndex
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const handleSubmit = async (overrideTopic?: string) => {
    const textToSubmit = overrideTopic || topic;
    if (!textToSubmit.trim()) return;

    setStatus('loading');
    setErrorMsg('');
    setUserAnswers({});

    try {
      const data = await fetchStudyChat('quiz', textToSubmit, {
        simulateError,
      });
      setQuizData(data);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate quiz.');
      setStatus('error');
    }
  };

  const handleSelectSample = (sample: SamplePrompt) => {
    setTopic(sample.query);
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    // Only allow selection if not already answered
    if (userAnswers[questionId] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleRetakeQuiz = () => {
    setUserAnswers({});
  };

  const handleReset = () => {
    setTopic('');
    setQuizData(null);
    setUserAnswers({});
    setStatus('idle');
    setErrorMsg('');
  };

  // Compute current score
  const totalQuestions = quizData?.questions.length || 0;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount =
    quizData?.questions.reduce((acc, q) => {
      return userAnswers[q.id] === q.correctAnswerIndex ? acc + 1 : acc;
    }, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Generate Interactive Quiz
            </h2>
            <p className="text-xs text-slate-500">
              Create dynamic multiple-choice questions with instant scoring, feedback, and explanations.
            </p>
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
              placeholder="e.g. Mitosis & Meiosis, Calculus Integrals, World War II turning points..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>Generate active recall questions on any topic</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-700">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 text-xs"
                />
                <span>Simulate Error State</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <SampleChips
              prompts={SAMPLE_PROMPTS.quiz}
              onSelect={handleSelectSample}
              disabled={status === 'loading'}
            />

            <button
              type="submit"
              disabled={!topic.trim() || status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Generate Quiz</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {status === 'loading' && <LoadingSkeleton modeName="Assessment Quiz" />}

      {/* Error State */}
      {status === 'error' && (
        <ErrorAlert message={errorMsg} onRetry={() => handleSubmit()} />
      )}

      {/* Results State */}
      {status === 'success' && quizData && (
        <div className="space-y-6">
          {/* Quiz Header & Live Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ACTIVE RECALL
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{quizData.topic}</h3>
              <p className="text-xs text-slate-500">
                Select an answer for each question to see immediate feedback.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-4 py-2 rounded-xl text-center">
                <Award className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <div className="text-xs text-emerald-700 font-medium">Your Score</div>
                  <div className="text-base font-extrabold text-emerald-900">
                    {correctCount} / {totalQuestions}
                    <span className="text-xs font-normal text-emerald-700 ml-1">
                      ({answeredCount > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRetakeQuiz}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Retake Quiz"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="New Topic"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {quizData.questions.map((q, qIndex) => {
              const selectedAnswer = userAnswers[q.id];
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = isAnswered && selectedAnswer === q.correctAnswerIndex;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-5 md:p-6 transition-all shadow-xs ${
                    isAnswered
                      ? isCorrect
                        ? 'border-emerald-300 ring-1 ring-emerald-200'
                        : 'border-rose-300 ring-1 ring-rose-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Question {qIndex + 1} of {totalQuestions}
                    </span>
                    {isAnswered && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-4">
                    {q.question}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedAnswer === optIndex;
                      const isThisCorrect = q.correctAnswerIndex === optIndex;

                      let buttonStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                      if (isAnswered) {
                        if (isThisCorrect) {
                          buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium';
                        } else if (isOptionSelected && !isThisCorrect) {
                          buttonStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                        } else {
                          buttonStyle = 'border-slate-100 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={isAnswered}
                          onClick={() => handleAnswerSelect(q.id, optIndex)}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all ${buttonStyle}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                              isAnswered && isThisCorrect
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : isAnswered && isOptionSelected
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation reveal */}
                  {isAnswered && (
                    <div
                      className={`mt-4 p-3.5 rounded-xl text-xs leading-relaxed border ${
                        isCorrect
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-slate-900">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        Explanation:
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
