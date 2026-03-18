import AuditForm from '../components/AuditForm';

export const metadata = {
  title: 'AI Audit | Arcigy',
  description: 'Získajte bezplatný audit tvojich procesov a zisti potenciál pre AI automatizáciu.',
};

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-black-depth">
      <AuditForm />
    </main>
  );
}
