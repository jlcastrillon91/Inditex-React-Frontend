export function PageHeader({
  actions,
  description,
  eyebrow,
  title,
  variant = 'default',
}) {
  const isCatalogue = variant === 'catalogue'

  return (
    <header
      className={
        isCatalogue
          ? 'relative isolate overflow-hidden rounded-2xl border border-primary/10 bg-card px-5 py-7 shadow-[0_18px_50px_rgba(35,20,18,0.06)] sm:px-8 sm:py-9 lg:px-10'
          : 'flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between'
      }
    >
      {isCatalogue ? (
        <div
          aria-hidden="true"
          className="absolute -top-28 -right-20 -z-10 size-72 rounded-full bg-primary/[0.07] blur-3xl"
        />
      ) : null}
      <div
        className={
          isCatalogue
            ? 'flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'
            : 'contents'
        }
      >
        <div className="max-w-2xl">
        {eyebrow ? (
          <p
            className={
              isCatalogue
                ? 'inline-flex rounded-full border border-primary/15 bg-primary/[0.055] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary uppercase'
                : 'text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase'
            }
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={`font-semibold tracking-[-0.045em] text-balance ${
            isCatalogue
              ? 'mt-5 max-w-xl text-[2.65rem] leading-[0.98] sm:text-6xl'
              : 'mt-3 text-4xl sm:text-5xl'
          }`}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={`leading-6 text-muted-foreground ${
              isCatalogue ? 'mt-5 text-sm font-medium' : 'mt-4 text-sm'
            }`}
          >
            {isCatalogue ? (
              <span className="mr-2 inline-block size-1.5 rounded-full bg-primary align-middle" />
            ) : null}
            {description}
          </p>
        ) : null}
      </div>
        {actions ? (
          <div className={isCatalogue ? 'w-full lg:w-auto' : 'shrink-0'}>
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  )
}
