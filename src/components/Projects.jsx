import React from 'react';
import { FiGithub } from 'react-icons/fi';

const projects = [
  {
    title: 'Awesome Project',
    tech: ['React', 'Node', 'MongoDB'],
    description: 'A project that does amazing things.',
    github: 'https://github.com/username/awesome-project',
  },
  {
    title: 'Another Project',
    tech: ['Next.js', 'Tailwind'],
    description: 'Another cool project.',
    github: 'https://github.com/username/another-project',
  },
];

const Projects = () => (
  <section id="projects" className="py-20">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">Projects</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((proj, idx) => (
          <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded p-6 bg-white dark:bg-gray-900 shadow">
            <h3 className="text-xl font-semibold mb-2">{proj.title}</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{proj.tech.join(' · ')}</p>
            <p className="mb-4">{proj.description}</p>
            <a
              href={proj.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
            >
              <FiGithub className="mr-1" /> View on GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
