import Image from "next/image";

export function MuteIcon({ muted }: { muted: boolean }) {
  return (
    <span className="relative inline-flex items-center justify-center w-8 h-8">
      <Image src="/Som.png" alt="" width={32} height={32} className="object-contain" />
      {muted && (
        <span className="absolute block w-9 h-[2px] bg-black -rotate-45 pointer-events-none" />
      )}
    </span>
  );
}
