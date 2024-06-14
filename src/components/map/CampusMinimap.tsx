import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { Color, UserOptions } from '@/types/BaseTypes';
import { ScheduleSection } from '@/types/ScheduleTypes';
import {
  MapFlyTo,
  getMapMarkerIcon,
  getUnknownMapMarkerIcon,
} from './MapUtility';
import { Mode } from '@/utility/Constants';
import { Map } from 'leaflet';
import { getLocation } from '@/app/Schedule';
import { getCourseColor } from '@/app/Plan';

const DEFAULT_POSITION: [number, number] = [42.055909, -87.672709];
const DEFAULT_ZOOM = 14.2;

interface CampusMinimapProps {
  expand: () => void;
  location?: [string | null, Color];
  section?: ScheduleSection;
  switches: UserOptions;
}

function CampusMinimap({
  expand,
  location,
  section,
  switches,
}: CampusMinimapProps) {
  const rooms = location ? [location[0]] : section?.room || [];
  const ref = useRef<Map | null>(null);

  const positions: ([number, number] | null)[] | undefined = rooms.map(
    (room) => {
      const loc = getLocation(room);
      return loc ? [loc.lat, loc.lon] : null;
    }
  );

  useEffect(() => {
    if (switches.get.mode === Mode.SCHEDULE && switches.get.tab === 'Search') {
      if (ref.current) {
        ref.current.invalidateSize();
      }
    }
  }, [switches.get.mode, switches.get.tab]);

  const firstPosition = positions?.[0] || DEFAULT_POSITION;
  return (
    <div className="relative h-full w-full">
      <MapContainer
        id="minimap"
        ref={ref}
        center={DEFAULT_POSITION}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFlyTo position={firstPosition} />
        {(section || location) &&
          (positions ? (
            positions.map((loc, i) =>
              loc ? (
                <Marker
                  position={loc}
                  key={`map-marker-${i}`}
                  icon={
                    section
                      ? getMapMarkerIcon(
                          section.color || getCourseColor(section.subject)
                        )
                      : getMapMarkerIcon(location![1])
                  }
                />
              ) : (
                <Fragment key={`map-marker-${i}`} />
              )
            )
          ) : (
            <Marker
              position={DEFAULT_POSITION}
              icon={getUnknownMapMarkerIcon('gray')}
            >
              <Tooltip permanent direction="bottom">
                Unknown location
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>
      <button
        className="absolute right-2 top-2 z-20 rounded-md p-0.5 text-gray-500 hover:bg-gray-100/20 active:bg-gray-100/40 dark:hover:bg-gray-600/20 dark:active:bg-gray-600/40"
        onClick={() => expand()}
      >
        <ArrowsPointingOutIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default CampusMinimap;
