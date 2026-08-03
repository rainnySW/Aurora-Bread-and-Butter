import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '../data/menuData';

export type CartItem = {
    id: string;
    menuItem: MenuItem;
    qty: number;
    sweetness?: string;
    ice?: string;
    iceCubes?: number; // Custom ice cubes
    toppings?: string[];
    price: number; // Subtotal for this unit
};

interface AppState {
    theme: 'light' | 'dark';
    lang: 'th' | 'en';
    tab: 'home' | 'menu' | 'cart' | 'account';
    cart: CartItem[];
    hasAddedFirstItem: boolean;
    user: any | null; // For simplicity, just any for now
    langCharLimit: number;
    
    setTheme: (theme: 'light' | 'dark') => void;
    setLang: (lang: 'th' | 'en') => void;
    setTab: (tab: 'home' | 'menu' | 'cart' | 'account') => void;
    addToCart: (item: CartItem) => void;
    updateCartItemQty: (id: string, delta: number) => void;
    updateCartItemOptions: (id: string, updates: Partial<CartItem>) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    login: (user: any) => void;
    logout: () => void;
    setLangCharLimit: (limit: number) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'light',
            lang: 'th',
            tab: 'home',
            cart: [],
            hasAddedFirstItem: false,
            user: null,
            langCharLimit: 999,

            setTheme: (theme) => set({ theme }),
            setLang: (lang) => set({ lang }),
            setTab: (tab) => set({ tab }),
            addToCart: (item) => set((state) => {
                const newCart = [...state.cart, item];
                return { cart: newCart, hasAddedFirstItem: true };
            }),
            updateCartItemQty: (id, delta) => set((state) => {
                const newCart = state.cart.map(item => {
                    if (item.id === id) {
                        return { ...item, qty: item.qty + delta };
                    }
                    return item;
                }).filter(item => item.qty > 0);
                return { cart: newCart };
            }),
            updateCartItemOptions: (id, updates) => set((state) => ({
                cart: state.cart.map(item => item.id === id ? { ...item, ...updates } : item)
            })),
            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter(item => item.id !== id)
            })),
            clearCart: () => set({ cart: [], hasAddedFirstItem: false }),
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
            setLangCharLimit: (limit) => set({ langCharLimit: limit })
        }),
        {
            name: 'aurora-storage',
            partialize: (state) => ({ 
                theme: state.theme, 
                lang: state.lang, 
                cart: state.cart,
                hasAddedFirstItem: state.hasAddedFirstItem,
                user: state.user
            }),
        }
    )
);

