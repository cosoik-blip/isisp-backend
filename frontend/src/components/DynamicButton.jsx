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
      
      {/* Message Popup */}
      {showMessage && buttonConfig?.clickMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={() => setShowMessage(false)}>
          <div 
            className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">Three Thirds Society</h3>
              </div>
              <button
                onClick={() => setShowMessage(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pr-2">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{buttonConfig.clickMessage}</p>
            </div>
            <div className="mt-4 flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowMessage(false)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};