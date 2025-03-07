'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { FFBSetting } from '@/types/ffb-settings';
import ffbSettingsData from '@/data/ffb-settings.json';

export default function Home() {
  const [filters, setFilters] = useState({ 
    brand: new Set<string>(),
    model: new Set<string>(),
    discipline: new Set<string>(),
  });

  const [sourceFilter, setSourceFilter] = useState<Set<'manufacturer' | 'community'>>(
    new Set(['manufacturer', 'community'])
  );

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: false,
    model: false,
    discipline: false,
  });

  const [sortBy, setSortBy] = useState('drivers'); 

  const toggleFilter = (type: 'brand' | 'model' | 'discipline', value: string) => {
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

  const toggleExpand = (type: 'brand' | 'model' | 'discipline') => {
    setExpandedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const toggleSourceFilter = (source: 'manufacturer' | 'community') => {
    setSourceFilter(prev => {
      const newSet = new Set(prev);
      if (newSet.has(source)) {
        if (newSet.size > 1) {
          newSet.delete(source);
        }
      } else {
        newSet.add(source);
      }
      return newSet;
    });
  };

  const filteredSettings = ffbSettingsData.settings.filter((setting: FFBSetting) => {
    if (sourceFilter.size > 0) {
      const isManufacturer = setting.is_manufacturer_provided === true;
      const showManufacturer = sourceFilter.has('manufacturer');
      const showCommunity = sourceFilter.has('community');
      
      if (isManufacturer && !showManufacturer) return false;
      if (!isManufacturer && !showCommunity) return false;
    }

    if (filters.brand.size > 0 && !filters.brand.has(setting.brand)) return false;
    if (filters.model.size > 0 && !filters.model.has(setting.model)) return false;
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
    type: 'brand' | 'model' | 'discipline' 
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
              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                filters[type].has(option)
                  ? "bg-zinc-700/50 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <div 
                className={`w-2 h-2 rounded-full ${
                  filters[type].has(option)
                    ? "bg-sky-500"
                    : "border border-sky-500"
                }`}
              />
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
      <main className="min-h-screen bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 p-8 text-zinc-100">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-transparent rotate-12 blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/5 via-transparent to-transparent -rotate-12 blur-3xl" />
        </div>

        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Filters */}
            <div className="lg:w-1/5">
              <div className="space-y-6 sticky top-8 backdrop-blur-sm bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50">
                <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Filters
                </h2>

                <div className="flex bg-gradient-to-r from-zinc-500/10 to-zinc-400/10 rounded-lg 
                               border border-zinc-500/20 backdrop-blur-sm overflow-hidden">
                  <button
                    onClick={() => toggleSourceFilter('manufacturer')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center
                      ${sourceFilter.has('manufacturer')
                        ? 'bg-zinc-300/10 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                      }
                      border-r border-zinc-500/20`}
                  >
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        sourceFilter.has('manufacturer')
                          ? "bg-sky-500"
                          : "border border-sky-500"
                      }`}
                    />
                    Manufacturer
                  </button>
                  <button
                    onClick={() => toggleSourceFilter('community')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center
                      ${sourceFilter.has('community')
                        ? 'bg-zinc-300/10 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                      }`}
                  >
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        sourceFilter.has('community')
                          ? "bg-sky-500"
                          : "border border-sky-500"
                      }`}
                    />
                    Community
                  </button>
                </div>
                
                <FilterGroup 
                  title="Brand" 
                  options={ffbSettingsData.brandOptions} 
                  type="brand" 
                />
                
                <FilterGroup 
                  title="Model" 
                  options={ffbSettingsData.modelOptions} 
                  type="model" 
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
              <div className="flex justify-end mb-6 items-center gap-3 backdrop-blur-sm bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                <label className="text-sm text-zinc-300">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white
                            focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 focus:outline-none
                            cursor-pointer backdrop-blur-sm"
                >
                  <option value="drivers">Drivers</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedSettings.map((setting: FFBSetting) => {
                  // Extract manufacturer name from wheelbase (everything before first space)
                  const manufacturer = setting.is_manufacturer_provided 
                    ? setting.brand
                    : null;

                  return (
                    <div key={setting.id} 
                         className="relative overflow-hidden rounded-xl bg-zinc-900/30 backdrop-blur-sm p-4
                                  border border-zinc-800/50 group hover:border-blue-500/50
                                  shadow-lg hover:shadow-blue-500/10
                                  transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div className="relative max-w-[85%] pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0">
                              {setting.car}
                            </div>
                            <h2 className="font-bold text-lg truncate text-blue-400">
                              {setting.car}
                            </h2>
                          </div>
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
                      </div>

                      <div className="space-y-1.5 text-sm mt-3">
                        <p className="flex justify-between items-center">
                          <span className="text-zinc-300">Wheelbase</span>
                          <span className="text-white font-medium">{`${setting.brand} ${setting.model}`}</span>
                        </p>
                        <p className="flex justify-between items-center">
                          <span className="text-zinc-300">Discipline</span>
                          <span className="text-white font-medium">{setting.discipline}</span>
                        </p>
                        
                        <div className="mt-3 pt-3 border-t border-zinc-600/30">
                          <h3 className="text-base font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                            FFB Settings
                          </h3>
                          <div className="space-y-1.5">
                            {Object.entries(setting.settings).map(([key, value]) => (
                              <div key={key} className="grid grid-cols-[1fr_140px] items-center">
                                <span className="text-zinc-300">
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

                      {/* Manufacturer provided label */}
                      {setting.is_manufacturer_provided && (
                        <div className="mt-4 -mx-4 -mb-4 px-4 py-2 bg-gradient-to-r from-zinc-500/10 to-zinc-400/10 
                                      border-t border-zinc-500/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r 
                                         from-zinc-300 to-white">
                            Provided by {manufacturer}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
