import React, { useEffect, useRef, useCallback } from 'react';
import { CharacterType, Platform, StarItem, CloudDecoration, Particle, PlayerState } from '../types/game';
import { soundEngine } from '../audio/soundEngine';

interface GameCanvasProps {
  playerCharacter: CharacterType;
  autoBounce: boolean;
  onStarUpdate: (collected: number, total: number) => void;
  onAltitudeUpdate: (altPercent: number, zoneName: string) => void;
  onWin: (timeSeconds: number, starsCollected: number) => void;
  isPaused: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  playerCharacter,
  autoBounce,
  onStarUpdate,
  onAltitudeUpdate,
  onWin,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onStarUpdateRef = useRef(onStarUpdate);
  const onAltitudeUpdateRef = useRef(onAltitudeUpdate);
  const onWinRef = useRef(onWin);
  const autoBounceRef = useRef(autoBounce);
  const isPausedRef = useRef(isPaused);
  const lastReportedAltRef = useRef(-1);
  const lastReportedZoneRef = useRef('');

  useEffect(() => {
    onStarUpdateRef.current = onStarUpdate;
    onAltitudeUpdateRef.current = onAltitudeUpdate;
    onWinRef.current = onWin;
    autoBounceRef.current = autoBounce;
    isPausedRef.current = isPaused;
  });

  const gameStateRef = useRef({
    status: 'playing' as 'playing' | 'won',
    startTime: Date.now(),
    elapsedTime: 0,
    cameraY: 0,
    targetCameraY: 0,
    starsCollected: 0,
    totalStars: 10,
    rescueTimer: 0,
    dialogText: '去找一二囉！🌟',
    dialogTimer: 180,
  });

  const keysRef = useRef({
    left: false,
    right: false,
    up: false,
  });

  const playerRef = useRef<PlayerState>({
    x: 178,
    y: 520,
    width: 44,
    height: 40,
    vx: 0,
    vy: 0,
    speed: 5.2,
    jumpPower: -13.2,
    doubleJumpPower: -12.4,
    canDoubleJump: true,
    hasDoubleJumped: false,
    remainingJumps: 2,
    maxJumps: 2,
    coyoteTimer: 10,
    jumpBufferTimer: 0,
    grounded: false,
    facing: 1,
    squash: 1,
    blinkTimer: 120,
    isBlinking: false,
    walkCycle: 0,
    isRescuing: false,
    rescueY: 520,
    sparkleTimer: 0,
    lastPlatformX: 178,
    lastPlatformY: 520,
  });

  const particlesRef = useRef<Particle[]>([]);
  const cloudsRef = useRef<CloudDecoration[]>([]);
  const platformsRef = useRef<Platform[]>([]);
  const starsRef = useRef<StarItem[]>([]);

