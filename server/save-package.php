<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

$body = read_json_body();

function str_list_field(array $data, string $key): array {
    $v = $data[$key] ?? [];
    if (!is_array($v)) json_error("Field '$key' must be an array", 422);
    return array_values(array_map(fn($x) => is_string($x) ? $x : json_error("Field '$key' entries must be strings", 422), $v));
}

function included_list_field(array $data, string $key): array {
    $v = $data[$key] ?? [];
    if (!is_array($v)) json_error("Field '$key' must be an array", 422);
    $out = [];
    foreach ($v as $item) {
        if (!is_array($item) || !isset($item['label']) || !is_string($item['label'])) {
            json_error("Field '$key' entries must have a string label", 422);
        }
        $entry = ['label' => $item['label']];
        if (!empty($item['note']) && is_string($item['note'])) $entry['note'] = $item['note'];
        $out[] = $entry;
    }
    return $out;
}

$row = [
    'slug' => str_field($body, 'slug', true, 120),
    'name' => str_field($body, 'name', true, 200),
    'price' => str_field($body, 'price', true, 60),
    'callout' => str_field($body, 'callout', false, 120),
    'image_url' => str_field($body, 'image_url', false, 2000),
    'description' => str_field($body, 'description', false, 5000),
    'features' => str_list_field($body, 'features'),
    'included' => included_list_field($body, 'included'),
    'bonuses' => str_list_field($body, 'bonuses'),
    'total_value' => str_field($body, 'total_value', false, 200),
    'disclaimer' => str_field($body, 'disclaimer', false, 2000),
    'featured' => bool_field($body, 'featured', false),
    'sort_order' => int_field($body, 'sort_order', 0),
];

$rows = read_store('packages');
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
    if (!$found) json_error('Package not found', 404);
} else {
    $id = uuid_v4();
    $rows[] = array_merge(['id' => $id], $row);
}

write_store('packages', $rows);
json_response(['ok' => true, 'id' => $id]);
