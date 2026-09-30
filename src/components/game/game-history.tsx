'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type GameMode = 'human_vs_human' | 'human_vs_computer';

interface GameHistoryItem {
  id: string;
  gameMode: GameMode;
  boardSize: number;
  winCondition: number;
  winner: 'X' | 'O' | 'Draw';
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'dynamic_tic_tac_toe_state_v1';

export function GameHistoryComponent() {
  const router = useRouter();
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.history)) {
          setHistory(parsed.history);
        }
      }
    } catch (e) {
      console.error('Failed to load history', e);
      setError('Could not retrieve local game history.');
    }
    setIsLoaded(true);
  }, []);

  const handleClearHistory = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.history = [];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      }
      setHistory([]);
      toast('Game history cleared.');
    } catch (e) {
      console.error('Failed to clear history', e);
      toast.error('Failed to clear history.');
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filterMode === 'all') return true;
    return item.gameMode === filterMode;
  });

  const totalGames = history.length;
  const xWins = history.filter((h) => h.winner === 'X').length;
  const oWins = history.filter((h) => h.winner === 'O').length;
  const draws = history.filter((h) => h.winner === 'Draw').length;

  if (!isLoaded) {
    return <div className="space-y-4">Loading history...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGames}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Player X Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{xWins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Player O Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{oWins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Draws</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{draws}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Completed Games History</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="h-11 w-[180px] text-base">
                <SelectValue placeholder="Filter by mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="human_vs_human">Human vs Human</SelectItem>
                <SelectItem value="human_vs_computer">Human vs Computer</SelectItem>
              </SelectContent>
            </Select>
            {history.length > 0 && (
              <Button variant="outline" onClick={handleClearHistory} className="h-11 text-base">
                Clear History
              </Button>
            )}
            <Button onClick={() => router.push('/game')} className="h-11 text-base">
              Play Game
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No completed games recorded yet. Play a round on the game board!
              </p>
              <Button onClick={() => router.push('/game')} className="h-11 text-base">
                Go to Game Board
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table view for md+ */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Game Mode</TableHead>
                      <TableHead>Board Size</TableHead>
                      <TableHead>Win Condition</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((game) => (
                      <TableRow
                        key={game.id}
                        onClick={() => router.push('/game')}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {new Date(game.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {game.gameMode === 'human_vs_human'
                            ? 'Human vs Human'
                            : 'Human vs Computer'}
                        </TableCell>
                        <TableCell>
                          {game.boardSize}x{game.boardSize}
                        </TableCell>
                        <TableCell>{game.winCondition} in a row</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              game.winner === 'X'
                                ? 'default'
                                : game.winner === 'O'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {game.winner === 'Draw' ? 'Draw' : `Win: ${game.winner}`}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Stacked card view for mobile */}
              <div className="grid gap-4 md:hidden">
                {filteredHistory.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => router.push('/game')}
                    className="w-full text-left cursor-pointer rounded-lg border p-4 space-y-2 bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(game.createdAt).toLocaleString()}</span>
                      <Badge
                        variant={
                          game.winner === 'X'
                            ? 'default'
                            : game.winner === 'O'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {game.winner === 'Draw' ? 'Draw' : `Win: ${game.winner}`}
                      </Badge>
                    </div>
                    <div className="font-semibold">
                      {game.gameMode === 'human_vs_human' ? 'Human vs Human' : 'Human vs Computer'}
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>
                        Board: {game.boardSize}x{game.boardSize}
                      </span>
                      <span>Win Condition: {game.winCondition}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
