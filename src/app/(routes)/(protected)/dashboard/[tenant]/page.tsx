import { TenantSteps } from "@/components/pages";
import { Screen, ScreenHeader } from "@/components/template";

const TenantPage = async ({ params }: { params: { tenant: string } }) => {
  const { tenant } = await params;
  const [tenantId, tenancyName] = tenant.split("-");

  return (
    <Screen
      defaultPadding={false}
      className="bg-surface flex flex-col gap-2 lg:gap-4"
    >
      <ScreenHeader
        title={"Tenants Table"}
        // subTitle={t("DynamicFormsForClientInfo")}
        className="bg-surface px-4 sm:px-6 pt-4 sm:pt-6 rounded-t-2xl"
      ></ScreenHeader>
      <TenantSteps tenantId={tenantId} tenancyName={tenancyName} />
    </Screen>
  );
};

export default TenantPage;
