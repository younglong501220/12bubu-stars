import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

export const TouchControls: React.FC = () => {
  const [activeLeft, setActiveLeft] = useState(false);
  const [activeRight, setActiveRight] = useState(false);
  const [activeJump, setActiveJump] = useState(false);

  const handleLeftDown = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setActiveLeft(true);
    const fn = (window as unknown as { _bubuTouchLeft?: (v: boolean) => void })._bubuTouchLeft;
    if (fn) fn(true);
  };

  const handleLeftUp = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setActiveLeft(false);
    const fn = (window as unknown as { _bubuTouchLeft?: (v: boolean) => void })._bubuTouchLeft;
    if (fn) fn(false);
  };

  const handleRightDown = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setActiveRight(true);
    const fn = (window as unknown as { _bubuTouchRight?: (v: boolean) => void })._bubuTouchRight;
    if (fn) fn(true);
  };

  const handleRightUp = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setActiveRight(false);
    const fn = (window as unknown as { _bubuTouchRight?: (v: boolean) => void })._bubuTouchRight;
    if (fn) fn(false);
  };

  const handleJumpDown = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setActiveJump(true);
    const fn = (window as unknown as { _bubuTouchJump?: () => void })._bubuTouchJump;
    if (fn) fn();
  };

  const handleJumpUp = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setActiveJump(false);
    const fn = (window as unknown as { _bubuTouchJumpEnd?: () => void })._bubuTouchJumpEnd;
    if (fn) fn();
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 mt-3 flex items-center justify-between pointer-events-auto select-none touch-none">
      {/* Left / Right D-Pad Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onTouchStart={handleLeftDown}
          onTouchEnd={handleLeftUp}
          onTouchCancel={handleLeftUp}
          onMouseDown={handleLeftDown}
          onMouseUp={handleLeftUp}
          onMouseLeave={handleLeftUp}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shadow-md border-2 border-white/90 backdrop-blur-md transition-all active:scale-90 ${
            activeLeft ? 'bg-amber-200/90 text-amber-900 shadow-inner' : 'bg-white/80 text-[#634b35] hover:bg-white'
          }`}
          aria-label="向左移動"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onTouchStart={handleRightDown}
          onTouchEnd={handleRightUp}
          onTouchCancel={handleRightUp}
          onMouseDown={handleRightDown}
          onMouseUp={handleRightUp}
          onMouseLeave={handleRightUp}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shadow-md border-2 border-white/90 backdrop-blur-md transition-all active:scale-90 ${
            activeRight ? 'bg-amber-200/90 text-amber-900 shadow-inner' : 'bg-white/80 text-[#634b35] hover:bg-white'
          }`}
          aria-label="向右移動"
        >
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Jump Button */}
      <button
        type="button"
        onTouchStart={handleJumpDown}
        onTouchEnd={handleJumpUp}
        onTouchCancel={handleJumpUp}
        onMouseDown={handleJumpDown}
        onMouseUp={handleJumpUp}
        onMouseLeave={handleJumpUp}
        className={`px-5 h-14 rounded-2xl flex items-center gap-2 font-bold shadow-md border-2 border-white/90 backdrop-blur-md transition-all active:scale-90 ${
          activeJump
            ? 'bg-amber-300 text-amber-950 shadow-inner scale-95'
            : 'bg-amber-100/90 text-[#634b35] hover:bg-amber-100'
        }`}
        aria-label="跳躍（支援二段跳）"
      >
        <ArrowUp className="w-6 h-6 stroke-[3]" />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-base tracking-wider font-semibold">跳躍</span>
          <span className="text-[10px] text-amber-800/80 font-normal">可二段跳</span>
        </div>
      </button>
    </div>
  );
};
