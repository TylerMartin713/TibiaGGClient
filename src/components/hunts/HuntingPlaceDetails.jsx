import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetHuntingPlace,
  DeleteHuntingPlace,
} from "../../services/HuntingPlaceServices.jsx";
import { getCurrentUser } from "../services/userServices.jsx";
import { HuntingPlaceComments } from "./HuntingPlaceComments.jsx";

export const HuntingPlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [huntingPlace, setHuntingPlace] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <p className="text-gray-600">
          Added by {huntingPlace.user_username || "Unknown"} •
          {huntingPlace.created_at &&
            ` Created ${new Date(
              huntingPlace.created_at
            ).toLocaleDateString()}`}
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50 border-b">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {huntingPlace.recommended_level}
            </div>
            <div className="text-sm text-gray-600">Recommended Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {huntingPlace.raw_exp
                ? huntingPlace.raw_exp.toLocaleString()
                : "N/A"}
            </div>
            <div className="text-sm text-gray-600">Experience/Hour</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {huntingPlace.est_profit
                ? huntingPlace.est_profit.toLocaleString()
                : "N/A"}
            </div>
            <div className="text-sm text-gray-600">Profit/Hour (gp)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">📍</div>
            <div className="text-sm text-gray-600">
              {huntingPlace.location_name || "Unknown Location"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">⚔️</div>
            <div className="text-sm text-gray-600">
              {huntingPlace.vocation_name || "Any Vocation"}
            </div>
          </div>
        </div>

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

        {/* Additional Info */}
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Added by:</span>
              <span className="ml-2 text-gray-600">
                {huntingPlace.user_username || "Unknown user"}
              </span>
            </div>
            {huntingPlace.updated_at && (
              <div>
                <span className="font-medium text-gray-700">Last updated:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(huntingPlace.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}
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
