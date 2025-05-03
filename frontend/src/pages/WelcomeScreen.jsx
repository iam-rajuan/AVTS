import React from "react";
import { NavigationFooter } from "../components/NavigationFooter";

const WelcomeScreen = () => {
    return (
      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Header Section */}
        <header className="pt-12 px-6">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu - Consider making this a button for accessibility */}
            <button className="space-y-1 w-6 focus:outline-none">
              <div className="h-0.5 bg-black w-full"></div>
              <div className="h-0.5 bg-black w-full"></div>
              <div className="h-0.5 bg-black w-3/4"></div>
            </button>
            
            {/* Welcome Text */}
            <h1 className="text-xl font-medium">Welcome, <span className="font-bold">Rajuan</span>!</h1>
            
            {/* User Avatar - Add onClick handler if needed */}
            <button className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"></button>
          </div>
          
          {/* Current Location */}
          <div className="mt-6">
            <p className="text-sm text-gray-500">Your current locations</p>
            <div className="flex items-center mt-1">
              <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
              <span className="font-bold">Kuril, Dhaka</span>
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4 mx-6"></div>

        {/* Main Content */}
        <main className="px-6">
          {/* Map Placeholder - Add aria-label for accessibility */}
          <div 
            className="mt-6 h-48 bg-gray-200 rounded-lg"
            aria-label="Map placeholder"
          ></div>

          {/* Search Section */}
          <div className="mt-6 flex">
            <div className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center">
              {/* Search icon placeholder */}
              <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
            </div>
            <input 
              type="text" 
              placeholder="Where do you wanna go?"
              className="flex-1 h-10 bg-gray-100 rounded-r-lg px-3 text-sm focus:outline-none"
              aria-label="Destination search input"
            />
          </div>

          {/* Saved Places Section */}
          <div className="mt-6">
            <div 
              className="flex items-center justify-between py-3 border-b border-gray-200"
              role="button" 
              tabIndex={0}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                </div>
                <span className="font-medium">Choose a saved place</span>
              </div>
              <div className="w-2 h-3 bg-gray-400"></div>
            </div>
            
            <div 
              className="flex items-center justify-between py-3"
              role="button" 
              tabIndex={0}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                </div>
                <span className="font-medium">Vehicle Capacity Feedback</span>
              </div>
              <div className="w-2 h-3 bg-gray-400"></div>
            </div>
          </div>
        </main>

        {/* Footer Navigation */}
        <NavigationFooter />
      </div>
    );
};

export default WelcomeScreen;








































// import React from "react";

// const WelcomeScreen = () => {
//   return (
//     <div className="flex items-center justify-center h-screen bg-green-100">
//       <div className="text-center p-8 bg-white rounded-lg shadow-lg">
//         <h1 className="text-4xl font-bold text-green-600 mb-4">Welcome Page Working Perfectly!</h1>
//         <p className="text-xl text-gray-700">Hello World! This is a test confirmation.</p>
//         <div className="mt-6 p-4 bg-green-50 rounded">
//           <p className="text-green-800">✅ Successfully loaded the WelcomeScreen component</p>
//           <p className="text-green-800">✅ Routing is working correctly</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomeScreen;


// import React from "react";

// const WelcomeScreen = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen pb-16">
//       {/* Header Section */}
//       <header className="pt-12 px-6">
//         <div className="flex items-center justify-between">
//           {/* Hamburger Menu */}
//           <div className="space-y-1 w-6">
//             <div className="h-0.5 bg-black w-full"></div>
//             <div className="h-0.5 bg-black w-full"></div>
//             <div className="h-0.5 bg-black w-3/4"></div>
//           </div>
          
//           {/* Welcome Text */}
//           <h1 className="text-xl font-medium">Welcome, <span className="font-bold">Rajuan</span>!</h1>
          
//           {/* User Avatar */}
//           <div className="w-8 h-8 rounded-full bg-gray-300"></div>
//         </div>
        
//         {/* Current Location */}
//         <div className="mt-6">
//           <p className="text-sm text-gray-500">Your current locations</p>
//           <div className="flex items-center mt-1">
//             <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
//             <span className="font-bold">Kuril, Dhaka</span>
//           </div>
//         </div>
//       </header>

//       {/* Divider */}
//       <div className="border-t border-gray-200 my-4 mx-6"></div>

//       {/* Main Content */}
//       <main className="px-6">
//         <h2 className="text-lg font-semibold mb-4">Jalan Keison Sizin</h2>
        
//         {/* Checklist Items */}
//         <div className="space-y-3">
//           {[
//             "Kampung Bali",
//             "Where do you wanna go?",
//             "Choose a saved place",
//             "Vehicle Capacity Feedback",
//             "set Location to Destination",
//             "Home Service Activity Account"
//           ].map((item, index) => (
//             <div key={index} className="flex items-center">
//               <input 
//                 type="checkbox" 
//                 id={`item-${index}`} 
//                 className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               />
//               <label htmlFor={`item-${index}`} className="text-gray-700">
//                 {item}
//               </label>
//             </div>
//           ))}
//         </div>

