import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import {
  Plus, Trash2, CheckCircle2, Circle, Loader2,
  Calendar, Flag, AlertTriangle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Todo } from '../types';

const PRIORITIES = [
  { value: 'high',   label: 'High',   color: 'text-rose-500',   bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  { value: 'medium', label: 'Medium', color: 'text-amber-500',  bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { value: 'low',    label: 'Low',    color: 'text-blue-500',   bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
] as const;

const getPriorityConfig = (p: string) => PRIORITIES.find(x => x.value === p) || PRIORITIES[1];

const TodoManagement: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { projects, addTodo, updateTodo, deleteTodo, toggleTodo } = useProject();
  const project = projects.find(p => p.id === projectId);
  const todos: Todo[] = project?.todos || [];

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    setAdding(true);
    await addTodo(projectId, { title, description, priority, dueDate: dueDate || undefined, completed: false });
    setTitle(''); setDescription(''); setPriority('medium'); setDueDate('');
    setAdding(false);
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId || !projectId) return;
    await deleteTodo(projectId, deleteId);
    setDeleteId(null);
  };

  const filtered = todos.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.completed : !t.completed
  );

  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const isOverdue = (todo: Todo) =>
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div className="page-container max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Todo List</h1>
          <p className="text-muted-foreground mt-1">
            {completedCount}/{todos.length} completed
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Todo</DialogTitle>
              <DialogDescription>Add a task to track for this project</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input placeholder="What needs to be done?" value={title} onChange={e => setTitle(e.target.value)} required autoFocus />
              </div>
              <div className="space-y-2">
                <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea placeholder="Additional details..." value={description} onChange={e => setDescription(e.target.value)} className="min-h-[80px] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex gap-1.5">
                    {PRIORITIES.map(p => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={cn(
                          "flex-1 text-xs py-1.5 px-2 rounded-md border transition-all font-medium",
                          priority === p.value ? p.bg : "border-border text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={adding}>
                  {adding ? <><Loader2 className="h-4 w-4 animate-spin" />Adding...</> : 'Add Todo'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress */}
      {todos.length > 0 && (
        <Card className="mb-6 border-border/60">
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      {todos.length > 0 && (
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-5 w-fit">
          {(['all', 'open', 'done'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f} {f === 'open' ? `(${todos.filter(t => !t.completed).length})` : f === 'done' ? `(${completedCount})` : `(${todos.length})`}
            </button>
          ))}
        </div>
      )}

      {/* Todo List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">
            {todos.length === 0 ? 'No todos yet — add one to get started' : 'No todos in this category'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(todo => {
            const priorityConfig = getPriorityConfig(todo.priority);
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
                {/* Checkbox */}
                <button
                  onClick={() => projectId && toggleTodo(projectId, todo.id)}
                  className="mt-0.5 shrink-0"
                >
                  {todo.completed
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  }
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("font-medium text-sm", todo.completed && "line-through text-muted-foreground")}>
                      {todo.title}
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => setDeleteId(todo.id)}
                        className="p-1 rounded hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {todo.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{todo.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", priorityConfig.bg)}>
                      {priorityConfig.label}
                    </span>
                    {todo.dueDate && (
                      <span className={cn(
                        "flex items-center gap-1 text-xs",
                        overdue ? "text-destructive" : "text-muted-foreground"
                      )}>
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

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Todo</DialogTitle>
            <DialogDescription>Are you sure you want to delete this todo item?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoManagement;