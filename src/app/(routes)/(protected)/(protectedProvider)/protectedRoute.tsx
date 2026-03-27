import { auth0 } from "@/lib/auth0";
import { LayoutTypes } from "@/services/types";
import { redirect } from "next/navigation";
import ProtectedClient from "./protectedClient";

const ProtectedProvider = async ({ children }: LayoutTypes) => {
  const session = await auth0.getSession();
  if (!session || !session?.user) redirect("/auth/login");

  return (
    <>
      <ProtectedClient session={session} />
      {children}
    </>
  );
};

export default ProtectedProvider;
