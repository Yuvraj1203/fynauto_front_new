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

export type LoginModel = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  user?: UserType;
  message: string;
};
