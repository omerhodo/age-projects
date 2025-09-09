'use client';

import { useTranslation } from 'react-i18next';

export default function OptOutPage() {
  const { t } = useTranslation();

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <main
        style={{
          flex: 1,
          padding: '2rem',
          paddingTop: 'calc(70px + 2rem)',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6',
        }}
      >
        <div>
          <h1>{t('optOutPage.title')}</h1>

          <div style={{ marginBottom: '2rem' }}>
            <p>{t('optOutPage.description')}</p>

            <h3>{t('optOutPage.mobileAppSection')}</h3>
            <ol>
              <li>{t('optOutPage.mobileSteps.step1')}</li>
              <li>{t('optOutPage.mobileSteps.step2')}</li>
              <li>{t('optOutPage.mobileSteps.step3')}</li>
            </ol>

            <h3>{t('optOutPage.deviceSettingsSection')}</h3>
            <h4>{t('optOutPage.iosDevices')}</h4>
            <ol>
              <li>{t('optOutPage.iosSteps.step1')}</li>
              <li>{t('optOutPage.iosSteps.step2')}</li>
            </ol>

            <h4>{t('optOutPage.androidDevices')}</h4>
            <ol>
              <li>{t('optOutPage.androidSteps.step1')}</li>
              <li>{t('optOutPage.androidSteps.step2')}</li>
            </ol>

            <h3>{t('optOutPage.webBrowserSection')}</h3>
            <p>
              {t('optOutPage.webBrowserText')}{' '}
              <a
                href='https://adssettings.google.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#1976d2' }}
              >
                adssettings.google.com
              </a>
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
            }}
          >
            <h3>{t('optOutPage.contactSection')}</h3>
            <p>{t('optOutPage.contactText')}</p>
            <p>
              <strong>{t('optOutPage.email')}</strong> devhodo@gmail.com
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleGoBack}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {t('optOutPage.goBackButton')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
