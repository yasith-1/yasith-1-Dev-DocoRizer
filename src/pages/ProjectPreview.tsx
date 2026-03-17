import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import JSZip from 'jszip';
import {
  Download, Share2, FileText, Link2, CheckSquare, Calendar,
  Tag, Loader2, Copy, Check, ExternalLink, CheckCircle2,
  Circle, AlertTriangle, File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const DOC_TYPE_LABELS: Record<string, string> = {
  srs: 'SRS', erd: 'ERD', usecase: 'Use Case', uiux: 'UI/UX', other: 'Other',
};

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const ProjectPreview: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { projects } = useProject();
  const project = projects.find(p => p.id === projectId);

  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const completedTodos = project?.todos?.filter((t: any) => t.completed).length || 0;
  const totalTodos = project?.todos?.length || 0;
  const todoProgress = totalTodos ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const handleExportZip = async () => {
    if (!project) return;
    setExporting(true);
    const zip = new JSZip();

    // Requirements
    if (project.requirements) {
      zip.file('requirements.txt', project.requirements);
    }

    // Resource links
    if (project.resourceLinks?.length) {
      const linksContent = project.resourceLinks
        .map((l: any) => `${l.label || 'Link'}: ${l.url}${l.description ? '\n  ' + l.description : ''}`)
        .join('\n\n');
      zip.file('resource_links.txt', linksContent);
    }

    // Todos
    if (project.todos?.length) {
      const todosContent = project.todos
        .map((t: any) => `[${t.completed ? 'x' : ' '}] [${t.priority.toUpperCase()}] ${t.title}${t.dueDate ? ' (due: ' + t.dueDate + ')' : ''}${t.description ? '\n    ' + t.description : ''}`)
        .join('\n');
      zip.file('todos.txt', `Project Todos — ${project.name}\n${'='.repeat(40)}\n\n${todosContent}`);
    }

    // Documents metadata (actual files from Supabase URLs)
    if (project.documents?.length) {
      const docsContent = project.documents
        .map((d: any) => `${d.name} (${DOC_TYPE_LABELS[d.type] || d.type}) — ${formatBytes(d.size)}${d.url ? '\nURL: ' + d.url : ''}`)
        .join('\n\n');
      zip.file('documents_list.txt', docsContent);
    }

    // Project summary
    const summary = [
      `PROJECT SUMMARY`,
      `${'='.repeat(40)}`,
      `Name: ${project.name}`,
      project.clientName ? `Client: ${project.clientName}` : '',
      project.deadline ? `Deadline: ${new Date(project.deadline).toLocaleDateString()}` : '',
      project.tags?.length ? `Tags: ${project.tags.join(', ')}` : '',
      ``,
      `STATS`,
      `Documents: ${project.documents?.length || 0}`,
      `Resource Links: ${project.resourceLinks?.length || 0}`,
      `Todos: ${completedTodos}/${totalTodos} completed`,
      ``,
      `Generated: ${new Date().toISOString()}`,
    ].filter(Boolean).join('\n');

    zip.file('project_summary.txt', summary);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_package.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const handleShare = async () => {
    if (!project) return;
    const text = [
      `📁 *${project.name}*`,
      project.clientName ? `👤 Client: ${project.clientName}` : '',
      project.deadline ? `📅 Deadline: ${new Date(project.deadline).toLocaleDateString()}` : '',
      '',
      `📄 Documents: ${project.documents?.length || 0}`,
      `🔗 Links: ${project.resourceLinks?.length || 0}`,
      `✅ Todos: ${completedTodos}/${totalTodos} done`,
    ].filter(Boolean).join('\n');

    const whatsapp = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsapp, '_blank');
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!project) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          {project.clientName && (
            <p className="text-muted-foreground mt-1">{project.clientName}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {project.deadline && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Badge>
            )}
            {project.tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button size="sm" onClick={handleExportZip} disabled={exporting} className="gap-2">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export ZIP
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Documents', value: project.documents?.length || 0, icon: FileText },
          { label: 'Links', value: project.resourceLinks?.length || 0, icon: Link2 },
          { label: 'Todos', value: `${completedTodos}/${totalTodos}`, icon: CheckSquare },
          { label: 'Completion', value: `${todoProgress}%`, icon: CheckCircle2 },
        ].map(stat => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="py-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Requirements */}
      {project.requirements && (
        <Card className="mb-6 border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed bg-muted/40 rounded-lg p-4">
              {project.requirements}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      {project.documents?.length > 0 && (
        <Card className="mb-6 border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <File className="h-4 w-4 text-primary" />
              Documents ({project.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <File className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {DOC_TYPE_LABELS[doc.type] || doc.type} · {formatBytes(doc.size)}
                      </p>
                    </div>
                  </div>
                  {doc.url && (
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resource Links */}
      {project.resourceLinks?.length > 0 && (
        <Card className="mb-6 border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              Resource Links ({project.resourceLinks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {project.resourceLinks.map((link: any) => (
              <div key={link.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40">
                <div className="min-w-0">
                  {link.label && <p className="text-sm font-medium">{link.label}</p>}
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate block">
                    {link.url}
                  </a>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Todos */}
      {project.todos?.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                Todos ({completedTodos}/{totalTodos})
              </CardTitle>
              <span className="text-sm text-muted-foreground">{todoProgress}%</span>
            </div>
            <Progress value={todoProgress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            {project.todos.map((todo: any) => {
              const overdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();
              return (
                <div key={todo.id} className={cn(
                  "flex items-start gap-3 p-3 rounded-lg",
                  todo.completed ? "opacity-60" : overdue ? "bg-destructive/5" : "bg-muted/30"
                )}>
                  {todo.completed
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    : <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  }
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", todo.completed && "line-through text-muted-foreground")}>
                      {todo.title}
                    </p>
                    {todo.dueDate && (
                      <p className={cn("text-xs flex items-center gap-1 mt-0.5", overdue ? "text-destructive" : "text-muted-foreground")}>
                        {overdue && <AlertTriangle className="h-3 w-3" />}
                        Due {new Date(todo.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className="text-xs capitalize text-muted-foreground">{todo.priority}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectPreview;