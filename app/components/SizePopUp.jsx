import {useState} from 'react';
import '../styles/size-popup.css';
import {useTranslation} from '~/hooks/useTranslation';

export function SizePopUp() {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // ✅ estado interno

  const sizeTableHeaders = {
    size: t('product.size'),
    bust: t('product.bust'),
    waist: t('product.waist'),
    hips: t('product.hips'),
  };

  return (
    <>
      {/* ✅ Botón trigger dentro del componente */}
      <button
        type="button"
        className="info product-form-button"
        onClick={() => setIsOpen(true)}
      >
        {t('product.size_table')}
      </button>

      {/* ✅ Popup */}
      {isOpen && (
        <div
          className="product-popup-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="product-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="product-popup-close info"
              onClick={() => setIsOpen(false)}
            >
              Close X
            </button>
            <table className="size-table info" role="table" aria-label={t('product.size_table')}>
              <thead>
                <tr>
                  <th className="size-label title" scope="col">{sizeTableHeaders.size}</th>
                  <th className="col title" scope="col">I</th>
                  <th className="col title" scope="col">II</th>
                  <th className="col title" scope="col">III</th>
                  <th className="col title" scope="col">IV</th>
                  <th className="col title" scope="col">V</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{sizeTableHeaders.bust}</th>
                  <td>78–81</td>
                  <td>82–86.5</td>
                  <td>82–86.5</td>
                  <td>82–86.5</td>
                  <td>100–110.2</td>
                </tr>
                <tr>
                  <th scope="row">{sizeTableHeaders.waist}</th>
                  <td>62–66</td>
                  <td>67–71</td>
                  <td>71.5–76.4</td>
                  <td>77–81</td>
                  <td>84–97.6</td>
                </tr>
                <tr>
                  <th scope="row">{sizeTableHeaders.hips}</th>
                  <td>79–81.5</td>
                  <td>88–92</td>
                  <td>94–96</td>
                  <td>99–104</td>
                  <td>105–113.2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
