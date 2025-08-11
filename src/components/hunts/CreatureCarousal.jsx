import { useEffect, useState } from "react";

export const CreatureCarousel = ({ creatures }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (creatures.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % creatures.length);
    }, 3000); // 5 second timer

    return () => clearInterval(interval);
  }, [creatures.length]);

  if (!creatures || creatures.length === 0) return null;

  return (
    <div className="relative h-32 bg-gradient-to-r from-emerald-100 to-blue-100 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {creatures.map((creature, index) => (
          <div
            key={creature.id}
            className={`absolute transition-all duration-1000 ease-in-out transform ${
              index === currentIndex
                ? "opacity-100 translate-x-0 scale-100"
                : index < currentIndex
                ? "opacity-0 -translate-x-full scale-95"
                : "opacity-0 translate-x-full scale-95"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              {creature.image_url && (
                <img
                  src={creature.image_url}
                  alt={creature.name}
                  className="w-16 h-16 object-contain mb-2 drop-shadow-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              {/* <div className="text-sm font-medium text-gray-800">
                {creature.name}
              </div> */}
              {/* <div className="text-xs text-gray-600">
                {creature.experience_points} XP
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      {creatures.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {creatures.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentIndex ? "bg-emerald-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
