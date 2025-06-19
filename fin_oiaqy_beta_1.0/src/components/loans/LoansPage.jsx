
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Search, ChevronRight, FilePlus, DollarSign, Calendar, UserCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSound } from '@/hooks/useSound';
import { toast } from '@/components/ui/use-toast';

const initialLoans = [
  { id: 'loan123', clientName: 'Ana Silva', clientId: '1', principal: 10000, interestRate: 5, termMonths: 12, status: 'Ativo', nextPaymentDate: '2025-08-01', paymentsMade: 6 },
  { id: 'loan456', clientName: 'Carla Dias', clientId: '3', principal: 25000, interestRate: 4.5, termMonths: 24, status: 'Ativo', nextPaymentDate: '2025-07-15', paymentsMade: 12 },
  { id: 'loan1', clientName: 'Ana Silva', clientId: '1', principal: 5000, interestRate: 5, termMonths: 12, status: 'Ativo', nextPaymentDate: '2025-07-01', paymentsMade: 3 },
  { id: 'loan2', clientName: 'Bruno Costa', clientId: '2', principal: 10000, interestRate: 4, termMonths: 24, status: 'Ativo', nextPaymentDate: '2025-07-15', paymentsMade: 5 },
  { id: 'loan3', clientName: 'Bruno Costa', clientId: '2', principal: 3000, interestRate: 6, termMonths: 6, status: 'Pago', nextPaymentDate: '-', paymentsMade: 6 },
];

const LoanCard = ({ loan, onSelect, isSelected }) => {
  const { playSound } = useSound();
  const statusColor = loan.status === 'Ativo' ? 'text-green-400' : loan.status === 'Pago' ? 'text-blue-400' : 'text-orange-400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => { playSound('click'); onSelect(loan); }}
      onMouseEnter={() => playSound('hover')}
      className={`client-card-hover p-4 rounded-2xl glass-dark cursor-pointer relative overflow-hidden transition-all duration-300
                  ${isSelected ? 'border-2 border-blue-400 shadow-lg shadow-blue-500/40 scale-105' : 'border-transparent hover:border-white/20'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Empréstimo ID: {loan.id}</h3>
          <p className="text-sm text-gray-400 flex items-center"><UserCircle className="w-4 h-4 mr-1.5"/>{loan.clientName}</p>
          <p className="text-sm text-gray-300 mt-1">
            Valor: {loan.principal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} - Status: <span className={statusColor}>{loan.status}</span>
          </p>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isSelected ? 'transform scale-125 text-blue-300' : ''}`} />
      </div>
      {isSelected && (
        <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
            layoutId="selected-loan-underline"
        />
      )}
    </motion.div>
  );
};

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const navigate = useNavigate();
  const { playSound } = useSound();

  useEffect(() => {
    setLoans(initialLoans);
    if (initialLoans.length > 0 && window.innerWidth >= 768) {
        setSelectedLoan(initialLoans[0]); 
    }
  }, []);

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          loan.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || loan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectLoan = (loan) => {
    setSelectedLoan(loan);
    if (window.innerWidth < 768) { 
      playSound('swoosh');
      navigate(`/loans/${loan.id}`);
    }
  };
  
  const handleAddNewLoan = () => {
    playSound('click');
    toast({
      title: "🚧 Novo Empréstimo",
      description: "Esta funcionalidade será implementada em breve! 🚀",
    });
  };

  const handleFilterChange = (status) => {
    playSound('click');
    setFilterStatus(status);
  }

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
            <CreditCard className="w-7 h-7 mr-2 text-blue-400" /> Empréstimos
          </h1>
          <Button size="sm" onClick={handleAddNewLoan} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-blue-500/50">
            <FilePlus className="w-4 h-4 mr-2" /> Novo
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por ID ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-dark focus-glow text-white placeholder-gray-500"
            onFocus={() => playSound('typing')}
          />
        </div>
        <div className="flex space-x-2">
            {['Todos', 'Ativo', 'Pago', 'Atrasado'].map(status => (
                <Button 
                    key={status} 
                    variant={filterStatus === status ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleFilterChange(status)}
                    className={`flex-1 transition-all ${filterStatus === status ? 'bg-blue-500 text-white' : 'text-gray-300 border-gray-600 hover:bg-gray-700'}`}
                >
                    {status}
                </Button>
            ))}
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
          <AnimatePresence>
            {filteredLoans.map(loan => (
              <LoanCard 
                key={loan.id} 
                loan={loan} 
                onSelect={handleSelectLoan}
                isSelected={selectedLoan?.id === loan.id}
              />
            ))}
          </AnimatePresence>
          {filteredLoans.length === 0 && (
            <p className="text-center text-gray-400 py-8">Nenhum empréstimo encontrado.</p>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
      {selectedLoan && (
        <motion.div 
          key={selectedLoan.id} 
          className="hidden md:block md:w-3/5 lg:w-2/3 glass rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <LoanDetailContent loan={selectedLoan} />
        </motion.div>
      )}
      </AnimatePresence>
      {!selectedLoan && window.innerWidth >= 768 && ( 
         <div className="hidden md:flex md:w-3/5 lg:w-2/3 glass rounded-2xl p-6 items-center justify-center shadow-xl">
            <div className="text-center">
                <CreditCard size={64} className="mx-auto text-gray-500 mb-4" />
                <p className="text-xl text-gray-400">Selecione um empréstimo para ver os detalhes.</p>
            </div>
         </div>
      )}
    </div>
  );
};

