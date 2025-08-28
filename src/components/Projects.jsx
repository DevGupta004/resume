import React from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

import { resumeData } from '../data/resumeData';

const Projects = () => (
  <section id="projects" className="py-20">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6">Projects</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {resumeData.projects.map((proj, idx) => (
          <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded p-6 bg-white dark:bg-gray-900 shadow">
            <h3 className="text-xl font-semibold mb-2">{proj.title}</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{proj.tech.join(' · ')}</p>
            <p className="mb-4">{proj.description}</p>
            {Array.isArray(proj.links) && proj.links.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {proj.links.map((l, i) => {
                  const isGithub = l.url?.includes('github.com') || /github/i.test(l.label || '');
                  const Icon = isGithub ? FiGithub : FiExternalLink;
                  const label = l.label || (isGithub ? 'GitHub' : 'Open Link');
                  return (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <Icon className="mr-1" /> {label}
                    </a>
                  );
                })}
              </div>
            ) : (() => {
              const url = proj.github || proj.link;
              if (!url) return null;
              const isGithub = url.includes('github.com');
              const Icon = isGithub ? FiGithub : FiExternalLink;
              const label = isGithub ? 'View on GitHub' : 'Open Link';
              return (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <Icon className="mr-1" /> {label}
                </a>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
