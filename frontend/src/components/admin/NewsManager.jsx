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
  Newspaper,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const NewsManager = ({ credentials }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'news',
    image: '',
    author: '',
    isPublished: true
  });

  const authHeader = {
    auth: {
      username: credentials.username,
      password: credentials.password
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API}/admin/news`, authHeader);
      setArticles(response.data);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${API}/admin/news`, formData, authHeader);
      if (response.data.success) {
        fetchArticles();
        setIsCreating(false);
        resetForm();
      }
    } catch (err) {
      console.error('Error creating article:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${API}/admin/news/${editingArticle.id}`,
        formData,
        authHeader
      );
      if (response.data.success) {
        fetchArticles();
        setEditingArticle(null);
        resetForm();
      }
    } catch (err) {
      console.error('Error updating article:', err);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const response = await axios.delete(`${API}/admin/news/${articleId}`, authHeader);
      if (response.data.success) {
        fetchArticles();
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      const response = await axios.put(
        `${API}/admin/news/${article.id}`,
        { isPublished: !article.isPublished },
        authHeader
      );
      if (response.data.success) {
        fetchArticles();
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const startEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      image: article.image || '',
      author: article.author || '',
      isPublished: article.isPublished
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingArticle(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      category: 'news',
      image: '',
      author: '',
      isPublished: true
    });
  };

  const cancelEdit = () => {
    setEditingArticle(null);
    setIsCreating(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-emerald-100 text-emerald-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">News & Updates</h2>
        <Button onClick={startCreate} className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Article
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingArticle) && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="text-lg">
              {isCreating ? 'Create New Article' : 'Edit Article'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="news">News</option>
                  <option value="update">Update</option>
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Summary *</label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief summary of the article"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full article content"
                rows={6}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="isPublished" className="text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={isCreating ? handleCreate : handleUpdate}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Create Article' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {articles.length === 0 ? (
          <Card className="p-8 text-center">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No articles yet</h3>
            <p className="text-gray-500 mb-4">Create your first news article to get started.</p>
            <Button onClick={startCreate} className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </Button>
          </Card>
        ) : (
          articles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      {article.isPublished ? (
                        <Badge className="bg-green-100 text-green-800">Published</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{article.summary}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(article.publishedAt)}
                      </span>
                      {article.author && <span>By {article.author}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePublish(article)}
                      title={article.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {article.isPublished ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-emerald-500" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(article)}
                    >
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
