<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');
require_admin();

$body = read_json_body();
$id = str_field($body, 'id', true, 200);

$rows = array_values(array_filter(
    read_store('results'),
    fn($r) => ($r['id'] ?? null) !== $id,
));
write_store('results', $rows);

json_response(['ok' => true]);
