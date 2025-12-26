import { useEffect, useRef, useState } from 'react';
import { useConfigStore } from '../store/configStore.js';
import { useHaptic } from '../hooks/useHaptic.js';

export default function IPhonePreview({ isFullscreen = false, onFullscreenChange }) {
  const iframeRef = useRef(null);
  const { config } = useConfigStore();
  const { heavy } = useHaptic();
  const [templateUrl, setTemplateUrl] = useState('http://localhost:5173');
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastConfigRef = useRef(JSON.stringify(config));

  // Define handleRefresh first
  const handleRefresh = () => {
    heavy();
    setIsRefreshing(true);
    setIframeLoading(true);
    setIframeError(false);
    
    window.dispatchEvent(new CustomEvent('refreshStateChange', { detail: { isRefreshing: true } }));
    
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    
    setTimeout(() => {
      setIsRefreshing(false);
      window.dispatchEvent(new CustomEvent('refreshStateChange', { detail: { isRefreshing: false } }));
    }, 1000);
  };

  // Listen for refresh event from header
  useEffect(() => {
    const handleRefreshEvent = () => {
      handleRefresh();
    };
    window.addEventListener('refreshPreview', handleRefreshEvent);
    return () => window.removeEventListener('refreshPreview', handleRefreshEvent);
  }, [heavy]);

  // Detect if we're on mobile/network and use appropriate URL
  useEffect(() => {
    const hostname = window.location.hostname;
    let url = 'http://localhost:5173';
    
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      url = `http://${hostname}:5173`;
    }
    
    setTemplateUrl(url);
    
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
    
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  // Send config update to iframe via postMessage
  useEffect(() => {
    if (!config || !iframeRef.current?.contentWindow) return;

    const currentConfigStr = JSON.stringify(config);
    
    if (currentConfigStr !== lastConfigRef.current) {
      lastConfigRef.current = currentConfigStr;
      
      const timer = setTimeout(() => {
        try {
          const iframeWindow = iframeRef.current.contentWindow;
          if (iframeWindow) {
            iframeWindow.postMessage({
              type: 'CONFIG_UPDATE',
              config: config,
            }, '*');
          }
        } catch (e) {
          console.error('PostMessage error:', e);
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [config]);

  const handleIframeLoad = () => {
    setIframeError(false);
    setIframeLoading(false);
    
    if (config && iframeRef.current?.contentWindow) {
      setTimeout(() => {
        try {
          iframeRef.current.contentWindow.postMessage({
            type: 'CONFIG_UPDATE',
            config: config,
          }, '*');
        } catch (e) {
          console.error('PostMessage error:', e);
        }
      }, 300);
    }
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoading(false);
  };

  const handleFullscreenToggle = () => {
    heavy();
    onFullscreenChange?.(!isFullscreen);
  };

  // Fullscreen mode - adapts to any screen size
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        {/* Exit fullscreen button */}
        <button
          onClick={handleFullscreenToggle}
          className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 transition-all active:scale-95"
          style={{ top: 'max(16px, env(safe-area-inset-top))' }}
          aria-label="Exit fullscreen"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Fullscreen iframe - adapts to safe areas */}
        <div 
          className="w-full h-full"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
          }}
        >
          <iframe
            ref={iframeRef}
            src={templateUrl}
            className="w-full h-full border-0 bg-black"
            title="Template Preview"
            allow="camera; microphone; geolocation"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            loading="eager"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      </div>
    );
  }

  // Normal mode with iPhone frame
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* iPhone Frame */}
      <div className="relative w-[280px] h-[600px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-[2.5rem] p-[6px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-2 border-white/10">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[24px] bg-black rounded-b-[1.2rem] z-10 border-b border-white/5" />
        
        {/* Screen Container */}
        <div className="w-full h-full bg-black rounded-[2.2rem] overflow-hidden relative border border-white/5">
          <iframe
            ref={iframeRef}
            src={templateUrl}
            className="w-full h-full border-0"
            title="Template Preview"
            allow="camera; microphone; geolocation"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            loading="eager"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ 
              transform: 'scale(0.746)', 
              transformOrigin: 'top left', 
              width: '133.69%', 
              height: '133.69%' 
            }}
          />
          
          {/* Loading/Error overlay */}
          {((iframeLoading && config) || iframeError) && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 z-20">
              {iframeError ? (
                <>
                  <div className="text-4xl mb-4 animate-bounce">⚠️</div>
                  <div className="text-white text-sm font-semibold mb-3">Template non accessible</div>
                  <button 
                    onClick={() => {
                      setIframeLoading(true);
                      setIframeError(false);
                      if (iframeRef.current) {
                        iframeRef.current.src = iframeRef.current.src;
                      }
                    }}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg mt-2 transition-colors"
                  >
                    Réessayer
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {/* Animated Spinner */}
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-white/10 rounded-full"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-r-white/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                  </div>
                  
                  {/* Fun loading message */}
                  <div className="text-white/90 text-sm font-medium mb-1 animate-pulse">
                    Préparation de votre boutique...
                  </div>
                  <div className="text-white/50 text-xs">
                    ✨ Presque prêt
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Initial loading */}
          {!config && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 z-20">
              <div className="flex flex-col items-center justify-center">
                {/* Animated Spinner */}
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-2 border-4 border-transparent border-r-white/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                </div>
                
                {/* Fun loading message */}
                <div className="text-white/90 text-sm font-medium mb-1 animate-pulse">
                  Chargement de la configuration...
                </div>
                <div className="text-white/50 text-xs">
                  🚀 QuickApp se prépare
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
