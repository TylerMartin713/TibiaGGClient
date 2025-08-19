import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchAndAddCreature } from "../../services/CreatureServices.jsx";

export const AddCreature = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const result = await SearchAndAddCreature(searchQuery.trim());
      setSearchResult(result);
    } catch (err) {
      console.error("Error searching creature:", err);
      setError(
        err.response?.data?.error ||
          "Creature not found or failed to fetch creature data"
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCreature = () => {
    if (searchResult) {
      // Close modal and redirect back to hunting place creation form
      navigate("/hunting-places/create");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <button
              onClick={() => navigate("/hunting-places/create")}
              className="flex items-center text-orange-500 hover:text-orange-400 mb-4"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Create Hunting Place
            </button>
            <h1 className="text-3xl font-bold text-orange-500 mb-2">
              Add Creature
            </h1>
            <p className="text-gray-400">
              Search for creatures from Tibia to add to the database. If the
              creature already exists in our database, it won't make additional
              API requests.
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="mb-4">
              <label
                htmlFor="creatureName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Creature Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="creatureName"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter creature name (e.g., Dragon, Rat, Demon)"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mb-6 bg-red-900 border border-red-700 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {searchResult && (
            <div className="mb-6 bg-gray-700 border border-gray-600 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                {searchResult.image_url && (
                  <img
                    src={searchResult.image_url}
                    alt={searchResult.name}
                    className="w-16 h-16 object-contain bg-gray-800 rounded-lg p-2"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchResult.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Hit Points:</span>
                      <span className="text-white ml-2">
                        {searchResult.hitpoints}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-white ml-2">
                        {searchResult.experience_points}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Last updated:{" "}
                    {new Date(searchResult.last_updated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddCreature}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Creature Added Successfully
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              How it works:
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Enter a creature name and click search</li>
              <li>
                • If the creature exists in our database and is up-to-date, it
                will be returned immediately
              </li>
              <li>
                • If not found or outdated, we'll fetch fresh data from Tibia's
                official API
              </li>
              <li>
                • The creature will be saved to our database for future use
              </li>
              <li>
                • You can then use this creature when creating hunting places
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
