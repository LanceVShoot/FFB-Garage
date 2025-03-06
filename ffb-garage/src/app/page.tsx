'use client';

import { useState } from 'react';
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
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        <div className="flex flex-col space-y-2">
          {displayedOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleFilter(type, option)}
              className={`px-3 py-1.5 rounded-lg text-left text-sm font-medium transition-all duration-200 w-full
                ${filters[type].has(option)
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50'
                }`}
            >
              {option}
            </button>
          ))}
          
          {hasMore && (
            <button
              onClick={() => toggleExpand(type)}
              className="px-3 py-1.5 text-left text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
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
      <div className="relative pt-20 pb-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div className="flex flex-wrap">
            {/* Left Column - Filters */}
            <div className="w-full lg:w-1/5 px-4">
              <div className="relative flex flex-col min-w-0 break-words backdrop-blur-xl bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 shadow-xl">
                <h2 className="text-xl font-semibold mb-6 text-zinc-100">
                  Filters
                </h2>

                <div className="mt-6">
                  <div className="flex bg-zinc-800/50 rounded-lg overflow-hidden border border-zinc-700/50">
                    <button
                      onClick={() => toggleSourceFilter('manufacturer')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200
                        ${sourceFilter.has('manufacturer')
                          ? 'bg-zinc-700/50 text-zinc-100'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }
                        border-r border-zinc-700/50`}
                    >
                      Manufacturer
                    </button>
                    <button
                      onClick={() => toggleSourceFilter('community')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200
                        ${sourceFilter.has('community')
                          ? 'bg-zinc-700/50 text-zinc-100'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
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

            {/* Right Column - Settings List */}
            <div className="w-full lg:w-4/5 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 backdrop-blur-xl bg-zinc-900/50 rounded-xl border border-zinc-800/50 shadow-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800/50 text-zinc-100 rounded-lg border border-zinc-700/50 
                                 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600"
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
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-zinc-800/50 backdrop-blur-xl rounded-lg mb-6 xl:mb-0 shadow-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-colors">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-zinc-300 uppercase font-bold text-xs">
              {setting.car}
            </h5>
            <span className="font-semibold text-xl text-zinc-100">
              {setting.wheelbase}
            </span>
          </div>
          <div className="relative w-auto pl-4 flex-initial">
            <div className="text-zinc-400 p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-zinc-700/50">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>
        <p className="text-sm text-zinc-400 mt-4">
          <span className={setting.discipline === 'Road' ? 'text-emerald-400' : 'text-red-400'}>
            {setting.discipline}
          </span>
        </p>
        {setting.is_manufacturer_provided && (
          <div className="mt-4 pt-4 border-t border-zinc-700/50">
            <p className="text-sm text-zinc-400">
              Provided by {setting.wheelbase.split(' ')[0]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
