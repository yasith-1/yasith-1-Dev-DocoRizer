import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Upload, Download, Share2, CheckCircle,
  Clock, Users, ArrowRight, Zap, Database, Cloud, Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: FileText,  title: 'Organize Requirements', description: 'Collect and structure your project requirements in one place with auto-save' },
    { icon: Upload,    title: 'Upload Documents',       description: 'Store SRS, ERD, use cases, and design files securely in Supabase cloud' },
    { icon: Download,  title: 'Export as ZIP',          description: 'Download all your documentation as an organized ZIP package instantly' },
    { icon: Share2,    title: 'Easy Sharing',           description: 'Share project packages via WhatsApp or export directly to stakeholders' },
  ];

  const benefits = [
    { icon: Database, title: 'MongoDB Powered',    description: 'Your data persists reliably in MongoDB Atlas with full ACID guarantees' },
    { icon: Cloud,    title: 'Supabase Storage',   description: 'Files stored in Supabase for fast, global CDN delivery and direct access URLs' },
    { icon: Shield,   title: 'JWT Authentication', description: 'Secure, token-based authentication keeps your projects private and safe' },
  ];

  const stats = [
    { value: '10K+', label: 'Developers' },
    { value: '50K+', label: 'Documents' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-28">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
            <Zap className="h-3 w-3" />
            MongoDB + Supabase Powered
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-6">
            Documentation
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Organize project requirements, upload documents to cloud storage, manage todos, and export everything as a clean ZIP package — all in one place.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {isAuthenticated ? (
              <Button size="lg" asChild className="text-base px-8 gap-2 shadow-lg shadow-primary/20">
                <Link to="/projects">
                  My Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild className="text-base px-8 gap-2 shadow-lg shadow-primary/20">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base px-8">
                  <Link to="/about">Learn More</Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-14 flex-wrap">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-black text-foreground">Everything you need</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="group border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-card">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Built Different</p>
              <h2 className="text-4xl font-black text-foreground mb-8">
                Real storage. Real database. Real projects.
              </h2>
              <div className="space-y-6">
                {benefits.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />
              <Card className="relative border-border/60 shadow-2xl">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  {['SRS Document.pdf', 'ERD_v2.png', 'UI_Wireframes.fig'].map((name, i) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <FileText className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{name}</p>
                        <p className="text-xs text-muted-foreground">Stored in Supabase · {['1.2 MB', '340 KB', '2.1 MB'][i]}</p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                  ))}
                  <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>3 files · 3.64 MB total</span>
                    <span className="text-emerald-500 font-medium">✓ All synced</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-12 sm:p-16 text-center shadow-2xl shadow-primary/20">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to get organized?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Join thousands of developers using DocoRizer to ship more organized, well-documented projects.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-base px-10 gap-2 bg-white text-primary hover:bg-white/90">
            <Link to="/auth">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;