"use client";

import { Suspense } from "react";

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

import DonneesPersonnelles from "./components/DonneesPersonnelles";

const DonneesPersonnellesPage = () => {
  return (
    <Suspense>
      <Breadcrumb pages={[PAGES.donneesPersonnelles()]} />
      <DonneesPersonnelles />
    </Suspense>
  );
};
export default DonneesPersonnellesPage;
