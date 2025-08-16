import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Code, Users, Lightbulb, TrendingUp, Github, Linkedin, Twitter, Mail, MapPin, Clock, CheckCircle, Star, GitFork, Eye } from 'lucide-react';
import MobileNav from '../components/MobileNav';
import ProjectShowcase from '../components/ProjectShowcase';
import UpcomingEvents from '../components/UpcomingEvents';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation */}
      <MobileNav />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-between items-center py-6 px-8 fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm transition-all duration-300">
        <div className="flex space-x-8">
          <a href="#home" className="text-white font-medium text-lg hover:text-purple-300 transition-colors duration-300">
            Home
          </a>
          <a href="#about" className="text-white/90 font-medium text-lg hover:text-white transition-colors duration-300">
            About
          </a>
          <a href="#mission" className="text-white/90 font-medium text-lg hover:text-white transition-colors duration-300">
            Mission
          </a>
          <a href="#events" className="text-white/90 font-medium text-lg hover:text-white transition-colors duration-300">
            Events
          </a>
          <a href="#projects" className="text-white/90 font-medium text-lg hover:text-white transition-colors duration-300">
            Projects
          </a>
          <a href="#contact" className="text-white/90 font-medium text-lg hover:text-white transition-colors duration-300">
            Contact
          </a>
        </div>
       
      </nav>

      {/* Home Section */}
      <section id="home" className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-black via-purple-900 to-pink-600"
          style={{
            backgroundImage: 'url("https://hc-cdn.hel1.your-objectstorage.com/s/v3/86eb6f4576f81507ee52019a92854cf6f90f7a4a_uri_ifs___m_7ca612c7-9012-4c7d-a8d3-781b3887ddd5.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-purple-900/70 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen pt-32">
          <div className="flex-1 flex items-center justify-start px-6 md:px-12 lg:px-16">
            <div className="text-left max-w-6xl pt-8">
              <h1 className="font-montserrat-alternates text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-wide">
                THE FALAK <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">CLUB</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 font-medium tracking-[0.3em] uppercase text-left mb-8">
                CODE. COLLABORATE. CREATE.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="https://discord.falak.me/"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Join the Club →
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 left-6 md:left-12">
            <a 
              href="https://instagram.com/falakuae" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-pink-400 hover:text-pink-300 transition-colors duration-300 group"
            >
              <div className="p-2 rounded-full bg-pink-400/20 group-hover:bg-pink-400/30 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">@falakuae</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">ABOUT</h2>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              The Falak Club is more than just a coding community—it's a launchpad for ambitious developers. We 
              bring together passionate individuals who believe in the power of collaboration and continuous 
              learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Mission-Driven</h3>
              <p className="text-gray-300 leading-relaxed">
                Empowering students to become tomorrow's tech leaders through 
                hands-on learning and collaborative innovation.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Community First</h3>
              <p className="text-gray-300 leading-relaxed">
                Building a supportive environment where every member can grow, learn, 
                and contribute to something meaningful.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Innovation Focus</h3>
              <p className="text-gray-300 leading-relaxed">
                Encouraging creative problem-solving and out-of-the-box thinking to 
                tackle real-world challenges.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Growth Oriented</h3>
              <p className="text-gray-300 leading-relaxed">
                Providing opportunities for skill development, mentorship, and career 
                advancement in technology.
              </p>
            </div>
          </div>

          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-gray-400 uppercase tracking-wide text-sm">Active Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">35+</div>
                <div className="text-gray-400 uppercase tracking-wide text-sm">Contributors</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">25+</div>
                <div className="text-gray-400 uppercase tracking-wide text-sm">Completed Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400 uppercase tracking-wide text-sm">Community Stars</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-12">
              MISSION
            </h2>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-12 mb-16">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  To create an inclusive space where coding enthusiasts can explore new technologies, work 
                  on meaningful projects, and build lifelong connections. We're committed to fostering 
                  innovation, encouraging collaboration, and preparing our members for successful careers 
                  in technology.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">LEARN</h3>
              <p className="text-gray-300 leading-relaxed">
                Continuous learning through workshops, mentorship, 
                and hands-on projects
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-400 mb-4">BUILD</h3>
              <p className="text-gray-300 leading-relaxed">
                Creating real-world applications that solve problems 
                and make an impact
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">CONNECT</h3>
              <p className="text-gray-300 leading-relaxed">
                Networking with industry professionals and like-minded developers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">EVENTS</h2>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              From weekly coding sessions to exciting hackathons, we've got something for every skill level and interest.
            </p>
          </div>

          {/* Upcoming Events Preview */}
          <div className="mb-16">
            <UpcomingEvents 
              limit={3} 
              showViewAll={false}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">PROJECTS</h2>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              Discover the innovative projects our members have built—from AI-powered applications to open-source tools that make a difference.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-orange-400 text-center mb-12">LATEST PROJECTS</h3>
            <ProjectShowcase limit={6} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">CONTACT</h2>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              Whether you're a beginner or experienced developer, The Falak Club welcomes you. Join our 
              community and let's build amazing things together.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/join"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-xl"
            >
              Join The Falak Club Today →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;