import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app-shell/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await requireUser();
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user.name}`}
        description="Manage your game sessions, check your match history, and configure dynamic board settings."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Play Game</CardTitle>
            <CardDescription>
              Configure board size, win conditions, and play rounds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="h-11 w-full">
              <Link href="/game">Play Game Board</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
            <CardDescription>
              Review past completed matches, scores, and statistics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="h-11 w-full">
              <Link href="/history">View History</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Signed in as {user.email} ({user.role}).
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Account ID: {user.id}</CardContent>
        </Card>
      </div>
    </div>
  );
}
