import React from 'react'
import { Link } from 'react-router-dom'
// import AVTS from "../assets/AVTS-removebg.png"
import AVTSImage from '../assets/AVTS-R-BG.png'; // Correct the path to your image
import AVTSHome from '../assets/vts-home.jpg'; // Correct the path to your image

const Start = () => {
  return (
    <div>
      <div       
      style={{
        backgroundImage: `url(${AVTSHome})`, // Use inline styles for dynamic background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className='h-screen pt-8 flex justify-between flex-col w-full'
      >
      {/* <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full'> */}
      <div className="flex justify-center pr-8 ">
      <img className='w-28 ml-8' src={AVTSImage} alt="" />
      </div>
        {/* <img className='w-16 ml-8' src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" alt="" /> */}
        <div className='bg-white pb-8 py-4 px-4'>
          <h2 className='text-[30px] font-semibold'>Get Started with AVTS</h2>
          <p>Advance Vehicle Tracking System</p>
          <Link to='/SwitchUser' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>


          {/* <Link to='/WelcomeScreen' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>WelcomeScreen</Link> */}
          {/* <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link> */}
        </div>
      </div>
    </div>
  )
}

export default Start