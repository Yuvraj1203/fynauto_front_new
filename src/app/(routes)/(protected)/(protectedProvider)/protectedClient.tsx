"use client";

import { UserDetailsType } from "@/services/models";
import { userDetailsStore } from "@/store/zustandStore";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useEffect, useRef } from "react";

type ProtectedClientProps = {
  session: SessionData;
};

const ProtectedClient = ({ session }: ProtectedClientProps) => {
  const processedRef = useRef(false);

  useEffect(() => {
    if (!session?.tokenSet?.idToken || processedRef.current) return;
    processedRef.current = true;

    const { userDetails, isInitialized, setUserDetails } =
      userDetailsStore.getState();

    const idToken = session.tokenSet.idToken as string;
    const decoded: JwtPayload & { userRole: string[] } = jwtDecode(idToken);

    const user: UserDetailsType = {
      ...session.user,
      userRole: decoded.userRole.at(0),
    };

    if (
      !isInitialized ||
      !userDetails?.email ||
      user.email !== userDetails.email
    ) {
      setUserDetails(user);
    }
  }, []);

  return <></>;
};

export default ProtectedClient;
