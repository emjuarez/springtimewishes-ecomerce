import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

export function ProductForm({
  productOptions, 
  selectedVariant, 
  description2, 
  careInstructions, 
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  
  // Separar las opciones por tipo
  const sizeOption = productOptions.find(opt => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'talla');
  const colorOption = productOptions.find(opt => opt.name.toLowerCase() === 'color');
  
  return (
    <>
      {/* SECCIÓN 1: Size options + Add to Basket */}
      <div className="product-form-section">
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
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected ? '1px solid black' : '1px solid transparent',
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
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to Basket' : 'Sold out'}
        </AddToCartButton>
      </div>

      {/* SECCIÓN 2: Description (description2) */}
      {description2?.value && (
        <div className="product-description ">
          <p style={{whiteSpace: 'pre-wrap'}} className='info'>{description2.value}</p>
        </div>
      )}

      {/* SECCIÓN 3: Color options + Shop Now */}
      <div className="product-form-section">
        {colorOption && colorOption.optionValues.length > 1 && (
          <div className="product-options">
            {/* <h3>{colorOption.name}</h3> */}
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
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected ? '1px solid black' : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <>
                      <button
                      type="button"
                      className={`color-options-item${exists && !selected ? ' link' : ''}`}
                      key={colorOption.name + name}
                      style={{
                        outline: selected ? '5px solid white' : '1px solid transparent',
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
                    >
                      {/* <ProductOptionSwatch swatch={swatch} name={name} /> */}
                    </button>
                    </>
                    
                  );
                }
              })}
            </div>
          </div>
        )}

        <button className="shop-now-button title" type="button">
          Shop Now
        </button>
      </div>

      {/* SECCIÓN 4: Care Instructions */}
      {careInstructions?.value && (
        <div className="product-care">
          <h3 className='info'>Care +</h3>
          <p className='info' style={{whiteSpace: 'pre-wrap'}}>{careInstructions.value}</p>
        </div>
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
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
