import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import {
  Upload, File, Trash2, Download, ExternalLink, Loader2,
  FileText, Image, FileCode, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { projectsAPI } from '../services/api';
import { DocumentType } from '../types';

const DOC_TYPES: { value: DocumentType; label: string; color: string }[] = [
  { value: 'srs',     label: 'SRS',       color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'erd',     label: 'ERD',       color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { value: 'usecase', label: 'Use Case',  color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { value: 'uiux',    label: 'UI/UX',     color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
  { value: 'other',   label: 'Other',     color: 'bg-muted text-muted-foreground border-border' },
];

const getDocTypeConfig = (type: string) =>
  DOC_TYPES.find(d => d.value === type) || DOC_TYPES[DOC_TYPES.length - 1];

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '')) return Image;
  if (['pdf'].includes(ext || '')) return FileText;
  return File;
};

interface UploadItem {
  id: string;
  file: File;
  type: DocumentType;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

const DocumentsUpload: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { currentProject, removeDocument, setCurrentProject, projects, updateProject } = useProject();
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const project = currentProject || projects.find(p => p.id === projectId);

  const updateUpload = (id: string, changes: Partial<UploadItem>) => {
    setUploads(prev => prev.map(u => u.id === id ? { ...u, ...changes } : u));
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploads: UploadItem[] = fileArray.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      type: 'other',
      progress: 0,
      status: 'pending'
    }));
    setUploads(prev => [...prev, ...newUploads]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleUpload = async (uploadItem: UploadItem) => {
    if (!projectId) return;
    updateUpload(uploadItem.id, { status: 'uploading', progress: 0 });

    try {
      const newDoc = await projectsAPI.uploadDocument(
        projectId,
        uploadItem.file,
        uploadItem.type,
        (percent) => updateUpload(uploadItem.id, { progress: percent })
      );

      updateUpload(uploadItem.id, { status: 'done', progress: 100 });

      // Update project context with the new document (both currentProject and projects list)
      if (project) {
        const updatedProject = {
          ...project,
          documents: [...(project.documents || []), newDoc]
        };
        setCurrentProject(updatedProject);
      }

      // Remove from queue after 2s
      setTimeout(() => {
        setUploads(prev => prev.filter(u => u.id !== uploadItem.id));
      }, 2000);

    } catch (err: any) {
      updateUpload(uploadItem.id, {
        status: 'error',
        error: err.response?.data?.message || err.message || 'Upload failed'
      });
    }
  };

  const handleDeleteDoc = async () => {
    if (!deleteDocId || !projectId) return;
    setDeleting(true);
    await removeDocument(projectId, deleteDocId);
    setDeleting(false);
    setDeleteDocId(null);
  };

  const groupedDocs = DOC_TYPES.reduce((acc, type) => {
    const docs = (project?.documents || []).filter((d: any) => d.type === type.value);
    if (docs.length > 0) acc[type.value] = docs;
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="page-container max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <p className="text-muted-foreground mt-1">
          Upload project documents — files are stored securely in cloud storage
        </p>
      </div>

      {/* Drop Zone */}
      <Card className={cn(
        "border-2 border-dashed transition-all duration-200 mb-6",
        dragOver
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/40 cursor-pointer"
      )}>
        <div
          className="p-8 text-center"
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className={cn(
            "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all",
            dragOver ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-base font-medium text-foreground mb-1">
            {dragOver ? 'Drop files here' : 'Upload documents'}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to browse • PDF, Images, Word, Excel, PowerPoint • Max 50 MB
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={e => { if (e.target.files) processFiles(e.target.files); e.target.value = ''; }}
            accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.svg,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
          />
        </div>
      </Card>

      {/* Upload Queue */}
      {uploads.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Upload Queue ({uploads.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploads.map(item => {
              const Icon = getFileIcon(item.file.name);
              return (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="mt-0.5">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{item.file.name}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{formatBytes(item.file.size)}</span>
                    </div>

                    {/* Type selector */}
                    {item.status === 'pending' && (
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {DOC_TYPES.map(type => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => updateUpload(item.id, { type: type.value as DocumentType })}
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full border transition-all",
                              item.type === type.value
                                ? type.color + ' font-medium'
                                : "border-border text-muted-foreground hover:border-primary/30"
                            )}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Progress */}
                    {item.status === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={item.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">{item.progress}%</p>
                      </div>
                    )}

                    {item.status === 'error' && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {item.error}
                      </p>
                    )}

                    {item.status === 'done' && (
                      <p className="text-xs text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Uploaded successfully
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleUpload(item)} className="h-7 text-xs px-2.5">
                          Upload
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => setUploads(prev => prev.filter(u => u.id !== item.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                    {item.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {item.status === 'error' && (
                      <Button size="sm" variant="outline" onClick={() => handleUpload(item)} className="h-7 text-xs px-2.5">
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Upload All */}
            {uploads.some(u => u.status === 'pending') && (
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  onClick={() => uploads.filter(u => u.status === 'pending').forEach(handleUpload)}
                >
                  Upload All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Uploaded Documents */}
      {Object.keys(groupedDocs).length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Uploaded Documents ({project?.documents?.length || 0})</h2>
          {Object.entries(groupedDocs).map(([typeKey, docs]) => {
            const typeConfig = getDocTypeConfig(typeKey);
            return (
              <div key={typeKey}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", typeConfig.color)}>
                    {typeConfig.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{docs.length} file{docs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {docs.map((doc: any) => {
                    const Icon = getFileIcon(doc.name);
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors group"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(doc.size)} · {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {doc.url && (
                            <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:text-destructive"
                            onClick={() => setDeleteDocId(doc.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        uploads.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No documents uploaded yet</p>
          </div>
        )
      )}

      {/* Delete Confirm */}
      <Dialog open={!!deleteDocId} onOpenChange={() => setDeleteDocId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              This will permanently delete the document from storage. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDocId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDoc} disabled={deleting}>
              {deleting ? <><Loader2 className="h-4 w-4 animate-spin" />Deleting...</> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsUpload;