import React, { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { TouchControls } from './components/TouchControls';
import { VictoryModal } from './components/VictoryModal';
import { HelpModal } from './components/HelpModal';
import { CharacterType } from './types/game';
import { soundEngine } from './audio/soundEngine';
import { Star, Volume2, VolumeX, Music, RotateCcw, HelpCircle, UserCheck } from 'lucide-react';

export default function App() {
  const [playerCharacter, setPlayerCharacter] = useState<CharacterType>('bubu');
  const [starsCollected, setStarsCollected] = useState(0);
  const [totalStars, setTotalStars] = useState(9);
  const [altitude, setAltitude] = useState(0);
  const [zoneName, setZoneName] = useState('🌸 晨曦草地');
  const [isWon, setIsWon] = useState(false);
  const [winTime, setWinTime] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(false);
  const [autoBounce, setAutoBounce] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  // Initialize sound settings
  const toggleMute = () => {
    soundEngine.init();
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMute(next);
  };

  const toggleBgm = () => {
    soundEngine.init();
    const active = soundEngine.toggleBgm();
    setIsBgmActive(active);
  };

  const handleStarUpdate = React.useCallback((collected: number, total: number) => {
    setStarsCollected(collected);
    setTotalStars(total);
  }, []);

  const handleAltitudeUpdate = React.useCallback((altPercent: number, zone: string) => {
    setAltitude(altPercent);
    setZoneName(zone);
  }, []);

  const handleWin = React.useCallback((timeSeconds: number) => {
    setWinTime(timeSeconds);
    setIsWon(true);
  }, []);

  const handleRestart = () => {
    setIsWon(false);
    setGameKey(prev => prev + 1);
  };

  const handleSwitchCharacter = () => {
    setPlayerCharacter(prev => (prev === 'bubu' ? 'yier' : 'bubu'));
    handleRestart();
  };

  // Keyboard shortcut for restart or music
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        if (!isHelpOpen) handleRestart();
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isHelpOpen, isMuted]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fdf8f0] text-[#5c4033] relative overflow-x-hidden font-sans">
      {/* Background Soft Pastel Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-gradient-to-b from-amber-100/40 via-pink-100/20 to-transparent pointer-events-none -z-10" />

      {/* Top Bar (Strict 3-Zone Contract) */}
      <header className="w-full max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between border-b border-[#eedecb] shrink-0">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#5c4033] whitespace-nowrap">
            一二布布 · 摘星大冒險
          </span>
        </div>

        {/* Zone 2: Informational Telemetry / Altitude */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-[#7c6355]">
          <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-xl border border-amber-200/60 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="font-bold text-amber-900 tabular-nums">
              {starsCollected} / {totalStars}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-xl border border-amber-200/60 shadow-xs">
            <span className="text-[11px]">{zoneName}</span>
            <span className="text-[10px] text-amber-700 font-bold tabular-nums">({altitude}%)</span>
          </div>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Auto-Bounce Toggle */}
          <button
            onClick={() => setAutoBounce(prev => !prev)}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border shadow-xs flex items-center gap-1 transition-all whitespace-nowrap ${
              autoBounce
                ? 'bg-amber-300 text-amber-950 border-amber-400 font-bold scale-102'
                : 'bg-white/80 hover:bg-white text-slate-700 border-amber-200'
            }`}
            title="開啟/關閉自動彈跳模式（落地自動彈起，如Doodle Jump）"
          >
            <span>🦘</span>
            <span>{autoBounce ? '自動彈跳: 開' : '自動彈跳: 關'}</span>
          </button>

          {/* Character Switcher Button */}
          <button
            onClick={handleSwitchCharacter}
            className="px-2.5 py-1.5 bg-white/80 hover:bg-white text-xs font-semibold rounded-xl border border-amber-200 shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
            title="更換主角"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">主角:</span>
            <span className="font-bold text-amber-900">{playerCharacter === 'bubu' ? '布布 🐻' : '一二 🐼'}</span>
          </button>

          {/* BGM Toggle */}
          <button
            onClick={toggleBgm}
            className={`p-1.5 rounded-xl border transition-colors shadow-xs ${
              isBgmActive
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white/80 hover:bg-white text-slate-500 border-amber-200'
            }`}
            title={isBgmActive ? '關閉八音盒BGM' : '播放溫馨八音盒BGM'}
            aria-label="背景音樂開關"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="p-1.5 bg-white/80 hover:bg-white text-slate-600 rounded-xl border border-amber-200 shadow-xs transition-colors"
            title={isMuted ? '取消靜音' : '靜音'}
            aria-label="音效開關"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-1.5 bg-white/80 hover:bg-white text-slate-600 rounded-xl border border-amber-200 shadow-xs transition-colors"
            title="重新開始 (R)"
            aria-label="重設遊戲"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Help Modal */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-1.5 bg-white/80 hover:bg-white text-slate-600 rounded-xl border border-amber-200 shadow-xs transition-colors"
            title="遊戲指南"
            aria-label="幫助"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Top Sub-bar for Stars & Altitude */}
      <div className="sm:hidden w-full max-w-[420px] mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-[#7c6355]">
        <div className="flex items-center gap-1 font-bold text-amber-900">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>{starsCollected} / {totalStars}</span>
        </div>
        <div className="text-[11px] font-semibold text-amber-800">
          {zoneName} · {altitude}%
        </div>
      </div>

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-2xl mx-auto w-full">
        {/* Game Canvas Container */}
        <GameCanvas
          key={gameKey}
          playerCharacter={playerCharacter}
          autoBounce={autoBounce}
          onStarUpdate={handleStarUpdate}
          onAltitudeUpdate={handleAltitudeUpdate}
          onWin={handleWin}
          isPaused={isWon || isHelpOpen}
        />

        {/* Touch Controls for Mobile / Tablet */}
        <TouchControls />

        {/* Desktop Hint */}
        <div className="hidden sm:flex items-center gap-2 mt-3 text-xs text-[#8c7365] font-medium select-none bg-white/60 px-4 py-1.5 rounded-full border border-amber-200/50 shadow-xs">
          <span>🎮 操作：[A/D] 或 [←/→] 移動</span>
          <span>·</span>
          <span className="font-bold text-amber-900">✨ [空白鍵/W/↑] 跳躍（支援二段跳、長按連續跳）</span>
          <span>·</span>
          <span className="text-amber-800">💡 可開啟上方「自動彈跳」輕鬆遊玩</span>
        </div>
      </main>

      {/* Victory Celebration Modal */}
      {isWon && (
        <VictoryModal
          playerCharacter={playerCharacter}
          starsCollected={starsCollected}
          totalStars={totalStars}
          elapsedSeconds={winTime}
          onPlayAgain={handleRestart}
          onSwitchCharacter={handleSwitchCharacter}
        />
      )}

      {/* Instructions Modal */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
