import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 ? (
              <ChevronRight aria-hidden="true" className="size-4" />
            ) : null}
            <li>
              {item.to ? (
                <Link
                  className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  to={item.to}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground/80">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
