'use client';

import { Box, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AgeExpressions.module.scss';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}

interface AgeExpressionsProps {
  ageResult: AgeResult;
  birthDate: Date;
  maxVariants?: number;
  showAllAvailable?: boolean;
  debugMode?: boolean;
}

const AgeExpressions: React.FC<AgeExpressionsProps> = ({
  ageResult,
  birthDate,
  maxVariants = 5,
  showAllAvailable = false,
  debugMode = false,
}) => {
  const { t, i18n } = useTranslation();

  const DEFAULT_MAX_VARIANTS = 5;

  const getDateLocale = () => {
    return i18n.language === 'tr' ? tr : enUS;
  };

  const getNextBirthdayInfo = (birthDate: Date) => {
    if (!birthDate || isNaN(birthDate.getTime())) {
      const today = new Date();
      return {
        date: format(today, 'dd/MM/yyyy', { locale: getDateLocale() }),
        age: 0,
        nextBirthday: today,
      };
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    let nextBirthday = new Date(
      currentYear,
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (isNaN(nextBirthday.getTime())) {
      return {
        date: format(today, 'dd/MM/yyyy', { locale: getDateLocale() }),
        age: 0,
        nextBirthday: today,
      };
    }

    if (nextBirthday <= today) {
      nextBirthday = new Date(
        currentYear + 1,
        birthDate.getMonth(),
        birthDate.getDate()
      );
    }

    return {
      date: format(nextBirthday, 'dd/MM/yyyy', { locale: getDateLocale() }),
      age: nextBirthday.getFullYear() - birthDate.getFullYear(),
      nextBirthday: nextBirthday,
    };
  };

  const getDaysUntilBirthday = (nextBirthday: Date) => {
    if (!nextBirthday || isNaN(nextBirthday.getTime())) {
      return 0;
    }

    const today = new Date();
    const timeDiff = nextBirthday.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const getAvailableVariants = () => {
    const variants = [];
    let variantIndex = 1;

    while (true) {
      const translationKey = `ageCalculator.ageExpressions.variant${variantIndex}`;
      const translation = t(translationKey, { returnObjects: false });

      // If translation returns the key itself, it means the variant doesn't exist
      if (translation === translationKey) {
        break;
      }

      variants.push(variantIndex);
      variantIndex++;
    }

    if (showAllAvailable) {
      return variants;
    }

    const limit = maxVariants || DEFAULT_MAX_VARIANTS;
    return variants.slice(0, limit);
  };

  const nextBirthdayInfo = getNextBirthdayInfo(birthDate);
  const availableVariants = getAvailableVariants();
  const daysUntilBirthday = getDaysUntilBirthday(nextBirthdayInfo.nextBirthday);

  const params = {
    age: ageResult.years,
    years: ageResult.years,
    months: ageResult.months,
    days: ageResult.days,
    nextBirthday: nextBirthdayInfo.date,
    nextAge: nextBirthdayInfo.age,
    daysUntilBirthday: daysUntilBirthday,
  };

  return (
    <Paper className={styles['age-expressions']} elevation={2}>
      <Box className={styles['age-expressions__header']}>
        <Typography variant='h5' className={styles['age-expressions__title']}>
          {t('ageCalculator.ageExpressions.title')}
          {debugMode && (
            <Typography
              variant='caption'
              component='span'
              style={{ marginLeft: '10px', opacity: 0.7 }}
            >
              ({availableVariants.length} total, showing{' '}
              {availableVariants.length})
            </Typography>
          )}
        </Typography>
      </Box>

      <Box className={styles['age-expressions__content']}>
        {availableVariants.map((variantNumber) => {
          const variantKey = `variant${variantNumber}`;

          return (
            <Typography
              key={variantNumber}
              variant='body1'
              className={styles['age-expressions__item']}
            >
              {debugMode && (
                <span style={{ opacity: 0.6 }}>[{variantNumber}] </span>
              )}
              {t(`ageCalculator.ageExpressions.${variantKey}`, params)}
            </Typography>
          );
        })}
      </Box>
    </Paper>
  );
};

export default AgeExpressions;
