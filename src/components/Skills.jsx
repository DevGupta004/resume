import React from 'react';
import { FaReact, FaNode, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';

const skills = [
  { icon: <FaReact size={40} />, name: 'React' },
  { icon: <FaNode size={40} />, name: 'Node.js' },
  { icon: <FaJs size={40} />, name: 'JavaScript' },
  { icon: <FaHtml5 size={40} />, name: 'HTML5' },
  { icon: <FaCss3Alt size={40} />, name: 'CSS3' },
];

const Skills = () => (
  <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">Skills</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 justify-items-center">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {skill.icon}
            <span className="mt-2">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
