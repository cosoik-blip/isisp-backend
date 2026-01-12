import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Users, 
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  });
  
  const [contactInfo, setContactInfo] = useState({
    address: "Pellis 2, Nea Filadelfia, Attiki, Greece",
    phone: "+30 211 7057627",
    email: "info@3ts.gr",
    workingHours: "Monday - Friday: 9:00 AM - 6:00 PM"
  });
  
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const handleQuickAction = (actionType) => {
    const subjects = {
      consultation: 'Schedule a Consultation',
      partnership: 'Partnership Inquiry'
    };
    
    const messages = {
      consultation: 'Hello,\n\nI would like to schedule a consultation to discuss potential collaboration opportunities.\n\nPlease let me know your available times.\n\nThank you.',
      partnership: 'Hello,\n\nI am interested in exploring partnership opportunities with Three Thirds Society.\n\nI would appreciate the opportunity to discuss how we might work together.\n\nThank you.'
    };
    
    setFormData(prev => ({
      ...prev,
      subject: subjects[actionType],
      message: messages[actionType]
    }));
    
    // Reset form state if previously submitted
    setFormState({
      isSubmitting: false,
      isSubmitted: false,
      error: null
    });
    
    // Scroll to the form
    setTimeout(() => {
      const formElement = document.getElementById('contact-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(`${API}/settings/contact_info`);
      setContactInfo(response.data);
    } catch (err) {
      console.error('Error fetching contact info:', err);
      // Keep default contact info if API fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormState({
        ...formState,
        error: 'Please fill in all required fields.'
      });
      return;
    }

    setFormState({
      isSubmitting: true,
      isSubmitted: false,
      error: null
    });

    try {
      const response = await axios.post(`${API}/contact/`, formData);
      
      if (response.data.success) {
        setFormState({
          isSubmitting: false,
          isSubmitted: true,
          error: null
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          organization: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: err.response?.data?.detail || err.message || 'Failed to send message. Please try again.'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (formState.error) {
      setFormState({ ...formState, error: null });
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
            Get In Touch
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Let's Create Impact
            <span className="text-emerald-600"> Together</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Ready to start your social impact journey? We're here to help you every step of the way.
            Reach out to discuss your ideas, challenges, or collaboration opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="w-6 h-6 text-emerald-600 mr-3" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Address</div>
                    <div className="text-gray-600 text-sm">{contactInfo.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <div className="text-gray-600 text-sm">{contactInfo.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600 text-sm">{contactInfo.email}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Working Hours</div>
                    <div className="text-gray-600 text-sm">{contactInfo.workingHours}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">Quick Actions</h3>
              
              <Button 
                variant="outline" 
                className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                onClick={() => handleQuickAction('consultation')}
              >
                <Users className="w-4 h-4 mr-3" />
                Schedule a Consultation
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                onClick={() => handleQuickAction('partnership')}
              >
                <Building className="w-4 h-4 mr-3" />
                Partnership Inquiry
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card id="contact-form" className="shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Send us a Message
                </CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                {/* Success Message */}
                {formState.isSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">Message sent successfully!</div>
                      <div className="text-sm text-green-600">We'll get back to you within 24-48 hours.</div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {formState.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div className="text-sm text-red-600">{formState.error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        disabled={formState.isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
                        className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        disabled={formState.isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization
                      </label>
                      <Input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="Your organization name"
                        className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        disabled={formState.isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What's this about?"
                        className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        disabled={formState.isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us more about how we can help you..."
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      disabled={formState.isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit"
                    size="lg"
                    disabled={formState.isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {formState.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};