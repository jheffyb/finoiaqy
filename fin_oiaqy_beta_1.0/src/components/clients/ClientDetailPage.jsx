
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FilePlus, CircleDollarSign, PenLine as FilePenLine, User, Mail, CalendarDays, TrendingUp, Landmark, BarChart3, PieChart, HelpCircle as LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScoreBadge from '@/components/clients/ScoreBadge';
import { useSound } from '@/hooks/useSound';
import { toast } from '@/components/ui/use-toast';
import LoanDetailModal from '@/components/loans/LoanDetailModal'; 

const mockClients = {
  '1': { id: '1', name: 'Ana Silva', avatarSeed: 'Ana', email: 'ana.silva@example.com', score: 850, status: 'Excelente', joinDate: '2023-01-15', totalLoans: 3, activeLoans: 1, totalPaid: 15000, phone: '(11) 98765-4321', address: 'Rua das Flores, 123, São Paulo, SP' },
  '2': { id: '2', name: 'Bruno Costa', avatarSeed: 'Bruno', email: 'bruno.costa@example.com', score: 720, status: 'Bom', joinDate: '2022-11-20', totalLoans: 5, activeLoans: 2, totalPaid: 25000, phone: '(21) 91234-5678', address: 'Av. Copacabana, 456, Rio de Janeiro, RJ' },
  '3': { id: '3', name: 'Carla Dias', avatarSeed: 'Carla', email: 'carla.dias@example.com', score: 650, status: 'Regular', joinDate: '2023-03-10', totalLoans: 2, activeLoans: 1, totalPaid: 8000, phone: '(31) 99999-8888', address: 'Praça da Liberdade, 789, Belo Horizonte, MG' },
  '4': { id: '4', name: 'Daniel Faria', avatarSeed: 'Daniel', email: 'daniel.faria@example.com', score: 530, status: 'Alto Risco', joinDate: '2023-05-01', totalLoans: 1, activeLoans: 1, totalPaid: 1500, phone: '(41) 98888-7777', address: 'Rua XV de Novembro, 101, Curitiba, PR' },
  '5': { id: '5', name: 'Elisa Moreira', avatarSeed: 'Elisa', email: 'elisa.moreira@example.com', score: 480, status: 'Inadimplente', joinDate: '2023-02-25', totalLoans: 4, activeLoans: 3, totalPaid: 12000, phone: '(51) 97777-6666', address: 'Av. Borges de Medeiros, 202, Porto Alegre, RS' },
  '6': { id: '6', name: 'Fernando Alves', avatarSeed: 'Fernando', email: 'fernando.alves@example.com', score: 780, status: 'Bom', joinDate: '2022-09-05', totalLoans: 6, activeLoans: 0, totalPaid: 35000, phone: '(61) 96666-5555', address: 'SQS 303 Bloco A, Brasília, DF' },
};

const mockLoans = [
    { id: 'loan1', clientId: '1', amount: 5000, interestRate: 0.05, term: 12, startDate: '2023-10-01', status: 'Ativo', remainingPrincipal: 4200, accumulatedInterest: 150, nextPaymentDate: '2025-07-01', paymentsMade: 3, termMonths: 12, clientName: 'Ana Silva' },
    { id: 'loan2', clientId: '2', amount: 10000, interestRate: 0.04, term: 24, startDate: '2023-08-15', status: 'Ativo', remainingPrincipal: 8500, accumulatedInterest: 320, nextPaymentDate: '2025-07-15', paymentsMade: 5, termMonths: 24, clientName: 'Bruno Costa' },
    { id: 'loan3', clientId: '2', amount: 3000, interestRate: 0.06, term: 6, startDate: '2024-01-01', status: 'Pago', remainingPrincipal: 0, accumulatedInterest: 90, nextPaymentDate: '-', paymentsMade: 6, termMonths: 6, clientName: 'Bruno Costa' },
    { id: 'loan123', clientId: '1', principal: 10000, interestRate: 5, termMonths: 12, startDate: '2024-01-01', paymentsMade: 6, clientName: 'Ana Silva', status: 'Ativo', remainingPrincipal: 5000, accumulatedInterest: 250, nextPaymentDate: '2025-08-01' },
    { id: 'loan456', clientId: '3', principal: 25000, interestRate: 4.5, termMonths: 24, startDate: '2023-06-15', paymentsMade: 12, clientName: 'Carla Dias', status: 'Ativo', remainingPrincipal: 12500, accumulatedInterest: 1000, nextPaymentDate: '2025-07-15' },
];


const ClientDetailPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [client, setClient] = useState(null);
  const [clientLoans, setClientLoans] = useState([]);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [selectedLoanForModal, setSelectedLoanForModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    playSound('swoosh');
    setIsLoading(true);
    setTimeout(() => {
        const fetchedClient = mockClients[clientId];
        if (fetchedClient) {
          setClient(fetchedClient);
          const loansForClient = mockLoans.filter(loan => loan.clientId === clientId).map(l => ({...l, clientName: fetchedClient.name}));
          setClientLoans(loansForClient);
        } else {
          toast({ title: "Erro", description: "Cliente não encontrado.", variant: "destructive" });
          navigate('/clients');
        }
        setIsLoading(false);
    }, 700);
  }, [clientId, navigate, playSound]);

  const handleActionClick = (action) => {
    playSound('click');
    toast({
      title: `🚧 ${action}`,
      description: "Esta funcionalidade será implementada em breve! 🚀",
    });
  };

  const handleOpenLoanModal = (loan) => {
    setSelectedLoanForModal(loan);
    setIsLoanModalOpen(true);
    playSound('swoosh');
  };

  const handleCloseLoanModal = () => {
    setIsLoanModalOpen(false);
    setSelectedLoanForModal(null);
    playSound('swoosh');
  };
  
  const handlePaymentRegistered = (loanId, paymentDetails) => {
    playSound('success-glimmer');
    toast({
      title: "Pagamento Registrado!",
      description: `Pagamento para o empréstimo ${loanId} foi registrado com sucesso.`,
    });

    setClientLoans(prevLoans => prevLoans.map(l => l.id === loanId ? {...l, paymentsMade: (l.paymentsMade || 0) + 1, status: ((l.paymentsMade || 0) + 1) === l.termMonths ? 'Pago' : l.status } : l));

    if (client) {
        const newScore = Math.min(client.score + 50, 990); 
        setClient(prev => ({...prev, score: newScore, status: getStatusFromScore(newScore)}));
        playSound('score-increase');
    }
  };

  const getStatusFromScore = (score) => {
    if (score >= 800) return 'Excelente';
    if (score >= 700) return 'Bom';
    if (score >= 600) return 'Regular';
    if (score >= 500) return 'Alto Risco';
    return 'Inadimplente';
  };


  if (isLoading || !client) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoaderCircle className="w-16 h-16 text-blue-400 animate-spin" />
      </div>
    );
  }

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${client.avatarSeed}&backgroundColor=4A90E2,50E3C2,F39C12&backgroundType=gradientLinear&fontSize=40&radius=50`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => { playSound('swoosh'); navigate('/clients'); }} className="text-gray-300 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Clientes
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 p-6 glass-dark rounded-2xl shadow-xl">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <img-replace src={avatarUrl} alt={client.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-blue-400 shadow-lg object-cover" />
        </motion.div>
        <div className="text-center md:text-left flex-1">
          <motion.h2 
            initial={{ opacity:0, y:10 }} animate={{opacity:1, y:0}} transition={{delay:0.2}}
            className="text-4xl font-bold text-white mb-1">{client.name}
          </motion.h2>
          <motion.p 
            initial={{ opacity:0, y:10 }} animate={{opacity:1, y:0}} transition={{delay:0.3}}
            className="text-blue-300 text-lg mb-3 flex items-center justify-center md:justify-start"><Mail className="w-4 h-4 mr-2"/>{client.email}
          </motion.p>
          <motion.div initial={{ opacity:0, y:10 }} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="mb-3">
            <ScoreBadge score={client.score} status={client.status} large />
          </motion.div>
          <motion.p 
            initial={{ opacity:0, y:10 }} animate={{opacity:1, y:0}} transition={{delay:0.5}}
            className="text-sm text-gray-400 mt-1 flex items-center justify-center md:justify-start"><CalendarDays className="w-4 h-4 mr-2"/>Membro desde: {new Date(client.joinDate).toLocaleDateString('pt-BR')}
          </motion.p>
           <motion.p 
            initial={{ opacity:0, y:10 }} animate={{opacity:1, y:0}} transition={{delay:0.6}}
            className="text-sm text-gray-400 mt-1 flex items-center justify-center md:justify-start">Telefone: {client.phone}
          </motion.p>
           <motion.p 
            initial={{ opacity:0, y:10 }} animate={{opacity:1, y:0}} transition={{delay:0.7}}
            className="text-sm text-gray-400 mt-1 flex items-center justify-center md:justify-start">Endereço: {client.address}
          </motion.p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity:0, y:20 }} animate={{opacity:1, y:0}} transition={{delay:0.3}}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Button onClick={() => handleActionClick("Novo Empréstimo")} className="glass hover:bg-blue-500/30 text-white py-3 text-base hover-lift shadow-md hover:shadow-blue-500/40">
          <FilePlus className="w-5 h-5 mr-2" /> Novo Empréstimo
        </Button>
        <Button onClick={() => handleActionClick("Registrar Pagamento Geral")} className="glass hover:bg-green-500/30 text-white py-3 text-base hover-lift shadow-md hover:shadow-green-500/40">
          <CircleDollarSign className="w-5 h-5 mr-2" /> Registrar Pagamento
        </Button>
        <Button onClick={() => handleActionClick("Editar Cliente")} className="glass hover:bg-orange-500/30 text-white py-3 text-base hover-lift shadow-md hover:shadow-orange-500/40">
          <FilePenLine className="w-5 h-5 mr-2" /> Editar Cliente
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity:0, y:20 }} animate={{opacity:1, y:0}} transition={{delay:0.4}}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard icon={Landmark} label="Total Empréstimos" value={client.totalLoans} />
        <StatCard icon={TrendingUp} label="Empréstimos Ativos" value={client.activeLoans} />
        <StatCard icon={CircleDollarSign} label="Total Pago" value={client.totalPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
      </motion.div>

      <motion.div 
        initial={{ opacity:0, y:20 }} animate={{opacity:1, y:0}} transition={{delay:0.5}}
        className="glass-dark p-6 rounded-2xl"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Empréstimos do Cliente</h3>
        {clientLoans.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent pr-2">
            {clientLoans.map(loan => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="glass p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleOpenLoanModal(loan)}
                onMouseEnter={() => playSound('hover')}
              >
                <div>
                  <p className="font-semibold text-white">Empréstimo ID: {loan.id}</p>
                  <p className="text-sm text-gray-300">Valor: {(loan.amount || loan.principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} - Status: <span className={loan.status === 'Ativo' ? 'text-green-400' : loan.status === 'Pago' ? 'text-blue-400' : 'text-orange-400'}>{loan.status}</span></p>
                </div>
                <Button variant="outline" size="sm" className="text-xs border-blue-400 text-blue-300 hover:bg-blue-400/20 hover:text-white">
                  Ver Detalhes
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">Nenhum empréstimo encontrado para este cliente.</p>
        )}
      </motion.div>
      
      {selectedLoanForModal && (
        <LoanDetailModal
          isOpen={isLoanModalOpen}
          onClose={handleCloseLoanModal}
          loan={selectedLoanForModal}
          onPaymentRegistered={handlePaymentRegistered}
        />
      )}
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="glass-dark p-4 rounded-xl text-center shadow-md">
    <Icon className="w-7 h-7 mx-auto text-blue-400 mb-2" />
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export default ClientDetailPage;
