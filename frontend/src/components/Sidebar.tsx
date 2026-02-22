import { useState } from 'react';

interface SidebarProps {
  onEnhance: (options: EnhancementOptions) => void;
  onStyleChange: (style: string, intensity: number) => void;
  onAnalyze: () => void;
  onCheckConsistency: () => void;
  onSave: () => void;
  isLoading: boolean;
}

interface EnhancementOptions {
  clarity: boolean;
  flow: boolean;
  structure: boolean;
}

const styles = [
  { id: 'formal', name: 'Formal', description: 'Professional & academic' },
  { id: 'casual', name: 'Casual', description: 'Friendly & conversational' },
  { id: 'creative', name: 'Creative', description: 'Expressive & vivid' },
  { id: 'technical', name: 'Technical', description: 'Precise & specialized' },
  { id: 'persuasive', name: 'Persuasive', description: 'Compelling & convincing' },
  { id: 'simple', name: 'Simple', description: 'Clear & straightforward' },
];

export default function Sidebar({ onEnhance, onStyleChange, onAnalyze, onCheckConsistency, onSave, isLoading }: SidebarProps) {
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    clarity: true,
    flow: true,
    structure: true,
  });
  const [selectedStyle, setSelectedStyle] = useState('formal');
  const [styleIntensity, setStyleIntensity] = useState(70);

  const handleEnhancementToggle = (key: keyof EnhancementOptions) => {
    setEnhancementOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEnhanceClick = () => {
    onEnhance(enhancementOptions);
  };

  const handleStyleApply = () => {
    onStyleChange(selectedStyle, styleIntensity / 100);
  };

  return (
    <div className="w-72 bg-[#12121a] border-r border-[#27272a] p-4 flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-4">Enhancements</h2>
        <div className="space-y-3">
          {Object.entries(enhancementOptions).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center justify-between p-3 bg-[#1a1a25] rounded-lg cursor-pointer hover:bg-[#222230] transition-colors"
            >
              <span className="text-sm text-[#f1f5f9] capitalize">{key}</span>
              <div
                className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-[#6366f1]' : 'bg-[#27272a]'}`}
                onClick={() => handleEnhancementToggle(key as keyof EnhancementOptions)}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </div>
            </label>
          ))}
          <button
            onClick={handleEnhanceClick}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Apply Enhancements'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-4">Style</h2>
        <div className="space-y-2 mb-4">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedStyle === style.id
                  ? 'bg-[#6366f1]/20 border border-[#6366f1]'
                  : 'bg-[#1a1a25] hover:bg-[#222230] border border-transparent'
              }`}
            >
              <div className="text-sm text-[#f1f5f9] font-medium">{style.name}</div>
              <div className="text-xs text-[#64748b]">{style.description}</div>
            </button>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-[#64748b] mb-2">
            <span>Intensity</span>
            <span>{styleIntensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={styleIntensity}
            onChange={(e) => setStyleIntensity(Number(e.target.value))}
            className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
          />
        </div>
        <button
          onClick={handleStyleApply}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Apply Style'}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-4">Analysis</h2>
        <div className="space-y-2">
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="w-full py-3 bg-[#1a1a25] text-[#f1f5f9] rounded-lg font-medium hover:bg-[#222230] transition-colors disabled:opacity-50"
          >
            Analyze Text
          </button>
          <button
            onClick={onCheckConsistency}
            disabled={isLoading}
            className="w-full py-3 bg-[#1a1a25] text-[#f1f5f9] rounded-lg font-medium hover:bg-[#222230] transition-colors disabled:opacity-50"
          >
            Check Consistency
          </button>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="w-full py-3 bg-[#10b981] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Save Document
        </button>
      </div>
    </div>
  );
}
