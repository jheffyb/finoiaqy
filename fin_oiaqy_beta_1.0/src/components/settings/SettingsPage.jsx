
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, ShieldCheck, QrCode, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();

  const handleNotImplemented = (featureName = "Esta funcionalidade") => {
    playSound('click');
    toast({
      title: "🚧 Em Desenvolvimento",
      description: `${featureName} ainda não está implementada. Você pode solicitá-la no próximo prompt! 🚀`,
    });
  };

  const navigateToPixSettings = () => {
    playSound('swoosh');
    navigate('/settings/pix');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text flex items-center">
          <Settings className="w-8 h-8 mr-3 text-gray-400" />
          Configurações Gerais
        </h1>
        <Button onClick={() => handleNotImplemented("Salvar Alterações Gerais")} className="bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white shadow-lg hover:shadow-gray-500/50 transition-shadow">
          <Save className="w-5 h-5 mr-2" /> Salvar Alterações
        </Button>
      </div>

      <div className="space-y-6">
        {/* Card para Configurações PIX */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="glass-dark rounded-2xl p-6 shadow-lg hover-lift-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <QrCode className="w-7 h-7 mr-3 text-green-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">Pagamentos PIX (C6 Bank)</h2>
                <p className="text-sm text-gray-400">Configure suas credenciais PIX do C6 Bank.</p>
              </div>
            </div>
            <Button variant="outline" onClick={navigateToPixSettings} className="border-green-500 text-green-300 hover:bg-green-500/20 hover:text-white">
              Configurar <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>

        {/* Card para Configurações de Segurança (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass-dark rounded-2xl p-6 shadow-lg hover-lift-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="w-7 h-7 mr-3 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">Segurança da Conta</h2>
                <p className="text-sm text-gray-400">Gerencie senhas e autenticação de dois fatores.</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleNotImplemented("Configurações de Segurança")} className="border-blue-500 text-blue-300 hover:bg-blue-500/20 hover:text-white">
              Gerenciar <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
        
        {/* Outras Configurações (Placeholder) */}
         <div className="glass-dark rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
            <img-replace alt="Abstract representation of gears and cogs" className="w-40 h-40 mb-6 opacity-70" src="https://images.unsplash.com/photo-1427818793937-072ff7a01758?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-3">Mais Configurações em Breve</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-5">
            Ajuste preferências de notificação, temas e outras opções da sua conta aqui.
            </p>
            <Button onClick={() => handleNotImplemented("Configurações Adicionais")} variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-400/20 hover:text-white">
            Explorar Opções
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
