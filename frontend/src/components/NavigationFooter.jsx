// components/NavigationFooter.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "../assets/home.svg";
import ServiceIcon from "../assets/service.svg";
import ActivityIcon from "../assets/activity.svg";
import AccountIcon from "../assets/account.svg";

export const NavigationFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/home", icon: HomeIcon },
    { name: "Service", path: "/service", icon: ServiceIcon },
    { name: "Activity", path: "/activity", icon: ActivityIcon },
    { name: "Account", path: "/account", icon: AccountIcon }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-full px-4">
        {navItems.map((item) => (
          <button 
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center w-full h-full justify-center ${isActive(item.path) ? 'text-black' : 'text-gray-400'}`}
          >
            <img 
              src={item.icon} 
              alt={item.name}
              className={`w-6 h-6 mb-1 ${isActive(item.path) ? 'filter brightness-0' : ''}`}
            />
            <span className="text-xs">{item.name}</span>
          </button>
        ))}
      </div>
    </footer>
  );
};