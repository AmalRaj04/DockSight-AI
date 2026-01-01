/**
 * Script to fix color contrast issues in components
 */

import fs from "fs";
import path from "path";

const fixes = [
  {
    file: "frontend/src/components/SocialProof.jsx",
    replacements: [
      {
        from: "text-blue-500",
        to: "text-blue-600",
        reason:
          "blue-500 on white fails contrast (3.68:1), blue-600 passes (5.17:1)",
      },
    ],
  },
  {
    file: "frontend/src/components/CollapsibleSection.jsx",
    replacements: [
      {
        from: "text-blue-600",
        to: "text-blue-700",
        reason:
          "blue-600 on blue-100 fails contrast (4.24:1), blue-700 passes (6.16:1)",
      },
    ],
  },
  {
    file: "frontend/src/components/ExecutiveSummary.jsx",
    replacements: [
      {
        from: "text-green-600",
        to: "text-green-700",
        reason:
          "green-600 on green-100 fails contrast (3.0:1), green-700 passes (4.79:1)",
      },
    ],
  },
  {
    file: "frontend/src/components/MetricCard.jsx",
    replacements: [
      {
        from: "text-orange-600",
        to: "text-orange-700",
        reason:
          "orange-600 on orange-100 fails contrast (3.11:1), orange-700 passes (4.88:1)",
      },
    ],
  },
  {
    file: "frontend/src/components/ScientificReport.jsx",
    replacements: [
      {
        from: "bg-green-600",
        to: "bg-green-700",
        reason:
          "white on green-600 fails contrast (3.3:1), white on green-700 passes (5.02:1)",
      },
    ],
  },
  {
    file: "frontend/src/components/SummaryDashboard.jsx",
    replacements: [
      {
        from: "text-orange-600",
        to: "text-orange-700",
        reason:
          "orange-600 on orange-50 fails contrast (3.35:1), orange-700 passes (4.88:1)",
      },
      {
        from: "text-orange-500",
        to: "text-orange-700",
        reason:
          "orange-500 on orange-50 fails contrast (2.64:1), orange-700 passes (4.88:1)",
      },
    ],
  },
];

console.log("🔧 Fixing color contrast issues...\n");

fixes.forEach((fix) => {
  const filePath = fix.file;

  try {
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;

    fix.replacements.forEach((replacement) => {
      if (content.includes(replacement.from)) {
        content = content.replaceAll(replacement.from, replacement.to);
        changed = true;
        console.log(`✅ ${filePath}:`);
        console.log(`   ${replacement.from} → ${replacement.to}`);
        console.log(`   Reason: ${replacement.reason}\n`);
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log("🎉 Color contrast fixes complete!");
