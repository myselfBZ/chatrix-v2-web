import { MessageSquare, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
            <span className="text-xl font-semibold text-gray-900">Chatrix</span>
          </div>
          <button 
          onClick={() => navigate('/login')}
          className="px-5 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
            Log in
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="pt-24 pb-20">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight max-w-2xl">
            Messaging that works the way you think
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-xl">
            Fast, focused communication without the noise. Chatrix strips away everything unnecessary so you can get back to what matters.
          </p>
          <button className="mt-8 px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
            Get started
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-12 py-20 border-t border-gray-200">
          <div>
            <Zap className="w-8 h-8 text-gray-900 mb-4" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instant delivery
            </h3>
            <p className="text-gray-600">
              Messages arrive immediately. No lag, no delays, no waiting.
            </p>
          </div>

          <div>
            <Shield className="w-8 h-8 text-gray-900 mb-4" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Private by default
            </h3>
            <p className="text-gray-600">
              Your conversations stay between you and who you choose to share them with.
            </p>
          </div>

          <div>
            <MessageSquare className="w-8 h-8 text-gray-900 mb-4" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pure messaging
            </h3>
            <p className="text-gray-600">
              No feeds, no algorithms, no distractions. Just conversations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-gray-500">© 2026 Chatrix. Built for people who value clarity.</p>
        </div>
      </footer>
    </div>
  );
}