import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavigationFooter } from "../components/NavigationFooter";
import { useAuth } from "../context/AuthContext";

const statusOptions = [
  { value: "no_load", label: "No Load", description: "Not carrying passengers right now" },
  { value: "empty_capacity", label: "Empty Capacity", description: "Vehicle is empty and available" },
  { value: "half_load", label: "Half Load", description: "Vehicle is partially occupied" },
  { value: "full_load", label: "Full Load", description: "Vehicle is full and unavailable" },
  { value: "custom", label: "Custom", description: "Set your own status label" },
];

const CaptainStatus = () => {
  const { session, refreshProfile } = useAuth();
  const [currentLoad, setCurrentLoad] = useState("no_load");
  const [customLoadLabel, setCustomLoadLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session.profile?.currentLoad) {
      setCurrentLoad(session.profile.currentLoad);
      setCustomLoadLabel(session.profile.customLoadLabel || "");
    }
  }, [session.profile]);

  const submitStatus = async (nextLoad, nextCustomLoadLabel) => {
    setIsSaving(true);
    setMessage("");

    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/captains/me/status`,
        { currentLoad: nextLoad, customLoadLabel: nextCustomLoadLabel },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      await refreshProfile();
      setMessage("Live status updated");
    } catch (error) {
      const apiMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message;
      setMessage(apiMessage || "Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectStatus = async (nextLoad) => {
    setCurrentLoad(nextLoad);

    if (nextLoad === "custom") {
      setMessage("Enter a custom label to update your live status");
      return;
    }

    setCustomLoadLabel("");
    await submitStatus(nextLoad, "");
  };

  useEffect(() => {
    if (currentLoad !== "custom" || !session.token) {
      return;
    }

    const trimmedLabel = customLoadLabel.trim();

    if (!trimmedLabel) {
      setMessage("Enter a custom label to update your live status");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      submitStatus("custom", trimmedLabel);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [currentLoad, customLoadLabel, session.token]);

  return (
    <div className="bg-gray-950 min-h-screen text-white pb-20">
      <header className="px-6 pt-8 pb-4 border-b border-gray-800">
        <h1 className="text-2xl font-semibold">Live Status</h1>
        <p className="text-sm text-gray-400 mt-1">Users will see this status in real time on the map.</p>
      </header>

      <main className="px-6 py-5 space-y-4">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelectStatus(option.value)}
            className={`w-full text-left rounded-2xl p-4 border transition-colors ${currentLoad === option.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-800 bg-gray-900'}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{option.label}</h2>
              {currentLoad === option.value && <span className="text-emerald-300 text-sm">Selected</span>}
            </div>
            <p className="text-sm text-gray-400 mt-1">{option.description}</p>
          </button>
        ))}

        {currentLoad === "custom" && (
          <input
            type="text"
            value={customLoadLabel}
            onChange={(event) => {
              setCustomLoadLabel(event.target.value);
              setMessage("");
            }}
            placeholder="Enter custom live status"
            className="w-full rounded-2xl px-4 py-3 bg-gray-900 border border-gray-800 text-white"
          />
        )}

        {message && <p className="text-sm text-emerald-300">{message}</p>}
      </main>

      <NavigationFooter role="captain" />
    </div>
  );
};

export default CaptainStatus;
