import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  Star,
  GitFork,
  Lock,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  Activity,
  Code2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import userService from '@/services/user.service';
import { Repository } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const { user } = useAuthStore();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRepos = async () => {
      if (!user) return;

      try {
        const response = await userService.getRepos(user.username, {
          sort: 'updated',
          direction: 'desc',
        });
        setRepositories(response.data);
        setFilteredRepos(response.data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRepos(filtered);
    } else {
      setFilteredRepos(repositories);
    }
  }, [searchQuery, repositories]);

  return (
    <div className="min-h-screen">
      {/* Subtle background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {/* User quick stats */}
              <div className="glass rounded-2xl p-4 mb-6 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <div>
                    <p className="font-semibold">{user?.name || user?.username}</p>
                    <p className="text-sm text-muted-foreground">@{user?.username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold text-primary">{repositories.length}</div>
                    <div className="text-xs text-muted-foreground">Repos</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold text-yellow-500">
                      {repositories.reduce((acc, repo) => acc + repo.starCount, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Stars</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold text-blue-500">
                      {repositories.reduce((acc, repo) => acc + repo.forkCount, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Forks</div>
                  </div>
                </div>
              </div>

              {/* Repository list */}
              <div className="glass rounded-2xl p-4 border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Repositories
                  </h2>
                  <Button size="sm" className="btn-glow glow-primary rounded-full h-8" asChild>
                    <Link to="/new">
                      <Plus className="h-4 w-4 mr-1" />
                      New
                    </Link>
                  </Button>
                </div>
                <div className="relative mb-4">
                  <Input
                    placeholder="Find a repository..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-muted/50 border-border/50 rounded-xl pl-4"
                  />
                </div>
                <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))
                  ) : filteredRepos.length > 0 ? (
                    filteredRepos.slice(0, 10).map((repo) => (
                      <Link
                        key={repo._id}
                        to={`/${user?.username}/${repo.name}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors group"
                      >
                        {repo.visibility === 'private' ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                        <span className="truncate group-hover:text-primary transition-colors">{repo.name}</span>
                        {repo.language && (
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {repo.language}
                          </span>
                        )}
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No repositories found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 p-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Welcome back</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  Hello, <span className="gradient-text">{user?.name || user?.username}</span>!
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Ready to build something amazing? Create a new repository or continue working on your existing projects.
                </p>
              </div>
            </div>

            {/* Quick stats cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                icon={<Activity className="h-5 w-5" />}
                label="Recent Activity"
                value={repositories.filter(r => {
                  const pushedAt = new Date(r.pushedAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return pushedAt > weekAgo;
                }).length.toString()}
                description="repos updated this week"
                color="from-green-500 to-emerald-500"
              />
              <StatCard
                icon={<Code2 className="h-5 w-5" />}
                label="Public Repos"
                value={repositories.filter(r => r.visibility === 'public').length.toString()}
                description="visible to everyone"
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<Lock className="h-5 w-5" />}
                label="Private Repos"
                value={repositories.filter(r => r.visibility === 'private').length.toString()}
                description="only visible to you"
                color="from-purple-500 to-pink-500"
              />
            </div>

            {/* Recent Repositories */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Repositories
                </h2>
                <Link
                  to={`/${user?.username}?tab=repositories`}
                  className="text-sm text-primary hover:underline flex items-center gap-1 group"
                >
                  View all
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-2xl" />
                  ))}
                </div>
              ) : filteredRepos.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredRepos.slice(0, 6).map((repo, index) => (
                    <RepoCard
                      key={repo._id}
                      repo={repo}
                      username={user?.username || ''}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/50 p-12 text-center glass">
                  <div className="relative inline-flex">
                    <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No repositories yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Create your first repository to start building something amazing
                  </p>
                  <Button className="btn-glow glow-primary rounded-full" asChild>
                    <Link to="/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first repository
                    </Link>
                  </Button>
                </div>
              )}
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <QuickActionCard
                  icon={<Plus className="h-6 w-6" />}
                  title="New repository"
                  description="Create a new repository"
                  to="/new"
                  gradient="from-green-500/20 to-emerald-500/20"
                  iconColor="text-green-500"
                />
                <QuickActionCard
                  icon={<Star className="h-6 w-6" />}
                  title="Explore"
                  description="Discover new projects"
                  to="/explore"
                  gradient="from-yellow-500/20 to-orange-500/20"
                  iconColor="text-yellow-500"
                />
                <QuickActionCard
                  icon={<Users className="h-6 w-6" />}
                  title="Your profile"
                  description="View your public profile"
                  to={`/${user?.username}`}
                  gradient="from-blue-500/20 to-cyan-500/20"
                  iconColor="text-blue-500"
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 glass p-4 group hover-lift">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} text-white`}>
            {icon}
          </div>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

function RepoCard({ repo, username, index }: { repo: Repository; username: string; index: number }) {
  const gradients = [
    'from-green-500/10 to-emerald-500/10',
    'from-blue-500/10 to-cyan-500/10',
    'from-purple-500/10 to-pink-500/10',
    'from-yellow-500/10 to-orange-500/10',
    'from-red-500/10 to-rose-500/10',
    'from-indigo-500/10 to-violet-500/10',
  ];

  return (
    <Link
      to={`/${username}/${repo.name}`}
      className={`group relative overflow-hidden rounded-2xl border border-border/50 p-5 hover-lift bg-gradient-to-br ${gradients[index % gradients.length]}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-card/80" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {repo.visibility === 'private' ? (
              <div className="p-1.5 rounded-lg bg-muted">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            )}
            <span className="font-semibold text-primary group-hover:underline">
              {repo.name}
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground">
            {repo.visibility}
          </span>
        </div>

        {repo.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {repo.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-primary" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
            <Star className="h-3.5 w-3.5" />
            {repo.starCount}
          </span>
          <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <GitFork className="h-3.5 w-3.5" />
            {repo.forkCount}
          </span>
          <span className="ml-auto">
            Updated {formatDistanceToNow(new Date(repo.pushedAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  to,
  gradient,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  gradient: string;
  iconColor: string;
}) {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl border border-border/50 p-5 hover-lift bg-gradient-to-br ${gradient}`}
    >
      <div className="absolute inset-0 bg-card/80" />
      <div className="relative flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-background/50 ${iconColor} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

export default Dashboard;
