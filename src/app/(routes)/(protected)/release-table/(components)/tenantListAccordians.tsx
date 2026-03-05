"use client";
import { Text, TextVariant } from "@/components/common";
import {
  AccordionVariant,
  ButtonVariant,
  ChipVariant,
  CustomAccordion,
  CustomButton,
  CustomChip,
  CustomModal,
  CustomSpinner,
} from "@/components/custom";
import { ReactIcons } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { CustomColor, CustomSize } from "@/services/types";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import AddTenantModal from "./AddTenantModal";
import TenantReleaseTable, { statusColorMap } from "./tenantReleaseTable";

type TenantListAccordiansProps = {
  refreshList: boolean;
  setRefreshList: (value: boolean) => void;
};

export enum TenantReleaseStatusEnum {
  Pending = 0,
  Ongoing = 1,
  Published = 2,
  Failed = 3,
}

export const TenantReleaseStatusEnumLabel: Record<number, string> = {
  [TenantReleaseStatusEnum.Pending]: "Pending",
  [TenantReleaseStatusEnum.Ongoing]: "On-Going",
  [TenantReleaseStatusEnum.Published]: "Published",
  [TenantReleaseStatusEnum.Failed]: "Failded",
};

export type TenantReleaseDataType = {
  id: number;
  name: string;
  status: TenantReleaseStatusEnum;
  androidVersion: string;
  iosVersion: string;
  matchBranch: string;
};

type ReleaseVersionDataType = {
  id: number;
  version: string;
  status: {
    published: number;
    onGoing: number;
    pending: number;
    failed: number;
  };
  tenants: TenantReleaseDataType[];
};

const TenantListAccordians = ({
  refreshList,
  setRefreshList,
}: TenantListAccordiansProps) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [releaseVersionData, setReleaseVersionData] = useState<
    ReleaseVersionDataType[]
  >([]);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [latestReleaseVersion, setLatestReleaseVersion] = useState("");

  useEffect(() => {
    callGetReleasesVersionApi();
  }, []);

  useEffect(() => {
    if (refreshList) {
      callGetReleasesVersionApi();
      setRefreshList(false);
    }
  }, [refreshList]);

  const callGetReleasesVersionApi = () => {
    GetReleasesVersionApi.mutate({
      data: {
        skipCount: 0,
      },
    });
  };

  //call api
  const GetReleasesVersionApi = useMutation({
    mutationFn: (sendData: { data: Record<string, any> }) => {
      return makeRequest<ReleaseVersionDataType[]>({
        endpoint: ApiConstants.GetReleasesVersion,
        method: HttpMethodApi.Get,
        data: sendData.data,
      }); // API Call
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.success) {
        setReleaseVersionData(data.result || []);
        // Set latest release version from first release
        if (data.result && data.result.length > 0) {
          setLatestReleaseVersion(data.result[0].version);
        }
      }
    },
    onError(error, variables, context) {
      setReleaseVersionData([]);
    },
  });

  const handleAddTenantSuccess = () => {
    // Refresh the list after adding tenant
    callGetReleasesVersionApi();
  };

  const renderContent = (
    tenantReleaseItem: TenantReleaseDataType[],
    isFirstAccordion: boolean = false,
    version: string,
  ) => {
    return (
      <div>
        {isFirstAccordion && (
          <CustomModal
            trigger={
              <CustomButton
                className="flex justify-self-end"
                color={CustomColor.default}
                variant={ButtonVariant.faded}
                onClick={() => setIsAddTenantModalOpen(true)}
                startContent={<ReactIcons.AddUser />}
              >
                Add Tenant
              </CustomButton>
            }
            closeButton={false}
            children={(onClose) => {
              return (
                <AddTenantModal
                  releaseVersion={latestReleaseVersion}
                  onSuccess={handleAddTenantSuccess}
                  onClose={onClose}
                />
              );
            }}
          />
        )}
        <TenantReleaseTable
          tenantReleaseData={tenantReleaseItem}
          tenantReleaseVersion={version}
          refreshData={callGetReleasesVersionApi}
        />
      </div>
    );
  };

  const renderStatusChip = (status: number, label: TenantReleaseStatusEnum) => {
    return (
      <>
        <CustomChip
          color={statusColorMap[label]}
          size={CustomSize.sm}
          variant={ChipVariant.Flat}
        >
          {`${status} ${TenantReleaseStatusEnumLabel[label]}`}
        </CustomChip>
      </>
    );
  };

  const renderAccordionHeader = (
    releaseVersionItem: ReleaseVersionDataType,
  ) => {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Text
            as="span"
            variant={TextVariant.body}
            className="line-clamp-1 text-ellipsis font-semibold"
          >
            {`${t("Release")} ${releaseVersionItem.version}`}
          </Text>
          <Text
            as="span"
            variant={TextVariant.subTitle}
            className="line-clamp-1 text-ellipsis text-secondary-text font-semibold"
          >
            {`(${releaseVersionItem?.tenants?.length} ${t("Tenants")})`}
          </Text>
        </div>

        <div className="flex gap-2 lg:gap-3">
          {renderStatusChip(
            releaseVersionItem.status.published,
            TenantReleaseStatusEnum.Published,
          )}
          {renderStatusChip(
            releaseVersionItem.status.onGoing,
            TenantReleaseStatusEnum.Ongoing,
          )}
          {renderStatusChip(
            releaseVersionItem.status.pending,
            TenantReleaseStatusEnum.Pending,
          )}
          {renderStatusChip(
            releaseVersionItem.status.failed,
            TenantReleaseStatusEnum.Failed,
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    <CustomSpinner />;
  }

  return (
    <>
      {releaseVersionData.length === 0 && !loading ? (
        <div className="flex flex-col items-center gap-2 py-10">
          <Text variant={TextVariant.title}>{"NoReleasesVersion"}</Text>
        </div>
      ) : (
        <CustomAccordion
          data={releaseVersionData}
          itemKey="id"
          itemLabel="version"
          itemContentKey={"tenants"}
          baseStyle={"shadow-none border-1 border-default-200"}
          contentStyle={"pt-0"}
          variant={AccordionVariant.Splitted}
          className={"px-0"}
          renderContent={(releaseVersionItem, index) => {
            if (!releaseVersionItem.tenants) return null;
            return renderContent(
              releaseVersionItem.tenants as TenantReleaseDataType[],
              index === 0, // isFirstAccordion
              releaseVersionItem.version,
            );
          }}
          renderHeader={(releaseVersionItem) => {
            if (!releaseVersionItem) return null;
            return renderAccordionHeader(releaseVersionItem);
          }}
        />
      )}
    </>
  );
};

export default TenantListAccordians;
