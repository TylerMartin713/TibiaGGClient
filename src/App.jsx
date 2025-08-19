import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllVocations } from "./services/VocationServices.jsx";
import { GetAllHuntingPlaces } from "./services/HuntingPlaceServices.jsx";

export const App = () => {
  const [vocations, setVocations] = useState([]);
  const [huntingPlaces, setHuntingPlaces] = useState([]);
  const [currentHuntIndex, setCurrentHuntIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vocationsData, huntingPlacesData] = await Promise.all([
          GetAllVocations(),
          GetAllHuntingPlaces(),
        ]);
        setVocations(vocationsData);
        setHuntingPlaces(huntingPlacesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Carousel timer - advance every 3 seconds
  useEffect(() => {
    if (huntingPlaces.length > 0) {
      const timer = setInterval(() => {
        setCurrentHuntIndex((prev) => (prev + 1) % huntingPlaces.length);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [huntingPlaces.length]);

  const handleHuntingPlaceClick = (huntId) => {
    navigate(`/hunting-places/${huntId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-amber-400">TibiaGG</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Your ultimate Tibia gaming hub
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Discover the best hunting places, quest guides, and character tools
            for all vocations. Whether you're a mighty Knight, mystical
            Sorcerer, nature-loving Druid, skilled Paladin, or peaceful Monk -
            we have guides tailored for you!
          </p>
        </div>

        {/* Vocations Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Guides for All Vocations
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Specialized content for every playstyle
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl mx-auto">
            {vocations.map((vocation) => (
              <div
                key={vocation.id}
                className="group flex flex-col items-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-amber-500 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate("/hunting-places")}
              >
                <div className="w-20 h-20 mb-4 flex items-center justify-center bg-gray-700 rounded-full group-hover:bg-gray-600 transition-colors">
                  {vocation.image_url ? (
                    <img
                      src={vocation.image_url}
                      alt={vocation.name}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "block";
                      }}
                    />
                  ) : null}
                  <div
                    className="text-3xl"
                    style={{
                      display: vocation.image_url ? "none" : "block",
                    }}
                  >
                    ⚔️
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {vocation.name}
                </h3>
                <p className="text-gray-400 text-center mt-2 text-sm">
                  Specialized hunting guides
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hunting Places Carousel */}
        {huntingPlaces.length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Featured Hunting Places
            </h2>
            <p className="text-center text-gray-400 mb-12">
              Discover amazing hunting spots from our community
            </p>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {huntingPlaces[currentHuntIndex]?.location_name ||
                        "Unnamed Place"}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Level{" "}
                        {huntingPlaces[currentHuntIndex]?.recommended_level}+
                      </span>
                      {huntingPlaces[currentHuntIndex]?.vocation_name && (
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {huntingPlaces[currentHuntIndex]?.vocation_name}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {huntingPlaces[currentHuntIndex]?.description ||
                      "No description available"}
                  </p>

                  {/* Creature Images */}
                  {huntingPlaces[currentHuntIndex]?.creatures &&
                    huntingPlaces[currentHuntIndex].creatures.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-300 mb-3">
                          Creatures:
                        </h4>
                        <div className="flex justify-center gap-3  pb-2">
                          {huntingPlaces[currentHuntIndex].creatures.map(
                            (creature) => (
                              <div
                                key={creature.id}
                                className="flex-shrink-0 group relative"
                                title={`${creature.name} - ${creature.hitpoints} HP - ${creature.experience_points} XP`}
                              >
                                <div className="w-16 h-16 bg-gray-700 rounded-lg border-2 border-amber-600 p-2 group-hover:border-amber-400 transition-colors shadow-lg">
                                  <img
                                    src={creature.image_url}
                                    alt={creature.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.target.src =
                                        "/images/placeholder-creature.png";
                                    }}
                                  />
                                </div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-gray-600">
                                  {creature.name}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div className="flex flex-wrap gap-4 mb-6">
                    {huntingPlaces[currentHuntIndex]?.raw_exp && (
                      <div className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                        <span className="font-semibold">
                          {huntingPlaces[
                            currentHuntIndex
                          ].raw_exp.toLocaleString()}
                        </span>
                        <span className="text-purple-200 ml-1">XP/h</span>
                      </div>
                    )}
                    {huntingPlaces[currentHuntIndex]?.est_profit && (
                      <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg">
                        <span className="font-semibold">
                          {huntingPlaces[
                            currentHuntIndex
                          ].est_profit.toLocaleString()}
                        </span>
                        <span className="text-yellow-200 ml-1">GP/h</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">
                        By:{" "}
                        {huntingPlaces[currentHuntIndex]?.user_username ||
                          "Unknown"}
                      </span>
                      <div className="flex space-x-2">
                        {huntingPlaces.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentHuntIndex
                                ? "bg-amber-400"
                                : "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleHuntingPlaceClick(
                          huntingPlaces[currentHuntIndex]?.id
                        )
                      }
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5-5 5M6 12h12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() =>
                  setCurrentHuntIndex(
                    (prev) =>
                      (prev - 1 + huntingPlaces.length) % huntingPlaces.length
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setCurrentHuntIndex(
                    (prev) => (prev + 1) % huntingPlaces.length
                  )
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/hunting-places")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Browse Hunting Places
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Manage Characters
            </button>
          </div>
        </div>

        {/* Footer removed - handled by Authorized component */}
      </div>
    </div>
  );
};
