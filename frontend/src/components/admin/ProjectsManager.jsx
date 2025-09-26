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
  Image as ImageIcon,
  Calendar,
  MapPin
} from 'lucide-react';

export const ProjectsManager = ({ authToken }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const emptyProject = {
    title: '',
    description: '',
    impact: '',
    region: '',
    year: new Date().getFullYear().toString(),
    category: '',
    image: '',
    order: 0
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/projects`, {
        headers: { 'Authorization': `Basic ${authToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage({ type: 'error', text: 'Failed to fetch projects' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (projectData) => {
    try {
      const url = editingProject 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/admin/projects/${editingProject.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/admin/projects`;
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Project ${editingProject ? 'updated' : 'created'} successfully` });
        fetchProjects();
        setEditingProject(null);
        setIsCreating(false);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.detail || 'Failed to save project' });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setMessage({ type: 'error', text: 'Failed to save project' });
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${authToken}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Project deleted successfully' });
        fetchProjects();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete project' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setMessage({ type: 'error', text: 'Failed to delete project' });
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects Management</h2>
          <p className="text-gray-600">Manage your organization's projects</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
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

      {(isCreating || editingProject) && (
        <ProjectForm
          project={editingProject || emptyProject}
          onSave={handleSave}
          onCancel={() => {
            setEditingProject(null);
            setIsCreating(false);
          }}
          isEditing={!!editingProject}
        />
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className={`${!project.isActive ? 'opacity-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <Badge variant="outline">{project.category}</Badge>
                        {!project.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="text-gray-700">{project.region}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span className="text-gray-700">{project.year}</span>
                        </div>
                        <div className="text-emerald-700 font-medium">
                          {project.impact}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProject(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProjectForm = ({ project, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    impact: project.impact || '',
    region: project.region || '',
    year: project.year || new Date().getFullYear().toString(),
    category: project.category || '',
    image: project.image || '',
    order: project.order || 0
  });

  const categoryOptions = [
    'Regional Development', 'Digital Inclusion', 'Gender Equality', 
    'Youth Development', 'Social Enterprise', 'Training & Education',
    'Research & Innovation', 'Community Building'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Enter project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select category</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={3}
              placeholder="Enter project description"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region *
              </label>
              <Input
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                required
                placeholder="e.g., Attica, Epirus"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <Input
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                required
                placeholder="e.g., 2023-2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                placeholder="Display order"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impact Statement *
            </label>
            <Input
              value={formData.impact}
              onChange={(e) => setFormData({...formData, impact: e.target.value})}
              required
              placeholder="e.g., 25+ social enterprises launched"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <Input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a direct link to an image (recommended: 800x600px)
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};