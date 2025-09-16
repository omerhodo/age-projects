'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAdMob } from '../../hooks/useAdMob';
import { useConsent } from '../../providers/ConsentProvider';

interface OptOutLinkProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'link' | 'button';
}

export const OptOutLink: React.FC<OptOutLinkProps> = ({
  className = '',
  style = {},
  variant = 'button',
}) => {
  const { t } = useTranslation();
  const { resetConsent, consentInfo } = useConsent();
  const adMob = useAdMob();

  if (
    consentInfo.consentStatus === 'NOT_REQUIRED' ||
    !consentInfo.canRequestAds
  ) {
    return null;
  }

  const handleOptOut = async () => {
    if (variant === 'link') {
      window.open('/opt-out', '_blank');
      return;
    }

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

      resetConsent();
      window.location.reload();
    }
  };

  const baseStyle = {
    background: 'none',
    border: 'none',
    color: 'inherit',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 'inherit',
    padding: '0',
    ...style,
  };

  return (
    <button
      onClick={handleOptOut}
      className={`opt-out-link ${className}`}
      style={baseStyle}
      title={t('consent.optOut.title', {
        defaultValue: 'Kişiselleştirilmiş reklamları devre dışı bırak',
      })}
    >
      {t('consent.optOut.text', {
        defaultValue: 'Reklamları Devre Dışı Bırak',
      })}
    </button>
  );
};
