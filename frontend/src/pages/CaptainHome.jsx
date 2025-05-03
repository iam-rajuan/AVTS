import React, { useEffect, useRef, useState } from 'react';
import { NavigationFooter } from "../components/NavigationFooter";
import mapboxgl from 'mapbox-gl';
import io from 'socket.io-client';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtLXJhanVhbiIsImEiOiJjbTlvNWppdHgwcXFuMmpzMzhjeTJ2cm9hIn0.UXhzpO23v4aouhc4w-kTeA';

const CaptainHome = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [locationError, setLocationError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const driverMarkers = useRef({});
  const socket = useRef(null);
  const watchId = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [90.4125, 23.8103], // Default center
      zoom: 12
    });

    // Initialize socket connection
    socket.current = io('http://localhost:5000');

    // Listen for other drivers' location updates
    // socket.current.on('locationUpdate', ({ vehicleId, coords }) => {
    //   if (vehicleId === vehicleId) return; // Skip own updates
    socket.current.on('locationUpdate', ({ vehicleId: incomingId, coords }) => {
      if (incomingId === vehicleId) return; // Skip own updates
    

      const coordsArr = [coords.lng, coords.lat];
      
      if (driverMarkers.current[vehicleId]) {
        driverMarkers.current[vehicleId].setLngLat(coordsArr);
      } else {
        const marker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat(coordsArr)
          .setPopup(new mapboxgl.Popup().setText(`Driver: ${vehicleId}`))
          .addTo(map.current);
        driverMarkers.current[vehicleId] = marker;
      }
    });

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      if (map.current) map.current.remove();
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  const startSharing = () => {
    if (!vehicleId.trim()) {
      setLocationError('Please enter a vehicle ID');
      return;
    }

    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsSharing(true);
    setLocationError(null);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.current.emit('locationUpdate', {
          vehicleId: vehicleId,
          coords: { lat: latitude, lng: longitude }
        });

        // Update captain's marker (blue)
        const coords = [longitude, latitude];
        if (!userMarker.current) {
          userMarker.current = new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup().setText(`You (${vehicleId})`))
            .addTo(map.current);
          map.current.flyTo({ center: coords, zoom: 14 });
        } else {
          userMarker.current.setLngLat(coords);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocationError('Enable location access to share location');
      },
      { enableHighAccuracy: true }
    );
  };

  const stopSharing = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsSharing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header Section */}
      <header className="pt-12 px-6">
        <div className="flex items-center justify-between">
          <button className="space-y-1 w-6 focus:outline-none">
            <div className="h-0.5 bg-black w-full"></div>
            <div className="h-0.5 bg-black w-full"></div>
            <div className="h-0.5 bg-black w-3/4"></div>
          </button>
          
          <h1 className="text-xl font-medium">Welcome, <span className="font-bold">Captain</span>!</h1>
          
          <button className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"></button>
        </div>
        
        {/* Current Location */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">Your current locations</p>
          <div className="flex items-center mt-1">
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
            <span className="font-bold">Kuril, Dhaka</span>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4 mx-6"></div>

      {/* Main Content */}
      <main className="px-6">
        {/* Vehicle ID Input and Sharing Controls */}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              placeholder="Enter your vehicle ID"
              className="flex-1 p-2 border rounded"
              disabled={isSharing}
            />
            {!isSharing ? (
              <button 
                onClick={startSharing}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Start Sharing
              </button>
            ) : (
              <button 
                onClick={stopSharing}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Stop Sharing
              </button>
            )}
          </div>
          {locationError && (
            <p className="text-red-500 text-sm">{locationError}</p>
          )}
        </div>

        {/* Map Container */}
        <div 
          ref={mapContainer}
          className="mt-6 rounded-lg shadow-md"
          style={{ height: '50vh' }}
        />

        {/* Search Section */}
        <div className="mt-6 flex">
          <div className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
          </div>
          <input 
            type="text" 
            placeholder="Where do you wanna go?"
            className="flex-1 h-10 bg-gray-100 rounded-r-lg px-3 text-sm focus:outline-none"
            aria-label="Destination search input"
          />
        </div>

        {/* Saved Places Section */}
        <div className="mt-6">
          <div 
            className="flex items-center justify-between py-3 border-b border-gray-200"
            role="button" 
            tabIndex={0}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
              </div>
              <span className="font-medium">Choose a saved place</span>
            </div>
            <div className="w-2 h-3 bg-gray-400"></div>
          </div>
          
          <div 
            className="flex items-center justify-between py-3"
            role="button" 
            tabIndex={0}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
              </div>
              <span className="font-medium">Vehicle Capacity Feedback</span>
            </div>
            <div className="w-2 h-3 bg-gray-400"></div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <NavigationFooter />
    </div>
  );
}

