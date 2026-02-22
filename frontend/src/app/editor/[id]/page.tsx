'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { auth, sessions, paragraphs, AnalysisResult, Enhancement } from '@/lib/api';

interface SessionData {
  id: number;
  title: string;
  paragraphs: any[];
  enhancements?: any[];
}

export default function EditorPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const sessionId = params?.id ? Number(params.id) : 0;
  
  const [session, setSession] = useState<SessionData | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedParaId, setSelectedParaId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const data = await sessions.getReport(sessionId);
      setSession(data.session);
    } catch (error) {
      console.error('Failed to load session');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const addParagraph = async () => {
    if (!content.trim()) return;
    
    try {
      await paragraphs.add(sessionId, content);
      setContent('');
      loadSession();
    } catch (error) {
      console.error('Failed to add paragraph');
    }
  };

  const enhanceParagraph = async (paragraphId: number) => {
    setAnalyzing(true);
    setSelectedParaId(paragraphId);
    try {
      const result = await paragraphs.enhance(paragraphId);
      setAnalysisResult(result.ml_result);
      loadSession();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to analyze paragraph');
    } finally {
      setAnalyzing(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30',
      sadness: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
      anger: 'from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30',
      fear: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
      surprise: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
      disgust: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
      neutral: 'from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[emotion?.toLowerCase()] || colors.neutral;
  };

  const getDriftColor = (score: number) => {
    if (score < 0.25) return { text: 'text-green-400', bg: 'bg-green-500/20', label: 'Low' };
    if (score < 0.5) return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Medium' };
    return { text: 'text-red-400', bg: 'bg-red-500/20', label: 'High' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="border-b border-[#27272a] bg-[#12121a]">
        <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <div className="h-6 w-px bg-[#27272a]"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold">{session?.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showHistory ? 'bg-indigo-500 text-white' : 'bg-[#27272a] hover:bg-[#3f3f46]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Editor */}
        <div className="w-1/2 border-r border-[#27272a] flex flex-col">
          {/* Write Section */}
          <div className="p-6 border-b border-[#27272a]">
            <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Write</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text here to analyze and enhance..."
              className="w-full h-32 px-4 py-3 bg-[#12121a] border border-[#27272a] rounded-xl focus:outline-none focus:border-indigo-500 resize-none text-base"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={addParagraph}
                disabled={!content.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Paragraph
              </button>
            </div>
          </div>

          {/* Paragraphs List */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Paragraphs ({session?.paragraphs.length || 0})
            </h2>
            {session?.paragraphs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#12121a] flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No paragraphs yet</p>
                <p className="text-gray-600 text-sm mt-1">Add your first paragraph above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {session?.paragraphs.map((para: any, index: number) => (
                  <div
                    key={para.id}
                    className={`bg-[#12121a] border rounded-xl p-4 transition-all cursor-pointer ${
                      selectedParaId === para.id 
                        ? 'border-indigo-500 ring-1 ring-indigo-500/30' 
                        : 'border-[#27272a] hover:border-[#3f3f46]'
                    }`}
                    onClick={() => para.drift_score && setAnalysisResult({
                      drift_score: para.drift_score,
                      consistency_score: 0.85,
                      emotion: 'neutral',
                      readability_before: 60,
                      readability_after: 70,
                      enhanced_text: '',
                      explanation: ''
                    })}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-gray-500">Paragraph {index + 1}</span>
                      {para.drift_score !== null && (
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                          getDriftColor(para.drift_score).bg + ' ' + getDriftColor(para.drift_score).text
                        }`}>
                          {getDriftColor(para.drift_score).label} Drift
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">{para.content}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        enhanceParagraph(para.id);
                      }}
                      disabled={analyzing}
                      className="w-full py-2 bg-[#27272a] hover:bg-[#3f3f46] rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {analyzing && selectedParaId === para.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Analyze & Enhance
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Analysis */}
        <div className="w-1/2 overflow-y-auto">
          {analysisResult ? (
            <div className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#12121a] border border-[#27272a] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Drift Score</span>
                  </div>
                  <p className={`text-3xl font-bold ${getDriftColor(analysisResult.drift_score).text}`}>
                    {(analysisResult.drift_score * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Deviation from baseline</p>
                </div>

                <div className="bg-[#12121a] border border-[#27272a] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Consistency</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">
                    {(analysisResult.consistency_score * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Text coherence</p>
                </div>

                <div className="bg-[#12121a] border border-[#27272a] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Emotion</span>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium border bg-gradient-to-r ${getEmotionColor(analysisResult.emotion)}`}>
                    {analysisResult.emotion}
                  </span>
                </div>

                <div className="bg-[#12121a] border border-[#27272a] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Readability</span>
                  </div>
                  <p className="text-xl font-bold text-green-400">
                    {analysisResult.readability_before.toFixed(0)} → {analysisResult.readability_after.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Flesch Reading Ease</p>
                </div>
              </div>

              {/* Enhanced Text */}
              {analysisResult.enhanced_text && (
                <div className="bg-[#12121a] border border-[#27272a] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold">Enhanced Text</h3>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-gray-200 whitespace-pre-wrap">{analysisResult.enhanced_text}</p>
                  </div>
                </div>
              )}

              {/* Explanation */}
              {analysisResult.explanation && (
                <div className="bg-[#12121a] border border-[#27272a] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold">Analysis Explanation</h3>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">{analysisResult.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#12121a] flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Add a paragraph and click "Analyze & Enhance" to see detailed insights about your writing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
