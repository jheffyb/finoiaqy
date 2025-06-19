
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Percent, DollarSign, FilePlus, CheckCircle, Repeat, Package, HelpCircle as LoaderCircle, UserCircle, Info, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSound } from '@/hooks/useSound';
import { toast } from '@/components/ui/use-toast';
import LoanDetailModal from '@/components/loans/LoanDetailModal';

const mockLoansData = {
  'loan123': { 
    id: 'loan123', 
    clientId: '1', 
    clientName: 'Ana Silva',
    principal: 10000, 
    interestRate: 5, 
    termMonths: 12, 
    startDate: '2024-01-01',
    paymentsMade: 6,
    amortizationType: 'Price', 
    status: 'Ativo',
    nextPaymentDate: '2025-08-01',
    paymentHistory: [
        { date: '2024-02-01', amount: 856.07, type: 'Parcela' },
        { date: '2024-03-01', amount: 856.07, type: 'Parcela' },
        { date: '2024-04-01', amount: 856.07, type: 'Parcela' },
        { date: '2024-05-01', amount: 856.07, type: 'Parcela' },
        { date: '2024-06-01', amount: 856.07, type: 'Parcela' },
        { date: '2024-07-01', amount: 856.07, type: 'Parcela' },
    ]
  },
   'loan456': { 
    id: 'loan456', 
    clientId: '3', 
    clientName: 'Carla Dias',
    principal: 25000, 
    interestRate: 4.5, 
    termMonths: 24, 
    startDate: '2023-06-15',
    paymentsMade: 12,
    amortizationType: 'SAC',
    status: 'Ativo',
    nextPaymentDate: '2025-07-15',
    paymentHistory: Array(12).fill(null).map((_, i) => ({ date: `2023-${String(7+i).padStart(2,'0')}-15`, amount: 1041.67 + (25000 - (i * 1041.67)) * (0.045/12) , type: 'Parcela' }))
  },
  'loan1': { 
    id: 'loan1', 
    clientId: '1', 
    clientName: 'Ana Silva',
    principal: 5000, 
    interestRate: 5, 
    termMonths: 12, 
    startDate: '2023-10-01', 
    status: 'Ativo', 
    paymentsMade: 3, 
    nextPaymentDate: '2025-07-01',
    amortizationType: 'Price',
    paymentHistory: [
        { date: '2023-11-01', amount: 428.04, type: 'Parcela' },
        { date: '2023-12-01', amount: 428.04, type: 'Parcela' },
        { date: '2024-01-01', amount: 428.04, type: 'Parcela' },
    ]
  },
  'loan2': { 
    id: 'loan2', 
    clientId: '2', 
    clientName: 'Bruno Costa',
    principal: 10000, 
    interestRate: 4, 
    termMonths: 24, 
    startDate: '2023-08-15', 
    status: 'Ativo', 
    paymentsMade: 5, 
    nextPaymentDate: '2025-07-15',
    amortizationType: 'SAC',
    paymentHistory: Array(5).fill(null).map((_, i) => ({ date: `2023-${String(9+i).padStart(2,'0')}-15`, amount: 416.67 + (10000 - (i * 416.67)) * (0.04/12) , type: 'Parcela' }))
  },
   'loan3': { 
    id: 'loan3', 
    clientId: '2', 
    clientName: 'Bruno Costa',
    principal: 3000, 
    interestRate: 6, 
    termMonths: 6, 
    startDate: '2024-01-01', 
    status: 'Pago', 
    paymentsMade: 6, 
    nextPaymentDate: '-',
    amortizationType: 'Price',
    paymentHistory: Array(6).fill(null).map((_, i) => ({ date: `2024-${String(2+i).padStart(2,'0')}-01`, amount: 508.83, type: 'Parcela' }))
  },
};


