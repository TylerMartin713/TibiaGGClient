import { useEffect, useState } from "react";
import { GetAllHuntingPlaces } from "../../services/HuntingPlaceServices.jsx";
import { GetAllVocations } from "../../services/VocationServices.jsx";

export const HuntingPlaces = () => {
  const [huntingPlaces, setHuntingPlaces] = useState([]);
  const [vocations, setVocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetAllHuntingPlaces()
      .then((data) => {
        setHuntingPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load hunting places");
        setLoading(false);
        console.error("Error fetching hunting places:", err);
      });
  }, []);

  useEffect(() => {
    GetAllVocations().then(setVocations);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading hunting places...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Hunting Places
        </h1>

        {huntingPlaces.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg">
              No hunting places found.
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Add some hunting places to get started!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {huntingPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {place.name}
                </h3>
                <p className="text-gray-600 mb-4">{place.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                    Level: {place.recommended_level}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                    Recommended Vocation:
                  </span>
                  {place.location && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {place.location_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
