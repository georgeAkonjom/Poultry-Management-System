import React from 'react';
import { useParams } from 'react-router-dom';

export default function BatchSummary() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Batch Summary for Batch ID: {id}</h1>
      <p>This page will display detailed information and graphs for batch {id}.</p>
    </div>
  );
}
