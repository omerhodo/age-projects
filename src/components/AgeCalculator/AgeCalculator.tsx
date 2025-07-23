'use client';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Paper,
    Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { enUS, tr } from 'date-fns/locale';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AgeCalculator.scss';

interface AgeResult {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
}

const AgeCalculator: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
    const [error, setError] = useState<string>('');

    // Get appropriate locale for date picker
    const getDateLocale = () => {
        return i18n.language === 'tr' ? tr : enUS;
    };

    const calculateAge = () => {
        if (!birthDate) {
            setError(t('ageCalculator.errors.selectBirthDate'));
            return;
        }

        const today = new Date();
        const birth = new Date(birthDate);

        if (birth > today) {
            setError(t('ageCalculator.errors.futureDate'));
            return;
        }

        setError('');

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Toplam hesaplamalar
        const timeDiff = today.getTime() - birth.getTime();
        const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        const totalHours = Math.floor(timeDiff / (1000 * 3600));
        const totalMinutes = Math.floor(timeDiff / (1000 * 60));

        setAgeResult({
            years,
            months,
            days,
            totalDays,
            totalHours,
            totalMinutes,
        });
    };

    const handleReset = () => {
        setBirthDate(null);
        setAgeResult(null);
        setError('');
    };

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={getDateLocale()}
        >
            <div className='age-calculator'>
                <Card className='age-calculator__card' elevation={3}>
                    <CardContent className='age-calculator__content'>
                        <Box className='age-calculator__header'>
                            <CalendarTodayIcon className='age-calculator__icon' />
                            <Typography variant='h4' className='age-calculator__title'>
                                {t('ageCalculator.title')}
                            </Typography>
                        </Box>

                        <Box className='age-calculator__form'>
                            <DatePicker
                                label={t('ageCalculator.birthDateLabel')}
                                value={birthDate}
                                onChange={(newValue: Date | null) => setBirthDate(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        className: 'age-calculator__input',
                                        variant: 'outlined',
                                    },
                                }}
                                format='dd/MM/yyyy'
                                maxDate={new Date()}
                            />

                            {error && (
                                <Alert severity='error' className='age-calculator__error'>
                                    {error}
                                </Alert>
                            )}

                            <Box className='age-calculator__buttons'>
                                <Button
                                    variant='contained'
                                    onClick={calculateAge}
                                    className='age-calculator__button age-calculator__button--primary'
                                    size='large'
                                    disabled={!birthDate}
                                >
                                    {t('ageCalculator.calculateButton')}
                                </Button>
                                <Button
                                    variant='outlined'
                                    onClick={handleReset}
                                    className='age-calculator__button age-calculator__button--secondary'
                                    size='large'
                                >
                                    {t('ageCalculator.clearButton')}
                                </Button>
                            </Box>
                        </Box>

                        {ageResult && (
                            <Paper className='age-calculator__result' elevation={2}>
                                <Typography
                                    variant='h5'
                                    className='age-calculator__result-title'
                                >
                                    {t('ageCalculator.yourAge')}
                                </Typography>

                                <Box className='age-calculator__result-main'>
                                    <Typography
                                        variant='h3'
                                        className='age-calculator__age-display'
                                    >
                                        {ageResult.years} {t('ageCalculator.years')}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        className='age-calculator__age-detail'
                                    >
                                        {ageResult.months} {t('ageCalculator.months')}{' '}
                                        {ageResult.days} {t('ageCalculator.days')}
                                    </Typography>
                                </Box>

                                <Box className='age-calculator__statistics'>
                                    <div className='age-calculator__stat'>
                                        <Typography
                                            variant='h6'
                                            className='age-calculator__stat-number'
                                        >
                                            {ageResult.totalDays.toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            className='age-calculator__stat-label'
                                        >
                                            {t('ageCalculator.totalDays')}
                                        </Typography>
                                    </div>
                                    <div className='age-calculator__stat'>
                                        <Typography
                                            variant='h6'
                                            className='age-calculator__stat-number'
                                        >
                                            {ageResult.totalHours.toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            className='age-calculator__stat-label'
                                        >
                                            {t('ageCalculator.totalHours')}
                                        </Typography>
                                    </div>
                                    <div className='age-calculator__stat'>
                                        <Typography
                                            variant='h6'
                                            className='age-calculator__stat-number'
                                        >
                                            {ageResult.totalMinutes.toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            className='age-calculator__stat-label'
                                        >
                                            {t('ageCalculator.totalMinutes')}
                                        </Typography>
                                    </div>
                                </Box>
                            </Paper>
                        )}
                    </CardContent>
                </Card>
            </div>
        </LocalizationProvider>
    );
};

export default AgeCalculator;
