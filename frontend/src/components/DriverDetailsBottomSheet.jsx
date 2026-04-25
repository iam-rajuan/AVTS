import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const statusMeta = {
  no_load: { label: 'No Load', description: 'Captain is not carrying passengers', color: 'text-emerald-400 border-emerald-500 bg-emerald-900/20' },
  empty_capacity: { label: 'Empty Capacity', description: 'Vehicle is empty and available', color: 'text-emerald-300 border-emerald-400 bg-emerald-900/15' },
  half_load: { label: 'Half Load', description: 'Vehicle is partially occupied', color: 'text-amber-400 border-amber-500 bg-amber-900/20' },
  full_load: { label: 'Full Load', description: 'Vehicle is full', color: 'text-red-400 border-red-500 bg-red-900/20' },
  custom: { label: 'Custom', description: 'Captain is sharing a custom status', color: 'text-sky-300 border-sky-500 bg-sky-900/20' },
};

const formatLastUpdated = (value) => {
  if (!value) {
    return 'Unknown';
  }

  return new Date(value).toLocaleTimeString();
};

const DriverDetailsBottomSheet = ({ driver, onClose }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!driver) return null;

  const currentStatus = statusMeta[driver.currentLoad] || statusMeta.no_load;
  const statusLabel = driver.currentLoad === 'custom' && driver.customLoadLabel
    ? driver.customLoadLabel
    : currentStatus.label;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-30" />
      <div
        ref={sheetRef}
        className="fixed bottom-0 mb-16 left-0 right-0 bg-gray-900 rounded-t-xl shadow-2xl z-40 p-5 max-h-[65vh] overflow-y-auto transition-all duration-200 border-t border-gray-700"
      >
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">Captain Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Captain</p>
              <p className="font-medium text-gray-100">{driver.captainName || 'Unknown captain'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Vehicle Number</p>
              <p className="font-medium text-gray-100">{driver.vehicle?.plate || driver.vehicleId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Vehicle Type</p>
              <p className="font-medium text-gray-100 capitalize">{driver.vehicle?.vehicleType || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Capacity</p>
              <p className="font-medium text-gray-100">{driver.vehicle?.capacity || 'N/A'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Distance from you</p>
            <p className="font-medium text-gray-100">{driver.distance || 'Unknown'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Estimated arrival time</p>
            <p className="font-medium text-gray-100">{driver.eta || 'Unknown'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Last updated</p>
            <p className="font-medium text-gray-100">{formatLastUpdated(driver.lastUpdatedAt)}</p>
          </div>

          <div className="pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Current Load Status</p>
            <div className={`p-3 rounded-lg border ${currentStatus.color}`}>
              <p className="font-medium">{statusLabel}</p>
              <p className="text-xs opacity-80 mt-1">{currentStatus.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverDetailsBottomSheet;
