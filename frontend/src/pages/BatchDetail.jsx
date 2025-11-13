import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BatchDetail() {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/birdbatches/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBatch(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-red-600">Error: {error}</div>;
  }

  if (!batch) {
    return <div className="max-w-4xl mx-auto p-6">No batch data found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Batch Details</h1>
      </header>
      <main className="bg-white shadow rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><strong className="block text-sm font-medium">ID:</strong> {batch.id}</div>
          <div><strong className="block text-sm font-medium">Batch Name:</strong> {batch.batch_name}</div>
          <div><strong className="block text-sm font-medium">Bird Type:</strong> {batch.bird_type}</div>
          <div><strong className="block text-sm font-medium">Quantity:</strong> {batch.quantity}</div>
          <div><strong className="block text-sm font-medium">Cost Per Bird:</strong> ${batch.cost_per_bird}</div>
          <div><strong className="block text-sm font-medium">Date In:</strong> {batch.date_in}</div>
        </div>
        <div>
          <strong className="block text-sm font-medium">Notes:</strong>
          <p className="mt-1 p-2 border rounded bg-slate-50">{batch.notes || "N/A"}</p>
        </div>
      </main>
    </div>
  );
}
