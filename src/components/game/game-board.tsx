'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type GameMode = 'human_vs_human' | 'human_vs_computer';
type CellValue = 'X' | 'O' | null;

interface GameHistoryItem {
  id: string;
  gameMode: GameMode;
  boardSize: number;
  winCondition: number;
  winner: 'X' | 'O' | 'Draw';
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'dynamic_tic_tac_toe_state_v1';

export function GameBoard() {
  const [gameMode, setGameMode] = useState<GameMode>('human_vs_human');
  const [boardSize, setBoardSize] = useState<number>(3);
  const [winCondition, setWinCondition] = useState<number>(3);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const [board, setBoard] = useState<CellValue[]>([]);
  const [activePlayer, setActivePlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [gameOverModal, setGameOverModal] = useState<boolean>(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gameMode) setGameMode(parsed.gameMode);
        if (parsed.boardSize) setBoardSize(parsed.boardSize);
        if (parsed.winCondition) setWinCondition(parsed.winCondition);
        if (typeof parsed.isStarted === 'boolean') setIsStarted(parsed.isStarted);
        if (Array.isArray(parsed.board)) setBoard(parsed.board);
        if (parsed.activePlayer) setActivePlayer(parsed.activePlayer);
        if (parsed.winner !== undefined) setWinner(parsed.winner);
        if (parsed.scores) setScores(parsed.scores);
        if (Array.isArray(parsed.history)) setHistory(parsed.history);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        gameMode,
        boardSize,
        winCondition,
        isStarted,
        board,
        activePlayer,
        winner,
        scores,
        history,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [
    gameMode,
    boardSize,
    winCondition,
    isStarted,
    board,
    activePlayer,
    winner,
    scores,
    history,
    isLoaded,
  ]);

  const recordFinishedGame = (res: 'X' | 'O' | 'Draw') => {
    const newItem: GameHistoryItem = {
      id: Date.now().toString(),
      gameMode,
      boardSize,
      winCondition,
      winner: res,
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const handleStartGame = () => {
    if (winCondition > boardSize) {
      setConfigError('Win condition cannot be greater than the board size.');
      return;
    }
    setConfigError(null);
    const newBoard = Array(boardSize * boardSize).fill(null);
    setBoard(newBoard);
    setActivePlayer('X');
    setWinner(null);
    setIsStarted(true);
    toast('New round started!');
  };

  const checkWinner = (
    currentBoard: CellValue[],
    size: number,
    winLen: number,
  ): 'X' | 'O' | 'Draw' | null => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c <= size - winLen; c++) {
        const first = currentBoard[r * size + c];
        if (!first) continue;
        let win = true;
        for (let i = 1; i < winLen; i++) {
          if (currentBoard[r * size + c + i] !== first) {
            win = false;
            break;
          }
        }
        if (win) return first;
      }
    }

    for (let c = 0; c < size; c++) {
      for (let r = 0; r <= size - winLen; r++) {
        const first = currentBoard[r * size + c];
        if (!first) continue;
        let win = true;
        for (let i = 1; i < winLen; i++) {
          if (currentBoard[(r + i) * size + c] !== first) {
            win = false;
            break;
          }
        }
        if (win) return first;
      }
    }

    for (let r = 0; r <= size - winLen; r++) {
      for (let c = 0; c <= size - winLen; c++) {
        const first = currentBoard[r * size + c];
        if (!first) continue;
        let win = true;
        for (let i = 1; i < winLen; i++) {
          if (currentBoard[(r + i) * size + (c + i)] !== first) {
            win = false;
            break;
          }
        }
        if (win) return first;
      }
    }

    for (let r = 0; r <= size - winLen; r++) {
      for (let c = winLen - 1; c < size; c++) {
        const first = currentBoard[r * size + c];
        if (!first) continue;
        let win = true;
        for (let i = 1; i < winLen; i++) {
          if (currentBoard[(r + i) * size + (c - i)] !== first) {
            win = false;
            break;
          }
        }
        if (win) return first;
      }
    }

    if (currentBoard.every((cell) => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  const makeComputerMove = (currentBoard: CellValue[], currentActive: 'X' | 'O') => {
    const emptyIndices: number[] = [];
    currentBoard.forEach((val, idx) => {
      if (val === null) emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)] as number;
    const updatedBoard = [...currentBoard];
    updatedBoard[randomIndex] = currentActive;

    const res = checkWinner(updatedBoard, boardSize, winCondition);
    setBoard(updatedBoard);

    if (res) {
      setWinner(res);
      setGameOverModal(true);
      if (res === 'X') setScores((s) => ({ ...s, X: s.X + 1 }));
      else if (res === 'O') setScores((s) => ({ ...s, O: s.O + 1 }));
      else setScores((s) => ({ ...s, Draws: s.Draws + 1 }));
      recordFinishedGame(res);
    } else {
      setActivePlayer(currentActive === 'X' ? 'O' : 'X');
    }
  };

  const handleCellClick = (index: number) => {
    if (!isStarted || board[index] !== null || winner !== null) return;

    const updatedBoard = [...board];
    updatedBoard[index] = activePlayer;
    setBoard(updatedBoard);

    const res = checkWinner(updatedBoard, boardSize, winCondition);
    if (res) {
      setWinner(res);
      setGameOverModal(true);
      if (res === 'X') setScores((s) => ({ ...s, X: s.X + 1 }));
      else if (res === 'O') setScores((s) => ({ ...s, O: s.O + 1 }));
      else setScores((s) => ({ ...s, Draws: s.Draws + 1 }));
      recordFinishedGame(res);
      return;
    }

    const nextPlayer = activePlayer === 'X' ? 'O' : 'X';
    setActivePlayer(nextPlayer);

    if (gameMode === 'human_vs_computer' && nextPlayer === 'O') {
      setTimeout(() => {
        makeComputerMove(updatedBoard, 'O');
      }, 400);
    }
  };

  const handleResetScores = () => {
    setScores({ X: 0, O: 0, Draws: 0 });
    setHistory([]);
    setIsStarted(false);
    setBoard([]);
    setWinner(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast('Scores, history and game reset.');
  };

  return (
    <div className="space-y-6">
      {configError && (
        <Alert variant="destructive">
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>{configError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Game Configuration & Controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="game-mode-select" className="text-sm font-medium">
              Game Mode
            </Label>
            <Select value={gameMode} onValueChange={(val) => setGameMode(val as GameMode)}>
              <SelectTrigger id="game-mode-select" className="h-11 text-base">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human_vs_human">Human vs Human</SelectItem>
                <SelectItem value="human_vs_computer">Human vs Computer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="board-size-select" className="text-sm font-medium">
              Board Size ({boardSize}x{boardSize})
            </Label>
            <Select
              value={boardSize.toString()}
              onValueChange={(val) => {
                const size = parseInt(val, 10);
                setBoardSize(size);
                if (winCondition > size) setWinCondition(size);
              }}
            >
              <SelectTrigger id="board-size-select" className="h-11 text-base">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 x 3</SelectItem>
                <SelectItem value="4">4 x 4</SelectItem>
                <SelectItem value="5">5 x 5</SelectItem>
                <SelectItem value="6">6 x 6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="win-condition-select" className="text-sm font-medium">
              Win Condition
            </Label>
            <Select
              value={winCondition.toString()}
              onValueChange={(val) => setWinCondition(parseInt(val, 10))}
            >
              <SelectTrigger id="win-condition-select" className="h-11 text-base">
                <SelectValue placeholder="Select win condition" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: boardSize }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} in a row
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleStartGame} className="h-11 flex-1 text-base">
              {isStarted ? 'Restart Round' : 'Start Game'}
            </Button>
            <Button variant="outline" onClick={handleResetScores} className="h-11 text-base">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {isStarted && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Scoreboard</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Player X: {scores.X}</Badge>
              <Badge variant="secondary">Player O: {scores.O}</Badge>
              <Badge variant="secondary">Draws: {scores.Draws}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="mb-4 text-lg font-semibold">
              Current Turn: <span className="text-primary">{activePlayer}</span>
            </div>

            <div
              className="grid gap-2 max-w-full overflow-auto p-2 bg-muted/30 rounded-lg"
              style={{
                gridTemplateColumns: `repeat(${boardSize}, minmax(3rem, 1fr))`,
              }}
            >
              {board.map((cell, index) => {
                const row = Math.floor(index / boardSize);
                const col = index % boardSize;
                return (
                  <button
                    key={`cell-${row}-${col}`}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    disabled={cell !== null || winner !== null}
                    className={`h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center text-2xl font-bold rounded-md border transition-colors ${
                      cell === null
                        ? 'bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer'
                        : cell === 'X'
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-secondary text-secondary-foreground border-secondary/50'
                    }`}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={gameOverModal} onOpenChange={setGameOverModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Round Over!</DialogTitle>
            <DialogDescription>
              {winner === 'Draw' ? 'It is a draw!' : `Player ${winner} wins this round!`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setGameOverModal(false);
                handleStartGame();
              }}
              className="h-11 text-base"
            >
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
