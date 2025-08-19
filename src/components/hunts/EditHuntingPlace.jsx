import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetHuntingPlace,
  UpdateHuntingPlace,
} from "../../services/HuntingPlaceServices.jsx";
import { GetAllVocations } from "../../services/VocationServices.jsx";
import { GetAllLocations } from "../../services/LocationServices.jsx";
import { GetAllCreatures } from "../../services/CreatureServices.jsx";
import { GetAllImbues } from "../../services/ImbueServices.jsx";
import { GetAllItems } from "../../services/ItemServices.jsx";

export const EditHuntingPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vocations, setVocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [creatures, setCreatures] = useState([]);
  const [imbues, setImbues] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Search states
  const [creatureSearch, setCreatureSearch] = useState("");
  const [imbueSearch, setImbueSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [vocationSearch, setVocationSearch] = useState("");

  // Filtered arrays
  const filteredCreatures = creatures.filter((creature) =>
    creature.name.toLowerCase().includes(creatureSearch.toLowerCase())
  );

  const filteredImbues = imbues.filter((imbue) =>
    imbue.name.toLowerCase().includes(imbueSearch.toLowerCase())
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const filteredVocations = vocations.filter((vocation) =>
    vocation.name.toLowerCase().includes(vocationSearch.toLowerCase())
  );

  const [formData, setFormData] = useState({
    description: "",
    recommended_level: "",
    raw_exp: "",
    est_profit: "",
    youtube_url: "",
    recommended_vocation: "",
    creature_ids: [],
    imbue_ids: [],
    item_ids: [],
    location: "",
  });

  useEffect(() => {
    // Load hunting place data, vocations, locations, creatures, imbues, and items
    Promise.all([
      GetHuntingPlace(id),
      GetAllVocations(),
      GetAllLocations(),
      GetAllCreatures(),
      GetAllImbues(),
      GetAllItems(),
    ])
      .then(
        ([
          huntingPlaceData,
          vocationData,
          locationData,
          creatureData,
          imbueData,
          itemData,
        ]) => {
          setFormData({
            description: huntingPlaceData.description || "",
            recommended_level: huntingPlaceData.recommended_level.toString(),
            raw_exp: huntingPlaceData.raw_exp.toString(),
            est_profit: huntingPlaceData.est_profit.toString(),
            youtube_url: huntingPlaceData.youtube_url || "",
            recommended_vocation: huntingPlaceData.recommended_vocation || "",
            creature_ids: huntingPlaceData.creatures
              ? huntingPlaceData.creatures.map((c) => c.id)
              : [],
            imbue_ids: huntingPlaceData.imbues
              ? huntingPlaceData.imbues.map((i) => i.id)
              : [],
            item_ids: huntingPlaceData.items
              ? huntingPlaceData.items.map((item) => item.id)
              : [],
            location: huntingPlaceData.location.toString(),
          });
          setVocations(vocationData);
          setLocations(locationData);
          setCreatures(creatureData);
          setImbues(imbueData);
          setItems(itemData);
          setLoading(false);
        }
      )
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

  const handleCreatureToggle = (creatureId) => {
    setFormData((prev) => ({
      ...prev,
      creature_ids: prev.creature_ids.includes(creatureId)
        ? prev.creature_ids.filter((id) => id !== creatureId)
        : [...prev.creature_ids, creatureId],
    }));
  };

  const handleImbueToggle = (imbueId) => {
    setFormData((prev) => ({
      ...prev,
      imbue_ids: prev.imbue_ids.includes(imbueId)
        ? prev.imbue_ids.filter((id) => id !== imbueId)
        : [...prev.imbue_ids, imbueId],
    }));
  };

  const handleItemToggle = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      item_ids: prev.item_ids.includes(itemId)
        ? prev.item_ids.filter((id) => id !== itemId)
        : [...prev.item_ids, itemId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (formData.creature_ids.length === 0) {
      setError("Please select at least one creature");
      setSaving(false);
      return;
    }

    try {
      const updateData = {
        description: formData.description,
        recommended_level: parseInt(formData.recommended_level),
        raw_exp: parseInt(formData.raw_exp),
        est_profit: parseInt(formData.est_profit),
        youtube_url: formData.youtube_url || null,
        recommended_vocation: formData.recommended_vocation || null,
        creature_ids: formData.creature_ids,
        imbue_ids: formData.imbue_ids,
        item_ids: formData.item_ids,
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

          {/* Creatures */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Creatures *
            </label>
            {/* Creature Search Bar */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search creatures..."
                value={creatureSearch}
                onChange={(e) => setCreatureSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {filteredCreatures.map((creature) => (
                <div
                  key={creature.id}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.creature_ids.includes(creature.id)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                  onClick={() => handleCreatureToggle(creature.id)}
                >
                  {creature.image_url && (
                    <img
                      src={creature.image_url}
                      alt={creature.name}
                      className="w-12 h-12 object-contain mb-2"
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
                  <input
                    type="checkbox"
                    checked={formData.creature_ids.includes(creature.id)}
                    onChange={() => handleCreatureToggle(creature.id)}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
            {formData.creature_ids.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                Please select at least one creature
              </p>
            )}
          </div>

          {/* Imbues */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommended Imbues
            </label>
            {/* Imbue Search Bar */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search imbues..."
                value={imbueSearch}
                onChange={(e) => setImbueSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {filteredImbues.map((imbue) => (
                <div
                  key={imbue.id}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.imbue_ids.includes(imbue.id)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                  onClick={() => handleImbueToggle(imbue.id)}
                >
                  {imbue.image && (
                    <img
                      src={imbue.image}
                      alt={imbue.name}
                      className="w-12 h-12 object-contain mb-2"
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
                  <input
                    type="checkbox"
                    checked={formData.imbue_ids.includes(imbue.id)}
                    onChange={() => handleImbueToggle(imbue.id)}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Items that Drop
            </label>
            {/* Item Search Bar */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search items..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.item_ids.includes(item.id)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                  onClick={() => handleItemToggle(item.id)}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-contain mb-2"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {item.name}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.item_ids.includes(item.id)}
                    onChange={() => handleItemToggle(item.id)}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommended Vocation
            </label>
            {/* Vocation Search Bar */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search vocations..."
                value={vocationSearch}
                onChange={(e) => setVocationSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 border border-gray-300 rounded-lg">
              <div
                className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  !formData.recommended_vocation
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, recommended_vocation: "" }))
                }
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-gray-500 text-xs">Any</span>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    Any Vocation
                  </div>
                </div>
                <input
                  type="radio"
                  name="recommended_vocation"
                  checked={!formData.recommended_vocation}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      recommended_vocation: "",
                    }))
                  }
                  className="mt-2"
                />
              </div>
              {filteredVocations.map((vocation) => (
                <div
                  key={vocation.id}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.recommended_vocation == vocation.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      recommended_vocation: vocation.id.toString(),
                    }))
                  }
                >
                  {vocation.image_url && (
                    <img
                      src={vocation.image_url}
                      alt={vocation.name}
                      className="w-12 h-12 object-contain mb-2"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {vocation.name}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="recommended_vocation"
                    checked={formData.recommended_vocation == vocation.id}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        recommended_vocation: vocation.id.toString(),
                      }))
                    }
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
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

          {/* YouTube URL */}
          <div>
            <label
              htmlFor="youtube_url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              YouTube Video URL (Optional)
            </label>
            <input
              type="url"
              id="youtube_url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=example"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Add a YouTube video to showcase this hunting place (optional)
            </p>
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
