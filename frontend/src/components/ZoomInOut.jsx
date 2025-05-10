// ZoomInOut.jsx
import { LucideLocate, LucidePlus, LucideMinus } from "lucide-react";

const ZoomInOut = ({ map, userCoords }) => {
  const handleLocationClick = () => {
    if (map && userCoords) {
      map.flyTo({
        center: [userCoords.longitude, userCoords.latitude],
        zoom: 14,
      });
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  return (
    <div className="absolute bottom-28 right-4 flex flex-col gap-2 z-20">
      <button onClick={handleZoomIn} className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800">
        <LucidePlus className="w-6 h-6" />
      </button>
      <button onClick={handleZoomOut} className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800">
        <LucideMinus className="w-6 h-6" />
      </button>
      <button onClick={handleLocationClick} className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800">
        <LucideLocate className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ZoomInOut;