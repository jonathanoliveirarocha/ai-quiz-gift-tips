const SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  delay: `${(i % 7) * 0.8}s`,
  size: 2 + (i % 3),
}))

export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={{ left: s.left, top: s.top, animationDelay: s.delay, width: s.size, height: s.size }}
        />
      ))}
      <div className="bg-vignette" />
    </div>
  )
}
