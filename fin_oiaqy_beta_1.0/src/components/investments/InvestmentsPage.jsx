
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, PlusCircle, BarChart2, PieChart, Briefcase, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSound } from '@/hooks/useSound';

const mockInvestments = [
  { id: 'inv1', name: 'Fundo Renda Fixa Alpha', type: 'Renda Fixa', amount: 50000, rentability: 5.2, risk: 'Baixo', lastUpdate: '2025-06-15' },
  { id: 'inv2', name: 'Ações Tech Growth', type: 'Renda Variável', amount: 75000, rentability: 12.5, risk: 'Alto', lastUpdate: '2025-06-18' },
  { id: 'inv3', name: 'Tesouro Selic 2029', type: 'Tesouro Direto', amount: 30000, rentability: 10.1, risk: 'Muito Baixo', lastUpdate: '2025-06-10' },
  { id: 'inv4', name: 'CDB Banco Crystal', type: 'Renda Fixa', amount: 100000, rentability: 11.5, risk: 'Baixo', lastUpdate: '2025-06-17' },
];

const InvestmentCard = ({ investment }) => {
  const { playSound } = useSound();
  let riskColor = 'text-gray-400';
  if (investment.risk === 'Baixo') riskColor = 'text-green-400';
  else if (investment.risk === 'Muito Baixo') riskColor = 'text-emerald-400';
  else if (investment.risk === 'Médio') riskColor = 'text-yellow-400';
  else if (investment.risk === 'Alto') riskColor = 'text-red-400';

  const handleCardClick = () => {
    playSound('click');
    toast({
      title: `Detalhes de ${investment.name}`,
      description: "Visualização detalhada do investimento em breve! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6, scale:1.03, boxShadow: "0 12px 25px rgba(0,0,0,0.35)" }}
      className="glass-dark p-5 rounded-xl cursor-pointer card-hover"
      onClick={handleCardClick}
      onMouseEnter={() => playSound('hover')}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white">{investment.name}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/10 ${riskColor}`}>{investment.risk}</span>
      </div>
      <p className="text-sm text-gray-400 mb-1">{investment.type}</p>
      <p className="text-2xl font-bold text-green-300 mb-1">{investment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      <div className="flex justify-between items-end">
        <p className="text-sm text-gray-300">Rentabilidade Anual: <span className="font-semibold text-cyan-300">{investment.rentability}%</span></p>
        <p className="text-xs text-gray-500">Atualizado: {new Date(investment.lastUpdate).toLocaleDateString('pt-BR')}</p>
      </div>
    </motion.div>
  );
};

const InvestmentsPage = () => {
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleNotImplemented = (featureName = "Esta funcionalidade") => {
    playSound('click');
    toast({
      title: "🚧 Em Desenvolvimento",
      description: `${featureName} ainda não está implementada. Você pode solicitá-la no próximo prompt! 🚀`,
    });
  };

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  
  const filteredInvestments = mockInvestments.filter(inv => 
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-4 sm:p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text flex items-center">
          <Briefcase className="w-8 h-8 mr-3 text-green-400" />
          Meus Investimentos
        </h1>
        <Button onClick={() => handleNotImplemented("Novo Investimento")} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-green-500/50 transition-shadow">
          <PlusCircle className="w-5 h-5 mr-2" /> Adicionar Investimento
        </Button>
      </div>

      <motion.div 
        className="glass-dark p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div>
                <p className="text-gray-400 text-sm">Total Investido</p>
                <p className="text-4xl font-bold text-white">{totalInvested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleNotImplemented("Ver Rentabilidade")} className="text-cyan-300 border-cyan-500 hover:bg-cyan-500/20 hover:text-white">
                    <TrendingUp className="w-4 h-4 mr-2"/> Rentabilidade
                </Button>
                <Button variant="outline" onClick={() => handleNotImplemented("Ver Alocação")} className="text-purple-300 border-purple-500 hover:bg-purple-500/20 hover:text-white">
                    <PieChart className="w-4 h-4 mr-2"/> Alocação
                </Button>
            </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar investimento por nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass focus-glow text-white placeholder-gray-500 w-full"
            onFocus={() => playSound('typing')}
          />
        </div>
      </motion.div>

      {filteredInvestments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInvestments.map(inv => <InvestmentCard key={inv.id} investment={inv} />)}
        </div>
      ) : (
        <div className="glass-dark rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
            <img-replace alt="Piggy bank with coins and growth chart" className="w-40 h-40 mb-6 opacity-70" src="https://images.unsplash.com/photo-1669951584070-468c7a64634c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-3">Comece a Investir</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-5">
            Você ainda não possui investimentos registrados ou nenhum corresponde à sua busca. Adicione seu primeiro investimento para acompanhar aqui.
            </p>
        </div>
      )}
       <div className="text-center mt-8">
            <Button onClick={() => handleNotImplemented("Explorar Opções de Investimento")} variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-400/20 hover:text-white px-8 py-3 text-base hover-lift">
                <BarChart2 className="w-5 h-5 mr-2" /> Ver Todos os Produtos
            </Button>
        </div>
    </motion.div>
  );
};

export default InvestmentsPage;
