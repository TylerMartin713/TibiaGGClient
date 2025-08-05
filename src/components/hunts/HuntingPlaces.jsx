import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllHuntingPlaces } from "../../services/HuntingPlaceServices.jsx";

export const HuntingPlaces = () => {
  const [huntingPlaces, setHuntingPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleHuntingPlaceClick = (huntingPlaceId) => {
    navigate(`/hunting-places/${huntingPlaceId}`);
  };

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Hunting Places</h1>
          <button
            onClick={() => navigate("/hunting-places/create")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Add New Place
          </button>
        </div>

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
                onClick={() => handleHuntingPlaceClick(place.id)}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {place.location_name || "Unnamed Place"}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {place.description || "No description available"}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-medium">
                    Level: {place.recommended_level}
                  </span>
                  {place.location_name && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      📍 {place.location_name}
                    </span>
                  )}
                  {place.raw_exp && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                      {place.raw_exp.toLocaleString()} XP/h
                    </span>
                  )}
                  {place.est_profit && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                      {place.est_profit.toLocaleString()} gp/h
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">
                    By: {place.user_username || "Unknown"}
                  </span>
                  <span className="text-emerald-600 text-sm font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
