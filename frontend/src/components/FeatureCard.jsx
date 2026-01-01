import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function FeatureCard({
  icon,
  title,
  description,
  link,
  delay = 0,
}) {
  return (
    <motion.div
      className={cn(
        "group relative glass rounded-xl p-6 transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        "border border-transparent hover:border-gradient"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />

      <div className="relative">
        {/* Icon */}
        <motion.div
          className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Link */}
        {link && (
          <motion.a
            href={link}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-2 transition-all"
            whileHover={{ x: 2 }}
          >
            Learn more
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}
