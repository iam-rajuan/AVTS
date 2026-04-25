import React from "react";
import { useNavigate } from "react-router-dom";
import { NavigationFooter } from "../components/NavigationFooter";
import { useAuth } from "../context/AuthContext";

const CaptainProfile = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const captain = session.profile;

  return (
    <div className="bg-gray-950 min-h-screen text-white pb-20">
      <header className="px-6 pt-8 pb-4 border-b border-gray-800">
        <h1 className="text-2xl font-semibold">Captain Profile</h1>
      </header>

      <main className="px-6 py-5 space-y-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h2 className="text-xl font-semibold">{captain?.fullname?.firstname} {captain?.fullname?.lastname}</h2>
          <p className="text-gray-400 mt-1">{captain?.email}</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <p className="text-sm text-gray-400">Vehicle</p>
          <p className="text-lg font-medium mt-1">{captain?.vehicle?.plate}</p>
          <p className="text-sm text-gray-400 mt-1">
            {captain?.vehicle?.color} {captain?.vehicle?.vehicleType} • Capacity {captain?.vehicle?.capacity}
          </p>
        </div>

        <button
          onClick={async () => {
            await signOut();
            navigate('/login?role=captain', { replace: true });
          }}
          className="w-full rounded-2xl bg-red-600 hover:bg-red-500 py-3 font-semibold"
        >
          Sign Out
        </button>
      </main>

      <NavigationFooter role="captain" />
    </div>
  );
};

export default CaptainProfile;
