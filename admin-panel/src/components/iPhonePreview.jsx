import { useEffect, useRef, useState } from 'react';
import { useConfigStore } from '../store/configStore.js';

export default function IPhonePreview() {
  const iframeRef = useRef(null);
  const { config } = useConfigStore();
  const [templateUrl, setTemplateUrl] = useState('http://localhost:5173');
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const lastConfigRef = useRef(JSON.stringify(config));

  // Detect if we're on mobile/network and use appropriate URL
  useEffect(() => {
    const hostname = window.location.hostname;
    let url = 'http://localhost:5173';
    
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      // We're on network, use the same hostname for template
      url = `http://${hostname}:5173`;
    }
    
    setTemplateUrl(url);
    
    // Preconnect to template URL for faster loading
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
    
    console.log('📱 Template URL:', url);
    console.log('🌐 Current hostname:', hostname);
    
    return () => {
      // Cleanup
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  // Send config update to iframe via postMessage (NO RELOAD)
  useEffect(() => {
    if (!config || !iframeRef.current?.contentWindow) return;

    const currentConfigStr = JSON.stringify(config);
    
    // Only send if config actually changed
    if (currentConfigStr !== lastConfigRef.current) {
      lastConfigRef.current = currentConfigStr;
      
      // Reduced delay for faster updates (100ms instead of 400ms)
      const timer = setTimeout(() => {
        try {
          const iframeWindow = iframeRef.current.contentWindow;
          if (iframeWindow) {
            // Send config update via postMessage
            iframeWindow.postMessage({
              type: 'CONFIG_UPDATE',
              config: config,
            }, '*'); // In production, use specific origin
            
            console.log('📤 Sent config update to iframe');
          }
        } catch (e) {
          console.error('PostMessage error:', e);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [config]);

  const handleIframeLoad = () => {
    setIframeError(false);
    setIframeLoading(false);
    console.log('✅ Iframe chargée avec succès');
    
    // Send initial config immediately once iframe is loaded (reduced delay)
    if (config && iframeRef.current?.contentWindow) {
      // Send immediately, the iframe's message listener is already set up
      setTimeout(() => {
        try {
          iframeRef.current.contentWindow.postMessage({
            type: 'CONFIG_UPDATE',
            config: config,
          }, '*');
          console.log('📤 Sent initial config to iframe');
        } catch (e) {
          console.error('PostMessage error:', e);
        }
      }, 100); // Reduced from 500ms to 100ms
    }
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoading(false);
    console.error('❌ Erreur de chargement iframe');
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* iPhone Frame - REDUCED SIZE */}
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
            style={{ transform: 'scale(0.746)', transformOrigin: 'top left', width: '133.69%', height: '133.69%' }}
          />
          
          {/* Loading/Error overlay */}
          {((iframeLoading && config) || iframeError) && (
            <div 
              className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-4 z-20"
            >
              {iframeError ? (
                <>
                  <div className="text-3xl mb-3">⚠️</div>
                  <div className="text-white text-xs font-semibold mb-2">Template non accessible</div>
                  <button 
                    onClick={() => {
                      setIframeLoading(true);
                      setIframeError(false);
                      if (iframeRef.current) {
                        iframeRef.current.src = iframeRef.current.src;
                      }
                    }}
                    className="px-3 py-1.5 bg-white/20 text-white text-[10px] rounded-lg mt-2"
                  >
                    Réessayer
                  </button>
                </>
              ) : (
                <>
                  <div className="text-white text-sm mb-2 animate-pulse">Chargement...</div>
                </>
              )}
            </div>
          )}
          
          {/* Initial loading (when config not loaded yet) */}
          {!config && (
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-4 z-20">
              <div className="text-white text-sm mb-2">Chargement config...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
