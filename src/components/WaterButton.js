import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

const WaterButton = ({ amount, onPress, variant = 'outline' }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();
    onPress && onPress(amount);
  };

  const isFilled = variant === 'filled';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, isFilled ? styles.filledButton : styles.outlineButton]}
      >
        <Text style={styles.dropIcon}>💧</Text>
        <Text style={[styles.label, isFilled ? styles.filledLabel : styles.outlineLabel]}>
          +{amount}ml
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const QuickAddRow = ({ onAdd }) => (
  <View style={styles.row}>
    {[150, 250, 350, 500].map((ml, i) => (
      <WaterButton
        key={ml}
        amount={ml}
        onPress={onAdd}
        variant={i === 1 || i === 2 ? 'filled' : 'outline'}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    minWidth: 74,
    gap: 4,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.card,
  },
  filledButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },
  dropIcon: {
    fontSize: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  outlineLabel: {
    color: COLORS.primary,
  },
  filledLabel: {
    color: COLORS.textInverse,
  },
});

export { QuickAddRow };
export default WaterButton;
