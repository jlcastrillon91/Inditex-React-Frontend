import { formatProductCameras } from '@/features/products/formatters/formatProductCameras'
import { formatCurrency } from '@/shared/formatters/formatCurrency'
import { formatValue } from '@/shared/formatters/formatValue'

export function getProductSpecifications(product) {
  return [
    { label: 'Brand', value: formatValue(product.brand) },
    { label: 'Model', value: formatValue(product.model) },
    { label: 'Price', value: formatCurrency(product.price) },
    { label: 'CPU', value: formatValue(product.cpu) },
    { label: 'RAM', value: formatValue(product.ram) },
    {
      label: 'Operating system',
      value: formatValue(product.operatingSystem),
    },
    {
      label: 'Display resolution',
      value: formatValue(product.displayResolution),
    },
    { label: 'Battery', value: formatValue(product.battery) },
    {
      label: 'Cameras',
      value: formatProductCameras(
        product.primaryCamera,
        product.secondaryCamera,
      ),
    },
    { label: 'Dimensions', value: formatValue(product.dimensions) },
    { label: 'Weight', value: formatValue(product.weight) },
  ]
}
