
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';

const DashboardPage = () => {
  const [kpiData, setKpiData] = useState({
    totalInvestido: 0,
    lucroMensal: 0,
    totalClientes: 0,
    emprestimosAtivos: 0
  });

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

    setTimeout(animateValues, 200); 
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Visão Geral</h1>
        <p className="text-gray-400">Seu resumo financeiro em tempo real.</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
          trend="+15 novos"
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
          title="Distribuição por Categoria de Empréstimo"
          type="doughnut"
          data={[
            { label: 'Pessoais', value: 45 },
            { label: 'Imobiliário', value: 30 },
            { label: 'Capital de Giro', value: 15 },
            { label: 'Outros', value: 10 }
          ]}
        />
      </motion.div>
    </div>
  );
};

export default DashboardPage;
