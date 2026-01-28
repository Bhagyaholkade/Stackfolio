import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Link as LinkIcon,
  Building,
  Calendar,
  BookOpen,
  Star,
  GitFork,
  Users,
  Lock,
  Settings,
  Sparkles,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import userService from '@/services/user.service';
import { User, Repository } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';

export function Profile() {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();

  const [profile, setProfile] = useState<User | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      setIsLoading(true);

      try {
        const [profileRes, reposRes] = await Promise.all([
          userService.getByUsername(username),
          userService.getRepos(username, { sort: 'updated', direction: 'desc' }),
        ]);

        setProfile(profileRes.data);
        setRepositories(reposRes.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, isAuthenticated, currentUser, isOwnProfile]);

  const handleFollow = async () => {
    if (!username) return;

    try {
      if (isFollowing) {
        await userService.unfollow(username);
        setIsFollowing(false);
        if (profile) {
          setProfile({ ...profile, followers: profile.followers - 1 });
        }
      } else {
        await userService.follow(username);
        setIsFollowing(true);
        if (profile) {
          setProfile({ ...profile, followers: profile.followers + 1 });
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>
        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <Skeleton className="h-48 w-48 rounded-full mx-auto" />
              <Skeleton className="h-8 w-48 mt-4 mx-auto" />
              <Skeleton className="h-4 w-32 mt-2 mx-auto" />
            </aside>
            <main className="lg:col-span-3">
              <Skeleton className="h-12 w-full mb-4 rounded-full" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass rounded-2xl p-12 border border-border/50">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const totalStars = repositories.reduce((acc, repo) => acc + repo.starCount, 0);

  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Profile card */}
              <div className="glass rounded-2xl p-6 border border-border/50 relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative">
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                        <AvatarImage src={profile.avatar} alt={profile.username} />
                        <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-purple-600 text-white">
                          {profile.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOwnProfile && (
                        <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="text-center mb-4">
                    {profile.name && (
                      <h1 className="text-2xl font-bold">{profile.name}</h1>
                    )}
                    <p className="text-lg text-muted-foreground">@{profile.username}</p>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-sm text-center mb-4 text-muted-foreground">{profile.bio}</p>
                  )}

                  {/* Action buttons */}
                  {!isOwnProfile && isAuthenticated && (
                    <Button
                      className={`w-full rounded-full ${isFollowing ? '' : 'btn-glow glow-primary'}`}
                      variant={isFollowing ? 'outline' : 'default'}
                      onClick={handleFollow}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}

                  {isOwnProfile && (
                    <Button variant="outline" className="w-full rounded-full" asChild>
                      <Link to="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit profile
                      </Link>
                    </Button>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
                    <Link
                      to={`/${username}?tab=followers`}
                      className="text-center hover:text-primary transition-colors"
                    >
                      <div className="text-xl font-bold">{profile.followers}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </Link>
                    <Link
                      to={`/${username}?tab=following`}
                      className="text-center hover:text-primary transition-colors"
                    >
                      <div className="text-xl font-bold">{profile.following}</div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </Link>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-500">{totalStars}</div>
                      <div className="text-xs text-muted-foreground">Stars</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info card */}
              <div className="glass rounded-2xl p-4 border border-border/50 mt-4 space-y-3">
                {profile.company && (
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.company}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="glass border border-border/50 rounded-full p-1 h-auto mb-6">
                <TabsTrigger
                  value="overview"
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="repositories"
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                >
                  Repositories
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-muted/50 text-xs">
                    {profile.publicRepos || repositories.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Popular repositories
                  </h2>
                  {repositories.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {repositories.slice(0, 6).map((repo, index) => (
                        <RepoCard key={repo._id} repo={repo} owner={username!} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="glass rounded-2xl border border-dashed border-border/50 p-12 text-center">
                      <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? "You don't have any public repositories yet."
                          : `${profile.name || profile.username} doesn't have any public repositories yet.`}
                      </p>
                      {isOwnProfile && (
                        <Button className="mt-4 btn-glow glow-primary rounded-full" asChild>
                          <Link to="/new">Create your first repository</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="repositories" className="mt-0">
                {repositories.length > 0 ? (
                  <div className="space-y-3">
                    {repositories.map((repo) => (
                      <RepoListItem key={repo._id} repo={repo} owner={username!} />
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-2xl border border-dashed border-border/50 p-12 text-center">
                    <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No repositories found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}

function RepoCard({ repo, owner, index }: { repo: Repository; owner: string; index: number }) {
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
      to={`/${owner}/${repo.name}`}
      className={`group relative overflow-hidden rounded-2xl border border-border/50 p-5 hover-lift bg-gradient-to-br ${gradients[index % gradients.length]}`}
    >
      <div className="absolute inset-0 bg-card/80" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          {repo.visibility === 'private' ? (
            <Lock className="h-4 w-4 text-muted-foreground" />
          ) : (
            <BookOpen className="h-4 w-4 text-primary" />
          )}
          <span className="font-semibold text-primary group-hover:underline">{repo.name}</span>
        </div>
        {repo.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
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
            <Star className="h-3 w-3" />
            {repo.starCount}
          </span>
          <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <GitFork className="h-3 w-3" />
            {repo.forkCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

function RepoListItem({ repo, owner }: { repo: Repository; owner: string }) {
  return (
    <div className="glass rounded-2xl border border-border/50 p-5 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              {repo.visibility === 'private' ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BookOpen className="h-4 w-4 text-primary" />
              )}
            </div>
            <Link
              to={`/${owner}/${repo.name}`}
              className="text-lg font-semibold text-primary hover:underline"
            >
              {repo.name}
            </Link>
            <span className={`text-xs px-2.5 py-0.5 rounded-full ${
              repo.visibility === 'private'
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                : 'bg-green-500/10 text-green-500 border border-green-500/20'
            }`}>
              {repo.visibility}
            </span>
          </div>
          {repo.description && (
            <p className="text-sm text-muted-foreground mb-3 max-w-2xl">
              {repo.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-primary" />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
              <Star className="h-4 w-4" />
              {repo.starCount}
            </span>
            <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
              <GitFork className="h-4 w-4" />
              {repo.forkCount}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Updated {formatDistanceToNow(new Date(repo.pushedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-full hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/50">
          <Star className="h-4 w-4 mr-1" />
          Star
        </Button>
      </div>
    </div>
  );
}

export default Profile;
