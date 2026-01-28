'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { api } from '@/lib/api-client';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddVehicleModal({ isOpen, onClose, onSuccess }: AddVehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'ambulette',
    licensePlate: '',
    capacity: 4,
    wheelchairAccessible: false,
    mileage: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.vehicles.create(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        type: 'ambulette',
        licensePlate: '',
        capacity: 4,
        wheelchairAccessible: false,
        mileage: 0,
      });
    } catch (error) {
      console.error('Failed to create vehicle:', error);
      alert('Failed to create vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Vehicle" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Vehicle Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="Van 1"
          />
        </div>

        {/* License Plate */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            License Plate *
          </label>
          <input
            type="text"
            required
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="ABC-1234"
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Vehicle Type *
          </label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ambulette">Ambulette</option>
            <option value="wheelchair_van">Wheelchair Van</option>
            <option value="stretcher_van">Stretcher Van</option>
            <option value="sedan">Sedan</option>
          </select>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Capacity *
          </label>
          <input
            type="number"
            required
            min="1"
            max="20"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        {/* Wheelchair Accessible */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="wheelchairAccessible"
            checked={formData.wheelchairAccessible}
            onChange={(e) => setFormData({ ...formData, wheelchairAccessible: e.target.checked })}
            className="w-4 h-4 text-indigo-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-indigo-500"
          />
          <label htmlFor="wheelchairAccessible" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
            Wheelchair Accessible
          </label>
        </div>

        {/* Current Mileage */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Current Mileage
          </label>
          <input
            type="number"
            min="0"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="0"
          />
        </div>

        {/* Actions */}
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
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
