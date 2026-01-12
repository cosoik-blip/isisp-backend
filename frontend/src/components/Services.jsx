import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building2, GraduationCap, Lightbulb, Settings, Users, Network, ArrowRight, Download } from 'lucide-react';
import { DynamicButton } from './DynamicButton';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const iconMap = {
  Building2,
  GraduationCap,
  Lightbulb,
  Settings,
  Users,
  Network
};

export const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/services/`);
      setServices(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️ {error}</div>
            <Button onClick={fetchServices} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
            Our Services
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Solutions for
            <span className="text-emerald-600"> Social Impact</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We offer a full spectrum of services designed to empower organizations, 
            individuals, and communities to create lasting positive change.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            
            return (
              <Card 
                key={service.id} 
                className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50"
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <DynamicButton 
                    buttonId={`service_learn_more_${service.id}`}
                    fallbackText="Learn More"
                    fallbackStyle="outline"
                    className="w-full justify-between"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </DynamicButton>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 lg:p-12 border border-emerald-100">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ready to Create Impact Together?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's discuss how our services can help you achieve your social impact goals 
              and create meaningful change in your community.
            </p>
            
            {/* Company Documents */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Learn More About Our Organization</h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <a
                  href="https://customer-assets.emergentagent.com/job_better-3ts-web/artifacts/hlyo8o6s_3TS_PROFILE_ENG.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download 3TS Profile
                </a>
                <a
                  href="https://customer-assets.emergentagent.com/job_be84ca3b-7915-4def-83ac-2c90d340c0d9/artifacts/v2ghcjnw_3TS_PIF.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download 3TS PIF
                </a>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DynamicButton 
                buttonId="services_cta_primary"
                fallbackText="Schedule Consultation"
                size="lg"
              >
                <ArrowRight className="ml-2 w-5 h-5" />
              </DynamicButton>
              
              <DynamicButton 
                buttonId="services_cta_secondary"
                fallbackText="Contact Us Today"
                fallbackStyle="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};