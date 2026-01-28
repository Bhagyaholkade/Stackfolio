import { Router } from 'express';
import {
  createRepository,
  getRepository,
  updateRepository,
  deleteRepository,
  getFileTree,
  getFileContent,
  getCommits,
  getBranches,
  starRepository,
  unstarRepository,
  forkRepository,
  searchRepositories,
  uploadFiles,
} from '../controllers/repository.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// Search (must be before :owner/:repo)
router.get('/search', optionalAuth, searchRepositories);

// Repository CRUD
router.post('/', protect, createRepository);
router.get('/:owner/:repo', optionalAuth, getRepository);
router.put('/:owner/:repo', protect, updateRepository);
router.delete('/:owner/:repo', protect, deleteRepository);

// Git operations
router.get('/:owner/:repo/tree/:branch', optionalAuth, getFileTree);
router.get('/:owner/:repo/tree/:branch/*', optionalAuth, getFileTree);
router.get('/:owner/:repo/blob/:branch/*', optionalAuth, getFileContent);
router.get('/:owner/:repo/commits/:branch', optionalAuth, getCommits);
router.get('/:owner/:repo/branches', optionalAuth, getBranches);

// Star operations
router.put('/:owner/:repo/star', protect, starRepository);
router.delete('/:owner/:repo/star', protect, unstarRepository);

// Fork operations
router.post('/:owner/:repo/fork', protect, forkRepository);

// File upload
router.post('/:owner/:repo/upload', protect, upload.array('files', 100), uploadFiles);

export default router;
