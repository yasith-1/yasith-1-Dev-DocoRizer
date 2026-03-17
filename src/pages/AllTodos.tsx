import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Circle, Calendar, AlertTriangle,
  FolderOpen, Search, Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Todo } from '../types';

const PRIORITIES = [
  { value: 'high',   bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  { value: 'medium', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { value: 'low',    bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
] as const;

const getPriorityBg = (p: string) => PRIORITIES.find(x => x.value === p)?.bg || '';

const AllTodos: React.FC = () => {
  const { projects, toggleTodo } = useProject();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'done'>('all');

  // Flatten all todos with project info
  const allTodos = projects.flatMap(project =>
    (project.todos || []).map((todo: Todo) => ({ ...todo, projectName: project.name, projectId: project.id }))
  );

  const filtered = allTodos.filter(todo => {
    const matchSearch = !search ||
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.projectName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || (filterStatus === 'done' ? todo.completed : !todo.completed);
    return matchSearch && matchStatus;
  });

  const isOverdue = (todo: Todo) =>
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  const totalOpen = allTodos.filter(t => !t.completed).length;
  const totalDone = allTodos.filter(t => t.completed).length;
  const progress = allTodos.length ? Math.round((totalDone / allTodos.length) * 100) : 0;

  return (
    <div className="page-container max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Todos</h1>
        <p className="text-muted-foreground mt-1">
          Across {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-border/60">
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-foreground">{allTodos.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-amber-500">{totalOpen}</p>
            <p className="text-xs text-muted-foreground mt-1">Open</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">{totalDone}</p>
            <p className="text-xs text-muted-foreground mt-1">Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      {allTodos.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search todos or projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(['all', 'open', 'done'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                filterStatus === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">
            {allTodos.length === 0 ? 'No todos across any projects yet' : 'No matching todos'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((todo: any) => {
            const overdue = isOverdue(todo);
            return (
              <div
                key={todo.id}
                className={cn(
                  "group flex items-start gap-3 p-4 rounded-lg border transition-all",
                  todo.completed
                    ? "bg-muted/30 border-border/40 opacity-60"
                    : overdue
                      ? "border-destructive/20 bg-destructive/5"
                      : "bg-card border-border/60 hover:border-primary/30"
                )}
              >
                <button
                  onClick={() => toggleTodo(todo.projectId, todo.id)}
                  className="mt-0.5 shrink-0"
                >
                  {todo.completed
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("font-medium text-sm", todo.completed && "line-through text-muted-foreground")}>
                      {todo.title}
                    </p>
                  </div>
                  {todo.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{todo.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Project badge */}
                    <button
                      onClick={() => navigate(`/project/${todo.projectId}/todos`)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <FolderOpen className="h-3 w-3" />
                      {todo.projectName}
                    </button>

                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium capitalize", getPriorityBg(todo.priority))}>
                      {todo.priority}
                    </span>

                    {todo.dueDate && (
                      <span className={cn("flex items-center gap-1 text-xs", overdue ? "text-destructive" : "text-muted-foreground")}>
                        {overdue && <AlertTriangle className="h-3 w-3" />}
                        <Calendar className="h-3 w-3" />
                        {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllTodos;