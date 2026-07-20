<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

$body = read_json_body();
$id = str_field($body, 'id', true, 200);

$tournaments = array_values(array_filter(
    read_store('tournaments'),
    fn($r) => ($r['id'] ?? null) !== $id,
));
write_store('tournaments', $tournaments);

// Cascade: drop any result linked to this tournament, matching the old FK
// ON DELETE CASCADE behavior.
$results = array_values(array_filter(
    read_store('results'),
    fn($r) => ($r['tournament_id'] ?? null) !== $id,
));
write_store('results', $results);

json_response(['ok' => true]);
