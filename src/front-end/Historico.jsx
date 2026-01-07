import React, { useEffect, useMemo, useState } from 'react';
import './Historico.css';

const API_BASE = 'http://localhost/controle-gastos/src/back-end';
const daysOptions = [7, 30, 60, 90, 'all'];

const Historico = () => {
  const [transactions, setTransactions] = useState([]);
  const [days, setDays] = useState(30);
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  useEffect(() => {
    let userId = 0;
    try {
      const s = JSON.parse(localStorage.getItem('cg_session') || '{}');
      userId = s?.user?.id || 0;
    } catch (e) { userId = 0; }
    if (!userId) {
      setTransactions([]);
      return;
    }
    fetch(`${API_BASE}/Transacoes.php?user_id=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        const parsed = (data || []).map((t) => {
          try {
            if (typeof t.categorias === 'string') t.categorias = JSON.parse(t.categorias || '[]');
          } catch (e) { t.categorias = []; }
          return t;
        });
        setTransactions(parsed);
      })
      .catch(() => setTransactions([]));
  }, []);

  const filtered = useMemo(() => {
    let since = null;
    if (days !== 'all') {
      since = new Date();
      since.setDate(since.getDate() - Number(days));
    }
    return transactions.filter((t) => {
      const dt = new Date(t.date);
      if (since && dt < since) return false;
      if (tipoFiltro === 'entradas') return t.tipo === 'entrada';
      if (tipoFiltro === 'saidas') return t.tipo === 'saida';
      return true;
    });
  }, [transactions, days, tipoFiltro]);

  return (
    <div className="historico-card card">
      <h3>Histórico de transações</h3>
      <div className="historico-filters">
        <div>
          <label>Período:</label>
          <select value={String(days)} onChange={(e)=>setDays(isNaN(Number(e.target.value)) ? 'all' : Number(e.target.value))}>
            {daysOptions.map(d=> (
              <option key={d} value={d === 'all' ? 'all' : d}>
                {d === 'all' ? 'Todo o período' : `${d} dias`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Tipo:</label>
          <select value={tipoFiltro} onChange={(e)=>setTipoFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="entradas">Entradas</option>
            <option value="saidas">Saídas</option>
          </select>
        </div>
      </div>

      <div>
        {filtered.length === 0 && <p>Nenhuma transação encontrada para o filtro selecionado.</p>}
        {filtered.map((t) => (
          <div key={t.id} className="historico-item">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div>
                <strong>{t.nome}</strong>
                <div className="meta">{t.descricao}</div>
                <div className="meta">{t.categorias && t.categorias.join(', ')}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className={`valor ${t.tipo==='entrada' ? 'entrada' : 'saida'}`}>{(Number(t.valor)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
                <div className="meta">{new Date(t.date).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historico;
