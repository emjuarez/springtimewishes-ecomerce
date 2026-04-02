import {useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {useTranslation} from '~/hooks/useTranslation';
import {useLocalePath} from '~/hooks/useLocalePath';

export function CartMain({layout, cart: originalCart, originalTitles}) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem
                key={line.id}
                line={line}
                layout={layout}
                originalTitles={originalTitles} // ✅
              />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({hidden = false}) {
  const {close} = useAside();
  const {t} = useTranslation();
  const {localePath} = useLocalePath();

  return (
    <div hidden={hidden}>
      <br />
      <p>{t('cart.empty_message')}</p>
      <br />
      <a
        href={localePath('/collections')}
        onClick={(e) => {
          e.preventDefault();
          close();
          window.location.href = localePath('/collections');
        }}
      >
        {t('cart.continue_shopping')} →
      </a>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
