import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function UseCaseCard({
  image,
  title,
  description,
  metrics,
  delay = 0,
}) {
  return (
    <motion.div
      className="glass rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
          {image}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        {/* Metrics */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.2 + index * 0.1 }}
              >
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
