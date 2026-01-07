<?php
$DB_HOST = '';
$DB_NAME = '';
$DB_USER = '';
$DB_PASS = '';

try {
    $pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([ 'sucesso' => false, 'mensagem' => 'Erro de conexão com o banco: ' . $e->getMessage() ]);
    exit;
}

?>
