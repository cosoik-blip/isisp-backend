import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram,
  Linkedin,
  ArrowRight,
  Heart,
  X,
  Briefcase,
  Users,
  GraduationCap
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showCareersModal, setShowCareersModal] = useState(false);

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
                href="https://www.facebook.com/ThreeThirdsSociety/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-blue-500 hover:scale-110"
                data-testid="social-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/3tsnpo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-pink-500 hover:scale-110"
                data-testid="social-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/three-thirds-society-npo-180b65278/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-blue-600 hover:scale-110"
                data-testid="social-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Our Services
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Projects
                </a>
              </li>
              <li>
                <a href="#news" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  News & Updates
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setShowCareersModal(true)}
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Careers
                </button>
              </li>
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

          {/* Company Documents & Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Company Documents</h4>
            <ul className="space-y-3 mb-6">
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
                  href="https://customer-assets.emergentagent.com/job_be84ca3b-7915-4def-83ac-2c90d340c0d9/artifacts/v2ghcjnw_3TS_PIF.pdf" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  3TS PIF (PDF)
                </a>
              </li>
            </ul>
            
            {/* Contact Info */}
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-300 text-sm">Pellis 2, Nea Filadelfia, Attiki</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-300 text-sm">+30 210 2718039</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-300 text-sm">info@3ts.gr</span>
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

      {/* Careers Modal */}
      {showCareersModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCareersModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Careers at 3TS</h2>
                    <p className="text-emerald-100">Join our mission to create social impact</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCareersModal(false)}
                  className="text-white/80 hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Work With Us?</h3>
                  <p className="text-gray-600">
                    At Three Thirds Society, we believe in empowering not just communities, but also our team members. 
                    Join us in making a real difference in the social economy sector across Greece and Europe.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Collaborative Team</h4>
                    <p className="text-sm text-gray-600">Work with passionate professionals</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <GraduationCap className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Growth Opportunities</h4>
                    <p className="text-sm text-gray-600">Continuous learning & development</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <Heart className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Meaningful Work</h4>
                    <p className="text-sm text-gray-600">Create real social impact</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Openings</h3>
                  <p className="text-gray-600 mb-4">
                    We're always looking for talented individuals who share our passion for social change. 
                    While we may not have specific positions listed at the moment, we welcome spontaneous applications.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">
                      <strong>Interested in joining our team?</strong><br />
                      Send your CV and a cover letter explaining your interest in social economy to:
                    </p>
                    <a 
                      href="mailto:info@3ts.gr?subject=Career Inquiry" 
                      className="inline-flex items-center mt-2 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      info@3ts.gr
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <a 
                href="#contact" 
                onClick={() => setShowCareersModal(false)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Contact Us
              </a>
              <Button
                onClick={() => setShowCareersModal(false)}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
