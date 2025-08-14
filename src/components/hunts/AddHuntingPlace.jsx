import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateHuntingPlace } from "../../services/HuntingPlaceServices.jsx";
import { GetAllVocations } from "../../services/VocationServices.jsx";
import { GetAllLocations } from "../../services/LocationServices.jsx";
import { GetAllCreatures } from "../../services/CreatureServices.jsx";
import { GetAllImbues } from "../../services/ImbueServices.jsx";
import { GetAllItems } from "../../services/ItemServices.jsx";

export const AddHuntingPlace = () => {
  const navigate = useNavigate();
  const [vocations, setVocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [creatures, setCreatures] = useState([]);
  const [imbues, setImbues] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
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
    recommended_vocation: "",
    creature_ids: [],
    imbue_ids: [],
    item_ids: [],
    location: "",
  });

  useEffect(() => {
    // Load vocations, locations, creatures, imbues, and items
    Promise.all([
      GetAllVocations(),
      GetAllLocations(),
      GetAllCreatures(),
      GetAllImbues(),
      GetAllItems(),
    ])
      .then(
        ([vocationData, locationData, creatureData, imbueData, itemData]) => {
          setVocations(vocationData);
          setLocations(locationData);
          setCreatures(creatureData);
          setImbues(imbueData);
          setItems(itemData);
        }
      )
      .catch((err) => {
        setError("Failed to load form data");
        console.error("Error loading form data:", err);
      });
  }, []);

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
    setLoading(true);
    setError(null);

    if (formData.creature_ids.length === 0) {
      setError("Please select at least one creature");
      setLoading(false);
      return;
    }

    try {
      const huntingPlaceData = {
        description: formData.description,
        recommended_level: parseInt(formData.recommended_level),
        raw_exp: parseInt(formData.raw_exp),
        est_profit: parseInt(formData.est_profit),
        recommended_vocation: formData.recommended_vocation || null,
        creature_ids: formData.creature_ids,
        imbue_ids: formData.imbue_ids,
        item_ids: formData.item_ids,
        location: parseInt(formData.location),
      };

      await CreateHuntingPlace(huntingPlaceData);
      navigate("/hunting-places");
    } catch (err) {
      setError("Failed to create hunting place");
      console.error("Error creating hunting place:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
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
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Hunting Place
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
              <span className="ml-5">
                Don't see location?{" "}
                <button
                  onClick={() => navigate("/hunting-places/add-location")}
                  className="px-2 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  Add Location
                </button>
              </span>
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/hunting-places")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Create Hunting Place"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
