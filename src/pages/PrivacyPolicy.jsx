import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useTranslation } from "react-i18next"; // 👈 ADD

function PrivacyPolicy() {
  const { t } = useTranslation(); // 👈 ADD

  return (
    <>
      <InternalHeader title={t("privacy_policy")} />

      <div className="privacy-page content">
        <div className="privacy-card">

          <h2>{t("privacy_policy_page")}</h2>

          <p>{t("pp_intro")}</p>

          <h3>{t("pp_1_title")}</h3>
          <p>{t("pp_1_desc")}</p>

          <h3>{t("pp_2_title")}</h3>
          <p>{t("pp_2_desc")}</p>

          <h3>{t("pp_3_title")}</h3>
          <p>{t("pp_3_desc")}</p>

          <h3>{t("pp_4_title")}</h3>
          <p>{t("pp_4_desc")}</p>

          <h3>{t("pp_5_title")}</h3>
          <p>{t("pp_5_desc")}</p>

          <h3>{t("pp_6_title")}</h3>
          <p>{t("pp_6_desc")}</p>

          <h3>{t("pp_7_title")}</h3>
          <p>{t("pp_7_desc")}</p>

          <p className="last-updated">
            {t("last_updated")}
          </p>

        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default PrivacyPolicy;