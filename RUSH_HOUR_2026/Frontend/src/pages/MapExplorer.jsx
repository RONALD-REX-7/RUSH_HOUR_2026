import React, { useEffect, useState, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../services/supabase';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; // Required from environment

const CATEGORIES = ['All', 'Environment', 'Transport', 'Healthcare', 'Education', 'Infrastructure', 'Public Safety'];

const MapExplorer = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      // Fetch problems and join with ai_analysis
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          ai_analysis (
            priority,
            severity_score,
            startup_potential
          )
        `);

      if (error) throw error;
      setProblems(data);
    } catch (err) {
      console.error('Error fetching problems for map:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = useMemo(() => {
    if (selectedCategory === 'All') return problems;
    return problems.filter(p => p.category === selectedCategory);
  }, [problems, selectedCategory]);

  const getMarkerColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444'; // Red
      case 'Medium': return '#eab308'; // Yellow
      case 'Low': return '#22c55e'; // Green
      default: return '#9ca3af'; // Gray (if no AI analysis yet)
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="h-[calc(100vh-64px)] w-full relative animate-fade-in flex flex-col">
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10] glass px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 overflow-x-auto w-[90%] md:w-auto">
        <span className="text-white font-medium text-sm mr-2 hidden md:inline-block">Filter:</span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-700/50 text-dark-200 hover:bg-dark-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <Map
        initialViewState={{
          longitude: -74.0060,
          latitude: 40.7128,
          zoom: 11
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />

        {filteredProblems.map(problem => {
          if (!problem.location) return null;
          // Location is stored as "lat,lng" from our reporting form
          const [latStr, lngStr] = problem.location.split(',');
          const lat = parseFloat(latStr);
          const lng = parseFloat(lngStr);
          
          if (isNaN(lat) || isNaN(lng)) return null;
          
          const priority = problem.ai_analysis?.[0]?.priority || 'Pending';
          const color = getMarkerColor(priority);

          return (
            <Marker
              key={problem.id}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ ...problem, lat, lng });
              }}
            >
              {/* Custom Mapbox Marker Pin */}
              <div 
                className="cursor-pointer w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
              >
                {/* Optional inner dot */}
                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
              </div>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="z-50"
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-gray-900 mb-1">{popupInfo.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{popupInfo.category}</p>
              
              <div className="bg-gray-100 p-2 rounded mb-3">
                <p className="text-xs font-semibold text-gray-800">
                  AI Priority: 
                  <span className={`ml-1 ${
                    popupInfo.ai_analysis?.[0]?.priority === 'High' ? 'text-red-600' :
                    popupInfo.ai_analysis?.[0]?.priority === 'Medium' ? 'text-yellow-600' :
                    popupInfo.ai_analysis?.[0]?.priority === 'Low' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {popupInfo.ai_analysis?.[0]?.priority || 'Pending Analysis'}
                  </span>
                </p>
                {popupInfo.ai_analysis?.[0]?.startup_potential && (
                  <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                    💡 {popupInfo.ai_analysis[0].startup_potential}
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => alert(`Redirect to problem details ID: ${popupInfo.id}`)} 
                className="w-full bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700 transition-colors"
              >
                View Opportunity Details
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapExplorer;
