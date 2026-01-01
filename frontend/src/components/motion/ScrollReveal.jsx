import { motion } from "framer-motion";
import { animations } from "../../utils/animations";

/**
 * ScrollReveal - Component that animates when scrolled into view
 * @param {Object} props
 * @param {string} props.animation - Animation preset name (fadeIn, slideUp, etc.)
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.amount - Amount of element visible before triggering (0-1, default: 0.3)
 * @param {boolean} props.once - Animate only once (default: true)
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.className - Additional CSS classes
 */
export default function ScrollReveal({
  animation = "fadeIn",
  delay = 0,
  amount = 0.3,
  once = true,
  children,
  className = "",
  ...props
}) {
  const animationConfig = animations[animation];

  const configWithDelay =
    delay > 0
      ? {
          ...animationConfig,
          transition: {
            ...animationConfig.transition,
            delay,
          },
        }
      : animationConfig;

  return (
    <motion.div
      initial={configWithDelay.initial}
      whileInView={configWithDelay.animate}
      viewport={{ once, amount }}
      transition={configWithDelay.transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
