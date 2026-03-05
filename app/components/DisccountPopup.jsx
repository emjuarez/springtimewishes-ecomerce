import {useState, useEffect} from 'react';
import {Form} from 'react-router';
import '../styles/discount-popup.css';

export function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showCode, setShowCode] = useState(false);

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
      // Marcar que ya vio el popup
      localStorage.setItem('hasSeenDiscountPopup', 'true');
      
      // Aquí puedes agregar lógica para guardar el email
      // Por ejemplo, enviarlo a Shopify o a un servicio de email
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenDiscountPopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose}>×</button>
        
        {!showCode ? (
          <div className="popup-form">
            <h2>¡Bienvenido a Springtime Wishes!</h2>
            <p>Regístrate y obtén <strong>10% de descuento</strong> en tu primera compra</p>
            
            <Form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="popup-input"
              />
              <button type="submit" className="popup-button">
                Obtener mi descuento
              </button>
            </Form>
            
            <p className="popup-disclaimer">
              Al registrarte aceptas recibir emails de Springtime Wishes
            </p>
          </div>
        ) : (
          <div className="popup-success">
            <h2>¡Tu código de descuento!</h2>
            <div className="discount-code">BIENVENIDA10</div>
            <p>Usa este código en tu primera compra para obtener 10% de descuento</p>
            <button onClick={handleClose} className="popup-button">
              Comenzar a comprar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
