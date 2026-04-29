import { ShowcaseProvider } from "./ShowcaseContext";
import ShowcaseMobile from "./ShowcaseMobile";
import ShowcaseDesktop from "./ShowcaseDesktop";

export default function Showcase() {
  return (
    <ShowcaseProvider>
      <div className="lg:hidden">
        <ShowcaseMobile />
      </div>
      <div className="hidden lg:block">
        <ShowcaseDesktop />
      </div>
    </ShowcaseProvider>
  );
}
