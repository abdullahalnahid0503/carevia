import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export interface AnalyticsEvent {
  id: string;
  profile_id: string;
  project_id: string | null;
  event_type: string;
  visitor_id: string | null;
  country: string | null;
  created_at: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  projectClicks: number;
  viewsByDate: { date: string; views: number }[];
  topProjects: { id: string; title: string; clicks: number }[];
}

export function useAnalytics() {
  const { profile } = useProfile();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      // Get analytics for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('profile_id', profile.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const events = data as AnalyticsEvent[];
      
      // Calculate summary
      const pageViews = events.filter(e => e.event_type === 'page_view');
      const projectClicks = events.filter(e => e.event_type === 'project_click');
      
      const uniqueVisitorIds = new Set(events.map(e => e.visitor_id).filter(Boolean));
      
      // Group views by date
      const viewsByDateMap = new Map<string, number>();
      pageViews.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        viewsByDateMap.set(date, (viewsByDateMap.get(date) || 0) + 1);
      });
      
      const viewsByDate = Array.from(viewsByDateMap.entries())
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      // Top projects by clicks
      const projectClicksMap = new Map<string, number>();
      projectClicks.forEach(event => {
        if (event.project_id) {
          projectClicksMap.set(event.project_id, (projectClicksMap.get(event.project_id) || 0) + 1);
        }
      });
      
      const topProjects = Array.from(projectClicksMap.entries())
        .map(([id, clicks]) => ({ id, title: '', clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

      const summary: AnalyticsSummary = {
        totalViews: pageViews.length,
        uniqueVisitors: uniqueVisitorIds.size,
        projectClicks: projectClicks.length,
        viewsByDate,
        topProjects,
      };

      return { events, summary };
    },
    enabled: !!profile?.id,
  });

  return {
    analytics: analytics?.summary,
    events: analytics?.events,
    isLoading,
  };
}

export function useTrackAnalytics() {
  const queryClient = useQueryClient();

  const trackEvent = useMutation({
    mutationFn: async ({
      profileId,
      projectId,
      eventType,
    }: {
      profileId: string;
      projectId?: string;
      eventType: 'page_view' | 'project_click';
    }) => {
      // Generate or get visitor ID from localStorage
      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('visitor_id', visitorId);
      }

      const { error } = await supabase.from('analytics').insert({
        profile_id: profileId,
        project_id: projectId || null,
        event_type: eventType,
        visitor_id: visitorId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  return { trackEvent: trackEvent.mutate };
}
