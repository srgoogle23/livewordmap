import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface Translations {
  common: {
    cancel: string;
    confirm: string;
    yes: string;
  };
  home: {
    heroTitle: string;
    heroTitleHighlight: string;
    heroDesc: string;
    createBtn: string;
    joinCardTitle: string;
    joinCardDesc: string;
    joinInputPlaceholder: string;
    joinBtn: string;
  };
  host: {
    activeRoom: string;
    accessToJoin: string;
    online: string;
    words: string;
    copyLink: string;
    fullScreen: string;
    linkCopied: string;
    waitingTitle: string;
    waitingDesc: string;
    connectionError: string;
    reload: string;
    exitBtn: string;
    confirmExitTitle: string;
    confirmExitDesc: string;
  };
  join: {
    title: string;
    statusConnected: string;
    yourTurn: string;
    sendInstructions: string;
    inputPlaceholder: string;
    sendBtn: string;
    connecting: string;
    success: string;
    errorConnection: string;
    roomIdLabel: string;
    cloudPreview: string;
    leaveBtn: string;
  };
}

const translations: Record<Language, Translations> = {
  pt: {
    common: {
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      yes: 'Sim, encerrar',
    },
    home: {
      heroTitle: 'Crie Nuvens de',
      heroTitleHighlight: 'Palavras Ao Vivo',
      heroDesc: 'Engaje sua audiência instantaneamente. Crie uma sala, compartilhe o QR Code e veja as opiniões aparecerem em tempo real.',
      createBtn: 'Criar Sala Agora',
      joinCardTitle: 'Entrar na Sala',
      joinCardDesc: 'Possui um código?',
      joinInputPlaceholder: 'Ex: X9K2P',
      joinBtn: 'Entrar',
    },
    host: {
      activeRoom: 'Sala Ativa',
      accessToJoin: 'Acesse para participar',
      online: 'Online',
      words: 'Palavras',
      copyLink: 'Copiar Link',
      fullScreen: 'Tela Cheia',
      linkCopied: 'Link copiado!',
      waitingTitle: 'Esperando respostas...',
      waitingDesc: 'A nuvem aparecerá aqui',
      connectionError: 'Erro de Conexão',
      reload: 'Recarregar',
      exitBtn: 'Encerrar',
      confirmExitTitle: 'Encerrar Sala?',
      confirmExitDesc: 'Isso irá desconectar todos os participantes e apagar a nuvem atual.',
    },
    join: {
      title: 'LiveWordMap',
      statusConnected: 'Conectado',
      yourTurn: 'Sua vez!',
      sendInstructions: 'Envie uma palavra ou frase curta para a tela.',
      inputPlaceholder: 'Digite aqui...',
      sendBtn: 'Enviar',
      connecting: 'Estabelecendo conexão com o apresentador...',
      success: 'Enviado com sucesso!',
      errorConnection: 'Não foi possível conectar à sala. Verifique o código.',
      roomIdLabel: 'Sala ID',
      cloudPreview: 'Visualização da Sala',
      leaveBtn: 'Sair',
    },
  },
  en: {
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      yes: 'Yes, end room',
    },
    home: {
      heroTitle: 'Create Live',
      heroTitleHighlight: 'Word Clouds',
      heroDesc: 'Engage your audience instantly. Create a room, share the QR Code, and see opinions pop up in real-time.',
      createBtn: 'Create Room Now',
      joinCardTitle: 'Join Room',
      joinCardDesc: 'Have a code?',
      joinInputPlaceholder: 'Ex: X9K2P',
      joinBtn: 'Join',
    },
    host: {
      activeRoom: 'Active Room',
      accessToJoin: 'Join at',
      online: 'Online',
      words: 'Words',
      copyLink: 'Copy Link',
      fullScreen: 'Full Screen',
      linkCopied: 'Link copied!',
      waitingTitle: 'Waiting for responses...',
      waitingDesc: 'The cloud will appear here',
      connectionError: 'Connection Error',
      reload: 'Reload',
      exitBtn: 'End Room',
      confirmExitTitle: 'End Room?',
      confirmExitDesc: 'This will disconnect all participants and delete the current cloud.',
    },
    join: {
      title: 'LiveWordMap',
      statusConnected: 'Connected',
      yourTurn: 'Your Turn!',
      sendInstructions: 'Send a word or short phrase to the screen.',
      inputPlaceholder: 'Type here...',
      sendBtn: 'Send',
      connecting: 'Connecting to presenter...',
      success: 'Sent successfully!',
      errorConnection: 'Could not connect to room. Check the code.',
      roomIdLabel: 'Room ID',
      cloudPreview: 'Live Room View',
      leaveBtn: 'Leave',
    },
  },
};

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};