<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

$body = read_json_body();

$row = [
    'slug' => str_field($body, 'slug', true, 120),
    'dates_label' => str_field($body, 'dates_label', true, 120),
    'city' => str_field($body, 'city', true, 120),
    'tee_time' => str_field($body, 'tee_time', false, 60, 'TBA'),
    'course' => str_field($body, 'course', true, 200),
    'month' => str_field($body, 'month', true, 40),
    'year' => int_field($body, 'year', 2026),
    'tbd' => bool_field($body, 'tbd', false),
    'sort_order' => int_field($body, 'sort_order', 0),
];

$rows = read_store('tournaments');
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
    if (!$found) json_error('Tournament not found', 404);
} else {
    $id = uuid_v4();
    $rows[] = array_merge(['id' => $id], $row);
}

write_store('tournaments', $rows);
json_response(['ok' => true, 'id' => $id]);
