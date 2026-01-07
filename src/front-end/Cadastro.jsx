import React, { useState } from 'react';
import './Cadastro.css';
import LogoSistema from '../assets/LogoSistema.png';

const API_BASE = 'http://localhost/controle-gastos/src/back-end';

const Cadastro = ({ onCancel }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setSucesso(false);

    if (senha !== confirma) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/Cadastro.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (data.sucesso) {
        setSucesso(true);
        setMensagem(data.mensagem || 'Cadastro realizado com sucesso.');
      } else {
        setSucesso(false);
        setMensagem(data.mensagem || 'Erro no cadastro.');
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
          <h3 className="welcome-title">Crie sua conta</h3>
          <p className="welcome-sub">Cadastre-se para começar a gerenciar seus gastos.</p>
        </div>

        <div className="login-form">
          <h2>Cadastro</h2>
          <p className="lead">Preencha os dados abaixo</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nome:</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Seu nome" />
            </div>

            <div className="input-group">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
            </div>

            <div className="input-group">
              <label>Senha:</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="Sua senha" />
            </div>

            <div className="input-group">
              <label>Confirmar senha:</label>
              <input type="password" value={confirma} onChange={(e) => setConfirma(e.target.value)} required placeholder="Confirme a senha" />
            </div>

            <button type="submit">Cadastrar</button>
            <button type="button" onClick={onCancel} style={{marginTop:8}}>Voltar</button>
          </form>

          {mensagem && (
            <p className={sucesso ? 'msg-sucesso' : 'msg-erro'} style={{marginTop:12}}>{mensagem}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
