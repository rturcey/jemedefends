import dataclasses
import enum
import uuid
from typing import Any


class DraftStatus(str, enum.Enum):
    EDITING = "editing"
    SUBMITTED = "submitted"
    ABANDONED = "abandoned"
    EXPIRED = "expired"


class DraftEventType(str, enum.Enum):
    BASIC_DOWNLOAD = "basic_download"
    PREVIEW_VIEW = "preview_view"
    PDF_DOWNLOAD = "pdf_download"
    PREMIUM_CHECKOUT = "premium_checkout"
    PREMIUM_PAID = "premium_paid"


@dataclasses.dataclass()
class FormDraft:
    id: uuid.UUID
    form_slug: str
    data: dict[str, Any]
    status: DraftStatus = DraftStatus.EDITING
    created_at: str | None = None
    updated_at: str | None = None
    last_event: str | None = None


@dataclasses.dataclass()
class DraftEvent:
    id: uuid.UUID
    draft_id: uuid.UUID
    event_type: DraftEventType
    meta: dict[str, Any]


@dataclasses.dataclass(frozen=True)
class DraftUpdateResult:
    draft: FormDraft
    saved: bool
