import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/financesummary/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSummaryData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Finance Summary</h1>
        <Link to="/add-batch">
          <Button>Create Entry</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryData.map((batch) => {
          const profit = batch.total_sales - batch.total_expenses;
          const isProfitable = profit > 0;

          return (
            <Link to={`/batch-summary/${batch.batch_id}`} key={batch.batch_id}>
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {batch.batch_name}
                    {isProfitable ? (
                      <ArrowUpCircle className="text-green-500" />
                    ) : (
                      <ArrowDownCircle className="text-red-500" />
                    )}
                  </CardTitle>
                  <CardDescription>Batch ID: {batch.batch_id}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Total Expenses:</strong> {formatCurrency(batch.total_expenses)}
                    </p>
                    <p>
                      <strong>Total Sales:</strong> {formatCurrency(batch.total_sales)}
                    </p>
                    <p>
                      <strong>Total Losses:</strong> {formatCurrency(batch.total_losses)}
                    </p>
                    <p className={`font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                      <strong>Profit:</strong> {formatCurrency(profit)}
                    </p>
                  </div>
                </CardContent>

              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
