<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('GET');
require_admin();

$rows = read_store('leads');
usort($rows, fn($a, $b) => strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''));
json_response($rows);
