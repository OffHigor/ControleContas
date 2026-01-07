import React, { useState } from 'react';
import './Login.css';
import Cadastro from './Cadastro';
import EsqueciSenha from './EsqueciSenha';
import LogoSistema from '../assets/LogoSistema.png';

const API_BASE = 'http://localhost/controle-gastos/src/back-end';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setSucesso(false);

    try {
      const response = await fetch(`${API_BASE}/Login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, senha: senha }),
      });

      const data = await response.json();

      if (data.sucesso) {
        setSucesso(true);
        setMensagem(data.mensagem);
        console.log('Dados do usuário:', data.usuario);
        try {
          const session = {
            user: data.usuario,
            expiry: Date.now() + 30 * 60 * 1000, // 30 minutos
          };
          localStorage.setItem('cg_session', JSON.stringify(session));
        } catch (e) {
          console.error('Erro salvando sessão:', e);
        }
        if (onLogin) onLogin();
        else window.location.reload();
      } else {
        setSucesso(false);
        setMensagem(data.mensagem);
      }
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  if (showRegister) {
    return <Cadastro onCancel={() => setShowRegister(false)} />;
  }

  if (showForgot) {
    return <EsqueciSenha onCancel={() => setShowForgot(false)} />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-side">
          <img src={LogoSistema} alt="Logo Controle de Gastos" className="logo" />
          <h3 className="welcome-title">Bem-vindo de volta!</h3>
          <p className="welcome-sub">Gerencie seus gastos com clareza e segurança. Acesse seu painel e acompanhe suas finanças.</p>
        </div>

        <div className="login-form">
          <h2>Acessar Sistema</h2>
          <p className="lead">Entre com seu email e senha</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>

            <div className="input-group">
              <label>Senha:</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="Sua senha"
              />
            </div>

            <button type="submit">Entrar</button>
            <button type="button" onClick={() => setShowRegister(true)} style={{marginTop:8}}>Cadastrar</button>
          </form>

          <div style={{marginTop:12}}>
            {mensagem && (
              <p className={sucesso ? 'msg-sucesso' : 'msg-erro'}>{mensagem}</p>
            )}
            <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>Esqueceu a senha?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;