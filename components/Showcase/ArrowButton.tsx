"use client";

import Image from "next/image";

interface Props {
  direction: "left" | "right";
  onClick: () => void;
  onMouseEnter?: () => void;
}

export function ArrowButton({ direction, onClick, onMouseEnter }: Props) {
  const src = direction === "left" ? "/ArrowLeft.png" : "/ArrowRight.png";
  const positionClass = direction === "left" ? "left-0" : "right-0";

  const stripClass =
    direction === "left"
      ? "bg-gradient-to-r from-bg/40 via-bg/15 to-transparent shadow-[10px_0_28px_rgba(0,0,0,0.35)]"
      : "bg-gradient-to-l from-bg/40 via-bg/15 to-transparent shadow-[-10px_0_28px_rgba(0,0,0,0.35)]";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={onMouseEnter}
      aria-label={direction === "left" ? "Anterior" : "Próximo"}
      className={`group absolute top-0 bottom-0 ${positionClass} z-[2000] w-20 lg:w-32 flex items-center justify-center cursor-pointer`}
    >
      <span
        className={`absolute inset-0 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${stripClass}`}
      />
      <Image
        src={src}
        alt=""
        width={140}
        height={100}
        className="relative w-20 h-auto lg:w-28 object-contain pointer-events-none transition-transform duration-200 lg:group-hover:scale-110 drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
      />
    </button>
  );
}
