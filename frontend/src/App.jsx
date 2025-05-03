import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import 'remixicon/fonts/remixicon.css'
import SwitchUser from './pages/SwitchUser'
import WelcomeScreen from './pages/WelcomeScreen'
import Service from './pages/Service'
import Activity from './pages/Activity'
import Account from './pages/Account'

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<Start />} />
      <Route path='/login' element={<UserLogin />} />
      <Route path='/signup' element={<UserSignup />} />
      <Route path='/captain-login' element={<Captainlogin />} />
      <Route path='/captain-signup' element={<CaptainSignup />} />
      <Route path='/SwitchUser' element={<SwitchUser />} />

      <Route path='/WelcomeScreen' element={<WelcomeScreen />} />
      <Route path='/service' element={<Service />} />
      <Route path='/activity' element={<Activity />} />
      <Route path='/account' element={<Account />} />
        <Route path='/home' element={<Home />} />

      {/* Protected User Routes */}
      <Route element={<UserProtectWrapper />}>
        <Route path='/riding' element={<Riding />} />
        <Route path='/user/logout' element={<UserLogout />} />
      </Route>

      {/* Protected Captain Routes */}
      <Route element={<CaptainProtectWrapper />}>
        <Route path='/captain-home' element={<CaptainHome />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path='/captain/logout' element={<CaptainLogout />} />
      </Route>
    </Routes>
  )
}

export default App





































// import React, { useContext } from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Start from './pages/Start'
// import UserLogin from './pages/UserLogin'
// import UserSignup from './pages/UserSignup'
// import Captainlogin from './pages/Captainlogin'
// import CaptainSignup from './pages/CaptainSignup'
// import Home from './pages/Home'
// import UserProtectWrapper from './pages/UserProtectWrapper'
// import UserLogout from './pages/UserLogout'
// import CaptainHome from './pages/CaptainHome'
// import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
// import CaptainLogout from './pages/CaptainLogout'
// import Riding from './pages/Riding'
// import CaptainRiding from './pages/CaptainRiding'
// import 'remixicon/fonts/remixicon.css'
// import SwitchUser from './pages/SwitchUser'
// import WelcomeScreen from './pages/WelcomeScreen';
// import Service from './pages/Service';
// import Activity from './pages/Activity';
// import Account from './pages/Account';

// // import Footer from './components/Footer';

// const App = () => {

//   return (
//     <div>
//       <Routes>
//         <Route path='/' element={<Start />} />
//         {/* <Route path='/WelcomeScreen' element={<WelcomeScreen />} /> */}
//         <Route path='/SwitchUser' element={<SwitchUser />} />
//         <Route path='/login' element={<UserLogin />} />
//         <Route path='/riding' element={<Riding />} />
//         <Route path='/captain-riding' element={<CaptainRiding />} />

//         <Route path='/signup' element={<UserSignup />} />
//         <Route path='/captain-login' element={<Captainlogin />} />
//         <Route path='/captain-signup' element={<CaptainSignup />} />
//         {/* <Route path="/Footer" element={<Footer />} /> */}
//         <Route path='/WelcomeScreen'
//           element={
//             <UserProtectWrapper>
//               <WelcomeScreen />
//             </UserProtectWrapper>
//           } />
//         <Route path='/home'
//           element={
//             <UserProtectWrapper>
//               <Home />
//             </UserProtectWrapper>
//           } />
//         <Route path='/user/logout'
//           element={<UserProtectWrapper>
//             <UserLogout />
//           </UserProtectWrapper>
//           } />
//         <Route path='/captain-home' element={
//           <CaptainProtectWrapper>
//             <CaptainHome />
//           </CaptainProtectWrapper>

//         } />
//         <Route path='/captain/logout' element={
//           <CaptainProtectWrapper>
//             <CaptainLogout />
//           </CaptainProtectWrapper>
//         } />
//       </Routes>


//       <Route path="/" element={<WelcomeScreen />} />
//       <Route path="/service" element={<Service />} />
//       <Route path="/activity" element={<Activity />} />
//       <Route path="/account" element={<Account />} />
//     </div>
//   )
// }

// export default App
