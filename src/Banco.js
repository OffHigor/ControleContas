//Incluir Dependencia MySQL
const mysql = require('mysql2');

//Criar conexão com banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost'
    user: 'root'
    database: 'teste'
})