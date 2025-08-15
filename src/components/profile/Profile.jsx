import { useState, useEffect } from "react";
import { getCurrentUser } from "../services/userServices.jsx";
import { GetUserCharacters } from "../../services/CharacterServices.jsx";
import { GetAllHuntingPlaces } from "../../services/HuntingPlaceServices.jsx";
import { GetUserFavorites } from "../../services/FavoriteServices.jsx";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [favoritedHunts, setFavoritedHunts] = useState([]);
  const [userHunts, setUserHunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("characters");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user information
        const userData = await getCurrentUser();
        setUser(userData);

        // Fetch user's characters
        const charactersData = await GetUserCharacters();
        setCharacters(charactersData);

        // Fetch all hunting places to filter user's hunts
        const allHunts = await GetAllHuntingPlaces();
        const userCreatedHunts = allHunts.filter(
          (hunt) => hunt.user === userData.id
        );
        setUserHunts(userCreatedHunts);

        // Fetch user's favorited hunts
        const favoritesData = await GetUserFavorites();
        setFavoritedHunts(favoritesData);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            {/* Profile Avatar */}
            <div className="w-20 h-20 bg-amber-800 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.username}
              </h1>
              <div className="flex space-x-6 text-amber-100">
                <div className="text-center">
                  <div className="text-xl font-bold">{characters.length}</div>
                  <div className="text-sm">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{userHunts.length}</div>
                  <div className="text-sm">Hunts Created</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {favoritedHunts.length}
                  </div>
                  <div className="text-sm">Favorited</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("characters")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "characters"
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              My Characters
            </button>
            <button
              onClick={() => setActiveTab("hunts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "hunts"
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              My Hunts
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "favorites"
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Favorited Hunts
            </button>
          </nav>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Characters Tab */}
        {activeTab === "characters" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">My Characters</h2>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Add Character
              </button>
            </div>

            {characters.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No characters yet
                </div>
                <p className="text-gray-500 mb-6">
                  Add your first Tibia character to get started
                </p>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Add Your First Character
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">
                        {character.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button className="text-amber-400 hover:text-amber-300 p-1">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-300 p-1">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Vocation:</span>
                        <span className="text-white font-medium">
                          {character.vocation}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-amber-400 font-bold">
                          {character.level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-gray-300 text-sm">
                          {new Date(
                            character.last_updated
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Hunts Tab */}
        {activeTab === "hunts" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                My Hunting Places
              </h2>
              <button
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => navigate("/hunting-places/create")}
              >
                Create New Hunt
              </button>
            </div>

            {userHunts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No hunting places yet
                </div>
                <p className="text-gray-500 mb-6">
                  Share your favorite hunting spots with the community
                </p>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Create Your First Hunt
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userHunts.map((hunt) => (
                  <div
                    key={hunt.id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {hunt.location_name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2">
                          {hunt.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-amber-400">
                            Level {hunt.recommended_level}+
                          </span>
                          <span className="text-green-400">
                            {hunt.raw_exp?.toLocaleString()} XP/h
                          </span>
                          <span className="text-blue-400">
                            {hunt.est_profit?.toLocaleString()}k GP/h
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-amber-400 hover:text-amber-300 p-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-300 p-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {hunt.creatures && hunt.creatures.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hunt.creatures.slice(0, 3).map((creature) => (
                          <div
                            key={creature.id}
                            className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full text-xs"
                          >
                            {creature.image_url && (
                              <img
                                src={creature.image_url}
                                alt={creature.name}
                                className="w-4 h-4"
                              />
                            )}
                            <span className="text-gray-300">
                              {creature.name}
                            </span>
                          </div>
                        ))}
                        {hunt.creatures.length > 3 && (
                          <div className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-400">
                            +{hunt.creatures.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Favorited Hunts</h2>
            </div>

            {favoritedHunts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No favorited hunts yet
                </div>
                <p className="text-gray-500 mb-6">
                  Favorite hunting places you love to keep them handy
                </p>
                <button
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  onClick={() => navigate("/hunting-places/")}
                >
                  Browse Hunting Places
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoritedHunts.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {favorite.hunting_place.location_name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2">
                          {favorite.hunting_place.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-amber-400">
                            Level {favorite.hunting_place.recommended_level}+
                          </span>
                          <span className="text-green-400">
                            {favorite.hunting_place.raw_exp?.toLocaleString()}{" "}
                            XP/h
                          </span>
                          <span className="text-blue-400">
                            {favorite.hunting_place.est_profit?.toLocaleString()}
                            k GP/h
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Favorited on{" "}
                          {new Date(favorite.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Remove from favorites"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    {favorite.hunting_place.creatures &&
                      favorite.hunting_place.creatures.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {favorite.hunting_place.creatures
                            .slice(0, 3)
                            .map((creature) => (
                              <div
                                key={creature.id}
                                className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full text-xs"
                              >
                                {creature.image_url && (
                                  <img
                                    src={creature.image_url}
                                    alt={creature.name}
                                    className="w-4 h-4"
                                  />
                                )}
                                <span className="text-gray-300">
                                  {creature.name}
                                </span>
                              </div>
                            ))}
                          {favorite.hunting_place.creatures.length > 3 && (
                            <div className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-400">
                              +{favorite.hunting_place.creatures.length - 3}{" "}
                              more
                            </div>
                          )}
                        </div>
                      )}

                    <div className="flex space-x-2 mt-4">
                      <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
