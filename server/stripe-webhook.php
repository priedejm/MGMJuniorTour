<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

require_method('POST');

// Stripe authenticates this request via the signature below, not a
// session/admin key — this endpoint is called by Stripe's servers, not
// by a logged-in browser.
$payload = file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if ($payload === false || !stripe_verify_webhook_signature($payload, $sigHeader, STRIPE_WEBHOOK_SECRET)) {
    json_error('Invalid signature', 400);
}

$event = json_decode($payload, true);
if (!is_array($event)) json_error('Invalid payload', 400);

if (($event['type'] ?? '') === 'checkout.session.completed') {
    $session = $event['data']['object'] ?? [];
    $sessionId = is_string($session['id'] ?? null) ? $session['id'] : '';

    // Line items aren't included on the session object itself — fetch them.
    $items = [];
    if ($sessionId !== '') {
        $lineItemsResp = stripe_request('GET', "checkout/sessions/{$sessionId}/line_items", []);
        foreach ($lineItemsResp['data'] ?? [] as $li) {
            $items[] = [
                'name' => $li['description'] ?? '',
                'quantity' => $li['quantity'] ?? 1,
                'amount' => $li['amount_total'] ?? 0,
            ];
        }
    }

    $orders = read_store('orders');

    // Stripe may retry webhook delivery — don't record the same session twice.
    $alreadyRecorded = false;
    foreach ($orders as $o) {
        if (($o['stripe_session_id'] ?? null) === $sessionId) {
            $alreadyRecorded = true;
            break;
        }
    }

    if (!$alreadyRecorded) {
        $orders[] = [
            'id' => uuid_v4(),
            'stripe_session_id' => $sessionId,
            'customer_email' => $session['customer_details']['email'] ?? '',
            'customer_name' => $session['customer_details']['name'] ?? '',
            'amount_total' => $session['amount_total'] ?? 0,
            'currency' => $session['currency'] ?? 'usd',
            'items' => $items,
            'status' => 'paid',
            'created_at' => date('c'),
        ];
        write_store('orders', $orders);
    }
}

json_response(['received' => true]);
