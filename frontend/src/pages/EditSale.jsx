import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditSale() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sale/${id}/`);
        const data = await response.json();
        setSale(data);
        reset(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSale();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      await fetch(`${API_BASE_URL}/api/sale/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      navigate(-1); // Go back to the previous page
    } catch (e) {
      console.error(e);
    }
  };

  if (!sale) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Sale</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white shadow rounded p-6">
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
          <label className="block text-sm font-medium">Cost Per Unit</label>
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
          <button type="submit" className="px-4 py-2 rounded bg-slate-800 text-white">Save Changes</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-slate-100">Cancel</button>
        </div>
      </form>
    </div>
  );
}
