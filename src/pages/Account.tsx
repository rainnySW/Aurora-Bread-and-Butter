import { useState } from 'react';
import { useStore, t } from '../store/useStore';
import { Moon, Sun, Languages, LogOut } from 'lucide-react';

export default function AccountPage() {
    const { lang, langCharLimit, setLangCharLimit, theme, setLang, setTheme, user, login, logout } = useStore();
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (user) {
            try {
                await fetch(`/api/preferences/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: newTheme })
                });
            } catch (err) {
                console.error('Failed to save preference');
            }
        }
    };

    const toggleLang = async () => {
        // Start typing effect by clearing text
        setLangCharLimit(0);
        
        const newLang = lang === 'th' ? 'en' : 'th';
        setLang(newLang);
        
        // Type out text
        let currentLimit = 0;
        const typingInterval = setInterval(() => {
            currentLimit += 1;
            setLangCharLimit(currentLimit);
            if (currentLimit > 50) { // Max length of our longest string is ~40-50 chars
                clearInterval(typingInterval);
                setLangCharLimit(999);
            }
        }, 15); // Fast typing speed (15ms per char)

        if (user) {
            try {
                await fetch(`/api/preferences/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ language: newLang })
                });
            } catch (err) {
                console.error('Failed to save preference');
            }
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);
        
        try {
            const endpoint = isLoginView ? '/api/login' : '/api/register';
            const payload = isLoginView ? { identifier: email, password } : { username, email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (!res.ok) {
                setErrorMsg(data.error || 'Authentication failed');
            } else {
                login({ 
                    id: data.user.id, 
                    name: data.user.username, 
                    email: data.user.email 
                });
                
                if (data.user.preferences) {
                    if (data.user.preferences.theme) setTheme(data.user.preferences.theme);
                    if (data.user.preferences.language) setLang(data.user.preferences.language);
                }
                
                setUsername('');
                setEmail('');
                setPassword('');
            }
        } catch (err) {
            setErrorMsg('Network error, please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{t(lang, 'account', langCharLimit)}</h2>

            {user ? (
                <div className="bg-white dark:bg-pastel-dark-card rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 animate-slide-up">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-pastel-green-300 to-pastel-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg dark:text-white">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-500 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} />
                        {t(lang, 'logout', langCharLimit)}
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-pastel-dark-card rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 animate-slide-up">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">{isLoginView ? t(lang, 'login', langCharLimit) : t(lang, 'signup', langCharLimit)}</h3>
                    
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm rounded-xl border border-red-100 dark:border-red-900/50">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLoginView && (
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t(lang, 'username', langCharLimit)}</label>
                                <input 
                                    type="text" 
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full mt-1 bg-gray-50 dark:bg-[#3d453d] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-green-400 dark:text-white transition-colors"
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                                {isLoginView ? t(lang, 'emailOrUsername', langCharLimit) : t(lang, 'email', langCharLimit)}
                            </label>
                            <input 
                                type={isLoginView ? "text" : "email"} 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-1 bg-gray-50 dark:bg-[#3d453d] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-green-400 dark:text-white transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t(lang, 'password', langCharLimit)}</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-1 bg-gray-50 dark:bg-[#3d453d] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-green-400 dark:text-white transition-colors"
                            />
                        </div>
                        <button disabled={isLoading} type="submit" className={`w-full py-3 rounded-xl font-medium shadow-md transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-pastel-green-500 hover:bg-pastel-green-400 text-white'}`}>
                            {isLoading ? '...' : (isLoginView ? t(lang, 'login', langCharLimit) : t(lang, 'signup', langCharLimit))}
                        </button>
                    </form>
                    <button 
                        onClick={() => setIsLoginView(!isLoginView)}
                        className="w-full mt-4 text-sm text-pastel-green-500 hover:text-pastel-green-600 dark:hover:text-pastel-green-400 transition-colors"
                    >
                        {isLoginView ? t(lang, 'noAccount', langCharLimit) : t(lang, 'hasAccount', langCharLimit)}
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-pastel-dark-card rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold mb-4 dark:text-white text-gray-800">{t(lang, 'settings', langCharLimit)}</h3>
                
                <div className="bg-gray-50 dark:bg-[#3d453d] rounded-2xl p-4 space-y-4">
                    {/* Language Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 dark:text-gray-200">
                            <Languages className="text-gray-400 dark:text-gray-300" />
                            <span className="font-medium">{t(lang, 'language', langCharLimit)}</span>
                        </div>
                        <button 
                            onClick={toggleLang}
                            className="w-16 h-8 bg-gray-200 dark:bg-pastel-dark-card rounded-full p-1 flex items-center transition-colors relative shadow-inner"
                        >
                            <div className={`w-6 h-6 rounded-full bg-white dark:bg-gray-400 shadow-sm flex items-center justify-center text-xs font-bold transition-transform duration-300 ${lang === 'en' ? 'translate-x-8' : 'translate-x-0'}`}>
                                {lang === 'th' ? 'TH' : 'EN'}
                            </div>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-700/50"></div>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 dark:text-gray-200">
                            {theme === 'light' ? <Sun className="text-orange-400" /> : <Moon className="text-blue-300" />}
                            <span className="font-medium">{t(lang, 'theme', langCharLimit)}</span>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors duration-300 shadow-inner ${theme === 'dark' ? 'bg-pastel-green-500' : 'bg-gray-200'}`}
                        >
                            <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
