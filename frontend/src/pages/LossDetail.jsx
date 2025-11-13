import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LossDetail() {
  const { id } = useParams();
  const [loss, setLoss] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoss = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/losses/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLoss(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoss();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-red-600">Error: {error}</div>;
  }

  if (!loss) {
    return <div className="max-w-4xl mx-auto p-6">No loss data found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Loss Details</h1>
      </header>
      <main className="bg-white shadow rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><strong className="block text-sm font-medium">ID:</strong> {loss.id}</div>
          <div><strong className="block text-sm font-medium">Batch ID:</strong> {loss.batch_id}</div>
          <div><strong className="block text-sm font-medium">Cause:</strong> {loss.cause}</div>
          <div><strong className="block text-sm font-medium">Quantity:</strong> {loss.quantity}</div>
          <div><strong className="block text-sm font-medium">Value Loss:</strong> ${loss.value_loss}</div>
          <div><strong className="block text-sm font-medium">Date:</strong> {loss.date}</div>
        </div>
        <div>
          <strong className="block text-sm font-medium">Notes:</strong>
          <p className="mt-1 p-2 border rounded bg-slate-50">{loss.notes || "N/A"}</p>
        </div>
      </main>
    </div>
  );
}
