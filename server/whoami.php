<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('GET');

json_response(['authenticated' => is_admin_authenticated()]);
