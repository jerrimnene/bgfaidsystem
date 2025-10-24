"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, CheckCircle, AlertTriangle } from "lucide-react";

export default function InboxPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInbox() {
      try {
        const res = await fetch("http://localhost:3001/api/v1/applications");
        const data = await res.json();
        if (data.success) {
          const newApps = data.data.filter((app: any) => app.status === "NEW SUBMISSION");
          setApplications(newApps);
        } else {
          setError("Failed to load applications");
        }
      } catch {
        setError("⚠️ Could not connect to backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchInbox();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Mail className="text-blue-600" /> Program Manager Inbox
      </h1>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" /> Loading applications...
        </div>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {!loading && applications.length === 0 && (
        <p className="text-gray-500 mt-4">No new submissions yet.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {applications.map((app) => (
          <div key={app.id} className="border rounded-lg shadow-sm p-4 hover:shadow-md transition">
            <h2 className="font-semibold text-lg text-gray-800">{app.project_title}</h2>
            <p className="text-sm text-gray-500 mb-2">{app.applicant_name}</p>
            <p className="text-gray-700 mb-2">{app.description}</p>
            <p className="text-sm text-blue-600 mb-2">Amount: ${app.amount_requested}</p>
            <p className="text-xs text-gray-400">Submitted: {new Date(app.submission_date).toLocaleString()}</p>
            <div className="mt-3 flex gap-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                <CheckCircle size={14} /> Assign
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                <AlertTriangle size={14} /> Review Later
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
