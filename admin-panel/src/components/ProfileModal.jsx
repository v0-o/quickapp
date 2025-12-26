import { useEffect, useRef, useState } from 'react';
import { useHaptic } from '../hooks/useHaptic.js';
import { useProjectsStore } from '../store/projectsStore.js';
import { useAuth } from '../hooks/useAuth.js';

export default function ProfileModal({ onClose }) {
  const { light, medium } = useHaptic();
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { user, signOut } = useAuth();
  const { projects, loadProjects, setCurrentProject, isLoading } = useProjectsStore();
  const modalRef = useRef(null);
  const startYRef = useRef(0);

  // Load projects when modal opens
  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user, loadProjects]);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    light();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;
    
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      medium();
      onClose();
    } else {
      setDragY(0);
    }
    setIsDragging(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      medium();
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Get user subscription status from user metadata
  const getSubscriptionStatus = () => {
    if (!user) return { label: 'Non connecté', color: 'text-white/40', bg: 'bg-white/5' };
    
    // Try to get from user metadata or default to free
    const status = user.user_metadata?.subscription_status || 'free';
    switch (status) {
      case 'premium':
        return { 
          label: 'Premium', 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-400/10',
          icon: '⭐'
        };
      case 'trial':
        return { 
          label: 'Essai gratuit', 
          color: 'text-blue-400', 
          bg: 'bg-blue-400/10',
          icon: '🎁'
        };
      default:
        return { 
          label: 'Gratuit', 
          color: 'text-white/60', 
          bg: 'bg-white/5',
          icon: '🆓'
        };
    }
  };

  const subscriptionStatus = getSubscriptionStatus();

  const { setConfig } = useConfigStore();
  
  const handleOpenProject = (project) => {
    medium();
    setCurrentProject(project);
    // Update config from project without reloading
    if (project && project.config) {
      setConfig(project.config);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        style={{ opacity: 1 - Math.min(dragY / 300, 1) }}
      />

      {/* Modal Sheet */}
      <div
        ref={modalRef}
        className="relative w-full bg-gray-900 rounded-t-3xl ios-blur shadow-[0_-4px_20px_rgba(0,0,0,0.3)] max-h-[85vh] overflow-hidden safe-bottom"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-white/30 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(85vh-60px)] custom-scrollbar smooth-scroll will-change-transform">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Mon Profil</h2>
            <p className="text-white/60 text-sm">Gérez votre compte et vos projets</p>
          </div>

          {/* User Info Card */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                {user?.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-lg">
                  {user?.user_metadata?.name || user?.email || 'Utilisateur'}
                </div>
                <div className="text-white/60 text-sm">
                  {user?.email || 'Non connecté'}
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className={`${subscriptionStatus.bg} rounded-xl p-3 border border-white/10`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{subscriptionStatus.icon}</span>
                  <div>
                    <div className={`${subscriptionStatus.color} text-xs font-medium mb-0.5`}>
                      Abonnement
                    </div>
                    <div className={`${subscriptionStatus.color} font-semibold`}>
                      {subscriptionStatus.label}
                    </div>
                  </div>
                </div>
                {subscriptionStatus.label === 'Gratuit' && (
                  <button
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-medium transition-colors"
                    onClick={() => {
                      medium();
                      alert('Fonctionnalité à venir');
                    }}
                  >
                    Passer Premium
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Projets créés</div>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Actifs</div>
              <div className="text-2xl font-bold text-white">
                {projects.filter(p => p.status === 'active').length}
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Mes Projets</h3>
            {isLoading ? (
              <div className="text-white/60 text-sm text-center py-4">Chargement...</div>
            ) : projects.length === 0 ? (
              <div className="text-white/60 text-sm text-center py-4">
                Aucun projet pour le moment
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{project.name}</div>
                        <div className="text-white/60 text-xs mt-1">
                          Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <button
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs transition-colors"
                        onClick={() => handleOpenProject(project)}
                      >
                        Ouvrir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
              onClick={() => {
                medium();
                onClose();
              }}
            >
              Fermer
            </button>
            
            {/* Logout Button */}
            <button
              className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-400 font-medium transition-colors"
              onClick={async () => {
                medium();
                try {
                  await signOut();
                  // Clear local storage
                  localStorage.removeItem('quickapp_onboarding_complete');
                  // Reload page to show onboarding
                  window.location.reload();
                } catch (error) {
                  console.error('Error signing out:', error);
                  alert('Erreur lors de la déconnexion');
                }
              }}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
