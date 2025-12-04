import CustomLink from "./custom-link";
import { useMessages } from "next-intl";

export default function Footer() {
  const t = useMessages();

  return (
    <footer className="mx-0 my-4 flex w-full flex-col gap-4 px-4 text-sm sm:mx-auto sm:my-12 sm:h-5 sm:max-w-3xl sm:flex-row sm:items-center sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <CustomLink href="#">
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            t.Footer.about
          }
        </CustomLink>
        <CustomLink href="#">
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            t.Footer.blog
          }
        </CustomLink>
        <CustomLink href="#">
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            t.Footer.contact
          }
        </CustomLink>
        <CustomLink href="#">
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            t.Footer.data
          }
        </CustomLink>
      </div>
    </footer>
  );
}
