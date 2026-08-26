import { ImageOff, Smartphone } from 'lucide-react'
import { useState } from 'react'

export function ProductImage({ imageUrl, productName }) {
  const [hasFailed, setHasFailed] = useState(false)
  const accessibleName = productName || 'Product'

  if (!imageUrl || hasFailed) {
    return (
      <div
        aria-label={`${accessibleName} image unavailable`}
        className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground"
        role="img"
      >
        {hasFailed ? (
          <ImageOff aria-hidden="true" className="size-8" strokeWidth={1.5} />
        ) : (
          <Smartphone aria-hidden="true" className="size-10" strokeWidth={1.25} />
        )}
        <span className="text-xs">Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      alt={accessibleName}
      className="h-full w-full object-contain p-8 transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
      decoding="async"
      height="320"
      loading="lazy"
      onError={() => setHasFailed(true)}
      src={imageUrl}
      width="320"
    />
  )
}
