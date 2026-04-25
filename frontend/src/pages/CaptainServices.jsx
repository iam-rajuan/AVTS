import React from "react";
import { NavigationFooter } from "../components/NavigationFooter";

const CaptainServices = () => {
  const jobs = [
    { id: 1, title: "Standby", detail: "Waiting for new ride requests", status: "Active" },
    { id: 2, title: "Dispatch queue", detail: "No pending assignments right now", status: "Idle" },
  ];

  return (
    <div className="bg-gray-950 min-h-screen text-white pb-20">
      <header className="px-6 pt-8 pb-4 border-b border-gray-800">
        <h1 className="text-2xl font-semibold">Captain Jobs</h1>
        <p className="text-sm text-gray-400 mt-1">Service queue and current dispatch visibility.</p>
      </header>

      <main className="px-6 py-5 space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">{job.title}</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                {job.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">{job.detail}</p>
          </div>
        ))}
      </main>

      <NavigationFooter role="captain" />
    </div>
  );
};

export default CaptainServices;
