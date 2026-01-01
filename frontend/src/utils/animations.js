/**
 * Animation Utility Functions
 * Reusable animation configurations for Framer Motion
 */

// Animation Presets
export const animations = {
  // Fade In
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },

  // Slide Up
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },

  // Slide Down
  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },

  // Slide Left
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },

  // Slide Right
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },

  // Scale In
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },

  // Bounce In
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },

  // Stagger Children
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // Stagger Children Fast
  staggerChildrenFast: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
};

// Hover Effects
export const hoverEffects = {
  // Lift
  lift: {
    whileHover: {
      y: -4,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    whileTap: {
      scale: 0.98,
    },
  },

  // Scale
  scale: {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    whileTap: {
      scale: 0.95,
    },
  },

  // Glow
  glow: {
    whileHover: {
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      transition: { duration: 0.3 },
    },
  },

  // Rotate
  rotate: {
    whileHover: {
      rotate: 5,
      transition: { duration: 0.2 },
    },
  },
};

// Page Transitions
export const pageTransitions = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
};

// Modal Transitions
export const modalTransitions = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

// Utility Functions

/**
 * Create a custom animation with delay
 * @param {Object} animation - Base animation object
 * @param {number} delay - Delay in seconds
 * @returns {Object} Animation with delay
 */
export const withDelay = (animation, delay) => ({
  ...animation,
  transition: {
    ...animation.transition,
    delay,
  },
});

/**
 * Create a stagger animation for list items
 * @param {number} index - Item index
 * @param {number} staggerDelay - Delay between items (default: 0.1s)
 * @returns {Object} Animation with stagger delay
 */
export const staggerItem = (index, staggerDelay = 0.1) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay: index * staggerDelay,
    ease: [0.22, 1, 0.36, 1],
  },
});

/**
 * Create a scroll-triggered animation
 * @param {Object} animation - Base animation object
 * @returns {Object} Viewport animation config
 */
export const scrollAnimation = (animation = animations.fadeIn) => ({
  ...animation,
  viewport: { once: true, amount: 0.3 },
});

/**
 * Combine multiple animation variants
 * @param  {...Object} variants - Animation variant objects
 * @returns {Object} Combined variants
 */
export const combineVariants = (...variants) => {
  return variants.reduce((acc, variant) => ({ ...acc, ...variant }), {});
};

/**
 * Create a spring animation
 * @param {Object} config - Spring configuration
 * @returns {Object} Spring transition config
 */
export const springTransition = (config = {}) => ({
  type: "spring",
  stiffness: 300,
  damping: 30,
  ...config,
});

/**
 * Create a tween animation
 * @param {number} duration - Duration in seconds
 * @param {Array} ease - Cubic bezier ease array
 * @returns {Object} Tween transition config
 */
export const tweenTransition = (duration = 0.5, ease = [0.22, 1, 0.36, 1]) => ({
  type: "tween",
  duration,
  ease,
});
