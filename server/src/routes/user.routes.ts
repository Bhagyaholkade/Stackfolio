import { Router } from 'express';
import {
  getUserByUsername,
  updateProfile,
  getUserRepos,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../controllers/user.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/:username', getUserByUsername);
router.get('/:username/repos', optionalAuth, getUserRepos);
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);

// Protected routes
router.put('/:username', protect, updateProfile);
router.put('/:username/follow', protect, followUser);
router.delete('/:username/follow', protect, unfollowUser);

export default router;
