<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Requisição inválida']);
    exit;
}

$nome = trim($input['nome'] ?? '');
$email = trim($input['email'] ?? '');
$senha = $input['senha'] ?? '';

if (!$nome || !$email || !$senha) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Preencha todos os campos.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Email inválido.']);
    exit;
}


$dbHost = '';
$dbName = '';
$dbUser = '';
$dbPass = '';

try {
    $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // Verifica email existente (tabela `usuarios`)
    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Email já cadastrado.']);
        exit;
    }

    // Insere usuário (use password_hash)
    $hash = password_hash($senha, PASSWORD_DEFAULT);
    $ins = $pdo->prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
    $ins->execute([$nome, $email, $hash]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Cadastro realizado com sucesso.']);
} catch (Exception $e) {
    error_log('Cadastro error: ' . $e->getMessage());
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro no servidor.']);
}

?>
