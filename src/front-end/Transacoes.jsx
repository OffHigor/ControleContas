import React, { useState } from 'react';
import './Transacoes.css';

const API_BASE = 'http://localhost/controle-gastos/src/back-end';
const categoriasList = ['lazer', 'saude', 'contas', 'viagem', 'casa'];
const COLOR_ENTRADA = '#43a047';
const COLOR_SAIDA = '#f44336';

const Transacoes = () => {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('saida');
  const [dataTransacao, setDataTransacao] = useState(() => new Date().toISOString().slice(0,10));
  const [categorias, setCategorias] = useState({});
  const [mensagem, setMensagem] = useState('');
  const session = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('cg_session') || '{}'); } catch (e) { return {}; }
  }, []);
  const userId = session?.user?.id || 0;
  const isEntrada = tipo === 'entrada';
  const isSaida = tipo === 'saida';

  const toggleCategoria = (cat) => {
    if (tipo === 'entrada') return;
    setCategorias((c) => {
      const already = !!c[cat];
      return already ? {} : { [cat]: true };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const dateToUse = dataTransacao ? new Date(`${dataTransacao}T${now.toTimeString().slice(0,8)}`) : now;
    const selCats = Object.keys(categorias).filter((k) => categorias[k]);
    if (tipo === 'saida' && selCats.length === 0) {
      setMensagem('Para uma saída, selecione uma categoria.');
      return;
    }
    const newT = {
      user_id: userId,
      id: Date.now(),
      nome,
      valor: parseFloat(String(valor).replace(',', '.')) || 0,
      descricao,
      tipo: tipo === 'entrada' ? 'entrada' : 'saida',
      categorias: tipo === 'entrada' ? [] : selCats,
      date: dateToUse.toISOString(),
    };

    fetch(`${API_BASE}/Transacoes.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newT),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso) {
          setMensagem('Transação cadastrada com sucesso');
          window.location.hash = '#inicial';
        } else {
          setMensagem(data.mensagem || 'Erro ao salvar transação');
        }
      })
      .catch((err) => {
        console.error(err);
        setMensagem('Erro ao salvar transação (conexão)');
      });
  };

  return (
    <div className="transacoes-card card">
      <h3>Cadastrar Transação</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input value={nome} onChange={(e)=>setNome(e.target.value)} required />
        </div>

        <div>
          <label>Valor</label>
          <input value={valor} onChange={(e)=>setValor(e.target.value)} required placeholder="0,00" />
        </div>

        <div>
          <label>Descrição</label>
          <input value={descricao} onChange={(e)=>setDescricao(e.target.value)} />
        </div>

        <div>
          <label>Data</label>
          <input type="date" value={dataTransacao} onChange={(e)=>setDataTransacao(e.target.value)} required />
        </div>

        <div className="tipo-group">
          <label>Tipo</label>
          <label className="radio-option entrada">
            <input
              type="radio"
              checked={isEntrada}
              onChange={()=>{ setTipo('entrada'); setCategorias({}); }}
              style={{ accentColor: COLOR_ENTRADA }}
            />
            Entrada
          </label>
          <label className="radio-option saida">
            <input
              type="radio"
              checked={isSaida}
              onChange={()=>setTipo('saida')}
              style={{ accentColor: COLOR_SAIDA }}
            />
            Saída
          </label>
        </div>

        <div>
          <label>Categorias (marque as aplicáveis)</label>
          <div className="checkbox-group">
            {categoriasList.map((c)=> (
              <label key={c} style={{display:'flex',alignItems:'center'}}>
                <input
                  type="checkbox"
                  checked={!!categorias[c]}
                  onChange={()=>toggleCategoria(c)}
                  disabled={isEntrada}
                  style={{ accentColor: tipo === 'entrada' ? COLOR_ENTRADA : COLOR_SAIDA }}
                /> {c}
              </label>
            ))}
          </div>
        </div>

        <div style={{marginTop:12}}>
          <button type="submit">Salvar transação</button>
        </div>
        {mensagem && <p className="msg">{mensagem}</p>}
      </form>
    </div>
  );
};

export default Transacoes;
