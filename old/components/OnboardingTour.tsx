import React, { useState, useEffect, memo } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { ONBOARDING_START_DELAY_MS } from '../constants/timing';
import { STORAGE_KEYS } from '../constants/storage';
import { designTokens } from '../styles/tokens';

const tourSteps: Step[] = [
  {
    target: 'input[placeholder*="App Name"]',
    content: 'Start by entering your app name. This helps our AI understand your brand and create targeted designs.',
    disableBeacon: true,
  },
  {
    target: '[data-tour="screenshot-uploader"]',
    content: 'Upload 3-8 screenshots of your app. The AI will analyze them to create perfect App Store showcases. You can drag to reorder!',
  },
  {
    target: '[data-tour="background-selector"]',
    content: 'The AI will generate 3D backgrounds that match your app category and brand colors. You can also use custom colors or upload your own.',
  },
  {
    target: '[data-tour="generate-button"]',
    content: 'Click here to let our 3-agent AI system design your screenshots in 60 seconds. V1 creates concepts, V2 refines visuals, V3 polishes copy.',
  },
  {
    target: '[data-tour="manual-controls"]',
    content: 'Fine-tune every detail manually if needed: theme mode, frame style, accent colors, and more.',
  },
  {
    target: '[data-tour="export-button"]',
    content: 'Export your final designs in multiple sizes for the App Store. Supports PNG, JPG, WebP, and PDF formats.',
  },
];

const OnboardingTourComponent: React.FC = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    if (!hasSeenTour) {
      // Delay tour start to let page render
      const timer = setTimeout(() => {
        setRun(true);
      }, ONBOARDING_START_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: designTokens.colors.brand.primary,
          backgroundColor: designTokens.colors.bg.tertiary,
          textColor: designTokens.colors.text.primary,
          arrowColor: designTokens.colors.bg.tertiary,
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: parseInt(designTokens.borderRadius.md),
          padding: 20,
        },
        buttonNext: {
          backgroundColor: designTokens.colors.brand.primary,
          borderRadius: parseInt(designTokens.borderRadius.sm),
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#9CA3AF',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#6B7280',
        },
      }}
    />
  );
};

// Memoize since it has no props that change
export default memo(OnboardingTourComponent);
