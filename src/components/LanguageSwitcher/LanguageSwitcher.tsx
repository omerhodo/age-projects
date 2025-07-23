'use client';

import LanguageIcon from '@mui/icons-material/Language';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className={styles['language-switcher']}>
      <Box className={styles['language-switcher__container']}>
        <LanguageIcon className={styles['language-switcher__icon']} />
        <FormControl className={styles['language-switcher__form']} size='small'>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            className={styles['language-switcher__select']}
            variant='outlined'
            MenuProps={{
              className: styles['language-switcher__menu'],
            }}
          >
            <MenuItem value='tr' className={styles['language-switcher__item']}>
              <div className={styles['language-switcher__option']}>
                <span className={styles['language-switcher__flag']}>🇹🇷</span>
                <Typography variant='body2'>{t('common.turkish')}</Typography>
              </div>
            </MenuItem>
            <MenuItem value='en' className={styles['language-switcher__item']}>
              <div className={styles['language-switcher__option']}>
                <span className={styles['language-switcher__flag']}>🇺🇸</span>
                <Typography variant='body2'>{t('common.english')}</Typography>
              </div>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};

export default LanguageSwitcher;
