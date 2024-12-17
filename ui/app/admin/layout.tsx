"use client";
import { useRouter } from "next/navigation";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";

import { useAuth } from "@/context/AuthContext";

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();

  if (!user?.is_admin) {
    push("/auth/connexion");
    return null;
  }

  return <Suspense>{children}</Suspense>;
};

export default AdminLayout;
