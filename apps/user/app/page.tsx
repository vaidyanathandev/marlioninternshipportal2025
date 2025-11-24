import Link from 'next/link';
import { Button } from '@marlion/ui';
import { Countdown } from '../components/Countdown';
import { StreamCard } from '../components/StreamCard';
import { AIChat } from '../components/AIChat';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-slate-100">MARLION</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register Now</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm text-slate-300">
            <span className="font-semibold text-green-400">WINTER INTERNSHIP 2025</span>
            <span className="mx-2">·</span>
            <span className="text-slate-400">Deadline: 30 Nov</span>
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Build the Future with{' '}
          <span className="gradient-text">Marlion Tech</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto">
          A hands-on immersive experience in Madurai focused on{' '}
          <span className="text-blue-400 font-semibold">Assistive Tech & IEP</span>{' '}
          for Neurodiverse Children. Master AI, XR, and Full Stack development.
        </p>

        {/* Countdown */}
        <div className="mb-12">
          <Countdown />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Apply Now
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Button>
          </Link>
          <Button size="lg" variant="secondary" className="gap-2">
            Explore Streams
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </Button>
        </div>
      </section>

      {/* CEO Message Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-surface rounded-2xl border border-slate-800 overflow-hidden">
            <div className="aspect-video bg-slate-900 flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <button className="relative z-10 w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center group-hover:scale-110">
                <svg
                  className="w-10 h-10 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-6 z-10">
                <p className="text-white text-lg font-semibold">MESSAGE FROM THE CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streams Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Select a specialized stream to view the curriculum and prerequisites.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <StreamCard
            title="Immersive Tech (AR/VR)"
            subtitle="Open for Registration"
            icon={
              <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            description="Build immersive XR experiences for assistive learning. Work with Unity, Unreal Engine, and WebXR to create accessible virtual environments for neurodiverse children."
          />

          <StreamCard
            title="Full Stack Apps"
            subtitle="Open for Registration"
            icon={
              <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
            description="Develop full-stack web applications focused on accessibility. Master React, Next.js, Node.js, and databases while building tools for individualized education programs (IEP)."
          />

          <StreamCard
            title="Agentic AI"
            subtitle="Open for Registration"
            icon={
              <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            description="Design and build autonomous AI agents that assist educators and therapists. Learn LLMs, agent frameworks, and prompt engineering for personalized learning assistance."
          />

          <StreamCard
            title="Data Science (AI & ML)"
            subtitle="Open for Registration"
            icon={
              <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            description="Apply machine learning and data analytics to understand learning patterns. Build predictive models and visualization tools to optimize educational outcomes for children with special needs."
          />
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-slate-100 mb-4">
            Have questions? Just ask.
          </h2>
          <p className="text-slate-400">
            No FAQs here. Our AI agent is trained on all internship details.
          </p>
        </div>

        <AIChat />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-surface/50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-xl font-bold text-slate-100">Marlion</span>
              </div>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:social@marliontech.com" className="hover:text-blue-400 transition-colors">
                    social@marliontech.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91 94867 34438</span>
                </div>
              </div>
            </div>

            {/* Office Location */}
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Office Location
              </h3>
              <address className="text-slate-400 not-italic">
                A-34, Kumarasamy Street,<br />
                (Opp to Anusha Vidyalaya matriculation school),<br />
                Thiagarar 7th Stop, Madurai 625006
              </address>
              <a
                href="https://maps.google.com/?q=A-34+Kumarasamy+Street+Madurai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 Marlion Technologies. All rights reserved.
            </p>
            <a
              href="https://marliontech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-2"
            >
              Visit Corporate Site
              <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
