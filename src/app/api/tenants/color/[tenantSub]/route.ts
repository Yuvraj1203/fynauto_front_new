import { TenantInfoType } from "@/services/types";
import { OneColors, tenantInfoOne } from "@/tenants/one";
import { ThreeColors, tenantInfoThree } from "@/tenants/three";
import { TwoColors, tenantInfoTwo } from "@/tenants/two";
import { NextResponse } from "next/server";

export const tenants: Record<
  string,
  {
    light: Record<string, string>;
    dark: Record<string, string>;
  }
> = {
  one: OneColors,
  two: TwoColors,
  three: ThreeColors,
};

export const tenantInfo: Record<string, TenantInfoType> = {
  one: tenantInfoOne,
  two: tenantInfoTwo,
  three: tenantInfoThree,
};

export async function GET(
  request: Request,
  context: { params: Promise<{ tenantSub: string }> }
) {
  const { tenantSub } = await context.params;

  const responseData = {
    tenantInfo: {
      isData: tenantInfo[tenantSub] ? true : false,
      ...tenantInfo[tenantSub],
    },
    color: tenantSub && tenants[tenantSub] ? tenants[tenantSub] : tenants.one,
  };

  return NextResponse.json({
    message: "User fetched successfully",
    userId: tenantSub,
    data: responseData,
  });
}
