import { useState } from 'react';
import { Project } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Plus } from 'lucide-react';
import { projectSchema } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: Partial<Project>) => void;
  isLoading?: boolean;
}

export function ProjectForm({ initialData, onSubmit, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    short_description: initialData?.short_description || '',
    problem: initialData?.problem || '',
    solution: initialData?.solution || '',
    tools: initialData?.tools || [],
    role_responsibility: initialData?.role_responsibility || '',
    outcome: initialData?.outcome || '',
    cover_image_url: initialData?.cover_image_url || '',
    is_public: initialData?.is_public ?? true,
  });
  const [newTool, setNewTool] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTool = () => {
    if (newTool.trim() && !formData.tools.includes(newTool.trim())) {
      if (newTool.trim().length > 50) {
        toast({ title: 'Error', description: 'Tool name must be less than 50 characters', variant: 'destructive' });
        return;
      }
      if (formData.tools.length >= 20) {
        toast({ title: 'Error', description: 'Maximum 20 tools allowed', variant: 'destructive' });
        return;
      }
      handleChange('tools', [...formData.tools, newTool.trim()]);
      setNewTool('');
    }
  };

  const handleRemoveTool = (tool: string) => {
    handleChange('tools', formData.tools.filter(t => t !== tool));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const result = projectSchema.safeParse(formData);
    
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
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="E.g., E-commerce Platform Redesign"
          required
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">Short Description</Label>
        <Textarea
          id="short_description"
          value={formData.short_description}
          onChange={(e) => handleChange('short_description', e.target.value)}
          placeholder="A brief overview of the project (1-2 sentences)"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem">Problem Statement</Label>
        <Textarea
          id="problem"
          value={formData.problem}
          onChange={(e) => handleChange('problem', e.target.value)}
          placeholder="What problem were you trying to solve?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="solution">Solution</Label>
        <Textarea
          id="solution"
          value={formData.solution}
          onChange={(e) => handleChange('solution', e.target.value)}
          placeholder="How did you approach and solve the problem?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Tools & Technologies</Label>
        <div className="flex gap-2">
          <Input
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
            placeholder="Add a tool or technology..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
          />
          <Button type="button" onClick={handleAddTool} variant="secondary">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.tools.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tools.map((tool) => (
              <Badge key={tool} variant="secondary" className="gap-1 pr-1">
                {tool}
                <button
                  type="button"
                  onClick={() => handleRemoveTool(tool)}
                  className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role_responsibility">Role & Responsibilities</Label>
        <Textarea
          id="role_responsibility"
          value={formData.role_responsibility}
          onChange={(e) => handleChange('role_responsibility', e.target.value)}
          placeholder="What was your role and what were your specific responsibilities?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="outcome">Outcome & Results</Label>
        <Textarea
          id="outcome"
          value={formData.outcome}
          onChange={(e) => handleChange('outcome', e.target.value)}
          placeholder="What were the results or impact of this project?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image_url">Cover Image URL</Label>
        <Input
          id="cover_image_url"
          value={formData.cover_image_url}
          onChange={(e) => handleChange('cover_image_url', e.target.value)}
          placeholder="https://example.com/project-image.jpg"
          className={errors.cover_image_url ? 'border-destructive' : ''}
        />
        {errors.cover_image_url && <p className="text-xs text-destructive">{errors.cover_image_url}</p>}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="space-y-0.5">
          <Label>Public Project</Label>
          <p className="text-sm text-muted-foreground">
            Make this project visible on your public portfolio
          </p>
        </div>
        <Switch
          checked={formData.is_public}
          onCheckedChange={(checked) => handleChange('is_public', checked)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading || !formData.title.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            'Update Project'
          ) : (
            'Create Project'
          )}
        </Button>
      </div>
    </form>
  );
}
