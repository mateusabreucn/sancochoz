"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

const PHOTOS = [
  "/HeroImage.png",
  "https://picsum.photos/seed/sancochoz1/600/600",
  "https://picsum.photos/seed/sancochoz2/600/600",
  "https://picsum.photos/seed/sancochoz3/600/600",
];

// Deck opens to the right — back cards peek from the right
const STACK = [
  { x: 0,  y: 0,  rotate: 1,  scale: 1,    zIndex: 40 },
  { x: 16, y: 5,  rotate: 5,  scale: 0.97, zIndex: 30 },
  { x: 28, y: 9,  rotate: 9,  scale: 0.94, zIndex: 20 },
  { x: 38, y: 13, rotate: 13, scale: 0.91, zIndex: 10 },
];

const AUTO_INTERVAL = 7000;

export default function PolaroidDeck() {
  const [frontPhotoIdx, setFrontPhotoIdx] = useState(0);
  const deckOrder = useRef([0, 1, 2, 3]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const isAnimating = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Set initial stack positions via GSAP
  useEffect(() => {
    deckOrder.current.forEach((photoIdx, slot) => {
      const el = cardRefs.current[photoIdx];
      if (el) gsap.set(el, { ...STACK[slot], rotation: STACK[slot].rotate });
    });
  }, []);

  const advance = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const currentFront = deckOrder.current[0];
    const frontEl = cardRefs.current[currentFront];
    const backPos = STACK[3];

    if (!frontEl) { isAnimating.current = false; return; }

    // Back cards ease forward with slight stagger
    deckOrder.current.slice(1).forEach((photoIdx, i) => {
      const el = cardRefs.current[photoIdx];
      const pos = STACK[i];
      if (!el) return;
      gsap.to(el, {
        x: pos.x,
        y: pos.y,
        rotation: pos.rotate,
        scale: pos.scale,
        zIndex: pos.zIndex,
        duration: 1.1,
        ease: "power3.out",
        delay: i * 0.06,
      });
    });

    // Front card: arc exit right → snap behind (off-screen) → slide + fade in
    gsap.timeline({
      onComplete: () => {
        deckOrder.current = [...deckOrder.current.slice(1), deckOrder.current[0]];
        setFrontPhotoIdx(deckOrder.current[0]);
        isAnimating.current = false;
      },
    })
      .to(frontEl, {
        x: 460,
        y: -15,
        rotation: 14,
        scale: 0.92,
        duration: 0.75,
        ease: "power3.in",
      })
      .set(frontEl, {
        x: backPos.x + 50,
        y: backPos.y,
        rotation: backPos.rotate,
        scale: backPos.scale,
        zIndex: backPos.zIndex,
        opacity: 0,
      })
      .to(frontEl, {
        x: backPos.x,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      });

    // Reset auto-interval
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(advance, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance]);

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width: 330, height: 380 }}
      onClick={advance}
    >
      {PHOTOS.map((photo, photoIdx) => (
        <div
          key={photoIdx}
          ref={(el) => { cardRefs.current[photoIdx] = el; }}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Shadow */}
          <div className="absolute bottom-[-2px] right-[-2px] w-[90%] h-[90%] bg-black/40 blur-[4px] z-0" />

          {/* Frame */}
          <div className="relative bg-white-soft p-3 border border-black/5 shadow-md z-10">
            <div className="relative w-[250px] h-[250px] md:w-[270px] md:h-[270px] overflow-hidden border border-black/5">
              <Image
                src={photo}
                alt=""
                fill
                priority={photoIdx === frontPhotoIdx}
                className="object-cover"
              />
            </div>
            <div className="mt-3 flex justify-center">
              <Image
                src="/NomePolaroid.png"
                alt="Gustavo"
                width={240}
                height={56}
                className="object-contain mx-auto block brightness-90"
              />
            </div>
          </div>

        </div>
      ))}

      {/* Tapes — fixed in container, always on top, never animate with cards */}
      <div className="absolute top-[-10px] left-[-60px] w-40 h-12 -rotate-[12deg] z-50 pointer-events-none">
        <Image src="/FitaPreta.png" alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-[33px] md:bottom-[13px] right-[-6px] md:right-[-26px] w-40 h-12 -rotate-[25deg] z-50 pointer-events-none">
        <Image src="/FitaAmarela.png" alt="" fill className="object-contain scale-x-[-1]" />
      </div>
    </div>
  );
}
