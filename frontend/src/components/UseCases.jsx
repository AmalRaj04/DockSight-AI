import { motion } from "framer-motion";
import UseCaseCard from "./UseCaseCard";

export default function UseCases() {
  const useCases = [
    {
      image: "🔬",
      title: "Drug Discovery Screening",
      description:
        "Rapidly evaluate 100+ compounds to identify promising drug candidates with optimal binding profiles.",
      metrics: [
        { value: "100+", label: "Compounds/Day" },
        { value: "95%", label: "Accuracy" },
      ],
    },
    {
      image: "🎯",
      title: "Lead Optimization",
      description:
        "Compare binding modes of analogs to optimize molecular structures for improved efficacy and selectivity.",
      metrics: [
        { value: "10x", label: "Faster Iteration" },
        { value: "3D", label: "Visualization" },
      ],
    },
    {
      image: "📊",
      title: "Grant Proposals",
      description:
        "Generate publication-quality figures and comprehensive reports to strengthen research grant applications.",
      metrics: [
        { value: "PDF", label: "Export Ready" },
        { value: "100%", label: "Reproducible" },
      ],
    },
    {
      image: "🎓",
      title: "Academic Research",
      description:
        "Produce reproducible results with blockchain verification for peer-reviewed publications and dissertations.",
      metrics: [
        { value: "⛓️", label: "Blockchain" },
        { value: "📝", label: "Citations" },
      ],
    },
    {
      image: "🚀",
      title: "Startup R&D",
      description:
        "Fast iteration on drug candidates with automated analysis to accelerate your path to clinical trials.",
      metrics: [
        { value: "5min", label: "Per Analysis" },
        { value: "24/7", label: "Available" },
      ],
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
          Use Cases
        </motion.p>
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Built for Every Research Scenario
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          From academic research to commercial drug discovery, DockSight AI
          adapts to your workflow
        </motion.p>
      </motion.div>

      {/* Use Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => (
          <UseCaseCard
            key={index}
            image={useCase.image}
            title={useCase.title}
            description={useCase.description}
            metrics={useCase.metrics}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
