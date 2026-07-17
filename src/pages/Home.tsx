import { useState, useEffect } from 'react';
import { useStore, t } from '../store/useStore';
import { menuData } from '../data/menuData';
import { Coffee, Search } from 'lucide-react'; // Placeholder icons instead of Phosphor for now since we have lucide

export default function HomePage() {
  const { lang, langCharLimit, setTab } = useStore();
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Recommendations can be dynamic, hardcode a few for now
  const recommends = [menuData[0], menuData[5], menuData[16]]; 

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideshowIndex(prev => (prev + 1) % recommends.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [recommends.length]);

  const currentRec = recommends[slideshowIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative">
      {/* Rising Bubbles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-t from-[#f7c36f] from-10% to-[#f7ffff] to-50% dark:from-[#132b1a] dark:to-[#211d1b]">
        <div className="absolute w-12 h-12 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[10%] -bottom-20 animate-rise" style={{ animationDelay: '0s', animationDuration: '7s' }}></div>
        <div className="absolute w-24 h-24 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[25%] -bottom-32 animate-rise" style={{ animationDelay: '2s', animationDuration: '9s' }}></div>
        <div className="absolute w-8 h-8 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[40%] -bottom-10 animate-rise" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>
        <div className="absolute w-16 h-16 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[60%] -bottom-24 animate-rise" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
        <div className="absolute w-20 h-20 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[80%] -bottom-28 animate-rise" style={{ animationDelay: '3s', animationDuration: '10s' }}></div>
        
        {/* Additional Bubbles */}
        <div className="absolute w-6 h-6 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[15%] -bottom-16 animate-rise" style={{ animationDelay: '1.5s', animationDuration: '5.5s' }}></div>
        <div className="absolute w-14 h-14 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[35%] -bottom-20 animate-rise" style={{ animationDelay: '0.5s', animationDuration: '8.5s' }}></div>
        <div className="absolute w-10 h-10 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[55%] -bottom-12 animate-rise" style={{ animationDelay: '3.5s', animationDuration: '6.5s' }}></div>
        <div className="absolute w-28 h-28 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[70%] -bottom-40 animate-rise" style={{ animationDelay: '2.5s', animationDuration: '11s' }}></div>
        <div className="absolute w-4 h-4 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[90%] -bottom-8 animate-rise" style={{ animationDelay: '0.8s', animationDuration: '5s' }}></div>
        <div className="absolute w-12 h-12 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[5%] -bottom-24 animate-rise" style={{ animationDelay: '4.2s', animationDuration: '7.8s' }}></div>
        <div className="absolute w-18 h-18 bg-[#FFF8DC] dark:bg-[#354d3c] rounded-full left-[50%] -bottom-30 animate-rise" style={{ animationDelay: '1.8s', animationDuration: '9.2s' }}></div>
      </div>

      <div className="animate-slide-up space-y-4 z-10 relative">
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light">
          {t(lang, 'greeting', langCharLimit)}
        </p>
        <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pastel-green-500 to-pastel-brown-400 text-gradient pb-2 leading-tight">
          Aurora<br/>Bread & Butter
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {t(lang, 'subGreeting', langCharLimit)}
        </p>
      </div>

      {/* Minimalist Slideshow */}
      <div 
        className="mt-8 w-full max-w-sm cursor-pointer group animate-fade-in" 
        onClick={() => setTab('menu')}
      >
        <p className="text-sm text-pastel-brown-500 mb-2 font-medium tracking-wider uppercase">
          {t(lang, 'recommend', langCharLimit)}
        </p>
        <div className="glass rounded-3xl p-6 shadow-sm group-hover:shadow-md transition-all duration-300 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 z-0"></div>
          <div className={`w-32 h-32 rounded-full ${currentRec.imgColor} shadow-inner flex items-center justify-center text-white/80 z-10 transform group-hover:scale-105 transition-transform duration-500 overflow-hidden`}>
            <img src={`/images/${currentRec.id}.jpg`} alt={currentRec.name.en} className="w-full h-full object-cover" />
          </div>
          <div className="z-10">
            <h3 className="text-xl font-semibold dark:text-white">{currentRec.name[lang]}</h3>
            <p className="text-pastel-green-500 font-bold mt-1">฿{currentRec.price}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setTab('menu')} 
        className="mt-4 px-8 py-4 bg-pastel-green-500 hover:bg-pastel-green-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-lg flex items-center gap-2 transform hover:-translate-y-1"
      >
        <Search size={24} />
        <span>{t(lang, 'orderNow', langCharLimit)}</span>
      </button>
    </div>
  );
}
