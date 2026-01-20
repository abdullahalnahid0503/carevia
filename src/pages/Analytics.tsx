import { useAnalytics } from '@/hooks/useAnalytics';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Users, MousePointerClick } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Track your portfolio performance</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-bold">{analytics?.totalViews || 0}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-bold">{analytics?.uniqueVisitors || 0}</p>
              <p className="text-sm text-muted-foreground">Unique Visitors</p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MousePointerClick className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-bold">{analytics?.projectClicks || 0}</p>
              <p className="text-sm text-muted-foreground">Project Clicks</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {analytics?.viewsByDate && analytics.viewsByDate.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.viewsByDate}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No data yet. Share your portfolio to start tracking views.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
