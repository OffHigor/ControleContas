const express = require('express');
const mysql = require('mysql2');
const app = express();

// Configura o servidor para aceitar JSON no corpo das requisições
app.use(express.json());

// Criar conexão com banco de dados MySQL
const con = mysql.createConnection({
  host: '147.93.14.105',
  port: '3306',
  user: 'u776593559_AdmHigor',
  password: 'WJ~hse9w#1',
  database: 'u776593559_ControlReceita'
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Conexão com o banco bem-sucedida!');
});

// Rota de cadastro
app.post('/cadastrar', (req, res) => {
  const { nome, email, usuario, dataNascimento, senha } = req.body;

  // Definir a consulta SQL com placeholders para segurança
  const insert = `INSERT INTO Login (NOME, USUARIO, EMAIL, DNASCIMENTO, SENHA) VALUES (?, ?, ?, ?, ?)`;

  // Inserindo os dados no banco
  con.query(insert, [nome, usuario, email, dataNascimento, senha], (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).json({ success: false, message: 'Erro ao inserir dados no banco.' });
    }
    res.status(200).json({ success: true, message: 'Cadastro realizado com sucesso!' });
  });
});

// Iniciar o servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});