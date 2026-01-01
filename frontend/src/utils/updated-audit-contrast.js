/**
 * Updated script to audit color contrast compliance after fixes
 */

import {
  getContrastRatio,
  checkWCAGCompliance,
  colorPalette,
  getColorSuggestions,
} from "./contrast-checker.js";

// Updated combinations after fixes
const updatedCombinations = [
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

  // Additional combinations found in components (FIXED)
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
  {
    text: "blue-600",
    bg: "white",
    context: "Blue icon text on white (FIXED from blue-500)",
  },

  // Badge combinations from ExecutiveSummary
  { text: "green-700", bg: "green-100", context: "Green badge text" },
  { text: "yellow-700", bg: "yellow-100", context: "Yellow badge text" },
  { text: "red-700", bg: "red-100", context: "Red badge text" },

  // Icon background combinations (FIXED)
  {
    text: "blue-700",
    bg: "blue-100",
    context: "Blue icon on blue background (FIXED from blue-600)",
  },
  {
    text: "blue-600",
    bg: "blue-50",
    context: "Blue icon on light blue background",
  },
  {
    text: "green-700",
    bg: "green-100",
    context: "Green icon on green background (FIXED from green-600)",
  },
  {
    text: "purple-600",
    bg: "purple-100",
    context: "Purple icon on purple background",
  },
  {
    text: "orange-700",
    bg: "orange-100",
    context: "Orange icon on orange background (FIXED from orange-600)",
  },

  // Button combinations from ScientificReport (FIXED)
  { text: "white", bg: "blue-600", context: "Blue button text" },
  { text: "white", bg: "blue-700", context: "Blue button hover text" },
  { text: "white", bg: "gray-600", context: "Gray button text" },
  { text: "white", bg: "gray-700", context: "Gray button hover text" },
  {
    text: "white",
    bg: "green-700",
    context: "Green button text (FIXED from green-600)",
  },
  { text: "white", bg: "green-700", context: "Green button hover text" },

  // SummaryDashboard combinations (FIXED)
  { text: "orange-700", bg: "orange-50", context: "Orange metric text" },
  {
    text: "orange-700",
    bg: "orange-50",
    context: "Orange metric secondary text (FIXED from orange-600)",
  },
  {
    text: "orange-700",
    bg: "orange-50",
    context: "Orange metric tertiary text (FIXED from orange-500)",
  },

  // EnhancedLigandsTable combinations
  { text: "orange-700", bg: "orange-50", context: "Orange table cell text" },
  { text: "orange-800", bg: "orange-100", context: "Orange badge in table" },

  // Scientific Report badge combinations
  { text: "yellow-700", bg: "yellow-50", context: "Yellow strength badge" },
];

// Run the audit
console.log("🔍 Auditing Color Contrast Compliance (After Fixes)...\n");

const results = [];

updatedCombinations.forEach((combination) => {
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

const failingCombinations = results.filter((result) => !result.passes);
const passingCombinations = results.filter((result) => result.passes);

console.log(`✅ Passing combinations: ${passingCombinations.length}`);
console.log(`❌ Failing combinations: ${failingCombinations.length}`);
console.log(`📊 Total combinations audited: ${results.length}\n`);

if (failingCombinations.length > 0) {
  console.log("❌ REMAINING FAILING COMBINATIONS:\n");

  failingCombinations.forEach((result, index) => {
    console.log(`${index + 1}. ${result.context}`);
    console.log(`   Text: ${result.text} (${result.textColor})`);
    console.log(`   Background: ${result.bg} (${result.bgColor})`);
    console.log(`   Contrast Ratio: ${result.ratio}:1`);
    console.log(
      `   Required: ${result.normalText.required}:1 (normal text), ${result.largeText.required}:1 (large text)`
    );
    console.log(
      `   Status: Normal text ${
        result.normalText.passes ? "✅" : "❌"
      }, Large text ${result.largeText.passes ? "✅" : "❌"}`
    );

    // Get suggestions
    const suggestions = getColorSuggestions(
      result.textColor,
      result.bgColor,
      false
    );
    if (suggestions.needsImprovement && suggestions.suggestions.length > 0) {
      console.log(`   💡 Suggestions:`);
      suggestions.suggestions.forEach((suggestion) => {
        console.log(
          `      - Change ${suggestion.type} to ${suggestion.color} (${suggestion.hex}) - Ratio: ${suggestion.ratio}:1`
        );
      });
    }
    console.log("");
  });
} else {
  console.log("🎉 ALL COLOR COMBINATIONS NOW PASS WCAG 2.1 AA STANDARDS!");
}

if (passingCombinations.length > 0) {
  console.log("✅ PASSING COMBINATIONS:\n");

  passingCombinations.forEach((result, index) => {
    console.log(`${index + 1}. ${result.context} - Ratio: ${result.ratio}:1`);
  });
}

// Export results for use in other scripts
export { results, failingCombinations, passingCombinations };
