'use client';

import CakeIcon from '@mui/icons-material/Cake';
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BirthdayCountdown.module.scss';

interface BirthdayCountdownProps {
  birthDate: Date;
  currentAge: number;
}

const BirthdayCountdown: React.FC<BirthdayCountdownProps> = ({ birthDate }) => {
  const { t } = useTranslation();

  const calculateDaysUntilBirthday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    let nextBirthday = new Date(
      currentYear,
      birthDate.getMonth(),
      birthDate.getDate()
    );

    // Eğer bu yılki doğum günü geçtiyse, gelecek yılki doğum gününü hesapla
    if (nextBirthday < today) {
      nextBirthday = new Date(
        currentYear + 1,
        birthDate.getMonth(),
        birthDate.getDate()
      );
    }

    // Bugün doğum günü mü kontrol et
    const isToday =
      today.getDate() === birthDate.getDate() &&
      today.getMonth() === birthDate.getMonth();

    if (isToday) {
      return { days: 0, nextBirthday, isToday: true };
    }

    const timeDiff = nextBirthday.getTime() - today.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return { days, nextBirthday, isToday: false };
  };

  const { days, isToday } = calculateDaysUntilBirthday();

  return (
    <Card className={`${styles['birthday-countdown']}`} elevation={2}>
      <CardContent className={styles['birthday-countdown__content']}>
        <Box className={styles['birthday-countdown__header']}>
          <CakeIcon className={styles['birthday-countdown__icon']} />
          <Typography
            variant='h5'
            className={styles['birthday-countdown__title']}
          >
            {t('ageCalculator.birthdayCountdown.title')}
          </Typography>
          <CakeIcon className={styles['birthday-countdown__icon']} />
        </Box>

        <Box className={styles['birthday-countdown__main']}>
          {isToday ? (
            <Box className={styles['birthday-countdown__today']}>
              <Typography
                variant='h4'
                className={styles['birthday-countdown__today-text']}
              >
                {t('ageCalculator.birthdayCountdown.today')}
              </Typography>
            </Box>
          ) : (
            <>
              <Box className={styles['birthday-countdown__days']}>
                <Typography
                  variant='h2'
                  className={styles['birthday-countdown__days-number']}
                >
                  {days}
                </Typography>
                <Typography
                  variant='body1'
                  className={styles['birthday-countdown__days-text']}
                >
                  {days === 1
                    ? t('ageCalculator.birthdayCountdown.dayLeft', { days })
                    : t('ageCalculator.birthdayCountdown.daysLeft', { days })}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BirthdayCountdown;
