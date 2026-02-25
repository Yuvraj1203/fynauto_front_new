"use client";
import { CustomSelect } from "@/components/custom";
import { ReactIcons } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { GetTenantIdByNameModel } from "@/services/models";
import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { useCurrentTenantInfoStore } from "@/store/zustandStore";
import { showSnackbar, SnackbarEnum } from "@/utils/utils";
import {
  Button,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

type FetchDetailsProps = {
  getAllTenants: () => void;
  onClose: () => void;
};

export enum EnvEnum {
  DEV = 0,
  FYNTEST = 1,
  UAT = 2,
  PROD = 3,
  CUSTOM = 4,
}

const EnvEnumLabel: Record<EnvEnum, string> = {
  [EnvEnum.DEV]: "DEV",
  [EnvEnum.FYNTEST]: "FYNTEST",
  [EnvEnum.UAT]: "UAT",
  [EnvEnum.PROD]: "PROD",
  [EnvEnum.CUSTOM]: "CUSTOM",
};

const envDropdown = Object.values(EnvEnum)
  .filter((v) => typeof v === "number")
  .map((value) => ({
    key: value as number,
    value: EnvEnumLabel[value as EnvEnum],
  }));

const EnvUrlMap: Record<EnvEnum, string> = {
  [EnvEnum.DEV]: "https://aa.fyndev.com/",
  [EnvEnum.FYNTEST]: "https://aa.fyntst.com/",
  [EnvEnum.UAT]: "https://a.fynuat.com/",
  [EnvEnum.PROD]: "https://service.fynancial.com/",
  [EnvEnum.CUSTOM]: "",
};

const FetchDetails = ({ getAllTenants, onClose }: FetchDetailsProps) => {
  const currentTenantInfo = useCurrentTenantInfoStore();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [tenancyData, setTenancyData] = useState<GetTenantIdByNameModel>({});
  const [animate, setAnimate] = useState("scale-0");
  const buttonIconRef = useRef<"correct" | "wrong" | null>(null);
  const addButtonRef = useRef<"inserted" | null>(null);
  const [selectedEnv, setSelectedEnv] = useState(EnvEnum.DEV);
  const [customUrl, setCustomUrl] = useState<string | null>();

  useEffect(() => {
    if (buttonIconRef.current) {
      setAnimate("scale-100");
      setTimeout(() => (buttonIconRef.current = null), 3000);
    }
  }, [buttonIconRef.current]);

  const handleTenancyCheck = () => {
    if (inputValue.trim().length > 0) {
      setAnimate("scale-0");
      const selectedEnvUrl =
        selectedEnv === EnvEnum.CUSTOM ? customUrl : EnvUrlMap[selectedEnv];
      GetTenantIdByNameApi.mutate({
        tenancyName: inputValue.trim(),
        envUrl: selectedEnvUrl,
      });
    }
  };

  const handleTenantAddClick = () => {
    AddTenantApi.mutate({
      ...tenancyData,
      status: TenantStatusEnum.pending,
    });
  };

  const GetTenantIdByNameApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<GetTenantIdByNameModel>({
        endpoint: ApiConstants.GetTenantIdByName,
        method: HttpMethodApi.Get,
        data: sendData,
      }); // API Call
    },
    onMutate(variables) {
      buttonIconRef.current = null;
      setAnimate("scale-0");
      setIsLoading(true);
      addButtonRef.current = null;
    },
    onSettled(data, error, variables, context) {
      setIsLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data?.result?.tenantId) {
        buttonIconRef.current = "correct";
        setTenancyData(data.result);
        currentTenantInfo.setCurrentTenantInfo(data.result);
      } else {
        setTenancyData({});
        showSnackbar("Invalid Tenancy Name", SnackbarEnum.Danger);
        buttonIconRef.current = "wrong";
      }
    },
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Called when an error occurs during the mutation.
     * It sets the button icon to "wrong", resets the tenant data, and shows a snackbar with the error message.
     * @param {Error} error The error that occurred.
     * @param {Object} variables The variables that were passed to the mutation.
     * @param {Object} context The context of the mutation.
     */
    /*******  76b5618f-f9db-49e8-a07d-913a364da370  *******/
    onError(error, variables, context) {
      buttonIconRef.current = "wrong";
      setTenancyData({});
      showSnackbar(error.message, SnackbarEnum.Danger);
    },
  });

  //api for addning tenant
  const AddTenantApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<{ message: string }>({
        endpoint: ApiConstants.AddTenant,
        method: HttpMethodApi.Post,
        data: sendData,
      }); // API Call
    },
    onMutate(variables) {
      setAddLoading(true);
    },
    onSettled(data, error, variables, context) {
      setAddLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        showSnackbar(data.result.message, SnackbarEnum.Success);
        addButtonRef.current = "inserted";
        onClose();
        getAllTenants();
      }
    },
    onError(error, variables, context) {
      showSnackbar("Unable to add tenant", SnackbarEnum.Danger);
      addButtonRef.current = null;
    },
  });

  const TenantTable = () => {
    return (
      <Table removeWrapper aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>{"Tenant Id"}</TableColumn>
          <TableColumn>{"Tenancy Name"}</TableColumn>
          <TableColumn>{"Tenant Name"}</TableColumn>
          <TableColumn>{"Action"}</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>{tenancyData.tenantId}</TableCell>
            <TableCell>{tenancyData.tenancyName}</TableCell>
            <TableCell>{tenancyData.tenantName}</TableCell>
            <TableCell>
              <Tooltip content="Add Tenant">
                {addLoading ? (
                  <Spinner />
                ) : (
                  <span
                    onClick={() => {
                      !addButtonRef.current && handleTenantAddClick();
                    }}
                    className="text-lg font-bold cursor-pointer active:opacity-50 text-success"
                  >
                    {addButtonRef.current == "inserted" ? (
                      <ReactIcons.TickCircle />
                    ) : (
                      <ReactIcons.Plus />
                    )}
                  </span>
                )}
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <CustomSelect
        data={envDropdown}
        itemKey={"key"}
        itemLabel={"value"}
        label={"Select Environment"}
        value={selectedEnv}
        onChange={(value) => {
          setSelectedEnv(value as EnvEnum);
        }}
      />
      {selectedEnv == EnvEnum.CUSTOM && (
        <Input
          isRequired={true}
          label={"API URL"}
          type={"text"}
          variant={"flat"}
          size={"sm"}
          onChange={(e) => setCustomUrl(e.target.value)}
        />
      )}
      <div className="flex max-md:flex-col gap-5 items-center pb-4">
        <Input
          isRequired={true}
          label={"Tenancy Name"}
          type={"text"}
          variant={"flat"}
          size={"sm"}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleTenancyCheck();
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          classNames={{
            inputWrapper:
              "bg-background data-[hover=true]:bg-background group-data-[focus=true]:bg-background !shadow-lightShadow",
          }}
          endContent={
            !isLoading &&
            buttonIconRef.current &&
            !addButtonRef.current && (
              <span
                className={`transition-all duration-300 ease-in-out transform ${animate} ${
                  buttonIconRef.current === "correct"
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {buttonIconRef.current === "correct" ? (
                  <ReactIcons.TickCircle />
                ) : (
                  <ReactIcons.CloseCircle />
                )}
              </span>
            )
          }
          spellCheck={"false"}
        />
        <Button
          className="min-h-10 w-full md:w-fit px-10"
          type="submit"
          color="primary"
          variant={"shadow"}
          size={"md"}
          isLoading={isLoading}
          onPress={handleTenancyCheck}
        >
          {"Check Tenant"}
        </Button>
      </div>
      {tenancyData.tenancyName?.toLowerCase() == inputValue.toLowerCase() && (
        <TenantTable />
      )}
    </div>
  );
};

export default FetchDetails;
