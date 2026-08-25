import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          className="text-lg font-semibold tracking-[0.18em] uppercase"
          to="/"
        >
          Mobile Store
        </Link>
      </div>
    </header>
  )
}
