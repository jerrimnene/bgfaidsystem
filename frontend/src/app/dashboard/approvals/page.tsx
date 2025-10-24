"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, XCircle, FileText } from "lucide-react";

export default function ApprovalsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchApprovals() {
    try {
      const res = await fetch("http://localhost:3001/api/v1/applications");
      const data = await res.json();
      if (data.success) {
        const pending = data.data.filter((app: any) =>
          ["UNDER REVIEW", "MANAGER REVIEW", "PENDING APPROVAL"].includes(app.status)
        );
        setApplications(pending);
      } else {
        setError("Failed to load approvals");
      }
    } catch {
      setError("⚠️ Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApprovals();
  }, []);

  async function handleDecision(id: number, decision: "APPROVED" | "DECLINED") {
    try {
      await fetch(`http://localhost:3001/api/v1/approvals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: id, decision }),
      });
      fetchApprovals();
    } catch {
      alert("Failed to update status.");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="text-green-600" /> Application Approvals
      </h1>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" /> Loading applications...
        </div>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {!loading && applications.length === 0 && (
        <p className="text-gray-500 mt-4">No pending approvals.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {applications.map((app) => (
          <div key={app.id} className="border rounded-lg shadow-sm p-4 hover:shadow-md transition">
            <h2 className="font-semibold text-lg text-gray-800">{app.project_title}</h2>
            <p className="text-sm text-gray-500 mb-2">{app.applicant_name}</p>
            <p className="text-gray-700 mb-2">{app.description}</p>
            <p className="text-sm text-blue-600 mb-2">Amount: ${app.amount_requested}</p>
            <p className="text-xs text-gray-400 mb-3">Status: {app.status}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDecision(app.id, "APPROVED")}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => handleDecision(app.id, "DECLINED")}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
