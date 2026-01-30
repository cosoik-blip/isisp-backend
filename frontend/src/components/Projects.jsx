import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowRight, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { DynamicButton } from './DynamicButton';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Default images by category
const CATEGORY_DEFAULT_IMAGES = {
  'Regional Development': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
  'Digital Inclusion': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
  'Gender Equality': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
  'Youth Development': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  'Social Enterprise': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  'Training & Education': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
  'Research & Innovation': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
  'Community Building': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
  'default': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'
};

// Get the appropriate image for a project
const getProjectImage = (project) => {
  // If project has a valid image URL, use it
  if (project.image && project.image.trim() !== '') {
    return project.image;
  }
  // Otherwise, return category default or general default
  return CATEGORY_DEFAULT_IMAGES[project.category] || CATEGORY_DEFAULT_IMAGES['default'];
};

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/projects/`);
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️ {error}</div>
            <Button onClick={fetchProjects} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
            Our Impact Projects
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Transforming Communities
            <span className="text-emerald-600"> Across Greece</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Discover how we're creating measurable social impact through strategic initiatives 
            that empower communities and foster sustainable development.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <Card 
              key={project.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg bg-white"
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={getProjectImage(project)} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    // If the image fails to load, fall back to category default
                    e.target.src = CATEGORY_DEFAULT_IMAGES[project.category] || CATEGORY_DEFAULT_IMAGES['default'];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Badge className="absolute top-4 left-4 bg-emerald-500 text-white">
                  {project.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700 font-medium">{project.region}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700 font-medium">{project.year}</span>
                    </div>
                  </div>

                  {/* Impact Metric */}
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-800">Key Impact</span>
                    </div>
                    <div className="text-emerald-700 font-bold">
                      {project.impact}
                    </div>
                  </div>

                  {/* Learn More Button - Configurable from Dashboard */}
                  <DynamicButton 
                    buttonId={`project_learn_more_${project.id}`}
                    fallbackText="Learn More"
                    fallbackStyle="outline"
                    className="w-full justify-center border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </DynamicButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 shadow-xl">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Partner With Us on Your Next Project
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Have a social impact initiative in mind? Let's collaborate to create meaningful 
              change in your community with our proven project management expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DynamicButton 
                buttonId="projects_cta_primary"
                fallbackText="Propose a Project"
                size="lg"
              >
                <ArrowRight className="ml-2 w-5 h-5" />
              </DynamicButton>
              
              <DynamicButton 
                buttonId="projects_cta_secondary"
                fallbackText="View All Projects"
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