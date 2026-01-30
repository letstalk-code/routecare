/**
 * Opens the default maps app with navigation to the given address or coordinates
 * - iOS (iPhone/iPad): Opens Apple Maps
 * - macOS (desktop): Opens Apple Maps
 * - Android/Windows/Linux: Opens Google Maps
 */
export function openMapsNavigation(address: string, lat?: number, lng?: number) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMac = /Macintosh|Mac OS X/.test(navigator.userAgent);
  const useAppleMaps = isIOS || isMac;

  if (lat && lng) {
    // Use coordinates if available (more accurate)
    if (useAppleMaps) {
      // Apple Maps with coordinates
      window.open(`maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`, '_blank');
    } else {
      // Google Maps with coordinates
      window.open(`https://maps.google.com/maps?daddr=${lat},${lng}&dir_action=navigate`, '_blank');
    }
  } else {
    // Use address as fallback
    const encodedAddress = encodeURIComponent(address);
    if (useAppleMaps) {
      // Apple Maps with address
      window.open(`maps://maps.apple.com/?daddr=${encodedAddress}&dirflg=d`, '_blank');
    } else {
      // Google Maps with address
      window.open(`https://maps.google.com/maps?daddr=${encodedAddress}&dir_action=navigate`, '_blank');
    }
  }
}
