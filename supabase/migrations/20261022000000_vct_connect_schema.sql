-- ==============================================================================
-- VCT Connect - Supabase PostgreSQL Schema
-- ==============================================================================
-- Generated from backend migrations (0001_tracer_baseline -> 0017_extension_collection_jobs)
-- Compatible with Supabase SQL Editor and local backend yoyo migrations.
-- ==============================================================================

-- Enable common extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Users
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('CUSTOMER', 'INTERNAL_REVIEWER', 'ADMIN')),
  CONSTRAINT users_clerk_user_id_nonblank_check CHECK (btrim(clerk_user_id) <> '')
);

-- ------------------------------------------------------------------------------
-- 2. Entitlements
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entitlement TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT entitlements_entitlement_nonblank_check CHECK (btrim(entitlement) <> ''),
  CONSTRAINT entitlements_source_nonblank_check CHECK (btrim(source) <> ''),
  CONSTRAINT entitlements_status_nonblank_check CHECK (btrim(status) <> ''),
  CONSTRAINT entitlements_time_range_check CHECK (expires_at IS NULL OR expires_at > starts_at),
  CONSTRAINT entitlements_user_record_key UNIQUE (user_id, entitlement, source, starts_at)
);

CREATE INDEX IF NOT EXISTS entitlements_user_validity_idx
  ON entitlements (user_id, starts_at, expires_at);

-- ------------------------------------------------------------------------------
-- 3. Suppliers
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  platform_supplier_id TEXT,
  name TEXT,
  source_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT suppliers_platform_check CHECK (platform IN ('1688', 'TAOBAO', 'ALIBABA')),
  CONSTRAINT suppliers_source_url_nonblank_check CHECK (btrim(source_url) <> ''),
  CONSTRAINT suppliers_platform_supplier_id_key UNIQUE (platform, platform_supplier_id)
);

-- ------------------------------------------------------------------------------
-- 4. Analyses
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  supplier_snapshot_id UUID, -- Foreign key added below after supplier_snapshots is defined
  mode TEXT NOT NULL DEFAULT 'GUEST_PUBLIC',
  scoring_version TEXT NOT NULL DEFAULT 'v0.1.0',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  processing_claim_token UUID,
  processing_claimed_until TIMESTAMPTZ,
  processing_started_at TIMESTAMPTZ,
  failure_code TEXT,
  next_retry_at TIMESTAMPTZ,
  final_disposition TEXT,
  guest_key_hash TEXT,
  actor_type TEXT NOT NULL DEFAULT 'LEGACY',
  extraction_method TEXT NOT NULL DEFAULT 'FIXTURE',
  assessed_at TIMESTAMPTZ,
  CONSTRAINT analyses_status_check CHECK (
    status IN ('QUEUED', 'PROCESSING', 'ASSESSING', 'REPORTING', 'FAILED_RETRYABLE', 'FAILED_FINAL', 'COMPLETED')
  ),
  CONSTRAINT analyses_mode_check CHECK (
    mode IN ('GUEST_PUBLIC', 'ACCOUNT_PUBLIC', 'EXTENSION_ENHANCED')
  ),
  CONSTRAINT analyses_actor_type_check CHECK (
    actor_type IN ('LEGACY', 'GUEST', 'CUSTOMER')
  ),
  CONSTRAINT analyses_extraction_method_check CHECK (
    btrim(extraction_method) <> ''
  ),
  CONSTRAINT analyses_attempt_count_check CHECK (
    attempt_count >= 0
  ),
  CONSTRAINT analyses_failure_code_check CHECK (
    failure_code IS NULL OR (char_length(failure_code) BETWEEN 1 AND 80 AND failure_code ~ '^[A-Z0-9_]+$')
  ),
  CONSTRAINT analyses_final_disposition_check CHECK (
    final_disposition IS NULL OR final_disposition IN ('DLQ_PENDING', 'DEAD_LETTERED', 'PUBLICATION_FAILED')
  ),
  CONSTRAINT analyses_guest_key_hash_check CHECK (
    guest_key_hash IS NULL OR guest_key_hash ~ '^[0-9a-f]{64}$'
  )
);

