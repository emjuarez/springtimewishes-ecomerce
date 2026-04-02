import {useLoaderData, data} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {useTranslation} from '~/hooks/useTranslation';
import '../styles/cart.css';

export const meta = () => {
  return [{title: 'SpringTime Wishes | Cart'}];
};

export const headers = ({actionHeaders}) => actionHeaders;

export async function action({request, context}) {
  const {cart} = context;
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) throw new Error('No action provided');

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];
      giftCardCodes.push(...inputs.giftCardCodes);
      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove:
      result = await cart.removeGiftCardCodes(inputs.giftCardCodes);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({...inputs.buyerIdentity});
      break;
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {cart: cartResult, errors, warnings, analytics: {cartId}},
    {status, headers},
  );
}

export async function loader({context}) {
  const {cart, storefront} = context;
  const cartData = await cart.get();

  if (!cartData?.lines?.nodes?.length) {
    return {cart: cartData, originalTitles: {}};
  }

  const productIds = [
    ...new Set(
      cartData.lines.nodes.map((line) => line.merchandise.product.id),
    ),
  ];

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

  return {cart: cartData, originalTitles};
}

const CART_PRODUCTS_TITLES_QUERY = `#graphql
  query CartProductTitles(
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

export default function Cart() {
  const {cart, originalTitles} = useLoaderData();
  const {t} = useTranslation();

  return (
    <div className="cart">
      <h1 className="title">{t('cart.title')}</h1>
      <CartMain layout="page" cart={cart} originalTitles={originalTitles} />
    </div>
  );
}

/** @typedef {import('react-router').HeadersFunction} HeadersFunction */
/** @typedef {import('./+types/cart').Route} Route */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
