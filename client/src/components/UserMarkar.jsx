import { Marker, Popup } from 'react-leaflet';

function UserMarkar({ userLocation, defaultIcon }) {
    return (
        <Marker position={userLocation} icon={defaultIcon}>
            <Popup className="font-medium">
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span>You are here!</span>
                </div>
            </Popup>
        </Marker>
    )
}

export default UserMarkar