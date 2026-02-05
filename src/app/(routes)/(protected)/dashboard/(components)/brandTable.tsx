"use client";
import { CustomTable } from "@/components/custom";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { BusinessItem, CompaniesModel } from "@/services/models";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const BrandTable = () => {
  const t = useTranslations();
  const [tableData, setTableData] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);

  //custom header
  const tableHeader = [
    { key: "businessname", label: "Business Name" },
    { key: "landingPage", label: "Landing page" },
    { key: "launchPage", label: "Launch Page" },
    { key: "isonboardingcomplete", label: "On Boarding Status" },
  ];

  useEffect(() => {
    CompaniesApi.mutate({
      payload: {
        Usage: "2",
        IncludeInactive: true,
        SortColumn: "businessname",
        PageNumber: 1,
        PageSize: 5,
      },
    });
  }, []);

  const CompaniesApi = useMutation({
    mutationFn: (sendData: { payload: Record<string, any> }) => {
      return makeRequest<CompaniesModel>({
        endpoint: ApiConstants.Companies,
        method: HttpMethodApi.Get,
        data: sendData.payload,
      });
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.data?.list) {
        setTableData(data.data?.list);
      }
    },
    onError(error, variables, context) {},
  });

  return (
    <>
      <CustomTable
        columns={tableHeader}
        data={tableData}
        rowKey="id"
        loading={loading}
      />
    </>
  );
};

export default BrandTable;
