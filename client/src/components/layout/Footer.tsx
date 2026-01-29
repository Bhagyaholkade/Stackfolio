import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitBranch className="h-4 w-4" />
          <span>&copy; {new Date().getFullYear()} Stackfolio. All rights reserved.</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Crafted by <span className="text-primary font-medium">Bhagya</span>
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/docs" className="hover:text-foreground transition-colors">
            Documentation
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
