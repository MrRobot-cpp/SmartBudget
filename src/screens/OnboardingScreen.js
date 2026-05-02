import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { GENDERS, calcDailyGoal } from '../constants/mockData';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 'welcome', title: "Let's get started", subtitle: 'Tell us a bit about yourself' },
  { id: 'name', title: 'What should we call you?', subtitle: 'Your name helps us personalize your experience' },
  { id: 'age', title: 'How old are you?', subtitle: 'Age helps calculate your hydration needs' },
  { id: 'body', title: 'Your body stats', subtitle: 'Weight and height refine your daily water goal' },
  { id: 'gender', title: 'How do you identify?', subtitle: 'This helps tailor your recommendations' },
  { id: 'location', title: 'Where are you based?', subtitle: 'Climate affects how much water you need' },
  { id: 'summary', title: "You're all set!", subtitle: "Here's your personalized hydration plan" },
];

const WelcomeStep = () => (
  <View style={styles.stepContent}>
    <Text style={styles.heroEmoji}>💧</Text>
    <Text style={styles.heroTitle}>HydroHabit</Text>
    <Text style={styles.heroSubtitle}>
      Build a healthy hydration habit{'\n'}one sip at a time.
    </Text>
    <View style={styles.featurePills}>
      {['Track daily intake', 'Build streaks', 'Level up'].map((f) => (
        <View key={f} style={styles.pill}>
          <Text style={styles.pillText}>✓  {f}</Text>
        </View>
      ))}
    </View>
  </View>
);

const NameStep = ({ value, onChange }) => (
  <View style={styles.stepContent}>
    <Text style={styles.inputLabel}>Your name</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g. Alex"
      placeholderTextColor={COLORS.textLight}
      value={value}
      onChangeText={onChange}
      autoFocus
      returnKeyType="next"
    />
  </View>
);

const AgeStep = ({ value, onChange }) => (
  <View style={styles.stepContent}>
    <Text style={styles.inputLabel}>Age (years)</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g. 28"
      placeholderTextColor={COLORS.textLight}
      value={value}
      onChangeText={onChange}
      keyboardType="numeric"
      autoFocus
      maxLength={3}
    />
  </View>
);

const BodyStep = ({ weight, height, onWeightChange, onHeightChange }) => (
  <View style={styles.stepContent}>
    <Text style={styles.inputLabel}>Weight (kg)</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g. 70"
      placeholderTextColor={COLORS.textLight}
      value={weight}
      onChangeText={onWeightChange}
      keyboardType="numeric"
      autoFocus
      maxLength={3}
    />
    <Text style={[styles.inputLabel, { marginTop: 20 }]}>Height (cm)</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g. 175"
      placeholderTextColor={COLORS.textLight}
      value={height}
      onChangeText={onHeightChange}
      keyboardType="numeric"
      maxLength={3}
    />
  </View>
);

const GenderStep = ({ value, onChange }) => (
  <View style={styles.stepContent}>
    {GENDERS.map((g) => (
      <TouchableOpacity
        key={g}
        style={[styles.optionCard, value === g && styles.optionCardSelected]}
        onPress={() => onChange(g)}
        activeOpacity={0.7}
      >
        <Text style={[styles.optionText, value === g && styles.optionTextSelected]}>
          {g}
        </Text>
        {value === g && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>
    ))}
  </View>
);

const LocationStep = ({ value, onChange }) => (
  <View style={styles.stepContent}>
    <Text style={styles.inputLabel}>City or region</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g. San Francisco, CA"
      placeholderTextColor={COLORS.textLight}
      value={value}
      onChangeText={onChange}
      autoFocus
      returnKeyType="done"
    />
    <Text style={styles.hint}>
      🌡 Warmer climates increase your hydration needs by up to 20%.
    </Text>
  </View>
);

const SummaryStep = ({ data }) => {
  const goal = calcDailyGoal(parseFloat(data.weight) || 70);
  return (
    <View style={styles.stepContent}>
      <View style={styles.summaryCard}>
        <View style={styles.goalCircle}>
          <Text style={styles.goalNumber}>{goal}</Text>
          <Text style={styles.goalUnit}>ml / day</Text>
        </View>
        <Text style={styles.summaryName}>Hey, {data.name || 'there'}! 👋</Text>
        <Text style={styles.summaryText}>Your personalized daily goal</Text>
      </View>
      <View style={styles.summaryStats}>
        {[
          { label: 'Weight', value: `${data.weight || '—'} kg` },
          { label: 'Height', value: `${data.height || '—'} cm` },
          { label: 'Age', value: `${data.age || '—'} yrs` },
          { label: 'Location', value: data.location || '—' },
        ].map(({ label, value }) => (
          <View key={label} style={styles.statRow}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const OnboardingScreen = () => {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    location: '',
  });

  const updateField = (field) => (val) => setFormData((p) => ({ ...p, [field]: val }));

  const animateTransition = (cb) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(cb, 150);
  };

  const goNext = () => {
    if (step < STEPS.length - 1) {
      animateTransition(() => setStep((s) => s + 1));
    } else {
      completeOnboarding({
        name: formData.name || 'Alex',
        age: parseInt(formData.age) || 28,
        weight: parseFloat(formData.weight) || 70,
        height: parseFloat(formData.height) || 175,
        gender: formData.gender || 'Prefer not to say',
        location: formData.location || 'Your city',
        avatarInitials: (formData.name || 'A').charAt(0).toUpperCase() + 'J',
      });
    }
  };

  const goBack = () => {
    if (step > 0) animateTransition(() => setStep((s) => s - 1));
  };

  const currentStep = STEPS[step];

  const renderStep = () => {
    switch (currentStep.id) {
      case 'welcome':   return <WelcomeStep />;
      case 'name':      return <NameStep value={formData.name} onChange={updateField('name')} />;
      case 'age':       return <AgeStep value={formData.age} onChange={updateField('age')} />;
      case 'body':      return <BodyStep weight={formData.weight} height={formData.height} onWeightChange={updateField('weight')} onHeightChange={updateField('height')} />;
      case 'gender':    return <GenderStep value={formData.gender} onChange={updateField('gender')} />;
      case 'location':  return <LocationStep value={formData.location} onChange={updateField('location')} />;
      case 'summary':   return <SummaryStep data={formData} />;
      default:          return null;
    }
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        {/* Progress dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
            />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.stepTitle}>{currentStep.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>
            {renderStep()}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.7}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, step === 0 && styles.nextBtnFull]}
            onPress={goNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>
              {isLastStep ? 'Start Tracking 🚀' : step === 0 ? "Let's go!" : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  kav: {
    flex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 22,
    backgroundColor: COLORS.primary,
  },
  dotDone: {
    backgroundColor: COLORS.primaryLight,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 36,
    lineHeight: 22,
  },
  stepContent: {
    flex: 1,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  featurePills: {
    gap: 10,
  },
  pill: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  pillText: {
    fontSize: 15,
    color: COLORS.primaryDeep,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    color: COLORS.text,
    fontWeight: '500',
  },
  hint: {
    marginTop: 16,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    backgroundColor: COLORS.accentLight,
    padding: 12,
    borderRadius: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 10,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryPale,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.primaryDeep,
    fontWeight: '700',
  },
  checkMark: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  goalCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  goalNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
  goalUnit: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  summaryCard: {
    alignItems: 'center',
    marginBottom: 28,
  },
  summaryName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryStats: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 12,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  nextBtnFull: {
    flex: 1,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textInverse,
    letterSpacing: 0.3,
  },
});

export default OnboardingScreen;
