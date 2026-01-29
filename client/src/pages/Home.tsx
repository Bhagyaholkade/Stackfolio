import { Link } from 'react-router-dom';
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
  Rocket,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
        </div>

        <div className="container px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Now in Public Beta
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Code collaboration
                <span className="block text-primary">made simple</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                A modern platform for developers to host, review, and collaborate on code.
                Built for teams who value simplicity and productivity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Button size="lg" className="h-12 px-8" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="h-12 px-8" asChild>
                      <Link to="/register">
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                      <Link to="/explore">
                        View Demo
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Trust indicators */}
              <div className="pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Trusted by developers worldwide</p>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">10K+</p>
                    <p className="text-xs text-muted-foreground">Developers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">50K+</p>
                    <p className="text-xs text-muted-foreground">Repositories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">99.9%</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Code Preview */}
            <div className="relative hidden lg:block">
              <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">main.ts</span>
                </div>
                <div className="p-6 font-mono text-sm space-y-1 bg-card">
                  <div><span className="text-purple-400">import</span> <span className="text-foreground">{'{ Repository }'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'stackfolio'</span>;</div>
                  <div className="h-4" />
                  <div><span className="text-purple-400">const</span> <span className="text-cyan-400">repo</span> = <span className="text-purple-400">await</span> Repository.<span className="text-yellow-400">create</span>{'({'}</div>
                  <div className="pl-4"><span className="text-foreground">name</span>: <span className="text-green-400">'my-project'</span>,</div>
                  <div className="pl-4"><span className="text-foreground">visibility</span>: <span className="text-green-400">'public'</span>,</div>
                  <div className="pl-4"><span className="text-foreground">description</span>: <span className="text-green-400">'Built with Stackfolio'</span></div>
                  <div>{'});'}</div>
                  <div className="h-4" />
                  <div><span className="text-muted-foreground">// Deploy with one command</span></div>
                  <div><span className="text-purple-400">await</span> repo.<span className="text-yellow-400">deploy</span>();</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-xl bg-primary/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to build
            </h2>
            <p className="text-muted-foreground text-lg">
              Powerful features for modern development workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<GitBranch className="w-6 h-6" />}
              title="Git Version Control"
              description="Full Git support with branches, commits, and complete history tracking"
            />
            <FeatureCard
              icon={<Code2 className="w-6 h-6" />}
              title="Code Review"
              description="Inline comments, suggestions, and streamlined approval workflows"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Team Collaboration"
              description="Invite team members, manage permissions, and work together"
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Private Repos"
              description="Keep your code secure with private repositories"
            />
            <FeatureCard
              icon={<GitFork className="w-6 h-6" />}
              title="Fork & Contribute"
              description="Fork projects and submit pull requests with ease"
            />
            <FeatureCard
              icon={<Database className="w-6 h-6" />}
              title="Unlimited Storage"
              description="No limits on repository size or number of projects"
            />
          </div>
        </div>
      </section>

      {/* Why Stackfolio Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Built for developers, by developers
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Experience the next generation of code collaboration with real-time editing,
                intelligent code review, and seamless Git integration.
              </p>

              <div className="space-y-4 pt-4">
                <FeatureRow
                  icon={<GitBranch className="w-5 h-5" />}
                  title="Real Git Integration"
                  description="Full Git support with branches, commits, and merge requests"
                />
                <FeatureRow
                  icon={<Shield className="w-5 h-5" />}
                  title="Enterprise Security"
                  description="Bank-grade encryption and granular access controls"
                />
                <FeatureRow
                  icon={<Zap className="w-5 h-5" />}
                  title="Lightning Fast"
                  description="Optimized for speed and performance"
                />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">stackfolio.config.ts</span>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deploy Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-xl border border-border bg-card shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Deploy Pipeline</p>
                      <p className="text-xs text-muted-foreground">my-awesome-project</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <DeployStep title="Build" status="complete" time="23s" />
                  <DeployStep title="Deploy to Edge" status="complete" time="8s" />
                  <DeployStep title="Assign Domain" status="complete" time="2s" />
                  <DeployStep title="Ready" status="active" time="Live" />
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Production</p>
                        <p className="text-sm font-mono">my-project.stackfolio.app</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Deploy in seconds, not hours
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Push your code and watch it go live instantly. Automatic builds, edge deployment,
                and instant rollbacks built into your workflow.
              </p>

              <div className="space-y-4 pt-4">
                <FeatureRow
                  icon={<Globe className="w-5 h-5" />}
                  title="Edge Network"
                  description="Deploy to edge locations worldwide"
                />
                <FeatureRow
                  icon={<Star className="w-5 h-5" />}
                  title="Instant Previews"
                  description="Every PR gets a unique preview URL"
                />
                <FeatureRow
                  icon={<Zap className="w-5 h-5" />}
                  title="Auto Rollbacks"
                  description="One-click rollback to any previous deployment"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to start building?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of developers who are already using Stackfolio
              to build and ship amazing software.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link to="/register">
                  Create Free Account
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link to="/explore">
                  Explore Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

// Feature Row Component
function FeatureRow({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Code Line Component
function CodeLine({ num, children, indent = 0 }: { num: number; children?: React.ReactNode; indent?: number }) {
  return (
    <div className="flex">
      <span className="text-muted-foreground/50 w-8 text-right mr-4 select-none text-xs">{num}</span>
      <span style={{ paddingLeft: `${indent}rem` }}>{children}</span>
    </div>
  );
}

// Deploy Step Component
function DeployStep({ title, status, time }: { title: string; status: 'complete' | 'active' | 'pending'; time: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${
      status === 'active' ? 'bg-green-500/10' : 'bg-muted/30'
    }`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        status === 'complete' ? 'bg-green-500/20 text-green-600' :
        status === 'active' ? 'bg-green-500 text-white' :
        'bg-muted text-muted-foreground'
      }`}>
        {status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{status === 'active' ? '✓' : '○'}</span>}
      </div>
      <span className={`flex-1 text-sm ${status === 'active' ? 'font-medium text-green-600' : ''}`}>{title}</span>
      <span className={`text-xs ${status === 'active' ? 'text-green-600' : 'text-muted-foreground'}`}>{time}</span>
    </div>
  );
}

export default Home;
