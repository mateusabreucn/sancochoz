import ShowcaseMobile from "./ShowcaseMobile";
import ShowcaseDesktop from "./ShowcaseDesktop";

export default function Showcase() {
  return (
    <>
      <div className="lg:hidden">
        <ShowcaseMobile />
      </div>
      <div className="hidden lg:block">
        <ShowcaseDesktop />
      </div>
    </>
  );
}
