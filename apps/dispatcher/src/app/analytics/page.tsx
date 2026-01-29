'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>({ tripsByDay: [], tripsByType: [], topDrivers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          <Link href="/dashboard" className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trips by Day */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Trips (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.tripsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trips by Type */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Trips by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.tripsByType} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} label>
                  {data.tripsByType.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Drivers */}
          <div className="glass-panel rounded-xl p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Driver Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topDrivers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="tripsToday" fill="#3b82f6" name="Trips Today" />
                <Bar dataKey="onTimeRate" fill="#10b981" name="On-Time Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
