"use client";

type Category = "webdesign" | "socialmedia" | "videomaking";

interface CategoryFilterProps {
  active: Category;
  onChange: (category: Category) => void;
}

const categories: { key: Category; label: string }[] = [
  { key: "webdesign", label: "web design" },
  { key: "socialmedia", label: "social media" },
  { key: "videomaking", label: "videomaking" },
];

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center gap-3">
      {categories.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              pointer-events-auto font-heading
              text-[clamp(1.2rem,2.5vw,2rem)] font-black tracking-tight lowercase
              px-8 py-2 leading-tight text-center w-[320px]
              border-2 border-transparent
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#FACC15] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black border-transparent shadow-none hover:bg-[#FACC15] hover:border-transparent hover:shadow-none hover:-translate-y-1 hover:-translate-x-1"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
