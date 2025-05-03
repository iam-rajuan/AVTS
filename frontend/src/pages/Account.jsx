// pages/Account.jsx
import React from "react";
import { NavigationFooter } from "../components/NavigationFooter";

const Account = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <h1 className="p-6 text-2xl font-bold">Account Page</h1>
      <p className="px-6">Your account settings go here</p>
      <NavigationFooter />
    </div>
  );
};

export default Account;