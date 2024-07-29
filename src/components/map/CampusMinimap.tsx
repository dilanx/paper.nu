import { useApp } from '@/app/Context';
import { getCourseColor } from '@/app/Plan';
import { getLocation, isRoomFinderAvailable } from '@/app/Schedule';
import { Color } from '@/types/BaseTypes';
import { ScheduleSection } from '@/types/ScheduleTypes';
import { Mode } from '@/utility/Constants';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { Map } from 'leaflet';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MapTooltip from './MapTooltip';
import {
  MapFlyTo,
  getMapMarkerIcon,
  getUnknownMapMarkerIcon,
} from './MapUtility';
import { MapIcon } from '@heroicons/react/24/solid';

const DEFAULT_POSITION: [number, number] = [42.055909, -87.672709];
const DEFAULT_ZOOM = 14.2;

interface CampusMinimapProps {
  location?: [string | null, Color];
  section?: ScheduleSection;
}

function CampusMinimap({ location, section }: CampusMinimapProps) {
  const { userOptions, mapView } = useApp();
  const rooms = useMemo(
    () => (location ? [location[0]] : section?.room || []),
    [location, section?.room]
  );
  const roomFinderAvailable = useMemo(
    () => rooms?.some((r) => isRoomFinderAvailable(r)),
    [rooms]
  );

  const ref = useRef<Map | null>(null);

  const positions: ([number, number] | null)[] | undefined = rooms.map(
    (room) => {
      const loc = getLocation(room);
      return loc ? [loc.lat, loc.lon] : null;
    }
  );

  useEffect(() => {
    if (
      userOptions.get.mode === Mode.SCHEDULE &&
      userOptions.get.tab === 'Search'
    ) {
      if (ref.current) {
        ref.current.invalidateSize();
      }
    }
  }, [userOptions.get.mode, userOptions.get.tab]);

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
                >
                  <MapTooltip direction="bottom" permanent>
                    <div className="flex items-center gap-1">
                      <span>{rooms[i]}</span>
                      {roomFinderAvailable && <MapIcon className="h-3 w-3" />}
                    </div>
                  </MapTooltip>
                </Marker>
              ) : (
                <Fragment key={`map-marker-${i}`} />
              )
            )
          ) : (
            <Marker
              position={DEFAULT_POSITION}
              icon={getUnknownMapMarkerIcon('gray')}
            >
              <MapTooltip direction="bottom" permanent>
                Unknown location
              </MapTooltip>
            </Marker>
          ))}
      </MapContainer>
      <button
        className="absolute right-2 top-2 z-20 rounded-md p-0.5 text-gray-500 hover:bg-gray-100/20 active:bg-gray-100/40 dark:hover:bg-gray-600/20 dark:active:bg-gray-600/40"
        onClick={() => mapView()}
      >
        <ArrowsPointingOutIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default CampusMinimap;
