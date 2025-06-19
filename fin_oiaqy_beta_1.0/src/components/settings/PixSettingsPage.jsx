
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Key, Settings, Save, Info, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSound } from '@/hooks/useSound';

const PixSettingsPage = () => {
  const { toast } = useToast();
  const { playSound } = useSound();
  const [pixKey, setPixKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedPixKey = localStorage.getItem('c6_pix_key');
    const storedClientId = localStorage.getItem('c6_client_id');
    if (storedPixKey) setPixKey(storedPixKey);
    if (storedClientId) setClientId(storedClientId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound('click');
    setIsSaving(true);
    
    // Simulate API call / saving to localStorage
    setTimeout(() => {
      localStorage.setItem('c6_pix_key', pixKey);
      localStorage.setItem('c6_client_id', clientId);
      setIsSaving(false);
      toast({
        title: 'Configurações Salvas!',
        description: 'Suas credenciais PIX do C6 Bank (Sandbox) foram salvas localmente.',
      });
      playSound('success-glimmer');
    }, 1500);
  };

  const handleNotImplemented = (featureName) => {
    playSound('click');
    toast({
      title: `🚧 ${featureName}`,
      description: 'Esta funcionalidade requer integração de backend e não está implementada. As credenciais inseridas são apenas para fins de demonstração frontend.',
      variant: 'default',
      duration: 7000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="p-6 space-y-8 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text flex items-center">
          <QrCode className="w-8 h-8 mr-3 text-green-400" />
          Configurações PIX C6 Bank
        </h1>
      </div>

      <motion.div 
        className="glass-dark rounded-2xl p-8 shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="bg-yellow-900/30 border border-yellow-600 text-yellow-200 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Ambiente de Sandbox e Segurança</h3>
            <p className="text-sm">
              Você está configurando credenciais para o ambiente de Sandbox do C6 Bank. 
              O <strong className="font-semibold">Client Secret</strong> e a <strong className="font-semibold">Chave Privada RSA</strong> NUNCA devem ser inseridos ou armazenados no frontend. 
              Eles devem ser gerenciados exclusivamente em um backend seguro.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="pixKey" className="text-gray-300 text-sm font-medium flex items-center mb-1">
              <Key className="w-4 h-4 mr-2 text-blue-400"/> Chave PIX (Sandbox)
            </Label>
            <Input
              id="pixKey"
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Ex: 3783a1d0-a3c5-4479-9021-0168681711cb"
              className="glass focus-glow text-white placeholder-gray-500"
              onFocus={() => playSound('typing')}
            />
          </div>

          <div>
            <Label htmlFor="clientId" className="text-gray-300 text-sm font-medium flex items-center mb-1">
              <Settings className="w-4 h-4 mr-2 text-purple-400"/> Client ID (Sandbox)
            </Label>
            <Input
              id="clientId"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Ex: a0d24bac-3dde-46e7-a6d3-4b84ad70f77e"
              className="glass focus-glow text-white placeholder-gray-500"
              onFocus={() => playSound('typing')}
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-blue-500/50 transition-all"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" /> Salvar Configurações (Local)
                </>
              )}
            </Button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-orange-400"/> Próximos Passos e Lembretes
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 list-inside">
                <li className="flex items-start"><AlertTriangle size={16} className="mr-2 mt-0.5 text-red-400 flex-shrink-0"/> <strong className="text-gray-300 mr-1">Backend Seguro:</strong> Para gerar QR Codes e processar pagamentos PIX, uma integração de backend é <strong className="text-red-300">essencial</strong>.</li>
                <li>Para mais informações, acesse o <a href="https://developers.c6bank.com.br/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline inline-flex items-center">Portal do Desenvolvedor C6 Bank <ExternalLink size={14} className="ml-1"/></a>.</li>
                <li>Lembre-se de que o CNPJ <code className="bg-gray-700 px-1 py-0.5 rounded text-xs text-gray-200">54.351.460/0001-93</code> precisa de uma conta PJ (não MEI/ME) no C6 para produção.</li>
            </ul>
             <Button 
              onClick={() => handleNotImplemented("Gerar QR Code de Teste")} 
              variant="outline" 
              className="w-full mt-6 border-green-500 text-green-300 hover:bg-green-500/20 hover:text-white"
            >
              <QrCode className="w-5 h-5 mr-2" /> Testar Geração de QR Code (Simulado)
            </Button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default PixSettingsPage;
