import { Screen, ScreenHeader } from "@/components/template";
import { useTranslations } from "next-intl";
import Dashboard from "./(components)/dashboard";

const DashboardPage = () => {
  const t = useTranslations();

  return (
    <Screen className="bg-surface flex flex-col gap-2 lg:gap-4">
      <ScreenHeader
        title={t("TenantsTable")}
        // subTitle={t("DynamicFormsForClientInfo")}
        className="bg-surface"
      ></ScreenHeader>
      <Dashboard />
    </Screen>
  );
};

export default DashboardPage;
