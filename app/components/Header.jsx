import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import '~/styles/header.css'
import {useLocalePath} from '~/hooks/useLocalePath';
import {LocaleSelector} from '~/components/LocaleSelector';
import {useWindowSize} from '~/hooks/useWindowSize';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain, collections}) {
  const {shop, menu} = header;
  const {localePath, pathPrefix} = useLocalePath();
  const {isDesktop} = useWindowSize();

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.href = pathPrefix ? `${pathPrefix}/` : '/';
  };

  return (
    <header className="header">
      <HeaderMenuMobileToggle />
      <a 
        href={pathPrefix ? `${pathPrefix}/` : '/'}
        className="headerLink"
        onClick={handleHomeClick}
      > 
        <img src={"../../public/images/Layout/STW_logo.png"} alt="" className='headerLogo'/>
      </a>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <div className='selector-cart_div'>
      {isDesktop && (
        <LocaleSelector />
      )}
        <CartToggle cart={cart} className="cartToogleMobile"/>
      </div>
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
export function HeaderMenu({menu, primaryDomainUrl, viewport, publicStoreDomain}) {
  const {close} = useAside();
  const {localePath} = useLocalePath();
  const {isMobile} = useWindowSize();

  const handleClick = (e, finalUrl) => {
    e.preventDefault();
    close();
    window.location.href = finalUrl;
  };

  return (
    <nav className={`header-menu-${viewport}`} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        const finalUrl = localePath(url);

        // ✅ Detectar si es el item activo comparando con la URL actual
        const isActive =
          typeof window !== 'undefined' &&
          window.location.pathname === finalUrl;

        return (
          <>
            <a
              key={item.id}
              href={finalUrl}
              className="header-menu-item title"
              onClick={(e) => handleClick(e, finalUrl)}
              style={{
                textDecoration: isActive ? 'line-through' : undefined,
                color: 'white',
              }}
            >
              {item.title}
            </a>
          </>
        );
      })}
      {isMobile && (
        <LocaleSelector />
      )}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <img src={"../../public/images/Layout/menu-icon.png"} alt=""/>
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
    <>
      <a
        href="/cart"
        className='title header-menu-item cartBadgeDesktop'
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
      <a
        href="/cart"
        className='title header-menu-item cartBadgeMobile'
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
         ({count === null ? <span>&nbsp;</span> : count})
      </a>
    </>

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
      title: 'Collections',
      url: '/collections',
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      title: 'Blog',
      url: '/blogs/journal',
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      title: 'Policies',
      url: '/policies',
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      title: 'About',
      url: '/pages/about',
    },
  ],
};

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
