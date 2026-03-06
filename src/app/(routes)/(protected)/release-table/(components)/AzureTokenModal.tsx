"use client";

import {
  ButtonVariant,
  CustomAutoComplete,
  CustomButton,
  CustomCheckbox,
  CustomCheckboxGroup,
  CustomInput,
  CustomModal,
  CustomRadioGroup,
  InputTypes,
} from "@/components/custom";
import { CheckboxOrientation } from "@/components/custom/customCheckboxGroup/customCheckboxGroup";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { CustomColor } from "@/services/types";
import { useGitCredStore } from "@/store/zustandStore";
import { checkHasValidDate, showSnackbar, SnackbarEnum } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  TenantReleaseDataType,
  TenantReleaseStatusEnum,
} from "./tenantListAccordians";

type AzureTokenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tenants: TenantReleaseDataType | TenantReleaseDataType[];
  onSuccess: ({ android, ios }: { android: boolean; ios: boolean }) => void;
};

// OS options
const osOptions = [
  { id: "android", value: "Android" },
  { id: "ios", value: "iOS" },
];

// Deployment type options
const deploymentTypeOptions = [
  { id: "production", value: "Production" },
  { id: "external", value: "External Testers" },
  { id: "internal", value: "Internal Testers" },
];

// Azure DevOps branch API response type
type AzureBranchRef = {
  name: string;
  objectId: string;
  url: string;
};

type AzureBranchResponse = {
  value: AzureBranchRef[];
};

