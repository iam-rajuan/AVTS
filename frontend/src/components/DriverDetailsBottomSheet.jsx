import React, { useRef, useEffect, useState } from 'react';
import { LucideX, LucideChevronDown } from 'lucide-react';

const DriverDetailsBottomSheet = ({ driver, onClose, onStatusChange }) => {
  const sheetRef = useRef(null);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(driver?.currentLoad || 'available');
  const [hasStatusChanged, setHasStatusChanged] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (showDropdown && dropdownRef.current) {
      dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showDropdown]);

  // Professional capacity status options with updated color scheme
  const capacityOptions = [
    { 
      label: "No Load", 
      description: "Empty/Available",
      status: "available",
      color: "bg-emerald-900/20 border-emerald-500",
      textColor: "text-emerald-400",
      icon: "🟢"
    },
    { 
      label: "Light Load", 
      description: "Can take more passengers",
      status: "light",
      color: "bg-emerald-900/15 border-emerald-400",
      textColor: "text-emerald-300",
      icon: "🟢"
    },
    { 
      label: "Medium Load", 
      description: "Partially filled",
      status: "partial",
      color: "bg-amber-900/20 border-amber-500",
      textColor: "text-amber-400",
      icon: "🟡"
    },
    { 
      label: "Heavy Load", 
      description: "Limited space remaining",
      status: "heavy",
      color: "bg-orange-900/20 border-orange-500",
      textColor: "text-orange-400",
      icon: "🟠"
    },
    { 
      label: "At Capacity", 
      description: "No space available",
      status: "full",
      color: "bg-red-900/20 border-red-500",
      textColor: "text-red-400",
      icon: "🔴"
    },
    { 
      label: "Overloaded", 
      description: "Exceeds capacity",
      status: "overloaded",
      color: "bg-red-900/30 border-red-600",
      textColor: "text-red-300",
      icon: "⛔"
    }
  ];

  const getCurrentStatus = () => {
    return capacityOptions.find(option => option.status === driver?.currentLoad) || capacityOptions[0];
  };

  const getButtonText = () => {
    if (hasStatusChanged) {
      const selectedOption = capacityOptions.find(opt => opt.status === selectedStatus);
      return selectedOption ? selectedOption.label : "Update vehicle status";
    }
    return "Update vehicle status";
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setHasStatusChanged(true);
    setShowDropdown(false);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  if (!driver) return null;

  return (
    <>
      {/* Dark overlay with subtle transparency */}
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-30" />
      
      {/* Bottom Sheet with dark theme */}
      <div 
        ref={sheetRef}
        className="fixed bottom-0 mb-16 left-0 right-0 bg-gray-900 rounded-t-xl shadow-2xl z-40 p-5 max-h-[65vh] overflow-y-auto transition-all duration-200 border-t border-gray-700"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">Vehicle Details</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <LucideX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="space-y-4 text-sm">
          {/* Vehicle Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Vehicle ID</p>
              <p className="font-medium text-gray-100">{driver.vehicleId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Max Capacity</p>
              <p className="font-medium text-gray-100">{driver.capacity || '40 passengers'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Distance from you</p>
            <p className="font-medium text-gray-100">{driver.distance || '1.2 km'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Estimated arrival time</p>
            <p className="font-medium text-gray-100">{driver.eta || '~5 minutes'}</p>
          </div>

          {/* Capacity Status Section */}
          <div className="pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Current Vehicle Load</p>
            
            {/* Current Status Display */}
            <div className={`mb-3 p-3 rounded-lg border ${getCurrentStatus().color} ${getCurrentStatus().textColor}`}>
              <div className="flex items-center space-x-3">
                <span className="text-base">{getCurrentStatus().icon}</span>
                <div>
                  <p className="font-medium">{getCurrentStatus().label}</p>
                  <p className="text-xs opacity-80">{getCurrentStatus().description}</p>
                </div>
              </div>
            </div>

            {/* Status Selector */}
            <div className="relative">
              <button 
                className="w-full p-3 rounded-lg flex items-center justify-between border border-gray-700 bg-gray-800 hover:border-gray-600 transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
              >
                <span className="text-sm text-gray-200">
                  {getButtonText()}
                </span>
                <LucideChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDropdown && (
                <div 
                  ref={dropdownRef}
                  className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 max-h-60 overflow-y-auto"
                  role="listbox"
                >
                  {capacityOptions.map((option) => (
                    <button
                      key={option.status}
                      className={`w-full text-left p-3 flex items-center space-x-3 hover:bg-gray-700 transition-colors ${
                        selectedStatus === option.status ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => handleStatusChange(option.status)}
                      role="option"
                      aria-selected={selectedStatus === option.status}
                    >
                      <span className="text-base">{option.icon}</span>
                      <div>
                        <p className={`text-sm font-medium ${option.textColor}`}>{option.label}</p>
                        <p className="text-xs text-gray-400">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3">
            <button 
              className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                selectedStatus === 'full' || selectedStatus === 'overloaded' 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20'
              }`}
              disabled={selectedStatus === 'full' || selectedStatus === 'overloaded'}
            >
              {selectedStatus === 'full' ? 'Vehicle Full' : 
               selectedStatus === 'overloaded' ? 'Overloaded - Cannot Book' : 
               'Request Ride'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverDetailsBottomSheet;








// // white theme

// import React, { useRef, useEffect, useState } from 'react';
// import { LucideX, LucideChevronDown } from 'lucide-react';

// const DriverDetailsBottomSheet = ({ driver, onClose, onStatusChange }) => {
//   const sheetRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState(driver?.currentLoad || 'available');
//   const [hasStatusChanged, setHasStatusChanged] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sheetRef.current && !sheetRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [onClose]);

//   useEffect(() => {
//     if (showDropdown && dropdownRef.current) {
//       dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//     }
//   }, [showDropdown]);

//   // Capacity status options with color coding
//   const capacityOptions = [
//     { 
//       label: "No Load", 
//       description: "Empty/Available",
//       status: "available",
//       color: "bg-green-100 border-green-500",
//       textColor: "text-green-800",
//       icon: "🟢"
//     },
//     { 
//       label: "Light Load", 
//       description: "Can take more passengers",
//       status: "light",
//       color: "bg-green-50 border-green-300",
//       textColor: "text-green-700",
//       icon: "🟢"
//     },
//     { 
//       label: "Medium Load", 
//       description: "Partially filled",
//       status: "partial",
//       color: "bg-yellow-50 border-yellow-400",
//       textColor: "text-yellow-800",
//       icon: "🟡"
//     },
//     { 
//       label: "Heavy Load", 
//       description: "Limited space remaining",
//       status: "heavy",
//       color: "bg-orange-50 border-orange-400",
//       textColor: "text-orange-800",
//       icon: "🟠"
//     },
//     { 
//       label: "At Capacity", 
//       description: "No space available",
//       status: "full",
//       color: "bg-red-50 border-red-400",
//       textColor: "text-red-800",
//       icon: "🔴"
//     },
//     { 
//       label: "Overloaded", 
//       description: "Exceeds capacity",
//       status: "overloaded",
//       color: "bg-red-100 border-red-600",
//       textColor: "text-red-900",
//       icon: "⛔"
//     }
//   ];

//   const getCurrentStatus = () => {
//     return capacityOptions.find(option => option.status === driver?.currentLoad) || capacityOptions[0];
//   };

//   const getButtonText = () => {
//     if (hasStatusChanged) {
//       const selectedOption = capacityOptions.find(opt => opt.status === selectedStatus);
//       return selectedOption ? selectedOption.label : "Update vehicle status";
//     }
//     return "Update vehicle status";
//   };

//   const handleStatusChange = (status) => {
//     setSelectedStatus(status);
//     setHasStatusChanged(true);
//     setShowDropdown(false);
//     if (onStatusChange) {
//       onStatusChange(status);
//     }
//   };

//   if (!driver) return null;

//   return (
//     <>
//       {/* Semi-transparent overlay */}
//       <div className="fixed inset-0 bg-black/30 z-30" />
      
//       {/* Bottom Sheet */}
//       <div 
//         ref={sheetRef}
//         className="fixed bottom-0 mb-16 left-0 right-0 bg-white rounded-t-xl shadow-xl z-40 p-5 max-h-[65vh] overflow-y-auto transition-all duration-200"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900">Vehicle Details</h2>
//           <button 
//             onClick={onClose} 
//             className="p-1 rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
//             aria-label="Close"
//           >
//             <LucideX className="w-5 h-5" />
//           </button>
//         </div>
        
//         {/* Content */}
//         <div className="space-y-4 text-sm">
//           {/* Vehicle Info Grid */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Vehicle ID</p>
//               <p className="font-medium text-gray-900">{driver.vehicleId}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Max Capacity</p>
//               <p className="font-medium text-gray-900">{driver.capacity || '40 passengers'}</p>
//             </div>
//           </div>

//           <div>
//             <p className="text-xs text-gray-500 mb-1">Distance from you</p>
//             <p className="font-medium text-gray-900">{driver.distance || '1.2 km'}</p>
//           </div>

//           <div>
//             <p className="text-xs text-gray-500 mb-1">Estimated arrival time</p>
//             <p className="font-medium text-gray-900">{driver.eta || '~5 minutes'}</p>
//           </div>

//           {/* Capacity Status Section */}
//           <div className="pt-3 border-t border-gray-100">
//             <p className="text-xs text-gray-500 mb-2">Current Vehicle Load</p>
            
//             {/* Current Status Display */}
//             <div className={`mb-3 p-3 rounded-lg border ${getCurrentStatus().color} ${getCurrentStatus().textColor}`}>
//               <div className="flex items-center space-x-3">
//                 <span className="text-base">{getCurrentStatus().icon}</span>
//                 <div>
//                   <p className="font-medium">{getCurrentStatus().label}</p>
//                   <p className="text-xs opacity-80">{getCurrentStatus().description}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Status Selector */}
//             <div className="relative">
//               <button 
//                 className="w-full p-3 rounded-lg flex items-center justify-between border border-gray-200 hover:border-gray-300 transition-colors"
//                 onClick={() => setShowDropdown(!showDropdown)}
//                 aria-expanded={showDropdown}
//                 aria-haspopup="listbox"
//               >
//                 <span className="text-sm text-gray-900">
//                   {getButtonText()}
//                 </span>
//                 <LucideChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
//               </button>
              
//               {showDropdown && (
//                 <div 
//                   ref={dropdownRef}
//                   className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto"
//                   role="listbox"
//                 >
//                   {capacityOptions.map((option) => (
//                     <button
//                       key={option.status}
//                       className={`w-full text-left p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
//                         selectedStatus === option.status ? 'bg-blue-50' : ''
//                       }`}
//                       onClick={() => handleStatusChange(option.status)}
//                       role="option"
//                       aria-selected={selectedStatus === option.status}
//                     >
//                       <span className="text-base">{option.icon}</span>
//                       <div>
//                         <p className="text-sm font-medium">{option.label}</p>
//                         <p className="text-xs text-gray-600">{option.description}</p>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Action Button */}
//           <div className="pt-3">
//             <button 
//               className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
//                 selectedStatus === 'full' || selectedStatus === 'overloaded' 
//                 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
//                 : 'bg-gray-900 text-white hover:bg-gray-800'
//               }`}
//               disabled={selectedStatus === 'full' || selectedStatus === 'overloaded'}
//             >
//               {selectedStatus === 'full' ? 'Vehicle Full' : 
//                selectedStatus === 'overloaded' ? 'Overloaded - Cannot Book' : 
//                'Request Ride'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DriverDetailsBottomSheet;




















// // capacity buttons added


// import React, { useRef, useEffect } from 'react';
// import { LucideX } from 'lucide-react';

// const DriverDetailsBottomSheet = ({ driver, onClose }) => {
//   const sheetRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sheetRef.current && !sheetRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [onClose]);

//   if (!driver) return null;

//   // Capacity status options with color coding
//   const capacityOptions = [
//     { 
//       label: "No Load", 
//       description: "Empty/Available",
//       status: "available",
//       color: "bg-green-500",
//       icon: "🟢"
//     },
//     { 
//       label: "Light Load", 
//       description: "Can take more passengers",
//       status: "partial",
//       color: "bg-green-300",
//       icon: "🟢"
//     },
//     { 
//       label: "Medium Load", 
//       description: "Partially filled",
//       status: "partial",
//       color: "bg-yellow-500",
//       icon: "🟡"
//     },
//     { 
//       label: "Heavy Load", 
//       description: "Limited space remaining",
//       status: "partial",
//       color: "bg-orange-500",
//       icon: "🟠"
//     },
//     { 
//       label: "At Capacity", 
//       description: "No space available",
//       status: "full",
//       color: "bg-red-500",
//       icon: "🔴"
//     },
//     { 
//       label: "Overloaded", 
//       description: "Exceeds capacity",
//       status: "overloaded",
//       color: "bg-red-700",
//       icon: "⛔"
//     }
//   ];

//   return (
//     <>
//       {/* Overlay */}
//       {driver && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 z-30" />
//       )}
      
//       {/* Bottom Sheet */}
//       <div 
//         ref={sheetRef}
//         className="fixed bottom-0 mb-16 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-40 p-4 max-h-[70vh] overflow-y-auto transition-transform duration-300 transform translate-y-0"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Vehicle Details</h2>
//           <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
//             <LucideX className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Vehicle ID</p>
//               <p className="font-medium">{driver.vehicleId}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Max Capacity</p>
//               <p className="font-medium">{driver.capacity || '4 passengers'}</p>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Distance from you</p>
//             <p className="font-medium">{driver.distance || '1.2 km'}</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Estimated arrival time</p>
//             <p className="font-medium">{driver.eta || '~5 minutes'}</p>
//           </div>

//           {/* Enhanced Capacity Feedback Section */}
//           <div className="pt-2 border-t border-gray-200">
//             <p className="text-sm text-gray-500 mb-2">Current Vehicle Load</p>
//             <div className="grid grid-cols-2 gap-2">
//               {capacityOptions.map((option) => (
//                 <div 
//                   key={option.label}
//                   className={`p-3 rounded-lg border ${option.color.replace('bg', 'border')} flex items-center space-x-2 cursor-pointer hover:opacity-80`}
//                   onClick={() => console.log('Selected:', option.label)}
//                 >
//                   <span className="text-xl">{option.icon}</span>
//                   <div>
//                     <p className="font-medium">{option.label}</p>
//                     <p className="text-xs text-gray-600">{option.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-3 flex items-center justify-between bg-gray-100 p-2 rounded">
//               <div className="flex items-center space-x-2">
//                 <span className={`w-3 h-3 rounded-full ${driver.currentLoad === 'full' ? 'bg-red-500' : driver.currentLoad === 'partial' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
//                 <span>Current Status:</span>
//               </div>
//               <span className="font-medium">
//                 {driver.currentLoad === 'full' ? 'At Capacity' : 
//                  driver.currentLoad === 'partial' ? 'Medium Load' : 'Available'}
//               </span>
//             </div>
//           </div>

//           <div className="pt-4">
//             <button 
//               className={`w-full text-white py-3 rounded-lg font-medium ${
//                 driver.currentLoad === 'full' || driver.currentLoad === 'overloaded' 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-black'
//               }`}
//               disabled={driver.currentLoad === 'full' || driver.currentLoad === 'overloaded'}
//             >
//               {driver.currentLoad === 'full' ? 'Vehicle Full' : 
//                driver.currentLoad === 'overloaded' ? 'Overloaded - Cannot Book' : 
//                'Request Ride'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DriverDetailsBottomSheet;


















// import React, { useRef, useEffect } from 'react';
// import { LucideX } from 'lucide-react';

// const DriverDetailsBottomSheet = ({ driver, onClose }) => {
//   const sheetRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sheetRef.current && !sheetRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [onClose]);

//   if (!driver) return null;

//   return (
//     <>
//       {/* Overlay */}
//       {driver && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 z-30" />
//       )}
      
//       {/* Bottom Sheet from under NavigationFooter */}
//       <div 
//         ref={sheetRef}
//         className="fixed bottom-0 mb-16 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-40 p-4 max-h-[70vh] overflow-y-auto transition-transform duration-300 transform translate-y-0"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Vehicle Details</h2>
//           <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
//             <LucideX className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Vehicle ID</p>
//               <p className="font-medium">{driver.vehicleId}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Capacity</p>
//               <p className="font-medium">{driver.capacity || '4 passengers'}</p>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Distance from you</p>
//             <p className="font-medium">{driver.distance || '1.2 km'}</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Estimated arrival time</p>
//             <p className="font-medium">{driver.eta || '~5 minutes'}</p>
//           </div>

//           <div className="pt-4">
//             <button className="w-full bg-black text-white py-3 rounded-lg font-medium">
//               Request Ride
//             </button>
//           </div>

//           <div className="pt-2">
//             <p className="text-sm text-gray-500 text-center">Vehicle Feedback</p>
//             <div className="flex justify-center space-x-1 mt-1">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button key={star} className="text-yellow-400">
//                   ★
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DriverDetailsBottomSheet;
