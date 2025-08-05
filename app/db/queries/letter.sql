-- name: CreateLetter :one
INSERT INTO letter (
    session_id,
    buyer_name,
    buyer_address,
    buyer_email,
    seller_name,
    seller_address,
    purchase_date,
    product_name,
    order_reference,
    amount,
    defect_type,
    defect_description
) VALUES (
    sqlc.arg('session_id')::text,
    sqlc.arg('buyer_name')::text,
    sqlc.arg('buyer_address')::text,
    sqlc.narg('buyer_email')::text,
    sqlc.arg('seller_name')::text,
    sqlc.arg('seller_address')::text,
    sqlc.arg('purchase_date')::date,
    sqlc.arg('product_name')::text,
    sqlc.narg('order_reference')::text,
    sqlc.arg('amount')::numeric,
    sqlc.arg('defect_type')::defect_type_enum,
    sqlc.arg('defect_description')::text
)
RETURNING
    id,
    session_id,
    buyer_name,
    buyer_address,
    buyer_email,
    seller_name,
    seller_address,
    purchase_date,
    product_name,
    order_reference,
    amount,
    defect_type,
    defect_description,
    letter_content,
    status,
    created_at,
    updated_at;

-- name: GetLetterById :one
SELECT
    id,
    session_id,
    buyer_name,
    buyer_address,
    buyer_email,
    seller_name,
    seller_address,
    purchase_date,
    product_name,
    order_reference,
    amount,
    defect_type,
    defect_description,
    letter_content,
    status,
    created_at,
    updated_at
FROM letter
WHERE id = sqlc.arg('id')::uuid
LIMIT 1;

-- name: GetLettersBySession :many
SELECT
    id,
    session_id,
    buyer_name,
    buyer_address,
    buyer_email,
    seller_name,
    seller_address,
    purchase_date,
    product_name,
    order_reference,
    amount,
    defect_type,
    defect_description,
    letter_content,
    status,
    created_at,
    updated_at
FROM letter
WHERE session_id = sqlc.arg('session_id')::text
ORDER BY created_at DESC;

-- name: UpdateLetterContent :one
UPDATE letter
SET
    letter_content = sqlc.narg('letter_content')::text,
    status = sqlc.arg('status')::letter_status_enum,
    updated_at = now()
WHERE id = sqlc.arg('id')::uuid
RETURNING
    id,
    session_id,
    buyer_name,
    buyer_address,
    buyer_email,
    seller_name,
    seller_address,
    purchase_date,
    product_name,
    order_reference,
    amount,
    defect_type,
    defect_description,
    letter_content,
    status,
    created_at,
    updated_at;

-- name: UpdateLetterStatus :one
UPDATE letter
SET
    status = sqlc.arg('status')::letter_status_enum,
    updated_at = now()
WHERE id = sqlc.arg('id')::uuid
RETURNING
    id,
    session_id,
    buyer_name,
    buyer_address,
    buyer_email,
    seller_name,
    seller_address,
    purchase_date,
    product_name,
    order_reference,
    amount,
    defect_type,
    defect_description,
    letter_content,
    status,
    created_at,
    updated_at;

-- name: GetRecentLetters :many
SELECT
    id,
    session_id,
    buyer_name,
    buyer_address,
    buyer_email,
    seller_name,
    seller_address,
    purchase_date,
    product_name,
    order_reference,
    amount,
    defect_type,
    defect_description,
    letter_content,
    status,
    created_at,
    updated_at
FROM letter
ORDER BY created_at DESC
LIMIT sqlc.arg('page_size')::int OFFSET sqlc.arg('page_offset')::int;

-- name: DeleteLetter :exec
DELETE FROM letter
WHERE id = sqlc.arg('id')::uuid;

-- name: GetLetterWithPayments :many
SELECT
    l.id,
    l.session_id,
    l.buyer_name,
    l.buyer_address,
    l.buyer_email,
    l.seller_name,
    l.seller_address,
    l.purchase_date,
    l.product_name,
    l.order_reference,
    l.amount,
    l.defect_type,
    l.defect_description,
    l.letter_content,
    l.status,
    l.created_at,
    l.updated_at,
    p.id AS payment_id,
    p.amount AS payment_amount,
    p.status AS payment_status,
    p.service_type
FROM letter AS l
    LEFT JOIN payment AS p ON l.id = p.letter_id
WHERE l.id = sqlc.arg('id')::uuid;