const LoanDetailPage = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { playSound } = useSound();
  
  const [loanDetails, setLoanDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    playSound('swoosh');
    setIsLoading(true);
    setTimeout(() => {
      const fetchedLoan = mockLoansData[loanId];
      if (fetchedLoan) {
        setLoanDetails(fetchedLoan);
      } else {
        toast({ title: "Erro", description: "Empréstimo não encontrado.", variant: "destructive" });
        navigate('/loans'); 
      }
      setIsLoading(false);
    }, 800);
  }, [loanId, navigate, playSound]);

  const monthlyInterestRate = useMemo(() => {
    if (!loanDetails) return 0;
    return loanDetails.interestRate / 100 / 12;
  }, [loanDetails]);

  const remainingPrincipal = useMemo(() => {
    if (!loanDetails) return 0;
    if (loanDetails.status === 'Pago') return 0;

    let principal = loanDetails.principal;
    if (loanDetails.amortizationType === 'Price') {
        const pmt = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanDetails.termMonths)) / (Math.pow(1 + monthlyInterestRate, loanDetails.termMonths) - 1);
        if (isNaN(pmt) || !isFinite(pmt)) return principal;
        let balance = principal;
        for (let i = 0; i < loanDetails.paymentsMade; i++) {
            const interestPayment = balance * monthlyInterestRate;
            const principalPayment = pmt - interestPayment;
            balance -= principalPayment;
        }
        return Math.max(0, balance);
    } else { 
        const principalPaymentPerMonth = principal / loanDetails.termMonths;
        return Math.max(0, principal - (principalPaymentPerMonth * loanDetails.paymentsMade));
    }
  }, [loanDetails, monthlyInterestRate]);

  const accumulatedInterest = useMemo(() => {
    if (!loanDetails) return 0;
    let totalInterestPaid = 0;
    let currentBalance = loanDetails.principal;

    if (loanDetails.amortizationType === 'Price') {
        const pmt = loanDetails.principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanDetails.termMonths)) / (Math.pow(1 + monthlyInterestRate, loanDetails.termMonths) - 1);
        if (isNaN(pmt) || !isFinite(pmt)) return 0;
        for (let i = 0; i < loanDetails.paymentsMade; i++) {
            const interestForPeriod = currentBalance * monthlyInterestRate;
            totalInterestPaid += interestForPeriod;
            const principalForPeriod = pmt - interestForPeriod;
            currentBalance -= principalForPeriod;
        }
    } else { // SAC
        const principalPaymentPerMonth = loanDetails.principal / loanDetails.termMonths;
        for (let i = 0; i < loanDetails.paymentsMade; i++) {
            totalInterestPaid += currentBalance * monthlyInterestRate;
            currentBalance -= principalPaymentPerMonth;
        }
    }
    return totalInterestPaid;
  }, [loanDetails, monthlyInterestRate]);

  const progressPercentage = useMemo(() => {
    if (!loanDetails || loanDetails.principal === 0) return 0;
    if (loanDetails.status === 'Pago') return 100;
    return ((loanDetails.principal - remainingPrincipal) / loanDetails.principal) * 100;
  }, [loanDetails, remainingPrincipal]);


  const handleOpenModal = () => {
    if (loanDetails.status === 'Pago') {
        toast({ title: "Empréstimo Quitado", description: "Este empréstimo já foi totalmente pago.", variant: "default" });
        playSound('error-buzz');
        return;
    }
    playSound('swoosh');
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    playSound('swoosh');
    setIsModalOpen(false);
  };

  const handlePaymentRegistered = (loanId, paymentDetails) => {
    playSound('success-glimmer');
    toast({
      title: "Pagamento Registrado!",
      description: `Pagamento para o empréstimo ${loanId} foi registrado com sucesso.`,
    });
    setLoanDetails(prev => {
        const newPaymentsMade = (prev.paymentsMade || 0) + 1;
        const newStatus = newPaymentsMade >= prev.termMonths ? 'Pago' : prev.status;
        const newPaymentHistory = [...(prev.paymentHistory || []), { date: paymentDetails.date, amount: paymentDetails.amount, type: paymentDetails.type }];
        return {
            ...prev,
            paymentsMade: newPaymentsMade,
            status: newStatus,
            paymentHistory: newPaymentHistory,
        }
    });
  };

  const handleEditLoan = () => {
    playSound('click');
    toast({
      title: "🚧 Editar Empréstimo",
      description: "A funcionalidade de edição de empréstimos será implementada em breve! 🚀",
    });
  };


  if (isLoading || !loanDetails) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoaderCircle className="w-16 h-16 text-blue-400 animate-spin" />
      </div>
    );
  }
  
  const statusColor = loanDetails.status === 'Ativo' ? 'text-green-400' : loanDetails.status === 'Pago' ? 'text-blue-400' : 'text-orange-400';


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => { playSound('swoosh'); navigate(-1); }} className="text-gray-300 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
        </Button>
        <Button variant="outline" onClick={handleEditLoan} className="text-orange-300 border-orange-500 hover:bg-orange-500/20 hover:text-white">
            <Edit className="w-4 h-4 mr-2" /> Editar Empréstimo
        </Button>
      </div>

      <div className="glass-dark p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Empréstimo ID: {loanDetails.id}</h2>
                <p className="text-blue-300 text-lg flex items-center mt-1 cursor-pointer hover:underline" onClick={() => navigate(`/clients/${loanDetails.clientId}`)}>
                    <UserCircle className="w-5 h-5 mr-2"/> Cliente: {loanDetails.clientName} (ID: {loanDetails.clientId})
                </p>
                 <p className={`text-lg font-semibold mt-1 ${statusColor}`}>Status: {loanDetails.status}</p>
            </div>
            <Button 
                onClick={handleOpenModal} 
                className={`mt-4 md:mt-0 bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all
                            ${loanDetails.status === 'Pago' 
                                ? 'from-gray-500 to-gray-600 cursor-not-allowed opacity-70' 
                                : 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-green-500/50'}`}
                disabled={loanDetails.status === 'Pago'}
            >
                <DollarSign className="w-5 h-5 mr-2" /> Registrar Pagamento
            </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InfoCard icon={DollarSign} label="Principal Original" value={loanDetails.principal} format="currency" color="blue" />
          <InfoCard icon={Percent} label="Taxa de Juros Anual" value={loanDetails.interestRate} format="percentage" color="green" />
          <InfoCard icon={Calendar} label="Prazo Total" value={`${loanDetails.termMonths} meses`} color="orange" />
        </div>

        <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Progresso do Empréstimo ({loanDetails.paymentsMade}/{loanDetails.termMonths} parcelas pagas)</h3>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div 
                    className={`h-4 rounded-full ${loanDetails.status === 'Pago' ? 'bg-gradient-to-r from-blue-500 to-sky-400' : 'bg-gradient-to-r from-green-500 to-emerald-400'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%`}}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
            <p className="text-right text-sm text-gray-400 mt-1">{progressPercentage.toFixed(1)}% Amortizado</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LargeInfoCard icon={DollarSign} label="Principal Restante" value={remainingPrincipal} format="currency" />
            <LargeInfoCard icon={Clock} label="Juros Pagos" value={accumulatedInterest} format="currency" note={loanDetails.status !== 'Pago' ? "(Até o momento)" : "(Total)"} />
        </div>
         <p className="text-xs text-gray-500 mt-4 text-center flex items-center justify-center">
            <Info size={14} className="mr-1.5"/> Cálculos de juros e principal restante são baseados nos dados atuais.
        </p>
      </div>
      
      <div className="glass-dark p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold text-white mb-4">Detalhes Adicionais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 mb-4">
            <p><strong>Data de Início:</strong> {new Date(loanDetails.startDate).toLocaleDateString('pt-BR')}</p>
            <p><strong>Próximo Vencimento:</strong> {loanDetails.status === 'Pago' ? 'Quitado' : new Date(loanDetails.nextPaymentDate).toLocaleDateString('pt-BR')}</p>
            <p><strong>Tipo de Amortização:</strong> {loanDetails.amortizationType}</p>
            <p><strong>Parcelas Pagas:</strong> {loanDetails.paymentsMade} de {loanDetails.termMonths}</p>
        </div>
        <h4 className="text-lg font-semibold text-white mb-2">Histórico de Pagamentos</h4>
        {loanDetails.paymentHistory && loanDetails.paymentHistory.length > 0 ? (
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent pr-2">
                {loanDetails.paymentHistory.slice().reverse().map((payment, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm p-2 mb-1 rounded-md bg-white/5 flex justify-between items-center"
                    >
                        <span>{new Date(payment.date).toLocaleDateString('pt-BR')} - {payment.type}</span>
                        <span className="font-semibold text-green-300">{payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </motion.div>
                ))}
            </div>
        ) : (
            <p className="text-gray-400 text-sm">Nenhum pagamento registrado ainda.</p>
        )}
      </div>

      <LoanDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        loan={loanDetails}
        onPaymentRegistered={handlePaymentRegistered}
      />

    </motion.div>
  );
};

