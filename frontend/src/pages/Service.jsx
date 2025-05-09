import React from "react";
import { NavigationFooter } from "../components/NavigationFooter";
import { FaBus, FaSearchLocation } from "react-icons/fa";
import { TbAlertSquareRounded } from "react-icons/tb";
import { FaArrowLeftLong } from "react-icons/fa6";
import bellImage from '../assets/bell.svg';

const Service = () => {
  const notifications = [
    {
      id: 1,
      vehicleId: "Bus-124",
      routeName: "Kuril to Uttara",
      status: "active",
      details: "On route to Green University",
      alerts: "No alerts"
    },
    {
      id: 2,
      vehicleId: "Bus-202",
      routeName: "Mirpur to Dhanmondi",
      status: "active",
      details: "Arrived at destination",
      alerts: "No alerts"
    },
    {
      id: 3,
      vehicleId: "Bus-305",
      routeName: "Gulshan to Motijheel",
      status: "inactive",
      details: "Scheduled for 3:00 PM",
      alerts: "Delayed by 15 mins"
    },
    {
      id: 4,
      vehicleId: "Bus-418",
      routeName: "Mohammadpur to Bashundhara",
      status: "active",
      details: "Next stop: Jamuna Future Park",
      alerts: "No alerts"
    },
    {
      id: 5,
      vehicleId: "Bus-511",
      routeName: "Banani to Airport",
      status: "inactive",
      details: "Out of service",
      alerts: "Maintenance required"
    }
  ];

  return (
    <div className="bg-slate-800 min-h-screen pb-20">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <FaArrowLeftLong className="text-white text-lg" />
        <h1 className="text-lg font-semibold text-white">Sagor</h1>
        <img src={bellImage} alt="Notifications" className="w-5 h-5" />
      </div>

      {/* Vehicle List */}
      <div className="px-4 space-y-3 mt-3">
        {notifications.map((item) => (
          <div key={item.id} className="bg-gray-700 p-3 rounded-lg shadow">
            {/* Vehicle Header */}
            <div className="border-b border-gray-600 flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                  item.status === "active" ? "bg-green-600" : "bg-gray-600"
                }`}>
                  <FaBus className="text-white text-sm" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-white">
                    {item.routeName}
                  </h2>
                  <p className="text-xs text-gray-400">{item.vehicleId}</p>
                </div>
              </div>
              <div className={`h-4 w-4 rounded-full border-2 ${
                item.status === "active" 
                  ? "bg-green-500 border-green-700" 
                  : "bg-red-500 border-red-700"
              }`}></div>
            </div>

            {/* Vehicle Details */}
            <div className="flex justify-between pt-2">
              <div className="flex items-center gap-2">
                <FaSearchLocation className="text-gray-300 text-sm" />
                <p className="text-sm text-gray-300">
                  {item.details}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TbAlertSquareRounded className={
                  item.alerts === "No alerts" 
                    ? "text-gray-400 text-sm" 
                    : "text-yellow-400 text-sm"
                } />
                <p className={`text-sm ${
                  item.alerts === "No alerts" 
                    ? "text-gray-400" 
                    : "text-yellow-400"
                }`}>
                  {item.alerts}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NavigationFooter />
    </div>
  );
};

export default Service;

















// // pages/Service.jsx
// import React from "react";
// import { NavigationFooter } from "../components/NavigationFooter";
// import { FaBus } from "react-icons/fa";
// import { FaSearchLocation } from "react-icons/fa";
// import { TbAlertSquareRounded } from "react-icons/tb";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import bellImage from '../assets/bell.svg'


// const Service = () => {

//   const notifications = [
//     {
//       id: 1,
//       vehicleId: "Bus-124",
//       routeName: "Vehicle ID / RouteName",
//       status: "active", // could be 'active' or 'inactive'
//       details: "details",
//       alerts: "Alerts"
//     },
//     {
//       id: 2,
//       vehicleId: "Bus-202",
//       routeName: "Mirpur to Dhanmondi",
//       status: "active",
//       details: "Arrived at destination",
//       alerts: "No alerts"
//     },
//     {
//       id: 3,
//       vehicleId: "Bus-202",
//       routeName: "Mirpur to Dhanmondi",
//       status: "active",
//       details: "Arrived at destination",
//       alerts: "No alerts"
//     },
//     {
//       id: 3,
//       vehicleId: "Bus-202",
//       routeName: "Mirpur to Dhanmondi",
//       status: "inactive",
//       details: "Arrived at destination",
//       alerts: "No alerts"
//     },
//     {
//       id: 4,
//       vehicleId: "Bus-202",
//       routeName: "Mirpur to Dhanmondi",
//       status: "inactive",
//       details: "Arrived at destination",
//       alerts: "No alerts"
//     }
//   ];
//   return (
//     <div className="bg-slate-600 min-h-screen pb-20">
//     {/* <div className="bg-[#1E1E2D] min-h-screen pb-16"> */}
//       <div className="flex justify-between items-center px-5">
//       <FaArrowLeftLong className="size-6 text-white"/>
//         <h1 className="p-6 text-xl font-bold text-white">Sagor</h1>
      
//         <div>
//           <img src={bellImage} alt="bellimage" className="size-6"/>
//         </div>

//       </div>
//       <div className="px-5 space-y-4">
//       {notifications.map((item) => (
//         <div key={item.id} className="bg-[#D9D9D9] p-3 rounded-xl">
//           <div className="border-b-2 border-gray-400 flex items-center justify-between py-2">
//             <div className="bg-white h-10 w-10 rounded-md flex items-center justify-center">
//               <FaBus className="size-6" />
//             </div>
//             <h1 className="text-xl text-[#1A1E25] font-semibold leading-normal text-center">
//               {item.routeName}
//             </h1>
//             <div className="h-5 w-5 bg-green-500 border-2 rounded-full relative">
//               <div
//                 className={`h-4 w-4 border-2 rounded-full ${
//                   item.status === "active" ? "border-black" : "bg-red-500"
//                 } absolute top-0 left-0`}
//               ></div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between px-5">
//             <div className="flex items-center gap-3 mt-2">
//               <FaSearchLocation className="size-5" />
//               <h1 className="text-lg font-semibold text-black">
//                 {item.details}
//               </h1>
//             </div>
//             <div className="flex items-center gap-3 mt-2">
//               <TbAlertSquareRounded className="size-5" />
//               <h1 className="text-lg font-semibold text-black">
//                 {item.alerts}
//               </h1>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>

//       <NavigationFooter />
//     </div>
//   );
// };

// export default Service;