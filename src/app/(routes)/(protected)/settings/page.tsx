"use client";

import {
  ButtonVariant,
  CustomAutoComplete,
  CustomButton,
  CustomInput,
  InputTypes,
} from "@/components/custom";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { useGitCredStore } from "@/store/zustandStore";
import { showSnackbar, SnackbarEnum } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Azure DevOps branch API response type
type AzureBranchRef = {
  name: string;
  objectId: string;
  url: string;
};

type AzureBranchResponse = {
  value: AzureBranchRef[];
};

// Azure Credentials response type
type AzureCredResponse = {
  azureGitCred: string;
  azureBearerToken: string;
  branch: string;
};

// Azure Credentials save request type
type AzureCredSaveRequest = {
  azureGitCred: string;
  azureBearerToken: string;
  branch: string;
};

const SettingsPage = () => {
  // Form state
  const [azureGitCred, setAzureGitCred] = useState("");
  const [azureBearerToken, setAzureBearerToken] = useState("");
  const [branchName, setBranchName] = useState<string | number>("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const setGitToken = useGitCredStore((state) => state.setGitCred);
  const setAzureBearer = useGitCredStore((state) => state.setAzureBearer);
  const setGitBranchName = useGitCredStore((state) => state.setBranchName);

  // Branch list state - fetched from Azure DevOps
  const [branchList, setBranchList] = useState<
    { key: string; label: string }[]
  >([]);

  // Fetch existing Azure credentials on mount
  const GetAzureCredApi = useMutation({
    mutationFn: () => {
      return makeRequest<AzureCredResponse>({
        endpoint: ApiConstants.GlobalSettings,
        method: HttpMethodApi.Get,
      });
    },
    onSuccess(data) {
      if (data?.result) {
        setAzureGitCred(data.result.azureGitCred || "");
        setAzureBearerToken(data.result.azureBearerToken || "");
        setBranchName(data.result.branch || "");
      }
      setInitialLoading(false);
    },
    onError() {
      setInitialLoading(false);
    },
  });

  // Fetch credentials on mount
  useEffect(() => {
    GetAzureCredApi.mutate();
  }, []);

  // Save Azure credentials mutation
  const SaveAzureCredApi = useMutation({
    mutationFn: (data: AzureCredSaveRequest) => {
      return makeRequest({
        endpoint: ApiConstants.GlobalSettings,
        method: HttpMethodApi.Post,
        data,
      });
    },
    onSuccess(data) {
      if (data?.result) {
        setGitToken(azureGitCred, 14);
        setAzureBearer(azureBearerToken, 364);
        setGitBranchName(String(branchName));
        showSnackbar(
          "Azure credentials saved successfully",
          SnackbarEnum.Success,
        );
      }
    },
    onError() {
      showSnackbar("Failed to save Azure credentials", SnackbarEnum.Danger);
    },
  });

  // Fetch branches when bearer token is available
  useEffect(() => {
    if (azureBearerToken.trim()) {
      GetAzureBranchesApi.mutate(azureBearerToken);
    } else {
      setBranchList([]);
    }
  }, [azureBearerToken]);

  // Fetch branches from Azure DevOps using useMutation
  const GetAzureBranchesApi = useMutation({
    mutationFn: (token: string) => {
      return makeRequest<AzureBranchResponse>({
        url: ApiConstants.GetAllBranchesFromAzure,
        method: HttpMethodApi.Get,
        data: { token },
        withoutBaseModel: true,
      });
    },
    onSuccess(data) {
      if (data?.value) {
        setBranchList(
          data.value.map((item: AzureBranchRef) => {
            const branch = item.name.replace("refs/heads/", "");
            return {
              label: branch,
              value: branch,
              key: branch,
            };
          }),
        );
      }
    },
    onError() {
      showSnackbar(
        "Failed to fetch branches from Azure DevOps",
        SnackbarEnum.Danger,
      );
    },
  });

  const handleSave = async () => {
    // Validation
    if (!azureGitCred.trim()) {
      setError("Azure Git Credentials is required");
      return;
    }
    if (!azureBearerToken.trim()) {
      setError("Azure Bearer Token is required");
      return;
    }
    if (!branchName) {
      setError("Branch name is required");
      return;
    }

    setError("");

    // Save credentials via API
    SaveAzureCredApi.mutate({
      azureGitCred: azureGitCred,
      azureBearerToken: azureBearerToken,
      branch: String(branchName),
    });
  };

  const handleClear = () => {
    setAzureGitCred("");
    setAzureBearerToken("");
    setBranchName("");
    setBranchList([]);
    setError("");
  };

  // Show loading state while fetching initial data
  if (GetAzureCredApi.isPending || initialLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 bg-surface rounded-2xl">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Azure Settings</h1>
          <p className="text-secondary-text">
            Configure your Azure DevOps credentials and branch settings
          </p>
        </div>
        <div className="flex items-center justify-center py-10">
          <div className="text-secondary-text">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-surface rounded-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Azure Settings</h1>
        <p className="text-secondary-text">
          Configure your Azure DevOps credentials and branch settings
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-2xl">
        {/* Azure Git Credentials Input */}
        <CustomInput
          label="Azure Git Credentials"
          placeholder="Enter your Azure Git credentials (username:pat)"
          value={azureGitCred}
          onValueChange={(value) => {
            setAzureGitCred(value);
            setError("");
          }}
          isInvalid={!!error && error.includes("Git Credentials")}
          description={
            error.includes("Git Credentials")
              ? error
              : "Format: username:personal-access-token"
          }
          type={InputTypes.password}
          isRequired
        />

        {/* Azure Bearer Token Input */}
        <CustomInput
          label="Azure Bearer Token"
          placeholder="Enter your Azure DevOps personal access token"
          value={azureBearerToken}
          onValueChange={(value) => {
            setAzureBearerToken(value);
            setError("");
          }}
          isInvalid={!!error && error.includes("Bearer Token")}
          description={
            error.includes("Bearer Token")
              ? error
              : "Required for Azure DevOps pipeline authentication"
          }
          type={InputTypes.password}
          isRequired
        />

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

        {/* Error Message */}
        {error && <p className="text-danger text-sm">{error}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <CustomButton variant={ButtonVariant.light} onClick={handleClear}>
            Clear
          </CustomButton>
          <CustomButton
            loading={SaveAzureCredApi.isPending}
            onClick={handleSave}
          >
            Save
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
