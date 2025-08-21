// Official Tibia Experience Table
// This data represents the cumulative experience points required to reach each level
export const experienceTable = {
  1: 0,
  2: 100,
  3: 200,
  4: 400,
  5: 800,
  6: 1500,
  7: 2600,
  8: 4200,
  9: 6400,
  10: 9300,
  11: 13000,
  12: 17600,
  13: 23200,
  14: 29900,
  15: 37800,
  16: 47000,
  17: 57600,
  18: 69700,
  19: 83400,
  20: 98800,
  21: 116000,
  22: 135100,
  23: 156200,
  24: 179400,
  25: 204800,
  26: 232500,
  27: 262600,
  28: 295200,
  29: 330400,
  30: 368300,
  31: 409000,
  32: 452600,
  33: 499200,
  34: 548900,
  35: 601800,
  36: 658000,
  37: 717600,
  38: 780700,
  39: 847400,
  40: 917800,
  41: 992000,
  42: 1070100,
  43: 1152200,
  44: 1238400,
  45: 1328800,
  46: 1423500,
  47: 1522600,
  48: 1626200,
  49: 1734400,
  50: 1847300,
  60: 3256800,
  70: 5246300,
  80: 7915800,
  90: 11365300,
  100: 15694800,
  110: 21004300,
  120: 27393800,
  130: 34963300,
  140: 43812800,
  150: 54042300,
  160: 65751800,
  170: 79041300,
  180: 94010800,
  190: 110760300,
  200: 129389800,
  210: 149999300,
  220: 172688800,
  230: 197558300,
  240: 224707800,
  250: 254237300,
  260: 286246800,
  270: 320836300,
  280: 358105800,
  290: 398155300,
  300: 441084800,
  400: 1050779800,
  500: 2058474800,
  600: 3564169800,
  700: 5667864800,
  800: 8569559800,
  900: 12069254800,
  1000: 16566949800,
};

// Experience bonus calculations
export const experienceBonuses = {
  // Low level bonus: 100% at level 1, declining to 0% at level 50
  lowLevelBonus: (level) => {
    if (level >= 50) return 0;
    if (level <= 2) return 100;
    // Linear decline: 100% - ((level - 2) * 2.083)
    const decline = (level - 2) * (25 / 12); // 2 + 1/12 = 25/12
    return Math.max(0, Math.ceil(100 - decline));
  },

  // Premium stamina bonus (150% for first 3 hours of stamina)
  premiumStaminaBonus: 50, // +50% bonus experience

  // Double experience events
  doubleExperience: 100, // +100% bonus experience

  // Shared experience bonuses (varies by party composition)
  sharedExperience: {
    twoPlayers: 20, // +20%
    threePlayers: 30, // +30%
    fourPlayers: 50, // +50%
    fivePlayers: 60, // +60%
  },
};

// Calculate experience needed between two levels
export const getExperienceNeeded = (startLevel, targetLevel) => {
  if (startLevel >= targetLevel) return 0;

  const startExp = getExperienceForLevel(startLevel);
  const targetExp = getExperienceForLevel(targetLevel);

  const expNeeded = targetExp - startExp;

  // Ensure we never return negative values
  return Math.max(0, expNeeded);
};

// Get total experience required for a specific level
export const getExperienceForLevel = (level) => {
  if (level <= 1) return 0;

  // Use stored values for common levels
  if (experienceTable[level]) {
    return experienceTable[level];
  }

  // For levels not in the table, interpolate or use the closest known value
  if (level > 50) {
    // For higher levels, use exponential approximation based on known pattern
    // Using level 50 as base (1,847,300 exp) and exponential growth
    const base = 1847300; // Experience at level 50
    const growthFactor = 1.016; // Approximate growth factor per level
    return Math.floor(base * Math.pow(growthFactor, level - 50));
  } else {
    // For levels between known values (below 50), use linear interpolation
    // Find the closest known levels
    const knownLevels = Object.keys(experienceTable)
      .map(Number)
      .sort((a, b) => a - b);

    // Find the two closest levels
    let lowerLevel = 1;
    let upperLevel = 50;

    for (let i = 0; i < knownLevels.length - 1; i++) {
      if (level > knownLevels[i] && level < knownLevels[i + 1]) {
        lowerLevel = knownLevels[i];
        upperLevel = knownLevels[i + 1];
        break;
      }
    }

    // Linear interpolation between the two known levels
    const lowerExp = experienceTable[lowerLevel] || 0;
    const upperExp = experienceTable[upperLevel] || experienceTable[50];
    const ratio = (level - lowerLevel) / (upperLevel - lowerLevel);

    return Math.floor(lowerExp + (upperExp - lowerExp) * ratio);
  }
};

// Calculate time needed to reach target level
export const calculateLevelingTime = (
  startLevel,
  targetLevel,
  expPerHour,
  hoursPerDay = 24
) => {
  const expNeeded = getExperienceNeeded(startLevel, targetLevel);
  const totalHours = expNeeded / expPerHour;
  const days = totalHours / hoursPerDay;

  return {
    experienceNeeded: expNeeded,
    totalHours: Math.ceil(totalHours),
    days: Math.ceil(days),
    weeks: Math.ceil(days / 7),
    months: Math.ceil(days / 30),
  };
};

// Apply experience bonuses
export const applyExperienceBonuses = (baseExp, level, bonuses = {}) => {
  let bonusPercentage = 0;

  // Low level bonus
  if (bonuses.lowLevelBonus) {
    const lowLevelBonus = experienceBonuses.lowLevelBonus(level);
    bonusPercentage += lowLevelBonus;
  }

  // Premium stamina bonus
  if (bonuses.premiumStamina) {
    bonusPercentage += experienceBonuses.premiumStaminaBonus;
  }

  // Double experience event
  if (bonuses.doubleExperience) {
    bonusPercentage += experienceBonuses.doubleExperience;
  }

  // Shared experience bonus
  if (bonuses.partySize && bonuses.partySize > 1) {
    const partyBonus =
      experienceBonuses.sharedExperience[
        `${Math.min(bonuses.partySize, 5)}Players`
      ] || 0;
    bonusPercentage += partyBonus;
  }

  return {
    baseExperience: baseExp,
    bonusPercentage,
    totalExperience: Math.floor(baseExp * (1 + bonusPercentage / 100)),
  };
};
