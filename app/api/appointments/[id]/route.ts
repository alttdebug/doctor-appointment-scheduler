import { NextResponse } from 'next/server';
import { cancelAppointment } from '@/lib/store';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await cancelAppointment(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to cancel appointment.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
