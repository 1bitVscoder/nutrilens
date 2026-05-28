'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useUserStore } from '@/store/userStore';
import { useMealStore } from '@/store/mealStore';
import { useChatStore } from '@/store/chatStore';
import { useTheme } from '@/components/ThemeProvider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { DIETARY_RESTRICTIONS, GOAL_LABELS, Goal } from '@/lib/nutrition';
import { SEED_COLOR_PRESETS } from '@/lib/theme';

export default function ProfilePage() {
  const profile = useUserStore((s) => s.profile);
  const targets = useUserStore((s) => s.targets);
  const tdee = useUserStore((s) => s.tdee);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const updateGoal = useUserStore((s) => s.updateGoal);
  const resetOnboarding = useUserStore((s) => s.resetOnboarding);
  const clearAllMeals = useMealStore((s) => s.clearAllMeals);
  const clearChatHistory = useChatStore((s) => s.clearHistory);
  const { seedColor, isDark, setSeedColor, toggleDarkMode } = useTheme();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');
  const [editAge, setEditAge] = useState(String(profile?.age || ''));
  const [editHeight, setEditHeight] = useState(String(profile?.heightCm || ''));
  const [editWeight, setEditWeight] = useState(String(profile?.weightKg || ''));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openEditModal = () => {
    setEditName(profile?.name || '');
    setEditAge(String(profile?.age || ''));
    setEditHeight(String(profile?.heightCm || ''));
    setEditWeight(String(profile?.weightKg || ''));
    setErrors({});
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    const newErrors: Record<string, string> = {};
    const ageNum = parseInt(editAge);
    const heightNum = parseFloat(editHeight);
    const weightNum = parseFloat(editWeight);

    if (!editName.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!editAge) {
      newErrors.age = 'Age is required.';
    } else if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      newErrors.age = 'Age must be between 13 and 120.';
    }

    if (!editHeight) {
      newErrors.height = 'Height is required.';
    } else if (isNaN(heightNum) || heightNum < 50 || heightNum > 280) {
      newErrors.height = 'Height must be between 50 and 280 cm.';
    }

    if (!editWeight) {
      newErrors.weight = 'Weight is required.';
    } else if (isNaN(weightNum) || weightNum < 20 || weightNum > 400) {
      newErrors.weight = 'Weight must be between 20 and 400 kg.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateProfile({
      name: editName.trim(),
      age: ageNum,
      heightCm: heightNum,
      weightKg: weightNum,
    });
    setErrors({});
    setEditModalOpen(false);
  };

  const handleReset = () => {
    clearAllMeals();
    clearChatHistory();
    resetOnboarding();
    setResetModalOpen(false);
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '16px', paddingTop: '8px' }}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="headline-medium"
        style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '20px', paddingTop: '8px' }}
      >
        ⚙️ Profile & Settings
      </motion.h1>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="elevated" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              {profile?.name?.[0]?.toUpperCase() || '👤'}
            </div>
            <div style={{ flex: 1 }}>
              <div className="title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                {profile?.name || 'User'}
              </div>
              <div className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {profile?.sex === 'male' ? '♂' : '♀'} {profile?.age} yrs · {profile?.heightCm}cm · {profile?.weightKg}kg
              </div>
            </div>
            <Button variant="tonal" size="sm" onClick={openEditModal}>
              Edit
            </Button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-small)' }}>
              <div className="title-small" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>{tdee}</div>
              <div className="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>TDEE</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-small)' }}>
              <div className="title-small" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>{targets.calories}</div>
              <div className="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Target</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-small)' }}>
              <div className="title-small" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>
                {GOAL_LABELS[profile?.goal || 'maintain'].emoji}
              </div>
              <div className="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {GOAL_LABELS[profile?.goal || 'maintain'].title}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Goal */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginTop: '16px' }}>
        <Card variant="outlined" padding="md">
          <div className="title-small" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '10px' }}>Goal</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
              <Chip
                key={g}
                label={`${GOAL_LABELS[g].emoji} ${GOAL_LABELS[g].title}`}
                variant="filter"
                selected={profile?.goal === g}
                onSelect={() => updateGoal(g)}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Dietary Restrictions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '16px' }}>
        <Card variant="outlined" padding="md">
          <div className="title-small" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '10px' }}>Dietary Preferences</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {DIETARY_RESTRICTIONS.map((r) => (
              <Chip
                key={r}
                label={r}
                variant="filter"
                selected={profile?.dietaryRestrictions?.includes(r) || false}
                onSelect={() => {
                  const current = profile?.dietaryRestrictions || [];
                  const updated = current.includes(r)
                    ? current.filter((x) => x !== r)
                    : [...current, r];
                  updateProfile({ dietaryRestrictions: updated });
                }}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginTop: '16px' }}>
        <Card variant="outlined" padding="md">
          <div className="title-small" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '10px' }}>Theme</div>

          {/* Dark mode toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="body-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <button
              onClick={toggleDarkMode}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: isDark ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.3s',
                outline: 'none',
              }}
            >
              <motion.div
                animate={{ x: isDark ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '2px',
                  left: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>

          {/* Color picker */}
          <span className="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'block', marginBottom: '8px' }}>
            Accent Color
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {SEED_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setSeedColor(preset.hex)}
                title={preset.name}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: preset.hex,
                  border: seedColor === preset.hex
                    ? '3px solid var(--md-sys-color-on-surface)'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border 0.2s, transform 0.15s',
                  transform: seedColor === preset.hex ? 'scale(1.1)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: '16px', marginBottom: '24px' }}>
        <Card variant="outlined" padding="md">
          <div className="title-small" style={{ color: 'var(--md-sys-color-error)', marginBottom: '10px' }}>Data Management</div>
          <Button variant="outlined" onClick={() => setResetModalOpen(true)} fullWidth>
            🗑️ Reset All Data
          </Button>
        </Card>
      </motion.div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        actions={
          <>
            <Button variant="text" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={handleSaveEdit}>Save</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Name"
            value={editName}
            onChange={(val) => {
              setEditName(val);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
          />
          <Input
            label="Age"
            value={editAge}
            onChange={(val) => {
              setEditAge(val);
              if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
            }}
            type="number"
            error={errors.age}
          />
          <Input
            label="Height (cm)"
            value={editHeight}
            onChange={(val) => {
              setEditHeight(val);
              if (errors.height) setErrors((prev) => ({ ...prev, height: '' }));
            }}
            type="number"
            error={errors.height}
          />
          <Input
            label="Weight (kg)"
            value={editWeight}
            onChange={(val) => {
              setEditWeight(val);
              if (errors.weight) setErrors((prev) => ({ ...prev, weight: '' }));
            }}
            type="number"
            error={errors.weight}
          />
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset All Data?"
        actions={
          <>
            <Button variant="text" onClick={() => setResetModalOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={handleReset}>Reset</Button>
          </>
        }
      >
        <p>This will delete all your meals, chat history, and profile data. This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
