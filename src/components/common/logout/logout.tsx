"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Cookies from "js-cookie";
import { Button } from "@heroui/react";

const Logout = () => {
  const route = useRouter();
  const handleLogout = () => {
    Cookies.remove("accessTokenFyn", { path: "/" });
    Cookies.remove("refreshTokenFyn", { path: "/" });
    route.push("/authentication");
  };
  return (
    <Button
      variant="bordered"
      color="danger"
      className="w-full rounded-full hover:bg-danger hover:text-onError duration-250"
      onClick={handleLogout}
    >
      Log out
    </Button>
  );
};

export default Logout;
