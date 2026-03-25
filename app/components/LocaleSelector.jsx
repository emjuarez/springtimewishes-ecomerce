import {useState, useRef, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router';
import {locales} from '~/lib/i18n';
import {useTranslation} from '~/hooks/useTranslation';
import '~/styles/localeSelector.css'

const FLAGS = {
  'es-MX': '🇲🇽',
  'en-US': '🇺🇸',
  'fr-FR': '🇫🇷',
  'ja-JP': '🇯🇵',
};

// Extrae el path sin ningún prefijo de locale
function stripLocalePrefix(pathname) {
  const prefixes = Object.values(locales).map((l) => l.pathPrefix);
  for (const prefix of prefixes) {
    if (pathname.startsWith(prefix + '/') || pathname === prefix) {
      return pathname.slice(prefix.length) || '/';
    }
  }
  return pathname;
}

export function LocaleSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {locale} = useTranslation();
  const dropdownRef = useRef(null);

  const currentLocaleKey =
    Object.keys(locales).find(
      (key) =>
        locales[key].language === locale?.language &&
        locales[key].country === locale?.country,
    ) || 'es-MX';

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocaleKey) => {
    if (newLocaleKey === currentLocaleKey) {
      setIsOpen(false);
      return;
    }

    const newLocale = locales[newLocaleKey];

    // 1. Limpiar CUALQUIER prefijo de locale del path actual
    const cleanPath = stripLocalePrefix(location.pathname);

    // 2. Construir nueva ruta con el nuevo prefijo
    let newPath;

    if (newLocaleKey === 'es-MX') {
      newPath = cleanPath || '/';
    } else {
      newPath = newLocale.pathPrefix + (cleanPath === '/' ? '' : cleanPath);
    }

    // ✅ Recarga completa para que el servidor reconozca el nuevo locale
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
        <span className="locale-flag">{FLAGS[currentLocaleKey]}</span>
        <span className="locale-current-label">
          {locales[currentLocaleKey]?.language}
        </span>
        <span className={`locale-arrow ${isOpen ? 'open' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="locale-dropdown">
          {Object.entries(locales).map(([key, localeData]) => (
            <button
              key={key}
              onClick={() => handleLocaleChange(key)}
              className={`locale-option ${key === currentLocaleKey ? 'active' : ''}`}
            >
              <span className="locale-option-flag">{FLAGS[key]}</span>
              <span className="locale-option-name">{localeData.label}</span>
              <span className="locale-option-currency">
                {localeData.currency}
              </span>
              {key === currentLocaleKey && (
                <span className="locale-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
