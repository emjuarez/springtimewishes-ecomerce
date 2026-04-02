import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import {useTranslation} from '~/hooks/useTranslation';
import {useLocalePath} from '~/hooks/useLocalePath';
import '../styles/cart.css';


export function CartLineItem({layout, line, originalTitles}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const {localePath} = useLocalePath();
  const {t} = useTranslation();
  const displayTitle = originalTitles[product.id] || product.title;

  console.log('📦 product.id:', product.id);
  console.log('📦 originalTitles:', originalTitles);
  console.log('📦 displayTitle:', displayTitle);

  const sortedOptions = [...selectedOptions].sort((a, b) => {
    const order = ['Color', 'Size'];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  const handleClick = (e) => {
    e.preventDefault();
    if (layout === 'aside') close();
    window.location.href = localePath(lineItemUrl);
  };

  return (
    <li key={id} className="cart-line">
      <div className="row top">
        <a
          href={localePath(lineItemUrl)}
          onClick={handleClick}
        >
          <p className="title">{displayTitle}</p>
        </a>
        <ProductPrice price={line?.cost?.totalAmount} />
      </div>
      <div className="row">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
          />
        )}
        <div className="cart-line_productInfo">
          <ul>
            {sortedOptions.map((option) => (
              <li key={option.name}>
                <small className="info">
                  {t(`product.option_${option.name.toLowerCase()}`) || option.name}: {option.value}
                </small>
              </li>
            ))}
          </ul>
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({line}) {
  const {t} = useTranslation();
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label={t('cart.decrease_quantity')}
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="cartButton info"
        >
          <span>&#8722;</span>
        </button>
      </CartLineUpdateButton>
      <small className="cart-line_counter info">{quantity}</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label={t('cart.increase_quantity')}
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="cartButton info"
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({lineIds, disabled}) {
  const {t} = useTranslation();
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} type="submit">
        {t('cart.remove')}
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/** @typedef {'page' | 'aside'} CartLayout */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLine} CartLine */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('@shopify/hydrogen').CartLineUpdateInput} CartLineUpdateInput */
