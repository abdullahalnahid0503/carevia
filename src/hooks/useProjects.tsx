import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  short_description: string | null;
  problem: string | null;
  solution: string | null;
  tools: string[];
  role_responsibility: string | null;
  outcome: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectInput = Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export function useProjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!user?.id,
  });

  const createProject = useMutation({
    mutationFn: async (project: { title: string } & Partial<Omit<ProjectInput, 'title'>>) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const insertData = {
        title: project.title,
        user_id: user.id,
        short_description: project.short_description ?? null,
        problem: project.problem ?? null,
        solution: project.solution ?? null,
        tools: project.tools ?? [],
        role_responsibility: project.role_responsibility ?? null,
        outcome: project.outcome ?? null,
        cover_image_url: project.cover_image_url ?? null,
        is_public: project.is_public ?? true,
        display_order: project.display_order ?? 0,
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert([insertData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
      toast({
        title: 'Project created',
        description: 'Your project has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
      toast({
        title: 'Project updated',
        description: 'Your project has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
      toast({
        title: 'Project deleted',
        description: 'Your project has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    projects,
    isLoading,
    error,
    createProject: createProject.mutate,
    updateProject: updateProject.mutate,
    deleteProject: deleteProject.mutate,
    isCreating: createProject.isPending,
    isUpdating: updateProject.isPending,
    isDeleting: deleteProject.isPending,
  };
}

export function usePublicProjects(username: string) {
  return useQuery({
    queryKey: ['public-projects', username],
    queryFn: async () => {
      // First get the profile by username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('username', username)
        .eq('is_public', true)
        .single();
      
      if (profileError) throw profileError;
      
      // Then get public projects for that user
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', profile.user_id)
        .eq('is_public', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!username,
  });
}