const AzureTokenModal = ({
  isOpen,
  onClose,
  tenants,
  onSuccess,
}: AzureTokenModalProps) => {
  const [azureGitToken, setAzureGitToken] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [branchName, setBranchName] = useState<string | number>("");
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [deploymentType, setDeploymentType] = useState<string>("");
  const [buildApk, setBuildApk] = useState(false);
  const [buildIpa, setBuildIpa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testflightOnly, setTestflightOnly] = useState(false);

  //git token for azure devops API call to fetch branches
  const gitToken = useGitCredStore().gitCred;
  const gitTokenExpiry = useGitCredStore().gitCredExpiry;
  const azureBearerToken = useGitCredStore().azureBearer;
  const azureBearerTokenExpiry = useGitCredStore().azureBearerExpiry;
  const gitBranchName = useGitCredStore().branchName;

  // Branch list state - fetched from Azure DevOps
  const [branchList, setBranchList] = useState<
    { key: string; label: string }[]
  >([]);

  const isMultipleSelection = Array.isArray(tenants);

  //check if the git token valid
  useEffect(() => {
    const isGitTokenValid = checkHasValidDate(gitTokenExpiry);
    const isAzureBearerValid = checkHasValidDate(azureBearerTokenExpiry);

    setAzureGitToken(gitToken);
    setBearerToken(azureBearerToken);
    setBranchName(gitBranchName);
    if (!isGitTokenValid || !isAzureBearerValid) {
      setError(
        `${!isGitTokenValid ? "Git token may be expired." : ""} ${!isAzureBearerValid ? "Azure bearer token may be expired." : ""} Please update from settings in sidebar.`,
      );
    }
  }, []);

  // Fetch branches when modal opens and token is available
  useEffect(() => {
    if (isOpen && azureGitToken.trim()) {
      GetAzureBranchesApi.mutate(azureGitToken);
    }
  }, [isOpen, azureGitToken]);

  // Fetch branches from Azure DevOps using useMutation
  const GetAzureBranchesApi = useMutation({
    mutationFn: (token: string) => {
      return makeRequest<AzureBranchResponse>({
        url: ApiConstants.GetAllBranchesFromAzure,
        method: HttpMethodApi.Get,
        data: { token },
        withoutBaseModel: true,
      }); // API Call
    },
    onMutate(variables) {
      // setLoading(true);
    },
    onSettled(data, error, variables, context) {
      // setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data?.value) {
        setBranchList(
          data.value.map((item: any) => {
            const branchName = item.name.replace("refs/heads/", ""); // Remove refs/heads/ prefix
            return {
              label: branchName,
              value: branchName,
              key: branchName,
            };
          }),
        );
      }
    },
    onError() {
      // Keep initial branch list as fallback on error
      showSnackbar(
        "Failed to fetch branches from Azure DevOps",
        SnackbarEnum.Danger,
      );
    },
  });

  // Fetch branches from Azure DevOps using useMutation
  const DeployTenantsApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<any>({
        endpoint: ApiConstants.DeployTenants,
        method: HttpMethodApi.Post,
        data: sendData,
        withoutBaseModel: true,
      }); // API Call
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      handleClose();
      onSuccess({
        android: selectedOS.includes("android"),
        ios: selectedOS.includes("ios"),
      });
    },
    onError() {
      // Keep initial branch list as fallback on error
      showSnackbar("Failed to deploy tenant", SnackbarEnum.Danger);
    },
  });

  // deploy multitenants
  const CreateBulkDeploymentApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<any>({
        endpoint: ApiConstants.CreateBulkDeployment,
        method: HttpMethodApi.Post,
        data: sendData,
        withoutBaseModel: true,
      }); // API Call
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      handleClose();
    },
    onError() {
      // Keep initial branch list as fallback on error
      showSnackbar("Failed to deploy tenant", SnackbarEnum.Danger);
    },
  });

  // Update tenant status API - called when deploy is clicked to increment version
  const UpdateTenantStatusApi = useMutation({
    mutationFn: (sendData: {
      name: string;
      status: number;
      android: boolean;
      ios: boolean;
      version: string;
    }) => {
      return makeRequest<any>({
        endpoint: ApiConstants.UpdateTenantStatus,
        method: HttpMethodApi.Put,
        data: {
          name: sendData.name,
          status: sendData.status,
          android: sendData.android,
          ios: sendData.ios,
        },
        params: { version: sendData.version },
      }); // API Call
    },
    onSuccess(data, variables, context) {
      if (data.success) {
        console.log("Tenant status updated to InProgress, version incremented");
      }
    },
    onError(error, variables, context) {
      console.error("Failed to update tenant status", error);
    },
  });

  const handleRun = async () => {
    // Validation
    if (!azureGitToken.trim()) {
      setError("Azure token is required");
      return;
    }
    if (!branchName) {
      setError("Branch name is required");
      return;
    }

    if (selectedOS.length === 0 && !isMultipleSelection) {
      setError("Please select at least one OS");
      return;
    }
    if (
      (!buildApk && selectedOS.includes("android")) ||
      (!buildIpa && selectedOS.includes("ios") && !isMultipleSelection)
    ) {
      if (!deploymentType) {
        setError("Please select deployment type");
        return;
      }
    }

    if (
      deploymentType !== "internal" &&
      !buildApk &&
      !buildIpa &&
      !isMultipleSelection
    ) {
      setError("Please select at least one build option");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isMultipleSelection) {
        const payload = {
          azureGitToken: azureGitToken,
          azureBearerToken: bearerToken,
          gitBranch: gitBranchName,
          onlyTestflight: testflightOnly,
          deploymentList: tenants.map((tenant) => ({
            id: tenant.id,
            tenantName: tenant.name,
            matchBranch: tenant.matchBranch || "",
          })),
        };

        console.log(
          "Deploying multiple tenants with bulk deployment API",
          payload,
        );
        CreateBulkDeploymentApi.mutate(payload);
      } else {
        // Handle both single and multiple tenant deployment
        const allTenants = Array.isArray(tenants) ? tenants : [tenants];

        for (const tenant of allTenants) {
          // First, update tenant status to Ongoing (1) - this will increment the version
          // Get current version from tenant data
          const currentVersion =
            tenant.androidVersion || tenant.iosVersion || "1.0.0";

          UpdateTenantStatusApi.mutate({
            name: tenant.name,
            status: TenantReleaseStatusEnum.Ongoing,
            android: selectedOS.includes("android"),
            ios: selectedOS.includes("ios"),
            version: currentVersion,
          });

          const jsonData = {
            body: {
              resources: {
                repositories: {
                  self: {
                    refName: `refs/heads/${branchName}`,
                  },
                },
              },
              templateParameters: {
                tenant: tenant.name,
                android: selectedOS.includes("android") ? "true" : "false",
                ios: selectedOS.includes("ios") ? "true" : "false",
                production: deploymentType === "production" ? "true" : "false",
                externalTester:
                  deploymentType === "external" ? "true" : "false",
                buildApk: buildApk ? "true" : "false",
                buildIpa: buildIpa ? "true" : "false",
                azureGitToken: azureGitToken,
                ...(tenant.matchBranch
                  ? { matchbranch: tenant.matchBranch }
                  : {}),
              },
            },
            bearerToken: bearerToken,
          };

          DeployTenantsApi.mutate(jsonData);
        }
      }
    } catch (err) {
      setError("An error occurred while calling the API.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // setAzureGitToken("");
    setBranchName("");
    setSelectedOS([]);
    setDeploymentType("");
    setBuildApk(false);
    setBuildIpa(false);
    setError("");
    setBranchList([]);
    onClose();
  };

  // Title for the modal
  const modalTitle = isMultipleSelection
    ? `Deploy ${tenants.length} Tenants`
    : `Deploy Tenant: ${tenants.name}`;

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      trigger={<button className="hidden" />}
      closeButton={false}
      loading={loading}
      wrapperStyle="max-w-2xl"
    >
      {() => (
        <div className="flex flex-col gap-4 py-2">
          {/* Modal Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">{modalTitle}</h2>
          </div>

          {/* Azure Token Input */}
          <CustomInput
            label="Azure Token"
            placeholder="Enter your Azure DevOps personal access token"
            value={azureGitToken}
            onValueChange={(value) => {
              setAzureGitToken(value);
              setError("");
            }}
            isInvalid={!!error && error.includes("token")}
            description={
              error.includes("token")
                ? error
                : "Required for Azure DevOps pipeline authentication"
            }
            type={InputTypes.password}
          />

          {isMultipleSelection ? (
            <CustomCheckbox
              isSelected={testflightOnly}
              setIsSelected={(value) => {
                setTestflightOnly(value);
                setError("");
              }}
              label="For Only Testflight"
            />
          ) : (
            <>
              {/* Branch Name Autocomplete */}
              <CustomAutoComplete
                items={branchList}
                label="Branch Name"
                placeholder="Select or enter branch name"
                defaultSelectedItem={branchName}
                onSelection={(value) => {
                  setBranchName(value);
                  setError("");
                }}
                isRequired
                className="max-w-full"
              />

              {/* OS Selection - Android/iOS */}
              <CustomCheckboxGroup
                data={osOptions}
                id="id"
                value="value"
                label="Select OS"
                selectedValue={selectedOS}
                setSelectedValue={(value) => {
                  setSelectedOS(value);
                  setError("");
                }}
                orientation={CheckboxOrientation.horizontal}
              />

              {/* Build Options - Build APK, Build IPA */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-secondary-text">
                  Build Options
                </label>
                <div className="flex gap-4">
                  <CustomCheckbox
                    isSelected={buildApk}
                    setIsSelected={(value) => {
                      setBuildApk(value);
                      setError("");
                    }}
                    label="Build APK"
                  />
                  <CustomCheckbox
                    isSelected={buildIpa}
                    setIsSelected={(value) => {
                      setBuildIpa(value);
                      setError("");
                    }}
                    label="Build IPA"
                  />
                </div>
              </div>

              {/* Deployment Type - Production, External Testers, Internal Testers */}
              {((!buildApk && selectedOS.includes("android")) ||
                (!buildIpa && selectedOS.includes("ios"))) && (
                <CustomRadioGroup
                  data={deploymentTypeOptions}
                  id="id"
                  value="value"
                  label={`Deployment Type (${buildApk ? "" : "Android"} ${buildIpa ? "" : "iOS"})`}
                  selectedValue={deploymentType}
                  setSelectedValue={(value) => {
                    setDeploymentType(value);
                    setError("");
                  }}
                />
              )}

              {/* Error Message */}
              {error && <p className="text-danger text-sm">{error}</p>}
            </>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <CustomButton
              color={CustomColor.danger}
              variant={ButtonVariant.light}
              onClick={handleClose}
            >
              Close
            </CustomButton>
            <CustomButton loading={loading} onClick={handleRun}>
              Deploy
            </CustomButton>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default AzureTokenModal;
