'use client';

import { useTranslation } from 'react-i18next';
import { OptOutLink } from '../OptOutLink';
import { PrivacyOptionsButton } from '../PrivacyOptionsButton';
import styles from './Footer.module.scss';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <p className={styles.footer__text}>
          © 2025 {t('footer.madeBy')}{' '}
          <span className={styles.footer__author}>Ömer Hodo</span>
        </p>
        <div className={styles.footer__privacy}>
          <a
            href='/privacy-policy'
            className={styles.footer__link}
            target='_blank'
            rel='noopener noreferrer'
          >
            {t('footer.privacyPolicy')}
          </a>
          <PrivacyOptionsButton className={styles.footer__privacyBtn} />
          <OptOutLink className={styles.footer__optOutLink} variant='link' />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
