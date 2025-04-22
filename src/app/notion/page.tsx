import NotionDynamicPage from "@/app/pages/DynamicPage";
import NotionAdverPage from "@/app/pages/NotionAdverPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { pid } = await searchParams;

  if (!pid) {
    return (
      <>
        <NotionAdverPage />
      </>
    );
  }

  return (
    <>
      <NotionDynamicPage pid={pid} />
    </>
  );
}
