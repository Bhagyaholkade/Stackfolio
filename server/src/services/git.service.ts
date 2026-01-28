import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';
import { REPO_BASE_PATH, DEFAULT_BRANCH } from '../utils/constants.js';

interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'dir';
  oid?: string;
  size?: number;
}

interface CommitInfo {
  oid: string;
  message: string;
  author: {
    name: string;
    email: string;
    timestamp: number;
  };
  committer: {
    name: string;
    email: string;
    timestamp: number;
  };
  parent: string[];
}

interface BranchInfo {
  name: string;
  commit: string;
  isDefault: boolean;
}

class GitService {
  private getRepoPath(owner: string, repoName: string): string {
    return path.join(REPO_BASE_PATH, owner, `${repoName}.git`);
  }

  async initRepository(
    owner: string,
    repoName: string,
    defaultBranch: string = DEFAULT_BRANCH,
    readmeContent?: string,
    gitignoreContent?: string,
    licenseContent?: string
  ): Promise<void> {
    const repoPath = this.getRepoPath(owner, repoName);

    // Create directory
    await fs.promises.mkdir(repoPath, { recursive: true });

    // Initialize bare repository
    await git.init({ fs, dir: repoPath, defaultBranch });

    // Create initial files if provided
    const filesToAdd: { path: string; content: string }[] = [];

    if (readmeContent) {
      filesToAdd.push({ path: 'README.md', content: readmeContent });
    }

    if (gitignoreContent) {
      filesToAdd.push({ path: '.gitignore', content: gitignoreContent });
    }

    if (licenseContent) {
      filesToAdd.push({ path: 'LICENSE', content: licenseContent });
    }

    if (filesToAdd.length > 0) {
      // Write files
      for (const file of filesToAdd) {
        const filePath = path.join(repoPath, file.path);
        await fs.promises.writeFile(filePath, file.content, 'utf-8');
        await git.add({ fs, dir: repoPath, filepath: file.path });
      }

      // Create initial commit
      await git.commit({
        fs,
        dir: repoPath,
        message: 'Initial commit',
        author: {
          name: owner,
          email: `${owner}@stackfolio.local`,
        },
      });
    }
  }

  async deleteRepository(owner: string, repoName: string): Promise<void> {
    const repoPath = this.getRepoPath(owner, repoName);
    await fs.promises.rm(repoPath, { recursive: true, force: true });
  }

  async getFileTree(
    owner: string,
    repoName: string,
    branch: string = DEFAULT_BRANCH,
    dirPath: string = ''
  ): Promise<FileEntry[]> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      // Get the commit SHA for the branch
      const commitOid = await git.resolveRef({
        fs,
        dir: repoPath,
        ref: branch,
      });

      // Get the tree
      const { tree } = await git.readTree({
        fs,
        dir: repoPath,
        oid: commitOid,
        filepath: dirPath || undefined,
      });

      const entries: FileEntry[] = [];

      for (const entry of tree) {
        entries.push({
          name: entry.path,
          path: dirPath ? `${dirPath}/${entry.path}` : entry.path,
          type: entry.type === 'tree' ? 'dir' : 'file',
          oid: entry.oid,
        });
      }

