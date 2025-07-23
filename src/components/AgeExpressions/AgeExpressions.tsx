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
}

const AgeExpressions: React.FC<AgeExpressionsProps> = ({ ageResult, birthDate }) => {
    const { t, i18n } = useTranslation();

    const getDateLocale = () => {
        return i18n.language === 'tr' ? tr : enUS;
    };

    const getNextBirthdayInfo = (birthDate: Date) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

        if (nextBirthday <= today) {
            nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
        }

        return {
            date: format(nextBirthday, 'dd/MM/yyyy', { locale: getDateLocale() }),
            age: nextBirthday.getFullYear() - birthDate.getFullYear()
        };
    };

    const nextBirthdayInfo = getNextBirthdayInfo(birthDate);

    const params = {
        age: ageResult.years,
        years: ageResult.years,
        months: ageResult.months,
        days: ageResult.days,
        nextBirthday: nextBirthdayInfo.date,
        nextAge: nextBirthdayInfo.age
    };

    return (
        <Paper className={styles['age-expressions']} elevation={2}>
            <Box className={styles['age-expressions__header']}>
                <Typography
                    variant='h5'
                    className={styles['age-expressions__title']}
                >
                    {t('ageCalculator.ageExpressions.title')}
                </Typography>
            </Box>

            <Box className={styles['age-expressions__content']}>
                {[1, 2, 3, 4, 5].map((index) => {
                    const variantKey = `variant${index}`;

                    return (
                        <Typography
                            key={index}
                            variant='body1'
                            className={styles['age-expressions__item']}
                        >
                            {t(`ageCalculator.ageExpressions.${variantKey}`, params)}
                        </Typography>
                    );
                })}
            </Box>
        </Paper>
    );
};

export default AgeExpressions;
