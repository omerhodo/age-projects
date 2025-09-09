'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const getCurrentFlag = () => {
    return i18n.language === 'tr' ? '🇹🇷' : '🇺🇸';
  };

  return (
    <div ref={dropdownRef} className={styles.languageSwitcher}>
      <button
        className={styles.languageSwitcher__trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.languageSwitcher__flag}>
          {getCurrentFlag()}
        </span>
        <span
          className={styles.languageSwitcher__arrow}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.languageSwitcher__menu}>
          <button
            className={`${styles.languageSwitcher__item} ${i18n.language === 'tr' ? styles.languageSwitcher__item_active : ''
              }`}
            onClick={() => handleLanguageChange('tr')}
          >
            <span className={styles.languageSwitcher__flag}>🇹🇷</span>
            <span className={styles.languageSwitcher__label}>Türkçe</span>
          </button>

          <button
            className={`${styles.languageSwitcher__item} ${i18n.language === 'en' ? styles.languageSwitcher__item_active : ''
              }`}
            onClick={() => handleLanguageChange('en')}
          >
            <span className={styles.languageSwitcher__flag}>🇺🇸</span>
            <span className={styles.languageSwitcher__label}>English</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
