'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { api } from '@/lib/api-client';

interface AddPassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPassengerModal({ isOpen, onClose, onSuccess }: AddPassengerModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    memberIdMasked: '',
    name: '',
    phone: '',
    dateOfBirth: '',
    age: 0,
    gender: 'M',
    weight: 0,
    mobilityLevel: 'ambulatory',
    specialNeeds: [] as string[],
    preferredLanguage: 'English',
    insuranceProvider: '',
    insuranceId: '',
    insuranceStatus: 'Active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.passengers.create(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        memberIdMasked: '',
        name: '',
        phone: '',
        dateOfBirth: '',
        age: 0,
        gender: 'M',
        weight: 0,
        mobilityLevel: 'ambulatory',
        specialNeeds: [],
        preferredLanguage: 'English',
        insuranceProvider: '',
        insuranceId: '',
        insuranceStatus: 'Active',
      });
    } catch (error) {
      console.error('Failed to create passenger:', error);
      alert('Failed to create passenger. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialNeed = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter((n) => n !== need)
        : [...prev.specialNeeds, need],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Passenger" size="xl">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Name and Member ID */}
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Member ID *
            </label>
            <input
              type="text"
              required
              value={formData.memberIdMasked}
              onChange={(e) => setFormData({ ...formData, memberIdMasked: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="MED123456"
            />
          </div>
        </div>

        {/* Phone and DOB */}
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Age, Gender, Weight */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Age *
            </label>
            <input
              type="number"
              required
              min="0"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gender *
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Weight (lbs) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Mobility Level */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Mobility Level *
          </label>
          <select
            required
            value={formData.mobilityLevel}
            onChange={(e) => setFormData({ ...formData, mobilityLevel: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ambulatory">Ambulatory</option>
            <option value="wheelchair">Wheelchair</option>
            <option value="stretcher">Stretcher</option>
            <option value="bariatric">Bariatric</option>
          </select>
        </div>

        {/* Special Needs */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Special Needs
          </label>
          <div className="flex flex-wrap gap-2">
            {['Oxygen', 'IV', 'Cardiac Monitor', 'Behavioral', 'Isolation', 'Two Person Assist'].map((need) => (
              <button
                key={need}
                type="button"
                onClick={() => toggleSpecialNeed(need)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  formData.specialNeeds.includes(need)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {need}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Language */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Preferred Language
          </label>
          <input
            type="text"
            value={formData.preferredLanguage}
            onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="English"
          />
        </div>

        {/* Insurance Information */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Insurance Information</h3>
          <div className="grid grid-cols-2 gap-4">
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
                placeholder="Blue Cross"
              />
            </div>
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
                placeholder="INS123456"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
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
            {loading ? 'Creating...' : 'Add Passenger'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
