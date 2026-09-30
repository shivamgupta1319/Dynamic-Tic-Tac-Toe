import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app-shell/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requireUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader title="Dashboard" description={`Welcome, ${user.name}!`} />
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/game">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Play Game</CardTitle>
            </CardHeader>
            <CardContent>Start a new Tic‑Tac‑Toe match.</CardContent>
          </Card>
        </Link>
        <Link href="/history">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>View past games and statistics.</CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}
