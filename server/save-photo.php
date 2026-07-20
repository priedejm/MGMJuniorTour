<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

$body = read_json_body();

$row = [
    'image_url' => str_field($body, 'image_url', true, 2000),
    'caption' => str_field($body, 'caption', false, 500),
    'sort_order' => int_field($body, 'sort_order', 0),
];

$rows = read_store('photos');
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
    if (!$found) json_error('Photo not found', 404);
} else {
    $id = uuid_v4();
    $rows[] = array_merge(['id' => $id], $row);
}

write_store('photos', $rows);
json_response(['ok' => true, 'id' => $id]);
