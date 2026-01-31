import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to domains as the main content page
  redirect('/domains');
}
