-- TRAPS Workbench · 初始 schema（M3 冻结）
-- 事实只存原始记录；不做个体风险分级、不做入组资格判定、不存派生百分数。
PRAGMA foreign_keys = ON;

CREATE TABLE profiles (
  profile_key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT,
  subtype TEXT,
  diagnosed_on TEXT,
  summary TEXT,
  is_demo INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE profile_facts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key TEXT NOT NULL REFERENCES profiles(profile_key) ON DELETE CASCADE,
  field TEXT NOT NULL,
  label TEXT,
  value TEXT,
  source TEXT,
  confirmed INTEGER NOT NULL DEFAULT 0 CHECK (confirmed IN (0,1)),
  created_at TEXT NOT NULL,
  UNIQUE(profile_key, field)
);

CREATE TABLE entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key TEXT NOT NULL REFERENCES profiles(profile_key) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('symptom','lab','treatment','question','hospital','report','doc','mind')),
  title TEXT,
  body TEXT,
  data_json TEXT NOT NULL DEFAULT '{}',
  event_date TEXT NOT NULL,
  source TEXT,
  is_private INTEGER NOT NULL DEFAULT 0 CHECK (is_private IN (0,1)),
  in_use INTEGER NOT NULL DEFAULT 1 CHECK (in_use IN (0,1)),
  section_title TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_entries_profile_date ON entries(profile_key, event_date DESC, id DESC);
CREATE INDEX idx_entries_kind ON entries(profile_key, kind, id DESC);

-- Flare intervals and dated observations are first-class facts; no disease activity score.
CREATE TABLE flare_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key TEXT NOT NULL REFERENCES profiles(profile_key) ON DELETE CASCADE,
  started_on TEXT NOT NULL,
  ended_on TEXT CHECK (ended_on IS NULL OR ended_on >= started_on),
  start_time TEXT,
  end_time TEXT,
  title TEXT,
  note TEXT,
  source TEXT,
  revision_of INTEGER REFERENCES flare_events(id),
  is_private INTEGER NOT NULL DEFAULT 0 CHECK (is_private IN (0,1)),
  in_use INTEGER NOT NULL DEFAULT 1 CHECK (in_use IN (0,1)),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_flare_events_profile_start ON flare_events(profile_key, started_on DESC, id DESC);

CREATE TABLE flare_observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flare_id INTEGER NOT NULL REFERENCES flare_events(id) ON DELETE CASCADE,
  observed_on TEXT NOT NULL,
  feature TEXT NOT NULL CHECK (feature IN ('fever','myalgia','rash','eye','abdominal','chest','joint','fatigue','other')),
  body_site TEXT,
  value_text TEXT,
  patient_rated_impact INTEGER CHECK (patient_rated_impact IS NULL OR patient_rated_impact BETWEEN 0 AND 10),
  source TEXT,
  revision_of INTEGER REFERENCES flare_observations(id),
  is_private INTEGER NOT NULL DEFAULT 0 CHECK (is_private IN (0,1)),
  in_use INTEGER NOT NULL DEFAULT 1 CHECK (in_use IN (0,1)),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_flare_observations_flare_date ON flare_observations(flare_id, observed_on, id);

CREATE TABLE metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key TEXT NOT NULL REFERENCES profiles(profile_key) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  value_num REAL,
  value_text TEXT,
  unit TEXT,
  ref_low REAL,
  ref_high REAL,
  method TEXT,
  institution TEXT,
  measured_on TEXT NOT NULL,
  source TEXT,
  is_private INTEGER NOT NULL DEFAULT 0 CHECK (is_private IN (0,1)),
  in_use INTEGER NOT NULL DEFAULT 1 CHECK (in_use IN (0,1)),
  section_title TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_metrics_profile_key ON metrics(profile_key, metric_key, measured_on, id);
CREATE INDEX idx_metrics_profile_date ON metrics(profile_key, measured_on DESC, id DESC);

CREATE TABLE treatments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key TEXT NOT NULL REFERENCES profiles(profile_key) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT,
  started_on TEXT,
  ended_on TEXT,
  note TEXT,
  source TEXT,
  is_private INTEGER NOT NULL DEFAULT 0 CHECK (is_private IN (0,1)),
  in_use INTEGER NOT NULL DEFAULT 1 CHECK (in_use IN (0,1)),
  section_title TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE saved_trial (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key TEXT NOT NULL REFERENCES profiles(profile_key) ON DELETE CASCADE,
  trial_key TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'in_followup' CHECK (state IN ('in_followup','preparing','archived')),
  saved_on TEXT NOT NULL,
  is_private INTEGER NOT NULL DEFAULT 0 CHECK (is_private IN (0,1)),
  UNIQUE(profile_key, trial_key)
);

CREATE TABLE trials (
  record_id TEXT PRIMARY KEY,
  merged_sources TEXT,
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  study_type TEXT,
  sponsors TEXT,
  registry_numbers TEXT,
  dates TEXT,
  source_url TEXT,
  retrieved_at TEXT,
  status_note TEXT,
  snapshot_date TEXT NOT NULL,
  conditions_json TEXT,
  phase_json TEXT,
  countries_json TEXT,
  eligibility_text TEXT,
  summary TEXT,
  raw_json TEXT,
  relevant INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE source_statuses (
  query TEXT NOT NULL,
  source_id TEXT NOT NULL,
  state TEXT NOT NULL,
  reason_code TEXT,
  explanation TEXT,
  result_count INTEGER,
  coverage_json TEXT,
  completeness_json TEXT,
  freshness_json TEXT,
  snapshot_date TEXT NOT NULL,
  PRIMARY KEY(query, source_id)
);

CREATE TABLE app_setting (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE import_batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key TEXT NOT NULL REFERENCES profiles(profile_key) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  sha256 TEXT,
  state TEXT NOT NULL,
  created_at TEXT NOT NULL,
  is_private INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE import_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id INTEGER NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  field TEXT,
  value_text TEXT,
  value_num REAL,
  confirmed INTEGER NOT NULL DEFAULT 0 CHECK (confirmed IN (0,1)),
  is_private INTEGER NOT NULL DEFAULT 1,
  in_use INTEGER NOT NULL DEFAULT 1,
  section_title TEXT
);

CREATE TABLE import_conflicts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id INTEGER NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  candidate_value TEXT,
  existing_value TEXT,
  resolution TEXT,
  is_private INTEGER NOT NULL DEFAULT 1
);

PRAGMA user_version = 1;
