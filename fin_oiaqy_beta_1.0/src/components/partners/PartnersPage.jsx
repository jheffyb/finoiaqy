import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake as Handshake, PlusCircle, Search, Building, Mail, Phone, ExternalLink, Trash2, Edit3, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSound } from '@/hooks/useSound';

const mockPartners = [
  { id: 'partner1', name: 'Soluções Financeiras Alfa', type: 'Consultoria', contactPerson: 'Carlos Andrade', email: 'carlos.alfa@example.com', phone: '(11) 98765-4321', website: 'https://alfa.example.com', status: 'Ativo', rating: 4.5 },
  { id: 'partner2', name: 'Investimentos Beta Ltda.', type: 'Gestão de Ativos', contactPerson: 'Beatriz Lima', email: 'beatriz.beta@example.com', phone: '(21) 91234-5678', website: 'https://beta.example.com', status: 'Ativo', rating: 5 },
  { id: 'partner3', name: 'Tecnologia Gamma S.A.', type: 'Software Financeiro', contactPerson: 'Daniel Oliveira', email: 'daniel.gamma@example.com', phone: '(31) 95555-5555', website: 'https://gamma.example.com', status: 'Inativo', rating: 3 },
  { id: 'partner4', name: 'Delta Contabilidade Digital', type: 'Contabilidade', contactPerson: 'Eduarda Costa', email: 'eduarda.delta@example.com', phone: '(41) 98888-7777', website: 'https://delta.example.com', status: 'Ativo', rating: 4 },
];

const PartnerCard = ({ partner }) => {
  const { playSound } = useSound();

  const handleAction = (actionName, partnerName) => {
    playSound('click');
    toast({
      title: `Ação: ${actionName}`,
      description: `Funcionalidade para "${actionName} ${partnerName}" ainda não implementada. 🚀`,
    });
  };

  const statusColor = partner.status === 'Ativo' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300';
  const ratingStars = Array(Math.floor(partner.rating)).fill(null).map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
  if (partner.rating % 1 !== 0) {
    ratingStars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-yellow-400 opacity-50" />);
  }


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
        <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>{partner.status}</span>
      </div>
      <p className="text-sm text-gray-400 mb-1 flex items-center"><Building className="w-4 h-4 mr-2 text-indigo-400"/> Tipo: {partner.type}</p>
      <p className="text-sm text-gray-400 mb-1 flex items-center"><Mail className="w-4 h-4 mr-2 text-indigo-400"/> Contato: {partner.contactPerson} ({partner.email})</p>
      <p className="text-sm text-gray-400 mb-3 flex items-center"><Phone className="w-4 h-4 mr-2 text-indigo-400"/> Telefone: {partner.phone}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {ratingStars}
          <span className="text-xs text-yellow-300 ml-1">({partner.rating.toFixed(1)})</span>
        </div>
        {partner.website && (
          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200 text-sm flex items-center" onClick={() => playSound('link')}>
            Visitar Website <ExternalLink className="w-3 h-3 ml-1"/>
          </a>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" size="icon" onClick={() => handleAction('Editar', partner.name)} className="text-gray-400 hover:text-blue-300 hover:bg-blue-500/10">
            <Edit3 className="w-4 h-4"/>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleAction('Excluir', partner.name)} className="text-gray-400 hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4"/>
        </Button>
      </div>
    </motion.div>
  );
};

const PartnersPage = () => {
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = useState('');

  const handleNotImplemented = (featureName = "Esta funcionalidade") => {
    playSound('click');
    toast({
      title: "🚧 Em Desenvolvimento",
      description: `${featureName} ainda não está implementada. Você pode solicitá-la no próximo prompt! 🚀`,
    });
  };
  
  const filteredPartners = mockPartners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Handshake className="w-8 h-8 mr-3 text-indigo-400" />
          Gerenciamento de Parceiros
        </h1>
        <Button onClick={() => handleNotImplemented("Adicionar Novo Parceiro")} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-indigo-500/50 transition-shadow">
          <PlusCircle className="w-5 h-5 mr-2" /> Adicionar Parceiro
        </Button>
      </div>

      <motion.div 
        className="glass-dark p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar parceiro por nome, tipo ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass focus-glow text-white placeholder-gray-500 w-full"
            onFocus={() => playSound('typing')}
          />
        </div>
      </motion.div>

      {filteredPartners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPartners.map(partner => <PartnerCard key={partner.id} partner={partner} />)}
        </div>
      ) : (
        <div className="glass-dark rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
              <img-replace alt="Stylized handshake and network connections" className="w-40 h-40 mb-6 opacity-70" src="https://images.unsplash.com/photo-1520881363902-a0ff471467a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-3">Construa Sua Rede</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-5">
              Nenhum parceiro encontrado com os critérios atuais. Adicione parceiros para expandir suas conexões e oportunidades.
            </p>
        </div>
      )}
       <div className="text-center mt-8">
            <Button onClick={() => handleNotImplemented("Ver Oportunidades de Parceria")} variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-400/20 hover:text-white px-8 py-3 text-base hover-lift">
                <Building className="w-5 h-5 mr-2" /> Explorar Novas Parcerias
            </Button>
        </div>
    </motion.div>
  );
};

export default PartnersPage;