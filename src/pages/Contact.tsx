import React, { useState } from 'react';
import { Mail, Github, MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <div className="page-container max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-foreground mb-3">Get in Touch</h1>
        <p className="text-muted-foreground text-lg">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Contact Details</h2>
          {[
            { icon: Mail,          label: 'Email',  value: 'yashith.wd@gmail.com', href: 'mailto:yashith.wd@gmail.com' },
            { icon: Github,        label: 'GitHub', value: 'https://github.com/yasith-1', href: 'https://github.com/yasith-1' },
            { icon: MessageSquare, label: 'Whatsapp', value: '+94701410113',  href: 'https://wa.me/+94701410113' },
          ].map(c => {
            const Icon = c.icon;
            return (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Form */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle>Send a message</CardTitle>
            <CardDescription>We'll reply within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <p className="font-semibold text-foreground">Message sent!</p>
                <p className="text-sm text-muted-foreground">We'll get back to you soon.</p>
                <Button variant="outline" size="sm" onClick={() => setSent(false)}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell us how we can help..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    className="min-h-[120px] resize-none"
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={sending}>
                  {sending ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : <><Send className="h-4 w-4" />Send Message</>}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;