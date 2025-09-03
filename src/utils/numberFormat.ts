/**
 * Utility functions for number formatting based on locale
 */

/**
 * Formats a number according to the specified locale conventions
 * @param number - The number to format
 * @param locale - The locale to use for formatting ('tr' for Turkish, 'en' for English)
 * @returns Formatted number string
 */
export const formatNumber = (number: number, locale: string): string => {
  // Turkish uses dots (.) as thousands separator
  // English uses commas (,) as thousands separator

  if (locale === 'tr') {
    return new Intl.NumberFormat('tr-TR').format(number);
  } else {
    return new Intl.NumberFormat('en-US').format(number);
  }
};

/**
 * Formats a number for display with proper locale formatting
 * @param number - The number to format
 * @param currentLanguage - The current language ('tr' or 'en')
 * @returns Formatted number string
 */
export const formatNumberForLocale = (
  number: number,
  currentLanguage: string
): string => {
  return formatNumber(number, currentLanguage);
};
