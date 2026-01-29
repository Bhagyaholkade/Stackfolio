import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
  GitBranch,
  Code2,
  Users,
  ArrowRight,
  Zap,
  Lock,
  GitFork,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

// 3D Animated Background Component
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const numParticles = 80;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width - canvas.width / 2,
          y: Math.random() * canvas.height - canvas.height / 2,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: -Math.random() * 2 - 1,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const drawParticle = (p: typeof particles[0]) => {
      const perspective = 800;
      const scale = perspective / (perspective + p.z);
      const x2d = p.x * scale + canvas.width / 2;
      const y2d = p.y * scale + canvas.height / 2;
      const size = p.size * scale;
      const alpha = Math.max(0, 1 - p.z / 1000) * 0.6;

      ctx.beginPath();
      ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      ctx.fill();
    };

    const drawConnections = () => {
      const perspective = 800;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 200) {
            const scale1 = perspective / (perspective + p1.z);
            const scale2 = perspective / (perspective + p2.z);
            const x1 = p1.x * scale1 + canvas.width / 2;
            const y1 = p1.y * scale1 + canvas.height / 2;
            const x2 = p2.x * scale2 + canvas.width / 2;
            const y2 = p2.y * scale2 + canvas.height / 2;
            const alpha = (1 - dist / 200) * 0.15;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.z < 1) {
          p.z = 1000;
          p.x = Math.random() * canvas.width - canvas.width / 2;
          p.y = Math.random() * canvas.height - canvas.height / 2;
        }

        if (p.x < -canvas.width / 2) p.x = canvas.width / 2;
        if (p.x > canvas.width / 2) p.x = -canvas.width / 2;
        if (p.y < -canvas.height / 2) p.y = canvas.height / 2;
        if (p.y > canvas.height / 2) p.y = -canvas.height / 2;
      });

      drawConnections();
      particles.forEach(drawParticle);

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10"
      style={{ background: 'transparent' }}
    />
  );
}

