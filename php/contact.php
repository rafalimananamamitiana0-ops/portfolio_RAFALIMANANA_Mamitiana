<?php
/* ============================================================
   TRAITEMENT DU FORMULAIRE DE CONTACT
   - Reçoit les données POST du formulaire
   - Valide les champs
   - Envoie un email à VOTRE adresse
   - Renvoie une réponse JSON pour le JS AJAX
   ============================================================ */
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


header('Content-Type: application/json; charset=utf-8');

// === CONFIGURATION ===
$destinataire = "rafalimananamamitiana0@gmail.com";   // <-- METTEZ VOTRE EMAIL ICI
$sujet_prefix = "[Portfolio] ";

// === Vérifier méthode POST ===
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// === Récupérer + nettoyer les données ===
$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

// === Validation ===
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
    exit;
}
if (strlen($message) < 10) {
    echo json_encode(['success' => false, 'message' => 'Le message est trop court (min. 10 caractères).']);
    exit;
}

// === Préparation de l'email ===
$sujet_mail = $sujet_prefix . $subject;
$corps  = "Nouveau message depuis votre portfolio\n";
$corps .= "=====================================\n\n";
$corps .= "Nom    : $name\n";
$corps .= "Email  : $email\n";
$corps .= "Sujet  : $subject\n\n";
$corps .= "Message :\n$message\n\n";
$corps .= "=====================================\n";
$corps .= "Envoyé le : " . date('d/m/Y H:i:s') . "\n";
$corps .= "IP        : " . ($_SERVER['REMOTE_ADDR'] ?? 'inconnue') . "\n";

$headers  = "From: Portfolio <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . ">\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// === Envoi ===
// === Envoi avec PHPMailer ===
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = getenv('GMAIL_USERNAME');
    $mail->Password = getenv('GMAIL_APP_PASSWORD');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->CharSet = 'UTF-8';

    $mail->setFrom('rafalimananamamitiana0@gmail.com', 'Portfolio');
    $mail->addAddress($destinataire);

    $mail->addReplyTo($email, $name);

    $mail->Subject = $sujet_mail;
    $mail->Body = $corps;

    $mail->send();

    $envoyé = true;

} catch (Exception $e) {
    $envoyé = false;
    $erreur = $mail->ErrorInfo;
}


// === (Optionnel) sauvegarde locale en fichier .log ===
$log = __DIR__ . '/messages.log';
$ligne = "[" . date('Y-m-d H:i:s') . "] $name <$email> | $subject\n$message\n----\n";
@file_put_contents($log, $ligne, FILE_APPEND);

if ($envoyé) {
    echo json_encode([
        'success' => true,
        'message' => 'Merci ! Votre message a bien été envoyé.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur envoi email : ' . ($erreur ?? 'Erreur inconnue')
    ]);
}


var_dump(getenv('GMAIL_USERNAME'));
var_dump(getenv('GMAIL_APP_PASSWORD'));
exit;