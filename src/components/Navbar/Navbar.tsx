'use client';

import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePlatform } from '../../hooks/usePlatform';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { isNative } = usePlatform();

  return (
    <nav
      className={`${styles.navbar} ${isNative ? styles.navbar__native : ''}`}
    >
      <div className={styles.navbar__container}>
        <div className={styles.navbar__left}>
          {/* Boş alan - gelecekte başka öğeler eklenebilir */}
        </div>

        <div className={styles.navbar__center}>
          <Link href='/' className={styles.navbar__titleLink}></Link>
        </div>

        <div className={styles.navbar__right}>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
