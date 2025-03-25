//Incluir Dependencia MySQL
const mysql = require('mysql2');

//Criar conexão com banco de dados MySQL
const connection = mysql.createConnection({
    host: '147.93.14.105',
    port: '3303',
    user: '	u776593559_AdmHigor',
    password: 'WJ~hse9w#1',
    database: 'u776593559_ControlReceita'
})

connection.connect(function (err){
    console.log("Conexão com Banco de Dados Realizada com Sucesso!");
});
connection.query("SELECT * FROM Login;", function (err, rows, fields) {
    if (err) {
        console.log("Resultado:", rows);
    } else {
        console.log('Erro: Consulta não realizada com sucesso!');
    }
});