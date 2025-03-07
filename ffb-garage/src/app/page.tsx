'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { FFBSetting } from '@/types/ffb-settings';
import ffbSettingsData from '@/data/ffb-settings.json';
import { ChevronLeftIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

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
      <div className="space-y-3 relative">
        <div className="relative">
          <h3 className="text-lg font-semibold text-sky-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400/50" />
            {title}
          </h3>
          <div className="absolute -left-4 -top-2 w-8 h-8 bg-sky-400/5 rounded-full blur-xl" />
        </div>

        <div className="flex flex-col space-y-2 relative">
          {displayedOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleFilter(type, option)}
              className={`flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 
                         rounded-lg cursor-pointer relative group
                         hover:shadow-lg hover:shadow-sky-500/5
                         ${filters[type].has(option)
                           ? "bg-gradient-to-r from-zinc-700/50 via-zinc-600/30 to-zinc-700/50 text-white"
                           : "text-zinc-400 hover:text-white hover:bg-zinc-700/30"
                         }`}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-200
                             ${filters[type].has(option)
                               ? "bg-sky-500 shadow-lg shadow-sky-500/50"
                               : "border border-sky-500 group-hover:border-sky-400"
                             }`}
              />
              {option}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-400/0 via-sky-400/5 to-sky-400/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
          
          {hasMore && (
            <button
              onClick={() => toggleExpand(type)}
              className="px-3 py-1.5 text-left text-sm font-medium 
                        text-sky-400 hover:text-sky-300 transition-colors cursor-pointer
                        flex items-center gap-2"
            >
              <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                {isExpanded ? '›' : '›'}
              </span>
              {isExpanded ? 'Show Less' : `${options.length - 3} More`}
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
            <div className={`lg:w-auto transition-all duration-300 relative ${
              isFilterExpanded ? 'lg:min-w-[300px]' : 'lg:w-0 lg:min-w-0'
            }`}>
              {/* Toggle Button */}
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="absolute -right-4 top-3 z-10 p-1.5 rounded-full bg-zinc-700/80 
                          border border-zinc-600/50 backdrop-blur-sm hover:bg-zinc-600/80 
                          transition-all duration-200 cursor-pointer"
              >
                {isFilterExpanded ? (
                  <ChevronLeftIcon className="w-4 h-4 text-zinc-300" />
                ) : (
                  <AdjustmentsHorizontalIcon className="w-4 h-4 text-zinc-300" />
                )}
              </button>

              {/* Filter Panel */}
              <div className={`space-y-6 sticky top-8 backdrop-blur-sm 
                              bg-gradient-to-br from-zinc-900/80 via-zinc-800/50 to-zinc-900/80
                              p-6 rounded-xl border border-zinc-700/30 
                              shadow-lg shadow-zinc-950/20
                              transition-all duration-300 relative overflow-hidden
                              ${isFilterExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:absolute'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative">
                  <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r 
                                 from-sky-300 via-blue-400 to-sky-300 pb-2 border-b border-zinc-700/30">
                    Filters
                  </h2>
                  <div className="absolute -left-2 -top-2 w-8 h-8 bg-sky-400/10 rounded-full blur-xl" />
                </div>

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

            {/* Main Content - will automatically expand when filter is collapsed */}
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
