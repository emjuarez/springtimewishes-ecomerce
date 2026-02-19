import {useState} from 'react';
import {Form} from 'react-router';
import '../styles/appointment.css';

export const meta = () => {
  return [{title: 'Agendar Cita - SpringTime Wishes'}];
};

export default function AppointmentsPage() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    comments: '',
    name: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Horarios disponibles (10am - 5pm cada 30 min)
  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/create-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: '¡Cita agendada exitosamente! Recibirás un correo de confirmación.',
        });
        // Limpiar formulario
        setFormData({
          date: '',
          time: '',
          comments: '',
          name: '',
          email: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Hubo un error al agendar la cita.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Error de conexión. Por favor intenta de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
        <div className="appointments-page">
            <div className='appointments-info'>
                <h1 className='info'>Studio hours</h1>
                <p className="subtitle info" >
                Agenda una cita para conocer nuestras colecciones en persona
                </p>
            </div>
            <div className="appointments-container">
                <form onSubmit={handleSubmit} className="appointment-form">
                {/* Nombre */}
                <div className="form-group">
                    <label htmlFor="name" className='title'>Nombre</label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className='info'
                    />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email" className='title'>Correo electrónico</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className='info'
                    />
                </div>

                {/* Fecha */}
                <div className="form-group">
                    <label htmlFor="date" className='title'>Fecha</label>
                    <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                    className='info'
                    />
                </div>

                {/* Hora */}
                <div className="form-group">
                    <label htmlFor="time" className='title'>Hora </label>
                    <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    >
                    <option value="">Selecciona una hora</option>
                    {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                        {slot}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Comentarios */}
                <div className="form-group">
                    <label htmlFor="comments" className='title'>Comentarios</label>
                    <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows="4"
                    placeholder="¿Hay algo específico que te gustaría ver o discutir?"
                    className='info'
                    />
                </div>

                {/* Status messages */}
                {submitStatus && (
                    <div className={`status-message ${submitStatus.type}`}>
                    {submitStatus.message}
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    className="submit-button title"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Agendando...' : 'Agendar Cita'}
                </button>
                </form>
            </div>
        </div>
        <div className='mist'></div>
    </>

  );
}
