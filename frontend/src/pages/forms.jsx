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
          <button onClick={() => setView("income")} className={`px-3 py-1 rounded ${view === "income" ? "bg-slate-800 text-white" : "bg-slate-100"}`}>Sale</button>
          <button onClick={() => setView("loss")} className={`px-3 py-1 rounded ${view === "loss" ? "bg-slate-800 text-white" : "bg-slate-100"}`}>Loss</button>
        </nav>
      </header>

      <main className="bg-white shadow rounded p-6">
        {view === "batch" && <BatchForm />}
        {view === "expense" && <ExpenseForm />}
        {view === "income" && <SaleForm />}
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
      const sortedData = data.sort((a, b) => b.id - a.id);
      setBatches(sortedData);
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
              <th className="p-2 border-b">Batch Name</th>
              <th className="p-2 border-b">Bird Type</th>
              <th className="p-2 border-b">Quantity</th>
              <th className="p-2 border-b">Date In</th>
            </tr>
          </thead>
          <tbody>
            {batches.slice(0, 10).map((batch) => (
              <tr key={batch.id}>
                <td className="p-2 border-b"><Link to={`/batch/${batch.id}`} className="text-blue-600 hover:underline">{batch.batch_name}</Link></td>
                <td className="p-2 border-b">{batch.bird_type}</td>
                <td className="p-2 border-b">{batch.quantity}</td>
                <td className="p-2 border-b">{batch.date_in}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Link to="/all-batches" className="text-blue-600 hover:underline">View All Batches</Link>
        </div>
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
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sortedData);
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
          <label className="block text-sm font-medium">Batch ID</label>
          <input {...register("batch_id", { valueAsNumber: true, required: true })} className="mt-1 block w-40 rounded border p-2" />
          {errors.batch_id && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Item</label>
          <input {...register("item", { required: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.item && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input {...register("quantity", { required: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.quantity && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Cost Per Unit</label>
            <input type="number" step="0.01" {...register("cost_per_unit", { required: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.cost_per_unit && <span className="text-red-600 text-sm">Required</span>}
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
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Item</th>
              <th className="p-2 border-b">Cost Per Unit</th>
              <th className="p-2 border-b">Quantity</th>
              <th className="p-2 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {expenses.slice(0, 10).map((expense) => (
              <tr key={expense.id}>
                <td className="p-2 border-b"><Link to={`/expense/${expense.id}`} className="text-blue-600 hover:underline">{expense.date}</Link></td>
                <td className="p-2 border-b">{expense.item}</td>
                <td className="p-2 border-b">{expense.cost_per_unit}</td>
                <td className="p-2 border-b">{expense.quantity}</td>
                <td className="p-2 border-b">{expense.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Link to="/all-expenses" className="text-blue-600 hover:underline">View All Expenses</Link>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Sale Form ----------------- */
function SaleForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sale/`);
      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSales(sortedData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const onSubmit = async (data) => {
    data.amount = parseFloat(data.amount);
    console.log("Sale payload:", data);
    try {
      await fetch(`${API_BASE_URL}/api/sale/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchSales();
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
          <input {...register("batch_id", { valueAsNumber: true, required: true })} className="mt-1 block w-40 rounded border p-2" />
          {errors.batch_id && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Item</label>
          <input {...register("item")} className="mt-1 block w-full rounded border p-2" />
          {errors.item && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Price Per Unit</label>
          <input {...register("cost_per_unit", { required: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.cost_per_unit && <span className="text-red-600 text-sm">Required</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input type="number" step="0.01" {...register("quantity", { required: true })} className="mt-1 block w-full rounded border p-2" />
            {errors.amount && <span className="text-red-600 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input type="date" {...register("date", { required: true })} className="mt-1 block w-40 rounded border p-2" />
            {errors.date && <span className="text-red-600 text-sm">Required</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-slate-800 text-white">Save Sale</button>
          <button type="button" onClick={() => reset()} className="px-4 py-2 rounded bg-slate-100">Reset</button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Sales</h2>
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
            {sales.slice(0, 10).map((sale) => (
              <tr key={sale.id}>
                <td className="p-2 border-b"><Link to={`/sale/${sale.id}`} className="text-blue-600 hover:underline">{sale.item}</Link></td>
                <td className="p-2 border-b">{sale.cost_per_unit}</td>
                <td className="p-2 border-b">{sale.quantity}</td>
                <td className="p-2 border-b">{sale.date}</td>
                <td className="p-2 border-b">{sale.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Link to="/all-sales" className="text-blue-600 hover:underline">View All Sales</Link>
        </div>
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
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLosses(sortedData);
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
            {losses.slice(0, 10).map((loss) => (
              <tr key={loss.id}>
                <td className="p-2 border-b"><Link to={`/loss/${loss.id}`} className="text-blue-600 hover:underline">{loss.cause}</Link></td>
                <td className="p-2 border-b">{loss.quantity}</td>
                <td className="p-2 border-b">{loss.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Link to="/all-losses" className="text-blue-600 hover:underline">View All Losses</Link>
        </div>
      </div>
    </div>
  );
}
