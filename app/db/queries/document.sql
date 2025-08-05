-- name: CreateDocument :one
INSERT INTO document (
    letter_id,
    original_filename,
    stored_filename,
    file_path,
    content_type,
    file_size,
    processing_status
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
) RETURNING *;

-- name: GetDocumentById :one
SELECT * FROM document
WHERE id = $1;

-- name: GetDocumentsByLetter :many
SELECT * FROM document
WHERE letter_id = $1
ORDER BY created_at DESC;

-- name: UpdateDocumentOcrResult :one
UPDATE document
SET
    extracted_data = $2,
    processing_status = $3
WHERE id = $1
RETURNING *;

-- name: GetPendingDocuments :many
SELECT * FROM document
WHERE processing_status = 'pending'
ORDER BY created_at ASC
LIMIT $1;

-- name: GetCompletedDocuments :many
SELECT * FROM document
WHERE processing_status = 'completed'
ORDER BY created_at DESC;
