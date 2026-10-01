<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

$body = read_json_body();

$row = [
    'name' => str_field($body, 'name', true, 200),
    'logo_url' => str_field($body, 'logo_url', false, 2000),
    'website_url' => str_field($body, 'website_url', true, 500),
    'description' => str_field($body, 'description', false, 1000),
    'sort_order' => int_field($body, 'sort_order', 0),
];

$rows = read_store('partners');
$id = is_string($body['id'] ?? null) && $body['id'] !== '' ? $body['id'] : null;

if ($id !== null) {
    $found = false;
    foreach ($rows as &$r) {
        if (($r['id'] ?? null) === $id) {
            $r = array_merge($r, $row, ['id' => $id]);
            $found = true;
            break;
        }
    }
    unset($r);
    if (!$found) json_error('Partner not found', 404);
} else {
    $id = uuid_v4();
    $rows[] = array_merge(['id' => $id], $row);
}

write_store('partners', $rows);
json_response(['ok' => true, 'id' => $id]);
