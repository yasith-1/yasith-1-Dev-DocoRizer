import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useProject } from '../../contexts/ProjectContext';
import {
  FileText, Upload, Link2, CheckSquare, Eye, ArrowLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ProjectNavigation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProject();
  const location = useLocation();

  const project = projects.find(p => p.id === id);

  const steps = [
    { path: `/project/${id}/gather`, label: 'Requirements', icon: FileText, short: '1' },
    { path: `/project/${id}/docs`,   label: 'Documents',    icon: Upload,   short: '2' },
    { path: `/project/${id}/links`,  label: 'Links',        icon: Link2,    short: '3' },
    { path: `/project/${id}/todos`,  label: 'Todos',        icon: CheckSquare, short: '4' },
    { path: `/project/${id}/preview`, label: 'Preview',     icon: Eye,      short: '5' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const activeIndex = steps.findIndex(s => isActive(s.path));

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Project breadcrumb */}
        <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground border-b border-border/40">
          <Link to="/projects" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Projects
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {project && (
            <span className="font-medium text-foreground truncate max-w-xs">{project.name}</span>
          )}
          {project?.clientName && (
            <Badge variant="secondary" className="text-xs">
              {project.clientName}
            </Badge>
          )}
        </div>

        {/* Step Navigation */}
        <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-none">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const active = isActive(step.path);
            const completed = activeIndex > idx;
            return (
              <Link
                key={step.path}
                to={step.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : completed
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                  active ? "bg-white/20" : completed ? "bg-primary/20 text-primary" : "bg-muted"
                )}>
                  {completed ? '✓' : step.short}
                </div>
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{step.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ProjectNavigation;