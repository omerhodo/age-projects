'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PrivacyPolicy.module.scss';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.documentElement.style.position = 'static';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.documentElement.style.position = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, []);

  const renderSection = (key: string) => {
    const section = t(`privacyPolicyContent.sections.${key}`, {
      returnObjects: true,
    }) as {
      title: string;
      content: string;
      list?: string[];
      email?: string;
    };

    if (!section || typeof section !== 'object') return null;

    return (
      <section key={key} className={styles.section}>
        <h2 className={styles.subtitle}>
          {key}. {section.title}
        </h2>
        <p className={styles.paragraph}>{section.content}</p>
        {section.list && (
          <ul className={styles.list}>
            {section.list.map((item: string, index: number) => (
              <li key={index} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        )}
        {section.email && (
          <p className={styles.paragraph}>
            <a href={`mailto:${section.email}`} className={styles.link}>
              {section.email}
            </a>
          </p>
        )}
      </section>
    );
  };

  return (
    <div className={styles.privacyPolicy}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('privacyPolicyContent.title')}</h1>
        <p className={styles.lastUpdated}>
          {t('privacyPolicyContent.lastUpdated')}
        </p>

        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(renderSection)}
      </div>
    </div>
  );
}
