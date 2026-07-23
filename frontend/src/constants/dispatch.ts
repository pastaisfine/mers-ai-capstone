/**
 * Emergency dispatch center reference point.
 * Used as: (a) proximity bias for geocoding ambiguous place names,
 *          (b) the origin for the responder route line on the map.
 *
 * Replace with your real dispatch center coordinates, or make this dynamic
 * (e.g. per-district center) once you have multiple stations.
 */
export const EMERGENCY_CENTER = {
  lat: 3.1073, // TODO: replace with your actual HQ coordinates
  lng: 101.6068,
  label: 'DISPATCH HQ',
};
