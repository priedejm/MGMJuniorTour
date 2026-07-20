<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('GET');

$rows = read_store('results');
usort($rows, fn($a, $b) => ($a['sort_order'] ?? 0) <=> ($b['sort_order'] ?? 0));
json_response($rows);
