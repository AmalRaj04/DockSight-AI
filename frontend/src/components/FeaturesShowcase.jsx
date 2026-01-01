import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import {
  FiTrendingUp,
  FiBox,
  FiFileText,
  FiShield,
  FiLayers,
  FiDownload,
  FiClock,
  FiZap,
} from "react-icons/fi";

export default function FeaturesShowcase() {
  const features = [
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Automated Ranking",
      description:
        "AI-powered ligand ranking by binding affinity with intelligent best pose selection and energy analysis.",
    },
    {
      icon: <FiBox className="w-6 h-6" />,
      title: "3D Visualization",
      description:
        "Interactive molecular structure viewer with rotation, zoom, and multiple rendering modes for detailed analysis.",
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Scientific Reports",
      description:
        "Publication-ready reports with LLM-generated narratives, methodology, and comprehensive analysis.",
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Blockchain Attestation",
      description:
        "Immutable verification on Solana blockchain ensuring reproducibility and data integrity for research.",
    },
    {
      icon: <FiLayers className="w-6 h-6" />,
      title: "Batch Analysis",
      description:
        "Process multiple compounds simultaneously with parallel execution and consolidated reporting.",
    },
    {
      icon: <FiDownload className="w-6 h-6" />,
      title: "Export Options",
      description:
        "Flexible export formats including CSV, Excel, and PDF for seamless integration with your workflow.",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Analysis History",
      description:
        "Track and compare past analyses with searchable history, tags, and side-by-side comparison tools.",
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Smart Insights",
      description:
        "AI-powered interpretation and recommendations based on binding patterns and molecular interactions.",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Capabilities
        </motion.p>
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Everything You Need for Docking Analysis
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Comprehensive tools and features designed to accelerate your drug
          discovery research
        </motion.p>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
