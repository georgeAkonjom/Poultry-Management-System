import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AllLosses() {
  const [losses, setLosses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [groupByDate, setGroupByDate] = useState(false);
  const [groupByBatch, setGroupByBatch] = useState(false);


  const fetchLossesAndBatches = async () => {
    try {
      const [lossesResponse, batchesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/losses/`),
        fetch(`${API_BASE_URL}/api/birdbatches/`)
      ]);
      const lossesData = await lossesResponse.json();
      const batchesData = await batchesResponse.json();
      const sortedLosses = lossesData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLosses(sortedLosses);
      setBatches(batchesData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLossesAndBatches();
  }, []);

  const toggleGroupByDate = () => {
    setGroupByDate(!groupByDate);
    setGroupByBatch(false);
  };

  const toggleGroupByBatch = () => {
    setGroupByBatch(!groupByBatch);
    setGroupByDate(false);
  };

  const batchNameMap = batches.reduce((acc, batch) => {
    acc[batch.id] = batch.batch_name;
    return acc;
  }, {});

  const groupedLossesByDate = losses.reduce((acc, loss) => {
    const date = loss.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(loss);
    return acc;
  }, {});

  const groupedLossesByBatch = losses.reduce((acc, loss) => {
    const batchId = loss.batch_id;
    if (!acc[batchId]) {
      acc[batchId] = [];
    }
    acc[batchId].push(loss);
    return acc;
  }, {});

  const grandTotal = losses.reduce((acc, loss) => acc + loss.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Losses</h1>
        <div>
          <button onClick={toggleGroupByDate} className={`px-3 py-1 rounded ${groupByDate ? "bg-slate-800 text-white" : "bg-slate-100"}`}>
            Group by Date
          </button>
          <button onClick={toggleGroupByBatch} className={`px-3 py-1 rounded ${groupByBatch ? "bg-slate-800 text-white" : "bg-slate-100"} ml-2`}>
            Group by Batch
          </button>
        </div>
      </header>

      <main className="bg-white shadow rounded p-6">
        {groupByDate ? (
          Object.keys(groupedLossesByDate).map((date) => {
            const dailyTotal = groupedLossesByDate[date].reduce((acc, loss) => acc + loss.quantity, 0);
            return (
              <div key={date} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{date}</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Cause</th>
                      <th className="p-2 border-b">Quantity</th>
                      <th className="p-2 border-b">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedLossesByDate[date].map((loss) => (
                      <tr key={loss.id}>
                        <td className="p-2 border-b"><Link to={`/loss/${loss.id}`} className="text-blue-600 hover:underline">{loss.cause}</Link></td>
                        <td className="p-2 border-b">{loss.quantity}</td>
                        <td className="p-2 border-b">{loss.date}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="p-2 border-t font-semibold text-right">Daily Total:</td>
                      <td className="p-2 border-t font-semibold">{dailyTotal}</td>
                      <td className="p-2 border-t"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )
          })
        ) : groupByBatch ? (
          Object.keys(groupedLossesByBatch).map((batchId) => {
            const batchTotal = groupedLossesByBatch[batchId].reduce((acc, loss) => acc + loss.quantity, 0);
            return (
              <div key={batchId} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Batch: {batchNameMap[batchId]} (ID: {batchId})</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Cause</th>
                      <th className="p-2 border-b">Quantity</th>
                      <th className="p-2 border-b">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedLossesByBatch[batchId].map((loss) => (
                      <tr key={loss.id}>
                        <td className="p-2 border-b"><Link to={`/loss/${loss.id}`} className="text-blue-600 hover:underline">{loss.cause}</Link></td>
                        <td className="p-2 border-b">{loss.quantity}</td>
                        <td className="p-2 border-b">{loss.date}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="p-2 border-t font-semibold text-right">Batch Total:</td>
                      <td className="p-2 border-t font-semibold">{batchTotal}</td>
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
                <th className="p-2 border-b">Cause</th>
                <th className="p-2 border-b">Quantity</th>
                <th className="p-2 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {losses.map((loss) => (
                <tr key={loss.id}>
                  <td className="p-2 border-b"><Link to={`/loss/${loss.id}`} className="text-blue-600 hover:underline">{loss.cause}</Link></td>
                  <td className="p-2 border-b">{loss.quantity}</td>
                  <td className="p-2 border-b">{loss.date}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-2 border-t font-semibold text-right">Grand Total:</td>
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
