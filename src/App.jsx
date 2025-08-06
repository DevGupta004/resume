import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import WhatsAppFab from './components/WhatsAppFab';

const App = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      {/* WhatsApp Floating Action Button */}
      <WhatsAppFab />
    </div>
  );
};

export default App;
