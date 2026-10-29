import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-logo ${className}`}>
      <Image
        className="brand-logo-art"
        src="/brand/logo.png"
        alt="CASA Förderverein e.V."
        width={1774}
        height={887}
        unoptimized
        priority
      />
    </span>
  );
}
