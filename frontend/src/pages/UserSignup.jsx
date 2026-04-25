import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AVTSImage from '../assets/AVTS-R-BG.png';
import { useAuth } from '../context/AuthContext';

const roles = [
  { value: 'user', label: 'User' },
  { value: 'captain', label: 'Captain' },
];

const homeByRole = {
  user: '/user/home',
  captain: '/captain/home',
};

const UserSignup = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [role, setRole] = useState(searchParams.get('role') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectRole = (nextRole) => {
    setRole(nextRole);
    setSearchParams({ role: nextRole });
    setErrorMessage('');
  };

  useEffect(() => {
    setRole(searchParams.get('role') || '');
  }, [searchParams]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!role) {
      setErrorMessage('Please select a role before creating an account');
      return;
    }

    const payload = {
      role,
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
    };

    if (role === 'captain') {
      payload.vehicle = {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType,
      };
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`, payload);
      const authData = response.data.data;
      setSession(authData);
      navigate(homeByRole[authData.role], { replace: true });
    } catch (error) {
      const apiMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message;
      setErrorMessage(apiMessage || 'Signup failed');
    }
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-3' src={AVTSImage} alt="" />

        <div className='mb-6'>
          <p className='text-sm font-medium mb-3'>Select account role</p>
          <div className='grid grid-cols-2 gap-3'>
            {roles.map((item) => (
              <button
                key={item.value}
                type='button'
                onClick={() => selectRole(item.value)}
                className={`rounded-lg border px-4 py-3 font-medium ${role === item.value ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submitHandler}>
          <h3 className='text-lg w-1/2 font-medium mb-2'>What's your name</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='First name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder='password'
          />

          {role === 'captain' && (
            <>
              <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
              <div className='flex gap-4 mb-7'>
                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                  type="text"
                  placeholder='Vehicle Color'
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                />
                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                  type="text"
                  placeholder='Vehicle Plate'
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
              </div>
              <div className='flex gap-4 mb-7'>
                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                  type="number"
                  placeholder='Vehicle Capacity'
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                />
                <select
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="" disabled>Select Vehicle Type</option>
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </>
          )}

          {errorMessage && <p className='text-sm text-red-600 mb-4'>{errorMessage}</p>}

          <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>
            Create account
          </button>
        </form>

        <p className='text-center'>
          Already have an account? <Link to={`/login${role ? `?role=${role}` : ''}`} className='text-blue-600'>Login here</Link>
        </p>
      </div>
      <div>
        <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div >
  );
};

export default UserSignup;
