import {useState} from 'react';
import '../styles/appointment.css';
import {useWindowSize} from '~/hooks/useWindowSize';
import {useTranslation} from '~/hooks/useTranslation';

export const meta = ({data}) => {
  return [{title: data?.title || 'Reservations - SpringTime Wishes'}];
};

export async function loader({context}) {
  const {storefront} = context;
  return {
    title: storefront.i18n.language === 'ES'
      ? 'Agendar Cita - SpringTime Wishes'
      : 'Book Appointment - SpringTime Wishes',
  };
}

export default function AppointmentsPage() {
  const {isMobile, isDesktop} = useWindowSize();
  const {t} = useTranslation(); // ✅

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    comments: '',
    name: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!formData.time) {
      setSubmitStatus({
        type: 'error',
        message: t('appointments.error_no_time'),
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/create-appointment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: t('appointments.success'),
        });
        setFormData({date: '', time: '', comments: '', name: '', email: ''});
        document.querySelectorAll('input[name="time"]').forEach(
          (radio) => (radio.checked = false),
        );
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || t('appointments.error_generic'),
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({
        type: 'error',
        message: t('appointments.error_connection'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {isDesktop && (
        <>
          <div className="appointments-page">
            <div className="appointments-info">
              <h1 className="info">{t('appointments.studio_hours')}</h1>
              <p className="subtitle info">{t('appointments.subtitle')}</p>
            </div>
            <div className="appointments-container">
              <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-group">
                  <label htmlFor="name" className="title">
                    {t('appointments.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('appointments.name_placeholder')}
                    className="info"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="title">
                    {t('appointments.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className="info"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date" className="title">
                    {t('appointments.date')}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                    className="info"
                  />
                </div>
                <div className="form-group">
                  <label className="title">{t('appointments.time')}</label>
                  <div className="timeGrid">
                    {timeSlots.map((slot) => {
                      const id = `time-${slot.replace(':', '')}`;
                      return (
                        <label key={slot} htmlFor={id} className="time-slot">
                          <input
                            type="radio"
                            id={id}
                            name="time"
                            value={slot}
                            onChange={handleChange}
                            required
                          />
                          <span>{slot}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="comments" className="title">
                    {t('appointments.comments')}
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows="4"
                    placeholder={t('appointments.comments_placeholder')}
                    className="info"
                  />
                </div>
                {submitStatus && (
                  <div className={`status-message ${submitStatus.type}`}>
                    {submitStatus.message}
                  </div>
                )}
                <button
                  type="submit"
                  className="submit-button title"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('appointments.submitting')
                    : t('appointments.submit')}
                </button>
              </form>
            </div>
          </div>
          <div className="mist"></div>
        </>
      )}
      {isMobile && (
        <>
          <div className="appointments-page">
            <div className="appointments-container">
              <h1 className="info">{t('appointments.reservation')}</h1>
              <form onSubmit={handleSubmit} className="appointment-form">
                <div className="inputContainer">
                  <div className="form-group">
                    <label htmlFor="name-mobile" className="title">
                      {t('appointments.name')}
                    </label>
                    <input
                      type="text"
                      id="name-mobile"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t('appointments.name_placeholder')}
                      className="info"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email-mobile" className="title">
                      {t('appointments.email')}
                    </label>
                    <input
                      type="email"
                      id="email-mobile"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@email.com"
                      className="info"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date-mobile" className="title">
                      {t('appointments.date')}
                    </label>
                    <input
                      type="date"
                      id="date-mobile"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      required
                      className="info"
                    />
                  </div>
                  <div className="form-group">
                    <label className="title">{t('appointments.time')}</label>
                    <div className="timeGrid">
                      {timeSlots.map((slot) => {
                        const id = `time-mobile-${slot.replace(':', '')}`;
                        return (
                          <label key={slot} htmlFor={id} className="time-slot">
                            <input
                              type="radio"
                              id={id}
                              name="time"
                              value={slot}
                              onChange={handleChange}
                              required
                            />
                            <span>{slot}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="comments-mobile" className="title">
                      {t('appointments.comments')}
                    </label>
                    <textarea
                      id="comments-mobile"
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      rows="4"
                      placeholder={t('appointments.comments_placeholder')}
                      className="info"
                    />
                  </div>
                  {submitStatus && (
                    <div className={`status-message ${submitStatus.type}`}>
                      {submitStatus.message}
                    </div>
                  )}
                </div>
                <div className="appointments-info">
                  <h1 className="info">{t('appointments.studio_hours')}</h1>
                  <p className="subtitle info">{t('appointments.subtitle')}</p>
                </div>
                <button
                  type="submit"
                  className="submit-button title"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('appointments.submitting')
                    : t('appointments.submit')}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
