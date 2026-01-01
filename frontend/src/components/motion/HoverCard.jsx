import { motion } from "framer-motion";

/**
 * HoverCard - Card component with hover effects
 * @param {Object} props
 * @param {string} props.effect - Hover effect type (lift, scale, glow, rotate)
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.className - Additional CSS classes
 */
export default function HoverCard({
  effect = "lift",
  children,
  className = "",
  ...props
}) {
  const effects = {
    lift: {
      whileHover: { y: -4, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 },
    },
    scale: {
      whileHover: { scale: 1.05, transition: { duration: 0.2 } },
      whileTap: { scale: 0.95 },
    },
    glow: {
      whileHover: {
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        transition: { duration: 0.3 },
      },
    },
    rotate: {
      whileHover: { rotate: 5, transition: { duration: 0.2 } },
    },
  };

  return (
    <motion.div {...effects[effect]} className={className} {...props}>
      {children}
    </motion.div>
  );
}
