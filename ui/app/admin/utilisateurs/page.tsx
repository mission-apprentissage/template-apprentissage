"use client";

import { Typography } from "@mui/material";
import { Suspense } from "react";

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

import UserList from "./components/UserList";

const AdminUsersPage = () => {
  return (
    <Suspense>
      <Breadcrumb pages={[PAGES.adminUsers()]} />
      <Typography variant="h2" gutterBottom>
        Gestion des utilisateurs
      </Typography>
      <UserList />
    </Suspense>
  );
};

export default AdminUsersPage;
