import { useState } from "react";
import { CreateHuntingPlace } from "../../services/HuntingPlaceServices.jsx";

export const AddHuntingPlace = ({ onHuntingPlaceAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    recommended_level: "",
    location: 1, // Default location ID
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newHuntingPlace = await CreateHuntingPlace({
        ...formData,
        recommended_level: parseInt(formData.recommended_level),
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        recommended_level: "",
        location: 1,
      });

      // Notify parent component
      if (onHuntingPlaceAdded) {
        onHuntingPlaceAdded(newHuntingPlace);
      }

      alert("Hunting place added successfully!");
    } catch (error) {
      setError("Failed to create hunting place. Please try again.");
      console.error("Error creating hunting place:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Add New Hunting Place
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Dragon Lair"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Describe the hunting place..."
          />
        </div>

        <div>
          <label
            htmlFor="recommended_level"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recommended Level
          </label>
          <input
            type="number"
            id="recommended_level"
            name="recommended_level"
            value={formData.recommended_level}
            onChange={handleChange}
            required
            min="1"
            max="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="100"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location ID
          </label>
          <input
            type="number"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="1"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          } text-white transition-colors duration-200`}
        >
          {isSubmitting ? "Creating..." : "Create Hunting Place"}
        </button>
      </form>
    </div>
  );
};
