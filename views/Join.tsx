import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer, { DataConnection } from 'peerjs';
import { MAX_CHAR_LIMIT, PeerMessage, WordData } from '../types';
import { Send, CheckCircle2, AlertCircle, Wifi, Cloud, Keyboard, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RealtimeCloud from '../components/RealtimeCloud';
import LanguageToggle from '../components/LanguageToggle';

type Tab = 'input' | 'cloud';

const Join: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [words, setWords] = useState<WordData[]>([]); 
  
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);

  useEffect(() => {
    if (!roomId) {
        navigate('/');
        return;
    }

    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', () => {
        const conn = peer.connect(roomId, { reliable: true });
        
        conn.on('open', () => {
            setStatus('connected');
            connRef.current = conn;
        });

        conn.on('data', (data) => {
            const msg = data as PeerMessage;
            if (msg.type === 'UPDATE_CLOUD') {
                setWords(msg.payload);
            }
        });

        conn.on('close', () => {
            setStatus('disconnected');
            connRef.current = null;
        });

        conn.on('error', (err) => {
            console.error("Connection error", err);
            setStatus('error');
        });
    });

    peer.on('error', (err) => {
        console.error("Peer error", err);
        setStatus('error');
    });

    return () => {
        peer.destroy();
    };
  }, [roomId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !connRef.current) return;

    const message: PeerMessage = {
        type: 'SUBMIT_WORD',
        payload: input.trim()
    };

    connRef.current.send(message);
    setSentSuccess(true);
    setInput('');
    setTimeout(() => setSentSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex justify-between items-center sticky top-0 z-20 shadow-md">
            <div className="flex items-center space-x-3">
                <button 
                    onClick={() => navigate('/')} 
                    className="p-1 rounded-full hover:bg-slate-700 text-slate-300 transition-colors mr-1"
                    title={t.join.leaveBtn}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${status === 'connected' ? 'bg-emerald-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                <div>
                    <h1 className="text-white font-bold text-sm leading-none">LiveWordMap</h1>
                    <span className="text-slate-400 text-[10px] font-mono uppercase">Room: {roomId}</span>
                </div>
            </div>
            <LanguageToggle className="scale-90" />
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
            
            {/* INPUT VIEW */}
            <div className={`absolute inset-0 flex flex-col p-6 transition-transform duration-300 ease-in-out ${activeTab === 'input' ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="max-w-md w-full mx-auto my-auto space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.join.yourTurn}</h2>
                        <p className="text-slate-400 text-sm md:text-base">{t.join.sendInstructions}</p>
                    </div>

                    {status === 'connected' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    maxLength={MAX_CHAR_LIMIT}
                                    placeholder={t.join.inputPlaceholder}
                                    className="w-full bg-slate-800/50 border-2 border-slate-600 focus:border-indigo-500 rounded-2xl p-6 text-xl text-white placeholder-slate-500 outline-none transition-all shadow-xl text-center"
                                    autoComplete="off"
                                />
                                <div className="text-right mt-2 text-xs font-medium text-slate-500">
                                    {input.length}/{MAX_CHAR_LIMIT}
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={!input.trim()}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                            >
                                <span>{t.join.sendBtn}</span>
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-center animate-pulse">
                            <Wifi className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                            <p className="text-slate-300">{t.join.connecting}</p>
                        </div>
                    )}

                    <div className={`transition-all duration-300 transform ${sentSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 h-0 overflow-hidden'}`}>
                        <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center justify-center space-x-2 font-medium">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{t.join.success}</span>
                        </div>
                    </div>
                 </div>
            </div>

            {/* CLOUD VIEW */}
            <div className={`absolute inset-0 bg-slate-900 transition-transform duration-300 ease-in-out ${activeTab === 'cloud' ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                <RealtimeCloud words={words} />
            </div>

        </div>

        {/* Bottom Tab Navigation */}
        <div className="bg-slate-800 border-t border-slate-700 pb-safe">
            <div className="flex justify-around">
                <button 
                    onClick={() => setActiveTab('input')}
                    className={`flex-1 py-4 flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'input' ? 'text-indigo-400 border-t-2 border-indigo-400 bg-slate-700/30' : 'text-slate-500 border-t-2 border-transparent hover:bg-slate-700/10'}`}
                >
                    <Keyboard className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase tracking-wide">{t.join.sendBtn}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('cloud')}
                    className={`flex-1 py-4 flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'cloud' ? 'text-indigo-400 border-t-2 border-indigo-400 bg-slate-700/30' : 'text-slate-500 border-t-2 border-transparent hover:bg-slate-700/10'}`}
                >
                    <Cloud className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase tracking-wide">{t.join.cloudPreview}</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Join;