      // Sort: directories first, then files, alphabetically
      entries.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'dir' ? -1 : 1;
      });

      return entries;
    } catch (error) {
      console.error('Error getting file tree:', error);
      return [];
    }
  }

  async getFileContent(
    owner: string,
    repoName: string,
    branch: string,
    filePath: string
  ): Promise<{ content: string; size: number; encoding: string } | null> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      const commitOid = await git.resolveRef({
        fs,
        dir: repoPath,
        ref: branch,
      });

      const { blob } = await git.readBlob({
        fs,
        dir: repoPath,
        oid: commitOid,
        filepath: filePath,
      });

      const content = new TextDecoder().decode(blob);
      const size = blob.length;

      return {
        content,
        size,
        encoding: 'utf-8',
      };
    } catch (error) {
      console.error('Error getting file content:', error);
      return null;
    }
  }

  async getCommits(
    owner: string,
    repoName: string,
    branch: string = DEFAULT_BRANCH,
    depth: number = 30
  ): Promise<CommitInfo[]> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      const commits = await git.log({
        fs,
        dir: repoPath,
        ref: branch,
        depth,
      });

      return commits.map((commit) => ({
        oid: commit.oid,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          email: commit.commit.author.email,
          timestamp: commit.commit.author.timestamp,
        },
        committer: {
          name: commit.commit.committer.name,
          email: commit.commit.committer.email,
          timestamp: commit.commit.committer.timestamp,
        },
        parent: commit.commit.parent,
      }));
    } catch (error) {
      console.error('Error getting commits:', error);
      return [];
    }
  }

  async getBranches(owner: string, repoName: string): Promise<BranchInfo[]> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      const branches = await git.listBranches({ fs, dir: repoPath });
      const currentBranch = await git.currentBranch({ fs, dir: repoPath });

      const branchInfos: BranchInfo[] = [];

      for (const branch of branches) {
        try {
          const commit = await git.resolveRef({
            fs,
            dir: repoPath,
            ref: branch,
          });

          branchInfos.push({
            name: branch,
            commit,
            isDefault: branch === currentBranch,
          });
        } catch {
          // Skip branches that can't be resolved
        }
      }

      return branchInfos;
    } catch (error) {
      console.error('Error getting branches:', error);
      return [];
    }
  }

  async createBranch(
    owner: string,
    repoName: string,
    branchName: string,
    startPoint?: string
  ): Promise<boolean> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      await git.branch({
        fs,
        dir: repoPath,
        ref: branchName,
        checkout: false,
        object: startPoint,
      });

      return true;
    } catch (error) {
      console.error('Error creating branch:', error);
      return false;
    }
  }

  async deleteBranch(
    owner: string,
    repoName: string,
    branchName: string
  ): Promise<boolean> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      await git.deleteBranch({
        fs,
        dir: repoPath,
        ref: branchName,
      });

      return true;
    } catch (error) {
      console.error('Error deleting branch:', error);
      return false;
    }
  }

  async writeFile(
    owner: string,
    repoName: string,
    filePath: string,
    content: string,
    message: string,
    authorName: string,
    authorEmail: string,
    branch: string = DEFAULT_BRANCH
  ): Promise<string | null> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      // Checkout the branch
      await git.checkout({
        fs,
        dir: repoPath,
        ref: branch,
      });

      // Write file
      const fullPath = path.join(repoPath, filePath);
      const dirName = path.dirname(fullPath);
      await fs.promises.mkdir(dirName, { recursive: true });
      await fs.promises.writeFile(fullPath, content, 'utf-8');

      // Stage file
      await git.add({
        fs,
        dir: repoPath,
        filepath: filePath,
      });

      // Commit
      const commitOid = await git.commit({
        fs,
        dir: repoPath,
        message,
        author: {
          name: authorName,
          email: authorEmail,
        },
      });

      return commitOid;
    } catch (error) {
      console.error('Error writing file:', error);
      return null;
    }
  }

  async deleteFile(
    owner: string,
    repoName: string,
    filePath: string,
    message: string,
    authorName: string,
    authorEmail: string,
    branch: string = DEFAULT_BRANCH
  ): Promise<string | null> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      // Checkout the branch
      await git.checkout({
        fs,
        dir: repoPath,
        ref: branch,
      });

      // Delete file
      const fullPath = path.join(repoPath, filePath);
      await fs.promises.unlink(fullPath);

      // Stage deletion
      await git.remove({
        fs,
        dir: repoPath,
        filepath: filePath,
      });

      // Commit
      const commitOid = await git.commit({
        fs,
        dir: repoPath,
        message,
        author: {
          name: authorName,
          email: authorEmail,
        },
      });

      return commitOid;
    } catch (error) {
      console.error('Error deleting file:', error);
      return null;
    }
  }

  async getCommitCount(
    owner: string,
    repoName: string,
    branch: string = DEFAULT_BRANCH
  ): Promise<number> {
    const repoPath = this.getRepoPath(owner, repoName);

    try {
      const commits = await git.log({
        fs,
        dir: repoPath,
        ref: branch,
      });

      return commits.length;
    } catch {
      return 0;
    }
  }

  async writeMultipleFiles(
    owner: string,
    repoName: string,
    files: { path: string; content: string }[],
    message: string,
    authorName: string,
    authorEmail: string,
    branch: string = DEFAULT_BRANCH
  ): Promise<string | null> {
    const repoPath = this.getRepoPath(owner, repoName);

    console.log('=== writeMultipleFiles ===');
    console.log('Repo path:', repoPath);
    console.log('Files count:', files.length);
    console.log('Branch:', branch);

    try {
      // Check if repo directory exists
      const repoExists = fs.existsSync(repoPath);
      console.log('Repo exists:', repoExists);
      if (!repoExists) {
        console.error('Repository path does not exist:', repoPath);
        return null;
      }

      // Check if branch exists by trying to resolve it
      let branchExists = false;
      try {
        await git.resolveRef({
          fs,
          dir: repoPath,
          ref: branch,
        });
        branchExists = true;
      } catch {
        // Branch doesn't exist yet (empty repo)
        branchExists = false;
        console.log('Branch does not exist yet, will create initial commit');
      }

      // If branch exists, checkout to it
      if (branchExists) {
        try {
          await git.checkout({
            fs,
            dir: repoPath,
            ref: branch,
          });
        } catch (checkoutError) {
          console.error('Checkout error:', checkoutError);
          // Continue anyway - files may already be in working directory
        }
      }

      // Write all files
      for (const file of files) {
        const fullPath = path.join(repoPath, file.path);
        const dirName = path.dirname(fullPath);
        await fs.promises.mkdir(dirName, { recursive: true });
        await fs.promises.writeFile(fullPath, file.content, 'utf-8');

        // Stage file
        await git.add({
          fs,
          dir: repoPath,
          filepath: file.path,
        });
      }

      // Commit all files together
      const commitOid = await git.commit({
        fs,
        dir: repoPath,
        message,
        author: {
          name: authorName,
          email: authorEmail,
        },
      });

      return commitOid;
    } catch (error) {
      console.error('Error writing multiple files:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }
  }

  async cloneRepository(
    sourceOwner: string,
    sourceRepo: string,
    targetOwner: string,
    targetRepo: string
  ): Promise<boolean> {
    const sourcePath = this.getRepoPath(sourceOwner, sourceRepo);
    const targetPath = this.getRepoPath(targetOwner, targetRepo);

    try {
      // Create target directory
      await fs.promises.mkdir(targetPath, { recursive: true });

      // Copy repository
      await this.copyDirectory(sourcePath, targetPath);

      return true;
    } catch (error) {
      console.error('Error cloning repository:', error);
      return false;
    }
  }

  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }
}

export const gitService = new GitService();
export default gitService;
