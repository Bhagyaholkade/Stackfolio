export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  company: string;
  followers: number;
  following: number;
  publicRepos?: number;
  createdAt: string;
}

export interface Repository {
  _id: string;
  name: string;
  description: string;
  owner: {
    _id: string;
    username: string;
    avatar: string;
    name?: string;
  };
  visibility: 'public' | 'private';
  defaultBranch: string;
  forkedFrom?: string;
  starCount: number;
  forkCount: number;
  watchCount: number;
  language: string;
  topics: string[];
  homepage: string;
  hasIssues: boolean;
  hasWiki: boolean;
  isArchived: boolean;
  isTemplate: boolean;
  size: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isStarred?: boolean;
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'dir';
  oid?: string;
  size?: number;
}

export interface FileContent {
  content: string;
  size: number;
  encoding: string;
}

export interface Commit {
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

export interface Branch {
  name: string;
  commit: string;
  isDefault: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}
