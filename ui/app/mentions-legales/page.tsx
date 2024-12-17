"use client";

import { Suspense } from "react";

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

import MentionsLegales from "./components/MentionLegales";

const MentionsLegalesPage = () => {
  return (
    <Suspense>
      <Breadcrumb pages={[PAGES.mentionsLegales()]} />
      <MentionsLegales />
    </Suspense>
  );
};
export default MentionsLegalesPage;
