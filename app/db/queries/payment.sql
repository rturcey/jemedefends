-- name: CreatePayment :one
INSERT INTO payment (
    letter_id,
    stripe_payment_intent_id,
    stripe_checkout_session_id,
    amount,
    currency,
    service_type,
    status,
    customer_email
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING *;

-- name: GetPaymentById :one
SELECT * FROM payment
WHERE id = $1;

-- name: GetPaymentByStripeIntentId :one
SELECT * FROM payment
WHERE stripe_payment_intent_id = $1;

-- name: GetPaymentBySessionId :one
SELECT * FROM payment
WHERE stripe_checkout_session_id = $1;

-- name: UpdatePaymentStatus :one
UPDATE payment
SET
    status = $2,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: GetPaymentsByLetter :many
SELECT * FROM payment
WHERE letter_id = $1
ORDER BY created_at DESC;

-- name: GetSuccessfulPayments :many
SELECT * FROM payment
WHERE status = 'succeeded'
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;
