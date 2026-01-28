import { Request, Response } from 'express';
import User from '../models/User.js';
import Repository from '../models/Repository.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// @desc    Get user by username
// @route   GET /api/users/:username
// @access  Public
export const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get repository count
    const repoCount = await Repository.countDocuments({
      owner: user._id,
      visibility: 'public',
    });

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        website: user.website,
        company: user.company,
        followers: user.followers.length,
        following: user.following.length,
        publicRepos: repoCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:username
// @access  Private
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    // Check if user is updating their own profile
    if (req.user?.username !== username) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
      return;
    }

    const { name, bio, location, website, company } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, website, company },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        website: user.website,
        company: user.company,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
};

// @desc    Get user repositories
// @route   GET /api/users/:username/repos
// @access  Public
export const getUserRepos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;
    const { sort = 'updated', direction = 'desc', page = 1, per_page = 30 } = req.query;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Build query - show private repos only if authenticated user is the owner
    const query: Record<string, unknown> = { owner: user._id };
    if (!req.user || req.user._id.toString() !== user._id.toString()) {
      query.visibility = 'public';
    }

    // Build sort object
    const sortOptions: Record<string, 1 | -1> = {};
    const sortField = sort === 'updated' ? 'pushedAt' : sort === 'created' ? 'createdAt' : sort === 'name' ? 'name' : 'starCount';
    sortOptions[sortField as string] = direction === 'asc' ? 1 : -1;

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
    console.error('Get user repos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching repositories',
    });
  }
};

// @desc    Follow a user
// @route   PUT /api/users/:username/follow
// @access  Private
export const followUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    if (req.user?.username === username) {
      res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
      return;
    }

    const userToFollow = await User.findOne({ username });

    if (!userToFollow) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if already following
    const isFollowing = req.user?.following.includes(userToFollow._id);

    if (isFollowing) {
      res.status(400).json({
        success: false,
        message: 'Already following this user',
      });
      return;
    }

    // Add to following/followers
    await User.findByIdAndUpdate(req.user?._id, {
      $push: { following: userToFollow._id },
    });

    await User.findByIdAndUpdate(userToFollow._id, {
      $push: { followers: req.user?._id },
    });

    res.json({
      success: true,
      message: `Now following ${username}`,
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error following user',
    });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:username/follow
// @access  Private
export const unfollowUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    const userToUnfollow = await User.findOne({ username });

    if (!userToUnfollow) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Remove from following/followers
    await User.findByIdAndUpdate(req.user?._id, {
      $pull: { following: userToUnfollow._id },
    });

    await User.findByIdAndUpdate(userToUnfollow._id, {
      $pull: { followers: req.user?._id },
    });

    res.json({
      success: true,
      message: `Unfollowed ${username}`,
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unfollowing user',
    });
  }
};

// @desc    Get user's followers
// @route   GET /api/users/:username/followers
// @access  Public
export const getFollowers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;
    const { page = 1, per_page = 30 } = req.query;

    const user = await User.findOne({ username }).populate({
      path: 'followers',
      select: 'username name avatar bio',
      options: {
        skip: (Number(page) - 1) * Number(per_page),
        limit: Math.min(Number(per_page) || 30, 100),
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user.followers,
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching followers',
    });
  }
};

// @desc    Get users that user is following
// @route   GET /api/users/:username/following
// @access  Public
export const getFollowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;
    const { page = 1, per_page = 30 } = req.query;

    const user = await User.findOne({ username }).populate({
      path: 'following',
      select: 'username name avatar bio',
      options: {
        skip: (Number(page) - 1) * Number(per_page),
        limit: Math.min(Number(per_page) || 30, 100),
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user.following,
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching following',
    });
  }
};
