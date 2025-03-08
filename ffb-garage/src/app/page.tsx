'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { FFBSetting } from '@/types/ffb-settings';
import ffbSettingsData from '@/data/ffb-settings.json';

// Transform the static data to match FFBSetting type
const staticSettings: FFBSetting[] = ffbSettingsData.settings.map(setting => ({
  id: setting.id,
  carName: setting.car,
  manufacturer: {
    id: 0,
    name: setting.brand
  },
  model: setting.model,
  discipline: setting.discipline,
  isManufacturerProvided: setting.is_manufacturer_provided || false,
  likes: setting.likes,
  settingValues: [
    {
      fieldId: 1,
      fieldName: 'strength',
      displayName: 'Strength',
      value: setting.settings.strength,
      minValue: 0,
      maxValue: 100,
      unit: '%'
    },
    {
      fieldId: 2,
      fieldName: 'damping',
      displayName: 'Damping',
      value: setting.settings.damping,
      minValue: 0,
      maxValue: 100,
      unit: '%'
    },
    {
      fieldId: 3,
      fieldName: 'minimumForce',
      displayName: 'Minimum Force',
      value: setting.settings.minimumForce,
      minValue: 0,
      maxValue: 100,
      unit: '%'
    }
  ]
}));

export interface SettingValue {
  fieldId: number;
  fieldName: string;
  displayName: string;
  value: number;
  minValue: number;
  maxValue: number;
  unit?: string;
}

// Add interface for filter options
interface FilterOptions {
  manufacturers: string[];
  wheelbases: string[];
  cars: string[];
  disciplines: string[];
}

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

  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // Add state for filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    manufacturers: [],
    wheelbases: [],
    cars: [],
    disciplines: []
  });

  // Update fetchFilterOptions to handle filter changes
  const fetchFilterOptions = async (currentFilters = filters) => {
    try {
      const params = new URLSearchParams();
      if (currentFilters.brand.size === 1) {
        params.set('brand', Array.from(currentFilters.brand)[0]);
      }
      if (currentFilters.model.size === 1) {
        params.set('model', Array.from(currentFilters.model)[0]);
      }
      if (currentFilters.discipline.size === 1) {
        params.set('discipline', Array.from(currentFilters.discipline)[0]);
      }

      const response = await fetch(`/api/filters?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch filter options');
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  // Initial fetch of filter options with proper dependency
  useEffect(() => {
    const initializeFilters = () => {
      fetchFilterOptions();
    };
    initializeFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // We can safely disable the exhaustive-deps rule here as we only want this to run once on mount

  const toggleFilter = (type: 'brand' | 'model' | 'discipline', value: string) => {
    setFilters(prev => {
      const newSet = new Set(prev[type]);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      const newFilters = { ...prev, [type]: newSet };
      
      // Refetch filter options with the new filters
      fetchFilterOptions(newFilters);
      
      return newFilters;
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

  const filteredSettings = staticSettings.filter((setting: FFBSetting) => {
    if (sourceFilter.size > 0) {
      const isManufacturer = setting.isManufacturerProvided === true;
      const showManufacturer = sourceFilter.has('manufacturer');
      const showCommunity = sourceFilter.has('community');
      
      if (isManufacturer && !showManufacturer) return false;
      if (!isManufacturer && !showCommunity) return false;
    }

    if (filters.brand.size > 0 && !filters.brand.has(setting.manufacturer.name)) return false;
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

  // Update FilterGroup component to not show loading state
  const FilterGroup = ({ title, options, type }: { 
    title: string, 
    options: string[], 
    type: 'brand' | 'model' | 'discipline' 
  }) => {
    const isExpanded = expandedSections[type];
    const displayedOptions = isExpanded ? options : options.slice(0, 3);
    const hasMore = options.length > 3;

    // Remove loading state display
    if (options.length === 0) {
      return (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-blue-400">{title}</h3>
          <div className="text-sm text-zinc-400">No options available</div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-blue-400">{title}</h3>
        <div className="flex flex-col space-y-2">
          {displayedOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleFilter(type, option)}
              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors rounded-lg cursor-pointer ${
                filters[type].has(option)
                  ? "bg-zinc-700/50 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700/30"
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
              className="px-3 py-1.5 text-left text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
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

        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Column */}
            <div className={`lg:w-auto transition-all duration-300 ease-in-out relative ${
              isFilterExpanded ? 'lg:min-w-[300px]' : 'lg:min-w-[40px] lg:w-[40px]'
            }`}>
              {/* Toggle Button - moved outside the collapsible area */}
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`absolute ${isFilterExpanded ? '-right-4' : 'right-2'} top-3 z-10 p-1.5 
                          rounded-full bg-zinc-700/80 border border-zinc-600/50 
                          backdrop-blur-sm hover:bg-zinc-600/80 
                          transition-all duration-200 cursor-pointer`}
              >
                {isFilterExpanded ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-4 h-4 text-zinc-300"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-4 h-4 text-zinc-300"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                )}
              </button>

              {/* Filter Panel */}
              <div className={`space-y-6 sticky top-8 backdrop-blur-sm bg-zinc-900/30 
                              p-6 rounded-xl border border-zinc-800/50 
                              transition-all duration-300 ease-in-out overflow-hidden
                              ${isFilterExpanded 
                                ? 'opacity-100 translate-x-0 w-full' 
                                : 'opacity-0 -translate-x-full w-0 invisible'
                              }`}>
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r 
                               from-sky-300 via-blue-400 to-sky-300 pb-2 border-b border-zinc-700/30">
                  Filters
                </h2>

                <div className="relative p-0.5 rounded-lg bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-sky-500/20">
                  <div className="flex rounded-lg backdrop-blur-sm overflow-hidden 
                                  bg-gradient-to-r from-zinc-900/90 to-zinc-800/90">
                    <button
                      onClick={() => toggleSourceFilter('manufacturer')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center cursor-pointer
                        ${sourceFilter.has('manufacturer')
                          ? 'bg-zinc-300/10 text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/30'
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
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/30'
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
                </div>
                
                <FilterGroup 
                  title="Brand" 
                  options={filterOptions.manufacturers} 
                  type="brand" 
                />
                
                <FilterGroup 
                  title="Model" 
                  options={filterOptions.wheelbases} 
                  type="model" 
                />
                
                <FilterGroup 
                  title="Discipline" 
                  options={filterOptions.disciplines} 
                  type="discipline" 
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:flex-1">
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
                              {setting.carName}
                            </div>
                            <h2 className="font-bold text-lg truncate text-blue-400">
                              {setting.carName}
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
                          <span className="text-white font-medium">{`${setting.manufacturer.name} ${setting.model}`}</span>
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
                            {setting.settingValues.map((value) => (
                              <div key={value.fieldId} className="grid grid-cols-[1fr_140px] items-center">
                                <span className="text-zinc-300">
                                  {value.displayName}
                                </span>
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-20 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                      style={{ 
                                        width: `${((value.value - (value.minValue || 0)) / 
                                                ((value.maxValue || 100) - (value.minValue || 0))) * 100}%` 
                                      }}
                                    />
                                  </div>
                                  <span className="text-white w-7 text-right font-medium text-sm">
                                    {value.value}{value.unit || ''}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Manufacturer provided label */}
                      {setting.isManufacturerProvided && (
                        <div className="mt-4 -mx-4 -mb-4 px-4 py-2 bg-gradient-to-r from-zinc-500/10 to-zinc-400/10 
                                      border-t border-zinc-500/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r 
                                         from-zinc-300 to-white">
                            Provided by {setting.manufacturer.name}
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
