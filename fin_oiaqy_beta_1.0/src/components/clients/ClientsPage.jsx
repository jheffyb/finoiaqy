
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Users, ChevronRight, FilePlus, CircleDollarSign, PenLine as FilePenLine, Mail, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSound } from '@/hooks/useSound';
import { toast } from '@/components/ui/use-toast';
import ScoreBadge from '@/components/clients/ScoreBadge';

const initialClients = [
  { id: '1', name: 'Ana Silva', avatarSeed: 'Ana', email: 'ana.silva@example.com', score: 850, status: 'Excelente', lastActivity: '2025-06-15' },
  { id: '2', name: 'Bruno Costa', avatarSeed: 'Bruno', email: 'bruno.costa@example.com', score: 720, status: 'Bom', lastActivity: '2025-06-10' },
  { id: '3', name: 'Carla Dias', avatarSeed: 'Carla', email: 'carla.dias@example.com', score: 650, status: 'Regular', lastActivity: '2025-05-20' },
  { id: '4', name: 'Daniel Faria', avatarSeed: 'Daniel', email: 'daniel.faria@example.com', score: 530, status: 'Alto Risco', lastActivity: '2025-06-01' },
  { id: '5', name: 'Elisa Moreira', avatarSeed: 'Elisa', email: 'elisa.moreira@example.com', score: 480, status: 'Inadimplente', lastActivity: '2025-04-10' },
  { id: '6', name: 'Fernando Alves', avatarSeed: 'Fernando', email: 'fernando.alves@example.com', score: 780, status: 'Bom', lastActivity: '2025-06-18' },
];

