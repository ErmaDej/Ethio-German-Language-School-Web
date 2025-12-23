const { translations } = require('./lib/i18n/translations.ts');

const langs = ['en', 'de', 'am'];
const keys = {};

langs.forEach(lang => {
    keys[lang] = Object.keys(translations[lang]);
});

const allKeys = new Set([...keys.en, ...keys.de, ...keys.am]);

allKeys.forEach(key => {
    langs.forEach(lang => {
        if (!keys[lang].includes(key)) {
            console.log(`Key "${key}" is missing in "${lang}"`);
        }
    });
});
