
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Settings2, AlertCircle, Info, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';

const mockNotifications = [
  { id: 'not1', title: 'Pagamento Recebido', message: 'Pagamento de R$ 856,07 para o empréstimo #loan123 (Ana Silva) foi confirmado.', date: '2025-07-01', type: 'success', read: false },
  { id: 'not2', title: 'Empréstimo Atrasado', message: 'O empréstimo #loan007 (Cliente X) está com 3 dias de atraso.', date: '2025-06-28', type: 'warning', read: false },
  { id: 'not3', title: 'Novo Cliente Cadastrado', message: 'Cliente "Mariana Lima" foi adicionado ao sistema.', date: '2025-06-25', type: 'info', read: true },
  { id: 'not4', title: 'Atualização do Sistema', message: 'Manutenção programada para 20/07/2025 às 02:00.', date: '2025-06-20', type: 'system', read: true },
];

const NotificationItem = ({ notification, onToggleRead, onDelete }) => {
  const { playSound } = useSound();
  let IconComponent = Info;
  let iconColor = 'text-blue-400';
  if (notification.type === 'success') { IconComponent = CheckCheck; iconColor = 'text-green-400'; }
  else if (notification.type === 'warning') { IconComponent = AlertCircle; iconColor = 'text-yellow-400'; }
  else if (notification.type === 'system') { IconComponent = Settings2; iconColor = 'text-purple-400'; }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: {duration: 0.2} }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`p-4 rounded-lg glass-dark flex items-start space-x-3 transition-all ${notification.read ? 'opacity-60 hover:opacity-100' : 'border-l-4 border-blue-500'}`}
      onMouseEnter={() => playSound('hover')}
    >
      <IconComponent className={`w-6 h-6 mt-1 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1">
        <h3 className={`font-semibold ${notification.read ? 'text-gray-300' : 'text-white'}`}>{notification.title}</h3>
        <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-gray-300'}`}>{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">{new Date(notification.date).toLocaleString('pt-BR')}</p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => { playSound('click'); onToggleRead(notification.id); }}
          className={`text-xs ${notification.read ? 'text-gray-400 hover:text-yellow-300' : 'text-blue-300 hover:text-white'}`}
        >
          {notification.read ? 'Não lida' : 'Lida'}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => { playSound('click'); onDelete(notification.id); }}
          className="text-gray-500 hover:text-red-400"
        >
          <Trash2 className="w-3.5 h-3.5"/>
        </Button>
      </div>
    </motion.div>
  );
};


const NotificationsPage = () => {
  const { playSound } = useSound();
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleNotImplemented = (featureName = "Esta funcionalidade") => {
    playSound('click');
    toast({
      title: "🚧 Em Desenvolvimento",
      description: `${featureName} ainda não está implementada. Você pode solicitá-la no próximo prompt! 🚀`,
    });
  };

  const toggleReadStatus = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: !n.read} : n));
  };
  
  const markAllAsRead = () => {
    playSound('click');
    setNotifications(prev => prev.map(n => ({...n, read: true})));
    toast({ title: "Notificações Atualizadas", description: "Todas as notificações foram marcadas como lidas."});
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({ title: "Notificação Removida", description: "A notificação foi removida com sucesso.", variant: "destructive" });
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-4 sm:p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text flex items-center">
          <Bell className="w-8 h-8 mr-3 text-yellow-400" />
          Central de Notificações {unreadCount > 0 && <span className="ml-2 text-sm bg-red-500 text-white rounded-full px-2 py-0.5 animate-pulse">{unreadCount}</span>}
        </h1>
        <div className="flex space-x-2">
            <Button onClick={markAllAsRead} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-yellow-500/50 transition-shadow">
            <CheckCheck className="w-5 h-5 mr-2" /> Marcar Todas como Lidas
            </Button>
            <Button onClick={() => handleNotImplemented("Configurar Notificações")} variant="outline" className="text-gray-300 border-gray-500 hover:bg-gray-500/20 hover:text-white">
                <Settings2 className="w-5 h-5 mr-2" /> Configurações
            </Button>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent pr-2">
            <AnimatePresence>
              {notifications.map(notif => <NotificationItem key={notif.id} notification={notif} onToggleRead={toggleReadStatus} onDelete={deleteNotification} />)}
            </AnimatePresence>
        </div>
      ) : (
        <div className="glass-dark rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
            <img-replace alt="Bell icon with notification dots and abstract background" className="w-40 h-40 mb-6 opacity-70" src="https://images.unsplash.com/photo-1626096438936-11e3fc4015a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-3">Tudo em Dia!</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-5">
            Você não tem novas notificações no momento.
            </p>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsPage;
