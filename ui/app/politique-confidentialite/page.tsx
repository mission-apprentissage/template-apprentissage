import { Suspense } from "react";

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

import PolitiqueConfidentialite from "./components/PolitiqueConfidentialite";

const PolitiqueConfidentialitePage = () => {
  return (
    <Suspense>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.politiqueConfidentialite()]} />
      <PolitiqueConfidentialite />
    </Suspense>
  );
};
export default PolitiqueConfidentialitePage;
