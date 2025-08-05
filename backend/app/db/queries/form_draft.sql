-- name: CreateDraft :one
INSERT INTO form_draft (
    form_slug,
    data
)
VALUES (
    @form_slug::text,
    @data::jsonb
)
RETURNING
    id,
    form_slug,
    data,
    status,
    created_at,
    updated_at,
    last_event;

-- name: GetDraft :one
SELECT
    id,
    form_slug,
    data,
    status,
    created_at,
    updated_at,
    last_event
FROM form_draft
WHERE id = @id::uuid
LIMIT 1;

-- name: UpdateDraftData :exec
UPDATE form_draft
SET
    data = @data::jsonb,
    last_event = sqlc.narg('last_event')::text,
    updated_at = now()
WHERE id = @id::uuid;

-- name: MarkDraftSubmitted :exec
UPDATE form_draft
SET
    status = 'submitted',
    updated_at = now()
WHERE id = @id::uuid;

-- name: AddDraftEvent :exec
INSERT INTO form_draft_event (
    draft_id,
    event_type,
    meta
)
VALUES (
    @draft_id::uuid,
    @event_type::form_draft_event_type,
    @meta::jsonb
);
