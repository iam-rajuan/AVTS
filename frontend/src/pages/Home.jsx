import React, { useEffect, useRef, useState } from "react";
import greenCar from "../assets/green-car.png";
import redCar from "../assets/red-car.png";
import { NavigationFooter } from "../components/NavigationFooter";
import mapboxgl from "mapbox-gl";
import io from "socket.io-client";
import "mapbox-gl/dist/mapbox-gl.css";
import { LucideLocate, LucidePlus, LucideMinus, LucideMenu, LucideX, LucideMoon, LucideSun } from "lucide-react";

// Set Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiaWFtLXJhanVhbiIsImEiOiJjbTlvNWppdHgwcXFuMmpzMzhjeTJ2cm9hIn0.UXhzpO23v4aouhc4w-kTeA";

// Fix for worker in Vite
if (!window.workerUrlSet) {
  window.workerUrlSet = true;
  const workerUrl = URL.createObjectURL(
    new Blob(
      [
        `importScripts("https://unpkg.com/mapbox-gl@${mapboxgl.version}/dist/mapbox-gl-csp-worker.js");`,
      ],
      { type: "application/javascript" }
    )
  );
  mapboxgl.workerUrl = workerUrl;
}

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const driverMarkers = useRef({});
  const lastDriverPositions = useRef({});
  const [drivers, setDrivers] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const socket = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (map.current) {
      map.current.setStyle(
        newDarkMode 
          ? "mapbox://styles/mapbox/traffic-night-v2" 
          : "mapbox://styles/mapbox/traffic-day-v2"
      );
    }
  };

  // map interaction buttons
  const handleLocationClick = () => {
    if (map.current && userCoords) {
      map.current.flyTo({
        center: [userCoords.longitude, userCoords.latitude],
        zoom: 14,
      });
    }
  };

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const getCarIcon = (moving) => (moving ? greenCar : redCar);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("locationUpdate", ({ vehicleId, coords }) => {
      setDrivers((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((d) => d.vehicleId === vehicleId);
        const newData = {
          vehicleId,
          latitude: coords.lat,
          longitude: coords.lng,
        };
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
          const userLonLat = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setUserCoords({ latitude: userLonLat[1], longitude: userLonLat[0] });

          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: darkMode 
              ? "mapbox://styles/mapbox/traffic-night-v2" 
              : "mapbox://styles/mapbox/traffic-day-v2",
            center: userLonLat,
            zoom: 14,
          });

          userMarker.current = new mapboxgl.Marker({ color: "blue" })
            .setLngLat(userLonLat)
            .setPopup(new mapboxgl.Popup().setText("You are here"))
            .addTo(map.current);
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Failed to get your location. Using default center.");
          const fallback = [90.4125, 23.8103];
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: darkMode 
              ? "mapbox://styles/mapbox/dark-v10" 
              : "mapbox://styles/mapbox/streets-v11",
            center: fallback,
            zoom: 12,
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  }, [darkMode]);

  useEffect(() => {
    if (!map.current || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude];
        setUserCoords({ latitude: coords[1], longitude: coords[0] });

        if (userMarker.current) {
          userMarker.current.setLngLat(coords);
        } else {
          userMarker.current = new mapboxgl.Marker({ color: "blue" })
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup().setText("You are here"))
            .addTo(map.current);
        }
      },
      (err) => console.error("Geolocation error:", err),
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

      const el = document.createElement("img");
      el.src = getCarIcon(isMoving);
      el.style.width = "30px";
      el.style.height = "20px";

      if (driverMarkers.current[vehicleId]) {
        driverMarkers.current[vehicleId].setLngLat([offsetLng, offsetLat]);
        driverMarkers.current[vehicleId].getElement().src =
          getCarIcon(isMoving);
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
    <div className="bg-gray-50 min-h-screen relative overflow-hidden">
      <div ref={mapContainer} className="w-full h-screen z-10" />

      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 z-20 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
      >
        {isSidebarOpen ? <LucideX className="w-6 h-6" /> : <LucideMenu className="w-6 h-6" />}
      </button>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-16 right-4 z-20 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
      >
        {darkMode ? <LucideSun className="w-6 h-6" /> : <LucideMoon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Demo Sidebar</h2>
          <p className="mb-4">This is a demo sidebar content.</p>
          <p className="mb-4">You can put any content here like:</p>
          <ul className="list-disc pl-5">
            <li>Navigation links</li>
            <li>Settings</li>
            <li>User profile</li>
            <li>App information</li>
          </ul>
          <button
            onClick={toggleSidebar}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "8px",
          maxHeight: "40vh",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "13px",
          zIndex: 10,
          marginLeft:  "-280px",
        }}
      >
        <div>
          <strong>🧍 You:</strong>
        </div>
        {userCoords ? (
          <div>
            Lat: {userCoords.latitude.toFixed(5)} <br />
            Lng: {userCoords.longitude.toFixed(5)}
          </div>
        ) : (
          <div>Waiting for location...</div>
        )}
        <hr />
        <div>
          <strong>🚗 Drivers:</strong>
        </div>
        {drivers.map((d) => (
          <div key={d.vehicleId} style={{ marginBottom: "5px" }}>
            <strong>{d.vehicleId}</strong>
            <br />
            Lat: {d.latitude.toFixed(5)}
            <br />
            Lng: {d.longitude.toFixed(5)}
          </div>
        ))}
      </div>

      <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={handleZoomIn}
          className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
        >
          <LucidePlus className="w-6 h-6" />
        </button>

        <button
          onClick={handleZoomOut}
          className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
        >
          <LucideMinus className="w-6 h-6" />
        </button>

        <button
          onClick={handleLocationClick}
          className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
        >
          <LucideLocate className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-30">
        <NavigationFooter />
      </div>
    </div>
  );
};

