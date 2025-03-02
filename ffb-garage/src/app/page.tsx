'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { FFBSetting } from '@/types/ffb-settings';
import ffbSettingsData from '@/data/ffb-settings.json';

export default function Home() {
  const [filters, setFilters] = useState({ 
    wheelbase: new Set<string>(),
    wheel: new Set<string>(),
    discipline: new Set<string>(),
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    wheelbase: false,
    wheel: false,
    discipline: false,
  });

  const [sortBy, setSortBy] = useState('drivers'); 

  const toggleFilter = (type: 'wheelbase' | 'wheel' | 'discipline', value: string) => {
    setFilters(prev => {
      const newSet = new Set(prev[type]);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return { ...prev, [type]: newSet };
    });
  };

  const toggleExpand = (type: 'wheelbase' | 'wheel' | 'discipline') => {
    setExpandedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const filteredSettings = ffbSettingsData.settings.filter((setting: FFBSetting) => {
    if (filters.wheelbase.size > 0 && !filters.wheelbase.has(setting.wheelbase)) return false;
    if (filters.wheel.size > 0 && !filters.wheel.has(setting.wheel)) return false;
    if (filters.discipline.size > 0 && !filters.discipline.has(setting.discipline)) return false;
    return true;
  });

  const sortSettings = (settings: FFBSetting[]) => {
    switch (sortBy) {
      case 'drivers':
        return [...settings].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'newest':
        return [...settings].sort((a, b) => b.id - a.id);
      case 'oldest':
        return [...settings].sort((a, b) => a.id - b.id);
      default:
        return settings;
    }
  };

  const filteredAndSortedSettings = sortSettings(filteredSettings);

  const FilterGroup = ({ title, options, type }: { 
    title: string, 
    options: string[], 
    type: 'wheelbase' | 'wheel' | 'discipline' 
  }) => {
    const isExpanded = expandedSections[type];
    const displayedOptions = isExpanded ? options : options.slice(0, 3);
    const hasMore = options.length > 3;

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-blue-400">{title}</h3>
        <div className="flex flex-col space-y-2">
          {displayedOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleFilter(type, option)}
              className={`px-3 py-1.5 rounded-lg text-left text-sm font-medium transition-all duration-200 w-full
                ${filters[type].has(option)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
            >
              {option}
            </button>
          ))}
          
          {hasMore && (
            <button
              onClick={() => toggleExpand(type)}
              className="px-3 py-1.5 text-left text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isExpanded ? '- Show Less' : `+ ${options.length - 3} More`}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-gray-100">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rotate-12 blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/10 via-transparent to-transparent -rotate-12 blur-3xl" />
        </div>

        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Filters */}
            <div className="lg:w-1/5">
              <div className="space-y-6 sticky top-8 backdrop-blur-sm bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Filters
                </h2>
                
                <FilterGroup 
                  title="Wheelbase" 
                  options={ffbSettingsData.wheelbaseOptions} 
                  type="wheelbase" 
                />
                
                <FilterGroup 
                  title="Wheel" 
                  options={ffbSettingsData.wheelOptions} 
                  type="wheel" 
                />
                
                <FilterGroup 
                  title="Discipline" 
                  options={ffbSettingsData.disciplineOptions} 
                  type="discipline" 
                />
              </div>
            </div>

            {/* Right Column - Settings List */}
            <div className="lg:w-4/5">
              <div className="flex justify-end mb-6 items-center gap-3 backdrop-blur-sm bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <label className="text-sm text-gray-300">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                           cursor-pointer backdrop-blur-sm"
                >
                  <option value="drivers">Drivers</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedSettings.map((setting: FFBSetting) => (
                  <div key={setting.id} 
                       className="relative overflow-hidden rounded-xl bg-gray-800/30 backdrop-blur-sm p-4
                                border border-gray-700/50 group hover:border-blue-500/50
                                shadow-lg hover:shadow-blue-500/10
                                transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-end">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Image 
                            src="/images/ffb-garage-user.svg"
                            alt="User Icon"
                            width={16}
                            height={16}
                          />
                          <span className="text-[#f4c57d] text-sm">{setting.likes || 0}</span>
                        </div>
                      </div>

                      <div className="relative pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0">
                          {setting.car}
                        </div>
                        <h2 className="font-bold text-lg truncate text-blue-400">
                          {setting.car}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-sm mt-3">
                      <p className="flex justify-between items-center">
                        <span className="text-gray-300">Wheelbase</span>
                        <span className="text-white font-medium">{setting.wheelbase}</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-gray-300">Wheel</span>
                        <span className="text-white font-medium">{setting.wheel}</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-gray-300">Discipline</span>
                        <span className="text-white font-medium">{setting.discipline}</span>
                      </p>
                      
                      <div className="mt-3 pt-3 border-t border-gray-600/30">
                        <h3 className="text-base font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                          FFB Settings
                        </h3>
                        <div className="space-y-1.5">
                          {Object.entries(setting.settings).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-[1fr_140px] items-center">
                              <span className="text-gray-300">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-20 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                    style={{ width: `${(value / 100) * 100}%` }}
                                  />
                                </div>
                                <span className="text-white w-7 text-right font-medium text-sm">
                                  {value}{key === 'strength' || key === 'minimumForce' ? '%' : ''}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
