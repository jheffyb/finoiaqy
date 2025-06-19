
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';


const Dashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kpiData, setKpiData] = useState({
    totalInvestido: 0,
    lucroMensal: 0,
    totalClientes: 0,
    emprestimosAtivos: 0
  });
  const { playSound } = useSound();

  useEffect(() => {
    const targetValues = {
      totalInvestido: 2847500,
      lucroMensal: 45680,
      totalClientes: 127,
      emprestimosAtivos: 89
    };

    const animateValues = () => {
      const duration = 2000; 
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setKpiData({
          totalInvestido: Math.floor(targetValues.totalInvestido * easeOutQuart),
          lucroMensal: Math.floor(targetValues.lucroMensal * easeOutQuart),
          totalClientes: Math.floor(targetValues.totalClientes * easeOutQuart),
          emprestimosAtivos: Math.floor(targetValues.emprestimosAtivos * easeOutQuart)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setKpiData(targetValues);
        }
      }, stepDuration);
    };

    setTimeout(animateValues, 500);
  }, []);

  const handleLogout = () => {
    playSound('click');
    onLogout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    playSound('click');
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <KPICard
              title="Total Investido"
              value={kpiData.totalInvestido}
              format="currency"
              icon="Landmark"
              color="blue"
              trend="+12.5%"
            />
            <KPICard
              title="Lucro Mensal"
              value={kpiData.lucroMensal}
              format="currency"
              icon="TrendingUp"
              color="green"
              trend="+8.2%"
            />
            <KPICard
              title="Total de Clientes"
              value={kpiData.totalClientes}
              format="number"
              icon="Users"
              color="orange"
              trend="+15.3%"
            />
            <KPICard
              title="Empréstimos Ativos"
              value={kpiData.emprestimosAtivos}
              format="number"
              icon="CreditCard"
              color="purple"
              trend="+5.7%"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <ChartCard
              title="Evolução dos Investimentos"
              type="line"
              data={[
                { month: 'Jan', value: 2100000 },
                { month: 'Fev', value: 2250000 },
                { month: 'Mar', value: 2400000 },
                { month: 'Abr', value: 2580000 },
                { month: 'Mai', value: 2720000 },
                { month: 'Jun', value: 2847500 }
              ]}
            />
            <ChartCard
              title="Distribuição por Categoria"
              type="doughnut"
              data={[
                { label: 'Empréstimos Pessoais', value: 45 },
                { label: 'Financiamento Imobiliário', value: 30 },
                { label: 'Capital de Giro', value: 15 },
                { label: 'Outros', value: 10 }
              ]}
            />
          </motion.div>
        </main>
      </div>

      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
