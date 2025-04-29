import SlugPage from "./widgets/SlugPage";

const PageDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;

  return <SlugPage slug={slug} />;
};

export default PageDetail;
