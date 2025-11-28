import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Peer, { DataConnection } from 'peerjs';
import { generateRoomId } from '../utils/color';
import { WordData, PeerMessage } from '../types';
import { PEER_CONFIG, PEER_CONFIG_FALLBACK } from '../utils/peerConfig';
import RealtimeCloud from '../components/RealtimeCloud';
import Modal from '../components/Modal';
import LanguageToggle from '../components/LanguageToggle';
import { Copy, Maximize, Users, WifiOff, Share2, Power } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Host: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [words, setWords] = useState<WordData[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const connectionsRef = useRef<DataConnection[]>([]);
  const peerRef = useRef<Peer | null>(null);

  // Initialize Peer
  useEffect(() => {
    const id = generateRoomId();
    const newPeer = new Peer(id, PEER_CONFIG);

    newPeer.on('open', (id) => {
      setRoomId(id);
      setError(null);
    });

    newPeer.on('connection', (conn) => {
      connectionsRef.current.push(conn);
      setConnectionCount(prev => prev + 1);

      // Send current state to new user immediately
      conn.on('open', () => {
         conn.send({ type: 'UPDATE_CLOUD', payload: words } as PeerMessage);
      });

      conn.on('data', (data) => {
        const msg = data as PeerMessage;
        if (msg.type === 'SUBMIT_WORD') {
          handleNewWord(msg.payload);
        }
      });

      conn.on('close', () => {
        connectionsRef.current = connectionsRef.current.filter(c => c !== conn);
        setConnectionCount(prev => Math.max(0, prev - 1));
      });
    });

    newPeer.on('error', (err) => {
        console.error("P2P Error:", err);
        if (err.type === 'unavailable-id') {
            setError("Erro ao gerar ID. Tente recarregar a página.");
        } else if (err.type === 'network' || err.type === 'server-error') {
            // Try fallback to default server
            console.log('Trying fallback server...');
            const fallbackPeer = new Peer(id, PEER_CONFIG_FALLBACK);
            fallbackPeer.on('open', () => {
                peerRef.current = fallbackPeer;
                setRoomId(id);
                setError(null);
            });
            fallbackPeer.on('error', () => {
                setError(t.host.connectionError);
            });
        } else {
            setError(t.host.connectionError);
        }
    });

    peerRef.current = newPeer;

    return () => {
      newPeer.destroy();
    };
  }, []);

  // Broadcast words updates to all connected peers
  useEffect(() => {
    if (words.length === 0) return;
    
    const message: PeerMessage = { type: 'UPDATE_CLOUD', payload: words };
    
    connectionsRef.current.forEach(conn => {
        if (conn.open) {
            conn.send(message);
        }
    });
  }, [words]);

  const handleNewWord = (text: string) => {
    const cleanText = text.trim().toLowerCase();
    if (!cleanText) return;

    setWords((prevWords) => {
      const existingIndex = prevWords.findIndex(w => w.text.toLowerCase() === cleanText);
      if (existingIndex >= 0) {
        // Increment count
        const newWords = [...prevWords];
        newWords[existingIndex] = {
          ...newWords[existingIndex],
          count: newWords[existingIndex].count + 1
        };
        return newWords;
      } else {
        // Add new word
        return [...prevWords, { text: text.trim(), count: 1, id: cleanText }];
      }
    });
  };

  const shareUrl = roomId 
    ? `${window.location.protocol}//${window.location.host}${window.location.pathname}#/join/${roomId}`
    : '';

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(shareUrl);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        setIsCopyModalOpen(true);
    } catch (err) {
        console.error('Failed to copy', err);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const confirmExit = () => {
    navigate('/');
  };

  if (error) {
     return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center p-4">
            <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-red-400">
                <WifiOff className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">{t.host.connectionError}</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">{t.host.reload}</button>
            </div>
        </div>
     );
  }

  if (!roomId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col md:flex-row overflow-hidden relative">
      <Modal 
        isOpen={isCopyModalOpen} 
        onClose={() => setIsCopyModalOpen(false)}
        title={t.host.linkCopied}
      >
        <p>{t.host.accessToJoin} <br/><span className="text-indigo-400 break-all text-sm">{shareUrl}</span></p>
      </Modal>

      <Modal 
        isOpen={isExitModalOpen} 
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={confirmExit}
        title={t.host.confirmExitTitle}
        variant="confirm"
      >
        <p>{t.host.confirmExitDesc}</p>
      </Modal>

      <div className="absolute top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      
      {/* Sidebar (Desktop) / Header (Mobile) */}
      <div className="w-full md:w-80 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-700 flex flex-row md:flex-col justify-between z-10 shadow-xl shrink-0">
        
        {/* Room Info */}
        <div className="p-4 md:p-6 border-r md:border-r-0 md:border-b border-slate-700 flex-1 md:flex-none flex flex-col justify-center">
            <h2 className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2">{t.host.activeRoom}</h2>
            <div className="text-2xl md:text-4xl font-mono font-bold text-white tracking-widest">{roomId}</div>
        </div>

        {/* QR Code Area - Hidden on tiny screens, adapted for mobile */}
        <div className="hidden md:flex p-6 flex-1 flex-col items-center justify-center space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-lg">
                <QRCodeSVG value={shareUrl} size={180} />
            </div>
            <div className="text-center">
                <p className="text-slate-300 font-medium mb-1">{t.host.accessToJoin}</p>
                <p className="text-indigo-400 text-sm break-all max-w-[200px]">{window.location.host}/#/join/{roomId}</p>
            </div>
        </div>

        {/* Controls */}
        <div className="p-2 md:p-4 bg-slate-800 md:border-t border-slate-700 flex flex-row md:flex-col items-center justify-end md:space-y-3 space-x-2 md:space-x-0">
             <div className="hidden md:flex items-center justify-between text-slate-400 text-sm px-2 w-full">
                <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{connectionCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>{words.length}</span>
                </div>
             </div>

             <div className="flex flex-row md:flex-col w-full space-x-2 md:space-x-0 md:space-y-3">
                <button 
                    onClick={copyLink}
                    className="flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white p-2 md:py-2 rounded-lg transition-colors text-sm font-medium flex-1 md:w-full"
                    title={t.host.copyLink}
                >
                    <Copy className="w-4 h-4" />
                    <span className="hidden md:inline">{t.host.copyLink}</span>
                </button>
                <button 
                    onClick={toggleFullScreen}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white p-2 md:py-2 rounded-lg transition-colors text-sm font-medium flex-1 md:w-full"
                    title={t.host.fullScreen}
                >
                    <Maximize className="w-4 h-4" />
                    <span className="hidden md:inline">{t.host.fullScreen}</span>
                </button>
                 <button 
                    onClick={() => setIsExitModalOpen(true)}
                    className="flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 p-2 md:py-2 rounded-lg transition-colors text-sm font-medium flex-none md:w-full"
                    title={t.host.exitBtn}
                >
                    <Power className="w-4 h-4" />
                    <span className="hidden md:inline">{t.host.exitBtn}</span>
                </button>
             </div>
        </div>
      </div>

      {/* Main Content: Word Cloud */}
      <div className="flex-1 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <RealtimeCloud words={words} />
        
        {/* Mobile Stat Floating Pill */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 text-xs text-slate-300 z-10">
           <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{connectionCount}</span>
           </div>
           <div className="w-px h-3 bg-slate-600"></div>
           <div className="flex items-center space-x-1">
              <Share2 className="w-3 h-3" />
              <span>{words.length}</span>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Host;