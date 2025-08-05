-- name: CreateDraft :one
INSERT INTO form_draft (
    form_slug,
    data,
    last_ip,
    ua
)
VALUES (
    sqlc.arg('form_slug')::text,
    sqlc.arg('data')::jsonb,
    sqlc.narg('last_ip')::inet,
    sqlc.narg('ua')::text
)
RETURNING
    id,
    form_slug,
    data,
    status,
    created_at,
    updated_at,
    last_event,
    last_ip,
    ua;

-- name: GetDraft :one
SELECT
    id,
    form_slug,
    data,
    status,
    created_at,
    updated_at,
    last_event,
    last_ip,
    ua
FROM form_draft
WHERE id = sqlc.arg('id')::uuid
LIMIT 1;

-- name: UpdateDraftData :exec
UPDATE form_draft
SET
    data = sqlc.arg('data')::jsonb,
    last_event = sqlc.narg('last_event')::text,
    updated_at = now()
WHERE id = sqlc.arg('id')::uuid;

-- name: MarkDraftSubmitted :exec
UPDATE form_draft
SET
    status = 'submitted',
    updated_at = now()
WHERE id = sqlc.arg('id')::uuid;

-- name: AddDraftEvent :exec
INSERT INTO form_draft_event (
    draft_id,
    event_type,
    meta
)
VALUES (
    sqlc.arg('draft_id')::uuid,
    sqlc.arg('event_type')::form_draft_event_type,
    sqlc.arg('meta')::jsonb
);
