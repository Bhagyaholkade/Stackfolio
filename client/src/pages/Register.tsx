import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitBranch, Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Rocket, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

export function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setValidationError('');
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    // Validate username
    if (formData.username.length < 3) {
      setValidationError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(formData.username)) {
      setValidationError(
        'Username can only contain alphanumeric characters and hyphens'
      );
      return;
    }

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.name || undefined
      );
      navigate('/');
    } catch {
      // Error is handled by the store
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-500/20 via-primary/20 to-purple-500/20">
        {/* Animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <GitBranch className="h-12 w-12 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 blur-xl bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-3xl font-bold gradient-text">Stackfolio</span>
            </Link>
            <h1 className="text-4xl font-bold mb-4">
              Start your developer
              <span className="block gradient-text">journey today</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Join thousands of developers building and sharing amazing projects on Stackfolio.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 glass rounded-xl p-4 border border-border/50 hover-lift">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Rocket className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Free Forever</p>
                <p className="text-sm text-muted-foreground">Unlimited public repositories</p>
              </div>
            </div>
            <div className="flex items-center gap-3 glass rounded-xl p-4 border border-border/50 hover-lift">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Secure & Private</p>
                <p className="text-sm text-muted-foreground">Your code is safe with us</p>
              </div>
            </div>
            <div className="flex items-center gap-3 glass rounded-xl p-4 border border-border/50 hover-lift">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Lightning Fast</p>
                <p className="text-sm text-muted-foreground">Built for performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-y-auto">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-green-500/5" />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <GitBranch className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold gradient-text">Stackfolio</span>
            </Link>
          </div>

          <div className="glass rounded-3xl p-8 border border-border/50 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm mb-4">
                  <Sparkles className="h-4 w-4" />
                  Join us
                </div>
                <h2 className="text-2xl font-bold mb-2">Create your account</h2>
                <p className="text-muted-foreground">
                  Start building something amazing
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {displayError && (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-2 animate-in fade-in-0 zoom-in-95">
                    <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    {displayError}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'username' ? 'scale-[1.02]' : ''}`}>
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium transition-colors ${focusedField === 'username' ? 'text-primary' : 'text-muted-foreground'}`}>@</span>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      required
                      autoComplete="username"
                      className="pl-9 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">This will be your public profile URL</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Name <span className="text-muted-foreground">(optional)</span></Label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="name"
                      className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      autoComplete="email"
                      className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      autoComplete="new-password"
                      className="pl-10 pr-12 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-primary/10 rounded-lg"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-[1.02]' : ''}`}>
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'confirmPassword' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      required
                      autoComplete="new-password"
                      className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-base font-semibold group shadow-lg shadow-green-500/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create account
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
