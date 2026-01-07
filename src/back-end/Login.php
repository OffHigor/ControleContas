<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbHost = '';
$dbName = '';
$dbUser = '';
$dbPass = '';

try {
    $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro no servidor.']);
    exit;
}

$dados = json_decode(file_get_contents("php://input"));

if (isset($dados->email) && isset($dados->senha)) {
    $email = $dados->email;
    $senha = $dados->senha;

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);


    if ($usuario && password_verify($senha, $usuario['senha'])) {
        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Login realizado!",
            "usuario" => [
                "id" => $usuario['id'],
                "nome" => $usuario['nome']
            ]
        ]);
    } else {
        echo json_encode(["sucesso" => false, "mensagem" => "Email ou senha incorretos"]);
    }
} else {
    echo json_encode(["sucesso" => false, "mensagem" => "Dados incompletos"]);
}
?>