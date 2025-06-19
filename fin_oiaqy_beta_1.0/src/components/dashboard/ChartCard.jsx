
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { toast } from '@/components/ui/use-toast';

const ChartCard = ({ title, type, data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { playSound } = useSound();

  const handleChartClick = () => {
    playSound('click');
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "Os gráficos interativos estarão disponíveis em breve! 🚀"
    });
  };

  const renderMockChart = () => {
    if (type === 'line') {
      return (
        <div className="h-48 flex items-end justify-between space-x-2 p-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg min-h-[20px]"
              />
              <span className="text-xs text-gray-400">{item.month}</span>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'doughnut') {
      const colors = ['#4A90E2', '#50E3C2', '#F39C12', '#E74C3C'];
      return (
        <div className="h-48 flex items-center justify-center">
          <div className="relative w-32 h-32">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-full rounded-full border-8 border-blue-500"
              style={{
                background: `conic-gradient(
                  ${colors[0]} 0deg ${data[0].value * 3.6}deg,
                  ${colors[1]} ${data[0].value * 3.6}deg ${(data[0].value + data[1].value) * 3.6}deg,
                  ${colors[2]} ${(data[0].value + data[1].value) * 3.6}deg ${(data[0].value + data[1].value + data[2].value) * 3.6}deg,
                  ${colors[3]} ${(data[0].value + data[1].value + data[2].value) * 3.6}deg 360deg
                )`
              }}
            />
            <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderLegend = () => {
    if (type === 'doughnut') {
      const colors = ['#4A90E2', '#50E3C2', '#F39C12', '#E74C3C'];
      return (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-sm text-gray-300">{item.label}</span>
              <span className="text-sm text-gray-400 ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`glass rounded-2xl p-6 card-hover cursor-pointer ${isHovered ? 'glow-blue' : ''}`}
      onMouseEnter={() => {
        setIsHovered(true);
        playSound('hover');
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleChartClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
          {type === 'line' ? (
            <TrendingUp className="w-5 h-5 text-white" />
          ) : (
            <BarChart3 className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        {renderMockChart()}
      </div>

      {/* Legend */}
      {renderLegend()}

      {/* Decorative elements */}
      <div className="mt-4 flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-60"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ChartCard;
