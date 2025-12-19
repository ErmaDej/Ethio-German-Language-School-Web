-- Remove Amharic and restructure to German-only with delivery methods
-- Drop old language_taught column and add delivery_method

-- Add delivery method column
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS delivery_method TEXT NOT NULL DEFAULT 'onsite' CHECK (delivery_method IN ('online', 'onsite', 'one_to_one'));

-- Delete any non-German courses
DELETE FROM public.courses WHERE language_taught != 'de';

-- Update all existing courses to German
UPDATE public.courses SET language_taught = 'de' WHERE language_taught IS NOT NULL;

-- Clear existing sample data
DELETE FROM public.enrollments;
DELETE FROM public.waitlist;
DELETE FROM public.course_schedules;
DELETE FROM public.courses;

-- Insert German courses for different delivery methods and CEFR levels
INSERT INTO public.courses (title, description, short_description, level, language_taught, duration_weeks, hours_per_week, max_students, price_usd, delivery_method, is_active) VALUES
-- Online German Courses (A1-C2)
(
  '{"en": "German A1 - Online", "de": "Deutsch A1 - Online", "am": "ጀርመንኛ A1 - በመስመር ላይ"}',
  '{"en": "Start your German journey online! Learn basic greetings, introductions, and everyday conversations. Perfect for complete beginners who want flexible online learning.", "de": "Beginnen Sie Ihre Deutschreise online! Lernen Sie grundlegende Begrüßungen, Vorstellungen und Alltagsgespräche.", "am": "የጀርመንኛ ጉዞዎን በመስመር ላይ ይጀምሩ! መሰረታዊ ሰላምታዎችን፣ መግቢያዎችን እና የዕለት ተዕለት ውይይቶችን ይማሩ።"}',
  '{"en": "Begin your German learning journey from home with interactive online classes", "de": "Beginnen Sie Ihre Deutschlernreise von zu Hause aus", "am": "የጀርመንኛ ትምህርት ጉዞዎን ከቤት ይጀምሩ"}',
  'beginner',
  'de',
  12,
  6,
  20,
  299.00,
  'online',
  true
),
(
  '{"en": "German A2 - Online", "de": "Deutsch A2 - Online", "am": "ጀርመንኛ A2 - በመስመር ላይ"}',
  '{"en": "Build on your foundation! Expand vocabulary, express opinions, and handle everyday situations in German through our interactive online platform.", "de": "Bauen Sie auf Ihrer Grundlage auf! Erweitern Sie Ihren Wortschatz und meistern Sie Alltagssituationen.", "am": "መሰረትዎን ይገንቡ! የቃላት ዝርዝርዎን ያስፋፉ እና የዕለት ተዕለት ሁኔታዎችን በጀርመንኛ ያስተናግዱ።"}',
  '{"en": "Expand your German skills with flexible online elementary courses", "de": "Erweitern Sie Ihre Deutschkenntnisse online", "am": "የጀርመንኛ ችሎታዎን በመስመር ላይ ያስፋፉ"}',
  'elementary',
  'de',
  12,
  6,
  20,
  329.00,
  'online',
  true
),
(
  '{"en": "German B1 - Online", "de": "Deutsch B1 - Online", "am": "ጀርመንኛ B1 - በመስመር ላይ"}',
  '{"en": "Achieve intermediate fluency online! Discuss complex topics, write coherent texts, and understand main ideas in German media and conversations.", "de": "Erreichen Sie mittlere Sprachkenntnisse online! Diskutieren Sie komplexe Themen.", "am": "መካከለኛ ችሎታን በመስመር ላይ ያግኙ! ውስብስብ ርዕሰ ጉዳዮችን ይወያዩ።"}',
  '{"en": "Master intermediate German from anywhere with our comprehensive online program", "de": "Meistern Sie mittleres Deutsch von überall aus", "am": "መካከለኛ ጀርመንኛን ከየትኛውም ቦታ ይቆጣጠሩ"}',
  'intermediate',
  'de',
  14,
  8,
  18,
  399.00,
  'online',
  true
),
(
  '{"en": "German B2 - Online", "de": "Deutsch B2 - Online", "am": "ጀርመንኛ B2 - በመስመር ላይ"}',
  '{"en": "Advanced online learning! Express yourself fluently, understand abstract concepts, and engage in professional German communication.", "de": "Fortgeschrittenes Online-Lernen! Drücken Sie sich fließend aus und verstehen Sie abstrakte Konzepte.", "am": "የላቀ የመስመር ላይ ትምህርት! እራስዎን በተሳካ ሁኔታ ይግለጹ።"}',
  '{"en": "Develop upper-intermediate German proficiency through online classes", "de": "Entwickeln Sie fortgeschrittene Deutschkenntnisse online", "am": "የላቀ ጀርመንኛ ብቃትን በመስመር ላይ ያዳብሩ"}',
  'upper_intermediate',
  'de',
  16,
  8,
  15,
  449.00,
  'online',
  true
),
(
  '{"en": "German C1 - Online", "de": "Deutsch C1 - Online", "am": "ጀርመንኛ C1 - በመስመር ላይ"}',
  '{"en": "Near-native proficiency online! Master complex texts, implicit meanings, and professional German for academic and career success.", "de": "Fast muttersprachliche Kompetenz online! Meistern Sie komplexe Texte und professionelles Deutsch.", "am": "የአፍ መፍቻ ቋንቋ ብቃትን በመስመር ላይ ይቆጣጠሩ!"}',
  '{"en": "Achieve advanced German mastery with our intensive online program", "de": "Erreichen Sie fortgeschrittene Deutschkenntnisse online", "am": "የላቀ ጀርመንኛ ብቃትን ያግኙ"}',
  'advanced',
  'de',
  18,
  10,
  12,
  549.00,
  'online',
  true
),
(
  '{"en": "German C2 - Online", "de": "Deutsch C2 - Online", "am": "ጀርመንኛ C2 - በመስመር ላይ"}',
  '{"en": "Master-level German online! Achieve native-like fluency with sophisticated expression, nuanced understanding, and professional excellence.", "de": "Deutschkenntnisse auf Masterniveau online! Erreichen Sie muttersprachliche Kompetenz.", "am": "የተካነ ደረጃ ጀርመንኛ በመስመር ላይ! የአፍ መፍቻ ብቃትን ያግኙ።"}',
  '{"en": "Reach mastery level German with our premium online course", "de": "Erreichen Sie Deutsch-Mastery online", "am": "የጀርመንኛ የመማር ደረጃን በመስመር ላይ ይድረሱ"}',
  'proficient',
  'de',
  20,
  10,
  10,
  649.00,
  'online',
  true
),

