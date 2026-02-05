import { auth0 } from "@/lib/auth0";
import { LayoutTypes } from "@/services/types";
import { redirect } from "next/navigation";

const ProtectedProvider = async ({ children }: LayoutTypes) => {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  return <>{children}</>;
};

export default ProtectedProvider;
