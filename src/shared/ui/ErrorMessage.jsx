import { Button } from '@/shared/ui/Button'

export function ErrorMessage({ message, onRetry }) {
  return (
    <section className="rounded-lg border border-destructive/40 p-6" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </section>
  )
}
