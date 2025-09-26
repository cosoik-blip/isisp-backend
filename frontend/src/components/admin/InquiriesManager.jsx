import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  Clock, 
  Mail,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

export const InquiriesManager = ({ authToken }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/inquiries`, {
        headers: { 'Authorization': `Basic ${authToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/inquiries/${inquiryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry && selectedInquiry.id === inquiryId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return Clock;
      case 'read': return Eye;
      case 'responded': return Mail;
      case 'closed': return CheckCircle;
      default: return MessageSquare;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h2 className="text-2xl font-bold text-gray-900">Contact Inquiries</h2>
        <p className="text-gray-600">Manage and respond to website contact inquiries</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inquiries List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Inquiries ({filteredInquiries.length})
          </h3>
          {filteredInquiries.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No inquiries found</p>
              </CardContent>
            </Card>
          ) : (
            filteredInquiries.map((inquiry) => {
              const StatusIcon = getStatusIcon(inquiry.status);
              return (
                <Card 
                  key={inquiry.id}
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    selectedInquiry?.id === inquiry.id ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  onClick={() => setSelectedInquiry(inquiry)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{inquiry.name}</h4>
                          <Badge className={getStatusColor(inquiry.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{inquiry.email}</p>
                        <p className="text-sm font-medium text-gray-800">{inquiry.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                      {inquiry.organization && (
                        <span className="text-emerald-600">{inquiry.organization}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Inquiry Details */}
        <div className="lg:sticky lg:top-6">
          {selectedInquiry ? (
            <InquiryDetails 
              inquiry={selectedInquiry} 
              onStatusUpdate={updateInquiryStatus}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select an inquiry to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const InquiryDetails = ({ inquiry, onStatusUpdate }) => {
  const statusOptions = ['new', 'read', 'responded', 'closed'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Inquiry Details</span>
          <Badge className={`${
            inquiry.status === 'new' ? 'bg-red-100 text-red-800' :
            inquiry.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
            inquiry.status === 'responded' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {inquiry.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <p className="text-gray-900">{inquiry.name}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{inquiry.email}</p>
        </div>
        
        {inquiry.organization && (
          <div>
            <label className="text-sm font-medium text-gray-700">Organization</label>
            <p className="text-gray-900">{inquiry.organization}</p>
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <p className="text-gray-900">{inquiry.subject}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700">Message</label>
          <div className="bg-gray-50 rounded-lg p-3 mt-1">
            <p className="text-gray-900 whitespace-pre-wrap">{inquiry.message}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium text-gray-700">Received</label>
            <p className="text-sm text-gray-600">
              {new Date(inquiry.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">IP Address</label>
            <p className="text-sm text-gray-600">{inquiry.ipAddress || 'Unknown'}</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Update Status</label>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map(status => (
              <Button
                key={status}
                variant={inquiry.status === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusUpdate(inquiry.id, status)}
                className={inquiry.status === status ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => window.open(`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Reply via Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};