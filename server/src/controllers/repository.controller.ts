import { Response } from 'express';
import fs from 'fs';
import Repository from '../models/Repository.js';
import Star from '../models/Star.js';
import Fork from '../models/Fork.js';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import gitService from '../services/git.service.js';
import { GITIGNORE_TEMPLATES, LICENSE_TEMPLATES } from '../utils/constants.js';
import { cleanupTempFiles } from '../middleware/upload.middleware.js';

// @desc    Create a new repository
// @route   POST /api/repos
// @access  Private
export const createRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      visibility = 'public',
      initReadme = false,
      gitignoreTemplate,
      license,
    } = req.body;

    // Check if repo already exists for this user
    const existingRepo = await Repository.findOne({
      owner: req.user?._id,
      name,
    });

    if (existingRepo) {
      res.status(400).json({
        success: false,
        message: 'Repository with this name already exists',
      });
      return;
    }

    // Create repository in database
    const repository = await Repository.create({
      name,
      description,
      owner: req.user?._id,
      visibility,
    });

    // Initialize git repository
    const readmeContent = initReadme
      ? `# ${name}\n\n${description || ''}`
      : undefined;
    const gitignoreContent = gitignoreTemplate
      ? GITIGNORE_TEMPLATES[gitignoreTemplate]
      : undefined;
    const licenseContent = license
      ? LICENSE_TEMPLATES[license]?.replace('[year]', new Date().getFullYear().toString())
          .replace('[fullname]', req.user?.name || req.user?.username || '')
      : undefined;

    await gitService.initRepository(
      req.user!.username,
      name,
      'main',
      readmeContent,
      gitignoreContent,
      licenseContent
    );

    // Populate owner info
    await repository.populate('owner', 'username avatar');

    res.status(201).json({
      success: true,
      data: repository,
    });
  } catch (error) {
    console.error('Create repository error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating repository',
    });
  }
};

// @desc    Get repository by owner and name
// @route   GET /api/repos/:owner/:repo
// @access  Public (private repos require auth)
export const getRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo } = req.params;

    const user = await User.findOne({ username: owner });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const repository = await Repository.findOne({
      owner: user._id,
      name: repo,
    }).populate('owner', 'username avatar name');

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    // Check visibility
    if (repository.visibility === 'private') {
      if (!req.user || req.user._id.toString() !== user._id.toString()) {
        res.status(404).json({
          success: false,
          message: 'Repository not found',
        });
        return;
      }
    }

    // Check if user has starred this repo
    let isStarred = false;
    if (req.user) {
      const star = await Star.findOne({
        user: req.user._id,
        repository: repository._id,
      });
      isStarred = !!star;
    }

    res.json({
      success: true,
      data: {
        ...repository.toObject(),
        isStarred,
      },
    });
  } catch (error) {
    console.error('Get repository error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching repository',
    });
  }
};

// @desc    Update repository
// @route   PUT /api/repos/:owner/:repo
// @access  Private (owner only)
export const updateRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo } = req.params;
    const { description, visibility, homepage, hasIssues, hasWiki, topics, isArchived } = req.body;

    const user = await User.findOne({ username: owner });
    if (!user || user._id.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this repository',
      });
      return;
    }

    const repository = await Repository.findOneAndUpdate(
      { owner: user._id, name: repo },
      { description, visibility, homepage, hasIssues, hasWiki, topics, isArchived },
      { new: true, runValidators: true }
    ).populate('owner', 'username avatar');

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    res.json({
      success: true,
      data: repository,
    });
  } catch (error) {
    console.error('Update repository error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating repository',
    });
  }
};

