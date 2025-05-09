// pages/Account.jsx
import React, { useState } from "react";
import { NavigationFooter } from "../components/NavigationFooter";
import {
  FaUser,
  FaCog,
  FaExchangeAlt,
  FaSignOutAlt,
  FaBell,
  FaChevronRight,
  FaRoute,
} from "react-icons/fa";

const Account = () => {
  const [showRoutes, setShowRoutes] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("Gazipur");

  const routes = [
    "Uttara",
    "Gazipur",
    "Mirpur",
    "Casara",
    "Sonirakhra",
    "Jatrabari",
    "Gulistan",
    "Norsingdi",
  ];

  const handleRouteClick = (route) => {
    setCurrentRoute(route);
    setShowRoutes(false);
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col justify-between pb-16">
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700 bg-gray-900 shadow-md">
        <h1 className="text-xl font-semibold text-white">Rajuan</h1>
        <FaBell className="text-2xl text-gray-300" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center px-4 py-5 space-x-4">
          <div className="w-14 h-14 bg-gray-600 text-gray-100 rounded-full flex items-center justify-center text-xl font-bold">
            👤
          </div>
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg text-white">Md Rajuan Hossen</h2>
            <p className="text-sm text-gray-300">+880 1836 ••••••</p>
            <div className="text-yellow-500 text-sm mt-1">⭐ 5.0</div>
          </div>
        </div>

        <div className="bg-gray-800 text-gray-100 rounded-lg mx-4 p-4 mb-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-400">Managed by Green University of Bangladesh</h3>
          <p className="text-sm text-gray-300">Route {currentRoute}</p>
        </div>

        <div className="space-y-3 mx-4">
          <LinkItem icon={<FaUser />} label="Personal details" onClick={() => setShowPersonalDetails(!showPersonalDetails)} />
          {showPersonalDetails && (
            <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 shadow-lg">
              <p>Email: user@example.com</p>
              <p>Phone: +880 1836 ••••••</p>
              <p>Address: Dhaka, Bangladesh</p>
            </div>
          )}
          
          <LinkItem icon={<FaCog />} label="Settings and privacy" onClick={() => setShowSettings(!showSettings)} />
          {showSettings && (
            <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 shadow-lg">
              <p>Notifications: Enabled</p>
              <p>Privacy: Public</p>
              <p>Language: English</p>
            </div>
          )}

          <LinkItem icon={<FaExchangeAlt />} label="Switch Route" onClick={() => setShowRoutes(!showRoutes)} />
        </div>

        {showRoutes && (
          <div className="mt-4 mx-4 space-y-3">
            {routes.map((route, index) => (
              <div key={index} className="bg-gray-900 text-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-700" onClick={() => handleRouteClick(route)}>
                <span className="flex items-center space-x-2">
                  <FaRoute className="text-gray-300" />
                  <span>{route}</span>
                </span>
                <FaChevronRight className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 mb-4">
        <button className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700">
          <FaSignOutAlt />
          Signout
        </button>
      </div>

      <NavigationFooter />
    </div>
  );
};

const LinkItem = ({ icon, label, onClick }) => (
  <div className="bg-gray-800 text-gray-100 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700" onClick={onClick}>
    <div className="flex items-center space-x-4">
      <div className="text-lg text-gray-300">{icon}</div>
      <span className="text-sm font-medium text-gray-200">{label}</span>
    </div>
    <FaChevronRight className="text-gray-300" />
  </div>
);

export default Account;
















// white theme
// // pages/Account.jsx
// import React, { useState } from "react";
// import { NavigationFooter } from "../components/NavigationFooter";
// import {
//   FaUser,
//   FaCog,
//   FaExchangeAlt,
//   FaSignOutAlt,
//   FaBell,
//   FaChevronRight,
//   FaRoute,
// } from "react-icons/fa";

// const Account = () => {
//   const [showRoutes, setShowRoutes] = useState(false);
//   const [showPersonalDetails, setShowPersonalDetails] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [currentRoute, setCurrentRoute] = useState("Gazipur");

//   const routes = [
//     "Uttara",
//     "Gazipur",
//     "Mirpur",
//     "Casara",
//     "Sonirakhra",
//     "Jatrabari",
//     "Gulistan",
//     "Norsingdi",
//   ];

//   const handleRouteClick = (route) => {
//     setCurrentRoute(route);
//     setShowRoutes(false);
//   };

//   return (
//     <div className="bg-[#F7F8FA] text-gray-900 min-h-screen flex flex-col justify-between pb-16">
//       <div className="flex justify-between items-center px-4 py-4 border-b border-gray-300 bg-[#F7F8FA] shadow-sm">
//         <h1 className="text-lg font-semibold">Rajuan</h1>
//         <FaBell className="text-xl text-gray-600" />
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         <div className="flex items-center px-4 py-5 space-x-4">
//           <div className="w-14 h-14 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center text-xl font-bold">
//             👤
//           </div>
//           <div className="flex flex-col">
//             <h2 className="font-semibold text-lg">Md Rajuan Hossen</h2>
//             <p className="text-sm text-gray-500">+880 1836 ••••••</p>
//             <div className="text-yellow-500 text-sm mt-1">⭐ 5.0</div>
//           </div>
//         </div>

//         <div className="bg-gray-100 text-gray-800 rounded-lg mx-4 p-4 mb-4 shadow-sm">
//           <h3 className="text-sm font-semibold">Managed by Green University of Bangladesh</h3>
//           <p className="text-sm">Route {currentRoute}</p>
//         </div>

//         <div className="space-y-3 mx-4">
//           <LinkItem icon={<FaUser />} label="Personal details" onClick={() => setShowPersonalDetails(!showPersonalDetails)} />
//           {showPersonalDetails && (
//             <div className="bg-gray-100 text-gray-800 p-4 rounded-lg mb-4 shadow-sm">
//               <p>Email: user@example.com</p>
//               <p>Phone: +880 1836 ••••••</p>
//               <p>Address: Dhaka, Bangladesh</p>
//             </div>
//           )}
          
//           <LinkItem icon={<FaCog />} label="Settings and privacy" onClick={() => setShowSettings(!showSettings)} />
//           {showSettings && (
//             <div className="bg-gray-100 text-gray-800 p-4 rounded-lg mb-4 shadow-sm">
//               <p>Notifications: Enabled</p>
//               <p>Privacy: Public</p>
//               <p>Language: English</p>
//             </div>
//           )}

//           <LinkItem icon={<FaExchangeAlt />} label="Switch Route" onClick={() => setShowRoutes(!showRoutes)} />
//         </div>

//         {showRoutes && (
//           <div className="mt-4 mx-4 space-y-3">
//             {routes.map((route, index) => (
//               <div key={index} className="bg-gray-100 text-gray-800 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-300" onClick={() => handleRouteClick(route)}>
//                 <span className="flex items-center space-x-2">
//                   <FaRoute />
//                   <span>{route}</span>
//                 </span>
//                 <FaChevronRight className="text-gray-400" />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="px-4 mb-4">
//         <button className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800">
//           <FaSignOutAlt />
//           Signout
//         </button>
//       </div>

//       <NavigationFooter />
//     </div>
//   );
// };

// const LinkItem = ({ icon, label, onClick }) => (
//   <div className="bg-gray-200 text-gray-900 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-300" onClick={onClick}>
//     <div className="flex items-center space-x-4">
//       <div className="text-lg">{icon}</div>
//       <span className="text-sm font-medium">{label}</span>
//     </div>
//     <FaChevronRight className="text-gray-500" />
//   </div>
// );

// export default Account;
















// pages/Account.jsx
// import React, {useState} from "react";
// import { NavigationFooter } from "../components/NavigationFooter";
// import {
//   FaUser,
//   FaCog,
//   FaExchangeAlt,
//   FaSignOutAlt,
//   FaBell,
//   FaChevronRight,
//   FaRoute,
// } from "react-icons/fa";

// const Account = () => {
//   const [showRoutes, setShowRoutes] = useState(false);
//   const [currentRoute, setCurrentRoute] = useState("Gazipur");

//   const routes = [
//     "Uttara",
//     "Gazipur",
//     "Mirpur",
//     "Casara",
//     "Sonirakhra",
//     "Jatrabari",
//     "Gulistan",
//     "Norsingdi",
//   ];

//   const handleRouteClick = (route) => {
//     setCurrentRoute(route);
//     setShowRoutes(false); 
//   };

//   return (
//     // <div className="bg-[#3a3a4b] text-white min-h-screen flex flex-col justify-between pb-16">
//     <div className="bg-[#1E1E2D] text-white min-h-screen flex flex-col justify-between pb-16">
    
//       <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700">
//         <h1 className="text-lg font-semibold">Rajuan</h1>
//         <FaBell className="text-xl text-white" />
//       </div>

      
//       <div className="flex-1 overflow-y-auto">
       
//         <div className="flex items-center px-4 py-5 space-x-4">
//           <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center text-2xl font-bold">
//             👤
//           </div>
//           <div className="flex flex-col">
//             <h2 className="font-semibold text-lg">Md Rajuan Hossen</h2>
//             <p className="text-sm text-gray-300">+880 1836 ••••••</p>
//             <div className="text-yellow-400 text-sm mt-1">⭐ 5.0</div>
//           </div>
//         </div>

//         <div className="bg-white text-black rounded-lg mx-4 p-4 mb-4">
//           <h3 className="text-sm font-semibold">
//             Management by Green University of Bangladesh
//           </h3>
//           <p className="text-sm text-gray-600">Route {currentRoute}</p>
//         </div>

//         <div className="space-y-3 mx-4">
//           <LinkItem icon={<FaUser />} label="Personal details" />
//           <LinkItem icon={<FaCog />} label="Settings and privacy" />
//           <LinkItem
//             icon={<FaExchangeAlt />}
//             label="Switch Route"
//             onClick={() => setShowRoutes(!showRoutes)}
//           />
//         </div>

//         {showRoutes && (
//           <div className="mt-4 mx-4 space-y-3">
//             {routes.map((route, index) => (
//               <div
//                 key={index}
//                 className="bg-white text-black p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
//                 onClick={() => handleRouteClick(route)}
//               >
//                 <span className="flex items-center space-x-2">
//                   <FaRoute />
//                   <span>{route}</span>
//                 </span>
//                 <FaChevronRight className="text-gray-600" />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="px-4 mb-4">
//         <button className="w-full bg-[#2A2A3C] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600">
//           <FaSignOutAlt />
//           Signout
//         </button>
//       </div>

//       <NavigationFooter />
//     </div>
//   );
// };

// const LinkItem = ({ icon, label, onClick }) => (
//   <div
//     className="bg-[#2A2A3C] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#3b3b4e]"
//     onClick={onClick}
//   >
//     <div className="flex items-center space-x-4">
//       <div className="text-lg">{icon}</div>
//       <span className="text-sm font-medium">{label}</span>
//     </div>
//     <FaChevronRight />
//   </div>
// );

// export default Account;
