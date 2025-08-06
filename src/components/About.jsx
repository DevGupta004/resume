import React from 'react';

import { resumeData } from '../data/resumeData';

const About = () => (
  <section id="about" className="py-20 max-w-5xl mx-auto px-4">
    <h2 className="text-3xl font-semibold mb-6">About Me</h2>
    <p className="leading-relaxed whitespace-pre-line">
      {resumeData.about}
    </p>
  </section>
);

export default About;
