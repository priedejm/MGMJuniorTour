<?php
declare(strict_types=1);

/**
 * Minimal Stripe REST API client using cURL — no SDK/Composer dependency,
 * matching this backend's existing dependency-free style. Stripe's API
 * accepts standard form-encoded requests with bracket-notation for nested
 * params, which PHP's http_build_query() produces natively from a nested
 * array, so no request-building library is needed.
 */
function stripe_request(string $method, string $endpoint, array $params = []): array {
    $url = "https://api.stripe.com/v1/{$endpoint}";
    if ($method === 'GET' && !empty($params)) {
        $url .= '?' . http_build_query($params);
    }

    $ch = curl_init($url);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . STRIPE_SECRET_KEY,
        ],
        CURLOPT_TIMEOUT => 15,
    ];
    if ($method === 'POST') {
        $opts[CURLOPT_POSTFIELDS] = http_build_query($params);
    }
    curl_setopt_array($ch, $opts);

    $response = curl_exec($ch);
    if ($response === false) {
        $err = curl_error($ch);
        curl_close($ch);
        json_error("Stripe request failed: $err", 502);
    }
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $data = json_decode((string) $response, true);
    if ($status >= 400) {
        $msg = is_array($data) ? ($data['error']['message'] ?? 'Stripe API error') : 'Stripe API error';
        json_error($msg, 502);
    }
    return is_array($data) ? $data : [];
}

/**
 * Verifies a Stripe webhook's Stripe-Signature header against the raw
 * request body, without the SDK. See:
 * https://stripe.com/docs/webhooks#verify-manually
 */
function stripe_verify_webhook_signature(string $payload, string $sigHeader, string $secret): bool {
    $parts = [];
    foreach (explode(',', $sigHeader) as $pair) {
        [$k, $v] = array_pad(explode('=', $pair, 2), 2, null);
        if ($k === null || $v === null) continue;
        $parts[$k][] = $v;
    }
    $timestamp = $parts['t'][0] ?? null;
    $signatures = $parts['v1'] ?? [];
    if (!$timestamp || empty($signatures)) return false;

    // Reject replayed/stale events (more than 5 minutes old).
    if (abs(time() - (int) $timestamp) > 300) return false;

    $expected = hash_hmac('sha256', $timestamp . '.' . $payload, $secret);

    foreach ($signatures as $sig) {
        if (hash_equals($expected, (string) $sig)) return true;
    }
    return false;
}

/** Parses a display price like "$2,995" or "$99" into integer cents. */
function price_string_to_cents(string $price): int {
    $clean = preg_replace('/[^0-9.]/', '', $price) ?? '';
    return (int) round(((float) $clean) * 100);
}
