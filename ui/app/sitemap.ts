import { MetadataRoute } from "next";

import { publicConfig } from "../config.public";
import { NOTION_PAGES, Page, PAGES } from "./components/breadcrumb/Breadcrumb";

function getSitemapItem(page: Page): MetadataRoute.Sitemap[number] {
  return {
    url: `${publicConfig.baseUrl}${page.path}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...Object.values(NOTION_PAGES).map(getSitemapItem),
    getSitemapItem(PAGES.mentionsLegales()),
    getSitemapItem(PAGES.accessibilite()),
    getSitemapItem(PAGES.cgu()),
    getSitemapItem(PAGES.donneesPersonnelles()),
    getSitemapItem(PAGES.politiqueConfidentialite()),
    getSitemapItem(PAGES.connexion()),
    getSitemapItem(PAGES.motDePasseOublie()),
    getSitemapItem(PAGES.modifierMotDePasse()),
  ];
}
