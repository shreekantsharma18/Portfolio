import React from 'react';
import { motion } from 'framer-motion';

const SectionWrapper = ({ children, id, className = "" }) => {
    return (
        <section id={id} className={`min-h-screen w-full relative flex items-center justify-center px-6 py-12 md:p-20 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-7xl w-full mx-auto relative z-10"
            >
                {children}
            </motion.div>
        </section>
    );
};

export default SectionWrapper;
