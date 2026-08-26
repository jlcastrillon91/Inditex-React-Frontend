import { useId, useState } from 'react'

import { Select } from '@/shared/ui/Select'

function getInitialValue(options) {
  return options.length > 0 ? String(options[0].code) : ''
}

function OptionSelect({ label, onChange, options, value }) {
  const id = useId()
  const hasOptions = options.length > 0

  return (
    <div>
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <Select
        className="mt-2 h-11"
        disabled={!hasOptions}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
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

export function ProductOptions({ colors = [], storageOptions = [] }) {
  const [colorCode, setColorCode] = useState(() => getInitialValue(colors))
  const [storageCode, setStorageCode] = useState(() =>
    getInitialValue(storageOptions),
  )

  return (
    <section aria-labelledby="product-options-title">
      <h2
        className="text-xl font-semibold tracking-tight"
        id="product-options-title"
      >
        Options
      </h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <OptionSelect
          label="Storage"
          onChange={setStorageCode}
          options={storageOptions}
          value={storageCode}
        />
        <OptionSelect
          label="Color"
          onChange={setColorCode}
          options={colors}
          value={colorCode}
        />
      </div>
    </section>
  )
}
