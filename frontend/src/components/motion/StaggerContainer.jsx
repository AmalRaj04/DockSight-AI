import { motion } from "framer-motion";

/**
 * StaggerContainer - Container that staggers animation of children
 * @param {Object} props
 * @param {number} props.staggerDelay - Delay between child animations (default: 0.1s)
 * @param {number} props.delayChildren - Initial delay before children start (default: 0s)
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.className - Additional CSS classes
 */
export default function StaggerContainer({
  staggerDelay = 0.1,
  delayChildren = 0,
  children,
  className = "",
  ...props
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
