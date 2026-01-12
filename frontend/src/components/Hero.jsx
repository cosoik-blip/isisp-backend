import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, CheckCircle, Users, Target, Award, Globe } from 'lucide-react';
import { DynamicButton } from './DynamicButton';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Hero = () => {
  const [heroStats, setHeroStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroStats();
  }, []);

  const fetchHeroStats = async () => {
    try {
      const response = await axios.get(`${API}/settings/hero_stats`);
      setHeroStats(response.data.stats || []);
    } catch (err) {
      console.error('Error fetching hero stats:', err);
      // Fallback to default stats if API fails
      setHeroStats([
        { number: "500+", label: "Social Enterprises Supported" },
        { number: "50+", label: "Training Programs Delivered" },
        { number: "15", label: "Regions Covered" },
        { number: "10K+", label: "Lives Impacted" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-teal-100/20 to-emerald-100/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-2 text-sm font-medium">
                🌱 Leading Social Innovation in Greece
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Empowering Social Change Through Innovation
              </h1>
              
              <div className="text-2xl font-semibold text-emerald-600 mb-4">
                Three Thirds Society (3TS)
              </div>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                We are a leading social economy organization dedicated to improving the quality of life for disadvantaged and vulnerable social groups through innovative solutions, training, and sustainable development programs.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Users, text: "Supporting Vulnerable Communities" },
                { icon: Target, text: "Evidence-Based Impact" },
                { icon: Award, text: "EU-Recognized Excellence" },
                { icon: Globe, text: "Pan-Hellenic Reach" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-emerald-100">
                  <feature.icon className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Now Dynamic */}
            <div className="flex flex-col sm:flex-row gap-4">
              <DynamicButton 
                buttonId="hero_cta_primary"
                fallbackText="Explore Our Impact"
                size="lg" 
                className="px-8 py-4 text-lg"
              >
                <ArrowRight className="ml-2 w-5 h-5" />
              </DynamicButton>
              
              <DynamicButton 
                buttonId="hero_cta_secondary"
                fallbackText="Watch Our Story"
                fallbackStyle="outline"
                size="lg"
                className="px-8 py-4 text-lg"
              />
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="lg:pl-12">
            <div className="grid grid-cols-2 gap-6">
              {loading ? (
                // Loading state
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
                    <div className="h-8 bg-emerald-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : (
                heroStats.map((stat, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-700 font-medium leading-snug">
                      {stat.label}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-gray-900">Trusted by Leading Organizations</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Partner in large European Networks</div>
                <div>• Regions & Municipalities</div>
                <div>• Regional Development Agencies</div>
                <div>• 100+ NGOs and Social Enterprises</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-8 h-12 border-2 border-emerald-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};