import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetHuntingPlace,
  UpdateHuntingPlace,
} from "../../services/HuntingPlaceServices.jsx";
import { GetAllVocations } from "../../services/VocationServices.jsx";
import { GetAllLocations } from "../../services/LocationServices.jsx";

export const EditHuntingPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vocations, setVocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    recommended_level: "",
    raw_exp: "",
    est_profit: "",
    recommended_vocation: "",
    location: "",
  });

  useEffect(() => {
    // Load hunting place data, vocations, and locations
    Promise.all([GetHuntingPlace(id), GetAllVocations(), GetAllLocations()])
      .then(([huntingPlaceData, vocationData, locationData]) => {
        setFormData({
          description: huntingPlaceData.description || "",
          recommended_level: huntingPlaceData.recommended_level.toString(),
          raw_exp: huntingPlaceData.raw_exp.toString(),
          est_profit: huntingPlaceData.est_profit.toString(),
          recommended_vocation: huntingPlaceData.recommended_vocation || "",
          location: huntingPlaceData.location.toString(),
        });
        setVocations(vocationData);
        setLocations(locationData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load hunting place data");
        setLoading(false);
        console.error("Error loading data:", err);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updateData = {
        description: formData.description,
        recommended_level: parseInt(formData.recommended_level),
        raw_exp: parseInt(formData.raw_exp),
        est_profit: parseInt(formData.est_profit),
        recommended_vocation: formData.recommended_vocation || null,
        location: parseInt(formData.location),
      };

      await UpdateHuntingPlace(id, updateData);
      navigate(`/hunting-places/${id}`);
    } catch (err) {
      setError("Failed to update hunting place");
      console.error("Error updating hunting place:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading hunting place...</div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/hunting-places/${id}`)}
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
            Back to Details
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Hunting Place
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location *
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recommended Level */}
          <div>
            <label
              htmlFor="recommended_level"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Recommended Level *
            </label>
            <input
              type="number"
              id="recommended_level"
              name="recommended_level"
              value={formData.recommended_level}
              onChange={handleInputChange}
              required
              min="1"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Recommended Vocation */}
          <div>
            <label
              htmlFor="recommended_vocation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Recommended Vocation
            </label>
            <select
              id="recommended_vocation"
              name="recommended_vocation"
              value={formData.recommended_vocation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Any vocation</option>
              {vocations.map((vocation) => (
                <option key={vocation.id} value={vocation.id}>
                  {vocation.name}
                </option>
              ))}
            </select>
          </div>

          {/* Raw Experience */}
          <div>
            <label
              htmlFor="raw_exp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Experience per Hour *
            </label>
            <input
              type="number"
              id="raw_exp"
              name="raw_exp"
              value={formData.raw_exp}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Estimated Profit */}
          <div>
            <label
              htmlFor="est_profit"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Estimated Profit per Hour *
            </label>
            <input
              type="number"
              id="est_profit"
              name="est_profit"
              value={formData.est_profit}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Describe the hunting place, strategies, requirements, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/hunting-places/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
