import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, Users, Star, Calendar, ArrowRight } from 'lucide-react';
import { trainingData } from '../mock';

export const Training = () => {
  return (
    <section id="training" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
            Training Programs
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Build Skills for
            <span className="text-emerald-600"> Social Impact</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our comprehensive training programs are designed to empower individuals and 
            organizations with the knowledge and skills needed to create lasting social change.
          </p>
        </div>

        {/* Training Programs */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {trainingData.map((training, index) => (
            <Card 
              key={training.id} 
              className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 relative overflow-hidden"
            >
              {/* Popular Badge */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                    ⭐ Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 pr-8">
                  {training.title}
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  {training.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Training Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700 font-medium">Duration</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{training.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700 font-medium">Participants</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{training.participants}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700 font-medium">Level</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{training.level}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700 font-medium">Next Session</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-700">{training.nextDate}</span>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">What You'll Learn:</h4>
                  <div className="space-y-2">
                    {training.topics.slice(0, 3).map((topic, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{topic}</span>
                      </div>
                    ))}
                    {training.topics.length > 3 && (
                      <div className="text-sm text-emerald-600 font-medium">
                        +{training.topics.length - 3} more topics
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Investment</span>
                    <span className="text-lg font-bold text-emerald-600">{training.price}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Register Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Training Benefits */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 lg:p-12 border border-emerald-100 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Training Programs?
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: "Expert Instructors",
                description: "Learn from seasoned professionals with 10+ years of experience in social impact work."
              },
              {
                icon: "🤝",
                title: "Networking Opportunities",
                description: "Connect with like-minded individuals and build valuable professional relationships."
              },
              {
                icon: "📜",
                title: "Certified Programs",
                description: "Receive recognized certificates that validate your commitment to social change."
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Learning Journey?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of professionals who have transformed their careers and communities 
            through our comprehensive training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View All Programs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
            >
              Custom Training Request
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};