import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Doctor Appointment Scheduler',
  description: 'Modern clinic appointment scheduling dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
