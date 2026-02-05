// app/api/auth/token/route.ts
import { auth0 } from "@/lib/auth0";

export async function GET() {
  const { token } = await auth0.getAccessToken();
  return Response.json({ accessToken: token });
}
