import React, { useState } from "react";
import { useForm } from "react-hook-form";
import '../index.css'

// PoultryForms.jsx
// Single-file React component with Tailwind-styled forms for:
// - BirdBatch
// - Expense
// - Income
// - Loss
// Each form console.logs the payload and POSTs to a placeholder endpoint you can replace.

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

  const onSubmit = async (data) => {
    console.log("Batch payload:", data);
    try {
      // Replace endpoint with your API
      await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
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
  );
}

/* ----------------- Expense Form ----------------- */
function ExpenseForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // ensure numeric conversion
    data.amount = parseFloat(data.amount);
    console.log("Expense payload:", data);
    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
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
  );
}

/* ----------------- Income Form ----------------- */
function IncomeForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    data.amount = parseFloat(data.amount);
    console.log("Income payload:", data);
    try {
      await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
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
  );
}

/* ----------------- Loss Form ----------------- */
function LossForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    data.quantity = parseInt(data.quantity || "0", 10);
    data.value_loss = parseFloat(data.value_loss || "0");
    console.log("Loss payload:", data);
    try {
      await fetch("/api/losses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
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
  );
}
