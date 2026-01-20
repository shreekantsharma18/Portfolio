import React, { useState, useEffect } from 'react';
import { portfolioData } from '../../constants/data';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setIsOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
                {/* Name/Logo */}
                <div
                    className="text-xl font-bold tracking-tighter uppercase cursor-pointer hover:text-cyan-400 transition-colors z-50 relative"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    {portfolioData.name}
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-wide items-center">
                    {['About', 'Skills', 'internships', 'Projects'].map((item) => (
                        <li
                            key={item}
                            className="cursor-pointer hover:text-cyan-400 transition-colors relative group"
                            onClick={() => scrollToSection(item.toLowerCase())}
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                        </li>
                    ))}
                    <li
                        className="cursor-pointer px-5 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all hover:scale-105"
                        onClick={() => scrollToSection('contact')}
                    >
                        Contact
                    </li>
                    {portfolioData.resumeUrl && (
                        <li className="cursor-pointer px-5 py-2 bg-white text-black font-bold rounded-full hover:bg-cyan-400 hover:text-black transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                            <a href={portfolioData.resumeUrl} download="Shreekant_Sharma_Resume.pdf" target="_blank" rel="noopener noreferrer">
                                Resume
                            </a>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden z-50 relative">
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white hover:text-cyan-400 transition-colors">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        {['About', 'Skills', 'Internships', 'Projects'].map((item) => (
                            <div
                                key={item}
                                className="text-2xl font-bold uppercase tracking-wider text-white hover:text-cyan-400 cursor-pointer transition-colors"
                                onClick={() => scrollToSection(item.toLowerCase())}
                            >
                                {item}
                            </div>
                        ))}
                        <div
                            className="text-2xl font-bold uppercase tracking-wider text-cyan-400 cursor-pointer border-2 border-cyan-400 px-8 py-3 rounded-full hover:bg-cyan-400 hover:text-black transition-all"
                            onClick={() => scrollToSection('contact')}
                        >
                            Contact
                        </div>
                        {portfolioData.resumeUrl && (
                            <a
                                href={portfolioData.resumeUrl}
                                download="Shreekant_Sharma_Resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl font-bold text-black bg-white px-8 py-3 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Resume
                            </a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
