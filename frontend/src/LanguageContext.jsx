import { createContext, useContext, useEffect, useState } from "react";
import { translations, locales } from "./i18n";

const LanguageContext = createContext();
export const useLang = () => useContext(LanguageContext);

function initialLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved && translations[saved]) return saved;
  } catch {}
  return "fr";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("lang", lang); } catch {}
  }, [lang]);

  // t("clé") donne le texte dans la langue choisie
  function t(key) {
    return translations[lang][key] ?? translations.fr[key] ?? key;
  }

  // te(erreur) traduit les erreurs qui viennent du backend
  function te(err) {
    if (!err.code) return t("err_network");
    return translations[lang]["err_" + err.code] ?? err.message;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, te, locale: locales[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}