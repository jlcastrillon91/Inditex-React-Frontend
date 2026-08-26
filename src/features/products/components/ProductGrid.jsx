import { ProductCard } from '@/features/products/components/ProductCard'

export function ProductGrid({ products }) {
  return (
    <ul
      aria-label="Product catalogue"
      className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
