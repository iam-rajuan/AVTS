import React from "react";
import { NavigationFooter } from "../components/NavigationFooter";
import { FaSearchLocation } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import bellImage from '../assets/bell.svg'
import { FaLocationDot } from "react-icons/fa6";

const Activity = () => {
  const notifications = [
    {
      id: 1,
      routeName: "Kuril, Dhaka",
      details: "Green University of Bangladesh",
      price: "Tk 20"
    },
    {
      id: 2,
      routeName: "Mirpur, Dhaka",
      details: "Daffodil International University",
      price: "Tk 25"
    },
    {
      id: 3,
      routeName: "Mohammadpur, Dhaka",
      details: "University of Dhaka",
      price: "Tk 30"
    },
    {
      id: 4,
      routeName: "Banani, Dhaka",
      details: "North South University",
      price: "Tk 35"
    },
    {
      id: 5,
      routeName: "Dhanmondi, Dhaka",
      details: "BRAC University",
      price: "Tk 25"
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen pb-20">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <div className="flex items-center">
          <FaArrowLeftLong className="text-white text-lg" />
          <h1 className="ml-4 text-lg font-semibold text-white">Ride History</h1>
        </div>
        <div className="p-1">
          <img src={bellImage} alt="Notifications" className="w-5 h-5" />
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 space-y-3 mt-3">
        {notifications?.map((item) => (
          <div key={item.id} className="bg-gray-800 p-3 rounded-lg shadow">
            <div className="border-b border-gray-600 flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-gray-600 h-8 w-8 rounded-md flex items-center justify-center">
                  <FaLocationDot className="text-white text-base" />
                </div>
                <h2 className="text-base font-medium text-white">
                  {item.routeName}
                </h2>
              </div>
              <span className="text-sm font-semibold text-yellow-400">{item.price}</span>
            </div>

            <div className="flex items-center justify-between pt-2 pl-1">
              <div className="flex items-center gap-2">
                <FaSearchLocation className="text-gray-300 text-base" />
                <p className="text-sm text-gray-300">
                  {item.details}
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

export default Activity;












// // pages/Activity.jsx
// import React from "react";
// import { NavigationFooter } from "../components/NavigationFooter";
// import { FaSearchLocation } from "react-icons/fa";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import bellImage from '../assets/bell.svg'
// import { FaLocationDot } from "react-icons/fa6";


// const Activity = () => {

//   const notifications = [
//     {
//       id: 1,
     
//       routeName: "Kuril, Dhaka",
//       details: "Green University of Bangladesh",
    
//     },
//     {
//       id: 2,
//       routeName: "Kuril, Dhaka",
//       details: "Green University of Bangladesh",
//     },
//     {
//       id: 3,
//       routeName: "Kuril, Dhaka",
//       details: "Green University of Bangladesh",
//     },
//     {
//       id: 3,
//       routeName: "Kuril, Dhaka",
//       details: "Green University of Bangladesh",
//     },
//     {
//       id: 4,
//       routeName: "Kuril, Dhaka",
//       details: "Green University of Bangladesh",
//     }
//   ];
//   return (
//     <div className="bg-slate-600 min-h-screen pb-20">
//     {/* <div className="bg-[#1E1E2D] min-h-screen pb-16"> */}
//       <div className="flex justify-between items-center px-5">
//         <div className="flex items-center">

//       <FaArrowLeftLong className="size-6 text-white"/>
//         <h1 className="p-6 text-xl font-bold text-white">Ride History</h1>
//         </div>
      
//         <div>
//           <img src={bellImage} alt="bellimage" className="size-6"/>
//         </div>

//       </div>
//       <div className="px-5 space-y-4">
//       {notifications?.map((item) => (
//         <div key={item.id} className="bg-[#D9D9D9] p-3 rounded-xl">
//           <div className="border-b-2 border-gray-400 flex items-center justify-between py-2">
//             <div className="flex items-center gap-4">
//             <div className="bg-white h-10 w-10 rounded-md flex items-center justify-center">
//               <FaLocationDot className="size-6" />
//             </div>
//             <h1 className="text-xl text-[#1A1E25] font-semibold leading-normal text-center">
//               {item.routeName}
//             </h1>
//             </div>
              
//            <h1 className="text-lg font-bold leading-none text-[#1A1E1E]">Tk 20</h1>
//           </div>

//           <div className="flex items-center justify-between px-5">
//             <div className="flex items-center gap-3 mt-2">
//               <FaSearchLocation className="size-5" />
//               <h1 className="text-lg font-semibold text-black">
//                 {item.details}
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

// export default Activity;