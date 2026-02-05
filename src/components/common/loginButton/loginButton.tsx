"use client";
import { CustomButton } from "@/components/custom";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <CustomButton onClick={() => loginWithRedirect()}>Login</CustomButton>;
};

export default LoginButton;
