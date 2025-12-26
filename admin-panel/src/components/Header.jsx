import { useHaptic } from '../hooks/useHaptic.js';
import HomeIcon from './icons/HomeIcon.jsx';
import ProfileIcon from './icons/ProfileIcon.jsx';
import RefreshIcon from './icons/RefreshIcon.jsx';

export default function Header({ onHomeClick, onProfileClick, onRefreshClick, isRefreshing }) {
  const { medium } = useHaptic();

  const handleHomeClick = () => {
    medium();
    onHomeClick?.();
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    medium();
    console.log('Header: Profile button clicked');
    onProfileClick?.();
  };

  const handleRefreshClick = () => {
    medium();
    onRefreshClick?.();
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-4">
      <div className="flex items-center justify-between">
        {/* Home Button - Left */}
        <button
          onClick={handleHomeClick}
          className="p-2.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 active:bg-black/90 transition-all duration-200 active:scale-95 touch-manipulation shadow-lg pointer-events-auto"
          aria-label="Home"
        >
          <HomeIcon className="w-5 h-5 text-white" />
        </button>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={handleRefreshClick}
            className="p-2.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 active:bg-black/90 transition-all duration-200 active:scale-95 touch-manipulation shadow-lg pointer-events-auto"
            aria-label="Refresh"
            disabled={isRefreshing}
          >
            <RefreshIcon className="w-5 h-5 text-white" spinning={isRefreshing} />
          </button>

          {/* Profile Button */}
          <button
            onClick={handleProfileClick}
            className="p-2.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 active:bg-black/90 transition-all duration-200 active:scale-95 touch-manipulation shadow-lg pointer-events-auto"
            aria-label="Profile"
          >
            <ProfileIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
