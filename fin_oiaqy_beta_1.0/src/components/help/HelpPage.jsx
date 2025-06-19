
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, BookOpen, Search, LifeBuoy, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSound } from '@/hooks/useSound';

const faqItems = [
  { q: "Como cadastrar um novo cliente?", a: "Vá para a seção 'Clientes' no menu lateral. Clique no botão 'Adicionar' no canto superior direito da lista de clientes. Preencha os dados solicitados no formulário e clique em 'Salvar Cliente'." },
  { q: "Como registrar um pagamento de empréstimo?", a: "Acesse a página de 'Detalhes do Cliente' ou 'Detalhes do Empréstimo'. Clique no botão 'Registrar Pagamento' (para um empréstimo específico) ou 'Registrar Pagamento Geral'. Preencha o valor, data e tipo no modal que aparecer e confirme." },
  { q: "Onde configuro as credenciais PIX?", a: "No menu lateral, vá em 'Configurações'. Dentro da página de Configurações, clique na opção 'PIX C6 Bank'. Lá você poderá inserir sua Chave PIX e Client ID do ambiente Sandbox." },
  { q: "Como funciona o cálculo de score do cliente?", a: "O score do cliente é atualizado dinamicamente com base em seu histórico de pagamentos e outras interações financeiras. Pagamentos em dia e quitações antecipadas tendem a aumentar o score, enquanto atrasos podem diminuí-lo. A atualização é simulada no frontend por enquanto." },
  { q: "Posso exportar relatórios?", a: "Sim, na seção 'Relatórios', cada relatório listado possui um ícone de download. Clicando nele, o sistema simulará o download do arquivo (a funcionalidade completa de geração e exportação será implementada)." },
];

const HelpPage = () => {
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = useState('');

  const handleNotImplemented = (featureName = "Esta funcionalidade") => {
    playSound('click');
    toast({
      title: "🚧 Em Desenvolvimento",
      description: `${featureName} ainda não está implementada. Você pode solicitá-la no próximo prompt! 🚀`,
    });
  };

  const filteredFaqItems = faqItems.filter(item => 
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text flex items-center">
          <LifeBuoy className="w-8 h-8 mr-3 text-teal-400" />
          Central de Ajuda
        </h1>
        <Button onClick={() => handleNotImplemented("Abrir Ticket de Suporte")} className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-teal-500/50 transition-shadow">
          <MessageSquare className="w-5 h-5 mr-2" /> Contatar Suporte
        </Button>
      </div>

      <motion.div 
        className="glass-dark p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center"><Search className="w-5 h-5 mr-2 text-teal-300"/> Procurar na Base de Conhecimento</h2>
        <Input 
            type="search" 
            placeholder="Digite sua dúvida aqui..." 
            className="w-full glass focus-glow text-white placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => playSound('typing')}
        />
      </motion.div>

      <motion.div 
        className="glass-dark p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-teal-300"/> Perguntas Frequentes (FAQ)</h2>
        {filteredFaqItems.length > 0 ? (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent pr-2">
              {filteredFaqItems.map((item, index) => (
                  <details key={index} className="group glass p-3 rounded-lg hover:bg-white/5 transition-colors" onToggle={() => playSound('click')}>
                      <summary className="font-medium text-gray-200 cursor-pointer list-none flex justify-between items-center">
                          {item.q}
                          <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform"/>
                      </summary>
                      <p className="text-gray-400 text-sm mt-2 pt-2 border-t border-white/10">{item.a}</p>
                  </details>
              ))}
          </div>
        ) : (
           <p className="text-center text-gray-400 py-8">Nenhuma pergunta frequente encontrada para "{searchTerm}".</p>
        )}
      </motion.div>
      
      {faqItems.length === 0 && !searchTerm && (
        <div className="glass-dark rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
            <img-replace alt="Question mark, lifebuoy and support icons" className="w-40 h-40 mb-6 opacity-70" src="https://images.unsplash.com/photo-1691269515965-fbf73d788cc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-3">Precisa de Ajuda?</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-5">
            Nossa seção de FAQ está sendo construída. Em breve, você encontrará respostas aqui.
            </p>
        </div>
      )}
    </motion.div>
  );
};

export default HelpPage;