export default CaptainHome;































// import React, { useEffect, useRef, useState } from 'react';
// import { NavigationFooter } from "../components/NavigationFooter";
// import mapboxgl from 'mapbox-gl';
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

// const CaptainHome = () => {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const userMarker = useRef(null);
//   const driverMarkers = useRef({});
//   const [socketError, setSocketError] = useState(null);
//   const [userCoords, setUserCoords] = useState(null);
//   const socket = useRef(null);

//   useEffect(() => {
//     // Initialize socket connection
//     socket.current = io('http://localhost:4000', {
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     socket.current.on('connect_error', (err) => {
//       setSocketError('Connection to real-time server failed');
//       console.error('Socket connection error:', err);
//     });

//     socket.current.on('connect', () => {
//       setSocketError(null);
//       console.log('Connected to Socket.IO server');
//     });

//     // Handle location updates from drivers
//     socket.current.on('locationUpdate', ({ vehicleId, coords }) => {
//       if (!map.current) return;
      
//       const coordsArr = [coords.lng, coords.lat];
      
//       if (driverMarkers.current[vehicleId]) {
//         driverMarkers.current[vehicleId].setLngLat(coordsArr);
//       } else {
//         const marker = new mapboxgl.Marker({ color: 'red' })
//           .setLngLat(coordsArr)
//           .setPopup(new mapboxgl.Popup().setText(`Vehicle: ${vehicleId}`))
//           .addTo(map.current);
//         driverMarkers.current[vehicleId] = marker;
//       }
//     });

//     return () => {
//       if (socket.current) socket.current.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!mapContainer.current) return;

//     // Initialize map
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/streets-v11',
//       center: [90.4125, 23.8103], // Default to Dhaka coordinates
//       zoom: 12
//     });

//     // Get user location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const userLonLat = [position.coords.longitude, position.coords.latitude];
//           setUserCoords({ latitude: userLonLat[1], longitude: userLonLat[0] });

//           // Add user marker (blue)
//           userMarker.current = new mapboxgl.Marker({ color: 'blue' })
//             .setLngLat(userLonLat)
//             .setPopup(new mapboxgl.Popup().setText('Your location'))
//             .addTo(map.current);

//           // Center map on user
//           map.current.flyTo({
//             center: userLonLat,
//             zoom: 14
//           });
//         },
//         (err) => {
//           console.error('Geolocation error:', err);
//         },
//         { enableHighAccuracy: true }
//       );
//     }

//     return () => {
//       if (map.current) map.current.remove();
//     };
//   }, []);

//   return (
//     <div className="bg-gray-50 min-h-screen pb-16">
//       {/* Header Section */}
//       <header className="pt-12 px-6">
//         <div className="flex items-center justify-between">
//           <button className="space-y-1 w-6 focus:outline-none">
//             <div className="h-0.5 bg-black w-full"></div>
//             <div className="h-0.5 bg-black w-full"></div>
//             <div className="h-0.5 bg-black w-3/4"></div>
//           </button>
          
//           <h1 className="text-xl font-medium">Welcome, <span className="font-bold">Rajuan</span>!</h1>
          
//           <button className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"></button>
//         </div>
        
//         {/* Current Location */}
//         <div className="mt-6">
//           <p className="text-sm text-gray-500">Your current locations</p>
//           <div className="flex items-center mt-1">
//             <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
//             <span className="font-bold">Kuril, Dhaka</span>
//           </div>
//         </div>
//       </header>

//       {/* Divider */}
//       <div className="border-t border-gray-200 my-4 mx-6"></div>

//       {/* Main Content */}
//       <main className="px-6">
//         {/* Map Container */}
//         {socketError && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
//             {socketError}
//           </div>
//         )}
        
//         <div 
//           ref={mapContainer}
//           className="mt-6 h-48 rounded-lg"
//           style={{ height: '60vh' }}
//           aria-label="Interactive map"
//         />
        
//         {/* Search Section */}
//         <div className="mt-6 flex">
//           <div className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center">
//             <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
//           </div>
//           <input 
//             type="text" 
//             placeholder="Where do you wanna go?"
//             className="flex-1 h-10 bg-gray-100 rounded-r-lg px-3 text-sm focus:outline-none"
//             aria-label="Destination search input"
//           />
//         </div>

//         {/* Saved Places Section */}
//         <div className="mt-6">
//           <div 
//             className="flex items-center justify-between py-3 border-b border-gray-200"
//             role="button" 
//             tabIndex={0}
//           >
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                 <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
//               </div>
//               <span className="font-medium">Choose a saved place</span>
//             </div>
//             <div className="w-2 h-3 bg-gray-400"></div>
//           </div>
          
//           <div 
//             className="flex items-center justify-between py-3"
//             role="button" 
//             tabIndex={0}
//           >
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                 <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
//               </div>
//               <span className="font-medium">Vehicle Capacity Feedback</span>
//             </div>
//             <div className="w-2 h-3 bg-gray-400"></div>
//           </div>
//         </div>
//       </main>

//       {/* Footer Navigation */}
//       <NavigationFooter />
//     </div>
//   );
// }

// export default CaptainHome;
















// import React from 'react'
// import { NavigationFooter } from "../components/NavigationFooter";


// const CaptainHome = () => {
//     return (
//       <div className="bg-gray-50 min-h-screen pb-16">
//         {/* Header Section */}
//         <header className="pt-12 px-6">
//           <div className="flex items-center justify-between">
//             {/* Hamburger Menu - Consider making this a button for accessibility */}
//             <button className="space-y-1 w-6 focus:outline-none">
//               <div className="h-0.5 bg-black w-full"></div>
//               <div className="h-0.5 bg-black w-full"></div>
//               <div className="h-0.5 bg-black w-3/4"></div>
//             </button>
            
//             {/* Welcome Text */}
//             <h1 className="text-xl font-medium">Welcome, <span className="font-bold">Rajuan</span>!</h1>
            
//             {/* User Avatar - Add onClick handler if needed */}
//             <button className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"></button>
//           </div>
          
//           {/* Current Location */}
//           <div className="mt-6">
//             <p className="text-sm text-gray-500">Your current locations</p>
//             <div className="flex items-center mt-1">
//               <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
//               <span className="font-bold">Kuril, Dhaka</span>
//             </div>
//           </div>
//         </header>

//         {/* Divider */}
//         <div className="border-t border-gray-200 my-4 mx-6"></div>

//         {/* Main Content */}
//         <main className="px-6">
//           {/* Map Placeholder - Add aria-label for accessibility */}
//           <div 
//             className="mt-6 h-48 bg-gray-200 rounded-lg"
//             aria-label="Map placeholder"
//           >    Load the Map here   </div>

//           {/* Search Section */}
//           <div className="mt-6 flex">
//             <div className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center">
//               {/* Search icon placeholder */}
//               <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
//             </div>
//             <input 
//               type="text" 
//               placeholder="Where do you wanna go?"
//               className="flex-1 h-10 bg-gray-100 rounded-r-lg px-3 text-sm focus:outline-none"
//               aria-label="Destination search input"
//             />
//           </div>

//           {/* Saved Places Section */}
//           <div className="mt-6">
//             <div 
//               className="flex items-center justify-between py-3 border-b border-gray-200"
//               role="button" 
//               tabIndex={0}
//             >
//               <div className="flex items-center">
//                 <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                   <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
//                 </div>
//                 <span className="font-medium">Choose a saved place</span>
//               </div>
//               <div className="w-2 h-3 bg-gray-400"></div>
//             </div>
            
//             <div 
//               className="flex items-center justify-between py-3"
//               role="button" 
//               tabIndex={0}
//             >
//               <div className="flex items-center">
//                 <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                   <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
//                 </div>
//                 <span className="font-medium">Vehicle Capacity Feedback</span>
//               </div>
//               <div className="w-2 h-3 bg-gray-400"></div>
//             </div>
//           </div>
//         </main>

//         {/* Footer Navigation */}
//         <NavigationFooter />
//       </div>
//     );
// }

// export default CaptainHome





// import React, { useRef, useState } from 'react'
// import { Link } from 'react-router-dom'
// import CaptainDetails from '../components/CaptainDetails'
// import RidePopUp from '../components/RidePopUp'
// import { useGSAP } from '@gsap/react'
// import gsap from 'gsap'
// import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
// import { useEffect, useContext } from 'react'
// import { SocketContext } from '../context/SocketContext'
// import { CaptainDataContext } from '../context/CapatainContext'
// import axios from 'axios'

// const CaptainHome = () => {

//     const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
//     const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

//     const ridePopupPanelRef = useRef(null)
//     const confirmRidePopupPanelRef = useRef(null)
//     const [ ride, setRide ] = useState(null)

//     const { socket } = useContext(SocketContext)
//     const { captain } = useContext(CaptainDataContext)

//     useEffect(() => {
//         socket.emit('join', {
//             userId: captain._id,
//             userType: 'captain'
//         })
//         const updateLocation = () => {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(position => {

//                     socket.emit('update-location-captain', {
//                         userId: captain._id,
//                         location: {
//                             ltd: position.coords.latitude,
//                             lng: position.coords.longitude
//                         }
//                     })
//                 })
//             }
//         }

//         const locationInterval = setInterval(updateLocation, 10000)
//         updateLocation()

//         // return () => clearInterval(locationInterval)
//     }, [])

//     socket.on('new-ride', (data) => {

//         setRide(data)
//         setRidePopupPanel(true)

//     })

//     async function confirmRide() {

//         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

//             rideId: ride._id,
//             captainId: captain._id,


//         }, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         })

//         setRidePopupPanel(false)
//         setConfirmRidePopupPanel(true)

//     }


//     useGSAP(function () {
//         if (ridePopupPanel) {
//             gsap.to(ridePopupPanelRef.current, {
//                 transform: 'translateY(0)'
//             })
//         } else {
//             gsap.to(ridePopupPanelRef.current, {
//                 transform: 'translateY(100%)'
//             })
//         }
//     }, [ ridePopupPanel ])

//     useGSAP(function () {
//         if (confirmRidePopupPanel) {
//             gsap.to(confirmRidePopupPanelRef.current, {
//                 transform: 'translateY(0)'
//             })
//         } else {
//             gsap.to(confirmRidePopupPanelRef.current, {
//                 transform: 'translateY(100%)'
//             })
//         }
//     }, [ confirmRidePopupPanel ])

//     return (
//         <div className='h-screen'>
//             <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
//                 <img className='w-16' src="../assets/AVTS-R-BG.png" alt="" />
//                 {/* <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" /> */}
//                 <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
//                     <i className="text-lg font-medium ri-logout-box-r-line"></i>
//                 </Link>
//             </div>
//             <div className='h-3/5'>
//                 <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />

//             </div>
//             <div className='h-2/5 p-6'>
//                 <CaptainDetails />
//             </div>
//             <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
//                 <RidePopUp
//                     ride={ride}
//                     setRidePopupPanel={setRidePopupPanel}
//                     setConfirmRidePopupPanel={setConfirmRidePopupPanel}
//                     confirmRide={confirmRide}
//                 />
//             </div>
//             <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
//                 <ConfirmRidePopUp
//                     ride={ride}
//                     setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
//             </div>
//         </div>
//     )
// }

// export default CaptainHome