'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsent } from '../../providers/ConsentProvider';
import styles from './PrivacyDropdown.module.scss';

interface PrivacyDropdownProps {
  className?: string;
}

export const PrivacyDropdown: React.FC<PrivacyDropdownProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  const { showPrivacyOptions, consentInfo } = useConsent();
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

  const handlePrivacyOptions = () => {
    showPrivacyOptions();
    setIsOpen(false);
  };

  const handleOptOut = () => {
    window.open('/opt-out', '_blank');
    setIsOpen(false);
  };

  const handlePrivacyPolicy = () => {
    window.open('/privacy-policy', '_blank');
    setIsOpen(false);
  };

  // Eğer consent gerekli değilse dropdown'u gösterme
  if (consentInfo.consentStatus === 'NOT_REQUIRED') {
    return (
      <div ref={dropdownRef} className={`${styles.dropdown} ${className}`}>
        <button
          className={styles.dropdown__trigger}
          onClick={() => setIsOpen(!isOpen)}
        >
          Gizlilik
          <span
            className={styles.dropdown__arrow}
            style={{
              transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            ▼
          </span>
        </button>
        {isOpen && (
          <div className={styles.dropdown__menu}>
            <button
              className={styles.dropdown__item}
              onClick={handlePrivacyPolicy}
            >
              {t('footer.privacyPolicy')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`${styles.dropdown} ${className}`}>
      <button
        className={styles.dropdown__trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        Gizlilik
        <span
          className={styles.dropdown__arrow}
          style={{
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className={styles.dropdown__menu}>
          <button
            className={styles.dropdown__item}
            onClick={handlePrivacyPolicy}
          >
            {t('footer.privacyPolicy')}
          </button>

          <button
            className={styles.dropdown__item}
            onClick={handlePrivacyOptions}
          >
            {t('consent.privacyOptionsButton')}
          </button>

          {consentInfo.canRequestAds && (
            <button className={styles.dropdown__item} onClick={handleOptOut}>
              {t('consent.optOut.text')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
