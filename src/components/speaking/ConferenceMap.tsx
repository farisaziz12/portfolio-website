// components/speaking/ConferenceMap.js
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ConferenceMap = ({ locations = [] }) => {
  const mapContainerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Simple map implementation - in a real project, you'd use a library like Google Maps or Mapbox
    // For this mockup, we'll create a simple world map visualization
    
    if (!mapContainerRef.current) return;
    
    const container = mapContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Add map background
    const mapBg = document.createElement('div');
    mapBg.className = 'absolute inset-0 bg-blue-50 dark:bg-gray-800';
    container.appendChild(mapBg);
    
    // Create continents outlines for visual effect
    const continents = [
      { name: 'North America', path: 'M50,100 Q100,80 150,100 Q200,120 180,150 Q160,180 120,200 Q80,220 50,180 Q20,140 50,100', color: 'rgba(59, 130, 246, 0.2)' },
      { name: 'Europe', path: 'M300,100 Q350,80 400,90 Q450,100 470,130 Q490,160 450,180 Q410,200 380,180 Q350,160 330,140 Q310,120 300,100', color: 'rgba(59, 130, 246, 0.2)' },
      { name: 'Asia', path: 'M500,80 Q550,60 600,70 Q650,80 700,100 Q750,120 780,150 Q810,180 780,220 Q750,260 700,240 Q650,220 600,200 Q550,180 520,150 Q490,120 500,80', color: 'rgba(59, 130, 246, 0.2)' },
    ];
    
    // Add continents to the map
    continents.forEach(continent => {
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.classList.add('absolute', 'inset-0');
      
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute('d', continent.path);
      path.setAttribute('fill', continent.color);
      path.setAttribute('stroke', 'rgba(59, 130, 246, 0.3)');
      path.setAttribute('stroke-width', '1');
      
      svg.appendChild(path);
      container.appendChild(svg);
    });
    
    // Grid lines for visual effect
    const gridLines = document.createElement('div');
    gridLines.className = 'absolute inset-0';
    gridLines.style.backgroundImage = `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), 
                                      linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`;
    gridLines.style.backgroundSize = '40px 40px';
    container.appendChild(gridLines);
    
    // Add location markers
    locations.forEach(location => {
      if (!location.coordinates) return;
      
      // Calculate position based on rough coordinates
      // This is a simplified version - real implementation would use proper geo projections
      const [lat, lng] = location.coordinates;
      
      // Very simplified mapping from lat/lng to x/y
      // In a real app, you'd use proper map projection
      const x = ((lng + 180) / 360) * width;
      const y = ((90 - lat) / 180) * height;
      
      // Create marker
      const marker = document.createElement('div');
      marker.className = `absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getBadgeColor(location.type)}`;
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
      
      // Add pulse animation
      const pulse = document.createElement('div');
      pulse.className = `absolute w-full h-full rounded-full ${getBadgeColor(location.type, true)} animate-ping`;
      marker.appendChild(pulse);
      
      // Add click event to show info
      marker.addEventListener('click', () => {
        setSelectedLocation(location);
      });
      
      container.appendChild(marker);
    });
    
  }, [locations]);
  
  // Handle closing the info popup
  const handleClosePopup = () => {
    setSelectedLocation(null);
  };
  
  // Helper function to get badge color based on event type
  const getBadgeColor = (type, isOpacity = false) => {
    const opacity = isOpacity ? 'opacity-50' : '';
    switch ((type || '').toLowerCase()) {
      case 'conference':
        return `bg-purple-600 ${opacity}`;
      case 'workshop':
        return `bg-green-600 ${opacity}`;
      case 'meetup':
        return `bg-blue-600 ${opacity}`;
      case 'panel':
        return `bg-orange-600 ${opacity}`;
      default:
        return `bg-gray-600 ${opacity}`;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="relative w-full h-full overflow-hidden" ref={mapContainerRef}>
      {/* Map will be rendered here by the useEffect */}
      
      {/* Location Info Popup */}
      {selectedLocation && (
        <motion.div 
          className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={handleClosePopup}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex items-center mb-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getBadgeColor(selectedLocation.type)} text-white mr-2`}>
              {selectedLocation.type}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(selectedLocation.date)}
            </span>
          </div>
          
          <h3 className="font-bold mb-1">{selectedLocation.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{selectedLocation.conference}</p>
          <p className="text-sm flex items-center text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {selectedLocation.location}
          </p>
        </motion.div>
      )}
      
      {/* Disclaimer */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400">
        <p>* Map is for illustrative purposes only</p>
      </div>
    </div>
  );
};

export default ConferenceMap;