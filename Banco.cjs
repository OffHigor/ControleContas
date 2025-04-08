const mysql = require('mysql2');

//Criar conexão com banco de dados MySQL
const con = mysql.createConnection({
    host: '147.93.14.105',
    port: '3306',
    user: 'u776593559_AdmHigor',
    password: 'WJ~hse9w#1',
    database: 'u776593559_ControlReceita'
})

con.connect(function(err){
    if(err) throw err;
    console.log('Conexão com o banco bem sucedida!');
    
    var select = 'SELECT * FROM Login';
    con.query(select, function(err, result){
        if (err) throw err;
        console.log(result);
     });
});

// Pegando os dados do formulário
var CampoNome = document.getElementById('nome').value;
var CampoUsuario = document.getElementById('usuario').value;
var CampoEmail = document.getElementById('email').value;
var CampoData = document.getElementById('data').value;
var CampoSenha = document.getElementById('senha').value;

// Conectando ao banco de dados
con.connect(function(err) {
    if (err) {
        console.error('Erro de conexão:', err);
        return; // Caso haja erro na conexão, o processo é interrompido
    }
    console.log('Conexão com o banco bem sucedida.');

    // Criando o objeto com os dados a serem inseridos
    var cadastro = { 
        NOME: CampoNome, 
        USUARIO: CampoUsuario, 
        EMAIL: CampoEmail,  
        DNASCIMENTO: CampoData, 
        SENHA: CampoSenha 
    };

    // Definindo a consulta SQL com placeholders
    var insert = `INSERT INTO Login (NOME, USUARIO, EMAIL, DNASCIMENTO, SENHA) VALUES (?, ?, ?, ?, ?)`;

    // Inserindo os dados no banco usando placeholders para segurança
    con.query(insert, [cadastro.NOME, cadastro.USUARIO, cadastro.EMAIL, cadastro.DNASCIMENTO, cadastro.SENHA], function(err, result) {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return; // Caso haja erro na inserção, o processo é interrompido
        }
        console.log('Dados inseridos com sucesso!', result);
    });
});