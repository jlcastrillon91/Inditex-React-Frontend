import { useId, useState } from 'react'

import { Button } from '@/shared/ui/Button'
import { Select } from '@/shared/ui/Select'

function getInitialValue(options) {
  return options.length > 0 ? options[0].code : null
}

function OptionSelect({ disabled, label, onChange, options, value }) {
  const id = useId()
  const hasOptions = options.length > 0

  return (
    <div>
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <Select
        className="mt-2 h-11"
        disabled={disabled || !hasOptions}
        id={id}
        onChange={(event) => {
          const selectedOption = options.find(
            (option) => String(option.code) === event.target.value,
          )
          onChange(selectedOption?.code ?? null)
        }}
        value={value === null ? '' : String(value)}
      >
        {hasOptions ? (
          options.map((option) => (
            <option key={option.code} value={String(option.code)}>
              {option.name}
            </option>
          ))
        ) : (
          <option value="">Not available</option>
        )}
      </Select>
    </div>
  )
}

export function ProductOptions({
  action = {},
  colors = [],
  storageOptions = [],
}) {
  const [colorCode, setColorCode] = useState(() => getInitialValue(colors))
  const [storageCode, setStorageCode] = useState(() =>
    getInitialValue(storageOptions),
  )

  const {
    error,
    isPending = false,
    isSuccess = false,
    onSubmit = () => undefined,
    reset = () => undefined,
  } = action
  const canSubmit =
    colorCode !== null && storageCode !== null && !isPending

  function handleColorChange(code) {
    reset()
    setColorCode(code)
  }

  function handleStorageChange(code) {
    reset()
    setStorageCode(code)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit) return

    Promise.resolve(onSubmit({ colorCode, storageCode })).catch(() => {
      // The mutation state renders the error; avoid an unhandled event promise.
    })
  }

  return (
    <section aria-labelledby="product-options-title">
      <h2
        className="text-xl font-semibold tracking-tight"
        id="product-options-title"
      >
        Options
      </h2>
      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <OptionSelect
            disabled={isPending}
            label="Storage"
            onChange={handleStorageChange}
            options={storageOptions}
            value={storageCode}
          />
          <OptionSelect
            disabled={isPending}
            label="Color"
            onChange={handleColorChange}
            options={colors}
            value={colorCode}
          />
        </div>
        <Button
          className="mt-6 w-full"
          disabled={!canSubmit}
          size="lg"
          type="submit"
        >
          {isPending ? 'Adding…' : 'Add to cart'}
        </Button>
        {isSuccess ? (
          <p className="mt-4 text-sm font-medium" role="status">
            Product added to cart.
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error.message || 'We could not add this product to the cart.'}
          </p>
        ) : null}
      </form>
    </section>
  )
}
