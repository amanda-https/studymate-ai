import React from 'react';
import { SamplePrompt } from '@/lib/sampleData';
import { Sparkles } from 'lucide-react';

interface SampleChipsProps {
  prompts: SamplePrompt[];
  onSelect: (prompt: SamplePrompt) => void;
  disabled?: boolean;
}

export const SampleChips: React.FC<SampleChipsProps> = ({ prompts, onSelect, disabled }) => {
  return (
    <div className="pt-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span className="font-medium">Or try an example topic:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(p)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 border border-slate-200/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
