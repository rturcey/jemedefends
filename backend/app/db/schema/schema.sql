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

    buyer_name VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255),
    buyer_address_line_1 VARCHAR(255) NOT NULL,
    buyer_address_line_2 VARCHAR(255),
    buyer_postal_code VARCHAR(20) NOT NULL,
    buyer_city VARCHAR(100) NOT NULL,
    buyer_country VARCHAR(100) NOT NULL,

    seller_name VARCHAR(255) NOT NULL,
    seller_email VARCHAR(255),
    seller_address_line_1 VARCHAR(255) NOT NULL,
    seller_address_line_2 VARCHAR(255),
    seller_postal_code VARCHAR(20) NOT NULL,
    seller_city VARCHAR(100) NOT NULL,
    seller_country VARCHAR(100) NOT NULL,

    purchase_date DATE NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL CHECK (product_price > 0),
    order_reference VARCHAR(100),
    used BOOLEAN NOT NULL DEFAULT FALSE,
    digital BOOLEAN NOT NULL DEFAULT FALSE,

    defect_type DEFECT_TYPE_ENUM NOT NULL,
    defect_description TEXT NOT NULL,

    content TEXT,
    status LETTER_STATUS_ENUM NOT NULL DEFAULT 'draft',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_letter_created_at ON letter (created_at);
CREATE INDEX idx_letter_status ON letter (status);

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
    last_event TEXT
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
