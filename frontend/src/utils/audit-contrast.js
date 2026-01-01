/**
 * Script to audit color contrast compliance across the application
 */

import {
  auditColorCombinations,
  getColorSuggestions,
} from "./contrast-checker.js";

// Run the audit
console.log("🔍 Auditing Color Contrast Compliance...\n");

const results = auditColorCombinations();
const failingCombinations = results.filter((result) => !result.passes);
const passingCombinations = results.filter((result) => result.passes);

console.log(`✅ Passing combinations: ${passingCombinations.length}`);
console.log(`❌ Failing combinations: ${failingCombinations.length}`);
console.log(`📊 Total combinations audited: ${results.length}\n`);

if (failingCombinations.length > 0) {
  console.log("❌ FAILING COMBINATIONS:\n");

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
}

if (passingCombinations.length > 0) {
  console.log("✅ PASSING COMBINATIONS:\n");

  passingCombinations.forEach((result, index) => {
    console.log(`${index + 1}. ${result.context} - Ratio: ${result.ratio}:1`);
  });
}

// Export results for use in other scripts
export { results, failingCombinations, passingCombinations };
