<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

$body = read_json_body();

$images = $body['images'] ?? [];
if (!is_array($images)) json_error("Field 'images' must be an array", 422);
$images = array_values(array_map(
    fn($x) => is_string($x) ? $x : json_error("Field 'images' entries must be strings", 422),
    $images,
));

$tournamentId = null;
if (array_key_exists('tournament_id', $body) && $body['tournament_id'] !== null && $body['tournament_id'] !== '') {
    if (!is_string($body['tournament_id'])) json_error("Field 'tournament_id' must be a string", 422);
    $tournamentId = $body['tournament_id'];
}

$row = [
    'tournament_id' => $tournamentId,
    'tournament_name' => str_field($body, 'tournament_name', true, 200),
    'date' => str_field($body, 'date', true, 20),
    'location' => str_field($body, 'location', false, 200),
    'results_url' => str_field($body, 'results_url', false, 500),
    'sort_order' => int_field($body, 'sort_order', 0),
    'images' => $images,
];

$rows = read_store('results');
$id = is_string($body['id'] ?? null) && $body['id'] !== '' ? $body['id'] : null;

// Mirror the old unique-per-tournament constraint: at most one result per
// tournament_id, matching UI expectations (Add Results vs. Edit Result).
if ($tournamentId !== null) {
    foreach ($rows as $r) {
        if (($r['tournament_id'] ?? null) === $tournamentId && ($r['id'] ?? null) !== $id) {
            json_error('A result already exists for this tournament', 409);
        }
    }
}

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
    if (!$found) json_error('Result not found', 404);
} else {
    $id = uuid_v4();
    $rows[] = array_merge(['id' => $id], $row);
}

write_store('results', $rows);
json_response(['ok' => true, 'id' => $id]);
