'use client';

import { useState } from 'react';
import { Change, ConsistencyIssue } from '@/lib/api';

interface ExplanationPanelProps {
  changes: Change[];
  consistencyIssues?: ConsistencyIssue[];
  analysisMetrics?: any;
}

const categoryIcons: Record<string, string> = {
  clarity: '💡',
  flow: '🌊',
  structure: '📐',
  style_modification: '🎨',
  consistency: '🔄',
};

const severityColors = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function ExplanationPanel({ changes, consistencyIssues = [], analysisMetrics }: ExplanationPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {analysisMetrics && (
        <div className="mb-6 p-4 bg-[#1a1a25] rounded-lg">
          <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">Analysis Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[#64748b]">Words</div>
              <div className="text-lg text-[#f1f5f9]">{analysisMetrics.word_count}</div>
            </div>
            <div>
              <div className="text-xs text-[#64748b]">Sentences</div>
              <div className="text-lg text-[#f1f5f9]">{analysisMetrics.sentence_count}</div>
            </div>
            <div>
              <div className="text-xs text-[#64748b]">Paragraphs</div>
              <div className="text-lg text-[#f1f5f9]">{analysisMetrics.paragraph_count}</div>
            </div>
            <div>
              <div className="text-xs text-[#64748b]">Reading Time</div>
              <div className="text-lg text-[#f1f5f9]">{analysisMetrics.reading_time_minutes?.toFixed(1)}m</div>
            </div>
          </div>
          {analysisMetrics.readability && (
            <div className="mt-3 pt-3 border-t border-[#27272a]">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Grade Level:</span>
              </div>
              <div className="text-[#6366f1] font-medium">{analysisMetrics.readability.grade_level}</div>
            </div>
          )}
        </div>
      )}

      {consistencyIssues.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">Consistency Issues</h3>
          <div className="space-y-2">
            {consistencyIssues.map((issue, idx) => (
              <div
                key={`consistency-${idx}`}
                className={`p-3 rounded-lg border ${severityColors[issue.severity]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{issue.type.replace(/_/g, ' ')}</div>
                    <div className="text-xs mt-1 opacity-80">{issue.message}</div>
                    {issue.suggestion && (
                      <div className="text-xs mt-2 text-[#a78bfa]">💡 {issue.suggestion}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">
          Changes ({changes.length})
        </h3>
        <div className="space-y-2">
          {changes.map((change) => (
            <div
              key={change.id || Math.random().toString()}
              className="bg-[#1a1a25] rounded-lg border border-[#27272a] overflow-hidden"
            >
              <div
                className="p-3 cursor-pointer hover:bg-[#222230] transition-colors"
                onClick={() => setExpandedId(expandedId === change.id ? null : (change.id || null))}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {categoryIcons[change.category || ''] || '📝'}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#f1f5f9] font-medium capitalize">
                        {change.type.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${(change.confidence ?? 0) >= 0.9
                        ? 'bg-green-500/20 text-green-400'
                        : (change.confidence ?? 0) >= 0.75
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                        }`}>
                        {Math.round((change.confidence ?? 0) * 100)}%
                      </span>
                    </div>
                    {change.original && change.modified && (
                      <div className="text-xs text-[#64748b] mt-1">
                        <span className="text-red-400 line-through">{change.original}</span>
                        {' → '}
                        <span className="text-green-400">{change.modified}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {expandedId === change.id && (
                <div className="px-3 pb-3 border-t border-[#27272a]">
                  <div className="pt-3 space-y-2">
                    <div>
                      <div className="text-xs text-[#64748b]">Explanation</div>
                      <div className="text-sm text-[#f1f5f9]">{change.explanation}</div>
                    </div>
                    {change.category && (
                      <div>
                        <div className="text-xs text-[#64748b]">Category</div>
                        <div className="text-sm text-[#a78bfa] capitalize">{change.category.replace(/_/g, ' ')}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {changes.length === 0 && (
            <div className="text-center text-[#64748b] py-8">
              No changes applied yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
