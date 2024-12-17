import { Suspense } from "react";

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

import Accessibilite from "./components/Accessibilite";

const AccessibilitePage = () => {
  return (
    <Suspense>
      <Breadcrumb pages={[PAGES.accessibilite()]} />
      <Accessibilite />
    </Suspense>
  );
};
export default AccessibilitePage;
