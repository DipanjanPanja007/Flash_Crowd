import { Marker, Popup } from 'react-leaflet';

function EventMarker({ getEventIcon, event, distance }) {
    return (
        <Marker
            position={[event.position.lat, event.position.lng]}
            icon={getEventIcon(event.type)}
        >
            <Popup className="font-medium min-w-[200px]">
                <div className="space-y-1">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {distance} km from you
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.type || 'General'} event
                    </div>
                </div>
            </Popup>
        </Marker>
    )
}

export default EventMarker