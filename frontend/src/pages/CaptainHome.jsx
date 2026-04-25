import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { NavigationFooter } from "../components/NavigationFooter";
import { useAuth } from '../context/AuthContext';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API || '';

const loadStatusLabel = {
  no_load: 'No Load',
  empty_capacity: 'Empty Capacity',
  half_load: 'Half Load',
  full_load: 'Full Load',
  custom: 'Custom',
};

const CaptainHome = () => {
  const { session } = useAuth();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const watchId = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/traffic-day-v2',
      center: [90.4125, 23.8103],
      zoom: 12,
    });

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }

      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!session.token || !session.profile) {
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/captains/me/location`,
            { latitude, longitude },
            {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }
          );

          setIsSharing(true);
          setLocationError('');

          const lngLat = [ longitude, latitude ];
          if (!marker.current) {
            marker.current = new mapboxgl.Marker({ color: '#10b981' })
              .setLngLat(lngLat)
              .setPopup(new mapboxgl.Popup().setText(session.profile.vehicle?.plate || 'Captain vehicle'))
              .addTo(map.current);
            map.current.flyTo({ center: lngLat, zoom: 14 });
          } else {
            marker.current.setLngLat(lngLat);
          }
        } catch (error) {
          setLocationError('Unable to update live location');
        }
      },
      () => {
        setLocationError('Enable location access to share location');
      },
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [session.token, session.profile]);

  const captain = session.profile;
  const currentLoadLabel = captain?.currentLoad === 'custom' && captain?.customLoadLabel
    ? captain.customLoadLabel
    : loadStatusLabel[captain?.currentLoad] || 'No Load';

  return (
    <div className="bg-gray-900 min-h-screen pb-16 text-gray-100 relative">
      <header className="pt-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Captain dashboard</p>
            <h1 className="text-2xl font-semibold mt-1">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h1>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-medium ${isSharing ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-700 text-gray-300'}`}>
            {isSharing ? 'Sharing live' : 'Waiting for GPS'}
          </div>
        </div>
      </header>

      <main className="px-6 py-5 space-y-4">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <p className="text-xs text-gray-400">Registered vehicle</p>
          <p className="text-xl font-semibold mt-1">{captain?.vehicle?.plate || 'Unknown vehicle'}</p>
          <p className="text-sm text-gray-400 mt-1 capitalize">
            {captain?.vehicle?.color} {captain?.vehicle?.vehicleType} • Capacity {captain?.vehicle?.capacity}
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <p className="text-xs text-gray-400">Current live status</p>
          <p className="text-xl font-semibold mt-1">{currentLoadLabel}</p>
          <p className="text-sm text-gray-400 mt-1">Update this from the Status tab to change what users see.</p>
        </div>

        {locationError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-sm text-red-300">
            {locationError}
          </div>
        )}

        <div ref={mapContainer} className="h-[420px] rounded-2xl overflow-hidden border border-gray-800" />
      </main>

      <NavigationFooter role="captain" />
    </div>
  );
};

export default CaptainHome;