// Basic translations matching reference
export const translations = {
    th: {
        home: 'หน้าแรก', menu: 'เมนู', cart: 'ตะกร้า', account: 'บัญชี',
        greeting: 'ยินดีต้อนรับสู่',
        subGreeting: 'ความอบอุ่นในทุกคำ ความละมุนในทุกแก้ว',
        recommend: 'เมนูแนะนำ',
        orderNow: 'สั่งเลย',
        searchPlaceholder: 'ค้นหาเมนู...',
        addToCart: 'เพิ่มลงตะกร้า',
        quickAdd: 'เพิ่มด่วน',
        customize: 'ปรับแต่ง',
        sweetness: 'ระดับความหวาน',
        iceLevel: 'ระดับน้ำแข็ง',
        iceCubes: 'ระบุจำนวนก้อนน้ำแข็ง',
        toppingsTitle: 'ท็อปปิ้ง (เลือกได้หลายอย่าง)',
        confirmAdd: 'ยืนยันเพิ่มลงตะกร้า',
        cancel: 'ยกเลิก',
        emptyCart: 'ตะกร้าของคุณยังว่างเปล่า',
        goToMenu: 'ไปเลือกเมนูเลย',
        total: 'ยอดรวม',
        clearCart: 'ล้างตะกร้า',
        confirmOrder: 'ยืนยันการสั่งซื้อ',
        checkout: 'ชำระเงิน',
        paymentMethod: 'วิธีชำระเงิน',
        promptpay: 'สแกนคิวอาร์โค้ด (PromptPay)',
        bankTransfer: 'โอนเงินผ่านธนาคาร',
        orderSuccess: 'สั่งซื้อสำเร็จ!',
        queueWait: 'กรุณารอสักครู่ คิวของคุณคือ',
        queues: 'คิว',
        simulatePayment: 'ยืนยันการชำระเงิน',
        scanQrCode: 'สแกนคิวอาร์โค้ด',
        uploadSlip: 'อัปโหลดสลิป',
        confirmPayment: 'ยืนยันการชำระเงิน',
        bankDetails: 'กรุงไทย',
        accountName: '662 8 92720 2 - ศริวัฒน์ พวงอุไร',
        receipt: 'ใบเสร็จรับเงิน',
        estimatedTime: 'เวลารอโดยประมาณ',
        minutes: 'นาที',
        processing: 'กำลังตรวจสอบ...',
        slipUploaded: 'อัปโหลดสลิปแล้ว',
        close: 'ปิด',
        login: 'เข้าสู่ระบบ',
        signup: 'สมัครสมาชิก',
        logout: 'ออกจากระบบ',
        username: 'ชื่อผู้ใช้',
        email: 'อีเมล',
        emailOrUsername: 'อีเมล หรือ ชื่อผู้ใช้',
        password: 'รหัสผ่าน',
        noAccount: 'ยังไม่มีบัญชีใช่ไหม? สมัครเลย',
        hasAccount: 'มีบัญชีแล้ว? เข้าสู่ระบบ',
        settings: 'การตั้งค่า',
        language: 'ภาษา (Language)',
        theme: 'ธีม (Theme)',
        lightMode: 'โหมดสว่าง',
        darkMode: 'โหมดมืด',
        confirmClearMsg: 'คุณแน่ใจหรือไม่ว่าต้องการล้างตะกร้าทั้งหมด?',
        yes: 'ใช่',
        no: 'ไม่'
    },
    en: {
        home: 'Home', menu: 'Menu', cart: 'Cart', account: 'Account',
        greeting: 'Welcome to',
        subGreeting: 'Warmth in every bite, smoothness in every sip.',
        recommend: 'Recommended',
        orderNow: 'Order Now',
        searchPlaceholder: 'Search menu...',
        addToCart: 'Add to Cart',
        quickAdd: 'Quick Add',
        customize: 'Customize',
        sweetness: 'Sweetness Level',
        iceLevel: 'Ice Level',
        iceCubes: 'Custom Ice Cubes',
        toppingsTitle: 'Toppings (Multiple allowed)',
        confirmAdd: 'Confirm Add',
        cancel: 'Cancel',
        emptyCart: 'Your cart is empty',
        goToMenu: 'Go to Menu',
        total: 'Total',
        clearCart: 'Clear Cart',
        confirmOrder: 'Confirm Order',
        checkout: 'Checkout',
        paymentMethod: 'Select Payment Method',
        promptpay: 'QR PromptPay',
        bankTransfer: 'Bank Transfer',
        orderSuccess: 'Order Successful!',
        queueWait: 'Estimated queue waiting:',
        queues: 'queues',
        close: 'Close',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
        username: 'Username',
        email: 'Email',
        emailOrUsername: 'Email or Username',
        password: 'Password',
        noAccount: 'Don\'t have an account? Sign up',
        hasAccount: 'Already have an account? Login',
        settings: 'Settings',
        language: 'Language (ภาษา)',
        theme: 'Theme',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        confirmClearMsg: 'Are you sure you want to clear your entire cart?',
        yes: 'Yes',
        no: 'No',
        simulatePayment: 'Confirm Payment',
        scanQrCode: 'Scan QR Code',
        uploadSlip: 'Upload Slip',
        confirmPayment: 'Confirm Payment',
        bankDetails: 'Krungthai Bank',
        accountName: '662 8 92720 2 - Siriwat Puangurai',
        receipt: 'Receipt',
        estimatedTime: 'Estimated Time',
        minutes: 'minutes',
        processing: 'Processing...',
        slipUploaded: 'Slip Uploaded'
    }
};

export const t = (lang: 'th' | 'en', key: string, limit: number = 999, isAttribute: boolean = false): any => {
    const fullText = (translations as any)[lang][key] || key;
    if (limit >= fullText.length || isAttribute) return fullText.slice(0, limit);
    
    return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
            <span>{fullText.slice(0, limit)}</span>
            <span style={{ visibility: 'hidden' }}>{fullText.slice(limit)}</span>
        </span>
    );
};
