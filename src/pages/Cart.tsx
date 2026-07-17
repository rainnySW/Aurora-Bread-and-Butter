import { useState, useRef } from 'react';
import { useStore, t, CartItem } from '../store/useStore';
import { optionsConfig } from '../data/menuData';
import { Trash2, Minus, Plus, X, QrCode, CreditCard, Edit3 } from 'lucide-react';

export default function CartPage() {
    const { lang, langCharLimit, cart, updateCartItemQty, updateCartItemOptions, removeFromCart, clearCart, setTab } = useStore();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'none' | 'select' | 'qr' | 'bank' | 'processing'>('none');
    const [slipUploaded, setSlipUploaded] = useState(false);
    const [queueNum, setQueueNum] = useState<number | null>(null);
    const [receiptData, setReceiptData] = useState<{items: CartItem[], total: number, queue: number, estimatedTime: number} | null>(null);

    // Edit Modal state
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);
    const [sweetness, setSweetness] = useState('sw100');
    const [sweetnessSlider, setSweetnessSlider] = useState(3);
    const [, setIsDragging] = useState(false);
    const animationRef = useRef<number>();
    const [ice, setIce] = useState('ic2');
    const [iceCubes, setIceCubes] = useState(0);
    const [toppings, setToppings] = useState<string[]>([]);

    const openEditModal = (item: CartItem) => {
        setEditingItem(item);
        setSweetness(item.sweetness || 'sw100');
        const swIdx = optionsConfig.sweetness.findIndex(s => s.id === item.sweetness);
        setSweetnessSlider(swIdx >= 0 ? swIdx : 3);
        setIce(item.ice || 'ic2');
        setIceCubes(item.iceCubes || 0);
        setToppings(item.toppings || []);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const snapSlider = (currentSliderVal: number) => {
        setIsDragging(false);
        const target = Math.round(currentSliderVal);
        const startValue = currentSliderVal;
        const startTime = performance.now();
        const duration = 300;

        const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
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

    const toggleTopping = (id: string) => {
        setToppings(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    };

    const handleConfirmEdit = () => {
        if (!editingItem) return;
        
        let finalPrice = editingItem.menuItem.price;
        toppings.forEach(tId => {
            const top = optionsConfig.toppings.find(o => o.id === tId);
            if (top) finalPrice += top.price;
        });

        updateCartItemOptions(editingItem.id, {
            sweetness,
            ice,
            iceCubes: ice === 'ic4' ? iceCubes : undefined,
            toppings,
            price: finalPrice
        });
        setEditingItem(null);
    };

    let currentEditPrice = editingItem?.menuItem.price || 0;
    if (editingItem?.menuItem.type === 'drink') {
        toppings.forEach(tId => {
            const top = optionsConfig.toppings.find(o => o.id === tId);
            if (top) currentEditPrice += top.price;
        });
    }

    if (cart.length === 0 && !queueNum) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in">
                <div className="w-32 h-32 bg-pastel-brown-100 dark:bg-pastel-dark-card rounded-full flex items-center justify-center mb-6">
                    <ShoppingCartIcon />
                </div>
                <h3 className="text-xl font-medium mb-4 dark:text-white">{t(lang, 'emptyCart', langCharLimit)}</h3>
                <button onClick={() => setTab('menu')} className="px-6 py-3 bg-pastel-green-500 text-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow">
                    {t(lang, 'goToMenu', langCharLimit)}
                </button>
            </div>
        );
    }

    let total = 0;
    const cartHtml = cart.map((item) => {
        let details = [];
        
        if(item.menuItem.type === 'drink') {
            const sw = optionsConfig.sweetness.find(o => o.id === item.sweetness);
            const ic = optionsConfig.ice.find(o => o.id === item.ice);
            if(sw) details.push(sw.label[lang as 'th'|'en']);
            if(ic) {
                details.push(item.ice === 'ic4' ? `${item.iceCubes} Ice Cubes` : ic.label[lang as 'th'|'en']);
            }
            
            if(item.toppings && item.toppings.length > 0) {
                item.toppings.forEach(tId => {
                    const top = optionsConfig.toppings.find(o => o.id === tId);
                    if(top) {
                        details.push(`+ ${top.name[lang as 'th'|'en']}`);
                    }
                });
            }
        }
        
        total += item.price * item.qty;

        return (
            <div key={item.id} className="bg-white dark:bg-pastel-dark-card rounded-2xl p-4 flex gap-4 shadow-sm items-center relative border border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <img src={`/images/${item.menuItem.id}.jpg`} alt={item.menuItem.name.en} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                    <h4 className="font-medium dark:text-white">{item.menuItem.name[lang as 'th'|'en']}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{details.join(', ')}</p>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-pastel-green-500 font-semibold">฿{item.price}</p>
                        <div className="flex items-center gap-3 bg-gray-100 dark:bg-pastel-dark-card rounded-full px-2 py-1">
                            <button onClick={() => updateCartItemQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-sm text-gray-600 dark:text-gray-300">
                                <Minus size={12} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center dark:text-white">{item.qty}</span>
                            <button onClick={() => updateCartItemQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-sm text-gray-600 dark:text-gray-300">
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                </div>
                {item.menuItem.type === 'drink' && (
                    <button onClick={() => openEditModal(item)} className="absolute top-2 right-10 text-gray-400 hover:text-blue-400 p-2 transition-colors">
                        <Edit3 size={16} />
                    </button>
                )}
                <button onClick={() => removeFromCart(item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-400 p-2 transition-colors">
                    <X size={16} />
                </button>
            </div>
        );
    });

    const handleCheckout = () => {
        setPaymentStep('select');
        setSlipUploaded(false);
    };

    const handleProcessOrder = () => {
        setPaymentStep('processing');
        
        setTimeout(() => {
            const randomQueue = Math.floor(Math.random() * 15) + 1;
            setQueueNum(randomQueue);
            setReceiptData({
                items: [...cart],
                total: total,
                queue: randomQueue,
                estimatedTime: randomQueue * 3 // 3 mins per queue
            });
            clearCart();
            setPaymentStep('none');
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full animate-fade-in pb-32">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">{t(lang, 'cart', langCharLimit)}</h2>
                <button onClick={() => setShowClearConfirm(true)} className="text-sm bg-red-100 text-red-500 font-bold flex items-center gap-2 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 px-4 py-2 rounded-full transition-all shadow-sm">
                    <Trash2 size={18} /> <span>{t(lang, 'clearCart', langCharLimit)}</span>
                </button>
            </div>
            
            <div className="space-y-4 flex-grow">
                {cartHtml}
            </div>

            {/* Fixed Bottom Checkout Bar */}
            <div className="fixed bottom-[4rem] md:bottom-0 left-0 right-0 glass border-t border-white/50 dark:border-gray-800 px-6 py-4 z-40 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t(lang, 'total', langCharLimit)}</p>
                        <p className="text-2xl font-bold text-pastel-green-500">฿{total}</p>
                    </div>
                    <button 
                        onClick={handleCheckout} 
                        className="px-8 py-3 bg-gradient-to-r from-pastel-green-400 to-pastel-green-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all w-1/2 md:w-auto"
                    >
                        {t(lang, 'checkout', langCharLimit)}
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-pastel-dark-bg rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto hide-scrollbar shadow-2xl animate-slide-up">
                        <div className="sticky top-0 bg-white/90 dark:bg-pastel-dark-bg/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 z-10">
                            <h3 className="text-lg font-bold dark:text-white">{t(lang, 'customize', langCharLimit)}</h3>
                            <button onClick={() => setEditingItem(null)} className="p-2 bg-gray-100 dark:bg-pastel-dark-card rounded-full text-gray-500 hover:text-red-400">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6 pt-4">
                            {/* Order Image Preview */}
                            <div className="w-full h-48 rounded-2xl overflow-hidden relative shadow-md group">
                                <img src={`/images/${editingItem.menuItem.id}.jpg`} alt={editingItem.menuItem.name.en} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                            </div>

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
                        </div>

                        <div className="sticky bottom-0 bg-white dark:bg-pastel-dark-bg p-4 border-t border-gray-100 dark:border-gray-800 z-10">
                            <button 
                                onClick={handleConfirmEdit}
                                className="w-full py-4 bg-pastel-green-500 hover:bg-pastel-green-400 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                            >
                                <span>{t(lang, 'confirmAdd', langCharLimit)}</span>
                                <span key={currentEditPrice} className="animate-bump inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
                                    ฿{currentEditPrice}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear Confirm Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-pastel-dark-bg rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl animate-slide-up">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 dark:text-white">{t(lang, 'clearCart', langCharLimit)}</h3>
                        <p className="text-gray-500 mb-6">{t(lang, 'confirmClearMsg', langCharLimit)}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-3 bg-gray-100 dark:bg-pastel-dark-card rounded-xl font-medium dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">{t(lang, 'no', langCharLimit)}</button>
                            <button onClick={() => { clearCart(); setShowClearConfirm(false); }} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">{t(lang, 'yes', langCharLimit)}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modals Flow */}
            {paymentStep !== 'none' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-pastel-dark-bg rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
                        {paymentStep === 'select' && (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold dark:text-white">{t(lang, 'paymentMethod', langCharLimit)}</h3>
                                    <button onClick={() => setPaymentStep('none')} className="text-gray-400 hover:text-red-400 p-1">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <button onClick={() => setPaymentStep('qr')} className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-pastel-green-400 hover:bg-pastel-green-50 dark:hover:bg-pastel-green-900/20 transition-all group">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <QrCode size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-lg dark:text-white">{t(lang, 'promptpay', langCharLimit)}</p>
                                            <p className="text-xs text-gray-500">Scan to pay instantly</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setPaymentStep('bank')} className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-pastel-green-400 hover:bg-pastel-green-50 dark:hover:bg-pastel-green-900/20 transition-all group">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <CreditCard size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-lg dark:text-white">{t(lang, 'bankTransfer', langCharLimit)}</p>
                                            <p className="text-xs text-gray-500">Manual transfer</p>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {paymentStep === 'qr' && (
                            <div className="text-center">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold dark:text-white">{t(lang, 'scanQrCode', langCharLimit)}</h3>
                                    <button onClick={() => setPaymentStep('select')} className="text-gray-400 hover:text-red-400 p-1">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-white rounded-xl flex items-center justify-center border-4 border-pastel-green-500 mb-6">
                                    <QrCode size={120} className="text-gray-800" />
                                </div>
                                <p className="text-lg font-bold text-pastel-green-500 mb-6">฿{total}</p>
                                <button onClick={handleProcessOrder} className="w-full py-4 bg-pastel-green-500 text-white rounded-xl font-bold hover:bg-pastel-green-600 transition-colors">
                                    {t(lang, 'simulatePayment', langCharLimit)}
                                </button>
                            </div>
                        )}
                        
                        {paymentStep === 'bank' && (
                            <div className="text-center">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold dark:text-white">{t(lang, 'bankTransfer', langCharLimit)}</h3>
                                    <button onClick={() => setPaymentStep('select')} className="text-gray-400 hover:text-red-400 p-1">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="bg-gray-50 dark:bg-pastel-dark-card p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6 text-left">
                                    <p className="font-bold dark:text-white mb-1">{t(lang, 'bankDetails', langCharLimit)}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t(lang, 'accountName', langCharLimit)}</p>
                                    <p className="font-bold text-pastel-green-500 mt-3 text-lg">฿{total}</p>
                                </div>
                                
                                {!slipUploaded ? (
                                    <button onClick={() => setSlipUploaded(true)} className="w-full py-4 border-2 border-dashed border-pastel-green-300 dark:border-pastel-green-500/50 text-pastel-green-500 rounded-xl font-bold hover:bg-pastel-green-50 dark:hover:bg-pastel-green-900/20 transition-colors mb-4 flex justify-center items-center gap-2">
                                        <Plus size={20} /> {t(lang, 'uploadSlip', langCharLimit)}
                                    </button>
                                ) : (
                                    <div className="w-full py-4 bg-pastel-green-100 dark:bg-pastel-green-900/30 text-pastel-green-600 dark:text-pastel-green-400 rounded-xl font-bold mb-4 flex justify-center items-center gap-2 border border-pastel-green-300">
                                        ✓ {t(lang, 'slipUploaded', langCharLimit)}
                                    </div>
                                )}
                                
                                <button disabled={!slipUploaded} onClick={handleProcessOrder} className={`w-full py-4 rounded-xl font-bold transition-colors ${slipUploaded ? 'bg-pastel-green-500 text-white hover:bg-pastel-green-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'}`}>
                                    {t(lang, 'confirmPayment', langCharLimit)}
                                </button>
                            </div>
                        )}
                        
                        {paymentStep === 'processing' && (
                            <div className="py-10 text-center flex flex-col items-center">
                                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-pastel-green-500 rounded-full animate-spin mb-6"></div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">{t(lang, 'processing', langCharLimit)}</h3>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Success Queue & Receipt Modal */}
            {queueNum && receiptData && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-white dark:bg-pastel-dark-bg rounded-3xl w-full max-w-sm my-8 shadow-2xl animate-slide-up relative overflow-hidden flex flex-col">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pastel-green-100 dark:bg-pastel-green-900/30 rounded-full opacity-50 blur-xl"></div>
                        
                        <div className="p-8 text-center border-b-2 border-dashed border-gray-200 dark:border-gray-700 relative z-20 bg-white dark:bg-pastel-dark-bg">
                            <div className="w-20 h-20 bg-gradient-to-br from-pastel-green-400 to-pastel-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-pastel-green-500/30">
                                <span className="text-3xl font-bold">✓</span>
                            </div>
                            <h2 className="text-xl font-bold mb-1 text-pastel-green-500">{t(lang, 'orderSuccess', langCharLimit)}</h2>
                            
                            <div className="bg-gray-50 dark:bg-pastel-dark-card rounded-2xl p-4 mt-6 border border-gray-100 dark:border-gray-700">
                                <span className="text-5xl font-black bg-gradient-to-r from-gray-700 to-gray-900 dark:from-white dark:to-gray-300 text-transparent bg-clip-text">
                                    {queueNum}
                                </span>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{t(lang, 'queues', langCharLimit)}</p>
                            </div>
                            
                            <div className="mt-4 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-2 rounded-xl">
                                ⏱ {t(lang, 'estimatedTime', langCharLimit)}: {receiptData.estimatedTime} {t(lang, 'minutes', langCharLimit)}
                            </div>
                        </div>
                        
                        {/* Printing Receipt Animation Container */}
                        <div className="relative overflow-hidden bg-gray-50 dark:bg-pastel-dark-card/50">
                            {/* Printer slot shadow overlay */}
                            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-black/20 to-transparent dark:from-black/60 z-10 pointer-events-none"></div>
                            
                            <div className="p-6 animate-print">
                                <h3 className="font-bold text-center mb-4 dark:text-white border-b border-dashed border-gray-300 dark:border-gray-600 pb-2">{t(lang, 'receipt', langCharLimit)}</h3>
                                <div className="space-y-3 max-h-40 overflow-y-auto hide-scrollbar text-sm relative z-0">
                                    {receiptData.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start">
                                            <div className="flex-1 pr-2">
                                                <p className="font-medium dark:text-gray-200">{item.qty}x {item.menuItem.name[lang as 'th'|'en']}</p>
                                            </div>
                                            <span className="font-medium dark:text-gray-300 text-right">฿{item.price * item.qty}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600 font-bold dark:text-white text-lg">
                                    <span>Total</span>
                                    <span className="text-pastel-green-500">฿{receiptData.total}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 relative z-20 bg-white dark:bg-pastel-dark-bg border-t border-gray-100 dark:border-gray-800">
                            <button onClick={() => { setQueueNum(null); setReceiptData(null); setTab('home'); }} className="w-full py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                                {t(lang, 'close', langCharLimit)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-pastel-brown-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
)
