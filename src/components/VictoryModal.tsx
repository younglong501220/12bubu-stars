import React, { useState } from 'react';
import { Star, Clock, Heart, RotateCcw, Share2, Check, Sparkles } from 'lucide-react';
import { CharacterType } from '../types/game';

interface VictoryModalProps {
  playerCharacter: CharacterType;
  starsCollected: number;
  totalStars: number;
  elapsedSeconds: number;
  onPlayAgain: () => void;
  onSwitchCharacter: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  playerCharacter,
  starsCollected,
  totalStars,
  elapsedSeconds,
  onPlayAgain,
  onSwitchCharacter,
}) => {
  const [copied, setCopied] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleCopyBlessing = () => {
    const text = `🌟 我在《一二布布：摘星大冒險》耗時 ${formatTime(elapsedSeconds)} 收集了 ${starsCollected}/${totalStars} 顆星星！\n布布與一二在星空月亮上相聚囉，祝你今天也元氣滿滿、天天開心！❤️✨`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  const protagonistName = playerCharacter === 'bubu' ? '布布' : '一二';
  const partnerName = playerCharacter === 'bubu' ? '一二' : '布布';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#fffbf4] to-[#fff3e0] rounded-3xl p-6 shadow-2xl border-4 border-amber-200/80 text-center text-[#5c4033] overflow-hidden">
        {/* Floating background star aura */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-pink-200/40 rounded-full blur-xl pointer-events-none" />

        {/* Mascot hug badge */}
        <div className="inline-flex items-center justify-center gap-1 px-4 py-1.5 mb-2 bg-amber-100/90 rounded-full text-xs font-bold text-amber-900 border border-amber-300/60 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>圓滿通關 · 甜蜜重逢</span>
        </div>

        {/* Animated Cute Characters Duo - 參照原版貼圖 */}
        <div className="my-3 flex items-center justify-center gap-3 py-2">
          {/* Bubu (奶茶色小棕熊) */}
          <div className="relative flex flex-col items-center animate-bounce duration-1000">
            <div className="w-14 h-12 bg-[#cda387] rounded-2xl relative shadow-md flex items-center justify-center border-2 border-[#3a2217]">
              {/* Ears */}
              <div className="absolute -top-2 -left-1.5 w-4 h-4 bg-[#cda387] rounded-full border-2 border-[#3a2217] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#b5856b] rounded-full" />
              </div>
              <div className="absolute -top-2 -right-1.5 w-4 h-4 bg-[#cda387] rounded-full border-2 border-[#3a2217] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#b5856b] rounded-full" />
              </div>
              {/* Peach Blush Circles */}
              <div className="absolute bottom-2 left-1 w-3 h-3 bg-[#f6b876] rounded-full" />
              <div className="absolute bottom-2 right-1 w-3 h-3 bg-[#f6b876] rounded-full" />
              {/* Two simple dot eyes */}
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 bg-[#3a2217] rounded-full" />
                <div className="w-1.5 h-1.5 bg-[#3a2217] rounded-full" />
              </div>
              {/* Cute mouth */}
              <div className="absolute bottom-2.5 text-[9px] font-bold text-[#3a2217] leading-none">ω</div>
            </div>
            <span className="text-[11px] font-bold text-amber-900 mt-1">布布</span>
          </div>

          {/* Central Heart Star */}
          <div className="flex flex-col items-center">
            <Heart className="w-7 h-7 text-pink-500 fill-pink-400 animate-pulse" />
            <span className="text-[10px] text-pink-600 font-bold mt-0.5">最喜歡你！</span>
          </div>

          {/* Yier / Dudu (純白無黑眼圈小熊貓) */}
          <div className="relative flex flex-col items-center animate-bounce duration-1000 delay-150">
            <div className="w-14 h-12 bg-white rounded-2xl relative shadow-md flex items-center justify-center border-2 border-[#3a2217]">
              {/* Solid dark ears */}
              <div className="absolute -top-2 -left-1.5 w-4 h-4 bg-[#2c1c14] rounded-full border-2 border-[#3a2217]" />
              <div className="absolute -top-2 -right-1.5 w-4 h-4 bg-[#2c1c14] rounded-full border-2 border-[#3a2217]" />
              {/* Watermelon Pink Blush Circles */}
              <div className="absolute bottom-2 left-1 w-3 h-3 bg-[#f99fad] rounded-full" />
              <div className="absolute bottom-2 right-1 w-3 h-3 bg-[#f99fad] rounded-full" />
              {/* Two simple dot eyes */}
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 bg-[#3a2217] rounded-full" />
                <div className="w-1.5 h-1.5 bg-[#3a2217] rounded-full" />
              </div>
              {/* Open smile with tongue */}
              <div className="absolute bottom-2 w-2.5 h-2 bg-[#ef5767] rounded-b-full border border-[#3a2217] flex items-center justify-center">
                <div className="w-1.5 h-1 bg-[#ffa4b0] rounded-b-full" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1">一二</span>
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-[#5c4033] tracking-tight">
          摘星成功啦！🌟
        </h3>

        <p className="text-xs text-[#7e6252] mt-1.5 px-4 leading-relaxed font-medium">
          {protagonistName} 跨越了漫漫雲海，把最明亮的星星都親手送給了 {partnerName}！
        </p>

        {/* Stats card */}
        <div className="grid grid-cols-2 gap-3 my-4 bg-white/70 p-3 rounded-2xl border border-amber-200/60 shadow-sm">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50/80">
            <div className="flex items-center gap-1 text-xs text-amber-800 font-bold mb-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>收集星星</span>
            </div>
            <span className="text-lg font-extrabold text-amber-900 tabular-nums">
              {starsCollected} / {totalStars}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50/80">
            <div className="flex items-center gap-1 text-xs text-amber-800 font-bold mb-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>通關時間</span>
            </div>
            <span className="text-lg font-extrabold text-amber-900 tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>再玩一次</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchCharacter}
              className="flex-1 py-2.5 px-3 bg-white/90 hover:bg-white text-[#634b35] font-semibold text-xs rounded-xl border border-amber-200 shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <span>換由 {partnerName} 當主角</span>
            </button>

            <button
              onClick={handleCopyBlessing}
              className="py-2.5 px-3 bg-white/90 hover:bg-white text-[#634b35] font-semibold text-xs rounded-xl border border-amber-200 shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
              title="複製祝福成就"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? '已複製！' : '分享'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
