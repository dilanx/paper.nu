import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Color } from '../../types/BaseTypes';

export const getMapMarkerIcon = (color: Color) =>
  divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-${color}-700">
        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>
    `,
    className: 'map-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    tooltipAnchor: [16, -16],
  });

export const getUnknownMapMarkerIcon = (color: Color) =>
  divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-${color}-700">
        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
      </svg>
    `,
    className: 'map-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    tooltipAnchor: [0, 16],
  });

export function MapFlyTo({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    map.panTo(position, { duration: 0.25 });
  }, [map, position]);

  return null;
}
