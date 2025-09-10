'use client';

import { Box, Paper, Typography } from '@mui/material';
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
}

interface Planet {
  name: string;
  orbitalPeriod: number;
  icon: string;
  nameKey: string;
}

const PlanetaryAges: React.FC<PlanetaryAgesProps> = ({ ageResult }) => {
  const { t } = useTranslation();

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
                <Typography
                  variant='body1'
                  className={styles['planetary-ages__planet-text']}
                >
                  {t(`ageCalculator.planetaryAges.planets.${planet.nameKey}`)}:{' '}
                  {planetAge} {t('ageCalculator.planetaryAges.yearsOld')}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default PlanetaryAges;
