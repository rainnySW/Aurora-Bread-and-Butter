import { useState, useRef } from 'react';
import { useStore, t, CartItem } from '../store/useStore';
import { menuData, optionsConfig, MenuItem } from '../data/menuData';
import { Search, Plus, X } from 'lucide-react';

const categories = [
    { id: 'all', name: { th: 'ทั้งหมด', en: 'All' } },
    { id: 'milktea', name: { th: 'ชานม', en: 'Milk Tea' } },
    { id: 'cocoa', name: { th: 'โกโก้', en: 'Cocoa' } },
    { id: 'coffee', name: { th: 'กาแฟ', en: 'Coffee' } },
    { id: 'greentea', name: { th: 'ชาเขียว', en: 'Green Tea' } },
    { id: 'bakery', name: { th: 'เบเกอรี่', en: 'Bakery' } }
];

export default function MenuPage() {
    const { lang, langCharLimit, addToCart, cart, setTab } = useStore();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Modal state
    const [sweetness, setSweetness] = useState('sw100');
    const [sweetnessSlider, setSweetnessSlider] = useState(3);
    const [, setIsDragging] = useState(false);
    const animationRef = useRef<number>();
    const [ice, setIce] = useState('ic2');
    const [iceCubes, setIceCubes] = useState(0);
    const [toppings, setToppings] = useState<string[]>([]);
    
    let filteredMenu = menuData;
    if (filter !== 'all') {
        filteredMenu = filteredMenu.filter(item => item.cat === filter);
    }
    if (search.trim() !== '') {
        const query = search.toLowerCase();
        filteredMenu = filteredMenu.filter(item => 
            item.name.th.toLowerCase().includes(query) || 
            item.name.en.toLowerCase().includes(query)
        );
    }

    const openModal = (item: MenuItem) => {
        setSelectedItem(item);
        setSweetness('sw100');
        setSweetnessSlider(3);
        setIce('ic2');
        setIceCubes(0);
        setToppings([]);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const snapSlider = (currentSliderVal: number) => {
        setIsDragging(false);
        const target = Math.round(currentSliderVal);
        const startValue = currentSliderVal;
        const startTime = performance.now();
        const duration = 300; // ms for snap

        const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // ease-out cubic for buttery smooth finish
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (target - startValue) * easeProgress;
            
            setSweetnessSlider(current);
            setSweetness(optionsConfig.sweetness[Math.round(current)].id);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);
    };

    const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
        e.stopPropagation();
        const cartItem: CartItem = {
            id: Math.random().toString(36).substring(7),
            menuItem: item,
            qty: 1,
            price: item.price,
            ...(item.type === 'drink' && { sweetness: 'sw100', ice: 'ic2' })
        };
        addToCart(cartItem);
        if (cart.length === 0) {
            setTab('cart');
        }
    };

    const handleConfirmAdd = () => {
        if (!selectedItem) return;

        let finalPrice = selectedItem.price;
        if (selectedItem.type === 'drink') {
            toppings.forEach(tId => {
                const top = optionsConfig.toppings.find(o => o.id === tId);
                if (top) finalPrice += top.price;
            });
        }

        const cartItem: CartItem = {
            id: Math.random().toString(36).substring(7),
            menuItem: selectedItem,
            qty: 1,
            price: finalPrice,
            ...(selectedItem.type === 'drink' && { 
                sweetness, 
                ice, 
                iceCubes: ice === 'ic4' ? iceCubes : undefined,
                toppings 
            })
        };
        addToCart(cartItem);
        setSelectedItem(null);
        if (cart.length === 0) {
            setTab('cart');
        }
    };

    const toggleTopping = (id: string) => {
        setToppings(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    // Calculate dynamic price for the modal
    let currentPrice = selectedItem?.price || 0;
    if (selectedItem?.type === 'drink') {
        toppings.forEach(tId => {
            const top = optionsConfig.toppings.find(o => o.id === tId);
            if (top) currentPrice += top.price;
        });
    }

    return (
        <div className="flex flex-col h-full animate-fade-in pb-10">
            {/* Search & Filter Header */}
            <div className="sticky top-0 md:top-20 z-40 bg-[#f7ffff]/90 dark:bg-pastel-dark-bg/90 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 md:-mx-8 md:px-8">
                <div className="relative max-w-md mx-auto w-full mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder={t(lang, 'searchPlaceholder', langCharLimit, true)} 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-pastel-dark-card border-none rounded-full py-3 pl-12 pr-4 shadow-md focus:shadow-lg focus:ring-2 focus:ring-pastel-green-400 outline-none text-sm dark:text-white transition-shadow" 
                    />
                </div>
                
                <div className="flex overflow-x-auto hide-scrollbar gap-2 max-w-full pb-2">
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat.id ? 'bg-pastel-green-500 text-white shadow-md' : 'bg-white dark:bg-pastel-dark-card text-gray-600 dark:text-gray-300 hover:bg-pastel-green-100 dark:hover:bg-gray-700'}`}
                        >
                            {cat.name[lang as 'th'|'en']}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredMenu.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                    {filteredMenu.map(item => (
                        <div key={item.id} className="bg-white dark:bg-pastel-dark-card rounded-3xl p-3 flex md:flex-col items-center md:items-start gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer outline outline-[3px] outline-[#fce4bd] hover:outline-[#f7c36f] dark:outline-gray-600 dark:hover:outline-pastel-green-500/50 group">
                            {/* Horizontal fit on mobile */}
                            <div 
                                className="w-24 h-24 md:w-full md:h-40 rounded-2xl flex-shrink-0 bg-gray-100 flex items-center justify-center relative overflow-hidden shadow-inner"
                                onClick={() => openModal(item)}
                            >
                                <img src={`/images/${item.id}.jpg`} alt={item.name.en} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            
                            <div className="flex-grow flex flex-col justify-between w-full h-full py-1">
                                <div onClick={() => openModal(item)} className="w-full">
                                    <h4 className="font-medium text-base md:text-lg leading-tight line-clamp-2 dark:text-white">{item.name[lang as 'th'|'en']}</h4>
                                    <p className="text-pastel-green-500 font-semibold mt-1">฿{item.price}</p>
                                </div>
                                
                                <div className="flex justify-end w-full mt-2 md:mt-4">
                                    <button 
                                        onClick={(e) => handleQuickAdd(item, e)} 
                                        className="bg-pastel-green-100 dark:bg-pastel-green-500/20 text-pastel-green-500 hover:bg-pastel-green-500 hover:text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors shadow-sm hover:shadow-md" 
                                        title={t(lang, 'quickAdd', langCharLimit)}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-gray-400 mt-10">
                    <p>No items found.</p>
                </div>
            )}

            {/* Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-pastel-dark-bg rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto hide-scrollbar shadow-2xl animate-slide-up">
                        <div className="sticky top-0 bg-white/90 dark:bg-pastel-dark-bg/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 z-10">
                            <h3 className="text-lg font-bold dark:text-white">{selectedItem.name[lang as 'th'|'en']}</h3>
                            <button onClick={() => setSelectedItem(null)} className="p-2 bg-gray-100 dark:bg-pastel-dark-card rounded-full text-gray-500 hover:text-red-400">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6 pt-4">
                            {/* Order Image Preview */}
                            <div className="w-full h-48 rounded-2xl overflow-hidden relative shadow-md group">
                                <img src={`/images/${selectedItem.id}.jpg`} alt={selectedItem.name.en} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                            </div>

                            {selectedItem.type === 'drink' && (
                                <>
                                    {/* Sweetness */}
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <h4 className="font-semibold dark:text-gray-200">{t(lang, 'sweetness', langCharLimit)}</h4>
                                            <span className="text-pastel-green-500 text-sm font-medium">
                                                {optionsConfig.sweetness.find(s => s.id === sweetness)?.label[lang as 'th'|'en']}
                                            </span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max={optionsConfig.sweetness.length - 1} 
                                            step="0.01"
                                            value={sweetnessSlider}
                                            onMouseDown={() => {
                                                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                                                setIsDragging(true);
                                            }}
                                            onTouchStart={() => {
                                                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                                                setIsDragging(true);
                                            }}
                                            onMouseUp={() => snapSlider(sweetnessSlider)}
                                            onTouchEnd={() => snapSlider(sweetnessSlider)}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                setSweetnessSlider(val);
                                                setSweetness(optionsConfig.sweetness[Math.round(val)].id);
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-green-500 dark:bg-gray-700 outline-none"
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                                            {optionsConfig.sweetness.map((sw, idx) => (
                                                <span key={sw.id} className={idx === optionsConfig.sweetness.findIndex(s => s.id === sweetness) ? 'text-pastel-green-500 font-bold' : ''}>
                                                    {sw.val}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ice Level */}
                                    <div>
                                        <h4 className="font-semibold mb-3 dark:text-gray-200">{t(lang, 'iceLevel', langCharLimit)}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {optionsConfig.ice.map(ic => (
                                                <button 
                                                    key={ic.id}
                                                    onClick={() => setIce(ic.id)}
                                                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${ice === ic.id ? 'bg-pastel-green-500 text-white border-pastel-green-500 shadow-sm' : 'bg-white dark:bg-pastel-dark-card text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-pastel-green-300'}`}
                                                >
                                                    {ic.label[lang as 'th'|'en']}
                                                </button>
                                            ))}
                                        </div>
                                        {ice === 'ic4' && (
                                            <div className="mt-3 animate-fade-in">
                                                <input 
                                                    type="number" 
                                                    min="0" 
                                                    value={iceCubes} 
                                                    onChange={(e) => setIceCubes(parseInt(e.target.value))}
                                                    placeholder="Number of cubes"
                                                    className="w-full bg-gray-50 dark:bg-pastel-dark-card border border-pastel-green-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-green-400 dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Toppings */}
                                    <div>
                                        <h4 className="font-semibold mb-3 dark:text-gray-200">{t(lang, 'toppingsTitle', langCharLimit)}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {optionsConfig.toppings.map(tp => {
                                                const isSelected = toppings.includes(tp.id);
                                                return (
                                                    <button 
                                                        key={tp.id}
                                                        onClick={() => toggleTopping(tp.id)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${isSelected ? 'bg-pastel-green-500 text-white border-pastel-green-500 shadow-sm' : 'bg-white dark:bg-pastel-dark-card text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-pastel-green-300'}`}
                                                    >
                                                        {tp.name[lang as 'th'|'en']} <span className={isSelected ? 'text-white/90 font-bold ml-1' : 'text-pastel-green-500 font-bold ml-1'}>+฿{tp.price}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                            {selectedItem.type === 'bakery' && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No customization options available for this item.</p>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-white dark:bg-pastel-dark-bg p-4 border-t border-gray-100 dark:border-gray-800 z-10">
                            <button 
                                onClick={handleConfirmAdd}
                                className="w-full py-4 bg-pastel-green-500 hover:bg-pastel-green-400 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                            >
                                <span>{t(lang, 'confirmAdd', langCharLimit)}</span>
                                <span key={currentPrice} className="animate-bump inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
                                    ฿{currentPrice}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
