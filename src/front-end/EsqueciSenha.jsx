import React, { useState } from 'react';
import './EsqueciSenha.css';
import LogoSistema from '../assets/LogoSistema.png';

const API_BASE = 'http://localhost/controle-gastos/src/back-end';

const EsqueciSenha = ({ onCancel }) => {
  const [step, setStep] = useState(1); // 1: pedir email, 2: inserir código, 3: nova senha
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    setMensagem('');
    try {
      const res = await fetch(`${API_BASE}/EsqueciSenha.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_code', email }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setSucesso(true);
        setMensagem(data.mensagem || 'Código enviado para o email.');
        setStep(2);
      } else {
        setSucesso(false);
        setMensagem(data.mensagem || 'Erro ao enviar código.');
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setMensagem('');
    try {
      const res = await fetch(`${API_BASE}/EsqueciSenha.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_code', email, codigo }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setSucesso(true);
        setMensagem(data.mensagem || 'Código verificado.');
        setStep(3);
      } else {
        setSucesso(false);
        setMensagem(data.mensagem || 'Código inválido.');
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setMensagem('');
    if (senha !== confirma) {
      setMensagem('As senhas não coincidem.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/EsqueciSenha.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password', email, codigo, senha }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setSucesso(true);
        setMensagem(data.mensagem || 'Senha alterada com sucesso.');
        // volta para a tela de login após curto delay
        setTimeout(() => {
          if (onCancel) onCancel();
        }, 1200);
      } else {
        setSucesso(false);
        setMensagem(data.mensagem || 'Erro ao alterar senha.');
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-side">
          <img src={LogoSistema} alt="Logo Controle de Gastos" className="logo" />
          <h3 className="welcome-title">Recuperar senha</h3>
          <p className="welcome-sub">Informe seu email e siga as instruções enviadas.</p>
        </div>

        <div className="login-form">
          {step === 1 && (
            <>
              <h2>Esqueci minha senha</h2>
              <form onSubmit={sendCode}>
                <div className="input-group">
                  <label>Email:</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
                </div>
                <button type="submit">Enviar código</button>
                <button type="button" onClick={onCancel} style={{marginTop:8}}>Voltar</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Confirme o código</h2>
              <form onSubmit={verifyCode}>
                <div className="input-group">
                  <label>Código:</label>
                  <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} required placeholder="Código recebido por email" />
                </div>
                <button type="submit">Verificar código</button>
                <button type="button" onClick={() => setStep(1)} style={{marginTop:8}}>Voltar</button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Nova senha</h2>
              <form onSubmit={resetPassword}>
                <div className="input-group">
                  <label>Senha:</label>
                  <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="Nova senha" />
                </div>
                <div className="input-group">
                  <label>Confirmar senha:</label>
                  <input type="password" value={confirma} onChange={(e) => setConfirma(e.target.value)} required placeholder="Confirme a nova senha" />
                </div>
                <button type="submit">Alterar senha</button>
              </form>
            </>
          )}

          {mensagem && (
            <p className={sucesso ? 'msg-sucesso' : 'msg-erro'} style={{marginTop:12}}>{mensagem}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EsqueciSenha;
