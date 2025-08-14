import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 p-2 rounded-lg bg-black/30 backdrop-blur-sm text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
            <Link 
              to="/"
              href="#home" 
              onClick={() => setIsOpen(false)}
              className="text-white font-medium text-2xl hover:text-purple-300 transition-colors duration-300 border border-white/20 px-4 py-2 rounded-lg"
            >
              Home
            </Link>
            <a 
              href="#about" 
              onClick={() => setIsOpen(false)}
              className="text-white/80 font-medium text-2xl hover:text-white transition-colors duration-300"
            >
              About
            </a>
            <a 
              href="#mission" 
              onClick={() => setIsOpen(false)}
              className="text-white/80 font-medium text-2xl hover:text-white transition-colors duration-300"
            >
              Mission
            </a>
            <a 
              href="#events" 
              onClick={() => setIsOpen(false)}
              className="text-white/80 font-medium text-2xl hover:text-white transition-colors duration-300 border border-white/20 px-4 py-2 rounded-lg"
            >
              Events
            </a>
            <a 
              href="#projects" 
              onClick={() => setIsOpen(false)}
              className="text-white/80 font-medium text-2xl hover:text-white transition-colors duration-300"
            >
              Projects
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsOpen(false)}
              className="text-white/80 font-medium text-2xl hover:text-white transition-colors duration-300"
            >
              Contact
            </a>
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="text-white/80 font-medium text-2xl hover:text-white transition-colors duration-300 border border-white/20 px-4 py-2 rounded-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;