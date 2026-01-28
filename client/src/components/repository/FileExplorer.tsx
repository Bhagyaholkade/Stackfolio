import { Link } from 'react-router-dom';
import { Folder, File, ChevronRight } from 'lucide-react';
import { FileEntry } from '@/types';

interface FileExplorerProps {
  files: FileEntry[];
  owner: string;
  repo: string;
  branch: string;
  currentPath: string;
}

export function FileExplorer({
  files,
  owner,
  repo,
  branch,
  currentPath,
}: FileExplorerProps) {
  // Build breadcrumb paths
  const pathParts = currentPath ? currentPath.split('/').filter(Boolean) : [];

  return (
    <div className="rounded-lg border">
      {/* Breadcrumb */}
      {currentPath && (
        <div className="flex items-center gap-1 border-b px-4 py-2 text-sm">
          <Link
            to={`/${owner}/${repo}`}
            className="text-primary hover:underline"
          >
            {repo}
          </Link>
          {pathParts.map((part, index) => {
            const path = pathParts.slice(0, index + 1).join('/');
            const isLast = index === pathParts.length - 1;

            return (
              <span key={path} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {isLast ? (
                  <span className="font-medium">{part}</span>
                ) : (
                  <Link
                    to={`/${owner}/${repo}/tree/${branch}/${path}`}
                    className="text-primary hover:underline"
                  >
                    {part}
                  </Link>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* File List */}
      <div className="divide-y">
        {/* Go up directory */}
        {currentPath && (
          <Link
            to={
              pathParts.length > 1
                ? `/${owner}/${repo}/tree/${branch}/${pathParts.slice(0, -1).join('/')}`
                : `/${owner}/${repo}`
            }
            className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50"
          >
            <span className="text-muted-foreground">..</span>
          </Link>
        )}

        {files.map((file) => {
          const isDir = file.type === 'dir';
          const linkPath = isDir
            ? `/${owner}/${repo}/tree/${branch}/${file.path}`
            : `/${owner}/${repo}/blob/${branch}/${file.path}`;

          return (
            <Link
              key={file.path}
              to={linkPath}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50"
            >
              {isDir ? (
                <Folder className="h-5 w-5 text-primary" />
              ) : (
                <File className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={isDir ? 'text-primary' : ''}>{file.name}</span>
            </Link>
          );
        })}

        {files.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            This directory is empty
          </div>
        )}
      </div>
    </div>
  );
}

export default FileExplorer;
