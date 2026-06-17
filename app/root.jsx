import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from './components/PageLayout';
import {getLocaleFromRequest} from '~/lib/i18n';
import {CustomCursor} from '~/components/CustomCursor';
import {AudioPlayer} from '~/components/AudioPlayer';
import {useEffect} from 'react';
import {audioManager} from '~/lib/audioManager';
import {useWindowSize} from '~/hooks/useWindowSize';

export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader(args) {
  const locale = getLocaleFromRequest(args.request);
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    selectedLocale: locale,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

async function loadCriticalData({context}) {
  const {storefront} = context;

  const [header, socialLinks] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu-1',
        language: storefront.i18n.language,
        country: storefront.i18n.country,
      },
    }),
    storefront.query(SOCIAL_LINKS_QUERY, {
      cache: storefront.CacheLong(),
    }),
  ]);

  // ✅ Temporal
  console.log('socialLinks raw:', JSON.stringify(socialLinks, null, 2));

  const socialFields = socialLinks?.metaobjects?.nodes?.[0]?.fields ?? [];
  const social = Object.fromEntries(
    socialFields.map(({key, value}) => [key, value]),
  );

  console.log('social parsed:', social);

  return {header, social};
}

function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {footerMenuHandle: 'footer'},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  const collections = storefront
    .query(COLLECTIONS_QUERY)
    .then((res) => res.collections.nodes)
    .catch(() => []);

  const cartWithTitles = cart.get().then(async (cartData) => {
    if (!cartData?.lines?.nodes?.length) {
      return {...cartData, originalTitles: {}};
    }

    const productIds = [
      ...new Set(
        cartData.lines.nodes.map((line) => line.merchandise.product.id),
      ),
    ];

    try {
      const {nodes: productsEN} = await storefront.query(
        CART_PRODUCTS_TITLES_QUERY,
        {
          variables: {
            ids: productIds,
            country: storefront.i18n.country,
          },
        },
      );

      const originalTitles = {};
      productsEN?.forEach((product) => {
        if (product) originalTitles[product.id] = product.title;
      });

      return {...cartData, originalTitles};
    } catch (e) {
      console.error('❌ Error:', e);
      return {...cartData, originalTitles: {}};
    }
  });

  return {
    cart: cartWithTitles,
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
    collections,
  };
}

export function Layout({children}) {
  const nonce = useNonce();
  const data = useRouteLoaderData('root');
  const lang = data?.selectedLocale?.language?.toLowerCase() || 'es';
  const {isDesktop} = useWindowSize();

  if (typeof window !== 'undefined' && !window.__audioInstance) {
    audioManager.init('/audio/el-bosque-bounce-para-web-2.mp3');
  }

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1, viewport-fit=cover" />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <Meta />
        <Links />
      </head>
      <body>
        <CustomCursor src="/images/Layout/cursor.png" size={42} />
        {children}
        {isDesktop && (
          <div className="audio-player-fixed">
            <AudioPlayer />
          </div>
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData('root');

  if (!data) return <Outlet />;

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}

export const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    collections(first: 20) {
      nodes {
        id
        title
        description
        handle
        image { url altText }
      }
    }
  }
`;

const CART_PRODUCTS_TITLES_QUERY = `#graphql
  query CartProductTitlesRoot(
    $ids: [ID!]!
    $country: CountryCode
  ) @inContext(language: EN, country: $country) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
      }
    }
  }
`;

const SOCIAL_LINKS_QUERY = `#graphql
  query SocialLinks {
    metaobjects(type: "social_links", first: 1) {
      nodes {
        fields {
          key
          value
        }
      }
    }
  }
`;

/** @typedef {LoaderReturnData} RootLoader */
/** @typedef {import('react-router').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('./+types/root').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
