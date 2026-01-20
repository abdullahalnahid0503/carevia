import { useState } from 'react';
import { useProjects, Project } from '@/hooks/useProjects';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProjectForm } from '@/components/ProjectForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  FolderKanban,
} from 'lucide-react';

export default function ProjectsPage() {
  const { projects, isLoading, createProject, updateProject, deleteProject, isCreating, isUpdating, isDeleting } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleCreate = (data: any) => {
    createProject(data, {
      onSuccess: () => setIsFormOpen(false),
    });
  };

  const handleUpdate = (data: any) => {
    if (editingProject) {
      updateProject({ ...data, id: editingProject.id }, {
        onSuccess: () => setEditingProject(null),
      });
    }
  };

  const handleDelete = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id, {
        onSuccess: () => setDeletingProject(null),
      });
    }
  };

  const toggleVisibility = (project: Project) => {
    updateProject({ id: project.id, is_public: !project.is_public });
  };

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your portfolio projects and case studies
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderKanban className="h-16 w-16 text-muted-foreground/30" />
              <h2 className="mt-6 text-xl font-semibold">No projects yet</h2>
              <p className="mt-2 text-center text-muted-foreground">
                Start showcasing your work by adding your first project.
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
              >
                {/* Cover Image */}
                {project.cover_image_url && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 overflow-hidden">
                      <h3 className="truncate font-semibold text-lg">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {project.short_description || 'No description provided'}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0 -mr-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingProject(project)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleVisibility(project)}>
                          {project.is_public ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Make Private
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Make Public
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingProject(project)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Tools */}
                  {project.tools && project.tools.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tools.slice(0, 4).map((tool, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                      {project.tools.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tools.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant={project.is_public ? 'default' : 'secondary'}>
                      {project.is_public ? 'Public' : 'Private'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isFormOpen || !!editingProject} onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingProject(null);
          }
        }}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              <DialogDescription>
                {editingProject
                  ? 'Update your project details below.'
                  : 'Fill in the details for your new project.'}
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              initialData={editingProject || undefined}
              onSubmit={editingProject ? handleUpdate : handleCreate}
              isLoading={isCreating || isUpdating}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingProject?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
