import React, { useEffect, useState } from 'react';
import './Inicial.css';

const makeSlicePath = (cx, cy, r, startAngle, endAngle) => {
  const rad = (a) => (a - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(rad(startAngle));
  const y1 = cy + r * Math.sin(rad(startAngle));
  const x2 = cx + r * Math.cos(rad(endAngle));
  const y2 = cy + r * Math.sin(rad(endAngle));
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
};

const API_BASE = 'http://localhost/controle-gastos/src/back-end';
const COLORS = ['#0B3048', '#255E8C', '#4B7CAA', '#7EA5C8', '#B3C8DF', '#1F2A36', '#6A89AA', '#CED8E4'];
const POS_COLOR = '#1F9A55';
const NEG_COLOR = '#C53B2C';
const NEUTRAL_COLOR = '#A5BBD2';

const DonutChart = ({ entradas = 0, saidas = 0, size = 220 }) => {
  const total = entradas + saidas || 1;
  const entradasPerc = (entradas / total) * 100;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const inner = r * 0.6;
  const slices = [
    { label: 'Entradas', value: entradas, color: POS_COLOR },
    { label: 'Saídas', value: saidas, color: NEG_COLOR },
  ];
  let angle = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => {
        const sweep = (s.value / total) * 360;
        const path = makeSlicePath(cx, cy, r, angle, angle + sweep);
        angle += sweep;
        return <path key={i} d={path} fill={s.color} stroke="#fff" strokeWidth="0.5" />;
      })}
      <circle cx={cx} cy={cy} r={inner} fill="#fff" />
      <text x={cx} y={cy} textAnchor="middle" dy="6" fontSize="14" fill="#2C3E50">{Math.round(entradasPerc)}% e</text>
    </svg>
  );
};

const PieChart = ({ data = [], size = 220, totalBase }) => {
  const derivedTotal = data.reduce((s, it) => s + it.value, 0);
  const total = totalBase || derivedTotal || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  let angle = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((s, i) => {
        const sweep = (s.value / total) * 360;
        const path = makeSlicePath(cx, cy, r, angle, angle + sweep);
        angle += sweep;
        return <path key={i} d={path} fill={s.color || COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="0.5" />;
      })}
    </svg>
  );
};

const formatCurrency = (v) => {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatPercent = (value, base) => {
  if (!base) return '0%';
  const pct = (Number(value) / base) * 100;
  return `${pct.toFixed(1)}%`;
};

const lastNDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const Inicial = () => {
  const [transactions, setTransactions] = useState([]);
  const [totais, setTotais] = useState({ entradas: 0, saidas: 0 });

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

  useEffect(() => {
    const since = lastNDays(30);
    let entradas = 0;
    let saidas = 0;
    transactions.forEach((t) => {
      const dt = new Date(t.date);
      if (dt >= since) {
        const v = Number(t.valor) || 0;
        if (t.tipo === 'entrada') entradas += v;
        else saidas += v;
      }
    });
    setTotais({ entradas, saidas });
  }, [transactions]);

  const goToTransacoes = () => {
    window.location.hash = '#transacoes';
  };

  const since = lastNDays(30);
  const recent = transactions.filter((t) => new Date(t.date) >= since);
  const entradas = recent.filter((r) => r.tipo === 'entrada').reduce((s, r) => s + (Number(r.valor) || 0), 0);
  const saidas = recent.filter((r) => r.tipo === 'saida').reduce((s, r) => s + (Number(r.valor) || 0), 0);

  const catSums = {};
  recent.filter((r) => r.tipo === 'saida').forEach((r) => {
    (r.categorias || []).forEach((c) => {
      catSums[c] = (catSums[c] || 0) + (Number(r.valor) || 0);
    });
  });
  const catData = Object.keys(catSums).map((k, i) => ({ label: k, value: catSums[k], color: COLORS[i % COLORS.length] }));
  const totalGastosCategorias = catData.reduce((s, it) => s + it.value, 0);
  const disponivel = Math.max(entradas - totalGastosCategorias, 0);
  const excedente = Math.max(totalGastosCategorias - entradas, 0);

  const pieData = [
    ...catData,
    ...(disponivel > 0 ? [{ label: 'Disponível', value: disponivel, color: NEUTRAL_COLOR }] : []),
    ...(excedente > 0 ? [{ label: 'Excedente', value: excedente, color: '#b71c1c' }] : []),
  ];
  const pieBase = (entradas || 0) + (excedente > 0 ? excedente : 0);

  return (
    <div className="inicial-container">
      <div className="inicial-left">
        <div className="card">
          <h3>Entradas vs Saídas (últimos 30 dias)</h3>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <DonutChart entradas={entradas} saidas={saidas} size={220} />
            <div>
              <div>Entradas: <span style={{color: POS_COLOR}}>{formatCurrency(entradas)}</span></div>
              <div>Saídas: <span style={{color: NEG_COLOR}}>{formatCurrency(saidas)}</span></div>
              <div>Saldo: <span style={{color: entradas - saidas >= 0 ? POS_COLOR : NEG_COLOR}}>{formatCurrency(entradas - saidas)}</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Distribuição por categorias (saídas)</h3>
          <div style={{display:'flex',gap:16,alignItems:'center'}}>
            <PieChart data={pieData} size={220} totalBase={pieBase || 1} />
            <div>
              {pieData.length === 0 && <div className="meta">Nenhuma categoria registrada</div>}
              {pieData.map((p) => (
                <div key={p.label} style={{display:'flex',gap:8,alignItems:'center'}}>
                  <span style={{width:12,height:12,background:p.color,display:'inline-block',borderRadius:2}} />
                  <span>{p.label}: {formatCurrency(p.value)} {entradas > 0 ? `(${formatPercent(p.value, entradas)} das entradas)` : ''}</span>
                </div>
              ))}
              {entradas === 0 && <div className="meta">Sem entradas no período para base de comparação.</div>}
              {excedente > 0 && <div className="meta">Gastos acima das entradas em {formatCurrency(excedente)}.</div>}
              {disponivel > 0 && <div className="meta">Percentuais calculados sobre o total de entradas.</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="inicial-aside card">
        <div className="inicial-aside-content">
          <div>
            <h3>Resumo (últimos 30 dias)</h3>
            <p><strong>Entradas:</strong> <span style={{color: POS_COLOR}}>{formatCurrency(totais.entradas)}</span></p>
            <p><strong>Saídas:</strong> <span style={{color: NEG_COLOR}}>{formatCurrency(totais.saidas)}</span></p>
            <p><strong>Saldo:</strong> <span style={{color: totais.entradas - totais.saidas >= 0 ? POS_COLOR : NEG_COLOR}}>{formatCurrency(totais.entradas - totais.saidas)}</span></p>
          </div>
          <div className="inicial-actions">
            <button className="btn-primary" onClick={goToTransacoes}>Cadastrar transações</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicial;