//         {/* Map Placeholder */}
//         <div className="mt-6 h-48 bg-gray-200 rounded-lg"></div>

//         {/* Search Section */}
//         <div className="mt-6 flex">
//           <div className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center">
//             <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
//           </div>
//           <input 
//             type="text" 
//             placeholder="Where do you wanna go?"
//             className="flex-1 h-10 bg-gray-100 rounded-r-lg px-3 text-sm focus:outline-none"
//           />
//         </div>

//         {/* Saved Places Section */}
//         <div className="mt-6">
//           <div className="flex items-center justify-between py-3 border-b border-gray-200">
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                 <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
//               </div>
//               <span className="font-medium">Choose a saved place</span>
//             </div>
//             <div className="w-2 h-3 bg-gray-400"></div>
//           </div>
          
//           <div className="flex items-center justify-between py-3">
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                 <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
//               </div>
//               <span className="font-medium">Vehicle Capacity Feedback</span>
//             </div>
//             <div className="w-2 h-3 bg-gray-400"></div>
//           </div>
//         </div>
//       </main>

//       {/* Footer Navigation */}
//       <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200">
//         <div className="flex justify-around items-center h-full px-4">
//           {["Home", "Service", "Activity", "Account"].map((item) => (
//             <button key={item} className="flex flex-col items-center">
//               <div className="w-6 h-6 bg-gray-300 rounded-full mb-1"></div>
//               <span className="text-xs">{item}</span>
//             </button>
//           ))}
//         </div>
//       </footer>
//     </div>
//   );
// };
// export default WelcomeScreen;
































// import React from "react";
// import { NavigationFooter } from "../components/NavigationFooter";

// const WelcomeScreen = () => {
//     return (
//       <div className="bg-gray-50 min-h-screen pb-16">
//       Header Section
//       <header className="pt-12 px-6">
//         <div className="flex items-center justify-between">
//           Hamburger Menu
//           <div className="space-y-1 w-6">
//             <div className="h-0.5 bg-black w-full"></div>
//             <div className="h-0.5 bg-black w-full"></div>
//             <div className="h-0.5 bg-black w-3/4"></div>
//           </div>
          
//           Welcome Text
//           <h1 className="text-xl font-medium">Welcome, <span className="font-bold">Rajuan</span>!</h1>
          
//           User Avatar
//           <div className="w-8 h-8 rounded-full bg-gray-300"></div>
//         </div>
        
//         Current Location
//         <div className="mt-6">
//           <p className="text-sm text-gray-500">Your current locations</p>
//           <div className="flex items-center mt-1">
//             <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
//             <span className="font-bold">Kuril, Dhaka</span>
//           </div>
//         </div>
//       </header>

//       Divider
//       <div className="border-t border-gray-200 my-4 mx-6"></div>

//       Main Content
//       <main className="px-6">
//         <h2 className="text-lg font-semibold mb-4">Choose anything</h2>
        
//         Checklist Items
//         <div className="space-y-3">
//           {[
//             "Kampung Bali",
//             "Where do you wanna go?",
//             "Choose a saved place",
//             "Vehicle Capacity Feedback",
//             "set Location to Destination",
//             "Home Service Activity Account"
//           ].map((item, index) => (
//             <div key={index} className="flex items-center">
//               <input 
//                 type="checkbox" 
//                 id={`item-${index}`} 
//                 className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               />
//               <label htmlFor={`item-${index}`} className="text-gray-700">
//                 {item}
//               </label>
//             </div>
//           ))}
//         </div>

//         Map Placeholder
//         <div className="mt-6 h-48 bg-gray-200 rounded-lg"></div>

//         Search Section
//         <div className="mt-6 flex">
//           <div className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center">
//             <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
//           </div>
//           <input 
//             type="text" 
//             placeholder="Where do you wanna go?"
//             className="flex-1 h-10 bg-gray-100 rounded-r-lg px-3 text-sm focus:outline-none"
//           />
//         </div>

//         Saved Places Section
//         <div className="mt-6">
//           <div className="flex items-center justify-between py-3 border-b border-gray-200">
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                 <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
//               </div>
//               <span className="font-medium">Choose a saved place</span>
//             </div>
//             <div className="w-2 h-3 bg-gray-400"></div>
//           </div>
          
//           <div className="flex items-center justify-between py-3">
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
//                 <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
//               </div>
//               <span className="font-medium">Vehicle Capacity Feedback</span>
//             </div>
//             <div className="w-2 h-3 bg-gray-400"></div>
//           </div>
//         </div>
//       </main>

//  Footer Navigation with active state
//  <NavigationFooter />
//     </div>
//   );
// };

// export default WelcomeScreen;