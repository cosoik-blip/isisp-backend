import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Modal component that renders at document body level
const MessageModal = ({ isOpen, onClose, message }) => {
  if (!isOpen || !message) return null;
  
  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-600 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-white text-lg">Three Thirds Society</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{message}</p>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const DynamicButton = ({ 
  buttonId, 
  fallbackText = "Button", 
  fallbackStyle = "primary",
  className = "",
  size = "default",
  children,
  ...props 
}) => {
  const [buttonConfig, setButtonConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchButtonConfig();
  }, [buttonId]);

  const fetchButtonConfig = async () => {
    try {
      const response = await axios.get(`${API}/buttons/${buttonId}`);
      setButtonConfig(response.data);
    } catch (error) {
      console.error(`Error fetching button config for ${buttonId}:`, error);
      // Use fallback configuration
      setButtonConfig({
        buttonId,
        label: fallbackText,
        isVisible: true,
        clickAction: 'none',
        buttonStyle: fallbackStyle
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e) => {
    if (!buttonConfig) return;

    switch (buttonConfig.clickAction) {
      case 'show_message':
        if (buttonConfig.clickMessage) {
          setShowMessage(true);
        }
        break;
      
      case 'redirect':
        if (buttonConfig.redirectUrl) {
          if (buttonConfig.redirectUrl.startsWith('#')) {
            // Handle hash navigation with optional query params
            const [hash, queryString] = buttonConfig.redirectUrl.split('?');
            const element = document.querySelector(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
            // Update URL with full hash (including query params) to trigger hashchange
            window.location.hash = buttonConfig.redirectUrl.substring(1);
          } else {
            // External redirect
            window.open(buttonConfig.redirectUrl, '_blank');
          }
        }
        break;
      
      default:
        // Call original onClick if provided
        if (props.onClick) {
          props.onClick(e);
        }
        break;
    }
  };

  // Don't render if button is not visible
  if (!loading && buttonConfig && !buttonConfig.isVisible) {
    return null;
  }

  if (loading) {
    return (
      <div className="inline-block">
        <div className="animate-pulse bg-gray-200 h-10 w-24 rounded"></div>
      </div>
    );
  }

  const getButtonVariant = (style) => {
    switch (style) {
      case 'secondary': return 'secondary';
      case 'outline': return 'outline';
      default: return 'default';
    }
  };

  const getButtonClassName = (style) => {
    switch (style) {
      case 'primary':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'outline':
        return 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300';
      default:
        return '';
    }
  };

  // Determine what text to show - prioritize buttonConfig.label (unless it's the default "Button"), then fallback
  const displayText = (buttonConfig?.label && buttonConfig.label !== "Button") ? buttonConfig.label : fallbackText;
  
  return (
    <div className="relative inline-block">
      <Button
        {...props}
        onClick={handleClick}
        size={size}
        variant={getButtonVariant(buttonConfig?.buttonStyle)}
        className={`${getButtonClassName(buttonConfig?.buttonStyle)} ${className}`}
      >
        {displayText}
        {children}
      </Button>
      
      {/* Message Popup - rendered via portal */}
      <MessageModal 
        isOpen={showMessage} 
        onClose={() => setShowMessage(false)} 
        message={buttonConfig?.clickMessage} 
      />
    </div>
  );
};