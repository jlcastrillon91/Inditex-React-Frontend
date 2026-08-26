import { getProductSpecifications } from '@/features/products/model/getProductSpecifications'

export function ProductDescription({ product }) {
  const specifications = getProductSpecifications(product)

  return (
    <section aria-labelledby="product-specifications-title">
      <h2
        className="text-xl font-semibold tracking-tight"
        id="product-specifications-title"
      >
        Product details
      </h2>
      <dl className="mt-5 border-y">
        {specifications.map(({ label, value }) => (
          <div
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5 border-b py-3.5 last:border-b-0"
            key={label}
          >
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
