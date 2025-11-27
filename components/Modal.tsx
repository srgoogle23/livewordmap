import React from 'react';
import { X, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'info' | 'confirm' | 'alert';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  variant = 'info' 
}) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
            variant === 'confirm' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
          }`}>
            {variant === 'confirm' ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <div className="text-slate-300">
            {children}
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          {variant === 'confirm' ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  if(onConfirm) onConfirm();
                  onClose();
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                {t.common.yes}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-xl transition-colors"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;