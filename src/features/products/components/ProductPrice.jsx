import { Tag } from 'lucide-react'

import { formatCurrency } from '@/shared/formatters/formatCurrency'

export function ProductPrice({ compact = false, value }) {
  if (value === null || value === undefined || value === '') {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-primary/15 bg-primary/[0.055] font-semibold text-primary ${
          compact
            ? 'gap-1 px-2 py-1 text-[0.68rem]'
            : 'gap-1.5 px-2.5 py-1.5 text-xs'
        }`}
      >
        <Tag aria-hidden="true" className={compact ? 'size-3' : 'size-3.5'} />
        Price pending
      </span>
    )
  }

  return (
    <span
      className={`font-semibold text-primary tabular-nums ${
        compact ? 'text-sm' : 'text-lg'
      }`}
    >
      {formatCurrency(value)}
    </span>
  )
}
