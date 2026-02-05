import { LoginButton, Text, TextVariant } from "@/components/common";
import { Screen } from "@/components/template";

const Error = () => {
  return (
    <Screen className=" flex flex-col gap-4 items-center justify-center h-full w-full">
      <Text variant={TextVariant.bodyLg}>
        {"unable to authorize please try. agin"}
      </Text>
      <LoginButton />
    </Screen>
  );
};

export default Error;
