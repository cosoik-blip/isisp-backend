import React from 'react';
import { Button } from './ui/button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Instagram,
  ArrowRight,
  Heart
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="https://customer-assets.emergentagent.com/job_better-3ts-web/artifacts/xg6h7k8b_image.png" 
                  alt="Three Thirds Society Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Three Thirds Society</h3>
                <p className="text-emerald-400 text-sm">Social Economy & Innovation</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Empowering communities and creating lasting social impact through innovative solutions, 
              comprehensive training, and sustainable development programs across Greece.
            </p>
            <div className="flex space-x-4" data-testid="social-links-container">
              <a 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-blue-400 hover:scale-110"
                data-testid="social-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/ThreeThirdsSociety/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-blue-500 hover:scale-110"
                data-testid="social-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-sky-400 hover:scale-110"
                data-testid="social-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-pink-400 hover:scale-110"
                data-testid="social-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '#' },
                { label: 'Our Services', href: '#services' },
                { label: 'Projects', href: '#projects' },
                { label: 'Training Programs', href: '#training' },
                { label: 'Resources', href: '#resources' },
                { label: 'News & Updates', href: '#' },
                { label: 'Careers', href: '#' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                'Social Enterprise Development',
                'Training & Capacity Building',
                'Research & Innovation',
                'Project Management',
                'Advisory Services',
                'Networking & Partnerships'
              ].map((service, index) => (
                <li key={index}>
                  <a 
                    href="#services" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Documents */}
          <div>
            <h4 className="text-lg font-bold mb-6">Company Documents</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://customer-assets.emergentagent.com/job_better-3ts-web/artifacts/hlyo8o6s_3TS_PROFILE_ENG.pdf" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  3TS Profile (PDF)
                </a>
              </li>
              <li>
                <a 
                  href="https://customer-assets.emergentagent.com/job_better-3ts-web/artifacts/twmue6l7_3TS_PIF_250106.docx" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  3TS PIF (DOC)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Stay Connected</h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-300 text-sm">Pellis 2, Nea Filadelfia, Marousi, Attiki</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-300 text-sm">+30 211 7057627</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-300 text-sm">info@3ts.gr</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-semibold mb-3">Newsletter</h5>
              <p className="text-gray-300 text-sm mb-4">
                Get updates on our latest projects and training programs.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                />
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>© {currentYear} Three Thirds Society. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 mx-1" />
              <span>for social impact</span>
            </div>
            
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};