<?php
declare(strict_types=1);

/** Verifies the X-Admin-Key header against the shared secret. Not real
 * security — see the note in config.example.php. */
function require_admin(): void {
    $key = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    if (!is_string($key) || $key === '' || !hash_equals(ADMIN_KEY, $key)) {
        json_error('Unauthorized', 401);
    }
}
