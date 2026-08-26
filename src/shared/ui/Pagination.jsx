import { Button } from '@/shared/ui/Button'

export function Pagination({ currentPage, onPageChange, pageCount }) {
  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Catalogue pagination"
      className="flex items-center justify-between gap-4 border-t pt-6"
    >
      <Button
        aria-label="Go to previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        size="sm"
        variant="outline"
      >
        Previous
      </Button>

      <p className="text-sm text-muted-foreground sm:hidden">
        Page {currentPage} of {pageCount}
      </p>

      <div className="hidden items-center gap-2 sm:flex">
        {pages.map((page) => {
          const isCurrent = page === currentPage

          return (
            <Button
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={
                isCurrent ? `Page ${page}, current page` : `Go to page ${page}`
              }
              className="min-w-8 px-2"
              key={page}
              onClick={() => onPageChange(page)}
              size="sm"
              variant={isCurrent ? 'primary' : 'outline'}
            >
              {page}
            </Button>
          )
        })}
      </div>

      <Button
        aria-label="Go to next page"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
        size="sm"
        variant="outline"
      >
        Next
      </Button>
    </nav>
  )
}
