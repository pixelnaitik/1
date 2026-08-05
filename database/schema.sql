-- VoyageSecure AI reference schema (PostgreSQL 15+ / PostGIS 3+)
-- Apply through numbered migrations in production; this file is a clean bootstrap reference.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE user_role AS ENUM ('tourist', 'responder', 'admin');
CREATE TYPE risk_band AS ENUM ('low', 'caution', 'high');
CREATE TYPE service_type AS ENUM ('police', 'hospital', 'ambulance');
CREATE TYPE sos_status AS ENUM ('created', 'notifying', 'active', 'cancelled', 'resolved', 'failed');
CREATE TYPE notification_status AS ENUM ('queued', 'sent', 'delivered', 'failed');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT,
  auth_subject TEXT UNIQUE,
  display_name VARCHAR(60) NOT NULL,
  role user_role NOT NULL DEFAULT 'tourist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (password_hash IS NOT NULL OR auth_subject IS NOT NULL)
);

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  location_consent BOOLEAN NOT NULL DEFAULT FALSE,
  alert_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  accessibility_mode BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(80) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_events_actor_time_idx ON audit_events(actor_user_id, created_at DESC);

CREATE TABLE data_import_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(120) NOT NULL,
  source_url TEXT,
  source_version VARCHAR(80) NOT NULL,
  checksum CHAR(64) NOT NULL,
  accepted_rows INTEGER NOT NULL DEFAULT 0,
  rejected_rows INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (source, checksum)
);

CREATE TABLE crime_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_run_id UUID REFERENCES data_import_runs(id) ON DELETE RESTRICT,
  source_id VARCHAR(120) NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  category VARCHAR(80) NOT NULL,
  severity SMALLINT NOT NULL CHECK (severity BETWEEN 1 AND 5),
  geom GEOGRAPHY(POINT, 4326) NOT NULL,
  source_version VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_id, source_version)
);
CREATE INDEX crime_incidents_geom_gix ON crime_incidents USING GIST (geom);
CREATE INDEX crime_incidents_time_category_idx ON crime_incidents(occurred_at DESC, category);

CREATE TABLE hotspot_cells (
  cell_id VARCHAR(32) NOT NULL,
  resolution SMALLINT NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  incident_count INTEGER NOT NULL CHECK (incident_count >= 0),
  severity_score NUMERIC(6,3) NOT NULL CHECK (severity_score >= 0),
  geom GEOGRAPHY(POLYGON, 4326) NOT NULL,
  PRIMARY KEY (cell_id, resolution, period_start)
);
CREATE INDEX hotspot_cells_geom_gix ON hotspot_cells USING GIST (geom);

CREATE TABLE context_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind VARCHAR(30) NOT NULL CHECK (kind IN ('weather', 'disaster', 'crowd')),
  severity SMALLINT NOT NULL CHECK (severity BETWEEN 0 AND 5),
  geom GEOGRAPHY(GEOMETRY, 4326),
  observed_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  provider VARCHAR(100) NOT NULL,
  raw_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (expires_at > observed_at)
);
CREATE INDEX context_observations_active_idx ON context_observations(kind, expires_at DESC);
CREATE INDEX context_observations_geom_gix ON context_observations USING GIST (geom);

-- No routine precise GPS is stored here. Sampled assessments use an aggregate cell only.
CREATE TABLE risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id VARCHAR(32) NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 100),
  band risk_band NOT NULL,
  confidence NUMERIC(4,3) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  model_version VARCHAR(40) NOT NULL,
  factors JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX risk_assessments_time_model_idx ON risk_assessments(created_at DESC, model_version);

CREATE TABLE emergency_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type service_type NOT NULL,
  name VARCHAR(160) NOT NULL,
  phone VARCHAR(32),
  address TEXT NOT NULL,
  hours JSONB,
  geom GEOGRAPHY(POINT, 4326) NOT NULL,
  source TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX emergency_services_geom_gix ON emergency_services USING GIST (geom);
CREATE INDEX emergency_services_type_verified_idx ON emergency_services(type, verified_at DESC) WHERE is_active;

CREATE TABLE trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  contact_value VARCHAR(254) NOT NULL,
  contact_type VARCHAR(10) NOT NULL CHECK (contact_type IN ('phone', 'email')),
  verified_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(user_id, contact_type, contact_value)
);

CREATE TABLE sos_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status sos_status NOT NULL DEFAULT 'created',
  idempotency_key UUID NOT NULL,
  last_location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  UNIQUE(user_id, idempotency_key)
);
CREATE INDEX sos_incidents_status_created_idx ON sos_incidents(status, created_at DESC);

CREATE TABLE location_share_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sos_id UUID REFERENCES sos_incidents(id) ON DELETE SET NULL,
  viewer_token_hash CHAR(64) UNIQUE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  CHECK (expires_at > started_at)
);
CREATE INDEX location_sessions_active_idx ON location_share_sessions(expires_at) WHERE ended_at IS NULL;

CREATE TABLE location_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES location_share_sessions(id) ON DELETE CASCADE,
  geom GEOGRAPHY(POINT, 4326) NOT NULL,
  accuracy_m NUMERIC(8,2),
  recorded_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX location_events_session_time_idx ON location_events(session_id, recorded_at DESC);

CREATE TABLE notification_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sos_id UUID REFERENCES sos_incidents(id) ON DELETE CASCADE,
  channel VARCHAR(12) NOT NULL CHECK (channel IN ('push', 'email', 'sms')),
  recipient_reference TEXT NOT NULL,
  status notification_status NOT NULL DEFAULT 'queued',
  provider_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(channel, provider_message_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(40) NOT NULL,
  title VARCHAR(160) NOT NULL,
  body TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
CREATE INDEX notifications_user_read_time_idx ON notifications(user_id, read_at, created_at DESC);

CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  weather_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  risk_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  quiet_hours JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  language VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  source_url TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'approved', 'retired'))
);
CREATE INDEX knowledge_documents_scope_idx ON knowledge_documents(city, language, status);

CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  topic VARCHAR(60) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX knowledge_chunks_topic_idx ON knowledge_chunks(topic);

COMMIT;
