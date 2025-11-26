import '../styles/contact.css';

export const meta = () => {
  return [{title: 'Contacto - SpringTime Wishes'}];
};

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <img 
          src="/images/contact-banner.jpg" 
          alt="Contacto" 
          className="contact-image"
        />
        
        <div className="contact-content">
          <h1>Contáctanos</h1>
          <p>
            Estamos aquí para ayudarte. Si tienes alguna pregunta sobre 
            nuestros productos o servicios, no dudes en ponerte en contacto 
            con nosotros.
          </p>
          
          <div className="contact-info">
            <h2>Información de Contacto</h2>
            <p><strong>Email:</strong> info@springtime-wishes.com</p>
            <p><strong>Teléfono:</strong> +52 123 456 7890</p>
            <p><strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
