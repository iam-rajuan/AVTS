import React, { useState } from 'react';
import { Menu, X } from "lucide-react";

const HamburgerMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 z-20 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Demo Sidebar</h2>
          <p className="mb-4">This is a demo sidebar content.</p>
          <p className="mb-4">You can put any content here like:</p>
          <ul className="list-disc pl-5">
            <li>Navigation links</li>
            <li>Settings</li>
            <li>User profile</li>
            <li>App information</li>
          </ul>
          <button
            onClick={toggleSidebar}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default HamburgerMenu;