# Animation Utilities

This module provides reusable animation configurations and utility functions for Framer Motion.

## Animation Presets

Pre-configured animation objects ready to use with Framer Motion components:

### Basic Animations

- `fadeIn` - Fade in with slight upward movement
- `slideUp` - Slide up from below
- `slideDown` - Slide down from above
- `slideLeft` - Slide in from right
- `slideRight` - Slide in from left
- `scaleIn` - Scale up from 90%
- `bounceIn` - Bounce in with spring effect

### Container Animations

- `staggerChildren` - Stagger child animations with 0.1s delay
- `staggerChildrenFast` - Stagger child animations with 0.05s delay

## Hover Effects

Pre-configured hover and tap effects:

- `lift` - Lift element on hover, scale down on tap
- `scale` - Scale up on hover, scale down on tap
- `glow` - Add glow effect on hover
- `rotate` - Rotate slightly on hover

## Transitions

- `pageTransitions` - Smooth page transition effects
- `modalTransitions` - Modal and backdrop animations

## Utility Functions

### `withDelay(animation, delay)`

Add a delay to any animation:

```javascript
import { animations, withDelay } from "../utils/animations";

const delayedFadeIn = withDelay(animations.fadeIn, 0.5);
```

### `staggerItem(index, staggerDelay)`

Create staggered animations for list items:

```javascript
items.map((item, index) => (
  <motion.div key={item.id} {...staggerItem(index)}>
    {item.content}
  </motion.div>
));
```

### `scrollAnimation(animation)`

Make any animation trigger on scroll:

```javascript
<motion.div {...scrollAnimation(animations.slideUp)}>Content</motion.div>
```

### `combineVariants(...variants)`

Combine multiple animation variants:

```javascript
const combined = combineVariants(animations.fadeIn, hoverEffects.lift);
```

### `springTransition(config)`

Create spring-based transitions:

```javascript
const spring = springTransition({ stiffness: 400, damping: 25 });
```

### `tweenTransition(duration, ease)`

Create tween-based transitions:

```javascript
const tween = tweenTransition(0.5, [0.22, 1, 0.36, 1]);
```

## Usage Examples

### Basic Animation

```javascript
import { motion } from "framer-motion";
import { animations } from "../utils/animations";

function Component() {
  return <motion.div {...animations.fadeIn}>Content</motion.div>;
}
```

### With Delay

```javascript
import { motion } from "framer-motion";
import { animations, withDelay } from "../utils/animations";

function Component() {
  return (
    <motion.div {...withDelay(animations.slideUp, 0.3)}>Content</motion.div>
  );
}
```

### Scroll-Triggered

```javascript
import { motion } from "framer-motion";
import { scrollAnimation, animations } from "../utils/animations";

function Component() {
  return (
    <motion.div {...scrollAnimation(animations.fadeIn)}>
      Content appears when scrolled into view
    </motion.div>
  );
}
```

### Staggered List

```javascript
import { motion } from "framer-motion";
import { staggerItem } from "../utils/animations";

function List({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <motion.div key={item.id} {...staggerItem(index)}>
          {item.content}
        </motion.div>
      ))}
    </div>
  );
}
```
