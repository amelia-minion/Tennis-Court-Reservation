import Image from "next/image";

export function HomeBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src="/home-background.png"
        alt=""
        fill
        priority
        className="object-cover object-center scale-105 saturate-[0.9] brightness-[1.02]"
        sizes="100vw"
      />
      {/* Light wash — keeps text readable while the court photo stays visible */}
      <div className="absolute inset-0 bg-stone-50/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-stone-50/15 to-green-900/20" />
    </div>
  );
}
