import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import AVTSImage from "../assets/AVTS-R-BG.png";
import { useAuth } from "../context/AuthContext";

const roles = [
  { value: "user", label: "User" },
  { value: "captain", label: "Captain" },
];

const homeByRole = {
  user: "/user/home",
  captain: "/captain/home",
};

const UserLogin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [role, setRole] = useState(searchParams.get("role") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectRole = (nextRole) => {
    setRole(nextRole);
    setSearchParams({ role: nextRole });
    setErrorMessage("");
  };

  useEffect(() => {
    setRole(searchParams.get("role") || "");
  }, [searchParams]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!role) {
      setErrorMessage("Please select a role before signing in");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        role,
        email,
        password,
      });

      const authData = response.data.data;
      setSession(authData);
      navigate(homeByRole[authData.role], { replace: true });
    } catch (error) {
      const apiMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message;
      setErrorMessage(apiMessage || "Login failed");
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-20 mb-3" src={AVTSImage} alt="" />

        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Select account role</p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => selectRole(item.value)}
                className={`rounded-lg border px-4 py-3 font-medium ${role === item.value ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="password"
          />

          {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>

        <p className="text-center">
          New here?{" "}
          <Link to={`/signup${role ? `?role=${role}` : ""}`} className="text-blue-600">
            Create new account
          </Link>
        </p>
      </div>

      <footer className="w-full px-4 pb-2 mt-auto">
        <p className="text-[10px] leading-tight text-center">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </footer>
    </div>
  );
};

export default UserLogin;
