import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './front-end/Login.jsx';
import Inicial from './front-end/Inicial.jsx';
import Transacoes from './front-end/Transacoes.jsx';
import Historico from './front-end/Historico.jsx';
import logoUrl from './assets/LogoSistema.png';

function App() {
  const [page, setPage] = useState('inicial');
  const [loggedIn, setLoggedIn] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('cg_session');
    if (s) {
      try {
        const sess = JSON.parse(s);
        if (sess.expiry && sess.expiry > Date.now()) {
          setLoggedIn(true);
        } else {
          localStorage.removeItem('cg_session');
          setLoggedIn(false);
        }
      } catch (e) {
        localStorage.removeItem('cg_session');
      }
    }
    if (window.location.hash) {
      const h = window.location.hash.replace('#', '');
      if (h) setPage(h);
    }
    const ensureFavicon = () => {
      const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
      link.rel = 'icon';
      link.href = logoUrl;
      document.head.appendChild(link);
    };
    ensureFavicon();
  }, []);

  useEffect(() => {
    const onHash = () => setPage(window.location.hash.replace('#', '') || 'inicial');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const titles = {
      inicial: 'Inicial - Controle de Gastos',
      transacoes: 'Transações - Controle de Gastos',
      extrato: 'Extrato - Controle de Gastos',
    };
    document.title = titles[page] || 'Controle de Gastos';
  }, [page]);

  const handleLogout = () => {
    localStorage.removeItem('cg_session');
    setLoggedIn(false);
    setPage('inicial');
  };

  const goTo = (target) => {
    setPage(target);
    window.location.hash = `#${target}`;
    setNavOpen(false);
  };

  if (!loggedIn) {
    return (
      <div className="App">
        <Login onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="App app-authenticated">
      <header className="app-header">
        <nav className="app-nav">
          <div className="nav-left">
            <button className="nav-logo-btn mobile-only" onClick={() => goTo('inicial')}>
              <img src={logoUrl} alt="Logo" className="app-logo" />
            </button>
          </div>
          <div className="nav-center">
            <button className="nav-transacoes desktop-only" onClick={() => goTo('transacoes')}>Transações</button>
            <button className="nav-logo-btn desktop-only" onClick={() => goTo('inicial')}>
              <img src={logoUrl} alt="Logo" className="app-logo" />
            </button>
            <button className="desktop-only" onClick={() => goTo('extrato')}>Extrato</button>
          </div>
          <div className="nav-right">
            <button className="nav-logout desktop-only" onClick={handleLogout}>Sair</button>
            <button className="nav-menu-toggle mobile-only" onClick={() => setNavOpen((o) => !o)}>Menu ▾</button>
            {navOpen && (
              <div className="nav-menu mobile-only">
                <button onClick={() => goTo('inicial')}>Home</button>
                <button onClick={() => goTo('transacoes')}>Transações</button>
                <button onClick={() => goTo('extrato')}>Extrato</button>
                <button className="nav-logout" onClick={handleLogout}>Sair</button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="app-main">
        <div className={`app-block ${page}-block`}>
          {page === 'inicial' && <Inicial />}
          {page === 'transacoes' && <Transacoes />}
          {page === 'extrato' && <Historico />}
        </div>
      </main>
    </div>
  );
}

export default App;