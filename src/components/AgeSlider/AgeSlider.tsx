'use client';

import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AgeSlider.module.scss';

interface AgeSliderProps {
  currentAge: number;
  months: number;
}

const AgeSlider: React.FC<AgeSliderProps> = ({ currentAge, months }) => {
  const { t } = useTranslation();
  const [animationProgress, setAnimationProgress] = useState(0);

  const ageRangeStart = Math.max(0, currentAge - 5);
  const ageRangeEnd = currentAge + 5;
  const totalAgeRange = ageRangeEnd - ageRangeStart;

  const exactCurrentAge = currentAge + months / 12;
  const progressPercentage = ((exactCurrentAge - ageRangeStart) / totalAgeRange) * 100;

  useEffect(() => {
    setAnimationProgress(0);

    const timer = setTimeout(() => {
      setAnimationProgress(progressPercentage);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentAge, months, progressPercentage]);

  const previousAge = currentAge - 1;
  const nextAge = currentAge + 1;

  return (
    <Box className={styles['age-slider']}>
      <Box className={styles['age-slider__container']}>
        <Box className={styles['age-slider__labels']}>
          <Typography
            variant="body2"
            className={`${styles['age-slider__label']} ${styles['age-slider__label--previous']}`}
          >
            {previousAge}
          </Typography>
          <Typography
            variant="h6"
            className={`${styles['age-slider__label']} ${styles['age-slider__label--current']}`}
          >
            {currentAge}
          </Typography>
          <Typography
            variant="body2"
            className={`${styles['age-slider__label']} ${styles['age-slider__label--next']}`}
          >
            {nextAge}
          </Typography>
        </Box>

        <Box className={styles['age-slider__range-labels']}>
          <Typography variant="caption" className={styles['age-slider__range-start']}>
            {ageRangeStart}
          </Typography>
          <Typography variant="caption" className={styles['age-slider__range-end']}>
            {ageRangeEnd}
          </Typography>
        </Box>
        <Box className={styles['age-slider__track']}>
          <Box className={styles['age-slider__track-bg']} />
          <Box
            className={styles['age-slider__track-progress']}
            style={{
              width: `${animationProgress}%`,
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
          <Box
            className={styles['age-slider__indicator']}
            style={{
              left: `${animationProgress}%`,
              transition: 'left 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
          <Box className={styles['age-slider__month-markers']}>
            {Array.from({ length: 13 }, (_, i) => {
              const currentAgePosition = ((currentAge - ageRangeStart) / totalAgeRange) * 100;
              const nextAgePosition = ((nextAge - ageRangeStart) / totalAgeRange) * 100;
              const monthPosition = currentAgePosition + (i / 12) * (nextAgePosition - currentAgePosition);

              return (
                <Box
                  key={i}
                  className={styles['age-slider__month-marker']}
                  style={{ left: `${monthPosition}%` }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AgeSlider;
