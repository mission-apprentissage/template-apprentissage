"use client";
import { useRouter } from "next/navigation";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";

import { useAuth } from "@/context/AuthContext";

const ProfilLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();

  if (!user) {
    push("/auth/connexion");
    return null;
  }

  return <Suspense>{children}</Suspense>;
};

export default ProfilLayout;
