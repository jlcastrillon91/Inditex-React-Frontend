import { Search, X } from 'lucide-react'

import { Input } from '@/shared/ui/Input'

export function ProductSearch({ disabled = false, onSearchChange, search }) {
  return (
    <div className="relative w-full sm:w-80">
      <label className="sr-only" htmlFor="product-search">
        Search products by brand or model
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        className="h-11 px-9 [&::-webkit-search-cancel-button]:appearance-none"
        disabled={disabled}
        id="product-search"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search brand or model"
        type="search"
        value={search}
      />
      {search ? (
        <button
          aria-label="Clear product search"
          className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={() => onSearchChange('')}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
