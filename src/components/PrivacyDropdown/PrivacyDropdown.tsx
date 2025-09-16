'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsent } from '../../providers/ConsentProvider';
import { useAdMob } from '../../hooks/useAdMob';
import styles from './PrivacyDropdown.module.scss';

interface PrivacyDropdownProps {
  className?: string;
}

export const PrivacyDropdown: React.FC<PrivacyDropdownProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  const { showPrivacyOptions, consentInfo, resetConsent } = useConsent();
  const adMob = useAdMob();
  const router = useRouter();
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

  const handleOptOut = async () => {
    // Show confirmation similar to the OptOutLink behavior
    if (
      window.confirm(
        t('consent.optOut.confirmMessage', {
          defaultValue:
            'Kişiselleştirilmiş reklamları devre dışı bırakmak istediğinizden emin misiniz? Bu işlem sayfayı yeniden yükleyecektir.',
        })
      )
    ) {
      try {
        await adMob.removeBanner();
      } catch (err) {
        console.error('Error removing banner before opt-out:', err);
      }

      // Use the provider's resetConsent and then reload
      resetConsent();
      window.location.reload();
    }
    setIsOpen(false);
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
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
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
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
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
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
