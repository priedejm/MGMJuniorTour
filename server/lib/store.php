<?php
declare(strict_types=1);

function store_path(string $name): string {
    return DATA_DIR . '/' . $name . '.json';
}

/** Shared-lock read of a flat JSON array store. Returns [] if missing/empty. */
function read_store(string $name): array {
    $path = store_path($name);
    if (!file_exists($path)) return [];
    $fh = fopen($path, 'r');
    if ($fh === false) return [];
    $data = [];
    if (flock($fh, LOCK_SH)) {
        $raw = stream_get_contents($fh);
        flock($fh, LOCK_UN);
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) $data = $decoded;
    }
    fclose($fh);
    return $data;
}

/** Exclusive-lock overwrite of a flat JSON array store. */
function write_store(string $name, array $data): void {
    if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0775, true);
    $path = store_path($name);
    $fh = fopen($path, 'c+');
    if ($fh === false) json_error('Failed to open data store', 500);
    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        json_error('Failed to lock data store', 500);
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode(array_values($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
}

function uuid_v4(): string {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    $hex = bin2hex($data);
    return sprintf(
        '%s-%s-%s-%s-%s',
        substr($hex, 0, 8),
        substr($hex, 8, 4),
        substr($hex, 12, 4),
        substr($hex, 16, 4),
        substr($hex, 20, 12),
    );
}
