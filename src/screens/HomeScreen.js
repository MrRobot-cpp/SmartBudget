import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useApp } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';
import { QuickAddRow } from '../components/WaterButton';
import XPBar from '../components/XPBar';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const greeting = (name) => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name} ☀️`;
  if (hour < 18) return `Good afternoon, ${name} 🌿`;
  return `Good evening, ${name} 🌙`;
};

const StatCard = ({ label, value, unit, color }) => (
  <View style={styles.statCard}>
    <Text style={[styles.statValue, color && { color }]}>{value}</Text>
    <Text style={styles.statUnit}>{unit}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const HomeScreen = () => {
  const { user, waterIntake, dailyGoal, remaining, progressPercent, addWater, xp, stats } = useApp();

  const now = new Date();
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting(user.name)}</Text>
            <Text style={styles.date}>{dateStr}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatarInitials || user.name?.charAt(0)}</Text>
          </View>
        </View>

        {/* Streak badge */}
        {stats.currentStreak > 0 && (
          <View style={styles.streakBanner}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakText}>
              {stats.currentStreak}-day streak! Keep it going!
            </Text>
          </View>
        )}

        {/* Progress Ring */}
        <View style={styles.ringSection}>
          <ProgressRing
            size={230}
            strokeWidth={20}
            progress={progressPercent}
            centerLabel={`${waterIntake}`}
            centerSubLabel="ml consumed"
            color={progressPercent >= 100 ? COLORS.success : COLORS.ringFill}
            trackColor={COLORS.ringTrack}
          />
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard label="Daily Goal" value={dailyGoal} unit="ml" />
          <View style={styles.statDivider} />
          <StatCard
            label="Remaining"
            value={remaining}
            unit="ml"
            color={remaining === 0 ? COLORS.success : COLORS.water}
          />
          <View style={styles.statDivider} />
          <StatCard label="Progress" value={`${progressPercent}%`} unit="" color={COLORS.primary} />
        </View>

        {/* Quick add section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <Text style={styles.sectionSub}>Tap to log your intake</Text>
          <QuickAddRow onAdd={addWater} />
        </View>

        {/* Custom amount hint */}
        <TouchableOpacity style={styles.customAddBtn} activeOpacity={0.7}>
          <Text style={styles.customAddText}>+ Custom amount</Text>
        </TouchableOpacity>

        {/* Hydration tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Daily Tip</Text>
            <Text style={styles.tipText}>
              Drinking water before meals can reduce calorie intake by up to 13%.
            </Text>
          </View>
        </View>

        {/* XP Bar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <XPBar
            level={xp.level}
            currentXP={xp.currentXP}
            nextLevelXP={xp.nextLevelXP}
            title={xp.title}
          />
        </View>

        {/* Bottom padding */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.streakLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  streakFire: {
    fontSize: 18,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.streak,
  },
  ringSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  statUnit: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
    marginTop: 1,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  customAddBtn: {
    alignSelf: 'center',
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: COLORS.primaryPale,
  },
  customAddText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.water,
    padding: 16,
    marginBottom: 24,
  },
  tipIcon: {
    fontSize: 22,
    marginTop: 1,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.water,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;
