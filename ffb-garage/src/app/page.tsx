'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { FFBSetting } from '@/types/ffb-settings';
import ffbSettingsData from '@/data/ffb-settings.json';

export default function Home() {
  const [filters, setFilters] = useState({ 
    wheelbase: new Set<string>(),
    discipline: new Set<string>(),
  });

  const [sourceFilter, setSourceFilter] = useState<Set<'manufacturer' | 'community'>>(
    new Set(['manufacturer', 'community'])
  );

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    wheelbase: false,
    discipline: false,
  });

  const [sortBy, setSortBy] = useState('drivers'); 

  const toggleFilter = (type: 'wheelbase' | 'discipline', value: string) => {
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

  const toggleExpand = (type: 'wheelbase' | 'discipline') => {
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

    if (filters.wheelbase.size > 0 && !filters.wheelbase.has(setting.wheelbase)) return false;
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
    type: 'wheelbase' | 'discipline' 
  }) => {
    const isExpanded = expandedSections[type];
    const displayedOptions = isExpanded ? options : options.slice(0, 3);
    const hasMore = options.length > 3;

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#00e1ff]">{title}</h3>
        <div className="flex flex-col space-y-2">
          {displayedOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleFilter(type, option)}
              className={`px-3 py-1.5 rounded-lg text-left text-sm font-medium transition-all duration-200 w-full
                ${filters[type].has(option)
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
            >
              {option}
            </button>
          ))}
          
          {hasMore && (
            <button
              onClick={() => toggleExpand(type)}
              className="px-3 py-1.5 text-left text-sm font-medium text-gray-300 hover:text-gray-200 transition-colors"
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
      <div className="relative bg-blueGray-100 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div className="flex flex-wrap">
            {/* Left Column - Filters */}
            <div className="w-full lg:w-1/5 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
                <div className="flex-auto p-4">
                  <h2 className="text-blueGray-700 uppercase font-bold text-xl">
                    Filters
                  </h2>

                  <div className="mt-6">
                    <div className="flex bg-blueGray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSourceFilter('manufacturer')}
                        className={`flex-1 px-4 py-2 text-sm font-bold transition-all duration-200
                          ${sourceFilter.has('manufacturer')
                            ? 'bg-blueGray-700 text-white'
                            : 'text-blueGray-700 hover:bg-blueGray-300'
                          }
                          border-r border-blueGray-300`}
                      >
                        Manufacturer
                      </button>
                      <button
                        onClick={() => toggleSourceFilter('community')}
                        className={`flex-1 px-4 py-2 text-sm font-bold transition-all duration-200
                          ${sourceFilter.has('community')
                            ? 'bg-blueGray-700 text-white'
                            : 'text-blueGray-700 hover:bg-blueGray-300'
                          }`}
                      >
                        Community
                      </button>
                    </div>
                  </div>

                  <FilterGroup 
                    title="Wheelbase" 
                    options={ffbSettingsData.wheelbaseOptions} 
                    type="wheelbase" 
                  />
                  
                  <FilterGroup 
                    title="Discipline" 
                    options={ffbSettingsData.disciplineOptions} 
                    type="discipline" 
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Settings List */}
            <div className="w-full lg:w-4/5 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="form-select w-full px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                      >
                        <option value="drivers">Drivers</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="block w-full overflow-x-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredAndSortedSettings.map((setting: FFBSetting) => (
                      <SettingCard key={setting.id} setting={setting} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const SettingCard = ({ setting }: { setting: FFBSetting }) => {
  const manufacturer = setting.is_manufacturer_provided 
    ? setting.wheelbase.split(' ')[0]
    : null;

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">
              {setting.car}
            </h5>
            <span className="font-semibold text-xl text-blueGray-700">
              {setting.wheelbase}
            </span>
          </div>
          <div className="relative w-auto pl-4 flex-initial">
            <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-orange-500">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>
        <p className="text-sm text-blueGray-400 mt-4">
          <span className={setting.discipline === 'Road' ? 'text-emerald-500' : 'text-red-500'}>
            {setting.discipline}
          </span>
        </p>
      </div>
    </div>
  );
};
