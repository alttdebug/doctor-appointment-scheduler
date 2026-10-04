import { NextResponse } from 'next/server';
import { getDoctors, getAppointments, createAppointment, cancelAppointment } from '@/lib/store';

export async function GET() {
  const doctors = await getDoctors();
  return NextResponse.json(doctors);
}
