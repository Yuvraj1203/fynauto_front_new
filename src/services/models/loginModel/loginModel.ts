export enum UserRoleEnum {
  admin = "Admin",
  uatcreator = "UATCreator",
  devcreator = "DEVCreator",
  viewer = "Viewer",
}

export type UserType = {
  id?: string;
  username?: string;
  password?: string;
  role?: string;
  refreshToken?: string;
};

export type UserDetailsType = {
  userRole?: string;
  sub?: string;
  name?: string;
  nickname?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  org_id?: string;
};

export type LoginModel = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  user?: UserType;
  message: string;
};
