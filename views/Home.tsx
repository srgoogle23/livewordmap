import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length > 0) {
      navigate(`/join/${joinCode.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Language Toggle Fixed */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <LanguageToggle />
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
        
        {/* Left Side: Hero */}
        <div className="space-y-6 text-center md:text-left pt-10 md:pt-0">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t.home.heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              {t.home.heroTitleHighlight}
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto md:mx-0">
            {t.home.heroDesc}
          </p>
          
          <div className="flex justify-center md:justify-start">
            <button 
              onClick={() => navigate('/host')}
              className="group flex items-center justify-center space-x-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25 w-full md:w-auto"
            >
              <Users className="w-6 h-6" />
              <span>{t.home.createBtn}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Side: Join Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <MessageSquare className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{t.home.joinCardTitle}</h2>
              <p className="text-slate-400 text-sm">{t.home.joinCardDesc}</p>
            </div>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="code" className="sr-only">Código da Sala</label>
              <input
                id="code"
                type="text"
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder={t.home.joinInputPlaceholder}
                className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 text-center text-2xl font-mono tracking-widest py-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all uppercase"
              />
            </div>
            <button 
              type="submit"
              disabled={!joinCode}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              {t.home.joinBtn}
            </button>
          </form>
        </div>

      </div>
      
      <footer className="absolute bottom-4 text-slate-600 text-xs md:text-sm">
        LiveWordMap © {currentYear}
      </footer>
    </div>
  );
};

export default Home;