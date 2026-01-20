import React, { useEffect, useRef } from 'react';
import Navbar from './components/UI/Navbar';
import Scene from './components/Canvas/Scene';
import SectionWrapper from './components/UI/SectionWrapper';
import ContactForm from './components/UI/ContactForm';
import Footer from './components/UI/Footer';
import { portfolioData } from './constants/data';
import { motion } from 'framer-motion';

function App() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleHover = () => cursor.classList.add('hovered');
    const handleLeave = () => cursor.classList.remove('hovered');

    window.addEventListener('mousemove', moveCursor);

    // Add hover effect to clickable elements
    const clickables = document.querySelectorAll('a, button, li, .cursor-pointer');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:flex" />
      <Navbar />

      <Scene>
        {/* Main Sections wrapped in vertical layout for ScrollControls */}
        <main className="w-full flex flex-col">

          {/* Home / Hero Section */}
          <SectionWrapper id="home" className="h-[100vh]">
            {/* Content is mostly 3D here, but we can add an overlay if needed */}
            <div className="text-center pointer-events-none">
              <h1 className="sr-only">{portfolioData.name}</h1>
              <p className="text-gray-400 mt-[35vh] md:mt-[40vh] text-base md:text-lg animate-pulse">Scroll to explore</p>
            </div>
          </SectionWrapper>

          {/* About Section */}
          <SectionWrapper id="about" className="bg-black/80 backdrop-blur-sm">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              About Me
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
              {portfolioData.about}
            </p>
          </SectionWrapper>

          {/* Skills Section */}
          <SectionWrapper id="skills">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 text-center text-white">Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Skills are visualized in 3D, this could be a fallback or supplementary details */}
              {portfolioData.skills.map(skill => (
                <div key={skill.name} className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-cyan-400 transition-colors shadow-lg">
                  <h3 className="text-xl font-bold text-cyan-300">{skill.name}</h3>
                  <div className="w-full bg-gray-700 h-2 mt-4 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-cyan-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>

          {/* Internships Section */}
          <SectionWrapper id="internships">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 text-left text-white">Experience</h2>
            <div className="space-y-8">
              {portfolioData.internships.map((internship, idx) => (
                <div key={idx} className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border-l-4 border-cyan-400 hover:bg-black/70 transition-colors shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{internship.role}</h3>
                      <p className="text-cyan-300 text-lg">{internship.company}</p>
                    </div>
                    <p className="text-gray-400 italic mt-2 md:mt-0">{internship.period}</p>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">{internship.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {internship.tech && internship.tech.map(t => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-800/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>

          {/* Projects Section */}
          <SectionWrapper id="projects" className="bg-gradient-to-b from-transparent to-black">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 text-right text-white">Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {portfolioData.projects.map((project, idx) => (
                <a
                  key={idx}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block bg-black/60 backdrop-blur-md p-8 rounded-2xl overflow-hidden hover:bg-black/70 transition-colors shadow-lg cursor-pointer text-left"
                >
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 mb-4 whitespace-pre-line">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tech.map(t => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-800/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </SectionWrapper>

          {/* Contact Section */}
          <SectionWrapper id="contact">
            <ContactForm />
            <Footer />
          </SectionWrapper>

        </main>
      </Scene>
    </>
  );
}

export default App;
