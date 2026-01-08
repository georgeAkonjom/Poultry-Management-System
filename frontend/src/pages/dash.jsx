import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/financesummary/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSummaryData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Finance Summary</h1>
        <Link
          to="/add-batch"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Entry
        </Link>
      </div>
      <div className="flex flex-wrap gap-6">
        {summaryData.map((batch) => (
          <Link
            to={`/batch-summary/${batch.batch_id}`}
            key={batch.batch_id}
            className="border border-gray-200 rounded-lg shadow-md p-6 w-80 block hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold mb-4">{batch.batch_name}</h2>
            <p className="mb-2">
              <strong className="font-medium">Total Expenses:</strong> {batch.total_expenses}
            </p>
            <p className="mb-2">
              <strong className="font-medium">Total Sales:</strong> {batch.total_sales}
            </p>
            <p className="mb-2">
              <strong className="font-medium">Total Losses:</strong> {batch.total_losses}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
