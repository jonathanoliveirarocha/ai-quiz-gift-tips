import { useId } from 'react'

/** Símbolo da marca: o mesmo presentinho do favicon. */
export function LogoMark({ size = 34 }: { size?: number }) {
  // id único por instância: o logo aparece no topo e no rodapé da mesma página.
  const gradient = `mimo-${useId().replace(/:/g, '')}`
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7a6b" />
          <stop offset=".5" stopColor="#ff4fb3" />
          <stop offset="1" stopColor="#8b6cff" />
        </linearGradient>
      </defs>
      <rect x="8" y="26" width="48" height="32" rx="6" fill={`url(#${gradient})`} />
      <rect x="4" y="18" width="56" height="12" rx="5" fill={`url(#${gradient})`} />
      <rect x="28" y="18" width="8" height="40" fill="#fff" opacity=".9" />
      <path
        d="M32 18c-4-10-16-12-16-4 0 5 9 5 16 4zm0 0c4-10 16-12 16-4 0 5-9 5-16 4z"
        fill="none"
        stroke="#ffd36e"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Logo completo: presentinho + "Mimo Certo". */
export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-word">
        Mimo <em>Certo</em>
      </span>
    </span>
  )
}
