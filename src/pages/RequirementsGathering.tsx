import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { Save, Loader2, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const RequirementsGathering: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { projects, updateRequirements } = useProject();
  const project = projects.find(p => p.id === projectId);

  const [requirements, setRequirements] = useState(project?.requirements || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (project?.requirements !== undefined) {
      setRequirements(project.requirements);
    }
  }, [project?.requirements]);

  // Auto-save after 1.5s of no typing
  const handleChange = (value: string) => {
    setRequirements(value);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => handleSave(value), 1500);
  };

  const handleSave = async (value?: string) => {
    if (!projectId) return;
    setSaving(true);
    try {
      await updateRequirements(projectId, value ?? requirements);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const wordCount = requirements.trim() ? requirements.trim().split(/\s+/).length : 0;
  const charCount = requirements.length;

  return (
    <div className="page-container max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Requirements</h1>
        <p className="text-muted-foreground mt-1">
          Document your project goals, scope, and functional requirements
        </p>
      </div>

      {/* Tips */}
      <Card className="mb-6 border-blue-500/20 bg-blue-500/5">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">What to include</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Executive summary & business context</li>
                <li>Scope — what's in and out of scope</li>
                <li>Functional requirements (what the system must do)</li>
                <li>Non-functional requirements (performance, security, scalability)</li>
                <li>Stakeholders & user personas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Requirements Document
              </CardTitle>
              <CardDescription className="mt-1">
                Auto-saves 1.5s after you stop typing
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {saving && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              )}
              {saved && !saving && (
                <span className="text-xs text-emerald-500">✓ Saved</span>
              )}
              <Button
                size="sm"
                onClick={() => handleSave()}
                disabled={saving}
                className="gap-1.5"
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={requirements}
            onChange={e => handleChange(e.target.value)}
            placeholder={`Executive Summary\n\nDescribe the business context and goals here...\n\nScope\n\n• In scope: ...\n• Out of scope: ...\n\nFunctional Requirements\n\n1. The system shall...\n2. The system shall...`}
            className="min-h-[500px] resize-y font-mono text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsGathering;