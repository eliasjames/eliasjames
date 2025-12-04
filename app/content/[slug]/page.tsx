import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = {
    SlugSpecificContent: await getTranslations(`ContentPage`),
    Site: await getTranslations("Site"),
  };
  return (
    <div id={t.SlugSpecificContent(`${slug}.id`)}>
      {t.SlugSpecificContent(`${slug}.text`)}
    </div>
  );
}
