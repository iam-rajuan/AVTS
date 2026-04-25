// ZoomInOut.jsx
import { Locate, Plus, Minus } from "lucide-react";

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
        <Plus className="w-6 h-6" />
      </button>
      <button onClick={handleZoomOut} className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800">
        <Minus className="w-6 h-6" />
      </button>
      <button onClick={handleLocationClick} className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800">
        <Locate className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ZoomInOut;
