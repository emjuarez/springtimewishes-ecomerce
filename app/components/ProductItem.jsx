import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';


export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
    console.log('Product data:', product);
  console.log('Options:', product.options);
  console.log('Variants:', product.variants);
  // Obtener las tallas disponibles
  const sizeOption = product.options?.find(
    (option) => option.name.toLowerCase() === 'size' || option.name.toLowerCase() === 'talla'
  );
  
  // Obtener solo las tallas que tienen stock disponible
  const availableSizes = sizeOption 
    ? getAvailableSizes(product.variants?.nodes || [], sizeOption.optionValues)
    : [];

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <div className='productInfo'>
        <div className='left'>
          <h4 className='title'>{product.title}</h4>
          <Money data={product.priceRange.minVariantPrice} />
        </div>
        <div className='right'>
          <p>SIZE</p>
          <div className='sizes-list'>
            {availableSizes.length > 0 ? (
              availableSizes.map((size, index) => (
                <span key={index} className={`size-badge ${size.available ? '' : 'unavailable'}`}>
                  {size.name}
                </span>
              ))
            ) : (
              <p className='info'>One Size</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}


/**
 * Obtiene las tallas disponibles basándose en las variantes
 * @param {Array} variants - Array de variantes del producto
 * @param {Array} sizeOptions - Array de opciones de talla
 * @returns {Array} Array de objetos con {name, available}
 */
function getAvailableSizes(variants, sizeOptions) {
  if (!variants || !sizeOptions) return [];
  
  return sizeOptions.map((sizeOption) => {
    // Buscar si existe una variante con esta talla que esté disponible
    const hasAvailableVariant = variants.some((variant) => {
      const sizeValue = variant.selectedOptions?.find(
        (opt) => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'talla'
      );
      return sizeValue?.value === sizeOption.name && variant.availableForSale;
    });
    
    return {
      name: sizeOption.name,
      available: hasAvailableVariant,
    };
  });
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
