import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {useWindowSize} from '~/hooks/useWindowSize';
import {useTranslation} from '~/hooks/useTranslation';
import {useLocalePath} from '~/hooks/useLocalePath';

export function ProductForm({
  productOptions,
  selectedVariant,
  description2,
  careInstructions,
  descriptionHtml,
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const {t} = useTranslation();
  const {localePath} = useLocalePath();
  const {isDesktop} = useWindowSize();

  const sizeOption = productOptions.find(
    (opt) =>
      opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'talla',
  );
  const colorOption = productOptions.find(
    (opt) => opt.name.toLowerCase() === 'color',
  );

  return (
    <>
      <div className="product-form-section seccion">
        {sizeOption && sizeOption.optionValues.length > 1 && (
          <div className="product-options">
            <div className="product-options-grid">
              {sizeOption.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className="product-options-item title"
                      key={sizeOption.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={localePath(`/products/${handle}?${variantUriQuery}`)}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`product-options-item${exists && !selected ? ' link' : ''} title`}
                      key={sizeOption.name + name}
                      style={{
                        textDecoration: selected ? 'line-through' : 'none',
                        opacity: available ? 1 : 0.3,
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        )}

        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => open('cart')}
          lines={
            selectedVariant
              ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}]
              : []
          }
        >
          {selectedVariant?.availableForSale
            ? t('product.add_to_cart')
            : t('product.sold_out')}
        </AddToCartButton>
      </div>

      {isDesktop && (
        <>
          {description2?.value && (
            <div className="product-description">
              <p style={{whiteSpace: 'pre-wrap'}} className="info">
                {description2.value}
              </p>
            </div>
          )}

          <div className="product-form-section">
            {colorOption && colorOption.optionValues.length > 1 && (
              <div className="product-options">
                <div className="product-options-grid">
                  {colorOption.optionValues.map((value) => {
                    const {
                      name,
                      handle,
                      variantUriQuery,
                      selected,
                      available,
                      exists,
                      isDifferentProduct,
                      swatch,
                    } = value;

                    if (isDifferentProduct) {
                      return (
                        <Link
                          className="product-options-item"
                          key={colorOption.name + name}
                          prefetch="intent"
                          preventScrollReset
                          replace
                          to={localePath(
                            `/products/${handle}?${variantUriQuery}`,
                          )}
                          style={{
                            border: selected
                              ? '1px solid black'
                              : '1px solid transparent',
                            opacity: available ? 1 : 0.3,
                          }}
                        >
                          <ProductOptionSwatch swatch={swatch} name={name} />
                        </Link>
                      );
                    } else {
                      return (
                        <button
                          key={colorOption.name + name}
                          type="button"
                          className={`color-options-item${exists && !selected ? ' link' : ''}`}
                          style={{
                            outline: selected
                              ? '5px solid white'
                              : '1px solid transparent',
                            opacity: available ? 1 : 0.3,
                            backgroundColor: name,
                          }}
                          disabled={!exists}
                          onClick={() => {
                            if (!selected) {
                              void navigate(`?${variantUriQuery}`, {
                                replace: true,
                                preventScrollReset: true,
                              });
                            }
                          }}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            )}

            <button className="shop-now-button title" type="button">
              {t('product.shop_now')}
            </button>
          </div>

          {careInstructions?.value && (
            <div className="product-care">
              <h3 className="info">{t('product.care')}</h3>
              <p className="info" style={{whiteSpace: 'pre-wrap'}}>
                {careInstructions.value}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}

function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{backgroundColor: color || 'transparent'}}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
