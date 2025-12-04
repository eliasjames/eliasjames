import CustomLink from "@/components/custom-link";
import { getTranslations } from "next-intl/server";

export default async function Index() {
  const t = {
    HomePage: await getTranslations("HomePage"),
    Site: await getTranslations("Site"),
  };
  const todoListLinks = [
    {
      preText: t.HomePage("todoList.protected.preText"),
      linkText: t.HomePage("todoList.protected.linkText"),
      linkLocation: t.HomePage("todoList.protected.linkLocation"),
      postText: t.HomePage("todoList.protected.postText"),
    },
    {
      preText: t.HomePage("todoList.unprotected.preText"),
      linkText: t.HomePage("todoList.unprotected.linkText"),
      linkLocation: t.HomePage("todoList.unprotected.linkLocation"),
      postText: t.HomePage("todoList.unprotected.postText"),
    },
    {
      preText: t.HomePage("todoList.signin.preText"),
      linkText: t.HomePage("todoList.signin.linkText"),
      linkLocation: t.HomePage("todoList.signin.linkLocation"),
      postText: t.HomePage("todoList.signin.postText"),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t.Site("sitename")}</h1>
      <div>
        {t.Site("tagline")}
        {". "}
        <br />
        <br />
        {t.HomePage("todoLabel")}
        <br />
        <ul>
          {todoListLinks.map((todo, index) => (
            <li key={index}>
              <span>{todo.preText}</span>
              <CustomLink href={todo.linkLocation}>
                {todo.linkText}
              </CustomLink>{" "}
              <span>{todo.postText}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
