<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

$body = read_json_body();

function pricing_list_field(array $data, string $key): array {
    $v = $data[$key] ?? [];
    if (!is_array($v)) json_error("Field '$key' must be an array", 422);
    $out = [];
    foreach ($v as $item) {
        if (
            !is_array($item)
            || !isset($item['period'], $item['memberPrice'], $item['nonMemberPrice'])
            || !is_string($item['period'])
            || !is_string($item['memberPrice'])
            || !is_string($item['nonMemberPrice'])
        ) {
            json_error("Field '$key' entries must have period, memberPrice, and nonMemberPrice strings", 422);
        }
        $out[] = [
            'period' => $item['period'],
            'memberPrice' => $item['memberPrice'],
            'nonMemberPrice' => $item['nonMemberPrice'],
        ];
    }
    return $out;
}

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
    'pricing' => pricing_list_field($body, 'pricing'),
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
