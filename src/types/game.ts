export type CharacterType = 'bubu' | 'yier';

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: 'ground' | 'normal' | 'cloud' | 'spring' | 'moving' | 'goal';
  vx?: number;
  startX?: number;
  range?: number;
  bounced?: boolean;
}

export interface StarItem {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  isSpecial?: boolean;
  value?: number;
  sparkleOffset: number;
}

export interface CloudDecoration {
  x: number;
  y: number;
  r: number;
  speed: number;
  alpha: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'star' | 'circle' | 'heart' | 'sparkle';
}

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  speed: number;
  jumpPower: number;
  doubleJumpPower: number;
  canDoubleJump: boolean;
  hasDoubleJumped: boolean;
  remainingJumps: number;
  maxJumps: number;
  coyoteTimer: number;
  jumpBufferTimer: number;
  grounded: boolean;
  facing: 1 | -1;
  squash: number;
  blinkTimer: number;
  isBlinking: boolean;
  walkCycle: number;
  isRescuing: boolean;
  rescueY: number;
  sparkleTimer: number;
  lastPlatformX: number;
  lastPlatformY: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won';
