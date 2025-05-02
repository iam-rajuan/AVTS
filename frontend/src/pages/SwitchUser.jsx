import React from "react";
import { Link } from "react-router-dom";

import AVTSImage from "../assets/AVTS-R-BG.png"; // Correct the path to your image
import AVTSHome from "../assets/location-pin.jpg"; // Correct the path to your image
import Start from "./Start";

const SwitchUser = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${AVTSHome})`, // Use inline styles for dynamic background image
        // backgroundSize: '80%',
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        // backgroundPosition: 'center',
        // width: "392px", // Set your desired width (e.g., 800px, 100%, etc.)
        backgroundPosition: "center top",
        // height: "381px", // Set your desired height (e.g., 500px, 100vh, etc.)
      }}
      className="h-screen pt-8 flex justify-between flex-col w-full overflow-hidden font-sans"
    >
      {/* Background Image */}
      {/* <div className="absolute w-full h-[481px] bg-gray-300"> */}
      {/* Replace with actual background image */}
      {/* <img src="/background.jpg" alt="background" className="w-full h-full object-cover" /> */}
      {/* </div> */}

      {/* Header  */}
      <header className="absolute top-[19px] w-full px-[18px] flex justify-between items-center">
        {/* AVTS Logo */}
        {/* <h1 className="text-[36px] font-bold text-white">AVTS</h1> */}
        {/* <img className='w-28 ml-8' src={AVTSImage} alt="" /> */}
        <img className="w-20 mb-3" src={AVTSImage} alt="" />

        {/* Back Arrow */}
        <Link to= "/"
         className="w-[26px] h-[32px] text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
              />
          </svg>
        </Link>
      </header>

      {/* Main Content */}
      <main className="absolute top-[300px] w-full px-[25px] pt-[77px]">


        <h2 className="text-sm font-normal mb-2 text-left pl-[14px]">Unlock a Seamless Journey</h2>
        <div className="flex justify-center">
        <Link to="/login" className="flex items-center justify-center w-[315px] h-[61px] bg-blue-600 text-white rounded-lg font-medium text-lg">
          Sign in as an User
        </Link>
        </div>


        <h2 className="text-sm font-normal mb-2 text-left pl-[14px]">Drive Smarter, Live Better</h2>
        <div className="flex justify-center">
        <Link
          to="/captain-login"
          className="flex items-center justify-center w-[315px] h-[61px] bg-green-600 text-white rounded-lg font-medium text-lg"
          >
          Sign in as a Captain
        </Link>
        </div>

      </main>

      {/* <main className="absolute top-[300px] w-full px-[25px] pt-[77px]">
        
    
          <h2 className="text-sm font-normal mb-2">Unlock a Seamless Journey</h2>

          <button className="w-[315px] h-[61px] bg-blue-600 text-white rounded-lg font-medium text-lg">
            Sign in as an User
          </button>
          
          <h2 className="text-sm font-normal mb-2">Drive Smarter, Live Better</h2>
          
      

                <button>
                  <Link
                    to='/captain-login'
                    className="w-[315px] h-[61px] bg-green-600 text-white rounded-lg font-medium text-lg"
                  >Sign in as Captain</Link>
                </button>


      </main> */}
      {/* <button className="w-[315px] h-[61px] bg-green-600 text-white rounded-lg font-medium text-lg">
            Sign in as a Captain
          </button> */}
      {/* Footer - Fixed at Bottom */}
      <footer className="w-full px-[18px] pb-4 absolute bottom-0">
        <p className="text-[10px] leading-tight text-center">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </footer>
    </div>
  );
};

export default SwitchUser;
