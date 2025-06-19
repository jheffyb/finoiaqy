
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  X,
  DollarSign,
  FileText,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';


const menuItems = [
  { icon: Home, label: 'Dashboard', active: true, path: '/dashboard' },
  { icon: Users, label: 'Clientes', active: false, path: '/clients' },
  { icon: CreditCard, label: 'Empréstimos', active: false, path: '/loans' },
  { icon: DollarSign, label: 'Investimentos', active: false, path: '/investments' },
  { icon: TrendingUp, label: 'Relatórios', active: false, path: '/reports' },
  { icon: FileText, label: 'Documentos', active: false, path: '/documents' },
  { icon: Bell, label: 'Notificações', active: false, path: '/notifications' },
  { icon: Settings, label: 'Configurações', active: false, path: '/settings' },
  { icon: HelpCircle, label: 'Ajuda', active: false, path: '/help' }
];

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const { playSound } = useSound();

  const handleMenuClick = (item) => {
    playSound('click');
    if (onNavigate) {
        onNavigate(item.path);
    }
    if (window.innerWidth < 1024 && onClose) {
        onClose();
    }
  };

  return (
    <AnimatePresence>
      {(isOpen || window.innerWidth >= 1024) && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed lg:relative inset-y-0 left-0 z-50 w-64 glass-dark border-r border-white/10 flex flex-col"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Fin Oiaqy ®</h2>
                  <p className="text-xs text-gray-400">v5.0 Crystal</p>
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

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => handleMenuClick(item)}
                  onMouseEnter={() => playSound('hover')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="glass rounded-xl p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-1">Performance</h4>
              <p className="text-xs text-gray-400 mb-2">Sistema operando perfeitamente</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ delay: 1, duration: 1 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-green-400 mt-1">94% Uptime</p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
