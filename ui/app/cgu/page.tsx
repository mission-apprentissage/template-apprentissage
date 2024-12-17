"use client";

import { Suspense } from "react";

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

import Cgu from "./components/Cgu";

const CGUPage = () => {
  return (
    <Suspense>
      <Breadcrumb pages={[PAGES.cgu()]} />
      <Cgu />
    </Suspense>
  );
};
export default CGUPage;
