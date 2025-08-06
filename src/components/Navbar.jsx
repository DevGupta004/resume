import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const links = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const sysPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && sysPref)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <header className="fixed w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-700 z-50">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#home" className="text-xl font-semibold text-primary">Dev Gupta</a>
        <div className="hidden md:flex space-x-6">
          {links.map(link => (
            <a key={link.name} href={link.href} className="hover:text-primary">
              {link.name}
            </a>
          ))}
          <button onClick={toggleDark} aria-label="Toggle Theme" className="focus:outline-none">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
        {/* Mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleDark} className="mr-2" aria-label="Toggle Theme">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Toggle Menu" className="focus:outline-none">
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {links.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
