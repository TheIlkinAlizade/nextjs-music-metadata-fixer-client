export default function LoadingBars({ label }: { label: string }) {
  const delays = [0, 0.15, 0.3, 0.45, 0.6];

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-end gap-1 h-4">
        {delays.map((delay, i) => (
          <div
            key={i}
            className="eq-bar w-1 h-full rounded-full"
            style={{ backgroundColor: "var(--color-amber)", animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <span className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
        {label}
      </span>
    </div>
  );
}