-- Onsite German Courses (A1-C2) at our Addis Ababa campus
(
  '{"en": "German A1 - Onsite", "de": "Deutsch A1 - Vor Ort", "am": "ጀርመንኛ A1 - በቦታው"}',
  '{"en": "Learn German at our modern Addis Ababa campus! Face-to-face instruction with experienced teachers, interactive group activities, and immersive learning environment.", "de": "Lernen Sie Deutsch auf unserem modernen Campus in Addis Abeba! Direkter Unterricht mit erfahrenen Lehrern.", "am": "በአዲስ አበባ ግቢያችን ጀርመንኛን ይማሩ! ከተሞክሮ ያላቸው መምህራን ጋር በፊት ለፊት የማስተማር።"}',
  '{"en": "Start learning German in our interactive Addis Ababa classroom", "de": "Beginnen Sie in unserem Klassenzimmer in Addis Abeba", "am": "በአዲስ አበባ የክፍል ቤታችን ጀርመንኛን መማር ይጀምሩ"}',
  'beginner',
  'de',
  12,
  8,
  15,
  399.00,
  'onsite',
  true
),
(
  '{"en": "German A2 - Onsite", "de": "Deutsch A2 - Vor Ort", "am": "ጀርመንኛ A2 - በቦታው"}',
  '{"en": "Continue your German journey in person! Participate in engaging classroom discussions, cultural activities, and real-world practice at our Addis Ababa location.", "de": "Setzen Sie Ihre Deutschreise persönlich fort! Nehmen Sie an ansprechenden Diskussionen teil.", "am": "የጀርመንኛ ጉዞዎን በአካል ይቀጥሉ! በአዲስ አበባ ቦታችን በመሳተፍ።"}',
  '{"en": "Develop elementary German with in-person classes in Addis Ababa", "de": "Entwickeln Sie Grundkenntnisse in Addis Abeba", "am": "መሰረታዊ ጀርመንኛን በአዲስ አበባ በአካል ያዳብሩ"}',
  'elementary',
  'de',
  12,
  8,
  15,
  429.00,
  'onsite',
  true
),
(
  '{"en": "German B1 - Onsite", "de": "Deutsch B1 - Vor Ort", "am": "ጀርመንኛ B1 - በቦታው"}',
  '{"en": "Intermediate German in our vibrant campus! Practice speaking, engage in debates, and experience German culture through events and activities in Addis Ababa.", "de": "Mittelstufen-Deutsch auf unserem lebendigen Campus! Üben Sie Sprechen und erleben Sie deutsche Kultur.", "am": "በቁርጥት ግቢያችን መካከለኛ ጀርመንኛ! ንግግር ይለማመዱ።"}',
  '{"en": "Master intermediate German through immersive onsite learning", "de": "Meistern Sie mittleres Deutsch durch immersives Lernen", "am": "መካከለኛ ጀርመንኛን በቦታ ላይ ይማሩ"}',
  'intermediate',
  'de',
  14,
  10,
  12,
  529.00,
  'onsite',
  true
),
(
  '{"en": "German B2 - Onsite", "de": "Deutsch B2 - Vor Ort", "am": "ጀርመንኛ B2 - በቦታው"}',
  '{"en": "Advanced German at our state-of-the-art facility! Intensive practice, professional presentations, and business German in an immersive Addis Ababa environment.", "de": "Fortgeschrittenes Deutsch in unserer hochmodernen Einrichtung! Intensive Praxis und Business-Deutsch.", "am": "የላቀ ጀርመንኛ በዘመናዊ ተቋማችን! ተጨማሪ ልምምድ።"}',
  '{"en": "Achieve upper-intermediate proficiency in our Addis Ababa campus", "de": "Erreichen Sie fortgeschrittene Kenntnisse in Addis Abeba", "am": "በአዲስ አበባ ግቢያችን የላቀ ብቃትን ያግኙ"}',
  'upper_intermediate',
  'de',
  16,
  10,
  12,
  599.00,
  'onsite',
  true
),
(
  '{"en": "German C1 - Onsite", "de": "Deutsch C1 - Vor Ort", "am": "ጀርመንኛ C1 - በቦታው"}',
  '{"en": "Near-native German in person! Academic writing, professional communication, and cultural immersion at our premium Addis Ababa learning center.", "de": "Fast muttersprachliches Deutsch persönlich! Akademisches Schreiben und professionelle Kommunikation.", "am": "የአፍ መፍቻ ደረጃ ጀርመንኛ በአካል! በዋናው የእኛ ማዕከል።"}',
  '{"en": "Master advanced German with intensive onsite instruction", "de": "Meistern Sie fortgeschrittenes Deutsch vor Ort", "am": "የላቀ ጀርመንኛን በቦታው ተማሩ"}',
  'advanced',
  'de',
  18,
  12,
  10,
  749.00,
  'onsite',
  true
),
(
  '{"en": "German C2 - Onsite", "de": "Deutsch C2 - Vor Ort", "am": "ጀርመንኛ C2 - በቦታው"}',
  '{"en": "Mastery-level German in our elite program! Perfect your German to native speaker level with expert guidance at our Addis Ababa flagship location.", "de": "Deutsch auf Masterniveau in unserem Elite-Programm! Perfektionieren Sie Ihr Deutsch auf muttersprachlichem Niveau.", "am": "የመምህርነት ደረጃ ጀርመንኛ በልዩ ፕሮግራማችን!"}',
  '{"en": "Reach mastery level with our premium onsite program", "de": "Erreichen Sie Mastery-Level mit unserem Premium-Programm", "am": "የመምህርነት ደረጃን በዋና ፕሮግራማችን ይድረሱ"}',
  'proficient',
  'de',
  20,
  12,
  8,
  899.00,
  'onsite',
  true
),

