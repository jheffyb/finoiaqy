
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FileBarChart, PlusCircle, Download, CalendarDays, Filter, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSound } from '@/hooks/useSound';

const mockReports = [
  { id: 'rep1', name: 'Relatório Mensal de Performance - Maio 2025', date: '2025-06-01', type: 'Performance', size: '1.2MB' },
  { id: 'rep2', name: 'Análise de Risco de Clientes - Q2 2025', date: '2025-07-05', type: 'Risco', size: '3.5MB' },
  { id: 'rep3', name: 'Projeção de Fluxo de Caixa - 2º Semestre 2025', date: '2025-07-15', type: 'Projeção', size: '800KB' },
  { id: 'rep4', name: 'Relatório de Empréstimos Concedidos - Junho 2025', date: '2025-07-02', type: 'Operacional', size: '2.1MB' },
];

const ReportCard = ({ report }) => {
  const { playSound } = useSound();
  const handleDownload = () => {
    playSound('click');
    toast({
      title: `Download de ${report.name}`,
      description: "Simulando download do relatório... 🚀 (Funcionalidade real em breve)",
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6, scale:1.03, boxShadow: "0 12px 25px rgba(0,0,0,0.35)" }}
      className="glass-dark p-5 rounded-xl card-hover"
      onMouseEnter={() => playSound('hover')}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
            <h3 className="text-lg font-semibold text-white">{report.name}</h3>
            <p className="text-xs text-gray-400 mt-1">Tipo: {report.type} - Tamanho: {report.size}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDownload} className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/20">
            <Download className="w-5 h-5"/>
        </Button>
      </div>
      <p className="text-sm text-gray-300 flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-orange-400"/>Gerado em: {new Date(report.date).toLocaleDateString('pt-BR')}</p>
    </motion.div>
  );
};


const ReportsPage = () => {
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = useState('');

  const handleNotImplemented = (featureName = "Esta funcionalidade") => {
    playSound('click');
    toast({
      title: "🚧 Em Desenvolvimento",
      description: `${featureName} ainda não está implementada. Você pode solicitá-la no próximo prompt! 🚀`,
    });
  };

  const filteredReports = mockReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
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
          <FileBarChart className="w-8 h-8 mr-3 text-orange-400" />
          Relatórios Gerenciais
        </h1>
        <Button onClick={() => handleNotImplemented("Gerar Novo Relatório")} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-orange-500/50 transition-shadow">
          <PlusCircle className="w-5 h-5 mr-2" /> Gerar Novo Relatório
        </Button>
      </div>
      
      <motion.div 
        className="glass-dark p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <p className="text-gray-300">Filtre relatórios por tipo ou data para encontrar o que precisa.</p>
            <Button variant="outline" onClick={() => handleNotImplemented("Filtros Avançados")} className="text-orange-300 border-orange-500 hover:bg-orange-500/20 hover:text-white">
                <Filter className="w-4 h-4 mr-2"/> Aplicar Filtros
            </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar relatório por nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass focus-glow text-white placeholder-gray-500 w-full"
            onFocus={() => playSound('typing')}
          />
        </div>
      </motion.div>

      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map(rep => <ReportCard key={rep.id} report={rep} />)}
        </div>
      ) : (
        <div className="glass-dark rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
            <img-replace alt="Abstract representation of graphs and charts" className="w-40 h-40 mb-6 opacity-70" src="https://images.unsplash.com/photo-1586448354773-30706da80a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-3">Nenhum Relatório Encontrado</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-5">
            Comece gerando seu primeiro relatório ou ajuste os filtros de busca.
            </p>
        </div>
      )}
      <div className="text-center mt-8">
            <Button onClick={() => handleNotImplemented("Ver Modelos de Relatório")} variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-400/20 hover:text-white px-8 py-3 text-base hover-lift">
                <TrendingUp className="w-5 h-5 mr-2" /> Ver Todos os Modelos
            </Button>
        </div>
    </motion.div>
  );
};

export default ReportsPage;
