import {useRouteLoaderData} from 'react-router';
import {NORMALIZE_PREFIX_MAP} from '~/lib/i18n';

// Todos los prefijos válidos (cortos y largos)
const ALL_PREFIXES = Object.keys(NORMALIZE_PREFIX_MAP);

/**
 * Normaliza cualquier path eliminando prefijos mal formados
 * y reemplazándolos por el prefijo correcto
 */
function normalizePath(path) {
  if (!path) return '/';

  // Buscar si el path empieza con algún prefijo conocido
  const matchedPrefix = ALL_PREFIXES
    .sort((a, b) => b.length - a.length) // Ordenar por longitud desc para evitar match parcial
    .find((prefix) => path.startsWith(prefix + '/') || path === prefix);

  if (matchedPrefix) {
    // Obtener el path limpio sin el prefijo
    const cleanPath = path.slice(matchedPrefix.length) || '/';
    // Retornar solo el path limpio (sin prefijo)
    // El prefijo correcto se agrega en localePath()
    return {
      cleanPath,
      detectedPrefix: NORMALIZE_PREFIX_MAP[matchedPrefix],
    };
  }

  return {cleanPath: path, detectedPrefix: null};
}
export function useLocalePath() {
  const rootData = useRouteLoaderData('root');
  const pathPrefix = rootData?.selectedLocale?.pathPrefix || '';

  function localePath(path) {
    if (!path) return pathPrefix ? `${pathPrefix}/` : '/';

    const {cleanPath, detectedPrefix} = normalizePath(path);
    const prefix = detectedPrefix || pathPrefix;

    if (!prefix) return cleanPath;

    // ✅ Si es la raíz, agregar trailing slash
    if (cleanPath === '/' || cleanPath === '') {
      return `${prefix}/`;
    }

    return prefix + cleanPath;
  }

  return {localePath, pathPrefix};
}
