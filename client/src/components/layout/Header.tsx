import { Link, useNavigate } from 'react-router-dom';
import {
  GitBranch,
  Search,
  Plus,
  Bell,
  ChevronDown,
  User,
  BookOpen,
  Star,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo with glow effect */}
          <Link to="/" className="group flex items-center gap-2.5 hover-glow rounded-lg px-2 py-1 transition-all duration-300">
            <div className="relative">
              <GitBranch className="h-8 w-8 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold hidden sm:inline gradient-text">Stackfolio</span>
          </Link>

          {/* Animated search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
              <Input
                type="search"
                placeholder="Search repositories..."
                className={`w-72 pl-10 h-10 bg-muted/50 border-border/50 rounded-full transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 ${isSearchFocused ? 'shadow-lg shadow-primary/10' : ''}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {searchQuery && (
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  ↵
                </kbd>
              )}
            </div>
          </form>
        </div>

        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notification bell with pulse animation */}
              <Button variant="ghost" size="icon" className="hidden sm:flex relative hover:bg-primary/10 hover:text-primary transition-colors rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
              </Button>

              {/* Create new dropdown with hover effect */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors rounded-full px-3">
                    <Plus className="h-4 w-4" />
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-border/50 animate-in fade-in-0 zoom-in-95">
                  <DropdownMenuItem onClick={() => navigate('/new')} className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    New repository
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2 hover:bg-primary/10 transition-colors rounded-full">
                    <div className="relative">
                      <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/50 transition-all">
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600/80 text-white font-semibold">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 glass border-border/50 animate-in fade-in-0 zoom-in-95">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600/80 text-white">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold">{user?.name || user?.username}</p>
                        <p className="text-xs text-muted-foreground">@{user?.username}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={() => navigate(`/${user?.username}`)} className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 mx-1 rounded-md">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    Your profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/${user?.username}?tab=repositories`)} className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 mx-1 rounded-md">
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                    Your repositories
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/${user?.username}?tab=stars`)} className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 mx-1 rounded-md">
                    <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                    Your stars
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 mx-1 rounded-md">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive mx-1 rounded-md mb-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild className="btn-glow glow-primary rounded-full px-6">
                <Link to="/register">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
