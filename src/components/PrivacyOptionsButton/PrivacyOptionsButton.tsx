'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConsent } from '../../providers/ConsentProvider';

interface PrivacyOptionsButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const PrivacyOptionsButton: React.FC<PrivacyOptionsButtonProps> = ({
  className = '',
  style = {},
}) => {
  const { t } = useTranslation();
  const { showPrivacyOptions, consentInfo } = useConsent();

  // Eğer consent gerekli değilse butonu gösterme
  if (consentInfo.consentStatus === 'NOT_REQUIRED') {
    return null;
  }

  const handleClick = () => {
    showPrivacyOptions();
  };

  return (
    <button
      onClick={handleClick}
      className={`privacy-options-btn ${className}`}
      style={{
        padding: '8px 16px',
        border: '1px solid #ddd',
        background: 'transparent',
        color: '#666',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = '#f5f5f5';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
      title={t('consent.privacyOptionsButton')}
    >
      {t('consent.privacyOptionsButton')}
    </button>
  );
};
