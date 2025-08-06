import React from 'react';

const experiences = [
  {
    role: 'Software Engineer',
    company: 'Tech Corp',
    period: '2022 – Present',
    details: [
      'Developed and maintained web applications using React and Node.js.',
      'Collaborated with cross-functional teams to design scalable solutions.',
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Startup Inc.',
    period: '2020 – 2022',
    details: [
      'Implemented responsive UI components with React and Tailwind CSS.',
      'Optimized performance and improved accessibility of existing features.',
    ],
  },
];

const Experience = () => (
  <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">Experience</h2>
      <div className="space-y-8">
        {experiences.map((exp, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-6 shadow">
            <h3 className="text-xl font-semibold">
              {exp.role} @ {exp.company}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{exp.period}</p>
            <ul className="list-disc list-inside space-y-1">
              {exp.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
