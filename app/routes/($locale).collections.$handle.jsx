import {redirect, useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {
  COLLECTION_QUERY,
  PRODUCT_ORIGINAL_TITLES_QUERY,
} from '~/lib/fragments';
/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request, params}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  // ✅ Ejecutar ambas queries en paralelo
  const [{collection}, {collection: collectionOriginal}] = await Promise.all([
    // Query principal con locale
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
    // Query secundaria forzando español para títulos
    storefront.query(PRODUCT_ORIGINAL_TITLES_QUERY, {
      variables: {
        handle,
        country: storefront.i18n.country,
        ...paginationVariables,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  // ✅ Crear mapa de títulos originales por ID
  const originalTitlesMap = {};
  collectionOriginal?.products?.nodes?.forEach((product) => {
    originalTitlesMap[product.id] = product.title;
  });

  // ✅ Reemplazar títulos en los productos
  const productsWithOriginalTitles = {
    ...collection,
    products: {
      ...collection.products,
      nodes: collection.products.nodes.map((product) => ({
        ...product,
        title: originalTitlesMap[product.id] || product.title,
      })),
    },
  };

  return {
    collection: productsWithOriginalTitles,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();

  return (
    <div className="collection">
      <h1>{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
// const COLLECTION_QUERY = `#graphql
//   ${PRODUCT_ITEM_FRAGMENT}
//   query Collection(
//     $handle: String!
//     $country: CountryCode
//     $language: LanguageCode
//     $first: Int
//     $last: Int
//     $startCursor: String
//     $endCursor: String
//   ) @inContext(country: $country, language: $language) {
//     collection(handle: $handle) {
//       id
//       handle
//       title
//       description
//       products(
//         first: $first,
//         last: $last,
//         before: $startCursor,
//         after: $endCursor
//       ) {
//         nodes {
//           ...ProductItem
//         }
//         pageInfo {
//           hasPreviousPage
//           hasNextPage
//           endCursor
//           startCursor
//         }
//       }
//     }
//   }
// `;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