export default Home;















// import React, { useEffect, useRef, useState } from "react";
// import greenCar from "../assets/green-car.png";
// import redCar from "../assets/red-car.png";
// import { NavigationFooter } from "../components/NavigationFooter";
// import mapboxgl from "mapbox-gl"; // Regular import
// import io from "socket.io-client";
// import "mapbox-gl/dist/mapbox-gl.css";

// import { LucideLocate, LucidePlus, LucideMinus } from "lucide-react";

// // Set Mapbox access token
// mapboxgl.accessToken =
//   "pk.eyJ1IjoiaWFtLXJhanVhbiIsImEiOiJjbTlvNWppdHgwcXFuMmpzMzhjeTJ2cm9hIn0.UXhzpO23v4aouhc4w-kTeA";

// // Fix for worker in Vite
// if (!window.workerUrlSet) {
//   window.workerUrlSet = true;
//   const workerUrl = URL.createObjectURL(
//     new Blob(
//       [
//         `importScripts("https://unpkg.com/mapbox-gl@${mapboxgl.version}/dist/mapbox-gl-csp-worker.js");`,
//       ],
//       { type: "application/javascript" }
//     )
//   );
//   mapboxgl.workerUrl = workerUrl;
// }

// const Home = () => {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const userMarker = useRef(null);
//   const driverMarkers = useRef({});
//   const lastDriverPositions = useRef({});
//   const [drivers, setDrivers] = useState([]);
//   const [userCoords, setUserCoords] = useState(null);
//   const socket = useRef(null);

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//   setIsSidebarOpen(!isSidebarOpen);
// };

//   // map interaction buttons
//   const handleLocationClick = () => {
//     if (map.current && userCoords) {
//       map.current.flyTo({
//         center: [userCoords.longitude, userCoords.latitude],
//         zoom: 14,
//       });
//     }
//   };

//   const handleZoomIn = () => {
//     if (map.current) {
//       map.current.zoomIn();
//     }
//   };

//   const handleZoomOut = () => {
//     if (map.current) {
//       map.current.zoomOut();
//     }
//   };

