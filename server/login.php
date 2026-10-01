<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');

$body = read_json_body();
$passcode = is_string($body['passcode'] ?? null) ? $body['passcode'] : '';

if ($passcode === '' || !hash_equals(ADMIN_KEY, $passcode)) {
    json_error('Incorrect passcode', 401);
}

start_admin_session();
session_regenerate_id(true);
$_SESSION['admin_authenticated'] = true;

json_response(['ok' => true]);
