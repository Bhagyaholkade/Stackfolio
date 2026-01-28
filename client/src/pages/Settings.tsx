import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import repositoryService from '@/services/repository.service';
import { Repository } from '@/types';

export function RepositorySettings() {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    visibility: 'public' as 'public' | 'private',
    homepage: '',
  });

  useEffect(() => {
    const fetchRepo = async () => {
      if (!owner || !repo) return;

      try {
        const res = await repositoryService.get(owner, repo);
        setRepository(res.data);
        setFormData({
          description: res.data.description || '',
          visibility: res.data.visibility,
          homepage: res.data.homepage || '',
        });
      } catch (err) {
        console.error('Error fetching repository:', err);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepo();
  }, [owner, repo, navigate]);

  // Check if user is the owner
  useEffect(() => {
    if (!isLoading && repository && user?.username !== owner) {
      navigate(`/${owner}/${repo}`);
    }
  }, [isLoading, repository, user, owner, repo, navigate]);

  const handleSave = async () => {
    if (!owner || !repo) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await repositoryService.update(owner, repo, formData);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!owner || !repo || deleteConfirm !== repo) return;

    setIsDeleting(true);
    setError('');

    try {
      await repositoryService.delete(owner, repo);
      navigate(`/${owner}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to delete repository');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-96 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!repository) {
    return null;
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage settings for {owner}/{repo}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-md bg-green-500/10 p-3 text-sm text-green-500">
          {success}
        </div>
      )}

      <div className="space-y-8">
        {/* General Settings */}
        <section>
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="name">Repository name</Label>
              <Input
                id="name"
                value={repository.name}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Repository name cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description of your repository"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="homepage">Homepage</Label>
              <Input
                id="homepage"
                type="url"
                value={formData.homepage}
                onChange={(e) =>
                  setFormData({ ...formData, homepage: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value: 'public' | 'private') =>
                  setFormData({ ...formData, visibility: value })
                }
              >
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.visibility === 'public'
                  ? 'Anyone can see this repository'
                  : 'Only you can see this repository'}
              </p>
            </div>

            <div className="pt-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Danger Zone */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-destructive">
            Danger Zone
          </h2>
          <div className="rounded-lg border border-destructive/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Delete this repository</h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete a repository, there is no going back.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Delete repository
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      the <strong>{owner}/{repo}</strong> repository and all of
                      its contents.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm">
                      Please type <strong>{repo}</strong> to confirm.
                    </p>
                    <Input
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder={repo}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteConfirm !== repo || isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'I understand, delete this repository'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RepositorySettings;
