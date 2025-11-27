import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-700 backdrop-blur-sm z-50 ${className}`}
      title="Mudar idioma / Change language"
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase font-bold text-xs tracking-wider">{language}</span>
    </button>
  );
};

export default LanguageToggle;