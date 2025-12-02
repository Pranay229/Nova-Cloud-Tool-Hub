import { Sparkles, Shield, Zap, Users, ArrowRight, Check, Github, Twitter, Linkedin } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full text-blue-400 text-sm font-medium mb-6 border border-blue-800/50">
              <Sparkles className="w-4 h-4" />
              <span>Now in Beta</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-100 mb-6 leading-tight">
              Developer Tools
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              A comprehensive suite of developer utilities. Hash generators, UUID creators, password tools, and more. Everything you need in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Unlimited usage</span>
              </div>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl aspect-video flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300 font-medium">Professional Developer Tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400">
              Powerful tools designed to boost your productivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 bg-gray-700/50 rounded-2xl border border-gray-600 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-800/50">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">
                All tools run locally in your browser. No server delays, instant results every time.
              </p>
            </div>

            <div className="group p-8 bg-gray-700/50 rounded-2xl border border-gray-600 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-indigo-800/50">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Privacy First</h3>
              <p className="text-gray-400 leading-relaxed">
                Your data never leaves your device. Complete privacy and security guaranteed.
              </p>
            </div>

            <div className="group p-8 bg-gray-700/50 rounded-2xl border border-gray-600 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-purple-800/50">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Developer Friendly</h3>
              <p className="text-gray-400 leading-relaxed">
                Built by developers, for developers. Clean interface, powerful features.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">9+</div>
              <div className="text-blue-100 text-lg">Developer Tools</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-blue-100 text-lg">Free Forever</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">∞</div>
              <div className="text-blue-100 text-lg">Unlimited Usage</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of developers using Nova cloud stack Tool's tools every day.
          </p>
          <button
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            Start Using Tools Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-400 mt-4">No credit card required • Free forever</p>
        </div>
      </section>

      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-100">Nova Cloud Stack Tool's</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional developer tools made simple and accessible.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Tools</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-gray-200 transition-colors">Hash Generator</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">UUID Generator</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">Password Generator</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">JSON Formatter</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-gray-200 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-gray-200 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 Nova Cloud stack Tool's. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
