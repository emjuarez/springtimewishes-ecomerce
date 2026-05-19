/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context, request}) {
  const {language, country} = context.storefront.i18n;
  
  console.log('=== ($locale).jsx loader ===');
  console.log('URL:', request.url);
  console.log('params.locale:', params.locale);
  console.log('i18n language:', language);
  console.log('i18n country:', country);
  console.log('expected:', `${language}-${country}`.toLowerCase());
  console.log('match:', params.locale?.toLowerCase() === `${language}-${country}`.toLowerCase());

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, {status: 404});
  }

  return null;
}


/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
