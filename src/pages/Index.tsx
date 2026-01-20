import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BarChart3, FolderKanban } from 'lucide-react';
export default function LandingPage() {
  const {
    user
  } = useAuth();
  return <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold gradient-text">Carevia</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? <Button asChild><Link to="/dashboard">Dashboard</Link></Button> : <>
                <Button variant="ghost" asChild><Link to="/login">Sign In</Link></Button>
                <Button asChild><Link to="/signup">Get Started</Link></Button>
              </>}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-primary animate-fade-up mb-4">Where Work Becomes Proof</p>
          <h1 className="animate-fade-up text-5xl font-bold tracking-tight md:text-6xl" style={{
          animationDelay: '50ms'
        }}>
            Build Your Professional <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-up" style={{
          animationDelay: '100ms'
        }}>Create stunning portfolios with case studies, track visitor analytics, and export ATS-friendly resumes all in one platform.</p>
          <div className="mt-10 flex justify-center gap-4 animate-fade-up" style={{
          animationDelay: '200ms'
        }}>
            <Button size="lg" asChild><Link to="/signup">Start Building <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 hover-lift">
              <FolderKanban className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Project Case Studies</h3>
              <p className="mt-2 text-sm text-muted-foreground">Showcase your work with detailed problem-solution narratives.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 hover-lift">
              <BarChart3 className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Built-in Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">Track views and engagement without third-party tools.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 hover-lift">
              <Sparkles className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Beautiful Themes</h3>
              <p className="mt-2 text-sm text-muted-foreground">Professional designs that make your work stand out.</p>
            </div>
          </div>
        </div>
      </section>
    </div>;
}