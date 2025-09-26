import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  LogOut,
  Eye,
  Edit,
  Plus,
  Trash2,
  MousePointer
} from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { ServicesManager } from './ServicesManager';
import { ProjectsManager } from './ProjectsManager';
import { SettingsManager } from './SettingsManager';
import { InquiriesManager } from './InquiriesManager';
import { ButtonsManager } from './ButtonsManager';

export const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const stored = localStorage.getItem('adminAuth');
    if (stored) {
      setAuthToken(stored);
      setIsAuthenticated(true);
      fetchDashboardData(stored);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    fetchDashboardData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setAuthToken(null);
    setIsAuthenticated(false);
    setDashboardData(null);
    setActiveSection('overview');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Eye },
    { id: 'buttons', label: 'Buttons', icon: MousePointer },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  ];

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="https://customer-assets.emergentagent.com/job_better-3ts-web/artifacts/xg6h7k8b_image.png" 
                  alt="3TS Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Three Thirds Society</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeSection === item.id 
                            ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' 
                            : 'text-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.id === 'inquiries' && dashboardData?.new_inquiries > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {dashboardData.new_inquiries}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {activeSection === 'overview' && (
              <OverviewSection dashboardData={dashboardData} />
            )}
            {activeSection === 'services' && (
              <ServicesManager authToken={authToken} />
            )}
            {activeSection === 'projects' && (
              <ProjectsManager authToken={authToken} />
            )}
            {activeSection === 'buttons' && (
              <ButtonsManager authToken={authToken} />
            )}
            {activeSection === 'settings' && (
              <SettingsManager authToken={authToken} />
            )}
            {activeSection === 'inquiries' && (
              <InquiriesManager authToken={authToken} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewSection = ({ dashboardData }) => {
  if (!dashboardData) return null;

  const stats = [
    {
      title: 'Active Services',
      value: dashboardData.services_count,
      icon: Briefcase,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Projects',
      value: dashboardData.projects_count,
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      title: 'Button Configs',
      value: dashboardData.buttons_count,
      icon: MousePointer,
      color: 'bg-indigo-500'
    },
    {
      title: 'Total Inquiries',
      value: dashboardData.total_inquiries,
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'New Inquiries',
      value: dashboardData.new_inquiries,
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your content management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contact Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recent_inquiries?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recent_inquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{inquiry.name}</h4>
                      <Badge variant={inquiry.status === 'new' ? 'destructive' : 'secondary'}>
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{inquiry.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No inquiries yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};