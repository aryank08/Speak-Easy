import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Mic, Globe2, Sparkles, ArrowRight, Phone, Mail, Code, Palette } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4B3CFF] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#08F7FE] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-[1440px] mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Transform Speech to Text with
                <span className="bg-gradient-to-r from-[#4B3CFF] to-[#08F7FE] text-transparent bg-clip-text"> AI Precision</span>
              </h1>
              <p className="text-lg text-[#8A8F98] max-w-xl">
                Experience state-of-the-art speech recognition powered by advanced AI. Perfect for content creators, developers, and businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#4B3CFF] to-[#08F7FE] rounded-lg text-white font-semibold hover:opacity-90 transition-all duration-200 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/converter"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 rounded-lg text-white font-semibold hover:bg-white/20 transition-all duration-200"
                >
                  Try Demo
                </Link>
              </div>
            </div>

            {/* 3D Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4B3CFF]/20 to-[#08F7FE]/20 rounded-3xl filter blur-3xl"></div>
              <div className="relative bg-[#1A1A1A] rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Mic, title: "Voice Recognition", desc: "Real-time audio processing" },
                    { icon: Globe2, title: "Multi-language", desc: "120+ languages supported" },
                    { icon: Wand2, title: "AI Enhanced", desc: "Smart noise reduction" },
                    { icon: Sparkles, title: "High Accuracy", desc: "99% precision rate" }
                  ].map(({ icon: Icon, title, desc }, index) => (
                    <div key={index} className="p-6 bg-black/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <Icon className="w-8 h-8 text-[#08F7FE] mb-4" />
                      <h3 className="font-semibold mb-2">{title}</h3>
                      <p className="text-sm text-[#8A8F98]">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-[#0F0F0F]">
        <div className="max-w-[1440px] mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-[#8A8F98] text-lg max-w-2xl mx-auto">
              Everything you need to convert speech to text with professional quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe2,
                title: "Global Language Support",
                description: "Support for over 120 languages with natural-sounding voices and accurate translations"
              },
              {
                icon: Mic,
                title: "Advanced Audio Processing",
                description: "Crystal clear audio processing with background noise reduction and echo cancellation"
              },
              {
                icon: Sparkles,
                title: "Real-time Transcription",
                description: "Convert speech to text instantly with our powerful real-time processing engine"
              }
            ].map(({ icon: Icon, title, description }, index) => (
              <div
                key={index}
                className="p-8 bg-[#1A1A1A] rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#4B3CFF] to-[#08F7FE] rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <p className="text-[#8A8F98]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative">
        <div className="max-w-[1440px] mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-[#8A8F98] text-lg max-w-2xl mx-auto">
              The talented developers behind SpeakEasy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Backend Developer */}
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-200">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4B3CFF] to-[#08F7FE] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">Aryank Tripathi</h3>
                    <p className="text-[#8A8F98] font-medium">Backend Developer</p>
                  </div>
                  <div className="space-y-2">
                    <a
                      href="tel:+917000778109"
                      className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      +91 7000778109
                    </a>
                    <a
                      href="mailto:aryanktfb21@svvv.edu.in"
                      className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      aryanktfb21@svvv.edu.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Frontend Developer */}
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-200">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4B3CFF] to-[#08F7FE] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">Shashank Meena</h3>
                    <p className="text-[#8A8F98] font-medium">Frontend Developer</p>
                  </div>
                  <div className="space-y-2">
                    <a
                      href="tel:+918839546025"
                      className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      +91 8839546025
                    </a>
                    <a
                      href="mailto:shashankmfb21@svvv.edu.in"
                      className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      shashankmfb21@svvv.edu.in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="max-w-[1440px] mx-auto px-8 py-24">
          <div className="bg-gradient-to-r from-[#4B3CFF] to-[#08F7FE] p-[1px] rounded-2xl">
            <div className="bg-[#1A1A1A] rounded-2xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-[#8A8F98] text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust our platform for their speech-to-text needs.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;