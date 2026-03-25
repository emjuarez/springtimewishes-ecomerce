/**
 * Formatea un monto según el locale y moneda
 * @param {number|string} amount
 * @param {string} currencyCode - 'MXN', 'USD', 'EUR', 'JPY'
 * @param {string} locale - 'es-MX', 'en-US', 'fr-FR', 'ja-JP'
 */
export function formatMoney(amount, currencyCode, locale = 'es-MX') {
  const localeMap = {
    'ES': 'es-MX',
    'EN': 'en-US',
    'FR': 'fr-FR',
    'JA': 'ja-JP',
  };

  const intlLocale = localeMap[locale] || localeMap[locale?.toUpperCase()] || 'es-MX';

  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: currencyCode || 'MXN',
  }).format(Number(amount));
}

// Ejemplos de output:
// formatMoney(1234.56, 'MXN', 'ES') → "$1,234.56"
// formatMoney(1234.56, 'USD', 'EN') → "$1,234.56"
// formatMoney(1234.56, 'EUR', 'FR') → "1 234,56 €"
// formatMoney(1234,    'JPY', 'JA') → "¥1,235"
