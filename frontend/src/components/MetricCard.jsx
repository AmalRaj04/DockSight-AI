import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function MetricCard({
  title,
  value,
  unit = "",
  icon: Icon,
  color = "blue",
  animated = true,
  delay = 0,
}) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated) return;

    const isNumeric = !isNaN(parseFloat(value));
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }

    const numericValue = parseFloat(value);
    const duration = 1000; // 1 second
    const steps = 60; // 60fps
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, numericValue);

      if (step >= steps || current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, animated]);

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      text: "text-blue-900",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      text: "text-green-900",
      border: "border-green-200",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      text: "text-purple-900",
      border: "border-purple-200",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-700",
      text: "text-orange-900",
      border: "border-orange-200",
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      text: "text-red-900",
      border: "border-red-200",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const formatValue = (val) => {
    if (typeof val === "number") {
      if (val % 1 === 0) return val.toString();
      return val.toFixed(2);
    }
    return val;
  };

  return (
    <motion.div
      className={`glass rounded-xl p-6 border ${colors.border} hover:shadow-lg transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <motion.span
              className={`text-2xl font-bold ${colors.text}`}
              key={displayValue}
              initial={animated ? { scale: 1.1 } : false}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatValue(displayValue)}
            </motion.span>
            {unit && (
              <span className="text-sm text-gray-500 font-medium">{unit}</span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 ${colors.bg} rounded-lg`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
