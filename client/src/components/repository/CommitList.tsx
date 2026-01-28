import { GitCommit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Commit } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CommitListProps {
  commits: Commit[];
}

export function CommitList({ commits }: CommitListProps) {
  const handleCopyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
  };

  return (
    <div className="rounded-lg border divide-y">
      {commits.map((commit) => {
        const shortHash = commit.oid.substring(0, 7);
        const [title, ...bodyParts] = commit.message.split('\n');
        const date = new Date(commit.author.timestamp * 1000);

        return (
          <div key={commit.oid} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <Avatar className="h-8 w-8 mt-0.5">
                  <AvatarFallback>
                    {commit.author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium truncate">{title}</p>
                  {bodyParts.length > 0 && bodyParts.some(p => p.trim()) && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {bodyParts.join('\n').trim()}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <span>{commit.author.name}</span>
                    <span>committed</span>
                    <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm font-mono">
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  {shortHash}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopyHash(commit.oid)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {commits.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No commits yet
        </div>
      )}
    </div>
  );
}

export default CommitList;