CREATE INDEX IF NOT EXISTS analyses_user_created_idx
  ON analyses (user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS analyses_supplier_snapshot_idx
  ON analyses (supplier_snapshot_id) WHERE supplier_snapshot_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS analyses_guest_key_hash_idx
  ON analyses (guest_key_hash, id) WHERE guest_key_hash IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 5. Supplier Snapshots
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS supplier_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  analysis_id UUID UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
  extracted_at TIMESTAMPTZ NOT NULL,
  raw_payload JSONB NOT NULL,
  normalized_data JSONB NOT NULL,
  completeness NUMERIC(5, 4),
  extraction_method TEXT NOT NULL,
  analysis_mode TEXT NOT NULL,
  extractor_version TEXT NOT NULL,
  missing_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT supplier_snapshots_raw_payload_object_check CHECK (jsonb_typeof(raw_payload) = 'object'),
  CONSTRAINT supplier_snapshots_normalized_data_object_check CHECK (jsonb_typeof(normalized_data) = 'object'),
  CONSTRAINT supplier_snapshots_missing_fields_array_check CHECK (jsonb_typeof(missing_fields) = 'array'),
  CONSTRAINT supplier_snapshots_extraction_method_nonblank_check CHECK (btrim(extraction_method) <> ''),
  CONSTRAINT supplier_snapshots_analysis_mode_nonblank_check CHECK (btrim(analysis_mode) <> ''),
  CONSTRAINT supplier_snapshots_extractor_version_nonblank_check CHECK (btrim(extractor_version) <> ''),
  CONSTRAINT supplier_snapshots_completeness_check CHECK (completeness IS NULL OR (completeness >= 0 AND completeness <= 1))
);

CREATE INDEX IF NOT EXISTS supplier_snapshots_supplier_extracted_idx
  ON supplier_snapshots (supplier_id, extracted_at DESC);

-- Add reference from analyses to supplier_snapshots
ALTER TABLE analyses
  DROP CONSTRAINT IF EXISTS analyses_supplier_snapshot_id_fkey;
ALTER TABLE analyses
  ADD CONSTRAINT analyses_supplier_snapshot_id_fkey
  FOREIGN KEY (supplier_snapshot_id) REFERENCES supplier_snapshots(id) ON DELETE SET NULL;

-- ------------------------------------------------------------------------------
-- 6. Supplier Reviews
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS supplier_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id UUID NOT NULL REFERENCES supplier_snapshots(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  payload JSONB NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  UNIQUE (snapshot_id, ordinal)
);

