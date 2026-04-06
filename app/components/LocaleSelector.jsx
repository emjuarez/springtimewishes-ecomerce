import {useState, useRef, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router';
import {locales} from '~/lib/i18n';
import {useTranslation} from '~/hooks/useTranslation';
import '~/styles/localeSelector.css'

// Extrae el path sin ningún prefijo de locale
function stripLocalePrefix(pathname) {
  const prefixes = Object.values(locales).map((l) => l.pathPrefix);

  for (const prefix of prefixes) {
    if (pathname.startsWith(prefix + '/') || pathname === prefix) {
      const result = pathname.slice(prefix.length) || '/';
      console.log('Prefijo encontrado:', prefix, '→ cleanPath:', result);
      return result;
    }
  }

  return pathname;
}

export function LocaleSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const {t} = useTranslation();

  // ✅ Detectar locale actual DIRECTAMENTE desde la URL
  const currentLocaleKey = (() => {
    const firstPathPart = location.pathname.split('/')[1]?.toLowerCase() ?? '';
    const matched = Object.entries(locales).find(
      ([, locale]) => locale.pathPrefix === `/${firstPathPart}`
    );
    return matched?.[0] || 'es-MX'; // Default es-MX
  })();

  const handleLocaleChange = (newLocaleKey) => {
    if (newLocaleKey === currentLocaleKey) {
      setIsOpen(false);
      return;
    }

    const newLocale = locales[newLocaleKey];
    const currentLocale = locales[currentLocaleKey];

    // ✅ Limpiar prefijo actual de la URL
    let cleanPath = location.pathname;
    if (currentLocale?.pathPrefix) {
      cleanPath = cleanPath.startsWith(currentLocale.pathPrefix)
        ? cleanPath.slice(currentLocale.pathPrefix.length) || '/'
        : cleanPath;
    }

    // ✅ Construir nueva ruta
    const newPath = newLocale?.pathPrefix
      ? newLocale.pathPrefix + (cleanPath === '/' ? '' : cleanPath)
      : cleanPath;

    window.location.href = newPath;
    setIsOpen(false);
  };


  return (
    <div className="locale-selector" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="locale-button"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="locale-current-label header-menu-item title">
          {t('selector.language')}
        </span>
      </button>

      {isOpen && (
        <div className="locale-dropdown">
          {Object.entries(locales).map(([key, localeData]) => (
            <button
              key={key}
              onClick={() => handleLocaleChange(key)}
              className={`locale-option ${key === currentLocaleKey ? 'active' : ''}`}
            >
              <span className="locale-option-name info">{localeData.language}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
