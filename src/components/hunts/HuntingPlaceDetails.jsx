import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetHuntingPlace,
  DeleteHuntingPlace,
} from "../../services/HuntingPlaceServices.jsx";
import { getCurrentUser } from "../services/userServices.jsx";
import { HuntingPlaceComments } from "./HuntingPlaceComments.jsx";
import { CreatureCarousel } from "./CreatureCarousal.jsx";

export const HuntingPlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [huntingPlace, setHuntingPlace] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHuntingPlace = () => {
    GetHuntingPlace(id)
      .then((data) => {
        setHuntingPlace(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load hunting place details");
        setLoading(false);
        console.error("Error fetching hunting place:", err);
      });
  };

  useEffect(() => {
    loadHuntingPlace();
    // Load current user to check if they can delete
    getCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch((err) => console.error("Error loading current user:", err));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCommentAdded = () => {
    // Refresh the hunting place data to show new comment
    loadHuntingPlace();
  };

  const handleDelete = async () => {
    try {
      await DeleteHuntingPlace(id);
      navigate("/hunting-places");
    } catch (err) {
      setError("Failed to delete hunting place");
      console.error("Error deleting hunting place:", err);
    }
  };

  const confirmDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this hunting place? This action cannot be undone."
      )
    ) {
      handleDelete().then(navigate(`/hunting-places`));
    }
  };

  // Check if current user is the creator
  const isCreator =
    currentUser && huntingPlace && currentUser.id === huntingPlace.user;

  // Debug logging
  console.log("Current user:", currentUser);
  console.log("Hunting place:", huntingPlace);
  console.log("Is creator?", isCreator);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">
          Loading hunting place details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
          <button
            onClick={() => navigate("/hunting-places")}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Hunting Places
          </button>
        </div>
      </div>
    );
  }

  if (!huntingPlace) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">Hunting place not found.</div>
          <button
            onClick={() => navigate("/hunting-places")}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Hunting Places
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/hunting-places")}
          className="flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
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
          Back to Hunting Places
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {huntingPlace.location_name || "Unnamed Hunting Place"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Creature Carousel */}
        {huntingPlace.creatures && huntingPlace.creatures.length > 0 && (
          <CreatureCarousel creatures={huntingPlace.creatures} />
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {huntingPlace.description ||
                    "No description available for this hunting place."}
                </p>
              </div>
            </div>

            {/* Creatures Section */}
            {huntingPlace.creatures && huntingPlace.creatures.length > 0 && (
              <div className="p-6 bg-gray-50 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Creatures
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {huntingPlace.creatures.map((creature) => (
                    <div
                      key={creature.id}
                      className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm"
                    >
                      {creature.image_url && (
                        <img
                          src={creature.image_url}
                          alt={creature.name}
                          className="w-16 h-16 object-contain mb-2"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {creature.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {creature.experience_points} XP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Imbues Section */}
            {huntingPlace.imbues && huntingPlace.imbues.length > 0 && (
              <div className="p-6 bg-gray-50 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recommended Imbues
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {huntingPlace.imbues.map((imbue) => (
                    <div
                      key={imbue.id}
                      className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm"
                    >
                      {imbue.image && (
                        <img
                          src={imbue.image}
                          alt={imbue.name}
                          className="w-16 h-16 object-contain mb-2"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {imbue.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-1 bg-gray-50 border-l">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Stats & Info
              </h3>

              {/* Stats Grid - Vertical Layout */}
              <div className="space-y-6">
                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl font-bold text-emerald-600">
                    {huntingPlace.recommended_level}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Recommended Level
                  </div>
                </div>

                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {huntingPlace.raw_exp
                      ? huntingPlace.raw_exp.toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Experience/Hour
                  </div>
                </div>

                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">
                    {huntingPlace.est_profit
                      ? huntingPlace.est_profit.toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Profit/Hour (gp)
                  </div>
                </div>

                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">📍</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {huntingPlace.location_name || "Unknown Location"}
                  </div>
                </div>

                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  {huntingPlace.vocation_image_url ? (
                    <img
                      src={huntingPlace.vocation_image_url}
                      alt={huntingPlace.vocation_name || "Vocation"}
                      className="w-12 h-12 object-contain mx-auto mb-2"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "block";
                      }}
                    />
                  ) : null}
                  <div
                    className="text-2xl font-bold text-indigo-600"
                    style={{
                      display: huntingPlace.vocation_image_url
                        ? "none"
                        : "block",
                    }}
                  >
                    ⚔️
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {huntingPlace.vocation_name || "Any Vocation"}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Additional Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Added by:</span>
                    <div className="text-gray-600 mt-1">
                      {huntingPlace.user_username || "Unknown user"}
                    </div>
                  </div>
                  {huntingPlace.updated_at && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Last updated:
                      </span>
                      <div className="text-gray-600 mt-1">
                        {new Date(huntingPlace.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t">
          <div className="flex flex-wrap gap-4">
            {isCreator && (
              <button
                onClick={() => navigate(`/hunting-places/${id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Edit Place
              </button>
            )}
            <button
              onClick={() => {
                // Add to favorites functionality
                console.log("Add to favorites:", id);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add to Favorites
            </button>
            <button
              onClick={() => {
                // Share functionality
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Share Link
            </button>
            {isCreator && (
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Delete Place
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <HuntingPlaceComments
          huntingPlace={huntingPlace}
          onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  );
};
