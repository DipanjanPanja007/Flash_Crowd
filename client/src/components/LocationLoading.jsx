import React from 'react'

function LocationLoading() {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-[1000] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mb-4"></div>
                <p className="text-gray-700 font-medium">Finding your location...</p>
            </div>
        </div>
    )
}

export default LocationLoading