const InfoCard = ({ icon: Icon, label, value, format, color }) => {
  const formattedValue = format === 'currency' 
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : format === 'percentage'
    ? `${value}%`
    : value;

  const colorClasses = {
    blue: 'border-blue-500 text-blue-300',
    green: 'border-green-500 text-green-300',
    orange: 'border-orange-500 text-orange-300',
  };

  return (
    <div className={`glass p-4 rounded-xl border-l-4 shadow-sm ${colorClasses[color]}`}>
      <div className="flex items-center text-gray-400 mb-1">
        <Icon className="w-4 h-4 mr-2" />
        <span className="text-sm">{label}</span>
      </div>
      <p className={`text-2xl font-bold text-white`}>{formattedValue}</p>
    </div>
  );
};

const LargeInfoCard = ({ icon: Icon, label, value, format, note }) => {
    const formattedValue = format === 'currency' 
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : value;
    return (
        <div className="glass p-6 rounded-xl text-center shadow-md">
            <Icon className="w-8 h-8 mx-auto text-blue-400 mb-3" />
            <p className="text-sm text-gray-400 uppercase tracking-wider">{label} {note && <span className="text-xs normal-case"> {note}</span>}</p>
            <p className="text-4xl font-bold text-white mt-1">{formattedValue}</p>
        </div>
    );
};


export default LoanDetailPage;