// @desc    Delete repository
// @route   DELETE /api/repos/:owner/:repo
// @access  Private (owner only)
export const deleteRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo } = req.params;

    const user = await User.findOne({ username: owner });
    if (!user || user._id.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this repository',
      });
      return;
    }

    const repository = await Repository.findOneAndDelete({
      owner: user._id,
      name: repo,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    // Delete git repository
    await gitService.deleteRepository(owner, repo);

    // Delete related stars and forks
    await Star.deleteMany({ repository: repository._id });
    await Fork.deleteMany({
      $or: [
        { sourceRepository: repository._id },
        { forkedRepository: repository._id },
      ],
    });

    res.json({
      success: true,
      message: 'Repository deleted successfully',
    });
  } catch (error) {
    console.error('Delete repository error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting repository',
    });
  }
};

// @desc    Get repository file tree
// @route   GET /api/repos/:owner/:repo/tree/:branch/*
// @access  Public (private repos require auth)
export const getFileTree = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo, branch } = req.params;
    const filePath = req.params[0] || '';

    const user = await User.findOne({ username: owner });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const repository = await Repository.findOne({
      owner: user._id,
      name: repo,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    // Check visibility
    if (repository.visibility === 'private') {
      if (!req.user || req.user._id.toString() !== user._id.toString()) {
        res.status(404).json({
          success: false,
          message: 'Repository not found',
        });
        return;
      }
    }

    const tree = await gitService.getFileTree(owner, repo, branch, filePath);

    res.json({
      success: true,
      data: tree,
    });
  } catch (error) {
    console.error('Get file tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching file tree',
    });
  }
};

// @desc    Get file content
// @route   GET /api/repos/:owner/:repo/blob/:branch/*
// @access  Public (private repos require auth)
export const getFileContent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo, branch } = req.params;
    const filePath = req.params[0] || '';

    const user = await User.findOne({ username: owner });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const repository = await Repository.findOne({
      owner: user._id,
      name: repo,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    // Check visibility
    if (repository.visibility === 'private') {
      if (!req.user || req.user._id.toString() !== user._id.toString()) {
        res.status(404).json({
          success: false,
          message: 'Repository not found',
        });
        return;
      }
    }

    const content = await gitService.getFileContent(owner, repo, branch, filePath);

    if (!content) {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
      return;
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Get file content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching file content',
    });
  }
};

// @desc    Get repository commits
// @route   GET /api/repos/:owner/:repo/commits/:branch
// @access  Public (private repos require auth)
export const getCommits = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo, branch } = req.params;
    const { per_page = 30 } = req.query;

    const user = await User.findOne({ username: owner });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const repository = await Repository.findOne({
      owner: user._id,
      name: repo,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    // Check visibility
    if (repository.visibility === 'private') {
      if (!req.user || req.user._id.toString() !== user._id.toString()) {
        res.status(404).json({
          success: false,
          message: 'Repository not found',
        });
        return;
      }
    }

    const commits = await gitService.getCommits(
      owner,
      repo,
      branch,
      Number(per_page)
    );

    res.json({
      success: true,
      data: commits,
    });
  } catch (error) {
    console.error('Get commits error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching commits',
    });
  }
};

// @desc    Get repository branches
// @route   GET /api/repos/:owner/:repo/branches
// @access  Public (private repos require auth)
export const getBranches = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo } = req.params;

    const user = await User.findOne({ username: owner });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const repository = await Repository.findOne({
      owner: user._id,
      name: repo,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    // Check visibility
    if (repository.visibility === 'private') {
      if (!req.user || req.user._id.toString() !== user._id.toString()) {
        res.status(404).json({
          success: false,
          message: 'Repository not found',
        });
        return;
      }
    }

    const branches = await gitService.getBranches(owner, repo);

    res.json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching branches',
    });
  }
};

// @desc    Star a repository
// @route   PUT /api/repos/:owner/:repo/star
// @access  Private
export const starRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo } = req.params;

    const user = await User.findOne({ username: owner });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const repository = await Repository.findOne({
      owner: user._id,
      name: repo,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    // Check if already starred
    const existingStar = await Star.findOne({
      user: req.user?._id,
      repository: repository._id,
    });

    if (existingStar) {
      res.status(400).json({
        success: false,
        message: 'Repository already starred',
      });
      return;
    }

    // Create star
    await Star.create({
      user: req.user?._id,
      repository: repository._id,
    });

    // Increment star count
    await Repository.findByIdAndUpdate(repository._id, {
      $inc: { starCount: 1 },
    });

    res.json({
      success: true,
      message: 'Repository starred',
    });
  } catch (error) {
    console.error('Star repository error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starring repository',
    });
  }
};

