import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import ScheduleManager from '../../ScheduleManager';
import { ScheduleSection } from '../../types/ScheduleTypes';
import {
  getMapMarkerIcon,
  getUnknownMapMarkerIcon,
  MapFlyTo,
} from './MapUtility';

const DEFAULT_POSITION: [number, number] = [42.055909, -87.672709];
const DEFAULT_ZOOM = 14.2;

interface CampusMinimapProps {
  expand: () => void;
  section?: ScheduleSection;
}

function CampusMinimap({ expand, section }: CampusMinimapProps) {
  const location = ScheduleManager.getLocation(section?.room);
  const position: [number, number] = location
    ? [location.lat, location.lon]
    : DEFAULT_POSITION;

  return (
    <div className="relative h-full w-full">
      <MapContainer
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
        <MapFlyTo position={position} />
        {section && (
          <Marker
            position={position}
            icon={
              location
                ? getMapMarkerIcon(
                    ScheduleManager.getCourseColor(section.subject)
                  )
                : getUnknownMapMarkerIcon('gray')
            }
          >
            {!location && (
              <Tooltip permanent direction="bottom">
                Unknown location
              </Tooltip>
            )}
          </Marker>
        )}
      </MapContainer>
      <button
        className="absolute top-2 right-2 z-20 text-gray-500 hover:text-emerald-500 active:text-emerald-600"
        onClick={() => expand()}
      >
        <ArrowsPointingOutIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default CampusMinimap;
