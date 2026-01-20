import React from 'react';
import { portfolioData } from '../../constants/data';
import { Github, Linkedin, Instagram, Mail, Code, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <div className="w-full mt-12 border-t border-white/10 pt-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Contact Info */}
                <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white">Contact Me</h3>
                    <div className="flex flex-col gap-2 text-gray-400">
                        <a href={`tel:${portfolioData.contact.phone}`} className="flex items-center gap-2 justify-center md:justify-start hover:text-cyan-300 transition-colors">
                            <Phone size={18} /> {portfolioData.contact.phone}
                        </a>
                        <a href={`mailto:${portfolioData.contact.email}`} className="flex items-center gap-2 justify-center md:justify-start hover:text-cyan-300 transition-colors">
                            <Mail size={18} /> {portfolioData.contact.email}
                        </a>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-col gap-4 items-center md:items-end">
                    <div className="flex gap-6">
                        <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-300 transition-colors">
                            <Linkedin size={24} />
                        </a>
                        <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-300 transition-colors">
                            <Github size={24} />
                        </a>
                        <a href={portfolioData.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-300 transition-colors">
                            <Instagram size={24} />
                        </a>
                    </div>

                    {/* Coding Profiles */}
                    <div className="flex gap-4 flex-wrap justify-center md:justify-end">
                        {portfolioData.social.codingProfiles.map((profile) => (
                            <a key={profile.name} href={profile.url} target="_blank" rel="noopener noreferrer" className="text-sm bg-white/10 px-3 py-1 rounded-full text-gray-300 hover:bg-cyan-900/40 hover:text-cyan-300 transition-all border border-transparent hover:border-cyan-500/30">
                                {profile.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-600 text-sm mt-12 mb-4">
                © {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
            </div>
        </div>
    );
};

export default Footer;