-- One-to-One German Courses (personalized instruction)
(
  '{"en": "German A1 - One-to-One Tutoring", "de": "Deutsch A1 - Einzelunterricht", "am": "ጀርመንኛ A1 - ግለሰባዊ ትምህርት"}',
  '{"en": "Personalized German learning! Get individual attention from expert instructors, customize your learning pace, and focus on your specific goals. Perfect for busy professionals.", "de": "Personalisiertes Deutschlernen! Erhalten Sie individuelle Aufmerksamkeit von Expertenlehrern.", "am": "ግላዊ የጀርመንኛ ትምህርት! ከባለሙያ አስተማሪዎች ግለሰባዊ ትኩረት ያግኙ።"}',
  '{"en": "Begin German with personalized one-on-one instruction", "de": "Beginnen Sie Deutsch mit persönlichem Einzelunterricht", "am": "ጀርመንኛን በግል አንድ ለአንድ ትምህርት ይጀምሩ"}',
  'beginner',
  'de',
  8,
  4,
  1,
  599.00,
  'one_to_one',
  true
),
(
  '{"en": "German A2-B1 - One-to-One Tutoring", "de": "Deutsch A2-B1 - Einzelunterricht", "am": "ጀርመንኛ A2-B1 - ግለሰባዊ ትምህርት"}',
  '{"en": "Accelerate your progress! Personalized lessons tailored to your learning style, schedule flexibility, and focused skill development with dedicated instructor support.", "de": "Beschleunigen Sie Ihren Fortschritt! Personalisierte Lektionen auf Ihren Lernstil zugeschnitten.", "am": "እድገትዎን ያፋጥኑ! በእርስዎ የመማሪያ አይነት የተዘጋጁ ግላዊ ትምህርቶች።"}',
  '{"en": "Advance faster with customized elementary-intermediate tutoring", "de": "Schnellerer Fortschritt mit individualisiertem Unterricht", "am": "በተበጀ መካከለኛ-አማካይ ትምህርት ፈጣን እድገት"}',
  'intermediate',
  'de',
  10,
  5,
  1,
  749.00,
  'one_to_one',
  true
),
(
  '{"en": "German B2-C1 - One-to-One Tutoring", "de": "Deutsch B2-C1 - Einzelunterricht", "am": "ጀርመንኛ B2-C1 - ግለሰባዊ ትምህርት"}',
  '{"en": "Professional German mastery! Intensive one-on-one sessions focused on business German, academic writing, or specialized vocabulary based on your career needs.", "de": "Professionelle Deutsch-Meisterschaft! Intensive Einzelsitzungen mit Fokus auf Business-Deutsch.", "am": "ሙያዊ ጀርመንኛ ብቃት! በንግድ ጀርመንኛ ላይ ያተኮሩ ጠንካራ ግለሰባዊ ክፍለ ጊዜዎች።"}',
  '{"en": "Master advanced German with personalized professional tutoring", "de": "Meistern Sie fortgeschrittenes Deutsch mit persönlichem Unterricht", "am": "የላቀ ጀርመንኛን በግል ሙያዊ ትምህርት ይቆጣጠሩ"}',
  'advanced',
  'de',
  12,
  6,
  1,
  999.00,
  'one_to_one',
  true
),
(
  '{"en": "German C2 - One-to-One Tutoring", "de": "Deutsch C2 - Einzelunterricht", "am": "ጀርመንኛ C2 - ግለሰባዊ ትምህርት"}',
  '{"en": "Elite German excellence! Work with master instructors to perfect your German to native-level proficiency. Ideal for executives, academics, and serious language enthusiasts.", "de": "Elite-Deutsch-Exzellenz! Arbeiten Sie mit Meisterlehrern, um Ihr Deutsch auf muttersprachliches Niveau zu perfektionieren.", "am": "ልዩ ጀርመንኛ ብልጫ! የጀርመንኛዎን ወደ አፍ መፍቻ ደረጃ ለማሟላት ከዋና አስተማሪዎች ጋር ይስሩ።"}',
  '{"en": "Achieve native-level mastery with elite one-on-one coaching", "de": "Erreichen Sie muttersprachliches Mastery mit Elite-Coaching", "am": "የአፍ መፍቻ ደረጃ ብቃትን በልዩ አንድ ለአንድ አሰልጣኝ ያግኙ"}',
  'proficient',
  'de',
  16,
  8,
  1,
  1499.00,
  'one_to_one',
  true
);
