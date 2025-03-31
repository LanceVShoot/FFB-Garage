'use client';

import { useState } from 'react';
import ffbSettingsData from '@/data/ffb-settings.json';
import Navbar from '@/components/Navbar';

interface FFBSettingFormData {
  brand: string;
  model: string;
  car: string;
  discipline: string;
  settings: {
    strength: number;
    damping: number;
    minimumForce: number;
  };
}

export default function SubmitPage() {
  const [formData, setFormData] = useState<FFBSettingFormData>({
    brand: '',
    model: '',
    car: '',
    discipline: '',
    settings: {
      strength: 0,
      damping: 0,
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
      <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8 text-zinc-100">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 inline-block">
            Submit FFB Settings
          </h1>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brand Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Brand
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                  required
                >
                  <option value="">Select a brand</option>
                  {ffbSettingsData.brandOptions.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Model
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                  required
                >
                  <option value="">Select a model</option>
                  {ffbSettingsData.modelOptions.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Car Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Car
                </label>
                <input
                  type="text"
                  value={formData.car}
                  onChange={(e) => setFormData({ ...formData, car: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                  placeholder="Enter car name"
                  required
                />
              </div>

              {/* Discipline Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Discipline
                </label>
                <select
                  value={formData.discipline}
                  onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
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
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
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
                    className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer"
                    required
                  />
                </div>

                {/* Damping */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Damping ({formData.settings.damping})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={formData.settings.damping}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, damping: parseInt(e.target.value) }
                    })}
                    className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer"
                    required
                  />
                </div>

                {/* Minimum Force */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
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
                    className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer"
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