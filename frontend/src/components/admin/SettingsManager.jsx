import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Save, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Phone,
  Settings as SettingsIcon
} from 'lucide-react';

export const SettingsManager = ({ authToken }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/settings`, {
        headers: { 'Authorization': `Basic ${authToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to fetch settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSetting = async (settingKey, settingValue) => {
    setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/settings/${settingKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        },
        body: JSON.stringify({ settingValue })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings updated successfully' });
        fetchSettings();
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings' });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings Management</h2>
        <p className="text-gray-600">Configure your website content and information</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </span>
        </div>
      )}

      <div className="grid gap-6">
        {/* Hero Statistics */}
        <HeroStatsSettings 
          settings={settings.hero_stats?.settingValue} 
          onSave={(value) => handleSaveSetting('hero_stats', value)}
          saving={saving}
        />

        {/* Contact Information */}
        <ContactInfoSettings 
          settings={settings.contact_info?.settingValue} 
          onSave={(value) => handleSaveSetting('contact_info', value)}
          saving={saving}
        />

        {/* Company Information */}
        <CompanyInfoSettings 
          settings={settings.company_info?.settingValue} 
          onSave={(value) => handleSaveSetting('company_info', value)}
          saving={saving}
        />
      </div>
    </div>
  );
};

const HeroStatsSettings = ({ settings, onSave, saving }) => {
  const [stats, setStats] = useState(settings?.stats || [
    { number: '500+', label: 'Social Enterprises Supported' },
    { number: '50+', label: 'Training Programs Delivered' },
    { number: '15', label: 'Regions Covered' },
    { number: '10K+', label: 'Lives Impacted' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ stats });
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <span>Hero Section Statistics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-gray-900">Statistic {index + 1}</h4>
                <Input
                  placeholder="Number (e.g., 500+)"
                  value={stat.number}
                  onChange={(e) => updateStat(index, 'number', e.target.value)}
                />
                <Input
                  placeholder="Label (e.g., Projects Completed)"
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Statistics'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ContactInfoSettings = ({ settings, onSave, saving }) => {
  const [contactInfo, setContactInfo] = useState({
    address: settings?.address || 'Pellis 2, Nea Filadelfia, Attiki, Greece',
    phone: settings?.phone || '+30 211 7057627',
    email: settings?.email || 'info@3ts.gr',
    workingHours: settings?.workingHours || 'Monday - Friday: 9:00 AM - 6:00 PM'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(contactInfo);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-emerald-600" />
          <span>Contact Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Textarea
              value={contactInfo.address}
              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
              rows={2}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <Input
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Hours
            </label>
            <Input
              value={contactInfo.workingHours}
              onChange={(e) => setContactInfo({...contactInfo, workingHours: e.target.value})}
            />
          </div>
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Contact Info'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const CompanyInfoSettings = ({ settings, onSave, saving }) => {
  const [companyInfo, setCompanyInfo] = useState({
    name: settings?.name || 'Three Thirds Society',
    shortName: settings?.shortName || '3TS',
    tagline: settings?.tagline || 'Social Economy & Innovation',
    description: settings?.description || 'We are a leading social economy organization dedicated to improving the quality of life for disadvantaged and vulnerable social groups through innovative solutions, training, and sustainable development programs.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(companyInfo);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-emerald-600" />
          <span>Company Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <Input
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Name
              </label>
              <Input
                value={companyInfo.shortName}
                onChange={(e) => setCompanyInfo({...companyInfo, shortName: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <Input
              value={companyInfo.tagline}
              onChange={(e) => setCompanyInfo({...companyInfo, tagline: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={companyInfo.description}
              onChange={(e) => setCompanyInfo({...companyInfo, description: e.target.value})}
              rows={4}
            />
          </div>
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Company Info'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};