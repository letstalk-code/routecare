'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '@/lib/api-client';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddDriverModal({ isOpen, onClose, onSuccess }: AddDriverModalProps) {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleId: '',
    zone: '',
    shiftStart: '06:00',
    shiftEnd: '14:00',
    certifications: [] as string[],
  });

  // Load vehicles
  useEffect(() => {
    if (isOpen) {
      api.vehicles.getAll().then((data) => setVehicles(data.vehicles));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.drivers.create(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        phone: '',
        vehicleId: '',
        zone: '',
        shiftStart: '06:00',
        shiftEnd: '14:00',
        certifications: [],
      });
    } catch (error) {
      console.error('Failed to create driver:', error);
      alert('Failed to create driver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Driver" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="John Doe"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="555-0123"
          />
        </div>

        {/* Vehicle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Assigned Vehicle
          </label>
          <select
            value={formData.vehicleId}
            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">No vehicle assigned</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} ({vehicle.licensePlate}) - {vehicle.type}
              </option>
            ))}
          </select>
        </div>

        {/* Zone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Zone *
          </label>
          <select
            required
            value={formData.zone}
            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Select zone</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="Central">Central</option>
          </select>
        </div>

        {/* Shift Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Shift Start *
            </label>
            <input
              type="time"
              required
              value={formData.shiftStart}
              onChange={(e) => setFormData({ ...formData, shiftStart: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Shift End *
            </label>
            <input
              type="time"
              required
              value={formData.shiftEnd}
              onChange={(e) => setFormData({ ...formData, shiftEnd: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Certifications
          </label>
          <div className="flex flex-wrap gap-2">
            {['BLS', 'CPR', 'Wheelchair Lift', 'Stretcher', 'Oxygen'].map((cert) => (
              <button
                key={cert}
                type="button"
                onClick={() => toggleCertification(cert)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  formData.certifications.includes(cert)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cert}
              </button>
            ))}
          </div>
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
            {loading ? 'Creating...' : 'Add Driver'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
