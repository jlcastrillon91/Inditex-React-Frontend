export function formatProductCameras(
  primaryCamera = [],
  secondaryCamera = [],
) {
  const cameras = []

  if (primaryCamera.length > 0) {
    cameras.push(`Primary: ${primaryCamera.join(', ')}`)
  }

  if (secondaryCamera.length > 0) {
    cameras.push(`Secondary: ${secondaryCamera.join(', ')}`)
  }

  return cameras.join(' · ') || 'Not available'
}
