'use client';

import { useState } from 'react';
import ffbSettingsData from '@/data/ffb-settings.json';
import Navbar from '@/components/Navbar';

interface FFBSettingFormData {
  wheelbase: string;
  wheel: string;
  car: string;
  discipline: string;
  settings: {
    strength: number;
    smoothing: number;
    minimumForce: number;
  };
}

export default function SubmitPage() {
  const [formData, setFormData] = useState<FFBSettingFormData>({
    wheelbase: '',
    wheel: '',
    car: '',
    discipline: '',
    settings: {
      strength: 0,
      smoothing: 0,
      minimumForce: 0
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add submission logic
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-gray-100">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 inline-block">
            Submit FFB Settings
          </h1>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Wheelbase Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wheelbase
                </label>
                <select
                  value={formData.wheelbase}
                  onChange={(e) => setFormData({ ...formData, wheelbase: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select a wheelbase</option>
                  {ffbSettingsData.wheelbaseOptions.map((wb) => (
                    <option key={wb} value={wb}>{wb}</option>
                  ))}
                </select>
              </div>

              {/* Wheel Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wheel
                </label>
                <select
                  value={formData.wheel}
                  onChange={(e) => setFormData({ ...formData, wheel: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select a wheel</option>
                  {ffbSettingsData.wheelbaseOptions.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Car Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Car
                </label>
                <input
                  type="text"
                  value={formData.car}
                  onChange={(e) => setFormData({ ...formData, car: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter car name"
                  required
                />
              </div>

              {/* Discipline Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discipline
                </label>
                <select
                  value={formData.discipline}
                  onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select a discipline</option>
                  {ffbSettingsData.disciplineOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* FFB Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">FFB Settings</h3>
                
                {/* Strength */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Strength ({formData.settings.strength}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.settings.strength}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        strength: parseInt(e.target.value)
                      }
                    })}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    required
                  />
                </div>

                {/* Smoothing */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Smoothing ({formData.settings.smoothing})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={formData.settings.smoothing}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, smoothing: parseInt(e.target.value) }
                    })}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    required
                  />
                </div>

                {/* Minimum Force */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Force ({formData.settings.minimumForce}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.settings.minimumForce}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, minimumForce: parseInt(e.target.value) }
                    })}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Submit Settings
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
} 