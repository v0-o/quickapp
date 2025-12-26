import { useState } from 'react';
import { useHaptic } from '../hooks/useHaptic.js';
import { useAuth } from '../hooks/useAuth.js';

const slides = [
  {
    id: 1,
    emoji: '🚀',
    title: 'Bienvenue sur QuickApp',
    description: 'Créez votre application mobile e-commerce en quelques minutes, sans coder.',
  },
  {
    id: 2,
    emoji: '🎨',
    title: 'Personnalisez tout',
    description: 'Logo, couleurs, produits, livraison... Adaptez chaque détail à votre marque.',
  },
  {
    id: 3,
    emoji: '📱',
    title: 'Prévisualisez en direct',
    description: 'Voyez vos modifications en temps réel sur la prévisualisation iPhone.',
  },
];

export default function Onboarding({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'signin'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { medium, success, light } = useHaptic();
  const { signUp, signIn } = useAuth();

  const handleNext = () => {
    medium();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Show auth form on last slide
      setShowAuth(true);
    }
  };

  const handleSkip = () => {
    medium();
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem('quickapp_onboarding_complete', 'true');
      onComplete();
    }, 400);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (authMode === 'signup' && !formData.name.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    // Validate password (min 6 characters)
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    
    try {
      let result;
      
      if (authMode === 'signup') {
        result = await signUp(
          normalizedEmail,
          formData.password,
          formData.name.trim()
        );
      } else {
        result = await signIn(normalizedEmail, formData.password);
      }

      if (result.error) {
        let errorMessage = authMode === 'signup' 
          ? 'Erreur lors de l\'inscription' 
          : 'Erreur lors de la connexion';
        
        if (result.error.message?.includes('invalid')) {
          errorMessage = 'Email ou mot de passe invalide';
        } else if (result.error.message?.includes('already registered')) {
          errorMessage = 'Cet email est déjà utilisé. Connectez-vous.';
        } else if (result.error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else {
          errorMessage = result.error.message || errorMessage;
        }
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      success();
      
      // Save onboarding completion
      localStorage.setItem('quickapp_onboarding_complete', 'true');
      
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 400);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      setIsLoading(false);
    }
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  // Show auth form
  if (showAuth) {
    return (
      <div 
        className={`fixed inset-0 z-[200] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-6 transition-opacity duration-400 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => {
              light();
              setShowAuth(false);
              setError(null);
            }}
            className="absolute top-6 left-6 text-white/40 text-sm font-medium hover:text-white/60 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center mb-8">
            {/* Animated Icon */}
            <div 
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 flex items-center justify-center mb-6 shadow-2xl transform transition-all duration-500"
              style={{
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <span className="text-5xl">{authMode === 'signup' ? '✨' : '🔐'}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {authMode === 'signup' ? 'Créer votre compte' : 'Se connecter'}
            </h1>
            <p className="text-white/50 text-center text-sm mb-8 max-w-xs">
              {authMode === 'signup' 
                ? 'Commencez à créer votre première boutique en quelques minutes'
                : 'Reconnectez-vous pour accéder à vos projets'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => {
                light();
                setAuthMode('signup');
                setError(null);
                setFormData({ ...formData, name: '' });
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                authMode === 'signup'
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              S'inscrire
            </button>
            <button
              onClick={() => {
                light();
                setAuthMode('signin');
                setError(null);
                setFormData({ ...formData, name: '' });
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                authMode === 'signin'
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              Se connecter
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2 backdrop-blur-xl">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {authMode === 'signup' && (
              <div>
                <label className="block text-white/60 text-xs mb-2 font-medium uppercase tracking-wide">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="Votre nom"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-white/60 text-xs mb-2 font-medium uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="votre@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-2 font-medium uppercase tracking-wide">
                Mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all"
                placeholder={authMode === 'signup' ? 'Minimum 6 caractères' : 'Votre mot de passe'}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 active:scale-[0.98] bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl border border-white/20 hover:from-white/25 hover:to-white/15 hover:border-white/30 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {authMode === 'signup' ? 'Création...' : 'Connexion...'}
                </>
              ) : (
                authMode === 'signup' ? 'Créer mon compte' : 'Se connecter'
              )}
            </button>
          </form>
        </div>

        {/* Float animation keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-6 transition-opacity duration-400 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Skip button */}
      {!isLastSlide && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-white/40 text-sm font-medium hover:text-white/60 transition-colors"
        >
          Passer
        </button>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
        {/* Animated Icon - Premium design */}
        <div 
          className="w-32 h-32 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl transform transition-all duration-500"
          style={{
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          <span className="text-6xl">{slide.emoji}</span>
        </div>

        {/* Title - Gradient text */}
        <h1 className="text-3xl font-bold text-white text-center mb-4 transition-all duration-300 tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {slide.title}
        </h1>

        {/* Description */}
        <p className="text-white/50 text-center text-base leading-relaxed mb-8 transition-all duration-300 max-w-xs">
          {slide.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="w-full max-w-sm">
        {/* Progress dots - Enhanced */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-10 bg-white shadow-lg shadow-white/20' 
                  : index < currentSlide 
                    ? 'w-2 bg-white/50' 
                    : 'w-2 bg-white/15'
              }`}
            />
          ))}
        </div>

        {/* CTA Button - Premium design */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 active:scale-[0.98] bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl border border-white/20 hover:from-white/25 hover:to-white/15 hover:border-white/30 shadow-xl"
        >
          {isLastSlide ? "Commencer" : 'Continuer'}
        </button>
      </div>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
