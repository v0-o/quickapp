import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { supabase } from './lib/supabase.js';

// Global logout function for console (dev only)
if (typeof window !== 'undefined') {
  window.logout = async () => {
    console.log('🚪 Déconnexion...');
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      console.log('✅ Déconnecté de Supabase');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Storage nettoyé');
    
    // Reload page
    console.log('🔄 Rechargement de la page...');
    window.location.reload();
  };
  
  console.log('💡 Astuce: Tapez "logout()" dans la console pour vous déconnecter rapidement');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

