-- name: CreatePostalDelivery :one
INSERT INTO postal_delivery (
    letter_id,
    payment_id,
    provider,
    recipient_name,
    recipient_address,
    status
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: GetPostalDeliveryById :one
SELECT * FROM postal_delivery
WHERE id = $1;

-- name: GetPostalDeliveriesByLetter :many
SELECT * FROM postal_delivery
WHERE letter_id = $1
ORDER BY created_at DESC;

-- name: UpdatePostalDeliveryTracking :one
UPDATE postal_delivery
SET
    provider_delivery_id = $2,
    tracking_number = $3,
    status = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: UpdatePostalDeliveryStatus :one
UPDATE postal_delivery
SET
    status = $2,
    sent_at = CASE WHEN $2 = 'sent' THEN NOW() ELSE sent_at END,
    delivered_at = CASE WHEN $2 = 'delivered' THEN NOW() ELSE delivered_at END,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: GetPendingDeliveries :many
SELECT * FROM postal_delivery
WHERE status = 'pending'
ORDER BY created_at ASC;
