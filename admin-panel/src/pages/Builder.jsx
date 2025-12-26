import { useState, useEffect } from 'react';
import { useConfigSync } from '../hooks/useConfigSync.js';
import IPhonePreview from '../components/iPhonePreview.jsx';
import ConfigPanel from '../components/ConfigPanel.jsx';
import Header from '../components/Header.jsx';
import ProfileModal from '../components/ProfileModal.jsx';

export default function Builder() {
  // Auto-save config when it changes
  useConfigSync();
  const [showProfile, setShowProfile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for refresh state changes
  useEffect(() => {
    const handleRefreshState = (e) => {
      setIsRefreshing(e.detail.isRefreshing);
    };
    window.addEventListener('refreshStateChange', handleRefreshState);
    return () => window.removeEventListener('refreshStateChange', handleRefreshState);
  }, []);

  const handleHomeClick = () => {
    console.log('Home clicked');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked, opening modal');
    setShowProfile(true);
  };

  const handleRefreshClick = () => {
    window.dispatchEvent(new CustomEvent('refreshPreview'));
  };

  // Fullscreen mode - hide everything except preview
  if (isFullscreen) {
    return (
      <IPhonePreview 
        isFullscreen={true}
        onFullscreenChange={setIsFullscreen}
      />
    );
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header - Floating buttons */}
      <Header 
        onHomeClick={handleHomeClick} 
        onProfileClick={handleProfileClick}
        onRefreshClick={handleRefreshClick}
        isRefreshing={isRefreshing}
      />
      
      {/* Main Content Area - iPhone Preview Centered - lowered */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4 pb-[100px] pt-16">
        <IPhonePreview 
          isFullscreen={false}
          onFullscreenChange={setIsFullscreen}
        />
      </div>
      
      {/* Bottom Config Panel - Fixed */}
      <ConfigPanel />
      
      {/* Fullscreen button - Bottom right corner, above config panel */}
      <button
        onClick={() => setIsFullscreen(true)}
        className="fixed bottom-24 right-4 z-50 p-2.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 transition-all active:scale-95 hover:bg-black/90 shadow-lg"
        aria-label="Enter fullscreen"
        style={{ 
          bottom: 'calc(80px + env(safe-area-inset-bottom, 0px) + 1rem)'
        }}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
      
      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}
