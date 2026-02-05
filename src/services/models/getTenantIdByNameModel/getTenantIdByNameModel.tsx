export enum TenantStatusEnum {
  pending = "Pending",
  ongoing = "On-Going",
  completed = "Completed",
}

export type StepModel = {
  id: number;
  label: string;
  status: TenantStatusEnum;
};

export type GetTenantIdByNameModel = {
  _id?: string;
  tenantId?: string;
  tenancyName?: string;
  tenantName?: string;
  tenantURL?: string;
  isAuth0Enable?: boolean;
  isOktaEnabled?: boolean;
  allowCommunityTemplateCreation?: boolean;
  status?: TenantStatusEnum;
  step?: number;
  steps?: StepModel[];
};
