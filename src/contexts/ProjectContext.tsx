import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Project, Document, ResourceLink, Todo } from '../types';
import { resourceLinksAPI, projectsAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  createProject: (projectData: Partial<Project>) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  addDocument: (projectId: string, document: Document) => Promise<void>;
  removeDocument: (projectId: string, documentId: string) => Promise<void>;
  addResourceLink: (projectId: string, link: ResourceLink) => Promise<void>;
  removeResourceLink: (projectId: string, linkId: string) => Promise<void>;
  loadResourceLinks: (projectId: string) => Promise<void>;
  updateRequirements: (projectId: string, requirements: string) => Promise<void>;
  addTodo: (projectId: string, todo: Partial<Todo>) => Promise<void>;
  updateTodo: (projectId: string, todoId: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (projectId: string, todoId: string) => Promise<void>;
  toggleTodo: (projectId: string, todoId: string) => Promise<void>;
  isLoading: boolean;
  deleteProject: (projectId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectsAPI.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [isAuthenticated, loadProjects]);

  const createProject = useCallback(async (projectData: Partial<Project>): Promise<string> => {
    try {
      const newProject = await projectsAPI.createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject.id;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await projectsAPI.updateProject(id, updates);
      setProjects(prev => prev.map(project =>
        project.id === id ? updatedProject : project
      ));
      setCurrentProject(prev => prev?.id === id ? updatedProject : prev);
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }, []);

  const handleSetCurrentProject = useCallback((project: Project | null) => {
    setCurrentProject(project);
  }, []);

  const addDocument = useCallback(async (projectId: string, document: Document) => {
    // DocumentsUpload page now calls projectsAPI.uploadDocument directly
    // This method is kept for backward compatibility with ProjectContext interface
    try {
      const newDoc = await projectsAPI.addDocument(projectId, {
        name: document.name,
        type: document.type,
        size: document.size || document.file?.size || 0,
        url: '',
        storagePath: ''
      });

      const fullDoc = { ...newDoc };

      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? { ...project, documents: [...(project.documents || []), fullDoc] }
          : project
      ));

      setCurrentProject(prev => {
        if (prev?.id === projectId) {
          return { ...prev, documents: [...(prev.documents || []), fullDoc] };
        }
        return prev;
      });
    } catch (error) {
      console.error('[ProjectContext] Failed to add document:', error);
      throw error;
    }
  }, []);

  const removeDocument = useCallback(async (projectId: string, documentId: string) => {
    try {
      await projectsAPI.deleteDocument(projectId, documentId);

      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? { ...project, documents: project.documents.filter(doc => doc.id !== documentId) }
          : project
      ));

      setCurrentProject(prev => {
        if (prev?.id === projectId) {
          return { ...prev, documents: prev.documents.filter(doc => doc.id !== documentId) };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to remove document:', error);
    }
  }, []);

  const addResourceLink = useCallback(async (projectId: string, link: ResourceLink) => {
    try {
      const newLink = await resourceLinksAPI.addResourceLink(projectId, {
        url: link.url,
        label: link.label,
        description: link.description
      });

      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? { ...project, resourceLinks: [...project.resourceLinks, newLink] }
          : project
      ));

      setCurrentProject(prev => {
        if (prev?.id === projectId) {
          return { ...prev, resourceLinks: [...prev.resourceLinks, newLink] };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to add resource link:', error);
    }
  }, []);

  const removeResourceLink = useCallback(async (projectId: string, linkId: string) => {
    try {
      await resourceLinksAPI.deleteResourceLink(projectId, linkId);

      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? { ...project, resourceLinks: project.resourceLinks.filter(link => link.id !== linkId) }
          : project
      ));

      setCurrentProject(prev => {
        if (prev?.id === projectId) {
          return { ...prev, resourceLinks: prev.resourceLinks.filter(link => link.id !== linkId) };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to remove resource link:', error);
      throw error;
    }
  }, []);

  const loadResourceLinks = useCallback(async (projectId: string) => {
    try {
      const resourceLinks = await resourceLinksAPI.getResourceLinks(projectId);

      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? { ...project, resourceLinks }
          : project
      ));

      setCurrentProject(prev => {
        if (prev?.id === projectId) {
          return { ...prev, resourceLinks };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to load resource links:', error);
    }
  }, []);

  const updateRequirements = useCallback(async (projectId: string, requirements: string) => {
    await updateProject(projectId, { requirements });
  }, [updateProject]);

  const addTodo = useCallback(async (projectId: string, todo: Partial<Todo>) => {
    try {
      const newTodo = await projectsAPI.addTodo(projectId, todo);
      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? { ...project, todos: [...project.todos, newTodo] }
          : project
      ));

      setCurrentProject(prev => {
        if (prev?.id === projectId) {
          return { ...prev, todos: [...prev.todos, newTodo] };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }, []);

  const updateTodo = useCallback(async (projectId: string, todoId: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await projectsAPI.updateTodo(projectId, todoId, updates);
      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? {
            ...project,
            todos: project.todos.map(todo =>
              todo.id === todoId ? updatedTodo : todo
            )
          }
          : project
      ));

      setCurrentProject(prev => {
        if (prev?.id === projectId) {
          return {
            ...prev,
            todos: prev.todos.map(todo => todo.id === todoId ? updatedTodo : todo)
          };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  }, []);

  const deleteTodo = useCallback(async (projectId: string, todoId: string) => {
    try {
      await projectsAPI.deleteTodo(projectId, todoId);
      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? { ...project, todos: project.todos.filter(todo => todo.id !== todoId) }
          : project
      ));

      setCurrentProject(prev => {
        if (prev?.id === projectId) {
          return { ...prev, todos: prev.todos.filter(todo => todo.id !== todoId) };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }, []);

  const toggleTodo = useCallback(async (projectId: string, todoId: string) => {
    const project = projects.find(p => p.id === projectId);
    const todo = project?.todos.find(t => t.id === todoId);
    if (todo) {
      await updateTodo(projectId, todoId, { completed: !todo.completed });
    }
  }, [projects, updateTodo]);

  const deleteProject = useCallback(async (projectId: string) => {
    try {
      await projectsAPI.deleteProject(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      setCurrentProject(prev => prev?.id === projectId ? null : prev);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      isLoading,
      createProject,
      updateProject,
      setCurrentProject: handleSetCurrentProject,
      addDocument,
      removeDocument,
      addResourceLink,
      removeResourceLink,
      loadResourceLinks,
      updateRequirements,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      deleteProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};