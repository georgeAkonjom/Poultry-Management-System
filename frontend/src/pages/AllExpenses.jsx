import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [groupByDate, setGroupByDate] = useState(false);
  const [groupByBatch, setGroupByBatch] = useState(false);

  const fetchExpensesAndBatches = async () => {
    try {
      const [expensesResponse, batchesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/expenses/`),
        fetch(`${API_BASE_URL}/api/birdbatches/`)
      ]);
      const expensesData = await expensesResponse.json();
      const batchesData = await batchesResponse.json();
      const sortedExpenses = expensesData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sortedExpenses);
      setBatches(batchesData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchExpensesAndBatches();
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

  const groupedExpensesByDate = expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  const groupedExpensesByBatch = expenses.reduce((acc, expense) => {
    const batchId = expense.batch_id;
    if (!acc[batchId]) {
      acc[batchId] = [];
    }
    acc[batchId].push(expense);
    return acc;
  }, {});

  const grandTotal = expenses.reduce((acc, expense) => acc + parseFloat(expense.total_amount), 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Expenses</h1>
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
          Object.keys(groupedExpensesByDate).map((date) => {
            const dailyTotal = groupedExpensesByDate[date].reduce((acc, expense) => acc + parseFloat(expense.total_amount), 0);
            return (
              <div key={date} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{date}</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Date</th>
                      <th className="p-2 border-b">Item</th>
                      <th className="p-2 border-b">Cost Per Unit</th>
                      <th className="p-2 border-b">Quantity</th>
                      <th className="p-2 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedExpensesByDate[date].map((expense) => (
                      <tr key={expense.id}>
                        <td className="p-2 border-b"><Link to={`/expense/${expense.id}`} className="text-blue-600 hover:underline">{expense.date}</Link></td>
                        <td className="p-2 border-b">{expense.item}</td>
                        <td className="p-2 border-b">{expense.cost_per_unit}</td>
                        <td className="p-2 border-b">{expense.quantity}</td>
                        <td className="p-2 border-b">{expense.total_amount}</td>
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
          Object.keys(groupedExpensesByBatch).map((batchId) => {
            const batchTotal = groupedExpensesByBatch[batchId].reduce((acc, expense) => acc + parseFloat(expense.total_amount), 0);
            return (
              <div key={batchId} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Batch: {batchNameMap[batchId]} (ID: {batchId})</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Date</th>
                      <th className="p-2 border-b">Item</th>
                      <th className="p-2 border-b">Cost Per Unit</th>
                      <th className="p-2 border-b">Quantity</th>
                      <th className="p-2 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedExpensesByBatch[batchId].map((expense) => (
                      <tr key={expense.id}>
                        <td className="p-2 border-b"><Link to={`/expense/${expense.id}`} className="text-blue-600 hover:underline">{expense.date}</Link></td>
                        <td className="p-2 border-b">{expense.item}</td>
                        <td className="p-2 border-b">{expense.cost_per_unit}</td>
                        <td className="p-2 border-b">{expense.quantity}</td>
                        <td className="p-2 border-b">{expense.total_amount}</td>
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
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Item</th>
                <th className="p-2 border-b">Cost Per Unit</th>
                <th className="p-2 border-b">Quantity</th>
                <th className="p-2 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="p-2 border-b"><Link to={`/expense/${expense.id}`} className="text-blue-600 hover:underline">{expense.date}</Link></td>
                  <td className="p-2 border-b">{expense.item}</td>
                  <td className="p-2 border-b">{expense.cost_per_unit}</td>
                  <td className="p-2 border-b">{expense.quantity}</td>
                  <td className="p-2 border-b">{expense.total_amount}</td>
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
