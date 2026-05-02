export const MOCK_USER = {
  name: 'Alex',
  age: 28,
  weight: 70,      // kg
  height: 175,     // cm
  gender: 'Male',
  location: 'San Francisco, CA',
  avatarInitials: 'AJ',
};

// 30 ml per kg body weight
export const calcDailyGoal = (weightKg) => Math.round(weightKg * 30);

export const MOCK_WEEKLY_DATA = [
  { day: 'Mon', completed: true, intake: 2100 },
  { day: 'Tue', completed: true, intake: 2400 },
  { day: 'Wed', completed: false, intake: 1600 },
  { day: 'Thu', completed: true, intake: 2200 },
  { day: 'Fri', completed: true, intake: 2500 },
  { day: 'Sat', completed: true, intake: 2300 },
  { day: 'Sun', completed: false, intake: 900 },
];

export const MOCK_STATS = {
  currentStreak: 5,
  longestStreak: 14,
  totalDaysTracked: 42,
  averageIntake: 2180,
  weeklyConsistency: 71, // percent
};

export const MOCK_XP = {
  level: 5,
  currentXP: 340,
  nextLevelXP: 500,
  title: 'Hydration Apprentice',
};

export const WATER_AMOUNTS = [150, 250, 350, 500];

export const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
