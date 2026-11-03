import { RotateCw } from 'lucide-react'
import { errorMessage } from '../api/http.js'
import { cn } from '../lib/format.js'

export function Notice({ face, title, children, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-3xl bg-white/[0.02] px-6 py-12 text-center ring-1 ring-white/[0.06]',
        className,
      )}
    >
      <span aria-hidden className="text-3xl text-fuji">
        {face}
      </span>
      <p className="text-lg font-semibold text-night-100">{title}</p>
      {children && <div className="max-w-md text-sm leading-relaxed text-night-400">{children}</div>}
      {action}
    </div>
  )
}

export function RetryButton({ onClick, busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-night-100 ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-60"
    >
      <RotateCw aria-hidden className={cn('size-4', busy && 'animate-spin')} />
      Try again
    </button>
  )
}

export function ErrorNotice({ query, className }) {
  return (
    <Notice
      face="(╥﹏╥)"
      title="Couldn’t load this"
      className={className}
      action={<RetryButton onClick={() => query.refetch()} busy={query.isFetching} />}
    >
      {errorMessage(query.error)}
    </Notice>
  )
}
