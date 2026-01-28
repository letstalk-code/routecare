'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SettingsPage() {
  const [zones, setZones] = useState<string[]>([]);
  const [newZone, setNewZone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = () => {
    // Load from localStorage
    const savedZones = localStorage.getItem('routecare_zones');
    if (savedZones) {
      setZones(JSON.parse(savedZones));
    } else {
      // Default zones
      setZones(['Tampa', 'St. Petersburg', 'New Port Richey']);
    }
    setLoading(false);
  };

  const saveZones = (newZones: string[]) => {
    localStorage.setItem('routecare_zones', JSON.stringify(newZones));
    setZones(newZones);
  };

  const addZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newZone.trim() && !zones.includes(newZone.trim())) {
      saveZones([...zones, newZone.trim()]);
      setNewZone('');
    }
  };

  const removeZone = (zone: string) => {
    if (confirm(`Remove zone "${zone}"?`)) {
      saveZones(zones.filter(z => z !== zone));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your service zones and preferences</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Zone Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Service Zones</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Manage the zones where your drivers operate. These zones will appear when creating or editing drivers.
          </p>

          {/* Add Zone Form */}
          <form onSubmit={addZone} className="flex gap-3 mb-6">
            <input
              type="text"
              value={newZone}
              onChange={(e) => setNewZone(e.target.value)}
              placeholder="Enter new zone name"
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Zone
            </button>
          </form>

          {/* Zone List */}
          <div className="space-y-2">
            {zones.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No zones configured. Add your first zone above.
              </div>
            ) : (
              zones.map((zone) => (
                <div
                  key={zone}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                  <span className="text-slate-900 dark:text-white font-medium">{zone}</span>
                  <button
                    onClick={() => removeZone(zone)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-6 bg-blue-50/50 dark:bg-blue-900/20"
        >
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">About Zones</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Zones are stored locally in your browser. When you add or edit drivers, they will see these zone options in the dropdown menu.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
