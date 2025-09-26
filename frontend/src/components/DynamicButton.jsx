import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
          // Auto-hide message after 5 seconds
          setTimeout(() => setShowMessage(false), 5000);
        }
        break;
      
      case 'redirect':
        if (buttonConfig.redirectUrl) {
          if (buttonConfig.redirectUrl.startsWith('#')) {
            // Scroll to section
            const element = document.querySelector(buttonConfig.redirectUrl);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
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

  return (
    <div className="relative inline-block">
      <Button
        {...props}
        onClick={handleClick}
        size={size}
        variant={getButtonVariant(buttonConfig?.buttonStyle)}
        className={`${getButtonClassName(buttonConfig?.buttonStyle)} ${className}`}
      >
        {children || buttonConfig?.label || fallbackText}
      </Button>
      
      {/* Message Popup */}
      {showMessage && buttonConfig?.clickMessage && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{buttonConfig.clickMessage}</p>
              </div>
              <button
                onClick={() => setShowMessage(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};