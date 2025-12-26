import { useEffect, useState } from 'react';
import Builder from './pages/Builder.jsx';
import Onboarding from './components/Onboarding.jsx';
import { useConfigStore } from './store/configStore.js';
import { useAuth } from './hooks/useAuth.js';
import { useProjectsStore } from './store/projectsStore.js';

function App() {
  const { setConfig, setLoading, config } = useConfigStore();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { 
    currentProject, 
    loadProjects, 
    createProject, 
    projects, 
    isLoading: projectsLoading,
    setCurrentProject,
    error: projectsError
  } = useProjectsStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) {
      console.log('⚠️ Already initialized, skipping...');
      return;
    }

    const initializeApp = async () => {
      console.log('🚀 Initializing app...', { authLoading, isAuthenticated });
      
      // Wait for auth to be ready
      if (authLoading) {
        console.log('⏳ Waiting for auth...');
        return;
      }

      // If not authenticated, show onboarding
      if (!isAuthenticated) {
        console.log('👤 Not authenticated, showing onboarding');
        const onboardingComplete = localStorage.getItem('quickapp_onboarding_complete');
        setShowOnboarding(!onboardingComplete);
        setIsInitialized(true);
        return;
      }

      // If authenticated, load projects
      try {
        console.log('✅ User authenticated, loading projects...');
        setLoading(true);
        await loadProjects();
        
        // Small delay to ensure store is updated
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Re-read projects from store after load
        const storeState = useProjectsStore.getState();
        const loadedProjects = storeState.projects;
        
        console.log('📦 Loaded projects:', loadedProjects.length);
        
        // If user has projects, use the first one (or current)
        if (loadedProjects.length > 0) {
          console.log('✅ User has projects, using first one');
          const projectToUse = storeState.currentProject || loadedProjects[0];
          if (projectToUse && projectToUse.config) {
            console.log('📝 Setting config from project:', projectToUse.name);
            setConfig(projectToUse.config);
            if (!storeState.currentProject) {
              setCurrentProject(projectToUse);
            }
          }
          setIsInitialized(true);
          setLoading(false);
        } else {
          // Create default project for new users
          console.log('🆕 No projects found, creating default project...');
          try {
            const defaultProject = await createProject('Ma Boutique', {
              brand: {
                name: 'Ma Boutique',
                slogan: '',
                description: '',
                logo: '',
                favicon: '',
                language: 'fr',
              },
              theme: {
                primaryColor: '#f97316',
                secondaryColor: '#16a34a',
                accentColor: '#ec4899',
                backgroundColor: '#05090b',
                textColor: '#ffffff',
                fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
                fontWeight: '600',
              borderRadius: '16px',
              borderWidth: '1px',
              customColors: {},
            },
            categories: [
              {
                id: 'all',
                label: 'All',
                emoji: '✨',
                gradient: 'from-[#f97316] to-[#16a34a]',
                isNew: false,
              }
            ],
            products: [],
            delivery: {},
            contact: {
              email: '',
              phone: '',
              whatsapp: '',
            },
            social: {
              instagram: '',
            },
            });
            
            console.log('✅ Default project created:', defaultProject);
            
            if (defaultProject) {
              console.log('✅ Default project created, setting as current:', defaultProject.id);
              if (defaultProject.config) {
                setConfig(defaultProject.config);
              }
              setCurrentProject(defaultProject);
              console.log('✅ Current project set:', defaultProject.id);
            } else {
              console.error('❌ Default project creation returned null/undefined');
            }
          } catch (createError) {
            console.error('❌ Error creating default project:', createError);
            // Set a minimal config so the app can still load
            setConfig({
              brand: { name: 'Ma Boutique' },
              theme: {
                primaryColor: '#f97316',
                secondaryColor: '#16a34a',
                backgroundColor: '#05090b',
                textColor: '#ffffff',
              },
              categories: [],
              products: [],
            });
          }
          setIsInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        // Set minimal config to allow app to load
        setConfig({
          brand: { name: 'Ma Boutique' },
          theme: {
            primaryColor: '#f97316',
            secondaryColor: '#16a34a',
            backgroundColor: '#05090b',
            textColor: '#ffffff',
          },
          categories: [],
          products: [],
        });
        setIsInitialized(true);
        setLoading(false);
      }
    };

    initializeApp();
  }, [authLoading, isAuthenticated, isInitialized]); // Add isInitialized to prevent re-runs

  // Show loading while checking auth or initializing
  if (authLoading || !isInitialized || projectsLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Chargement...</div>
      </div>
    );
  }

  // Show error if there's a projects error
  if (projectsError && !config) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-red-400 mb-4">Erreur: {projectsError}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding if not authenticated or not completed
  if (showOnboarding || !isAuthenticated) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return <Builder />;
}

export default App;
