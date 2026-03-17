export interface Project {
  id: string;
  name: string;
  clientName?: string;
  deadline?: string;
  tags: string[];
  requirements: string;
  documents: Document[];
  resourceLinks: ResourceLink[];
  todos: Todo[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size?: number;
  file?: File;
  uploadedAt: string;
}

export interface ResourceLink {
  id: string;
  url: string;
  label?: string;
  description?: string;
  addedAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'srs' | 'erd' | 'usecase' | 'uiux' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
}