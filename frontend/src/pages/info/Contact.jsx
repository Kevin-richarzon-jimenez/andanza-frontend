import { useState } from 'react'
import './info-shared.css'

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    event.target.reset()
  }

  return (
    <div className="contact-split">
      <div className="contact-form">
        <h1>Escríbenos</h1>
        <form onSubmit={handleSubmit}>
          <div className="field-group"><label htmlFor="name">Nombre</label><input type="text" id="name" name="name" required /></div>
          <div className="field-group"><label htmlFor="email">Correo</label><input type="email" id="email" name="email" required /></div>
          <div className="field-group"><label htmlFor="subject">Asunto</label><input type="text" id="subject" name="subject" required /></div>
          <div className="field-group"><label htmlFor="message">Mensaje</label><textarea id="message" name="message" required></textarea></div>
          <button type="submit" className="btn btn-fill" style={{ marginTop: 4 }}>Enviar mensaje</button>
          {submitted && (
            <p className="form-feedback">¡Mensaje enviado! Te responderemos pronto.</p>
          )}
        </form>
      </div>
      <aside className="contact-info">
        <h2>Información de contacto</h2>
        <div className="contact-row">
          <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg></div>
          <div><div className="label">Línea de atención</div><div className="value">01 8000 942 434</div></div>
        </div>
        <div className="contact-row">
          <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /></svg></div>
          <div><div className="label">Correo</div><div className="value">ayuda@andanza.co</div></div>
        </div>
        <div className="contact-row">
          <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
          <div><div className="label">Horario</div><div className="value">Lun a sáb, 8:00am – 5:00pm</div></div>
        </div>
        <div className="contact-row">
          <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg></div>
          <div><div className="label">Sede</div><div className="value">Barranquilla, Colombia</div></div>
        </div>
      </aside>
    </div>
  )
}

export default Contact
