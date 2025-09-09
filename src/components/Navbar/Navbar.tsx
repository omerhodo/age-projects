'use client';

import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { usePlatform } from '../../hooks/usePlatform';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  const { isNative } = usePlatform();
  const pathname = usePathname();
  const isNotHomePage = pathname !== '/';

  return (
    <nav
      className={`${styles.navbar} ${isNative ? styles.navbar__native : ''}`}
    >
      <div className={styles.navbar__container}>
        <div className={styles.navbar__left}>
          {isNotHomePage && (
            <Link href='/' className={styles.navbar__homeLink}>
              <HomeIcon className={styles.navbar__homeIcon} />
            </Link>
          )}
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
