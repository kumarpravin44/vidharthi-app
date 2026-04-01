import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useTranslation } from "react-i18next"; // 👈 ADD

function ReturnRefundPolicy() {
  const { t } = useTranslation(); // 👈 ADD

  return (
    <>
      <InternalHeader title={t("return_refund_policy")} />

      <div className="policy-page content">
        <div className="policy-card">

          <h2>{t("return_refund_policy")}</h2>

          <p>{t("rr_intro")}</p>

          <h3>{t("rr_1_title")}</h3>
          <p>{t("rr_1_desc")}</p>
          <ul>
            <li>{t("rr_1_item1")}</li>
            <li>{t("rr_1_item2")}</li>
            <li>{t("rr_1_item3")}</li>
          </ul>

          <h3>{t("rr_2_title")}</h3>
          <p>{t("rr_2_desc")}</p>
          <ul>
            <li>{t("rr_2_item1")}</li>
            <li>{t("rr_2_item2")}</li>
            <li>{t("rr_2_item3")}</li>
          </ul>

          <h3>{t("rr_3_title")}</h3>
          <p>{t("rr_3_desc")}</p>

          <h3>{t("rr_4_title")}</h3>
          <p>{t("rr_4_desc")}</p>

          <h3>{t("rr_5_title")}</h3>
          <p>{t("rr_5_desc")}</p>

          <h3>{t("rr_6_title")}</h3>
          <p>{t("rr_6_desc")}</p>

          <p className="last-updated">
            {t("last_updated")}
          </p>

        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default ReturnRefundPolicy;