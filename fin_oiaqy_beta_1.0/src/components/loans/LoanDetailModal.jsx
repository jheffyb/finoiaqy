
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CheckCircle, Repeat, Package, Calendar, HelpCircle as LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSound } from '@/hooks/useSound';
import { toast } from '@/components/ui/use-toast';

const paymentTypes = [
  { id: 'amortization', label: 'Amortização', icon: Package },
  { id: 'renewal', label: 'Renovação', icon: Repeat },
  { id: 'settlement', label: 'Quitação', icon: CheckCircle },
];

const LoanDetailModal = ({ isOpen, onClose, loan, onPaymentRegistered }) => {
  const { playSound } = useSound();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPaymentType, setSelectedPaymentType] = useState('amortization');
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (loan && selectedPaymentType === 'settlement') {
      // Simplified: set to remaining principal. Real calculation would be more complex.
      const remaining = loan.principal * (1 - (loan.paymentsMade / loan.termMonths)); // Very rough estimate
      setPaymentAmount(remaining > 0 ? remaining.toFixed(2) : '');
    } else if (selectedPaymentType !== 'settlement') {
       setPaymentAmount(''); // Clear for other types or if loan changes
    }
  }, [selectedPaymentType, loan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    playSound('click');

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      playSound('error');
      toast({ title: "Valor Inválido", description: "Por favor, insira um valor de pagamento válido.", variant: "destructive" });
      return;
    }
    if (!paymentDate) {
      playSound('error');
      toast({ title: "Data Inválida", description: "Por favor, selecione uma data de pagamento.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onPaymentRegistered(loan.id, { 
        amount: parseFloat(paymentAmount), 
        date: paymentDate, 
        type: selectedPaymentType,
        remarks: remarks,
      });
      onClose(); // Close modal after successful registration
      setPaymentAmount('');
      setRemarks('');
      setSelectedPaymentType('amortization');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="glass-dark rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">Registrar Pagamento</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="paymentType" className="text-gray-300 mb-2 block">Tipo de Pagamento</Label>
              <div className="grid grid-cols-3 gap-2">
                {paymentTypes.map(pt => {
                  const Icon = pt.icon;
                  return (
                    <Button
                      key={pt.id}
                      type="button"
                      variant={selectedPaymentType === pt.id ? "default" : "outline"}
                      onClick={() => { playSound('click'); setSelectedPaymentType(pt.id); }}
                      className={`py-3 text-sm transition-all duration-200 ${selectedPaymentType === pt.id ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                    >
                      <Icon className="w-4 h-4 mr-2" /> {pt.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentAmount" className="text-gray-300 mb-2 block">Valor do Pagamento (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 glass focus-glow text-white placeholder-gray-500"
                    required
                    disabled={selectedPaymentType === 'settlement'}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentDate" className="text-gray-300 mb-2 block">Data do Pagamento</Label
                >
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="pl-10 glass focus-glow text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
                <Label htmlFor="remarks" className="text-gray-300 mb-2 block">Observações (Opcional)</Label>
                <textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Ex: Pagamento adiantado, acordo especial..."
                    className="w-full h-24 p-3 glass focus-glow text-white placeholder-gray-500 rounded-xl resize-none"
                />
            </div>


            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover-lift"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                  Registrando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Pagamento
                </div>
              )}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoanDetailModal;
