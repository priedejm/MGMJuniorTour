<?php
// Copy this file to config.php and set a real secret before deploying.
// The same value must also be set as VITE_ADMIN_KEY in .env (frontend build)
// so the admin login passcode matches the X-Admin-Key header this backend
// checks. This is intentionally NOT strong security — the key ships inside
// the built JS bundle and is readable by anyone who opens dev tools. It only
// deters casual abuse of the admin endpoints, not a determined attacker.
define('ADMIN_KEY', 'change-me');

define('DATA_DIR', __DIR__ . '/data');
define('UPLOAD_DIR', __DIR__ . '/assets/uploaded');
define('UPLOAD_URL_BASE', '/assets/uploaded');
