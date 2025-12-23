import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sale/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSale(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this sale record?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sale/${id}/`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        navigate("/");
      } catch (e) {
        setError(e.message);
      }
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-red-600">Error: {error}</div>;
  }

  if (!sale) {
    return <div className="max-w-4xl mx-auto p-6">No sale data found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Sale Details</h1>
        <div>
          <Link to={`/sale/edit/${id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </header>
      <main className="bg-white shadow rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><strong className="block text-sm font-medium">ID:</strong> {sale.id}</div>
          <div><strong className="block text-sm font-medium">Batch ID:</strong> {sale.batch_id}</div>
          <div><strong className="block text-sm font-medium">Sale Type:</strong> {sale.item}</div>
          <div><strong className="block text-sm font-medium">Amount:</strong> ${sale.cost_per_unit}</div>
          <div><strong className="block text-sm font-medium">Quantity:</strong> {sale.quantity}</div>
          <div><strong className="block text-sm font-medium">Date:</strong> {sale.date}</div>
        </div>
        <div>
          <strong className="block text-sm font-medium">Description:</strong>
          <p className="mt-1 p-2 border rounded bg-slate-50">{sale.description || "N/A"}</p>
        </div>
      </main>
    </div>
  );
}
