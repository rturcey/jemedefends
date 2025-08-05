-- name: CreateLetter :one
INSERT INTO letter (
    buyer_name,
    buyer_email,
    buyer_address_line_1,
    buyer_address_line_2,
    buyer_postal_code,
    buyer_city,
    buyer_country,
    seller_name,
    seller_address_line_1,
    seller_address_line_2,
    seller_postal_code,
    seller_city,
    seller_country,
    purchase_date,
    product_name,
    order_reference,
    product_price,
    defect_type,
    defect_description,
    used,
    digital
) VALUES (
    @buyer_name::text,
    sqlc.narg(buyer_email)::text,
    @buyer_address_line_1::text,
    sqlc.narg(buyer_address_line_2)::text,
    @buyer_postal_code::text,
    @buyer_city::text,
    @buyer_country::text,
    @seller_name::text,
    @seller_address_line_1::text,
    sqlc.narg(seller_address_line_2)::text,
    @seller_postal_code::text,
    @seller_city::text,
    @seller_country::text,
    @purchase_date::date,
    @product_name::text,
    sqlc.narg(order_reference)::text,
    @product_price::numeric,
    @defect_type::defect_type_enum,
    @defect_description::text,
    @used::boolean,
    @digital::boolean
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
