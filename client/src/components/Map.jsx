import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocationLoading from './LocationLoading';
import UserMarkar from './UserMarkar.jsx';
import EventMarker from './EventMarker.jsx';

// Default user icon
const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Fly to user location when available
const FlyToUser = ({ position, zoomIn }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, zoomIn, { duration: 2 });
        }
    }, [position, map, zoomIn]);
    return null;
};

// Utility to calculate distance in km
const getDistance = (userPos, eventPos) => {
    const from = L.latLng(userPos[0], userPos[1]);
    const to = L.latLng(eventPos[0], eventPos[1]);
    return (from.distanceTo(to) / 1000).toFixed(2);
};

// Event icon by type
const getEventIcon = (type) => {
    const colorMap = {
        sports: 'red',
        music: 'violet',
        tech: 'blue',
        default: 'green',
    };

    const color = colorMap[type] || colorMap.default;

    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
};


const ClickMarker = ({ onClick }) => {
    useMapEvents({
        click(e) {
            onClick(e.latlng);
        },
    });
    return null;
}

const Map = ({ events = [], zoomIn = 13 }) => {

    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markerPosition, setMarkerPosition] = useState(null);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
                setLoading(false);
            },
            (err) => {
                console.error('Geolocation error:', err);
                setLoading(false);
            }
        );
    }, []);

    return (
        <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
            {loading && <LocationLoading />}
            <MapContainer
                center={[20.5937, 78.9629]} // Default India
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ClickMarker onClick={(latlng) => setMarkerPosition(latlng)} />

                {markerPosition && (
                    <Marker position={markerPosition}>
                        <Popup>
                            Latitude: {markerPosition.lat.toFixed(5)} <br />
                            Longitude: {markerPosition.lng.toFixed(5)}
                        </Popup>
                    </Marker>
                )}


                {
                    userLocation &&
                    <>
                        <FlyToUser position={userLocation} zoomIn={zoomIn} />
                        <UserMarkar defaultIcon={defaultIcon} userLocation={userLocation} />
                    </>
                }
                {userLocation &&
                    events.map((event) => {
                        const distance = getDistance(userLocation, [event.position.lat, event.position.lng]);
                        return (
                            <EventMarker distance={distance} event={event} getEventIcon={getEventIcon} key={event.id} />
                        );
                    })}
            </MapContainer>
        </div>
    );
};



export default Map;