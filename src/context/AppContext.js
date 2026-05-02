import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_USER,
  MOCK_WEEKLY_DATA,
  MOCK_STATS,
  MOCK_XP,
  calcDailyGoal,
} from '../constants/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [user, setUser] = useState(MOCK_USER);
  const [waterIntake, setWaterIntake] = useState(1450);
  const [weeklyData, setWeeklyData] = useState(MOCK_WEEKLY_DATA);
  const [stats] = useState(MOCK_STATS);
  const [xp] = useState(MOCK_XP);

  const dailyGoal = calcDailyGoal(user.weight);
  const remaining = Math.max(0, dailyGoal - waterIntake);
  const progressPercent = Math.min(100, Math.round((waterIntake / dailyGoal) * 100));

  const addWater = (ml) => {
    setWaterIntake((prev) => Math.min(prev + ml, dailyGoal + 500));
  };

  const completeOnboarding = (userData) => {
    setUser(userData);
    setIsOnboarded(true);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AppContext.Provider
      value={{
        isOnboarded,
        user,
        waterIntake,
        dailyGoal,
        remaining,
        progressPercent,
        weeklyData,
        stats,
        xp,
        addWater,
        completeOnboarding,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
