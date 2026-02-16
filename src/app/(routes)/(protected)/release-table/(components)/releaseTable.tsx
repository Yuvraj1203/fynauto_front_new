"use client";
import { ScreenHeader } from "@/components/template";
import { useTranslations } from "next-intl";
import { useState } from "react";
import NewReleaseModal from "./newReleaseModal";
import TenantListAccordians from "./tenantListAccordians";

const ReleaseTable = () => {
  const t = useTranslations();

  const [refreshList, setRefreshList] = useState(false);
  return (
    <>
      <ScreenHeader
        title={t("TenantReleases")}
        subTitle={t("TenantReleaseSubtitle")}
        // subTitle={t("DynamicFormsForClientInfo")}
        className="bg-background rounded-xl"
        moderateCustomStyle={true}
        children={<NewReleaseModal setRefreshList={setRefreshList} />}
      />
      <TenantListAccordians
        refreshList={refreshList}
        setRefreshList={setRefreshList}
      />
    </>
  );
};

export default ReleaseTable;
