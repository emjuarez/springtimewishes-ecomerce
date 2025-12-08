import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import '../styles/header.css'


/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain, collections}) {
  const {shop, menu} = header;
  return (
    <header className="header">
      <NavLink prefetch="intent" to="/" className="headerLink" end> 
        <img src={"../../public/images/Layout/STW_logo.png"} alt="" className='headerLogo'/>
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
        cart={cart} 
      />
      {/* Marquee debajo del nav */}
      <Suspense fallback={<div>Cargando colecciones...</div>}>
        <Await resolve={collections}>
          {(resolvedCollections) => (
            <CollectionsMarquee collections={resolvedCollections ?? []} />
          )}
        </Await>
      </Suspense>

      {/* <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} /> */}
      {/* <CartToggle cart={cart} /> */}
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  cart
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item title"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
      <CartToggle cart={cart} />  {/* ← Agrega esta línea aquí */}
    </nav>
  );
}
/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
// function HeaderCtas({isLoggedIn, cart}) {
//   return (
//     <nav className="header-ctas" role="navigation">
//       <HeaderMenuMobileToggle />
//       <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
//         <Suspense fallback="Sign in">
//           <Await resolve={isLoggedIn} errorElement="Sign in">
//             {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
//           </Await>
//         </Suspense>
//       </NavLink>
//       <SearchToggle />
//       <CartToggle cart={cart} />
//     </nav>
//   );
// }

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CollectionsMarquee({collections}) {
  if (!Array.isArray(collections)) return null;

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {collections.map((collection) => (
          <span key={collection.id} className="marquee-item">
            {collection.title}
          </span>
        ))}
      </div>
    </div>
  );
}


/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className='title header-menu-item'
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      Basket ({count === null ? <span>&nbsp;</span> : count})
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
    { id: '1', 
      title: 'Collections', 
      url: '/collections' 
    },
    { id: '2', 
      title: 'Blog', 
      url: '/blogs/journal' 
    },
    { id: '3', 
      title: 
      'Policies', 
      url: '/policies' 
    },
    { id: '4', 
      title: 'About', 
      url: '/pages/about' 
    },
  ],
};
// const FALLBACK_HEADER_MENU = {
//   id: 'gid://shopify/Menu/199655587896',
//   items: [
//     { id: '1', title: 'Collections', url: '/collections' },
//     { id: '2', title: 'Blog', url: '/blogs/journal' },
//     { id: '3', title: 'Policies', url: '/policies' },
//     { id: '4', title: 'About', url: '/pages/about' },
//   ],
// };
/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    textDecoration: isActive ? 'line-through' : undefined,
    color: isPending ? 'white' : 'white',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */

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
