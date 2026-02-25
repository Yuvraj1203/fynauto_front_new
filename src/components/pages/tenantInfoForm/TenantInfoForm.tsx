// app/components/MyZodForm.tsx
"use client";

import { ProceedButton } from "@/components/common";
import { FormTextInput, FormTextInputType } from "@/components/custom";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { SetTenantInfoModel } from "@/services/models";
import { UserRoleEnum } from "@/services/models/loginModel/loginModel";
import { useTenantDataStore, useUserStore } from "@/store/zustandStore";
import useCurrentTenantInfoStore from "@/store/zustandStore/currentTenantInfoStore/currentTenantInfoStore";
import { showSnackbar, SnackbarEnum } from "@/utils/utils";
import { Spinner } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

type TenantInfoFormProps = {
  handleProceed: () => void;
  uiLoading: boolean;
};

type SelectedEnvironmentType = {
  key: number | EnvKeyEnum;
  label: string;
  ApiUrl: string;
};

enum EnvKeyEnum {
  dev = "dev",
  uat = "uat",
  prod = "prod",
}

const TenantInfoForm = ({ handleProceed, uiLoading }: TenantInfoFormProps) => {
  const userStore = useUserStore().user;
  const currentTenantInfo = useCurrentTenantInfoStore().currentTenantInfo;
  const allTenantFormInfo = useTenantDataStore().tenantFormInfo;
  const tenantFormInfo =
    allTenantFormInfo &&
    allTenantFormInfo.tenantId === currentTenantInfo.tenantId
      ? allTenantFormInfo
      : undefined;
  const envDropDown = [
    {
      key: EnvKeyEnum.dev,
      label: "Development",
      ApiUrl: "https://aa.fyndev.com/",
    },
    {
      key: EnvKeyEnum.uat,
      label: "UAT",
      ApiUrl: "https://aa.fynuat.com/",
    },
    {
      key: EnvKeyEnum.prod,
      label: "Production",
      ApiUrl: "https://service.fynancial.com/",
    },
  ];

  /** Added by @Yuvraj 25-06-2025 -> loading state */
  const [loading, setLoading] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    SelectedEnvironmentType | undefined
  >(envDropDown[0]);

  useEffect(() => {
    const envObject = envDropDown.find(
      (item) => item.ApiUrl == tenantFormInfo?.apiUrl,
    );
    handleSelectItemChange(
      envObject?.key ? envObject?.key : envDropDown[0].key,
    );
  }, [tenantFormInfo]);

  // Define Zod schema
  const schema = z.object({
    apiUrl: z.string().min(1, "Please select environment").trim(),
    appName: z.string().min(1, "App Name is required").trim(),
    auth0ClientId: z.string().min(3, "Auth0 ClientId is required").trim(),
    auth0Domain: z
      .string()
      .min(1, "Auth0 Domain is required")
      .trim()
      .regex(/.*auth0.com.*/, "Invalid Auth0 domain URL"),
    auth0Organization: z.string().trim().optional(),
    androidVersionCode: z.string().min(1, "Please select version").trim(),
    androidVersionName: z.string().min(1, "Please select version name").trim(),
    iosTeamId: z.string().min(1, "Please select team id").trim(),
    iosVersionCode: z.string().min(1, "Please select version").trim(),
    iosVersionName: z.string().min(1, "Please select version name").trim(),
    bundleId: z
      .string()
      .min(1, "Bundle Id is required")
      .trim()
      .regex(/^com\./, "Invalid Bundle Id"),
    oktaClientId: z.string().trim().optional(),
    oktaDomain: z.string().trim().optional(),
    packageName: z
      .string()
      .min(1, "Package Name is required")
      .trim()
      .regex(/^com\./, "Invalid Package Name"),
    sentryDsn: z.string().min(1, "Sentry Dsn is required").trim(),
    tenancyName: z.string().min(1, "Tenancy name is required").trim(),
    tenantId: z.string().min(1, "Tenant Id is required").trim(),
  });

  // Infer TypeScript type from Zod
  type FormSchema = z.infer<typeof schema>;

  const methods = useForm<FormSchema>({
    defaultValues: {
      apiUrl: selectedEnvironment?.ApiUrl ?? tenantFormInfo?.apiUrl ?? "",
      tenantId: currentTenantInfo.tenantId ?? tenantFormInfo?.tenantId ?? "",
      tenancyName:
        currentTenantInfo.tenancyName ?? tenantFormInfo?.tenancyName ?? "",
      appName: tenantFormInfo?.appName ?? "",
      auth0ClientId: tenantFormInfo?.auth0ClientId ?? "",
      auth0Domain: tenantFormInfo?.auth0Domain ?? "",
      auth0Organization: tenantFormInfo?.auth0Organization ?? "",
      androidVersionCode: tenantFormInfo?.androidVersionCode,
      androidVersionName: tenantFormInfo?.androidVersionName,
      iosTeamId: tenantFormInfo?.iosTeamId,
      iosVersionCode: tenantFormInfo?.iosVersionCode,
      iosVersionName: tenantFormInfo?.iosVersionName,
      bundleId: tenantFormInfo?.bundleId ?? "",
      oktaClientId: tenantFormInfo?.oktaClientId ?? "",
      oktaDomain: tenantFormInfo?.oktaDomain ?? "",
      packageName: tenantFormInfo?.packageName ?? "",
      sentryDsn: tenantFormInfo?.sentryDsn ?? "",
    },
    resolver: zodResolver(schema),
  });

  const handleSelectItemChange = (value: string | number) => {
    const selectedEnv = envDropDown.find((item, index) => item.key == value);
    setSelectedEnvironment(selectedEnv);
    methods.setValue("apiUrl", selectedEnv?.ApiUrl!);
  };

  const onSubmit = (data: FormSchema) => {
    if (userStore.role == UserRoleEnum.viewer) {
      showSnackbar(
        "You dont have creating tenant permissions!",
        SnackbarEnum.Warning,
      );
    } else if (userStore.role == UserRoleEnum.devcreator) {
      if (
        selectedEnvironment?.key == EnvKeyEnum.uat ||
        selectedEnvironment?.key == EnvKeyEnum.prod
      ) {
        showSnackbar(
          "You can only create tenant for development environment, please select dev in environment!",
          SnackbarEnum.Warning,
        );
      } else {
        SetTenantInfoApi.mutate(data);
      }
    } else if (userStore.role == UserRoleEnum.uatcreator) {
      if (selectedEnvironment?.key == EnvKeyEnum.prod) {
        showSnackbar(
          "You can not create tenant for prod environment, please select other than prod in environment!",
          SnackbarEnum.Warning,
        );
      } else {
        SetTenantInfoApi.mutate(data);
      }
    } else {
      SetTenantInfoApi.mutate(data);
    }
  };

  //set tenant info api
  const SetTenantInfoApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.SetTenantInfo,
        method: HttpMethodApi.Post,
        data: sendData,
      });
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        useTenantDataStore
          .getState()
          .setTenantFormInfo(data.result.tenantFormData!);
        showSnackbar(data.result.message, SnackbarEnum.Success);
        handleProceed();
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, SnackbarEnum.Danger);
    },
  });

  if (uiLoading) {
    return (
      <div className="flex justify-center items-center grow">
        <Spinner />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className=" overflow-y-auto relative scrollbar-hide"
      >
        <div className="flex flex-col p-5 gap-5">
          <FormTextInput
            name="apiUrl"
            label="Environment"
            type={FormTextInputType.select}
            displayKey={"label"}
            selectItems={envDropDown}
            selectedValue={selectedEnvironment}
            isRequired={true}
            handleSelectItemChange={handleSelectItemChange}
          />

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="tenantId"
              label="Tenant Id"
              isReadOnly={true}
              isRequired={true}
              containerStyle="md:w-1/2"
            />
            <FormTextInput name="appName" label="App Name" isRequired={true} />
            <FormTextInput
              name="tenancyName"
              isReadOnly={true}
              label="Tenancy Name"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="bundleId"
              label="Bundle Id"
              isRequired={true}
            />
            <FormTextInput
              name="packageName"
              label="Package Name"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="androidVersionCode"
              label="Android Version Code"
              isRequired={true}
            />
            <FormTextInput
              name="androidVersionName"
              label="Android Version Name"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="iosVersionCode"
              label="Ios Version Code"
              isRequired={true}
            />
            <FormTextInput
              name="iosVersionName"
              label="Ios Version Name"
              isRequired={true}
            />
          </div>

          <FormTextInput
            name="iosTeamId"
            label="Ios Team ID"
            isRequired={true}
          />

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="auth0ClientId"
              label="Auth0 ClientId"
              isRequired={true}
            />
            <FormTextInput
              name="auth0Domain"
              label="Auth0 Domain"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="auth0Organization"
              label="Auth0 Organization"
            />
            <FormTextInput
              name="sentryDsn"
              label="Sentry Dsn"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput name="oktaClientId" label="Okta ClientId" />
            <FormTextInput name="oktaDomain" label="Okta Domain" />
          </div>
        </div>

        <ProceedButton
          onClick={() => onSubmit(methods.getValues())}
          buttonType={"submit"}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
};
// <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//   <div>
//     <label>Name:</label>
//     <input {...register("name")} className="border p-2 rounded w-full" />
//     {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//   </div>

//   <div>
//     <label>Email:</label>
//     <input {...register("email")} className="border p-2 rounded w-full" />
//     {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//   </div>

//   <FormTextInput<FormSchema>
//     name="age"
//     label="Age"
//     register={register}
//     errors={errors}
//   />

//   <button
//     type="submit"
//     className="bg-blue-600 text-white px-4 py-2 rounded"
//   >
//     Submit
//   </button>
// </form>

export default TenantInfoForm;
