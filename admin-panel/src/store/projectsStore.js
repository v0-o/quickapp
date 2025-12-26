import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

export const useProjectsStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  // Load all projects for the current user
  loadProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('📦 Loading projects...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('⚠️ No user found');
        set({ projects: [], isLoading: false });
        return;
      }

      console.log('👤 User ID:', user.id);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading projects:', error);
        throw error;
      }

      console.log('✅ Projects loaded:', data?.length || 0);
      set({ projects: data || [], isLoading: false });
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Create a new project
  createProject: async (name, initialConfig = {}) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🆕 Creating project:', name);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('👤 User ID for project:', user.id);

      // First, ensure user exists in users table
      const { error: userCheckError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'User',
          subscription_status: 'free',
        }, {
          onConflict: 'id'
        });

      if (userCheckError) {
        console.error('⚠️ Error ensuring user exists:', userCheckError);
        console.error('User check error details:', JSON.stringify(userCheckError, null, 2));
        console.error('User check error code:', userCheckError.code);
        console.error('User check error message:', userCheckError.message);
        // Continue anyway, might already exist
      } else {
        console.log('✅ User ensured in database');
      }

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

      console.log('📝 Inserting project with slug:', slug);

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: name,
          slug: slug,
          config: initialConfig,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating project:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error hint:', error.hint);
        throw error;
      }

      console.log('✅ Project created successfully:', data.id);
      console.log('📦 Project data:', JSON.stringify(data, null, 2));

      // Add to local state
      set((state) => ({
        projects: [data, ...state.projects],
        currentProject: data,
        isLoading: false,
      }));

      return data;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update a project
  updateProject: async (projectId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => {
        const updatedProjects = state.projects.map((p) => (p.id === projectId ? data : p));
        // Only update currentProject if it's the one being updated
        // But merge config instead of replacing whole object to avoid reference changes
        const shouldUpdateCurrent = state.currentProject?.id === projectId;
        const newCurrentProject = shouldUpdateCurrent && state.currentProject
          ? { ...state.currentProject, config: data.config, updated_at: data.updated_at }
          : shouldUpdateCurrent 
            ? data 
            : state.currentProject;
        return {
          projects: updatedProjects,
          currentProject: newCurrentProject,
          isLoading: false,
        };
      });

      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update project config
  updateProjectConfig: async (projectId, config) => {
    return get().updateProject(projectId, { config });
  },

  // Delete a project
  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Remove from local state
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Set current project
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
