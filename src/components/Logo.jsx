import { useId } from 'react'
import { cn } from '../lib/format.js'

export function Logo({ className }) {
  // Unique per instance (navbar + footer); stripped to characters that are safe inside url(#…)
  const gradient = `blade${useId().replace(/[^\w-]/g, '')}`
  return (
    <span
      className={cn(
        'inline-flex items-center font-display text-lg leading-none tracking-tight text-night-100 lowercase select-none',
        className,
      )}
    >
      anime
      {/* A katana slash between the words */}
      <svg viewBox="0 0 12 24" aria-hidden="true" className="mx-[0.12em] h-[1.2em] w-[0.6em] overflow-visible">
        <defs>
          <linearGradient id={gradient} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-fuji)" />
            <stop offset="0.55" stopColor="var(--color-sakura)" />
            <stop offset="1" stopColor="var(--color-sora)" />
          </linearGradient>
        </defs>
        <path d="M1 23 C3.2 14 7 6.5 11 1 C8.6 8 4.8 16.5 1 23 Z" fill={`url(#${gradient})`} />
      </svg>
      slayer
    </span>
  )
}
