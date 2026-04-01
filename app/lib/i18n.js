export const locales = {
  'es-MX': {
    label: 'Español (México)',
    language: 'ES',
    country: 'MX',
    currency: 'MXN',
    pathPrefix: '/es-mx',
  },
  'en-US': {
    label: 'English (United States)',
    language: 'EN',
    country: 'US',
    currency: 'USD',
    pathPrefix: '/en-us',
  },
  'fr-FR': {
    label: 'Français (France)',
    language: 'FR',
    country: 'FR',
    currency: 'EUR',
    pathPrefix: '/fr-fr',
  },
  'ja-JP': {
    label: '日本語 (日本)',
    language: 'JA',
    country: 'JP',
    currency: 'JPY',
    pathPrefix: '/ja-jp',
  },
};

export const NORMALIZE_PREFIX_MAP = {
  '/es-mx': '/es-mx',
  '/es':    '/es-mx',
  '/en-us': '/en-us',
  '/en':    '/en-us',
  '/fr-fr': '/fr-fr',
  '/fr':    '/fr-fr',
  '/ja-jp': '/ja-jp',
  '/ja':    '/ja-jp',
};


export const DEFAULT_LOCALE = {
  language: 'ES',
  country: 'MX',
  currency: 'MXN',
  pathPrefix: '',
};

/**
 * @param {Request} request
 * @returns {{language: string, country: string, currency: string, pathPrefix: string}}
 */
export function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.split('/')[1]?.toLowerCase() ?? '';

  // Buscar si el path coincide con algún locale soportado
  const matchedLocale = Object.values(locales).find(
    (locale) => locale.pathPrefix === `/${firstPathPart}`
  );

  if (matchedLocale) {
    return {
      language: matchedLocale.language,
      country: matchedLocale.country,
      currency: matchedLocale.currency,
      pathPrefix: matchedLocale.pathPrefix,
    };
  }

  // Default: ES-MX
  return DEFAULT_LOCALE;
}

/**
 * @typedef {Object} I18nLocale
 * @property {string} language
 * @property {string} country
 * @property {string} currency
 * @property {string} pathPrefix
 */

/** @typedef {import('@shopify/hydrogen').I18nBase} I18nBase */
