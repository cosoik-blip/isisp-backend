import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle,
  MousePointer,
  Eye,
  EyeOff,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const ButtonsManager = ({ authToken }) => {
  const [buttons, setButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingButton, setEditingButton] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const emptyButton = {
    buttonId: '',
    section: 'hero',
    label: '',
    isVisible: true,
    clickAction: 'none',
    clickMessage: '',
    redirectUrl: '',
    buttonStyle: 'primary',
    order: 0
  };

  const sections = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'services', label: 'Services Section' },
    { value: 'projects', label: 'Projects Section' },
    { value: 'contact', label: 'Contact Section' },
    { value: 'footer', label: 'Footer Section' }
  ];

  const clickActions = [
    { value: 'none', label: 'No Action', icon: X },
    { value: 'show_message', label: 'Show Message', icon: MessageCircle },
    { value: 'redirect', label: 'Redirect to URL', icon: ExternalLink }
  ];

  const buttonStyles = [
    { value: 'primary', label: 'Primary (Green)', preview: 'bg-emerald-500 text-white' },
    { value: 'secondary', label: 'Secondary (Gray)', preview: 'bg-gray-500 text-white' },
    { value: 'outline', label: 'Outline', preview: 'border border-emerald-500 text-emerald-500' }
  ];

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/buttons`, {
        headers: { 'Authorization': `Basic ${authToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setButtons(data);
      }
    } catch (error) {
      console.error('Error fetching buttons:', error);
      setMessage({ type: 'error', text: 'Failed to fetch buttons' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (buttonData) => {
    try {
      const url = editingButton 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/admin/buttons/${editingButton.buttonId}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/admin/buttons`;
      
      const method = editingButton ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        },
        body: JSON.stringify(buttonData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Button ${editingButton ? 'updated' : 'created'} successfully` });
        fetchButtons();
        setEditingButton(null);
        setIsCreating(false);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.detail || 'Failed to save button' });
      }
    } catch (error) {
      console.error('Error saving button:', error);
      setMessage({ type: 'error', text: 'Failed to save button' });
    }
  };

  const handleDelete = async (buttonId) => {
    if (!window.confirm('Are you sure you want to delete this button configuration?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/buttons/${buttonId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${authToken}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Button deleted successfully' });
        fetchButtons();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete button' });
      }
    } catch (error) {
      console.error('Error deleting button:', error);
      setMessage({ type: 'error', text: 'Failed to delete button' });
    }
  };

  const toggleVisibility = async (button) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/buttons/${button.buttonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        },
        body: JSON.stringify({ isVisible: !button.isVisible })
      });

      if (response.ok) {
        fetchButtons();
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Group buttons by section
  const buttonsBySection = buttons.reduce((acc, button) => {
    if (!acc[button.section]) {
      acc[button.section] = [];
    }
    acc[button.section].push(button);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Button & Interactions Management</h2>
          <p className="text-gray-600">Control button visibility, text, and click actions</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Button
        </Button>
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

      {(isCreating || editingButton) && (
        <ButtonForm
          button={editingButton || emptyButton}
          onSave={handleSave}
          onCancel={() => {
            setEditingButton(null);
            setIsCreating(false);
          }}
          isEditing={!!editingButton}
          sections={sections}
          clickActions={clickActions}
          buttonStyles={buttonStyles}
        />
      )}

      {/* Buttons organized by section */}
      {sections.map(section => {
        const sectionButtons = buttonsBySection[section.value] || [];
        if (sectionButtons.length === 0) return null;

        return (
          <Card key={section.value}>
            <CardHeader>
              <CardTitle className="text-lg">{section.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectionButtons.map((button) => (
                  <div key={button.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">{button.label}</span>
                          <Badge variant={button.isVisible ? 'default' : 'secondary'}>
                            {button.isVisible ? 'Visible' : 'Hidden'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {button.buttonStyle}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Button ID:</span> {button.buttonId}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Click Action:</span> {button.clickAction}
                        </div>
                        
                        {button.clickAction === 'show_message' && button.clickMessage && (
                          <div className="bg-gray-50 rounded p-2 text-sm text-gray-700 mt-2">
                            <span className="font-medium">Message:</span> {button.clickMessage}
                          </div>
                        )}
                        
                        {button.clickAction === 'redirect' && button.redirectUrl && (
                          <div className="bg-gray-50 rounded p-2 text-sm text-gray-700 mt-2">
                            <span className="font-medium">Redirect URL:</span> {button.redirectUrl}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleVisibility(button)}
                          className={button.isVisible ? '' : 'text-gray-400'}
                        >
                          {button.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingButton(button)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(button.buttonId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const ButtonForm = ({ button, onSave, onCancel, isEditing, sections, clickActions, buttonStyles }) => {
  const [formData, setFormData] = useState({
    buttonId: button.buttonId || '',
    section: button.section || 'hero',
    label: button.label || '',
    isVisible: button.isVisible !== undefined ? button.isVisible : true,
    clickAction: button.clickAction || 'none',
    clickMessage: button.clickMessage || '',
    redirectUrl: button.redirectUrl || '',
    buttonStyle: button.buttonStyle || 'primary',
    order: button.order || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Button Configuration' : 'Add New Button'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button ID * {!isEditing && <span className="text-xs text-gray-500">(unique identifier)</span>}
              </label>
              <Input
                value={formData.buttonId}
                onChange={(e) => setFormData({...formData, buttonId: e.target.value})}
                required
                disabled={isEditing}
                placeholder="e.g., hero_cta_primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section *
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {sections.map(section => (
                  <option key={section.value} value={section.value}>{section.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text *
            </label>
            <Input
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              required
              placeholder="Enter button text"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Style
              </label>
              <select
                value={formData.buttonStyle}
                onChange={(e) => setFormData({...formData, buttonStyle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {buttonStyles.map(style => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order (for sorting)
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Click Action
            </label>
            <select
              value={formData.clickAction}
              onChange={(e) => setFormData({...formData, clickAction: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {clickActions.map(action => (
                <option key={action.value} value={action.value}>{action.label}</option>
              ))}
            </select>
          </div>

          {formData.clickAction === 'show_message' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Show on Click
              </label>
              <Textarea
                value={formData.clickMessage}
                onChange={(e) => setFormData({...formData, clickMessage: e.target.value})}
                rows={3}
                placeholder="Enter the message that will appear when users click this button"
              />
            </div>
          )}

          {formData.clickAction === 'redirect' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URL
              </label>
              <Input
                type="url"
                value={formData.redirectUrl}
                onChange={(e) => setFormData({...formData, redirectUrl: e.target.value})}
                placeholder="https://example.com or #section"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData({...formData, isVisible: e.target.checked})}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">
              Button is visible on website
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update' : 'Create'} Button
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};