  // Initialize level platforms and stars with wide overlapping platforms and comfortable 60px steps
  const initLevel = useCallback(() => {
    // Height ranges from ground (560) to summit moon cloud (-470)
    platformsRef.current = [
      { x: 0, y: 560, w: 400, h: 50, type: 'ground' },
      // Platform 1: Directly above start point!
      { x: 115, y: 490, w: 170, h: 18, type: 'normal' },
      // Platform 2: Comfortable left-center
      { x: 45, y: 430, w: 170, h: 18, type: 'normal' },
      // Platform 3: Spring pink cloud
      { x: 185, y: 370, w: 170, h: 20, type: 'spring' },
      // Platform 4: Moving cloud
      { x: 70, y: 310, w: 170, h: 18, type: 'moving', vx: 0.9, startX: 70, range: 45 },
      // Platform 5
      { x: 160, y: 250, w: 170, h: 18, type: 'normal' },
      // Platform 6: Spring pink cloud
      { x: 50, y: 190, w: 170, h: 20, type: 'spring' },
      // Platform 7: Moving cloud
      { x: 170, y: 130, w: 170, h: 18, type: 'moving', vx: -1.0, startX: 170, range: 45 },
      // Platform 8
      { x: 65, y: 70, w: 170, h: 18, type: 'normal' },
      // Platform 9
      { x: 165, y: 10, w: 170, h: 18, type: 'normal' },
      // Platform 10: Spring pink cloud
      { x: 55, y: -50, w: 170, h: 20, type: 'spring' },
      // Platform 11: Moving cloud
      { x: 175, y: -110, w: 170, h: 18, type: 'moving', vx: 0.9, startX: 175, range: 40 },
      // Platform 12
      { x: 65, y: -170, w: 170, h: 18, type: 'normal' },
      // Platform 13
      { x: 155, y: -230, w: 170, h: 18, type: 'normal' },
      // Platform 14: Spring pink cloud
      { x: 65, y: -290, w: 170, h: 20, type: 'spring' },
      // Platform 15: Moving cloud
      { x: 150, y: -350, w: 170, h: 18, type: 'moving', vx: -0.9, startX: 150, range: 40 },
      // Platform 16
      { x: 85, y: -410, w: 180, h: 18, type: 'normal' },
      // Summit moon sanctuary
      { x: 60, y: -475, w: 280, h: 32, type: 'goal' },
    ];

    starsRef.current = [
      { id: 1, x: 200, y: 455, collected: false, sparkleOffset: 0 },
      { id: 2, x: 130, y: 395, collected: false, sparkleOffset: 1.2 },
      { id: 3, x: 270, y: 335, collected: false, sparkleOffset: 2.4 },
      { id: 4, x: 155, y: 275, collected: false, sparkleOffset: 3.6 },
      { id: 5, x: 245, y: 215, collected: false, sparkleOffset: 4.8 },
      { id: 6, x: 135, y: 155, collected: false, sparkleOffset: 0.8 },
      { id: 7, x: 250, y: 95, collected: false, sparkleOffset: 2.1 },
      { id: 8, x: 150, y: 35, collected: false, sparkleOffset: 3.3 },
      { id: 9, x: 250, y: -25, collected: false, sparkleOffset: 4.2 },
      { id: 10, x: 150, y: -260, collected: false, sparkleOffset: 1.5 },
    ];

    cloudsRef.current = [
      { x: 20, y: 420, r: 24, speed: 0.2, alpha: 0.35 },
      { x: 310, y: 290, r: 32, speed: -0.25, alpha: 0.4 },
      { x: 40, y: 150, r: 28, speed: 0.18, alpha: 0.45 },
      { x: 260, y: -10, r: 35, speed: -0.22, alpha: 0.5 },
      { x: 50, y: -180, r: 30, speed: 0.28, alpha: 0.55 },
      { x: 280, y: -340, r: 34, speed: -0.2, alpha: 0.6 },
    ];

    particlesRef.current = [];
    gameStateRef.current.starsCollected = 0;
    gameStateRef.current.totalStars = starsRef.current.length;
    gameStateRef.current.status = 'playing';
    gameStateRef.current.startTime = Date.now();
    gameStateRef.current.dialogText = playerCharacter === 'bubu' ? '去找一二囉！🌟' : '去找布布囉！🌟';
    gameStateRef.current.dialogTimer = 180;

    const p = playerRef.current;
    p.x = 178;
    p.y = 520;
    p.vx = 0;
    p.vy = 0;
    p.grounded = true;
    p.hasDoubleJumped = false;
    p.remainingJumps = p.maxJumps;
    p.coyoteTimer = 10;
    p.jumpBufferTimer = 0;
    p.squash = 1;
    p.lastPlatformX = 178;
    p.lastPlatformY = 520;

    onStarUpdateRef.current(0, starsRef.current.length);
  }, [playerCharacter]);

