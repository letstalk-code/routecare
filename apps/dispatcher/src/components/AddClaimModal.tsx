'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '@/lib/api-client';

interface AddClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddClaimModal({ isOpen, onClose, onSuccess }: AddClaimModalProps) {
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    tripId: '',
    patientName: '',
    insuranceProvider: '',
    insuranceId: '',
    totalCharge: '',
    status: 'ready_to_bill' as 'ready_to_bill' | 'approved' | 'paid' | 'rejected',
  });

  // Load trips when modal opens
  useEffect(() => {
    if (isOpen) {
      api.trips.getAll().then((data) => {
        // Filter completed trips that might need claims
        const completedTrips = data.trips.filter(
          (trip: any) => trip.status === 'completed' || trip.status === 'on_trip' || trip.status === 'assigned'
        );
        setTrips(completedTrips);
      });
    }
  }, [isOpen]);

  // Auto-fill patient info when trip is selected
  useEffect(() => {
    const selectedTrip = trips.find((t) => t.id === formData.tripId);
    if (selectedTrip?.passenger) {
      setFormData((prev) => ({
        ...prev,
        patientName: selectedTrip.passenger.name || '',
        insuranceProvider: selectedTrip.passenger.insuranceProvider || '',
        insuranceId: selectedTrip.passenger.insuranceId || '',
      }));
    }
  }, [formData.tripId, trips]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.claims.create({
        ...formData,
        totalCharge: parseFloat(formData.totalCharge),
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        tripId: '',
        patientName: '',
        insuranceProvider: '',
        insuranceId: '',
        totalCharge: '',
        status: 'ready_to_bill',
      });
    } catch (error) {
      console.error('Failed to create claim:', error);
      alert('Failed to create claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Claim" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trip Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Trip *
          </label>
          <select
            required
            value={formData.tripId}
            onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Select a trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.id} - {trip.passenger?.name} ({trip.type})
              </option>
            ))}
          </select>
        </div>

        {/* Patient Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Patient Name *
          </label>
          <input
            type="text"
            required
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="John Doe"
          />
        </div>

        {/* Insurance Provider */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Insurance Provider *
          </label>
          <input
            type="text"
            required
            value={formData.insuranceProvider}
            onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="Blue Cross Blue Shield"
          />
        </div>

        {/* Insurance ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Insurance ID *
          </label>
          <input
            type="text"
            required
            value={formData.insuranceId}
            onChange={(e) => setFormData({ ...formData, insuranceId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="ABC123456789"
          />
        </div>

        {/* Total Charge */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Total Charge *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 dark:text-slate-400">$</span>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.totalCharge}
              onChange={(e) => setFormData({ ...formData, totalCharge: e.target.value })}
              className="w-full pl-7 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Status *
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ready_to_bill">Ready to Bill</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Claim'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