const ClientCard = ({ client, onSelect, isSelected }) => {
  const { playSound } = useSound();
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${client.avatarSeed}&backgroundColor=4A90E2,50E3C2,F39C12&backgroundType=gradientLinear&fontSize=40&radius=50`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => { playSound('click'); onSelect(client); }}
      onMouseEnter={() => playSound('hover')}
      className={`client-card-hover p-4 rounded-2xl glass-dark cursor-pointer relative overflow-hidden transition-all duration-300
                  ${isSelected ? 'border-2 border-blue-400 shadow-lg shadow-blue-500/40 scale-105' : 'border-transparent hover:border-white/20'}`}
    >
      <div className="flex items-center space-x-4">
        <img-replace src={avatarUrl} alt={client.name} className="w-12 h-12 rounded-full border-2 border-white/30 object-cover" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{client.name}</h3>
          <p className="text-sm text-gray-400 flex items-center"><Mail className="w-3 h-3 mr-1.5"/>{client.email}</p>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isSelected ? 'transform scale-125 text-blue-300' : ''}`} />
      </div>
      {isSelected && (
        <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
            layoutId="selected-client-underline"
        />
      )}
    </motion.div>
  );
};

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();
  const { playSound } = useSound();

  useEffect(() => {
    setClients(initialClients);
    if (initialClients.length > 0 && window.innerWidth >= 768) {
        setSelectedClient(initialClients[0]); // Select first client by default on larger screens
    }
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    if (window.innerWidth < 768) { // For mobile, navigate immediately
      playSound('swoosh');
      navigate(`/clients/${client.id}`);
    }
  };
  
  const handleAddNewClient = () => {
    playSound('click');
    toast({
      title: "🚧 Adicionar Novo Cliente",
      description: "Esta funcionalidade será implementada em breve! 🚀",
    });
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <motion.div 
        layout
        className="w-full md:w-2/5 lg:w-1/3 flex flex-col space-y-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text flex items-center">
            <Users className="w-7 h-7 mr-2 text-blue-400" /> Clientes
          </h1>
          <Button size="sm" onClick={handleAddNewClient} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-blue-500/50">
            <UserPlus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-dark focus-glow text-white placeholder-gray-500"
            onFocus={() => playSound('typing')}
          />
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
          <AnimatePresence>
            {filteredClients.map(client => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onSelect={handleSelectClient}
                isSelected={selectedClient?.id === client.id}
              />
            ))}
          </AnimatePresence>
          {filteredClients.length === 0 && (
            <p className="text-center text-gray-400 py-8">Nenhum cliente encontrado.</p>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
      {selectedClient && (
        <motion.div 
          key={selectedClient.id} // Add key for AnimatePresence to detect change
          className="hidden md:block md:w-3/5 lg:w-2/3 glass rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <ClientDetailContent client={selectedClient} />
        </motion.div>
      )}
      </AnimatePresence>
      {!selectedClient && window.innerWidth >= 768 && ( // Only show placeholder on larger screens if no client is selected
         <div className="hidden md:flex md:w-3/5 lg:w-2/3 glass rounded-2xl p-6 items-center justify-center shadow-xl">
            <div className="text-center">
                <Users size={64} className="mx-auto text-gray-500 mb-4" />
                <p className="text-xl text-gray-400">Selecione um cliente para ver os detalhes.</p>
            </div>
         </div>
      )}
    </div>
  );
};

export const ClientDetailContent = ({ client }) => {
  const { playSound } = useSound();
  const navigate = useNavigate();
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${client.avatarSeed}&backgroundColor=4A90E2,50E3C2,F39C12&backgroundType=gradientLinear&fontSize=40&radius=50`;

  const handleActionClick = (action) => {
    playSound('click');
    toast({
      title: `🚧 ${action}`,
      description: "Esta funcionalidade será implementada em breve! 🚀",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6 p-6 glass-dark rounded-2xl mb-6 shadow-md">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <img-replace src={avatarUrl} alt={client.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-blue-400 shadow-lg object-cover" />
        </motion.div>
        <div className="text-center sm:text-left mt-4 sm:mt-0">
          <h2 className="text-3xl font-bold text-white">{client.name}</h2>
          <p className="text-blue-300 flex items-center justify-center sm:justify-start"><Mail className="w-4 h-4 mr-2"/>{client.email}</p>
          <div className="mt-3">
            <ScoreBadge score={client.score} status={client.status} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Última atividade: {new Date(client.lastActivity).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Button onClick={() => handleActionClick("Novo Empréstimo")} className="glass hover:bg-blue-500/30 text-white py-3 shadow-sm hover:shadow-blue-500/30">
          <FilePlus className="w-5 h-5 mr-2" /> Novo Empréstimo
        </Button>
        <Button onClick={() => handleActionClick("Registrar Pagamento")} className="glass hover:bg-green-500/30 text-white py-3 shadow-sm hover:shadow-green-500/30">
          <CircleDollarSign className="w-5 h-5 mr-2" /> Registrar Pagamento
        </Button>
        <Button onClick={() => handleActionClick("Editar Cliente")} className="glass hover:bg-orange-500/30 text-white py-3 shadow-sm hover:shadow-orange-500/30">
          <FilePenLine className="w-5 h-5 mr-2" /> Editar Cliente
        </Button>
      </div>
      
      <div className="flex-1 glass-dark rounded-2xl p-6 shadow-md">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-purple-400"/>Resumo Financeiro</h3>
        <p className="text-gray-400 mb-2">
          Informações detalhadas sobre o histórico de empréstimos, pagamentos e outras atividades financeiras do cliente.
        </p>
        <ul className="text-gray-300 space-y-1 text-sm">
            <li>Total Empréstimos: <span className="font-semibold text-white">{client.totalLoans || 0}</span></li>
            <li>Empréstimos Ativos: <span className="font-semibold text-white">{client.activeLoans || 0}</span></li>
            <li>Total Pago: <span className="font-semibold text-white">{(client.totalPaid || 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></li>
        </ul>
        <Button 
            onClick={() => { playSound('swoosh'); navigate(`/clients/${client.id}`); }} 
            className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-purple-500/40"
        >
            Ver Perfil Completo <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};


export default ClientsPage;