export function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <AnimatedBackground />

        {/* Glow Orb */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="container px-4 py-20 relative z-10 w-full">
          <div className="flex flex-col justify-center min-h-[80vh]">
            <div className="space-y-0 text-center md:text-left">
              <h1 className="text-[10vw] md:text-[8vw] font-bold font-heading leading-[0.85] tracking-tighter text-white">
                BUILD
              </h1>
              <h1 className="text-[10vw] md:text-[8vw] font-bold font-heading leading-[0.85] tracking-tighter text-outline-white">
                COLLABORATE
              </h1>
              <h1 className="text-[10vw] md:text-[8vw] font-bold font-heading leading-[0.85] tracking-tighter gradient-text-animated">
                DEPLOY
              </h1>
            </div>

            <div className="mt-20 flex flex-col md:flex-row justify-between items-end gap-12 border-t border-white/10 pt-8">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-primary font-heading">10K+</span>
                <p className="text-xs uppercase max-w-[120px] leading-relaxed text-muted-foreground font-bold tracking-wider">
                  Developers trust Stackfolio
                </p>
              </div>

              <div className="max-w-md text-sm text-balance leading-relaxed text-muted-foreground">
                The modern platform for developers to host, review, and collaborate on code.
                Built for teams who value simplicity and productivity.
              </div>

              {isAuthenticated ? (
                <Button asChild className="rounded-full h-16 px-8 border border-white/20 bg-primary hover:bg-primary/80 hover:scale-105 transition-all group">
                  <Link to="/dashboard">
                    Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:-rotate-45 transition-transform duration-300" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="rounded-full h-16 px-8 border border-white/20 bg-primary hover:bg-primary/80 hover:scale-105 transition-all group">
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:-rotate-45 transition-transform duration-300" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-16">
              <div className="space-y-4">
                <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">Why Stackfolio</p>
                <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter font-heading leading-none">
                  <span className="text-white">Stack</span><span className="text-outline-white text-transparent">folio</span>
                </h3>
              </div>

              <div className="space-y-12">
                {[
                  { label: 'Version Control', text: 'Full Git integration with branches, commits, and complete history tracking for all your projects.' },
                  { label: 'Code Review', text: 'Inline comments, suggestions, and streamlined approval workflows to improve code quality.' },
                  { label: 'Team Collaboration', text: 'Invite team members, manage permissions, and work together seamlessly on any project.' },
                  { label: 'Security', text: 'Enterprise-grade encryption and granular access controls to keep your code safe.' }
                ].map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex items-start gap-8 border-b border-white/10 pb-8 hover:border-primary transition-colors duration-500">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-[0.1em] mb-4 text-white group-hover:text-primary transition-colors">{item.label}</h4>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed group-hover:text-white transition-colors">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Rotating Cube Visual */}
            <div className="relative h-[600px] w-full flex items-center justify-center sticky top-20">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 blur-[120px] rounded-full" />

              {/* 3D Cube */}
              <div className="relative w-64 h-64 md:w-80 md:h-80" style={{ perspective: '1000px' }}>
                <div className="w-full h-full relative animate-spin-slow" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Cube faces */}
                  <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5 backdrop-blur-sm flex items-center justify-center"
                    style={{ transform: 'translateZ(160px)' }}>
                    <GitBranch className="w-16 h-16 text-primary/60" />
                  </div>
                  <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5 backdrop-blur-sm flex items-center justify-center"
                    style={{ transform: 'rotateY(180deg) translateZ(160px)' }}>
                    <Code2 className="w-16 h-16 text-primary/60" />
                  </div>
                  <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5 backdrop-blur-sm flex items-center justify-center"
                    style={{ transform: 'rotateY(90deg) translateZ(160px)' }}>
                    <Users className="w-16 h-16 text-primary/60" />
                  </div>
                  <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5 backdrop-blur-sm flex items-center justify-center"
                    style={{ transform: 'rotateY(-90deg) translateZ(160px)' }}>
                    <Lock className="w-16 h-16 text-primary/60" />
                  </div>
                  <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5 backdrop-blur-sm flex items-center justify-center"
                    style={{ transform: 'rotateX(90deg) translateZ(160px)' }}>
                    <Zap className="w-16 h-16 text-primary/60" />
                  </div>
                  <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5 backdrop-blur-sm flex items-center justify-center"
                    style={{ transform: 'rotateX(-90deg) translateZ(160px)' }}>
                    <GitFork className="w-16 h-16 text-primary/60" />
                  </div>
                </div>
              </div>

              {/* Floating rings */}
              <div className="absolute w-[400px] h-[400px] border border-primary/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
              <div className="absolute w-[500px] h-[500px] border border-primary/10 rounded-full animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black relative">
        <div className="absolute top-0 right-0 p-12 hidden md:block">
          <h2 className="text-8xl font-black text-white/5 uppercase font-heading select-none">Features</h2>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex items-end gap-4 mb-20">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter font-heading text-white">Features</h2>
            <div className="h-px bg-white/20 flex-1 mb-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <GitBranch className="w-12 h-12" />, title: 'Git Version Control', desc: 'Full-featured Git integration with branches, commits, and complete history.' },
              { icon: <Code2 className="w-12 h-12" />, title: 'Code Review', desc: 'Inline comments, suggestions, and approval workflows for better code.' },
              { icon: <Users className="w-12 h-12" />, title: 'Team Collaboration', desc: 'Invite members, manage permissions, and collaborate seamlessly.' }
            ].map((feature, i) => (
              <div key={i} className="group relative p-10 border border-white/10 rounded-sm hover:border-primary/50 transition-all duration-500 bg-card hover:bg-white/5">
                <div className="text-primary mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold uppercase mb-6 tracking-wide font-heading">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xs">{feature.desc}</p>
                <Button variant="link" className="p-0 text-xs uppercase tracking-widest text-white/50 group-hover:text-primary transition-colors">
                  Learn More
                </Button>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              { icon: <Lock className="w-12 h-12" />, title: 'Private Repos', desc: 'Keep your code secure with enterprise-grade private repositories.' },
              { icon: <GitFork className="w-12 h-12" />, title: 'Fork & Contribute', desc: 'Fork projects, make changes, and submit pull requests with ease.' },
              { icon: <Zap className="w-12 h-12" />, title: 'Lightning Fast', desc: 'Optimized for speed with instant deployments and fast cloning.' }
            ].map((feature, i) => (
              <div key={i} className="group relative p-10 border border-white/10 rounded-sm hover:border-primary/50 transition-all duration-500 bg-card hover:bg-white/5">
                <div className="text-primary mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold uppercase mb-6 tracking-wide font-heading">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xs">{feature.desc}</p>
                <Button variant="link" className="p-0 text-xs uppercase tracking-widest text-white/50 group-hover:text-primary transition-colors">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-end gap-4 mb-20">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter font-heading text-white">How It Works</h2>
            <div className="h-px bg-white/20 flex-1 mb-4" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Code Editor Preview */}
            <div className="rounded-lg border border-white/10 bg-card/80 backdrop-blur overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">app.ts</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-1">
                <div><span className="text-purple-400">import</span> <span className="text-cyan-400">{'{ Stackfolio }'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@stackfolio/sdk'</span>;</div>
                <div className="h-4" />
                <div><span className="text-purple-400">const</span> <span className="text-cyan-400">repo</span> = <span className="text-purple-400">await</span> Stackfolio.<span className="text-yellow-400">createRepo</span>{'({'}</div>
                <div className="pl-4"><span className="text-foreground">name</span>: <span className="text-green-400">'my-awesome-project'</span>,</div>
                <div className="pl-4"><span className="text-foreground">visibility</span>: <span className="text-green-400">'public'</span>,</div>
                <div className="pl-4"><span className="text-foreground">description</span>: <span className="text-green-400">'Built with Stackfolio'</span></div>
                <div>{'});'}</div>
                <div className="h-4" />
                <div><span className="text-muted-foreground">// Push and deploy instantly</span></div>
                <div><span className="text-purple-400">await</span> repo.<span className="text-yellow-400">push</span>();</div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Terminal className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold font-heading uppercase text-white">Simple API</h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mt-2">Developer First Platform</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-muted-foreground uppercase text-xs tracking-widest mb-3">Languages</p>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-sm text-muted-foreground mt-1">Supported</p>
                </div>
                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-muted-foreground uppercase text-xs tracking-widest mb-3">Deploy Time</p>
                  <p className="text-3xl font-bold text-primary">&lt; 30s</p>
                  <p className="text-sm text-muted-foreground mt-1">Average</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                Create repositories, push code, and deploy with just a few lines. Our intuitive API makes it easy to integrate Stackfolio into your existing workflow.
              </p>

              {/* CTA Button */}
              <Button asChild className="rounded-full h-14 px-10 bg-primary hover:bg-primary/80 text-white uppercase tracking-widest text-sm transition-all">
                <Link to="/explore">
                  Explore Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-8 animate-pulse">Start Building Today</p>
          <h2 className="text-5xl md:text-9xl font-black uppercase tracking-tighter mb-12 leading-[0.85] font-heading mix-blend-screen">
            Ready to<br />
            <span className="gradient-text-animated">Code?</span>
          </h2>
          <p className="text-muted-foreground mb-16 max-w-md mx-auto leading-relaxed">
            Join thousands of developers who trust Stackfolio to host, review, and deploy their code.
          </p>

          {isAuthenticated ? (
            <Button asChild size="lg" className="rounded-full h-20 px-16 text-lg bg-white text-black hover:bg-primary hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(34,197,94,0.4)]">
              <Link to="/new">Create Repository</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="rounded-full h-20 px-16 text-lg bg-white text-black hover:bg-primary hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(34,197,94,0.4)]">
              <Link to="/register">Get Started Free</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
