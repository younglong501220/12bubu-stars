import React from 'react';
import { X, Sparkles, Shield, Heart } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#fffdf9] rounded-3xl p-6 shadow-2xl border-2 border-amber-200 text-[#5c4033] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-amber-100 transition-colors"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Sparkles className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#5c4033]">遊戲玩法與指南</h3>
            <p className="text-[11px] text-[#8c7365]">一二布布：摘星大冒險</p>
          </div>
        </div>

        {/* Operating instructions */}
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
            <h4 className="font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
              <span>🎮 操作方式</span>
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <p>• <strong>左右移動</strong>：鍵盤 <kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-200">A / D</kbd> 或 <kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-200">← / →</kbd> 方向鍵</p>
              <p>• <strong>輕巧跳躍</strong>：鍵盤 <kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-200">空白鍵</kbd>、<kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-200">W</kbd> 或 <kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-200">↑</kbd></p>
              <p>• ✨ <strong>軟綿綿二段跳</strong>：在半空中再次按下跳躍鍵，角色會吐出小雲朵二段起跳，任何平台都能輕鬆躍上！</p>
              <p>• <strong>手機/平板</strong>：螢幕下方自帶防誤觸虛擬觸控按鈕，連續點擊兩次跳躍即可觸發二段跳。</p>
              <p>• <strong>穿梭邊界</strong>：走出畫布左側會從右側出現，反之亦然！</p>
            </div>
          </div>

          <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-100">
            <h4 className="font-bold text-pink-900 mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-400" />
              <span>特別機關 & 治癒機制</span>
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <p>🌸 <strong>粉紅彈簧雲</strong>：踩上去會觸發超高彈力跳躍，伴隨可愛音效！</p>
              <p>☁️ <strong>微風橫移雲</strong>：在半空中緩慢漂移，抓準時機跳上它。</p>
              <p>🛡️ <strong>天使雲溫柔救援</strong>：如果不小心踩空跌落，會被柔軟的雲朵接住並送回最近踏上的平台（進度不重設！），完全不扣血、不懲罰，安心遊玩！</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
            <h4 className="font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>零外部依賴純原生合成</span>
            </h4>
            <p className="text-slate-600">
              所有布布與一二的毛茸茸表情、星星與雲海均由 HTML5 Canvas 即時動態繪製；跳躍、吃星、微風與八音盒背景音樂均由瀏覽器 Web Audio API 自動合成，純淨輕巧！
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
        >
          開始冒險囉！
        </button>
      </div>
    </div>
  );
};
