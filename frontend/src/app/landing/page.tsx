'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[#27272a]' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
            Swayam
          </h1>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">Pricing</Link>
            <Link href="/editor" className="px-5 py-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#8b5cf6]/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6366f1]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8b5cf6]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-full text-[#a78bfa] text-sm mb-6">
            AI-Powered Writing Assistant
          </div>
          <h1 className="text-6xl font-bold text-[#f1f5f9] mb-6 leading-tight">
            Transform Your Writing with{' '}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              Intelligent AI
            </span>
          </h1>
          <p className="text-xl text-[#94a3b8] mb-10 max-w-2xl mx-auto">
            Enhance your content with narrative consistency tracking, style transformation, 
            and explainable AI suggestions. Write better, faster.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/editor" className="px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#6366f1]/25">
              Start Writing Free
            </Link>
            <button className="px-8 py-4 bg-[#1a1a25] border border-[#27272a] text-[#f1f5f9] rounded-xl font-semibold text-lg hover:bg-[#222230] transition-colors">
              Watch Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f1f5f9]">10K+</div>
              <div className="text-[#64748b] mt-1">Documents Enhanced</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f1f5f9]">50+</div>
              <div className="text-[#64748b] mt-1">Writing Styles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f1f5f9]">99%</div>
              <div className="text-[#64748b] mt-1">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#f1f5f9] mb-4">Powerful Features</h2>
            <p className="text-[#94a3b8] text-lg">Everything you need to elevate your writing</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                icon: '🔄',
                title: 'Narrative Consistency',
                description: 'Track entities, pronouns, and tense across your entire document for seamless flow.'
              },
              {
                icon: '💡',
                title: 'Content Enhancement',
                description: 'Improve clarity, flow, and structure with AI-powered suggestions.'
              },
              {
                icon: '🎨',
                title: 'Style Transformation',
                description: 'Switch between Formal, Casual, Creative, Technical, Persuasive, and Simple styles.'
              },
              {
                icon: '📊',
                title: 'Readability Analysis',
                description: 'Get detailed metrics on readability scores and grade levels.'
              },
              {
                icon: '✨',
                title: 'Explainable AI',
                description: 'Every change comes with clear explanations so you understand the improvements.'
              },
              {
                icon: '📝',
                title: 'Document History',
                description: 'Save and track all your documents with version history.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-[#1a1a25] rounded-2xl border border-[#27272a] hover:border-[#6366f1]/50 transition-colors group">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#f1f5f9] mb-2">{feature.title}</h3>
                <p className="text-[#94a3b8]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#f1f5f9] mb-4">How It Works</h2>
            <p className="text-[#94a3b8] text-lg">Three simple steps to better writing</p>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Write or Paste', description: 'Enter your text in our intuitive editor' },
              { step: '02', title: 'Apply Enhancements', description: 'Choose from clarity, flow, or structure improvements' },
              { step: '03', title: 'Review & Save', description: 'See changes with explanations and save your work' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-8xl font-bold text-[#6366f1]/10 absolute -top-4 -left-2">{item.step}</div>
                <div className="relative z-10 pt-12">
                  <h3 className="text-xl font-semibold text-[#f1f5f9] mb-2">{item.title}</h3>
                  <p className="text-[#94a3b8]">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-[#12121a] to-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#f1f5f9] mb-4">Ready to Transform Your Writing?</h2>
          <p className="text-[#94a3b8] text-lg mb-8">Join thousands of writers using Swayam to create better content</p>
          <Link href="/editor" className="inline-block px-10 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#6366f1]/25">
            Get Started Now — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#27272a]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              Swayam
            </h1>
            <span className="text-[#64748b] text-sm">AI-Powered Writer</span>
          </div>
          <div className="flex items-center gap-6 text-[#64748b]">
            <a href="#" className="hover:text-[#f1f5f9] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#f1f5f9] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#f1f5f9] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
