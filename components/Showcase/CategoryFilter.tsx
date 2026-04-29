"use client";

import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { Category } from "./showcase.types";

const categories: { key: Category; label: string }[] = [
  { key: "videomaking", label: "Video/Photo" },
  { key: "webdesign", label: "web design" },
  { key: "socialmedia", label: "social media" },
];

export default function CategoryFilter() {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();

  return (
    <div className="
      absolute z-10 pointer-events-none flex flex-col gap-5
      bottom-6 left-4 items-start
      lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-center lg:bottom-auto
    ">
      {categories.map(({ key, label }) => {
        const isActive = state.category === key;
        return (
          <button
            key={key}
            onClick={() => dispatch({ type: "SET_CATEGORY", category: key })}
            className={`
              relative overflow-hidden pointer-events-auto font-body
              text-[clamp(1rem,2.5vw,2rem)] font-black tracking-[0.08em] lowercase
              px-4 py-1.5 lg:px-8 lg:py-2 leading-tight text-center
              w-[160px] lg:w-[320px]
              border-2 transition-all duration-200
              ${isActive
                ? "bg-accent border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white border-transparent hover:bg-accent hover:-translate-y-1 hover:-translate-x-1"
              }
            `}
          >
            <span className="relative z-10 text-black">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
