// app/page.tsx
import { CustomSpinner } from "@/components/custom";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/login");
  }

  if (session) {
    redirect("/dashboard");
  }

  return (
    <CustomSpinner className="w-full h-full flex items-center justify-center" />
  );
}
