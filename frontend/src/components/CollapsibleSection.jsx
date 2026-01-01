import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  variant = "default", // "default", "bordered", "elevated"
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variants = {
    default: {
      container: "glass rounded-xl overflow-hidden mb-6",
      header:
        "w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-all duration-200",
      content: "px-6 pb-6",
    },
    bordered: {
      container:
        "border-2 border-gray-200 rounded-xl overflow-hidden mb-6 bg-white",
      header:
        "w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 border-b border-gray-200",
      content: "px-6 pb-6",
    },
    elevated: {
      container:
        "bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden mb-6",
      header:
        "w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200",
      content: "px-6 pb-6",
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <motion.div
      className={currentVariant.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        boxShadow:
          variant === "elevated"
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={currentVariant.header}
        whileHover={{ scale: 1.001 }}
        whileTap={{ scale: 0.999 }}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <motion.div
              className="p-2 bg-blue-100 rounded-lg"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                backgroundColor: "rgb(219, 234, 254)", // blue-100 to blue-200
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="w-5 h-5 text-blue-700" />
            </motion.div>
          )}
          <div className="text-left">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <motion.p
              className="text-sm text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isOpen ? "Click to collapse" : "Click to expand"}
            </motion.p>
          </div>
        </div>

        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 200,
          }}
          className="flex items-center gap-2"
        >
          <motion.div
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
              y: -10,
            }}
            animate={{
              height: "auto",
              opacity: 1,
              y: 0,
            }}
            exit={{
              height: 0,
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.4,
              ease: [0.04, 0.62, 0.23, 0.98], // Custom easing for smooth animation
            }}
            style={{ overflow: "hidden" }}
          >
            <motion.div
              className={currentVariant.content}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.3,
                delay: 0.1, // Slight delay for content to appear after container
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle indicator line at bottom when closed */}
      {!isOpen && (
        <motion.div
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ transformOrigin: "left" }}
        />
      )}
    </motion.div>
  );
}
