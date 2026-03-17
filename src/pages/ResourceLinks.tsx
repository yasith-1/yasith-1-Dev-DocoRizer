import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import {
  Link2, Plus, Trash2, ExternalLink, Globe, Figma,
  Github, Loader2, AlertCircle, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';

const ResourceLinks: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { projects, addResourceLink, removeResourceLink, loadResourceLinks } = useProject();
  const project = projects.find(p => p.id === projectId);

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) loadResourceLinks(projectId);
  }, [projectId]);

  const getLinkIcon = (url: string) => {
    if (url.includes('figma.com')) return Figma;
    if (url.includes('github.com') || url.includes('gitlab.com')) return Github;
    return Globe;
  };

  const getDomain = (url: string) => {
    try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) { setError('URL is required'); return; }
    if (!projectId) return;
    setAdding(true);
    setError('');
    try {
      await addResourceLink(projectId, { id: '', url, label, description, addedAt: '' });
      setUrl(''); setLabel(''); setDescription('');
      setOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add link');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !projectId) return;
    setDeleting(true);
    await removeResourceLink(projectId, deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const handleCopy = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const links = project?.resourceLinks || [];

  return (
    <div className="page-container max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resource Links</h1>
          <p className="text-muted-foreground mt-1">
            {links.length} link{links.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Resource Link</DialogTitle>
              <DialogDescription>
                Add a URL to reference materials, designs, repositories, or any other resources
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="link-url">URL <span className="text-destructive">*</span></Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-label">Label <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                  id="link-label"
                  placeholder="e.g. Figma Design, GitHub Repo"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-desc">Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                  id="link-desc"
                  placeholder="Brief description of this resource"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={adding}>
                  {adding ? <><Loader2 className="h-4 w-4 animate-spin" />Adding...</> : 'Add Link'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Links */}
      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Link2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground mb-1">No links yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add Figma designs, GitHub repos, staging URLs, and more
          </p>
          <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add your first link
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link: any) => {
            const Icon = getLinkIcon(link.url);
            return (
              <Card key={link.id} className="group border-border/60 hover:border-primary/30 transition-all">
                <CardContent className="py-4 px-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {link.label && (
                            <p className="font-medium text-sm text-foreground mb-0.5">{link.label}</p>
                          )}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline truncate block"
                          >
                            {getDomain(link.url)}
                          </a>
                          {link.description && (
                            <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(link.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleCopy(link.id, link.url)}
                          >
                            {copiedId === link.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:text-destructive"
                            onClick={() => setDeleteId(link.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Link</DialogTitle>
            <DialogDescription>Are you sure you want to remove this resource link?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 className="h-4 w-4 animate-spin" />Removing...</> : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceLinks;