import { motion } from "framer-motion";
import WorkflowStep from "./WorkflowStep";
import {
  FiUploadCloud,
  FiCpu,
  FiBarChart2,
  FiFileText,
  FiShield,
} from "react-icons/fi";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FiUploadCloud className="w-6 h-6" />,
      title: "Upload Files",
      description:
        "Drag and drop your .pdbqt or .log files from AutoDock Vina. Support for batch uploads and multiple file formats.",
    },
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: "Automated Analysis",
      description:
        "Our AI agent parses docking results, extracts binding energies, and ranks ligands by affinity automatically.",
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Generate Visualizations",
      description:
        "Create interactive 3D molecular structures, binding affinity charts, and comprehensive data tables instantly.",
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Scientific Report",
      description:
        "LLM-powered narrative generation produces publication-ready reports with methodology and analysis sections.",
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Blockchain Verification",
      description:
        "Attest your results to Solana blockchain for immutable verification and reproducibility guarantees.",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          From Upload to Insight in Minutes
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Automated pipeline handles everything from parsing to publication
        </motion.p>
      </motion.div>

      {/* Steps Timeline */}
      <div className="space-y-8 md:space-y-0">
        {steps.map((step, index) => (
          <WorkflowStep
            key={index}
            number={index + 1}
            icon={step.icon}
            title={step.title}
            description={step.description}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
