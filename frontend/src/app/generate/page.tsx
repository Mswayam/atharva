'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, generate } from '@/lib/api';

type GenerationType = 'complete' | 'story' | 'continue' | 'ending' | 'script' | 'expand' | 'tone' | 'custom';

const TONES = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'mysterious', label: 'Mysterious' },
  { value: 'scifi', label: 'Sci-Fi' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'horror', label: 'Horror' },
  { value: 'thriller', label: 'Thriller' },
];

export default function GeneratePage() {
  const router = useRouter();
  const [genType, setGenType] = useState<GenerationType>('complete');
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [tone, setTone] = useState('formal');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
      router.push('/login');
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() && !story.trim()) return;

    setLoading(true);
    setResult('');

    try {
      let response;

      switch (genType) {
        case 'complete':
          response = await generate.complete(story || prompt);
          setResult(response.completed_text);
          break;
        case 'story':
          response = await generate.story(prompt);
          setResult(response.generated_text);
          break;
        case 'continue':
          response = await generate.continue(story);
          setResult(response.continuation);
          break;
        case 'ending':
          response = await generate.ending(story);
          setResult(response.ending);
          break;
        case 'script':
          response = await generate.script(prompt);
          setResult(response.script);
          break;
        case 'expand':
          response = await generate.expand(prompt);
          setResult(response.expanded);
          break;
        case 'tone':
          response = await generate.transformTone(story, tone);
          setResult(response.transformed_text);
          break;
        case 'custom':
          response = await generate.custom(story, prompt);
          setResult(response.result);
          break;
      }

    } catch (error: any) {
      alert(error.response?.data?.error || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (genType) {
      case 'complete':
        return 'The sun rises with golden rays streaming through the window...';
      case 'story':
        return 'A detective discovers a hidden portal in an old library...';
      case 'continue':
        return 'Once upon a time in a small village...';
      case 'ending':
        return 'The hero finally reached the castle. The kingdom was at peace...';
      case 'script':
        return 'A dark alley, rain pouring down, mysterious figure appears...';
      case 'expand':
        return 'A girl discovers she has magical powers...';
      case 'tone':
        return 'Hey dude, what\'s up? Wanna hang out later?';
      case 'custom':
        return 'Enter your story/context here...';
      default:
        return 'Enter your text here...';
    }
  };

  const getInputLabel = () => {
    switch (genType) {
      case 'complete':
        return 'Continue this text (AI will fill missing parts)';
      case 'story':
      case 'script':
      case 'expand':
        return 'Story Prompt / Idea';
      case 'continue':
      case 'ending':
      case 'tone':
        return 'Your Text';
      case 'custom':
        return 'Original Text / Context';
      default:
        return 'Input';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="border-b border-[#27272a] bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Swayam AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => { auth.logout(); router.push('/login'); }}
              className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] rounded-lg transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Story Generator
          </h1>
          <p className="text-gray-400">Create, continue, and complete your stories with AI</p>
        </div>

        {/* Generation Type Selector */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {[
            { type: 'complete', label: '✨ Complete Text', icon: '✍️' },
            { type: 'story', label: '📖 New Story', icon: '📚' },
            { type: 'continue', label: '⏩ Continue', icon: '▶️' },
            { type: 'ending', label: '🏁 Ending', icon: '🎯' },
            { type: 'script', label: '🎬 Script', icon: '🎭' },
            { type: 'expand', label: '💡 Expand', icon: '💫' },
            { type: 'tone', label: '🎨 Tone', icon: '🖌️' },
            { type: 'custom', label: '🛠️ Custom Instruct', icon: '🧠' },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => { setGenType(item.type as GenerationType); setResult(''); }}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${genType === item.type
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-[#12121a] border border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white'
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Tone Selector (only show for tone transformation) */}
        {genType === 'tone' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tone === t.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-[#12121a] border border-[#27272a] text-gray-400 hover:border-[#3f3f46]'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-[#12121a] border border-[#27272a] rounded-2xl p-6 mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {getInputLabel()}
          </label>
          {(genType === 'continue' || genType === 'ending' || genType === 'tone' || genType === 'complete' || genType === 'custom') ? (
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full h-48 px-4 py-3 bg-[#0a0a0f] border border-[#27272a] rounded-xl focus:outline-none focus:border-indigo-500 resize-none text-white mb-4"
            />
          ) : (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full h-48 px-4 py-3 bg-[#0a0a0f] border border-[#27272a] rounded-xl focus:outline-none focus:border-indigo-500 resize-none text-white mb-4"
            />
          )}

          {genType === 'custom' && (
            <>
              <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
                Instruction / Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Please change the ending so the villain wins."
                className="w-full h-24 px-4 py-3 bg-[#0a0a0f] border border-[#27272a] rounded-xl focus:outline-none focus:border-indigo-500 resize-none text-white mb-4"
              />
            </>
          )}

          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-gray-500">
              {genType === 'complete'
                ? 'Give partial text and AI will complete it naturally'
                : genType === 'custom' ? 'AI will follow the custom instruction on the original text' : 'AI will generate content based on your input'}
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading || (!prompt.trim() && !story.trim())}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {genType === 'complete' ? 'Complete Text' : 'Generate'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-[#12121a] border border-[#27272a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-indigo-400">
                {genType === 'complete' ? '✨ Completed Text' : 'Generated Content'}
              </h3>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
            <div className="p-4 bg-[#0a0a0f] border border-[#27272a] rounded-xl">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{result}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
