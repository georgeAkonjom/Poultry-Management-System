import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AllSales() {
  const [sales, setSales] = useState([]);
  const [batches, setBatches] = useState([]);
  const [groupByDate, setGroupByDate] = useState(false);
  const [groupByBatch, setGroupByBatch] = useState(false);

  const fetchSalesAndBatches = async () => {
    try {
      const [salesResponse, batchesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/sale/`),
        fetch(`${API_BASE_URL}/api/birdbatches/`)
      ]);
      const salesData = await salesResponse.json();
      const batchesData = await batchesResponse.json();
      const sortedSales = salesData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSales(sortedSales);
      setBatches(batchesData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSalesAndBatches();
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

  const groupedSalesByDate = sales.reduce((acc, sale) => {
    const date = sale.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(sale);
    return acc;
  }, {});

  const groupedSalesByBatch = sales.reduce((acc, sale) => {
    const batchId = sale.batch_id;
    if (!acc[batchId]) {
      acc[batchId] = [];
    }
    acc[batchId].push(sale);
    return acc;
  }, {});

  const grandTotal = sales.reduce((acc, sale) => acc + parseFloat(sale.total_amount), 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Sales</h1>
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
          Object.keys(groupedSalesByDate).map((date) => {
            const dailyTotal = groupedSalesByDate[date].reduce((acc, sale) => acc + parseFloat(sale.total_amount), 0);
            return (
              <div key={date} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{date}</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Item</th>
                      <th className="p-2 border-b">Cost Per Unit</th>
                      <th className="p-2 border-b">Quantity</th>
                      <th className="p-2 border-b">Date</th>
                      <th className="p-2 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSalesByDate[date].map((sale) => (
                      <tr key={sale.id}>
                        <td className="p-2 border-b"><Link to={`/sale/${sale.id}`} className="text-blue-600 hover:underline">{sale.item}</Link></td>
                        <td className="p-2 border-b">{sale.cost_per_unit}</td>
                        <td className="p-2 border-b">{sale.quantity}</td>
                        <td className="p-2 border-b">{sale.date}</td>
                        <td className="p-2 border-b">{sale.total_amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="p-2 border-t font-semibold text-right">Daily Total:</td>
                      <td className="p-2 border-t font-semibold">{dailyTotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )
          })
        ) : groupByBatch ? (
          Object.keys(groupedSalesByBatch).map((batchId) => {
            const batchTotal = groupedSalesByBatch[batchId].reduce((acc, sale) => acc + parseFloat(sale.total_amount), 0);
            return (
              <div key={batchId} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Batch: {batchNameMap[batchId]} (ID: {batchId})</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Item</th>
                      <th className="p-2 border-b">Cost Per Unit</th>
                      <th className="p-2 border-b">Quantity</th>
                      <th className="p-2 border-b">Date</th>
                      <th className="p-2 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSalesByBatch[batchId].map((sale) => (
                      <tr key={sale.id}>
                        <td className="p-2 border-b"><Link to={`/sale/${sale.id}`} className="text-blue-600 hover:underline">{sale.item}</Link></td>
                        <td className="p-2 border-b">{sale.cost_per_unit}</td>
                        <td className="p-2 border-b">{sale.quantity}</td>
                        <td className="p-2 border-b">{sale.date}</td>
                        <td className="p-2 border-b">{sale.total_amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="p-2 border-t font-semibold text-right">Batch Total:</td>
                      <td className="p-2 border-t font-semibold">{batchTotal.toFixed(2)}</td>
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
                <th className="p-2 border-b">Item</th>
                <th className="p-2 border-b">Price Per Unit</th>
                <th className="p-2 border-b">Quantity</th>
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="p-2 border-b"><Link to={`/sale/${sale.id}`} className="text-blue-600 hover:underline">{sale.item}</Link></td>
                  <td className="p-2 border-b">{sale.cost_per_unit}</td>
                  <td className="p-2 border-b">{sale.quantity}</td>
                  <td className="p-2 border-b">{sale.date}</td>
                  <td className="p-2 border-b">{sale.total_amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="p-2 border-t font-semibold text-right">Grand Total:</td>
                <td className="p-2 border-t font-semibold">{grandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </main>
    </div>
  );
}
