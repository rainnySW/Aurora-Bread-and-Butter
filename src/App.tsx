import { useEffect } from 'react';
import { useStore, t } from './store/useStore';
import { Home, Coffee, ShoppingCart, User } from 'lucide-react';
import HomePage from './pages/Home';
import MenuPage from './pages/Menu';
import CartPage from './pages/Cart';
import AccountPage from './pages/Account';

function App() {
  const { theme, lang, langCharLimit, tab, setTab, cart } = useStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const renderContent = () => {
    switch (tab) {
      case 'home': return <HomePage />;
      case 'menu': return <MenuPage />;
      case 'cart': return <CartPage />;
      case 'account': return <AccountPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen flex flex-col relative transition-colors duration-300">
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass shadow-sm h-20 items-center justify-between px-8 transition-colors duration-300">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab('home')}>
          <div className="text-pastel-green-500">
            <Coffee size={32} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pastel-green-500 to-pastel-brown-400 text-gradient">Aurora B&B</h1>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <NavButton tabName="home" currentTab={tab} onClick={() => setTab('home')} label={t(lang, 'home', langCharLimit)} />
          <NavButton tabName="menu" currentTab={tab} onClick={() => setTab('menu')} label={t(lang, 'menu', langCharLimit)} />
          <div className="relative">
            <NavButton tabName="cart" currentTab={tab} onClick={() => setTab('cart')} label={t(lang, 'cart', langCharLimit)} />
            {totalCartQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                {totalCartQty}
              </span>
            )}
          </div>
          <NavButton tabName="account" currentTab={tab} onClick={() => setTab('account')} label={t(lang, 'account', langCharLimit)} />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full px-4 py-6 md:px-8 animate-fade-in">
        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] pt-2 px-6 rounded-t-3xl border-t border-white/40 dark:border-gray-800/40 transition-colors duration-300">
        <div className="flex justify-between items-center h-16">
          <MobileNavButton tabName="home" currentTab={tab} onClick={() => setTab('home')} label={t(lang, 'home', langCharLimit)} icon={<Home />} />
          <MobileNavButton tabName="menu" currentTab={tab} onClick={() => setTab('menu')} label={t(lang, 'menu', langCharLimit)} icon={<Coffee />} />
          <div className="relative w-full flex flex-col items-center">
            <MobileNavButton tabName="cart" currentTab={tab} onClick={() => setTab('cart')} label={t(lang, 'cart', langCharLimit)} icon={<ShoppingCart />} />
            {totalCartQty > 0 && (
              <span className="absolute top-1 right-[25%] bg-red-400 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow-sm z-10 pointer-events-none">
                {totalCartQty}
              </span>
            )}
          </div>
          <MobileNavButton tabName="account" currentTab={tab} onClick={() => setTab('account')} label={t(lang, 'account', langCharLimit)} icon={<User />} />
        </div>
      </nav>

    </div>
  );
}

const NavButton = ({ tabName, currentTab, onClick, label }: any) => {
  const active = currentTab === tabName;
  return (
    <button 
      onClick={onClick}
      className={`transition-colors ${active ? 'text-pastel-green-500 dark:text-pastel-green-400 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-pastel-green-400'}`}
    >
      <span>{label}</span>
    </button>
  );
};

const MobileNavButton = ({ tabName, currentTab, onClick, label, icon }: any) => {
  const active = currentTab === tabName;
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${active ? 'text-pastel-green-500 dark:text-pastel-green-400 transform -translate-y-1' : 'text-gray-500 dark:text-gray-400'}`}
    >
      <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
};

export default App;
