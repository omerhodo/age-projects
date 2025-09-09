import { useTranslation } from 'react-i18next';
import { consentService } from '../services/consent.service';

/**
 * i18n destekli consent modalı oluşturmak için hook
 */
export const useConsentModal = () => {
  const { t } = useTranslation();

  const createLocalizedConsentModal = (callback: () => void): void => {
    const modal = document.createElement('div');
    modal.id = 'gdpr-consent-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 12px;
      max-width: 500px;
      margin: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      animation: slideInUp 0.3s ease-out;
    `;

    const title = document.createElement('h2');
    title.textContent = t('consent.title');
    title.style.cssText = 'margin: 0 0 15px 0; color: #333; font-size: 24px;';

    const text = document.createElement('p');
    const descriptionText = t('consent.description');

    text.innerHTML = descriptionText
      .replace(
        '<link>',
        `<a href="/privacy-policy" target="_blank" style="color: #1976d2;">`
      )
      .replace('</link>', '</a>');

    text.style.cssText = 'color: #666; line-height: 1.5; margin: 0 0 25px 0;';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText =
      'display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;';

    const rejectButton = document.createElement('button');
    rejectButton.textContent = t('consent.rejectButton');
    rejectButton.style.cssText = `
      padding: 12px 24px;
      border: 1px solid #ddd;
      background: white;
      color: #666;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    `;

    const acceptButton = document.createElement('button');
    acceptButton.textContent = t('consent.acceptButton');
    acceptButton.style.cssText = `
      padding: 12px 24px;
      border: none;
      background: #1976d2;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    `;

    rejectButton.onmouseover = () => {
      rejectButton.style.background = '#f5f5f5';
    };
    rejectButton.onmouseout = () => {
      rejectButton.style.background = 'white';
    };

    acceptButton.onmouseover = () => {
      acceptButton.style.background = '#1565c0';
    };
    acceptButton.onmouseout = () => {
      acceptButton.style.background = '#1976d2';
    };

    acceptButton.onclick = () => {
      modal.style.animation = 'slideOutDown 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(modal);
        callback();
      }, 300);

      // Consent'i kabul et
      consentService['setConsent'](true);
    };

    rejectButton.onclick = () => {
      modal.style.animation = 'slideOutDown 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(modal);
        callback();
      }, 300);

      // Consent'i reddet
      consentService['setConsent'](false);
    };

    // ESC tuşu ile kapatma
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        rejectButton.click();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    if (!document.getElementById('consent-modal-styles')) {
      const style = document.createElement('style');
      style.id = 'consent-modal-styles';
      style.textContent = `
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes slideOutDown {
          from {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
          to {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    buttonContainer.appendChild(rejectButton);
    buttonContainer.appendChild(acceptButton);
    content.appendChild(title);
    content.appendChild(text);
    content.appendChild(buttonContainer);
    modal.appendChild(content);

    document.body.appendChild(modal);

    acceptButton.focus();
  };

  return { createLocalizedConsentModal };
};
