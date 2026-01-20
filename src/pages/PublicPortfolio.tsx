import { useParams } from 'react-router-dom';
import { usePublicProfile } from '@/hooks/useProfile';
import { usePublicProjects } from '@/hooks/useProjects';
import { useTrackAnalytics } from '@/hooks/useAnalytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Github, Linkedin, Twitter, Globe, MapPin, Briefcase } from 'lucide-react';
import { useEffect } from 'react';

export default function PublicPortfolio() {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading: profileLoading } = usePublicProfile(username || '');
  const { data: projects, isLoading: projectsLoading } = usePublicProjects(username || '');
  const { trackEvent } = useTrackAnalytics();

  useEffect(() => {
    if (profile?.id) {
      trackEvent({ profileId: profile.id, eventType: 'page_view' });
    }
  }, [profile?.id]);

  if (profileLoading || projectsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Portfolio not found</h1>
          <p className="mt-2 text-muted-foreground">This portfolio doesn't exist or is private.</p>
        </div>
      </div>
    );
  }

  const handleProjectClick = (projectId: string) => {
    trackEvent({ profileId: profile.id, projectId, eventType: 'project_click' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Profile Header */}
        <header className="text-center animate-fade-up">
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt={profile.full_name || ''} className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary/20" />
          )}
          <h1 className="mt-6 text-4xl font-bold">{profile.full_name}</h1>
          {profile.headline && <p className="mt-2 text-xl text-muted-foreground">{profile.headline}</p>}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            {profile.profession && <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{profile.profession}</span>}
            {profile.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{profile.location}</span>}
          </div>
          {profile.bio && <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">{profile.bio}</p>}
          
          {/* Social Links */}
          <div className="mt-6 flex justify-center gap-3">
            {profile.github_url && <Button variant="outline" size="icon" asChild><a href={profile.github_url} target="_blank" rel="noopener"><Github className="h-4 w-4" /></a></Button>}
            {profile.linkedin_url && <Button variant="outline" size="icon" asChild><a href={profile.linkedin_url} target="_blank" rel="noopener"><Linkedin className="h-4 w-4" /></a></Button>}
            {profile.twitter_url && <Button variant="outline" size="icon" asChild><a href={profile.twitter_url} target="_blank" rel="noopener"><Twitter className="h-4 w-4" /></a></Button>}
            {profile.website_url && <Button variant="outline" size="icon" asChild><a href={profile.website_url} target="_blank" rel="noopener"><Globe className="h-4 w-4" /></a></Button>}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {profile.skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
            </div>
          )}
        </header>

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Projects</h2>
            <div className="mt-8 grid gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.short_description && <p className="mt-2 text-muted-foreground">{project.short_description}</p>}
                    {project.tools && project.tools.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tools.map((tool, i) => <Badge key={i} variant="outline">{tool}</Badge>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
