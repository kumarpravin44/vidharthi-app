import { useLanguage } from "../context/LanguageContext";

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="lang-float" onClick={toggleLanguage}>
      <i className="bx bx-globe"></i>
      <span>{language === "en" ? "HI" : "EN"}</span>
    </div>
  );
}

export default LanguageToggle;