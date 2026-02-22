import { useState, useEffect } from 'react';
import { analyzeText, enhanceText, applyStyle, checkConsistency, saveDocument, type EnhancementResult, type StyleResult, type ConsistencyResult } from '@/lib/api';

interface EditorProps {
  text: string;
  onChange: (text: string) => void;
  enhancedText?: string;
  showDiff?: boolean;
}

export default function Editor({ text, onChange, enhancedText, showDiff = false }: EditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setCharCount(text.length);
  }, [text]);

  return (
    <div className="flex flex-col h-full bg-[#12121a] rounded-xl border border-[#27272a] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a25] border-b border-[#27272a]">
        <span className="text-sm text-[#64748b]">
          {showDiff ? 'Original Text' : 'Editor'}
        </span>
        <div className="flex gap-4 text-xs text-[#64748b]">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing or paste your text here..."
        className="flex-1 w-full p-4 bg-transparent text-[#f1f5f9] font-mono text-base leading-7 resize-none focus:outline-none placeholder:text-[#64748b]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      />
    </div>
  );
}
