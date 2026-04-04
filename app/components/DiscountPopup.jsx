import {useState, useEffect} from 'react';
import {Form} from 'react-router';
import '../styles/discount-popup.css';

export function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);// debe de ir el false
  const [email, setEmail] = useState('');
  const [showCode, setShowCode] = useState(false);// debe de ir el false
  const [isCloseActive, setIsCloseActive] = useState(false); // debe de ir el false

  useEffect(() => {
    // Verificar si ya se mostró el popup antes
    const hasSeenPopup = localStorage.getItem('hasSeenDiscountPopup');
    
    if (!hasSeenPopup) {
      // Mostrar popup después de 3 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setShowCode(true);
      // Cambiar de color el boton de Close
      setIsCloseActive(true); 
      // Marcar que ya vio el popup
      localStorage.setItem('hasSeenDiscountPopup', 'true');

    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenDiscountPopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
      <button 
          className={`popup-close info ${isCloseActive ? 'active' : ''}`}
          onClick={handleClose}
        >
          Close X
        </button>
        {!showCode ? (
          <>
            <div className="left">
              <h3 className='info'>Enjoy 10% off your first order, private sales, and early access to restocks</h3>
              <Form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="popup-input title"
                />
                <button type="submit" className="popup-button title">
                  Join
                </button>
              </Form>
            </div>
            <img className="poup-image" src="/images/Layout/popup-image.png" alt="key" />
          </>
        ) : (
          <div className="popup-success">
            <h3 className='info'>Enjoy 10% off your first order, private sales, and early access to restocks</h3>
            <div className='lowdiv'>
              <p className='info'>⋆⋆%⋆.ೃ*:･%⋆.ೃ%⋆.ೃ*:･%⋆.ೃ%⋆.ೃ*:･%⋆.ೃ%⋆.ೃ*:･%⋆.ೃ%⋆.ೃ*:･%⋆.ೃ⋆⋆</p>
              <div className="popup-input title">BIENVENIDA10</div>
              <button onClick={handleClose} className="popup-button title">
                Comenzar a comprar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
