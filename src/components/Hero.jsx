import React from 'react';
import { motion } from 'framer-motion';

import { resumeData } from '../data/resumeData';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center text-center">
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
        href="/Dev_Gupta_Updated_CV.pdf"
        download
        className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded shadow hover:shadow-lg transition"
      >
        Download Resume
      </a>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(env(safe-area-inset-bottom)+1rem)]">
        <a
          href="#about"
          aria-label="Scroll to next section"
          className="group flex flex-col items-center text-sm text-gray-500 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
        >
          <span className="mb-1">Scroll</span>
          <svg
            className="w-6 h-6 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
