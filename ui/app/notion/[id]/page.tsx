import NotionPage from "@/components/notion/NotionPage";

export const revalidate = 300;

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  return <NotionPage pageId={id} />;
}
