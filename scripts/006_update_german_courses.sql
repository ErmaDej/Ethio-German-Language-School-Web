-- Update seed data to only include German language courses (A1 to C2)
-- Removing Amharic courses and replacing with proper German CEFR levels

-- Clear existing sample courses
DELETE FROM public.courses WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);

-- Insert German language courses A1 to C2
INSERT INTO public.courses (id, title, description, short_description, level, language_taught, duration_weeks, hours_per_week, max_students, price_usd, is_active) VALUES
-- A1 Level
(
  'a1-german-course-001',
  '{"en": "German A1 - Beginner", "de": "Deutsch A1 - Anfänger", "am": "ጀርመንኛ A1 - ጀማሪ"}',
  '{"en": "Start your German journey with this comprehensive A1 beginner course following the Common European Framework of Reference (CEFR). Learn fundamental grammar, essential vocabulary, and basic conversational skills.", "de": "Beginnen Sie Ihre Deutschreise mit diesem umfassenden A1-Anfängerkurs nach dem Gemeinsamen Europäischen Referenzrahmen (GER). Lernen Sie grundlegende Grammatik, wichtigen Wortschatz und grundlegende Konversationsfähigkeiten.", "am": "በጋራ የአውሮፓ ማጣቀሻ ማዕቀፍ (CEFR) የሚከተል ይህንን አጠቃላይ A1 የጀማሪ ኮርስ በመጠቀም የጀርመንኛ ጉዞዎን ይጀምሩ። መሰረታዊ ሰዋሰው፣ አስፈላጊ ቃላት እና መሰረታዊ የውይይት ክህሎቶችን ይማሩ።"}',
  '{"en": "Perfect for absolute beginners", "de": "Perfekt für absolute Anfänger", "am": "ለሙሉ ለሙሉ ጀማሪዎች ፍጹም"}',
  'a1',
  'de',
  12,
  4,
  15,
  299.99,
  true
),
-- A2 Level
(
  'a2-german-course-002',
  '{"en": "German A2 - Elementary", "de": "Deutsch A2 - Grundstufe", "am": "ጀርመንኛ A2 - መሰረታዊ"}',
  '{"en": "Build on your basic German skills with expanded vocabulary, simple grammar structures, and everyday conversations. Master common situations and express yourself clearly.", "de": "Bauen Sie auf Ihren grundlegenden Deutschkenntnissen mit erweitertem Wortschatz, einfachen Grammatikstrukturen und alltäglichen Gesprächen auf. Meistern Sie gängige Situationen und drücken Sie sich klar aus.", "am": "በተስፋፋ ቃላት፣ ቀላል ሰዋሰው መዋቅሮች እና የዕለት ተዕለት ውይይ቎ች መሰረታዊ የጀርመንኛ ክህሎቶችዎን ይገንቡ። የተለመዱ ሁኔታዎችን ይቆጣጠሩ እና እራስዎን በግልጽ ይግለጹ።"}',
  '{"en": "Expand your German foundation", "de": "Erweitern Sie Ihr Deutschfundament", "am": "የጀርመንኛ መሰረትዎን ያስፋፉ"}',
  'a2',
  'de',
  12,
  4,
  15,
  329.99,
  true
),
-- B1 Level
(
  'b1-german-course-003',
  '{"en": "German B1 - Intermediate", "de": "Deutsch B1 - Mittelstufe", "am": "ጀርመንኛ B1 - መካከለኛ"}',
  '{"en": "Achieve conversational fluency with complex grammar, workplace German, and cultural understanding. Handle most situations encountered while traveling and express opinions clearly.", "de": "Erreichen Sie Konversationsfließfähigkeit mit komplexer Grammatik, Arbeitsplatzdeutsch und kulturellem Verständnis. Bewältigen Sie die meisten Situationen auf Reisen und drücken Sie Meinungen klar aus.", "am": "በውስብስብ ሰዋሰው፣ የስራ ቦታ ጀርመንኛ እና ባህላዊ ግንዛቤ የውይይት ቀላልነት ያግኙ። በጉዞ ላይ የሚገጥሙትን አብዛኞቹን ሁኔታዎች ያስተናግዱ እና አስተያየቶችን በግልጽ ይግለጹ።"}',
  '{"en": "Gain conversational confidence", "de": "Gewinnen Sie Gesprächssicherheit", "am": "የውይይት እምነት ያግኙ"}',
  'b1',
  'de',
  14,
  5,
  12,
  379.99,
  true
),
-- B2 Level
(
  'b2-german-course-004',
  '{"en": "German B2 - Upper Intermediate", "de": "Deutsch B2 - Obere Mittelstufe", "am": "ጀርመንኛ B2 - ከፍተኛ መካከለኛ"}',
  '{"en": "Master advanced German with complex texts, professional communication, and spontaneous interaction. Discuss abstract topics and understand technical discussions in your field.", "de": "Meistern Sie fortgeschrittenes Deutsch mit komplexen Texten, professioneller Kommunikation und spontaner Interaktion. Diskutieren Sie abstrakte Themen und verstehen Sie technische Diskussionen in Ihrem Fachgebiet.", "am": "በውስብስብ ጽሁፎች፣ ሙያዊ ግንኙነት እና ድንገተኛ መስተጋብር የላቀ ጀርመንኛን ይቆጣጠሩ። ረቂቅ ርእሶችን ይወያዩ እና በእርስዎ መስክ ቴክኒካዊ ውይይ቎ችን ይረዱ።"}',
  '{"en": "Achieve professional proficiency", "de": "Erreichen Sie berufliche Kompetenz", "am": "ሙያዊ ብቃትን ያግኙ"}',
  'b2',
  'de',
  16,
  6,
  12,
  449.99,
  true
),
-- C1 Level
(
  'c1-german-course-005',
  '{"en": "German C1 - Advanced", "de": "Deutsch C1 - Fortgeschritten", "am": "ጀርመንኛ C1 - የላቀ"}',
  '{"en": "Attain near-native fluency with sophisticated expression, academic writing, and professional presentations. Express ideas fluently and spontaneously without searching for expressions.", "de": "Erreichen Sie nahezu muttersprachliche Fließfähigkeit mit anspruchsvollem Ausdruck, akademischem Schreiben und professionellen Präsentationen. Drücken Sie Ideen fließend und spontan aus, ohne nach Ausdrücken zu suchen.", "am": "በተራቀቀ አገላለጽ፣ የትምህርት ቤት ጽሑፍ እና ሙያዊ አቀራረብ ከተፈጥሯዊ ቋንቋ ብቃት ቅርብ ያግኙ። ሃሳቦችን ያለ አገላለጽ ፍለጋ በቀላሉ እና በድንገት ይግለጹ።"}',
  '{"en": "Master sophisticated German", "de": "Meistern Sie anspruchsvolles Deutsch", "am": "የላቀ ጀርመንኛን ይቆጣጠሩ"}',
  'c1',
  'de',
  18,
  6,
  10,
  529.99,
  true
),
-- C2 Level
(
  'c2-german-course-006',
  '{"en": "German C2 - Proficiency", "de": "Deutsch C2 - Muttersprachliches Niveau", "am": "ጀርመንኛ C2 - ብቃት"}',
  '{"en": "Reach native-level mastery with nuanced expression, literary analysis, and expert communication. Understand virtually everything with ease and express yourself with precision and subtlety.", "de": "Erreichen Sie muttersprachliches Niveau mit nuanciertem Ausdruck, literarischer Analyse und Expertenkommunikation. Verstehen Sie praktisch alles mühelos und drücken Sie sich mit Präzision und Subtilität aus.", "am": "በተለያየ አገላለጽ፣ የስነ-ጽሑፍ ትንተና እና የባለሙያ ግንኙነት የተፈጥሮ ደረጃ ብቃትን ይድረሱ። ሁሉንም ነገር በቀላሉ ይረዱ እና እራስዎን በትክክለኝነት እና በስውር ይግለጹ።"}',
  '{"en": "Achieve native-level mastery", "de": "Erreichen Sie muttersprachliches Niveau", "am": "የተፈጥሮ ደረጃ ብቃትን ያግኙ"}',
  'c2',
  'de',
  20,
  6,
  8,
  599.99,
  true
);
