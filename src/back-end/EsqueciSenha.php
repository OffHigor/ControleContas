<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'PHPEMAIL/Exception.php';
require 'PHPEMAIL/PHPMailer.php';
require 'PHPEMAIL/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$host = ''; 
$db = ''; 
$user = ''; 
$pass = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["sucesso" => false, "mensagem" => "Erro conexão Banco"]));
}

$dados = json_decode(file_get_contents("php://input"));

$action = $dados->action ?? 'send_code';
$emailDestino = $dados->email ?? null;

if (!$action || !$emailDestino) {
    echo json_encode(["sucesso" => false, "mensagem" => "Requisição inválida."]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, nome, reset_token, reset_expira FROM usuarios WHERE email = ?");
$stmt->execute([$emailDestino]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$usuario) {
    echo json_encode(["sucesso" => false, "mensagem" => "E-mail não cadastrado."]);
    exit;
}

if ($action === 'send_code') {
    $token = rand(100000, 999999);
    $sql = "UPDATE usuarios SET reset_token = ?, reset_expira = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE email = ?";
    $pdo->prepare($sql)->execute([$token, $emailDestino]);

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'onfirewz@gmail.com';
        $mail->Password   = 'ffny hvyq eblu tofs';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->setFrom('onfirewz@gmail.com', 'Sistema Login');
        $mail->addAddress($emailDestino, $usuario['nome']);
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Recuperação de Senha';
        $mail->Body    = "<h3>Olá, {$usuario['nome']}</h3><p>Seu código é: <b style='font-size:20px;'>$token</b></p>";
        $mail->send();
        echo json_encode(["sucesso" => true, "mensagem" => "Código enviado para o e-mail!"]);
    } catch (Exception $e) {
        error_log('EsqueciSenha send_code error: ' . $e->getMessage());
        echo json_encode(["sucesso" => false, "mensagem" => "Erro ao enviar código."]);
    }
    exit;
}

if ($action === 'verify_code') {
    $codigo = $dados->codigo ?? null;
    if (!$codigo) {
        echo json_encode(["sucesso" => false, "mensagem" => "Código não informado."]);
        exit;
    }
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND reset_token = ? AND reset_expira > NOW() LIMIT 1");
    $stmt->execute([$emailDestino, $codigo]);
    if ($stmt->fetch()) {
        echo json_encode(["sucesso" => true, "mensagem" => "Código válido."]);
    } else {
        echo json_encode(["sucesso" => false, "mensagem" => "Código inválido ou expirado."]);
    }
    exit;
}

if ($action === 'reset_password') {
    $codigo = $dados->codigo ?? null;
    $novaSenha = $dados->senha ?? null;
    if (!$codigo || !$novaSenha) {
        echo json_encode(["sucesso" => false, "mensagem" => "Dados incompletos."]);
        exit;
    }
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND reset_token = ? AND reset_expira > NOW() LIMIT 1");
    $stmt->execute([$emailDestino, $codigo]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode(["sucesso" => false, "mensagem" => "Código inválido ou expirado."]);
        exit;
    }
    // Atualiza senha e limpa token
    $hash = password_hash($novaSenha, PASSWORD_DEFAULT);
    $upd = $pdo->prepare("UPDATE usuarios SET senha = ?, reset_token = NULL, reset_expira = NULL WHERE id = ?");
    $upd->execute([$hash, $row['id']]);
    echo json_encode(["sucesso" => true, "mensagem" => "Senha alterada com sucesso."]);
    exit;
}
?>