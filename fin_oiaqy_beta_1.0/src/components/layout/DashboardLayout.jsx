
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Home, Users, CreditCard, DollarSign, TrendingUp, FileText, Bell, Settings, HelpCircle, QrCode, ChevronRight, Briefcase, FileBarChart, Folder, HeartHandshake as Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound.js';
import { toast } from '@/components/ui/use-toast';

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/clients', icon: Users, label: 'Clientes' },
  { path: '/loans', icon: CreditCard, label: 'Empréstimos' },
  { path: '/partners', icon: Handshake, label: 'Parceiros' },
  { path: '/investments', icon: Briefcase, label: 'Investimentos' },
  { path: '/reports', icon: FileBarChart, label: 'Relatórios' },
  { path: '/documents', icon: Folder, label: 'Documentos' },
  { path: '/notifications', icon: Bell, label: 'Notificações' },
];

const bottomMenuItems = [
  { 
    path: '/settings', 
    icon: Settings, 
    label: 'Configurações', 
    subMenu: [
      { path: '/settings/pix', icon: QrCode, label: 'PIX C6 Bank' }
    ]
  },
  { path: '/help', icon: HelpCircle, label: 'Ajuda' },
];


const NavItem = ({ item, onNavigate, playSound, location, onCloseMobile }) => {
  const IconComponent = item.icon;
  const isParentActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  const isSubMenuActive = item.subMenu?.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));
  const isActive = isParentActive || isSubMenuActive;
  
  const hasSubMenu = item.subMenu && item.subMenu.length > 0;
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(isActive && hasSubMenu);


  const handleMainItemClick = () => {
    playSound('click');
    if (hasSubMenu) {
      setIsSubMenuOpen(!isSubMenuOpen);
      if (item.path !== '/settings' || location.pathname !== item.path) { 
         if (location.pathname !== item.path) onNavigate(item.path);
      }
    } else {
      onNavigate(item.path);
      if (window.innerWidth < 1024) onCloseMobile();
    }
  };
  
  const handleSubItemClick = (subItemPath) => {
    playSound('click');
    onNavigate(subItemPath);
    if (window.innerWidth < 1024) onCloseMobile();
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: Math.random() * 0.1 }}
        onClick={handleMainItemClick}
        onMouseEnter={() => playSound('hover')}
        className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
          ${
            (isParentActive && !hasSubMenu && !isSubMenuActive) || (isParentActive && item.path === '/settings' && !isSubMenuActive)
              ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-white border-2 border-blue-400/70 shadow-lg shadow-blue-500/30'
              : isActive && hasSubMenu
              ? 'text-white bg-white/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
      >
        <div className="flex items-center space-x-3">
          <IconComponent className={`w-5 h-5 ${(isActive && !hasSubMenu && !isSubMenuActive) || (isParentActive && item.path === '/settings' && !isSubMenuActive) ? 'text-blue-300' : isActive ? 'text-blue-300' : 'group-hover:text-blue-300'}`} />
          <span className="font-medium">{item.label}</span>
        </div>
        {(isParentActive && !hasSubMenu && !isSubMenuActive) || (isParentActive && item.path === '/settings' && !isSubMenuActive) ? (
          <motion.div
            layoutId="active-indicator"
            className="w-1.5 h-6 bg-blue-400 rounded-full"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        ) : hasSubMenu ? (
          <ChevronRight className={`w-4 h-4 transition-transform ${isSubMenuOpen ? 'rotate-90' : ''} ${isActive ? 'text-blue-300' : 'text-gray-500'}`} />
        ) : null}
      </motion.button>
      {hasSubMenu && isSubMenuOpen && (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-6 mt-1 space-y-1"
        >
          {item.subMenu.map(subItem => {
            const isSubActive = location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/');
            const SubIcon = subItem.icon;
            return (
              <motion.button
                key={subItem.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSubItemClick(subItem.path)}
                onMouseEnter={() => playSound('hover')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 group
                  ${
                    isSubActive
                      ? 'bg-blue-500/20 text-blue-200'
                      : 'text-gray-400 hover:text-blue-300 hover:bg-white/5'
                  }`}
              >
                <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-blue-300' : 'text-gray-500 group-hover:text-blue-300'}`} />
                <span className="text-sm font-medium">{subItem.label}</span>
                 {isSubActive && (
                  <motion.div
                    className="ml-auto w-1 h-5 bg-blue-400 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </>
  );
};


const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const { playSound } = useSound();
  const location = useLocation();
  const navigate = useNavigate();


  const handleNavigate = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };
  
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen || window.innerWidth >=1024 ? 0 : -300 }}
      transition={{ type: 'spring', stiffness: 300, damping: 35, mass: 0.5 }}
      className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 glass-dark border-r border-white/10 flex flex-col
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/40"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <DollarSign className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="font-bold text-white">Fin Oiaqy ®</h2>
              <p className="text-xs text-gray-400">v5.0 Crystal Clarity</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
        {menuItems.map((item) => <NavItem key={item.path} item={item} onNavigate={onNavigate} playSound={playSound} location={location} onCloseMobile={onClose}/>)}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1.5">
        {bottomMenuItems.map((item) => <NavItem key={item.path} item={item} onNavigate={onNavigate} playSound={playSound} location={location} onCloseMobile={onClose}/>)}
      </div>
    </motion.aside>
  );
};


const DashboardLayout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { playSound } = useSound();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if(sidebarOpen && window.innerWidth < 1024){
        playSound('swoosh-soft');
    }
  }, [sidebarOpen, playSound]);


  const getPageTitle = () => {
    const allMenuItems = [...menuItems, ...bottomMenuItems.flatMap(item => item.subMenu ? [item, ...item.subMenu] : [item])];
    
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname.startsWith('/clients/') && location.pathname.split('/').length > 2) return 'Detalhes do Cliente';
    if (location.pathname.startsWith('/loans/') && location.pathname.split('/').length > 2) return 'Detalhes do Empréstimo';
    if (location.pathname === '/settings/pix') return 'Configurações PIX';
    if (location.pathname === '/partners') return 'Gerenciamento de Parceiros';


    const currentItem = allMenuItems.find(item => location.pathname.startsWith(item.path) && item.path !== '/');
    
    return currentItem ? currentItem.label : 'Fin Oiaqy ®';
  };


  const handleNavigate = (path) => {
    if (location.pathname !== path) {
        playSound('swoosh');
        navigate(path);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
      />
      
      {sidebarOpen && window.innerWidth < 1024 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="glass-dark border-b border-white/10 p-4 sticky top-0 z-30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { playSound('click'); setSidebarOpen(!sidebarOpen); }}
                className="lg:hidden text-white hover:bg-white/10"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={getPageTitle()}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="text-xl font-semibold text-gray-200 hidden sm:block"
                >
                  {getPageTitle()}
                </motion.h1>
              </AnimatePresence>
            </div>
            
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-white hover:bg-red-500/20 hover:text-red-300 transition-colors"
              onMouseEnter={() => playSound('hover')}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </Button>
          </div>
        </motion.header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
