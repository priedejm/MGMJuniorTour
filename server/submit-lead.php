<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

// Public — anyone can submit a lead from the /join page. No admin header
// required, mirroring the old anon-INSERT-only RLS policy.
require_method('POST');

$body = read_json_body();

$fullName = str_field($body, 'full_name', true, 120);
$email = str_field($body, 'email', true, 255);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('A valid email is required', 422);
}

$row = [
    'id' => uuid_v4(),
    'full_name' => $fullName,
    'email' => $email,
    'state' => str_field($body, 'state', false, 60),
    'junior_ages' => str_field($body, 'junior_ages', false, 200),
    'source' => str_field($body, 'source', false, 60),
    'created_at' => gmdate('c'),
];

$rows = read_store('leads');
$rows[] = $row;
write_store('leads', $rows);

json_response(['ok' => true]);
