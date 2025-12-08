import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import '../styles/home.css'
import {ImageCarousel} from '~/components/ImageCarousel';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
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

// async function loadCriticalData({context}) {
//   const [{collections}] = await Promise.all([
//     context.storefront.query(FEATURED_COLLECTION_QUERY),
//     // Add other queries here, so that they are loaded in parallel
//   ]);

//   return {
//     featuredCollection: collections.nodes[0],
//   };
// }


async function loadCriticalData({context}) {
  const {collections} = await context.storefront.query(ALL_COLLECTIONS_QUERY);
  return {collections: collections.nodes};
}
/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const chapterOneCollection = context.storefront
    .query(CHAPTER_ONE_COLLECTION_QUERY, {
      variables: {
        handle: 'chapter-i-whispers-of-the-forest', // ← Usa este handle exacto
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    chapterOneCollection,
  };
}


export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const carouselImages = [
    {
      src: '/images/carousel/1.JPG',
      alt: 'Slide 1',
    },
    {
      src: '/images/carousel/2.JPG',
      alt: 'Slide 2',
    },
    {
      src: '/images/carousel/3.JPG',
      alt: 'Slide 3',
    },
    {
      src: '/images/carousel/4.JPG',
      alt: 'Slide 4',
    },
    {
      src: '/images/carousel/5.JPG',
      alt: 'Slide 5',
    },
    {
      src: '/images/carousel/6.JPG',
      alt: 'Slide 6',
    },
    {
      src: '/images/carousel/7.JPG',
      alt: 'Slide 7',
    },
    
  ];

  useEffect(() => {
      const key = document.querySelector('.homeKey');
      const parrafo = document.querySelector('.parrafo');
      const mist = document.querySelector('.mist1');
  
      if (!key) return;
  
      key.addEventListener('click', () => {
        // 1. Desvanecer llave
        key.classList.add('fade-out');
  
        // 2. Elevar el fondo negro (curtain reveal)
        setTimeout(() => {
          mist.classList.add('reveal');
        }, 100);
      });
  }, []);

  return (
    <div className="home">
    <div className='homeMaindiv'>
      <div className="firstSection">
        <ImageCarousel 
          images={carouselImages} 
          autoplay={false} 
          loop={true} 
        />
      </div>
      <div className="secondSection">
        {/* <ChapterOneCollection collection={data.chapterOneCollection} /> */}
        <AllCollections collections={data.collections} />
      </div>
      <div className='mist'></div>
      <div className='mist1'></div>
      <img src={"../../public/images/home/llave.png"} alt="" className='homeKey'/>
    </div>
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}
/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

function ChapterOneCollection({collection}) {
  console.log('ChapterOne collection prop:', collection); // Ver qué llega
  
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={collection}>
          {(response) => {
            console.log('ChapterOne FULL response:', response); // Ver respuesta completa
            console.log('ChapterOne collection data:', response?.collection); // Ver colección
            console.log('ChapterOne products:', response?.collection?.products); // Ver productos
            
            if (!response?.collection) {
              console.log('No collection found in response');
              return <p>No se encontró la colección</p>;
            }
            
            const col = response.collection;
            
            if (!col.products || !col.products.nodes) {
              console.log('No products structure found');
              return <p>No hay estructura de productos</p>;
            }
            
            console.log('Number of products:', col.products.nodes.length);
            
            return (
              <>
                <div className="collectionTitleDiv">
                  <h2 className='title'>{col.title}</h2>
                </div>
                <div className="recommended-products-grid">
                  {col.products.nodes.length > 0 ? (
                    col.products.nodes.map((product) => {
                      console.log('Rendering product:', product.title);
                      return <ProductItem key={product.id} product={product} />;
                    })
                  ) : (
                    <p>Array de productos vacío</p>
                  )}
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

function AllCollections({collections}) {
  console.log('AllCollections prop:', collections);

  return (
    <>
      <Suspense fallback={<div>Loading collections...</div>}>
        <Await resolve={collections}>
          {(response) => {
            if (!response || response.length === 0) {
              console.log('No collections found');
              return <p>No se encontraron colecciones</p>;
            }

            return (
              <>
                {response.map((col) => {
                  if (!col.products || !col.products.nodes) {
                    console.log(`No products structure found for collection ${col.title}`);
                    return (
                      <p key={col.id}>
                        No hay estructura de productos en {col.title}
                      </p>
                    );
                  }

                  return (
                    <div key={col.id} className="collection-section">
                      <div className="collectionTitleDiv">
                        <h2 className="title">{col.title}</h2>
                      </div>
                      <div className="recommended-products-grid">
                        {col.products.nodes.length > 0 ? (
                          col.products.nodes.map((product) => {
                            console.log('Rendering product:', product.title);
                            return (
                              <ProductItem key={product.id} product={product} />
                            );
                          })
                        ) : (
                          <p>Array de productos vacío</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

export const COLLECTIONS_QUERY = `
  query Collections {
    collections(first: 20) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;
const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
const ALL_COLLECTIONS_QUERY = `#graphql
  query AllCollections($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        description
        image {
          url
          altText
          width
          height
        }
        products(first: 10) {
          nodes {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;
const CHAPTER_ONE_COLLECTION_QUERY = `#graphql
  fragment ChapterOneCollection on Collection {
    id
    title
    handle
    description
    products(first: 10) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
  query ChapterOneCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...ChapterOneCollection
    }
  }
`;




/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
