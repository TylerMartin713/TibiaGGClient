import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllHuntingPlaces } from "../../services/HuntingPlaceServices.jsx";

export const HuntingPlaces = () => {
  const [huntingPlaces, setHuntingPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filter states
  const [selectedVocation, setSelectedVocation] = useState("all");
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, experience, profit
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    GetAllHuntingPlaces()
      .then((data) => {
        setHuntingPlaces(data);
        setFilteredPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load hunting places");
        setLoading(false);
        console.error("Error fetching hunting places:", err);
      });
  }, []);

  // Filter and sort places whenever filters change
  useEffect(() => {
    let filtered = [...huntingPlaces];

    // Filter by vocation
    if (selectedVocation !== "all") {
      filtered = filtered.filter(
        (place) =>
          place.vocation_name === selectedVocation ||
          (selectedVocation === "Any Vocation" &&
            (!place.vocation_name || place.vocation_name === "Any Vocation"))
      );
    }

    // Filter by level range
    if (minLevel !== "") {
      filtered = filtered.filter(
        (place) => place.recommended_level >= parseInt(minLevel)
      );
    }
    if (maxLevel !== "") {
      filtered = filtered.filter(
        (place) => place.recommended_level <= parseInt(maxLevel)
      );
    }

    // Sort places
    switch (sortBy) {
      case "experience":
        filtered.sort((a, b) => (b.raw_exp || 0) - (a.raw_exp || 0));
        break;
      case "profit":
        filtered.sort((a, b) => (b.est_profit || 0) - (a.est_profit || 0));
        break;
      case "level":
        filtered.sort((a, b) => a.recommended_level - b.recommended_level);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        break;
    }

    setFilteredPlaces(filtered);
  }, [huntingPlaces, selectedVocation, minLevel, maxLevel, sortBy]);

  // Get unique vocations from hunting places
  const getUniqueVocations = () => {
    const vocations = huntingPlaces
      .map((place) => place.vocation_name)
      .filter((vocation) => vocation && vocation !== "")
      .filter((vocation, index, array) => array.indexOf(vocation) === index);
    return vocations;
  };

  const handleHuntingPlaceClick = (huntingPlaceId) => {
    navigate(`/hunting-places/${huntingPlaceId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        {/* <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div> */}
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
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Hunting Places</h1>
            <div className="flex gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters & Sort
                {(selectedVocation !== "all" ||
                  minLevel !== "" ||
                  maxLevel !== "" ||
                  sortBy !== "newest") && (
                  <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1">
                    Active
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/hunting-places/create")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add New Place
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredPlaces.length} of {huntingPlaces.length} hunting
            places
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">
                {huntingPlaces.length === 0
                  ? "No hunting places found."
                  : "No places match your filters."}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {huntingPlaces.length === 0
                  ? "Add some hunting places to get started!"
                  : "Try adjusting your filters to see more results."}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
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

                  {/* Creatures Images */}
                  {place.creatures && place.creatures.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {place.creatures.slice(0, 4).map((creature) => (
                        <div key={creature.id} className="flex items-center">
                          {creature.image_url && (
                            <img
                              src={creature.image_url}
                              alt={creature.name}
                              className="w-8 h-8 object-contain rounded"
                              title={`${creature.name} (${creature.experience_points} XP)`}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      ))}
                      {place.creatures.length > 4 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{place.creatures.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-medium">
                      Level: {place.recommended_level}
                    </span>
                    {place.location_name && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        📍 {place.location_name}
                      </span>
                    )}
                    {place.creatures && place.creatures.length > 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        🐲 {place.creatures.length} creature
                        {place.creatures.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {place.vocation_name &&
                      place.vocation_name !== "Any Vocation" && (
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
                          {place.vocation_image_url && (
                            <img
                              src={place.vocation_image_url}
                              alt={place.vocation_name}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          {place.vocation_name}
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

        {/* Filter Popup Panel */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-gray-900/90 transition-opacity"
              onClick={() => setIsFilterOpen(false)}
            ></div>

            {/* Panel */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Filters & Sorting
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Vocation Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Vocation
                      </label>
                      <select
                        value={selectedVocation}
                        onChange={(e) => setSelectedVocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="all">All Vocations</option>
                        {getUniqueVocations().map((vocation) => (
                          <option key={vocation} value={vocation}>
                            {vocation}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Level Range Filters */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Level Range
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="number"
                            value={minLevel}
                            onChange={(e) => setMinLevel(e.target.value)}
                            placeholder="Min level"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={maxLevel}
                            onChange={(e) => setMaxLevel(e.target.value)}
                            placeholder="Max level"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="newest">Newest First</option>
                        <option value="experience">Best Experience</option>
                        <option value="profit">Best Profit</option>
                        <option value="level">Level (Low to High)</option>
                      </select>
                    </div>

                    {/* Active Filters Summary */}
                    {(selectedVocation !== "all" ||
                      minLevel !== "" ||
                      maxLevel !== "" ||
                      sortBy !== "newest") && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-emerald-800 mb-2">
                          Active Filters:
                        </h3>
                        <div className="space-y-1 text-sm text-emerald-700">
                          {selectedVocation !== "all" && (
                            <div>• Vocation: {selectedVocation}</div>
                          )}
                          {minLevel !== "" && (
                            <div>• Min Level: {minLevel}</div>
                          )}
                          {maxLevel !== "" && (
                            <div>• Max Level: {maxLevel}</div>
                          )}
                          {sortBy !== "newest" && (
                            <div>
                              • Sort:{" "}
                              {sortBy === "experience"
                                ? "Best Experience"
                                : sortBy === "profit"
                                ? "Best Profit"
                                : sortBy === "level"
                                ? "Level (Low to High)"
                                : sortBy}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedVocation("all");
                        setMinLevel("");
                        setMaxLevel("");
                        setSortBy("newest");
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
