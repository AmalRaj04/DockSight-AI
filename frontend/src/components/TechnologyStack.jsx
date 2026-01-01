import { motion } from "framer-motion";
import { FiCpu, FiLink, FiBarChart2 } from "react-icons/fi";

export default function TechnologyStack() {
  const techCategories = [
    {
      title: "AI & Machine Learning",
      icon: <FiCpu className="w-6 h-6" />,
      technologies: [
        { name: "Groq", description: "Ultra-fast LLM inference" },
        { name: "LLaMA 3.3", description: "Advanced language model" },
      ],
    },
    {
      title: "Blockchain",
      icon: <FiLink className="w-6 h-6" />,
      technologies: [
        { name: "Solana", description: "High-performance blockchain" },
        { name: "Anchor", description: "Smart contract framework" },
      ],
    },
    {
      title: "Visualization",
      icon: <FiBarChart2 className="w-6 h-6" />,
      technologies: [
        { name: "3Dmol.js", description: "Molecular structure viewer" },
        { name: "Chart.js", description: "Interactive data charts" },
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
          Technology
        </motion.p>
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Powered by Cutting-Edge Technology
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Built on the latest advances in AI, blockchain, and scientific
          visualization
        </motion.p>
      </motion.div>

      {/* Tech Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {techCategories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            className="glass rounded-xl p-8 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            whileHover={{ y: -4 }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {category.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900">
                {category.title}
              </h3>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              {category.technologies.map((tech, techIndex) => (
                <motion.div
                  key={techIndex}
                  className="p-4 bg-white/50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: categoryIndex * 0.1 + techIndex * 0.1 + 0.2,
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {tech.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tech.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
