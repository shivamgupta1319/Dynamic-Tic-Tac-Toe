import { expect, test } from '@playwright/test';
import { signIn } from './helpers';

test.describe('Dynamic Tic Tac Toe Browser Tests', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/game');
  });

  test('US-001: Select Game Mode', async ({ page }) => {
    const gameModeSelect = page.locator('#game-mode-select');
    await expect(gameModeSelect).toBeVisible();
    await gameModeSelect.click();
    const option = page.getByRole('option', { name: /Human vs Computer/i });
    await option.click();
    await expect(page.locator('#game-mode-select')).toContainText(/Human vs Computer/i);
  });

  test('US-002: Configure Board Size', async ({ page }) => {
    const boardSizeSelect = page.locator('#board-size-select');
    await expect(boardSizeSelect).toBeVisible();
    await boardSizeSelect.click();
    const option = page.getByRole('option', { name: /4 x 4/i });
    await option.click();
    await expect(page.locator('#board-size-select')).toContainText(/4 x 4/i);
  });

  test('US-003: Configure Win Condition', async ({ page }) => {
    const winCondSelect = page.locator('#win-condition-select');
    await expect(winCondSelect).toBeVisible();
    await winCondSelect.click();
    const option = page.getByRole('option', { name: /3 in a row/i });
    await option.click();
    await expect(winCondSelect).toBeVisible();
  });

  test('US-004: Render Dynamic Board', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();
    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await expect(cells.first()).toBeVisible();
  });

  test('US-005: Place Mark', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();
    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');
  });

  test('US-006: Alternate Turns', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();
    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');
    await expect(page.getByText('Current Turn:')).toContainText('O');
    await cells.nth(1).click();
    await expect(cells.nth(1)).toHaveText('O');
    await expect(page.getByText('Current Turn:')).toContainText('X');
  });

  test('US-007: Detect Win', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();
    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await cells.nth(0).click();
    await cells.nth(3).click();
    await cells.nth(1).click();
    await cells.nth(4).click();
    await cells.nth(2).click();
    await expect(page.getByText(/Player X wins this round!/i)).toBeVisible();
  });

  test('US-008: Detect Draw', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();
    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await cells.nth(0).click();
    await cells.nth(1).click();
    await cells.nth(2).click();
    await cells.nth(4).click();
    await cells.nth(3).click();
    await cells.nth(5).click();
    await cells.nth(7).click();
    await cells.nth(6).click();
    await cells.nth(8).click();
    await expect(page.getByText(/It is a draw!/i)).toBeVisible();
  });

  test('US-009: Computer Move in Human vs Computer mode', async ({ page }) => {
    const gameModeSelect = page.locator('#game-mode-select');
    await gameModeSelect.click();
    await page.getByRole('option', { name: /Human vs Computer/i }).click();

    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();

    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');

    await page.waitForTimeout(600);
    const cellTexts = await cells.allTextContents();
    const oCount = cellTexts.filter((t) => t === 'O').length;
    expect(oCount).toBeGreaterThanOrEqual(1);
  });

  test('US-010: Display Game Result', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();
    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await cells.nth(0).click();
    await cells.nth(3).click();
    await cells.nth(1).click();
    await cells.nth(4).click();
    await cells.nth(2).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/Round Over!/i)).toBeVisible();
  });

  test('US-011: Track Scores', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();
    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await cells.nth(0).click();
    await cells.nth(3).click();
    await cells.nth(1).click();
    await cells.nth(4).click();
    await cells.nth(2).click();
    await expect(page.getByText(/Player X: 1/i)).toBeVisible();
  });

  test('US-012: Start New Round', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();
    const cells = page.locator('.grid button[type="button"]:not([role="combobox"])');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');

    await page.getByRole('button', { name: /Restart Round/i }).click();
    await expect(cells.nth(0)).toHaveText('');
  });
});
