import React, { useRef, useEffect } from 'react';
import { LucideX } from 'lucide-react';

const DriverDetailsBottomSheet = ({ driver, onClose }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!driver) return null;

  return (
    <>
      {/* Overlay */}
      {driver && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-30" />
      )}
      
      {/* Bottom Sheet from under NavigationFooter */}
      <div 
        ref={sheetRef}
        className="fixed bottom-0 mb-16 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-40 p-4 max-h-[70vh] overflow-y-auto transition-transform duration-300 transform translate-y-0"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Vehicle Details</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <LucideX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Vehicle ID</p>
              <p className="font-medium">{driver.vehicleId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="font-medium">{driver.capacity || '4 passengers'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Distance from you</p>
            <p className="font-medium">{driver.distance || '1.2 km'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Estimated arrival time</p>
            <p className="font-medium">{driver.eta || '~5 minutes'}</p>
          </div>

          <div className="pt-4">
            <button className="w-full bg-black text-white py-3 rounded-lg font-medium">
              Request Ride
            </button>
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-500 text-center">Vehicle Feedback</p>
            <div className="flex justify-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="text-yellow-400">
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverDetailsBottomSheet;
