import {useRouteLoaderData} from 'react-router';
import es from '~/i18n/es.json';
import en from '~/i18n/en.json';
import fr from '~/i18n/fr.json';
import ja from '~/i18n/ja.json';

const translations = {es, en, fr, ja};

export function useTranslation() {
  const rootData = useRouteLoaderData('root');
  const locale = rootData?.selectedLocale;
  
  // Obtener código de idioma: 'ES' → 'es'
  const lang = locale?.language?.toLowerCase() || 'es';

  function t(key) {
    const keys = key.split('.');
    let value = translations[lang];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback a español si no existe la traducción
        let fallback = translations['es'];
        for (const fk of keys) {
          fallback = fallback?.[fk];
        }
        return fallback || key;
      }
    }

    return value;
  }

  return {
    t,
    locale,
    lang,
    currency: locale?.currency || 'MXN',
  };
}
