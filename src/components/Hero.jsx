import React from 'react';
import { motion } from 'framer-motion';

import { resumeData } from '../data/resumeData';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold"
      >
        {resumeData.name}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-xl text-primary"
      >
        Full-Stack Developer
      </motion.p>
      <a
        href="/Dev_Gupta_CV2025_09.pdf"
        download
        className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded shadow hover:shadow-lg transition"
      >
        Download Resume
      </a>
    </section>
  );
};

export default Hero;
