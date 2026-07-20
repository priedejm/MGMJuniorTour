<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME_EXT = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];

$entity = $_POST['entity'] ?? '';
if (!is_string($entity) || !preg_match('/^[a-z]+$/', $entity)) {
    json_error('Invalid entity', 422);
}
$allowedEntities = ['tournaments', 'packages', 'photos', 'results', 'misc'];
if (!in_array($entity, $allowedEntities, true)) {
    json_error('Unknown entity', 422);
}

$entityId = $_POST['entityId'] ?? 'new';
if (!is_string($entityId) || !preg_match('/^[a-zA-Z0-9_-]+$/', $entityId)) {
    json_error('Invalid entityId', 422);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] === UPLOAD_ERR_NO_FILE) {
    json_error('No file uploaded', 422);
}
$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    json_error('Upload failed', 422);
}
if ($file['size'] <= 0) {
    json_error('Empty file', 422);
}
if ($file['size'] > MAX_BYTES) {
    $mb = round($file['size'] / 1024 / 1024, 1);
    json_error("Image is too large ({$mb} MB) — max 8 MB", 422);
}

// Validate it's really an image (not just extension/MIME spoofing) and pin
// down the real MIME type from the file's own header bytes.
$info = @getimagesize($file['tmp_name']);
if ($info === false || !isset($info['mime']) || !isset(ALLOWED_MIME_EXT[$info['mime']])) {
    json_error('Only JPEG, PNG, or WebP images are allowed', 422);
}
$ext = ALLOWED_MIME_EXT[$info['mime']];

// Never trust the client filename — generate it server-side.
$generatedName = uuid_v4() . '.' . $ext;

$folder = UPLOAD_DIR . '/' . $entity . '-' . $entityId;
if (!is_dir($folder) && !mkdir($folder, 0775, true) && !is_dir($folder)) {
    json_error('Failed to create upload folder', 500);
}

$destination = $folder . '/' . $generatedName;
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    json_error('Failed to save uploaded file', 500);
}

$url = UPLOAD_URL_BASE . '/' . $entity . '-' . $entityId . '/' . $generatedName;
json_response(['ok' => true, 'url' => $url, 'path' => $entity . '-' . $entityId . '/' . $generatedName]);