export const LoanDetailContent = ({ loan }) => {
  const { playSound } = useSound();
  const navigate = useNavigate();
  const statusColor = loan.status === 'Ativo' ? 'text-green-400' : loan.status === 'Pago' ? 'text-blue-400' : 'text-orange-400';
  const progress = (loan.paymentsMade / loan.termMonths) * 100;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 glass-dark rounded-2xl mb-6 shadow-md">
        <h2 className="text-2xl font-bold text-white mb-1">Empréstimo ID: {loan.id}</h2>
        <p className="text-blue-300 flex items-center"><UserCircle className="w-4 h-4 mr-2"/>{loan.clientName}</p>
        <p className={`mt-2 text-lg font-semibold ${statusColor}`}>Status: {loan.status}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <InfoPill icon={DollarSign} label="Principal" value={loan.principal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
        <InfoPill icon={Calendar} label="Próx. Venc." value={loan.status === 'Pago' ? '-' : new Date(loan.nextPaymentDate).toLocaleDateString('pt-BR')} />
      </div>
      
      <div className="mb-6">
        <Label className="text-gray-300 text-sm">Progresso ({loan.paymentsMade}/{loan.termMonths})</Label>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
          <motion.div 
            className={`h-2.5 rounded-full ${loan.status === 'Pago' ? 'bg-blue-500' : 'bg-green-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%`}}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>
      </div>
      
      <div className="flex-1 glass-dark rounded-2xl p-6 shadow-md">
        <h3 className="text-xl font-semibold text-white mb-3">Resumo Financeiro</h3>
        <ul className="text-gray-300 space-y-1 text-sm">
            <li>Taxa de Juros: <span className="font-semibold text-white">{loan.interestRate}% a.a.</span></li>
            <li>Prazo Total: <span className="font-semibold text-white">{loan.termMonths} meses</span></li>
            <li>Parcelas Pagas: <span className="font-semibold text-white">{loan.paymentsMade}</span></li>
        </ul>
        <Button 
            onClick={() => { playSound('swoosh'); navigate(`/loans/${loan.id}`); }} 
            className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-purple-500/40"
        >
            Ver Detalhes Completos <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const InfoPill = ({ icon: Icon, label, value }) => (
    <div className="glass p-3 rounded-lg flex items-center space-x-3">
        <Icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
        </div>
    </div>
);

export default LoansPage;
