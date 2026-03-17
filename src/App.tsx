import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProjectNavigation from './components/Layout/ProjectNavigation';
import Home from './pages/Home';
import { Auth } from './pages/Auth';
import { Projects } from './pages/Projects';
import CreateProject from './pages/CreateProject';
import RequirementsGathering from './pages/RequirementsGathering';
import DocumentsUpload from './pages/DocumentsUpload';
import ResourceLinks from './pages/ResourceLinks';
import ProjectPreview from './pages/ProjectPreview';
import TodoManagement from './pages/TodoManagement';
import About from './pages/About';
import Contact from './pages/Contact';
import AllTodos from './pages/AllTodos';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAuthChecked } = useAuth();
  // Don't redirect until we've checked localStorage for existing session
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Layout wrapper for project pages to provide ProjectNavigation inside routing context
const ProjectLayout: React.FC = () => {
  return (
    <>
      <ProjectNavigation />
      <Routes>
        <Route path="/gather" element={<RequirementsGathering />} />
        <Route path="/docs" element={<DocumentsUpload />} />
        <Route path="/links" element={<ResourceLinks />} />
        <Route path="/todos" element={<TodoManagement />} />
        <Route path="/preview" element={<ProjectPreview />} />
      </Routes>
    </>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
          
          {/* Group project routes under a single parent route to apply the ProjectLayout */}
          <Route path="/project/:id/*" element={<ProtectedRoute><ProjectLayout /></ProtectedRoute>} />
          
          <Route path="/todos/all" element={<ProtectedRoute><AllTodos /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ProjectProvider>
            <AppContent />
          </ProjectProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;