import { motion } from "framer-motion";
import { FiZap, FiTarget, FiBarChart2, FiCheckCircle } from "react-icons/fi";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <FiZap className="w-6 h-6" />,
      label: "10x Faster",
      description: "than manual analysis",
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      label: "100% Reproducible",
      description: "with blockchain attestation",
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      label: "Publication-Ready",
      description: "reports and visualizations",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Benefits Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
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
            Why DockSight AI
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Accelerate Your Research
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Transform hours of manual work into minutes of automated analysis
            with AI-powered insights and blockchain-verified results.
          </motion.p>

          {/* Benefits List */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <motion.div
                  className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {benefit.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {benefit.label}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Visual - Comparison Chart */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Time Comparison
            </h3>

            {/* Before/After Bars */}
            <div className="space-y-8">
              {/* Manual Analysis */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Manual Analysis
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    4-6 hours
                  </span>
                </div>
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 to-red-500 rounded-lg"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* DockSight AI */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    DockSight AI
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    5-10 minutes
                  </span>
                </div>
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-end pr-2"
                    initial={{ width: 0 }}
                    whileInView={{ width: "10%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.7 }}
                  >
                    <FiCheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              className="mt-8 pt-6 border-t border-gray-200 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-1">
                90% Faster
              </div>
              <div className="text-sm text-gray-600">
                Average time savings per analysis
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
