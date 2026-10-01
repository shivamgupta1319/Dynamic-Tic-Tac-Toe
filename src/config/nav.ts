import type { Role } from '@prisma/client';

export interface NavItem {
  href: string;
  label: string;
  roles?: readonly Role[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/game', label: 'Play Game' },
  { href: '/history', label: 'Game History' },
  { href: '/users', label: 'Users', roles: ['ADMIN'] },
];

export const APP_NAME = 'Dynamic Tic Tac Toe';
