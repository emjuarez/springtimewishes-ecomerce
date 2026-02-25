import {Image} from '@shopify/hydrogen';
import {useWindowSize} from '~/hooks/useWindowSize';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({image}) {
  const {isMobile, isTablet, isDesktop} = useWindowSize();
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <>
    {isDesktop && (
      <div className="product-image">
        <Image
          alt={image.altText || 'Product Image'}
          aspectRatio="1/1"
          data={image}
          key={image.id}
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </div>
    )}
    {isMobile && (
      <div className="product-image">
        <div className='imageWrapper'>
          <Image
            alt={image.altText || 'Product Image'}
            aspectRatio="1/1"
            data={image}
            key={image.id}
            sizes="(min-width: 45em) 50vw, 100vw"
          />
        </div>
      </div>
    )}
    </>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
