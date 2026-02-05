"use client";

import { CustomButton } from "@/components/custom";
import { LayoutTypes } from "@/services/types";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = ({ className }: LayoutTypes) => {
  const { logout } = useAuth0();
  return (
    <CustomButton className={className} onClick={logout}>
      Log Out
    </CustomButton>
  );
};

export default LogoutButton;
