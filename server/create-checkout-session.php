<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');

$body = read_json_body();
$cartItems = $body['items'] ?? null;
if (!is_array($cartItems) || empty($cartItems)) {
    json_error('Cart is empty', 422);
}

// Prices are never trusted from the client — every line item's price is
// re-derived here from the live packages/tournaments store, so a tampered
// request can't check out at an arbitrary price.
$packagesBySlug = [];
foreach (read_store('packages') as $p) {
    if (isset($p['slug'])) $packagesBySlug[$p['slug']] = $p;
}
$tournamentsBySlug = [];
foreach (read_store('tournaments') as $t) {
    if (isset($t['slug'])) $tournamentsBySlug[$t['slug']] = $t;
}

$lineItems = [];
foreach ($cartItems as $item) {
    if (!is_array($item)) json_error('Invalid cart item', 422);

    $quantity = $item['quantity'] ?? 1;
    if (!is_numeric($quantity) || $quantity < 1 || $quantity > 20) {
        json_error('Invalid quantity', 422);
    }

    if (($item['type'] ?? null) === 'tournament') {
        $tSlug = is_string($item['tournamentSlug'] ?? null) ? $item['tournamentSlug'] : null;
        if ($tSlug === null || !isset($tournamentsBySlug[$tSlug])) {
            json_error("Unknown tournament: " . ($tSlug ?? ''), 422);
        }
        $tournament = $tournamentsBySlug[$tSlug];
        $pricing = is_array($tournament['pricing'] ?? null) ? $tournament['pricing'] : [];

        $periodIndex = $item['periodIndex'] ?? null;
        if (!is_int($periodIndex) && !(is_numeric($periodIndex) && (int) $periodIndex == $periodIndex)) {
            json_error('Invalid registration period', 422);
        }
        $periodIndex = (int) $periodIndex;
        if ($periodIndex < 0 || $periodIndex >= count($pricing)) {
            json_error('Invalid registration period', 422);
        }

        $priceType = $item['priceType'] ?? null;
        if ($priceType !== 'memberPrice' && $priceType !== 'nonMemberPrice') {
            json_error('Invalid price type', 422);
        }

        $row = $pricing[$periodIndex];
        $unitAmount = price_string_to_cents((string) ($row[$priceType] ?? ''));
        if ($unitAmount <= 0) {
            json_error("Tournament '{$tSlug}' has no valid price configured for that period", 422);
        }

        $rateLabel = $priceType === 'memberPrice' ? 'Member/First-Time' : 'Non-Member/Returning';
        $productName = trim(($tournament['city'] ?? $tSlug) . ' — ' . ($row['period'] ?? '') . ' (' . $rateLabel . ')');

        $lineItems[] = [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => $productName,
                ],
                'unit_amount' => $unitAmount,
            ],
            'quantity' => (int) $quantity,
        ];
        continue;
    }

    $slug = is_string($item['slug'] ?? null) ? $item['slug'] : null;
    if ($slug === null || !isset($packagesBySlug[$slug])) {
        json_error("Unknown package: " . ($slug ?? ''), 422);
    }

    $pkg = $packagesBySlug[$slug];
    $unitAmount = price_string_to_cents((string) ($pkg['price'] ?? ''));
    if ($unitAmount <= 0) {
        json_error("Package '{$slug}' has no valid price configured", 422);
    }

    $lineItems[] = [
        'price_data' => [
            'currency' => 'usd',
            'product_data' => [
                'name' => $pkg['name'] ?? $slug,
            ],
            'unit_amount' => $unitAmount,
        ],
        'quantity' => (int) $quantity,
    ];
}

$session = stripe_request('POST', 'checkout/sessions', [
    'mode' => 'payment',
    'line_items' => $lineItems,
    'shipping_address_collection' => ['allowed_countries' => ['US']],
    'success_url' => SITE_URL . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => SITE_URL . '/cart',
]);

json_response(['ok' => true, 'url' => $session['url'] ?? null]);
