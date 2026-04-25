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

  const createVehicleMarkerElement = (captain) => {
    const markerElement = document.createElement("button");
    markerElement.type = "button";
    markerElement.className = "relative flex flex-col items-center justify-center";
    markerElement.title = `${captain.captainName || "Captain"} - ${captain.vehicle?.plate || captain.vehicleId}`;

    const vehicleType = captain.vehicle?.vehicleType;
    const icon = vehicleType === "motorcycle" ? "🏍️" : vehicleType === "auto" ? "🛺" : "🚗";
    const badgeColor = captain.currentLoad === "full_load" ? "#ef4444" : "#16a34a";

    markerElement.innerHTML = `
      <div
        style="
          width: 58px;
          height: 58px;
          border-radius: 9999px;
          background: ${badgeColor};
          border: 3px solid #ffffff;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          line-height: 1;
        "
      >
        ${icon}
      </div>
      <div
        style="
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 14px solid ${badgeColor};
          margin-top: -2px;
          filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.2));
        "
      ></div>
    `;

    return markerElement;
  };

  const createMarkerPopupText = (captain) => (
    `${captain.captainName || "Captain"} • ${captain.vehicle?.plate || captain.vehicleId}`
  );

  const getCaptainMarkerKey = (captain) => (
    captain.captainId != null ? String(captain.captainId) : String(captain.vehicleId || captain.vehicle?.plate)
  );

  const normalizeCaptainRecord = (captain) => {
    const vehicle = captain.vehicle || {};

    return {
      ...captain,
      captainName:
        captain.captainName ||
        [captain.fullname?.firstname, captain.fullname?.lastname].filter(Boolean).join(" ").trim() ||
        captain.fullname?.firstname ||
        "Unknown captain",
      vehicle: {
        plate: vehicle.plate || captain.vehicleId || "Unknown",
        color: vehicle.color || "",
        capacity: vehicle.capacity ?? null,
        vehicleType: vehicle.vehicleType || "",
      },
      currentLoad: captain.currentLoad || "no_load",
      customLoadLabel: captain.customLoadLabel || "",
    };
  };

  const addTravelDetails = (captain) => {
    if (!userCoords) {
      return captain;
    }

    const distance = Math.sqrt(
      Math.pow(captain.latitude - userCoords.latitude, 2) +
      Math.pow(captain.longitude - userCoords.longitude, 2)
    ).toFixed(2);

    return {
      ...captain,
      distance: `${distance} km`,
      eta: `${Math.max(1, Math.round(Number(distance) * 50))} minutes`,
    };
  };

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

    const activeCaptainIds = new Set(
      captains
        .map((captain) => getCaptainMarkerKey(normalizeCaptainRecord(captain)))
        .filter(Boolean)
    );

    Object.entries(captainMarkers.current).forEach(([ captainId, marker ]) => {
      if (!activeCaptainIds.has(captainId)) {
        marker.remove();
        delete captainMarkers.current[ captainId ];
      }
    });

    captains.forEach((captain) => {
      const normalizedCaptain = normalizeCaptainRecord(captain);

      if (normalizedCaptain.latitude == null || normalizedCaptain.longitude == null) {
        return;
      }

      const markerKey = getCaptainMarkerKey(normalizedCaptain);
      const popupText = `${normalizedCaptain.captainName} • ${normalizedCaptain.vehicle?.plate}`;
      const existingMarker = captainMarkers.current[ markerKey ];

      if (existingMarker) {
        existingMarker.setLngLat([ normalizedCaptain.longitude, normalizedCaptain.latitude ]);
        existingMarker.setPopup(new mapboxgl.Popup().setText(createMarkerPopupText(normalizedCaptain)));

        const existingElement = existingMarker.getElement();
        if (existingElement) {
          const updatedElement = createVehicleMarkerElement(normalizedCaptain);
          existingElement.title = updatedElement.title;
          existingElement.innerHTML = updatedElement.innerHTML;
          existingElement.onclick = () => {
            setSelectedCaptain(addTravelDetails(normalizedCaptain));
          };
        }

        return;
      }

      const marker = new mapboxgl.Marker({
        element: createVehicleMarkerElement(normalizedCaptain),
        anchor: "bottom",
      })
        .setLngLat([ normalizedCaptain.longitude, normalizedCaptain.latitude ])
        .setPopup(new mapboxgl.Popup().setText(popupText))
        .addTo(map.current);

      marker.getElement().style.cursor = "pointer";
      marker.getElement().onclick = () => {
        setSelectedCaptain(addTravelDetails(normalizedCaptain));
      };

      captainMarkers.current[ markerKey ] = marker;
    });
  }, [captains, userCoords]);

  useEffect(() => {
    setSelectedCaptain((previousSelectedCaptain) => {
      if (!previousSelectedCaptain) {
        return null;
      }

      const selectedKey = getCaptainMarkerKey(previousSelectedCaptain);
      const latestCaptain = captains
        .map(normalizeCaptainRecord)
        .find((captain) => getCaptainMarkerKey(captain) === selectedKey);

      if (!latestCaptain) {
        return previousSelectedCaptain;
      }

      return addTravelDetails(latestCaptain);
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
