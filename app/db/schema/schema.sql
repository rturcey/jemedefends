-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension for timestamps
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Enums for better type safety and constraints
-- IMPORTANT: Les enums DOIVENT être créés AVANT les tables qui les utilisent
CREATE TYPE defect_type_enum AS ENUM (
    'malfunction',
    'non_conformity',
    'delivery_issue',
    'warranty_refusal',
    'other'
);

CREATE TYPE letter_status_enum AS ENUM (
    'draft',
    'generated',
    'pdf_created',
    'sent'
);

CREATE TYPE processing_status_enum AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);

CREATE TYPE service_type_enum AS ENUM (
    'pdf_only',
    'pdf_and_postal'
);

CREATE TYPE payment_status_enum AS ENUM (
    'pending',
    'processing',
    'succeeded',
    'failed',
    'canceled'
);

CREATE TYPE postal_status_enum AS ENUM (
    'pending',
    'sent',
    'in_transit',
    'delivered',
    'failed'
);

-- Letter table - Core entity for demand letters
CREATE TABLE letter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL, -- Cookie-based session tracking

    -- Buyer information
    buyer_name VARCHAR(255) NOT NULL,
    buyer_address TEXT NOT NULL,
    buyer_email VARCHAR(255),

    -- Seller information
    seller_name VARCHAR(255) NOT NULL,
    seller_address TEXT NOT NULL,

    -- Purchase details
    purchase_date DATE NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    order_reference VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),

    -- Defect information
    defect_type DEFECT_TYPE_ENUM NOT NULL,
    defect_description TEXT NOT NULL,

    -- Generated content
    letter_content TEXT,
    status LETTER_STATUS_ENUM DEFAULT 'draft',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Document table - Uploaded invoices and receipts
CREATE TABLE document (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    letter_id UUID NOT NULL REFERENCES letter (id) ON DELETE CASCADE,

    -- File information
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size > 0),

    -- OCR processing
    extracted_data JSONB,
    processing_status PROCESSING_STATUS_ENUM DEFAULT 'pending',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment table - Stripe payment tracking
CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    letter_id UUID NOT NULL REFERENCES letter (id) ON DELETE CASCADE,

    -- Stripe identifiers
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_checkout_session_id VARCHAR(255),

    -- Payment details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'EUR',
    service_type SERVICE_TYPE_ENUM NOT NULL,
    status PAYMENT_STATUS_ENUM DEFAULT 'pending',

    -- Customer information
    customer_email VARCHAR(255),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Postal delivery table - Physical mail sending
CREATE TABLE postal_delivery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    letter_id UUID NOT NULL REFERENCES letter (id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payment (id) ON DELETE CASCADE,

    -- Service provider information
    provider VARCHAR(100) NOT NULL,
    provider_delivery_id VARCHAR(255),
    tracking_number VARCHAR(255),

    -- Recipient details
    recipient_name VARCHAR(255) NOT NULL,
    recipient_address TEXT NOT NULL,

    -- Delivery tracking
    status POSTAL_STATUS_ENUM DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_letter_session_id ON letter (session_id);
CREATE INDEX idx_letter_created_at ON letter (created_at);
CREATE INDEX idx_letter_status ON letter (status);

CREATE INDEX idx_document_letter_id ON document (letter_id);
CREATE INDEX idx_document_processing_status ON document (processing_status);

CREATE INDEX idx_payment_letter_id ON payment (letter_id);
CREATE INDEX idx_payment_stripe_intent ON payment (stripe_payment_intent_id);
CREATE INDEX idx_payment_status ON payment (status);
CREATE INDEX idx_payment_created_at ON payment (created_at);

CREATE INDEX idx_postal_delivery_letter_id ON postal_delivery (letter_id);
CREATE INDEX idx_postal_delivery_status ON postal_delivery (status);
CREATE INDEX idx_postal_delivery_tracking ON postal_delivery (tracking_number);

-- Trigger function for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_letter
BEFORE UPDATE ON letter
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_payment
BEFORE UPDATE ON payment
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_postal_delivery
BEFORE UPDATE ON postal_delivery
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 1. Créer le type enum pour les événements de draft (funnel)
DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_draft_event_type') THEN
            CREATE TYPE form_draft_event_type AS ENUM (
                'basic_download',
                'preview_view',
                'pdf_download',
                'premium_checkout',
                'premium_paid'
                );
        END IF;
    END$$;

-- 2. Créer le type enum pour le statut du draft
DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_draft_status') THEN
            CREATE TYPE form_draft_status AS ENUM (
                'editing',
                'submitted',
                'abandoned',
                'expired'
                );
        END IF;
    END$$;

-- 3. Table des drafts
CREATE TABLE IF NOT EXISTS form_draft (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_slug TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    status FORM_DRAFT_STATUS NOT NULL DEFAULT 'editing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_event TEXT,
    last_ip INET,
    ua TEXT
);

CREATE INDEX IF NOT EXISTS idx_form_draft_slug_status ON form_draft (form_slug, status);

-- 4. Table des événements (funnel)
CREATE TABLE IF NOT EXISTS form_draft_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draft_id UUID NOT NULL REFERENCES form_draft (id) ON DELETE CASCADE,
    event_type FORM_DRAFT_EVENT_TYPE NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    meta JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX IF NOT EXISTS idx_form_draft_event_draft ON form_draft_event (
    draft_id, occurred_at
);
CREATE INDEX IF NOT EXISTS idx_form_draft_event_type ON form_draft_event (event_type);
