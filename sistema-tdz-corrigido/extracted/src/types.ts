export type GameMode = 120 | 200;

export interface Game {
  id: number;
  label: string; // e.g., "J1", "J2"
  numbers: string[]; // [fixed1, fixed2, variable]
  pairIndex: number; // 0..9
  variableIndex: number; // 0..19
  hits: number; // 0, 1, 2, or 3
  matchedNumbers: string[]; // numbers that match drawn numbers
}

export interface CheckResult {
  fixasAcertos: number;
  variaveisAcertos: number;
  totalTernos: number;
  totalDuques: number;
  totalQuadrasOrMore?: number;
  games: Game[];
}

export type FilterOption = 'all' | 'ternos' | 'duques' | 'any_hit';

export type UserStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  phone: string;
  password: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  approvedAt?: string;
  pixKey?: string;
}

