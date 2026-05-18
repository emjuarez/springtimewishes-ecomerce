import {Suspense} from 'react';
import {Await, useAsyncValue, useNavigate} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import '~/styles/header.css';
import {useLocalePath} from '~/hooks/useLocalePath';
import {LocaleSelector} from '~/components/LocaleSelector';
import {useWindowSize} from '~/hooks/useWindowSize';

export function Header({header, isLoggedIn, cart, publicStoreDomain, collections}) {
  const {shop, menu} = header;
  const {localePath, pathPrefix} = useLocalePath();
  const {isDesktop} = useWindowSize();
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate(pathPrefix ? `${pathPrefix}/` : '/'); // ✅ SPA navigation
  };

  return (
    <header className="header">
      <HeaderMenuMobileToggle />
      <a
        href={pathPrefix ? `${pathPrefix}/` : '/'}
        className="headerLink"
        onClick={handleHomeClick}
      >
        <img src="/images/Layout/STW_logo.png" alt="" className="headerLogo" />
      </a>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <div className="selector-cart_div">
        {isDesktop && <LocaleSelector />}
        <CartToggle cart={cart} className="cartToogleMobile" />
      </div>
    </header>
  );
}

export function HeaderMenu({menu, primaryDomainUrl, viewport, publicStoreDomain}) {
  const {close} = useAside();
  const {localePath} = useLocalePath();
  const {isMobile} = useWindowSize();
  const navigate = useNavigate();

  const handleClick = (e, finalUrl, isExternal, isAnchor) => {
    if (isExternal) return;
    e.preventDefault();
    close();

    // ✅ Maneja anchors del home
    if (isAnchor) {
      const hash = finalUrl.replace('/#', '').replace('#', '');
      navigate(localePath('/'));
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({behavior: 'smooth'});
      }, 100);
      return;
    }

    navigate(finalUrl);
  };

  return (
    <nav className={`header-menu-${viewport}`} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // ✅ Detecta anchors
        const isAnchor =
          item.url.startsWith('/#') || item.url.startsWith('#');

        const isExternal =
          !isAnchor &&
          !item.url.includes('myshopify.com') &&
          !item.url.includes(publicStoreDomain) &&
          !item.url.includes(primaryDomainUrl);

        const url = isExternal
          ? item.url
          : isAnchor
          ? item.url
          : new URL(item.url).pathname;

        const finalUrl = isExternal || isAnchor ? url : localePath(url);

        const isActive =
          typeof window !== 'undefined' &&
          window.location.pathname === finalUrl;

        return (
          <a
            key={item.id}
            href={finalUrl}
            className="header-menu-item title"
            onClick={(e) => handleClick(e, finalUrl, isExternal, isAnchor)}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            style={{
              textDecoration: isActive ? 'line-through' : undefined,
              color: 'white',
            }}
          >
            {item.title}
          </a>
        );
      })}
      {isMobile && <LocaleSelector />}
    </nav>
  );
}


function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <img src="/images/Layout/menu-icon.png" alt="" />
    </button>
  );
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  const handleCartClick = (e) => {
    e.preventDefault();
    open('cart');
    publish('cart_viewed', {
      cart,
      prevCart,
      shop,
      url: window.location.href || '',
    });
  };

  return (
    <>
      <a
        href="/cart"
        className="title header-menu-item cartBadgeDesktop"
        onClick={handleCartClick}
      >
        Basket <span className="cart-parens">({count === null ? <span>&nbsp;</span> : count})</span>
      </a>
      <a
        href="/cart"
        className="title header-menu-item cartBadgeMobile"
        onClick={handleCartClick}
      >
        <span className="cart-parens">({count === null ? <span>&nbsp;</span> : count})</span>
      </a>
    </>
  );
}

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
    {id: 'gid://shopify/MenuItem/461609500728', title: 'Collections', url: '/collections'},
    {id: 'gid://shopify/MenuItem/461609533496', title: 'Blog', url: '/blogs/journal'},
    {id: 'gid://shopify/MenuItem/461609566264', title: 'Policies', url: '/policies'},
    {id: 'gid://shopify/MenuItem/461609599032', title: 'About', url: '/pages/about'},
  ],
};

function activeLinkStyle({isActive, isPending}) {
  return {
    textDecoration: isActive ? 'line-through' : undefined,
    color: isPending ? 'white' : 'white',
  };
}

const ALL_COLLECTIONS_QUERY = `#graphql
  query AllCollections($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        description
        image { url altText width height }
        products(first: 10) {
          nodes {
            id title handle
            priceRange { minVariantPrice { amount currencyCode } }
            featuredImage { url altText width height }
          }
        }
      }
    }
  }
`;
