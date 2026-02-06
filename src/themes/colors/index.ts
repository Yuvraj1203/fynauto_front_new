import { CookiesType, TenantColorsType } from "@/services/types";
import { OneColors, ThreeColors, TwoColors } from "@/tenants";
import { getCookie } from "@/utils/cookiesUtils/cookiesUtils";
import { fetchTenantDetailsFromApi } from "@/utils/tenantUtils/fetchTenantDetails";
import { colorManipulation } from "@/utils/themeUtils/colorManipulation";

export const tenants: Record<string, TenantColorsType> = {
  one: OneColors,
  two: TwoColors,
  three: ThreeColors,
};

export const getTenantStyle = async () => {
  const tenantSub = (await getCookie(CookiesType.tenant)) || "one";

  const tenantApiResponse = await fetchTenantDetailsFromApi(tenantSub);

  // const tenant = tenants[tenantSub];

  if (tenantApiResponse.success && tenantApiResponse.data) {
    const tenant = tenantApiResponse.data;

    return {
      ...tenant,
      color: colorManipulation(tenant.color),
      isColor: true,
    };
  } else {
    return {
      isColor: false,
      color: "",
    };
  }
};
