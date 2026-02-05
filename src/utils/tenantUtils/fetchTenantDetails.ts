import { serverApiRequest } from "@/services/serverApiInstance";
import { TenantResponse } from "@/services/types";

export const fetchTenantDetailsFromApi = async (
  tenantSub: string,
): Promise<TenantResponse> => {
  const tenantInfoResponse = await serverApiRequest({
    endpoint: `/api/tenants/color/${tenantSub}`,
    // cache: true,
  });
  return { success: true, data: tenantInfoResponse.data };
};
