import { Metadata } from 'next';
import styles from './PrivacyPolicy.module.scss';

export const metadata: Metadata = {
  title: 'Privacy Policy | Age Calculator',
  description: 'Privacy Policy for Age Calculator application',
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.privacyPolicy}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy for Age Calculator</h1>
        <p className={styles.lastUpdated}>Last updated: August 1, 2025</p>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>1. Information We Collect</h2>
          <p className={styles.paragraph}>
            Age Calculator is designed to calculate your age based on your birth
            date. We do not collect, store, or transmit any personal
            information.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>2. Data Storage</h2>
          <p className={styles.paragraph}>
            All calculations are performed locally on your device. No birth
            dates or personal information are stored or transmitted to our
            servers.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>3. Third-Party Services</h2>
          <p className={styles.paragraph}>
            Our app uses Google AdMob to display advertisements. AdMob may
            collect and use certain information for advertising purposes. Please
            refer to Google&apos;s Privacy Policy for more information about how
            Google handles data.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>4. Advertising</h2>
          <p className={styles.paragraph}>
            We use Google AdMob to show advertisements in our app. AdMob may use
            advertising identifiers and may collect information such as:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Device information</li>
            <li className={styles.listItem}>IP address</li>
            <li className={styles.listItem}>App usage information</li>
            <li className={styles.listItem}>Advertising ID</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>5. Children&apos;s Privacy</h2>
          <p className={styles.paragraph}>
            Our app does not collect any personal information from anyone,
            including children under 13. If you are a parent and believe your
            child has provided personal information, please contact us.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>6. Changes to This Privacy Policy</h2>
          <p className={styles.paragraph}>
            We may update our Privacy Policy from time to time. Any changes will
            be posted on this page with an updated revision date.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>7. Contact Us</h2>
          <p className={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact
            us at:{' '}
            <a href='mailto:devhodo@gmail.com' className={styles.link}>
              devhodo@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
