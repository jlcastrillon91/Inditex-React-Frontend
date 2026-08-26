import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProductDescription } from '@/features/products/components/ProductDescription'
import { createProductFixture } from '@/features/products/test/productFixtures'

describe('ProductDescription', () => {
  it('renders every required product attribute', () => {
    render(
      <ProductDescription
        product={
          createProductFixture({
            battery: '3000 mAh',
            cpu: 'Octa-core',
            dimensions: '146.7 x 71.9 x 7.7 mm',
            displayResolution: '1080 x 2340 px',
            operatingSystem: 'Android 14',
            primaryCamera: ['50 MP', '12 MP'],
            ram: '8 GB',
            secondaryCamera: ['10 MP'],
            weight: '167 g',
          })
        }
      />,
    )

    const details = screen.getByRole('region', { name: 'Product details' })
    for (const label of [
      'Brand',
      'Model',
      'Price',
      'CPU',
      'RAM',
      'Operating system',
      'Display resolution',
      'Battery',
      'Cameras',
      'Dimensions',
      'Weight',
    ]) {
      expect(within(details).getByText(label)).toBeInTheDocument()
    }

    expect(within(details).getByText('€799.00')).toBeInTheDocument()
    expect(
      within(details).getByText('Primary: 50 MP, 12 MP · Secondary: 10 MP'),
    ).toBeInTheDocument()
  })

  it('renders readable fallbacks for missing information', () => {
    render(<ProductDescription product={createProductFixture()} />)

    expect(screen.getAllByText('Not available')).toHaveLength(8)
  })
})
