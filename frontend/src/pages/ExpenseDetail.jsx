import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ExpenseDetail() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/expenses/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExpense(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-red-600">Error: {error}</div>;
  }

  if (!expense) {
    return <div className="max-w-4xl mx-auto p-6">No expense data found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Expense Details</h1>
      </header>
      <main className="bg-white shadow rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><strong className="block text-sm font-medium">ID:</strong> {expense.id}</div>
          <div><strong className="block text-sm font-medium">Batch ID:</strong> {expense.batch_id || "N/A"}</div>
          <div><strong className="block text-sm font-medium">Expense Type:</strong> {expense.expense_type}</div>
          <div><strong className="block text-sm font-medium">Amount:</strong> ${expense.amount}</div>
          <div><strong className="block text-sm font-medium">Date:</strong> {expense.date}</div>
        </div>
        <div>
          <strong className="block text-sm font-medium">Description:</strong>
          <p className="mt-1 p-2 border rounded bg-slate-50">{expense.description || "N/A"}</p>
        </div>
      </main>
    </div>
  );
}
