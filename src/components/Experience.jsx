import React from 'react';

import { resumeData } from '../data/resumeData';

const Experience = () => (
  <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">Experience</h2>
      <div className="space-y-8">
        {resumeData.experience.map((exp, idx) => (
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