//   const getCarIcon = (moving) => (moving ? greenCar : redCar);
//   // moving ? '/icons/green-car.png' : '/icons/red-car.png';

//   useEffect(() => {
//     socket.current = io("http://localhost:5000");

//     socket.current.on("locationUpdate", ({ vehicleId, coords }) => {
//       setDrivers((prev) => {
//         const updated = [...prev];
//         const index = updated.findIndex((d) => d.vehicleId === vehicleId);
//         const newData = {
//           vehicleId,
//           latitude: coords.lat,
//           longitude: coords.lng,
//         };
//         if (index !== -1) updated[index] = newData;
//         else updated.push(newData);
//         return updated;
//       });
//     });

//     return () => socket.current.disconnect();
//   }, []);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const userLonLat = [
//             position.coords.longitude,
//             position.coords.latitude,
//           ];
//           setUserCoords({ latitude: userLonLat[1], longitude: userLonLat[0] });

//           map.current = new mapboxgl.Map({
//             container: mapContainer.current,
//             style: "mapbox://styles/mapbox/traffic-day-v2",
//             // style: "mapbox://styles/mapbox/dark-v11",
//             // style: "mapbox://styles/mapbox/streets-v11",
//             center: userLonLat,
//             zoom: 14,
//           });

//           userMarker.current = new mapboxgl.Marker({ color: "blue" })
//             .setLngLat(userLonLat)
//             .setPopup(new mapboxgl.Popup().setText("You are here"))
//             .addTo(map.current);
//         },
//         (err) => {
//           console.error("Geolocation error:", err);
//           alert("Failed to get your location. Using default center.");
//           const fallback = [90.4125, 23.8103];
//           map.current = new mapboxgl.Map({
//             container: mapContainer.current,
//             style: "mapbox://styles/mapbox/streets-v11",
//             center: fallback,
//             zoom: 12,
//           });
//         },
//         { enableHighAccuracy: true }
//       );
//     } else {
//       alert("Geolocation not supported by this browser.");
//     }
//   }, []);

//   useEffect(() => {
//     if (!map.current || !navigator.geolocation) return;

//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const coords = [position.coords.longitude, position.coords.latitude];
//         setUserCoords({ latitude: coords[1], longitude: coords[0] });

