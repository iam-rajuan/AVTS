// import React from 'react'
// import { NavigationFooter } from "../components/NavigationFooter";

// const HomeM = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen pb-16">
//       <h1 className="p-6 text-2xl font-bold">Home Page</h1>
//       <p className="px-6">Your home content goes here</p>
//       <NavigationFooter />
//     </div>
//   )
// }

// export default HomeM




import React, { useEffect, useRef, useState } from 'react';
import greenCar from '../assets/green-car.png';
import redCar from '../assets/red-car.png';
import { NavigationFooter } from "../components/NavigationFooter";
import mapboxgl from 'mapbox-gl'; // Regular import
import io from 'socket.io-client';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtLXJhanVhbiIsImEiOiJjbTlvNWppdHgwcXFuMmpzMzhjeTJ2cm9hIn0.UXhzpO23v4aouhc4w-kTeA';

// Fix for worker in Vite
if (!window.workerUrlSet) {
  window.workerUrlSet = true;
  const workerUrl = URL.createObjectURL(new Blob(
    [`importScripts("https://unpkg.com/mapbox-gl@${mapboxgl.version}/dist/mapbox-gl-csp-worker.js");`],
    { type: 'application/javascript' }
  ));
  mapboxgl.workerUrl = workerUrl;
}
const HomeM = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const driverMarkers = useRef({});
  const lastDriverPositions = useRef({});
  const [drivers, setDrivers] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const socket = useRef(null);

  const getCarIcon = (moving) =>
    moving ? greenCar : redCar;
    // moving ? '/icons/green-car.png' : '/icons/red-car.png';

  useEffect(() => {
    socket.current = io('http://localhost:4000');

    socket.current.on('locationUpdate', ({ vehicleId, coords }) => {
      setDrivers((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((d) => d.vehicleId === vehicleId);
        const newData = { vehicleId, latitude: coords.lat, longitude: coords.lng };
        if (index !== -1) updated[index] = newData;
        else updated.push(newData);
        return updated;
      });
    });

    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLonLat = [position.coords.longitude, position.coords.latitude];
          setUserCoords({ latitude: userLonLat[1], longitude: userLonLat[0] });

          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: userLonLat,
            zoom: 14,
          });

          userMarker.current = new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(userLonLat)
            .setPopup(new mapboxgl.Popup().setText('You are here'))
            .addTo(map.current);
        },
        (err) => {
          console.error('Geolocation error:', err);
          alert('Failed to get your location. Using default center.');
          const fallback = [90.4125, 23.8103];
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: fallback,
            zoom: 12,
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (!map.current || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude];
        setUserCoords({ latitude: coords[1], longitude: coords[0] });

        if (userMarker.current) {
          userMarker.current.setLngLat(coords);
        } else {
          userMarker.current = new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup().setText('You are here'))
            .addTo(map.current);
        }
      },
      (err) => console.error('Geolocation error:', err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!map.current || !userCoords) return;

    const seenCoords = new Set();

    drivers.forEach((driver, index) => {
      let { vehicleId, latitude, longitude } = driver;

      const baseKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
      let offsetLat = latitude;
      let offsetLng = longitude;

      const angle = (index * 45) % 360;
      const radians = angle * (Math.PI / 180);
      const radius = 0.0002;

      offsetLat += radius * Math.cos(radians);
      offsetLng += radius * Math.sin(radians);

      const userLat = userCoords.latitude;
      const userLng = userCoords.longitude;
      const tooCloseToUser =
        Math.abs(latitude - userLat) < 0.0001 &&
        Math.abs(longitude - userLng) < 0.0001;

      if (tooCloseToUser) {
        offsetLat += 0.00015;
        offsetLng += 0.00015;
      }

      let finalKey = `${offsetLat.toFixed(5)},${offsetLng.toFixed(5)}`;
      let iteration = 1;
      while (seenCoords.has(finalKey)) {
        offsetLat += 0.0001;
        offsetLng += 0.0001;
        finalKey = `${offsetLat.toFixed(5)},${offsetLng.toFixed(5)}`;
        iteration++;
        if (iteration > 10) break;
      }
      seenCoords.add(finalKey);

      const prev = lastDriverPositions.current[vehicleId];
      const isMoving = prev
        ? prev.latitude !== latitude || prev.longitude !== longitude
        : false;

      lastDriverPositions.current[vehicleId] = { latitude, longitude };

      const el = document.createElement('img');
      el.src = getCarIcon(isMoving);
      el.style.width = '30px';
      el.style.height = '20px';

      if (driverMarkers.current[vehicleId]) {
        driverMarkers.current[vehicleId].setLngLat([offsetLng, offsetLat]);
        driverMarkers.current[vehicleId].getElement().src = getCarIcon(isMoving);
      } else {
        const marker = new mapboxgl.Marker(el)
          .setLngLat([offsetLng, offsetLat])
          .setPopup(new mapboxgl.Popup().setText(`Vehicle ID: ${vehicleId}`))
          .addTo(map.current);
        driverMarkers.current[vehicleId] = marker;
      }
    });
  }, [drivers, userCoords]);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <h1 className="p-6 text-2xl font-bold">Home Page</h1>
      {/* <p className="px-6">Your home content goes here</p> */}
      
      {/* Map Container */}
      <div style={{ position: 'relative', height: '70vh', margin: '16px', borderRadius: '8px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '8px',
            maxHeight: '40vh',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px',
            zIndex: 1000,
          }}
        >
          <div><strong>🧍 You:</strong></div>
          {userCoords ? (
            <div>
              Lat: {userCoords.latitude.toFixed(5)} <br />
              Lng: {userCoords.longitude.toFixed(5)}
            </div>
          ) : (
            <div>Waiting for location...</div>
          )}
          <hr />
          <div><strong>🚗 Drivers:</strong></div>
          {drivers.map((d) => (
            <div key={d.vehicleId} style={{ marginBottom: '5px' }}>
              <strong>{d.vehicleId}</strong><br />
              Lat: {d.latitude.toFixed(5)}<br />
              Lng: {d.longitude.toFixed(5)}
            </div>
          ))}
        </div>

        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      </div>
      
      <NavigationFooter />
    </div>
  );
};

export default HomeM;