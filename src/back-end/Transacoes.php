<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
    if ($userId <= 0) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'mensagem' => 'user_id obrigatório']);
        exit;
    }
    try {
        $stmt = $pdo->prepare('SELECT * FROM transacoes WHERE user_id = :uid ORDER BY date DESC');
        $stmt->execute([':uid' => $userId]);
        $rows = $stmt->fetchAll();
        echo json_encode($rows);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro lendo transações: ' . $e->getMessage()]);
        exit;
    }
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Requisição inválida']);
    exit;
}

$userId = isset($input['user_id']) ? (int)$input['user_id'] : 0;
$nome = isset($input['nome']) ? $input['nome'] : null;
$valor = isset($input['valor']) ? (float)$input['valor'] : 0;
$descricao = isset($input['descricao']) ? $input['descricao'] : null;
$tipo = isset($input['tipo']) ? $input['tipo'] : 'saida';
$categorias = isset($input['categorias']) ? $input['categorias'] : [];
$date = isset($input['date']) ? $input['date'] : date('Y-m-d H:i:s');

if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'user_id obrigatório']);
    exit;
}

try {
    $stmt = $pdo->prepare('INSERT INTO transacoes (user_id, nome, valor, descricao, tipo, categorias, date) VALUES (:user_id, :nome, :valor, :descricao, :tipo, :categorias, :date)');
    $stmt->execute([
        ':user_id' => $userId,
        ':nome' => $nome,
        ':valor' => $valor,
        ':descricao' => $descricao,
        ':tipo' => $tipo,
        ':categorias' => json_encode($categorias, JSON_UNESCAPED_UNICODE),
        ':date' => $date,
    ]);
    echo json_encode(['sucesso' => true, 'id' => $pdo->lastInsertId()]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao salvar transação: ' . $e->getMessage()]);
    exit;
}
