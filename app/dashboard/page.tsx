import { getTranslations } from "next-intl/server";

export default async function Index() {
  const t = {
    DashboardPage: await getTranslations("DashboardPage"),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t.DashboardPage("pagename")}</h1>
      <div>
        <p>{t.DashboardPage("greeting", { name: "Jane" })}</p>
      </div>
    </div>
  );
}
