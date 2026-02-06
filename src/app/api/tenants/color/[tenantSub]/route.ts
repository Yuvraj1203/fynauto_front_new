import { OneColors } from "@/tenants/one";
import { ThreeColors } from "@/tenants/three";
import { TwoColors } from "@/tenants/two";
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

export async function GET(
  request: Request,
  context: { params: Promise<{ tenantSub: string }> }
) {
  const { tenantSub } = await context.params;

  const responseData = {
    color: tenantSub && tenants[tenantSub] ? tenants[tenantSub] : tenants.one,
  };

  return NextResponse.json({
    message: "User fetched successfully",
    userId: tenantSub,
    data: responseData,
  });
}
