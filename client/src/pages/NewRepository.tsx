import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Lock,
  Info,
  Sparkles,
  ArrowRight,
  FolderGit2,
  FileText,
  Shield,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import repositoryService from '@/services/repository.service';

export function NewRepository() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public' as 'public' | 'private',
    initReadme: true,
    gitignoreTemplate: '',
    license: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateName = (name: string) => {
    if (!name) {
      setNameError('');
      return false;
    }

    if (name.length < 1) {
      setNameError('Repository name is required');
      return false;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
      setNameError(
        'Repository name can only contain alphanumeric characters, dots, hyphens, and underscores'
      );
      return false;
    }

    setNameError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ ...formData, name });
    validateName(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateName(formData.name)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await repositoryService.create({
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        initReadme: formData.initReadme,
        gitignoreTemplate: formData.gitignoreTemplate || undefined,
        license: formData.license || undefined,
      });

      if (response.success) {
        navigate(`/${user?.username}/${formData.name}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container max-w-3xl py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            New Repository
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Create a <span className="gradient-text">new repository</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A repository contains all your project files, including the revision history.
            Already have a project? Import it instead.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Owner and Name Card */}
            <div className="glass rounded-2xl p-6 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <FolderGit2 className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Repository Details</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Owner</Label>
                    <div className="flex h-12 items-center gap-2 rounded-xl bg-muted/50 border border-border/50 px-4">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{user?.username}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Repository name <span className="text-destructive">*</span>
                    </Label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleNameChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="my-awesome-project"
                        className={`h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all ${
                          nameError ? 'border-destructive focus:ring-destructive/20' : ''
                        }`}
                        required
                      />
                    </div>
                    {nameError ? (
                      <p className="text-xs text-destructive">{nameError}</p>
                    ) : formData.name && !nameError ? (
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {user?.username}/{formData.name} is available
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 mt-6">
                  <Label htmlFor="description">Description <span className="text-muted-foreground">(optional)</span></Label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'description' ? 'scale-[1.01]' : ''}`}>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Short description of your repository"
                      rows={3}
                      className="rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Card */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Visibility</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <VisibilityOption
                  icon={<Globe className="h-6 w-6" />}
                  title="Public"
                  description="Anyone can see this repository. You choose who can commit."
                  selected={formData.visibility === 'public'}
                  onClick={() => setFormData({ ...formData, visibility: 'public' })}
                  color="green"
                />
                <VisibilityOption
                  icon={<Lock className="h-6 w-6" />}
                  title="Private"
                  description="You choose who can see and commit to this repository."
                  selected={formData.visibility === 'private'}
                  onClick={() => setFormData({ ...formData, visibility: 'private' })}
                  color="yellow"
                />
              </div>
            </div>

            {/* Initialize Repository Card */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Initialize repository</h2>
              </div>

              <div className="space-y-4">
                {/* README */}
                <label className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id="initReadme"
                    checked={formData.initReadme}
                    onChange={(e) =>
                      setFormData({ ...formData, initReadme: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Add a README file</p>
                    <p className="text-sm text-muted-foreground">
                      This is where you can write a long description for your project.
                    </p>
                  </div>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </label>

                {/* .gitignore and License in a row */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gitignore" className="text-sm">Add .gitignore</Label>
                    <Select
                      value={formData.gitignoreTemplate}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gitignoreTemplate: value })
                      }
                    >
                      <SelectTrigger id="gitignore" className="h-12 rounded-xl bg-muted/50 border-border/50">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent className="glass border-border/50">
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="node">Node</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license" className="text-sm">Choose a license</Label>
                    <Select
                      value={formData.license}
                      onValueChange={(value) =>
                        setFormData({ ...formData, license: value })
                      }
                    >
                      <SelectTrigger id="license" className="h-12 rounded-xl bg-muted/50 border-border/50">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent className="glass border-border/50">
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mit">MIT License</SelectItem>
                        <SelectItem value="apache">Apache License 2.0</SelectItem>
                        <SelectItem value="gpl">GNU GPLv3</SelectItem>
                        <SelectItem value="bsd">BSD 3-Clause</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Choosing a license helps others know what they can and can't do with your code.{' '}
                    <Link to="/licenses" className="text-primary hover:underline">Learn more</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive">*</span> Required fields
              </p>
              <Button
                type="submit"
                disabled={isLoading || !!nameError || !formData.name}
                className="btn-glow glow-primary rounded-full px-8 h-12 text-base font-semibold group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create repository
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function VisibilityOption({
  icon,
  title,
  description,
  selected,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  color: 'green' | 'yellow';
}) {
  const colorClasses = {
    green: {
      selected: 'border-green-500/50 bg-green-500/10',
      icon: 'bg-green-500/20 text-green-500',
      ring: 'ring-green-500',
    },
    yellow: {
      selected: 'border-yellow-500/50 bg-yellow-500/10',
      icon: 'bg-yellow-500/20 text-yellow-500',
      ring: 'ring-yellow-500',
    },
  };

  const colors = colorClasses[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all hover-lift ${
        selected
          ? colors.selected
          : 'border-border/50 hover:border-muted-foreground/50'
      }`}
    >
      <div className={`p-2.5 rounded-xl transition-colors ${selected ? colors.icon : 'bg-muted text-muted-foreground'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{title}</p>
          {selected && (
            <div className={`h-2 w-2 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

export default NewRepository;
