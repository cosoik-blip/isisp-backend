import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Download, FileText, Database, Table, Scale, ArrowRight, Search } from 'lucide-react';
import { resourcesData } from '../mock';

const iconMap = {
  "PDF Guide": FileText,
  "Online Database": Database,
  "Excel Template": Table,
  "PDF Document": Scale
};

export const Resources = () => {
  return (
    <section id="resources" className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
            Resource Library
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Free Tools &
            <span className="text-emerald-600"> Resources</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Access our comprehensive collection of guides, templates, and tools designed 
            to support your social impact journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources by keyword, category, or type..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-lg"
            />
          </div>
        </div>

        {/* Resource Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['All', 'Entrepreneurship', 'Funding', 'Impact Assessment', 'Legal', 'Templates'].map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              className={category === 'All' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resourcesData.map((resource) => {
            const IconComponent = iconMap[resource.type] || FileText;
            
            return (
              <Card 
                key={resource.id} 
                className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg bg-white"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 leading-tight">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Downloads</span>
                      <span className="font-semibold text-gray-900">{resource.downloadCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category</span>
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Size</span>
                      <span className="text-xs text-gray-700">{resource.size}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Free
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 shadow-xl text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with New Resources
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get notified when we publish new guides, templates, and tools. 
            Join our community of social impact professionals.
          </p>
          
          <div className="max-w-md mx-auto flex gap-4 mb-6">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6">
              Subscribe
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            No spam, unsubscribe at any time. We respect your privacy.
          </div>
        </div>
      </div>
    </section>
  );
};