// @desc    Unstar a repository
// @route   DELETE /api/repos/:owner/:repo/star
// @access  Private
export const unstarRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo } = req.params;

    const user = await User.findOne({ username: owner });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const repository = await Repository.findOne({
      owner: user._id,
      name: repo,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    // Delete star
    const star = await Star.findOneAndDelete({
      user: req.user?._id,
      repository: repository._id,
    });

    if (!star) {
      res.status(400).json({
        success: false,
        message: 'Repository not starred',
      });
      return;
    }

    // Decrement star count
    await Repository.findByIdAndUpdate(repository._id, {
      $inc: { starCount: -1 },
    });

    res.json({
      success: true,
      message: 'Repository unstarred',
    });
  } catch (error) {
    console.error('Unstar repository error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unstarring repository',
    });
  }
};

// @desc    Fork a repository
// @route   POST /api/repos/:owner/:repo/fork
// @access  Private
export const forkRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { owner, repo } = req.params;
    const { name: newName } = req.body;

    const sourceUser = await User.findOne({ username: owner });
    if (!sourceUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const sourceRepo = await Repository.findOne({
      owner: sourceUser._id,
      name: repo,
    });

    if (!sourceRepo) {
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    const targetName = newName || repo;

    // Check if user already has a repo with this name
    const existingRepo = await Repository.findOne({
      owner: req.user?._id,
      name: targetName,
    });

    if (existingRepo) {
      res.status(400).json({
        success: false,
        message: 'You already have a repository with this name',
      });
      return;
    }

    // Clone git repository
    const success = await gitService.cloneRepository(
      owner,
      repo,
      req.user!.username,
      targetName
    );

    if (!success) {
      res.status(500).json({
        success: false,
        message: 'Error cloning repository',
      });
      return;
    }

    // Create forked repository in database
    const forkedRepo = await Repository.create({
      name: targetName,
      description: sourceRepo.description,
      owner: req.user?._id,
      visibility: 'public',
      forkedFrom: sourceRepo._id,
      defaultBranch: sourceRepo.defaultBranch,
    });

    // Create fork record
    await Fork.create({
      user: req.user?._id,
      sourceRepository: sourceRepo._id,
      forkedRepository: forkedRepo._id,
    });

    // Increment fork count on source
    await Repository.findByIdAndUpdate(sourceRepo._id, {
      $inc: { forkCount: 1 },
    });

    await forkedRepo.populate('owner', 'username avatar');

    res.status(201).json({
      success: true,
      data: forkedRepo,
    });
  } catch (error) {
    console.error('Fork repository error:', error);
    res.status(500).json({
      success: false,
      message: 'Error forking repository',
    });
  }
};

// @desc    Search repositories
// @route   GET /api/repos/search
// @access  Public
export const searchRepositories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      q,
      sort = 'stars',
      order = 'desc',
      page = 1,
      per_page = 30,
    } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    // Use regex search instead of text search for MongoDB Atlas compatibility
    const searchRegex = new RegExp(q as string, 'i');
    const query: Record<string, unknown> = {
      visibility: 'public',
      $or: [
        { name: searchRegex },
        { description: searchRegex },
      ],
    };

    const sortOptions: Record<string, 1 | -1> = {};
    const sortField =
      sort === 'stars'
        ? 'starCount'
        : sort === 'forks'
        ? 'forkCount'
        : sort === 'updated'
        ? 'pushedAt'
        : 'starCount';
    sortOptions[sortField] = order === 'asc' ? 1 : -1;

    const limit = Math.min(Number(per_page) || 30, 100);
    const skip = (Number(page) - 1) * limit;

    const [repos, total] = await Promise.all([
      Repository.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('owner', 'username avatar'),
      Repository.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: repos,
      pagination: {
        page: Number(page),
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search repositories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching repositories',
    });
  }
};

