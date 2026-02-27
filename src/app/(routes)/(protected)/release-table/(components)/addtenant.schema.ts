import { z } from "zod";

export const addCustomTenantSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Tenant name should be min of 2 characters" }),
  status: z.number(),
  androidVersion: z.string(),
  iosVersion: z.string(),
  matchBranch: z.string(),
});

export type AddCustomTenantType = z.infer<typeof addCustomTenantSchema>;
