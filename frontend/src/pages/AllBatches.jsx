import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AllBatches() {
  const [batches, setBatches] = useState([]);
  const [groupByDate, setGroupByDate] = useState(false);

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birdbatches/`);
      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.date_in) - new Date(a.date_in));
      setBatches(sortedData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const toggleGroupByDate = () => {
    setGroupByDate(!groupByDate);
  };

  const groupedBatches = batches.reduce((acc, batch) => {
    const date = batch.date_in;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(batch);
    return acc;
  }, {});

  const grandTotal = batches.reduce((acc, batch) => acc + batch.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Batches</h1>
        <button onClick={toggleGroupByDate} className="px-3 py-1 rounded bg-slate-800 text-white">
          {groupByDate ? "Sort by Most Recent" : "Group by Date"}
        </button>
      </header>

      <main className="bg-white shadow rounded p-6">
        {groupByDate ? (
          Object.keys(groupedBatches).map((date) => {
            const dailyTotal = groupedBatches[date].reduce((acc, batch) => acc + batch.quantity, 0);
            return (
              <div key={date} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{date}</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Batch Name</th>
                      <th className="p-2 border-b">Bird Type</th>
                      <th className="p-2 border-b">Quantity</th>
                      <th className="p-2 border-b">Date In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedBatches[date].map((batch) => (
                      <tr key={batch.id}>
                        <td className="p-2 border-b"><Link to={`/batch/${batch.id}`} className="text-blue-600 hover:underline">{batch.batch_name}</Link></td>
                        <td className="p-2 border-b">{batch.bird_type}</td>
                        <td className="p-2 border-b">{batch.quantity}</td>
                        <td className="p-2 border-b">{batch.date_in}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2" className="p-2 border-t font-semibold text-right">Daily Total:</td>
                      <td className="p-2 border-t font-semibold">{dailyTotal}</td>
                      <td className="p-2 border-t"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )
          })
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b">Batch Name</th>
                <th className="p-2 border-b">Bird Type</th>
                <th className="p-2 border-b">Quantity</th>
                <th className="p-2 border-b">Date In</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td className="p-2 border-b"><Link to={`/batch/${batch.id}`} className="text-blue-600 hover:underline">{batch.batch_name}</Link></td>
                  <td className="p-2 border-b">{batch.bird_type}</td>
                  <td className="p-2 border-b">{batch.quantity}</td>
                  <td className="p-2 border-b">{batch.date_in}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="p-2 border-t font-semibold text-right">Grand Total:</td>
                <td className="p-2 border-t font-semibold">{grandTotal}</td>
                <td className="p-2 border-t"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </main>
    </div>
  );
}
