import { GitBranch, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Branch } from '@/types';

interface BranchSelectorProps {
  branches: Branch[];
  currentBranch: string;
  onBranchChange: (branch: string) => void;
}

export function BranchSelector({
  branches,
  currentBranch,
  onBranchChange,
}: BranchSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <GitBranch className="h-4 w-4" />
          {currentBranch}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <div className="px-2 py-1.5 text-sm font-semibold">
          Switch branches
        </div>
        <div className="max-h-64 overflow-y-auto">
          {branches.map((branch) => (
            <DropdownMenuItem
              key={branch.name}
              onClick={() => onBranchChange(branch.name)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                {branch.name}
                {branch.isDefault && (
                  <span className="text-xs text-muted-foreground">(default)</span>
                )}
              </span>
              {branch.name === currentBranch && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default BranchSelector;
