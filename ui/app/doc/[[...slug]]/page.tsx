import { NOTION_PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import NotionPage from "@/app/components/notion/NotionPage";
import NotFoundPage from "@/app/not-found";

export const revalidate = 3_600;

type DocPageProps = {
  params: {
    slug: string[];
  };
};

export default async function DocPage(props: DocPageProps) {
  const path = `/doc/${props.params.slug.join("/")}`;
  const page = Object.values(NOTION_PAGES).find((p) => {
    return p.path === path;
  });

  if (!page) {
    return <NotFoundPage />;
  }

  return <NotionPage pageId={page.notionId} />;
}
