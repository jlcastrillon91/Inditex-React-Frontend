import { ImageOff, Smartphone } from 'lucide-react'
import { useState } from 'react'

export function ProductDetailImage({ imageUrl, productName }) {
  const [hasFailed, setHasFailed] = useState(false)
  const accessibleName = productName || 'Product'

  if (!imageUrl || hasFailed) {
    return (
      <div
        aria-label={`${accessibleName} image unavailable`}
        className="flex h-full w-full flex-col items-center justify-center gap-4 text-muted-foreground"
        role="img"
      >
        {hasFailed ? (
          <ImageOff aria-hidden="true" className="size-10" strokeWidth={1.5} />
        ) : (
          <Smartphone aria-hidden="true" className="size-12" strokeWidth={1.25} />
        )}
        <span className="text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      alt={accessibleName}
      className="h-full w-full object-contain p-8 sm:p-12"
      decoding="async"
      fetchPriority="high"
      height="640"
      onError={() => setHasFailed(true)}
      src={imageUrl}
      width="640"
    />
  )
}
