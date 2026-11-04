import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSkeletonProps {
  modeName?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ modeName = 'Content' }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    `Analyzing topic parameters...`,
    `Structuring clear ${modeName.toLowerCase()}...`,
    `Verifying clarity and pedagogical flow...`,
    `Finalizing interactive layout...`,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs animate-pulse-subtle">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">Generating with StudyMate AI</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
          </div>
          <p className="text-xs text-indigo-600 font-medium transition-all duration-300">
            {steps[stepIndex]}
          </p>
        </div>
      </div>

      {/* Shimmer skeleton lines */}
      <div className="space-y-4">
        <div className="h-6 bg-slate-200/70 rounded-md w-3/4"></div>
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          <div className="h-4 bg-slate-100 rounded w-4/6"></div>
        </div>

        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-20 bg-slate-100/80 rounded-xl p-3 border border-slate-100"></div>
          <div className="h-20 bg-slate-100/80 rounded-xl p-3 border border-slate-100"></div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="h-3 bg-slate-100 rounded w-32"></div>
          <div className="h-8 bg-slate-100 rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  );
};
