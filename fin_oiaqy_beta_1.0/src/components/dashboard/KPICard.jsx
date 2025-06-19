
import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, TrendingUp, Users, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

const iconMap = {
  Landmark,
  TrendingUp,
  Users,
  CreditCard
};

const colorMap = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  orange: 'from-orange-500 to-amber-500',
  purple: 'from-purple-500 to-pink-500',
  red: 'from-red-500 to-rose-500'
};

const glowMap = {
  blue: 'glow-blue',
  green: 'glow-green',
  orange: 'glow-orange',
  purple: 'shadow-purple-500/50',
  red: 'glow-red'
};

const KPICard = ({ title, value, format, icon, color, trend }) => {
  const { playSound } = useSound();
  const IconComponent = iconMap[icon] || Landmark;
  const isPositiveTrend = trend && trend.startsWith('+');

  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    return val.toLocaleString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass rounded-2xl p-6 card-hover"
      onMouseEnter={() => playSound('hover')}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} ${glowMap[color]}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            isPositiveTrend ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositiveTrend ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            {trend}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <motion.p
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white count-animation"
        >
          {formatValue(value)}
        </motion.p>
      </div>

      {/* Decorative gradient line */}
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${colorMap[color]} opacity-60`} />
    </motion.div>
  );
};

export default KPICard;
