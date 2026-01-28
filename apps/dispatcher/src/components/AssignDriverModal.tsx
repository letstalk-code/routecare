'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '@/lib/api-client';

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tripId: string;
}

export function AssignDriverModal({ isOpen, onClose, onSuccess, tripId }: AssignDriverModalProps) {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadDrivers();
    }
  }, [isOpen]);

  const loadDrivers = async () => {
    try {
      const data = await api.drivers.getAll();
      setDrivers(data.drivers);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId) return;

    setLoading(true);
    try {
      await api.trips.assign(tripId, selectedDriverId);
      onSuccess();
      onClose();
      setSelectedDriverId('');
    } catch (error) {
      console.error('Failed to assign driver:', error);
      alert('Failed to assign driver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Driver to Trip" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select Driver *
          </label>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {drivers.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No drivers available
              </div>
            ) : (
              drivers.map((driver) => (
                <label
                  key={driver.id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedDriverId === driver.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="driver"
                    value={driver.id}
                    checked={selectedDriverId === driver.id}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {driver.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          driver.status === 'available'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : driver.status === 'on_trip'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {driver.status === 'available'
                          ? 'Available'
                          : driver.status === 'on_trip'
                          ? 'On Trip'
                          : 'Off Duty'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {driver.zone} • {driver.vehicle?.name || 'No vehicle'}
                    </div>
                    {driver.certifications && driver.certifications.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {driver.certifications.map((cert: string) => (
                          <span
                            key={cert}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !selectedDriverId}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Assigning...' : 'Assign Driver'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
