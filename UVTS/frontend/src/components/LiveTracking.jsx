// import React, { useState, useEffect } from 'react'
// import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

// const containerStyle = {
//     width: '100%',
//     height: '100%',
// };

// const center = {
//     lat: -3.745,
//     lng: -38.523
// };

// const LiveTracking = () => {
//     const [ currentPosition, setCurrentPosition ] = useState(center);

//     useEffect(() => {
//         navigator.geolocation.getCurrentPosition((position) => {
//             const { latitude, longitude } = position.coords;
//             setCurrentPosition({
//                 lat: latitude,
//                 lng: longitude
//             });
//         });

//         const watchId = navigator.geolocation.watchPosition((position) => {
//             const { latitude, longitude } = position.coords;
//             setCurrentPosition({
//                 lat: latitude,
//                 lng: longitude
//             });
//         });

//         return () => navigator.geolocation.clearWatch(watchId);
//     }, []);

//     useEffect(() => {
//         const updatePosition = () => {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 const { latitude, longitude } = position.coords;

//                 console.log('Position updated:', latitude, longitude);
//                 setCurrentPosition({
//                     lat: latitude,
//                     lng: longitude
//                 });
//             });
//         };

//         updatePosition(); // Initial position update

//         const intervalId = setInterval(updatePosition, 1000); // Update every 10 seconds

//     }, []);

//     return (
//         <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={currentPosition}
//                 zoom={15}
//             >
//                 <Marker position={currentPosition} />
//             </GoogleMap>
//         </LoadScript>
//     )
// }

// export default LiveTracking



// Updated LiveTracking.jsx using Mapbox
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API;

const LiveTracking = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [currentPosition, setCurrentPosition] = useState({
    lng: -38.523,
    lat: -3.745
  });

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [currentPosition.lng, currentPosition.lat],
        zoom: 15
      });

      marker.current = new mapboxgl.Marker()
        .setLngLat([currentPosition.lng, currentPosition.lat])
        .addTo(map.current);
    }
  }, []);

  useEffect(() => {
    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;
      const newPos = { lat: latitude, lng: longitude };
      setCurrentPosition(newPos);

      if (map.current) {
        map.current.setCenter([newPos.lng, newPos.lat]);
        if (marker.current) marker.current.setLngLat([newPos.lng, newPos.lat]);
      }
    };

    navigator.geolocation.getCurrentPosition(updateLocation);
    const watchId = navigator.geolocation.watchPosition(updateLocation);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
  );
};

export default LiveTracking;
