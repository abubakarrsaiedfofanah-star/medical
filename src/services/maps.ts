export type MapMarker = { id: string; name: string; latitude: number; longitude: number; category: string };

export function distanceKm(a: MapMarker, b: MapMarker) {
  const R = 6371;
  const dLat = (b.latitude-a.latitude)*Math.PI/180;
  const dLon = (b.longitude-a.longitude)*Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.latitude*Math.PI/180)*Math.cos(b.latitude*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}
