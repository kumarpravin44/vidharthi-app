import { useLanguage } from "../context/LanguageContext";

function LanguageSwitcher({ style }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher" style={style}>
      <button
        className={`lang-btn ${language === "en" ? "lang-active" : ""}`}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        className={`lang-btn ${language === "hi" ? "lang-active" : ""}`}
        onClick={() => setLanguage("hi")}
      >
        हि
      </button>
    </div>
  );
}

export default LanguageSwitcher;
