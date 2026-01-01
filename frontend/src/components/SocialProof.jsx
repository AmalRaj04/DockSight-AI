import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function AnimatedCounter({ value, suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest + suffix;
      }
    });

    return () => unsubscribe();
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function SocialProof() {
  const stats = [
    { value: 1000, suffix: "+", label: "Analyses Completed" },
    { value: 50, suffix: "+", label: "Research Teams" },
    { value: 100, suffix: "%", label: "Reproducible" },
    { value: 24, suffix: "/7", label: "Available" },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Stats Bar */}
      <motion.div
        className="glass rounded-2xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Trusted by Researchers Worldwide
          </h2>
          <p className="text-lg text-gray-600">
            Join the growing community accelerating drug discovery
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section (Optional - using placeholder) */}
      <motion.div
        className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {[
          {
            quote:
              "DockSight AI has transformed our drug discovery workflow. What used to take hours now takes minutes.",
            author: "Dr. Sarah Chen",
            title: "Principal Investigator, Stanford University",
          },
          {
            quote:
              "The blockchain verification gives us confidence in our results. Perfect for reproducible research.",
            author: "Prof. Michael Rodriguez",
            title: "Computational Chemistry Lead, MIT",
          },
        ].map((testimonial, index) => (
          <motion.div
            key={index}
            className="glass rounded-xl p-6 hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="mb-4">
              <svg
                className="w-8 h-8 text-blue-600 opacity-50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed italic">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {testimonial.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600">{testimonial.title}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