-- ------------------------------------------------------------------------------
-- 7. Analysis Results
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analysis_results (
  analysis_id UUID PRIMARY KEY REFERENCES analyses(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 8. Local Queue (PostgreSQL-backed Queue)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS local_queue (
  analysis_id UUID PRIMARY KEY REFERENCES analyses(id) ON DELETE CASCADE,
  available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_until TIMESTAMPTZ,
  claim_token UUID,
  attempts INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT local_queue_claim_pair_check CHECK (
    (claim_token IS NULL AND claimed_until IS NULL)
    OR (claim_token IS NOT NULL AND claimed_until IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS local_queue_claim_token_key
  ON local_queue (claim_token) WHERE claim_token IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 9. Analysis Status Events
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analysis_status_events (
  id BIGSERIAL PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (
    status IN ('QUEUED', 'PROCESSING', 'ASSESSING', 'REPORTING', 'FAILED_RETRYABLE', 'FAILED_FINAL', 'COMPLETED')
  ),
  attempt INTEGER NOT NULL DEFAULT 0 CHECK (attempt >= 0),
  failure_code TEXT,
  next_retry_at TIMESTAMPTZ,
  disposition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT analysis_status_events_failure_code_check CHECK (
    failure_code IS NULL OR (char_length(failure_code) BETWEEN 1 AND 80 AND failure_code ~ '^[A-Z0-9_]+$')
  ),
  CONSTRAINT analysis_status_events_disposition_check CHECK (
    disposition IS NULL OR disposition IN ('DLQ_PENDING', 'DEAD_LETTERED', 'PUBLICATION_FAILED')
  )
);

CREATE INDEX IF NOT EXISTS analysis_status_events_analysis_order_idx
  ON analysis_status_events (analysis_id, id);

-- ------------------------------------------------------------------------------
-- 10. Analysis Outbox (Transactional Outbox Pattern)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analysis_outbox (
  analysis_id UUID PRIMARY KEY REFERENCES analyses(id) ON DELETE CASCADE,
  message_id UUID NOT NULL UNIQUE,
  state TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (state IN ('PENDING', 'PUBLISHED', 'FAILED_FINAL')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lease_token UUID,
  leased_until TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  last_error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT analysis_outbox_identity_check CHECK (message_id = analysis_id),
  CONSTRAINT analysis_outbox_lease_pair_check CHECK (
    (lease_token IS NULL AND leased_until IS NULL)
    OR (lease_token IS NOT NULL AND leased_until IS NOT NULL)
  ),
  CONSTRAINT analysis_outbox_error_code_check CHECK (
    last_error_code IS NULL OR (char_length(last_error_code) BETWEEN 1 AND 80 AND last_error_code ~ '^[A-Z0-9_]+$')
  )
);

CREATE INDEX IF NOT EXISTS analysis_outbox_dispatch_idx
  ON analysis_outbox (next_attempt_at, analysis_id) WHERE state = 'PENDING';
CREATE UNIQUE INDEX IF NOT EXISTS analysis_outbox_lease_token_key
  ON analysis_outbox (lease_token) WHERE lease_token IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 11. Admission Counters (Rate Limiting)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admission_counters (
  scope TEXT NOT NULL CHECK (scope IN ('GUEST_BROWSER', 'GUEST_GLOBAL', 'CUSTOMER')),
  subject TEXT NOT NULL,
  window_number BIGINT NOT NULL,
  used INTEGER NOT NULL CHECK (used > 0),
  PRIMARY KEY (scope, subject, window_number)
);

-- ------------------------------------------------------------------------------
-- 12. Analysis Assessments (Scoring & Risk Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analysis_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
  supplier_snapshot_id UUID NOT NULL UNIQUE REFERENCES supplier_snapshots(id) ON DELETE CASCADE,
  scoring_version TEXT NOT NULL,
  supplier_interpretation JSONB NOT NULL,
  review_analysis JSONB NOT NULL,
  identity_assessment JSONB NOT NULL,
  risk_assessment JSONB NOT NULL,
  media_analysis JSONB,
  confidence NUMERIC(5,4) NOT NULL,
  data_coverage NUMERIC(5,4) NOT NULL,
  overall_risk NUMERIC(7,4),
  risk_label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT analysis_assessments_versions_nonblank CHECK (btrim(scoring_version) <> ''),
  CONSTRAINT analysis_assessments_json_objects CHECK (
    jsonb_typeof(supplier_interpretation) = 'object'
    AND jsonb_typeof(review_analysis) = 'object'
    AND jsonb_typeof(identity_assessment) = 'object'
    AND jsonb_typeof(risk_assessment) = 'object'
  ),
  CONSTRAINT analysis_assessments_media_object_check CHECK (
    media_analysis IS NULL OR jsonb_typeof(media_analysis) = 'object'
  ),
  CONSTRAINT analysis_assessments_confidence CHECK (confidence >= 0 AND confidence <= 1),
  CONSTRAINT analysis_assessments_coverage CHECK (data_coverage >= 0 AND data_coverage <= 1),
  CONSTRAINT analysis_assessments_risk CHECK (
    overall_risk IS NULL OR (overall_risk >= 0 AND overall_risk <= 100)
  ),
  CONSTRAINT analysis_assessments_label CHECK (
    risk_label IN ('LOW', 'MODERATE', 'HIGH', 'INSUFFICIENT_INFORMATION')
  )
);

-- ------------------------------------------------------------------------------
-- 13. LLM Review Runs (AI Provenance & Token Auditing)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS llm_review_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  supplier_snapshot_id UUID NOT NULL REFERENCES supplier_snapshots(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES analysis_assessments(id) ON DELETE CASCADE,
  run_kind TEXT NOT NULL DEFAULT 'SUPPLIER_INTERPRETATION'
    CHECK (run_kind IN ('SUPPLIER_INTERPRETATION', 'REVIEW_INTERPRETATION', 'MEDIA_INTERPRETATION')),
  provider TEXT NOT NULL,
  provider_request_id TEXT,
  model TEXT NOT NULL,
  model_version TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  pipeline_version TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  settings JSONB NOT NULL,
  input_sha256 TEXT NOT NULL,
  input_payload JSONB NOT NULL,
  output JSONB NOT NULL,
  confidence NUMERIC(5, 4) NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  cost_usd NUMERIC(16, 8),
  cost_status TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,
  raw_usage JSONB NOT NULL DEFAULT '{}'::jsonb,
  finish_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT llm_review_runs_provider_nonblank CHECK (btrim(provider) <> ''),
  CONSTRAINT llm_review_runs_model_nonblank CHECK (btrim(model) <> '' AND btrim(model_version) <> ''),
  CONSTRAINT llm_review_runs_versions_nonblank CHECK (
    btrim(prompt_version) <> '' AND btrim(pipeline_version) <> '' AND btrim(schema_version) <> ''
  ),
  CONSTRAINT llm_review_runs_settings_object CHECK (jsonb_typeof(settings) = 'object'),
  CONSTRAINT llm_review_runs_input_payload_object CHECK (jsonb_typeof(input_payload) = 'object'),
  CONSTRAINT llm_review_runs_output_object CHECK (jsonb_typeof(output) = 'object'),
  CONSTRAINT llm_review_runs_raw_usage_object CHECK (jsonb_typeof(raw_usage) = 'object'),
  CONSTRAINT llm_review_runs_input_sha256 CHECK (input_sha256 ~ '^[0-9a-f]{64}$'),
  CONSTRAINT llm_review_runs_confidence CHECK (confidence >= 0 AND confidence <= 1),
  CONSTRAINT llm_review_runs_tokens CHECK (
    prompt_tokens >= 0 AND completion_tokens >= 0 AND total_tokens >= 0
    AND total_tokens >= prompt_tokens AND total_tokens >= completion_tokens
  ),
  CONSTRAINT llm_review_runs_cost CHECK (cost_usd IS NULL OR cost_usd >= 0),
  CONSTRAINT llm_review_runs_cost_status CHECK (
    (cost_status = 'REPORTED' AND cost_usd IS NOT NULL)
    OR (cost_status = 'UNAVAILABLE' AND cost_usd IS NULL)
  ),
  CONSTRAINT llm_review_runs_latency CHECK (latency_ms >= 0)
);

CREATE INDEX IF NOT EXISTS llm_review_runs_analysis_created_idx
  ON llm_review_runs (analysis_id, created_at DESC);
CREATE INDEX IF NOT EXISTS llm_review_runs_snapshot_created_idx
  ON llm_review_runs (supplier_snapshot_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS llm_review_runs_provider_request_id_key
  ON llm_review_runs (provider, provider_request_id)
  WHERE provider_request_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS llm_review_runs_assessment_kind_key
  ON llm_review_runs (assessment_id, run_kind)
  WHERE assessment_id IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 14. Analysis Findings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analysis_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES analysis_assessments(id) ON DELETE CASCADE,
  finding_key TEXT NOT NULL,
  finding_type TEXT NOT NULL,
  dimension TEXT,
  severity NUMERIC(7,4),
  confidence NUMERIC(5,4),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT analysis_findings_key_nonblank CHECK (btrim(finding_key) <> ''),
  CONSTRAINT analysis_findings_type_nonblank CHECK (btrim(finding_type) <> ''),
  CONSTRAINT analysis_findings_severity CHECK (
    severity IS NULL OR (severity >= 0 AND severity <= 100)
  ),
  CONSTRAINT analysis_findings_confidence CHECK (
    confidence IS NULL OR (confidence >= 0 AND confidence <= 1)
  ),
  CONSTRAINT analysis_findings_payload_object CHECK (jsonb_typeof(payload) = 'object'),
  UNIQUE (assessment_id, finding_key)
);

CREATE INDEX IF NOT EXISTS analysis_findings_assessment_type_idx
  ON analysis_findings (assessment_id, finding_type);

-- ------------------------------------------------------------------------------
-- 15. Analysis Evidence
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analysis_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES analysis_assessments(id) ON DELETE CASCADE,
  evidence_id TEXT NOT NULL,
  source_kind TEXT NOT NULL,
  source_field TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT analysis_evidence_id_nonblank CHECK (btrim(evidence_id) <> ''),
  CONSTRAINT analysis_evidence_source_nonblank CHECK (btrim(source_kind) <> ''),
  CONSTRAINT analysis_evidence_payload_object CHECK (jsonb_typeof(payload) = 'object'),
  UNIQUE (assessment_id, evidence_id)
);

CREATE INDEX IF NOT EXISTS analysis_evidence_assessment_source_idx
  ON analysis_evidence (assessment_id, source_kind);

-- ------------------------------------------------------------------------------
-- 16. Reports
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL UNIQUE REFERENCES analysis_assessments(id) ON DELETE CASCADE,
  schema_version TEXT NOT NULL,
  language TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reports_schema_nonblank CHECK (btrim(schema_version) <> ''),
  CONSTRAINT reports_language_check CHECK (language = 'vi'),
  CONSTRAINT reports_payload_object_check CHECK (jsonb_typeof(payload) = 'object')
);

CREATE INDEX IF NOT EXISTS reports_created_idx ON reports (created_at DESC);

-- ------------------------------------------------------------------------------
-- 17. Watchlist Entries
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS watchlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT watchlist_user_supplier_key UNIQUE (user_id, supplier_id)
);

CREATE INDEX IF NOT EXISTS watchlist_user_created_idx
  ON watchlist_entries (user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 18. Review Evaluation Labels (Human-in-the-loop Evaluation)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS review_evaluation_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES llm_review_runs(id) ON DELETE CASCADE,
  review_ordinal INTEGER NOT NULL CHECK (review_ordinal >= 0),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED', 'UNCERTAIN')),
  complaint_category TEXT NOT NULL DEFAULT 'OTHER'
    CHECK (complaint_category IN ('QUALITY','DELIVERY','AFTER_SALES','PRODUCT_MISMATCH','PACKAGING','OTHER','NONE','UNCERTAIN')),
  severity TEXT NOT NULL DEFAULT 'NONE'
    CHECK (severity IN ('NONE','LOW','MEDIUM','HIGH','UNCERTAIN')),
  suspicious_indicators TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  correctness TEXT NOT NULL DEFAULT 'UNCERTAIN'
    CHECK (correctness IN ('CORRECT','PARTIALLY_CORRECT','INCORRECT','UNCERTAIN')),
  human_confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5
    CHECK (human_confidence >= 0 AND human_confidence <= 1),
  notes TEXT NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (run_id, review_ordinal, reviewer_id),
  CONSTRAINT review_label_suspicious_allowed CHECK (
    suspicious_indicators <@ ARRAY[
      'EXACT_DUPLICATE_TEXT','TIMING_BURST','RATING_TEXT_MISMATCH',
      'REVIEW_VOLUME_INCONSISTENCY','SEMANTIC_NEAR_DUPLICATE','OTHER'
    ]::text[] AND array_position(suspicious_indicators, NULL) IS NULL
  )
);

CREATE INDEX IF NOT EXISTS review_evaluation_labels_reviewer_idx
  ON review_evaluation_labels (reviewer_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 19. Extension Collection Jobs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS extension_collection_jobs (
  analysis_id UUID PRIMARY KEY REFERENCES analyses(id) ON DELETE CASCADE,
  initial_digest TEXT NOT NULL,
  initial_payload JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '60 seconds'),
  finished BOOLEAN NOT NULL DEFAULT false,
  final_digest TEXT
);

CREATE INDEX IF NOT EXISTS extension_collection_pending
  ON extension_collection_jobs(expires_at) WHERE NOT finished;

-- ------------------------------------------------------------------------------
-- 20. Yoyo Migrations Tracking Table
-- (Ensures python -m backend.app.init_db recognizes all migrations as applied)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS _yoyo_migration (
  migration_hash VARCHAR(64),
  migration_id VARCHAR(255) NOT NULL,
  applied_at_utc TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'),
  PRIMARY KEY (migration_id)
);

INSERT INTO _yoyo_migration (migration_id)
VALUES
  ('0001_tracer_baseline'),
  ('0002_core_business_schema'),
  ('0003_align_core_schema_to_spec'),
  ('0004_harden_analysis_processing'),
  ('0005_expand_processing_dispositions'),
  ('0006_guest_admission_and_provenance'),
  ('0007_1688_extraction_evidence'),
  ('0008_allow_public_extraction'),
  ('0009_allow_snapshot_replay'),
  ('0010_llm_review_runs'),
  ('0011_worker_assessments'),
  ('0012_multimodal_assessments'),
  ('0013_reports'),
  ('0014_watchlist'),
  ('0015_review_evaluation_labels'),
  ('0016_review_annotation_fields'),
  ('0017_extension_collection_jobs')
ON CONFLICT (migration_id) DO NOTHING;