//         if (userMarker.current) {
//           userMarker.current.setLngLat(coords);
//         } else {
//           userMarker.current = new mapboxgl.Marker({ color: "blue" })
//             .setLngLat(coords)
//             .setPopup(new mapboxgl.Popup().setText("You are here"))
//             .addTo(map.current);
//         }
//       },
//       (err) => console.error("Geolocation error:", err),
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   useEffect(() => {
//     if (!map.current || !userCoords) return;

//     const seenCoords = new Set();

//     drivers.forEach((driver, index) => {
//       let { vehicleId, latitude, longitude } = driver;

//       const baseKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
//       let offsetLat = latitude;
//       let offsetLng = longitude;

//       const angle = (index * 45) % 360;
//       const radians = angle * (Math.PI / 180);
//       const radius = 0.0002;

//       offsetLat += radius * Math.cos(radians);
//       offsetLng += radius * Math.sin(radians);

//       const userLat = userCoords.latitude;
//       const userLng = userCoords.longitude;
//       const tooCloseToUser =
//         Math.abs(latitude - userLat) < 0.0001 &&
//         Math.abs(longitude - userLng) < 0.0001;

//       if (tooCloseToUser) {
//         offsetLat += 0.00015;
//         offsetLng += 0.00015;
//       }

//       let finalKey = `${offsetLat.toFixed(5)},${offsetLng.toFixed(5)}`;
//       let iteration = 1;
//       while (seenCoords.has(finalKey)) {
//         offsetLat += 0.0001;
//         offsetLng += 0.0001;
//         finalKey = `${offsetLat.toFixed(5)},${offsetLng.toFixed(5)}`;
//         iteration++;
//         if (iteration > 10) break;
//       }
//       seenCoords.add(finalKey);

//       const prev = lastDriverPositions.current[vehicleId];
//       const isMoving = prev
//         ? prev.latitude !== latitude || prev.longitude !== longitude
//         : false;

//       lastDriverPositions.current[vehicleId] = { latitude, longitude };

//       const el = document.createElement("img");
//       el.src = getCarIcon(isMoving);
//       el.style.width = "30px";
//       el.style.height = "20px";

//       if (driverMarkers.current[vehicleId]) {
//         driverMarkers.current[vehicleId].setLngLat([offsetLng, offsetLat]);
//         driverMarkers.current[vehicleId].getElement().src =
//           getCarIcon(isMoving);
//       } else {
//         const marker = new mapboxgl.Marker(el)
//           .setLngLat([offsetLng, offsetLat])
//           .setPopup(new mapboxgl.Popup().setText(`Vehicle ID: ${vehicleId}`))
//           .addTo(map.current);
//         driverMarkers.current[vehicleId] = marker;
//       }
//     });
//   }, [drivers, userCoords]);

//   return (
//     <div className="bg-gray-50 min-h-screen relative overflow-hidden">
//       <div ref={mapContainer} className="w-full h-screen z-10" />

//       <div
//         style={{
//           position: "absolute",
//           top: 10,
//           left: 10,
//           background: "rgba(255, 255, 255, 0.9)",
//           padding: "10px",
//           borderRadius: "8px",
//           maxHeight: "40vh",
//           overflowY: "auto",
//           fontFamily: "monospace",
//           fontSize: "13px",
//           zIndex: 1000,
//         }}
//       >
//         <div>
//           <strong>🧍 You:</strong>
//         </div>
//         {userCoords ? (
//           <div>
//             Lat: {userCoords.latitude.toFixed(5)} <br />
//             Lng: {userCoords.longitude.toFixed(5)}
//           </div>
//         ) : (
//           <div>Waiting for location...</div>
//         )}
//         <hr />
//         <div>
//           <strong>🚗 Drivers:</strong>
//         </div>
//         {drivers.map((d) => (
//           <div key={d.vehicleId} style={{ marginBottom: "5px" }}>
//             <strong>{d.vehicleId}</strong>
//             <br />
//             Lat: {d.latitude.toFixed(5)}
//             <br />
//             Lng: {d.longitude.toFixed(5)}
//           </div>
//         ))}
//       </div>

//       <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-20">
//         <button
//           onClick={handleZoomIn}
//           className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
//         >
//           <LucidePlus className="w-6 h-6" />
//         </button>

//         <button
//           onClick={handleZoomOut}
//           className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
//         >
//           <LucideMinus className="w-6 h-6" />
//         </button>

//         <button
//           onClick={handleLocationClick}
//           className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
//         >
//           <LucideLocate className="w-6 h-6" />
//         </button>
//       </div>

//       <div className="absolute bottom-0 left-0 w-full z-30">
//         <NavigationFooter />
//       </div>
//     </div>
//   );
// };

// export default Home;






// previous raw code
// <div
//   style={{
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     background: 'rgba(255, 255, 255, 0.9)',
//     padding: '10px',
//     borderRadius: '8px',
//     maxHeight: '40vh',
//     overflowY: 'auto',
//     fontFamily: 'monospace',
//     fontSize: '13px',
//     zIndex: 1000,
//   }}
// >
//   <div><strong>🧍 You:</strong></div>
//   {userCoords ? (
//     <div>
//       Lat: {userCoords.latitude.toFixed(5)} <br />
//       Lng: {userCoords.longitude.toFixed(5)}
//     </div>
//   ) : (
//     <div>Waiting for location...</div>
//   )}
//   <hr />
//   <div><strong>🚗 Drivers:</strong></div>
//   {drivers.map((d) => (
//     <div key={d.vehicleId} style={{ marginBottom: '5px' }}>
//       <strong>{d.vehicleId}</strong><br />
//       Lat: {d.latitude.toFixed(5)}<br />
//       Lng: {d.longitude.toFixed(5)}
//     </div>
//   ))}
// </div>

//raw code

// import React, { useEffect, useRef, useState } from 'react';
// import greenCar from '../assets/green-car.png';
// import redCar from '../assets/red-car.png';
// import { NavigationFooter } from "../components/NavigationFooter";
// import mapboxgl from 'mapbox-gl'; // Regular import
// import io from 'socket.io-client';
// import 'mapbox-gl/dist/mapbox-gl.css';

// // Set Mapbox access token
// mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtLXJhanVhbiIsImEiOiJjbTlvNWppdHgwcXFuMmpzMzhjeTJ2cm9hIn0.UXhzpO23v4aouhc4w-kTeA';

// // Fix for worker in Vite
// if (!window.workerUrlSet) {
//   window.workerUrlSet = true;
//   const workerUrl = URL.createObjectURL(new Blob(
//     [`importScripts("https://unpkg.com/mapbox-gl@${mapboxgl.version}/dist/mapbox-gl-csp-worker.js");`],
//     { type: 'application/javascript' }
//   ));
//   mapboxgl.workerUrl = workerUrl;
// }
// const Home = () => {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const userMarker = useRef(null);
//   const driverMarkers = useRef({});
//   const lastDriverPositions = useRef({});
//   const [drivers, setDrivers] = useState([]);
//   const [userCoords, setUserCoords] = useState(null);
//   const socket = useRef(null);

//   const getCarIcon = (moving) =>
//     moving ? greenCar : redCar;
//     // moving ? '/icons/green-car.png' : '/icons/red-car.png';

//   useEffect(() => {
//     socket.current = io('http://localhost:5000');

//     socket.current.on('locationUpdate', ({ vehicleId, coords }) => {
//       setDrivers((prev) => {
//         const updated = [...prev];
//         const index = updated.findIndex((d) => d.vehicleId === vehicleId);
//         const newData = { vehicleId, latitude: coords.lat, longitude: coords.lng };
//         if (index !== -1) updated[index] = newData;
//         else updated.push(newData);
//         return updated;
//       });
//     });

//     return () => socket.current.disconnect();
//   }, []);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const userLonLat = [position.coords.longitude, position.coords.latitude];
//           setUserCoords({ latitude: userLonLat[1], longitude: userLonLat[0] });

//           map.current = new mapboxgl.Map({
//             container: mapContainer.current,
//             style: 'mapbox://styles/mapbox/streets-v11',
//             center: userLonLat,
//             zoom: 14,
//           });

//           userMarker.current = new mapboxgl.Marker({ color: 'blue' })
//             .setLngLat(userLonLat)
//             .setPopup(new mapboxgl.Popup().setText('You are here'))
//             .addTo(map.current);
//         },
//         (err) => {
//           console.error('Geolocation error:', err);
//           alert('Failed to get your location. Using default center.');
//           const fallback = [90.4125, 23.8103];
//           map.current = new mapboxgl.Map({
//             container: mapContainer.current,
//             style: 'mapbox://styles/mapbox/streets-v11',
//             center: fallback,
//             zoom: 12,
//           });
//         },
//         { enableHighAccuracy: true }
//       );
//     } else {
//       alert('Geolocation not supported by this browser.');
//     }
//   }, []);

//   useEffect(() => {
//     if (!map.current || !navigator.geolocation) return;

//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const coords = [position.coords.longitude, position.coords.latitude];
//         setUserCoords({ latitude: coords[1], longitude: coords[0] });

//         if (userMarker.current) {
//           userMarker.current.setLngLat(coords);
//         } else {
//           userMarker.current = new mapboxgl.Marker({ color: 'blue' })
//             .setLngLat(coords)
//             .setPopup(new mapboxgl.Popup().setText('You are here'))
//             .addTo(map.current);
//         }
//       },
//       (err) => console.error('Geolocation error:', err),
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   useEffect(() => {
//     if (!map.current || !userCoords) return;

//     const seenCoords = new Set();

//     drivers.forEach((driver, index) => {
//       let { vehicleId, latitude, longitude } = driver;

//       const baseKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
//       let offsetLat = latitude;
//       let offsetLng = longitude;

//       const angle = (index * 45) % 360;
//       const radians = angle * (Math.PI / 180);
//       const radius = 0.0002;

//       offsetLat += radius * Math.cos(radians);
//       offsetLng += radius * Math.sin(radians);

//       const userLat = userCoords.latitude;
//       const userLng = userCoords.longitude;
//       const tooCloseToUser =
//         Math.abs(latitude - userLat) < 0.0001 &&
//         Math.abs(longitude - userLng) < 0.0001;

//       if (tooCloseToUser) {
//         offsetLat += 0.00015;
//         offsetLng += 0.00015;
//       }

//       let finalKey = `${offsetLat.toFixed(5)},${offsetLng.toFixed(5)}`;
//       let iteration = 1;
//       while (seenCoords.has(finalKey)) {
//         offsetLat += 0.0001;
//         offsetLng += 0.0001;
//         finalKey = `${offsetLat.toFixed(5)},${offsetLng.toFixed(5)}`;
//         iteration++;
//         if (iteration > 10) break;
//       }
//       seenCoords.add(finalKey);

//       const prev = lastDriverPositions.current[vehicleId];
//       const isMoving = prev
//         ? prev.latitude !== latitude || prev.longitude !== longitude
//         : false;

//       lastDriverPositions.current[vehicleId] = { latitude, longitude };

//       const el = document.createElement('img');
//       el.src = getCarIcon(isMoving);
//       el.style.width = '30px';
//       el.style.height = '20px';

//       if (driverMarkers.current[vehicleId]) {
//         driverMarkers.current[vehicleId].setLngLat([offsetLng, offsetLat]);
//         driverMarkers.current[vehicleId].getElement().src = getCarIcon(isMoving);
//       } else {
//         const marker = new mapboxgl.Marker(el)
//           .setLngLat([offsetLng, offsetLat])
//           .setPopup(new mapboxgl.Popup().setText(`Vehicle ID: ${vehicleId}`))
//           .addTo(map.current);
//         driverMarkers.current[vehicleId] = marker;
//       }
//     });
//   }, [drivers, userCoords]);

//   return (
//     <div className="bg-gray-50 min-h-screen pb-16">
//       <h1 className="p-6 text-2xl font-bold">Home Page</h1>
//       {/* <p className="px-6">Your home content goes here</p> */}

//       {/* Map Container */}
//       <div style={{ position: 'relative', height: '70vh', margin: '16px', borderRadius: '8px', overflow: 'hidden' }}>
//         <div
//           style={{
//             position: 'absolute',
//             top: 10,
//             left: 10,
//             background: 'rgba(255, 255, 255, 0.9)',
//             padding: '10px',
//             borderRadius: '8px',
//             maxHeight: '40vh',
//             overflowY: 'auto',
//             fontFamily: 'monospace',
//             fontSize: '13px',
//             zIndex: 1000,
//           }}
//         >
//           <div><strong>🧍 You:</strong></div>
//           {userCoords ? (
//             <div>
//               Lat: {userCoords.latitude.toFixed(5)} <br />
//               Lng: {userCoords.longitude.toFixed(5)}
//             </div>
//           ) : (
//             <div>Waiting for location...</div>
//           )}
//           <hr />
//           <div><strong>🚗 Drivers:</strong></div>
//           {drivers.map((d) => (
//             <div key={d.vehicleId} style={{ marginBottom: '5px' }}>
//               <strong>{d.vehicleId}</strong><br />
//               Lat: {d.latitude.toFixed(5)}<br />
//               Lng: {d.longitude.toFixed(5)}
//             </div>
//           ))}
//         </div>

//         <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
//       </div>

//       <NavigationFooter />
//     </div>
//   );
// };

// export default Home;
