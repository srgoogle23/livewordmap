import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Host from './views/Host';
import Join from './views/Join';
import { LanguageProvider } from './contexts/LanguageContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/join/:roomId" element={<Join />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;