  // Spawn star dust & trail particles
  const spawnSparkles = (x: number, y: number, count: number, color = '#ffeaa7') => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.8 + 0.8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 25 + 20),
        shape: Math.random() > 0.4 ? 'star' : 'sparkle',
      });
    }
  };

  const spawnJumpPuffs = (x: number, y: number, isDouble = false) => {
    const count = isDouble ? 8 : 5;
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: x + (Math.random() * 24 - 12),
        y: y + 36,
        vx: (Math.random() - 0.5) * 2.2,
        vy: isDouble ? (Math.random() * 1.5 + 0.5) : -Math.random() * 1.2,
        size: Math.random() * 6 + 3,
        color: isDouble ? '#ffeaa7' : '#ffffff',
        alpha: 0.8,
        life: 0,
        maxLife: 22,
        shape: isDouble && Math.random() > 0.5 ? 'sparkle' : 'circle',
      });
    }
  };

  // Execute jump with multi-jump capacity
  const triggerJumpAction = () => {
    const p = playerRef.current;
    if (p.isRescuing) return false;

    // Normal jump (on ground or during coyote time)
    if (p.grounded || p.coyoteTimer > 0) {
      p.vy = p.jumpPower;
      p.grounded = false;
      p.coyoteTimer = 0;
      p.remainingJumps = p.maxJumps - 1;
      p.squash = 1.35;
      soundEngine.playJump();
      spawnJumpPuffs(p.x + 22, p.y, false);
      return true;
    }

    // Mid-air jump (double / triple jump!)
    if (p.remainingJumps > 0) {
      p.remainingJumps--;
      p.vy = p.doubleJumpPower;
      p.squash = 1.4;
      soundEngine.playDoubleJump();
      spawnJumpPuffs(p.x + 22, p.y, true);
      spawnSparkles(p.x + 22, p.y + 36, 6, '#ffd166');

      gameStateRef.current.dialogText = '起跳！✨';
      gameStateRef.current.dialogTimer = 60;
      return true;
    }

    return false;
  };

  // Trigger gentle rescue when falling off bottom
  const triggerRescue = () => {
    const p = playerRef.current;
    if (p.isRescuing) return;
    p.isRescuing = true;
    soundEngine.playRescue();

    gameStateRef.current.dialogText = '天使雲接住你囉！☁️';
    gameStateRef.current.dialogTimer = 140;

    // Return safely to latest checkpoint platform
    p.x = p.lastPlatformX || 178;
    p.y = p.lastPlatformY || 520;
    p.vx = 0;
    p.vy = 0;
    p.grounded = true;
    p.hasDoubleJumped = false;
    p.remainingJumps = p.maxJumps;
    p.coyoteTimer = 10;
    p.squash = 1.25;

    spawnSparkles(p.x + 22, p.y + 20, 14, '#ffeaa7');

    setTimeout(() => {
      p.isRescuing = false;
    }, 450);
  };

  // Keyboard and touch events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      soundEngine.init();
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        keysRef.current.left = true;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        keysRef.current.right = true;
      }
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        triggerJumpAction();
        keysRef.current.up = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.up = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Expose virtual touch actions
  useEffect(() => {
    const onTouchLeft = (pressed: boolean) => {
      soundEngine.init();
      keysRef.current.left = pressed;
    };
    const onTouchRight = (pressed: boolean) => {
      soundEngine.init();
      keysRef.current.right = pressed;
    };
    const onTouchJump = () => {
      soundEngine.init();
      keysRef.current.up = true;
      triggerJumpAction();
    };
    const onTouchJumpEnd = () => {
      keysRef.current.up = false;
    };

    (window as unknown as { _bubuTouchLeft?: typeof onTouchLeft })._bubuTouchLeft = onTouchLeft;
    (window as unknown as { _bubuTouchRight?: typeof onTouchRight })._bubuTouchRight = onTouchRight;
    (window as unknown as { _bubuTouchJump?: typeof onTouchJump })._bubuTouchJump = onTouchJump;
    (window as unknown as { _bubuTouchJumpEnd?: typeof onTouchJumpEnd })._bubuTouchJumpEnd = onTouchJumpEnd;

    return () => {
      delete (window as unknown as { _bubuTouchLeft?: typeof onTouchLeft })._bubuTouchLeft;
      delete (window as unknown as { _bubuTouchRight?: typeof onTouchRight })._bubuTouchRight;
      delete (window as unknown as { _bubuTouchJump?: typeof onTouchJump })._bubuTouchJump;
      delete (window as unknown as { _bubuTouchJumpEnd?: typeof onTouchJumpEnd })._bubuTouchJumpEnd;
    };
  }, []);

  // Re-init when character changes
  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Main Canvas Render and Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // 繪製布布 (溫暖奶茶色小棕熊 - 參照原版貼圖造型)
    const drawBubu = (x: number, y: number, facing: number, squash: number, isBlinking: boolean, isMoving: boolean) => {
      ctx.save();
      ctx.translate(x + 22, y + 20);
      ctx.scale(facing, 1);
      ctx.scale(1 / squash, squash);

      const outlineColor = '#3a2217'; // 貼圖經典深黑棕色輪廓線
      const furColor = '#cda387'; // 軟萌奶茶暖棕色
      const blushColor = '#f6b876'; // 經典圓潤暖金橘腮紅
      const innerEarColor = '#b5856b';

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = outlineColor;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // 1. 小尾巴 (左後方圓球)
      ctx.fillStyle = furColor;
      ctx.beginPath();
      ctx.arc(-22, 10, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 2. 圓圓耳朵 (兩側頂角)
      // 左耳
      ctx.fillStyle = furColor;
      ctx.beginPath();
      ctx.arc(-15, -17, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 左耳內輪廓
      ctx.fillStyle = innerEarColor;
      ctx.beginPath();
      ctx.arc(-15, -17, 4, 0, Math.PI * 2);
      ctx.fill();

      // 右耳
      ctx.fillStyle = furColor;
      ctx.beginPath();
      ctx.arc(15, -17, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 右耳內輪廓
      ctx.fillStyle = innerEarColor;
      ctx.beginPath();
      ctx.arc(15, -17, 4, 0, Math.PI * 2);
      ctx.fill();

      // 3. 身體與圓滾滾大頭 (無縫圓潤穹形，無白色鼻子色塊)
      ctx.fillStyle = furColor;
      ctx.beginPath();
      ctx.roundRect(-22, -18, 44, 38, 19);
      ctx.fill();
      ctx.stroke();

      // 4. 小熊胖腳 (跑步踏步微動)
      const walkOffset = isMoving ? Math.sin(Date.now() * 0.018) * 3 : 0;
      ctx.fillStyle = furColor;
      // 左腳
      ctx.beginPath();
      ctx.ellipse(-10, 20 + walkOffset, 6, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 右腳
      ctx.beginPath();
      ctx.ellipse(10, 20 - walkOffset, 6, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 5. 布布標誌性大暖橘腮紅 (大而圓)
      ctx.fillStyle = blushColor;
      ctx.beginPath();
      ctx.arc(-14, 5, 5.8, 0, Math.PI * 2);
      ctx.arc(14, 5, 5.8, 0, Math.PI * 2);
      ctx.fill();

      // 6. 經典純粹圓豆豆眼 (無反光白點，純粹簡約)
      ctx.fillStyle = outlineColor;
      if (isBlinking) {
        ctx.beginPath();
        ctx.arc(-8, 0, 2.5, 0.2, Math.PI * 0.8);
        ctx.arc(8, 0, 2.5, 0.2, Math.PI * 0.8);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(-8, 0, 2.6, 0, Math.PI * 2);
        ctx.arc(8, 0, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. 軟萌貓咪小嘴 (經典 :3 嘴形)
      ctx.beginPath();
      ctx.arc(-2.2, 4.2, 2.3, 0.1, Math.PI * 0.95);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.2, 4.2, 2.3, 0.05, Math.PI * 0.9);
      ctx.stroke();

      ctx.restore();
    };

    // 繪製一二 (純白無黑眼圈小熊貓 - 參照原版貼圖造型)
    const drawYier = (x: number, y: number, facing = 1, squash = 1, isBlinking = false, isWaving = false) => {
      ctx.save();
      ctx.translate(x + 22, y + 20);
      ctx.scale(facing, 1);
      ctx.scale(1 / squash, squash);

      const outlineColor = '#3a2217'; // 貼圖經典深黑棕色輪廓線
      const earColor = '#2c1c14'; // 標誌性純黑深棕圓耳朵
      const blushColor = '#f99fad'; // 標誌性粉嫩西瓜粉腮紅

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = outlineColor;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // 1. 純黑小尾巴 (左後方)
      ctx.fillStyle = earColor;
      ctx.beginPath();
      ctx.arc(-22, 10, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 2. 純黑圓圓耳朵 (兩側頂角)
      ctx.fillStyle = earColor;
      ctx.beginPath();
      ctx.arc(-15, -17, 7.5, 0, Math.PI * 2);
      ctx.arc(15, -17, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 3. 純白圓胖頭身 (無大黑眼圈，滿滿牛奶白)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-22, -18, 44, 38, 19);
      ctx.fill();
      ctx.stroke();

      // 4. 白色小胖腳
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-10, 20, 6, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(10, 20, 6, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 5. 一二標誌性粉嫩大腮紅 (大而圓)
      ctx.fillStyle = blushColor;
      ctx.beginPath();
      ctx.arc(-14, 5, 5.8, 0, Math.PI * 2);
      ctx.arc(14, 5, 5.8, 0, Math.PI * 2);
      ctx.fill();

      // 6. 經典純粹圓豆豆眼 (白臉上的純黑小圓點)
      ctx.fillStyle = outlineColor;
      if (isBlinking) {
        ctx.beginPath();
        ctx.arc(-8, 0, 2.5, 0.2, Math.PI * 0.8);
        ctx.arc(8, 0, 2.5, 0.2, Math.PI * 0.8);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(-8, 0, 2.6, 0, Math.PI * 2);
        ctx.arc(8, 0, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. 開心吐舌小嘴 (貼圖招牌張嘴吐舌表情)
      ctx.fillStyle = '#ef5767';
      ctx.beginPath();
      ctx.arc(0, 3.5, 3.8, 0.1, Math.PI * 0.9);
      ctx.fill();
      ctx.stroke();
      // 舌頭亮粉色小弧度
      ctx.fillStyle = '#ffa4b0';
      ctx.beginPath();
      ctx.arc(0, 5.2, 2.3, 0, Math.PI);
      ctx.fill();

      // 8. 頂峰守候揮舞的小白爪
      if (isWaving) {
        const waveAngle = Math.sin(Date.now() * 0.008) * 0.35 - 0.4;
        ctx.save();
        ctx.translate(18, 0);
        ctx.rotate(waveAngle);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, -6, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    };

    // Draw glowing star
    const drawStar = (x: number, y: number, time: number, offset: number) => {
      const bob = Math.sin(time * 0.004 + offset) * 5;
      const pulse = 1 + Math.sin(time * 0.006 + offset) * 0.08;

      ctx.save();
      ctx.translate(x, y + bob);
      ctx.scale(pulse, pulse);

      ctx.shadowColor = '#fdcb6e';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffeaa7';

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * 0.01745) * 12, -Math.sin((18 + i * 72) * 0.01745) * 12);
        ctx.lineTo(Math.cos((54 + i * 72) * 0.01745) * 5.5, -Math.sin((54 + i * 72) * 0.01745) * 5.5);
      }
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(1, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawBackground = (camY: number) => {
      const progress = Math.max(0, Math.min(1, (520 - camY) / 1000));
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);

      if (progress < 0.35) {
        grad.addColorStop(0, '#ffeaa7');
        grad.addColorStop(0.5, '#fab1a0');
        grad.addColorStop(1, '#dfe6e9');
      } else if (progress < 0.7) {
        grad.addColorStop(0, '#74b9ff');
        grad.addColorStop(0.5, '#fab1a0');
        grad.addColorStop(1, '#fdcb6e');
      } else {
        grad.addColorStop(0, '#1e272e');
        grad.addColorStop(0.4, '#2d3436');
        grad.addColorStop(0.8, '#485460');
        grad.addColorStop(1, '#a4b0be');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (progress > 0.25) {
        const starAlpha = Math.min(1, (progress - 0.25) * 1.6);
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha * 0.85})`;
        for (let i = 0; i < 32; i++) {
          const sx = (i * 97 + 23) % canvas.width;
          const sy = (i * 71 + 17) % canvas.height;
          const twinkle = Math.sin(Date.now() * 0.003 + i) * 0.4 + 0.6;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.2 * twinkle, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    // Main Game Loop
    const update = (time: number) => {
      const p = playerRef.current;
      const keys = keysRef.current;
      const game = gameStateRef.current;

      if (!isPausedRef.current && game.status === 'playing') {
        // Horizontal movement
        const isMoving = keys.left || keys.right;
        if (keys.left) {
          p.vx = -p.speed;
          p.facing = -1;
        } else if (keys.right) {
          p.vx = p.speed;
          p.facing = 1;
        } else {
          p.vx *= 0.76;
        }

        // Apply gentle physics
        p.vy += 0.42;
        p.x += p.vx;
        p.y += p.vy;

        // Continuous jump while holding jump key
        if (!autoBounceRef.current && keys.up && p.grounded) {
          triggerJumpAction();
        }

        // Squash bounce restoration
        p.squash += (1 - p.squash) * 0.14;

        // Wrap around left/right screen borders
        if (p.x < -24) p.x = canvas.width - 20;
        if (p.x > canvas.width - 20) p.x = -24;

        // Update moving platforms
        platformsRef.current.forEach(plat => {
          if (plat.type === 'moving' && plat.vx && plat.startX !== undefined && plat.range !== undefined) {
            plat.x += plat.vx;
            if (plat.x > plat.startX + plat.range || plat.x < plat.startX - plat.range) {
              plat.vx *= -1;
            }
          }
        });

        // Robust One-Way Platform Collision
        p.grounded = false;
        for (const plat of platformsRef.current) {
          const playerLeft = p.x + 8;
          const playerRight = p.x + p.width - 8;
          const platLeft = plat.x;
          const platRight = plat.x + plat.w;

          if (playerRight > platLeft && playerLeft < platRight) {
            const playerFeet = p.y + p.height;
            const threshold = Math.max(16, p.vy + 8);
            if (p.vy >= 0 && playerFeet >= plat.y && playerFeet <= plat.y + threshold) {
              p.y = plat.y - p.height;
              p.grounded = true;
              p.remainingJumps = p.maxJumps;
              p.coyoteTimer = 10;

              // Checkpoint
              p.lastPlatformX = Math.max(20, Math.min(canvas.width - 64, plat.x + plat.w / 2 - 22));
              p.lastPlatformY = plat.y - p.height;

              if (plat.type === 'spring') {
                p.vy = -16.5; // High pink spring bounce
                p.squash = 1.5;
                p.grounded = false;
                soundEngine.playSpringBounce();
                spawnSparkles(plat.x + plat.w / 2, plat.y, 10, '#ff9ff3');
              } else if (autoBounceRef.current || keysRef.current.up) {
                // Auto-Bounce mode or holding jump: immediately bounce on landing!
                p.vy = p.jumpPower;
                p.squash = 1.35;
                p.grounded = false;
                soundEngine.playJump();
                spawnJumpPuffs(p.x + 22, p.y, false);
              } else {
                p.vy = 0;
              }
              break;
            }
          }
        }

        // Falling rescue check (gentle cloud catch)
        if (p.y > game.cameraY + canvas.height + 40) {
          triggerRescue();
        }

        // Star collection
        starsRef.current.forEach(star => {
          if (!star.collected) {
            const dx = p.x + 22 - star.x;
            const dy = p.y + 20 - star.y;
            if (Math.hypot(dx, dy) < 36) {
              star.collected = true;
              game.starsCollected++;
              soundEngine.playStar(game.starsCollected);
              spawnSparkles(star.x, star.y, 14, '#ffeaa7');
              onStarUpdateRef.current(game.starsCollected, starsRef.current.length);

              const encouragement = ['好棒喔！⭐', '抓住星星了！✨', '一二在等我呢～', '摘下最亮的星！', '真厲害～🌟'];
              game.dialogText = encouragement[game.starsCollected % encouragement.length];
              game.dialogTimer = 110;
            }
          }
        });

        // Blinking
        p.blinkTimer--;
        if (p.blinkTimer <= 0) {
          p.isBlinking = true;
          if (p.blinkTimer <= -8) {
            p.isBlinking = false;
            p.blinkTimer = Math.floor(Math.random() * 160 + 100);
          }
        }

        // Trail sparkles
        p.sparkleTimer++;
        if (Math.abs(p.vy) > 5 && p.sparkleTimer % 4 === 0) {
          particlesRef.current.push({
            x: p.x + 22 + (Math.random() * 10 - 5),
            y: p.y + 26,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -0.5,
            size: Math.random() * 3.5 + 2,
            color: '#ffeaa7',
            alpha: 0.8,
            life: 0,
            maxLife: 20,
            shape: 'sparkle',
          });
        }

        // Win condition: reaching the summit platform
        const goal = platformsRef.current.find(pl => pl.type === 'goal');
        if (
          goal &&
          p.y <= goal.y + 6 &&
          p.x > goal.x - 20 &&
          p.x < goal.x + goal.w + 10 &&
          game.status === 'playing'
        ) {
          game.status = 'won';
          p.vx = 0;
          soundEngine.playWin();
          spawnSparkles(200, -500, 45, '#ffeaa7');
          const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
          onWinRef.current(elapsed, game.starsCollected);
        }

        // Altitude & Zone calculations (Ground 520, Moon -475, span ~995px)
        const altPercent = Math.max(0, Math.min(100, Math.floor(((520 - p.y) / 995) * 100)));
        let zone = '🌸 晨曦草地';
        if (altPercent > 75) zone = '🌙 星夜月境';
        else if (altPercent > 50) zone = '🌆 霞光天際';
        else if (altPercent > 25) zone = '⛅ 暖陽雲海';

        if (altPercent !== lastReportedAltRef.current || zone !== lastReportedZoneRef.current) {
          lastReportedAltRef.current = altPercent;
          lastReportedZoneRef.current = zone;
          onAltitudeUpdateRef.current(altPercent, zone);
        }
      }

      // Camera lerp
      const targetCam = p.y - 360;
      game.cameraY += (targetCam - game.cameraY) * 0.08;

      // Update ambient clouds
      cloudsRef.current.forEach(c => {
        c.x += c.speed;
        if (c.x > canvas.width + 50) c.x = -50;
        if (c.x < -50) c.x = canvas.width + 50;
      });

      // Update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
        pt.alpha = 1 - pt.life / pt.maxLife;
        if (pt.life >= pt.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      if (game.dialogTimer > 0) {
        game.dialogTimer--;
      }

      // ================= RENDER =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(game.cameraY);

      ctx.save();
      ctx.translate(0, -game.cameraY);

      // Render Ambient Clouds
      cloudsRef.current.forEach(c => {
        ctx.fillStyle = `rgba(255, 255, 255, ${c.alpha})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 0.7, c.y - c.r * 0.3, c.r * 1.1, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 1.4, c.y, c.r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Platforms
      platformsRef.current.forEach(plat => {
        if (plat.type === 'ground') {
          ctx.fillStyle = '#81c784';
          ctx.beginPath();
          ctx.roundRect(plat.x, plat.y, plat.w, plat.h, [16, 16, 0, 0]);
          ctx.fill();

          ctx.fillStyle = '#a5d6a7';
          for (let gx = 15; gx < plat.w; gx += 35) {
            ctx.beginPath();
            ctx.arc(plat.x + gx, plat.y + 4, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (plat.type === 'goal') {
          // Summit moon platform
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 16);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Glowing Crescent Moon
          ctx.fillStyle = '#fce075';
          ctx.shadowColor = '#f9ca24';
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.arc(280, -530, 44, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#1e272e';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(266, -540, 42, 0, Math.PI * 2);
          ctx.fill();
        } else if (plat.type === 'spring') {
          // Pink spring cloud
          ctx.fillStyle = '#ffb8b8';
          ctx.shadowColor = 'rgba(255, 184, 184, 0.6)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 10);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(plat.x + 8, plat.y + 3, plat.w - 16, 4, 2);
          ctx.fill();
        } else {
          // Wooden plank
          ctx.fillStyle = '#d7a15c';
          ctx.beginPath();
          ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 9);
          ctx.fill();

          ctx.fillStyle = '#be8543';
          ctx.fillRect(plat.x + 4, plat.y + plat.h - 4, plat.w - 8, 3);
        }
      });

      // Render partner waiting at the summit
      if (playerCharacter === 'bubu') {
        drawYier(200, -500, -1, 1, false, true);
      } else {
        drawBubu(200, -500, -1, 1, false, false);
      }

      // Floating heart near partner
      const heartY = -520 + Math.sin(Date.now() * 0.005) * 4;
      ctx.fillStyle = '#ff7675';
      ctx.font = '16px Arial';
      ctx.fillText('❤️', 235, heartY);

      // Render Stars
      starsRef.current.forEach(star => {
        if (!star.collected) {
          drawStar(star.x, star.y, time, star.sparkleOffset);
        }
      });

      // Render Particles
      particlesRef.current.forEach(pt => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        if (pt.shape === 'star') {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(pt.x + Math.cos((18 + i * 72) * 0.01745) * pt.size, pt.y - Math.sin((18 + i * 72) * 0.01745) * pt.size);
            ctx.lineTo(pt.x + Math.cos((54 + i * 72) * 0.01745) * (pt.size / 2), pt.y - Math.sin((54 + i * 72) * 0.01745) * (pt.size / 2));
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Render Player Character
      const isPlayerMoving = Math.abs(p.vx) > 0.5;
      if (playerCharacter === 'bubu') {
        drawBubu(p.x, p.y, p.facing, p.squash, p.isBlinking, isPlayerMoving);
      } else {
        drawYier(p.x, p.y, p.facing, p.squash, p.isBlinking, false);
      }

      // Speech bubble
      if (game.dialogTimer > 0) {
        ctx.save();
        const bubbleX = p.x + 22;
        const bubbleY = p.y - 24;
        ctx.font = 'bold 12px "M PLUS Rounded 1c", sans-serif';
        const textWidth = ctx.measureText(game.dialogText).width;
        const bWidth = textWidth + 18;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(bubbleX - bWidth / 2, bubbleY - 14, bWidth, 24, 12);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo(bubbleX - 4, bubbleY + 10);
        ctx.lineTo(bubbleX, bubbleY + 16);
        ctx.lineTo(bubbleX + 4, bubbleY + 10);
        ctx.fill();

        ctx.fillStyle = '#5c4033';
        ctx.textAlign = 'center';
        ctx.fillText(game.dialogText, bubbleX, bubbleY + 2);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [playerCharacter]);

  return (
    <div className="relative w-full max-w-[420px] aspect-[2/3] max-h-[80vh] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-slate-900/10 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        className="w-full h-full block object-contain"
      />
    </div>
  );
};
