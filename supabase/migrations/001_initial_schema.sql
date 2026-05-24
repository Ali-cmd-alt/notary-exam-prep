-- supabase/migrations/001_initial_schema.sql

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE knowledge_cards (
  id SERIAL PRIMARY KEY,
  chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  key_points TEXT[],
  sort_order INT NOT NULL,
  source_label TEXT,
  source_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INT NOT NULL,
  explanation TEXT NOT NULL,
  source_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
  completed_cards INT[] DEFAULT '{}',
  quiz_scores JSONB DEFAULT '[]',
  mastered BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, chapter_id)
);

CREATE TABLE user_wrong_answers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  user_answer INT NOT NULL,
  review_count INT DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE exam_records (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total INT NOT NULL,
  time_used INT NOT NULL,
  weak_chapters INT[] DEFAULT '{}',
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  paddle_order_id TEXT,
  paddle_transaction_id TEXT,
  status TEXT DEFAULT 'active',
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wrong_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for content
CREATE POLICY "chapters_public_read" ON chapters FOR SELECT USING (true);
CREATE POLICY "cards_public_read" ON knowledge_cards FOR SELECT USING (true);
CREATE POLICY "questions_public_read" ON questions FOR SELECT USING (true);

-- Profiles: users can read all, update own
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User progress: own data only
CREATE POLICY "progress_own_access" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- Wrong answers: own data only
CREATE POLICY "wrong_answers_own_access" ON user_wrong_answers FOR ALL USING (auth.uid() = user_id);

-- Exam records: own data only
CREATE POLICY "exam_records_own_access" ON exam_records FOR ALL USING (auth.uid() = user_id);

-- Subscriptions: own data only
CREATE POLICY "subscriptions_own_access" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Reviews: public read, authenticated insert, own update/delete
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_auth_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_own_modify" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_own_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- SEED DATA: Chapters
-- ============================================

INSERT INTO chapters (id, title, slug, description, sort_order) VALUES
(1, 'Introduction to Notaries Public', 'introduction-to-notaries', 'What a notary public is, the history and purpose of notarization, and how notaries differ from other legal professionals.', 1),
(2, 'Appointment and Qualifications in California', 'appointment-and-qualifications', 'Eligibility requirements, background checks, the application process, oath and bond, and the 4-year term for California notaries.', 2),
(3, 'Jurisdiction and Geographic Authority', 'jurisdiction-and-authority', 'Where a California notary can act, cross-state recognition, and electronic notarization jurisdiction.', 3),
(4, 'Types of Notarial Acts', 'types-of-notarial-acts', 'Acknowledgments, oaths and affirmations, jurats, certified copies, signature witnessing, and protests.', 4),
(5, 'Identifying Document Signers', 'identifying-signers', 'Personal knowledge, identification documents, credible witnesses, and remote notarization identity proofing.', 5),
(6, 'Record Keeping and Notary Journals', 'record-keeping-and-journals', 'Journal entry requirements, corrections, record retention, and journal surrender at end of commission.', 6),
(7, 'Ethics and Legal Responsibilities', 'ethics-and-legal-responsibilities', 'Prohibited acts, conflicts of interest, the $15,000 surety bond, and civil and criminal liability.', 7);

-- ============================================
-- SEED DATA: Chapter 1 Knowledge Cards (6 cards)
-- ============================================

INSERT INTO knowledge_cards (chapter_id, title, content, key_points, sort_order, source_label, source_url) VALUES
(1, 'What Is a Notary Public?', 'A notary public is a public officer commissioned by the California Secretary of State to serve as an impartial witness in the execution of documents. The primary role of a notary is to deter fraud by verifying the identity of document signers, ensuring they are signing willingly and without coercion, and administering oaths when required. Notaries are not judicial officers—they cannot provide legal advice or determine the legality of a document''s content.', ARRAY['Public officer commissioned by the state', 'Serves as an impartial witness', 'Primary purpose is fraud deterrence', 'Cannot give legal advice', 'Not a judicial officer'], 1, 'CA Secretary of State Notary Public Handbook (2025), Section 1', 'https://www.sos.ca.gov/notary'),

(1, 'History of the Notary Public', 'The office of notary public dates back to ancient Rome, where scribes known as "notarii" recorded proceedings and took shorthand notes. The modern notary system evolved through English common law and was brought to the American colonies. California established its notary system upon statehood in 1850, and the office has been governed by the California Government Code ever since.', ARRAY['Originated in ancient Rome (notarii)', 'Evolved through English common law', 'Brought to American colonies', 'California system established 1850', 'Governed by CA Government Code'], 2, 'CA Secretary of State Notary Public Handbook (2025), Section 1', 'https://www.sos.ca.gov/notary'),

(1, 'Why Notarization Matters', 'Notarization serves three critical functions in legal and commercial transactions: (1) Identity verification—confirming the signer is who they claim to be; (2) Willingness—ensuring the signer is acting voluntarily and understands the document; (3) Record creation—maintaining a journal that creates an audit trail. These functions protect property rights, prevent identity theft, and provide evidence in legal disputes.', ARRAY['Identity verification', 'Ensuring willingness and awareness', 'Creating a verifiable record', 'Protects property rights', 'Provides legal evidence'], 3, 'CA Government Code Sections 8200-8230', 'https://leginfo.legislature.ca.gov/'),

(1, 'Notary vs. Other Legal Professionals', 'A notary public is distinct from other legal professionals in several important ways: (1) Notaries cannot give legal advice—only licensed attorneys can; (2) Notaries cannot prepare legal documents for others unless they are also attorneys; (3) Notaries cannot represent clients in court; (4) Unlike judges, notaries do not adjudicate disputes or make legal rulings. The notary''s role is strictly limited to witnessing signatures, administering oaths, and certifying copies.', ARRAY['Cannot give legal advice (attorneys only)', 'Cannot prepare legal documents for others', 'Cannot represent clients in court', 'Role limited to witnessing and oaths', 'Not a judge or adjudicator'], 4, 'CA Secretary of State Notary Public Handbook (2025), Section 1', 'https://www.sos.ca.gov/notary'),

(1, 'The Notary''s Duty of Impartiality', 'A notary must remain strictly impartial in every transaction. This means: the notary cannot notarize documents in which they have a direct financial or beneficial interest; the notary cannot refuse service based on race, religion, nationality, or other protected characteristics; and the notary must treat all parties to a transaction equally. Impartiality is the cornerstone of public trust in the notary system.', ARRAY['Must be strictly impartial', 'Cannot have financial interest in transaction', 'Cannot discriminate against any person', 'Equal treatment of all parties', 'Cornerstone of public trust'], 5, 'CA Government Code Section 8224', 'https://leginfo.legislature.ca.gov/'),

(1, 'Overview of California Notary Requirements', 'To become a California notary public, you must: be at least 18 years old; be a legal resident of California; complete a 6-hour approved course of study; pass a written examination administered by the Secretary of State; undergo a background check (Live Scan fingerprinting); obtain a $15,000 surety bond; and file your bond and oath of office with the county clerk. The commission term is 4 years, renewable by re-examination.', ARRAY['Minimum 18 years old', 'CA legal resident', '6-hour approved course required', 'Written exam by Secretary of State', 'Background check (Live Scan)', '$15,000 surety bond required', '4-year commission term'], 6, 'CA Secretary of State Notary Public Handbook (2025), Section 2', 'https://www.sos.ca.gov/notary');
