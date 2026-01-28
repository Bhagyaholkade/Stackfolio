import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  GitFork,
  Eye,
  Code,
  History,
  Settings,
  Lock,
  BookOpen,
  GitBranch,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Upload,
  Plus,
  FileCode,
  FolderUp,
  X,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import repositoryService from '@/services/repository.service';
import { Repository as RepoType, FileEntry, Branch, Commit, FileContent } from '@/types';
import FileExplorer from '@/components/repository/FileExplorer';
import BranchSelector from '@/components/repository/BranchSelector';
import CommitList from '@/components/repository/CommitList';
import ReadmeViewer from '@/components/repository/ReadmeViewer';
import CodeViewer from '@/components/repository/CodeViewer';
import { formatDistanceToNow } from 'date-fns';

export function Repository() {
  const { owner, repo, '*': path } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [repository, setRepository] = useState<RepoType | null>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [currentPath, setCurrentPath] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'blob'>('tree');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code');
  const [copied, setCopied] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse URL path
  useEffect(() => {
    const urlPath = window.location.pathname;
    const treeMatch = urlPath.match(/\/tree\/([^/]+)(?:\/(.*))?$/);
    const blobMatch = urlPath.match(/\/blob\/([^/]+)\/(.+)$/);

    if (blobMatch) {
      setViewMode('blob');
      setCurrentBranch(blobMatch[1]);
      setCurrentPath(blobMatch[2] || '');
    } else if (treeMatch) {
      setViewMode('tree');
      setCurrentBranch(treeMatch[1]);
      setCurrentPath(treeMatch[2] || '');
    } else {
      setViewMode('tree');
      setCurrentPath('');
    }
  }, [path]);

  // Fetch repository data
  useEffect(() => {
    const fetchData = async () => {
      if (!owner || !repo) return;

      setIsLoading(true);

      try {
        const [repoRes, branchesRes] = await Promise.all([
          repositoryService.get(owner, repo),
          repositoryService.getBranches(owner, repo),
        ]);

        setRepository(repoRes.data);
        setBranches(branchesRes.data);

        if (repoRes.data.defaultBranch && !currentBranch) {
          setCurrentBranch(repoRes.data.defaultBranch);
        }
      } catch (error) {
        console.error('Error fetching repository:', error);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [owner, repo, navigate]);

  // Fetch files or file content based on view mode
  useEffect(() => {
    const fetchContent = async () => {
      if (!owner || !repo || !currentBranch) return;

      try {
        if (viewMode === 'blob' && currentPath) {
          const res = await repositoryService.getFileContent(
            owner,
            repo,
            currentBranch,
            currentPath
          );
          setFileContent(res.data);
        } else {
          const res = await repositoryService.getFileTree(
            owner,
            repo,
            currentBranch,
            currentPath
          );
          setFiles(res.data);

          // Check for README
          if (!currentPath) {
            const readmeFile = res.data.find(
              (f) =>
                f.type === 'file' &&
                f.name.toLowerCase().startsWith('readme')
            );

            if (readmeFile) {
              const readmeRes = await repositoryService.getFileContent(
                owner,
                repo,
                currentBranch,
                readmeFile.path
              );
              setReadmeContent(readmeRes.data.content);
            } else {
              setReadmeContent(null);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [owner, repo, currentBranch, currentPath, viewMode]);

  // Fetch commits
  useEffect(() => {
    const fetchCommits = async () => {
      if (!owner || !repo || !currentBranch) return;

      try {
        const res = await repositoryService.getCommits(
          owner,
          repo,
          currentBranch
        );
        setCommits(res.data);
      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };

    fetchCommits();
  }, [owner, repo, currentBranch]);

  const handleBranchChange = (branch: string) => {
    setCurrentBranch(branch);
    navigate(`/${owner}/${repo}/tree/${branch}`);
  };

  const handleStar = async () => {
    if (!owner || !repo || !repository) return;

    try {
      if (repository.isStarred) {
        await repositoryService.unstar(owner, repo);
        setRepository({ ...repository, isStarred: false, starCount: repository.starCount - 1 });
      } else {
        await repositoryService.star(owner, repo);
        setRepository({ ...repository, isStarred: true, starCount: repository.starCount + 1 });
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleFork = async () => {
    if (!owner || !repo) return;

    try {
      const res = await repositoryService.fork(owner, repo);
      if (res.success) {
        navigate(`/${user?.username}/${res.data.name}`);
      }
    } catch (error) {
      console.error('Error forking:', error);
    }
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone ${window.location.origin}/${owner}/${repo}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // File upload handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);

    // Filter out .git folder files and other unwanted files
    const filteredFiles = droppedFiles.filter((file) => {
      const filePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      const skipPatterns = [
        /[/\\]\.git[/\\]/,
        /[/\\]node_modules[/\\]/,
        /[/\\]\.DS_Store$/,
        /[/\\]Thumbs\.db$/,
      ];
      return !skipPatterns.some(pattern => pattern.test(filePath));
    });

    setUploadFiles(prev => [...prev, ...filteredFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Filter out .git folder files and other unwanted files
      const filteredFiles = selectedFiles.filter((file) => {
        const filePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
        // Skip .git folder, node_modules, and other common unwanted directories
        const skipPatterns = [
          /[/\\]\.git[/\\]/,
          /[/\\]node_modules[/\\]/,
          /[/\\]\.DS_Store$/,
          /[/\\]Thumbs\.db$/,
        ];
        return !skipPatterns.some(pattern => pattern.test(filePath));
      });

      if (filteredFiles.length < selectedFiles.length) {
        console.log(`Filtered out ${selectedFiles.length - filteredFiles.length} files (.git, node_modules, etc.)`);
      }

      setUploadFiles(prev => [...prev, ...filteredFiles]);
      // Reset input so same files can be selected again
      e.target.value = '';
    }
  };

  const folderInputRef = useRef<HTMLInputElement>(null);

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0 || !owner || !repo) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Call actual upload API with progress tracking
      const result = await repositoryService.uploadFiles(
        owner,
        repo,
        currentBranch,
        uploadFiles,
        (progress) => setUploadProgress(progress)
      );

      if (result.success) {
        // Reset and close modal
        setUploadFiles([]);
        setShowUploadModal(false);
        setUploadProgress(0);

        // Refresh file list
        const res = await repositoryService.getFileTree(owner, repo, currentBranch, currentPath);
        setFiles(res.data);

        // Also refresh commits since we created new commits
        const commitsRes = await repositoryService.getCommits(owner, repo, currentBranch);
        setCommits(commitsRes.data);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'go', 'rs', 'cpp', 'c'].includes(ext || '')) {
      return <FileCode className="w-5 h-5 text-blue-400" />;
    }
    return <FileText className="w-5 h-5 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>
        <div className="container py-8">
          <div className="glass rounded-2xl p-6 mb-6 border border-border/50">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96 mb-6" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass rounded-2xl p-12 border border-border/50">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Repository not found</h1>
          <p className="text-muted-foreground">
            The repository you're looking for doesn't exist or you don't have access.
          </p>
        </div>
      </div>
    );
  }

  const isOwner = user?.username === owner;
  const filename = currentPath.split('/').pop() || '';

  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container py-8">
        {/* Header Card */}
        <div className="glass rounded-2xl p-6 mb-6 border border-border/50 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative">
            {/* Repo name and visibility */}
            <div className="flex items-center gap-3 text-lg mb-3">
              <div className={`p-2 rounded-xl ${repository.visibility === 'private' ? 'bg-muted' : 'bg-primary/10'}`}>
                {repository.visibility === 'private' ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <BookOpen className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/${owner}`} className="text-primary hover:underline font-medium">
                  {owner}
                </Link>
                <span className="text-muted-foreground">/</span>
                <Link to={`/${owner}/${repo}`} className="text-primary font-bold hover:underline">
                  {repo}
                </Link>
                <Badge
                  variant="outline"
                  className={`ml-2 ${
                    repository.visibility === 'private'
                      ? 'border-yellow-500/50 text-yellow-500'
                      : 'border-green-500/50 text-green-500'
                  }`}
                >
                  {repository.visibility}
                </Badge>
              </div>
            </div>

            {/* Description */}
            {repository.description && (
              <p className="text-muted-foreground mb-6 max-w-2xl">{repository.description}</p>
            )}

            {/* Stats and actions row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Star button */}
              <Button
                variant={repository.isStarred ? 'default' : 'outline'}
                size="sm"
                onClick={handleStar}
                disabled={!isAuthenticated}
                className={`rounded-full gap-2 ${
                  repository.isStarred
                    ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
                    : 'hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/50'
                }`}
              >
                <Star className={`h-4 w-4 ${repository.isStarred ? 'fill-current' : ''}`} />
                {repository.isStarred ? 'Starred' : 'Star'}
                <span className="px-2 py-0.5 rounded-full bg-muted/50 text-xs font-semibold">
                  {repository.starCount}
                </span>
              </Button>

              {/* Fork button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleFork}
                disabled={!isAuthenticated || isOwner}
                className="rounded-full gap-2 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/50"
              >
                <GitFork className="h-4 w-4" />
                Fork
                <span className="px-2 py-0.5 rounded-full bg-muted/50 text-xs font-semibold">
                  {repository.forkCount}
                </span>
              </Button>

              {/* Watch button */}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2 hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/50"
                disabled
              >
                <Eye className="h-4 w-4" />
                Watch
                <span className="px-2 py-0.5 rounded-full bg-muted/50 text-xs font-semibold">
                  {repository.watchCount}
                </span>
              </Button>

              {/* Clone button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyClone}
                className="rounded-full gap-2 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Clone
                  </>
                )}
              </Button>

              {/* Add file button for owner */}
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploadModal(true)}
                  className="rounded-full gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/30 hover:border-blue-500/50 text-blue-400"
                >
                  <Upload className="h-4 w-4" />
                  Upload Files
                </Button>
              )}

              {/* Settings button for owner */}
              {isOwner && (
                <Button variant="outline" size="sm" asChild className="rounded-full gap-2 ml-auto">
                  <Link to={`/${owner}/${repo}/settings`}>
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              )}
            </div>

            {/* Additional info row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground">
              {repository.language && (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-primary" />
                  {repository.language}
                </span>
              )}
              {repository.homepage && (
                <a
                  href={repository.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {new URL(repository.homepage).hostname}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {formatDistanceToNow(new Date(repository.pushedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass border border-border/50 rounded-full p-1 h-auto">
            <TabsTrigger
              value="code"
              className="rounded-full gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
            >
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger
              value="commits"
              className="rounded-full gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
            >
              <History className="h-4 w-4" />
              Commits
              <span className="px-2 py-0.5 rounded-full bg-muted/50 text-xs">
                {commits.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="mt-6">
            {/* Branch selector and info */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <BranchSelector
                  branches={branches}
                  currentBranch={currentBranch}
                  onBranchChange={handleBranchChange}
                />
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <GitBranch className="h-4 w-4" />
                  {branches.length} branch{branches.length !== 1 ? 'es' : ''}
                </span>
              </div>
            </div>

            {/* File viewer or tree */}
            <div className="glass rounded-2xl border border-border/50 overflow-hidden">
              {viewMode === 'blob' && fileContent ? (
                <CodeViewer content={fileContent} filename={filename} />
              ) : (
                <>
                  <FileExplorer
                    files={files}
                    owner={owner!}
                    repo={repo!}
                    branch={currentBranch}
                    currentPath={currentPath}
                  />
                </>
              )}
            </div>

            {/* README */}
            {readmeContent && !currentPath && viewMode !== 'blob' && (
              <div className="mt-6 glass rounded-2xl border border-border/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2 bg-muted/30">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-medium">README.md</span>
                </div>
                <ReadmeViewer content={readmeContent} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="commits" className="mt-6">
            <div className="glass rounded-2xl border border-border/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2 bg-muted/30">
                <History className="h-4 w-4 text-primary" />
                <span className="font-medium">Commit History</span>
                <span className="text-sm text-muted-foreground">
                  on <span className="text-primary">{currentBranch}</span>
                </span>
              </div>
              <CommitList commits={commits} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isUploading && setShowUploadModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl mx-4 animate-fade-in-up">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-60" />

              <div className="relative bg-[#0d0d1a] border border-white/10 rounded-2xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Upload Files</h2>
                      <p className="text-sm text-muted-foreground">Add files to {repo}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => !isUploading && setShowUploadModal(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    disabled={isUploading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all mb-6 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/20'
                  }`}
                >
                  {/* Hidden file inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={folderInputRef}
                    type="file"
                    /* @ts-expect-error - webkitdirectory is a non-standard attribute */
                    webkitdirectory="true"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FolderUp className={`w-7 h-7 ${isDragging ? 'text-blue-400' : 'text-blue-400/60'}`} />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {isDragging ? 'Drop files or folders here' : 'Drag and drop files or folders here'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">or choose an option below</p>

                  {/* Upload Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all text-sm font-medium text-blue-400"
                    >
                      <FileCode className="w-4 h-4" />
                      Select Files
                    </button>
                    <button
                      onClick={() => folderInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all text-sm font-medium text-purple-400"
                    >
                      <FolderUp className="w-4 h-4" />
                      Select Folder
                    </button>
                  </div>
                </div>

                {/* File List */}
                {uploadFiles.length > 0 && (
                  <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {uploadFiles.length} file{uploadFiles.length !== 1 ? 's' : ''} selected
                      </p>
                      <button
                        onClick={() => setUploadFiles([])}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        disabled={isUploading}
                      >
                        Clear all
                      </button>
                    </div>
                    {uploadFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group"
                      >
                        <div className="p-2 rounded-lg bg-white/5">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" title={(file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name}>
                            {(file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-400 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading files...
                      </span>
                      <span className="text-sm text-blue-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-blue-500/20 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <p className="text-xs text-muted-foreground">
                    Files will be added to <span className="text-primary">{currentBranch}</span> branch
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowUploadModal(false)}
                      disabled={isUploading}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={uploadFiles.length === 0 || isUploading}
                      className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Upload {uploadFiles.length > 0 ? `${uploadFiles.length} file${uploadFiles.length !== 1 ? 's' : ''}` : 'Files'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Repository;
