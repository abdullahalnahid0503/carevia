import { useState } from 'react';
import { useProfile, Profile } from '@/hooks/useProfile';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, X, Plus, Globe, Github, Linkedin, Twitter } from 'lucide-react';
import { profileSchema } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Initialize form data when profile loads
  useState(() => {
    if (profile) {
      setFormData(profile);
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const currentData = { ...profile, ...formData };
  const skills = currentData.skills || [];

  const handleChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      if (newSkill.trim().length > 50) {
        toast({ title: 'Error', description: 'Skill must be less than 50 characters', variant: 'destructive' });
        return;
      }
      if (skills.length >= 30) {
        toast({ title: 'Error', description: 'Maximum 30 skills allowed', variant: 'destructive' });
        return;
      }
      handleChange('skills', [...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    handleChange('skills', skills.filter(s => s !== skill));
  };

  const handleSave = () => {
    // Validate form data
    const result = profileSchema.safeParse({ ...currentData, ...formData });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving.',
        variant: 'destructive',
      });
      return;
    }

    setErrors({});
    updateProfile(result.data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your public profile information
            </p>
          </div>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="seo">SEO & Visibility</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Your primary profile details visible to visitors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={currentData.username || ''}
                      onChange={(e) => handleChange('username', e.target.value)}
                      placeholder="johndoe"
                      className={errors.username ? 'border-destructive' : ''}
                  />
                  {errors.headline && <p className="text-xs text-destructive">{errors.headline}</p>}
                    {errors.username ? (
                      <p className="text-xs text-destructive">{errors.username}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Your portfolio URL: /portfolio/{currentData.username}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={currentData.full_name || ''}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      placeholder="John Doe"
                      className={errors.full_name ? 'border-destructive' : ''}
                    />
                    {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={currentData.headline || ''}
                    onChange={(e) => handleChange('headline', e.target.value)}
                    placeholder="Senior Software Engineer at Tech Company"
                    className={errors.headline ? 'border-destructive' : ''}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={currentData.profession || ''}
                      onChange={(e) => handleChange('profession', e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={currentData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={currentData.bio || ''}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Tell visitors about yourself, your experience, and what you're passionate about..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    value={currentData.avatar_url || ''}
                    onChange={(e) => handleChange('avatar_url', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Add skills to showcase your expertise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button onClick={handleAddSkill} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Connect your social profiles and website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="github_url" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Label>
                  <Input
                    id="github_url"
                    value={currentData.github_url || ''}
                    onChange={(e) => handleChange('github_url', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin_url"
                    value={currentData.linkedin_url || ''}
                    onChange={(e) => handleChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_url" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter_url"
                    value={currentData.twitter_url || ''}
                    onChange={(e) => handleChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website_url"
                    value={currentData.website_url || ''}
                    onChange={(e) => handleChange('website_url', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visibility Settings</CardTitle>
                <CardDescription>
                  Control who can see your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your portfolio visible to everyone
                    </p>
                  </div>
                  <Switch
                    checked={currentData.is_public ?? true}
                    onCheckedChange={(checked) => handleChange('is_public', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your portfolio for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={currentData.meta_title || ''}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    placeholder={`${currentData.full_name || 'Your Name'} - Portfolio`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 50-60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={currentData.meta_description || ''}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    placeholder="A brief description of your portfolio and expertise..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 150-160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
