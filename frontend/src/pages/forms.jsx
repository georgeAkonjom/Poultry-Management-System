import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import '../index.css'

// PoultryForms.jsx
// Single-file React component with Tailwind-styled forms for:
// - BirdBatch
// - Expense
// - Income
// - Loss
// Each form console.logs the payload and POSTs to a placeholder endpoint you can replace.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PoultryForms() {
  const [view, setView] = useState("batch");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Poultry Management — Forms</h1>
        <nav className="space-x-2">
          <button onClick={() => setView("batch")} className={`px-3 py-1 rounded ${view === "batch" ? "bg-slate-800 text-white" : "bg-slate-100"}`}>Batch</button>
          <button onClick={() => setView("expense")} className={`px-3 py-1 rounded ${view === "expense" ? "bg-slate-800 text-white" : "bg-slate-100"}`}>Expense</button>
          <button onClick={() => setView("income")} className={`px-3 py-1 rounded ${view === "income" ? "bg-slate-800 text-white" : "bg-slate-100"}`}>Income</button>
          <button onClick={() => setView("loss")} className={`px-3 py-1 rounded ${view === "loss" ? "bg-slate-800 text-white" : "bg-slate-100"}`}>Loss</button>
        </nav>
      </header>

      <main className="bg-white shadow rounded p-6">
        {view === "batch" && <BatchForm />}
        {view === "expense" && <ExpenseForm />}
        {view === "income" && <IncomeForm />}
        {view === "loss" && <LossForm />}
      </main>
    </div>
  );
}

/* ----------------- Batch Form ----------------- */
function BatchForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [batches, setBatches] = useState([]);

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/birdbatches/`);
      const data = await response.json();
      setBatches(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const onSubmit = async (data) => {
    console.log("Batch payload:", data);
    try {
      await fetch(`${API_BASE_URL}/api/birdbatches/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchBatches(); // Refetch batches after submission
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Batch name</label>
          <input {...register("batch_name", { required: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.batch_name && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Bird type</label>
            <input {...register("bird_type", { required: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.bird_type && <span className="text-red-600 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input type="number" {...register("quantity", { required: true, valueAsNumber: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.quantity && <span className="text-red-600 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Cost per bird</label>
            <input type="number" step="0.01" {...register("cost_per_bird", { required: true, valueAsNumber: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.cost_per_bird && <span className="text-red-600 text-sm">Required</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Date in</label>
          <input type="date" {...register("date_in", { required: true })} className="mt-1 block w-40 rounded border p-2" />
          {errors.date_in && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea {...register("notes")} className="mt-1 block w-full rounded border p-2" rows={3} />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-slate-800 text-white">Save Batch</button>
          <button type="button" onClick={() => reset()} className="px-4 py-2 rounded bg-slate-100">Reset</button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Batches</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">Bird Type</th>
              <th className="p-2 border-b">Quantity</th>
              <th className="p-2 border-b">Date In</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id}>
                <td className="p-2 border-b"><Link to={`/batch/${batch.id}`} className="text-blue-600 hover:underline">{batch.bird_type}</Link></td>
                <td className="p-2 border-b">{batch.quantity}</td>
                <td className="p-2 border-b">{batch.date_in}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------- Expense Form ----------------- */
function ExpenseForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses/`);
      const data = await response.json();
      setExpenses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onSubmit = async (data) => {
    data.amount = parseFloat(data.amount);
    console.log("Expense payload:", data);
    try {
      await fetch(`${API_BASE_URL}/api/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchExpenses();
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Batch ID (optional)</label>
          <input {...register("batch_id", { valueAsNumber: true })} className="mt-1 block w-40 rounded border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Expense type</label>
          <input {...register("expense_type", { required: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.expense_type && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input type="number" step="0.01" {...register("amount", { required: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.amount && <span className="text-red-600 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input type="date" {...register("date", { required: true })} className="mt-1 block w-40 rounded border p-2" />
            {errors.date && <span className="text-red-600 text-sm">Required</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea {...register("description")} className="mt-1 block w-full rounded border p-2" rows={2} />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-slate-800 text-white">Save Expense</button>
          <button type="button" onClick={() => reset()} className="px-4 py-2 rounded bg-slate-100">Reset</button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Expenses</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">Expense Type</th>
              <th className="p-2 border-b">Amount</th>
              <th className="p-2 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="p-2 border-b"><Link to={`/expense/${expense.id}`} className="text-blue-600 hover:underline">{expense.expense_type}</Link></td>
                <td className="p-2 border-b">{expense.amount}</td>
                <td className="p-2 border-b">{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------- Income Form ----------------- */
function IncomeForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [incomes, setIncomes] = useState([]);

  const fetchIncomes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/income/`);
      const data = await response.json();
      setIncomes(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const onSubmit = async (data) => {
    data.amount = parseFloat(data.amount);
    console.log("Income payload:", data);
    try {
      await fetch(`${API_BASE_URL}/api/income/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchIncomes();
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Batch ID (optional)</label>
          <input {...register("batch_id", { valueAsNumber: true })} className="mt-1 block w-40 rounded border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Income type</label>
          <input {...register("income_type", { required: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.income_type && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input type="number" step="0.01" {...register("amount", { required: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.amount && <span className="text-red-600 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input type="date" {...register("date", { required: true })} className="mt-1 block w-40 rounded border p-2" />
            {errors.date && <span className="text-red-600 text-sm">Required</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Buyer</label>
          <input {...register("buyer")} className="mt-1 block w-full rounded border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea {...register("description")} className="mt-1 block w-full rounded border p-2" rows={2} />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-slate-800 text-white">Save Income</button>
          <button type="button" onClick={() => reset()} className="px-4 py-2 rounded bg-slate-100">Reset</button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Incomes</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">Income Type</th>
              <th className="p-2 border-b">Amount</th>
              <th className="p-2 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id}>
                <td className="p-2 border-b"><Link to={`/income/${income.id}`} className="text-blue-600 hover:underline">{income.income_type}</Link></td>
                <td className="p-2 border-b">{income.amount}</td>
                <td className="p-2 border-b">{income.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------- Loss Form ----------------- */
function LossForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [losses, setLosses] = useState([]);

  const fetchLosses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/losses/`);
      const data = await response.json();
      setLosses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLosses();
  }, []);

  const onSubmit = async (data) => {
    data.quantity = parseInt(data.quantity || "0", 10);
    data.value_loss = parseFloat(data.value_loss || "0");
    console.log("Loss payload:", data);
    try {
      await fetch(`${API_BASE_URL}/api/losses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchLosses();
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Batch ID</label>
          <input {...register("batch_id", { required: true, valueAsNumber: true })} className="mt-1 block w-40 rounded border p-2" />
          {errors.batch_id && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Cause</label>
          <input {...register("cause", { required: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.cause && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input type="number" {...register("quantity", { required: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.quantity && <span className="text-red-600 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Value loss</label>
            <input type="number" step="0.01" {...register("value_loss", { required: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.value_loss && <span className="text-red-600 text-sm">Required</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input type="date" {...register("date", { required: true })} className="mt-1 block w-40 rounded border p-2" />
          {errors.date && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea {...register("notes")} className="mt-1 block w-full rounded border p-2" rows={2} />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-slate-800 text-white">Save Loss</button>
          <button type="button" onClick={() => reset()} className="px-4 py-2 rounded bg-slate-100">Reset</button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Losses</h2>
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
        </table>
      </div>
    </div>
  );
}
