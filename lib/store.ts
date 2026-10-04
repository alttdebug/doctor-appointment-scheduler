import { promises as fs } from 'fs';
import path from 'path';

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled';
};

type ClinicData = {
  doctors: Doctor[];
  appointments: Appointment[];
};

const DATA_PATH = path.join(process.cwd(), 'data', 'clinic-data.json');

async function readData(): Promise<ClinicData> {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw) as ClinicData;
}

async function writeData(data: ClinicData) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export async function getDoctors() {
  const data = await readData();
  return data.doctors;
}

export async function getAppointments() {
  const data = await readData();
  return data.appointments;
}

export async function createAppointment(input: {
  doctorId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
}) {
  const data = await readData();

  if (!input.doctorId || !input.patientName || !input.patientPhone || !input.date || !input.time) {
    throw new Error('All appointment fields are required.');
  }

  const doctor = data.doctors.find((item) => item.id === input.doctorId);

  if (!doctor) {
    throw new Error('Selected doctor is invalid.');
  }

  const existing = data.appointments.some(
    (appointment) =>
      appointment.doctorId === input.doctorId &&
      appointment.date === input.date &&
      appointment.time === input.time &&
      appointment.status === 'scheduled',
  );

  if (existing) {
    throw new Error('This time slot is already booked.');
  }

  const appointment: Appointment = {
    id: `apt-${Date.now()}`,
    patientName: input.patientName.trim(),
    patientPhone: input.patientPhone.trim(),
    doctorId: doctor.id,
    doctorName: doctor.name,
    date: input.date,
    time: input.time,
    status: 'scheduled',
  };

  data.appointments = [appointment, ...data.appointments];
  await writeData(data);
  return appointment;
}

export async function cancelAppointment(id: string) {
  const data = await readData();
  const index = data.appointments.findIndex((appointment) => appointment.id === id);

  if (index === -1) {
    return false;
  }

  data.appointments.splice(index, 1);
  await writeData(data);
  return true;
}
