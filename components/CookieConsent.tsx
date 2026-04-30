"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const STORAGE_KEY = "cookie-consent";
const DELAY_MS = 2200;

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const respond = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 mx-auto z-[150] max-w-[280px] sm:max-w-xs sm:bottom-6 sm:left-6 sm:right-auto sm:mx-0">
      {/* Tape */}
      <div className="absolute -top-4 -left-4 z-10 rotate-[-20deg] w-14 h-7 sm:w-16 sm:h-8">
        <Image
          src="/Polaroid/FitaAmarela.png"
          alt=""
          width={64}
          height={32}
          className="w-full h-full"
        />
      </div>

      <div className="bg-white-soft shadow-[4px_4px_0px] p-4 flex flex-col gap-3">
        <p className="font-body text-xs text-black leading-relaxed">
          We use cookies to analyze site traffic and improve your experience.
          By continuing, you agree to our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            cookie policy
          </a>
          .
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => respond("accepted")}
            className="flex-1 py-2 bg-black text-white font-body text-xs tracking-wide transition-colors hover:bg-black/80 active:bg-black/60"
          >
            Accept
          </button>
          <button
            onClick={() => respond("rejected")}
            className="flex-1 py-2 border-2 border-black font-body text-xs tracking-wide transition-colors hover:bg-black/5 active:bg-black/10"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
