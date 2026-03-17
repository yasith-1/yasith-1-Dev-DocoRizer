import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Database, Cloud, Shield, Zap, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const About: React.FC = () => {
  const stack = [
    { label: 'Frontend', items: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui'] },
    { label: 'Backend',  items: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT'] },
    { label: 'Storage',  items: ['Supabase Storage', 'Multer', 'Supabase JS SDK'] },
    { label: 'DevOps',   items: ['Docker', 'Nginx', 'Nodemon'] },
  ];

  const features = [
    { icon: Database, title: 'MongoDB Database',   desc: 'All project data persisted in MongoDB Atlas with Mongoose ODM' },
    { icon: Cloud,    title: 'Supabase Storage',   desc: 'Real file uploads stored in Supabase with public CDN URLs' },
    { icon: Shield,   title: 'JWT Auth',            desc: 'Secure bcrypt password hashing and JSON Web Tokens' },
    { icon: Package,  title: 'ZIP Export',          desc: 'Export complete project documentation as organized ZIP packages' },
    { icon: Zap,      title: 'Auto-save',           desc: 'Requirements auto-save as you type with debounced API calls' },
    { icon: FileText, title: 'Doc Organization',   desc: 'Categorize documents by type: SRS, ERD, Use Case, UI/UX, Other' },
  ];

  return (
    <div className="page-container max-w-4xl">
      {/* Hero */}
      <div className="text-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 mx-auto mb-6">
          <FileText className="h-8 w-8" />
        </div>
        <Badge variant="secondary" className="mb-4">v2.0 — MongoDB + Supabase</Badge>
        <h1 className="text-4xl font-black text-foreground mb-4">About DocoRizer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A developer-focused documentation management platform. Organize requirements, upload real files to cloud storage, manage todos, and share complete project packages.
        </p>
      </div>

      <Separator className="mb-12" />

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">What's included</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="border-border/60">
                <CardContent className="pt-5 pb-5">
                  <Icon className="h-5 w-5 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1 text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Tech Stack</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stack.map(group => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(item => (
                  <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-12" />

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">Ready to use it?</h2>
        <p className="text-muted-foreground mb-6">Create an account and start your first project today.</p>
        <Button asChild className="gap-2">
          <Link to="/auth">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default About;