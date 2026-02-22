import { Change } from '@/lib/api';

interface DiffViewerProps {
  original: string;
  modified: string;
  changes: Change[];
}

export default function DiffViewer({ original, modified, changes }: DiffViewerProps) {
  const renderDiff = () => {
    if (!changes.length) return null;

    const changeMap = new Map();
    changes.forEach(change => {
      if (change.original && change.modified) {
        changeMap.set(change.original.toLowerCase(), change);
      }
    });

    const originalWords = original.split(/(\s+)/);
    const modifiedWords = modified.split(/(\s+)/);

    return (
      <div className="flex gap-4 h-full">
        <div className="flex-1 p-4 bg-[#1a1a25] rounded-lg overflow-y-auto">
          <div className="text-sm text-[#64748b] mb-2">Original</div>
          <div className="font-mono text-base leading-7 text-[#f1f5f9] whitespace-pre-wrap">
            {originalWords.map((word, idx) => {
              const lowerWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
              const change = changeMap.get(lowerWord);
              
              if (change && change.type !== 'transition_addition') {
                return (
                  <span
                    key={idx}
                    className="bg-red-500/20 text-red-400 px-1 rounded"
                    title={`Will change to: ${change.modified}`}
                  >
                    {word}
                  </span>
                );
              }
              return <span key={idx}>{word}</span>;
            })}
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-[#1a1a25] rounded-lg overflow-y-auto">
          <div className="text-sm text-[#64748b] mb-2">Enhanced</div>
          <div className="font-mono text-base leading-7 text-[#f1f5f9] whitespace-pre-wrap">
            {modifiedWords.map((word, idx) => {
              const lowerWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
              const originalLower = original.toLowerCase();
              
              if (!originalLower.includes(lowerWord) && lowerWord.trim().length > 2) {
                return (
                  <span
                    key={idx}
                    className="bg-green-500/20 text-green-400 px-1 rounded"
                    title="Newly added"
                  >
                    {word}
                  </span>
                );
              }
              return <span key={idx}>{word}</span>;
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {changes.length > 0 ? (
        renderDiff()
      ) : (
        <div className="flex items-center justify-center h-full text-[#64748b]">
          Apply enhancements to see the diff
        </div>
      )}
    </div>
  );
}
