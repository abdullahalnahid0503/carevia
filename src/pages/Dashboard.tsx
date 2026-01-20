import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useProjects } from '@/hooks/useProjects';
import { useAnalytics } from '@/hooks/useAnalytics';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Eye,
  MousePointerClick,
  FolderKanban,
  ArrowUpRight,
  Plus,
  User,
  ExternalLink,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { projects } = useProjects();
  const { analytics } = useAnalytics();

  const profileCompletion = calculateProfileCompletion(profile);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's an overview of your portfolio performance
            </p>
          </div>
          {profile?.username && (
            <Button asChild variant="outline" className="gap-2">
              <Link to={`/portfolio/${profile.username}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                View Portfolio
              </Link>
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Views"
            value={analytics?.totalViews || 0}
            icon={Eye}
            description="Last 30 days"
          />
          <StatCard
            title="Unique Visitors"
            value={analytics?.uniqueVisitors || 0}
            icon={User}
            description="Last 30 days"
          />
          <StatCard
            title="Project Clicks"
            value={analytics?.projectClicks || 0}
            icon={MousePointerClick}
            description="Last 30 days"
          />
          <StatCard
            title="Total Projects"
            value={projects.length}
            icon={FolderKanban}
            description={`${projects.filter(p => p.is_public).length} public`}
          />
        </div>

        {/* Profile Completion & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Completion</CardTitle>
              <CardDescription>
                Complete your profile to attract more visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{profileCompletion}%</span>
                <Badge variant={profileCompletion === 100 ? 'default' : 'secondary'}>
                  {profileCompletion === 100 ? 'Complete' : 'In Progress'}
                </Badge>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              {profileCompletion < 100 && (
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link to="/dashboard/profile">
                    Complete Profile
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/dashboard/projects">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Project
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/dashboard/analytics">
                  <Eye className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Projects</CardTitle>
              <CardDescription>Your latest portfolio projects</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/projects">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderKanban className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  No projects yet. Add your first project to get started.
                </p>
                <Button asChild className="mt-4" size="sm">
                  <Link to="/dashboard/projects">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 overflow-hidden">
                        <h3 className="truncate font-medium">{project.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {project.short_description || 'No description'}
                        </p>
                      </div>
                      <Badge variant={project.is_public ? 'default' : 'secondary'} className="ml-2 shrink-0">
                        {project.is_public ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                    {project.tools && project.tools.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {project.tools.slice(0, 3).map((tool, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                        {project.tools.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tools.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Card className="stat-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;
  
  const fields = [
    'full_name',
    'headline',
    'bio',
    'profession',
    'location',
    'avatar_url',
  ];
  
  const skillsComplete = profile.skills && profile.skills.length > 0;
  const socialComplete = profile.github_url || profile.linkedin_url || profile.twitter_url || profile.website_url;
  
  const filledFields = fields.filter(field => profile[field] && profile[field].trim() !== '').length;
  const total = fields.length + 2; // +2 for skills and social
  const completed = filledFields + (skillsComplete ? 1 : 0) + (socialComplete ? 1 : 0);
  
  return Math.round((completed / total) * 100);
}
