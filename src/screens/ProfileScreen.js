import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { GENDERS, calcDailyGoal } from '../constants/mockData';
import { useApp } from '../context/AppContext';
import XPBar from '../components/XPBar';

const InfoRow = ({ icon, label, value, onEdit }) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onEdit}
    activeOpacity={onEdit ? 0.6 : 1}
  >
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    {onEdit && <Text style={styles.infoChevron}>›</Text>}
  </TouchableOpacity>
);

const EditModal = ({ visible, field, label, value, onSave, onClose, keyboardType = 'default', options }) => {
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {label}</Text>
              <TouchableOpacity onPress={onClose} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {options ? (
              <View style={styles.optionsList}>
                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionRow, draft === opt && styles.optionRowSelected]}
                    onPress={() => setDraft(opt)}
                  >
                    <Text style={[styles.optionText, draft === opt && styles.optionTextSelected]}>
                      {opt}
                    </Text>
                    {draft === opt && <Text style={styles.optionCheck}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <TextInput
                style={styles.modalInput}
                value={String(draft)}
                onChangeText={setDraft}
                keyboardType={keyboardType}
                autoFocus
                selectTextOnFocus
              />
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const ProfileScreen = () => {
  const { user, updateUser, xp, stats } = useApp();
  const [editing, setEditing] = useState(null);

  const dailyGoal = calcDailyGoal(user.weight);

  const openEdit = (field) => setEditing(field);
  const closeEdit = () => setEditing(null);

  const handleSave = (field) => (value) => {
    const numFields = ['age', 'weight', 'height'];
    updateUser({ [field]: numFields.includes(field) ? parseFloat(value) || value : value });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Profile</Text>

        {/* Avatar & name */}
        <View style={styles.profileHero}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{user.avatarInitials || user.name?.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <View style={styles.levelBadgeSmall}>
            <Text style={styles.levelBadgeText}>Lvl {xp.level} · {xp.title}</Text>
          </View>
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>🎯 {dailyGoal} ml / day</Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          {[
            { label: 'Streak', value: `${stats.currentStreak}d`, emoji: '🔥' },
            { label: 'Best', value: `${stats.longestStreak}d`, emoji: '🏆' },
            { label: 'Tracked', value: `${stats.totalDaysTracked}d`, emoji: '📅' },
          ].map(({ label, value, emoji }) => (
            <View key={label} style={styles.quickStatItem}>
              <Text style={styles.quickStatEmoji}>{emoji}</Text>
              <Text style={styles.quickStatValue}>{value}</Text>
              <Text style={styles.quickStatLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Personal info */}
        <Text style={styles.sectionTitle}>Personal Info</Text>
        <View style={styles.card}>
          <InfoRow icon="👤" label="Name" value={user.name} onEdit={() => openEdit('name')} />
          <View style={styles.divider} />
          <InfoRow icon="🎂" label="Age" value={`${user.age} years`} onEdit={() => openEdit('age')} />
          <View style={styles.divider} />
          <InfoRow icon="⚖️" label="Weight" value={`${user.weight} kg`} onEdit={() => openEdit('weight')} />
          <View style={styles.divider} />
          <InfoRow icon="📏" label="Height" value={`${user.height} cm`} onEdit={() => openEdit('height')} />
          <View style={styles.divider} />
          <InfoRow icon="🧬" label="Gender" value={user.gender} onEdit={() => openEdit('gender')} />
          <View style={styles.divider} />
          <InfoRow icon="📍" label="Location" value={user.location} onEdit={() => openEdit('location')} />
        </View>

        {/* Hydration info */}
        <Text style={styles.sectionTitle}>Hydration Plan</Text>
        <View style={styles.card}>
          <InfoRow icon="🥤" label="Daily Goal" value={`${dailyGoal} ml`} />
          <View style={styles.divider} />
          <InfoRow icon="📐" label="Formula" value="30 ml × body weight" />
          <View style={styles.divider} />
          <InfoRow icon="💧" label="Per Hour (awake)" value={`~${Math.round(dailyGoal / 16)} ml`} />
        </View>

        {/* XP */}
        <Text style={styles.sectionTitle}>Level & XP</Text>
        <XPBar
          level={xp.level}
          currentXP={xp.currentXP}
          nextLevelXP={xp.nextLevelXP}
          title={xp.title}
        />

        {/* App settings */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Preferences</Text>
        <View style={styles.card}>
          <InfoRow icon="🔔" label="Reminders" value="Every 2 hours" />
          <View style={styles.divider} />
          <InfoRow icon="🌡" label="Units" value="Metric (ml, kg, cm)" />
          <View style={styles.divider} />
          <InfoRow icon="🌙" label="Dark Mode" value="System default" />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Edit modals */}
      <EditModal
        visible={editing === 'name'}
        field="name"
        label="Name"
        value={user.name}
        onSave={handleSave('name')}
        onClose={closeEdit}
      />
      <EditModal
        visible={editing === 'age'}
        field="age"
        label="Age"
        value={String(user.age)}
        onSave={handleSave('age')}
        onClose={closeEdit}
        keyboardType="numeric"
      />
      <EditModal
        visible={editing === 'weight'}
        field="weight"
        label="Weight (kg)"
        value={String(user.weight)}
        onSave={handleSave('weight')}
        onClose={closeEdit}
        keyboardType="decimal-pad"
      />
      <EditModal
        visible={editing === 'height'}
        field="height"
        label="Height (cm)"
        value={String(user.height)}
        onSave={handleSave('height')}
        onClose={closeEdit}
        keyboardType="decimal-pad"
      />
      <EditModal
        visible={editing === 'gender'}
        field="gender"
        label="Gender"
        value={user.gender}
        onSave={handleSave('gender')}
        onClose={closeEdit}
        options={GENDERS}
      />
      <EditModal
        visible={editing === 'location'}
        field="location"
        label="Location"
        value={user.location}
        onSave={handleSave('location')}
        onClose={closeEdit}
      />
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
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  profileHero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 7,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  levelBadgeSmall: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 10,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDeep,
  },
  goalBadge: {
    backgroundColor: COLORS.waterPale,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  goalBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.water,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 18,
    marginBottom: 28,
  },
  quickStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  quickStatEmoji: {
    fontSize: 20,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  quickStatLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: 50,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  infoIcon: {
    fontSize: 18,
    width: 26,
    textAlign: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
  },
  infoChevron: {
    fontSize: 20,
    color: COLORS.textLight,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 20,
  },
  optionsList: {
    marginBottom: 20,
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryPale,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.primaryDeep,
    fontWeight: '700',
  },
  optionCheck: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
});

export default ProfileScreen;
