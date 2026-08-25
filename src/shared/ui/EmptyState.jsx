export function EmptyState({ title, description }) {
  return (
    <section className="rounded-lg border border-dashed p-10 text-center">
      <h2 className="text-lg font-medium">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </section>
  )
}
