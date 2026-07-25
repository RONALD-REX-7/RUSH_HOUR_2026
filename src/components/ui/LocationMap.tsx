import React, { useState } from 'react';
import { Problem } from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  X,
  Globe,
  AlertCircle,
  Building2,
  Clock,
  Layers
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface LocationMapProps {
  problems: Problem[];
  onSelectProblem?: (problem: Problem) => void;
}

const getCountryData = (countryName: string, id: string) => {
  const hash = countryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const totalIssues = (hash % 50) + 1;
  const activeCases = Math.floor(totalIssues * 0.4);
  const resolved = totalIssues - activeCases;
  
  let severity = 'Low';
  let color = '#10b981';
  let densityClass = 'Low Activity';
  
  if (totalIssues > 30) {
    severity = 'High';
    color = '#ef4444';
    densityClass = 'High Activity';
  } else if (totalIssues > 15) {
    severity = 'Medium';
    color = '#eab308';
    densityClass = 'Medium Activity';
  }

  const categories = ['Infrastructure', 'Water Supply', 'Electricity', 'Public Safety', 'Roads'];
  
  return {
    name: countryName,
    id: id,
    region: ['Europe', 'Asia', 'Africa', 'Americas', 'Oceania'][hash % 5],
    totalIssues,
    activeCases,
    severity,
    color,
    densityClass,
    mostReportedCategory: categories[hash % categories.length],
    activeOrganisations: (hash % 10) + 1,
    resolutionRate: Math.round((resolved / totalIssues) * 100) + '%',
    lastUpdated: new Date(Date.now() - (hash % 100000) * 1000).toLocaleDateString(),
    flag: `https://flagcdn.com/24x18/${id.toLowerCase()}.png`
  };
};

export const LocationMap: React.FC<LocationMapProps> = ({ problems, onSelectProblem }) => {
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  
  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#07111D] flex flex-col h-[600px]">
      
      {/* Map Controls */}
      <div className="absolute left-4 top-4 z-10 flex flex-col space-y-2">
        <button 
          onClick={handleZoomIn}
          className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-lg backdrop-blur-md transition-colors shadow-lg border border-slate-700"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-lg backdrop-blur-md transition-colors shadow-lg border border-slate-700"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl">
        <div className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Issue Density</div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-xs text-slate-300 font-medium">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            🟢 Low Activity
          </div>
          <div className="flex items-center text-xs text-slate-300 font-medium">
            <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
            🟡 Medium Activity
          </div>
          <div className="flex items-center text-xs text-slate-300 font-medium">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            🔴 High Activity
          </div>
        </div>
      </div>

      {/* World Map */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <ComposableMap 
          projection="geoMercator" 
          projectionConfig={{ scale: 130 }}
          width={800}
          height={600}
        >
          <ZoomableGroup 
            zoom={position.zoom} 
            center={position.coordinates as [number, number]} 
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const countryId = geo.id || geo.properties.ISO_A2 || "US";
                  const data = getCountryData(countryName, countryId);
                  
                  const isSelected = selectedCountry?.name === data.name;
                  const isHovered = hoveredCountry?.name === data.name;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCountry(data)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => setSelectedCountry(data)}
                      style={{
                        default: {
                          fill: data.color,
                          fillOpacity: isSelected ? 1 : 0.6,
                          stroke: "#07111D",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: data.color,
                          fillOpacity: 1,
                          stroke: "#ffffff",
                          strokeWidth: 1,
                          outline: "none",
                          filter: `drop-shadow(0 0 4px ${data.color})`
                        },
                        pressed: {
                          fill: data.color,
                          fillOpacity: 1,
                          outline: "none",
                        },
                      }}
                      className="transition-all duration-300"
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Hover Tooltip Popup */}
      <AnimatePresence>
        {hoveredCountry && !selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 z-20 w-64 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-2xl pointer-events-none"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-white font-bold text-sm flex items-center">
                  <span className="mr-2 text-lg">
                    {hoveredCountry.id !== '-99' ? (
                      <img src={hoveredCountry.flag} alt="flag" className="w-5 h-auto rounded-sm object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                    ) : <Globe className="w-4 h-4 text-blue-400" />}
                  </span>
                  {hoveredCountry.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{hoveredCountry.region}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                <div className="text-[10px] text-slate-400 mb-0.5">Reported Issues</div>
                <div className="text-sm font-bold text-white">{hoveredCountry.totalIssues}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                <div className="text-[10px] text-slate-400 mb-0.5">Active Cases</div>
                <div className="text-sm font-bold text-blue-400">{hoveredCountry.activeCases}</div>
              </div>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center text-slate-400"><AlertCircle className="w-3 h-3 mr-1.5" /> Severity</span>
                <span className={`font-semibold ${hoveredCountry.severity === 'High' ? 'text-red-400' : hoveredCountry.severity === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {hoveredCountry.severity}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center text-slate-400"><Layers className="w-3 h-3 mr-1.5" /> Category</span>
                <span className="font-semibold text-white truncate max-w-[100px] text-right">{hoveredCountry.mostReportedCategory}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center text-slate-400"><Building2 className="w-3 h-3 mr-1.5" /> Orgs Active</span>
                <span className="font-semibold text-white">{hoveredCountry.activeOrganisations}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Country Sidebar / Popup */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 z-30 w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-700/50 p-6 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center mb-1">
                  {selectedCountry.id !== '-99' ? (
                      <img src={selectedCountry.flag} alt="flag" className="w-6 h-auto rounded shadow-sm mr-2" onError={(e) => e.currentTarget.style.display = 'none'} />
                    ) : <Globe className="w-5 h-5 text-blue-400 mr-2" />}
                  <h3 className="text-xl font-black text-white">{selectedCountry.name}</h3>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{selectedCountry.region}</span>
                  <span className={`px-2 py-0.5 rounded-full border font-medium ${
                    selectedCountry.severity === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                    selectedCountry.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {selectedCountry.densityClass}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCountry(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium mb-1">Total Issues</div>
                <div className="text-2xl font-black text-white">{selectedCountry.totalIssues}</div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium mb-1">Active Cases</div>
                <div className="text-2xl font-black text-blue-400">{selectedCountry.activeCases}</div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium mb-1">Resolution Rate</div>
                <div className="text-xl font-bold text-emerald-400">{selectedCountry.resolutionRate}</div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium mb-1">Active Orgs</div>
                <div className="text-xl font-bold text-purple-400">{selectedCountry.activeOrganisations}</div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Metrics</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 flex items-center"><Layers className="w-3.5 h-3.5 mr-1.5 text-blue-400"/> Most Reported Category</span>
                      <span className="font-bold text-white">{selectedCountry.mostReportedCategory}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-700/50">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-orange-400"/> Last Updated</span>
                      <span className="font-bold text-white">{selectedCountry.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                View Detailed Reports
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
