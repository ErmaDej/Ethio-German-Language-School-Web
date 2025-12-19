-- Insert sample courses
INSERT INTO public.courses (id, title, description, short_description, level, language_taught, duration_weeks, hours_per_week, max_students, price_usd, is_active) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  '{"en": "German for Beginners", "de": "Deutsch für Anfänger", "am": "ጀርመንኛ ለጀማሪዎች"}',
  '{"en": "Start your German language journey with this comprehensive beginner course. Learn fundamental grammar, vocabulary, and conversational skills.", "de": "Beginnen Sie Ihre Deutschreise mit diesem umfassenden Anfängerkurs. Lernen Sie grundlegende Grammatik, Wortschatz und Konversationsfähigkeiten.", "am": "በዚህ አጠቃላይ የጀማሪ ኮርስ የጀርመንኛ ቋንቋ ጉዞዎን ይጀምሩ። መሰረታዊ ሰዋሰው፣ የቃላት እና የውይይት ክህሎቶችን ይማሩ።"}',
  '{"en": "Perfect for absolute beginners", "de": "Perfekt für absolute Anfänger", "am": "ለሙሉ ለሙሉ ጀማሪዎች ፍጹም"}',
  'beginner',
  'de',
  12,
  4,
  15,
  299.99,
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  '{"en": "German Intermediate", "de": "Deutsch Mittelstufe", "am": "ጀርመንኛ መካከለኛ"}',
  '{"en": "Build on your German foundation with intermediate grammar, complex conversations, and cultural insights.", "de": "Bauen Sie auf Ihrem Deutschfundament mit Mittelstufengrammatik, komplexen Gesprächen und kulturellen Einblicken auf.", "am": "በመካከለኛ ሰዋሰው፣ ውስብስብ ውይይ቎ች እና ባህላዊ ግንዛቤዎች በጀርመንኛ መሰረትዎ ላይ ይገንቡ።"}',
  '{"en": "Expand your German skills", "de": "Erweitern Sie Ihre Deutschkenntnisse", "am": "የጀርመንኛ ክህሎቶችዎን ያስፋፉ"}',
  'intermediate',
  'de',
  12,
  5,
  12,
  349.99,
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  '{"en": "Amharic Basics", "de": "Amharisch Grundlagen", "am": "የአማርኛ መሰረታዊ ነገሮች"}',
  '{"en": "Discover the beauty of Amharic language and Ethiopian culture. Learn to read, write, and speak Amharic confidently.", "de": "Entdecken Sie die Schönheit der amharischen Sprache und der äthiopischen Kultur. Lernen Sie, Amharisch selbstbewusst zu lesen, zu schreiben und zu sprechen.", "am": "የአማርኛ ቋንቋ እና የኢትዮጵያ ባህል ውበትን ያግኙ። አማርኛን በራስ መተማመን እንዲያነቡ፣ እንዲጽፉ እና እንዲናገሩ ይማሩ።"}',
  '{"en": "Learn Ethiopian Amharic", "de": "Lernen Sie Äthiopisches Amharisch", "am": "የኢትዮጵያ አማርኛ ይማሩ"}',
  'beginner',
  'am',
  10,
  3,
  15,
  249.99,
  true
);
