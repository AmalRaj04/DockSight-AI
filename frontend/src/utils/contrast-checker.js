/**
 * Utility functions for checking color contrast compliance with WCAG 2.1 AA standards
 */

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string (e.g., "#3b82f6")
 * @returns {Object} RGB values {r, g, b}
 */
export function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return { r, g, b };
}

/**
 * Convert RGB to relative luminance
 * @param {Object} rgb - RGB values {r, g, b}
 * @returns {number} Relative luminance
 */
export function getLuminance(rgb) {
  const { r, g, b } = rgb;

  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio
 */
export function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG 2.1 AA standards
 * @param {number} ratio - Contrast ratio
 * @param {boolean} isLargeText - Whether text is large (18px+ or 14px+ bold)
 * @returns {Object} Compliance result
 */
export function checkWCAGCompliance(ratio, isLargeText = false) {
  const requiredRatio = isLargeText ? 3.0 : 4.5;
  const passes = ratio >= requiredRatio;

  return {
    passes,
    ratio: Math.round(ratio * 100) / 100,
    required: requiredRatio,
    level: passes ? "AA" : "Fail",
  };
}

/**
 * Get text size classification for WCAG
 * @param {number} fontSize - Font size in pixels
 * @param {number} fontWeight - Font weight (300-900)
 * @returns {boolean} Whether text is considered large
 */
export function isLargeText(fontSize, fontWeight = 400) {
  // Large text: 18px+ or 14px+ with bold (700+) weight
  return fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
}

/**
 * Design token color palette for contrast checking
 */
export const colorPalette = {
  // Primary colors
  "primary-50": "#eff6ff",
  "primary-100": "#dbeafe",
  "primary-200": "#bfdbfe",
  "primary-300": "#93c5fd",
  "primary-400": "#60a5fa",
  "primary-500": "#3b82f6",
  "primary-600": "#2563eb",
  "primary-700": "#1d4ed8",
  "primary-800": "#1e40af",
  "primary-900": "#1e3a8a",
  "primary-950": "#172554",

  // Secondary colors
  "secondary-50": "#f0fdf4",
  "secondary-100": "#dcfce7",
  "secondary-200": "#bbf7d0",
  "secondary-300": "#86efac",
  "secondary-400": "#4ade80",
  "secondary-500": "#22c55e",
  "secondary-600": "#16a34a",
  "secondary-700": "#15803d",
  "secondary-800": "#166534",
  "secondary-900": "#14532d",

  // Accent colors
  "accent-50": "#faf5ff",
  "accent-100": "#f3e8ff",
  "accent-200": "#e9d5ff",
  "accent-300": "#d8b4fe",
  "accent-400": "#c084fc",
  "accent-500": "#a855f7",
  "accent-600": "#9333ea",
  "accent-700": "#7e22ce",
  "accent-800": "#6b21a8",
  "accent-900": "#581c87",

  // Neutral colors
  "neutral-50": "#fafafa",
  "neutral-100": "#f5f5f5",
  "neutral-200": "#e5e5e5",
  "neutral-300": "#d4d4d4",
  "neutral-400": "#a3a3a3",
  "neutral-500": "#737373",
  "neutral-600": "#525252",
  "neutral-700": "#404040",
  "neutral-800": "#262626",
  "neutral-900": "#171717",
  "neutral-950": "#0a0a0a",

  // Standard colors
  white: "#ffffff",
  black: "#000000",

  // Semantic colors
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",

  // Gray scale (Tailwind defaults)
  "gray-50": "#f9fafb",
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "gray-600": "#4b5563",
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "gray-950": "#030712",

  // Blue scale (Tailwind defaults)
  "blue-50": "#eff6ff",
  "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe",
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "blue-800": "#1e40af",
  "blue-900": "#1e3a8a",
  "blue-950": "#172554",

  // Green scale (Tailwind defaults)
  "green-50": "#f0fdf4",
  "green-100": "#dcfce7",
  "green-200": "#bbf7d0",
  "green-300": "#86efac",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "green-700": "#15803d",
  "green-800": "#166534",
  "green-900": "#14532d",
  "green-950": "#052e16",

  // Red scale (Tailwind defaults)
  "red-50": "#fef2f2",
  "red-100": "#fee2e2",
  "red-200": "#fecaca",
  "red-300": "#fca5a5",
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "red-700": "#b91c1c",
  "red-800": "#991b1b",
  "red-900": "#7f1d1d",
  "red-950": "#450a0a",

  // Purple scale (Tailwind defaults)
  "purple-50": "#faf5ff",
  "purple-100": "#f3e8ff",
  "purple-200": "#e9d5ff",
  "purple-300": "#d8b4fe",
  "purple-400": "#c084fc",
  "purple-500": "#a855f7",
  "purple-600": "#9333ea",
  "purple-700": "#7e22ce",
  "purple-800": "#6b21a8",
  "purple-900": "#581c87",
  "purple-950": "#3b0764",

  // Orange scale (Tailwind defaults)
  "orange-50": "#fff7ed",
  "orange-100": "#ffedd5",
  "orange-200": "#fed7aa",
  "orange-300": "#fdba74",
  "orange-400": "#fb923c",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",
  "orange-700": "#c2410c",
  "orange-800": "#9a3412",
  "orange-900": "#7c2d12",
  "orange-950": "#431407",

  // Yellow scale (Tailwind defaults)
  "yellow-50": "#fefce8",
  "yellow-100": "#fef3c7",
  "yellow-200": "#fde68a",
  "yellow-300": "#fcd34d",
  "yellow-400": "#fbbf24",
  "yellow-500": "#f59e0b",
  "yellow-600": "#d97706",
  "yellow-700": "#b45309",
  "yellow-800": "#92400e",
  "yellow-900": "#78350f",
  "yellow-950": "#451a03",
};

/**
 * Common color combinations used in the application
 */
export const commonCombinations = [
  // Light theme combinations
  {
    text: "neutral-900",
    bg: "white",
    context: "Primary text on white background",
  },
  {
    text: "neutral-800",
    bg: "white",
    context: "Secondary text on white background",
  },
  {
    text: "neutral-600",
    bg: "white",
    context: "Tertiary text on white background",
  },
  {
    text: "neutral-500",
    bg: "white",
    context: "Muted text on white background",
  },

  {
    text: "neutral-900",
    bg: "neutral-50",
    context: "Primary text on light gray background",
  },
  {
    text: "neutral-800",
    bg: "neutral-50",
    context: "Secondary text on light gray background",
  },
  {
    text: "neutral-600",
    bg: "neutral-100",
    context: "Text on light gray background",
  },

  // Button combinations
  { text: "white", bg: "primary-600", context: "Primary button text" },
  { text: "white", bg: "primary-700", context: "Primary button hover text" },
  { text: "primary-700", bg: "primary-50", context: "Secondary button text" },
  {
    text: "primary-800",
    bg: "primary-100",
    context: "Secondary button hover text",
  },

  // Success/error states
  { text: "green-700", bg: "green-50", context: "Success message text" },
  { text: "green-800", bg: "green-100", context: "Success badge text" },
  { text: "red-700", bg: "red-50", context: "Error message text" },
  { text: "red-800", bg: "red-100", context: "Error badge text" },

  // Info states
  { text: "blue-700", bg: "blue-50", context: "Info message text" },
  { text: "blue-800", bg: "blue-100", context: "Info badge text" },

  // Warning states
  { text: "orange-700", bg: "orange-50", context: "Warning message text" },
  { text: "orange-800", bg: "orange-100", context: "Warning badge text" },

  // Card combinations
  {
    text: "neutral-900",
    bg: "neutral-50",
    context: "Card title on light background",
  },
  {
    text: "neutral-600",
    bg: "neutral-50",
    context: "Card description on light background",
  },

  // Link combinations
  {
    text: "primary-600",
    bg: "white",
    context: "Link text on white background",
  },
  {
    text: "primary-700",
    bg: "white",
    context: "Link hover text on white background",
  },

  // Dark theme combinations (for future dark mode)
  { text: "neutral-50", bg: "neutral-900", context: "Dark mode primary text" },
  {
    text: "neutral-200",
    bg: "neutral-900",
    context: "Dark mode secondary text",
  },
  {
    text: "neutral-400",
    bg: "neutral-800",
    context: "Dark mode tertiary text",
  },

  // Additional combinations found in components
  {
    text: "gray-900",
    bg: "white",
    context: "Gray text on white (SocialProof, HowItWorks)",
  },
  { text: "gray-600", bg: "white", context: "Gray secondary text on white" },
  { text: "gray-700", bg: "white", context: "Gray tertiary text on white" },
  { text: "gray-500", bg: "white", context: "Gray muted text on white" },
  { text: "blue-600", bg: "white", context: "Blue link text on white" },
  { text: "blue-700", bg: "white", context: "Blue link hover text on white" },
  { text: "blue-500", bg: "white", context: "Blue icon text on white" },

  // Badge combinations from ExecutiveSummary
  { text: "green-700", bg: "green-100", context: "Green badge text" },
  { text: "yellow-700", bg: "yellow-100", context: "Yellow badge text" },
  { text: "red-700", bg: "red-100", context: "Red badge text" },

  // Icon background combinations
  { text: "blue-600", bg: "blue-100", context: "Blue icon on blue background" },
  {
    text: "blue-600",
    bg: "blue-50",
    context: "Blue icon on light blue background",
  },
  {
    text: "green-600",
    bg: "green-100",
    context: "Green icon on green background",
  },
  {
    text: "purple-600",
    bg: "purple-100",
    context: "Purple icon on purple background",
  },
  {
    text: "orange-600",
    bg: "orange-100",
    context: "Orange icon on orange background",
  },

  // Button combinations from ScientificReport
  { text: "white", bg: "blue-600", context: "Blue button text" },
  { text: "white", bg: "blue-700", context: "Blue button hover text" },
  { text: "white", bg: "gray-600", context: "Gray button text" },
  { text: "white", bg: "gray-700", context: "Gray button hover text" },
  { text: "white", bg: "green-600", context: "Green button text" },
  { text: "white", bg: "green-700", context: "Green button hover text" },

  // SummaryDashboard combinations
  { text: "orange-700", bg: "orange-50", context: "Orange metric text" },
  {
    text: "orange-600",
    bg: "orange-50",
    context: "Orange metric secondary text",
  },
  {
    text: "orange-500",
    bg: "orange-50",
    context: "Orange metric tertiary text",
  },

  // EnhancedLigandsTable combinations
  { text: "orange-700", bg: "orange-50", context: "Orange table cell text" },
  { text: "orange-800", bg: "orange-100", context: "Orange badge in table" },

  // Scientific Report badge combinations
  { text: "yellow-700", bg: "yellow-50", context: "Yellow strength badge" },
];

/**
 * Audit all common color combinations for WCAG compliance
 * @returns {Array} Array of audit results
 */
export function auditColorCombinations() {
  const results = [];

  commonCombinations.forEach((combination) => {
    const textColor = colorPalette[combination.text];
    const bgColor = colorPalette[combination.bg];

    if (!textColor || !bgColor) {
      results.push({
        ...combination,
        error: `Color not found: ${
          !textColor ? combination.text : combination.bg
        }`,
        passes: false,
      });
      return;
    }

    const ratio = getContrastRatio(textColor, bgColor);

    // Check for both normal and large text
    const normalTextResult = checkWCAGCompliance(ratio, false);
    const largeTextResult = checkWCAGCompliance(ratio, true);

    results.push({
      ...combination,
      textColor,
      bgColor,
      ratio: normalTextResult.ratio,
      normalText: normalTextResult,
      largeText: largeTextResult,
      passes: normalTextResult.passes,
    });
  });

  return results;
}

/**
 * Get improved color suggestions for failing combinations
 * @param {string} textColor - Current text color
 * @param {string} bgColor - Current background color
 * @param {boolean} isLargeText - Whether text is large
 * @returns {Object} Suggestions for improvement
 */
export function getColorSuggestions(textColor, bgColor, isLargeText = false) {
  const currentRatio = getContrastRatio(textColor, bgColor);
  const requiredRatio = isLargeText ? 3.0 : 4.5;

  if (currentRatio >= requiredRatio) {
    return { needsImprovement: false, currentRatio };
  }

  const suggestions = [];

  // Try darker text colors
  const darkerTextOptions = [
    "neutral-700",
    "neutral-800",
    "neutral-900",
    "neutral-950",
    "gray-700",
    "gray-800",
    "gray-900",
    "gray-950",
  ];

  darkerTextOptions.forEach((colorKey) => {
    const color = colorPalette[colorKey];
    if (color) {
      const ratio = getContrastRatio(color, bgColor);
      if (ratio >= requiredRatio) {
        suggestions.push({
          type: "text",
          color: colorKey,
          hex: color,
          ratio: Math.round(ratio * 100) / 100,
        });
      }
    }
  });

  // Try lighter background colors
  const lighterBgOptions = [
    "white",
    "neutral-50",
    "neutral-100",
    "gray-50",
    "gray-100",
  ];

  lighterBgOptions.forEach((colorKey) => {
    const color = colorPalette[colorKey];
    if (color) {
      const ratio = getContrastRatio(textColor, color);
      if (ratio >= requiredRatio) {
        suggestions.push({
          type: "background",
          color: colorKey,
          hex: color,
          ratio: Math.round(ratio * 100) / 100,
        });
      }
    }
  });

  return {
    needsImprovement: true,
    currentRatio,
    requiredRatio,
    suggestions: suggestions.slice(0, 3), // Limit to top 3 suggestions
  };
}
