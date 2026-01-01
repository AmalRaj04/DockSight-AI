import { motion } from "framer-motion";
import { animations } from "../../utils/animations";

/**
 * MotionBox - A reusable animated container component
 * @param {Object} props
 * @param {string} props.animation - Animation preset name (fadeIn, slideUp, etc.)
 * @param {number} props.delay - Animation delay in seconds
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.variants - Custom animation variants
 */
export default function MotionBox({
  animation = "fadeIn",
  delay = 0,
  children,
  className = "",
  variants,
  ...props
}) {
  const animationConfig = variants || animations[animation];

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
      animate={configWithDelay.animate}
      exit={configWithDelay.exit}
      transition={configWithDelay.transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
