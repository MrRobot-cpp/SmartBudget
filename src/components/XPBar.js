import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const XPBar = ({ level, currentXP, nextLevelXP, title }) => {
  const progress = Math.min(1, currentXP / nextLevelXP);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.xpText}>
            {currentXP} / {nextLevelXP} XP
          </Text>
        </View>
      </View>
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.nextLabel}>Lvl {level + 1}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.xp,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.xp,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
  titleBlock: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  xpText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.xp,
    borderRadius: 99,
  },
  nextLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
    minWidth: 36,
  },
});

export default XPBar;
