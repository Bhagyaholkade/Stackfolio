import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  GitBranch,
  Code2,
  Users,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  GitFork,
  Lock,
  Database,
  ChevronRight,
  Cpu,
  Rocket,
  Cloud,
  CheckCircle2,
  Timer,
  RefreshCw,
  Server,
  Box,
  Play,
  Heart,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Upload,
  FileCode,
  FolderUp,
  FileJson,
  FileText,
  Folder,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Stunning Background */}
        <div className="absolute inset-0 -z-10">
          {/* Rich gradient base */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0f23] to-[#0a0a1a]" />

          {/* Animated mesh gradient */}
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
          </div>

          {/* Dot pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Main Hero Content */}
        <div className="container relative z-10 px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Animated Badge */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark border border-primary/20 mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">The future of code collaboration</span>
              </div>
            </div>

            {/* Main Heading with 3D Effect */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                <span className="block text-foreground">Where code</span>
                <span className="block mt-2">
                  <span className="gradient-text-animated font-extrabold">comes alive</span>
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                The developer-first platform for hosting, reviewing, and collaborating on code.
                Build something extraordinary.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                {isAuthenticated ? (
                  <Button size="lg" className="btn-3d h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 group shadow-lg shadow-primary/25" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="btn-3d h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 group shadow-lg shadow-primary/25" asChild>
                      <Link to="/register">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full glass-dark border-border/30 hover:bg-white/5 hover:border-primary/30 transition-all" asChild>
                      <Link to="/explore">
                        Explore Projects
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <StatBadge icon={<Users className="w-4 h-4" />} value="10K+" label="Developers" />
                <StatBadge icon={<GitBranch className="w-4 h-4" />} value="50K+" label="Repositories" />
                <StatBadge icon={<Star className="w-4 h-4" />} value="1M+" label="Stars Given" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Code Preview Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-[#0a0a1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Text Content */}
            <div className="space-y-8 stagger-children">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium">
                <Cpu className="w-4 h-4" />
                Powerful Features
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Built for developers,
                <span className="block text-cyan-400 mt-2">by developers</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Experience the next generation of code collaboration with real-time editing,
                intelligent code review, and seamless Git integration.
              </p>

              <div className="space-y-5 pt-4">
                <FeatureRow
                  icon={<GitBranch className="w-5 h-5" />}
                  title="Real Git Integration"
                  description="Full Git support with branches, commits, and merge requests"
                  color="text-primary"
                  bg="bg-primary/10"
                />
                <FeatureRow
                  icon={<Shield className="w-5 h-5" />}
                  title="Enterprise Security"
                  description="Bank-grade encryption and granular access controls"
                  color="text-cyan-400"
                  bg="bg-cyan-500/10"
                />
                <FeatureRow
                  icon={<Zap className="w-5 h-5" />}
                  title="Lightning Fast"
                  description="Optimized for speed and blazing performance"
                  color="text-yellow-400"
                  bg="bg-yellow-500/10"
                />
              </div>
            </div>

            {/* Code Block */}
            <div className="perspective-deep">
              <Interactive3DCard>
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-60" />
                  <div className="relative code-block rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0d0d1a]/90 backdrop-blur-sm">
                    {/* Window Header */}
                    <div className="code-block-header flex items-center justify-between px-5 py-4">
                      <div className="code-block-dots">
                        <div className="code-block-dot bg-red-500" />
                        <div className="code-block-dot bg-yellow-500" />
                        <div className="code-block-dot bg-green-500" />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">stackfolio.config.ts</span>
                      <div className="w-16" />
                    </div>

                    {/* Code Content */}
                    <div className="p-6 font-mono text-sm leading-loose">
                      <CodeLine num={1}><span className="text-purple-400">import</span> <span className="text-cyan-400">{'{ Stackfolio }'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@stackfolio/sdk'</span>;</CodeLine>
                      <CodeLine num={2}><span></span></CodeLine>
                      <CodeLine num={3}><span className="text-purple-400">const</span> <span className="text-cyan-400">config</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">Stackfolio</span>{'({'}</CodeLine>
                      <CodeLine num={4} indent={1}><span className="text-cyan-400">name</span>: <span className="text-green-400">'my-project'</span>,</CodeLine>
                      <CodeLine num={5} indent={1}><span className="text-cyan-400">version</span>: <span className="text-green-400">'2.0.0'</span>,</CodeLine>
                      <CodeLine num={6} indent={1}><span className="text-cyan-400">features</span>: [</CodeLine>
                      <CodeLine num={7} indent={2}><span className="text-green-400">'git-integration'</span>,</CodeLine>
                      <CodeLine num={8} indent={2}><span className="text-green-400">'code-review'</span>,</CodeLine>
                      <CodeLine num={9} indent={2}><span className="text-green-400">'ci-cd'</span></CodeLine>
                      <CodeLine num={10} indent={1}>]</CodeLine>
                      <CodeLine num={11}>{'});'}</CodeLine>
                      <CodeLine num={12}><span></span></CodeLine>
                      <CodeLine num={13}><span className="text-purple-400">await</span> config.<span className="text-yellow-400">deploy</span>(); <span className="text-muted-foreground/60">// 🚀 Ship it!</span></CodeLine>
                    </div>
                  </div>
                </div>
              </Interactive3DCard>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Code Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-[#080810]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.08),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-8 stagger-children">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
                <Upload className="w-4 h-4" />
                Easy Upload
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Upload your code,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mt-2">your way</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Drag and drop files, upload entire folders, or paste code directly.
                We support all major file formats and make it incredibly easy to get your code into Stackfolio.
              </p>

              <div className="space-y-5 pt-4">
                <FeatureRow
                  icon={<FolderUp className="w-5 h-5" />}
                  title="Drag & Drop Folders"
                  description="Upload entire project folders with a single drag and drop"
                  color="text-blue-400"
                  bg="bg-blue-500/10"
                />
                <FeatureRow
                  icon={<FileCode className="w-5 h-5" />}
                  title="Multiple File Types"
                  description="Support for 50+ programming languages and file formats"
                  color="text-purple-400"
                  bg="bg-purple-500/10"
                />
                <FeatureRow
                  icon={<Zap className="w-5 h-5" />}
                  title="Instant Processing"
                  description="Your files are processed and ready in seconds"
                  color="text-amber-400"
                  bg="bg-amber-500/10"
                />
              </div>
            </div>

            {/* Right - Upload UI Preview */}
            <div className="perspective-deep">
              <Interactive3DCard>
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-60" />

                  {/* Main Upload Card */}
                  <div className="relative rounded-2xl p-8 border border-white/10 shadow-2xl bg-[#0d0d1a]/90 backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">Upload Files</p>
                          <p className="text-xs text-muted-foreground">Add your code</p>
                        </div>
                      </div>
                    </div>

                    {/* Drop Zone */}
                    <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-8 text-center bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all cursor-pointer group mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FolderUp className="w-8 h-8 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Drop files here or click to upload</p>
                      <p className="text-xs text-muted-foreground">Supports: .js, .ts, .py, .java, .go, .rs and 50+ more</p>
                    </div>

                    {/* File List Preview */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Recently Added</p>

                      <FileItem icon={<FileCode className="w-4 h-4" />} name="index.tsx" size="4.2 KB" color="text-blue-400" />
                      <FileItem icon={<FileJson className="w-4 h-4" />} name="package.json" size="1.8 KB" color="text-yellow-400" />
                      <FileItem icon={<FileText className="w-4 h-4" />} name="README.md" size="2.1 KB" color="text-gray-400" />
                      <FileItem icon={<Folder className="w-4 h-4" />} name="src/" size="12 files" color="text-purple-400" isFolder />
                    </div>

                    {/* Upload Progress */}
                    <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-emerald-400">Upload Complete!</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="w-full h-2 rounded-full bg-emerald-500/20 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </Interactive3DCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d0d20] to-[#0a0a1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto mb-20 stagger-children">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Everything You Need
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              One platform,
              <span className="gradient-text block mt-2">endless possibilities</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From solo developers to enterprise teams, Stackfolio provides all the tools
              you need to build, collaborate, and ship faster.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            <Feature3DCard
              icon={<GitBranch className="w-7 h-7" />}
              title="Git Version Control"
              description="Full-featured Git integration with branches, commits, and complete history"
              gradient="from-green-500/20 to-emerald-500/20"
              iconBg="bg-gradient-to-br from-green-500/20 to-green-600/20"
              iconColor="text-green-400"
              borderColor="border-green-500/20"
            />
            <Feature3DCard
              icon={<Code2 className="w-7 h-7" />}
              title="Code Review"
              description="Inline comments, suggestions, and streamlined approval workflows"
              gradient="from-blue-500/20 to-cyan-500/20"
              iconBg="bg-gradient-to-br from-blue-500/20 to-blue-600/20"
              iconColor="text-blue-400"
              borderColor="border-blue-500/20"
            />
            <Feature3DCard
              icon={<Users className="w-7 h-7" />}
              title="Team Collaboration"
              description="Invite team members, manage permissions, and work together seamlessly"
              gradient="from-purple-500/20 to-pink-500/20"
              iconBg="bg-gradient-to-br from-purple-500/20 to-purple-600/20"
              iconColor="text-purple-400"
              borderColor="border-purple-500/20"
            />
            <Feature3DCard
              icon={<Lock className="w-7 h-7" />}
              title="Private Repos"
              description="Keep your code secure with enterprise-grade private repositories"
              gradient="from-yellow-500/20 to-orange-500/20"
              iconBg="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20"
              iconColor="text-yellow-400"
              borderColor="border-yellow-500/20"
            />
            <Feature3DCard
              icon={<GitFork className="w-7 h-7" />}
              title="Fork & Contribute"
              description="Fork projects, make changes, and submit pull requests with ease"
              gradient="from-cyan-500/20 to-teal-500/20"
              iconBg="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20"
              iconColor="text-cyan-400"
              borderColor="border-cyan-500/20"
            />
            <Feature3DCard
              icon={<Database className="w-7 h-7" />}
              title="Unlimited Storage"
              description="No limits on repository size, files, or number of projects"
              gradient="from-red-500/20 to-rose-500/20"
              iconBg="bg-gradient-to-br from-red-500/20 to-red-600/20"
              iconColor="text-red-400"
              borderColor="border-red-500/20"
            />
          </div>
        </div>
      </section>

      {/* Deploy Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-[#0a0a1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,146,60,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.08),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Deploy Animation */}
            <div className="order-2 lg:order-1 perspective-deep">
              <Interactive3DCard>
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 via-pink-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-60" />
                  {/* Main card */}
                  <div className="relative rounded-2xl p-8 border border-white/10 shadow-2xl bg-[#0d0d1a]/90 backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">Deploy Pipeline</p>
                          <p className="text-xs text-muted-foreground">my-awesome-project</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-400 font-medium">Live</span>
                      </div>
                    </div>

                    {/* Deploy Steps */}
                    <div className="space-y-4 mb-8">
                      <DeployStep
                        icon={<Box className="w-4 h-4" />}
                        title="Build"
                        status="complete"
                        time="23s"
                      />
                      <DeployStep
                        icon={<Server className="w-4 h-4" />}
                        title="Deploy to Edge"
                        status="complete"
                        time="8s"
                      />
                      <DeployStep
                        icon={<Globe className="w-4 h-4" />}
                        title="Assign Domain"
                        status="complete"
                        time="2s"
                      />
                      <DeployStep
                        icon={<CheckCircle2 className="w-4 h-4" />}
                        title="Ready"
                        status="active"
                        time="Live"
                      />
                    </div>

                    {/* URL Preview */}
                    <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Production</p>
                            <p className="text-sm font-mono text-foreground">my-project.stackfolio.app</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 px-3 text-xs hover:bg-white/5">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Visit
                        </Button>
                      </div>
                    </div>

                    {/* Floating badges around the card */}
                    <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold shadow-lg animate-bounce-subtle">
                      33s deploy
                    </div>
                  </div>
                </div>
              </Interactive3DCard>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 space-y-8 stagger-children">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium">
                <Rocket className="w-4 h-4" />
                One-Click Deploy
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Deploy in seconds,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 mt-2">not hours</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Push your code and watch it go live instantly. Automatic builds, edge deployment,
                and instant rollbacks - just like Vercel and Render, but built into your workflow.
              </p>

              <div className="space-y-5 pt-4">
                <FeatureRow
                  icon={<Cloud className="w-5 h-5" />}
                  title="Edge Network"
                  description="Deploy to 100+ edge locations worldwide for blazing speed"
                  color="text-orange-400"
                  bg="bg-orange-500/10"
                />
                <FeatureRow
                  icon={<Timer className="w-5 h-5" />}
                  title="Instant Previews"
                  description="Every PR gets a unique preview URL automatically"
                  color="text-pink-400"
                  bg="bg-pink-500/10"
                />
                <FeatureRow
                  icon={<RefreshCw className="w-5 h-5" />}
                  title="Auto Rollbacks"
                  description="One-click rollback to any previous deployment"
                  color="text-purple-400"
                  bg="bg-purple-500/10"
                />
              </div>

              {/* Platform integrations */}
              <div className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">Seamless integration with:</p>
                <div className="flex flex-wrap gap-3">
                  <IntegrationBadge name="Vercel" color="from-black to-gray-800" />
                  <IntegrationBadge name="Netlify" color="from-teal-500 to-cyan-500" />
                  <IntegrationBadge name="Railway" color="from-purple-500 to-indigo-500" />
                  <IntegrationBadge name="Render" color="from-emerald-500 to-green-500" />
                  <IntegrationBadge name="AWS" color="from-orange-500 to-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Deploy Works Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] to-[#0d0d1f]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              From push to production in <span className="text-orange-400">3 steps</span>
            </h2>
            <p className="text-muted-foreground">
              No complex configuration. No DevOps expertise required. Just push and deploy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <DeployStepCard
              step={1}
              icon={<GitBranch className="w-8 h-8" />}
              title="Push Your Code"
              description="Push to your repository. That's it. Every push triggers an automatic build."
              color="from-blue-500 to-cyan-500"
            />
            <DeployStepCard
              step={2}
              icon={<Play className="w-8 h-8" />}
              title="Auto Build & Test"
              description="We detect your framework, install dependencies, and run your build automatically."
              color="from-orange-500 to-pink-500"
            />
            <DeployStepCard
              step={3}
              icon={<Rocket className="w-8 h-8" />}
              title="Go Live Globally"
              description="Your app is deployed to our edge network. SSL, CDN, and custom domains included."
              color="from-green-500 to-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-[#0d0d1f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="container relative">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl p-10 sm:p-16 overflow-hidden">
              {/* Card gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl" />
              <div className="absolute inset-0 border border-white/10 rounded-3xl" />

              <div className="relative text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  Ready to start building?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                  Join thousands of developers who are already using Stackfolio
                  to build and ship amazing software.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="btn-3d h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 group shadow-lg shadow-primary/25" asChild>
                    <Link to="/register">
                      Create Free Account
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="ghost" className="h-14 px-8 text-lg rounded-full hover:bg-white/5" asChild>
                    <Link to="/explore">
                      Explore Projects
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden">
        {/* Footer Background */}
        <div className="absolute inset-0 bg-[#050508]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Main Footer Content */}
        <div className="container relative py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-cyan-500">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Stackfolio</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                The next-generation platform for developers to host, review, and deploy code with style.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group">
                  <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a href="#" className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all group">
                  <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                </a>
                <a href="#" className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group">
                  <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                </a>
                <a href="#" className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/50 transition-all group">
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-pink-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Product
              </h4>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/enterprise" className="text-sm text-muted-foreground hover:text-primary transition-colors">Enterprise</Link></li>
                <li><Link to="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
                <li><Link to="/changelog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Changelog</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Resources
              </h4>
              <ul className="space-y-3">
                <li><Link to="/docs" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">Documentation</Link></li>
                <li><Link to="/api" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">API Reference</Link></li>
                <li><Link to="/guides" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">Guides</Link></li>
                <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">Blog</Link></li>
                <li><Link to="/community" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">Community</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Company
              </h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Bottom Footer - Built by Bhagya */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} Stackfolio. All rights reserved.</span>
            </div>

            {/* Built by Bhagya - Stylish Badge */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0a0a1a] border border-white/10 group-hover:border-white/20 transition-all">
                <span className="text-sm text-muted-foreground">Crafted with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">by</span>
                <span className="font-semibold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Bhagya
                </span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/status" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Gradient */}
        <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
      </footer>
    </div>
  );
}

// Stat Badge Component
function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-full glass-dark border border-border/20 hover:border-primary/30 transition-colors">
      <div className="text-primary">{icon}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold text-foreground stats-number">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

// Interactive 3D Card with mouse tracking
function Interactive3DCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('rotateY(0deg) rotateX(0deg)');

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      setTransform(`rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`);
    };

    const handleMouseLeave = () => {
      setTransform('rotateY(0deg) rotateX(0deg) scale(1)');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="transform-3d transition-transform duration-200 ease-out"
      style={{ transform }}
    >
      {children}
    </div>
  );
}

// Feature Row Component
function FeatureRow({ icon, title, description, color, bg }: { icon: React.ReactNode; title: string; description: string; color: string; bg: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/20 transition-colors group cursor-default">
      <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Code Line Component
function CodeLine({ num, children, indent = 0 }: { num: number; children?: React.ReactNode; indent?: number }) {
  return (
    <div className="flex">
      <span className="text-muted-foreground/40 w-10 text-right mr-6 select-none text-xs">{num}</span>
      <span style={{ paddingLeft: `${indent * 1.25}rem` }}>{children}</span>
    </div>
  );
}

// Feature 3D Card Component
function Feature3DCard({
  icon,
  title,
  description,
  gradient,
  iconBg,
  iconColor,
  borderColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${borderColor} p-6 hover-3d card-shine bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 bg-card/90" />
      <div className="relative">
        <div className={`inline-flex p-3.5 rounded-xl ${iconBg} ${iconColor} mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Deploy Step Component
function DeployStep({
  icon,
  title,
  status,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  status: 'complete' | 'active' | 'pending';
  time: string;
}) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
      status === 'active' ? 'bg-green-500/10 border border-green-500/30' :
      status === 'complete' ? 'bg-white/5' : 'opacity-50'
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        status === 'complete' ? 'bg-green-500/20 text-green-400' :
        status === 'active' ? 'bg-green-500 text-white animate-pulse' :
        'bg-muted text-muted-foreground'
      }`}>
        {status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${status === 'active' ? 'text-green-400' : ''}`}>{title}</p>
      </div>
      <span className={`text-xs font-mono ${
        status === 'active' ? 'text-green-400' : 'text-muted-foreground'
      }`}>{time}</span>
    </div>
  );
}

// Integration Badge Component
function IntegrationBadge({ name, color }: { name: string; color: string }) {
  return (
    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white text-sm font-medium shadow-lg hover:scale-105 transition-transform cursor-default`}>
      {name}
    </div>
  );
}

// Deploy Step Card Component
function DeployStepCard({
  step,
  icon,
  title,
  description,
  color,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="group relative">
      {/* Connector line for non-last items */}
      {step < 3 && (
        <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -translate-y-1/2 z-0" />
      )}

      <div className="relative glass rounded-2xl p-8 border border-border/30 hover-lift text-center">
        {/* Step number */}
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
          {step}
        </div>

        {/* Icon */}
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${color} text-white mb-6 mt-4 group-hover:scale-110 transition-transform shadow-xl`}>
          {icon}
        </div>

        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// File Item Component
function FileItem({
  icon,
  name,
  size,
  color,
  isFolder = false,
}: {
  icon: React.ReactNode;
  name: string;
  size: string;
  color: string;
  isFolder?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{isFolder ? size : size}</p>
      </div>
      <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

export default Home;
