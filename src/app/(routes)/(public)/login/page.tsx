"use client";
import { Text, TextVariant } from "@/components/common";
import { CustomCard } from "@/components/custom";
import { ReactIcons } from "@/public";
import { useTranslations } from "next-intl";
import Link from "next/link";

const LoginPage = () => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-4 md:gap-6 items-center justify-center w-full m-auto p-4 md:p-6">
      <div className="border-2 border-primary-200 text-primary-200 rounded-medium p-4 bg-primary-50">
        <ReactIcons.Building size={32} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Text variant={TextVariant.title}>{t("WelcomeBack")}</Text>
        <Text variant={TextVariant.subTitle}>
          {t("SignInToAccessYourDashboard")}
        </Text>
      </div>

      <CustomCard
        baseStyle={"shadow-sm duration-200 hover:shadow-md"}
        bodyStyle="flex flex-col min-h-fit items-center gap-4 p-6"
      >
        <Text variant={TextVariant.subTitle}>{t("ChooseSignInMethod")}</Text>

        <div className="group flex w-full items-center gap-3 p-2 border-1 border-default-300 bg-default-50 hover:bg-default-100 rounded-medium cursor-pointer duration-250">
          <span className="flex items-center justify-center bg-primary-50 text-primary-300 p-3 rounded-medium">
            <ReactIcons.Smartphone size={16} />
          </span>
          <div className="flex flex-col gap-px items-start grow">
            <Text variant={TextVariant.subTitle}>{t("ContinueWithPhone")}</Text>
            <Text
              className="text-secondary-text text-xs"
              variant={TextVariant.custom}
            >
              {t("ReceiveCodeViaSMS")}
            </Text>
          </div>
          <ReactIcons.ArrowRight
            className="group-hover:scale-110 text-default-400 group-hover:text-default-800 group-hover:translate-x-1 mr-2 duration-250"
            size={16}
          />
        </div>

        <div className="flex w-full items-center justify-center gap-2">
          <span className="grow h-px rounded-full bg-default-300" />
          <Text className="" variant={TextVariant.subTitle}>
            {t("OR")}
          </Text>
          <span className="grow h-px rounded-full bg-default-300" />
        </div>

        <a
          href="/auth/login"
          className="group flex w-full items-center gap-3 p-2 border-1 border-default-300 bg-default-50 hover:bg-default-100 rounded-medium cursor-pointer duration-250"
        >
          <span className="flex items-center justify-center bg-primary-50 text-primary-300 p-3 rounded-medium">
            <ReactIcons.Email size={16} />
          </span>
          <div className="flex flex-col gap-px items-start grow">
            <Text variant={TextVariant.subTitle}>{t("ContinueWithEmail")}</Text>
            <Text
              className="text-secondary-text text-xs"
              variant={TextVariant.custom}
            >
              {t("SignInUsingEmail")}
            </Text>
          </div>
          <ReactIcons.ArrowRight
            className="group-hover:scale-110 text-default-400 group-hover:text-default-800 group-hover:translate-x-1 mr-2 duration-250"
            size={16}
          />
        </a>
      </CustomCard>

      <Text variant={TextVariant.caption}>
        {"By continuing, you agree to our "}
        <Link className="text-focus" href={"/terms"}>
          {"Terms of Service"}
        </Link>
        {" and "}
        <Link className="text-focus" href={"/privacy"}>
          {"Privacy Policy"}
        </Link>
      </Text>
    </div>
  );
};

export default LoginPage;
