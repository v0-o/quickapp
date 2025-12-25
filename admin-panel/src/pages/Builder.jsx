import { useConfigSync } from '../hooks/useConfigSync.js';
import IPhonePreview from '../components/iPhonePreview.jsx';
import ConfigPanel from '../components/ConfigPanel.jsx';

export default function Builder() {
  // Auto-save config when it changes
  useConfigSync();

  return (
    <div className="w-full h-screen bg-black flex flex-col overflow-hidden">
      {/* Main Content Area - iPhone Preview Centered */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4 md:p-8 pb-[140px]">
        <IPhonePreview />
      </div>
      
      {/* Bottom Config Panel - Fixed */}
      <ConfigPanel />
    </div>
  );
}

