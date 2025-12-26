import { useEffect, useRef } from 'react';
import { useConfigStore } from '../store/configStore.js';
import { useProjectsStore } from '../store/projectsStore.js';

export function useConfigSync() {
  const { config } = useConfigStore();
  const { currentProject, updateProjectConfig } = useProjectsStore();
  const timeoutRef = useRef(null);
  const lastConfigStrRef = useRef('');
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!config || !currentProject) {
      if (!currentProject) {
        console.warn('⚠️ useConfigSync: No currentProject, cannot save config');
      }
      return;
    }

    // Serialize config to detect actual changes (avoid saving if nothing changed)
    const configStr = JSON.stringify(config);
    
    // Skip if config hasn't actually changed or if we're already saving
    if (configStr === lastConfigStrRef.current || isSavingRef.current) {
      return;
    }
    
    lastConfigStrRef.current = configStr;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce save (300ms)
    timeoutRef.current = setTimeout(async () => {
      try {
        if (!config || !currentProject || isSavingRef.current) return;
        
        isSavingRef.current = true;
        console.log('💾 Saving config to Supabase...', { projectId: currentProject.id, categoriesCount: config.categories?.length || 0 });
        await updateProjectConfig(currentProject.id, config);
        console.log('✅ Config saved to Supabase successfully');
        isSavingRef.current = false;
      } catch (error) {
        console.error('❌ Error saving config to Supabase:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        isSavingRef.current = false;
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [config, currentProject?.id]); // Only depend on config and project ID
}
