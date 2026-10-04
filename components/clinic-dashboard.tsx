'use client';

import { useEffect, useMemo, useState } from 'react';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
};

type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled';
};

const initialForm = {
  doctorId: '',
  patientName: '',
  patientPhone: '',
  date: '',
  time: '',
};

export default function ClinicDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const [doctorResponse, appointmentResponse] = await Promise.all([
      fetch('/api/doctors'),
      fetch('/api/appointments'),
    ]);

    if (doctorResponse.ok) {
      const doctorData = (await doctorResponse.json()) as Doctor[];
      setDoctors(doctorData);
      if (!form.doctorId && doctorData[0]) {
        setForm((current) => ({ ...current, doctorId: doctorData[0].id }));
      }
    }

    if (appointmentResponse.ok) {
      const appointmentData = (await appointmentResponse.json()) as Appointment[];
      setAppointments(appointmentData);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const todaysCount = useMemo(
    () => appointments.filter((appointment) => appointment.date === new Date().toISOString().slice(0, 10)).length,
    [appointments],
  );

  const doctorsCount = doctors.length;
  const upcomingCount = appointments.length;

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to create appointment.');
      }

      setForm({ ...initialForm, doctorId: doctors[0]?.id ?? '' });
      setMessage({ type: 'success', text: 'Appointment booked successfully.' });
      await loadData();
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Something went wrong.';
      setMessage({ type: 'error', text: messageText });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    const response = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });

    if (response.ok) {
      setAppointments((current) => current.filter((appointment) => appointment.id !== id));
      setMessage({ type: 'success', text: 'Appointment canceled successfully.' });
    } else {
      setMessage({ type: 'error', text: 'Could not cancel the appointment.' });
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">+</div>
            <div>
              <h1>ClinicFlow</h1>
            </div>
          </div>
          <div className="status-pill">Live schedule</div>
        </header>

        <section className="metrics">
          <div className="metric-card">
            <div className="metric-label">Appointments</div>
            <p className="metric-value">{upcomingCount}</p>
          </div>
          <div className="metric-card">
            <div className="metric-label">Doctors</div>
            <p className="metric-value">{doctorsCount}</p>
          </div>
          <div className="metric-card">
            <div className="metric-label">Today</div>
            <p className="metric-value">{todaysCount}</p>
          </div>
        </section>

        <div className="layout-grid">
          <section className="panel">
            <h2>Book an appointment</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="doctorId">Doctor</label>
                  <select id="doctorId" value={form.doctorId} onChange={(event) => handleChange('doctorId', event.target.value)} required>
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} — {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="patientName">Patient</label>
                  <input
                    id="patientName"
                    type="text"
                    placeholder="Patient name"
                    value={form.patientName}
                    onChange={(event) => handleChange('patientName', event.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="patientPhone">Phone</label>
                  <input
                    id="patientPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={form.patientPhone}
                    onChange={(event) => handleChange('patientPhone', event.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="date">Date</label>
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(event) => handleChange('date', event.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="time">Time</label>
                  <input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(event) => handleChange('time', event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="primary-btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Booking...' : 'Book visit'}
                </button>
              </div>
            </form>

            {message && (
              <div className={`alert ${message.type}`} role="status">
                {message.text}
              </div>
            )}
          </section>

          <section className="panel">
            <h2>Doctors</h2>

            <div className="doctor-list">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-info">
                    <div className="doc-avatar">{doctor.name[0]}</div>
                    <div>
                      <h3>{doctor.name}</h3>
                      <p>{doctor.specialty}</p>
                    </div>
                  </div>
                  <span className="badge">Available</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="panel" style={{ marginTop: 24 }}>
          <h2>Upcoming appointments</h2>

          <div className="appointments">
            {appointments.length === 0 ? (
              <div className="empty-state">No appointments scheduled yet.</div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-row">
                    <div className="appointment-meta">
                      <strong>{appointment.patientName}</strong>
                      <span>{appointment.doctorName}</span>
                      <span>{appointment.patientPhone}</span>
                    </div>
                    <div className="appointment-time">
                      {appointment.date} • {appointment.time}
                    </div>
                  </div>

                  <div className="appointment-footer">
                    <span className="status">{appointment.status}</span>
                    <button type="button" className="danger-btn" onClick={() => cancelAppointment(appointment.id)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
