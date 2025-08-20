import { useState, useEffect } from "react";
import { GetAllQuests, GetQuestById } from "../../services/QuestServices.jsx";

export const QuestGuides = () => {
  const [quests, setQuests] = useState([]);
  const [filteredQuests, setFilteredQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        setLoading(true);
        const questsData = await GetAllQuests();
        setQuests(questsData);
        setFilteredQuests(questsData);

        // Automatically select first quest if available
        if (questsData.length > 0) {
          await selectQuest(questsData[0].id);
        }
      } catch (err) {
        setError("Failed to load quest data");
        console.error("Error loading quests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  // Filter quests based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredQuests(quests);
    } else {
      const filtered = quests.filter(
        (quest) =>
          quest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuests(filtered);
    }
  }, [searchTerm, quests]);

  const selectQuest = async (questId) => {
    try {
      const fullQuestData = await GetQuestById(questId);
      setSelectedQuest(fullQuestData);
      if (fullQuestData.missions && fullQuestData.missions.length > 0) {
        setActiveTab(`mission${fullQuestData.missions[0].id}`);
      }
    } catch (err) {
      console.error("Error loading quest details:", err);
    }
  };

  const getCurrentMission = () => {
    if (!selectedQuest || !selectedQuest.missions) return null;
    const missionId = parseInt(activeTab.replace("mission", ""));
    return selectedQuest.missions.find((mission) => mission.id === missionId);
  };

  const formatSteps = (stepsText) => {
    if (!stepsText) return [];
    // Split by numbered steps (1., 2., etc.) and filter empty items
    return stepsText
      .split(/\d+\./)
      .filter((step) => step.trim())
      .map((step) => step.trim());
  };

  const formatRewards = (rewards) => {
    if (!rewards) return [];
    return rewards.filter(
      (reward) => reward.is_final_reward || !reward.mission_id
    );
  };

  const formatDangers = (dangers) => {
    if (!dangers) return [];
    return dangers.map((danger) => ({
      name: danger.creature_name,
      location: danger.location,
      notes: danger.notes,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
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

  if (!selectedQuest) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">
            No Quest Selected
          </h2>
          <p className="text-gray-400">
            Please select a quest to view its guide.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Quest Search and Selection */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search quests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quest Dropdown */}
            <div className="md:w-80">
              <select
                value={selectedQuest?.id || ""}
                onChange={(e) => selectQuest(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select a quest...</option>
                {filteredQuests.map((quest) => (
                  <option key={quest.id} value={quest.id}>
                    {quest.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Quest Cards */}
          {filteredQuests.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => selectQuest(quest.id)}
                  className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 border-2 ${
                    selectedQuest?.id === quest.id
                      ? "border-emerald-500 bg-gray-600"
                      : "border-transparent"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {quest.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                    {quest.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      Level {quest.rec_level || quest.min_level || "Any"}
                    </span>
                    {quest.difficulty_rating && (
                      <span>
                        {"★".repeat(quest.difficulty_rating)} Difficulty
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchTerm && filteredQuests.length === 0 && (
            <div className="mt-6 text-center text-gray-400">
              No quests found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {!selectedQuest && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">
              Select a Quest
            </h2>
            <p className="text-gray-400">
              Choose a quest from the search results above to view its guide.
            </p>
          </div>
        </div>
      )}

      {/* Quest Details - Only show when a quest is selected */}
      {selectedQuest && (
        <>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {selectedQuest.name}
                </h1>
                <p className="text-lg text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4">
                  {selectedQuest.description}
                </p>

                {/* Quest Info */}
                <div className="flex justify-center space-x-8 text-blue-100 text-sm">
                  {selectedQuest.min_level && (
                    <div className="text-center">
                      <div className="font-semibold">Min Level</div>
                      <div>{selectedQuest.min_level}</div>
                    </div>
                  )}
                  {selectedQuest.rec_level && (
                    <div className="text-center">
                      <div className="font-semibold">Recommended Level</div>
                      <div>{selectedQuest.rec_level}+</div>
                    </div>
                  )}
                  {selectedQuest.estimated_duration && (
                    <div className="text-center">
                      <div className="font-semibold">Duration</div>
                      <div>{selectedQuest.estimated_duration}</div>
                    </div>
                  )}
                  {selectedQuest.difficulty_rating && (
                    <div className="text-center">
                      <div className="font-semibold">Difficulty</div>
                      <div>{"★".repeat(selectedQuest.difficulty_rating)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mission Tabs Navigation */}
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4">
              <nav className="flex space-x-8 overflow-x-auto">
                {selectedQuest.missions &&
                  selectedQuest.missions.map((mission) => (
                    <button
                      key={mission.id}
                      onClick={() => setActiveTab(`mission${mission.id}`)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === `mission${mission.id}`
                          ? "border-emerald-500 text-emerald-400"
                          : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                      }`}
                    >
                      {mission.name}
                    </button>
                  ))}
              </nav>
            </div>
          </div>

          {/* Mission Content Section */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            {getCurrentMission() && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Mission Details */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-4">
                        {getCurrentMission().name}
                      </h2>

                      {/* Objective */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                          Objective
                        </h3>
                        <p className="text-gray-300">
                          {getCurrentMission().objective}
                        </p>
                      </div>

                      {/* Location */}
                      {getCurrentMission().location && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                            Location
                          </h3>
                          <p className="text-gray-300">
                            {getCurrentMission().location}
                          </p>
                        </div>
                      )}

                      {/* Required Items */}
                      {getCurrentMission().required_items && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                            Required Items
                          </h3>
                          <p className="text-gray-300">
                            {getCurrentMission().required_items}
                          </p>
                        </div>
                      )}

                      {/* Steps */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-emerald-400 mb-4">
                          Steps to Complete
                        </h3>
                        <div className="space-y-3">
                          {formatSteps(getCurrentMission().steps).map(
                            (step, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg"
                              >
                                <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">
                                    {index + 1}
                                  </span>
                                </div>
                                <p className="text-gray-300">{step}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {getCurrentMission().notes && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                            Important Notes
                          </h3>
                          <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                            <p className="text-yellow-100">
                              {getCurrentMission().notes}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Dangers */}
                      {getCurrentMission().dangers && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-red-400 mb-2">
                            Dangers
                          </h3>
                          <div className="bg-red-900/20 border-l-4 border-red-400 p-4 rounded">
                            <p className="text-red-100">
                              {getCurrentMission().dangers}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Quest Info */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Quest Rewards */}
                  {selectedQuest.rewards &&
                    selectedQuest.rewards.length > 0 && (
                      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                          Quest Rewards
                        </h3>
                        <div className="space-y-3">
                          {formatRewards(selectedQuest.rewards).map(
                            (reward, index) => (
                              <div
                                key={index}
                                className="bg-gray-700 p-3 rounded-lg"
                              >
                                <h4 className="font-semibold text-white mb-1 text-sm">
                                  {reward.name}
                                </h4>
                                {reward.description && (
                                  <p className="text-gray-300 text-xs mb-2">
                                    {reward.description}
                                  </p>
                                )}
                                <span className="inline-block bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                                  {reward.reward_type}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Quest Dangers */}
                  {selectedQuest.dangers &&
                    selectedQuest.dangers.length > 0 && (
                      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-red-400 mb-4">
                          Creatures & Dangers
                        </h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {formatDangers(selectedQuest.dangers).map(
                            (danger, index) => (
                              <div
                                key={index}
                                className="bg-red-900/20 border border-red-800 p-2 rounded-lg"
                              >
                                <h4 className="font-semibold text-red-300 mb-1 text-sm">
                                  {danger.name}
                                </h4>
                                {danger.location && (
                                  <p className="text-red-100 text-xs mb-1">
                                    <strong>Location:</strong> {danger.location}
                                  </p>
                                )}
                                {danger.notes && (
                                  <p className="text-red-100 text-xs">
                                    {danger.notes}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Prerequisites */}
                  {selectedQuest.prerequisites && (
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                      <h3 className="text-xl font-semibold text-blue-400 mb-4">
                        Prerequisites
                      </h3>
                      <div className="bg-emerald-900/20 border-l-4 border-blue-400 p-4 rounded">
                        <p className="text-blue-100 text-sm">
                          {selectedQuest.prerequisites}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
