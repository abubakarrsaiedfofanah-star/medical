export type LocationPoint = { latitude: number; longitude: number; accuracy?: number };

export function requestLocation(): Promise<LocationPoint> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Location is unavailable on this device.'));
    navigator.geolocation.getCurrentPosition(
      p => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy }),
      reject,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  });
}
