import { useTranslation } from "react-i18next";

function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="lang-float" onClick={toggleLanguage}>
      <i className="bx bx-globe"></i>
      <span>{i18n.language === "en" ? "HI" : "EN"}</span>
    </div>
  );
}

export default LanguageToggle;