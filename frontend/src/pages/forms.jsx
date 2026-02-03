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
          <Button onClick={() => setView("batch")} variant={view === "batch" ? "default" : "outline"}>Batch</Button>
          <Button onClick={() => setView("expense")} variant={view === "expense" ? "default" : "outline"}>Expense</Button>
          <Button onClick={() => setView("income")} variant={view === "income" ? "default" : "outline"}>Sale</Button>
          <Button onClick={() => setView("loss")} variant={view === "loss" ? "default" : "outline"}>Loss</Button>
        </nav>
      </header>

      <main>
        {view === "batch" && <BatchForm />}
        {view === "expense" && <ExpenseForm />}
        {view === "income" && <SaleForm />}
        {view === "loss" && <LossForm />}
      </main>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatCurrency } from "@/lib/utils";

const batchFormSchema = z.object({
  batch_name: z.string().min(2, {
    message: "Batch name must be at least 2 characters.",
  }),
  bird_type: z.string().min(2, {
    message: "Bird type must be at least 2 characters.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  cost_per_bird: z.coerce.number().min(0.01, {
    message: "Cost per bird must be at least 0.01.",
  }),
  date_in: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  notes: z.string().optional(),
});

/* ----------------- Batch Form ----------------- */
function BatchForm() {
  const form = useForm({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      batch_name: "",
      bird_type: "",
      quantity: 0,
      cost_per_bird: 0,
      date_in: "",
      notes: "",
    },
  });
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
      form.reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Batch</CardTitle>
          <CardDescription>Enter the details of the new poultry batch.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="batch_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Broilers Week 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bird_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bird Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cobb 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost_per_bird"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Per Bird</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 3.50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="date_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date In</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Any additional notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Batch</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

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

const expenseFormSchema = z.object({
  batch_id: z.coerce.number().min(1, {
    message: "Batch ID is required.",
  }),
  item: z.string().min(2, {
    message: "Item must be at least 2 characters.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  cost_per_unit: z.coerce.number().min(0.01, {
    message: "Cost per unit must be at least 0.01.",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  description: z.string().optional(),
});

/* ----------------- Expense Form ----------------- */
function ExpenseForm() {
  const form = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      batch_id: 0,
      item: "",
      quantity: 0,
      cost_per_unit: 0,
      date: "",
      description: "",
    },
  });
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
    console.log("Expense payload:", data);
    try {
      await fetch(`${API_BASE_URL}/api/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchExpenses();
      form.reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Record an Expense</CardTitle>
          <CardDescription>Enter the details of a new expense.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="batch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch ID</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Feed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cost_per_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Per Unit</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 25.50" {...field} />
                    </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Any additional details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Expense</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

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
                <td className="p-2 border-b">{formatCurrency(expense.cost_per_unit)}</td>
                <td className="p-2 border-b">{expense.quantity}</td>
                <td className="p-2 border-b">{formatCurrency(expense.total_amount)}</td>
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

const saleFormSchema = z.object({
  batch_id: z.coerce.number().min(1, {
    message: "Batch ID is required.",
  }),
  item: z.string().min(2, {
    message: "Item must be at least 2 characters.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  cost_per_unit: z.coerce.number().min(0.01, {
    message: "Price per unit must be at least 0.01.",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
});

/* ----------------- Sale Form ----------------- */
function SaleForm() {
  const form = useForm({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      batch_id: 0,
      item: "",
      quantity: 0,
      cost_per_unit: 0,
      date: "",
    },
  });
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
    console.log("Sale payload:", data);
    try {
      await fetch(`${API_BASE_URL}/api/sale/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchSales();
      form.reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Record a Sale</CardTitle>
          <CardDescription>Enter the details of a new sale.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="batch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch ID</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Broiler Chicken" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost_per_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Unit</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 15.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Sale</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

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
                <td className="p-2 border-b">{formatCurrency(sale.cost_per_unit)}</td>
                <td className="p-2 border-b">{sale.quantity}</td>
                <td className="p-2 border-b">{sale.date}</td>
                <td className="p-2 border-b">{formatCurrency(sale.total_amount)}</td>
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

const lossFormSchema = z.object({
  batch_id: z.coerce.number().min(1, {
    message: "Batch ID is required.",
  }),
  cause: z.string().min(2, {
    message: "Cause must be at least 2 characters.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  value_loss: z.coerce.number().min(0.01, {
    message: "Value loss must be at least 0.01.",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  notes: z.string().optional(),
});

/* ----------------- Loss Form ----------------- */
function LossForm() {
  const form = useForm({
    resolver: zodResolver(lossFormSchema),
    defaultValues: {
      batch_id: 0,
      cause: "",
      quantity: 0,
      value_loss: 0,
      date: "",
      notes: "",
    },
  });
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
    console.log("Loss payload:", data);
    try {
      await fetch(`${API_BASE_URL}/api/losses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchLosses();
      form.reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Record a Loss</CardTitle>
          <CardDescription>Enter the details of a new loss.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="batch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch ID</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cause of Loss</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Disease" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value_loss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value Loss</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 50.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Any additional notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Loss</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

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
