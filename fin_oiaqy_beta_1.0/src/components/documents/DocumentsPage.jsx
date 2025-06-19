
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, UploadCloud, Search, Folder, FileArchive, Trash2, Download, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSound } from '@/hooks/useSound';

const mockDocuments = [
  { id: 'doc1', name: 'Contrato Cliente Ana Silva.pdf', type: 'Contrato', size: '2.3MB', uploadDate: '2024-02-10', client: 'Ana Silva' },
  { id: 'doc2', name: 'Comprovante Pagamento Empréstimo #123.png', type: 'Comprovante', size: '850KB', uploadDate: '2024-03-05', client: 'Ana Silva' },
  { id: 'doc3', name: 'Termo de Quitação Bruno Costa.docx', type: 'Termo', size: '1.1MB', uploadDate: '2024-05-20', client: 'Bruno Costa' },
  { id: 'doc4', name: 'RG Carla Dias.jpg', type: 'Identidade', size: '1.5MB', uploadDate: '2024-01-15', client: 'Carla Dias' },
];

const DocumentRow = ({ doc }) => {
  const { playSound } = useSound();
  const handleAction = (action) => {
    playSound('click');
    toast({
      title: `Ação: ${action}`,
      description: `Funcionalidade para "${action} ${doc.name}" em breve! 🚀`,
    });
  };

  let fileIcon = <FileText className="w-5 h-5 text-blue-400"/>;
  if (doc.name.endsWith('.pdf')) fileIcon = <FileArchive className="w-5 h-5 text-red-400"/>;
  else if (doc.name.endsWith('.png') || doc.name.endsWith('.jpg')) fileIcon = <FileArchive className="w-5 h-5 text-green-400"/>;
  else if (doc.name.endsWith('.docx')) fileIcon = <FileText className="w-5 h-5 text-sky-400"/>;


  return (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center justify-between p-3 glass-dark rounded-lg hover:bg-white/10 transition-colors"
        onMouseEnter={() => playSound('hover')}
    >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
            {fileIcon}
            <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate" title={doc.name}>{doc.name}</p>
                <p className="text-xs text-gray-400">Cliente: {doc.client} - {doc.size} - Upload: {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</p>
            </div>
        </div>
        <div className="flex space-x-1 sm:space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleAction("Visualizar")} className="text-gray-400 hover:text-blue-300"><Eye className="w-4 h-4"/></Button>
            <Button variant="ghost" size="icon" onClick={() => handleAction("Download")} className="text-gray-400 hover:text-green-300"><Download className="w-4 h-4"/></Button>
            <Button variant="ghost" size="icon" onClick={() => handleAction("Excluir")} className="text-gray-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></Button>
        </div>
    </motion.div>
  );
};


const DocumentsPage = () => {
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = useState('');
  const handleNotImplemented = (featureName = "Esta funcionalidade") => {
    playSound('click');
    toast({
      title: "🚧 Em Desenvolvimento",
      description: `${featureName} ainda não está implementada. Você pode solicitá-la no próximo prompt! 🚀`,
    });
  };

  const filteredDocuments = mockDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.client.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Folder className="w-8 h-8 mr-3 text-purple-400" />
          Gerenciador de Documentos
        </h1>
        <Button onClick={() => handleNotImplemented("Upload de Documento")} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/50 transition-shadow">
          <UploadCloud className="w-5 h-5 mr-2" /> Upload de Arquivo
        </Button>
      </div>

      <motion.div 
        className="glass-dark p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
                type="text"
                placeholder="Buscar por nome do arquivo ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass focus-glow text-white placeholder-gray-500 w-full"
                onFocus={() => playSound('typing')}
            />
        </div>
        {filteredDocuments.length > 0 ? (
            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent pr-2">
                {filteredDocuments.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
            </div>
        ) : (
            <p className="text-center text-gray-400 py-8">Nenhum documento encontrado com os critérios atuais.</p>
        )}
      </motion.div>

      {mockDocuments.length === 0 && !searchTerm && (
        <div className="glass-dark rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
            <img-replace alt="Stylized folder with various documents" className="w-40 h-40 mb-6 opacity-70" src="https://images.unsplash.com/photo-1631889200571-914a93be2041?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-3">Armazenamento Seguro</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-5">
            Guarde contratos, comprovantes e outros arquivos importantes de forma organizada e segura.
            </p>
        </div>
      )}
    </motion.div>
  );
};

export default DocumentsPage;
