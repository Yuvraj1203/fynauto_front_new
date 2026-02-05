import { Screen } from "@/components/template";
import LoginPage from "./(components)/loginPage";

const Page = () => {
  return (
    <Screen className=" flex flex-col gap-4 items-center justify-center bg-surface h-full w-full">
      <LoginPage />
    </Screen>
  );
};

export default Page;
