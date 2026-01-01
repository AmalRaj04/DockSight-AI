import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function WorkflowStep({
  number,
  icon,
  title,
  description,
  isLast = false,
}) {
  return (
    <motion.div
      className="relative flex flex-col md:flex-row items-start md:items-center gap-6"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: number * 0.1 }}
    >
      {/* Step Number and Icon */}
      <div className="relative flex-shrink-0">
        <motion.div
          className={cn(
            "relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center",
            "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
          )}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{number}</div>
            <div className="text-xs opacity-80">STEP</div>
          </div>
        </motion.div>

        {/* Connector Line */}
        {!isLast && (
          <motion.div
            className="absolute top-20 left-10 w-0.5 h-24 md:hidden bg-gradient-to-b from-blue-500 to-blue-300"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: number * 0.1 + 0.3 }}
            style={{ transformOrigin: "top" }}
          />
        )}
        {!isLast && (
          <motion.div
            className="hidden md:block absolute top-10 left-20 h-0.5 w-32 lg:w-48 bg-gradient-to-r from-blue-500 to-blue-300"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: number * 0.1 + 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        )}
      </div>

      {/* Step Content */}
      <motion.div
        className="flex-1 glass rounded-xl p-6 hover:shadow-lg transition-shadow"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
