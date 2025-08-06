import React from 'react';
import { FaReact, FaNode, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';

import { resumeData } from '../data/resumeData';

const iconMap = {
  'React.js': <FaReact size={40} />,
  'React Native': <FaReact size={40} />,
  'Node.js': <FaNode size={40} />,
  'Express.js': <FaNode size={40} />,
  JavaScript: <FaJs size={40} />,
  MongoDB: <FaNode size={40} />,
  MySQL: <FaHtml5 size={40} />,
  Firebase: <FaCss3Alt size={40} />,
};

const Skills = () => (
  <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">Skills</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 justify-items-center">
        {resumeData.skills.map((skill, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {iconMap[skill] || <FaJs size={40} />} {/* Fallback icon */}
            <span className="mt-2 text-center">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
