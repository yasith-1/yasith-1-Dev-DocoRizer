import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin, Heart, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-lg mt-auto overflow-hidden">
      {/* Background glowing blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 mix-blend-screen" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105 duration-300">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Doco<span className="text-primary">Rizer</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              The ultimate documentation and project management tool designed to help developers organize requirements, resources, and tasks gracefully. Ship faster and think clearer.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-blue-600 hover:border-blue-600/50 hover:bg-blue-600/10 transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
                  My Projects
                </Link>
              </li>
              <li>
                <Link to="/todos/all" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
                  All Quests
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:yashith.wd@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <Mail className="h-4 w-4" />
                  Email Support
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  System Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 mt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} DocoRizer Platform. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Developed by <Heart className="h-3 w-3 text-red-500 fill-red-500" /> Yashith Prabhashwara
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;