import { NextResponse } from 'next/server';
import { createAppointment, getAppointments } from '@/lib/store';

export async function GET() {
  const appointments = await getAppointments();
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const appointment = await createAppointment(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create appointment.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
