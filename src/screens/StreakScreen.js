import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useApp } from '../context/AppContext';
import XPBar from '../components/XPBar';

const MONTH_DAYS = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  filled: i < 5 || (i > 7 && i < 15) || (i > 17 && i < 22),
  today: i === 27,
}));

const DayDot = ({ filled, today, day }) => (
  <View style={[styles.dayDot, filled && styles.dayDotFilled, today && styles.dayDotToday]}>
    <Text style={[styles.dayDotText, filled && styles.dayDotTextFilled, today && styles.dayDotTextToday]}>
      {day}
    </Text>
  </View>
);

const WeekRow = ({ data }) => (
  <View style={styles.weekRow}>
    {data.map((item) => (
      <View key={item.day} style={styles.weekCell}>
        <Text style={styles.weekDayLabel}>{item.day}</Text>
        <View style={[styles.weekBar, item.completed && styles.weekBarFilled]}>
          {item.completed && (
            <View
              style={[
                styles.weekBarInner,
                { height: `${Math.min(100, Math.round((item.intake / 2100) * 100))}%` },
              ]}
            />
          )}
        </View>
        <Text style={styles.weekBarValue}>
          {item.completed ? `${(item.intake / 1000).toFixed(1)}L` : '—'}
        </Text>
      </View>
    ))}
  </View>
);

const BadgeCard = ({ emoji, label, value, color }) => (
  <View style={[styles.badgeCard, { borderTopColor: color, borderTopWidth: 3 }]}>
    <Text style={styles.badgeEmoji}>{emoji}</Text>
    <Text style={[styles.badgeValue, { color }]}>{value}</Text>
    <Text style={styles.badgeLabel}>{label}</Text>
  </View>
);

const StreakScreen = () => {
  const { stats, weeklyData, xp } = useApp();

  const motivational = stats.currentStreak >= 7
    ? "You're on fire! 🔥 A full week streak!"
    : stats.currentStreak >= 3
    ? 'Great start! 💪 Keep the momentum going.'
    : 'Every drop counts. Start your streak today! 💧';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.screenTitle}>Your Streaks</Text>
        <Text style={styles.screenSubtitle}>Consistency builds habits</Text>

        {/* Hero streak card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
            <Text style={styles.streakDayLabel}>day streak</Text>
            <Text style={styles.motivational}>{motivational}</Text>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.heroFire}>🔥</Text>
          </View>
        </View>

        {/* Badge row */}
        <View style={styles.badgeRow}>
          <BadgeCard
            emoji="🏆"
            label="Best Streak"
            value={`${stats.longestStreak}d`}
            color={COLORS.accent}
          />
          <BadgeCard
            emoji="📅"
            label="Days Tracked"
            value={stats.totalDaysTracked}
            color={COLORS.primary}
          />
          <BadgeCard
            emoji="💧"
            label="Avg. Daily"
            value={`${(stats.averageIntake / 1000).toFixed(1)}L`}
            color={COLORS.water}
          />
        </View>

        {/* Weekly chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.consistencyPill}>
              <Text style={styles.consistencyText}>{stats.weeklyConsistency}% on track</Text>
            </View>
          </View>
          <View style={styles.chartCard}>
            <WeekRow data={weeklyData} />
          </View>
        </View>

        {/* Monthly calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>May 2026</Text>
          <View style={styles.calendarCard}>
            <View style={styles.calGrid}>
              {MONTH_DAYS.map((d) => (
                <DayDot key={d.day} {...d} />
              ))}
            </View>
            <View style={styles.calLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.ringFill }]} />
                <Text style={styles.legendText}>Goal met</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.border }]} />
                <Text style={styles.legendText}>Missed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* XP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <XPBar
            level={xp.level}
            currentXP={xp.currentXP}
            nextLevelXP={xp.nextLevelXP}
            title={xp.title}
          />
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {[
              { emoji: '🌱', label: 'First Sip', unlocked: true },
              { emoji: '🔥', label: '3-Day Streak', unlocked: true },
              { emoji: '💪', label: 'Week Warrior', unlocked: true },
              { emoji: '🏅', label: '30-Day Club', unlocked: false },
              { emoji: '🌊', label: 'Ocean Level', unlocked: false },
              { emoji: '👑', label: 'Hydration King', unlocked: false },
            ].map(({ emoji, label, unlocked }) => (
              <View
                key={label}
                style={[styles.achievementChip, !unlocked && styles.achievementLocked]}
              >
                <Text style={[styles.achievementEmoji, !unlocked && styles.achievementEmojiLocked]}>
                  {emoji}
                </Text>
                <Text style={[styles.achievementLabel, !unlocked && styles.achievementLabelLocked]}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroLeft: {
    flex: 1,
  },
  heroRight: {
    marginLeft: 16,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.textInverse,
    letterSpacing: -2,
    lineHeight: 68,
  },
  streakDayLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    marginBottom: 10,
  },
  motivational: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 19,
    fontWeight: '500',
  },
  heroFire: {
    fontSize: 56,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  badgeValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 3,
  },
  badgeLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  consistencyPill: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  consistencyText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDeep,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  weekDayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  weekBar: {
    width: 24,
    height: 60,
    borderRadius: 6,
    backgroundColor: COLORS.borderLight,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weekBarFilled: {
    backgroundColor: COLORS.waterPale,
  },
  weekBarInner: {
    width: '100%',
    backgroundColor: COLORS.water,
    borderRadius: 6,
  },
  weekBarValue: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  calendarCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotFilled: {
    backgroundColor: COLORS.ringFill,
  },
  dayDotToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryPale,
  },
  dayDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  dayDotTextFilled: {
    color: COLORS.textInverse,
  },
  dayDotTextToday: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  calLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryPale,
  },
  achievementLocked: {
    backgroundColor: COLORS.backgroundAlt,
    borderColor: COLORS.border,
    opacity: 0.5,
  },
  achievementEmoji: {
    fontSize: 16,
  },
  achievementEmojiLocked: {
    opacity: 0.4,
  },
  achievementLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  achievementLabelLocked: {
    color: COLORS.textLight,
  },
});

export default StreakScreen;
