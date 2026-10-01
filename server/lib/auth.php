<?php
declare(strict_types=1);

/** Starts (or resumes) the admin session with hardened cookie params.
 * Safe to call multiple times per request. */
function start_admin_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']),
        'samesite' => 'Lax',
    ]);
    session_start();
}

function is_admin_authenticated(): bool {
    start_admin_session();
    return !empty($_SESSION['admin_authenticated']);
}

/** Verifies the current request carries an authenticated admin session. */
function require_admin(): void {
    if (!is_admin_authenticated()) {
        json_error('Unauthorized', 401);
    }
}