// @desc    Upload files to repository
// @route   POST /api/repos/:owner/:repo/upload
// @access  Private (owner only)
export const uploadFiles = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const files = req.files as Express.Multer.File[];

  try {
    const { owner, repo } = req.params;
    const { branch = 'main', message = 'Upload files via web interface' } = req.body;

    // Parse file paths from the request body (sent as JSON string)
    let filePaths: string[] = [];
    if (req.body.filePaths) {
      try {
        filePaths = JSON.parse(req.body.filePaths);
      } catch {
        // If parsing fails, use empty array (will use original filenames)
      }
    }

    const user = await User.findOne({ username: owner });
    if (!user || user._id.toString() !== req.user?._id.toString()) {
      cleanupTempFiles(files);
      res.status(403).json({
        success: false,
        message: 'Not authorized to upload to this repository',
      });
      return;
    }

    const repository = await Repository.findOne({
      owner: user._id,
      name: repo,
    });

    if (!repository) {
      cleanupTempFiles(files);
      res.status(404).json({
        success: false,
        message: 'Repository not found',
      });
      return;
    }

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
      return;
    }

    // Read all files and prepare for upload
    const filesToWrite: { path: string; content: string }[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Use provided path or fall back to original filename
      const targetPath = filePaths[i] || file.originalname;

      // Normalize path separators (Windows uses backslashes)
      const normalizedPath = targetPath.replace(/\\/g, '/');

      // Skip .git folder files and other unwanted files (server-side check)
      const skipPatterns = [
        /^\.git\//,
        /\/\.git\//,
        /^node_modules\//,
        /\/node_modules\//,
        /\.DS_Store$/,
        /Thumbs\.db$/,
      ];

      if (skipPatterns.some(pattern => pattern.test(normalizedPath))) {
        console.log(`Skipping file: ${normalizedPath}`);
        continue;
      }

      try {
        // Read file content as buffer first
        const buffer = await fs.promises.readFile(file.path);

        // Check if file is binary by looking for null bytes
        const isBinary = buffer.includes(0);

        if (isBinary) {
          // Skip binary files for now (git objects, images, etc.)
          errors.push(`Skipped binary file: ${normalizedPath}`);
          continue;
        }

        // Convert to string
        const content = buffer.toString('utf-8');
        filesToWrite.push({ path: normalizedPath, content });
      } catch (err) {
        errors.push(`Error reading ${normalizedPath}: ${(err as Error).message}`);
      }
    }

    // Cleanup temp files early
    cleanupTempFiles(files);

    if (filesToWrite.length === 0) {
      res.status(500).json({
        success: false,
        message: 'Failed to read any files',
        errors,
      });
      return;
    }

    console.log(`Preparing to write ${filesToWrite.length} files to ${owner}/${repo}`);
    console.log('Files to write:', filesToWrite.map(f => f.path));

    // Write all files in a single commit
    const commitOid = await gitService.writeMultipleFiles(
      owner,
      repo,
      filesToWrite,
      message || `Upload ${filesToWrite.length} file(s) via web interface`,
      req.user!.name || req.user!.username,
      req.user!.email,
      branch
    );

    console.log('Commit result:', commitOid);

    if (!commitOid) {
      res.status(500).json({
        success: false,
        message: 'Failed to commit files to repository',
        errors,
      });
      return;
    }

    // Update repository pushedAt
    await Repository.findByIdAndUpdate(repository._id, {
      pushedAt: new Date(),
    });

    const uploadedFiles = filesToWrite.map((f) => f.path);

    res.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      data: {
        uploadedFiles,
        commitOid,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Upload files error:', error);
    console.error('Error stack:', (error as Error).stack);
    // Cleanup temp files on error
    if (files) {
      cleanupTempFiles(files);
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: (error as Error).message,
    });
  }
};
