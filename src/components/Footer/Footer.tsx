'use client';

import { useTranslation } from 'react-i18next';
import styles from './Footer.module.scss';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className={styles.footer__content}>
                <p className={styles.footer__text}>
                    © 2025 {t('footer.madeBy')} <span className={styles.footer__author}>Ömer Hodo</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
