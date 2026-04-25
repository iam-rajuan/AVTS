import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Moon, Sun } from "lucide-react";
import { NavigationFooter } from "../components/NavigationFooter";
import HamburgerMenu from "../components/HamburgerMenu";
import ZoomInOut from "../components/ZoomInOut";
import DriverDetailsBottomSheet from "../components/DriverDetailsBottomSheet";
import { SocketContext } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API || "";

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
  const { session } = useAuth();
  const { socket } = useContext(SocketContext);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const captainMarkers = useRef({});

  const [captains, setCaptains] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem("darkMode", JSON.stringify(nextMode));
  };

  useEffect(() => {
    if (!session.token) {
      return;
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/available`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }).then((response) => {
      setCaptains(response.data.data || []);
    }).catch((error) => {
      console.error("Failed to load captains", error);
    });
  }, [session.token]);

  useEffect(() => {
    const handleCaptainUpdate = (payload) => {
      setCaptains((previous) => {
        const next = [ ...previous ];
        const index = next.findIndex((item) => String(item.captainId) === String(payload.captainId));

        if (index >= 0) {
          next[ index ] = { ...next[ index ], ...payload };
        } else {
          next.push(payload);
        }

        return next;
      });
    };

    socket.on("captain:updated", handleCaptainUpdate);

    return () => {
      socket.off("captain:updated", handleCaptainUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setUserCoords(coords);

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: darkMode ? "mapbox://styles/mapbox/traffic-night-v2" : "mapbox://styles/mapbox/traffic-day-v2",
          center: [ coords.longitude, coords.latitude ],
          zoom: 13,
        });

        userMarker.current = new mapboxgl.Marker({ color: "blue" })
          .setLngLat([ coords.longitude, coords.latitude ])
          .setPopup(new mapboxgl.Popup().setText("You are here"))
          .addTo(map.current);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [darkMode]);

  useEffect(() => {
    if (!navigator.geolocation || !map.current) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = [ position.coords.longitude, position.coords.latitude ];
        setUserCoords({ latitude: coords[1], longitude: coords[0] });

        if (userMarker.current) {
          userMarker.current.setLngLat(coords);
        }
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map.current]);

  useEffect(() => {
    if (!map.current) {
      return;
    }

    captains.forEach((captain) => {
      if (captain.latitude == null || captain.longitude == null) {
        return;
      }

      const popupText = `${captain.captainName || "Captain"} • ${captain.vehicle?.plate || captain.vehicleId}`;
      const existingMarker = captainMarkers.current[ captain.captainId ];

      if (existingMarker) {
        existingMarker.setLngLat([ captain.longitude, captain.latitude ]);
        return;
      }

      const marker = new mapboxgl.Marker({ color: captain.currentLoad === "full_load" ? "#ef4444" : "#10b981" })
        .setLngLat([ captain.longitude, captain.latitude ])
        .setPopup(new mapboxgl.Popup().setText(popupText))
        .addTo(map.current);

      marker.getElement().style.cursor = "pointer";
      marker.getElement().onclick = () => {
        if (!userCoords) {
          setSelectedCaptain(captain);
          return;
        }

        const distance = Math.sqrt(
          Math.pow(captain.latitude - userCoords.latitude, 2) +
          Math.pow(captain.longitude - userCoords.longitude, 2)
        ).toFixed(2);

        setSelectedCaptain({
          ...captain,
          distance: `${distance} km`,
          eta: `${Math.max(1, Math.round(Number(distance) * 50))} minutes`,
        });
      };

      captainMarkers.current[ captain.captainId ] = marker;
    });
  }, [captains, userCoords]);

  return (
    <div className="bg-gray-50 min-h-screen relative overflow-hidden">
      <div ref={mapContainer} className="w-full h-screen z-10" />

      <HamburgerMenu />

      <button
        onClick={toggleDarkMode}
        className="absolute top-16 right-4 z-20 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <ZoomInOut map={map.current} userCoords={userCoords} />

      <DriverDetailsBottomSheet
        driver={selectedCaptain}
        onClose={() => setSelectedCaptain(null)}
      />

      <div className="fixed bottom-0 left-0 w-full h-[60px] z-30">
        <NavigationFooter role="user" />
      </div>
    </div>
  );
};

export default Home;
