'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '@/lib/api-client';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddTripModal({ isOpen, onClose, onSuccess }: AddTripModalProps) {
  const [loading, setLoading] = useState(false);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    passengerId: '',
    pickupAddress: '',
    pickupLat: 0,
    pickupLng: 0,
    dropoffAddress: '',
    dropoffLat: 0,
    dropoffLng: 0,
    scheduledTime: '',
    type: 'scheduled',
    priority: 'routine',
    status: 'unassigned',
    driverId: '',
    notes: '',
  });

  // Load passengers and drivers
  useEffect(() => {
    if (isOpen) {
      api.passengers.getAll().then((data) => setPassengers(data.passengers));
      api.drivers.getAll().then((data) => setDrivers(data.drivers));

      // Set default scheduled time to now
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setFormData(prev => ({
        ...prev,
        scheduledTime: now.toISOString().slice(0, 16)
      }));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tripData = {
        ...formData,
        driverId: formData.driverId || null,
      };

      await api.trips.create(tripData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        passengerId: '',
        pickupAddress: '',
        pickupLat: 0,
        pickupLng: 0,
        dropoffAddress: '',
        dropoffLat: 0,
        dropoffLng: 0,
        scheduledTime: '',
        type: 'scheduled',
        priority: 'routine',
        status: 'unassigned',
        driverId: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to create trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPassengers = passengers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm) ||
    p.memberIdMasked?.includes(searchTerm)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Trip" size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Passenger Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Passenger *
          </label>
          <input
            type="text"
            placeholder="Search by name, phone, or member ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-2"
          />
          <select
            required
            value={formData.passengerId}
            onChange={(e) => setFormData({ ...formData, passengerId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Select passenger</option>
            {filteredPassengers.map((passenger) => (
              <option key={passenger.id} value={passenger.id}>
                {passenger.name} - {passenger.phone} ({passenger.memberIdMasked})
              </option>
            ))}
          </select>
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Pickup Address *
          </label>
          <input
            type="text"
            required
            value={formData.pickupAddress}
            onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="123 Main St, Tampa, FL 33601"
          />
        </div>

        {/* Dropoff Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Dropoff Address *
          </label>
          <input
            type="text"
            required
            value={formData.dropoffAddress}
            onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="456 Hospital Ave, Tampa, FL 33602"
          />
        </div>

        {/* Scheduled Time, Type, Priority */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Scheduled Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="scheduled">Scheduled</option>
              <option value="discharge">Discharge</option>
              <option value="will_call">Will Call</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Priority *
            </label>
            <select
              required
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="routine">Routine</option>
              <option value="STAT">STAT</option>
            </select>
          </div>
        </div>

        {/* Driver Assignment (Optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Assign Driver (Optional)
          </label>
          <select
            value={formData.driverId}
            onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Unassigned</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.zone} ({driver.status})
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            rows={3}
            placeholder="Additional trip details..."
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
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
