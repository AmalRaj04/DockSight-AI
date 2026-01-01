# Motion Components

Reusable animated components built with Framer Motion for consistent animations across the application.

## Components

### MotionBox

A versatile animated container component with preset animations.

**Props:**

- `animation` (string) - Animation preset name (default: 'fadeIn')
- `delay` (number) - Animation delay in seconds (default: 0)
- `variants` (object) - Custom animation variants (optional)
- `className` (string) - Additional CSS classes
- `children` (ReactNode) - Child elements

**Example:**

```javascript
import { MotionBox } from "../components/motion";

function Component() {
  return (
    <MotionBox animation="slideUp" delay={0.2}>
      <h1>Animated Content</h1>
    </MotionBox>
  );
}
```

### StaggerContainer

Container that staggers the animation of its children.

**Props:**

- `staggerDelay` (number) - Delay between child animations (default: 0.1s)
- `delayChildren` (number) - Initial delay before children start (default: 0s)
- `className` (string) - Additional CSS classes
- `children` (ReactNode) - Child elements (should be StaggerItem components)

**Example:**

```javascript
import { StaggerContainer, StaggerItem } from "../components/motion";

function Component() {
  return (
    <StaggerContainer staggerDelay={0.15}>
      <StaggerItem>Item 1</StaggerItem>
      <StaggerItem>Item 2</StaggerItem>
      <StaggerItem>Item 3</StaggerItem>
    </StaggerContainer>
  );
}
```

### StaggerItem

Child component for StaggerContainer that animates in sequence.

**Props:**

- `className` (string) - Additional CSS classes
- `children` (ReactNode) - Child elements

**Note:** Must be used inside a StaggerContainer to work properly.

### ScrollReveal

Component that animates when scrolled into view.

**Props:**

- `animation` (string) - Animation preset name (default: 'fadeIn')
- `delay` (number) - Animation delay in seconds (default: 0)
- `amount` (number) - Amount of element visible before triggering (0-1, default: 0.3)
- `once` (boolean) - Animate only once (default: true)
- `className` (string) - Additional CSS classes
- `children` (ReactNode) - Child elements

**Example:**

```javascript
import { ScrollReveal } from "../components/motion";

function Component() {
  return (
    <ScrollReveal animation="slideUp" amount={0.5}>
      <div>Appears when 50% visible</div>
    </ScrollReveal>
  );
}
```

### HoverCard

Card component with built-in hover effects.

**Props:**

- `effect` (string) - Hover effect type: 'lift', 'scale', 'glow', 'rotate' (default: 'lift')
- `className` (string) - Additional CSS classes
- `children` (ReactNode) - Child elements

**Example:**

```javascript
import { HoverCard } from "../components/motion";

function Component() {
  return (
    <HoverCard effect="lift" className="p-6 bg-white rounded-lg">
      <h3>Card Title</h3>
      <p>Card content</p>
    </HoverCard>
  );
}
```

## Complete Example

```javascript
import {
  MotionBox,
  StaggerContainer,
  StaggerItem,
  ScrollReveal,
  HoverCard,
} from "../components/motion";

function LandingPage() {
  return (
    <div>
      {/* Hero Section with fade in */}
      <MotionBox animation="fadeIn">
        <h1>Welcome to DockSight AI</h1>
      </MotionBox>

      {/* Features with stagger animation */}
      <StaggerContainer staggerDelay={0.1}>
        {features.map((feature) => (
          <StaggerItem key={feature.id}>
            <HoverCard effect="lift">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Scroll-triggered section */}
      <ScrollReveal animation="slideUp" amount={0.3}>
        <div>
          <h2>This appears when scrolled into view</h2>
        </div>
      </ScrollReveal>
    </div>
  );
}
```

## Available Animations

- `fadeIn` - Fade in with slight upward movement
- `slideUp` - Slide up from below
- `slideDown` - Slide down from above
- `slideLeft` - Slide in from right
- `slideRight` - Slide in from left
- `scaleIn` - Scale up from 90%
- `bounceIn` - Bounce in with spring effect

## Available Hover Effects

- `lift` - Lift element on hover
- `scale` - Scale up on hover
- `glow` - Add glow effect on hover
- `rotate` - Rotate slightly on hover
