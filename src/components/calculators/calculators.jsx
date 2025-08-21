import { useState, useEffect } from "react";
import {
  calculateLevelingTime,
  applyExperienceBonuses,
  experienceBonuses,
} from "../../data/experienceTable";

export const Calculators = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(50);
  const [baseExpPerHour, setBaseExpPerHour] = useState(50000);
  const [hoursPerDay, setHoursPerDay] = useState(8);

  // Bonus settings
  const [bonuses, setBonuses] = useState({
    lowLevelBonus: true,
    premiumStamina: false,
    doubleExperience: false,
    partySize: 1,
  });

  const [results, setResults] = useState(null);

  // Calculate results whenever inputs change
  useEffect(() => {
    if (currentLevel >= targetLevel) {
      setResults(null);
      return;
    }

    // Apply bonuses to experience per hour
    const bonusData = applyExperienceBonuses(
      baseExpPerHour,
      currentLevel,
      bonuses
    );
    const effectiveExpPerHour = bonusData.totalExperience;

    // Calculate leveling time
    const timeData = calculateLevelingTime(
      currentLevel,
      targetLevel,
      effectiveExpPerHour,
      hoursPerDay
    );

    setResults({
      ...timeData,
      effectiveExpPerHour,
      bonusPercentage: bonusData.bonusPercentage,
      lowLevelBonus: experienceBonuses.lowLevelBonus(currentLevel),
    });
  }, [currentLevel, targetLevel, baseExpPerHour, hoursPerDay, bonuses]);

  const handleBonusChange = (bonusType, value) => {
    setBonuses((prev) => ({
      ...prev,
      [bonusType]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Tibia Leveling Calculator
          </h1>
          <p className="text-lg text-gray-300">
            Calculate the time needed to reach your target level in Tibia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Calculator Settings
            </h2>

            {/* Level Settings */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Level
                </label>
                <input
                  type="number"
                  min="1"
                  max="3000"
                  value={currentLevel}
                  onChange={(e) =>
                    setCurrentLevel(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Level
                </label>
                <input
                  type="number"
                  min={currentLevel + 1}
                  max="3000"
                  value={targetLevel}
                  onChange={(e) =>
                    setTargetLevel(parseInt(e.target.value) || currentLevel + 1)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Experience Settings */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Experience/Hour
                  <span className="text-xs text-gray-400 ml-1">
                    (without bonuses)
                  </span>
                </label>
                <input
                  type="number"
                  min="1000"
                  value={baseExpPerHour}
                  onChange={(e) =>
                    setBaseExpPerHour(parseInt(e.target.value) || 1000)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hours per Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={hoursPerDay}
                  onChange={(e) =>
                    setHoursPerDay(parseInt(e.target.value) || 8)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Bonus Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Experience Bonuses
              </h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bonuses.lowLevelBonus}
                    onChange={(e) =>
                      handleBonusChange("lowLevelBonus", e.target.checked)
                    }
                    className="mr-2 accent-emerald-500"
                  />
                  <label className="text-sm text-gray-300">
                    Low Level Bonus
                    <span className="text-xs text-gray-400 ml-1">
                      (+{experienceBonuses.lowLevelBonus(currentLevel)}% at
                      level {currentLevel})
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bonuses.premiumStamina}
                    onChange={(e) =>
                      handleBonusChange("premiumStamina", e.target.checked)
                    }
                    className="mr-2 accent-emerald-500"
                  />
                  <label className="text-sm text-gray-300">
                    Premium Stamina Bonus
                    <span className="text-xs text-gray-400 ml-1">(+50%)</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bonuses.doubleExperience}
                    onChange={(e) =>
                      handleBonusChange("doubleExperience", e.target.checked)
                    }
                    className="mr-2 accent-emerald-500"
                  />
                  <label className="text-sm text-gray-300">
                    Double Experience Event
                    <span className="text-xs text-gray-400 ml-1">(+100%)</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-300">Party Size:</label>
                  <select
                    value={bonuses.partySize}
                    onChange={(e) =>
                      handleBonusChange("partySize", parseInt(e.target.value))
                    }
                    className="px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>Solo</option>
                    <option value={2}>2 Players (+20%)</option>
                    <option value={3}>3 Players (+30%)</option>
                    <option value={4}>4 Players (+50%)</option>
                    <option value={5}>5 Players (+60%)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Calculation Results
            </h2>

            {currentLevel >= targetLevel ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Current level must be lower than target level
                </p>
              </div>
            ) : results ? (
              <div className="space-y-6">
                {/* Experience Summary */}
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-medium text-emerald-400 mb-3">
                    Experience Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-300">Experience Needed:</span>
                      <p className="font-semibold text-white">
                        {results.experienceNeeded.toLocaleString()} exp
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-300">Effective Exp/Hour:</span>
                      <p className="font-semibold text-white">
                        {results.effectiveExpPerHour.toLocaleString()} exp/h
                      </p>
                    </div>
                    {results.bonusPercentage > 0 && (
                      <div className="sm:col-span-2">
                        <span className="text-gray-300">Total Bonus:</span>
                        <p className="font-semibold text-emerald-400">
                          +{results.bonusPercentage}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Estimates */}
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-medium text-emerald-400 mb-3">
                    Time Estimates
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {results.totalHours}
                      </div>
                      <div className="text-sm text-gray-300">Total Hours</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {results.days}
                      </div>
                      <div className="text-sm text-gray-300">Days</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {results.weeks}
                      </div>
                      <div className="text-sm text-gray-300">Weeks</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {results.months}
                      </div>
                      <div className="text-sm text-gray-300">Months</div>
                    </div>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-medium text-emerald-400 mb-3">
                    Level Progress
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      Level {currentLevel}
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      Level {targetLevel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-400">
                      {targetLevel - currentLevel} levels to go
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Enter your details to see calculations
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">
            Tips for Efficient Leveling
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="bg-gray-700 rounded p-3 border border-gray-600">
              <h4 className="font-semibold text-emerald-400 mb-1">
                Low Level Bonus
              </h4>
              <p>
                Characters below level 50 get significant experience bonuses.
                Take advantage of this early on!
              </p>
            </div>
            <div className="bg-gray-700 rounded p-3 border border-gray-600">
              <h4 className="font-semibold text-emerald-400 mb-1">
                Premium Stamina
              </h4>
              <p>
                Premium stamina gives +50% experience for the first 3 hours of
                hunting each day.
              </p>
            </div>
            <div className="bg-gray-700 rounded p-3 border border-gray-600">
              <h4 className="font-semibold text-emerald-400 mb-1">
                Party Hunting
              </h4>
              <p>
                Hunting in parties provides shared experience bonuses, making
                leveling more efficient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
