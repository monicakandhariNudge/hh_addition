import { HouseHold } from '../types';

export interface ProgressStats {
  todayCount: number;
  weekCount: number;
  dailyTarget: number;
  weeklyTarget: number;
  todayProgress: number;
  weekProgress: number;
  isGoalReached: boolean;
}

const DAILY_TARGET = 25;
const WEEKLY_TARGET = 250;

export const getProgressStats = (households: HouseHold[]): ProgressStats => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const todayCount = households.filter(hh => {
    const hhDate = new Date(hh.createdAt);
    return hhDate >= todayStart;
  }).length;

  const weekCount = households.filter(hh => {
    const hhDate = new Date(hh.createdAt);
    return hhDate >= weekStart;
  }).length;

  const todayProgress = Math.min((todayCount / DAILY_TARGET) * 100, 100);
  const weekProgress = Math.min((weekCount / WEEKLY_TARGET) * 100, 100);
  const isGoalReached = todayCount >= DAILY_TARGET;

  return {
    todayCount,
    weekCount,
    dailyTarget: DAILY_TARGET,
    weeklyTarget: WEEKLY_TARGET,
    todayProgress,
    weekProgress,
    isGoalReached
  };
};

export const getMotivationalMessage = (progress: ProgressStats): string => {
  const { todayProgress, todayCount, dailyTarget } = progress;

  if (todayProgress >= 100) {
    return '🎉 बधाई हो! आज का लक्ष्य पूरा!';
  } else if (todayProgress >= 80) {
    return '💪 बहुत बढ़िया! बस कुछ और!';
  } else if (todayProgress >= 50) {
    return '✨ शानदार प्रगति! आगे बढ़ते रहें!';
  } else if (todayProgress >= 25) {
    return '👍 अच्छी शुरुआत! जारी रखें!';
  } else if (todayCount > 0) {
    return '🌟 शुरू हो गया! आगे बढ़ें!';
  }

  return '💼 आज का पहला HH जोड़ें!';
};

export const shouldShowCelebration = (
  oldCount: number,
  newCount: number,
  target: number
): boolean => {
  return oldCount < target && newCount >= target;
};
