-- name: CreateLetter :one
INSERT INTO letter (
    buyer_name,
    buyer_address,
    buyer_email,
    seller_name,
    seller_address,
    purchase_date,
    product_name,
    order_reference,
    product_price,
    defect_type,
    defect_description,
    used
) VALUES (
    @buyer_name::text,
    @buyer_address::text,
    sqlc.narg('buyer_email')::text,
    @seller_name::text,
    @seller_address::text,
    @purchase_date::date,
    @product_name::text,
    sqlc.narg('order_reference')::text,
    @product_price::numeric,
    @defect_type::defect_type_enum,
    @defect_description::text,
    @used::boolean
)
RETURNING *;

-- name: GetLetterById :one
SELECT *
FROM letter
WHERE id = @id::uuid
LIMIT 1;

-- name: UpdateContent :one
UPDATE letter
SET
    content = sqlc.narg('content')::text,
    status = @status::letter_status_enum,
    updated_at = now()
WHERE id = @id::uuid
RETURNING *;

-- name: UpdateLetterStatus :one
UPDATE letter
SET
    status = @status::letter_status_enum,
    updated_at = now()
WHERE id = @id::uuid
RETURNING *;

-- name: ListLetters :many
SELECT *
FROM letter
ORDER BY created_at DESC
LIMIT @page_size::int OFFSET @page_offset::int;

-- name: DeleteLetter :exec
DELETE FROM letter
WHERE id = @id::uuid;
