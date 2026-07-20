<?php
declare(strict_types=1);

function json_response(mixed $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $status = 400): never {
    json_response(['error' => $message], $status);
}

function read_json_body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $data = json_decode($raw, true);
    if (!is_array($data)) json_error('Invalid JSON body', 400);
    return $data;
}

function require_method(string $method): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        json_error('Method not allowed', 405);
    }
}

function str_field(array $data, string $key, bool $required = true, int $max = 2000, string $default = ''): string {
    $v = $data[$key] ?? null;
    if ($v === null || $v === '') {
        if ($required) json_error("Field '$key' is required", 422);
        return $default;
    }
    if (!is_string($v)) json_error("Field '$key' must be a string", 422);
    $v = trim($v);
    if (strlen($v) > $max) json_error("Field '$key' is too long", 422);
    return $v;
}

function int_field(array $data, string $key, int $default = 0): int {
    $v = $data[$key] ?? $default;
    if (!is_numeric($v)) json_error("Field '$key' must be a number", 422);
    return (int) $v;
}

function bool_field(array $data, string $key, bool $default = false): bool {
    $v = $data[$key] ?? $default;
    return $v === true || $v === 'true' || $v === 1 || $v === '1';
}
