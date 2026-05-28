'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useMealStore } from '@/store/mealStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Chip from '@/components/ui/Chip';
import {
  Goal,
  Sex,
  ActivityLevel,
  GOAL_LABELS,
  ACTIVITY_LABELS,
  DIETARY_RESTRICTIONS,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacroTargets,
} from '@/lib/nutrition';

const STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useUserStore((s) => s.setProfile);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const initializeMockData = useMealStore((s) => s.initializeMockData);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  // Form state
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const goNext = () => {
    if (step === 0) {
      if (!name.trim()) {
        setErrors({ name: 'Please enter your name to proceed.' });
        return;
      } else {
        setErrors({});
      }
    }

    if (step === 2) {
      const newErrors: Record<string, string> = {};
      const ageNum = parseInt(age);
      const heightNum = parseFloat(heightCm);
      const weightNum = parseFloat(weightKg);

      if (!age) {
        newErrors.age = 'Age is required.';
      } else if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        newErrors.age = 'Enter a valid age between 13 and 120.';
      }

      if (!heightCm) {
        newErrors.height = 'Height is required.';
      } else if (isNaN(heightNum) || heightNum < 50 || heightNum > 280) {
        newErrors.height = 'Enter a valid height between 50 and 280 cm.';
      }

      if (!weightKg) {
        newErrors.weight = 'Weight is required.';
      } else if (isNaN(weightNum) || weightNum < 20 || weightNum > 400) {
        newErrors.weight = 'Enter a valid weight between 20 and 400 kg.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      } else {
        setErrors({});
      }
    }

    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleFinish = () => {
    const profile = {
      name: name || 'User',
      age: parseInt(age) || 25,
      heightCm: parseFloat(heightCm) || 170,
      weightKg: parseFloat(weightKg) || 70,
      sex,
      activityLevel,
      goal,
      dietaryRestrictions: restrictions,
    };
    setProfile(profile);
    completeOnboarding();
    initializeMockData();
    router.push('/dashboard');
  };

  const toggleRestriction = (r: string) => {
    setRestrictions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  // Calculate preview values for step 4
  const previewProfile = {
    age: parseInt(age) || 25,
    heightCm: parseFloat(heightCm) || 170,
    weightKg: parseFloat(weightKg) || 70,
    sex,
    activityLevel,
    goal,
  };
  const previewTDEE = calculateTDEE(previewProfile);
  const previewCalories = calculateCalorieTarget(previewProfile);
  const previewMacros = calculateMacroTargets(previewCalories, goal);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--md-sys-color-surface)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px', marginTop: '16px' }}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 24 : 8,
              backgroundColor:
                i === step
                  ? 'var(--md-sys-color-primary)'
                  : i < step
                  ? 'var(--md-sys-color-primary-container)'
                  : 'var(--md-sys-color-outline-variant)',
            }}
            transition={{ duration: 0.3 }}
            style={{
              height: 8,
              borderRadius: 9999,
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '420px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            style={{ position: 'absolute', width: '100%' }}
          >
            {step === 0 && (
              /* Welcome */
              <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  style={{ fontSize: '80px', marginBottom: '24px' }}
                >
                  🥗
                </motion.div>
                <h1 className="headline-large" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '8px' }}>
                  Welcome to NutriLens
                </h1>
                <p className="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '32px' }}>
                  Point. Snap. Know.
                  <br />
                  AI-powered nutrition tracking made effortless.
                </p>
                <Input
                  label="What's your name?"
                  value={name}
                  onChange={(val) => {
                    setName(val);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  error={errors.name}
                  placeholder="Enter your name"
                />
              </div>
            )}

            {step === 1 && (
              /* Goal Selection */
              <div>
                <h2 className="headline-medium" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '8px' }}>
                  What&apos;s your goal?
                </h2>
                <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '24px' }}>
                  We&apos;ll personalize your calorie and macro targets.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => {
                    const info = GOAL_LABELS[g];
                    const isSelected = goal === g;
                    return (
                      <motion.button
                        key={g}
                        onClick={() => setGoal(g)}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '20px',
                          borderRadius: 'var(--md-sys-shape-corner-medium)',
                          border: isSelected
                            ? '2px solid var(--md-sys-color-primary)'
                            : '1px solid var(--md-sys-color-outline-variant)',
                          backgroundColor: isSelected
                            ? 'var(--md-sys-color-primary-container)'
                            : 'var(--md-sys-color-surface-container)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          outline: 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ fontSize: '32px' }}>{info.emoji}</span>
                        <div>
                          <div
                            className="title-medium"
                            style={{
                              color: isSelected
                                ? 'var(--md-sys-color-on-primary-container)'
                                : 'var(--md-sys-color-on-surface)',
                            }}
                          >
                            {info.title}
                          </div>
                          <div
                            className="body-small"
                            style={{
                              color: isSelected
                                ? 'var(--md-sys-color-on-primary-container)'
                                : 'var(--md-sys-color-on-surface-variant)',
                              marginTop: '2px',
                            }}
                          >
                            {info.description}
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ marginLeft: 'auto' }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--md-sys-color-primary)">
                              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              /* Body Metrics */
              <div>
                <h2 className="headline-medium" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '8px' }}>
                  Your body stats
                </h2>
                <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '24px' }}>
                  We use this to calculate your daily calorie needs.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Sex toggle */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['male', 'female'] as Sex[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSex(s)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: 'var(--md-sys-shape-corner-full)',
                          border: sex === s ? '2px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline)',
                          backgroundColor: sex === s ? 'var(--md-sys-color-primary-container)' : 'transparent',
                          color: sex === s ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        {s === 'male' ? '♂ Male' : '♀ Female'}
                      </button>
                    ))}
                  </div>

                  <Input
                    label="Age"
                    value={age}
                    onChange={(val) => {
                      setAge(val);
                      if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
                    }}
                    type="number"
                    error={errors.age}
                    placeholder="25"
                  />
                  <Input
                    label="Height (cm)"
                    value={heightCm}
                    onChange={(val) => {
                      setHeightCm(val);
                      if (errors.height) setErrors((prev) => ({ ...prev, height: '' }));
                    }}
                    type="number"
                    error={errors.height}
                    placeholder="170"
                  />
                  <Input
                    label="Weight (kg)"
                    value={weightKg}
                    onChange={(val) => {
                      setWeightKg(val);
                      if (errors.weight) setErrors((prev) => ({ ...prev, weight: '' }));
                    }}
                    type="number"
                    error={errors.weight}
                    placeholder="70"
                  />

                  {/* Activity Level */}
                  <div>
                    <span className="label-large" style={{ color: 'var(--md-sys-color-on-surface)', display: 'block', marginBottom: '8px' }}>
                      Activity Level
                    </span>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 'var(--md-sys-shape-corner-small)',
                        border: '1px solid var(--md-sys-color-outline)',
                        backgroundColor: 'var(--md-sys-color-surface)',
                        color: 'var(--md-sys-color-on-surface)',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                        <option key={level} value={level}>
                          {ACTIVITY_LABELS[level]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              /* Dietary Restrictions */
              <div>
                <h2 className="headline-medium" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '8px' }}>
                  Dietary preferences
                </h2>
                <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '24px' }}>
                  Select any that apply. This helps our AI give better suggestions.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DIETARY_RESTRICTIONS.map((r) => (
                    <Chip
                      key={r}
                      label={r}
                      variant="filter"
                      selected={restrictions.includes(r)}
                      onSelect={() => toggleRestriction(r)}
                    />
                  ))}
                </div>
                <p className="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '16px', textAlign: 'center' }}>
                  You can change these later in settings.
                </p>
              </div>
            )}

            {step === 4 && (
              /* TDEE Result */
              <div style={{ textAlign: 'center' }}>
                <h2 className="headline-medium" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '4px' }}>
                  Your personalized plan
                </h2>
                <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '28px' }}>
                  Based on your goals and body stats
                </p>

                {/* TDEE */}
                <div
                  style={{
                    backgroundColor: 'var(--md-sys-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    padding: '20px',
                    marginBottom: '16px',
                  }}
                >
                  <div className="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '4px' }}>
                    Your TDEE (maintenance)
                  </div>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="display-medium"
                    style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 700 }}
                  >
                    {previewTDEE.toLocaleString()}
                  </motion.div>
                  <div className="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>calories/day</div>
                </div>

                {/* Target */}
                <div
                  style={{
                    backgroundColor: 'var(--md-sys-color-primary-container)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    padding: '20px',
                    marginBottom: '16px',
                  }}
                >
                  <div className="label-medium" style={{ color: 'var(--md-sys-color-on-primary-container)', marginBottom: '4px' }}>
                    Your Daily Target ({GOAL_LABELS[goal].title})
                  </div>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="display-large"
                    style={{ color: 'var(--md-sys-color-on-primary-container)', fontWeight: 700 }}
                  >
                    {previewCalories.toLocaleString()}
                  </motion.div>
                  <div className="body-small" style={{ color: 'var(--md-sys-color-on-primary-container)' }}>calories/day</div>
                </div>

                {/* Macros */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'Protein', value: `${previewMacros.protein}g`, color: '#4ECDC4' },
                    { label: 'Carbs', value: `${previewMacros.carbs}g`, color: '#FFB347' },
                    { label: 'Fat', value: `${previewMacros.fat}g`, color: '#FF6B8A' },
                  ].map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      style={{
                        backgroundColor: 'var(--md-sys-color-surface-container)',
                        borderRadius: 'var(--md-sys-shape-corner-small)',
                        padding: '14px 8px',
                        textAlign: 'center',
                      }}
                    >
                      <div className="title-medium" style={{ color: m.color, fontWeight: 700 }}>
                        {m.value}
                      </div>
                      <div className="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
                        {m.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '24px' }}>
        {step > 0 && (
          <Button variant="outlined" onClick={goBack} fullWidth>
            Back
          </Button>
        )}
        {step < STEPS - 1 ? (
          <Button variant="filled" onClick={goNext} fullWidth>
            Continue
          </Button>
        ) : (
          <Button variant="filled" onClick={handleFinish} fullWidth>
            🚀 Get Started
          </Button>
        )}
      </div>
    </div>
  );
}
