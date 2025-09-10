'use client';

import { Box, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PlanetaryAges.module.scss';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}

interface PlanetaryAgesProps {
  ageResult: AgeResult;
  birthDate: Date;
}

interface Planet {
  name: string;
  orbitalPeriod: number;
  icon: string;
  nameKey: string;
}

const PlanetaryAges: React.FC<PlanetaryAgesProps> = ({
  ageResult,
  birthDate,
}) => {
  const { t, i18n } = useTranslation();

  const getDateLocale = () => {
    return i18n.language === 'tr' ? tr : enUS;
  };

  const planets: Planet[] = [
    {
      name: 'Mercury',
      nameKey: 'mercury',
      orbitalPeriod: 88,
      icon: '/planets/1mercury.svg',
    },
    {
      name: 'Venus',
      nameKey: 'venus',
      orbitalPeriod: 225,
      icon: '/planets/2venus.svg',
    },
    {
      name: 'Earth',
      nameKey: 'earth',
      orbitalPeriod: 365,
      icon: '/planets/3earth.svg',
    },
    {
      name: 'Mars',
      nameKey: 'mars',
      orbitalPeriod: 687,
      icon: '/planets/4mars.svg',
    },
    {
      name: 'Jupiter',
      nameKey: 'jupiter',
      orbitalPeriod: 4333,
      icon: '/planets/5jupiter.svg',
    },
    {
      name: 'Saturn',
      nameKey: 'saturn',
      orbitalPeriod: 10759,
      icon: '/planets/6saturn.svg',
    },
    {
      name: 'Uranus',
      nameKey: 'uranus',
      orbitalPeriod: 30687,
      icon: '/planets/7uranus.svg',
    },
    {
      name: 'Neptune',
      nameKey: 'neptune',
      orbitalPeriod: 60190,
      icon: '/planets/8neptune.svg',
    },
  ];

  const calculatePlanetAge = (
    totalDays: number,
    orbitalPeriod: number
  ): number => {
    return Math.round((totalDays / orbitalPeriod) * 10) / 10;
  };

  const calculateNextPlanetBirthday = (
    birthDate: Date,
    orbitalPeriod: number
  ): string => {
    if (!birthDate || isNaN(birthDate.getTime())) {
      return '';
    }

    const today = new Date();
    const daysSinceBirth = Math.floor(
      (today.getTime() - birthDate.getTime()) / (1000 * 3600 * 24)
    );

    const planetAge = Math.floor(daysSinceBirth / orbitalPeriod);
    const nextBirthdayInDays = (planetAge + 1) * orbitalPeriod;
    const nextBirthdayDate = new Date(birthDate);
    nextBirthdayDate.setDate(nextBirthdayDate.getDate() + nextBirthdayInDays);

    return format(nextBirthdayDate, 'dd/MM/yyyy', { locale: getDateLocale() });
  };

  return (
    <Paper className={styles['planetary-ages']} elevation={2}>
      <Box className={styles['planetary-ages__header']}>
        <Typography variant='h5' className={styles['planetary-ages__title']}>
          {t('ageCalculator.planetaryAges.title')}
        </Typography>
        <Typography
          variant='body2'
          className={styles['planetary-ages__subtitle']}
        >
          {t('ageCalculator.planetaryAges.subtitle')}
        </Typography>
      </Box>

      <Box className={styles['planetary-ages__content']}>
        {planets.map((planet) => {
          const planetAge = calculatePlanetAge(
            ageResult.totalDays,
            planet.orbitalPeriod
          );
          const nextBirthday = calculateNextPlanetBirthday(
            birthDate,
            planet.orbitalPeriod
          );

          return (
            <Box key={planet.name} className={styles['planetary-ages__item']}>
              <Box className={styles['planetary-ages__planet-info']}>
                <Image
                  src={planet.icon}
                  alt={t(
                    `ageCalculator.planetaryAges.planets.${planet.nameKey}`
                  )}
                  width={32}
                  height={32}
                  className={styles['planetary-ages__planet-icon']}
                />
                <Box className={styles['planetary-ages__planet-details']}>
                  <Typography
                    variant='body1'
                    className={styles['planetary-ages__planet-text']}
                  >
                    {t(`ageCalculator.planetaryAges.planets.${planet.nameKey}`)}
                    : {planetAge} {t('ageCalculator.planetaryAges.yearsOld')}
                  </Typography>
                  {nextBirthday && (
                    <Typography
                      variant='body2'
                      className={styles['planetary-ages__next-birthday']}
                    >
                      {t('ageCalculator.planetaryAges.nextBirthday')}:{' '}
                      {nextBirthday}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default PlanetaryAges;
