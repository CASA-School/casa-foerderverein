export function OpenSpace({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <svg className={`open-space ${className}`} viewBox="-20 -20 392 424" fill="none" aria-hidden="true">
      <path className="space-arc space-arc-blue" d="M160 0 A160 160 0 0 0 160 320" />
      <path className={`space-arc space-arc-ink ${dark ? "space-arc-white" : ""}`} d="M192 64 A160 160 0 0 1 192 384" />
      <path className="space-square" d="M148.8 163.2h41.6v41.6h-41.6z" />
    </svg>
  );
}
